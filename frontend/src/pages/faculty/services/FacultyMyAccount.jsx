import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['Backup Codes', 'Change Password', 'Update Login ID']

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid #e2e8f0', fontSize: 14, color: TEXT,
  outline: 'none', boxSizing: 'border-box', background: '#fff',
}

// ─── Backup Codes ──────────────────────────────────────────────────────────────
const generateCodes = () =>
  Array.from({ length: 8 }, () =>
    Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
  )

function BackupCodesSection() {
  const [codes, setCodes] = useState(generateCodes())
  const [revealed, setRevealed] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [regenerated, setRegenerated] = useState(false)

  const handleRegenerate = () => {
    setShowWarning(false)
    setCodes(generateCodes())
    setRevealed(true)
    setRegenerated(true)
    setTimeout(() => setRegenerated(false), 3000)
  }

  return (
    <div>
      <div style={{ ...card, padding: 20, marginBottom: 20, background: '#fffbeb', border: '1px solid #fde68a' }}>
        <div style={{ fontWeight: 600, color: '#92400e', marginBottom: 4 }}>Important</div>
        <div style={{ fontSize: 13, color: '#78350f', lineHeight: 1.6 }}>
          Keep these backup codes in a safe place. Each code can only be used once. Use them if you lose access to your authentication device.
        </div>
      </div>

      {regenerated && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          New backup codes generated. Save them now!
        </div>
      )}

      <div style={{ ...card, padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>Your Backup Codes</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setRevealed(p => !p)}
              style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >{revealed ? 'Hide Codes' : 'Reveal Codes'}</button>
            <button
              onClick={() => {}}
              style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >Download</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {codes.map((code, i) => (
            <div key={i} style={{
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
              padding: '12px 0', textAlign: 'center', fontFamily: 'monospace',
              fontSize: 14, fontWeight: 700, color: revealed ? TEXT : '#d1d5db',
              letterSpacing: revealed ? 1 : 0,
            }}>
              {revealed ? code : '●●●●●●●●●'}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: 13, color: MUTED }}>Each code can only be used once.</div>
      </div>

      {showWarning ? (
        <div style={{ ...card, padding: 24, background: '#fff7ed', border: '1px solid #fed7aa' }}>
          <div style={{ fontWeight: 700, color: '#c2410c', marginBottom: 8, fontSize: 15 }}>Regenerate Backup Codes?</div>
          <div style={{ fontSize: 14, color: '#9a3412', marginBottom: 16, lineHeight: 1.6 }}>
            This will invalidate all existing backup codes. Make sure you are in a secure location and save the new codes immediately.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleRegenerate} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Yes, Regenerate
            </button>
            <button onClick={() => setShowWarning(false)} style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowWarning(true)}
          style={{ background: '#fff', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Regenerate Codes
        </button>
      )}
    </div>
  )
}

// ─── Change Password ───────────────────────────────────────────────────────────
function ChangePasswordSection() {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const getStrength = (pw) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    if (pw.length >= 12) score++
    return score
  }

  const strength = getStrength(form.newPass)
  const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][strength]
  const strengthColor = ['', '#ef4444', '#f97316', '#f59e0b', '#10b981', '#059669'][strength]

  const requirements = [
    { label: 'Minimum 8 characters', met: form.newPass.length >= 8 },
    { label: 'At least one uppercase letter', met: /[A-Z]/.test(form.newPass) },
    { label: 'At least one number', met: /[0-9]/.test(form.newPass) },
    { label: 'At least one special character', met: /[^A-Za-z0-9]/.test(form.newPass) },
    { label: 'Passwords match', met: form.newPass && form.newPass === form.confirm },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.newPass !== form.confirm) { setError('Passwords do not match.'); return }
    if (strength < 3) { setError('Password is too weak.'); return }
    setError('')
    setSaved(true)
    setForm({ current: '', newPass: '', confirm: '' })
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div style={{ maxWidth: 540 }}>
      <div style={{ ...card, padding: 28 }}>
        <h3 style={{ margin: '0 0 24px', fontSize: 15, fontWeight: 700, color: TEXT }}>Change Password</h3>
        {saved && <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>Password changed successfully!</div>}
        {error && <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#dc2626', fontWeight: 500, fontSize: 14 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Current Password *</label>
            <div style={{ position: 'relative' }}>
              <input type={showCurrent ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 44 }} value={form.current} onChange={e => setForm(p => ({ ...p, current: e.target.value }))} required />
              <button type="button" onClick={() => setShowCurrent(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 16 }}>
                {showCurrent ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>New Password *</label>
            <div style={{ position: 'relative' }}>
              <input type={showNew ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 44 }} value={form.newPass} onChange={e => setForm(p => ({ ...p, newPass: e.target.value }))} required />
              <button type="button" onClick={() => setShowNew(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 16 }}>
                {showNew ? '🙈' : '👁️'}
              </button>
            </div>
            {form.newPass && (
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} style={{ flex: 1, height: 4, borderRadius: 99, background: n <= strength ? strengthColor : '#e2e8f0', transition: 'background 0.3s' }} />
                  ))}
                </div>
                <div style={{ fontSize: 12, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</div>
              </div>
            )}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Confirm New Password *</label>
            <input type="password" style={inputStyle} value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} required />
          </div>
          <div style={{ ...card, padding: 16, marginBottom: 20, background: '#f8fafc' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, marginBottom: 10, textTransform: 'uppercase' }}>Requirements</div>
            {requirements.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: r.met ? '#10b981' : '#e2e8f0', fontSize: 16, fontWeight: 700 }}>{r.met ? '✓' : '○'}</span>
                <span style={{ color: r.met ? '#10b981' : MUTED }}>{r.label}</span>
              </div>
            ))}
          </div>
          <button type="submit" style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Update Login ID ───────────────────────────────────────────────────────────
function UpdateLoginIDSection() {
  const [tab, setTab] = useState('email')
  const [emailForm, setEmailForm] = useState({ current: 'faculty@vit.ac.in', newVal: '', otp: '', confirmed: false })
  const [mobileForm, setMobileForm] = useState({ current: '+91 98765 43210', newVal: '', otp: '', confirmed: false })
  const [otpSent, setOtpSent] = useState({ email: false, mobile: false })
  const [success, setSuccess] = useState('')

  const sendOtp = (type) => {
    setOtpSent(p => ({ ...p, [type]: true }))
  }

  const handleConfirm = (type) => {
    setSuccess(`${type === 'email' ? 'Email' : 'Mobile'} updated successfully!`)
    setTimeout(() => setSuccess(''), 3500)
  }

  const renderUpdateForm = (type) => {
    const form = type === 'email' ? emailForm : mobileForm
    const setForm = type === 'email' ? setEmailForm : setMobileForm
    const sent = otpSent[type]
    return (
      <div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Current {type === 'email' ? 'Email' : 'Mobile'}</label>
          <input style={{ ...inputStyle, background: '#f8fafc', color: MUTED }} value={form.current} readOnly />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>New {type === 'email' ? 'Email Address' : 'Mobile Number'} *</label>
          <input
            type={type === 'email' ? 'email' : 'tel'}
            style={inputStyle} value={form.newVal}
            onChange={e => setForm(p => ({ ...p, newVal: e.target.value }))}
            placeholder={type === 'email' ? 'Enter new email address' : 'Enter new mobile number'}
          />
        </div>
        {!sent ? (
          <button
            onClick={() => sendOtp(type)}
            disabled={!form.newVal}
            style={{
              background: form.newVal ? ACCENT : '#e2e8f0', color: form.newVal ? '#fff' : MUTED,
              border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 600,
              cursor: form.newVal ? 'pointer' : 'not-allowed', marginBottom: 18,
            }}
          >Send OTP</button>
        ) : (
          <div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Enter OTP *</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input style={{ ...inputStyle, flex: 1 }} value={form.otp} onChange={e => setForm(p => ({ ...p, otp: e.target.value }))} placeholder="6-digit OTP" maxLength={6} />
                <button onClick={() => sendOtp(type)} style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Resend
                </button>
              </div>
              <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>OTP sent to your new {type}.</div>
            </div>
            <button
              onClick={() => handleConfirm(type)}
              disabled={form.otp.length !== 6}
              style={{
                background: form.otp.length === 6 ? ACCENT : '#e2e8f0',
                color: form.otp.length === 6 ? '#fff' : MUTED,
                border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 600,
                cursor: form.otp.length === 6 ? 'pointer' : 'not-allowed',
              }}
            >Confirm Update</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 540 }}>
      {success && <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>{success}</div>}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
          {[['email', 'Update Email'], ['mobile', 'Update Mobile']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{
                flex: 1, padding: '13px 0', background: tab === key ? '#eef2ff' : '#fff',
                border: 'none', borderBottom: tab === key ? `2px solid ${ACCENT}` : '2px solid transparent',
                fontSize: 14, fontWeight: tab === key ? 700 : 400,
                color: tab === key ? ACCENT : TEXT, cursor: 'pointer',
              }}
            >{label}</button>
          ))}
        </div>
        <div style={{ padding: 28 }}>
          {renderUpdateForm(tab)}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyMyAccount() {
  const [activeNav, setActiveNav] = useState('Backup Codes')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Services — My Account</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Manage account security and credentials</p>
      </div>

      <div style={{ ...card, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: 210, borderRight: '1px solid #f1f5f9', padding: '16px 0', flexShrink: 0 }}>
          {navItems.map(item => (
            <button key={item} onClick={() => setActiveNav(item)}
              style={{
                display: 'block', width: '100%', padding: '11px 20px',
                background: activeNav === item ? '#eef2ff' : 'transparent',
                border: 'none', borderLeft: activeNav === item ? '3px solid #6366f1' : '3px solid transparent',
                textAlign: 'left', fontSize: 14, fontWeight: activeNav === item ? 600 : 400,
                color: activeNav === item ? ACCENT : TEXT, cursor: 'pointer',
              }}
            >{item}</button>
          ))}
        </div>
        <div style={{ flex: 1, padding: 28, minWidth: 0 }}>
          {activeNav === 'Backup Codes' && <BackupCodesSection />}
          {activeNav === 'Change Password' && <ChangePasswordSection />}
          {activeNav === 'Update Login ID' && <UpdateLoginIDSection />}
        </div>
      </div>
    </div>
  )
}
