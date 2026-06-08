import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,   // send httpOnly jwt_token cookie on every request
})

// No Authorization header injection — the httpOnly cookie handles auth automatically.
// The response interceptor still catches 401s (expired/missing cookie) and redirects.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('college_user')
      localStorage.removeItem('college_portal')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default api
