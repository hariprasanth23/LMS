import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const ITEMS = ['Roster', 'Attendance Report', 'Biometric - Search by Venue']

// ─── Roster ───────────────────────────────────────────────────────────────────
function Roster() {
  const [course, setCourse] = useState('CS6001')
  const [section, setSection] = useState('III-CSE-A')
  const [search, setSearch] = useState('')

  const courses = ['CS6001 — Data Warehousing', 'CS6002 — Compiler Design', 'CS6003 — Cloud Computing', 'CS6004 — Cryptography & Security']
  const sections = ['III-CSE-A', 'III-CSE-B', 'III-CSE-C']

  const avatarColors = ['#6366f1', '#0891b2', '#7c3aed', '#059669', '#b45309', '#be185d', '#dc2626', '#1d4ed8']

  const allStudents = [
    { rollNo: '21CS001', name: 'Arun S.', registered: 'Jun 12, 2023', status: 'Active' },
    { rollNo: '21CS002', name: 'Bharathi K.', registered: 'Jun 12, 2023', status: 'Active' },
    { rollNo: '21CS003', name: 'Divya R.', registered: 'Jun 12, 2023', status: 'Active' },
    { rollNo: '21CS004', name: 'Karthik M.', registered: 'Jun 12, 2023', status: 'Active' },
    { rollNo: '21CS005', name: 'Meenakshi V.', registered: 'Jun 12, 2023', status: 'Active' },
    { rollNo: '21CS006', name: 'Naveen P.', registered: 'Jun 12, 2023', status: 'Active' },
    { rollNo: '21CS007', name: 'Preethi A.', registered: 'Jun 12, 2023', status: 'Active' },
    { rollNo: '21CS008', name: 'Ranjith S.', registered: 'Jun 14, 2023', status: 'Active' },
    { rollNo: '21CS009', name: 'Sakthi V.', registered: 'Jun 14, 2023', status: 'On Leave' },
    { rollNo: '21CS010', name: 'Tamil S.', registered: 'Jun 14, 2023', status: 'Active' },
    { rollNo: '21CS011', name: 'Uma D.', registered: 'Jun 15, 2023', status: 'Active' },
    { rollNo: '21CS012', name: 'Vijay A.', registered: 'Jun 15, 2023', status: 'Detained' },
    { rollNo: '21CS013', name: 'Yamini K.', registered: 'Jun 15, 2023', status: 'Active' },
  ]

  const statusColor = {
    Active: ['#dcfce7', '#15803d'],
    'On Leave': ['#fef3c7', '#b45309'],
    Detained: ['#fee2e2', '#dc2626'],
  }

  const filtered = allStudents.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Course</label>
          <select
            value={course}
            onChange={e => setCourse(e.target.value.split(' ')[0])}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui' }}
          >
            {courses.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Section</label>
          <select
            value={section}
            onChange={e => setSection(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui' }}
          >
            {sections.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 180px' }}>
          <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Search</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Roll No or Name..."
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <button style={{ padding: '8px 16px', background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Print</button>
          <button style={{ padding: '8px 16px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Export CSV</button>
        </div>
      </div>

      <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui', marginBottom: 12 }}>
        {course} · {section} · {filtered.length} students
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui' }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['#', 'Roll No', 'Name', 'Registration Date', 'Status'].map(h => (
              <th key={h} style={{ padding: '9px 12px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((s, i) => {
            const initials = s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
            const color = avatarColors[i % avatarColors.length]
            const [sbg, scl] = statusColor[s.status] || ['#f1f5f9', MUTED]
            return (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '9px 12px', color: MUTED, fontSize: 12 }}>{i + 1}</td>
                <td style={{ padding: '9px 12px', color: ACCENT, fontWeight: 700 }}>{s.rollNo}</td>
                <td style={{ padding: '9px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: color + '22', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{initials}</div>
                    <span style={{ color: TEXT, fontWeight: 600 }}>{s.name}</span>
                  </div>
                </td>
                <td style={{ padding: '9px 12px', color: MUTED }}>{s.registered}</td>
                <td style={{ padding: '9px 12px' }}>
                  <span style={{ background: sbg, color: scl, fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{s.status}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Attendance Report ────────────────────────────────────────────────────────
function AttendanceReport() {
  const [selectedCourse, setSelectedCourse] = useState('CS6001 — Data Warehousing')
  const [warnSent, setWarnSent] = useState({})

  const courses = ['CS6001 — Data Warehousing', 'CS6002 — Compiler Design', 'CS6003 — Cloud Computing', 'CS6004 — Cryptography & Security']

  const students = [
    { rollNo: '21CS001', name: 'Arun S.', total: 45, present: 42, absent: 3 },
    { rollNo: '21CS002', name: 'Bharathi K.', total: 45, present: 38, absent: 7 },
    { rollNo: '21CS003', name: 'Divya R.', total: 45, present: 45, absent: 0 },
    { rollNo: '21CS004', name: 'Karthik M.', total: 45, present: 30, absent: 15 },
    { rollNo: '21CS005', name: 'Meenakshi V.', total: 45, present: 44, absent: 1 },
    { rollNo: '21CS006', name: 'Naveen P.', total: 45, present: 28, absent: 17 },
    { rollNo: '21CS007', name: 'Preethi A.', total: 45, present: 43, absent: 2 },
    { rollNo: '21CS008', name: 'Ranjith S.', total: 45, present: 33, absent: 12 },
    { rollNo: '21CS009', name: 'Sakthi V.', total: 45, present: 20, absent: 25 },
    { rollNo: '21CS010', name: 'Tamil S.', total: 45, present: 40, absent: 5 },
  ]

  const withPct = students.map(s => ({
    ...s,
    pct: Math.round((s.present / s.total) * 100),
  }))

  const defaulters = withPct.filter(s => s.pct < 75)

  const statusInfo = (pct) => {
    if (pct >= 90) return ['Excellent', '#dcfce7', '#15803d']
    if (pct >= 75) return ['Regular', '#dbeafe', '#1d4ed8']
    if (pct >= 60) return ['Defaulter', '#fef3c7', '#b45309']
    return ['Critical', '#fee2e2', '#dc2626']
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ flex: '1 1 260px' }}>
          <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Select Course</label>
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui' }}
          >
            {courses.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button style={{ padding: '8px 16px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Download PDF</button>
      </div>

      {defaulters.length > 0 && (
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#c2410c', fontFamily: 'system-ui', marginBottom: 8 }}>
            Defaulter Alert — {defaulters.length} student(s) below 75% attendance
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {defaulters.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #fed7aa', borderRadius: 8, padding: '6px 12px' }}>
                <span style={{ fontSize: 12, color: TEXT, fontFamily: 'system-ui', fontWeight: 600 }}>{s.name} ({s.pct}%)</span>
                <button
                  onClick={() => setWarnSent(prev => ({ ...prev, [s.rollNo]: true }))}
                  disabled={!!warnSent[s.rollNo]}
                  style={{ background: warnSent[s.rollNo] ? '#f1f5f9' : '#fee2e2', color: warnSent[s.rollNo] ? MUTED : '#dc2626', border: 'none', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontFamily: 'system-ui', cursor: warnSent[s.rollNo] ? 'not-allowed' : 'pointer', fontWeight: 700 }}
                >
                  {warnSent[s.rollNo] ? 'Sent' : 'Warn'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui' }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Roll No', 'Student Name', 'Total Classes', 'Present', 'Absent', 'Percentage', 'Status', 'Warning'].map(h => (
              <th key={h} style={{ padding: '9px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {withPct.map((s, i) => {
            const [label, sbg, scl] = statusInfo(s.pct)
            const isDefaulter = s.pct < 75
            return (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: isDefaulter ? '#fff8f8' : 'transparent' }}>
                <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{s.rollNo}</td>
                <td style={{ padding: '9px 10px', color: isDefaulter ? '#dc2626' : TEXT, fontWeight: 600 }}>{s.name}</td>
                <td style={{ padding: '9px 10px', color: MUTED, textAlign: 'center' }}>{s.total}</td>
                <td style={{ padding: '9px 10px', color: '#15803d', fontWeight: 600, textAlign: 'center' }}>{s.present}</td>
                <td style={{ padding: '9px 10px', color: s.absent > 10 ? '#dc2626' : MUTED, fontWeight: s.absent > 10 ? 700 : 400, textAlign: 'center' }}>{s.absent}</td>
                <td style={{ padding: '9px 10px', fontWeight: 800, color: isDefaulter ? '#dc2626' : TEXT }}>{s.pct}%</td>
                <td style={{ padding: '9px 10px' }}>
                  <span style={{ background: sbg, color: scl, fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{label}</span>
                </td>
                <td style={{ padding: '9px 10px' }}>
                  {isDefaulter && (
                    <button
                      onClick={() => setWarnSent(prev => ({ ...prev, [s.rollNo]: true }))}
                      disabled={!!warnSent[s.rollNo]}
                      style={{ background: warnSent[s.rollNo] ? '#f1f5f9' : '#fee2e2', color: warnSent[s.rollNo] ? MUTED : '#dc2626', border: 'none', borderRadius: 7, padding: '4px 10px', fontSize: 11, fontFamily: 'system-ui', cursor: warnSent[s.rollNo] ? 'not-allowed' : 'pointer', fontWeight: 700 }}
                    >
                      {warnSent[s.rollNo] ? 'Email Sent' : 'Send Warning'}
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ marginTop: 14, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          ['Total Students', withPct.length, TEXT, '#f8fafc'],
          ['Excellent (≥90%)', withPct.filter(s => s.pct >= 90).length, '#15803d', '#dcfce7'],
          ['Regular (75–89%)', withPct.filter(s => s.pct >= 75 && s.pct < 90).length, '#1d4ed8', '#dbeafe'],
          ['Defaulters (<75%)', withPct.filter(s => s.pct < 75).length, '#dc2626', '#fee2e2'],
        ].map(([label, val, color, bg]) => (
          <div key={label} style={{ flex: '1 1 110px', background: bg, borderRadius: 9, padding: '10px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: 'system-ui' }}>{val}</div>
            <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Biometric - Search by Venue ──────────────────────────────────────────────
function BiometricSearchByVenue() {
  const [venue, setVenue] = useState('')
  const [date, setDate] = useState('2025-06-06')
  const [timeFrom, setTimeFrom] = useState('08:00')
  const [timeTo, setTimeTo] = useState('18:00')
  const [searched, setSearched] = useState(false)

  const venues = [
    'Seminar Hall A', 'Seminar Hall B',
    'Lab 1 (CS Dept)', 'Lab 2 (CS Dept)', 'Lab 3 (CS Dept)',
    'Lecture Hall 101', 'Lecture Hall 102', 'Lecture Hall 201', 'Lecture Hall 202',
    'Conference Room', 'Board Room',
  ]

  const biometricData = [
    { faculty: 'Dr. A. Meenakshi', designation: 'Asst. Professor', dept: 'CSE', entry: '08:45', exit: '10:50', purpose: 'CS6001 — Data Warehousing' },
    { faculty: 'Mr. K. Vignesh', designation: 'Asst. Professor', dept: 'CSE', entry: '09:00', exit: '10:55', purpose: 'CS6002 — Compiler Design' },
    { faculty: 'Dr. R. Sundaramurthy', designation: 'Associate Professor', dept: 'CSE', entry: '11:00', exit: '12:55', purpose: 'CS6003 — Cloud Computing' },
    { faculty: 'Ms. R. Divya', designation: 'Asst. Professor', dept: 'IT', entry: '13:00', exit: '14:55', purpose: 'IT6001 — Software Engineering' },
    { faculty: 'Dr. S. Priya', designation: 'Professor', dept: 'CSE', entry: '14:00', exit: '15:50', purpose: 'CS6004 — Cryptography & Security' },
    { faculty: 'Mr. T. Arun Kumar', designation: 'Asst. Professor', dept: 'CSE', entry: '15:00', exit: '16:55', purpose: 'CS6005 — Machine Learning' },
  ]

  const getDuration = (entry, exit) => {
    const [eh, em] = entry.split(':').map(Number)
    const [xh, xm] = exit.split(':').map(Number)
    const mins = (xh * 60 + xm) - (eh * 60 + em)
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const inRange = (entry) => {
    const [eh, em] = entry.split(':').map(Number)
    const [fh, fm] = timeFrom.split(':').map(Number)
    const [th, tm] = timeTo.split(':').map(Number)
    const t = eh * 60 + em
    return t >= fh * 60 + fm && t <= th * 60 + tm
  }

  const results = searched ? biometricData.filter(d => inRange(d.entry)) : []

  return (
    <div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, marginBottom: 24, background: '#fafbff' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>Search Biometric Logs by Venue</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Venue</label>
            <select
              value={venue}
              onChange={e => setVenue(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui' }}
            >
              <option value="">— Select Venue —</option>
              {venues.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Time From</label>
            <input
              type="time"
              value={timeFrom}
              onChange={e => setTimeFrom(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Time To</label>
            <input
              type="time"
              value={timeTo}
              onChange={e => setTimeTo(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box' }}
            />
          </div>
        </div>
        <button
          onClick={() => setSearched(true)}
          style={{ marginTop: 16, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 24px', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}
        >
          Search
        </button>
      </div>

      {searched && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>
              Biometric Results — {venue || 'All Venues'} · {date}
            </div>
            <span style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>{results.length} record(s) found</span>
          </div>

          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: MUTED, fontSize: 13, fontFamily: 'system-ui' }}>
              No biometric records found for the selected criteria.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Faculty Name', 'Designation', 'Dept', 'Entry Time', 'Exit Time', 'Duration', 'Class / Purpose'].map(h => (
                    <th key={h} style={{ padding: '9px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  const duration = getDuration(r.entry, r.exit)
                  const [dh] = duration.split('h')
                  const isShort = !duration.includes('h') || parseInt(dh) < 1
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 700 }}>{r.faculty}</td>
                      <td style={{ padding: '9px 10px', color: MUTED, fontSize: 12 }}>{r.designation}</td>
                      <td style={{ padding: '9px 10px' }}>
                        <span style={{ background: '#eef2ff', color: ACCENT, fontSize: 11, borderRadius: 7, padding: '2px 7px', fontWeight: 700 }}>{r.dept}</span>
                      </td>
                      <td style={{ padding: '9px 10px', color: '#15803d', fontWeight: 700 }}>{r.entry}</td>
                      <td style={{ padding: '9px 10px', color: '#dc2626', fontWeight: 700 }}>{r.exit}</td>
                      <td style={{ padding: '9px 10px' }}>
                        <span style={{ background: isShort ? '#fef3c7' : '#dcfce7', color: isShort ? '#b45309' : '#15803d', fontSize: 12, borderRadius: 8, padding: '2px 9px', fontWeight: 700 }}>{duration}</span>
                      </td>
                      <td style={{ padding: '9px 10px', color: MUTED, fontSize: 12 }}>{r.purpose}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

          <div style={{ marginTop: 14, fontSize: 12, color: MUTED, fontFamily: 'system-ui', background: '#f8fafc', borderRadius: 8, padding: '8px 14px' }}>
            Biometric logs are used for class conduction verification. Entry/exit times are captured at the venue terminal.
          </div>
        </>
      )}
    </div>
  )
}

const CONTENT_MAP = [Roster, AttendanceReport, BiometricSearchByVenue]

export default function FacultyAttendance() {
  const [active, setActive] = useState(0)
  const ActiveComponent = CONTENT_MAP[active]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100%', padding: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>Academics — Attendance</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Roster, attendance reports and biometric venue verification</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', minHeight: 520 }}>
        <div style={{ width: 210, borderRight: '1px solid #e2e8f0', padding: '12px 0', flexShrink: 0 }}>
          {ITEMS.map((item, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                padding: '9px 16px', cursor: 'pointer', fontSize: 13,
                fontFamily: 'system-ui', color: active === i ? ACCENT : '#475569',
                background: active === i ? '#eef2ff' : 'transparent',
                borderLeft: active === i ? '3px solid #6366f1' : '3px solid transparent',
                fontWeight: active === i ? 600 : 400,
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}
