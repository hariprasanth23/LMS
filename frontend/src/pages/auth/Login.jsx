import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  MdSchool,
  MdBadge,
  MdPeople,
  MdStar,
  MdAdminPanelSettings,
  MdVisibility,
  MdVisibilityOff
} from 'react-icons/md'

// Mobile breakpoint hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

const PORTALS = [
  { key: 'admin',   label: 'Admin',   color: '#dc2626', icon: MdAdminPanelSettings, description: 'System administration', idLabel: 'Admin ID / Email' },
  { key: 'student', label: 'Student', color: '#3b82f6', icon: MdSchool,             description: 'Academic portal',        idLabel: 'Roll Number / Email' },
  { key: 'staff',   label: 'Staff',   color: '#8b5cf6', icon: MdBadge,              description: 'Faculty & staff',        idLabel: 'Employee ID / Email' },
  { key: 'parent',  label: 'Parent',  color: '#f59e0b', icon: MdPeople,             description: "Ward's progress",        idLabel: 'Phone / Email' },
  { key: 'alumni',  label: 'Alumni',  color: '#14b8a6', icon: MdStar,               description: 'Alumni network',         idLabel: 'Alumni ID / Email' },
]

const DEMO_CREDS = {
  admin:   { identifier: 'admin@demo.com',   password: 'Demo@123' },
  student: { identifier: 'student@demo.com', password: 'Demo@123' },
  staff:   { identifier: 'staff@demo.com',   password: 'Demo@123' },
  parent:  { identifier: 'parent@demo.com',  password: 'Demo@123' },
  alumni:  { identifier: 'alumni@demo.com',  password: 'Demo@123' },
}

const FEATURES = [
  'Complete Academic Management',
  'Real-time Exam & Grade Tracking',
  'Online Fee Payment & Receipts',
  'Research & Project Portal',
  '24/7 Feedback System',
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isMobile = useIsMobile()
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
      if (demoParam === 'true' && DEMO_CREDS[portalParam]) {
        const creds = DEMO_CREDS[portalParam]
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
    setShowPassword(false)
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

  const ff = 'system-ui, -apple-system, sans-serif'

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: ff,
    color: '#1e293b',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fff',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
    fontFamily: ff,
  }

  // Portal grid layout:
  // Row 1: Admin (full width)
  // Row 2: Student | Staff
  // Row 3: Parent  | Alumni
  const adminPortal = PORTALS.find((p) => p.key === 'admin')
  const row2 = PORTALS.filter((p) => p.key === 'student' || p.key === 'staff')
  const row3 = PORTALS.filter((p) => p.key === 'parent' || p.key === 'alumni')

  const renderDemoCard = (portal) => {
    const { key, label, color, icon: Icon } = portal
    return (
      <button
        key={key}
        type="button"
        onClick={() => {
          handlePortalSelect(key)
          setForm({ identifier: DEMO_CREDS[key].identifier, password: DEMO_CREDS[key].password })
          setDemoActive(true)
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = `0 4px 12px ${color}20`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
        style={{
          background: `${color}10`,
          border: `1.5px solid ${color}30`,
          borderRadius: 10,
          padding: '10px 12px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          transition: 'all 0.15s ease',
          outline: 'none',
          fontFamily: ff,
          textAlign: 'center',
        }}
      >
        <div style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon style={{ fontSize: 13, color: '#fff' }} />
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: color, lineHeight: 1.2 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', lineHeight: 1.3, wordBreak: 'break-all' }}>
          {DEMO_CREDS[key].identifier}
        </div>
      </button>
    )
  }

  const renderPortalButton = (portal, fullWidth = false) => {
    const { key, label, color, icon: Icon, description } = portal
    const isSelected = selectedPortal === key
    const isAdmin = key === 'admin'

    return (
      <button
        key={key}
        type="button"
        onClick={() => handlePortalSelect(key)}
        style={{
          background: isSelected ? `${color}10` : '#f8fafc',
          border: isSelected ? `2px solid ${color}` : '2px solid #e2e8f0',
          borderRadius: 10,
          padding: '10px 14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          transition: 'all 0.15s ease',
          outline: 'none',
          width: fullWidth ? '100%' : undefined,
          textAlign: 'left',
          fontFamily: ff,
        }}
      >
        {/* Icon box */}
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: isSelected ? color : `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon style={{ fontSize: 16, color: isSelected ? '#fff' : color }} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? color : '#1e293b', lineHeight: 1.2 }}>
            {isAdmin ? 'Administrator' : label}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{description}</div>
        </div>

        {/* Admin badge */}
        {isAdmin && (
          <span style={{
            background: '#fff7ed',
            color: '#c2410c',
            border: '1px solid #fed7aa',
            borderRadius: 20,
            padding: '2px 8px',
            fontSize: 10,
            fontWeight: 700,
            flexShrink: 0,
          }}>
            System Admin
          </span>
        )}
      </button>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: ff,
    }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-form-appear {
          animation: fadeSlideIn 0.25s ease forwards;
        }
        .back-home-btn:hover {
          background: rgba(255,255,255,0.18) !important;
          color: #fff !important;
        }
      `}</style>

      {/* ── Floating Back to Home button ── */}
      <Link
        to="/"
        className="back-home-btn"
        style={{
          position: 'fixed', top: 20, left: 24, zIndex: 200,
          display: 'flex', alignItems: 'center', gap: 6,
          color: isMobile ? '#1e293b' : 'rgba(255,255,255,0.75)',
          textDecoration: 'none',
          fontSize: 13, fontWeight: 600,
          background: isMobile ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)',
          border: isMobile ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.2)',
          borderRadius: 8, padding: '8px 14px',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s',
          fontFamily: ff,
        }}
      >
        ← Home
      </Link>

      {/* ── LEFT PANEL ── */}
      <div style={{
        width: '42%',
        background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
        padding: '48px 40px',
        display: isMobile ? 'none' : 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#fff',
        flexShrink: 0,
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            background: '#fff',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <MdSchool style={{ fontSize: 22, color: '#312e81' }} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1, fontFamily: ff }}>College ERP</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2, fontFamily: ff }}>Student Management System</div>
          </div>
        </div>

        {/* Middle */}
        <div>
          <h2 style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 800,
            lineHeight: 1.3,
            fontFamily: ff,
            whiteSpace: 'pre-line',
          }}>
            {'Welcome\nBack'}
          </h2>
          <p style={{
            fontSize: 14,
            opacity: 0.75,
            marginTop: 12,
            marginBottom: 0,
            lineHeight: 1.6,
            fontFamily: ff,
          }}>
            Sign in to access your personalized portal. All your academic tools in one place.
          </p>

          {/* Feature list */}
          <ul style={{ listStyle: 'none', margin: '32px 0 0', padding: 0 }}>
            {FEATURES.map((feat, i) => (
              <li key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 13,
                opacity: 0.85,
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                fontFamily: ff,
              }}>
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#4f46e5',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}>✓</span>
                {feat}
              </li>
            ))}
          </ul>
        </div>

        {/* Security badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['🔒 SSL Secured', '🛡️ JWT Auth', '⚡ Live Data'].map((badge) => (
            <span key={badge} style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: '6px 12px',
              fontSize: 11,
              fontFamily: ff,
            }}>
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        width: isMobile ? '100%' : '58%',
        background: '#fff',
        padding: isMobile ? '32px 20px' : '48px 48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflowY: 'auto',
      }}>
        <div style={{ maxWidth: 520, width: '100%', margin: '0 auto' }}>

          {/* Heading */}
          <h1 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 800, color: '#1e293b', fontFamily: ff }}>
            Sign In
          </h1>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: '#64748b', fontFamily: ff }}>
            Select your portal and enter credentials
          </p>

          {/* Portal selector label */}
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#374151',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            marginBottom: 10,
            fontFamily: ff,
          }}>
            Select Portal
          </div>

          {/* Row 1: Admin (full width) */}
          <div style={{ marginBottom: 8 }}>
            {renderPortalButton(adminPortal, true)}
          </div>

          {/* Row 2: Student | Staff */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            {row2.map((p) => renderPortalButton(p))}
          </div>

          {/* Row 3: Parent | Alumni */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            {row3.map((p) => renderPortalButton(p))}
          </div>

          {/* ── Demo Accounts Section (always visible, shown when no portal selected) ── */}
          {!selectedPortal && (
            <>
              {/* Divider: OR TRY A DEMO ACCOUNT */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                margin: '20px 0 16px',
              }}>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', whiteSpace: 'nowrap', letterSpacing: 0.5, fontFamily: ff }}>
                  OR TRY A DEMO ACCOUNT
                </span>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              </div>

              {/* Demo section label */}
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#94a3b8',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                marginBottom: 10,
                fontFamily: ff,
              }}>
                Quick Demo Login
              </div>

              {/* Demo cards grid — all 5 portals, responsive */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                gap: 8,
                marginBottom: 4,
              }}>
                {PORTALS.map(renderDemoCard)}
              </div>

              {/* Password hint */}
              <p style={{
                fontSize: 11,
                color: '#94a3b8',
                textAlign: 'center',
                marginTop: 8,
                marginBottom: 0,
                fontFamily: ff,
              }}>
                Password for all: <strong>Demo@123</strong>
              </p>
            </>
          )}

          {/* Login form — fades in after portal selected */}
          {selectedPortal && (
            <div className="login-form-appear">

              {/* Divider with label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                margin: '28px 0 20px',
              }}>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', whiteSpace: 'nowrap', fontFamily: ff }}>
                  Enter Credentials
                </span>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              </div>

              {/* Demo banner */}
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
                  fontFamily: ff,
                }}>
                  <span style={{ fontSize: 16 }}>✅</span>
                  Demo credentials pre-filled — click Sign In to explore
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Identifier */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>{activePortal?.idLabel}</label>
                  <input
                    type="text"
                    name="identifier"
                    value={form.identifier}
                    onChange={handleChange}
                    placeholder={`Enter ${activePortal?.idLabel?.toLowerCase()}`}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = activeColor)}
                    onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                  />
                </div>

                {/* Password */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      style={{ ...inputStyle, paddingRight: 44 }}
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
                        padding: 0,
                      }}
                    >
                      {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember me + Forgot password */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 22,
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    fontSize: 13,
                    color: '#374151',
                    cursor: 'pointer',
                    fontFamily: ff,
                    userSelect: 'none',
                  }}>
                    <input type="checkbox" style={{ accentColor: activeColor, width: 14, height: 14 }} />
                    Remember me
                  </label>
                  <Link
                    to="/auth/forgot-password"
                    style={{
                      fontSize: 13,
                      color: activeColor,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: ff,
                      textDecoration: 'none',
                    }}
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Sign In button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '13px',
                    background: loading ? `${activeColor}99` : activeColor,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: ff,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                    letterSpacing: 0.2,
                  }}
                >
                  {loading ? 'Signing in…' : `Sign In as ${activePortal?.label}`}
                </button>

                {/* Divider */}
                <div style={{ height: 1, background: '#e2e8f0', margin: '22px 0 16px' }} />

                {/* ── Demo Accounts Section (shown when portal is selected) ── */}
                <div>
                  {/* Divider: OR TRY A DEMO ACCOUNT */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    margin: '0 0 14px',
                  }}>
                    <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', whiteSpace: 'nowrap', letterSpacing: 0.5, fontFamily: ff }}>
                      OR TRY A DEMO ACCOUNT
                    </span>
                    <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                  </div>

                  {/* Demo section label */}
                  <div style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#94a3b8',
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    marginBottom: 10,
                    fontFamily: ff,
                  }}>
                    Quick Demo Login
                  </div>

                  {/* All 5 portals, responsive grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                    gap: 8,
                    marginBottom: 4,
                  }}>
                    {PORTALS.map(renderDemoCard)}
                  </div>

                  {/* Password hint */}
                  <p style={{
                    fontSize: 11,
                    color: '#94a3b8',
                    textAlign: 'center',
                    marginTop: 8,
                    marginBottom: 16,
                    fontFamily: ff,
                  }}>
                    Password for all: <strong>Demo@123</strong>
                  </p>
                </div>

                {/* Register link */}
                <p style={{
                  textAlign: 'center',
                  fontSize: 13,
                  color: '#64748b',
                  margin: 0,
                  fontFamily: ff,
                }}>
                  Don't have an account?{' '}
                  <Link
                    to="/auth/register"
                    style={{ color: activeColor, fontWeight: 600, textDecoration: 'none' }}
                  >
                    Register here
                  </Link>
                </p>
              </form>
            </div>
          )}

          {/* Back to Home */}
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Link
              to="/"
              style={{
                fontSize: 13,
                color: '#94a3b8',
                textDecoration: 'none',
                fontFamily: ff,
              }}
            >
              ← Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
