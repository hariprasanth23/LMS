import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const ITEMS = ['Roster', 'Mark Attendance', 'Biometric - Search by Venue']

const avatarColors = ['#6366f1', '#0891b2', '#7c3aed', '#059669', '#b45309', '#be185d', '#dc2626', '#1d4ed8']

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

// ─── Roster ───────────────────────────────────────────────────────────────────
function Roster({ courses, allStudents, loading }) {
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [search, setSearch] = useState('')
  const [enrollments, setEnrollments] = useState([])
  const [loadingEnroll, setLoadingEnroll] = useState(false)

  useEffect(() => {
    if (courses.length && !selectedCourseId) setSelectedCourseId(courses[0].id)
  }, [courses])

  useEffect(() => {
    if (!selectedCourseId) return
    setLoadingEnroll(true)
    api.get(`/enrollments/course/${selectedCourseId}`)
      .then(r => setEnrollments(r.data?.data || []))
      .catch(console.error)
      .finally(() => setLoadingEnroll(false))
  }, [selectedCourseId])

  const rosterStudents = enrollments
    .map(e => ({ ...allStudents[e.studentId], enrolledAt: e.enrolledAt, enrollStatus: e.status }))
    .filter(s => s.id)
    .filter(s =>
      s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.name?.toLowerCase().includes(search.toLowerCase())
    )

  const statusColor = {
    ACTIVE: ['#dcfce7', '#15803d'],
    INACTIVE: ['#fee2e2', '#dc2626'],
    GRADUATED: ['#dbeafe', '#1d4ed8'],
    DROPPED: ['#f1f5f9', MUTED],
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ flex: '1 1 220px' }}>
          <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Course</label>
          <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui' }}>
            {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 180px' }}>
          <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Search</label>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Roll No or Department..." style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box' }} />
        </div>
      </div>

      {loadingEnroll ? <Spinner /> : (
        <>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui', marginBottom: 12 }}>
            {courses.find(c => c.id === selectedCourseId)?.code} · {rosterStudents.length} students enrolled
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 600 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['#', 'Roll No', 'Department', 'Semester', 'Batch', 'Enrolled On', 'Status'].map(h => (
                    <th key={h} style={{ padding: '9px 12px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rosterStudents.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: MUTED, fontFamily: 'system-ui' }}>No students enrolled in this course.</td></tr>
                ) : rosterStudents.map((s, i) => {
                  const initials = (s.rollNumber || '?').slice(-2).toUpperCase()
                  const color = avatarColors[i % avatarColors.length]
                  const [sbg, scl] = statusColor[s.status] || ['#f1f5f9', MUTED]
                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '9px 12px', color: MUTED, fontSize: 12 }}>{i + 1}</td>
                      <td style={{ padding: '9px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: color + '22', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{initials}</div>
                          <span style={{ color: ACCENT, fontWeight: 700 }}>{s.rollNumber}</span>
                        </div>
                      </td>
                      <td style={{ padding: '9px 12px', color: TEXT }}>{s.department?.name ?? '—'}</td>
                      <td style={{ padding: '9px 12px', color: MUTED }}>{s.semester ?? '—'}</td>
                      <td style={{ padding: '9px 12px', color: MUTED }}>{s.batch ?? '—'}</td>
                      <td style={{ padding: '9px 12px', color: MUTED }}>{fmt(s.enrolledAt)}</td>
                      <td style={{ padding: '9px 12px' }}>
                        <span style={{ background: sbg, color: scl, fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{s.status ?? '—'}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Mark Attendance ──────────────────────────────────────────────────────────
function MarkAttendance({ courses, allStudents, loading }) {
  const today = new Date().toISOString().split('T')[0]
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [date, setDate] = useState(today)
  const [enrollments, setEnrollments] = useState([])
  const [existingAttendance, setExistingAttendance] = useState({}) // {studentId: status}
  const [attendance, setAttendance] = useState({}) // {studentId: 'PRESENT'|'ABSENT'|'LATE'|'EXCUSED'}
  const [loadingData, setLoadingData] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [warnSent, setWarnSent] = useState({})

  useEffect(() => {
    if (courses.length && !selectedCourseId) setSelectedCourseId(courses[0].id)
  }, [courses])

  useEffect(() => {
    if (!selectedCourseId || !date) return
    setLoadingData(true)
    Promise.all([
      api.get(`/enrollments/course/${selectedCourseId}`).then(r => r.data?.data || []).catch(() => []),
      api.get(`/attendance/course/${selectedCourseId}/date/${date}`).then(r => r.data?.data || []).catch(() => []),
    ])
      .then(([enroll, existing]) => {
        setEnrollments(enroll)
        const existMap = {}
        const attMap = {}
        existing.forEach(a => {
          existMap[a.studentId] = a.status
          attMap[a.studentId] = a.status
        })
        setExistingAttendance(existMap)
        setAttendance(attMap)
      })
      .finally(() => setLoadingData(false))
  }, [selectedCourseId, date])

  const students = enrollments
    .map(e => allStudents[e.studentId])
    .filter(Boolean)

  const handleSave = async () => {
    if (!selectedCourseId || students.length === 0) return
    setSubmitting(true)
    try {
      const entries = students.map(s => ({
        studentId: s.id,
        status: attendance[s.id] || 'ABSENT',
      }))
      await api.post('/attendance/student', { courseId: selectedCourseId, date, entries })
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const setAll = (status) => {
    const map = {}
    students.forEach(s => { map[s.id] = status })
    setAttendance(map)
  }

  const presentCount = students.filter(s => (attendance[s.id] || 'ABSENT') === 'PRESENT').length
  const absentCount = students.length - presentCount

  const statusInfo = (pct) => {
    if (pct >= 90) return ['Excellent', '#dcfce7', '#15803d']
    if (pct >= 75) return ['Regular', '#dbeafe', '#1d4ed8']
    if (pct >= 60) return ['Defaulter', '#fef3c7', '#b45309']
    return ['Critical', '#fee2e2', '#dc2626']
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ flex: '1 1 220px' }}>
          <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Course</label>
          <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui' }}>
            {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 160px' }}>
          <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box' }} />
        </div>
      </div>

      {loadingData ? <Spinner /> : (
        <>
          {students.length > 0 && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui', marginRight: 4 }}>Quick set:</div>
              {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map(s => (
                <button key={s} onClick={() => setAll(s)} style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 12, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>All {s}</button>
              ))}
              <button onClick={handleSave} disabled={submitting || students.length === 0} style={{ marginLeft: 'auto', background: submitting ? '#94a3b8' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontFamily: 'system-ui', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                {submitting ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 600 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Roll No', 'Department', 'Sem', 'Status', 'Warning'].map(h => (
                    <th key={h} style={{ padding: '9px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: MUTED }}>No students enrolled in this course.</td></tr>
                ) : students.map((s, i) => {
                  const current = attendance[s.id] || 'ABSENT'
                  const isAbsent = current === 'ABSENT'
                  const existingStatus = existingAttendance[s.id]

                  const statusColor = { PRESENT: '#15803d', ABSENT: '#dc2626', LATE: '#b45309', EXCUSED: '#1d4ed8' }
                  const statusBg = { PRESENT: '#dcfce7', ABSENT: '#fee2e2', LATE: '#fef3c7', EXCUSED: '#dbeafe' }

                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', background: isAbsent ? '#fff8f8' : 'transparent' }}>
                      <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{s.rollNumber}</td>
                      <td style={{ padding: '9px 10px', color: TEXT }}>{s.department?.name ?? '—'}</td>
                      <td style={{ padding: '9px 10px', color: MUTED }}>{s.semester ?? '—'}</td>
                      <td style={{ padding: '9px 10px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => setAttendance(prev => ({ ...prev, [s.id]: opt }))}
                              style={{
                                background: current === opt ? statusBg[opt] : '#f1f5f9',
                                color: current === opt ? statusColor[opt] : MUTED,
                                border: current === opt ? `1px solid ${statusColor[opt]}` : '1px solid transparent',
                                borderRadius: 6, padding: '3px 8px', fontSize: 11,
                                fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 700,
                              }}
                            >{opt === 'EXCUSED' ? 'EXC' : opt.slice(0, 3)}</button>
                          ))}
                          {existingStatus && (
                            <span style={{ marginLeft: 6, fontSize: 11, color: MUTED, fontFamily: 'system-ui', alignSelf: 'center' }}>
                              (saved: {existingStatus})
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '9px 10px' }}>
                        {isAbsent && (
                          <button
                            onClick={() => setWarnSent(prev => ({ ...prev, [s.id]: true }))}
                            disabled={!!warnSent[s.id]}
                            style={{ background: warnSent[s.id] ? '#f1f5f9' : '#fee2e2', color: warnSent[s.id] ? MUTED : '#dc2626', border: 'none', borderRadius: 7, padding: '4px 10px', fontSize: 11, fontFamily: 'system-ui', cursor: warnSent[s.id] ? 'not-allowed' : 'pointer', fontWeight: 700 }}
                          >
                            {warnSent[s.id] ? 'Sent' : 'Warn'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {students.length > 0 && (
            <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                ['Total', students.length, TEXT, '#f8fafc'],
                ['Present', presentCount, '#15803d', '#dcfce7'],
                ['Absent', absentCount, '#dc2626', '#fee2e2'],
              ].map(([label, val, color, bg]) => (
                <div key={label} style={{ flex: '1 1 100px', background: bg, borderRadius: 9, padding: '10px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: 'system-ui' }}>{val}</div>
                  <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Biometric - Search by Venue ──────────────────────────────────────────────
function BiometricSearchByVenue() {
  const [venue, setVenue] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
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
      <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#92400e', fontFamily: 'system-ui' }}>
        Venue-based biometric search API is pending. Data shown below is placeholder only.
      </div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, marginBottom: 24, background: '#fafbff' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>Search Biometric Logs by Venue</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Venue</label>
            <select value={venue} onChange={e => setVenue(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui' }}>
              <option value="">— Select Venue —</option>
              {venues.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Time From</label>
            <input type="time" value={timeFrom} onChange={e => setTimeFrom(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Time To</label>
            <input type="time" value={timeTo} onChange={e => setTimeTo(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box' }} />
          </div>
        </div>
        <button onClick={() => setSearched(true)} style={{ marginTop: 16, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 24px', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Search</button>
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
            <div style={{ textAlign: 'center', padding: '40px 0', color: MUTED, fontSize: 13, fontFamily: 'system-ui' }}>No biometric records found for the selected criteria.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 600 }}>
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
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Parent ───────────────────────────────────────────────────────────────────
export default function FacultyAttendance() {
  const { user } = useAuth()
  const [active, setActive] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [courses, setCourses] = useState([])
  const [allStudents, setAllStudents] = useState({})
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
      api.get('/courses').then(r => (r.data?.data || []).filter(c => c.facultyId === user.userId)).catch(() => []),
      api.get('/students').then(r => {
        const map = {}
        ;(r.data?.data || []).forEach(s => { map[s.id] = s })
        return map
      }).catch(() => ({})),
    ])
      .then(([myCourses, studentMap]) => {
        setCourses(myCourses)
        setAllStudents(studentMap)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.userId])

  const renderActive = () => {
    switch (active) {
      case 0: return <Roster courses={courses} allStudents={allStudents} loading={loading} />
      case 1: return <MarkAttendance courses={courses} allStudents={allStudents} loading={loading} />
      case 2: return <BiometricSearchByVenue />
      default: return null
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100%', padding: 1 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? 18 : 22, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>Academics — Attendance</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Roster, attendance marking and biometric venue verification</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 520 }}>
        <div style={isMobile ? {
          borderBottom: '1px solid #e2e8f0', padding: '8px 12px',
          display: 'flex', overflowX: 'auto', gap: 8, flexShrink: 0,
        } : {
          width: 210, borderRight: '1px solid #e2e8f0', padding: '12px 0', flexShrink: 0,
        }}>
          {ITEMS.map((item, i) => (
            isMobile ? (
              <div key={i} onClick={() => setActive(i)} style={{
                padding: '6px 14px', cursor: 'pointer', fontSize: 12,
                fontFamily: 'system-ui', color: active === i ? ACCENT : '#475569',
                background: active === i ? '#eef2ff' : '#f1f5f9',
                border: active === i ? '1.5px solid #6366f1' : '1.5px solid transparent',
                borderRadius: 20, fontWeight: active === i ? 600 : 400,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>{item}</div>
            ) : (
              <div key={i} onClick={() => setActive(i)} style={{
                padding: '9px 16px', cursor: 'pointer', fontSize: 13,
                fontFamily: 'system-ui', color: active === i ? ACCENT : '#475569',
                background: active === i ? '#eef2ff' : 'transparent',
                borderLeft: active === i ? '3px solid #6366f1' : '3px solid transparent',
                fontWeight: active === i ? 600 : 400,
              }}>{item}</div>
            )
          ))}
        </div>
        <div style={{ flex: 1, padding: isMobile ? 14 : 28, overflowY: 'auto' }}>
          {renderActive()}
        </div>
      </div>
    </div>
  )
}
