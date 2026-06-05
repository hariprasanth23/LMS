import React, { useState } from 'react'

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

const proctees = [
  { rollNo: 'CB22CS001', name: 'Arjun Kumar', dept: 'Computer Science', batch: '2022-26', sem: '6', dob: '2004-03-14', gender: 'Male', category: 'OC', blood: 'O+', mobile: '9876543210', email: 'arjun.kumar@university.edu', address: '45, Gandhi Nagar, Chennai - 600012', hostel: 'Day Scholar', guardian: 'Ravi Kumar', guardianPhone: '9876543211' },
  { rollNo: 'CB22CS002', name: 'Priya Sharma', dept: 'Computer Science', batch: '2022-26', sem: '6', dob: '2004-07-22', gender: 'Female', category: 'BC', blood: 'A+', mobile: '9876543220', email: 'priya.sharma@university.edu', address: '12, Anna Salai, Chennai - 600002', hostel: 'Hosteller', guardian: 'Suresh Sharma', guardianPhone: '9876543221' },
  { rollNo: 'CB22CS003', name: 'Rahul Singh', dept: 'Computer Science', batch: '2022-26', sem: '6', dob: '2004-11-05', gender: 'Male', category: 'MBC', blood: 'B+', mobile: '9876543230', email: 'rahul.singh@university.edu', address: '7, Nungambakkam High Road, Chennai - 600034', hostel: 'Hosteller', guardian: 'Rajesh Singh', guardianPhone: '9876543231' },
  { rollNo: 'CB22CS004', name: 'Meena Devi', dept: 'Computer Science', batch: '2022-26', sem: '6', dob: '2004-05-18', gender: 'Female', category: 'SC', blood: 'B-', mobile: '9876543240', email: 'meena.devi@university.edu', address: '23, T Nagar, Chennai - 600017', hostel: 'Hosteller', guardian: 'Krishnamurthy Devi', guardianPhone: '9876543241' },
  { rollNo: 'CB22CS005', name: 'Vikram Raj', dept: 'Computer Science', batch: '2022-26', sem: '6', dob: '2004-09-30', gender: 'Male', category: 'OBC', blood: 'AB+', mobile: '9876543250', email: 'vikram.raj@university.edu', address: '56, Adyar, Chennai - 600020', hostel: 'Day Scholar', guardian: 'Subramaniam Raj', guardianPhone: '9876543251' },
]

// ─── Proctee Selector ──────────────────────────────────────────────────────────
function ProcteeSelector({ selected, onChange }) {
  return (
    <div style={{ ...card, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: TEXT, whiteSpace: 'nowrap' }}>Select Proctee:</label>
      <select style={{ ...inputStyle, maxWidth: 320 }} value={selected} onChange={e => onChange(e.target.value)}>
        {proctees.map(p => (
          <option key={p.rollNo} value={p.rollNo}>{p.rollNo} — {p.name}</option>
        ))}
      </select>
    </div>
  )
}

// ─── Student Profile Info ──────────────────────────────────────────────────────
function StudentProfileInfo({ student }) {
  if (!student) return null
  return (
    <div>
      <div style={{ ...card, padding: 28 }}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 100, height: 100, borderRadius: 12, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid #c7d2fe', fontSize: 36, color: ACCENT, fontWeight: 700 }}>
            {student.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: TEXT }}>{student.name}</h2>
            <div style={{ color: MUTED, fontSize: 14, marginBottom: 16 }}>{student.rollNo} · {student.dept} · Batch {student.batch}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                ['Date of Birth', student.dob], ['Gender', student.gender], ['Category', student.category],
                ['Blood Group', student.blood], ['Mobile', student.mobile], ['Semester', `Semester ${student.sem}`],
                ['Email', student.email, '1/-1'], ['Address', student.address, '1/-1'],
              ].map(([label, val, span], i) => (
                <div key={i} style={span ? { gridColumn: span } : {}}>
                  <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 14, color: TEXT, fontWeight: 500 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 24, paddingTop: 20 }}>
          <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: TEXT }}>Residential & Guardian Details</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              ['Hostel Status', student.hostel], ['Guardian Name', student.guardian], ['Guardian Phone', student.guardianPhone],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 14, color: TEXT, fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── WishList Registration ─────────────────────────────────────────────────────
const wishlistData = [
  { code: 'CS7001', name: 'Deep Learning', credits: 4, faculty: 'Dr. Ramesh', slot: 'A1+TA1', status: 'Registered' },
  { code: 'CS7002', name: 'Cloud Computing', credits: 3, faculty: 'Dr. Meena', slot: 'B1+TB1', status: 'Waitlisted' },
  { code: 'CS7003', name: 'Cyber Security', credits: 3, faculty: 'Dr. Suresh', slot: 'C1+TC1', status: 'Registered' },
  { code: 'CS7004', name: 'Blockchain Technology', credits: 3, faculty: 'Dr. Anjali', slot: 'D1+TD1', status: 'Dropped' },
]

function statusBadge(status) {
  const map = {
    'Registered': { bg: '#dcfce7', color: '#16a34a' },
    'Waitlisted': { bg: '#fef3c7', color: '#d97706' },
    'Dropped': { bg: '#fee2e2', color: '#dc2626' },
    'Pass': { bg: '#dcfce7', color: '#16a34a' },
    'Detained': { bg: '#fee2e2', color: '#dc2626' },
    'Regular': { bg: '#dbeafe', color: '#1d4ed8' },
    'Arrear': { bg: '#fee2e2', color: '#dc2626' },
  }
  const sc = map[status] || { bg: '#f1f5f9', color: MUTED }
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>
      {status}
    </span>
  )
}

function WishListSection() {
  const [notes, setNotes] = useState('')
  return (
    <div>
      <div style={{ ...card, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Course Wishlist — Upcoming Semester</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Course Code', 'Course Name', 'Credits', 'Faculty', 'Slot', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {wishlistData.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.code}</td>
                <td style={tdStyle}>{r.name}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{r.credits}</td>
                <td style={tdStyle}>{r.faculty}</td>
                <td style={tdStyle}>{r.slot}</td>
                <td style={tdStyle}>{statusBadge(r.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ ...card, padding: 24 }}>
        <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: TEXT }}>Proctor Notes</h4>
        <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add observations or notes about the student's wishlist choices..." />
        <button style={{ marginTop: 12, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save Notes</button>
      </div>
    </div>
  )
}

// ─── Curriculum ────────────────────────────────────────────────────────────────
const curriculumData = [
  { sem: 1, code: 'MA1101', name: 'Engineering Mathematics I', credits: 4, grade: 'O' },
  { sem: 1, code: 'PH1101', name: 'Engineering Physics', credits: 3, grade: 'A+' },
  { sem: 2, code: 'MA1102', name: 'Engineering Mathematics II', credits: 4, grade: 'A+' },
  { sem: 2, code: 'CS1201', name: 'Introduction to Programming', credits: 4, grade: 'O' },
  { sem: 3, code: 'CS2101', name: 'Data Structures', credits: 4, grade: 'O' },
  { sem: 3, code: 'CS2102', name: 'Computer Organization', credits: 3, grade: 'A' },
  { sem: 4, code: 'CS3101', name: 'Database Management Systems', credits: 4, grade: 'A+' },
  { sem: 4, code: 'CS3102', name: 'Operating Systems', credits: 4, grade: 'A' },
  { sem: 5, code: 'CS4101', name: 'Computer Networks', credits: 3, grade: 'B+' },
  { sem: 5, code: 'CS4102', name: 'Software Engineering', credits: 3, grade: 'A' },
  { sem: 6, code: 'CS5101', name: 'Machine Learning', credits: 4, grade: '-' },
  { sem: 6, code: 'CS5102', name: 'Compiler Design', credits: 3, grade: '-' },
]

const gradePoints = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'U': 0, '-': null }

function CurriculumSection() {
  const sems = [...new Set(curriculumData.map(c => c.sem))]
  const completed = curriculumData.filter(c => c.grade !== '-')
  const totalCredits = completed.reduce((s, c) => s + c.credits, 0)
  const totalPoints = completed.reduce((s, c) => s + c.credits * (gradePoints[c.grade] || 0), 0)
  const cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : '—'

  return (
    <div>
      <div style={{ ...card, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ textAlign: 'center', padding: '8px 28px', borderRight: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: ACCENT }}>{cgpa}</div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>CGPA</div>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {[['Credits Earned', totalCredits], ['Courses Done', completed.length], ['Remaining', curriculumData.length - completed.length]].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 20, fontWeight: 700, color: TEXT }}>{v}</div>
              <div style={{ fontSize: 12, color: MUTED }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {sems.map(sem => (
        <div key={sem} style={{ ...card, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '10px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: TEXT, fontSize: 14 }}>Semester {sem}</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>{['Course Code', 'Course Name', 'Credits', 'Grade'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {curriculumData.filter(c => c.sem === sem).map((r, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.code}</td>
                  <td style={tdStyle}>{r.name}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{r.credits}</td>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 700, color: r.grade === '-' ? MUTED : r.grade === 'O' ? '#16a34a' : r.grade === 'U' ? '#dc2626' : TEXT }}>{r.grade}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

// ─── Registration ──────────────────────────────────────────────────────────────
const registrationData = [
  { code: 'CS5101', name: 'Machine Learning', faculty: 'Dr. Ramesh Kumar', slot: 'A1+TA1', credits: 4, type: 'Regular' },
  { code: 'CS5102', name: 'Compiler Design', faculty: 'Dr. Priya Nair', slot: 'B1+TB1', credits: 3, type: 'Regular' },
  { code: 'CS5103', name: 'Distributed Systems', faculty: 'Dr. Karthik S', slot: 'C1+TC1', credits: 3, type: 'Regular' },
  { code: 'CS4003', name: 'Theory of Computation', faculty: 'Dr. Anjali Menon', slot: 'D1', credits: 3, type: 'Arrear' },
]

function RegistrationSection() {
  return (
    <div style={{ ...card, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: TEXT }}>Current Semester Registrations</span>
        <span style={{ fontSize: 13, color: MUTED }}>Semester 6 · 2024-25</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>{['Course Code', 'Course Name', 'Faculty', 'Slot', 'Credits', 'Type'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {registrationData.map((r, i) => (
            <tr key={i}>
              <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.code}</td>
              <td style={tdStyle}>{r.name}</td>
              <td style={tdStyle}>{r.faculty}</td>
              <td style={tdStyle}>{r.slot}</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>{r.credits}</td>
              <td style={tdStyle}>{statusBadge(r.type)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: 13, color: MUTED }}>
        Total Credits: <strong style={{ color: TEXT }}>13</strong> &nbsp;·&nbsp; Regular: <strong style={{ color: '#16a34a' }}>3</strong> &nbsp;·&nbsp; Arrear: <strong style={{ color: '#dc2626' }}>1</strong>
      </div>
    </div>
  )
}

// ─── Attendance ────────────────────────────────────────────────────────────────
const attendanceData = [
  { course: 'CS5101 — Machine Learning', present: 42, total: 48 },
  { course: 'CS5102 — Compiler Design', present: 30, total: 40 },
  { course: 'CS5103 — Distributed Systems', present: 36, total: 38 },
  { course: 'CS4003 — Theory of Computation', present: 18, total: 28 },
]

function AttendanceSection() {
  const overall = attendanceData.reduce((acc, c) => ({ p: acc.p + c.present, t: acc.t + c.total }), { p: 0, t: 0 })
  const overallPct = ((overall.p / overall.t) * 100).toFixed(1)

  return (
    <div>
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
      {attendanceData.map((a, i) => {
        const pct = ((a.present / a.total) * 100).toFixed(1)
        const low = parseFloat(pct) < 75
        return (
          <div key={i} style={{ ...card, padding: 20, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{a.course}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, color: MUTED }}>{a.present} / {a.total} classes</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: low ? '#dc2626' : '#16a34a' }}>{pct}%</span>
                {low && <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700, background: '#fee2e2', color: '#dc2626' }}>Below 75%</span>}
              </div>
            </div>
            <div style={{ height: 10, background: '#e2e8f0', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${pct}%`, background: low ? '#ef4444' : '#22c55e', borderRadius: 99, transition: 'width 0.4s' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Mark Details ──────────────────────────────────────────────────────────────
const markData = [
  { course: 'CS5101', ca1: 18, ca2: 15, ca3: 17, model: 38, max: { ca: 20, model: 50 } },
  { course: 'CS5102', ca1: 12, ca2: 10, ca3: 14, model: 32, max: { ca: 20, model: 50 } },
  { course: 'CS5103', ca1: 19, ca2: 18, ca3: 18, model: 45, max: { ca: 20, model: 50 } },
  { course: 'CS4003', ca1: 8, ca2: 9, ca3: 11, model: 24, max: { ca: 20, model: 50 } },
]

function MarkDetailsSection() {
  const minCA = 8
  const minModel = 20
  const cell = (val, min) => ({
    ...tdStyle, fontWeight: 600,
    color: val < min ? '#dc2626' : TEXT,
    background: val < min ? '#fff5f5' : 'transparent',
  })
  return (
    <div style={{ ...card, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: TEXT }}>Internal Assessment Marks</span>
        <span style={{ fontSize: 12, color: MUTED }}>Red cells indicate below minimum</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>{['Course', 'CA1 (/20)', 'CA2 (/20)', 'CA3 (/20)', 'Model (/50)', 'Total (/110)'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {markData.map((r, i) => (
            <tr key={i}>
              <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.course}</td>
              <td style={cell(r.ca1, minCA)}>{r.ca1}</td>
              <td style={cell(r.ca2, minCA)}>{r.ca2}</td>
              <td style={cell(r.ca3, minCA)}>{r.ca3}</td>
              <td style={cell(r.model, minModel)}>{r.model}</td>
              <td style={{ ...tdStyle, fontWeight: 700 }}>{r.ca1 + r.ca2 + r.ca3 + r.model}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: '10px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: 12, color: MUTED }}>
        Minimum: CA — 8/20 &nbsp;|&nbsp; Model Exam — 20/50
      </div>
    </div>
  )
}

// ─── Exam Schedule ─────────────────────────────────────────────────────────────
const examScheduleData = [
  { date: '2025-11-10', course: 'CS5101 — Machine Learning', time: '09:00 AM – 12:00 PM', venue: 'Exam Hall A – Block 1', type: 'End Semester' },
  { date: '2025-11-12', course: 'CS5102 — Compiler Design', time: '02:00 PM – 05:00 PM', venue: 'Exam Hall B – Block 2', type: 'End Semester' },
  { date: '2025-11-14', course: 'CS5103 — Distributed Systems', time: '09:00 AM – 12:00 PM', venue: 'Exam Hall C – Block 3', type: 'End Semester' },
  { date: '2025-11-17', course: 'CS4003 — Theory of Computation', time: '09:00 AM – 12:00 PM', venue: 'Exam Hall A – Block 1', type: 'Arrear' },
]

function ExamScheduleSection() {
  return (
    <div style={{ ...card, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Upcoming End-Semester Exams</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>{['Date', 'Course', 'Time', 'Venue', 'Exam Type'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {examScheduleData.map((r, i) => (
            <tr key={i}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{r.date}</td>
              <td style={tdStyle}>{r.course}</td>
              <td style={tdStyle}>{r.time}</td>
              <td style={tdStyle}>{r.venue}</td>
              <td style={tdStyle}>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: r.type === 'Arrear' ? '#fee2e2' : '#dbeafe', color: r.type === 'Arrear' ? '#dc2626' : '#1d4ed8' }}>
                  {r.type}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Student Medical Info ──────────────────────────────────────────────────────
const medicalHistory = [
  { type: 'Condition', detail: 'Mild Asthma (diagnosed 2020)' },
  { type: 'Medication', detail: 'Salbutamol inhaler (as needed)' },
  { type: 'Allergy', detail: 'Penicillin (severe), Dust mites (mild)' },
  { type: 'Past Visit', detail: 'College clinic – 2025-02-15 – Mild fever (treated and released)' },
  { type: 'Past Visit', detail: 'External hospital – 2024-09-08 – Asthma episode (no hospitalization)' },
]

function StudentMedicalInfo() {
  const [form, setForm] = useState({ date: '', observation: '', action: '' })
  const [saved, setSaved] = useState(false)
  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setForm({ date: '', observation: '', action: '' })
    setTimeout(() => setSaved(false), 3000)
  }
  return (
    <div>
      <div style={{ ...card, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Medical History</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Type', 'Details'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {medicalHistory.map((m, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>
                  <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: m.type === 'Condition' ? '#fef3c7' : m.type === 'Medication' ? '#dbeafe' : m.type === 'Allergy' ? '#fee2e2' : '#f0fdf4', color: m.type === 'Condition' ? '#d97706' : m.type === 'Medication' ? '#1d4ed8' : m.type === 'Allergy' ? '#dc2626' : '#16a34a' }}>
                    {m.type}
                  </span>
                </td>
                <td style={tdStyle}>{m.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ ...card, padding: 24 }}>
        <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: TEXT }}>Add New Medical Observation</h4>
        {saved && <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>Observation saved successfully!</div>}
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Date *</label>
              <input type="date" style={inputStyle} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Action Taken</label>
              <input style={inputStyle} value={form.action} onChange={e => setForm(p => ({ ...p, action: e.target.value }))} placeholder="Referred to doctor / First aid given..." />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Observation *</label>
              <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.observation} onChange={e => setForm(p => ({ ...p, observation: e.target.value }))} placeholder="Describe the medical observation..." required />
            </div>
          </div>
          <button type="submit" style={{ marginTop: 14, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save Observation</button>
        </form>
      </div>
    </div>
  )
}

// ─── Proctor Observations ──────────────────────────────────────────────────────
const observationHistory = [
  { date: '2025-03-10', category: 'Academic', observation: 'Student missing multiple classes. CGPA dropped to 6.8.', action: 'Counseled and informed parents.', followUp: true },
  { date: '2025-01-22', category: 'Personal', observation: 'Student seemed stressed regarding accommodation.', action: 'Connected to welfare committee.', followUp: false },
  { date: '2024-11-05', category: 'Behavioral', observation: 'Excellent participation in technical fest.', action: 'Appreciated and encouraged further.', followUp: false },
]

function ProctorObservations() {
  const [form, setForm] = useState({ date: '', category: 'Academic', observation: '', action: '', followUp: false })
  const [saved, setSaved] = useState(false)
  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setForm({ date: '', category: 'Academic', observation: '', action: '', followUp: false })
    setTimeout(() => setSaved(false), 3000)
  }
  const catColor = { Academic: { bg: '#dbeafe', color: '#1d4ed8' }, Behavioral: { bg: '#dcfce7', color: '#16a34a' }, Personal: { bg: '#fef3c7', color: '#d97706' } }
  return (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: TEXT }}>Add New Observation</h4>
        {saved && <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>Observation saved!</div>}
        <form onSubmit={handleSave}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="followup" checked={form.followUp} onChange={e => setForm(p => ({ ...p, followUp: e.target.checked }))} />
              <label htmlFor="followup" style={{ fontSize: 14, color: TEXT }}>Follow-up Required</label>
            </div>
          </div>
          <button type="submit" style={{ marginTop: 14, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save Observation</button>
        </form>
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Observation History</div>
        {observationHistory.map((o, i) => (
          <div key={i} style={{ padding: '16px 20px', borderBottom: i < observationHistory.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, ...catColor[o.category] }}>{o.category}</span>
                {o.followUp && <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#fef3c7', color: '#d97706' }}>Follow-up Needed</span>}
              </div>
              <span style={{ fontSize: 13, color: MUTED }}>{o.date}</span>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 14, color: TEXT }}>{o.observation}</p>
            {o.action && <p style={{ margin: 0, fontSize: 13, color: MUTED }}>Action: {o.action}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Grade Details ─────────────────────────────────────────────────────────────
const gradeDetails = [
  { code: 'CS5101', name: 'Machine Learning', credits: 4, grade: 'A', points: 8 },
  { code: 'CS5102', name: 'Compiler Design', credits: 3, grade: 'B+', points: 7 },
  { code: 'CS5103', name: 'Distributed Systems', credits: 3, grade: 'A+', points: 9 },
  { code: 'CS4003', name: 'Theory of Computation', credits: 3, grade: 'B', points: 6 },
]

function GradeDetails() {
  const totalCredits = gradeDetails.reduce((s, c) => s + c.credits, 0)
  const totalPoints = gradeDetails.reduce((s, c) => s + c.credits * c.points, 0)
  const sgpa = (totalPoints / totalCredits).toFixed(2)
  return (
    <div>
      <div style={{ ...card, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ textAlign: 'center', padding: '8px 28px', borderRight: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: ACCENT }}>{sgpa}</div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>SGPA — Semester 6</div>
        </div>
        {[['Total Credits', totalCredits], ['Grade Points', totalPoints]].map(([l, v]) => (
          <div key={l}>
            <div style={{ fontSize: 20, fontWeight: 700, color: TEXT }}>{v}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Current Semester Grades</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Course Code', 'Course Name', 'Credits', 'Grade', 'Grade Points', 'Credit Points'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {gradeDetails.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.code}</td>
                <td style={tdStyle}>{r.name}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{r.credits}</td>
                <td style={tdStyle}><span style={{ fontWeight: 700, color: r.grade === 'O' ? '#16a34a' : r.grade === 'U' ? '#dc2626' : TEXT }}>{r.grade}</span></td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{r.points}</td>
                <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700 }}>{r.credits * r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Grade History ─────────────────────────────────────────────────────────────
const gradeHistory = [
  { sem: 1, sgpa: 8.9, cgpa: 8.9, arrears: 0, status: 'Pass' },
  { sem: 2, sgpa: 8.5, cgpa: 8.7, arrears: 0, status: 'Pass' },
  { sem: 3, sgpa: 8.7, cgpa: 8.7, arrears: 0, status: 'Pass' },
  { sem: 4, sgpa: 7.8, cgpa: 8.5, arrears: 1, status: 'Pass' },
  { sem: 5, sgpa: 7.2, cgpa: 8.2, arrears: 0, status: 'Pass' },
  { sem: 6, sgpa: 7.6, cgpa: 8.1, arrears: 0, status: 'Pass' },
]

function GradeHistory() {
  const maxSGPA = Math.max(...gradeHistory.map(g => g.sgpa))
  return (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h4 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 700, color: TEXT }}>SGPA Progression</h4>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
          {gradeHistory.map((g, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{g.sgpa}</span>
              <div style={{ width: '100%', background: ACCENT, borderRadius: '6px 6px 0 0', height: `${(g.sgpa / maxSGPA) * 120}px`, opacity: 0.85, transition: 'height 0.4s' }} />
              <span style={{ fontSize: 12, color: MUTED }}>S{g.sem}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Semester-wise GPA History</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Semester', 'SGPA', 'CGPA', 'Arrears', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {gradeHistory.map((g, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>Semester {g.sem}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{g.sgpa}</td>
                <td style={tdStyle}>{g.cgpa}</td>
                <td style={{ ...tdStyle, color: g.arrears > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{g.arrears}</td>
                <td style={tdStyle}>{statusBadge(g.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyProctorStudents() {
  const [activeNav, setActiveNav] = useState('Student Profile Info')
  const [selectedRoll, setSelectedRoll] = useState(proctees[0].rollNo)
  const student = proctees.find(p => p.rollNo === selectedRoll)

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Proctor — Students Info</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Complete academic and personal details of proctees</p>
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
          <ProcteeSelector selected={selectedRoll} onChange={setSelectedRoll} />
          {activeNav === 'Student Profile Info' && <StudentProfileInfo student={student} />}
          {activeNav === 'WishList Registration' && <WishListSection />}
          {activeNav === 'Curriculum' && <CurriculumSection />}
          {activeNav === 'Registration' && <RegistrationSection />}
          {activeNav === 'Attendance' && <AttendanceSection />}
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
