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
  MdShield,
  MdVerified,
  MdSpeed,
} from 'react-icons/md'

/* ─── Constants ─────────────────────────────────────────────────────────── */

const FF = "'Inter', system-ui, sans-serif"

const PORTALS = [
  {
    key: 'admin',
    label: 'Admin',
    color: '#DC2626',
    icon: MdAdminPanelSettings,
    desc: 'Full system administration',
    idLabel: 'Admin ID / Email',
  },
  {
    key: 'student',
    label: 'Student',
    color: '#6366F1',
    icon: MdSchool,
    desc: 'Academic portal',
    idLabel: 'Roll No / Email',
  },
  {
    key: 'staff',
    label: 'Staff',
    color: '#8B5CF6',
    icon: MdBadge,
    desc: 'Faculty & staff tools',
    idLabel: 'Employee ID / Email',
  },
  {
    key: 'parent',
    label: 'Parent',
    color: '#F59E0B',
    icon: MdPeople,
    desc: "Ward's progress",
    idLabel: 'Phone / Email',
  },
  {
    key: 'alumni',
    label: 'Alumni',
    color: '#10B981',
    icon: MdStar,
    desc: 'Alumni network',
    idLabel: 'Alumni ID / Email',
  },
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
  'Real-time Marks & Grade Tracking',
  'Online Fee Payments & Receipts',
  'PhD Research Portal',
  '24/7 Feedback System',
]

const SECURITY_BADGES = [
  { icon: MdShield,   label: 'SSL Secured' },
  { icon: MdVerified, label: 'JWT Auth'    },
  { icon: MdSpeed,    label: 'Always On'   },
]

/* ─── Sub-components ────────────────────────────────────────────────────── */

function LeftPanel() {
  return (
    <div
      style={{
        width: '45%',
        background: '#0A0F1E',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 48,
        flexShrink: 0,
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: -80,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* TOP: Logo + Brand */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#6366F1',
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
                color: '#fff',
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: -1,
                lineHeight: 1,
                fontFamily: FF,
              }}
            >
              College ERP
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: 13,
                marginTop: 4,
                fontFamily: FF,
              }}
            >
              Student Information System
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE: Welcome copy + features */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          padding: '48px 0',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 38,
            fontWeight: 900,
            letterSpacing: -1.5,
            lineHeight: 1.2,
            color: '#fff',
            fontFamily: FF,
          }}
        >
          Welcome Back
          <br />
          <span
            style={{
              background: 'linear-gradient(90deg, #818CF8, #22D3EE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Sign In to Continue
          </span>
        </h2>

        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 14,
            lineHeight: 1.7,
            marginTop: 16,
            marginBottom: 0,
            maxWidth: 320,
            fontFamily: FF,
          }}
        >
          Access your personalized college portal — academics, exams, finance,
          services and research, all in one place.
        </p>

        {/* Feature checklist */}
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FEATURES.map((feat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(99,102,241,0.2)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MdCheck style={{ fontSize: 14, color: '#818CF8' }} />
              </div>
              <span
                style={{
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: 14,
                  fontFamily: FF,
                }}
              >
                {feat}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM: Security badges */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {SECURITY_BADGES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 100,
              padding: '6px 14px',
              fontSize: 11,
              color: 'rgba(255,255,255,0.55)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: FF,
            }}
          >
            <Icon style={{ fontSize: 13 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Portal Button ─────────────────────────────────────────────────────── */

function PortalButton({ portal, isSelected, onSelect, fullWidth }) {
  const { key, label, color, icon: Icon, desc } = portal
  const isAdmin = key === 'admin'

  return (
    <button
      type="button"
      onClick={() => onSelect(key)}
      style={{
        background: isSelected ? `${color}08` : '#F8FAFC',
        border: isSelected ? `2px solid ${color}` : '2px solid #E2E8F0',
        borderRadius: 12,
        padding: '12px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transition: 'all 0.15s',
        outline: 'none',
        width: fullWidth ? '100%' : undefined,
        textAlign: 'left',
        fontFamily: FF,
      }}
    >
      {/* Icon box */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: isSelected ? color : `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon style={{ fontSize: 20, color: isSelected ? '#fff' : color }} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: isSelected ? color : '#1E293B',
            lineHeight: 1.2,
            fontFamily: FF,
          }}
        >
          {label}
        </div>
        <div
          style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, fontFamily: FF }}
        >
          {desc}
        </div>
      </div>

      {/* Admin badge */}
      {isAdmin && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            background: '#DC262610',
            color: '#DC2626',
            borderRadius: 6,
            padding: '3px 8px',
            flexShrink: 0,
            fontFamily: FF,
          }}
        >
          ADMIN
        </span>
      )}
    </button>
  )
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
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )

  /* Responsive listener */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    setSelectedPortal(key)
    setForm({ identifier: '', password: '' })
    setDemoActive(false)
    setShowPassword(false)
  }

  const activePortal = PORTALS.find((p) => p.key === selectedPortal)
  const activeColor = activePortal ? activePortal.color : '#6366F1'

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

  /* Shared input style */
  const inputBase = {
    width: '100%',
    padding: '11px 14px',
    border: '2px solid #E2E8F0',
    borderRadius: 10,
    fontSize: 14,
    color: '#0F172A',
    fontFamily: FF,
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fff',
    transition: 'border-color 0.15s',
  }

  const adminPortal = PORTALS.find((p) => p.key === 'admin')
  const row2 = PORTALS.filter((p) => p.key === 'student' || p.key === 'staff')
  const row3 = PORTALS.filter((p) => p.key === 'parent' || p.key === 'alumni')

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: FF,
      }}
    >
      {/* Keyframe injection */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .prismatic-form-appear {
          animation: slideDown 0.22s ease forwards;
        }
        .prismatic-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.07);
        }
      `}</style>

      {/* Left panel — hidden on mobile */}
      {!isMobile && <LeftPanel />}

      {/* ── RIGHT PANEL ── */}
      <div
        style={{
          width: isMobile ? '100%' : '55%',
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: isMobile ? '32px 24px' : '48px 56px',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: 540, width: '100%', margin: '0 auto' }}>

          {/* Heading */}
          <div
            style={{
              fontSize: 30,
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: -1,
              fontFamily: FF,
            }}
          >
            Sign In
          </div>
          <div
            style={{
              fontSize: 14,
              color: '#94A3B8',
              marginTop: 6,
              marginBottom: 28,
              fontFamily: FF,
            }}
          >
            Choose your portal to continue
          </div>

          {/* Portal selector label */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#94A3B8',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              marginBottom: 12,
              fontFamily: FF,
            }}
          >
            Select Portal
          </div>

          {/* Row 1: Admin (full width) */}
          <div style={{ marginBottom: 8 }}>
            <PortalButton
              portal={adminPortal}
              isSelected={selectedPortal === 'admin'}
              onSelect={handlePortalSelect}
              fullWidth
            />
          </div>

          {/* Row 2: Student | Staff */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              marginBottom: 8,
            }}
          >
            {row2.map((p) => (
              <PortalButton
                key={p.key}
                portal={p}
                isSelected={selectedPortal === p.key}
                onSelect={handlePortalSelect}
              />
            ))}
          </div>

          {/* Row 3: Parent | Alumni */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
            }}
          >
            {row3.map((p) => (
              <PortalButton
                key={p.key}
                portal={p}
                isSelected={selectedPortal === p.key}
                onSelect={handlePortalSelect}
              />
            ))}
          </div>

          {/* Login form — slides in after portal selected */}
          {selectedPortal && (
            <div className="prismatic-form-appear">

              {/* Divider with label */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '28px 0 20px',
                }}
              >
                <div style={{ flexGrow: 1, height: 1, background: '#E2E8F0' }} />
                <span
                  style={{
                    fontSize: 12,
                    color: '#CBD5E1',
                    padding: '0 12px',
                    fontFamily: FF,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Enter Credentials
                </span>
                <div style={{ flexGrow: 1, height: 1, background: '#E2E8F0' }} />
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

                {/* Identifier */}
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: 6,
                      fontFamily: FF,
                    }}
                  >
                    {activePortal?.idLabel}
                  </label>
                  <input
                    type="text"
                    name="identifier"
                    value={form.identifier}
                    onChange={handleChange}
                    placeholder={`Enter ${activePortal?.idLabel?.toLowerCase()}`}
                    style={inputBase}
                    onFocus={(e) => (e.target.style.borderColor = activeColor)}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  />
                </div>

                {/* Password */}
                <div style={{ marginBottom: 8 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#374151',
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
                      style={{ ...inputBase, paddingRight: 44 }}
                      onFocus={(e) => (e.target.style.borderColor = activeColor)}
                      onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
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
                        color: '#64748B',
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

                {/* Remember me + Forgot password */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 8,
                    marginBottom: 22,
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      color: '#475569',
                      cursor: 'pointer',
                      fontFamily: FF,
                      userSelect: 'none',
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: activeColor,
                        cursor: 'pointer',
                      }}
                    />
                    Remember me
                  </label>
                  <span
                    style={{
                      fontSize: 13,
                      color: activeColor,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: FF,
                    }}
                  >
                    Forgot Password?
                  </span>
                </div>

                {/* Sign In button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="prismatic-submit-btn"
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: 12,
                    background: loading ? `${activeColor}90` : activeColor,
                    color: '#fff',
                    border: 'none',
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: FF,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: `0 4px 16px ${activeColor}35`,
                    transition: 'all 0.2s',
                    letterSpacing: 0.2,
                  }}
                >
                  {loading ? 'Signing in...' : `Sign In as ${activePortal?.label}`}
                </button>

                {/* Bottom divider */}
                <div
                  style={{
                    height: 1,
                    background: '#E2E8F0',
                    margin: '22px 0 16px',
                  }}
                />

                {/* Register link */}
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: 13,
                    color: '#94A3B8',
                    margin: 0,
                    fontFamily: FF,
                  }}
                >
                  Don't have an account?{' '}
                  <Link
                    to="/auth/register"
                    style={{
                      color: activeColor,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Register
                  </Link>
                </p>
              </form>
            </div>
          )}

          {/* Back to Home */}
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <span
              onClick={() => navigate('/')}
              style={{
                fontSize: 12,
                color: '#CBD5E1',
                cursor: 'pointer',
                fontFamily: FF,
              }}
            >
              ← Back to Home
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}
