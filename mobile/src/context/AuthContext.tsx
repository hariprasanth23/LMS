import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { secureStore, STORAGE_KEYS } from '@/lib/storage'
import { apiPost } from '@/lib/api'
import { LoginResponse, PortalKey, Role, User } from '@/types'

type AuthState = {
  user: User | null
  portal: PortalKey | null
  loading: boolean
  login: (identifier: string, password: string, portal: PortalKey) => Promise<User>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

// Map an auth role to the portal home the app should land on.
function homeForRole(role: Role): string {
  switch (role) {
    case 'STUDENT': return '/(student)/home'
    case 'FACULTY':
    case 'STAFF':   return '/(faculty)/home'
    case 'PARENT':  return '/(parent)/home'
    default:        return '/(student)/home' // ADMIN/ALUMNI fall back here in mobile
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [portal, setPortal] = useState<PortalKey | null>(null)
  const [loading, setLoading] = useState(true)

  // Hydrate persisted session on cold start.
  useEffect(() => {
    void (async () => {
      try {
        const [rawUser, rawPortal, token] = await Promise.all([
          secureStore.get(STORAGE_KEYS.USER),
          secureStore.get(STORAGE_KEYS.PORTAL),
          secureStore.get(STORAGE_KEYS.ACCESS_TOKEN),
        ])
        if (rawUser && token) {
          setUser(JSON.parse(rawUser) as User)
          if (rawPortal) setPortal(rawPortal as PortalKey)
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const login = useCallback<AuthState['login']>(async (identifier, password, p) => {
    const data = await apiPost<LoginResponse>('/auth/login', { identifier, password })
    if (!data?.user || !data.accessToken) {
      throw new Error('Login response missing token or user')
    }
    await Promise.all([
      secureStore.set(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken),
      secureStore.set(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken),
      secureStore.set(STORAGE_KEYS.USER, JSON.stringify(data.user)),
      secureStore.set(STORAGE_KEYS.PORTAL, p),
    ])
    setUser(data.user)
    setPortal(p)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    await Promise.all([
      secureStore.remove(STORAGE_KEYS.ACCESS_TOKEN),
      secureStore.remove(STORAGE_KEYS.REFRESH_TOKEN),
      secureStore.remove(STORAGE_KEYS.USER),
      secureStore.remove(STORAGE_KEYS.PORTAL),
    ])
    setUser(null)
    setPortal(null)
    router.replace('/(auth)/portal')
  }, [router])

  const refreshUser = useCallback(async () => {
    try {
      const fresh = await apiPost<User>('/auth/me')
      setUser(fresh)
      await secureStore.set(STORAGE_KEYS.USER, JSON.stringify(fresh))
    } catch {
      // ignore — interceptor will logout on real auth failure
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, portal, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export { homeForRole }
