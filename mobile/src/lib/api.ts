import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import Constants from 'expo-constants'
import { secureStore, STORAGE_KEYS } from './storage'
import { ApiResponse } from '@/types'

const baseURL: string =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? 'http://localhost:8080/api'

let refreshPromise: Promise<string | null> | null = null

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request: attach bearer token (no cookie jar on mobile) ──────────────────
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await secureStore.get(STORAGE_KEYS.ACCESS_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response: unwrap Spring Page envelope + refresh on 401 ──────────────────
api.interceptors.response.use(
  (response) => {
    const body = response.data
    const inner = body?.data
    if (inner && typeof inner === 'object' && Array.isArray(inner.content) && 'pageable' in inner) {
      const { content, ...rest } = inner
      response.data = { ...body, data: content, pageMeta: rest }
    }
    return response
  },
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined
    if (!original) return Promise.reject(error)

    const url = original.url ?? ''
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh')

    if (error.response?.status === 401 && !original._retried && !isAuthEndpoint) {
      original._retried = true
      const newToken = await refreshAccessToken()
      if (newToken) {
        original.headers!.Authorization = `Bearer ${newToken}`
        return api(original)
      }
      // refresh failed → caller decides (AuthContext logs the user out)
    }
    return Promise.reject(error)
  }
)

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await secureStore.get(STORAGE_KEYS.REFRESH_TOKEN)
      if (!refreshToken) return null
      try {
        const res = await axios.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
          `${baseURL}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
        )
        const next = res.data?.data
        if (!next?.accessToken) return null
        await secureStore.set(STORAGE_KEYS.ACCESS_TOKEN, next.accessToken)
        if (next.refreshToken) {
          await secureStore.set(STORAGE_KEYS.REFRESH_TOKEN, next.refreshToken)
        }
        return next.accessToken
      } catch {
        return null
      } finally {
        refreshPromise = null
      }
    })()
  }
  return refreshPromise
}

// Convenience: unwrap to T given ApiResponse<T>
export async function apiGet<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const res = await api.get<ApiResponse<T>>(path, { params })
  return res.data.data
}

export async function apiPost<T, Body = unknown>(path: string, body?: Body): Promise<T> {
  const res = await api.post<ApiResponse<T>>(path, body)
  return res.data.data
}

export async function apiPut<T, Body = unknown>(path: string, body?: Body): Promise<T> {
  const res = await api.put<ApiResponse<T>>(path, body)
  return res.data.data
}

export async function apiDelete<T = void>(path: string): Promise<T> {
  const res = await api.delete<ApiResponse<T>>(path)
  return res.data.data
}
