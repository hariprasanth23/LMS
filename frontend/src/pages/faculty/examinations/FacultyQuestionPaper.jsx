import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['Question and Key Upload', 'Arrear QP and Key Upload', 'Old QPs', 'QP Review']

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

const FALLBACK_COURSES = []

const bloomsLevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create']

// ─── Upload History (shared) ───────────────────────────────────────────────────
const uploadHistory = [
  { course: 'CS5102 — Compiler Design', examType: 'End Semester', year: '2024-25', sem: 'Semester 6', uploadedOn: '2025-10-08', status: 'Approved' },
  { course: 'CS5103 — Distributed Systems', examType: 'CA1', year: '2024-25', sem: 'Semester 6', uploadedOn: '2025-08-15', status: 'Pending Review' },
]

// ─── QP + Key Upload Form (reusable) ──────────────────────────────────────────
function QPUploadForm({ showArrearField = false, historyData = uploadHistory, courses = FALLBACK_COURSES }) {
  const [form, setForm] = useState({
    courseId: '', examType: 'CA1', year: '2024-25', sem: 'Semester 6',
    arrearMonth: 'November 2025', syllabusCoverage: 80, difficulty: 'Medium', blooms: 'Apply',
    qpFile: null, keyFile: null,
  })
  const [submitted, setSubmitted] = useState(false)

  const handleFileChange = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.files[0] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3500)
  }

  return (
    <div>
      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: TEXT }}>
          {showArrearField ? 'Arrear Question Paper & Answer Key Upload' : 'Question Paper & Answer Key Upload'}
        </h3>
        {submitted && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
            Uploaded successfully and submitted for review!
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Course *</label>
              <select style={inputStyle} value={form.courseId} onChange={e => setForm(p => ({ ...p, courseId: e.target.value }))}>
                <option value="">— Select course —</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Exam Type *</label>
              <select style={inputStyle} value={form.examType} onChange={e => setForm(p => ({ ...p, examType: e.target.value }))}>
                {['CA1', 'CA2', 'CA3', 'Model', 'End Semester'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Academic Year *</label>
              <select style={inputStyle} value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))}>
                {['2024-25', '2023-24', '2022-23'].map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Semester *</label>
              <select style={inputStyle} value={form.sem} onChange={e => setForm(p => ({ ...p, sem: e.target.value }))}>
                {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {showArrearField && (
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Arrear Exam Month/Year *</label>
                <select style={{ ...inputStyle, maxWidth: 300 }} value={form.arrearMonth} onChange={e => setForm(p => ({ ...p, arrearMonth: e.target.value }))}>
                  {['November 2025', 'May 2025', 'November 2024', 'May 2024'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Question Paper (PDF) *</label>
              <input type="file" accept=".pdf" style={{ ...inputStyle, padding: '7px 12px' }} onChange={handleFileChange('qpFile')} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Answer Key (PDF) *</label>
              <input type="file" accept=".pdf" style={{ ...inputStyle, padding: '7px 12px' }} onChange={handleFileChange('keyFile')} required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 8 }}>
                Syllabus Coverage: <span style={{ color: ACCENT }}>{form.syllabusCoverage}%</span>
              </label>
              <input type="range" min={0} max={100} value={form.syllabusCoverage}
                onChange={e => setForm(p => ({ ...p, syllabusCoverage: parseInt(e.target.value) }))}
                style={{ width: '100%', accentColor: ACCENT }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: MUTED, marginTop: 2 }}>
                <span>0%</span><span>50%</span><span>100%</span>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Difficulty Level *</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['Easy', 'Medium', 'Hard'].map(d => (
                  <button key={d} type="button"
                    onClick={() => setForm(p => ({ ...p, difficulty: d }))}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid', cursor: 'pointer',
                      borderColor: form.difficulty === d ? (d === 'Easy' ? '#22c55e' : d === 'Hard' ? '#ef4444' : ACCENT) : '#e2e8f0',
                      background: form.difficulty === d ? (d === 'Easy' ? '#f0fdf4' : d === 'Hard' ? '#fff5f5' : '#eef2ff') : '#fff',
                      color: form.difficulty === d ? (d === 'Easy' ? '#16a34a' : d === 'Hard' ? '#dc2626' : ACCENT) : MUTED,
                      fontWeight: form.difficulty === d ? 700 : 400, fontSize: 13,
                    }}
                  >{d}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Bloom's Taxonomy Level *</label>
              <select style={inputStyle} value={form.blooms} onChange={e => setForm(p => ({ ...p, blooms: e.target.value }))}>
                {bloomsLevels.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" style={{ marginTop: 22, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Submit Question Paper
          </button>
        </form>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Submission History</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 600 }}>
            <thead>
              <tr>{['Course', 'Exam Type', 'Year', 'Semester', 'Uploaded On', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {historyData.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.course}</td>
                  <td style={tdStyle}>{r.examType}</td>
                  <td style={tdStyle}>{r.year}</td>
                  <td style={tdStyle}>{r.sem}</td>
                  <td style={tdStyle}>{r.uploadedOn}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: r.status === 'Approved' ? '#dcfce7' : '#fef3c7', color: r.status === 'Approved' ? '#16a34a' : '#d97706' }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Old QPs ───────────────────────────────────────────────────────────────────
const oldQPs = [
  { course: 'CS5101 — Machine Learning', year: '2023-24', examType: 'End Semester', uploadedBy: 'Dr. Ramesh Kumar', available: true },
  { course: 'CS5102 — Compiler Design', year: '2023-24', examType: 'End Semester', uploadedBy: 'Dr. Priya Nair', available: true },
  { course: 'CS5101 — Machine Learning', year: '2022-23', examType: 'End Semester', uploadedBy: 'Dr. Ramesh Kumar', available: true },
  { course: 'CS5103 — Distributed Systems', year: '2022-23', examType: 'Model', uploadedBy: 'Dr. Karthik S', available: false },
]

function OldQPsSection() {
  const [filterCourse, setFilterCourse] = useState('All')
  const [filterYear, setFilterYear] = useState('All')
  const [filterType, setFilterType] = useState('All')

  const filtered = oldQPs.filter(q =>
    (filterCourse === 'All' || q.course === filterCourse) &&
    (filterYear === 'All' || q.year === filterYear) &&
    (filterType === 'All' || q.examType === filterType)
  )

  return (
    <div>
      <div style={{ ...card, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Course</label>
            <select style={inputStyle} value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
              <option>All</option>
              {courseOptions.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Year</label>
            <select style={inputStyle} value={filterYear} onChange={e => setFilterYear(e.target.value)}>
              {['All', '2024-25', '2023-24', '2022-23'].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Exam Type</label>
            <select style={inputStyle} value={filterType} onChange={e => setFilterType(e.target.value)}>
              {['All', 'CA1', 'CA2', 'CA3', 'Model', 'End Semester'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {filtered.map((q, i) => (
          <div key={i} style={{ ...card, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{q.course}</div>
              <div style={{ fontSize: 13, color: MUTED, marginBottom: 6 }}>{q.examType} · {q.year}</div>
              <div style={{ fontSize: 12, color: MUTED }}>Uploaded by: {q.uploadedBy}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              {q.available
                ? <button style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Download</button>
                : (
                  <div>
                    <span style={{ fontSize: 12, color: MUTED, marginBottom: 6, display: 'block' }}>Not Available</span>
                    <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Upload</button>
                  </div>
                )
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── QP Review ─────────────────────────────────────────────────────────────────
const reviewQueue = [
  { course: 'CS4102 — Software Engineering', uploader: 'Dr. Anjali Menon', submittedOn: '2025-09-20', status: 'Pending Review' },
  { course: 'CS4101 — Computer Networks', uploader: 'Dr. Suresh Kumar', submittedOn: '2025-09-18', status: 'Under Review' },
]

function QPReviewSection() {
  const [selected, setSelected] = useState(null)
  const [review, setReview] = useState({ coverage: 80, blooms: 'Apply', suggestions: '', decision: 'Approve' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitReview = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setSelected(null)
    setTimeout(() => setSubmitted(false), 3500)
  }

  return (
    <div>
      {submitted && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          Review submitted successfully!
        </div>
      )}
      <div style={{ ...card, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Assigned for Review</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 600 }}>
            <thead>
              <tr>{['Course', 'Uploader', 'Submission Date', 'Status', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {reviewQueue.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.course}</td>
                  <td style={tdStyle}>{r.uploader}</td>
                  <td style={tdStyle}>{r.submittedOn}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: r.status === 'Under Review' ? '#dbeafe' : '#fef3c7', color: r.status === 'Under Review' ? '#1d4ed8' : '#d97706' }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View QP</button>
                      <button onClick={() => setSelected(r)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Review</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={{ ...card, padding: 24 }}>
          <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: TEXT }}>Review: {selected.course}</h4>
          <form onSubmit={handleSubmitReview}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 8 }}>
                  Syllabus Coverage Check: <span style={{ color: ACCENT }}>{review.coverage}%</span>
                </label>
                <input type="range" min={0} max={100} value={review.coverage}
                  onChange={e => setReview(p => ({ ...p, coverage: parseInt(e.target.value) }))}
                  style={{ width: '100%', accentColor: ACCENT }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Bloom's Level Check</label>
                <select style={inputStyle} value={review.blooms} onChange={e => setReview(p => ({ ...p, blooms: e.target.value }))}>
                  {bloomsLevels.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Decision *</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['Approve', 'Request Changes'].map(d => (
                    <button key={d} type="button"
                      onClick={() => setReview(p => ({ ...p, decision: d }))}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid', cursor: 'pointer',
                        borderColor: review.decision === d ? (d === 'Approve' ? '#22c55e' : '#ef4444') : '#e2e8f0',
                        background: review.decision === d ? (d === 'Approve' ? '#f0fdf4' : '#fff5f5') : '#fff',
                        color: review.decision === d ? (d === 'Approve' ? '#16a34a' : '#dc2626') : MUTED,
                        fontWeight: review.decision === d ? 700 : 400, fontSize: 13,
                      }}
                    >{d}</button>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Suggestions / Comments</label>
                <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={review.suggestions} onChange={e => setReview(p => ({ ...p, suggestions: e.target.value }))} placeholder="Detailed review comments..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button type="submit" style={{ background: review.decision === 'Approve' ? '#16a34a' : '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Submit Review
              </button>
              <button type="button" onClick={() => setSelected(null)} style={{ background: '#f8fafc', color: TEXT, border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyQuestionPaper() {
  const { user } = useAuth()
  const [activeNav, setActiveNav] = useState('Question and Key Upload')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  useEffect(() => {
    if (!user?.userId) return
    api.get('/courses').then(r => setCourses((r.data?.data || []).filter(c => c.facultyId === user.userId))).catch(console.error)
  }, [user?.userId])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: isMobile ? 16 : 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: TEXT }}>Examinations — Question Paper</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Upload, review and manage question papers</p>
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
                style={{
                  padding: '6px 14px', background: activeNav === item ? '#eef2ff' : '#f1f5f9',
                  border: activeNav === item ? '1.5px solid #6366f1' : '1.5px solid transparent',
                  borderRadius: 20, fontSize: 12, fontWeight: activeNav === item ? 600 : 400,
                  color: activeNav === item ? ACCENT : TEXT, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >{item}</button>
            ) : (
              <button key={item} onClick={() => setActiveNav(item)}
                style={{
                  display: 'block', width: '100%', padding: '11px 20px',
                  background: activeNav === item ? '#eef2ff' : 'transparent',
                  border: 'none', borderLeft: activeNav === item ? '3px solid #6366f1' : '3px solid transparent',
                  textAlign: 'left', fontSize: 14, fontWeight: activeNav === item ? 600 : 400,
                  color: activeNav === item ? ACCENT : TEXT, cursor: 'pointer',
                }}
              >{item}</button>
            )
          ))}
        </div>
        <div style={{ flex: 1, padding: isMobile ? 14 : 28, minWidth: 0 }}>
          {activeNav === 'Question and Key Upload' && <QPUploadForm showArrearField={false} courses={courses} />}
          {activeNav === 'Arrear QP and Key Upload' && <QPUploadForm showArrearField={true} courses={courses} />}
          {activeNav === 'Old QPs' && <OldQPsSection />}
          {activeNav === 'QP Review' && <QPReviewSection />}
        </div>
      </div>
    </div>
  )
}
