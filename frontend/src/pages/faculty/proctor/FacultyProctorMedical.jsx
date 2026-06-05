import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['Recommendation']

// ─── Sample proctee data for search ──────────────────────────────────────────
const procteeData = {
  'CB22CS001': { name: 'Arun Kumar', dept: 'CSE', sem: 6, dob: '2003-04-12', blood: 'O+', hostel: 'Block A, Room 104' },
  'CB22CS002': { name: 'Priya Nair', dept: 'CSE', sem: 6, dob: '2003-08-22', blood: 'A+', hostel: 'Day Scholar' },
  'CB22CS003': { name: 'Rahul Verma', dept: 'CSE', sem: 6, dob: '2003-02-05', blood: 'B+', hostel: 'Block A, Room 210' },
  'CB22ME004': { name: 'Sneha Rajan', dept: 'MECH', sem: 4, dob: '2004-06-18', blood: 'AB+', hostel: 'Block B, Room 201' },
  'CB22ME005': { name: 'Karthik Raj', dept: 'MECH', sem: 4, dob: '2004-01-30', blood: 'O-', hostel: 'Day Scholar' },
  'CB22EC010': { name: 'Meera Pillai', dept: 'ECE', sem: 4, dob: '2004-11-07', blood: 'A-', hostel: 'Block C, Room 305' },
  'CB22EE007': { name: 'Arjun Singh', dept: 'EEE', sem: 2, dob: '2005-03-14', blood: 'B-', hostel: 'Block B, Room 112' },
  'CB22IT008': { name: 'Lakshmi Devi', dept: 'IT', sem: 6, dob: '2003-09-25', blood: 'O+', hostel: 'Block C, Room 314' },
}

// ─── Past recommendations history ─────────────────────────────────────────────
const pastRecommendations = [
  { student: 'Arun Kumar', roll: 'CB22CS001', date: '2024-04-10', issue: 'Chronic Illness', action: 'Doctor Visit', status: 'Acted' },
  { student: 'Rahul Verma', roll: 'CB22CS003', date: '2024-03-22', issue: 'Mental Health', action: 'Counseling', status: 'Closed' },
  { student: 'Meera Pillai', roll: 'CB22EC010', date: '2024-05-01', issue: 'Injury', action: 'Rest', status: 'Pending' },
  { student: 'Sneha Rajan', roll: 'CB22ME004', date: '2024-05-18', issue: 'General', action: 'Doctor Visit', status: 'Acted' },
  { student: 'Arjun Singh', roll: 'CB22EE007', date: '2024-05-29', issue: 'Mental Health', action: 'Counseling', status: 'Pending' },
]

const statusColor = {
  Pending: { bg: '#fef3c7', color: '#92400e' },
  Acted: { bg: '#dbeafe', color: '#1e40af' },
  Closed: { bg: '#dcfce7', color: '#15803d' },
}

const severityColor = {
  Low: { bg: '#f0fdf4', color: '#16a34a' },
  Medium: { bg: '#fef3c7', color: '#d97706' },
  High: { bg: '#fee2e2', color: '#dc2626' },
  Emergency: { bg: '#fecaca', color: '#991b1b' },
}

// ─── Recommendation ───────────────────────────────────────────────────────────
function Recommendation() {
  const [searchRoll, setSearchRoll] = useState('')
  const [student, setStudent] = useState(null)
  const [foundRoll, setFoundRoll] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    issue: 'General',
    description: '',
    severity: 'Low',
    action: 'Rest',
    notes: '',
    urgency: 'Within Week',
  })

  const handleSearch = () => {
    const key = searchRoll.trim().toUpperCase()
    const data = procteeData[key]
    if (data) {
      setStudent(data)
      setFoundRoll(key)
      setSubmitted(false)
    } else {
      setStudent(null)
      setFoundRoll('')
      alert('Proctee not found. Try: CB22CS001, CB22CS002, CB22CS003, CB22ME004, CB22EC010, CB22EE007, CB22IT008')
    }
  }

  const handleChange = (field, value) => setForm(p => ({ ...p, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setForm({ issue: 'General', description: '', severity: 'Low', action: 'Rest', notes: '', urgency: 'Within Week' })
    setStudent(null)
    setSearchRoll('')
    setFoundRoll('')
  }

  const sc = severityColor[form.severity] || severityColor.Low

  return (
    <div>
      <h2 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: TEXT }}>Recommendation</h2>
      <p style={{ margin: '0 0 24px', fontSize: 14, color: MUTED }}>Search a proctee by roll number, fill in the medical recommendation form, and submit to the health center.</p>

      {/* Search */}
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Search Proctee by Roll Number</label>
            <input
              type="text"
              value={searchRoll}
              onChange={e => setSearchRoll(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. CB22CS001"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }}
            />
          </div>
          <button
            onClick={handleSearch}
            style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >Search</button>
        </div>
      </div>

      {/* Success banner */}
      {submitted && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 10, padding: '14px 20px', marginBottom: 20, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          Recommendation submitted successfully to the Health Center. The student and health staff have been notified.
        </div>
      )}

      {/* Student Info + Form */}
      {student && (
        <div style={{ ...card, padding: 24, marginBottom: 24 }}>
          {/* Student basic info */}
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 18, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>👤</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: TEXT, fontSize: 16, marginBottom: 4 }}>{student.name}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 24px', fontSize: 13 }}>
                {[
                  ['Roll No', foundRoll],
                  ['Department', student.dept],
                  ['Semester', student.sem],
                  ['Date of Birth', student.dob],
                  ['Blood Group', student.blood],
                  ['Hostel/Day', student.hostel],
                ].map(([k, v]) => (
                  <span key={k}><span style={{ color: MUTED }}>{k}: </span><span style={{ color: TEXT, fontWeight: 600 }}>{v}</span></span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendation Form */}
          <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Medical Recommendation Form</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Medical Issue */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Medical Issue</label>
                <select
                  value={form.issue}
                  onChange={e => handleChange('issue', e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}
                >
                  {['Chronic Illness', 'Injury', 'Mental Health', 'General', 'Other'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Severity */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Severity</label>
                <select
                  value={form.severity}
                  onChange={e => handleChange('severity', e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${sc.color}30`, fontSize: 14, color: sc.color, background: sc.bg, boxSizing: 'border-box', fontWeight: 600 }}
                >
                  {['Low', 'Medium', 'High', 'Emergency'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Description */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                  required
                  rows={3}
                  placeholder="Describe the medical condition or symptoms observed..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              {/* Recommended Action */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Recommended Action</label>
                <select
                  value={form.action}
                  onChange={e => handleChange('action', e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}
                >
                  {['Rest', 'Doctor Visit', 'Hospitalization', 'Counseling', 'Other'].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Urgency</label>
                <select
                  value={form.urgency}
                  onChange={e => handleChange('urgency', e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}
                >
                  {['Immediate', 'Within 24hrs', 'Within Week'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>

              {/* Additional Notes */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Additional Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => handleChange('notes', e.target.value)}
                  rows={2}
                  placeholder="Any additional information for the health center..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Severity preview badge */}
            {form.severity === 'Emergency' && (
              <div style={{ marginTop: 14, background: '#fecaca', border: '1px solid #f87171', borderRadius: 8, padding: '10px 16px', color: '#991b1b', fontSize: 13, fontWeight: 600 }}>
                Emergency severity selected — submission will immediately alert the campus health center and warden.
              </div>
            )}

            <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
              <button
                type="submit"
                style={{ background: form.severity === 'Emergency' ? '#dc2626' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                Submit to Health Center
              </button>
              <button
                type="button"
                onClick={() => { setStudent(null); setSearchRoll(''); setFoundRoll('') }}
                style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Past Recommendations History */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px 12px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>Past Recommendations History</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Student', 'Roll No', 'Date', 'Issue', 'Recommended Action', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pastRecommendations.map((r, i) => {
              const sc = statusColor[r.status] || statusColor.Pending
              return (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{r.student}</td>
                  <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{r.roll}</td>
                  <td style={{ padding: '12px 14px', color: MUTED, fontSize: 13 }}>{r.date}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{r.issue}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{r.action}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: sc.bg, color: sc.color, borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>{r.status}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
const contentMap = {
  'Recommendation': Recommendation,
}

export default function FacultyProctorMedical() {
  const [activeNav, setActiveNav] = useState('Recommendation')
  const ActiveComponent = contentMap[activeNav] || (() => <div style={{ color: MUTED }}>Coming soon.</div>)

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Proctor — Student Medical Info</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>View and recommend medical assistance for proctees</p>
      </div>

      {/* Card: left nav + content */}
      <div style={{ ...card, display: 'flex', overflow: 'hidden' }}>
        {/* Left Nav */}
        <div style={{ width: 210, borderRight: '1px solid #f1f5f9', padding: '16px 0', flexShrink: 0 }}>
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 20px',
                background: activeNav === item ? '#eef2ff' : 'transparent',
                border: 'none',
                borderLeft: activeNav === item ? '3px solid #6366f1' : '3px solid transparent',
                textAlign: 'left',
                fontSize: 13,
                fontWeight: activeNav === item ? 600 : 400,
                color: activeNav === item ? ACCENT : TEXT,
                cursor: 'pointer',
                lineHeight: 1.4,
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 28, minWidth: 0, overflowY: 'auto' }}>
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}
