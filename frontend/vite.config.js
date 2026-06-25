import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Local dev: the Spring Cloud Gateway (8080) has a routing bug — every
 * /api/** path returns 404 "No static resource". We bypass it entirely by
 * proxying each route group straight to the owning microservice, and we
 * mimic the gateway's identity injection by decoding the JWT cookie and
 * forwarding X-User-Id / X-User-Role headers.
 *
 * All downstream services have INTERNAL_ENFORCE=false in compose so they
 * accept requests without the HMAC signature the gateway would normally add.
 */

// Decode the unverified JWT payload (dev only — never do this in prod).
function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4)
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))
  } catch {
    return null
  }
}

function injectIdentityFromCookie(proxyReq, req) {
  const cookie = req.headers.cookie || ''
  const match = cookie.match(/lms_token=([^;]+)/)
  if (!match) return
  const claims = decodeJwt(match[1])
  if (!claims) return
  if (claims.sub)  proxyReq.setHeader('X-User-Id',   claims.sub)
  if (claims.role) proxyReq.setHeader('X-User-Role', claims.role)
  if (claims.name) proxyReq.setHeader('X-User-Name', claims.name)
}

function serviceProxy(target) {
  return {
    target,
    changeOrigin: true,
    configure: (proxy) => {
      proxy.on('proxyReq', injectIdentityFromCookie)
    },
  }
}

// Route prefix → service port. Order matters: longer prefixes first.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/auth':          serviceProxy('http://localhost:8081'),
      '/api/students':      serviceProxy('http://localhost:8082'),
      '/api/employees':     serviceProxy('http://localhost:8082'),
      '/api/departments':   serviceProxy('http://localhost:8082'),
      '/api/courses':       serviceProxy('http://localhost:8083'),
      '/api/assignments':   serviceProxy('http://localhost:8083'),
      '/api/quizzes':       serviceProxy('http://localhost:8083'),
      '/api/announcements': serviceProxy('http://localhost:8083'),
      '/api/enrollments':   serviceProxy('http://localhost:8083'),
      '/api/examination':   serviceProxy('http://localhost:8084'),
      '/api/attendance':    serviceProxy('http://localhost:8085'),
      '/api/finance':       serviceProxy('http://localhost:8086'),
      '/api/leaves':        serviceProxy('http://localhost:8087'),
      '/api/payroll':       serviceProxy('http://localhost:8087'),
      '/api/notifications': serviceProxy('http://localhost:8088'),
      '/api/academics':     serviceProxy('http://localhost:8089'),
      '/api/feedback':      serviceProxy('http://localhost:8090'),
      '/api/research':      serviceProxy('http://localhost:8091'),
      '/api/services':      serviceProxy('http://localhost:8092'),
      // Anything else still falls through to the gateway.
      '/api':               serviceProxy('http://localhost:8080'),
    },
  },
})
