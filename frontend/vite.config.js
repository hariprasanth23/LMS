import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Local-dev API proxy.
 *
 * All /api/* traffic goes through the api-gateway on :8080 — same as
 * production. The gateway validates the lms_token cookie, injects
 * X-User-Id / X-User-Role headers, and proxies to the right service.
 *
 * (Earlier in this project we'd split this into per-service routes as a
 * workaround for what looked like a Spring Cloud Gateway bug. It turned
 * out a stale Java process from a sibling "Project 2" was binding host
 * port 8080 and intercepting requests before they reached Docker. If you
 * ever see /api/* return 404 "No static resource …", check `lsof -i :8080`
 * for a non-Docker process and kill it.)
 */
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
