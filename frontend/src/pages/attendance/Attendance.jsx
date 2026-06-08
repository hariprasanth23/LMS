import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdCheck, MdClose, MdCalendarToday, MdWarning, MdChevronLeft, MdChevronRight, MdUploadFile } from 'react-icons/md'
import PageHeader from '../../components/common/PageHeader'
import CsvImportModal from '../../components/common/CsvImportModal'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getWeekDates(anchor) {
  const d = new Date(anchor)
  const day = d.getDay() // 0=Sun
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((day + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(monday)
    dd.setDate(monday.getDate() + i)
    return dd
  })
}

function getMonthDates(anchor) {
  const d = new Date(anchor)
  const year = d.getFullYear(), month = d.getMonth()
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const offset = (first.getDay() + 6) % 7 // Mon=0
  const days = []
  for (let i = 0; i < offset; i++) days.push(null)
  for (let i = 1; i <= last.getDate(); i++) days.push(new Date(year, month, i))
  return days
}

function toISODate(d) {
  if (!d) return ''
  return d.toISOString().split('T')[0]
}

function ProgressRing({ pct, size = 80, stroke = 7, color }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeDasharray={`${circ}`}
        strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  )
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{
      flex: 1, minWidth: 130, background: '#fff', borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: '18px 20px'
    }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: color || TEXT, fontFamily: 'system-ui, sans-serif', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginTop: 4, fontFamily: 'system-ui, sans-serif' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: MUTED, marginTop: 2, fontFamily: 'system-ui, sans-serif' }}>{sub}</div>}
    </div>
  )
}

// ─── Calendar component ────────────────────────────────────────────────────────

function AttendanceCalendar({ records, calView, setCalView, calAnchor, setCalAnchor }) {
  const statusMap = {}
  records.forEach(r => { if (r.date) statusMap[r.date] = r.present })

  const shiftAnchor = (dir) => {
    const d = new Date(calAnchor)
    if (calView === 'week') d.setDate(d.getDate() + dir * 7)
    else d.setMonth(d.getMonth() + dir)
    setCalAnchor(d)
  }

  const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const today = toISODate(new Date())

  const getDayStyle = (date) => {
    if (!date) return {}
    const iso = toISODate(date)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const status = statusMap[iso]
    const isToday = iso === today
    let bg = 'transparent', color = TEXT, border = '1px solid transparent', fw = 400

    if (isWeekend) { bg = '#f1f5f9'; color = MUTED }
    else if (status === true) { bg = '#dcfce7'; color = '#166534'; border = '1px solid #bbf7d0' }
    else if (status === false) { bg = '#fee2e2'; color = '#991b1b'; border = '1px solid #fecaca' }

    if (isToday) { border = `2px solid ${ACCENT}`; fw = 700 }
    return { bg, color, border, fw }
  }

  const headerLabel = () => {
    if (calView === 'week') {
      const week = getWeekDates(calAnchor)
      return `${week[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${week[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    return calAnchor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const days = calView === 'week' ? getWeekDates(calAnchor) : getMonthDates(calAnchor)

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: 20, marginBottom: 20 }}>
      {/* Calendar header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => shiftAnchor(-1)} style={{ background: '#f8fafc', border: 'none', borderRadius: 7, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: TEXT }}>
            <MdChevronLeft size={18} />
          </button>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif', minWidth: 180, textAlign: 'center' }}>{headerLabel()}</span>
          <button onClick={() => shiftAnchor(1)} style={{ background: '#f8fafc', border: 'none', borderRadius: 7, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: TEXT }}>
            <MdChevronRight size={18} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['week', 'month'].map(v => (
            <button key={v} onClick={() => setCalView(v)} style={{
              padding: '6px 14px', borderRadius: 7, border: 'none',
              background: calView === v ? ACCENT : '#f1f5f9',
              color: calView === v ? '#fff' : MUTED,
              fontSize: 12, fontWeight: 700, fontFamily: 'system-ui, sans-serif', cursor: 'pointer'
            }}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 12, flexWrap: 'wrap' }}>
        {[['#dcfce7', '#166534', 'Present'], ['#fee2e2', '#991b1b', 'Absent'], ['#f1f5f9', MUTED, 'Weekend']].map(([bg, color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ width: 12, height: 12, background: bg, borderRadius: 3 }} />
            {label}
          </div>
        ))}
      </div>

      {/* Day-of-week header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: MUTED, fontFamily: 'system-ui, sans-serif', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 4
      }}>
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />
          const { bg, color, border, fw } = getDayStyle(date)
          const iso = toISODate(date)
          const isToday = iso === today
          return (
            <div key={iso} style={{
              aspectRatio: '1',
              background: bg, border, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: fw, color,
              fontFamily: 'system-ui, sans-serif',
              position: 'relative',
              outline: isToday ? `2px solid ${ACCENT}` : 'none',
              outlineOffset: isToday ? -2 : 0
            }}>
              {date.getDate()}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Student view ──────────────────────────────────────────────────────────────

function StudentView({ myAttendance }) {
  const [calView, setCalView] = useState('week')
  const [calAnchor, setCalAnchor] = useState(new Date())

  const total = myAttendance.length
  const presentDays = myAttendance.filter(a => a.present).length
  const absentDays = total - presentDays
  const pct = total === 0 ? 0 : Math.round((presentDays / total) * 100)

  // Group by course
  const byCourse = {}
  myAttendance.forEach(r => {
    const key = r.courseName || r.courseId || 'Unknown'
    if (!byCourse[key]) byCourse[key] = { present: 0, total: 0 }
    byCourse[key].total++
    if (r.present) byCourse[key].present++
  })

  const courseEntries = Object.entries(byCourse)
  const RING_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#a855f7']

  const ringColor = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <PageHeader
        title="My Attendance"
        badge="Student"
        subtitle="Track your attendance across all courses"
      />

      {/* Warning banner */}
      {total > 0 && pct < 75 && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px',
          background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, marginBottom: 20
        }}>
          <MdWarning size={22} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>
              Attendance below 75% — Action required
            </div>
            <div style={{ fontSize: 12, color: '#a16207', marginTop: 2 }}>
              Your overall attendance is {pct}%. You need at least 75% to be eligible for exams. Please attend upcoming classes.
            </div>
          </div>
        </div>
      )}

      {/* Summary stat cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatCard label="Present Days" value={presentDays} icon="✅" color="#10b981" />
        <StatCard label="Absent Days" value={absentDays} icon="❌" color="#ef4444" />
        <StatCard label="Total Classes" value={total} icon="📚" color={ACCENT} />
        <StatCard label="Overall %" value={`${pct}%`} icon="📊" color={ringColor} sub={pct >= 75 ? 'Good standing' : pct >= 50 ? 'At risk' : 'Critical'} />
      </div>

      {/* Per-course progress rings */}
      {courseEntries.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Attendance by Course</div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {courseEntries.map(([courseName, data], i) => {
              const cp = data.total === 0 ? 0 : Math.round((data.present / data.total) * 100)
              const rc = cp >= 75 ? '#10b981' : cp >= 50 ? '#f59e0b' : '#ef4444'
              return (
                <div key={courseName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, minWidth: 100 }}>
                  <div style={{ position: 'relative', width: 80, height: 80 }}>
                    <ProgressRing pct={cp} size={80} stroke={7} color={rc} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, fontWeight: 800, color: rc
                    }}>
                      {cp}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, maxWidth: 90, wordBreak: 'break-word' }}>
                      {courseName}
                    </div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                      {data.present}/{data.total} classes
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Calendar */}
      <AttendanceCalendar
        records={myAttendance}
        calView={calView}
        setCalView={setCalView}
        calAnchor={calAnchor}
        setCalAnchor={setCalAnchor}
      />

      {/* Records table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontSize: 15, fontWeight: 700, color: TEXT }}>
          Attendance Records
        </div>
        {myAttendance.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 6 }}>No records yet</div>
            <div style={{ fontSize: 13, color: MUTED }}>Attendance will appear here once classes are marked.</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Date', 'Course', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: MUTED, fontWeight: 700, fontSize: 11, borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...myAttendance].sort((a, b) => (b.date || '').localeCompare(a.date || '')).map((a, i) => (
                <tr key={a.id || i} style={{ borderBottom: '1px solid #f8fafc' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8f9ff'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <td style={{ padding: '10px 16px', color: TEXT, fontWeight: 500 }}>
                    {a.date ? new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                  </td>
                  <td style={{ padding: '10px 16px', color: MUTED }}>{a.courseName || a.courseId || '—'}</td>
                  <td style={{ padding: '10px 16px' }}>
                    {a.present ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#10b981', fontWeight: 700, background: '#f0fdf4', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>
                        <MdCheck size={14} /> Present
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#ef4444', fontWeight: 700, background: '#fef2f2', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>
                        <MdClose size={14} /> Absent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── Faculty / Admin view ──────────────────────────────────────────────────────

function FacultyView({ user, courses }) {
  const [selectedCourse, setSelectedCourse] = useState('')
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [studentSearch, setStudentSearch] = useState('')
  const [showImport, setShowImport] = useState(false)

  useEffect(() => {
    if (!selectedCourse) return
    setLoading(true)
    setStudentSearch('')
    api.get(`/students?courseId=${selectedCourse}`)
      .then(res => {
        const s = res.data.data || []
        setStudents(s)
        const init = {}
        s.forEach(st => { init[st.id] = true })
        setAttendance(init)
      })
      .catch(() => {
        api.get('/students').then(res => {
          const s = res.data.data || []
          setStudents(s)
          const init = {}
          s.forEach(st => { init[st.id] = true })
          setAttendance(init)
        }).catch(() => {})
      })
      .finally(() => setLoading(false))
  }, [selectedCourse])

  const handleMark = async () => {
    if (!selectedCourse) { toast.error('Please select a course'); return }
    if (students.length === 0) { toast.error('No students to mark attendance for'); return }
    setSubmitting(true)
    try {
      const records = students.map(s => ({
        studentId: s.id, courseId: selectedCourse, date,
        present: attendance[s.id] !== false
      }))
      await api.post('/attendance/bulk', { records })
      toast.success('Attendance saved successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(studentSearch.toLowerCase())
  )

  const presentCount = students.filter(s => attendance[s.id] !== false).length
  const absentCount = students.length - presentCount

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <PageHeader
        title="Mark Attendance"
        badge={user?.role === 'ADMIN' ? 'Admin' : 'Faculty'}
        subtitle="Select a course and date to record attendance"
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowImport(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: '#fff', color: '#6366f1', border: '1.5px solid #c7d2fe', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <MdUploadFile size={16} /> Import CSV
            </button>
            <button onClick={handleMark} disabled={submitting || !selectedCourse || students.length === 0}
              style={{ padding: '10px 22px', background: (submitting || !selectedCourse || students.length === 0) ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: (submitting || !selectedCourse || students.length === 0) ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Saving…' : '💾 Save Attendance'}
            </button>
          </div>
        }
      />

      {/* Controls */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: 20, marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Course</label>
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui, sans-serif', color: TEXT, outline: 'none', cursor: 'pointer', background: '#fff' }}
          >
            <option value="">Select a course…</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title} ({c.courseCode})</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui, sans-serif', color: TEXT, outline: 'none' }}
          />
        </div>
      </div>

      {/* Summary mini stats */}
      {selectedCourse && students.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <StatCard label="Present" value={presentCount} icon="✅" color="#10b981" />
          <StatCard label="Absent" value={absentCount} icon="❌" color="#ef4444" />
          <StatCard label="Total" value={students.length} icon="👥" color={ACCENT} />
          <StatCard label="Attendance %" value={students.length ? `${Math.round(presentCount / students.length * 100)}%` : '0%'} icon="📊" color={ACCENT} />
        </div>
      )}

      {/* Student checklist */}
      {selectedCourse && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>
              {loading ? 'Loading…' : `${students.length} Students`}
            </span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Student search */}
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search student…"
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  style={{ padding: '6px 10px 6px 30px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 12, fontFamily: 'system-ui, sans-serif', color: TEXT, outline: 'none', width: 160 }}
                />
                <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 14 }}>🔍</span>
              </div>
              {students.length > 0 && (
                <>
                  <button
                    onClick={() => { const all = {}; students.forEach(s => { all[s.id] = true }); setAttendance(all) }}
                    style={{ padding: '6px 12px', background: '#f0fdf4', border: 'none', borderRadius: 7, cursor: 'pointer', color: '#10b981', fontSize: 12, fontWeight: 700 }}
                  >
                    ✅ All Present
                  </button>
                  <button
                    onClick={() => { const all = {}; students.forEach(s => { all[s.id] = false }); setAttendance(all) }}
                    style={{ padding: '6px 12px', background: '#fef2f2', border: 'none', borderRadius: 7, cursor: 'pointer', color: '#ef4444', fontSize: 12, fontWeight: 700 }}
                  >
                    ❌ All Absent
                  </button>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: MUTED }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
              Loading students…
            </div>
          ) : students.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>👥</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 6 }}>No students found</div>
              <div style={{ fontSize: 13, color: MUTED }}>No students are enrolled in this course.</div>
            </div>
          ) : (
            <div>
              {filteredStudents.map((s, i) => {
                const isPresent = attendance[s.id] !== false
                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '13px 20px', borderBottom: '1px solid #f8fafc',
                      background: isPresent ? 'rgba(240,253,244,0.4)' : 'rgba(254,242,242,0.4)',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: isPresent ? '#10b981' : '#ef4444', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: MUTED }}>{s.rollNumber}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setAttendance(prev => ({ ...prev, [s.id]: !prev[s.id] }))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 18px', minWidth: 110,
                        background: isPresent ? '#f0fdf4' : '#fef2f2',
                        color: isPresent ? '#10b981' : '#ef4444',
                        border: `1.5px solid ${isPresent ? '#bbf7d0' : '#fecaca'}`,
                        borderRadius: 20, cursor: 'pointer',
                        fontSize: 13, fontWeight: 700, fontFamily: 'system-ui, sans-serif',
                        transition: 'all 0.15s', justifyContent: 'center'
                      }}
                    >
                      {isPresent ? <><MdCheck size={15} /> Present</> : <><MdClose size={15} /> Absent</>}
                    </button>
                  </div>
                )
              })}
              {filteredStudents.length === 0 && studentSearch && (
                <div style={{ padding: 24, textAlign: 'center', color: MUTED, fontSize: 13 }}>
                  No students match "{studentSearch}"
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <CsvImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        title="Import Student Attendance"
        sampleFile="sample_attendance.csv"
        columns={[
          { key: 'studentId', label: 'Student ID (UUID)',        required: true },
          { key: 'courseId',  label: 'Course ID (UUID)',         required: true },
          { key: 'date',      label: 'Date (YYYY-MM-DD)',        required: true, type: 'date' },
          { key: 'status',    label: 'Status',                   required: true, enum: ['PRESENT','ABSENT','LATE','EXCUSED'] },
        ]}
        sampleRows={[
          { studentId: 'bbbb0001-0000-0000-0000-000000000000', courseId: 'dddd0001-0000-0000-0000-000000000000', date: '2026-07-01', status: 'PRESENT' },
          { studentId: 'bbbb0002-0000-0000-0000-000000000000', courseId: 'dddd0002-0000-0000-0000-000000000000', date: '2026-07-01', status: 'ABSENT' },
        ]}
        importFn={async (rows) => {
          const grouped = {}
          rows.forEach(r => {
            const key = `${r.courseId}|${r.date}`
            if (!grouped[key]) grouped[key] = { courseId: r.courseId, date: r.date, entries: [] }
            grouped[key].entries.push({ studentId: r.studentId, status: r.status })
          })
          let successCount = 0, failureCount = 0
          const results = []
          let rowIdx = 2
          for (const payload of Object.values(grouped)) {
            try {
              await api.post('/attendance/student', payload)
              payload.entries.forEach(() => {
                results.push({ row: rowIdx++, success: true, message: 'Imported successfully' })
                successCount++
              })
            } catch (e) {
              payload.entries.forEach(() => {
                results.push({ row: rowIdx++, success: false, message: e.response?.data?.message || e.message })
                failureCount++
              })
            }
          }
          return { successCount, failureCount, results }
        }}
      />
    </div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────

export default function Attendance() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [myAttendance, setMyAttendance] = useState([])

  useEffect(() => {
    if (user?.role === 'FACULTY') {
      api.get('/courses/my').then(res => setCourses(res.data.data || [])).catch(() => {})
    } else if (user?.role === 'STUDENT') {
      api.get('/attendance/my').then(res => setMyAttendance(res.data.data || [])).catch(() => {})
    } else if (user?.role === 'ADMIN') {
      api.get('/courses').then(res => setCourses(res.data.data || [])).catch(() => {})
    }
  }, [user])

  if (user?.role === 'STUDENT') {
    return <StudentView myAttendance={myAttendance} />
  }

  return <FacultyView user={user} courses={courses} />
}
