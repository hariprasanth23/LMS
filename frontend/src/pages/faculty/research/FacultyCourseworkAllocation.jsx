import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['Scholars - Pre 2018', 'Scholars - 2018 Onwards']

// ─── Sample Data ──────────────────────────────────────────────────────────────
const pre2018Scholars = [
  { id: 'RS2015001', name: 'Vijay Kumar S', regYear: 2015, area: 'Data Mining', cwStatus: 'Completed', coursesCompleted: 5, creditsEarned: 20, maxCredits: 20 },
  { id: 'RS2016003', name: 'Saranya M', regYear: 2016, area: 'Image Processing', cwStatus: 'Completed', coursesCompleted: 5, creditsEarned: 20, maxCredits: 20 },
  { id: 'RS2017005', name: 'Manoj Raj', regYear: 2017, area: 'VLSI Design', cwStatus: 'In Progress', coursesCompleted: 3, creditsEarned: 12, maxCredits: 20 },
  { id: 'RS2017009', name: 'Deepa Nair', regYear: 2017, area: 'Wireless Networks', cwStatus: 'In Progress', coursesCompleted: 2, creditsEarned: 8, maxCredits: 20 },
  { id: 'RS2016007', name: 'Aravind P', regYear: 2016, area: 'Compiler Design', cwStatus: 'Not Started', coursesCompleted: 0, creditsEarned: 0, maxCredits: 20 },
]

const post2018Scholars = [
  { id: 'RS2018002', name: 'Ananya Krishnan', regYear: 2018, area: 'Machine Learning', cwStatus: 'Completed', coursesCompleted: 6, creditsEarned: 24, maxCredits: 24 },
  { id: 'RS2019004', name: 'Bharath M', regYear: 2019, area: 'Quantum Computing', cwStatus: 'In Progress', coursesCompleted: 4, creditsEarned: 16, maxCredits: 24 },
  { id: 'RS2020006', name: 'Chitra R', regYear: 2020, area: 'Bioinformatics', cwStatus: 'In Progress', coursesCompleted: 3, creditsEarned: 12, maxCredits: 24 },
  { id: 'RS2021008', name: 'Dinesh S', regYear: 2021, area: 'Edge Computing', cwStatus: 'In Progress', coursesCompleted: 2, creditsEarned: 8, maxCredits: 24 },
  { id: 'RS2022010', name: 'Eswari K', regYear: 2022, area: 'Federated Learning', cwStatus: 'Not Started', coursesCompleted: 0, creditsEarned: 0, maxCredits: 24 },
  { id: 'RS2023011', name: 'Faizan Ali', regYear: 2023, area: 'NLP', cwStatus: 'Not Started', coursesCompleted: 0, creditsEarned: 0, maxCredits: 24 },
]

const pre2018Courses = [
  { code: 'PH7001', name: 'Research Methodology', credits: 4 },
  { code: 'CS7001', name: 'Advanced Data Structures', credits: 4 },
  { code: 'CS7002', name: 'Statistical Methods', credits: 4 },
  { code: 'CS7003', name: 'Advanced Algorithms', credits: 4 },
  { code: 'CS7004', name: 'Elective I', credits: 4 },
]

const post2018Courses = [
  { code: 'PH7001', name: 'Research Methodology', credits: 4 },
  { code: 'CS8001', name: 'Machine Learning Foundations', credits: 4 },
  { code: 'CS8002', name: 'Statistical Computing', credits: 4 },
  { code: 'CS8003', name: 'Advanced Algorithms', credits: 4 },
  { code: 'CS8004', name: 'Elective I', credits: 4 },
  { code: 'CS8005', name: 'Elective II', credits: 4 },
]

const allocationHistory = {
  RS2015001: [
    { course: 'PH7001 — Research Methodology', semester: 'Odd', year: 2015, credits: 4 },
    { course: 'CS7001 — Advanced Data Structures', semester: 'Even', year: 2016, credits: 4 },
    { course: 'CS7002 — Statistical Methods', semester: 'Odd', year: 2016, credits: 4 },
    { course: 'CS7003 — Advanced Algorithms', semester: 'Even', year: 2017, credits: 4 },
    { course: 'CS7004 — Elective I', semester: 'Odd', year: 2017, credits: 4 },
  ],
  RS2018002: [
    { course: 'PH7001 — Research Methodology', semester: 'Odd', year: 2018, credits: 4 },
    { course: 'CS8001 — Machine Learning Foundations', semester: 'Even', year: 2019, credits: 4 },
    { course: 'CS8002 — Statistical Computing', semester: 'Odd', year: 2019, credits: 4 },
    { course: 'CS8003 — Advanced Algorithms', semester: 'Even', year: 2020, credits: 4 },
    { course: 'CS8004 — Elective I', semester: 'Odd', year: 2020, credits: 4 },
    { course: 'CS8005 — Elective II', semester: 'Even', year: 2021, credits: 4 },
  ],
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────
function SummaryStats({ scholars }) {
  const total = scholars.length
  const completed = scholars.filter((s) => s.cwStatus === 'Completed').length
  const inProgress = scholars.filter((s) => s.cwStatus === 'In Progress').length
  const notStarted = scholars.filter((s) => s.cwStatus === 'Not Started').length

  const stats = [
    { label: 'Total Scholars', value: total, color: ACCENT, bg: '#eef2ff' },
    { label: 'Completed', value: completed, color: '#10b981', bg: '#d1fae5' },
    { label: 'In Progress', value: inProgress, color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Not Started', value: notStarted, color: '#ef4444', bg: '#fee2e2' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
      {stats.map((s) => (
        <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: s.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</p>
            <p style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Allocation Modal ─────────────────────────────────────────────────────────
function AllocationModal({ scholar, courses, onClose, onAllocate }) {
  const [form, setForm] = useState({ course: '', semester: '', year: '' })

  const submit = () => {
    if (!form.course || !form.semester || !form.year) return
    onAllocate(scholar.id, form)
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...card, padding: 28, width: 420, maxWidth: '90vw' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>Allocate Course</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MUTED }}>×</button>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: MUTED }}>
          Scholar: <strong style={{ color: TEXT }}>{scholar.name}</strong> ({scholar.id})
        </p>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Course *</label>
          <select
            value={form.course}
            onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))}
            style={{ width: '100%', padding: '9px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT }}
          >
            <option value="">Select course</option>
            {courses.map((c) => <option key={c.code} value={`${c.code} — ${c.name}`}>{c.code} — {c.name} ({c.credits} credits)</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Semester *</label>
            <select value={form.semester} onChange={(e) => setForm((p) => ({ ...p, semester: e.target.value }))} style={{ width: '100%', padding: '9px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT }}>
              <option value="">Select</option>
              <option>Odd</option>
              <option>Even</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Year *</label>
            <input type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} placeholder="2024" style={{ width: '100%', padding: '9px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={submit} style={{ flex: 1, background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Allocate</button>
          <button onClick={onClose} style={{ flex: 1, background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 7, padding: '10px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─── Scholar Table ─────────────────────────────────────────────────────────────
function ScholarTable({ scholars, courses, history, setHistory, showProgressBar }) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [modalScholar, setModalScholar] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const filtered = scholars.filter((s) => {
    const matchName = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || s.cwStatus === filterStatus
    return matchName && matchStatus
  })

  const handleAllocate = (scholarId, form) => {
    const selectedCourse = courses.find((c) => `${c.code} — ${c.name}` === form.course)
    const entry = { course: form.course, semester: form.semester, year: Number(form.year), credits: selectedCourse?.credits || 4 }
    setHistory((prev) => ({ ...prev, [scholarId]: [...(prev[scholarId] || []), entry] }))
  }

  const exportCSV = () => {
    const headers = ['Scholar ID', 'Name', 'Reg Year', 'Research Area', 'CW Status', 'Courses Completed', 'Credits Earned']
    const rows = filtered.map((s) => [s.id, s.name, s.regYear, s.area, s.cwStatus, s.coursesCompleted, s.creditsEarned])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'scholars_coursework.csv'
    a.click()
  }

  const cwStatusColor = { Completed: '#10b981', 'In Progress': '#f59e0b', 'Not Started': '#ef4444' }
  const cwStatusBg = { Completed: '#d1fae5', 'In Progress': '#fef3c7', 'Not Started': '#fee2e2' }
  const cwStatusText = { Completed: '#065f46', 'In Progress': '#92400e', 'Not Started': '#991b1b' }

  return (
    <div>
      {/* Search + Filter Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or ID…"
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, color: TEXT }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, color: TEXT }}
        >
          <option value="All">All Statuses</option>
          <option>Completed</option>
          <option>In Progress</option>
          <option>Not Started</option>
        </select>
        <button
          onClick={exportCSV}
          style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Scholar ID', 'Name', 'Reg. Year', 'Research Area', 'CW Status', 'Courses Completed', 'Credits Earned', 'Action', ''].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: 24, textAlign: 'center', color: MUTED, fontSize: 13 }}>No scholars match the current filter.</td>
              </tr>
            )}
            {filtered.map((s) => {
              const hist = history[s.id] || []
              const totalCompleted = hist.length + s.coursesCompleted
              const totalCredits = hist.reduce((a, h) => a + (h.credits || 0), 0) + s.creditsEarned
              const pct = Math.min(100, Math.round((totalCredits / s.maxCredits) * 100))
              const isExpanded = expandedId === s.id

              return (
                <React.Fragment key={s.id}>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', background: isExpanded ? '#f8f9ff' : '#fff' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 12, color: MUTED }}>{s.id}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: TEXT }}>{s.name}</td>
                    <td style={{ padding: '12px 14px', color: MUTED }}>{s.regYear}</td>
                    <td style={{ padding: '12px 14px', color: TEXT }}>{s.area}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 10, background: cwStatusBg[s.cwStatus], color: cwStatusText[s.cwStatus], fontWeight: 600 }}>
                        {s.cwStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: TEXT, textAlign: 'center' }}>{totalCompleted}</td>
                    <td style={{ padding: '12px 14px' }}>
                      {showProgressBar ? (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, color: MUTED }}>{totalCredits}/{s.maxCredits} credits</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: pct === 100 ? '#10b981' : ACCENT }}>{pct}%</span>
                          </div>
                          <div style={{ background: '#e2e8f0', borderRadius: 10, height: 6, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#10b981' : ACCENT, borderRadius: 10, transition: 'width 0.3s' }} />
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontWeight: 700, color: TEXT }}>{totalCredits}</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => setModalScholar(s)}
                        style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        Allocate Course
                      </button>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : s.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: ACCENT, fontSize: 13 }}
                      >
                        {isExpanded ? '▲' : '▼'}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={9} style={{ background: '#f0f4ff', padding: 0 }}>
                        <div style={{ padding: '14px 20px', borderTop: '2px solid #e0e7ff' }}>
                          <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: TEXT }}>Allocation History for {s.name}</p>
                          {hist.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                              <thead>
                                <tr>
                                  {['Course', 'Semester', 'Year', 'Credits'].map((h) => (
                                    <th key={h} style={{ padding: '6px 12px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #c7d2fe' }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {hist.map((h, i) => (
                                  <tr key={i} style={{ borderBottom: '1px solid #e0e7ff' }}>
                                    <td style={{ padding: '8px 12px', color: TEXT }}>{h.course}</td>
                                    <td style={{ padding: '8px 12px', color: MUTED }}>{h.semester}</td>
                                    <td style={{ padding: '8px 12px', color: MUTED }}>{h.year}</td>
                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: ACCENT }}>{h.credits}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>No allocation history available.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Allocation Modal */}
      {modalScholar && (
        <AllocationModal
          scholar={modalScholar}
          courses={courses}
          onClose={() => setModalScholar(null)}
          onAllocate={handleAllocate}
        />
      )}
    </div>
  )
}

// ─── Pre 2018 Tab ─────────────────────────────────────────────────────────────
function Pre2018Scholars() {
  const [history, setHistory] = useState(allocationHistory)

  return (
    <div>
      <h2 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: TEXT }}>Scholars — Pre 2018</h2>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: MUTED }}>PhD scholars registered before January 2018. Course work requirement: <strong>20 credits</strong> (5 courses × 4 credits each).</p>
      <SummaryStats scholars={pre2018Scholars} />
      <ScholarTable
        scholars={pre2018Scholars}
        courses={pre2018Courses}
        history={history}
        setHistory={setHistory}
        showProgressBar={false}
      />
    </div>
  )
}

// ─── Post 2018 Tab ────────────────────────────────────────────────────────────
function Post2018Scholars() {
  const [history, setHistory] = useState(allocationHistory)

  return (
    <div>
      <h2 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: TEXT }}>Scholars — 2018 Onwards</h2>
      <p style={{ margin: '0 0 16px', fontSize: 13, color: MUTED }}>PhD scholars registered from January 2018. Course work requirement: <strong>24 credits</strong> (6 courses × 4 credits each).</p>

      {/* Regulation Difference Banner */}
      <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10, padding: '12px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>i</span>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#92400e' }}>Regulation Differences (2018 Onwards)</p>
          <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 12, color: '#92400e', lineHeight: 1.7 }}>
            <li>Credit requirement increased from <strong>20 to 24 credits</strong> (6 mandatory courses instead of 5).</li>
            <li>Introduction of two elective courses to broaden interdisciplinary exposure.</li>
            <li>All scholars must complete course work within <strong>3 semesters</strong> (full-time) or <strong>6 semesters</strong> (part-time).</li>
            <li>Minimum CGPA of <strong>7.0</strong> required to clear course work (previously 6.5).</li>
          </ul>
        </div>
      </div>

      <SummaryStats scholars={post2018Scholars} />
      <ScholarTable
        scholars={post2018Scholars}
        courses={post2018Courses}
        history={history}
        setHistory={setHistory}
        showProgressBar={true}
      />
    </div>
  )
}

// ─── Tab Content Map ──────────────────────────────────────────────────────────
const tabContent = {
  'Scholars - Pre 2018': <Pre2018Scholars />,
  'Scholars - 2018 Onwards': <Post2018Scholars />,
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FacultyCourseworkAllocation() {
  const [activeTab, setActiveTab] = useState(navItems[0])

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'system-ui, -apple-system, sans-serif', color: TEXT }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '22px 32px 18px' }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: TEXT }}>Research — Coursework Allocation</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: MUTED }}>Manage scholar course work allocation by regulation year</p>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', margin: '24px 32px', gap: 0, ...card, overflow: 'hidden', minHeight: 600 }}>
        {/* Left Nav */}
        <nav style={{ width: 210, flexShrink: 0, borderRight: '1px solid #e2e8f0', padding: '12px 0' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item
            return (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 18px',
                  background: isActive ? '#eef2ff' : 'transparent',
                  color: isActive ? ACCENT : TEXT,
                  border: 'none',
                  borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 13,
                  cursor: 'pointer',
                  lineHeight: 1.4,
                  transition: 'background 0.15s',
                }}
              >
                {item}
              </button>
            )
          })}
        </nav>

        {/* Content Area */}
        <div style={{ flex: 1, padding: 28, overflowX: 'auto' }}>
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  )
}
