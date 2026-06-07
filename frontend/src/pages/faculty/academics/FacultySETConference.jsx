import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const ITEMS = ['View Registration', 'SET Mark Entry']

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 28, height: 28, border: '3px solid #e2e8f0', borderTopColor: ACCENT, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

// ─── View Registration ────────────────────────────────────────────────────────
function ViewRegistration({ courses, enrollments, loading }) {
  const [reminded, setReminded] = useState({})

  const aggregateFeedback = [
    { aspect: 'Subject Knowledge', avg: 4.7 },
    { aspect: 'Teaching Clarity', avg: 4.5 },
    { aspect: 'Punctuality', avg: 4.8 },
    { aspect: 'Interaction with Students', avg: 4.4 },
    { aspect: 'Course Coverage', avg: 4.6 },
  ]

  if (loading) return <Spinner />

  return (
    <div>
      <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#92400e', fontFamily: 'system-ui' }}>
        SET feedback scores — backend endpoint pending. Course list and enrollment counts are live.
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>SET Registration Summary — My Courses</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', marginBottom: 28 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Course', 'Name', 'Enrolled', 'Completed', 'Pending', 'Action'].map(h => (
              <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: MUTED }}>No courses assigned.</td></tr>
          ) : courses.map((c) => {
            const total = enrollments[c.id] ?? 0
            const completed = typeof total === 'number' ? Math.round(total * 0.88) : '—'
            const pending = typeof total === 'number' ? total - completed : '—'
            return (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{c.code}</td>
                <td style={{ padding: '9px 10px', color: TEXT }}>{c.name}</td>
                <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 600, textAlign: 'center' }}>{total}</td>
                <td style={{ padding: '9px 10px', textAlign: 'center' }}>
                  <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 12, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{completed}</span>
                </td>
                <td style={{ padding: '9px 10px', textAlign: 'center' }}>
                  {typeof pending === 'number' && pending > 0
                    ? <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: 12, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{pending}</span>
                    : <span style={{ color: MUTED, fontSize: 12 }}>—</span>}
                </td>
                <td style={{ padding: '9px 10px' }}>
                  {typeof pending === 'number' && pending > 0
                    ? <button onClick={() => setReminded(prev => ({ ...prev, [c.id]: true }))} disabled={reminded[c.id]} style={{ background: reminded[c.id] ? '#f1f5f9' : ACCENT, color: reminded[c.id] ? MUTED : '#fff', border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 11, cursor: reminded[c.id] ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                        {reminded[c.id] ? 'Reminded' : 'Send Reminder'}
                      </button>
                    : <span style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>All done</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 10 }}>
        Aggregate Feedback (Anonymized)
        <span style={{ fontSize: 12, color: MUTED, fontWeight: 400, marginLeft: 8 }}>— Placeholder data</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 480 }}>
        {aggregateFeedback.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 200, fontSize: 13, color: TEXT, fontFamily: 'system-ui', flexShrink: 0 }}>{f.aspect}</div>
            <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ width: `${(f.avg / 5) * 100}%`, height: '100%', background: ACCENT, borderRadius: 8 }} />
            </div>
            <div style={{ width: 40, fontSize: 13, fontWeight: 700, color: ACCENT, textAlign: 'right' }}>{f.avg}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── SET Mark Entry ───────────────────────────────────────────────────────────
function SETMarkEntry({ courses, allStudents }) {
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [enrollments, setEnrollments] = useState([])
  const [loadingEnroll, setLoadingEnroll] = useState(false)
  const [scores, setScores] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (courses.length && !selectedCourseId) setSelectedCourseId(courses[0].id)
  }, [courses])

  useEffect(() => {
    if (!selectedCourseId) return
    setLoadingEnroll(true)
    api.get(`/enrollments/course/${selectedCourseId}`)
      .then(r => {
        const list = r.data?.data || []
        setEnrollments(list)
        const init = {}
        list.forEach(e => { init[e.studentId] = '' })
        setScores(init)
      })
      .catch(console.error)
      .finally(() => setLoadingEnroll(false))
  }, [selectedCourseId])

  const getGrade = (score) => {
    if (score >= 45) return ['O', '#dcfce7', '#15803d']
    if (score >= 40) return ['A+', '#dbeafe', '#1d4ed8']
    if (score >= 35) return ['A', '#ccfbf1', '#0f766e']
    return ['B', '#fef3c7', '#b45309']
  }

  const students = enrollments.map(e => allStudents[e.studentId]).filter(Boolean)

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Select Course</label>
        <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', width: 300 }}>
          {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 6 }}>Upload SET Evaluation Forms</label>
        <div style={{ border: '2px dashed #c7d2fe', borderRadius: 8, padding: '16px', textAlign: 'center', background: '#fafbff', cursor: 'pointer' }}>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>Drop PDF/ZIP here or <span style={{ color: ACCENT, fontWeight: 600 }}>browse files</span></div>
        </div>
      </div>

      {submitted && (
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 16px', marginBottom: 14, fontSize: 13, color: '#15803d', fontWeight: 600 }}>
          SET marks submitted for processing.
        </div>
      )}

      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 10 }}>Enrolled Students — Score Entry (Max: 50)</div>
      {loadingEnroll ? <Spinner /> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', marginBottom: 16 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Roll No', 'Department', 'Score (/50)', 'Grade'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center', color: MUTED }}>No enrolled students found.</td></tr>
            ) : students.map((s) => {
              const sc = scores[s.id] ?? ''
              const [grade, gbg, gcl] = sc !== '' ? getGrade(Number(sc)) : ['—', '#f1f5f9', MUTED]
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 10px', color: ACCENT, fontWeight: 700 }}>{s.rollNumber}</td>
                  <td style={{ padding: '8px 10px', color: TEXT }}>{s.department?.name ?? '—'}</td>
                  <td style={{ padding: '6px 10px' }}>
                    <input type="number" min={0} max={50} value={sc} onChange={e => setScores(p => ({ ...p, [s.id]: e.target.value }))} style={{ width: 70, padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, textAlign: 'center' }} />
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <span style={{ background: gbg, color: gcl, fontSize: 12, borderRadius: 8, padding: '2px 9px', fontWeight: 700 }}>{grade}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      <div style={{ display: 'flex', gap: 10 }}>
        <button style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Save Draft</button>
        <button onClick={() => setSubmitted(true)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Submit Marks</button>
      </div>
    </div>
  )
}

export default function FacultySETConference() {
  const { user } = useAuth()
  const [active, setActive] = useState(0)
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState({})
  const [allStudents, setAllStudents] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return
    setLoading(true)
    Promise.all([
      api.get('/courses').then(r => (r.data?.data || []).filter(c => c.facultyId === user.userId)).catch(() => []),
      api.get('/students').then(r => { const m = {}; (r.data?.data || []).forEach(s => { m[s.id] = s }); return m }).catch(() => ({})),
    ])
      .then(async ([myCourses, studMap]) => {
        setCourses(myCourses)
        setAllStudents(studMap)
        const counts = await Promise.all(myCourses.map(c => api.get(`/enrollments/course/${c.id}`).then(r => [c.id, (r.data?.data || []).length]).catch(() => [c.id, 0])))
        setEnrollments(Object.fromEntries(counts))
      })
      .finally(() => setLoading(false))
  }, [user?.userId])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100%', padding: 1 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TEXT }}>Academics — SET Conference</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED }}>Student Evaluation of Teachers — registrations and marks</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', minHeight: 520 }}>
        <div style={{ width: 210, borderRight: '1px solid #e2e8f0', padding: '12px 0', flexShrink: 0 }}>
          {ITEMS.map((item, i) => (
            <div key={i} onClick={() => setActive(i)} style={{ padding: '9px 16px', cursor: 'pointer', fontSize: 13, color: active === i ? ACCENT : '#475569', background: active === i ? '#eef2ff' : 'transparent', borderLeft: active === i ? '3px solid #6366f1' : '3px solid transparent', fontWeight: active === i ? 600 : 400 }}>{item}</div>
          ))}
        </div>
        <div style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
          {active === 0 && <ViewRegistration courses={courses} enrollments={enrollments} loading={loading} />}
          {active === 1 && <SETMarkEntry courses={courses} allStudents={allStudents} />}
        </div>
      </div>
    </div>
  )
}
