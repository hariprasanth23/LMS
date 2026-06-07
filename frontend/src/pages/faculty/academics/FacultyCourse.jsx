import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const ITEMS = ['Course Page', 'Course Material Upload', 'Course Syllabus', 'Course Page View', 'Minor / Honour']

const COURSE_PALETTE = [
  { color: '#6366f1', bg: '#eef2ff' },
  { color: '#0891b2', bg: '#e0f2fe' },
  { color: '#7c3aed', bg: '#ede9fe' },
  { color: '#059669', bg: '#d1fae5' },
  { color: '#dc2626', bg: '#fee2e2' },
  { color: '#d97706', bg: '#fef3c7' },
]

const MAT_TYPE_COLOR = {
  PDF:   ['#eef2ff', '#6366f1'],
  VIDEO: ['#fce7f3', '#be185d'],
  LINK:  ['#e0f2fe', '#0891b2'],
  NOTE:  ['#fef3c7', '#b45309'],
}

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

// ─── Course Page ──────────────────────────────────────────────────────────────
function CoursePage({ courses, loading, enrollments }) {
  if (loading) return <Spinner />
  if (!courses.length) return (
    <div style={{ color: MUTED, fontSize: 13, fontFamily: 'system-ui', padding: 24, textAlign: 'center' }}>
      No courses assigned for current semester.
    </div>
  )

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 16 }}>My Courses — Current Semester</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {courses.map((c, i) => {
          const { color, bg } = COURSE_PALETTE[i % COURSE_PALETTE.length]
          const enrolled = enrollments[c.id] ?? '—'
          return (
            <div key={c.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color, fontFamily: 'system-ui' }}>
                  {c.code.slice(-2)}
                </div>
                {c.semester != null && (
                  <span style={{ background: bg, color, fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700, fontFamily: 'system-ui' }}>
                    Sem {c.semester}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 2 }}>{c.code}</div>
              <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui', marginBottom: 14 }}>{c.name}</div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, fontFamily: 'system-ui' }}>{enrolled}</div>
                  <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>Enrolled</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color, fontFamily: 'system-ui' }}>{c.credits ?? '—'}</div>
                  <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>Credits</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: c.status === 'ACTIVE' ? '#15803d' : '#b45309', fontFamily: 'system-ui', marginTop: 2 }}>{c.status}</div>
                  <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>Status</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Materials', 'Announcements', 'Assignments'].map(label => (
                  <button key={label} style={{ flex: 1, background: bg, color, border: 'none', borderRadius: 7, padding: '5px 0', fontSize: 11, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>{label}</button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Course Material Upload ────────────────────────────────────────────────────
function CourseMaterialUpload({ courses }) {
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [title, setTitle] = useState('')
  const [matType, setMatType] = useState('PDF')
  const [url, setUrl] = useState('')
  const [materials, setMaterials] = useState([])
  const [loadingMats, setLoadingMats] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (courses.length && !selectedCourseId) setSelectedCourseId(courses[0].id)
  }, [courses])

  useEffect(() => {
    if (!selectedCourseId) return
    setLoadingMats(true)
    api.get(`/courses/${selectedCourseId}/materials`)
      .then(r => setMaterials(r.data?.data || []))
      .catch(console.error)
      .finally(() => setLoadingMats(false))
  }, [selectedCourseId])

  const handleUpload = async () => {
    if (!selectedCourseId || !title.trim()) return
    setSubmitting(true)
    try {
      const res = await api.post(`/courses/${selectedCourseId}/materials`, {
        title: title.trim(),
        type: matType,
        url: url.trim() || null,
      })
      setMaterials(prev => [...prev, res.data?.data])
      setTitle('')
      setUrl('')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (materialId) => {
    if (!window.confirm('Delete this material?')) return
    try {
      await api.delete(`/courses/materials/${materialId}`)
      setMaterials(prev => prev.filter(m => m.id !== materialId))
    } catch (err) {
      console.error(err)
    }
  }

  const selectedCourse = courses.find(c => c.id === selectedCourseId)

  return (
    <div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>Upload Material</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Course</label>
            <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui' }}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Material Type</label>
            <select value={matType} onChange={e => setMatType(e.target.value)} style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui' }}>
              {['PDF', 'VIDEO', 'LINK', 'NOTE'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Material title..." style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>URL / Link</label>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box' }} />
          </div>
        </div>
        <button onClick={handleUpload} disabled={submitting || !title.trim()} style={{ background: submitting || !title.trim() ? '#94a3b8' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontFamily: 'system-ui', cursor: submitting || !title.trim() ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
          {submitting ? 'Uploading...' : 'Upload Material'}
        </button>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 10 }}>
        Uploaded Materials{selectedCourse ? ` — ${selectedCourse.code}` : ''}
      </div>
      {loadingMats ? <Spinner /> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 520 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Type', 'Title', 'URL', 'Uploaded', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {materials.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center', color: MUTED, fontFamily: 'system-ui' }}>No materials uploaded yet.</td></tr>
              ) : materials.map(m => {
                const [tbg, tcl] = MAT_TYPE_COLOR[m.type] || ['#f1f5f9', MUTED]
                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '9px 10px' }}>
                      <span style={{ background: tbg, color: tcl, fontSize: 11, borderRadius: 7, padding: '2px 7px', fontWeight: 700 }}>{m.type}</span>
                    </td>
                    <td style={{ padding: '9px 10px', color: TEXT, fontSize: 12 }}>{m.title}</td>
                    <td style={{ padding: '9px 10px', fontSize: 12 }}>
                      {m.url ? <a href={m.url} target="_blank" rel="noreferrer" style={{ color: ACCENT }}>Open</a> : '—'}
                    </td>
                    <td style={{ padding: '9px 10px', color: MUTED, fontSize: 12 }}>{fmt(m.uploadedAt)}</td>
                    <td style={{ padding: '9px 10px' }}>
                      <button onClick={() => handleDelete(m.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Course Syllabus ──────────────────────────────────────────────────────────
function CourseSyllabus({ courses }) {
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [coverage, setCoverage] = useState({ 'Unit 1': 0, 'Unit 2': 0, 'Unit 3': 0, 'Unit 4': 0, 'Unit 5': 0 })

  useEffect(() => {
    if (courses.length && !selectedCourseId) setSelectedCourseId(courses[0].id)
  }, [courses])

  const units = Object.keys(coverage)
  const barColor = (pct) => pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : pct > 0 ? '#6366f1' : '#e2e8f0'
  const selectedCourse = courses.find(c => c.id === selectedCourseId)

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ flex: '1 1 260px' }}>
          <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Select Course</label>
          <select
            value={selectedCourseId}
            onChange={e => {
              setSelectedCourseId(e.target.value)
              setCoverage({ 'Unit 1': 0, 'Unit 2': 0, 'Unit 3': 0, 'Unit 4': 0, 'Unit 5': 0 })
            }}
            style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', width: '100%' }}
          >
            {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 200px', border: '2px dashed #c7d2fe', borderRadius: 8, padding: '12px 16px', background: '#fafbff', textAlign: 'center', cursor: 'pointer' }}>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>Upload new syllabus version</div>
          <div style={{ fontSize: 11, color: ACCENT, fontFamily: 'system-ui', fontWeight: 600, marginTop: 3 }}>Browse PDF</div>
        </div>
      </div>

      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '18px 20px', background: '#fafafa', marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui', marginBottom: 6 }}>Current Syllabus — {selectedCourse?.code ?? '—'}</div>
        <div style={{ width: '100%', height: 140, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>📄</div>
            <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Syllabus PDF Viewer</div>
            <button style={{ marginTop: 8, background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '6px 16px', fontSize: 12, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Open PDF</button>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>Syllabus Coverage Tracker</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {units.map(unit => (
          <div key={unit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: 'system-ui' }}>{unit}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="number" min={0} max={100} value={coverage[unit]}
                  onChange={e => setCoverage(prev => ({ ...prev, [unit]: Math.min(100, Math.max(0, Number(e.target.value))) }))}
                  style={{ width: 56, padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, fontFamily: 'system-ui', textAlign: 'center' }}
                />
                <span style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>%</span>
              </div>
            </div>
            <div style={{ height: 10, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ width: `${coverage[unit]}%`, height: '100%', background: barColor(coverage[unit]), borderRadius: 10, transition: 'width 0.3s' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: MUTED, fontFamily: 'system-ui', background: '#f8fafc', borderRadius: 8, padding: '8px 14px' }}>
        Overall coverage: <strong style={{ color: ACCENT }}>{Math.round(Object.values(coverage).reduce((a, b) => a + b, 0) / units.length)}%</strong>
      </div>
    </div>
  )
}

// ─── Course Page View ─────────────────────────────────────────────────────────
function CoursePageView({ courses, loading: coursesLoading }) {
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [tab, setTab] = useState('materials')
  const [materials, setMaterials] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [assignments, setAssignments] = useState([])
  const [dataLoading, setDataLoading] = useState(false)

  const selectedCourse = courses.find(c => c.id === selectedCourseId)

  useEffect(() => {
    if (courses.length && !selectedCourseId) setSelectedCourseId(courses[0].id)
  }, [courses])

  useEffect(() => {
    if (!selectedCourseId) return
    setDataLoading(true)
    Promise.all([
      api.get(`/courses/${selectedCourseId}/materials`).then(r => r.data?.data || []).catch(() => []),
      api.get(`/announcements/course/${selectedCourseId}`).then(r => r.data?.data || []).catch(() => []),
      api.get(`/courses/${selectedCourseId}/assignments`).then(r => r.data?.data || []).catch(() => []),
    ])
      .then(([mats, anns, asgns]) => {
        setMaterials(mats)
        setAnnouncements(anns)
        setAssignments(asgns)
      })
      .finally(() => setDataLoading(false))
  }, [selectedCourseId])

  if (coursesLoading) return <Spinner />

  return (
    <div>
      <div style={{ background: '#eef2ff', borderRadius: 10, padding: '14px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: ACCENT, fontFamily: 'system-ui' }}>
              {selectedCourse ? `${selectedCourse.code} — ${selectedCourse.name}` : 'No course selected'}
            </div>
            {selectedCourse && (
              <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui', marginTop: 2 }}>
                Sem {selectedCourse.semester ?? '—'} · {selectedCourse.credits ?? '—'} Credits
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #c7d2fe', borderRadius: 7, fontSize: 12, fontFamily: 'system-ui', background: '#fff' }}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
            </select>
            <span style={{ background: '#fff', color: MUTED, fontSize: 11, borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontFamily: 'system-ui' }}>Preview Mode</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #e2e8f0', marginBottom: 20 }}>
        {['materials', 'announcements', 'assignments'].map(t => (
          <div key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', cursor: 'pointer', fontSize: 13, fontFamily: 'system-ui', textTransform: 'capitalize', color: tab === t ? ACCENT : MUTED, fontWeight: tab === t ? 700 : 400, borderBottom: tab === t ? '2px solid #6366f1' : '2px solid transparent', marginBottom: -2 }}>{t}</div>
        ))}
      </div>

      {dataLoading ? <Spinner /> : (
        <>
          {tab === 'materials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {materials.length === 0
                ? <div style={{ color: MUTED, fontSize: 13, fontFamily: 'system-ui', padding: 16 }}>No materials uploaded.</div>
                : materials.map(m => (
                  <div key={m.id} style={{ border: '1px solid #e2e8f0', borderRadius: 9, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📄</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>{m.title}</div>
                      <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>{m.type} · {fmt(m.uploadedAt)}</div>
                    </div>
                    {m.url
                      ? <a href={m.url} target="_blank" rel="noreferrer" style={{ background: '#eef2ff', color: ACCENT, borderRadius: 7, padding: '5px 12px', fontSize: 11, fontFamily: 'system-ui', fontWeight: 600, textDecoration: 'none' }}>Open</a>
                      : <button disabled style={{ background: '#f1f5f9', color: MUTED, border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 11, fontFamily: 'system-ui', cursor: 'not-allowed' }}>No URL</button>
                    }
                  </div>
                ))
              }
            </div>
          )}

          {tab === 'announcements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {announcements.length === 0
                ? <div style={{ color: MUTED, fontSize: 13, fontFamily: 'system-ui', padding: 16 }}>No announcements yet.</div>
                : announcements.map(a => (
                  <div key={a.id} style={{ border: '1px solid #e2e8f0', borderRadius: 9, padding: '14px 16px', borderLeft: `4px solid ${ACCENT}` }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', marginTop: 2 }}>{fmt(a.createdAt)}</div>
                    <div style={{ fontSize: 13, color: TEXT, fontFamily: 'system-ui', marginTop: 8, lineHeight: 1.5 }}>{a.content}</div>
                  </div>
                ))
              }
            </div>
          )}

          {tab === 'assignments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {assignments.length === 0
                ? <div style={{ color: MUTED, fontSize: 13, fontFamily: 'system-ui', padding: 16 }}>No assignments yet.</div>
                : assignments.map(a => (
                  <div key={a.id} style={{ border: '1px solid #e2e8f0', borderRadius: 9, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', marginTop: 2 }}>Due: {a.dueDate ? fmt(a.dueDate) : '—'} · Max: {a.maxMarks ?? '—'} marks</div>
                    </div>
                    <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700, fontFamily: 'system-ui' }}>Open</span>
                  </div>
                ))
              }
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Minor / Honour ───────────────────────────────────────────────────────────
function MinorHonour() {
  const [filterMinor, setFilterMinor] = useState('')

  const minorCourses = ['Data Science', 'Cyber Security', 'Full Stack Development']
  const students = [
    { name: 'Arun S.', rollNo: '21CS001', dept: 'CSE', minor: 'Data Science', course: 'DS6001 — Python for Data Science', progress: 85 },
    { name: 'Bharathi K.', rollNo: '21CS002', dept: 'IT', minor: 'Data Science', course: 'DS6001 — Python for Data Science', progress: 78 },
    { name: 'Divya R.', rollNo: '21CS003', dept: 'ECE', minor: 'Cyber Security', course: 'CS6010 — Network Security', progress: 90 },
    { name: 'Karthik M.', rollNo: '21CS004', dept: 'EEE', minor: 'Full Stack Development', course: 'FS6001 — React & Node.js', progress: 65 },
    { name: 'Meenakshi V.', rollNo: '21CS005', dept: 'MECH', minor: 'Data Science', course: 'DS6001 — Python for Data Science', progress: 92 },
    { name: 'Naveen P.', rollNo: '21CS006', dept: 'CIVIL', minor: 'Full Stack Development', course: 'FS6001 — React & Node.js', progress: 55 },
  ]

  const filtered = filterMinor ? students.filter(s => s.minor === filterMinor) : students
  const barColor = (p) => p >= 80 ? '#22c55e' : p >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div>
      <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#92400e', fontFamily: 'system-ui' }}>
        Minor/Honour programme API endpoint pending — data below is placeholder.
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <label style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Filter by Minor Programme:</label>
        <select value={filterMinor} onChange={e => setFilterMinor(e.target.value)} style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui' }}>
          <option value="">All</option>
          {minorCourses.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {minorCourses.map(mc => {
          const count = students.filter(s => s.minor === mc).length
          return (
            <div key={mc} style={{ flex: '1 1 130px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 9, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: ACCENT, fontFamily: 'system-ui' }}>{count}</div>
              <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>{mc}</div>
            </div>
          )
        })}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 600 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Roll No', 'Student', 'Dept', 'Minor Programme', 'Course', 'Progress'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{s.rollNo}</td>
                <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 600 }}>{s.name}</td>
                <td style={{ padding: '9px 10px', color: MUTED }}>{s.dept}</td>
                <td style={{ padding: '9px 10px' }}><span style={{ background: '#eef2ff', color: ACCENT, fontSize: 11, borderRadius: 7, padding: '2px 8px', fontWeight: 700 }}>{s.minor}</span></td>
                <td style={{ padding: '9px 10px', color: TEXT, fontSize: 12 }}>{s.course}</td>
                <td style={{ padding: '9px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${s.progress}%`, height: '100%', background: barColor(s.progress), borderRadius: 6 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, width: 36 }}>{s.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Parent ───────────────────────────────────────────────────────────────────
export default function FacultyCourse() {
  const { user } = useAuth()
  const [active, setActive] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  useEffect(() => {
    if (!user?.userId) return
    setLoading(true)
    api.get('/courses')
      .then(async res => {
        const all = res.data?.data || []
        const mine = all.filter(c => c.facultyId === user.userId)
        setCourses(mine)
        const counts = await Promise.all(
          mine.map(c =>
            api.get(`/enrollments/course/${c.id}`)
              .then(r => [c.id, (r.data?.data || []).length])
              .catch(() => [c.id, '—'])
          )
        )
        setEnrollments(Object.fromEntries(counts))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.userId])

  const renderActive = () => {
    switch (active) {
      case 0: return <CoursePage courses={courses} loading={loading} enrollments={enrollments} />
      case 1: return <CourseMaterialUpload courses={courses} />
      case 2: return <CourseSyllabus courses={courses} />
      case 3: return <CoursePageView courses={courses} loading={loading} />
      case 4: return <MinorHonour />
      default: return null
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100%', padding: 1 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? 18 : 22, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>Academics — Course</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Course pages, materials, syllabus and minor/honour programmes</p>
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
