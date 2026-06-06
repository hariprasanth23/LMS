import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

// Easy to change: duration of inactivity before auto-logout (15 minutes)
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000

// Activity events that reset the inactivity timer
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

function parseJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(window.atob(base64))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [portalType, setPortalType] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Use a ref for the timer so resets don't cause re-renders
  const inactivityTimerRef = useRef(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('college_token')
    const storedUser = localStorage.getItem('college_user')
    const storedPortal = localStorage.getItem('college_portal')
    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('college_user')
      }
    }
    if (storedPortal) {
      setPortalType(storedPortal)
    }
    setLoading(false)
  }, [])

  const login = async (identifier, password, portal) => {
    const response = await api.post('/auth/login', {
      identifier,
      password
    })
    const { token: newToken, refreshToken, userId, name, email, role } = response.data.data
    const userData = { userId, name, email, role }

    // SECURITY NOTE: Tokens are stored in localStorage, which is accessible to any
    // JavaScript running on the page and therefore vulnerable to XSS attacks.
    // To fully harden this, migrate to httpOnly cookies (requires backend to set/clear
    // the cookie via Set-Cookie header) and add SameSite=Strict CSRF protection at that point.
    localStorage.setItem('college_token', newToken)
    localStorage.setItem('college_user', JSON.stringify(userData))
    if (portal) {
      localStorage.setItem('college_portal', portal)
      setPortalType(portal)
    }
    setToken(newToken)
    setUser(userData)
    return userData
  }

  const logout = useCallback((showExpiredMessage = false) => {
    // Clear inactivity timer first to prevent double-firing
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }
    localStorage.removeItem('college_token')
    localStorage.removeItem('college_user')
    localStorage.removeItem('college_portal')
    setToken(null)
    setUser(null)
    setPortalType(null)
    if (showExpiredMessage) {
      toast.error('Session expired due to inactivity. Please log in again.')
    }
    navigate('/auth/login')
  }, [navigate])

  // Inactivity tracking: only active while user is authenticated
  useEffect(() => {
    if (!token) {
      // Not authenticated — clear any lingering timer and do nothing
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
        inactivityTimerRef.current = null
      }
      return
    }

    const resetTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
      inactivityTimerRef.current = setTimeout(() => {
        logout(true)
      }, INACTIVITY_TIMEOUT_MS)
    }

    // Start the timer immediately when authenticated
    resetTimer()

    // Attach activity listeners
    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true })
    })

    // Cleanup: remove listeners and clear timer on logout or unmount
    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, resetTimer)
      })
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
        inactivityTimerRef.current = null
      }
    }
  }, [token, logout])

  const value = { user, token, portalType, login, logout, loading, isAuthenticated: !!token }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
