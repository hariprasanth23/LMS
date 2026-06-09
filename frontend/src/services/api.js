import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,  // send httpOnly jwt_token cookie on every request
})

// Track if a refresh is already in flight to avoid parallel refresh storms
let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Only attempt refresh once per request, and only for 401s on non-auth endpoints
    if (
      error.response?.status === 401 &&
      !original._refreshAttempted &&
      !original.url?.includes('/auth/refresh') &&
      !original.url?.includes('/auth/login')
    ) {
      original._refreshAttempted = true

      const storedToken = localStorage.getItem('college_refresh_token')
      if (storedToken) {
        try {
          if (!refreshPromise) {
            refreshPromise = axios.post(
              '/api/auth/refresh',
              { refreshToken: storedToken },
              { withCredentials: true }
            ).finally(() => { refreshPromise = null })
          }

          const { data } = await refreshPromise
          // Backend rotated the refresh token — persist the new one
          if (data?.data?.refreshToken) {
            localStorage.setItem('college_refresh_token', data.data.refreshToken)
          }
          // httpOnly cookie was updated server-side via Set-Cookie; retry original request
          return api(original)
        } catch {
          // Refresh failed — session truly expired
        }
      }

      // Clear session and redirect to login
      localStorage.removeItem('college_user')
      localStorage.removeItem('college_portal')
      localStorage.removeItem('college_refresh_token')
      window.location.href = '/auth/login'
    }

    return Promise.reject(error)
  }
)

export default api
