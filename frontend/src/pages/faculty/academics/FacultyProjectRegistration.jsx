import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = [
  'Registration',
  'Mark Entry',
  'Foil Card Generation',
  'Mark Entry Multidisciplinary',
  'Foilcard Gen - Multidisciplinary',
]

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

const tdStyle = { padding: '12px 14px', fontSize: 14, color: TEXT, borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }

const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8']
const phases = ['Review 1', 'Review 2', 'Final Viva', 'Report']

const projectsData = [
  {
    teamId: 'T2025-001',
    title: 'Smart Irrigation System using IoT',
    members: ['R. Karthik (20BCE0011)', 'P. Sharma (20BCE0042)', 'M. Siva (20BCE0063)'],
    dept: 'CSE',
    type: 'Product Development',
    date: '2025-02-10',
    status: 'Pending',
    semester: 'Semester 8',
    multidisciplinary: false,
  },
  {
    teamId: 'T2025-002',
    title: 'AI-Based Skin Disease Detection',
    members: ['V. Lakshmi (20BCE0095)', 'S. Raj (20BCE0104)'],
    dept: 'CSE',
    type: 'Research',
    date: '2025-02-12',
    status: 'Approved',
    semester: 'Semester 8',
    multidisciplinary: false,
  },
  {
    teamId: 'T2025-003',
    title: 'Autonomous Drone for Crop Monitoring',
    members: ['A. Kumar (20BCE0021)', 'B. Priya (20ECE0033)', 'C. Ravi (20ME0019)'],
    dept: 'CSE / ECE / MECH',
    type: 'Multidisciplinary',
    date: '2025-02-15',
    status: 'Pending',
    semester: 'Semester 8',
    multidisciplinary: true,
    memberDepts: ['CSE', 'ECE', 'MECH'],
  },
  {
    teamId: 'T2025-004',
    title: 'Blockchain-based Certificate Verification',
    members: ['D. Arun (20BCE0055)', 'E. Nisha (20BCE0067)', 'F. Mohan (20BCE0078)'],
    dept: 'CSE',
    type: 'Development',
    date: '2025-02-18',
    status: 'Rejected',
    semester: 'Semester 7',
    multidisciplinary: false,
  },
  {
    teamId: 'T2025-005',
    title: 'Solar-Powered EV Charging Station',
    members: ['G. Deepa (20EEE0011)', 'H. Surya (20ECE0022)', 'I. Raja (20BCE0089)'],
    dept: 'EEE / ECE / CSE',
    type: 'Multidisciplinary',
    date: '2025-02-20',
    status: 'Approved',
    semester: 'Semester 7',
    multidisciplinary: true,
    memberDepts: ['EEE', 'ECE', 'CSE'],
  },
]

const initialMarks = {
  'T2025-001': { presentation: '', technical: '', innovation: '', report: '' },
  'T2025-002': { presentation: '', technical: '', innovation: '', report: '' },
  'T2025-004': { presentation: '', technical: '', innovation: '', report: '' },
}

const initialMarksMulti = {
  'T2025-003': { presentation: '', technical: '', innovation: '', report: '' },
  'T2025-005': { presentation: '', technical: '', innovation: '', report: '' },
}

// ─── Helper Components ─────────────────────────────────────────────────────────
const typeBadge = (type) => {
  const map = {
    'Product Development': { bg: '#dbeafe', color: '#1d4ed8' },
    'Research': { bg: '#f5f3ff', color: '#7c3aed' },
    'Development': { bg: '#fef3c7', color: '#d97706' },
    'Multidisciplinary': { bg: '#dcfce7', color: '#16a34a' },
  }
  const s = map[type] || { bg: '#f1f5f9', color: MUTED }
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
      {type}
    </span>
  )
}

const statusBadge = (status) => {
  const map = {
    Pending: { bg: '#fef9c3', color: '#854d0e' },
    Approved: { bg: '#dcfce7', color: '#16a34a' },
    Rejected: { bg: '#fee2e2', color: '#dc2626' },
  }
  const s = map[status] || { bg: '#f1f5f9', color: MUTED }
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
      {status}
    </span>
  )
}

function calcTotal(m) {
  const p = Number(m.presentation) || 0
  const t = Number(m.technical) || 0
  const i = Number(m.innovation) || 0
  const r = Number(m.report) || 0
  return p + t + i + r
}

function calcGrade(total) {
  if (total >= 90) return 'O'
  if (total >= 80) return 'A+'
  if (total >= 70) return 'A'
  if (total >= 60) return 'B+'
  if (total >= 50) return 'B'
  return 'U'
}

// ─── Registration Section ──────────────────────────────────────────────────────
function RegistrationSection() {
  const [semFilter, setSemFilter] = useState('All')
  const [projects, setProjects] = useState(projectsData.filter(p => !p.multidisciplinary))
  const [expandedTeam, setExpandedTeam] = useState(null)
  const [toast, setToast] = useState('')

  const filteredSemesters = ['All', ...semesters]
  const filtered = semFilter === 'All' ? projects : projects.filter(p => p.semester === semFilter)

  const handleAction = (teamId, action) => {
    setProjects(prev => prev.map(p => p.teamId === teamId ? { ...p, status: action } : p))
    setToast(`Team ${teamId} ${action.toLowerCase()} successfully.`)
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div>
      {toast && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Filter by Semester:</span>
        {filteredSemesters.map(s => (
          <button key={s} onClick={() => setSemFilter(s)}
            style={{
              padding: '5px 14px', borderRadius: 8, border: '1px solid',
              borderColor: semFilter === s ? ACCENT : '#e2e8f0',
              background: semFilter === s ? '#eef2ff' : '#fff',
              color: semFilter === s ? ACCENT : TEXT,
              fontSize: 13, fontWeight: semFilter === s ? 700 : 400, cursor: 'pointer',
            }}
          >{s}</button>
        ))}
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>
          Project Registrations — Under This Faculty
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Team ID', 'Project Title', 'Members', 'Dept', 'Type', 'Date', 'Status', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <React.Fragment key={i}>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{p.teamId}</td>
                  <td style={{ ...tdStyle, maxWidth: 220, fontWeight: 600 }}>{p.title}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => setExpandedTeam(expandedTeam === p.teamId ? null : p.teamId)}
                      style={{ background: '#f1f5f9', border: 'none', borderRadius: 6, padding: '3px 10px', fontSize: 12, cursor: 'pointer', color: ACCENT, fontWeight: 600 }}
                    >
                      {p.members.length} members {expandedTeam === p.teamId ? '▲' : '▼'}
                    </button>
                  </td>
                  <td style={tdStyle}>{p.dept}</td>
                  <td style={tdStyle}>{typeBadge(p.type)}</td>
                  <td style={tdStyle}>{p.date}</td>
                  <td style={tdStyle}>{statusBadge(p.status)}</td>
                  <td style={tdStyle}>
                    {p.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleAction(p.teamId, 'Approved')}
                          style={{ background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          Approve
                        </button>
                        <button onClick={() => handleAction(p.teamId, 'Rejected')}
                          style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
                {expandedTeam === p.teamId && (
                  <tr>
                    <td colSpan={8} style={{ padding: '0 20px 14px 60px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                      <ul style={{ margin: '10px 0 0', paddingLeft: 18 }}>
                        {p.members.map((m, j) => (
                          <li key={j} style={{ fontSize: 13, color: TEXT, padding: '3px 0' }}>{m}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: 32, textAlign: 'center', color: MUTED, fontSize: 14 }}>No projects found for the selected semester.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Mark Entry Section ────────────────────────────────────────────────────────
function MarkEntrySection({ multidisciplinary = false }) {
  const [semester, setSemester] = useState('Semester 8')
  const [phase, setPhase] = useState('Review 1')
  const [marks, setMarks] = useState(multidisciplinary ? initialMarksMulti : initialMarks)
  const [saved, setSaved] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const projects = projectsData.filter(p => p.multidisciplinary === multidisciplinary && p.semester === semester)

  const updateMark = (teamId, field, val) => {
    const num = Math.min(25, Math.max(0, Number(val) || 0))
    setMarks(prev => ({ ...prev, [teamId]: { ...(prev[teamId] || {}), [field]: num } }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div>
      {(saved || submitted) && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          {submitted ? 'Marks submitted successfully!' : 'Marks saved as draft.'}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Semester</label>
          <select style={inputStyle} value={semester} onChange={e => setSemester(e.target.value)}>
            {semesters.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Phase</label>
          <select style={inputStyle} value={phase} onChange={e => setPhase(e.target.value)}>
            {phases.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div style={{ ...card, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>
          {multidisciplinary ? 'Multidisciplinary Projects' : 'Projects'} — {phase} | {semester}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>
                {['Team ID', 'Project Title', multidisciplinary ? 'Members & Depts' : 'Members', 'Presentation /25', 'Technical /25', 'Innovation /25', 'Report /25', 'Total /100'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 28, textAlign: 'center', color: MUTED, fontSize: 14 }}>No projects found for the selected semester.</td>
                </tr>
              ) : (
                projects.map((p, i) => {
                  const m = marks[p.teamId] || { presentation: '', technical: '', innovation: '', report: '' }
                  const total = calcTotal(m)
                  return (
                    <tr key={i}>
                      <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{p.teamId}</td>
                      <td style={{ ...tdStyle, maxWidth: 200, fontWeight: 600, fontSize: 13 }}>{p.title}</td>
                      <td style={{ ...tdStyle, minWidth: 180 }}>
                        {multidisciplinary ? (
                          <div>
                            {p.members.map((mem, j) => (
                              <div key={j} style={{ fontSize: 12, color: TEXT, marginBottom: 2 }}>
                                {mem}
                                {p.memberDepts && (
                                  <span style={{ marginLeft: 6, padding: '1px 6px', borderRadius: 10, fontSize: 10, fontWeight: 600, background: '#eef2ff', color: ACCENT }}>
                                    {p.memberDepts[j]}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div>
                            {p.members.map((mem, j) => (
                              <div key={j} style={{ fontSize: 12, color: TEXT, marginBottom: 2 }}>{mem}</div>
                            ))}
                          </div>
                        )}
                      </td>
                      {['presentation', 'technical', 'innovation', 'report'].map(field => (
                        <td key={field} style={{ ...tdStyle, textAlign: 'center' }}>
                          <input
                            type="number" min={0} max={25}
                            value={m[field]}
                            onChange={e => updateMark(p.teamId, field, e.target.value)}
                            style={{
                              width: 60, padding: '5px 8px', borderRadius: 6,
                              border: '1px solid #e2e8f0', fontSize: 14, textAlign: 'center', outline: 'none',
                              color: TEXT, background: '#fff',
                            }}
                          />
                        </td>
                      ))}
                      <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700,
                        color: total >= 75 ? '#16a34a' : total >= 50 ? ACCENT : '#dc2626',
                        fontSize: 15,
                      }}>
                        {total}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={handleSave}
          style={{ background: '#f1f5f9', color: TEXT, border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Save Draft
        </button>
        <button onClick={handleSubmit}
          style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Submit Marks
        </button>
      </div>
    </div>
  )
}

// ─── Foil Card Generation Section ─────────────────────────────────────────────
function FoilCardGenSection({ multidisciplinary = false }) {
  const [semester, setSemester] = useState('Semester 8')
  const [phase, setPhase] = useState('Final Viva')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [preview, setPreview] = useState(false)

  const projects = projectsData.filter(p => p.multidisciplinary === multidisciplinary && p.semester === semester && p.status === 'Approved')

  const sampleMarks = { presentation: 22, technical: 20, innovation: 18, report: 21, total: 81, grade: 'A+' }

  const generateCard = (p) => {
    setSelectedTeam(p)
    setPreview(true)
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Semester</label>
          <select style={inputStyle} value={semester} onChange={e => { setSemester(e.target.value); setPreview(false) }}>
            {semesters.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Phase</label>
          <select style={inputStyle} value={phase} onChange={e => { setPhase(e.target.value); setPreview(false) }}>
            {phases.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div style={{ ...card, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>
          {multidisciplinary ? 'Multidisciplinary ' : ''}Teams — {phase} | {semester}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Team ID', 'Project Title', 'Dept(s)', 'Status', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 28, textAlign: 'center', color: MUTED, fontSize: 14 }}>No approved projects found for the selected semester.</td>
              </tr>
            ) : (
              projects.map((p, i) => (
                <tr key={i} style={{ background: selectedTeam?.teamId === p.teamId ? '#f5f3ff' : 'transparent' }}>
                  <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{p.teamId}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{p.title}</td>
                  <td style={tdStyle}>{p.dept}</td>
                  <td style={tdStyle}>{statusBadge(p.status)}</td>
                  <td style={tdStyle}>
                    <button onClick={() => generateCard(p)}
                      style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      Generate Foil Card
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {preview && selectedTeam && (
        <div style={{ ...card, padding: 32, border: '2px solid #6366f1', borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: TEXT }}>Foil Card Preview — {selectedTeam.teamId}</h3>
            <button onClick={() => setPreview(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MUTED }}>×</button>
          </div>

          {/* Header */}
          <div style={{ background: ACCENT, color: '#fff', borderRadius: 10, padding: '18px 24px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>
              {multidisciplinary ? 'Multidisciplinary Project Foil Card' : 'Project Foil Card'} — {phase}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{selectedTeam.title}</div>
            <div style={{ fontSize: 13, marginTop: 6, opacity: 0.9 }}>Team ID: {selectedTeam.teamId} | {selectedTeam.semester}</div>
          </div>

          {/* Team Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, textTransform: 'uppercase', marginBottom: 8 }}>Team Members</div>
              {selectedTeam.members.map((m, i) => (
                <div key={i} style={{ fontSize: 14, color: TEXT, padding: '3px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
                  {m}
                  {multidisciplinary && selectedTeam.memberDepts && (
                    <span style={{ padding: '1px 7px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: '#eef2ff', color: ACCENT }}>
                      {selectedTeam.memberDepts[i]}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, textTransform: 'uppercase', marginBottom: 8 }}>Department(s)</div>
              <div style={{ fontSize: 14, color: TEXT }}>{selectedTeam.dept}</div>
              {multidisciplinary && (
                <div style={{ marginTop: 10, padding: '8px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, fontSize: 13, color: '#166534', fontWeight: 500 }}>
                  Joint Faculty Review — Multidisciplinary
                </div>
              )}
            </div>
          </div>

          {/* Marks */}
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '18px 24px', marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, textTransform: 'uppercase', marginBottom: 14 }}>Marks Breakdown</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
              {[
                { label: 'Presentation', val: sampleMarks.presentation, max: 25 },
                { label: 'Technical', val: sampleMarks.technical, max: 25 },
                { label: 'Innovation', val: sampleMarks.innovation, max: 25 },
                { label: 'Report', val: sampleMarks.report, max: 25 },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', background: '#fff', borderRadius: 8, padding: '12px 8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: ACCENT }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>/{s.max}</div>
                  <div style={{ fontSize: 12, color: TEXT, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: ACCENT, borderRadius: 8, padding: '12px 20px', color: '#fff' }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Total Score</span>
              <span style={{ fontSize: 22, fontWeight: 700 }}>{sampleMarks.total} / 100</span>
              <span style={{ fontSize: 18, fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '4px 16px', borderRadius: 8 }}>{sampleMarks.grade}</span>
            </div>
          </div>

          {/* Signature */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: 12 }}>
              <div style={{ fontSize: 12, color: MUTED }}>Faculty Signature</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginTop: 4 }}>Dr. R. Meenakshisundaram</div>
              <div style={{ fontSize: 12, color: MUTED }}>Guide / Supervisor</div>
            </div>
            <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: 12 }}>
              <div style={{ fontSize: 12, color: MUTED }}>HOD Signature</div>
              <div style={{ height: 30 }} />
              <div style={{ fontSize: 12, color: MUTED }}>Head of Department</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Download PDF
            </button>
            <button onClick={() => setPreview(false)}
              style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, cursor: 'pointer' }}>
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyProjectRegistration() {
  const [activeNav, setActiveNav] = useState('Registration')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Academics — Project Registration</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Manage project registrations, marks and foil card generation</p>
      </div>

      <div style={{ ...card, display: 'flex', overflow: 'hidden' }}>
        {/* Left Nav */}
        <div style={{ width: 210, borderRight: '1px solid #f1f5f9', padding: '16px 0', flexShrink: 0 }}>
          {navItems.map(item => (
            <button key={item} onClick={() => setActiveNav(item)}
              style={{
                display: 'block', width: '100%', padding: '11px 20px',
                background: activeNav === item ? '#eef2ff' : 'transparent',
                border: 'none', borderLeft: activeNav === item ? '3px solid #6366f1' : '3px solid transparent',
                textAlign: 'left', fontSize: 13, fontWeight: activeNav === item ? 600 : 400,
                color: activeNav === item ? ACCENT : TEXT, cursor: 'pointer',
              }}
            >{item}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 28, minWidth: 0 }}>
          {activeNav === 'Registration' && <RegistrationSection />}
          {activeNav === 'Mark Entry' && <MarkEntrySection multidisciplinary={false} />}
          {activeNav === 'Foil Card Generation' && <FoilCardGenSection multidisciplinary={false} />}
          {activeNav === 'Mark Entry Multidisciplinary' && <MarkEntrySection multidisciplinary={true} />}
          {activeNav === 'Foilcard Gen - Multidisciplinary' && <FoilCardGenSection multidisciplinary={true} />}
        </div>
      </div>
    </div>
  )
}
