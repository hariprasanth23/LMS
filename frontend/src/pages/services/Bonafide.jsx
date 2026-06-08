import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'
const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const statusColor = (s) => {
  if (s === 'Ready for Collection') return { color: '#16a34a', background: '#dcfce7', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
  if (s === 'Processing')           return { color: '#d97706', background: '#fef3c7', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
  return { color: MUTED, background: '#f1f5f9', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
}

export default function Bonafide() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ purpose: 'Higher Studies', addressedTo: '', description: '', language: 'English', copies: 1, urgency: 'Normal' })

  useEffect(() => {
    api.get('/services/bonafide')
      .then(r => setApplications(r.data.data || []))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.addressedTo.trim()) { toast.error('Please fill "Addressed To"'); return }
    setSubmitting(true)
    try {
      const res = await api.post('/services/bonafide', { ...form, copies: parseInt(form.copies) })
      setApplications(prev => [res.data.data, ...prev])
      setForm({ purpose: 'Higher Studies', addressedTo: '', description: '', language: 'English', copies: 1, urgency: 'Normal' })
      toast.success('Application submitted!')
    } catch {
      toast.error('Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Services — Bonafide Certificate</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Apply for bonafide certificate for various purposes</p>
      </div>

      <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 10, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18 }}>ℹ️</span>
        <span style={{ color: ACCENT, fontWeight: 500, fontSize: 14 }}>Bonafide certificate will be issued within 2 working days after submission.</span>
      </div>

      <div style={{ ...card, padding: 28, marginBottom: 28 }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>New Application</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Purpose *</label>
              <select name="purpose" value={form.purpose} onChange={handleChange} style={inputStyle}>
                {['Higher Studies', 'Visa/Passport', 'Bank Account', 'Scholarship', 'Internship', 'Railway Concession', 'Other'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Addressed To *</label>
              <input type="text" name="addressedTo" value={form.addressedTo} onChange={handleChange}
                placeholder="e.g. The Visa Officer" style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Description <span style={{ color: MUTED, fontWeight: 400 }}>(max 200 chars)</span></label>
              <textarea name="description" value={form.description} onChange={handleChange}
                maxLength={200} rows={3} placeholder="Brief description of your requirement..."
                style={{ ...inputStyle, resize: 'vertical' }} />
              <div style={{ textAlign: 'right', fontSize: 12, color: MUTED }}>{form.description.length}/200</div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 8 }}>Language</label>
              <div style={{ display: 'flex', gap: 20 }}>
                {['English', 'Tamil'].map(lang => (
                  <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: TEXT, cursor: 'pointer' }}>
                    <input type="radio" name="language" value={lang} checked={form.language === lang} onChange={handleChange} style={{ accentColor: ACCENT }} />
                    {lang}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Number of Copies</label>
              <input type="number" name="copies" value={form.copies} onChange={handleChange} min={1} max={5}
                style={{ width: 80, padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT }} />
              <span style={{ marginLeft: 8, fontSize: 13, color: MUTED }}>(1–5)</span>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 8 }}>Urgency</label>
              <div style={{ display: 'flex', gap: 24 }}>
                {[{ value: 'Normal', label: 'Normal (2 working days)' }, { value: 'Urgent', label: 'Urgent (same day, ₹50 extra)' }].map(opt => (
                  <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: TEXT, cursor: 'pointer' }}>
                    <input type="radio" name="urgency" value={opt.value} checked={form.urgency === opt.value} onChange={handleChange} style={{ accentColor: ACCENT }} />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" disabled={submitting}
            style={{ marginTop: 24, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            {submitting ? 'Submitting…' : 'Submit Application'}
          </button>
        </form>
      </div>

      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 18px', fontSize: 17, fontWeight: 700, color: TEXT }}>Previous Applications</h2>
        {loading ? (
          <div style={{ color: MUTED, fontSize: 14 }}>Loading…</div>
        ) : applications.length === 0 ? (
          <div style={{ color: MUTED, fontSize: 14 }}>No applications yet</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Application ID', 'Date Applied', 'Purpose', 'Copies', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app, i) => (
                  <tr key={app.id || i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{app.applicationNumber}</td>
                    <td style={{ padding: '12px 14px', color: TEXT }}>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN') : '—'}</td>
                    <td style={{ padding: '12px 14px', color: TEXT }}>{app.purpose}</td>
                    <td style={{ padding: '12px 14px', color: TEXT }}>{app.copies}</td>
                    <td style={{ padding: '12px 14px' }}><span style={statusColor(app.status)}>{app.status}</span></td>
                    <td style={{ padding: '12px 14px' }}>
                      {app.status === 'Ready for Collection'
                        ? <button style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac', borderRadius: 6, padding: '5px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Download</button>
                        : <span style={{ color: MUTED, fontSize: 13 }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ ...card, padding: 20, display: 'flex', gap: 32 }}>
        {[['2', 'Working Days (Normal)'], ['Same Day', 'Urgent (₹50 extra)'], ['Office Hours', '9 AM – 5 PM, Mon–Fri']].map(([val, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: ACCENT }}>{val}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
