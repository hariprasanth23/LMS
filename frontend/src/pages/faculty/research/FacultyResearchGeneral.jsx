import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = [
  'Research Regulations',
  'Areas of Expertise',
  'Profile / Admission Approval',
  'Onroll Scholars',
  'Course Catalog',
  'Question Paper Upload',
  'Scholar Weekly Report',
  'Half-Yearly Progress Review',
  'Half-Yearly Committee Review',
  'IRINS Details',
  'ETD Approval',
  'Faculty Open Project Creation',
]

// ─── Research Regulations ─────────────────────────────────────────────────────
const regulationSections = [
  {
    title: 'PhD Eligibility',
    content:
      'Candidates must hold a Master\'s degree with a minimum of 55% marks (50% for reserved categories) in the relevant discipline. Qualifying the institution entrance examination is mandatory for all applicants.',
  },
  {
    title: 'Course Work Requirements',
    content:
      'Full-time scholars must complete 20 credits of course work within two semesters; part-time scholars within four semesters. A minimum grade of B is required to pass each course. Audit courses do not count toward the credit requirement.',
  },
  {
    title: 'Publication Requirements',
    content:
      'Scholars must publish at least one paper in a UGC-listed journal before thesis submission. Publication in SCI/SCIE indexed journals is strongly encouraged and may expedite the evaluation process.',
  },
  {
    title: 'Synopsis Guidelines',
    content:
      'Synopsis must be submitted after completion of course work and a minimum of two years of research. The document (max 5 000 words) should comprehensively summarise the research and must be approved by the Doctoral Committee.',
  },
  {
    title: 'Plagiarism Policy',
    content:
      'All research documents are subject to plagiarism checks. The similarity index must not exceed 10% for the thesis and 15% for research articles. Violations may result in cancellation of registration.',
  },
]

function ResearchRegulations() {
  const [open, setOpen] = useState({})
  const toggle = (i) => setOpen((p) => ({ ...p, [i]: !p[i] }))
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Research Regulations</h2>
      {regulationSections.map((sec, i) => (
        <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
          <button
            onClick={() => toggle(i)}
            style={{
              width: '100%', padding: '14px 18px', background: open[i] ? '#eef2ff' : '#fff',
              border: 'none', textAlign: 'left', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 14, fontWeight: 600, color: open[i] ? ACCENT : TEXT,
            }}
          >
            <span>{sec.title}</span>
            <span style={{ fontSize: 18, color: ACCENT }}>{open[i] ? '−' : '+'}</span>
          </button>
          {open[i] && (
            <div style={{ padding: '12px 18px 16px', fontSize: 14, color: MUTED, lineHeight: 1.7, borderTop: '1px solid #e2e8f0', background: '#fafafa' }}>
              {sec.content}
            </div>
          )}
        </div>
      ))}
      <button style={{ marginTop: 16, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
        Download Full Regulations PDF
      </button>
    </div>
  )
}

// ─── Areas of Expertise ───────────────────────────────────────────────────────
const domainOptions = ['CS', 'Electronics', 'Maths', 'Management', 'Physics', 'Chemistry', 'Mechanical', 'Civil', 'Biotechnology', 'Other']
const chipColors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

function AreasOfExpertise() {
  const [chips, setChips] = useState([
    { id: 1, area: 'Machine Learning', domain: 'CS', keywords: 'neural networks, deep learning', color: chipColors[0] },
    { id: 2, area: 'Signal Processing', domain: 'Electronics', keywords: 'DSP, FFT', color: chipColors[1] },
    { id: 3, area: 'Data Mining', domain: 'CS', keywords: 'clustering, classification', color: chipColors[2] },
  ])
  const [form, setForm] = useState({ area: '', domain: '', keywords: '' })
  const [editing, setEditing] = useState(null)

  const handleAdd = () => {
    if (!form.area.trim()) return
    if (editing !== null) {
      setChips((p) => p.map((c) => (c.id === editing ? { ...c, ...form } : c)))
      setEditing(null)
    } else {
      setChips((p) => [...p, { id: Date.now(), ...form, color: chipColors[p.length % chipColors.length] }])
    }
    setForm({ area: '', domain: '', keywords: '' })
  }
  const startEdit = (c) => { setForm({ area: c.area, domain: c.domain, keywords: c.keywords }); setEditing(c.id) }
  const remove = (id) => setChips((p) => p.filter((c) => c.id !== id))

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Areas of Expertise</h2>
      <div style={{ ...card, padding: 20, marginBottom: 24 }}>
        <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {editing !== null ? 'Edit Expertise' : 'Add New Expertise'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Area Name *</label>
            <input
              value={form.area}
              onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
              placeholder="e.g., Natural Language Processing"
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Domain</label>
            <select
              value={form.domain}
              onChange={(e) => setForm((p) => ({ ...p, domain: e.target.value }))}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT }}
            >
              <option value="">Select domain</option>
              {domainOptions.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Keywords</label>
            <input
              value={form.keywords}
              onChange={(e) => setForm((p) => ({ ...p, keywords: e.target.value }))}
              placeholder="comma-separated keywords"
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAdd} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              {editing !== null ? 'Update' : 'Add'}
            </button>
            {editing !== null && (
              <button onClick={() => { setEditing(null); setForm({ area: '', domain: '', keywords: '' }) }} style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 7, padding: '8px 14px', fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 600, color: TEXT }}>Current Expertise</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {chips.map((c) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: c.color + '18', border: `1px solid ${c.color}40`, borderRadius: 20, padding: '6px 14px' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: c.color }}>{c.area}</span>
            {c.domain && <span style={{ fontSize: 11, color: MUTED, background: '#f1f5f9', borderRadius: 10, padding: '1px 7px' }}>{c.domain}</span>}
            <button onClick={() => startEdit(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.color, fontSize: 13, padding: 0 }}>✎</button>
            <button onClick={() => remove(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 14, padding: 0 }}>×</button>
          </div>
        ))}
        {chips.length === 0 && <p style={{ color: MUTED, fontSize: 13 }}>No expertise added yet.</p>}
      </div>
    </div>
  )
}

// ─── Profile / Admission Approval ─────────────────────────────────────────────
const admissionApplicants = [
  { id: 1, name: 'Ananya Krishnan', qualification: 'M.Tech (CS)', area: 'Machine Learning', applied: '2024-11-10', docs: 'Verified', status: 'Pending' },
  { id: 2, name: 'Rohan Mehta', qualification: 'M.Sc (Maths)', area: 'Algebraic Graph Theory', applied: '2024-11-14', docs: 'Pending', status: 'Pending' },
  { id: 3, name: 'Priya Suresh', qualification: 'ME (VLSI)', area: 'Low-Power Design', applied: '2024-11-20', docs: 'Verified', status: 'Approved' },
  { id: 4, name: 'Karthik Rajan', qualification: 'MBA', area: 'Operations Research', applied: '2024-11-22', docs: 'Incomplete', status: 'Rejected' },
]

function ProfileAdmissionApproval() {
  const [rows, setRows] = useState(admissionApplicants)
  const [notes, setNotes] = useState({})
  const update = (id, status) => setRows((p) => p.map((r) => (r.id === id ? { ...r, status } : r)))
  const badgeColor = { Pending: '#f59e0b', Approved: '#10b981', Rejected: '#ef4444' }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Profile / Admission Approval</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Applicant Name', 'Qualification', 'Research Area', 'Applied Date', 'Documents', 'Status', 'Notes', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', fontWeight: 600, color: TEXT }}>{r.name}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{r.qualification}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{r.area}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{r.applied}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 10, background: r.docs === 'Verified' ? '#d1fae5' : r.docs === 'Pending' ? '#fef3c7' : '#fee2e2', color: r.docs === 'Verified' ? '#065f46' : r.docs === 'Pending' ? '#92400e' : '#991b1b', fontWeight: 600 }}>
                    {r.docs}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 10, background: badgeColor[r.status] + '22', color: badgeColor[r.status], fontWeight: 600 }}>{r.status}</span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <input
                    value={notes[r.id] || ''}
                    onChange={(e) => setNotes((p) => ({ ...p, [r.id]: e.target.value }))}
                    placeholder="Add note…"
                    style={{ padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, width: 130 }}
                  />
                </td>
                <td style={{ padding: '12px 14px' }}>
                  {r.status === 'Pending' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => update(r.id, 'Approved')} style={{ background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => update(r.id, 'Rejected')} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                    </div>
                  )}
                  {r.status !== 'Pending' && <span style={{ color: MUTED, fontSize: 12 }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Onroll Scholars ──────────────────────────────────────────────────────────
const scholarsData = [
  { id: 'RS2021001', name: 'Arun Kumar', regDate: '2021-07-15', area: 'Deep Learning', stage: 'Course Work', cgpa: 8.4, status: 'Active', details: 'Pursuing course work. Enrolled in 3 courses. Expected to complete by Dec 2022.' },
  { id: 'RS2020004', name: 'Meena Devi', regDate: '2020-01-10', area: 'IoT Security', stage: 'Synopsis', cgpa: 9.1, status: 'Active', details: 'Synopsis submitted on Oct 2024. Awaiting DC approval for thesis writing.' },
  { id: 'RS2019007', name: 'Suresh Babu', regDate: '2019-08-20', area: 'Bioinformatics', stage: 'Thesis Writing', cgpa: 8.8, status: 'Active', details: 'Chapter 3 completed. Two publications in SCI journals. On track for Dec 2025 submission.' },
  { id: 'RS2018012', name: 'Lavanya R', regDate: '2018-07-01', area: 'Cryptography', stage: 'Viva Pending', cgpa: 9.3, status: 'Active', details: 'Thesis evaluation completed by both examiners. Viva scheduled for Jan 2025.' },
]

function OnrollScholars() {
  const [expanded, setExpanded] = useState(null)
  const stageColor = { 'Course Work': '#6366f1', 'Synopsis': '#f59e0b', 'Thesis Writing': '#0ea5e9', 'Viva Pending': '#10b981' }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Onroll Scholars</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Scholar ID', 'Name', 'Reg. Date', 'Research Area', 'Current Stage', 'CGPA', 'Status', ''].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scholarsData.map((s) => (
              <React.Fragment key={s.id}>
                <tr
                  onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: expanded === s.id ? '#f8f9ff' : '#fff' }}
                >
                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 12, color: MUTED }}>{s.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: TEXT }}>{s.name}</td>
                  <td style={{ padding: '12px 14px', color: MUTED }}>{s.regDate}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{s.area}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 10, background: (stageColor[s.stage] || ACCENT) + '20', color: stageColor[s.stage] || ACCENT, fontWeight: 600 }}>{s.stage}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: s.cgpa >= 9 ? '#10b981' : TEXT }}>{s.cgpa}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 10, background: '#d1fae5', color: '#065f46', fontWeight: 600 }}>{s.status}</span>
                  </td>
                  <td style={{ padding: '12px 14px', color: ACCENT, fontSize: 14 }}>{expanded === s.id ? '▲' : '▼'}</td>
                </tr>
                {expanded === s.id && (
                  <tr>
                    <td colSpan={8} style={{ padding: '0 0 0 0', background: '#f0f4ff' }}>
                      <div style={{ padding: '14px 20px', fontSize: 13, color: MUTED, borderTop: '2px solid #e0e7ff' }}>
                        <strong style={{ color: TEXT }}>Scholar Details:</strong> {s.details}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Course Catalog ───────────────────────────────────────────────────────────
const courseCatalogData = [
  { code: 'PH7001', name: 'Research Methodology', credits: 4, schedule: 'Mon/Wed 9:00–10:30', enrolled: 12 },
  { code: 'CS7102', name: 'Advanced Algorithms', credits: 4, schedule: 'Tue/Thu 11:00–12:30', enrolled: 8 },
  { code: 'CS7203', name: 'Machine Learning Theory', credits: 4, schedule: 'Mon/Fri 2:00–3:30', enrolled: 15 },
  { code: 'CS7304', name: 'Statistical Methods in Research', credits: 3, schedule: 'Wed 10:00–1:00', enrolled: 10 },
  { code: 'CS7405', name: 'Foundations of AI', credits: 3, schedule: 'Thu 2:00–5:00', enrolled: 7 },
]

function CourseCatalog() {
  const [selected, setSelected] = useState(null)
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Course Catalog</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Course Code', 'Course Name', 'Credits', 'Schedule', 'Enrolled', 'Action'].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courseCatalogData.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 12, color: ACCENT, fontWeight: 700 }}>{c.code}</td>
                <td style={{ padding: '12px 14px', fontWeight: 600, color: TEXT }}>{c.name}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{c.credits}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{c.schedule}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ background: '#eef2ff', color: ACCENT, borderRadius: 8, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{c.enrolled}</span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <button
                    onClick={() => setSelected(selected === i ? null : i)}
                    style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    {selected === i ? 'Hide' : 'View Details'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected !== null && (
        <div style={{ marginTop: 16, ...card, padding: 18, borderLeft: `4px solid ${ACCENT}` }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: TEXT }}>{courseCatalogData[selected].code} — {courseCatalogData[selected].name}</p>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: MUTED }}>Credits: {courseCatalogData[selected].credits} &nbsp;|&nbsp; Schedule: {courseCatalogData[selected].schedule} &nbsp;|&nbsp; Enrolled: {courseCatalogData[selected].enrolled} scholars</p>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: MUTED }}>This is a core PhD course work course. Faculty can manage attendance, upload materials, and upload question papers from the respective tabs.</p>
        </div>
      )}
    </div>
  )
}

// ─── Question Paper Upload ────────────────────────────────────────────────────
const uploadedPapers = [
  { id: 1, course: 'CS7102', examType: 'Internal', examDate: '2024-09-15', file: 'CS7102_Internal_Sep24.pdf' },
  { id: 2, course: 'CS7203', examType: 'End Sem', examDate: '2024-11-20', file: 'CS7203_EndSem_Nov24.pdf' },
]

function QuestionPaperUpload() {
  const [papers, setPapers] = useState(uploadedPapers)
  const [form, setForm] = useState({ course: '', examType: '', examDate: '', file: null })
  const [fileName, setFileName] = useState('')

  const handleUpload = () => {
    if (!form.course || !form.examType || !form.examDate) return
    const newEntry = { id: Date.now(), course: form.course, examType: form.examType, examDate: form.examDate, file: fileName || 'Uploaded_Paper.pdf' }
    setPapers((p) => [newEntry, ...p])
    setForm({ course: '', examType: '', examDate: '', file: null })
    setFileName('')
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Question Paper Upload</h2>
      <div style={{ ...card, padding: 22, marginBottom: 24 }}>
        <p style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 }}>Upload New Paper</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Course *</label>
            <select
              value={form.course}
              onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT }}
            >
              <option value="">Select course</option>
              {courseCatalogData.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Exam Type *</label>
            <select
              value={form.examType}
              onChange={(e) => setForm((p) => ({ ...p, examType: e.target.value }))}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT }}
            >
              <option value="">Select type</option>
              <option>Internal</option>
              <option>End Sem</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Exam Date *</label>
            <input
              type="date"
              value={form.examDate}
              onChange={(e) => setForm((p) => ({ ...p, examDate: e.target.value }))}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, boxSizing: 'border-box' }}
            />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Upload PDF *</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => { setForm((p) => ({ ...p, file: e.target.files[0] })); setFileName(e.target.files[0]?.name || '') }}
            style={{ fontSize: 13, color: TEXT }}
          />
          {fileName && <span style={{ marginLeft: 10, fontSize: 12, color: '#10b981', fontWeight: 600 }}>{fileName}</span>}
        </div>
        <button onClick={handleUpload} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '9px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Upload Paper
        </button>
      </div>
      <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: TEXT }}>Uploaded Papers</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Course', 'Exam Type', 'Exam Date', 'File', 'Actions'].map((h) => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {papers.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 12, color: ACCENT, fontWeight: 700 }}>{p.course}</td>
              <td style={{ padding: '12px 14px', color: MUTED }}>{p.examType}</td>
              <td style={{ padding: '12px 14px', color: MUTED }}>{p.examDate}</td>
              <td style={{ padding: '12px 14px', color: TEXT }}>{p.file}</td>
              <td style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Download</button>
                  <button onClick={() => setPapers((prev) => prev.filter((x) => x.id !== p.id))} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Scholar Weekly Report ────────────────────────────────────────────────────
const weeklyReports = [
  { id: 1, scholar: 'Arun Kumar', week: 47, date: '2024-11-22', activities: 'Literature survey, model training', hours: 42, status: 'Pending', comment: '' },
  { id: 2, scholar: 'Meena Devi', week: 47, date: '2024-11-22', activities: 'Synopsis revision, advisor meeting', hours: 38, status: 'Reviewed', comment: 'Good progress on synopsis.' },
  { id: 3, scholar: 'Suresh Babu', week: 47, date: '2024-11-22', activities: 'Chapter 3 writing, experiments', hours: 45, status: 'Pending', comment: '' },
  { id: 4, scholar: 'Lavanya R', week: 47, date: '2024-11-22', activities: 'Pre-viva preparation', hours: 40, status: 'Reviewed', comment: 'Ready for viva.' },
]

function ScholarWeeklyReport() {
  const [reports, setReports] = useState(weeklyReports)
  const [comments, setComments] = useState({})

  const markReviewed = (id) => {
    setReports((p) => p.map((r) => r.id === id ? { ...r, status: 'Reviewed', comment: comments[id] || r.comment } : r))
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Scholar Weekly Report</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Scholar Name', 'Week No', 'Submission Date', 'Activities', 'Hours', 'Status', 'Comments', 'Action'].map((h) => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 14px', fontWeight: 600, color: TEXT }}>{r.scholar}</td>
              <td style={{ padding: '12px 14px', color: MUTED }}>Wk {r.week}</td>
              <td style={{ padding: '12px 14px', color: MUTED }}>{r.date}</td>
              <td style={{ padding: '12px 14px', color: TEXT, maxWidth: 200, fontSize: 12 }}>{r.activities}</td>
              <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{r.hours}h</td>
              <td style={{ padding: '12px 14px' }}>
                <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 10, background: r.status === 'Reviewed' ? '#d1fae5' : '#fef3c7', color: r.status === 'Reviewed' ? '#065f46' : '#92400e', fontWeight: 600 }}>
                  {r.status}
                </span>
              </td>
              <td style={{ padding: '12px 14px' }}>
                <input
                  value={comments[r.id] !== undefined ? comments[r.id] : r.comment}
                  onChange={(e) => setComments((p) => ({ ...p, [r.id]: e.target.value }))}
                  placeholder="Add comment…"
                  style={{ padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, width: 150 }}
                />
              </td>
              <td style={{ padding: '12px 14px' }}>
                {r.status === 'Pending' && (
                  <button onClick={() => markReviewed(r.id)} style={{ background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Mark Reviewed
                  </button>
                )}
                {r.status === 'Reviewed' && <span style={{ color: MUTED, fontSize: 12 }}>Done</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Half-Yearly Progress Review ──────────────────────────────────────────────
const progressReviews = [
  { id: 1, scholar: 'Arun Kumar', period: 'Jul-Dec', year: 2024, rating: 4, comments: 'Good progress in course work.', recommendations: 'Increase publication focus.', doc: 'review_arun_jul24.pdf' },
  { id: 2, scholar: 'Meena Devi', period: 'Jan-Jun', year: 2024, rating: 5, comments: 'Excellent research work.', recommendations: 'Proceed to thesis writing.', doc: 'review_meena_jan24.pdf' },
]

function HalfYearlyProgressReview() {
  const [reviews, setReviews] = useState(progressReviews)
  const [form, setForm] = useState({ scholar: '', period: '', year: '', rating: 0, comments: '', recommendations: '', doc: '' })
  const [hoveredStar, setHoveredStar] = useState(0)

  const submit = () => {
    if (!form.scholar || !form.period || !form.year) return
    setReviews((p) => [{ id: Date.now(), ...form, year: Number(form.year) }, ...p])
    setForm({ scholar: '', period: '', year: '', rating: 0, comments: '', recommendations: '', doc: '' })
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Half-Yearly Progress Review</h2>
      <div style={{ ...card, padding: 22, marginBottom: 24 }}>
        <p style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 }}>Submit Review</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Scholar *</label>
            <select value={form.scholar} onChange={(e) => setForm((p) => ({ ...p, scholar: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT }}>
              <option value="">Select scholar</option>
              {scholarsData.map((s) => <option key={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Review Period *</label>
            <select value={form.period} onChange={(e) => setForm((p) => ({ ...p, period: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT }}>
              <option value="">Select period</option>
              <option>Jan-Jun</option>
              <option>Jul-Dec</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Year *</label>
            <input type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} placeholder="2024" style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 6 }}>Performance Rating</label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setForm((p) => ({ ...p, rating: star }))}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: star <= (hoveredStar || form.rating) ? '#f59e0b' : '#e2e8f0', padding: 0 }}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Comments</label>
            <textarea value={form.comments} onChange={(e) => setForm((p) => ({ ...p, comments: e.target.value }))} rows={3} placeholder="Performance observations…" style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Recommendations</label>
            <textarea value={form.recommendations} onChange={(e) => setForm((p) => ({ ...p, recommendations: e.target.value }))} rows={3} placeholder="Next steps for scholar…" style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Upload Review Document</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setForm((p) => ({ ...p, doc: e.target.files[0]?.name || '' }))} style={{ fontSize: 13, color: TEXT }} />
        </div>
        <button onClick={submit} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '9px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Submit Review</button>
      </div>
      <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: TEXT }}>Review History</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Scholar', 'Period', 'Year', 'Rating', 'Comments', 'Recommendations', 'Document'].map((h) => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 14px', fontWeight: 600, color: TEXT }}>{r.scholar}</td>
              <td style={{ padding: '12px 14px', color: MUTED }}>{r.period}</td>
              <td style={{ padding: '12px 14px', color: MUTED }}>{r.year}</td>
              <td style={{ padding: '12px 14px' }}>{Array.from({ length: 5 }, (_, i) => <span key={i} style={{ color: i < r.rating ? '#f59e0b' : '#e2e8f0', fontSize: 14 }}>★</span>)}</td>
              <td style={{ padding: '12px 14px', color: TEXT, fontSize: 12, maxWidth: 180 }}>{r.comments}</td>
              <td style={{ padding: '12px 14px', color: TEXT, fontSize: 12, maxWidth: 180 }}>{r.recommendations}</td>
              <td style={{ padding: '12px 14px' }}>
                {r.doc && <button style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Download</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Half-Yearly Committee Review ─────────────────────────────────────────────
const committeeReviews = [
  { id: 1, scholar: 'Arun Kumar', date: '2024-11-05', committee: 'Dr. Ramesh, Dr. Priya, Dr. Anand', agenda: 'Course work progress review', mode: 'Online', venue: 'MS Teams', minutes: 'dc_minutes_arun_nov24.pdf' },
  { id: 2, scholar: 'Meena Devi', date: '2024-10-18', committee: 'Dr. Ramesh, Dr. Kumar, Dr. Nair', agenda: 'Synopsis discussion and approval', mode: 'Offline', venue: 'Conference Room B', minutes: 'dc_minutes_meena_oct24.pdf' },
]

function HalfYearlyCommitteeReview() {
  const [meetings, setMeetings] = useState(committeeReviews)
  const [form, setForm] = useState({ scholar: '', date: '', committee: '', agenda: '', mode: '', venue: '' })

  const schedule = () => {
    if (!form.scholar || !form.date) return
    setMeetings((p) => [{ id: Date.now(), ...form, minutes: '' }, ...p])
    setForm({ scholar: '', date: '', committee: '', agenda: '', mode: '', venue: '' })
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Half-Yearly Committee Review</h2>
      <div style={{ ...card, padding: 22, marginBottom: 24 }}>
        <p style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 }}>Schedule DC Meeting</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Scholar *</label>
            <select value={form.scholar} onChange={(e) => setForm((p) => ({ ...p, scholar: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT }}>
              <option value="">Select scholar</option>
              {scholarsData.map((s) => <option key={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Meeting Date *</label>
            <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Meeting Mode</label>
            <select value={form.mode} onChange={(e) => setForm((p) => ({ ...p, mode: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT }}>
              <option value="">Select mode</option>
              <option>Online</option>
              <option>Offline</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Committee Members</label>
            <input value={form.committee} onChange={(e) => setForm((p) => ({ ...p, committee: e.target.value }))} placeholder="Dr. A, Dr. B, Dr. C" style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Venue / Link</label>
            <input value={form.venue} onChange={(e) => setForm((p) => ({ ...p, venue: e.target.value }))} placeholder="Room / Meet link" style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Agenda</label>
          <textarea value={form.agenda} onChange={(e) => setForm((p) => ({ ...p, agenda: e.target.value }))} rows={2} placeholder="Meeting agenda…" style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        <button onClick={schedule} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '9px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Schedule Meeting</button>
      </div>
      <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: TEXT }}>Past Meeting Minutes</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Scholar', 'Date', 'Committee', 'Agenda', 'Mode', 'Venue', 'Minutes'].map((h) => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {meetings.map((m) => (
            <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 14px', fontWeight: 600, color: TEXT }}>{m.scholar}</td>
              <td style={{ padding: '12px 14px', color: MUTED }}>{m.date}</td>
              <td style={{ padding: '12px 14px', color: TEXT, fontSize: 12, maxWidth: 160 }}>{m.committee}</td>
              <td style={{ padding: '12px 14px', color: TEXT, fontSize: 12, maxWidth: 180 }}>{m.agenda}</td>
              <td style={{ padding: '12px 14px' }}>
                <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 10, background: m.mode === 'Online' ? '#dbeafe' : '#f0fdf4', color: m.mode === 'Online' ? '#1d4ed8' : '#166534', fontWeight: 600 }}>{m.mode || '—'}</span>
              </td>
              <td style={{ padding: '12px 14px', color: MUTED, fontSize: 12 }}>{m.venue}</td>
              <td style={{ padding: '12px 14px' }}>
                {m.minutes
                  ? <button style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Download</button>
                  : <span style={{ color: MUTED, fontSize: 12 }}>Pending</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── IRINS Details ────────────────────────────────────────────────────────────
function IRINSDetails() {
  const [editing, setEditing] = useState(false)
  const [synced, setSynced] = useState('2024-11-01')
  const [profile, setProfile] = useState({
    irinsId: 'IRINS-FAC-20045',
    hIndex: 12,
    totalPublications: 48,
    totalCitations: 620,
    journalArticles: 32,
    conferenceCount: 16,
  })
  const [draft, setDraft] = useState({ ...profile })

  const save = () => { setProfile({ ...draft }); setEditing(false) }

  const fields = [
    { key: 'irinsId', label: 'IRINS ID' },
    { key: 'hIndex', label: 'h-Index' },
    { key: 'totalPublications', label: 'Total Publications' },
    { key: 'totalCitations', label: 'Total Citations' },
    { key: 'journalArticles', label: 'Journal Articles' },
    { key: 'conferenceCount', label: 'Conference Papers' },
  ]

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>IRINS Details</h2>
      <div style={{ ...card, padding: 22, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: TEXT }}>IRINS Profile Summary</p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: MUTED }}>Last synced: {synced}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { setSynced(new Date().toISOString().slice(0, 10)) }} style={{ background: '#f0fdf4', color: '#166534', border: 'none', borderRadius: 7, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Sync Now</button>
            <button onClick={() => { setEditing(!editing); setDraft({ ...profile }) }} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {fields.map((f) => (
            <div key={f.key} style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 18px' }}>
              <p style={{ margin: '0 0 6px', fontSize: 12, color: MUTED, fontWeight: 500 }}>{f.label}</p>
              {editing
                ? <input value={draft[f.key]} onChange={(e) => setDraft((p) => ({ ...p, [f.key]: e.target.value }))} style={{ fontSize: 16, fontWeight: 700, color: ACCENT, border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px', width: '100%', boxSizing: 'border-box' }} />
                : <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: ACCENT }}>{profile[f.key]}</p>}
            </div>
          ))}
        </div>
        {editing && (
          <button onClick={save} style={{ marginTop: 16, background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '9px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
        )}
      </div>
    </div>
  )
}

// ─── ETD Approval ─────────────────────────────────────────────────────────────
const etdQueue = [
  { id: 1, scholar: 'Lavanya R', title: 'Efficient Cryptographic Protocols for Resource-Constrained Environments', submitted: '2024-10-30', plagiarism: 7, status: 'Pending' },
  { id: 2, scholar: 'Suresh Babu', title: 'Computational Approaches in Comparative Genomics', submitted: '2024-09-15', plagiarism: 9, status: 'Revision Requested' },
]

function ETDApproval() {
  const [items, setItems] = useState(etdQueue)
  const [notes, setNotes] = useState({})

  const updateStatus = (id, status) => setItems((p) => p.map((i) => i.id === id ? { ...i, status } : i))
  const plagColor = (p) => p <= 10 ? '#10b981' : p <= 20 ? '#f59e0b' : '#ef4444'

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>ETD Approval</h2>
      {items.map((item) => (
        <div key={item.id} style={{ ...card, padding: 20, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>{item.scholar}</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, maxWidth: 520 }}>{item.title}</p>
            </div>
            <span style={{ fontSize: 12, padding: '3px 12px', borderRadius: 10, background: item.status === 'Approved' ? '#d1fae5' : item.status === 'Rejected' ? '#fee2e2' : item.status === 'Revision Requested' ? '#fef3c7' : '#eef2ff', color: item.status === 'Approved' ? '#065f46' : item.status === 'Rejected' ? '#991b1b' : item.status === 'Revision Requested' ? '#92400e' : ACCENT, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {item.status}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 20, marginBottom: 12, fontSize: 13 }}>
            <span style={{ color: MUTED }}>Submitted: <strong style={{ color: TEXT }}>{item.submitted}</strong></span>
            <span style={{ color: MUTED }}>Plagiarism: <strong style={{ color: plagColor(item.plagiarism) }}>{item.plagiarism}%</strong></span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              value={notes[item.id] || ''}
              onChange={(e) => setNotes((p) => ({ ...p, [item.id]: e.target.value }))}
              placeholder="Add comments…"
              style={{ flex: 1, padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT }}
            />
            <button onClick={() => updateStatus(item.id, 'Approved')} style={{ background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Approve</button>
            <button onClick={() => updateStatus(item.id, 'Revision Requested')} style={{ background: '#fef3c7', color: '#92400e', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Request Revision</button>
            <button onClick={() => updateStatus(item.id, 'Rejected')} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
          </div>
        </div>
      ))}
      {items.length === 0 && <p style={{ color: MUTED, fontSize: 13 }}>No theses pending approval.</p>}
    </div>
  )
}

// ─── Faculty Open Project Creation ───────────────────────────────────────────
const domainList = ['Artificial Intelligence', 'Cybersecurity', 'IoT', 'Blockchain', 'Data Science', 'Cloud Computing', 'Embedded Systems', 'Web Development', 'Mobile Development', 'Other']

const sampleProjects = [
  { id: 1, title: 'AI-Powered Attendance System', domain: 'Artificial Intelligence', techStack: 'Python, OpenCV, Flask', duration: '3 months', teamSize: 3, description: 'Build a face-recognition-based attendance system.', prerequisites: 'Python, ML basics', deliverables: 'Working prototype + report', applications: 5 },
  { id: 2, title: 'Blockchain-based Certificate Verification', domain: 'Blockchain', techStack: 'Solidity, React, Ethereum', duration: '4 months', teamSize: 2, description: 'Immutable digital certificates on blockchain.', prerequisites: 'Web dev basics', deliverables: 'Smart contract + UI', applications: 3 },
]

function FacultyOpenProjectCreation() {
  const [projects, setProjects] = useState(sampleProjects)
  const [form, setForm] = useState({ title: '', domain: '', techStack: '', duration: '', teamSize: 1, description: '', prerequisites: '', deliverables: '' })
  const [editingId, setEditingId] = useState(null)

  const handleSave = () => {
    if (!form.title.trim()) return
    if (editingId !== null) {
      setProjects((p) => p.map((proj) => proj.id === editingId ? { ...proj, ...form } : proj))
      setEditingId(null)
    } else {
      setProjects((p) => [...p, { id: Date.now(), ...form, applications: 0 }])
    }
    setForm({ title: '', domain: '', techStack: '', duration: '', teamSize: 1, description: '', prerequisites: '', deliverables: '' })
  }

  const startEdit = (proj) => {
    setForm({ title: proj.title, domain: proj.domain, techStack: proj.techStack, duration: proj.duration, teamSize: proj.teamSize, description: proj.description, prerequisites: proj.prerequisites, deliverables: proj.deliverables })
    setEditingId(proj.id)
  }

  const remove = (id) => setProjects((p) => p.filter((proj) => proj.id !== id))

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Faculty Open Project Creation</h2>
      <div style={{ ...card, padding: 22, marginBottom: 24 }}>
        <p style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {editingId !== null ? 'Edit Project' : 'Post New Project'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Project Title *</label>
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g., Smart Campus Monitoring" style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Domain</label>
            <select value={form.domain} onChange={(e) => setForm((p) => ({ ...p, domain: e.target.value }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT }}>
              <option value="">Select domain</option>
              {domainList.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Tech Stack</label>
            <input value={form.techStack} onChange={(e) => setForm((p) => ({ ...p, techStack: e.target.value }))} placeholder="Python, React, etc." style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Duration</label>
            <input value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} placeholder="e.g., 3 months" style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Team Size (1–4)</label>
            <input type="number" min={1} max={4} value={form.teamSize} onChange={(e) => setForm((p) => ({ ...p, teamSize: Number(e.target.value) }))} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Description</label>
          <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Describe the project objectives and scope…" style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Prerequisites</label>
            <input value={form.prerequisites} onChange={(e) => setForm((p) => ({ ...p, prerequisites: e.target.value }))} placeholder="Required skills/knowledge" style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Deliverables</label>
            <input value={form.deliverables} onChange={(e) => setForm((p) => ({ ...p, deliverables: e.target.value }))} placeholder="Expected outputs" style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleSave} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '9px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {editingId !== null ? 'Update Project' : 'Post Project'}
          </button>
          {editingId !== null && (
            <button onClick={() => { setEditingId(null); setForm({ title: '', domain: '', techStack: '', duration: '', teamSize: 1, description: '', prerequisites: '', deliverables: '' }) }} style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 7, padding: '9px 18px', fontSize: 13, cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </div>
      </div>
      <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 600, color: TEXT }}>Posted Projects</h3>
      {projects.map((proj) => (
        <div key={proj.id} style={{ ...card, padding: 18, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: TEXT }}>{proj.title}</p>
              <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 10, background: '#eef2ff', color: ACCENT, fontWeight: 600 }}>{proj.domain}</span>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 12, color: MUTED }}>{proj.description}</p>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: MUTED }}>
              <span>Tech: <strong style={{ color: TEXT }}>{proj.techStack}</strong></span>
              <span>Duration: <strong style={{ color: TEXT }}>{proj.duration}</strong></span>
              <span>Team: <strong style={{ color: TEXT }}>{proj.teamSize}</strong></span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 10, background: '#f0fdf4', color: '#166534', fontWeight: 600 }}>{proj.applications} Applications</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => startEdit(proj)} style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
              <button onClick={() => remove(proj.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      ))}
      {projects.length === 0 && <p style={{ color: MUTED, fontSize: 13 }}>No projects posted yet.</p>}
    </div>
  )
}

// ─── Tab Content Map ──────────────────────────────────────────────────────────
const tabComponents = {
  'Research Regulations': <ResearchRegulations />,
  'Areas of Expertise': <AreasOfExpertise />,
  'Profile / Admission Approval': <ProfileAdmissionApproval />,
  'Onroll Scholars': <OnrollScholars />,
  'Course Catalog': <CourseCatalog />,
  'Question Paper Upload': <QuestionPaperUpload />,
  'Scholar Weekly Report': <ScholarWeeklyReport />,
  'Half-Yearly Progress Review': <HalfYearlyProgressReview />,
  'Half-Yearly Committee Review': <HalfYearlyCommitteeReview />,
  'IRINS Details': <IRINSDetails />,
  'ETD Approval': <ETDApproval />,
  'Faculty Open Project Creation': <FacultyOpenProjectCreation />,
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FacultyResearchGeneral() {
  const [activeTab, setActiveTab] = useState(navItems[0])

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'system-ui, -apple-system, sans-serif', color: TEXT }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '22px 32px 18px' }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: TEXT }}>Research — General</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: MUTED }}>Manage scholars, research regulations, and academic approvals</p>
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
                  display: 'block', width: '100%', textAlign: 'left',
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
          {tabComponents[activeTab]}
        </div>
      </div>
    </div>
  )
}
