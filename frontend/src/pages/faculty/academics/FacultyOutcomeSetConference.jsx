import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const ITEMS = ['Mark Entry', 'Approval Page']

function useFacultyCourses(userId) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!userId) return
    api.get('/courses').then(r => setCourses((r.data?.data || []).filter(c => c.facultyId === userId))).catch(console.error).finally(() => setLoading(false))
  }, [userId])
  return { courses, loading }
}

// ─── Mark Entry ───────────────────────────────────────────────────────────────
function MarkEntry({ courses }) {
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [enrollments, setEnrollments] = useState([])
  const [loadingEnroll, setLoadingEnroll] = useState(false)

  useEffect(() => { if (courses.length && !selectedCourseId) setSelectedCourseId(courses[0].id) }, [courses])

  useEffect(() => {
    if (!selectedCourseId) return
    setLoadingEnroll(true)
    api.get(`/enrollments/course/${selectedCourseId}`).then(r => setEnrollments(r.data?.data || [])).catch(console.error).finally(() => setLoadingEnroll(false))
  }, [selectedCourseId])

  const coMax = 5
  const [marks, setMarks] = useState({})

  useEffect(() => {
    const init = {}
    enrollments.forEach(e => { init[e.studentId] = [0, 0, 0, 0, 0] })
    setMarks(init)
  }, [enrollments])

  const updateMark = (roll, coIdx, val) => {
    const v = Math.min(coMax, Math.max(0, Number(val)))
    setMarks(prev => ({ ...prev, [roll]: prev[roll].map((m, i) => i === coIdx ? v : m) }))
  }

  const getTotal = (roll) => marks[roll].reduce((a, b) => a + b, 0)
  const getAttainment = (total) => total >= 20 ? 3 : total >= 15 ? 2 : total >= 10 ? 1 : 0
  const attainColor = (lvl) => [['#f1f5f9', MUTED], ['#fef3c7', '#b45309'], ['#dbeafe', '#1d4ed8'], ['#dcfce7', '#15803d']][lvl]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Select Course</label>
        <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', width: 300 }}>
          <option value="">— Select a course —</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
        </select>
      </div>

      {submitted && (
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#15803d', fontFamily: 'system-ui', fontWeight: 600 }}>
          OSC marks submitted successfully for approval.
        </div>
      )}

      <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', marginBottom: 12 }}>Each CO is scored out of {coMax}. Attainment level: L0 (&lt;10), L1 (10–14), L2 (15–19), L3 (20–25).</div>

      <div style={{ overflowX: 'auto', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Roll No', 'Student Name', 'CO1', 'CO2', 'CO3', 'CO4', 'CO5', 'Total', 'Attainment'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loadingEnroll ? (
              <tr><td colSpan={9} style={{ padding: 20, textAlign: 'center', color: MUTED }}>Loading students…</td></tr>
            ) : enrollments.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: 20, textAlign: 'center', color: MUTED }}>No enrolled students found.</td></tr>
            ) : enrollments.map((e) => {
              const roll = e.studentId
              const mRow = marks[roll] || [0,0,0,0,0]
              const total = mRow.reduce((a,b) => a+b, 0)
              const level = getAttainment(total)
              const [abg, acl] = attainColor(level)
              return (
                <tr key={roll} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 10px', color: ACCENT, fontWeight: 700, fontSize: 11 }}>{roll.slice(0,8)}…</td>
                  <td style={{ padding: '8px 10px', color: MUTED, fontSize: 12 }}>—</td>
                  {mRow.map((m, ci) => (
                    <td key={ci} style={{ padding: '5px 8px' }}>
                      <input type="number" min={0} max={coMax} value={m} onChange={e => updateMark(roll, ci, e.target.value)} style={{ width: 44, padding: '4px 6px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, textAlign: 'center' }} />
                    </td>
                  ))}
                  <td style={{ padding: '8px 10px', fontWeight: 800, color: TEXT }}>{total}</td>
                  <td style={{ padding: '8px 10px' }}>
                    <span style={{ background: abg, color: acl, fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>L{level}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Save Draft</button>
        <button onClick={() => setSubmitted(true)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Submit for Approval</button>
      </div>
    </div>
  )
}

// ─── Approval Page ────────────────────────────────────────────────────────────
function ApprovalPage({ courses }) {
  const statusColor = {
    Draft: ['#f1f5f9', MUTED],
    Submitted: ['#dbeafe', '#1d4ed8'],
    Approved: ['#dcfce7', '#15803d'],
    Returned: ['#fee2e2', '#dc2626'],
  }

  const sheets = courses.map((c, i) => ({
    course: c.code, name: c.name, submitted: i % 3 === 0 ? '—' : 'Jun ' + (i + 1) + ', 2025',
    status: ['Approved', 'Submitted', 'Returned', 'Draft'][i % 4],
    remarks: i % 4 === 2 ? 'CO3 marks need re-entry' : '',
  }))

  const steps = ['Faculty Entry', 'HOD Review', 'Dean Approval', 'Finalized']
  const stepIndex = { Draft: 0, Submitted: 1, Approved: 3, Returned: 1 }

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>OSC Mark Sheets — Approval Status</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sheets.map((s, i) => {
          const [sbg, scl] = statusColor[s.status]
          const step = stepIndex[s.status]
          return (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>
                    <span style={{ color: ACCENT }}>{s.course}</span> — {s.name}
                  </div>
                  <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', marginTop: 2 }}>{s.section} · Submitted: {s.submitted}</div>
                  {s.remarks && <div style={{ fontSize: 12, color: '#dc2626', fontFamily: 'system-ui', marginTop: 4, fontWeight: 600 }}>Remark: {s.remarks}</div>}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ background: sbg, color: scl, fontSize: 12, borderRadius: 8, padding: '3px 10px', fontWeight: 700, fontFamily: 'system-ui' }}>{s.status}</span>
                  <button style={{ background: '#f1f5f9', color: MUTED, border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 12, fontFamily: 'system-ui', cursor: 'pointer' }}>Download</button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {steps.map((st, si) => (
                  <React.Fragment key={si}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: si <= step ? (s.status === 'Returned' && si === step ? '#fee2e2' : '#eef2ff') : '#f1f5f9', border: `2px solid ${si <= step ? (s.status === 'Returned' && si === step ? '#dc2626' : ACCENT) : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {si < step && <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT }} />}
                        {si === step && s.status === 'Returned' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }} />}
                      </div>
                      <div style={{ fontSize: 10, color: si <= step ? (s.status === 'Returned' && si === step ? '#dc2626' : ACCENT) : MUTED, fontFamily: 'system-ui', fontWeight: si <= step ? 600 : 400, textAlign: 'center', width: 70 }}>{st}</div>
                    </div>
                    {si < steps.length - 1 && <div style={{ flex: 1, height: 2, background: si < step ? ACCENT : '#e2e8f0', marginBottom: 22 }} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function FacultyOutcomeSetConference() {
  const { user } = useAuth()
  const { courses, loading } = useFacultyCourses(user?.userId)
  const [active, setActive] = useState(0)

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100%', padding: 1 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>Academics — Outcome Set Conference</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Mark entry and approval for outcome-based assessments</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', minHeight: 520 }}>
        <div style={{ width: 210, borderRight: '1px solid #e2e8f0', padding: '12px 0', flexShrink: 0 }}>
          {ITEMS.map((item, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              padding: '9px 16px', cursor: 'pointer', fontSize: 13,
              fontFamily: 'system-ui', color: active === i ? ACCENT : '#475569',
              background: active === i ? '#eef2ff' : 'transparent',
              borderLeft: active === i ? '3px solid #6366f1' : '3px solid transparent',
              fontWeight: active === i ? 600 : 400
            }}>{item}</div>
          ))}
        </div>
        <div style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
          {active === 0 && <MarkEntry courses={courses} />}
          {active === 1 && <ApprovalPage courses={courses} />}
        </div>
      </div>
    </div>
  )
}
