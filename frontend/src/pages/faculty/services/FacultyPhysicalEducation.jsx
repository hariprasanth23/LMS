import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid #e2e8f0', fontSize: 14, color: TEXT,
  outline: 'none', boxSizing: 'border-box', background: '#fff',
}

const thStyle = {
  padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600,
  color: MUTED, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', background: '#f8fafc',
}
const tdStyle = { padding: '11px 14px', fontSize: 14, color: TEXT, borderBottom: '1px solid #f1f5f9' }

const facilities = [
  'Swimming Pool', 'Badminton Court', 'Basketball Court', 'Tennis Court',
  'Gymnasium', 'Football Ground', 'Yoga Hall', 'Table Tennis',
]

const timeSlots = [
  '06:00 – 07:00', '07:00 – 08:00', '17:00 – 18:00',
  '18:00 – 19:00', '19:00 – 20:00',
]

const slotsInfo = [
  { facility: 'Swimming Pool', available: 8, total: 20, morningSlots: 2, eveningSlots: 3 },
  { facility: 'Badminton Court', available: 4, total: 12, morningSlots: 2, eveningSlots: 3 },
  { facility: 'Gymnasium', available: 10, total: 30, morningSlots: 2, eveningSlots: 3 },
  { facility: 'Tennis Court', available: 2, total: 6, morningSlots: 1, eveningSlots: 2 },
]

const initialRegistrations = [
  { id: 'R001', wardName: 'Karthik R.', age: 14, gender: 'Male', facility: 'Swimming Pool', slot: '06:00 – 07:00', startDate: '2025-06-01', status: 'Active' },
  { id: 'R002', wardName: 'Ananya R.', age: 10, gender: 'Female', facility: 'Badminton Court', slot: '17:00 – 18:00', startDate: '2025-05-15', status: 'Active' },
]

export default function FacultyPhysicalEducation() {
  const [form, setForm] = useState({
    wardName: '', age: '', gender: 'Male', facility: facilities[0], slot: timeSlots[0], startDate: '',
  })
  const [registrations, setRegistrations] = useState(initialRegistrations)
  const [submitted, setSubmitted] = useState(false)
  const [cancelId, setCancelId] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const newReg = {
      id: 'R00' + (registrations.length + 3),
      wardName: form.wardName,
      age: Number(form.age),
      gender: form.gender,
      facility: form.facility,
      slot: form.slot,
      startDate: form.startDate,
      status: 'Active',
    }
    setRegistrations(prev => [newReg, ...prev])
    setForm({ wardName: '', age: '', gender: 'Male', facility: facilities[0], slot: timeSlots[0], startDate: '' })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleCancel = (id) => {
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'Cancelled' } : r))
    setCancelId(null)
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Services — Physical Education</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Employee Ward Facility Registration</p>
      </div>

      {/* Registration Form */}
      <div style={{ ...card, padding: 28, marginBottom: 28 }}>
        <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: TEXT }}>Register Ward for Sports Facility</h3>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: MUTED }}>
          Faculty members can register their wards (children / dependents) for sports and physical education facilities on campus.
        </p>

        {submitted && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 18, color: '#166534', fontWeight: 500, fontSize: 14 }}>
            Ward registered successfully! Registration is active.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Ward Name *</label>
              <input
                style={inputStyle} value={form.wardName} required
                onChange={e => setForm(p => ({ ...p, wardName: e.target.value }))}
                placeholder="Full name of ward"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Age *</label>
              <input
                type="number" min={5} max={25} style={inputStyle} value={form.age} required
                onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
                placeholder="Age in years"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Gender *</label>
              <select style={inputStyle} value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Facility *</label>
              <select style={inputStyle} value={form.facility} onChange={e => setForm(p => ({ ...p, facility: e.target.value }))}>
                {facilities.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Time Slot *</label>
              <select style={inputStyle} value={form.slot} onChange={e => setForm(p => ({ ...p, slot: e.target.value }))}>
                {timeSlots.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Start Date *</label>
              <input
                type="date" style={inputStyle} value={form.startDate} required
                onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
              />
            </div>
          </div>
          <button
            type="submit"
            style={{ marginTop: 22, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Register Ward
          </button>
        </form>
      </div>

      {/* Registered Wards Table */}
      <div style={{ ...card, overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: TEXT }}>Registered Wards</span>
          <span style={{ fontSize: 13, color: MUTED }}>{registrations.filter(r => r.status === 'Active').length} active registrations</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              {['ID', 'Ward Name', 'Age', 'Gender', 'Facility', 'Time Slot', 'Start Date', 'Status', 'Action'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registrations.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{r.id}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{r.wardName}</td>
                <td style={tdStyle}>{r.age}</td>
                <td style={tdStyle}>{r.gender}</td>
                <td style={tdStyle}>{r.facility}</td>
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 13 }}>{r.slot}</td>
                <td style={tdStyle}>{r.startDate}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: r.status === 'Active' ? '#dcfce7' : '#fee2e2',
                    color: r.status === 'Active' ? '#16a34a' : '#dc2626',
                  }}>
                    {r.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  {r.status === 'Active' ? (
                    cancelId === r.id ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handleCancel(r.id)}
                          style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                        >Confirm</button>
                        <button
                          onClick={() => setCancelId(null)}
                          style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}
                        >No</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCancelId(r.id)}
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    )
                  ) : (
                    <span style={{ fontSize: 12, color: MUTED }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Available Slots Info */}
      <div>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>Available Slots</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {slotsInfo.map((s, i) => {
            const pct = Math.round((s.available / s.total) * 100)
            return (
              <div key={i} style={{ ...card, padding: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{s.facility}</div>
                <div style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>
                  Morning slots: {s.morningSlots} &nbsp;·&nbsp; Evening slots: {s.eveningSlots}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: MUTED }}>Availability</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: pct > 40 ? '#16a34a' : '#dc2626' }}>
                    {s.available} / {s.total}
                  </span>
                </div>
                <div style={{ height: 8, background: '#e2e8f0', borderRadius: 99 }}>
                  <div style={{
                    height: '100%', width: `${pct}%`, borderRadius: 99,
                    background: pct > 40 ? '#16a34a' : '#dc2626',
                    transition: 'width 0.4s',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 4, textAlign: 'right' }}>{pct}% available</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
