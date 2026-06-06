import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdSchool, MdEmail, MdOpenInNew, MdRefresh, MdArrowBack } from 'react-icons/md'

const ff = "'Inter', system-ui, sans-serif"

const FEATURES = [
  'Complete Academic Management',
  'Real-time Exam & Grade Tracking',
  'Online Fee Payment & Receipts',
  'Research & Project Portal',
  '24/7 Feedback System',
]

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail]         = useState('')
  const [step, setStep]           = useState(1)   // 1 = form, 2 = success
  const [loading, setLoading]     = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent]       = useState(false)

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

  const handleSend = (e) => {
    e.preventDefault()
    if (!email || !validateEmail(email)) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(2)
    }, 1000)
  }

  const handleResend = () => {
    if (resending || resent) return
    setResending(true)
    setTimeout(() => {
      setResending(false)
      setResent(true)
      setTimeout(() => setResent(false), 4000)
    }, 1000)
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: ff }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fp-appear { animation: fadeSlideIn 0.3s ease forwards; }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div style={{
        width: '42%',
        background: 'linear-gradient(145deg, #0A0F1E 0%, #0f172a 40%, #1e1b4b 75%, #312e81 100%)',
        padding: '48px 40px',
        display: 'flex',
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
            Reset Your Password
          </h2>
          <p style={{
            margin: '8px 0 4px',
            fontSize: 20,
            fontWeight: 700,
            fontFamily: ff,
            background: 'linear-gradient(90deg, #818cf8, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Secure & Instant Recovery
          </p>
          <p style={{
            fontSize: 14,
            opacity: 0.75,
            marginTop: 12,
            marginBottom: 0,
            lineHeight: 1.6,
            fontFamily: ff,
          }}>
            Recover access to your College ERP account quickly and securely. A reset link will be sent to your registered email.
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
        width: '58%',
        background: '#fff',
        padding: '48px 48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflowY: 'auto',
      }}>
        <div style={{ maxWidth: 460, width: '100%', margin: '0 auto' }}>

          {step === 1 && (
            <div className="fp-appear">
              {/* Icon */}
              <div style={{
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #6366f110 0%, #06b6d410 100%)',
                border: '1.5px solid #e2e8f0',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
                <MdEmail style={{ fontSize: 28, color: '#6366f1' }} />
              </div>

              {/* Heading */}
              <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 800, color: '#1e293b', fontFamily: ff }}>
                Forgot Password?
              </h1>
              <p style={{ margin: '0 0 32px', fontSize: 14, color: '#64748b', lineHeight: 1.6, fontFamily: ff }}>
                Enter your registered email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSend}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: 6,
                    fontFamily: ff,
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                    onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email || !validateEmail(email)}
                  style={{
                    width: '100%',
                    padding: '13px',
                    background: loading || !email || !validateEmail(email) ? '#a5b4fc' : '#6366f1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: ff,
                    cursor: loading || !email || !validateEmail(email) ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                    letterSpacing: 0.2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{
                        width: 16,
                        height: 16,
                        border: '2px solid rgba(255,255,255,0.4)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'spin 0.7s linear infinite',
                      }} />
                      Sending…
                    </>
                  ) : 'Send Reset Link'}
                </button>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </form>

              {/* Divider */}
              <div style={{ height: 1, background: '#e2e8f0', margin: '28px 0 20px' }} />

              <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', margin: 0, fontFamily: ff }}>
                Remember your password?{' '}
                <Link to="/auth/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>
                  Back to Login
                </Link>
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="fp-appear">
              {/* Success icon */}
              <div style={{
                width: 64,
                height: 64,
                background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)',
                border: '1.5px solid #86efac',
                borderRadius: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                fontSize: 32,
              }}>
                ✅
              </div>

              <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 800, color: '#1e293b', fontFamily: ff }}>
                Reset link sent!
              </h1>
              <p style={{ margin: '0 0 24px', fontSize: 14, color: '#64748b', lineHeight: 1.6, fontFamily: ff }}>
                Check your email and follow the instructions to reset your password.
              </p>

              {/* Info card */}
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: 12,
                padding: '18px 20px',
                marginBottom: 28,
              }}>
                <p style={{ margin: '0 0 6px', fontSize: 13, color: '#374151', fontFamily: ff }}>
                  We sent a reset link to:
                </p>
                <p style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#166534', fontFamily: ff, wordBreak: 'break-all' }}>
                  {email}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#f59e0b',
                    display: 'inline-block',
                    flexShrink: 0,
                  }} />
                  <p style={{ margin: 0, fontSize: 12, color: '#92400e', fontFamily: ff }}>
                    The link expires in <strong>30 minutes</strong>. Check your spam folder if you don't see it.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px',
                    background: '#6366f1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: ff,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                >
                  <MdOpenInNew style={{ fontSize: 18 }} />
                  Open Email App
                </a>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || resent}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px',
                    background: '#fff',
                    color: resent ? '#22c55e' : '#374151',
                    border: `1.5px solid ${resent ? '#86efac' : '#e2e8f0'}`,
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: ff,
                    cursor: resending || resent ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <MdRefresh style={{ fontSize: 18, animation: resending ? 'spin 0.7s linear infinite' : 'none' }} />
                  {resent ? 'Resent!' : resending ? 'Resending…' : 'Resend Email'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/auth/login')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px',
                    background: '#f8fafc',
                    color: '#64748b',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: ff,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <MdArrowBack style={{ fontSize: 18 }} />
                  Back to Login
                </button>
              </div>
            </div>
          )}

          {/* Back to Home */}
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none', fontFamily: ff }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
