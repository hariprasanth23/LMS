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
  MdVisibilityOff,
  MdCheck,
} from 'react-icons/md'

/* ─── Constants ─────────────────────────────────────────────────────────── */

const FF = "'Inter', system-ui, sans-serif"

const PORTALS = [
  {
    key: 'admin',
    label: 'Administrator',
    color: '#DC2626',
    bg: '#FEF2F2',
    icon: MdAdminPanelSettings,
    desc: 'Full system access',
  },
  {
    key: 'student',
    label: 'Student',
    color: '#7C3AED',
    bg: '#F5F3FF',
    icon: MdSchool,
    desc: 'Academic portal',
  },
  {
    key: 'staff',
    label: 'Faculty / Staff',
    color: '#0EA5E9',
    bg: '#F0F9FF',
    icon: MdBadge,
    desc: 'Teaching tools',
  },
  {
    key: 'parent',
    label: 'Parent',
    color: '#F59E0B',
    bg: '#FFFBEB',
    icon: MdPeople,
    desc: "Ward's progress",
  },
  {
    key: 'alumni',
    label: 'Alumni',
    color: '#10B981',
    bg: '#F0FDF4',
    icon: MdStar,
    desc: 'Alumni network',
  },
]

const DEMO_CREDS = {
  admin:   { identifier: 'admin@demo.com',   password: 'Demo@123' },
  student: { identifier: 'student@demo.com', password: 'Demo@123' },
  staff:   { identifier: 'staff@demo.com',   password: 'Demo@123' },
  parent:  { identifier: 'parent@demo.com',  password: 'Demo@123' },
  alumni:  { identifier: 'alumni@demo.com',  password: 'Demo@123' },
}

const ID_LABEL = {
  admin:   'Admin ID / Email',
  student: 'Roll Number / Email',
  staff:   'Employee ID / Email',
  parent:  'Phone / Email',
  alumni:  'Alumni ID / Email',
}

/* ─── Main Component ────────────────────────────────────────────────────── */

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [selectedPortal, setSelectedPortal] = useState(null)
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [demoActive, setDemoActive] = useState(false)
  const [hoveredPortal, setHoveredPortal] = useState(null)

  /* URL params: ?portal=&demo=true */
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
    if (selectedPortal === key) return
    setSelectedPortal(key)
    setForm({ identifier: '', password: '' })
    setDemoActive(false)
    setShowPassword(false)
  }

  const activePortal = PORTALS.find((p) => p.key === selectedPortal)
  const activeColor = activePortal ? activePortal.color : '#7C3AED'

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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse at 15% 30%, rgba(124,58,237,0.18) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 70%, rgba(14,165,233,0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 60%),
          #F8FAFC
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: FF,
        position: 'relative',
      }}
    >
      {/* CSS Animations */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .prism-form-section {
          animation: slideDown 0.28s ease forwards;
        }
        .prism-sign-btn:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }
        .prism-sign-btn:active:not(:disabled) {
          transform: translateY(0px);
        }
        .prism-back:hover {
          color: #7C3AED !important;
        }
        .prism-forgot:hover {
          opacity: 0.75;
        }
      `}</style>

      {/* Background decoration blob — top left */}
      <div
        style={{
          position: 'fixed',
          top: -60,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* Background decoration blob — bottom right */}
      <div
        style={{
          position: 'fixed',
          bottom: -50,
          right: -50,
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 28,
          boxShadow: '0 8px 60px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          width: '100%',
          maxWidth: 480,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Card top shimmer strip */}
        <div
          style={{
            height: 8,
            background: 'linear-gradient(90deg, #7C3AED, #0EA5E9, #10B981, #F59E0B, #7C3AED)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3.5s linear infinite',
          }}
        />

        {/* Card content */}
        <div
          style={{
            padding: '36px',
          }}
        >
          {/* Header row: logo + brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MdSchool style={{ fontSize: 26, color: '#fff' }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: '#18181B',
                  letterSpacing: -0.5,
                  lineHeight: 1,
                  fontFamily: FF,
                }}
              >
                College ERP
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: '#71717A',
                  marginTop: 4,
                  fontFamily: FF,
                }}
              >
                Sign in to your portal
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#F4F4F5', margin: '24px 0' }} />

          {/* Portal section label */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: '#A1A1AA',
              textTransform: 'uppercase',
              marginBottom: 12,
              fontFamily: FF,
            }}
          >
            Select Your Portal
          </div>

          {/* Portal vertical list */}
          <div>
            {PORTALS.map((portal) => {
              const isSelected = selectedPortal === portal.key
              const isHovered = hoveredPortal === portal.key && !isSelected
              const Icon = portal.icon

              return (
                <div
                  key={portal.key}
                  onClick={() => handlePortalSelect(portal.key)}
                  onMouseEnter={() => setHoveredPortal(portal.key)}
                  onMouseLeave={() => setHoveredPortal(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '13px 16px',
                    borderRadius: 14,
                    cursor: 'pointer',
                    border: isSelected
                      ? `1.5px solid ${portal.color}40`
                      : isHovered
                      ? `1.5px solid ${portal.color}30`
                      : '1.5px solid #F4F4F5',
                    marginBottom: 8,
                    background: isSelected
                      ? portal.bg
                      : isHovered
                      ? portal.bg
                      : '#FAFAFA',
                    boxShadow: isSelected
                      ? `0 0 0 3px ${portal.color}15`
                      : 'none',
                    transition: 'all 0.15s ease',
                    userSelect: 'none',
                  }}
                >
                  {/* Icon box */}
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: isSelected ? portal.color : '#F4F4F5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <Icon
                      style={{
                        fontSize: 20,
                        color: isSelected ? '#fff' : portal.color,
                        transition: 'color 0.15s ease',
                      }}
                    />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: isSelected ? portal.color : '#18181B',
                        fontFamily: FF,
                        lineHeight: 1.3,
                        transition: 'color 0.15s ease',
                      }}
                    >
                      {portal.label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#71717A',
                        fontFamily: FF,
                        marginTop: 1,
                      }}
                    >
                      {portal.desc}
                    </div>
                  </div>

                  {/* Right indicator */}
                  {isSelected ? (
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: portal.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <MdCheck style={{ fontSize: 12, color: '#fff' }} />
                    </div>
                  ) : (
                    <span
                      style={{
                        fontSize: 16,
                        color: '#D4D4D8',
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      →
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Form section — slides in when portal selected */}
          <div
            style={{
              maxHeight: selectedPortal ? 520 : 0,
              opacity: selectedPortal ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.35s ease, opacity 0.3s ease',
            }}
          >
            {selectedPortal && (
              <div className="prism-form-section">
                {/* Divider with "Enter credentials" label */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '20px 0 18px',
                  }}
                >
                  <div style={{ flexGrow: 1, height: 1, background: '#F4F4F5' }} />
                  <span
                    style={{
                      fontSize: 11,
                      color: '#A1A1AA',
                      padding: '0 12px',
                      fontFamily: FF,
                      whiteSpace: 'nowrap',
                      letterSpacing: 0.3,
                    }}
                  >
                    Enter credentials
                  </span>
                  <div style={{ flexGrow: 1, height: 1, background: '#F4F4F5' }} />
                </div>

                {/* Demo banner */}
                {demoActive && (
                  <div
                    style={{
                      background: '#F0FDF4',
                      border: '1.5px solid #86EFAC',
                      borderRadius: 10,
                      padding: '10px 14px',
                      marginBottom: 18,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      color: '#166534',
                      fontFamily: FF,
                    }}
                  >
                    <span>✅</span>
                    Demo credentials pre-filled — click Sign In to explore
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Identifier input */}
                  <div style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#3F3F46',
                        marginBottom: 6,
                        fontFamily: FF,
                      }}
                    >
                      {ID_LABEL[selectedPortal]}
                    </label>
                    <input
                      type="text"
                      name="identifier"
                      value={form.identifier}
                      onChange={handleChange}
                      placeholder={`Enter ${ID_LABEL[selectedPortal]?.toLowerCase()}`}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #F4F4F5',
                        borderRadius: 12,
                        fontSize: 14,
                        color: '#18181B',
                        fontFamily: FF,
                        outline: 'none',
                        boxSizing: 'border-box',
                        background: '#fff',
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = activeColor)}
                      onBlur={(e) => (e.target.style.borderColor = '#F4F4F5')}
                    />
                  </div>

                  {/* Password input */}
                  <div style={{ marginBottom: 8 }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#3F3F46',
                        marginBottom: 6,
                        fontFamily: FF,
                      }}
                    >
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        style={{
                          width: '100%',
                          padding: '12px 48px 12px 16px',
                          border: '2px solid #F4F4F5',
                          borderRadius: 12,
                          fontSize: 14,
                          color: '#18181B',
                          fontFamily: FF,
                          outline: 'none',
                          boxSizing: 'border-box',
                          background: '#fff',
                          transition: 'border-color 0.15s',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = activeColor)}
                        onBlur={(e) => (e.target.style.borderColor = '#F4F4F5')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: 14,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#A1A1AA',
                          display: 'flex',
                          alignItems: 'center',
                          padding: 0,
                        }}
                      >
                        {showPassword
                          ? <MdVisibilityOff size={18} />
                          : <MdVisibility size={18} />
                        }
                      </button>
                    </div>
                  </div>

                  {/* Forgot password — right aligned */}
                  <div style={{ textAlign: 'right', marginBottom: 4 }}>
                    <span
                      className="prism-forgot"
                      style={{
                        fontSize: 13,
                        color: activeColor,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: FF,
                        transition: 'opacity 0.15s',
                      }}
                    >
                      Forgot Password?
                    </span>
                  </div>

                  {/* Sign In button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="prism-sign-btn"
                    style={{
                      background: loading ? `${activeColor}90` : activeColor,
                      color: '#fff',
                      width: '100%',
                      padding: '13px',
                      borderRadius: 12,
                      border: 'none',
                      fontSize: 15,
                      fontWeight: 700,
                      fontFamily: FF,
                      boxShadow: `0 4px 14px ${activeColor}35`,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      marginTop: 20,
                      transition: 'all 0.2s ease',
                      letterSpacing: 0.2,
                    }}
                  >
                    {loading ? 'Signing in...' : `Sign In as ${activePortal?.label}`}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Card footer */}
          <div>
            <div style={{ height: 1, background: '#F4F4F5', margin: '24px 0 16px' }} />
            <p
              style={{
                textAlign: 'center',
                fontSize: 13,
                color: '#71717A',
                margin: '0 0 8px',
                fontFamily: FF,
              }}
            >
              New to College ERP?{' '}
              <Link
                to="/auth/register"
                style={{
                  color: '#7C3AED',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Register here
              </Link>
            </p>
            <div style={{ textAlign: 'center' }}>
              <span
                className="prism-back"
                onClick={() => navigate('/')}
                style={{
                  fontSize: 12,
                  color: '#A1A1AA',
                  cursor: 'pointer',
                  fontFamily: FF,
                  transition: 'color 0.15s',
                }}
              >
                ← Back to Home
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
