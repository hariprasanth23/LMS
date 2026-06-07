import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = [
  'Student Profile Info', 'WishList Registration', 'Curriculum', 'Registration',
  'Attendance', 'Mark Details', 'Exam Schedule', 'Student Medical Info',
  'Proctor Observations', 'Grade Details', 'Grade History',
]

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

function fmt(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 28, height: 28, border: '3px solid #e2e8f0', borderTopColor: ACCENT, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

function PendingNotice() {
  return (
    <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#92400e', fontFamily: 'system-ui' }}>
      This section's backend endpoint is pending — data below is placeholder.
    </div>
  )
}

function statusBadge(status) {
  const map = {
    Registered: { bg: '#dcfce7', color: '#16a34a' },
    Waitlisted: { bg: '#fef3c7', color: '#d97706' },
    Dropped: { bg: '#fee2e2', color: '#dc2626' },
    Pass: { bg: '#dcfce7', color: '#16a34a' },
    Detained: { bg: '#fee2e2', color: '#dc2626' },
    Regular: { bg: '#dbeafe', color: '#1d4ed8' },
    Arrear: { bg: '#fee2e2', color: '#dc2626' },
    ENROLLED: { bg: '#dcfce7', color: '#16a34a' },
    DROPPED: { bg: '#fee2e2', color: '#dc2626' },
    COMPLETED: { bg: '#dbeafe', color: '#1d4ed8' },
  }
  const sc = map[status] || { bg: '#f1f5f9', color: MUTED }
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>{status}</span>
}

// ─── Proctee Selector ──────────────────────────────────────────────────────────
function ProcteeSelector({ students, selectedId, onChange, loading }) {
  if (loading) return <div style={{ ...card, padding: '14px 20px', marginBottom: 20, color: MUTED, fontSize: 14 }}>Loading students…</div>
  return (
    <div style={{ ...card, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: TEXT, whiteSpace: 'nowrap' }}>Select Proctee:</label>
      <select style={{ ...inputStyle, maxWidth: 380 }} value={selectedId} onChange={e => onChange(e.target.value)}>
        {students.length === 0
          ? <option>No students found</option>
          : students.map(s => (
            <option key={s.id} value={s.id}>
              {s.rollNumber} — {s.department?.name ?? 'Sem ' + s.semester}
            </option>
          ))
        }
      </select>
      <span style={{ fontSize: 12, color: MUTED }}>
        Proctor–student assignment endpoint pending — showing all students
      </span>
    </div>
  )
}

// ─── Student Profile Info ──────────────────────────────────────────────────────
function StudentProfileInfo({ student }) {
  if (!student) return <div style={{ color: MUTED, padding: 24 }}>Select a student to view their profile.</div>
  const initials = (student.rollNumber || '?').slice(-2).toUpperCase()
  return (
    <div style={{ ...card, padding: 28 }}>
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ width: 100, height: 100, borderRadius: 12, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid #c7d2fe', fontSize: 28, color: ACCENT, fontWeight: 700 }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: TEXT }}>{student.rollNumber}</h2>
          <div style={{ color: MUTED, fontSize: 14, marginBottom: 16 }}>
            {student.department?.name ?? '—'} · Batch {student.batch ?? '—'} · Sem {student.semester ?? '—'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              ['Date of Joining', fmt(student.joinDate)],
              ['Semester', student.semester ?? '—'],
              ['Batch', student.batch ?? '—'],
              ['Status', student.status ?? '—'],
              ['Department', student.department?.name ?? '—'],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 14, color: TEXT, fontWeight: 500 }}>{val}</div>
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>Address</div>
              <div style={{ fontSize: 14, color: TEXT, fontWeight: 500 }}>{student.address ?? '—'}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 24, paddingTop: 20 }}>
        <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: TEXT }}>Guardian Details</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            ['Guardian Name', student.guardianName ?? '—'],
            ['Guardian Phone', student.guardianPhone ?? '—'],
          ].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 14, color: TEXT, fontWeight: 500 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Registration ──────────────────────────────────────────────────────────────
function RegistrationSection({ student, courseMap }) {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!student?.id) return
    setLoading(true)
    api.get(`/enrollments/student/${student.id}`)
      .then(r => setEnrollments(r.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [student?.id])

  if (loading) return <Spinner />

  const totalCredits = enrollments.reduce((s, e) => {
    const course = courseMap[e.courseId]
    return s + (course?.credits || 0)
  }, 0)

  return (
    <div style={{ ...card, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: TEXT }}>Current Registrations</span>
        <span style={{ fontSize: 13, color: MUTED }}>{enrollments.length} course(s)</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 600 }}>
          <thead>
            <tr>{['Course Code', 'Course Name', 'Credits', 'Semester', 'Status', 'Enrolled On'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: MUTED }}>No enrollments found.</td></tr>
            ) : enrollments.map((e, i) => {
              const course = courseMap[e.courseId]
              return (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{course?.code ?? '—'}</td>
                  <td style={tdStyle}>{course?.name ?? '—'}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{course?.credits ?? '—'}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{course?.semester ?? '—'}</td>
                  <td style={tdStyle}>{statusBadge(e.status)}</td>
                  <td style={tdStyle}>{fmt(e.enrolledAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {enrollments.length > 0 && (
        <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: 13, color: MUTED }}>
          Total Credits: <strong style={{ color: TEXT }}>{totalCredits}</strong>
        </div>
      )}
    </div>
  )
}

// ─── Attendance ────────────────────────────────────────────────────────────────
function AttendanceSection({ student }) {
  const [summaries, setSummaries] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!student?.id) return
    setLoading(true)
    api.get(`/attendance/student/${student.id}/summary`)
      .then(r => setSummaries(r.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [student?.id])

  if (loading) return <Spinner />

  const overall = summaries.reduce((acc, s) => ({
    p: acc.p + Number(s.presentCount),
    t: acc.t + Number(s.totalClasses),
  }), { p: 0, t: 0 })
  const overallPct = overall.t ? ((overall.p / overall.t) * 100).toFixed(1) : '0.0'

  return (
    <div>
      {summaries.length > 0 && (
        <div style={{ ...card, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ textAlign: 'center', padding: '8px 28px', borderRight: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: parseFloat(overallPct) < 75 ? '#dc2626' : '#16a34a' }}>{overallPct}%</div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>Overall Attendance</div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div><div style={{ fontSize: 20, fontWeight: 700, color: TEXT }}>{overall.p}</div><div style={{ fontSize: 12, color: MUTED }}>Total Present</div></div>
            <div><div style={{ fontSize: 20, fontWeight: 700, color: TEXT }}>{overall.t}</div><div style={{ fontSize: 12, color: MUTED }}>Total Classes</div></div>
          </div>
        </div>
      )}
      {summaries.length === 0 ? (
        <div style={{ ...card, padding: 32, textAlign: 'center', color: MUTED }}>No attendance records found.</div>
      ) : summaries.map((s, i) => {
        const pct = Number(s.attendancePercentage).toFixed(1)
        const low = parseFloat(pct) < 75
        return (
          <div key={i} style={{ ...card, padding: 20, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>
                {s.courseCode ? `${s.courseCode} — ${s.courseName}` : s.courseName}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, color: MUTED }}>{s.presentCount} / {s.totalClasses} classes</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: low ? '#dc2626' : '#16a34a' }}>{pct}%</span>
                {low && <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700, background: '#fee2e2', color: '#dc2626' }}>Below 75%</span>}
              </div>
            </div>
            <div style={{ height: 10, background: '#e2e8f0', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: low ? '#ef4444' : '#22c55e', borderRadius: 99, transition: 'width 0.4s' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Placeholders for sections without backend support ────────────────────────
const wishlistData = [
  { code: 'CS7001', name: 'Deep Learning', credits: 4, faculty: 'Dr. Ramesh', slot: 'A1+TA1', status: 'Registered' },
  { code: 'CS7002', name: 'Cloud Computing', credits: 3, faculty: 'Dr. Meena', slot: 'B1+TB1', status: 'Waitlisted' },
  { code: 'CS7003', name: 'Cyber Security', credits: 3, faculty: 'Dr. Suresh', slot: 'C1+TC1', status: 'Registered' },
]
function WishListSection() {
  const [notes, setNotes] = useState('')
  return (
    <div>
      <PendingNotice />
      <div style={{ ...card, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Course Wishlist</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 600 }}>
            <thead><tr>{['Course Code', 'Course Name', 'Credits', 'Faculty', 'Slot', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
            <tbody>{wishlistData.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.code}</td>
                <td style={tdStyle}>{r.name}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{r.credits}</td>
                <td style={tdStyle}>{r.faculty}</td>
                <td style={tdStyle}>{r.slot}</td>
                <td style={tdStyle}>{statusBadge(r.status)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div style={{ ...card, padding: 24 }}>
        <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: TEXT }}>Proctor Notes</h4>
        <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes about the student's wishlist choices..." />
        <button style={{ marginTop: 12, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save Notes</button>
      </div>
    </div>
  )
}

const curriculumData = [
  { sem: 1, code: 'MA1101', name: 'Engineering Mathematics I', credits: 4, grade: 'O' },
  { sem: 1, code: 'PH1101', name: 'Engineering Physics', credits: 3, grade: 'A+' },
  { sem: 2, code: 'MA1102', name: 'Engineering Mathematics II', credits: 4, grade: 'A+' },
  { sem: 2, code: 'CS1201', name: 'Introduction to Programming', credits: 4, grade: 'O' },
  { sem: 3, code: 'CS2101', name: 'Data Structures', credits: 4, grade: 'O' },
  { sem: 3, code: 'CS2102', name: 'Computer Organization', credits: 3, grade: 'A' },
  { sem: 6, code: 'CS5101', name: 'Machine Learning', credits: 4, grade: '-' },
  { sem: 6, code: 'CS5102', name: 'Compiler Design', credits: 3, grade: '-' },
]
const gradePoints = { O: 10, 'A+': 9, A: 8, 'B+': 7, B: 6, C: 5, U: 0, '-': null }
function CurriculumSection() {
  const sems = [...new Set(curriculumData.map(c => c.sem))]
  const completed = curriculumData.filter(c => c.grade !== '-')
  const totalCredits = completed.reduce((s, c) => s + c.credits, 0)
  const totalPoints = completed.reduce((s, c) => s + c.credits * (gradePoints[c.grade] || 0), 0)
  const cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : '—'
  return (
    <div>
      <PendingNotice />
      <div style={{ ...card, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ textAlign: 'center', padding: '8px 28px', borderRight: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: ACCENT }}>{cgpa}</div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>CGPA</div>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {[['Credits Earned', totalCredits], ['Courses Done', completed.length], ['Remaining', curriculumData.length - completed.length]].map(([l, v]) => (
            <div key={l}><div style={{ fontSize: 20, fontWeight: 700, color: TEXT }}>{v}</div><div style={{ fontSize: 12, color: MUTED }}>{l}</div></div>
          ))}
        </div>
      </div>
      {sems.map(sem => (
        <div key={sem} style={{ ...card, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '10px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: TEXT, fontSize: 14 }}>Semester {sem}</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead><tr>{['Course Code', 'Course Name', 'Credits', 'Grade'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
            <tbody>{curriculumData.filter(c => c.sem === sem).map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.code}</td>
                <td style={tdStyle}>{r.name}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{r.credits}</td>
                <td style={tdStyle}><span style={{ fontWeight: 700, color: r.grade === '-' ? MUTED : r.grade === 'O' ? '#16a34a' : r.grade === 'U' ? '#dc2626' : TEXT }}>{r.grade}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

function MarkDetailsSection() {
  const markData = [
    { course: 'CS5101', ca1: 18, ca2: 15, ca3: 17, model: 38 },
    { course: 'CS5102', ca1: 12, ca2: 10, ca3: 14, model: 32 },
  ]
  const minCA = 8, minModel = 20
  const cell = (val, min) => ({ ...tdStyle, fontWeight: 600, color: val < min ? '#dc2626' : TEXT, background: val < min ? '#fff5f5' : 'transparent' })
  return (
    <div>
      <PendingNotice />
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Internal Assessment Marks</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 600 }}>
            <thead><tr>{['Course', 'CA1 (/20)', 'CA2 (/20)', 'CA3 (/20)', 'Model (/50)', 'Total (/110)'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
            <tbody>{markData.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.course}</td>
                <td style={cell(r.ca1, minCA)}>{r.ca1}</td>
                <td style={cell(r.ca2, minCA)}>{r.ca2}</td>
                <td style={cell(r.ca3, minCA)}>{r.ca3}</td>
                <td style={cell(r.model, minModel)}>{r.model}</td>
                <td style={{ ...tdStyle, fontWeight: 700 }}>{r.ca1 + r.ca2 + r.ca3 + r.model}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ExamScheduleSection() {
  const examData = [
    { date: '2025-11-10', course: 'CS5101 — Machine Learning', time: '09:00 AM – 12:00 PM', venue: 'Exam Hall A', type: 'End Semester' },
    { date: '2025-11-12', course: 'CS5102 — Compiler Design', time: '02:00 PM – 05:00 PM', venue: 'Exam Hall B', type: 'End Semester' },
  ]
  return (
    <div>
      <PendingNotice />
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Upcoming Exams</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 600 }}>
            <thead><tr>{['Date', 'Course', 'Time', 'Venue', 'Type'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
            <tbody>{examData.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{r.date}</td>
                <td style={tdStyle}>{r.course}</td>
                <td style={tdStyle}>{r.time}</td>
                <td style={tdStyle}>{r.venue}</td>
                <td style={tdStyle}><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: r.type === 'Arrear' ? '#fee2e2' : '#dbeafe', color: r.type === 'Arrear' ? '#dc2626' : '#1d4ed8' }}>{r.type}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StudentMedicalInfo() {
  const [form, setForm] = useState({ date: '', observation: '', action: '' })
  const [saved, setSaved] = useState(false)
  return (
    <div>
      <PendingNotice />
      <div style={{ ...card, padding: 24 }}>
        <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: TEXT }}>Add Medical Observation</h4>
        {saved && <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>Observation saved!</div>}
        <form onSubmit={e => { e.preventDefault(); setSaved(true); setForm({ date: '', observation: '', action: '' }); setTimeout(() => setSaved(false), 3000) }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Date *</label>
              <input type="date" style={inputStyle} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Action Taken</label>
              <input style={inputStyle} value={form.action} onChange={e => setForm(p => ({ ...p, action: e.target.value }))} placeholder="Referred to doctor / First aid..." />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Observation *</label>
              <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.observation} onChange={e => setForm(p => ({ ...p, observation: e.target.value }))} required />
            </div>
          </div>
          <button type="submit" style={{ marginTop: 14, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save Observation</button>
        </form>
      </div>
    </div>
  )
}

function ProctorObservations() {
  const [form, setForm] = useState({ date: '', category: 'Academic', observation: '', action: '', followUp: false })
  const [saved, setSaved] = useState(false)
  const catColor = { Academic: { bg: '#dbeafe', color: '#1d4ed8' }, Behavioral: { bg: '#dcfce7', color: '#16a34a' }, Personal: { bg: '#fef3c7', color: '#d97706' } }
  return (
    <div>
      <PendingNotice />
      <div style={{ ...card, padding: 24 }}>
        <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: TEXT }}>Add Observation</h4>
        {saved && <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>Saved!</div>}
        <form onSubmit={e => { e.preventDefault(); setSaved(true); setForm({ date: '', category: 'Academic', observation: '', action: '', followUp: false }); setTimeout(() => setSaved(false), 3000) }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Date *</label>
              <input type="date" style={inputStyle} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Category *</label>
              <select style={inputStyle} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {['Academic', 'Behavioral', 'Personal'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Observation *</label>
              <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.observation} onChange={e => setForm(p => ({ ...p, observation: e.target.value }))} required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Action Taken</label>
              <input style={inputStyle} value={form.action} onChange={e => setForm(p => ({ ...p, action: e.target.value }))} placeholder="Steps taken or planned..." />
            </div>
          </div>
          <button type="submit" style={{ marginTop: 14, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save Observation</button>
        </form>
      </div>
    </div>
  )
}

function GradeDetails() {
  const gradeData = [
    { code: 'CS5101', name: 'Machine Learning', credits: 4, grade: 'A', points: 8 },
    { code: 'CS5102', name: 'Compiler Design', credits: 3, grade: 'B+', points: 7 },
  ]
  const totalCredits = gradeData.reduce((s, c) => s + c.credits, 0)
  const totalPoints = gradeData.reduce((s, c) => s + c.credits * c.points, 0)
  const sgpa = (totalPoints / totalCredits).toFixed(2)
  return (
    <div>
      <PendingNotice />
      <div style={{ ...card, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ textAlign: 'center', padding: '8px 28px', borderRight: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: ACCENT }}>{sgpa}</div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>SGPA</div>
        </div>
        {[['Credits', totalCredits], ['Grade Points', totalPoints]].map(([l, v]) => (
          <div key={l}><div style={{ fontSize: 20, fontWeight: 700, color: TEXT }}>{v}</div><div style={{ fontSize: 12, color: MUTED }}>{l}</div></div>
        ))}
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Current Grades</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 600 }}>
            <thead><tr>{['Code', 'Name', 'Credits', 'Grade', 'Grade Points', 'Credit Points'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
            <tbody>{gradeData.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.code}</td>
                <td style={tdStyle}>{r.name}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{r.credits}</td>
                <td style={tdStyle}><span style={{ fontWeight: 700, color: r.grade === 'O' ? '#16a34a' : r.grade === 'U' ? '#dc2626' : TEXT }}>{r.grade}</span></td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{r.points}</td>
                <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700 }}>{r.credits * r.points}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function GradeHistory() {
  const history = [
    { sem: 1, sgpa: 8.9, cgpa: 8.9, arrears: 0, status: 'Pass' },
    { sem: 2, sgpa: 8.5, cgpa: 8.7, arrears: 0, status: 'Pass' },
    { sem: 3, sgpa: 8.7, cgpa: 8.7, arrears: 0, status: 'Pass' },
    { sem: 4, sgpa: 7.8, cgpa: 8.5, arrears: 1, status: 'Pass' },
  ]
  const maxSGPA = Math.max(...history.map(g => g.sgpa))
  return (
    <div>
      <PendingNotice />
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h4 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 700, color: TEXT }}>SGPA Progression</h4>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
          {history.map((g, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{g.sgpa}</span>
              <div style={{ width: '100%', background: ACCENT, borderRadius: '6px 6px 0 0', height: `${(g.sgpa / maxSGPA) * 120}px`, opacity: 0.85 }} />
              <span style={{ fontSize: 12, color: MUTED }}>S{g.sem}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>GPA History</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 600 }}>
            <thead><tr>{['Semester', 'SGPA', 'CGPA', 'Arrears', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
            <tbody>{history.map((g, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>Semester {g.sem}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{g.sgpa}</td>
                <td style={tdStyle}>{g.cgpa}</td>
                <td style={{ ...tdStyle, color: g.arrears > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{g.arrears}</td>
                <td style={tdStyle}>{statusBadge(g.status)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyProctorStudents() {
  const { user } = useAuth()
  const [activeNav, setActiveNav] = useState('Student Profile Info')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [students, setStudents] = useState([])
  const [courseMap, setCourseMap] = useState({})
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  useEffect(() => {
    if (!user?.userId) return
    setLoading(true)
    Promise.all([
      api.get('/students').then(r => r.data?.data || []).catch(() => []),
      api.get('/courses').then(r => {
        const map = {}
        ;(r.data?.data || []).forEach(c => { map[c.id] = c })
        return map
      }).catch(() => ({})),
    ])
      .then(([allStudents, courses]) => {
        setStudents(allStudents)
        setCourseMap(courses)
        if (allStudents.length) setSelectedId(allStudents[0].id)
      })
      .finally(() => setLoading(false))
  }, [user?.userId])

  const selectedStudent = students.find(s => s.id === selectedId) || null

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: isMobile ? 16 : 32 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: TEXT }}>Proctor — Students Info</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Academic and personal details of proctees</p>
      </div>

      <div style={{ ...card, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden' }}>
        <div style={isMobile ? {
          borderBottom: '1px solid #f1f5f9', padding: '8px 12px',
          display: 'flex', overflowX: 'auto', gap: 8, flexShrink: 0,
        } : {
          width: 210, borderRight: '1px solid #f1f5f9', padding: '16px 0', flexShrink: 0,
        }}>
          {navItems.map(item => (
            isMobile ? (
              <button key={item} onClick={() => setActiveNav(item)}
                style={{ padding: '6px 14px', background: activeNav === item ? '#eef2ff' : '#f1f5f9', border: activeNav === item ? '1.5px solid #6366f1' : '1.5px solid transparent', borderRadius: 20, fontSize: 12, fontWeight: activeNav === item ? 600 : 400, color: activeNav === item ? ACCENT : TEXT, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
              >{item}</button>
            ) : (
              <button key={item} onClick={() => setActiveNav(item)}
                style={{ display: 'block', width: '100%', padding: '11px 20px', background: activeNav === item ? '#eef2ff' : 'transparent', border: 'none', borderLeft: activeNav === item ? '3px solid #6366f1' : '3px solid transparent', textAlign: 'left', fontSize: 14, fontWeight: activeNav === item ? 600 : 400, color: activeNav === item ? ACCENT : TEXT, cursor: 'pointer' }}
              >{item}</button>
            )
          ))}
        </div>
        <div style={{ flex: 1, padding: isMobile ? 14 : 28, minWidth: 0 }}>
          <ProcteeSelector students={students} selectedId={selectedId} onChange={setSelectedId} loading={loading} />
          {activeNav === 'Student Profile Info' && <StudentProfileInfo student={selectedStudent} />}
          {activeNav === 'WishList Registration' && <WishListSection />}
          {activeNav === 'Curriculum' && <CurriculumSection />}
          {activeNav === 'Registration' && <RegistrationSection student={selectedStudent} courseMap={courseMap} />}
          {activeNav === 'Attendance' && <AttendanceSection student={selectedStudent} />}
          {activeNav === 'Mark Details' && <MarkDetailsSection />}
          {activeNav === 'Exam Schedule' && <ExamScheduleSection />}
          {activeNav === 'Student Medical Info' && <StudentMedicalInfo />}
          {activeNav === 'Proctor Observations' && <ProctorObservations />}
          {activeNav === 'Grade Details' && <GradeDetails />}
          {activeNav === 'Grade History' && <GradeHistory />}
        </div>
      </div>
    </div>
  )
}
