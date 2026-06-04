import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdEventNote, MdCheck, MdClose } from 'react-icons/md'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

export default function Attendance() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [attendance, setAttendance] = useState({})
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
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

  useEffect(() => {
    if (selectedCourse && (user?.role === 'FACULTY' || user?.role === 'ADMIN')) {
      setLoading(true)
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
    }
  }, [selectedCourse])

  const handleMark = async () => {
    if (!selectedCourse) { toast.error('Please select a course'); return }
    if (students.length === 0) { toast.error('No students to mark attendance for'); return }
    setSubmitting(true)
    try {
      const records = students.map(s => ({
        studentId: s.id,
        courseId: selectedCourse,
        date,
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

  const calcPercent = () => {
    if (myAttendance.length === 0) return 0
    const present = myAttendance.filter(a => a.present).length
    return Math.round((present / myAttendance.length) * 100)
  }

  // Student view
  if (user?.role === 'STUDENT') {
    const pct = calcPercent()
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>My Attendance</h1>
        </div>

        {/* Summary card */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 28, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
            <svg viewBox="0 0 36 36" style={{ width: 90, height: 90, transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none"
                stroke={pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="3"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', fontSize: 18, fontWeight: 700, color: TEXT }}>
              {pct}%
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 16, fontWeight: 700, color: TEXT }}>Overall Attendance</div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED, marginTop: 4 }}>
              {myAttendance.filter(a => a.present).length} present out of {myAttendance.length} classes
            </div>
            <div style={{ marginTop: 8 }}>
              <span style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                fontFamily: 'system-ui, sans-serif',
                background: pct >= 75 ? '#f0fdf4' : pct >= 50 ? '#fffbeb' : '#fef2f2',
                color: pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
              }}>
                {pct >= 75 ? 'Good Standing' : pct >= 50 ? 'At Risk' : 'Critical'}
              </span>
            </div>
          </div>
        </div>

        {/* Records table */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontFamily: 'system-ui, sans-serif', fontSize: 15, fontWeight: 700, color: TEXT }}>
            Attendance Records
          </div>
          {myAttendance.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: MUTED }}>No attendance records yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Date', 'Course', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myAttendance.map((a, i) => (
                  <tr key={a.id || i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 16px', color: TEXT }}>{a.date}</td>
                    <td style={{ padding: '10px 16px', color: MUTED }}>{a.courseName || a.courseId || '-'}</td>
                    <td style={{ padding: '10px 16px' }}>
                      {a.present ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10b981', fontWeight: 600 }}>
                          <MdCheck size={16} /> Present
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ef4444', fontWeight: 600 }}>
                          <MdClose size={16} /> Absent
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

  // Faculty / Admin view - mark attendance
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>Mark Attendance</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>Record student attendance for a class</p>
      </div>

      {/* Controls */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 20, marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, fontFamily: 'system-ui, sans-serif' }}>Course</label>
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif', color: TEXT, outline: 'none', cursor: 'pointer' }}
          >
            <option value="">Select a course...</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title} ({c.courseCode})</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, fontFamily: 'system-ui, sans-serif' }}>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif', color: TEXT, outline: 'none' }}
          />
        </div>
        <button
          onClick={handleMark}
          disabled={submitting || !selectedCourse}
          style={{
            padding: '9px 20px', background: submitting ? '#a5b4fc' : ACCENT,
            color: '#fff', border: 'none', borderRadius: 8, fontSize: 13,
            fontWeight: 600, fontFamily: 'system-ui, sans-serif',
            cursor: submitting || !selectedCourse ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>

      {/* Student list */}
      {selectedCourse && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, fontWeight: 700, color: TEXT }}>
              {loading ? 'Loading...' : `${students.length} Students`}
            </span>
            {students.length > 0 && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => { const all = {}; students.forEach(s => { all[s.id] = true }); setAttendance(all) }}
                  style={{ padding: '5px 12px', background: '#f0fdf4', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#10b981', fontSize: 12, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => { const all = {}; students.forEach(s => { all[s.id] = false }); setAttendance(all) }}
                  style={{ padding: '5px 12px', background: '#fef2f2', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#ef4444', fontSize: 12, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}
                >
                  Mark All Absent
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: MUTED }}>Loading students...</div>
          ) : students.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: MUTED }}>No students found for this course</div>
          ) : (
            <div style={{ padding: '8px 0' }}>
              {students.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 20px', borderBottom: '1px solid #f8fafc'
                }}>
                  <div style={{ fontFamily: 'system-ui, sans-serif' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>{s.rollNumber}</div>
                  </div>
                  <button
                    onClick={() => setAttendance(prev => ({ ...prev, [s.id]: !prev[s.id] }))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 16px',
                      background: attendance[s.id] !== false ? '#f0fdf4' : '#fef2f2',
                      color: attendance[s.id] !== false ? '#10b981' : '#ef4444',
                      border: `1px solid ${attendance[s.id] !== false ? '#bbf7d0' : '#fecaca'}`,
                      borderRadius: 20, cursor: 'pointer',
                      fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif',
                      transition: 'all 0.15s'
                    }}
                  >
                    {attendance[s.id] !== false ? <><MdCheck size={16} /> Present</> : <><MdClose size={16} /> Absent</>}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
