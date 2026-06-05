import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const ITEMS = ['View Registration', 'SET Mark Entry']

// ─── View Registration ────────────────────────────────────────────────────────
function ViewRegistration() {
  const [reminded, setReminded] = useState({})

  const courses = [
    { code: 'CS6001', name: 'Data Warehousing', section: 'III-CSE-A', totalReg: 62, completed: 55, pending: 7 },
    { code: 'CS6002', name: 'Compiler Design', section: 'III-CSE-A', totalReg: 60, completed: 60, pending: 0 },
    { code: 'CS6003', name: 'Cloud Computing', section: 'III-CSE-A', totalReg: 62, completed: 48, pending: 14 },
    { code: 'CS6004', name: 'Cryptography & Security', section: 'III-CSE-A', totalReg: 58, completed: 51, pending: 7 },
  ]

  const aggregateFeedback = [
    { aspect: 'Subject Knowledge', avg: 4.7, max: 5 },
    { aspect: 'Teaching Clarity', avg: 4.5, max: 5 },
    { aspect: 'Punctuality', avg: 4.8, max: 5 },
    { aspect: 'Interaction with Students', avg: 4.4, max: 5 },
    { aspect: 'Course Coverage', avg: 4.6, max: 5 },
  ]

  const sendReminder = (code) => setReminded(prev => ({ ...prev, [code]: true }))

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>SET Registration Summary — My Courses</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', marginBottom: 28 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Course', 'Name', 'Section', 'Total Registered', 'Completed', 'Pending', 'Action'].map(h => (
              <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => {
            const pct = Math.round(c.completed / c.totalReg * 100)
            return (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{c.code}</td>
                <td style={{ padding: '9px 10px', color: TEXT }}>{c.name}</td>
                <td style={{ padding: '9px 10px', color: MUTED }}>{c.section}</td>
                <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 600, textAlign: 'center' }}>{c.totalReg}</td>
                <td style={{ padding: '9px 10px', textAlign: 'center' }}>
                  <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 12, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{c.completed}</span>
                </td>
                <td style={{ padding: '9px 10px', textAlign: 'center' }}>
                  {c.pending > 0
                    ? <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: 12, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{c.pending}</span>
                    : <span style={{ color: MUTED, fontSize: 12 }}>—</span>}
                </td>
                <td style={{ padding: '9px 10px' }}>
                  {c.pending > 0
                    ? <button
                        onClick={() => sendReminder(c.code)}
                        disabled={reminded[c.code]}
                        style={{ background: reminded[c.code] ? '#f1f5f9' : ACCENT, color: reminded[c.code] ? MUTED : '#fff', border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 11, fontFamily: 'system-ui', cursor: reminded[c.code] ? 'not-allowed' : 'pointer', fontWeight: 600 }}
                      >{reminded[c.code] ? 'Reminded' : 'Send Reminder'}</button>
                    : <span style={{ fontSize: 12, color: '#15803d', fontWeight: 600, fontFamily: 'system-ui' }}>All done</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 10 }}>
        Aggregate Feedback (Anonymized)
        <span style={{ fontSize: 12, color: MUTED, fontWeight: 400, marginLeft: 8 }}>— Student identities are hidden</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 480 }}>
        {aggregateFeedback.map((f, i) => {
          const pct = (f.avg / f.max) * 100
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 200, fontSize: 13, color: TEXT, fontFamily: 'system-ui', flexShrink: 0 }}>{f.aspect}</div>
              <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: ACCENT, borderRadius: 8 }} />
              </div>
              <div style={{ width: 40, fontSize: 13, fontWeight: 700, color: ACCENT, fontFamily: 'system-ui', textAlign: 'right' }}>{f.avg}</div>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: 14, fontSize: 12, color: MUTED, fontFamily: 'system-ui', background: '#f8fafc', borderRadius: 8, padding: '8px 14px' }}>
        Overall SET Score: <strong style={{ color: ACCENT }}>4.6 / 5.0</strong> — Based on responses from all completed evaluations.
      </div>
    </div>
  )
}

// ─── SET Mark Entry ───────────────────────────────────────────────────────────
function SETMarkEntry() {
  const [selectedCourse, setSelectedCourse] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const courses = ['CS6001 — Data Warehousing', 'CS6002 — Compiler Design', 'CS6003 — Cloud Computing', 'CS6004 — Cryptography & Security']

  const students = [
    { rollNo: '21CS001', name: 'Arun S.', score: 45, max: 50 },
    { rollNo: '21CS002', name: 'Bharathi K.', score: 48, max: 50 },
    { rollNo: '21CS003', name: 'Divya R.', score: 42, max: 50 },
    { rollNo: '21CS004', name: 'Karthik M.', score: 40, max: 50 },
    { rollNo: '21CS005', name: 'Meenakshi V.', score: 47, max: 50 },
    { rollNo: '21CS006', name: 'Naveen P.', score: 38, max: 50 },
    { rollNo: '21CS007', name: 'Preethi A.', score: 50, max: 50 },
    { rollNo: '21CS008', name: 'Ranjith S.', score: 43, max: 50 },
  ]

  const [scores, setScores] = useState(students.reduce((acc, s) => ({ ...acc, [s.rollNo]: s.score }), {}))

  const updateScore = (roll, val) => {
    const v = Math.min(50, Math.max(0, Number(val)))
    setScores(prev => ({ ...prev, [roll]: v }))
  }

  const getGrade = (score) => {
    if (score >= 45) return ['O', '#dcfce7', '#15803d']
    if (score >= 40) return ['A+', '#dbeafe', '#1d4ed8']
    if (score >= 35) return ['A', '#ccfbf1', '#0f766e']
    return ['B', '#fef3c7', '#b45309']
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Select Course</label>
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', width: 300 }}>
          <option value="">— Select a course —</option>
          {courses.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 6 }}>Upload SET Evaluation Forms</label>
        <div style={{ border: '2px dashed #c7d2fe', borderRadius: 8, padding: '16px', textAlign: 'center', background: '#fafbff', cursor: 'pointer' }}>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>Drop PDF/ZIP here or <span style={{ color: ACCENT, fontWeight: 600 }}>browse files</span></div>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui', marginTop: 4 }}>PDF, ZIP — max 20 MB</div>
        </div>
      </div>

      {submitted && (
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 16px', marginBottom: 14, fontSize: 13, color: '#15803d', fontFamily: 'system-ui', fontWeight: 600 }}>
          SET marks submitted for processing.
        </div>
      )}

      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 10 }}>Registered Students — Score Entry (Max: 50)</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', marginBottom: 16 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Roll No', 'Student Name', 'Score (/50)', 'Grade'].map(h => (
              <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => {
            const [grade, gbg, gcl] = getGrade(scores[s.rollNo])
            return (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '8px 10px', color: ACCENT, fontWeight: 700 }}>{s.rollNo}</td>
                <td style={{ padding: '8px 10px', color: TEXT, fontWeight: 600 }}>{s.name}</td>
                <td style={{ padding: '6px 10px' }}>
                  <input
                    type="number" min={0} max={50} value={scores[s.rollNo]}
                    onChange={e => updateScore(s.rollNo, e.target.value)}
                    style={{ width: 70, padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, fontFamily: 'system-ui', textAlign: 'center' }}
                  />
                </td>
                <td style={{ padding: '8px 10px' }}>
                  <span style={{ background: gbg, color: gcl, fontSize: 12, borderRadius: 8, padding: '2px 9px', fontWeight: 700 }}>{grade}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: 10 }}>
        <button style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Save Draft</button>
        <button onClick={() => setSubmitted(true)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Submit Marks</button>
      </div>
    </div>
  )
}

const CONTENT_MAP = [ViewRegistration, SETMarkEntry]

export default function FacultySETConference() {
  const [active, setActive] = useState(0)
  const ActiveComponent = CONTENT_MAP[active]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100%', padding: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>Academics — SET Conference</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Student Evaluation of Teachers — registrations and marks</p>
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
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}
