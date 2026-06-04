import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdPerson, MdEmail, MdPhone, MdEdit, MdSave, MdClose } from 'react-icons/md'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

const roleColors = {
  ADMIN: { bg: '#fef2f2', color: '#ef4444' },
  FACULTY: { bg: '#eef2ff', color: '#6366f1' },
  STUDENT: { bg: '#f0fdf4', color: '#10b981' },
  STAFF: { bg: '#fffbeb', color: '#f59e0b' }
}

export default function Profile() {
  const { user, token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        const data = res.data.data
        setProfile(data)
        setForm({ name: data.name || '', email: data.email || '', phone: data.phone || '' })
      })
      .catch(() => {
        if (user) {
          setProfile(user)
          setForm({ name: user.name || '', email: user.email || '', phone: '' })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/auth/profile', form)
      toast.success('Profile updated successfully')
      setProfile(prev => ({ ...prev, ...form }))
      setEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 40, fontFamily: 'system-ui, sans-serif', color: MUTED }}>Loading profile...</div>
  )

  const rc = roleColors[profile?.role] || roleColors.STAFF
  const initials = (profile?.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0',
    borderRadius: 8, fontSize: 14, fontFamily: 'system-ui, sans-serif',
    color: TEXT, outline: 'none', boxSizing: 'border-box',
    background: editing ? '#fff' : '#f8fafc'
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>My Profile</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>View and manage your account information</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        {/* Avatar card */}
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 28, textAlign: 'center' }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: ACCENT, display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
            fontSize: 32, fontWeight: 700, color: '#fff', fontFamily: 'system-ui, sans-serif'
          }}>
            {initials}
          </div>

          <h2 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>
            {profile?.name}
          </h2>

          <span style={{
            display: 'inline-block',
            padding: '4px 14px', borderRadius: 20,
            fontSize: 12, fontWeight: 700, fontFamily: 'system-ui, sans-serif',
            background: rc.bg, color: rc.color
          }}>
            {profile?.role}
          </span>

          <div style={{ marginTop: 16, borderTop: '1px solid #f1f5f9', paddingTop: 16, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <MdEmail style={{ color: ACCENT, fontSize: 16 }} />
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED, wordBreak: 'break-all' }}>
                {profile?.email}
              </span>
            </div>
            {profile?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MdPhone style={{ color: ACCENT, fontSize: 16 }} />
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED }}>{profile.phone}</span>
              </div>
            )}
          </div>

          {profile?.createdAt && (
            <div style={{ marginTop: 14, borderTop: '1px solid #f1f5f9', paddingTop: 14, fontFamily: 'system-ui, sans-serif', fontSize: 11, color: MUTED }}>
              Member since {new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
            </div>
          )}
        </div>

        {/* Edit form */}
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>Account Information</h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>Update your personal details</p>
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', background: '#eef2ff', border: 'none',
                  borderRadius: 8, cursor: 'pointer', color: ACCENT,
                  fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif'
                }}
              >
                <MdEdit size={16} /> Edit
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setEditing(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px', background: '#f1f5f9', border: 'none',
                    borderRadius: 8, cursor: 'pointer', color: MUTED,
                    fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif'
                  }}
                >
                  <MdClose size={16} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px',
                    background: saving ? '#a5b4fc' : ACCENT,
                    border: 'none', borderRadius: 8, cursor: 'pointer',
                    color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif'
                  }}
                >
                  <MdSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: 0.5 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <MdPerson style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 16 }} />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  disabled={!editing}
                  style={{ ...inputStyle, paddingLeft: 36 }}
                  onFocus={e => editing && (e.target.style.borderColor = ACCENT)}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: 0.5 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <MdEmail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 16 }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  disabled={!editing}
                  style={{ ...inputStyle, paddingLeft: 36 }}
                  onFocus={e => editing && (e.target.style.borderColor = ACCENT)}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: 0.5 }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <MdPhone style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 16 }} />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  disabled={!editing}
                  placeholder={editing ? 'Enter phone number' : 'Not provided'}
                  style={{ ...inputStyle, paddingLeft: 36 }}
                  onFocus={e => editing && (e.target.style.borderColor = ACCENT)}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: 0.5 }}>Role</label>
              <input
                type="text"
                value={profile?.role || ''}
                disabled
                style={{ ...inputStyle, background: '#f8fafc', color: MUTED }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              { label: 'Account Status', value: 'Active', color: '#10b981', bg: '#f0fdf4' },
              { label: 'Role', value: profile?.role, color: rc.color, bg: rc.bg },
              { label: 'User ID', value: (profile?.userId || profile?.id || '').toString().slice(0, 8) + '...', color: MUTED, bg: '#f8fafc' }
            ].map(item => (
              <div key={item.label} style={{ background: item.bg, borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: item.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, fontWeight: 700, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
