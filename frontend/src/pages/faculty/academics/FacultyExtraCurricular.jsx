import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['ECA - WorkLoad', 'ECA - Faculty', 'ECA - Student']

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid #e2e8f0', fontSize: 14, color: TEXT,
  outline: 'none', boxSizing: 'border-box', background: '#fff',
}

const thStyle = {
  padding: '10px 14px', textAlign: 'left', fontSize: 12,
  fontWeight: 600, color: MUTED, textTransform: 'uppercase',
  borderBottom: '1px solid #e2e8f0', background: '#f8fafc',
}

const tdStyle = { padding: '12px 14px', fontSize: 14, color: TEXT, borderBottom: '1px solid #f1f5f9' }

const ecaCategories = ['Sports', 'Cultural', 'Technical', 'NSS', 'NCC', 'Literary']
const ecaRoles = ['Coordinator', 'Co-Coordinator', 'Judge', 'Mentor']
const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6']

const workloadData = [
  { activity: 'Inter-College Hackathon 2025', category: 'Technical', role: 'Coordinator', hoursWeek: 4, semester: 'Semester 6' },
  { activity: 'Annual Sports Day', category: 'Sports', role: 'Judge', hoursWeek: 2, semester: 'Semester 6' },
  { activity: 'Literary Club — Debate Series', category: 'Literary', role: 'Mentor', hoursWeek: 1, semester: 'Semester 5' },
  { activity: 'NSS Special Camp', category: 'NSS', role: 'Co-Coordinator', hoursWeek: 3, semester: 'Semester 4' },
]

const conductedECAs = [
  { activity: 'CodeFest 2025', date: '2025-04-12', participants: 85, outcome: 'Top 3 teams won prizes; 2 projects shortlisted for national round.', report: 'codefest_report.pdf' },
  { activity: 'Technical Quiz — Zonal', date: '2025-02-20', participants: 40, outcome: 'College team qualified for state-level competition.', report: 'quiz_report.pdf' },
]

const studentECAs = {
  '20BCE0011': {
    name: 'Karthik Rajan',
    activities: [
      { activity: 'Inter-College Debate', date: '2025-03-10', achievement: '2nd Place', certificate: true, points: null, remarks: '', status: 'Pending' },
      { activity: 'NSS Blood Donation Drive', date: '2025-02-05', achievement: 'Participated', certificate: false, points: 6, remarks: 'Active participant', status: 'Approved' },
    ],
  },
  '20BCE0042': {
    name: 'Priya Sharma',
    activities: [
      { activity: 'Hackathon — Smart India', date: '2025-04-15', achievement: 'Finalist', certificate: true, points: null, remarks: '', status: 'Pending' },
      { activity: 'Cultural Fest — Dance', date: '2025-01-20', achievement: '1st Place', certificate: true, points: 9, remarks: 'Excellent performance', status: 'Approved' },
    ],
  },
}

const categoryColor = (cat) => {
  const map = {
    Sports: { bg: '#dbeafe', color: '#1d4ed8' },
    Cultural: { bg: '#fce7f3', color: '#db2777' },
    Technical: { bg: '#f5f3ff', color: '#7c3aed' },
    NSS: { bg: '#dcfce7', color: '#16a34a' },
    NCC: { bg: '#fef3c7', color: '#d97706' },
    Literary: { bg: '#fee2e2', color: '#dc2626' },
  }
  const s = map[cat] || { bg: '#f1f5f9', color: MUTED }
  return <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{cat}</span>
}

// ─── ECA WorkLoad ──────────────────────────────────────────────────────────────
function ECAWorkLoadSection() {
  const [assignments, setAssignments] = useState(workloadData)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ activity: '', category: 'Sports', role: 'Coordinator', hoursWeek: '', semester: 'Semester 6' })
  const [saved, setSaved] = useState(false)

  const totalHours = assignments.reduce((s, a) => s + a.hoursWeek, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    setAssignments(prev => [...prev, { ...form, hoursWeek: Number(form.hoursWeek) }])
    setSaved(true)
    setForm({ activity: '', category: 'Sports', role: 'Coordinator', hoursWeek: '', semester: 'Semester 6' })
    setTimeout(() => { setSaved(false); setShowForm(false) }, 2500)
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ ...card, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: ACCENT }}>{totalHours}</div>
          <div style={{ fontSize: 13, color: MUTED }}>Total ECA Load Hours / Week</div>
        </div>
        <div style={{ ...card, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>{assignments.length}</div>
          <div style={{ fontSize: 13, color: MUTED }}>Active ECA Assignments</div>
        </div>
      </div>

      <div style={{ ...card, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: TEXT }}>ECA Coordination Responsibilities</span>
          <button onClick={() => setShowForm(!showForm)}
            style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            + Add ECA
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Activity Name', 'Category', 'Role', 'Hours/Week', 'Semester'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {assignments.map((a, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{a.activity}</td>
                <td style={tdStyle}>{categoryColor(a.category)}</td>
                <td style={tdStyle}>
                  <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#f1f5f9', color: MUTED }}>{a.role}</span>
                </td>
                <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{a.hoursWeek} hrs</td>
                <td style={tdStyle}>{a.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={{ ...card, padding: 24, border: '1px solid #e0e7ff' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: 14, fontWeight: 700, color: TEXT }}>New ECA Assignment</h3>
          {saved && <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '9px 14px', marginBottom: 14, color: '#166534', fontSize: 13, fontWeight: 500 }}>Assignment added!</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 5 }}>Activity Name *</label>
                <input style={inputStyle} value={form.activity} onChange={e => setForm(p => ({ ...p, activity: e.target.value }))} required />
              </div>
              {[
                { label: 'Category', key: 'category', options: ecaCategories },
                { label: 'Role', key: 'role', options: ecaRoles },
                { label: 'Semester', key: 'semester', options: semesters },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 5 }}>{label}</label>
                  <select style={inputStyle} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}>
                    {options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 5 }}>Hours/Week *</label>
                <input type="number" min={1} max={20} style={inputStyle} value={form.hoursWeek} onChange={e => setForm(p => ({ ...p, hoursWeek: e.target.value }))} required />
              </div>
            </div>
            <button type="submit" style={{ marginTop: 16, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
          </form>
        </div>
      )}
    </div>
  )
}

// ─── ECA Faculty ───────────────────────────────────────────────────────────────
function ECAFacultySection() {
  const [history, setHistory] = useState(conductedECAs)
  const [form, setForm] = useState({ activity: '', date: '', participants: '', outcome: '', report: null })
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setHistory(prev => [{ ...form, participants: Number(form.participants), report: form.report?.name || null }, ...prev])
    setSaved(true)
    setForm({ activity: '', date: '', participants: '', outcome: '', report: null })
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Log Conducted ECA</h3>
        {saved && <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '9px 14px', marginBottom: 14, color: '#166534', fontSize: 13, fontWeight: 500 }}>ECA logged successfully!</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Activity Name *</label>
              <input style={inputStyle} value={form.activity} onChange={e => setForm(p => ({ ...p, activity: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Date *</label>
              <input type="date" style={inputStyle} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Participants Count *</label>
              <input type="number" min={1} style={inputStyle} value={form.participants} onChange={e => setForm(p => ({ ...p, participants: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Report Upload</label>
              <input type="file" style={{ ...inputStyle, padding: '7px 12px' }} onChange={e => setForm(p => ({ ...p, report: e.target.files[0] }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Outcome *</label>
              <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.outcome} onChange={e => setForm(p => ({ ...p, outcome: e.target.value }))} required />
            </div>
          </div>
          <button type="submit" style={{ marginTop: 16, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Log ECA</button>
        </form>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>History of Conducted ECAs</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Activity', 'Date', 'Participants', 'Outcome', 'Report'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{h.activity}</td>
                <td style={tdStyle}>{h.date}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT, textAlign: 'center' }}>{h.participants}</td>
                <td style={{ ...tdStyle, maxWidth: 280, fontSize: 13 }}>{h.outcome}</td>
                <td style={tdStyle}>
                  {h.report
                    ? <button style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Download</button>
                    : <span style={{ color: MUTED, fontSize: 12 }}>—</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── ECA Student ───────────────────────────────────────────────────────────────
function ECAStudentSection() {
  const [rollNo, setRollNo] = useState('')
  const [searched, setSearched] = useState(null)
  const [studentActivities, setStudentActivities] = useState(studentECAs)
  const [gradingIndex, setGradingIndex] = useState(null)
  const [gradeForm, setGradeForm] = useState({ points: '', remarks: '' })

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmed = rollNo.trim().toUpperCase()
    setSearched(studentActivities[trimmed] ? { rollNo: trimmed, ...studentActivities[trimmed] } : null)
    setGradingIndex(null)
  }

  const handleGrade = (actIndex, action) => {
    const key = searched.rollNo
    setStudentActivities(prev => {
      const updated = { ...prev }
      updated[key] = {
        ...updated[key],
        activities: updated[key].activities.map((a, i) => i === actIndex
          ? { ...a, points: Number(gradeForm.points), remarks: gradeForm.remarks, status: action }
          : a
        ),
      }
      return updated
    })
    setSearched(prev => ({
      ...prev,
      activities: prev.activities.map((a, i) => i === actIndex
        ? { ...a, points: Number(gradeForm.points), remarks: gradeForm.remarks, status: action }
        : a
      ),
    }))
    setGradingIndex(null)
    setGradeForm({ points: '', remarks: '' })
  }

  const approvedActivities = searched?.activities.filter(a => a.status === 'Approved') || []
  const totalPoints = approvedActivities.reduce((s, a) => s + (a.points || 0), 0)

  return (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <form onSubmit={handleSearch}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Search by Student Roll No</label>
          <div style={{ display: 'flex', gap: 12 }}>
            <input style={{ ...inputStyle, maxWidth: 300 }} value={rollNo} onChange={e => setRollNo(e.target.value)} placeholder="e.g. 20BCE0011" />
            <button type="submit" style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Search</button>
          </div>
        </form>
        {rollNo && !searched && <p style={{ marginTop: 10, fontSize: 13, color: '#dc2626' }}>No student found with roll no "{rollNo.trim().toUpperCase()}".</p>}
      </div>

      {searched && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>{searched.name}</span>
              <span style={{ fontSize: 13, color: MUTED, marginLeft: 10 }}>{searched.rollNo}</span>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ ...card, padding: '10px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981' }}>{approvedActivities.length}</div>
                <div style={{ fontSize: 11, color: MUTED }}>Approved ECAs</div>
              </div>
              <div style={{ ...card, padding: '10px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: ACCENT }}>{totalPoints}</div>
                <div style={{ fontSize: 11, color: MUTED }}>Total Points</div>
              </div>
            </div>
          </div>

          <div style={{ ...card, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Submitted ECA Activities</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>{['Activity', 'Date', 'Achievement', 'Certificate', 'Points', 'Remarks', 'Status', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {searched.activities.map((a, i) => (
                  <React.Fragment key={i}>
                    <tr>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{a.activity}</td>
                      <td style={tdStyle}>{a.date}</td>
                      <td style={tdStyle}>{a.achievement}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        {a.certificate
                          ? <span style={{ color: '#16a34a', fontWeight: 700 }}>Yes</span>
                          : <span style={{ color: MUTED }}>No</span>
                        }
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700, color: a.points ? ACCENT : MUTED }}>
                        {a.points !== null ? a.points : '—'}
                      </td>
                      <td style={{ ...tdStyle, fontSize: 13, color: MUTED }}>{a.remarks || '—'}</td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: a.status === 'Approved' ? '#dcfce7' : a.status === 'Rejected' ? '#fee2e2' : '#fef9c3',
                          color: a.status === 'Approved' ? '#16a34a' : a.status === 'Rejected' ? '#dc2626' : '#854d0e',
                        }}>{a.status}</span>
                      </td>
                      <td style={tdStyle}>
                        {a.status === 'Pending' && (
                          <button onClick={() => { setGradingIndex(i); setGradeForm({ points: '', remarks: '' }) }}
                            style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                            Grade
                          </button>
                        )}
                      </td>
                    </tr>
                    {gradingIndex === i && (
                      <tr>
                        <td colSpan={8} style={{ padding: '14px 20px', background: '#fafafa', borderBottom: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 5 }}>ECA Points (0–10)</label>
                              <input type="number" min={0} max={10}
                                style={{ ...inputStyle, width: 90 }}
                                value={gradeForm.points}
                                onChange={e => setGradeForm(p => ({ ...p, points: e.target.value }))}
                              />
                            </div>
                            <div style={{ flex: 1, minWidth: 200 }}>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 5 }}>Remarks</label>
                              <input style={inputStyle} value={gradeForm.remarks} onChange={e => setGradeForm(p => ({ ...p, remarks: e.target.value }))} placeholder="Optional remarks..." />
                            </div>
                            <button onClick={() => handleGrade(i, 'Approved')}
                              style={{ background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                              Approve
                            </button>
                            <button onClick={() => handleGrade(i, 'Rejected')}
                              style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                              Reject
                            </button>
                            <button onClick={() => setGradingIndex(null)}
                              style={{ background: '#f1f5f9', color: MUTED, border: 'none', borderRadius: 8, padding: '9px 14px', fontSize: 13, cursor: 'pointer' }}>
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyExtraCurricular() {
  const [activeNav, setActiveNav] = useState('ECA - WorkLoad')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Academics — Extra Curricular Activity</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Manage ECA workload, faculty assignments and student activities</p>
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
          {activeNav === 'ECA - WorkLoad' && <ECAWorkLoadSection />}
          {activeNav === 'ECA - Faculty' && <ECAFacultySection />}
          {activeNav === 'ECA - Student' && <ECAStudentSection />}
        </div>
      </div>
    </div>
  )
}
