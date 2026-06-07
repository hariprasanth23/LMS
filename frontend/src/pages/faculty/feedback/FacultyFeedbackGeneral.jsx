import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['Feedback Form', 'Course Feedback', 'Student Feedback', 'Feedback Report']

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

function statusBadge(status) {
  const map = {
    'Reviewed': { bg: '#dbeafe', color: '#1d4ed8' },
    'Resolved': { bg: '#dcfce7', color: '#16a34a' },
    'Pending': { bg: '#fef9c3', color: '#854d0e' },
    'Open': { bg: '#fee2e2', color: '#dc2626' },
  }
  const sc = map[status] || { bg: '#f1f5f9', color: MUTED }
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>
      {status}
    </span>
  )
}

// ─── Feedback Form ─────────────────────────────────────────────────────────────
const mySubmittedFeedbacks = [
  { id: 'FB001', category: 'Academics', subject: 'Lab equipment issue', priority: 'High', date: '2025-05-10', status: 'Reviewed' },
  { id: 'FB002', category: 'Infrastructure', subject: 'Classroom projector', priority: 'Medium', date: '2025-04-22', status: 'Resolved' },
  { id: 'FB003', category: 'Administration', subject: 'Attendance policy', priority: 'Low', date: '2025-03-18', status: 'Pending' },
]

function FeedbackFormSection() {
  const [form, setForm] = useState({ category: 'Academics', subject: '', description: '', priority: 'Medium' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setForm({ category: 'Academics', subject: '', description: '', priority: 'Medium' })
    setTimeout(() => setSubmitted(false), 3500)
  }

  return (
    <div>
      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: TEXT }}>Submit Feedback</h3>
        {submitted && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
            Feedback submitted successfully!
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Category *</label>
              <select style={inputStyle} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required>
                {['Academics', 'Infrastructure', 'Administration', 'Others'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Priority *</label>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                {['Low', 'Medium', 'High'].map(p => (
                  <button key={p} type="button"
                    onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid',
                      borderColor: form.priority === p ? (p === 'High' ? '#ef4444' : p === 'Medium' ? '#f59e0b' : '#10b981') : '#e2e8f0',
                      background: form.priority === p ? (p === 'High' ? '#fee2e2' : p === 'Medium' ? '#fef3c7' : '#dcfce7') : '#fff',
                      color: form.priority === p ? (p === 'High' ? '#dc2626' : p === 'Medium' ? '#d97706' : '#16a34a') : MUTED,
                      fontWeight: form.priority === p ? 700 : 400, fontSize: 13, cursor: 'pointer',
                    }}
                  >{p}</button>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Subject *</label>
              <input style={inputStyle} value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Brief subject of your feedback" required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Description *</label>
              <textarea
                rows={4} style={{ ...inputStyle, resize: 'vertical' }}
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Describe your feedback in detail..." required
              />
            </div>
          </div>
          <button type="submit" style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Submit Feedback
          </button>
        </form>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>My Submitted Feedbacks</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['ID', 'Category', 'Subject', 'Priority', 'Date', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {mySubmittedFeedbacks.map((f, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{f.id}</td>
                <td style={tdStyle}>{f.category}</td>
                <td style={tdStyle}>{f.subject}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                    background: f.priority === 'High' ? '#fee2e2' : f.priority === 'Medium' ? '#fef3c7' : '#dcfce7',
                    color: f.priority === 'High' ? '#dc2626' : f.priority === 'Medium' ? '#d97706' : '#16a34a',
                  }}>{f.priority}</span>
                </td>
                <td style={tdStyle}>{f.date}</td>
                <td style={tdStyle}>{statusBadge(f.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Course Feedback ────────────────────────────────────────────────────────────
const criteria = ['Content Delivery', 'Clarity', 'Engagement', 'Technology Use', 'Availability']

function CourseFeedbackSection({ courses }) {
  const [selectedCourse, setSelectedCourse] = useState('')
  useEffect(() => { if (courses.length && !selectedCourse) setSelectedCourse(courses[0].id) }, [courses])

  const placeholderRatings = { 'Content Delivery': 4.2, 'Clarity': 3.8, 'Engagement': 4.5, 'Technology Use': 4.0, 'Availability': 4.7 }
  const placeholderComments = ['Great explanation with real examples.', 'Very accessible and available for doubts.', 'Technology integration is excellent.']
  const data = { ratings: placeholderRatings, comments: placeholderComments }
  const [semester, setSemester] = useState('Semester 6 · 2024-25')

  return (
    <div>
      <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#92400e' }}>
        SET feedback ratings — backend endpoint pending. Course list is live.
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Course</label>
          <select style={inputStyle} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
            {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Semester</label>
          <select style={inputStyle} value={semester} onChange={e => setSemester(e.target.value)}>
            {['Semester 6 · 2024-25', 'Semester 5 · 2024-25', 'Semester 4 · 2023-24'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: TEXT }}>Average Ratings per Criterion</h3>
        {criteria.map(c => {
          const val = data.ratings[c]
          const pct = (val / 5) * 100
          return (
            <div key={c} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 14, color: TEXT, fontWeight: 500 }}>{c}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#f59e0b', fontSize: 16 }}>
                    {[1, 2, 3, 4, 5].map(s => <span key={s}>{s <= Math.round(val) ? '★' : '☆'}</span>)}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT, minWidth: 32 }}>{val.toFixed(1)}</span>
                </div>
              </div>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 99 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: ACCENT, borderRadius: 99, transition: 'width 0.4s' }} />
              </div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 3, textAlign: 'right' }}>{pct.toFixed(0)}%</div>
            </div>
          )
        })}
      </div>

      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Recent Student Comments</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {data.comments.map((comment, i) => (
            <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: TEXT, maxWidth: 280 }}>
              "{comment}"
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Student Feedback ──────────────────────────────────────────────────────────
const studentFeedbackHistory = [
  { rollNo: '20BCE0001', name: 'Arun Kumar', subject: 'CS6001', performance: 5, conduct: 4, remarks: 'Excellent participation', date: '2025-05-15' },
  { rollNo: '20BCE0042', name: 'Priya Sharma', subject: 'CS6002', performance: 3, conduct: 4, remarks: 'Needs improvement in assignments', date: '2025-05-10' },
]

function StudentFeedbackSection() {
  const [form, setForm] = useState({ rollNo: '', subject: '', performance: 0, conduct: 0, remarks: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setForm({ rollNo: '', subject: '', performance: 0, conduct: 0, remarks: '' })
    setTimeout(() => setSubmitted(false), 3500)
  }

  return (
    <div>
      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: TEXT }}>Submit Student Feedback</h3>
        {submitted && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
            Student feedback submitted successfully!
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Student Roll No *</label>
              <input style={inputStyle} value={form.rollNo} onChange={e => setForm(p => ({ ...p, rollNo: e.target.value }))} placeholder="e.g. 20BCE0001" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Subject *</label>
              <input style={inputStyle} value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. CS6001" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Performance Rating (1–5) *</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button"
                    onClick={() => setForm(p => ({ ...p, performance: n }))}
                    style={{
                      width: 38, height: 38, borderRadius: 8, border: '1px solid',
                      borderColor: form.performance >= n ? ACCENT : '#e2e8f0',
                      background: form.performance >= n ? '#eef2ff' : '#fff',
                      color: form.performance >= n ? ACCENT : MUTED,
                      fontWeight: 700, cursor: 'pointer', fontSize: 14,
                    }}
                  >{n}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Conduct Rating (1–5) *</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button"
                    onClick={() => setForm(p => ({ ...p, conduct: n }))}
                    style={{
                      width: 38, height: 38, borderRadius: 8, border: '1px solid',
                      borderColor: form.conduct >= n ? '#10b981' : '#e2e8f0',
                      background: form.conduct >= n ? '#f0fdf4' : '#fff',
                      color: form.conduct >= n ? '#10b981' : MUTED,
                      fontWeight: 700, cursor: 'pointer', fontSize: 14,
                    }}
                  >{n}</button>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Remarks</label>
              <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.remarks} onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))} placeholder="Detailed remarks about the student..." />
            </div>
          </div>
          <button type="submit" style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Submit Feedback
          </button>
        </form>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Submitted Student Feedbacks</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Roll No', 'Name', 'Subject', 'Performance', 'Conduct', 'Remarks', 'Date'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {studentFeedbackHistory.map((f, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{f.rollNo}</td>
                <td style={tdStyle}>{f.name}</td>
                <td style={tdStyle}>{f.subject}</td>
                <td style={tdStyle}><span style={{ color: '#f59e0b' }}>{'★'.repeat(f.performance)}{'☆'.repeat(5 - f.performance)}</span></td>
                <td style={tdStyle}><span style={{ color: '#10b981' }}>{'★'.repeat(f.conduct)}{'☆'.repeat(5 - f.conduct)}</span></td>
                <td style={tdStyle}>{f.remarks}</td>
                <td style={tdStyle}>{f.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Feedback Report ───────────────────────────────────────────────────────────
const reportData = [
  { course: 'CS6001', avg: 4.2 },
  { course: 'CS6002', avg: 3.9 },
  { course: 'CS5001', avg: 4.5 },
  { course: 'CS5002', avg: 3.7 },
]

function FeedbackReportSection() {
  const [semester, setSemester] = useState('Semester 6 · 2024-25')
  const [year, setYear] = useState('2024-25')

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Semester</label>
          <select style={inputStyle} value={semester} onChange={e => setSemester(e.target.value)}>
            {['Semester 6 · 2024-25', 'Semester 5 · 2024-25', 'Semester 4 · 2023-24'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Academic Year</label>
          <select style={inputStyle} value={year} onChange={e => setYear(e.target.value)}>
            {['2024-25', '2023-24', '2022-23'].map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
        <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Download Report
        </button>
      </div>

      <div style={{ ...card, padding: 28, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 24px', fontSize: 15, fontWeight: 700, color: TEXT }}>Ratings by Course</h3>
        {reportData.map((r, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{r.course}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>{r.avg} / 5</span>
            </div>
            <div style={{ height: 22, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${(r.avg / 5) * 100}%`,
                background: `linear-gradient(90deg, ${ACCENT}, #818cf8)`,
                borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
              }}>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{((r.avg / 5) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Avg Rating', value: '4.1 / 5', color: ACCENT },
          { label: 'Total Responses', value: '142', color: '#10b981' },
          { label: 'Courses Rated', value: '4', color: '#f59e0b' },
          { label: 'Top Criterion', value: 'Availability', color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} style={{ ...card, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: MUTED }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyFeedbackGeneral() {
  const { user } = useAuth()
  const [activeNav, setActiveNav] = useState('Feedback Form')
  const [courses, setCourses] = useState([])

  useEffect(() => {
    if (!user?.userId) return
    api.get('/courses').then(r => setCourses((r.data?.data || []).filter(c => c.facultyId === user.userId))).catch(console.error)
  }, [user?.userId])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Feedback — General</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Submit and view course and student feedback</p>
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
          {activeNav === 'Feedback Form' && <FeedbackFormSection />}
          {activeNav === 'Course Feedback' && <CourseFeedbackSection courses={courses} />}
          {activeNav === 'Student Feedback' && <StudentFeedbackSection />}
          {activeNav === 'Feedback Report' && <FeedbackReportSection />}
        </div>
      </div>
    </div>
  )
}
