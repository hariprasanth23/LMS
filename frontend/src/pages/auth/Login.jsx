import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  MdSchool,
  MdBadge,
  MdPeople,
  MdStar,
  MdVisibility,
  MdVisibilityOff
} from 'react-icons/md'

const DEMO_CREDENTIALS_MAP = {
  student: { identifier: 'student@demo.com', password: 'Demo@123' },
  staff: { identifier: 'staff@demo.com', password: 'Demo@123' },
  parent: { identifier: 'parent@demo.com', password: 'Demo@123' },
  alumni: { identifier: 'alumni@demo.com', password: 'Demo@123' }
}

const PORTALS = [
  {
    key: 'student',
    label: 'Student',
    description: 'Access academics, exams & finance',
    color: '#3b82f6',
    icon: MdSchool
  },
  {
    key: 'staff',
    label: 'Staff',
    description: 'Manage courses, attendance & payroll',
    color: '#8b5cf6',
    icon: MdBadge
  },
  {
    key: 'parent',
    label: 'Parent',
    description: "Track your ward's progress",
    color: '#f59e0b',
    icon: MdPeople
  },
  {
    key: 'alumni',
    label: 'Alumni',
    description: 'Connect with your alma mater',
    color: '#14b8a6',
    icon: MdStar
  }
]

const IDENTIFIER_LABELS = {
  student: 'Roll Number / Email',
  staff: 'Employee ID / Email',
  parent: 'Phone / Email',
  alumni: 'Alumni ID / Email'
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedPortal, setSelectedPortal] = useState(null)
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [demoActive, setDemoActive] = useState(false)

  useEffect(() => {
    const portalParam = searchParams.get('portal')
    const demoParam = searchParams.get('demo')
    const validPortals = PORTALS.map((p) => p.key)
    if (portalParam && validPortals.includes(portalParam)) {
      setSelectedPortal(portalParam)
      if (demoParam === 'true' && DEMO_CREDENTIALS_MAP[portalParam]) {
        const creds = DEMO_CREDENTIALS_MAP[portalParam]
        setForm({ identifier: creds.identifier, password: creds.password })
        setDemoActive(true)
      }
    }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setDemoActive(false)
  }

  const handlePortalSelect = (key) => {
    setSelectedPortal(key)
    setForm({ identifier: '', password: '' })
    setDemoActive(false)
  }

  const activePortal = PORTALS.find((p) => p.key === selectedPortal)
  const activeColor = activePortal ? activePortal.color : '#6366f1'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPortal) {
      toast.error('Please select a portal type')
      return
    }
    if (!form.identifier || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await login(form.identifier, form.password, selectedPortal)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#1e293b',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fff',
    transition: 'border-color 0.2s'
  }

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '40px',
        width: '100%',
        maxWidth: 480,
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56,
            height: 56,
            background: '#6366f1',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px'
          }}>
            <MdSchool style={{ color: '#fff', fontSize: 30 }} />
          </div>
          <h1 style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            color: '#1e293b',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            College ERP
          </h1>
          <p style={{
            margin: '4px 0 0',
            fontSize: 13,
            color: '#64748b',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Student Management System
          </p>
        </div>

        {/* Portal Selector */}
        <div style={{ marginBottom: selectedPortal ? 28 : 0 }}>
          <p style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#374151',
            marginBottom: 12,
            marginTop: 0
          }}>
            Select your portal
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10
          }}>
            {PORTALS.map(({ key, label, description, color, icon: Icon }) => {
              const isSelected = selectedPortal === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handlePortalSelect(key)}
                  style={{
                    background: isSelected
                      ? `${color}12`
                      : '#f8fafc',
                    border: isSelected
                      ? `2px solid ${color}`
                      : '2px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '14px 12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.18s',
                    outline: 'none'
                  }}
                >
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: isSelected ? color : `${color}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px'
                  }}>
                    <Icon style={{
                      fontSize: 20,
                      color: isSelected ? '#fff' : color
                    }} />
                  </div>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: isSelected ? color : '#1e293b',
                    marginBottom: 2,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    {label}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: '#64748b',
                    lineHeight: 1.4,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    {description}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Login Form — shown only after portal selection */}
        {selectedPortal && (
          <div style={{
            animation: 'fadeIn 0.25s ease'
          }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            <div style={{
              height: 1,
              background: '#e2e8f0',
              margin: '0 0 24px'
            }} />

            {demoActive && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: '#166534',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                <span style={{ fontSize: 16 }}>✅</span>
                Demo credentials pre-filled. Click Sign In to explore.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>
                  {IDENTIFIER_LABELS[selectedPortal]}
                </label>
                <input
                  type="text"
                  name="identifier"
                  value={form.identifier}
                  onChange={handleChange}
                  placeholder={`Enter ${IDENTIFIER_LABELS[selectedPortal].toLowerCase()}`}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = activeColor)}
                  onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    style={{ ...inputStyle, paddingRight: 42 }}
                    onFocus={(e) => (e.target.style.borderColor = activeColor)}
                    onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                  >
                    {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right', marginBottom: 22 }}>
                <span
                  style={{
                    fontSize: 12,
                    color: activeColor,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  Forgot Password?
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: loading ? `${activeColor}99` : activeColor,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                {loading ? 'Signing in...' : `Sign In as ${activePortal?.label}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
