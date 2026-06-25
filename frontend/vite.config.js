import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local-dev proxy: most /api traffic goes through the gateway (8080), but
// /api/auth/* temporarily bypasses to auth-service:8081 directly because the
// gateway has a routing bug where POST bodies arrive empty downstream
// (every login/register 400s with "must not be blank"). Remove the auth
// override once the gateway issue is resolved.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/auth': 'http://localhost:8081',
      '/api': 'http://localhost:8080'
    }
  }
})
