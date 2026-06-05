import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const NAV_ITEMS = ['Backup Codes', 'Change Password', 'Update Login ID']

const BACKUP_CODES_DATA = [
  'A3F7-KW92', 'B8N1-PQ45', 'C2M6-RZ83', 'D5T0-XJ17',
  'E9Y4-VL36', 'F1K8-WN60', 'G6Q3-CS94', 'H0J5-DP28',
]

const updateHistory = [
  { field: 'Email', old: 'arjun.old@email.com', new: 'arjun.kumar@student.edu.in', date: '2023-09-10', by: 'Self' },
  { field: 'Mobile', old: '+91 9876543000', new: '+91 9876543210', date: '2024-01-15', by: 'Self' },
]

function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '', color: '#e2e8f0' }
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  if (score <= 1) return { level: 1, label: 'Weak', color: '#ef4444' }
  if (score === 2) return { level: 2, label: 'Medium', color: '#f59e0b' }
  if (score >= 3) return { level: 3, label: 'Strong', color: '#10b981' }
}

export default function MyAccount() {
  const [active, setActive] = useState('Backup Codes')

  const [codesRevealed, setCodesRevealed] = useState(false)
  const [codes] = useState(BACKUP_CODES_DATA)

  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' })
  const [showPass, setShowPass] = useState({ current: false, newPass: false, confirm: false })

  const [loginTab, setLoginTab] = useState('email')
  const [emailForm, setEmailForm] = useState({ current: 'arjun.kumar@student.edu.in', newEmail: '', otp: '', otpSent: false })
  const [mobileForm, setMobileForm] = useState({ current: '+91 9876543210', newMobile: '', otp: '', otpSent: false })

  const strength = getPasswordStrength(passForm.newPass)

  const navStyle = (item) => ({
    padding: '10px 18px',
    cursor: 'pointer',
    fontSize: 14,
    borderLeft: active === item ? '3px solid #6366f1' : '3px solid transparent',
    background: active === item ? '#eef2ff' : 'transparent',
    color: active === item ? ACCENT : TEXT,
    fontWeight: active === item ? 600 : 400,
    transition: 'all 0.15s',
    userSelect: 'none',
  })

  const card = {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  }

  const btn = (variant = 'primary', extra = {}) => ({
    padding: '8px 18px',
    borderRadius: 8,
    border: variant === 'outline' ? '1px solid #e2e8f0' : 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    background: variant === 'primary' ? ACCENT : variant === 'danger' ? '#ef4444' : variant === 'success' ? '#10b981' : variant === 'warning' ? '#f59e0b' : '#f1f5f9',
    color: ['primary', 'danger', 'success', 'warning'].includes(variant) ? '#fff' : TEXT,
    ...extra,
  })

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    fontSize: 14,
    color: TEXT,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const thStyle = {
    padding: '10px 14px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 600,
    color: MUTED,
    textTransform: 'uppercase',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc',
  }

  const tdStyle = {
    padding: '12px 14px',
    fontSize: 14,
    color: TEXT,
    borderBottom: '1px solid #f1f5f9',
  }

  const PasswordInput = ({ label, field, value, show, onToggle, onChange, placeholder }) => (
    <div>
      <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          style={{ ...inputStyle, paddingRight: 44 }}
          value={value}
          onChange={onChange}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 16, color: MUTED, padding: 0,
          }}
        >
          {show ? '🙈' : '👁'}
        </button>
      </div>
    </div>
  )

  const renderBackupCodes = () => (
    <div>
      <div style={{ ...card, padding: '14px 20px', marginBottom: 20, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 20, marginTop: 1 }}>ℹ️</div>
        <div style={{ fontSize: 13, color: '#1e40af', lineHeight: 1.6 }}>
          Each backup code can only be used <strong>once</strong> to sign in when you don't have access to your authenticator app.
          Store them in a safe place. Do not share with anyone.
        </div>
      </div>

      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: TEXT }}>Your Backup Codes</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={btn('outline')} onClick={() => setCodesRevealed(!codesRevealed)}>
              {codesRevealed ? 'Hide Codes' : 'Reveal Codes'}
            </button>
            <button style={btn('outline')}>⬇ Download Codes</button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 20,
        }}>
          {codes.map((code, i) => (
            <div
              key={i}
              style={{
                background: codesRevealed ? '#f0fdf4' : '#f1f5f9',
                borderRadius: 10,
                padding: '14px 12px',
                textAlign: 'center',
                border: codesRevealed ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                fontFamily: 'monospace',
                fontSize: 15,
                fontWeight: 700,
                color: codesRevealed ? '#166534' : '#94a3b8',
                letterSpacing: 1,
                filter: codesRevealed ? 'none' : 'blur(5px)',
                userSelect: codesRevealed ? 'text' : 'none',
                transition: 'filter 0.3s, color 0.3s',
              }}
            >
              {code}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
          <div style={{ ...card, padding: '14px 18px', background: '#fff7ed', border: '1px solid #fed7aa', marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: '#92400e', fontWeight: 500 }}>
              Regenerating codes will invalidate all existing backup codes. Make sure to save the new ones immediately.
            </div>
          </div>
          <button style={btn('warning')}>Regenerate Codes</button>
        </div>
      </div>
    </div>
  )

  const renderChangePassword = () => {
    const checks = [
      { label: 'Minimum 8 characters', pass: passForm.newPass.length >= 8 },
      { label: 'At least one uppercase letter', pass: /[A-Z]/.test(passForm.newPass) },
      { label: 'At least one number', pass: /[0-9]/.test(passForm.newPass) },
      { label: 'At least one special character', pass: /[^a-zA-Z0-9]/.test(passForm.newPass) },
    ]

    return (
      <div>
        <div style={{ ...card, padding: 28, maxWidth: 480 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 24, color: TEXT }}>Change Password</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
            <PasswordInput
              label="Current Password"
              field="current"
              value={passForm.current}
              show={showPass.current}
              onToggle={() => setShowPass(s => ({ ...s, current: !s.current }))}
              onChange={e => setPassForm(f => ({ ...f, current: e.target.value }))}
            />
            <PasswordInput
              label="New Password"
              field="newPass"
              value={passForm.newPass}
              show={showPass.newPass}
              onToggle={() => setShowPass(s => ({ ...s, newPass: !s.newPass }))}
              onChange={e => setPassForm(f => ({ ...f, newPass: e.target.value }))}
            />

            {passForm.newPass && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: MUTED }}>Password Strength</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: strength.color }}>{strength.label}</span>
                </div>
                <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(strength.level / 3) * 100}%`,
                    background: strength.color,
                    borderRadius: 3,
                    transition: 'width 0.3s, background 0.3s',
                  }} />
                </div>
              </div>
            )}

            <PasswordInput
              label="Confirm New Password"
              field="confirm"
              value={passForm.confirm}
              show={showPass.confirm}
              onToggle={() => setShowPass(s => ({ ...s, confirm: !s.confirm }))}
              onChange={e => setPassForm(f => ({ ...f, confirm: e.target.value }))}
            />
          </div>

          {passForm.newPass && (
            <div style={{ background: BG, borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 10 }}>Requirements</div>
              {checks.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, color: c.pass ? '#16a34a' : '#cbd5e1' }}>
                    {c.pass ? '✅' : '⬜'}
                  </span>
                  <span style={{ fontSize: 13, color: c.pass ? TEXT : MUTED }}>{c.label}</span>
                </div>
              ))}
            </div>
          )}

          {passForm.confirm && passForm.newPass && passForm.newPass !== passForm.confirm && (
            <div style={{ padding: '10px 14px', background: '#fee2e2', borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#dc2626' }}>
              Passwords do not match.
            </div>
          )}

          <button
            style={btn('primary', {
              width: '100%',
              padding: '11px',
              fontSize: 14,
              opacity: checks.every(c => c.pass) && passForm.current && passForm.newPass === passForm.confirm ? 1 : 0.6,
            })}
            disabled={!checks.every(c => c.pass) || !passForm.current || passForm.newPass !== passForm.confirm}
          >
            Update Password
          </button>
        </div>
      </div>
    )
  }

  const renderUpdateLoginID = () => (
    <div>
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: '#f1f5f9', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {['email', 'mobile'].map(tab => (
          <button
            key={tab}
            onClick={() => setLoginTab(tab)}
            style={{
              padding: '8px 24px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              background: loginTab === tab ? '#fff' : 'transparent',
              color: loginTab === tab ? TEXT : MUTED,
              boxShadow: loginTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {tab === 'email' ? 'Update Email' : 'Update Mobile'}
          </button>
        ))}
      </div>

      {loginTab === 'email' ? (
        <div style={{ ...card, padding: 28, maxWidth: 440, marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 20, color: TEXT }}>Update Registered Email</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Current Email</label>
              <input style={{ ...inputStyle, background: '#f8fafc', color: MUTED }} value={emailForm.current} readOnly />
            </div>
            <div>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>New Email Address</label>
              <input
                style={inputStyle}
                type="email"
                placeholder="Enter new email address"
                value={emailForm.newEmail}
                onChange={e => setEmailForm(f => ({ ...f, newEmail: e.target.value }))}
              />
            </div>

            {!emailForm.otpSent ? (
              <button
                style={btn('primary', { alignSelf: 'flex-start' })}
                onClick={() => setEmailForm(f => ({ ...f, otpSent: true }))}
                disabled={!emailForm.newEmail}
              >
                Send OTP
              </button>
            ) : (
              <div>
                <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Enter OTP</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    style={{ ...inputStyle, maxWidth: 160, letterSpacing: 6, textAlign: 'center', fontSize: 18, fontWeight: 700 }}
                    placeholder="------"
                    maxLength={6}
                    value={emailForm.otp}
                    onChange={e => setEmailForm(f => ({ ...f, otp: e.target.value }))}
                  />
                  <button style={btn('outline')} onClick={() => setEmailForm(f => ({ ...f, otp: '' }))}>Resend</button>
                </div>
                <div style={{ fontSize: 12, color: '#16a34a', marginTop: 6 }}>OTP sent to {emailForm.newEmail}</div>
              </div>
            )}
          </div>

          {emailForm.otpSent && (
            <button style={btn('success', { width: '100%', padding: '11px' })} disabled={emailForm.otp.length < 6}>
              Confirm Update
            </button>
          )}
        </div>
      ) : (
        <div style={{ ...card, padding: 28, maxWidth: 440, marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 20, color: TEXT }}>Update Registered Mobile</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Current Mobile</label>
              <input style={{ ...inputStyle, background: '#f8fafc', color: MUTED }} value={mobileForm.current} readOnly />
            </div>
            <div>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>New Mobile Number</label>
              <input
                style={inputStyle}
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={mobileForm.newMobile}
                onChange={e => setMobileForm(f => ({ ...f, newMobile: e.target.value }))}
              />
            </div>

            {!mobileForm.otpSent ? (
              <button
                style={btn('primary', { alignSelf: 'flex-start' })}
                onClick={() => setMobileForm(f => ({ ...f, otpSent: true }))}
                disabled={!mobileForm.newMobile}
              >
                Send OTP
              </button>
            ) : (
              <div>
                <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Enter OTP</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    style={{ ...inputStyle, maxWidth: 160, letterSpacing: 6, textAlign: 'center', fontSize: 18, fontWeight: 700 }}
                    placeholder="------"
                    maxLength={6}
                    value={mobileForm.otp}
                    onChange={e => setMobileForm(f => ({ ...f, otp: e.target.value }))}
                  />
                  <button style={btn('outline')} onClick={() => setMobileForm(f => ({ ...f, otp: '' }))}>Resend</button>
                </div>
                <div style={{ fontSize: 12, color: '#16a34a', marginTop: 6 }}>OTP sent to {mobileForm.newMobile}</div>
              </div>
            )}
          </div>

          {mobileForm.otpSent && (
            <button style={btn('success', { width: '100%', padding: '11px' })} disabled={mobileForm.otp.length < 6}>
              Confirm Update
            </button>
          )}
        </div>
      )}

      <div style={{ fontWeight: 600, fontSize: 14, color: TEXT, marginBottom: 12 }}>Update History</div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Field', 'Old Value', 'New Value', 'Date', 'Updated By'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {updateHistory.map((u, i) => (
              <tr key={i}>
                <td style={tdStyle}><span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 12, background: '#eef2ff', color: ACCENT }}>{u.field}</span></td>
                <td style={{ ...tdStyle, color: MUTED, fontSize: 13 }}>{u.old}</td>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{u.new}</td>
                <td style={tdStyle}>{u.date}</td>
                <td style={tdStyle}>{u.by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const contentMap = {
    'Backup Codes': renderBackupCodes,
    'Change Password': renderChangePassword,
    'Update Login ID': renderUpdateLoginID,
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: TEXT, margin: 0, marginBottom: 4 }}>Services — My Account</h1>
        <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>Manage your account security and login credentials</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', minHeight: 520 }}>
        <div style={{ width: 210, borderRight: '1px solid #e2e8f0', paddingTop: 8, paddingBottom: 8, flexShrink: 0 }}>
          {NAV_ITEMS.map(item => (
            <div key={item} style={navStyle(item)} onClick={() => setActive(item)}>
              {item}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: TEXT, marginBottom: 20 }}>{active}</div>
          {contentMap[active]?.()}
        </div>
      </div>
    </div>
  )
}
