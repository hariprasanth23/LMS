import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [portalType, setPortalType] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const inactivityTimerRef = useRef(null)

  // On mount: verify the httpOnly cookie is still valid via /auth/me.
  // Only non-sensitive user info (name, role) lives in localStorage.
  useEffect(() => {
    const storedUser   = localStorage.getItem('college_user')
    const storedPortal = localStorage.getItem('college_portal')

    if (!storedUser) {
      setLoading(false)
      return
    }

    api.get('/auth/me')
      .then(() => {
        try { setUser(JSON.parse(storedUser)) } catch { /* ignore bad JSON */ }
        if (storedPortal) setPortalType(storedPortal)
      })
      .catch(() => {
        // Cookie expired or revoked — clear stale local state
        localStorage.removeItem('college_user')
        localStorage.removeItem('college_portal')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (identifier, password, portal) => {
    const response = await api.post('/auth/login', { identifier, password })
    // Backend sets the httpOnly jwt_token cookie via Set-Cookie header.
    // We only store non-sensitive user info locally.
    const { userId, name, email, role } = response.data.data
    const userData = { userId, name, email, role }

    localStorage.setItem('college_user', JSON.stringify(userData))
    if (portal) {
      localStorage.setItem('college_portal', portal)
      setPortalType(portal)
    }
    setUser(userData)
    return userData
  }

  const logout = useCallback(async (showExpiredMessage = false) => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }
    // Ask backend to clear the httpOnly cookie
    try { await api.post('/auth/logout') } catch { /* ignore */ }

    localStorage.removeItem('college_user')
    localStorage.removeItem('college_portal')
    setUser(null)
    setPortalType(null)
    if (showExpiredMessage) {
      toast.error('Session expired due to inactivity. Please log in again.')
    }
    navigate('/auth/login')
  }, [navigate])

  // Inactivity tracking — only runs while authenticated
  useEffect(() => {
    if (!user) {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
        inactivityTimerRef.current = null
      }
      return
    }

    const resetTimer = () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = setTimeout(() => logout(true), INACTIVITY_TIMEOUT_MS)
    }

    resetTimer()
    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, resetTimer, { passive: true }))

    return () => {
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, resetTimer))
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
        inactivityTimerRef.current = null
      }
    }
  }, [user, logout])

  const value = {
    user,
    portalType,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
