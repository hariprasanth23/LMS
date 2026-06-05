import React, { useState } from 'react'

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

const courseOptions = [
  'CS5101 — Machine Learning',
  'CS5102 — Compiler Design',
  'CS5103 — Distributed Systems',
]

const assessmentTypes = ['CA1', 'CA2', 'CA3', 'Model Exam']

const maxMarks = { CA1: 20, CA2: 20, CA3: 20, 'Model Exam': 50 }

const studentListBase = [
  { rollNo: '22BCE0001', name: 'Arun Kumar' },
  { rollNo: '22BCE0011', name: 'Priya Sharma' },
  { rollNo: '22BCE0023', name: 'Karthik Rajan' },
  { rollNo: '22BCE0034', name: 'Meena Devi' },
  { rollNo: '22BCE0042', name: 'Suresh Kumar' },
  { rollNo: '22BCE0055', name: 'Anjali Nair' },
  { rollNo: '22BCE0067', name: 'Rahul Singh' },
]

const arrearStudents = [
  { rollNo: '20BCE0112', name: 'Deepak Mohan', course: 'CS5101', attempt: 3, arrearType: 'Repeat' },
  { rollNo: '20BCE0088', name: 'Lakshmi Priya', course: 'CS5101', attempt: 2, arrearType: 'Supplementary' },
]

// ─── Mark Entry ────────────────────────────────────────────────────────────────
function MarkEntrySection() {
  const [course, setCourse] = useState(courseOptions[0])
  const [assessType, setAssessType] = useState('CA1')
  const [loaded, setLoaded] = useState(false)
  const [locked, setLocked] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [marks, setMarks] = useState({})
  const max = maxMarks[assessType]

  const handleLoad = () => {
    const initial = {}
    studentListBase.forEach(s => { initial[s.rollNo] = '' })
    setMarks(initial)
    setLoaded(true)
    setLocked(false)
    setSubmitted(false)
  }

  const handleSubmit = () => {
    setLocked(true)
    setSubmitted(true)
  }

  const allFilled = loaded && studentListBase.every(s => marks[s.rollNo] !== '')

  return (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Mark Entry</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Course *</label>
            <select style={inputStyle} value={course} onChange={e => { setCourse(e.target.value); setLoaded(false) }}>
              {courseOptions.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Assessment Type *</label>
            <select style={inputStyle} value={assessType} onChange={e => { setAssessType(e.target.value); setLoaded(false) }}>
              {assessmentTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={handleLoad} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Load Students
          </button>
        </div>
      </div>

      {submitted && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          Marks submitted and locked successfully.
        </div>
      )}

      {loaded && (
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: TEXT }}>{course} — {assessType} (Max: {max})</span>
            <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: locked ? '#dcfce7' : '#fef3c7', color: locked ? '#16a34a' : '#d97706' }}>
              {locked ? 'Submitted & Locked' : 'Draft'}
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>{['Roll No', 'Student Name', `Marks (Max: ${max})`].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {studentListBase.map((s, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{s.rollNo}</td>
                  <td style={tdStyle}>{s.name}</td>
                  <td style={tdStyle}>
                    {locked
                      ? <span style={{ fontWeight: 700 }}>{marks[s.rollNo]}</span>
                      : (
                        <input
                          type="number" min={0} max={max}
                          style={{ ...inputStyle, width: 100, padding: '6px 10px' }}
                          value={marks[s.rollNo]}
                          onChange={e => setMarks(p => ({ ...p, [s.rollNo]: e.target.value }))}
                          placeholder={`0–${max}`}
                        />
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!locked && (
            <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 12 }}>
              <button style={{ background: '#f8fafc', color: TEXT, border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save Draft</button>
              <button style={{ background: '#f8fafc', color: TEXT, border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Validate</button>
              <button onClick={handleSubmit} disabled={!allFilled} style={{ background: allFilled ? '#16a34a' : '#e2e8f0', color: allFilled ? '#fff' : MUTED, border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 600, cursor: allFilled ? 'pointer' : 'not-allowed' }}>
                Submit & Lock
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Arrear Mark Entry ─────────────────────────────────────────────────────────
function ArrearMarkEntrySection() {
  const [course, setCourse] = useState(courseOptions[0])
  const [month, setMonth] = useState('November 2025')
  const [loaded, setLoaded] = useState(false)
  const [marks, setMarks] = useState({})

  const handleLoad = () => {
    const initial = {}
    arrearStudents.forEach(s => { initial[s.rollNo] = '' })
    setMarks(initial)
    setLoaded(true)
  }

  return (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Arrear Mark Entry</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Course *</label>
            <select style={inputStyle} value={course} onChange={e => { setCourse(e.target.value); setLoaded(false) }}>
              {courseOptions.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Arrear Exam Month/Year *</label>
            <select style={inputStyle} value={month} onChange={e => setMonth(e.target.value)}>
              {['November 2025', 'May 2025', 'November 2024'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <button onClick={handleLoad} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Load Arrear Students
          </button>
        </div>
      </div>

      {loaded && (
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: TEXT }}>Arrear Students — {course}</span>
            <span style={{ fontSize: 13, color: MUTED }}>{month}</span>
          </div>
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
                  <td style={tdStyle}>
                    <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: '#fef3c7', color: '#d97706' }}>{s.arrearType}</span>
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number" min={0} max={100}
                      style={{ ...inputStyle, width: 100, padding: '6px 10px' }}
                      value={marks[s.rollNo] || ''}
                      onChange={e => setMarks(p => ({ ...p, [s.rollNo]: e.target.value }))}
                      placeholder="0–100"
                    />
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
  const [course, setCourse] = useState(courseOptions[0])
  const [rollSearch, setRollSearch] = useState('')
  const [studentFound, setStudentFound] = useState(null)
  const [newMark, setNewMark] = useState('')
  const [justification, setJustification] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSearch = () => {
    const found = arrearStudents.find(s => s.rollNo.toLowerCase() === rollSearch.trim().toLowerCase())
    setStudentFound(found ? { ...found, currentMark: 38 } : null)
    setNewMark('')
    setJustification('')
    setSubmitted(false)
  }

  const diff = newMark !== '' && studentFound ? parseInt(newMark) - studentFound.currentMark : null

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Arrear Revaluation Mark Entry</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'flex-end', marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Course *</label>
            <select style={inputStyle} value={course} onChange={e => setCourse(e.target.value)}>
              {courseOptions.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Student Roll No *</label>
            <input style={inputStyle} value={rollSearch} onChange={e => setRollSearch(e.target.value)} placeholder="e.g. 20BCE0112" />
          </div>
          <button onClick={handleSearch} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Search
          </button>
        </div>

        {studentFound === null && rollSearch !== '' && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 16px', color: '#dc2626', fontSize: 14 }}>
            No arrear student found with that roll number.
          </div>
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
              <form onSubmit={handleSubmit}>
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
                    <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={justification} onChange={e => setJustification(e.target.value)} placeholder="Reason for mark revision after revaluation..." required />
                  </div>
                </div>
                <button type="submit" style={{ marginTop: 14, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Submit for Approval
                </button>
              </form>
            )}
        </div>
      )}
    </div>
  )
}

// ─── Arrear Grades ─────────────────────────────────────────────────────────────
const arrearGradesData = [
  { student: 'Deepak Mohan', rollNo: '20BCE0112', course: 'CS5101 — Machine Learning', attempt: 3, marks: 52, calcGrade: 'C', override: false, justification: '' },
  { student: 'Lakshmi Priya', rollNo: '20BCE0088', course: 'CS5101 — Machine Learning', attempt: 2, marks: 44, calcGrade: 'U', override: false, justification: '' },
]

function ArrearGradesSection() {
  const [rows, setRows] = useState(arrearGradesData)
  const [finalized, setFinalized] = useState(false)

  const calcGrade = (marks) => {
    if (marks >= 90) return 'O'
    if (marks >= 80) return 'A+'
    if (marks >= 70) return 'A'
    if (marks >= 60) return 'B+'
    if (marks >= 50) return 'B'
    if (marks >= 45) return 'C'
    return 'U'
  }

  const toggleOverride = (i) => {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, override: !r.override } : r))
  }

  const updateJustification = (i, val) => {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, justification: val } : r))
  }

  const updateOverrideGrade = (i, val) => {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, calcGrade: val } : r))
  }

  return (
    <div>
      {finalized && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          Arrear grades finalized successfully!
        </div>
      )}
      <div style={{ ...card, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Arrear Exam Grades</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
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
                    ? (
                      <select style={{ ...inputStyle, width: 80, padding: '4px 8px' }} value={r.calcGrade} onChange={e => updateOverrideGrade(i, e.target.value)}>
                        {['O', 'A+', 'A', 'B+', 'B', 'C', 'U'].map(g => <option key={g}>{g}</option>)}
                      </select>
                    )
                    : <span style={{ fontWeight: 700, color: r.calcGrade === 'U' ? '#dc2626' : r.calcGrade === 'O' ? '#16a34a' : TEXT }}>{r.calcGrade}</span>
                  }
                </td>
                <td style={tdStyle}>
                  <input type="checkbox" checked={r.override} onChange={() => toggleOverride(i)} />
                </td>
                <td style={tdStyle}>
                  {r.override
                    ? <input style={{ ...inputStyle, padding: '5px 10px', fontSize: 13 }} value={r.justification} onChange={e => updateJustification(i, e.target.value)} placeholder="Reason required..." />
                    : <span style={{ color: MUTED, fontSize: 13 }}>—</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => setFinalized(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
        Finalize Arrear Grades
      </button>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyEvaluations() {
  const [activeNav, setActiveNav] = useState('Mark Entry')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Examinations — Evaluations</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Enter and manage marks for all exam types</p>
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
          {activeNav === 'Mark Entry' && <MarkEntrySection />}
          {activeNav === 'Arrear Mark Entry' && <ArrearMarkEntrySection />}
          {activeNav === 'Arrear Rev Mark Entry' && <ArrearRevMarkEntry />}
          {activeNav === 'Arrear Grades' && <ArrearGradesSection />}
        </div>
      </div>
    </div>
  )
}
