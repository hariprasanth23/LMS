import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import {
  MdSchool,
  MdBadge,
  MdPeople,
  MdStar,
  MdAdminPanelSettings,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md'

const ff = "'Inter', system-ui, sans-serif"

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

const ROLES = [
  { key: 'STUDENT',  label: 'Student',      color: '#3b82f6', icon: MdSchool },
  { key: 'FACULTY',  label: 'Faculty/Staff', color: '#8b5cf6', icon: MdBadge },
  { key: 'PARENT',   label: 'Parent',        color: '#f59e0b', icon: MdPeople },
  { key: 'ALUMNI',   label: 'Alumni',        color: '#14b8a6', icon: MdStar },
  { key: 'ADMIN',    label: 'Admin',         color: '#dc2626', icon: MdAdminPanelSettings },
]

const FEATURES = [
  'Complete Academic Management',
  'Real-time Exam & Grade Tracking',
  'Online Fee Payment & Receipts',
  'Research & Project Portal',
  '24/7 Feedback System',
]

function getPasswordStrength(pwd) {
  if (!pwd) return null
  const hasLen     = pwd.length >= 8
  const hasUpper   = /[A-Z]/.test(pwd)
  const hasLower   = /[a-z]/.test(pwd)
  const hasNumber  = /\d/.test(pwd)
  const hasSpecial = /[^a-zA-Z\d]/.test(pwd)
  const score = [hasLen, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length
  if (score <= 2) return { label: 'Weak',   color: '#ef4444', width: '20%' }
  if (score === 3) return { label: 'Fair',   color: '#f59e0b', width: '45%' }
  if (score === 4) return { label: 'Good',   color: '#22c55e', width: '70%' }
  return             { label: 'Strong', color: '#6366f1', width: '100%' }
}

function getRequirements(pwd) {
  return [
    { label: 'At least 8 characters',       met: pwd.length >= 8 },
    { label: 'One uppercase letter',         met: /[A-Z]/.test(pwd) },
    { label: 'One lowercase letter',         met: /[a-z]/.test(pwd) },
    { label: 'One number',                   met: /\d/.test(pwd) },
    { label: 'One special character',        met: /[^a-zA-Z\d]/.test(pwd) },
  ]
}

export default function Register() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [selectedRole, setSelectedRole] = useState('STUDENT')
  const [showPassword, setShowPassword]           = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const activeRole  = ROLES.find((r) => r.key === selectedRole)
  const activeColor = activeRole ? activeRole.color : '#6366f1'

  const strength = getPasswordStrength(form.password)
  const requirements = getRequirements(form.password)

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error('Please fill in all required fields')
      return
    }
    if (!validateEmail(form.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    const pwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/
    if (!pwdPattern.test(form.password)) {
      toast.error('Password must be 8+ chars with uppercase, lowercase, digit, and special character')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: selectedRole,
      })
      toast.success('Registration successful! Please login.')
      navigate('/auth/login?registered=true')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: ff }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reg-appear { animation: fadeSlideIn 0.25s ease forwards; }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div style={{
        width: '42%',
        background: 'linear-gradient(145deg, #0A0F1E 0%, #0f172a 40%, #1e1b4b 75%, #312e81 100%)',
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
          <h2 style={{ margin: 0, fontSize: 32, fontWeight: 800, lineHeight: 1.3, fontFamily: ff }}>
            Join College ERP
          </h2>
          <p style={{
            margin: '8px 0 4px',
            fontSize: 22,
            fontWeight: 700,
            fontFamily: ff,
            background: 'linear-gradient(90deg, #818cf8, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Create Your Account
          </p>
          <p style={{
            fontSize: 14,
            opacity: 0.75,
            marginTop: 12,
            marginBottom: 0,
            lineHeight: 1.6,
            fontFamily: ff,
          }}>
            Join thousands of students, faculty, and staff managing their academic life with ease.
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
        padding: isMobile ? '32px 20px' : '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflowY: 'auto',
      }}>
        <div style={{ maxWidth: 540, width: '100%', margin: '0 auto' }} className="reg-appear">

          {/* Heading */}
          <h1 style={{ margin: '0 0 4px', fontSize: 30, fontWeight: 900, color: '#1e293b', fontFamily: ff }}>
            Create Account
          </h1>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: '#64748b', fontFamily: ff }}>
            Fill in your details to get started
          </p>

          <form onSubmit={handleSubmit}>

            {/* ── Personal Info ── */}
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#94a3b8',
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 14,
              fontFamily: ff,
            }}>
              Personal Information
            </div>

            {/* Two-column: Name + Email */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = activeColor)}
                  onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>
              <div>
                <label style={labelStyle}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = activeColor)}
                  onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Phone Number <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = activeColor)}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 4 }}>
              <label style={labelStyle}>Password <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
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

            {/* Strength bar */}
            {form.password && strength && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: ff }}>Password strength</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: strength.color, fontFamily: ff }}>{strength.label}</span>
                </div>
                <div style={{ height: 4, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: strength.width,
                    background: strength.color,
                    borderRadius: 4,
                    transition: 'width 0.3s ease, background 0.3s ease',
                  }} />
                </div>
                {/* Requirements checklist */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', marginTop: 8 }}>
                  {requirements.map((req) => (
                    <div key={req.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: ff }}>
                      <span style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: req.met ? '#22c55e' : '#e2e8f0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 9,
                        flexShrink: 0,
                        color: '#fff',
                        fontWeight: 700,
                      }}>
                        {req.met ? '✓' : ''}
                      </span>
                      <span style={{ color: req.met ? '#166534' : '#94a3b8' }}>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Confirm Password <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  style={{
                    ...inputStyle,
                    paddingRight: 44,
                    borderColor: form.confirmPassword
                      ? form.confirmPassword === form.password ? '#22c55e' : '#ef4444'
                      : '#e2e8f0',
                  }}
                  onFocus={(e) => {
                    if (!form.confirmPassword) e.target.style.borderColor = activeColor
                  }}
                  onBlur={(e) => {
                    if (!form.confirmPassword) e.target.style.borderColor = '#e2e8f0'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
              {form.confirmPassword && form.confirmPassword !== form.password && (
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#ef4444', fontFamily: ff }}>
                  Passwords do not match
                </p>
              )}
            </div>

            {/* ── Role / Portal Selection ── */}
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#94a3b8',
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 12,
              fontFamily: ff,
            }}>
              Select Your Role
            </div>
            {/* Desktop: explicit 3+2 rows — Mobile: unified 2-col grid */}
            {isMobile ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 24 }}>
                {ROLES.map((role) => {
                  const Icon = role.icon
                  const isSelected = selectedRole === role.key
                  return (
                    <button
                      key={role.key}
                      type="button"
                      onClick={() => setSelectedRole(role.key)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '9px 10px', borderRadius: 10,
                        border: isSelected ? `2px solid ${role.color}` : '2px solid #e2e8f0',
                        background: isSelected ? `${role.color}12` : '#f8fafc',
                        color: isSelected ? role.color : '#64748b',
                        fontSize: 12, fontWeight: isSelected ? 700 : 500, fontFamily: ff,
                        cursor: 'pointer', transition: 'all 0.15s ease', outline: 'none',
                        overflow: 'hidden', whiteSpace: 'nowrap',
                      }}
                    >
                      <Icon style={{ fontSize: 14, flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{role.label}</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              [ROLES.slice(0, 3), ROLES.slice(3)].map((rowRoles, rowIdx) => (
                <div
                  key={rowIdx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${rowRoles.length}, 1fr)`,
                    gap: 8,
                    marginBottom: rowIdx === 0 ? 8 : 24,
                  }}
                >
                  {rowRoles.map((role) => {
                    const Icon = role.icon
                    const isSelected = selectedRole === role.key
                    return (
                      <button
                        key={role.key}
                        type="button"
                        onClick={() => setSelectedRole(role.key)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          padding: '9px 14px', borderRadius: 10,
                          border: isSelected ? `2px solid ${role.color}` : '2px solid #e2e8f0',
                          background: isSelected ? `${role.color}12` : '#f8fafc',
                          color: isSelected ? role.color : '#64748b',
                          fontSize: 13, fontWeight: isSelected ? 700 : 500, fontFamily: ff,
                          cursor: 'pointer', transition: 'all 0.15s ease', outline: 'none',
                        }}
                      >
                        <Icon style={{ fontSize: 15 }} />
                        {role.label}
                      </button>
                    )
                  })}
                </div>
              ))
            )}

            {/* Submit */}
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
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>

            {/* Divider */}
            <div style={{ height: 1, background: '#e2e8f0', margin: '22px 0 16px' }} />

            {/* Sign in link */}
            <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', margin: 0, fontFamily: ff }}>
              Already have an account?{' '}
              <Link to="/auth/login" style={{ color: activeColor, fontWeight: 600, textDecoration: 'none' }}>
                Sign In
              </Link>
            </p>
          </form>

          {/* Back to Home */}
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none', fontFamily: ff }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
