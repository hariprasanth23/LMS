import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

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

  const logout = () => {
    localStorage.removeItem('college_token')
    localStorage.removeItem('college_user')
    localStorage.removeItem('college_portal')
    setToken(null)
    setUser(null)
    setPortalType(null)
    navigate('/login')
  }

  const value = { user, token, portalType, login, logout, loading, isAuthenticated: !!token }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
