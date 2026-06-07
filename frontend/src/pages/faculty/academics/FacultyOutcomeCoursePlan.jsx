import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['Outcome Statement', 'Course Plan']

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

const tdStyle = { padding: '10px 14px', fontSize: 13, color: TEXT, borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }

const FALLBACK_COURSES = []

const bloomsLevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create']
const poList = ['PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12']
const psoList = ['PSO1', 'PSO2', 'PSO3']

const defaultCOs = [
  { no: 'CO1', statement: 'Understand the foundational concepts and terminology of the subject.', blooms: 'Understand', pos: ['PO1', 'PO2'], psos: ['PSO1'] },
  { no: 'CO2', statement: 'Apply core algorithms and techniques to solve domain problems.', blooms: 'Apply', pos: ['PO1', 'PO2', 'PO5'], psos: ['PSO1', 'PSO2'] },
  { no: 'CO3', statement: 'Analyze real-world datasets and derive meaningful insights.', blooms: 'Analyze', pos: ['PO2', 'PO3', 'PO5'], psos: ['PSO2'] },
  { no: 'CO4', statement: 'Evaluate model performance using appropriate metrics.', blooms: 'Evaluate', pos: ['PO3', 'PO9'], psos: ['PSO3'] },
  { no: 'CO5', statement: 'Design and develop intelligent systems for practical applications.', blooms: 'Create', pos: ['PO1', 'PO3', 'PO5', 'PO12'], psos: ['PSO2', 'PSO3'] },
]

const correlationMap = {
  CO1: { PO1: 3, PO2: 2, PO5: 1 },
  CO2: { PO1: 3, PO2: 2, PO5: 3 },
  CO3: { PO2: 3, PO3: 2, PO5: 2 },
  CO4: { PO3: 3, PO9: 1 },
  CO5: { PO1: 2, PO3: 3, PO5: 3, PO12: 2 },
}

const lessonPlanData = [
  { week: 1, unit: 'Unit 1', topic: 'Introduction to ML — types, applications', planned: 3, method: 'Lecture', ref: 'Ch. 1 pp. 1–20', actual: 3 },
  { week: 2, unit: 'Unit 1', topic: 'Linear Regression — derivation and cost function', planned: 3, method: 'Lecture', ref: 'Ch. 2 pp. 21–45', actual: 3 },
  { week: 3, unit: 'Unit 1', topic: 'Logistic Regression and Classification', planned: 3, method: 'Demo', ref: 'Ch. 2 pp. 46–65', actual: 2 },
  { week: 4, unit: 'Unit 2', topic: 'Decision Trees and Random Forest', planned: 3, method: 'Lecture', ref: 'Ch. 4 pp. 90–115', actual: 3 },
  { week: 5, unit: 'Unit 2', topic: 'SVM — theory and kernel tricks', planned: 3, method: 'Discussion', ref: 'Ch. 5 pp. 116–140', actual: 3 },
  { week: 6, unit: 'Unit 2', topic: 'Unsupervised Learning — K-Means, DBSCAN', planned: 3, method: 'Activity', ref: 'Ch. 6 pp. 141–165', actual: 2 },
  { week: 7, unit: 'Unit 3', topic: 'Neural Networks — architecture and backpropagation', planned: 4, method: 'Lecture', ref: 'Ch. 7 pp. 166–200', actual: 4 },
  { week: 8, unit: 'Unit 3', topic: 'Deep Learning — CNN and RNN overview', planned: 3, method: 'Demo', ref: 'Ch. 8 pp. 201–230', actual: 3 },
]

// ─── Outcome Statement ─────────────────────────────────────────────────────────
function OutcomeStatementSection({ courses }) {
  const [course, setCourse] = useState('')
  useEffect(() => { if (courses.length && !course) setCourse(courses[0].id) }, [courses])
  const [cos, setCOs] = useState(defaultCOs)
  const [editIndex, setEditIndex] = useState(null)
  const [showMatrix, setShowMatrix] = useState(false)
  const [editForm, setEditForm] = useState({ no: '', statement: '', blooms: 'Remember', pos: [], psos: [] })
  const [addMode, setAddMode] = useState(false)

  const openEdit = (i) => {
    setEditIndex(i)
    setAddMode(false)
    setEditForm({ ...cos[i], pos: [...cos[i].pos], psos: [...cos[i].psos] })
  }

  const openAdd = () => {
    setAddMode(true)
    setEditIndex(null)
    const nextNo = `CO${cos.length + 1}`
    setEditForm({ no: nextNo, statement: '', blooms: 'Remember', pos: [], psos: [] })
  }

  const saveEdit = () => {
    if (addMode) {
      setCOs(prev => [...prev, editForm])
    } else {
      setCOs(prev => prev.map((co, i) => i === editIndex ? editForm : co))
    }
    setEditIndex(null)
    setAddMode(false)
  }

  const deleteCO = (i) => setCOs(prev => prev.filter((_, idx) => idx !== i))

  const togglePO = (po) => setEditForm(p => ({
    ...p, pos: p.pos.includes(po) ? p.pos.filter(x => x !== po) : [...p.pos, po]
  }))

  const togglePSO = (pso) => setEditForm(p => ({
    ...p, psos: p.psos.includes(pso) ? p.psos.filter(x => x !== pso) : [...p.psos, pso]
  }))

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Course</label>
          <select style={inputStyle} value={course} onChange={e => setCourse(e.target.value)}>
            {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
          </select>
        </div>
        <button onClick={() => setShowMatrix(!showMatrix)}
          style={{ background: showMatrix ? '#eef2ff' : '#f8fafc', color: showMatrix ? ACCENT : TEXT, border: '1px solid', borderColor: showMatrix ? ACCENT : '#e2e8f0', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          {showMatrix ? 'Hide Matrix' : 'CO-PO Matrix'}
        </button>
        <button onClick={openAdd}
          style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + Add CO
        </button>
      </div>

      {/* CO List */}
      {(editIndex !== null || addMode) && (
        <div style={{ ...card, padding: 24, marginBottom: 20, border: '1px solid #e0e7ff' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: 14, fontWeight: 700, color: TEXT }}>{addMode ? 'Add New Course Outcome' : `Edit ${editForm.no}`}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 5 }}>CO Number</label>
              <input style={inputStyle} value={editForm.no} onChange={e => setEditForm(p => ({ ...p, no: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 5 }}>Bloom's Taxonomy Level</label>
              <select style={inputStyle} value={editForm.blooms} onChange={e => setEditForm(p => ({ ...p, blooms: e.target.value }))}>
                {bloomsLevels.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 5 }}>CO Statement</label>
              <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={editForm.statement} onChange={e => setEditForm(p => ({ ...p, statement: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 8 }}>PO Mapping</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {poList.map(po => (
                  <button key={po} type="button" onClick={() => togglePO(po)}
                    style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      border: '1px solid', borderColor: editForm.pos.includes(po) ? ACCENT : '#e2e8f0',
                      background: editForm.pos.includes(po) ? '#eef2ff' : '#fff',
                      color: editForm.pos.includes(po) ? ACCENT : MUTED,
                    }}>{po}</button>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 8 }}>PSO Mapping</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {psoList.map(pso => (
                  <button key={pso} type="button" onClick={() => togglePSO(pso)}
                    style={{
                      padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      border: '1px solid', borderColor: editForm.psos.includes(pso) ? '#10b981' : '#e2e8f0',
                      background: editForm.psos.includes(pso) ? '#f0fdf4' : '#fff',
                      color: editForm.psos.includes(pso) ? '#16a34a' : MUTED,
                    }}>{pso}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button onClick={saveEdit} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
            <button onClick={() => { setEditIndex(null); setAddMode(false) }} style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ ...card, overflow: 'hidden', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['CO No', 'Statement', "Bloom's Level", 'PO Mapping', 'PSO Mapping', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {cos.map((co, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{co.no}</td>
                <td style={{ ...tdStyle, maxWidth: 240 }}>{co.statement}</td>
                <td style={tdStyle}>
                  <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#f5f3ff', color: '#7c3aed' }}>{co.blooms}</span>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {co.pos.map(po => (
                      <span key={po} style={{ padding: '2px 6px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: '#eef2ff', color: ACCENT }}>{po}</span>
                    ))}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {co.psos.map(pso => (
                      <span key={pso} style={{ padding: '2px 6px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: '#f0fdf4', color: '#16a34a' }}>{pso}</span>
                    ))}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(i)} style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteCO(i)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CO-PO Matrix */}
      {showMatrix && (
        <div style={{ ...card, overflow: 'auto' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 14, color: TEXT }}>CO-PO Correlation Matrix (1 = Low, 2 = Medium, 3 = High)</div>
          <div style={{ padding: 20, overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, minWidth: 60 }}>CO \ PO</th>
                  {poList.map(po => <th key={po} style={{ ...thStyle, textAlign: 'center', minWidth: 44 }}>{po}</th>)}
                  {psoList.map(pso => <th key={pso} style={{ ...thStyle, textAlign: 'center', minWidth: 50, color: '#16a34a' }}>{pso}</th>)}
                </tr>
              </thead>
              <tbody>
                {cos.map((co, i) => (
                  <tr key={i}>
                    <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{co.no}</td>
                    {poList.map(po => {
                      const val = correlationMap[co.no]?.[po]
                      return (
                        <td key={po} style={{ ...tdStyle, textAlign: 'center', fontWeight: 600,
                          background: val === 3 ? '#eef2ff' : val === 2 ? '#f5f3ff' : val === 1 ? '#fafafa' : 'transparent',
                          color: val ? ACCENT : '#e2e8f0',
                        }}>{val || '—'}</td>
                      )
                    })}
                    {psoList.map(pso => {
                      const mapped = co.psos.includes(pso)
                      return (
                        <td key={pso} style={{ ...tdStyle, textAlign: 'center', fontWeight: 600,
                          background: mapped ? '#f0fdf4' : 'transparent',
                          color: mapped ? '#16a34a' : '#e2e8f0',
                        }}>{mapped ? '✓' : '—'}</td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Course Plan ───────────────────────────────────────────────────────────────
function CoursePlanSection({ courses }) {
  const [course, setCourse] = useState('')
  useEffect(() => { if (courses.length && !course) setCourse(courses[0].id) }, [courses])
  const [plan, setPlan] = useState(lessonPlanData)

  const totalPlanned = plan.reduce((s, r) => s + r.planned, 0)
  const totalActual = plan.reduce((s, r) => s + (r.actual || 0), 0)

  const updateActual = (i, val) => {
    const n = parseInt(val) || 0
    setPlan(prev => prev.map((r, idx) => idx === i ? { ...r, actual: n } : r))
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Course</label>
          <select style={inputStyle} value={course} onChange={e => setCourse(e.target.value)}>
            {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
          </select>
        </div>
        <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Download PDF
        </button>
      </div>

      {/* Hours Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Planned Hours', value: totalPlanned, color: ACCENT },
          { label: 'Total Actual Hours', value: totalActual, color: '#10b981' },
          { label: 'Variance', value: totalPlanned - totalActual, color: totalPlanned - totalActual > 0 ? '#f59e0b' : '#10b981' },
        ].map((s, i) => (
          <div key={i} style={{ ...card, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>Lesson / Course Delivery Plan</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>{['Week', 'Unit', 'Topic', 'Hrs Planned', 'Delivery Method', 'Reference', 'Actual Hours'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {plan.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT, textAlign: 'center' }}>{row.week}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{row.unit}</td>
                  <td style={{ ...tdStyle, maxWidth: 220 }}>{row.topic}</td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 600 }}>{row.planned}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: row.method === 'Lecture' ? '#dbeafe' : row.method === 'Demo' ? '#fef3c7' : row.method === 'Discussion' ? '#dcfce7' : '#f5f3ff',
                      color: row.method === 'Lecture' ? '#1d4ed8' : row.method === 'Demo' ? '#d97706' : row.method === 'Discussion' ? '#16a34a' : '#7c3aed',
                    }}>{row.method}</span>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12, color: MUTED }}>{row.ref}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <input
                      type="number" min={0} max={20}
                      value={row.actual}
                      onChange={e => updateActual(i, e.target.value)}
                      style={{ width: 60, padding: '5px 8px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13, textAlign: 'center', outline: 'none',
                        color: row.actual < row.planned ? '#d97706' : TEXT,
                        background: row.actual < row.planned ? '#fef9c3' : '#fff',
                      }}
                    />
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

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyOutcomeCoursePlan() {
  const { user } = useAuth()
  const [activeNav, setActiveNav] = useState('Outcome Statement')
  const [courses, setCourses] = useState([])

  useEffect(() => {
    if (!user?.userId) return
    api.get('/courses').then(r => setCourses((r.data?.data || []).filter(c => c.facultyId === user.userId))).catch(console.error)
  }, [user?.userId])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Academics — Outcome &amp; Course Plan</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Define course outcomes and plan course delivery</p>
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
          {activeNav === 'Outcome Statement' && <OutcomeStatementSection courses={courses} />}
          {activeNav === 'Course Plan' && <CoursePlanSection courses={courses} />}
        </div>
      </div>
    </div>
  )
}
