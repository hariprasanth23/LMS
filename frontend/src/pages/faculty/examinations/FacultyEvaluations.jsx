import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['Mark Entry', 'Arrear Mark Entry', 'Arrear Rev Mark Entry', 'Arrear Grades']

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

// ─── Mark Entry (Assignment Grading) ─────────────────────────────────────────
function MarkEntrySection({ courses, allStudents, coursesLoading }) {
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('')
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [grades, setGrades] = useState({})     // { submissionId: { marks, feedback } }
  const [loadingAssignments, setLoadingAssignments] = useState(false)
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const [savedIds, setSavedIds] = useState(new Set())

  useEffect(() => {
    if (courses.length && !selectedCourseId) setSelectedCourseId(courses[0].id)
  }, [courses])

  useEffect(() => {
    if (!selectedCourseId) return
    setLoadingAssignments(true)
    setAssignments([])
    setSelectedAssignmentId('')
    setSubmissions([])
    api.get(`/courses/${selectedCourseId}/assignments`)
      .then(r => {
        const list = r.data?.data || []
        setAssignments(list)
        if (list.length) setSelectedAssignmentId(list[0].id)
      })
      .catch(console.error)
      .finally(() => setLoadingAssignments(false))
  }, [selectedCourseId])

  const handleLoad = () => {
    if (!selectedAssignmentId) return
    setLoadingSubmissions(true)
    setSubmissions([])
    setSavedIds(new Set())
    api.get(`/assignments/${selectedAssignmentId}/submissions`)
      .then(r => {
        const list = r.data?.data || []
        setSubmissions(list)
        const initial = {}
        list.forEach(s => { initial[s.id] = { marks: s.marks ?? '', feedback: s.feedback ?? '' } })
        setGrades(initial)
      })
      .catch(console.error)
      .finally(() => setLoadingSubmissions(false))
  }

  const handleGrade = async (submissionId) => {
    const g = grades[submissionId]
    if (g.marks === '' || g.marks === null) return
    setSavingId(submissionId)
    try {
      await api.put(`/assignments/submissions/${submissionId}/grade`, {
        marks: parseInt(g.marks),
        feedback: g.feedback || null,
      })
      setSavedIds(prev => new Set(prev).add(submissionId))
    } catch (err) {
      console.error(err)
    } finally {
      setSavingId(null)
    }
  }

  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId)
  const selectedCourse = courses.find(c => c.id === selectedCourseId)

  if (coursesLoading) return <Spinner />

  return (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Assignment Grading</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Course *</label>
            <select style={inputStyle} value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Assignment *</label>
            {loadingAssignments ? (
              <div style={{ padding: '9px 12px', color: MUTED, fontSize: 14 }}>Loading…</div>
            ) : (
              <select style={inputStyle} value={selectedAssignmentId} onChange={e => setSelectedAssignmentId(e.target.value)} disabled={!assignments.length}>
                {assignments.length === 0
                  ? <option>No assignments</option>
                  : assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)
                }
              </select>
            )}
          </div>
          <button onClick={handleLoad} disabled={!selectedAssignmentId} style={{ background: selectedAssignmentId ? ACCENT : '#94a3b8', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 600, cursor: selectedAssignmentId ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>
            Load Submissions
          </button>
        </div>
        {selectedAssignment && (
          <div style={{ marginTop: 12, fontSize: 13, color: MUTED }}>
            Due: {fmt(selectedAssignment.dueDate)} · Max marks: {selectedAssignment.maxMarks ?? '—'}
          </div>
        )}
      </div>

      {loadingSubmissions ? <Spinner /> : submissions.length > 0 && (
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: TEXT }}>
              {selectedCourse?.code} — {selectedAssignment?.title}
            </span>
            <span style={{ fontSize: 13, color: MUTED }}>{submissions.length} submission(s)</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 700 }}>
              <thead>
                <tr>{['Roll No', 'Submitted', 'File / Content', `Marks (/${selectedAssignment?.maxMarks ?? '—'})`, 'Feedback', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {submissions.map(sub => {
                  const student = allStudents[sub.studentId]
                  const g = grades[sub.id] || { marks: '', feedback: '' }
                  const isSaved = savedIds.has(sub.id)
                  const isSaving = savingId === sub.id
                  return (
                    <tr key={sub.id}>
                      <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>
                        {student?.rollNumber ?? sub.studentId.slice(0, 8) + '…'}
                      </td>
                      <td style={{ ...tdStyle, color: MUTED, fontSize: 13 }}>{fmt(sub.submittedAt)}</td>
                      <td style={tdStyle}>
                        {sub.fileUrl
                          ? <a href={sub.fileUrl} target="_blank" rel="noreferrer" style={{ color: ACCENT, fontWeight: 600 }}>View File</a>
                          : sub.content
                            ? <span style={{ color: MUTED, fontSize: 12 }}>{sub.content.slice(0, 40)}…</span>
                            : <span style={{ color: MUTED }}>—</span>
                        }
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="number" min={0} max={selectedAssignment?.maxMarks ?? 100}
                          style={{ ...inputStyle, width: 90, padding: '6px 10px' }}
                          value={g.marks}
                          onChange={e => setGrades(p => ({ ...p, [sub.id]: { ...p[sub.id], marks: e.target.value } }))}
                          placeholder={`0–${selectedAssignment?.maxMarks ?? 100}`}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          style={{ ...inputStyle, padding: '6px 10px', fontSize: 13 }}
                          value={g.feedback}
                          onChange={e => setGrades(p => ({ ...p, [sub.id]: { ...p[sub.id], feedback: e.target.value } }))}
                          placeholder="Optional feedback…"
                        />
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleGrade(sub.id)}
                          disabled={isSaving || g.marks === ''}
                          style={{
                            background: isSaved ? '#dcfce7' : isSaving ? '#94a3b8' : ACCENT,
                            color: isSaved ? '#15803d' : '#fff',
                            border: 'none', borderRadius: 7, padding: '6px 14px',
                            fontSize: 13, fontWeight: 600,
                            cursor: isSaving || g.marks === '' ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {isSaving ? '…' : isSaved ? 'Saved ✓' : 'Save'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loadingSubmissions && submissions.length === 0 && selectedAssignmentId && (
        <div style={{ ...card, padding: 32, textAlign: 'center', color: MUTED }}>No submissions yet for this assignment.</div>
      )}
    </div>
  )
}

// ─── Arrear Mark Entry ─────────────────────────────────────────────────────────
function ArrearMarkEntrySection() {
  const [course, setCourse] = useState('')
  const [month, setMonth] = useState('November 2025')
  const [loaded, setLoaded] = useState(false)
  const [marks, setMarks] = useState({})

  const arrearStudents = [
    { rollNo: '20BCE0112', name: 'Deepak Mohan', attempt: 3, arrearType: 'Repeat' },
    { rollNo: '20BCE0088', name: 'Lakshmi Priya', attempt: 2, arrearType: 'Supplementary' },
  ]

  return (
    <div>
      <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#92400e' }}>
        Arrear exam mark entry — backend endpoint pending. Data below is placeholder.
      </div>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Arrear Mark Entry</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Course *</label>
            <input style={inputStyle} value={course} onChange={e => setCourse(e.target.value)} placeholder="Enter course code…" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Arrear Exam Month/Year *</label>
            <select style={inputStyle} value={month} onChange={e => setMonth(e.target.value)}>
              {['November 2025', 'May 2025', 'November 2024'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <button onClick={() => { setLoaded(true); const init = {}; arrearStudents.forEach(s => { init[s.rollNo] = '' }); setMarks(init) }} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Load Arrear Students
          </button>
        </div>
      </div>
      {loaded && (
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Arrear Students — {month}</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>{['Roll No', 'Student Name', 'Attempt', 'Arrear Type', 'Marks (/100)'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {arrearStudents.map((s, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{s.rollNo}</td>
                  <td style={tdStyle}>{s.name}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{s.attempt}</td>
                  <td style={tdStyle}><span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: '#fef3c7', color: '#d97706' }}>{s.arrearType}</span></td>
                  <td style={tdStyle}>
                    <input type="number" min={0} max={100} style={{ ...inputStyle, width: 100, padding: '6px 10px' }} value={marks[s.rollNo] || ''} onChange={e => setMarks(p => ({ ...p, [s.rollNo]: e.target.value }))} placeholder="0–100" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 12 }}>
            <button style={{ background: '#f8fafc', color: TEXT, border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save Draft</button>
            <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Submit Marks</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Arrear Rev Mark Entry ─────────────────────────────────────────────────────
function ArrearRevMarkEntry() {
  const [rollSearch, setRollSearch] = useState('')
  const [studentFound, setStudentFound] = useState(null)
  const [newMark, setNewMark] = useState('')
  const [justification, setJustification] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const arrearStudents = [
    { rollNo: '20BCE0112', name: 'Deepak Mohan', attempt: 3, currentMark: 38 },
    { rollNo: '20BCE0088', name: 'Lakshmi Priya', attempt: 2, currentMark: 44 },
  ]

  const handleSearch = () => {
    const found = arrearStudents.find(s => s.rollNo.toLowerCase() === rollSearch.trim().toLowerCase())
    setStudentFound(found || null)
    setNewMark('')
    setJustification('')
    setSubmitted(false)
  }

  const diff = newMark !== '' && studentFound ? parseInt(newMark) - studentFound.currentMark : null

  return (
    <div>
      <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#92400e' }}>
        Arrear revaluation mark entry — backend endpoint pending. Data below is placeholder.
      </div>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Arrear Revaluation Mark Entry</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'flex-end', maxWidth: 480 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Student Roll No *</label>
            <input style={inputStyle} value={rollSearch} onChange={e => setRollSearch(e.target.value)} placeholder="e.g. 20BCE0112" />
          </div>
          <button onClick={handleSearch} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Search</button>
        </div>
        {!studentFound && rollSearch && (
          <div style={{ marginTop: 12, background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 16px', color: '#dc2626', fontSize: 14 }}>No arrear student found.</div>
        )}
      </div>
      {studentFound && (
        <div style={{ ...card, padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[['Student', studentFound.name], ['Roll No', studentFound.rollNo], ['Attempt', studentFound.attempt], ['Current Marks', `${studentFound.currentMark} / 100`]].map(([l, v]) => (
              <div key={l} style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px' }}>
                <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{v}</div>
              </div>
            ))}
          </div>
          {submitted
            ? <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', color: '#166534', fontWeight: 500, fontSize: 14 }}>Revaluation marks submitted for approval.</div>
            : (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>New Marks (after revaluation) *</label>
                    <input type="number" min={0} max={100} style={inputStyle} value={newMark} onChange={e => setNewMark(e.target.value)} placeholder="0–100" required />
                    {diff !== null && (
                      <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: diff > 0 ? '#16a34a' : diff < 0 ? '#dc2626' : MUTED }}>
                        Difference: {diff > 0 ? `+${diff}` : diff}
                      </div>
                    )}
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Justification *</label>
                    <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={justification} onChange={e => setJustification(e.target.value)} placeholder="Reason for mark revision after revaluation…" required />
                  </div>
                </div>
                <button type="submit" style={{ marginTop: 14, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Submit for Approval</button>
              </form>
            )}
        </div>
      )}
    </div>
  )
}

// ─── Arrear Grades ─────────────────────────────────────────────────────────────
function ArrearGradesSection() {
  const initRows = [
    { student: 'Deepak Mohan', rollNo: '20BCE0112', course: 'CS5101 — Machine Learning', attempt: 3, marks: 52, calcGrade: 'C', override: false, justification: '' },
    { student: 'Lakshmi Priya', rollNo: '20BCE0088', course: 'CS5101 — Machine Learning', attempt: 2, marks: 44, calcGrade: 'U', override: false, justification: '' },
  ]
  const [rows, setRows] = useState(initRows)
  const [finalized, setFinalized] = useState(false)

  return (
    <div>
      <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#92400e' }}>
        Arrear grades — backend endpoint pending. Data below is placeholder.
      </div>
      {finalized && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          Arrear grades finalized successfully!
        </div>
      )}
      <div style={{ ...card, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Arrear Exam Grades</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 600 }}>
            <thead>
              <tr>{['Student', 'Course', 'Attempt', 'Marks', 'Calculated Grade', 'Override', 'Justification'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, color: TEXT }}>{r.student}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>{r.rollNo}</div>
                  </td>
                  <td style={tdStyle}>{r.course}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{r.attempt}</td>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>{r.marks}</td>
                  <td style={tdStyle}>
                    {r.override
                      ? <select style={{ ...inputStyle, width: 80, padding: '4px 8px' }} value={r.calcGrade} onChange={e => setRows(prev => prev.map((row, idx) => idx === i ? { ...row, calcGrade: e.target.value } : row))}>
                          {['O', 'A+', 'A', 'B+', 'B', 'C', 'U'].map(g => <option key={g}>{g}</option>)}
                        </select>
                      : <span style={{ fontWeight: 700, color: r.calcGrade === 'U' ? '#dc2626' : r.calcGrade === 'O' ? '#16a34a' : TEXT }}>{r.calcGrade}</span>
                    }
                  </td>
                  <td style={tdStyle}>
                    <input type="checkbox" checked={r.override} onChange={() => setRows(prev => prev.map((row, idx) => idx === i ? { ...row, override: !row.override } : row))} />
                  </td>
                  <td style={tdStyle}>
                    {r.override
                      ? <input style={{ ...inputStyle, padding: '5px 10px', fontSize: 13 }} value={r.justification} onChange={e => setRows(prev => prev.map((row, idx) => idx === i ? { ...row, justification: e.target.value } : row))} placeholder="Reason required…" />
                      : <span style={{ color: MUTED, fontSize: 13 }}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={() => setFinalized(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
        Finalize Arrear Grades
      </button>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyEvaluations() {
  const { user } = useAuth()
  const [activeNav, setActiveNav] = useState('Mark Entry')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [courses, setCourses] = useState([])
  const [allStudents, setAllStudents] = useState({})
  const [coursesLoading, setCoursesLoading] = useState(true)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  useEffect(() => {
    if (!user?.userId) return
    setCoursesLoading(true)
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
      .finally(() => setCoursesLoading(false))
  }, [user?.userId])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: isMobile ? 16 : 32 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: TEXT }}>Examinations — Evaluations</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Grade assignments and manage mark entries</p>
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
          {activeNav === 'Mark Entry' && <MarkEntrySection courses={courses} allStudents={allStudents} coursesLoading={coursesLoading} />}
          {activeNav === 'Arrear Mark Entry' && <ArrearMarkEntrySection />}
          {activeNav === 'Arrear Rev Mark Entry' && <ArrearRevMarkEntry />}
          {activeNav === 'Arrear Grades' && <ArrearGradesSection />}
        </div>
      </div>
    </div>
  )
}
