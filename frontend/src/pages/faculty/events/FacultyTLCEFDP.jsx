import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = [
  'FDP Requisition Form',
  'FDP Registration',
  'Participant Certificate',
  'Coordinator Certificate',
  'Resource Person Certificate',
  'Event Recommendation',
  'Pre-Proposal Approval View',
  'View Posted Event',
  'Update Resource Person',
  'Quiz Creation',
  'FDP Quiz',
  'Biometric Log',
  'POSH Certificate',
]

// ─── Shared Helpers ────────────────────────────────────────────────────────────
const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box', background: '#fff' }
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }
const successBanner = { background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }

function FormField({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

// ─── FDP Requisition Form ──────────────────────────────────────────────────────
function FDPRequisitionForm() {
  const [form, setForm] = useState({ title: '', type: 'Offline', date: '', duration: '', audience: '', participants: '', theme: '', objectives: '', budget: '', venue: '' })
  const [resourcePersons, setResourcePersons] = useState([{ name: '', designation: '', institution: '' }])
  const [submitted, setSubmitted] = useState(false)

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  const addRP = () => setResourcePersons(p => [...p, { name: '', designation: '', institution: '' }])
  const updateRP = (i, field, value) => setResourcePersons(p => p.map((r, idx) => idx === i ? { ...r, [field]: value } : r))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>FDP Requisition Form</h2>
      {submitted && <div style={successBanner}>FDP requisition submitted for approval!</div>}
      <div style={{ ...card, padding: 24 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="Event Title">
                <input type="text" value={form.title} onChange={set('title')} required placeholder="Enter FDP event title" style={inputStyle} />
              </FormField>
            </div>
            <FormField label="Event Type">
              <select value={form.type} onChange={set('type')} style={inputStyle}>
                {['Online', 'Offline', 'Hybrid'].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Proposed Date">
              <input type="date" value={form.date} onChange={set('date')} required style={inputStyle} />
            </FormField>
            <FormField label="Duration (Days)">
              <input type="number" min={1} value={form.duration} onChange={set('duration')} required placeholder="e.g. 3" style={inputStyle} />
            </FormField>
            <FormField label="Target Audience">
              <input type="text" value={form.audience} onChange={set('audience')} required placeholder="e.g. Faculty, Research Scholars" style={inputStyle} />
            </FormField>
            <FormField label="Expected Participants">
              <input type="number" min={1} value={form.participants} onChange={set('participants')} required placeholder="e.g. 50" style={inputStyle} />
            </FormField>
            <FormField label="Theme">
              <input type="text" value={form.theme} onChange={set('theme')} required placeholder="Central theme of the FDP" style={inputStyle} />
            </FormField>
            <FormField label="Budget Estimate (INR)">
              <input type="number" min={0} value={form.budget} onChange={set('budget')} required placeholder="e.g. 25000" style={inputStyle} />
            </FormField>
            <FormField label="Venue">
              <input type="text" value={form.venue} onChange={set('venue')} required placeholder="Venue / Platform (for online)" style={inputStyle} />
            </FormField>
            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="Objectives">
                <textarea value={form.objectives} onChange={set('objectives')} required rows={3} placeholder="State the objectives of this FDP..." style={{ ...inputStyle, resize: 'vertical' }} />
              </FormField>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Resource Persons</label>
              <button type="button" onClick={addRP} style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Add</button>
            </div>
            {resourcePersons.map((rp, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12, padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <FormField label="Name">
                  <input type="text" value={rp.name} onChange={e => updateRP(i, 'name', e.target.value)} placeholder="Resource person name" style={inputStyle} />
                </FormField>
                <FormField label="Designation">
                  <input type="text" value={rp.designation} onChange={e => updateRP(i, 'designation', e.target.value)} placeholder="Designation" style={inputStyle} />
                </FormField>
                <FormField label="Institution">
                  <input type="text" value={rp.institution} onChange={e => updateRP(i, 'institution', e.target.value)} placeholder="Institution / Organisation" style={inputStyle} />
                </FormField>
              </div>
            ))}
          </div>

          <button type="submit" style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Submit for Approval</button>
        </form>
      </div>
    </div>
  )
}

// ─── FDP Registration ──────────────────────────────────────────────────────────
const availableFDPs = [
  { id: 1, name: 'Deep Learning for Computer Vision', date: '2024-07-10', mode: 'Online', coordinator: 'Dr. A. Rajesh', seats: 8 },
  { id: 2, name: 'Research Methodology & Writing', date: '2024-07-20', mode: 'Offline', coordinator: 'Dr. S. Meena', seats: 15 },
  { id: 3, name: 'Outcome Based Education (OBE)', date: '2024-08-05', mode: 'Hybrid', coordinator: 'Prof. K. Ramesh', seats: 20 },
]

const myFDPRegistrations = [
  { name: 'Python for Data Science', date: '2024-05-15', mode: 'Online', status: 'Completed' },
  { name: 'IoT Fundamentals', date: '2024-06-01', mode: 'Offline', status: 'Registered' },
]

function FDPRegistration() {
  const [detailFDP, setDetailFDP] = useState(null)
  const [registered, setRegistered] = useState({})

  const handleRegister = (id) => {
    setRegistered(p => ({ ...p, [id]: true }))
    setDetailFDP(null)
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>FDP Registration</h2>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Available FDPs</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {availableFDPs.map(fdp => (
            <div key={fdp.id} style={{ ...card, padding: 20 }}>
              <div style={{ fontWeight: 700, color: TEXT, fontSize: 14, marginBottom: 8, lineHeight: 1.4 }}>{fdp.name}</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>{fdp.date}</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Mode: <span style={{ color: TEXT, fontWeight: 600 }}>{fdp.mode}</span></div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Coordinator: {fdp.coordinator}</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>Available Seats: <span style={{ color: fdp.seats > 5 ? '#16a34a' : '#ef4444', fontWeight: 700 }}>{fdp.seats}</span></div>
              {registered[fdp.id] ? (
                <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 6, padding: '5px 12px', fontSize: 13, fontWeight: 700 }}>Registered</span>
              ) : (
                <button onClick={() => setDetailFDP(fdp)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View & Register</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {detailFDP && (
        <div style={{ ...card, padding: 24, marginBottom: 24, border: '2px solid #c7d2fe' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: TEXT }}>{detailFDP.name}</h3>
            <button onClick={() => setDetailFDP(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 6, padding: '5px 12px', color: MUTED, cursor: 'pointer', fontSize: 13 }}>Close</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
            {[['Date', detailFDP.date], ['Mode', detailFDP.mode], ['Coordinator', detailFDP.coordinator], ['Available Seats', detailFDP.seats]].map(([k, v]) => (
              <div key={k} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{v}</div>
              </div>
            ))}
          </div>
          <button onClick={() => handleRegister(detailFDP.id)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Confirm Registration</button>
        </div>
      )}

      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>My Registered FDPs</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['FDP Name', 'Date', 'Mode', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myFDPRegistrations.map((f, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{f.name}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{f.date}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{f.mode}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ background: f.status === 'Completed' ? '#dcfce7' : '#eef2ff', color: f.status === 'Completed' ? '#16a34a' : ACCENT, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{f.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Generic Certificate Table ─────────────────────────────────────────────────
function CertificateTable({ title, rows, columns }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>{title}</h2>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {[...columns, 'Certificate Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                {columns.map(col => (
                  <td key={col} style={{ padding: '12px 14px', color: TEXT }}>{row[col]}</td>
                ))}
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ background: row.certStatus === 'Available' ? '#dcfce7' : '#fef3c7', color: row.certStatus === 'Available' ? '#16a34a' : '#d97706', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{row.certStatus}</span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  {row.certStatus === 'Available' ? (
                    <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Download PDF</button>
                  ) : (
                    <span style={{ color: MUTED, fontSize: 13 }}>Processing...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ParticipantCertificate() {
  const rows = [
    { 'Event Name': 'Deep Learning Workshop', Date: '2024-03-10', Role: 'Participant', certStatus: 'Available' },
    { 'Event Name': 'Python Bootcamp', Date: '2024-04-15', Role: 'Participant', certStatus: 'Processing' },
    { 'Event Name': 'Cloud Computing FDP', Date: '2024-05-20', Role: 'Participant', certStatus: 'Available' },
  ]
  return <CertificateTable title="Participant Certificate" rows={rows} columns={['Event Name', 'Date', 'Role']} />
}

function CoordinatorCertificate() {
  const rows = [
    { 'Event Name': 'AI & ML FDP', Date: '2024-02-08', Role: 'Coordinator', certStatus: 'Available' },
    { 'Event Name': 'Research Writing FDP', Date: '2024-04-22', Role: 'Coordinator', certStatus: 'Processing' },
  ]
  return <CertificateTable title="Coordinator Certificate" rows={rows} columns={['Event Name', 'Date', 'Role']} />
}

function ResourcePersonCertificate() {
  const rows = [
    { 'Event Name': 'NLP Seminar', Date: '2024-01-18', 'Topic Presented': 'Transformer Models', certStatus: 'Available' },
    { 'Event Name': 'Data Science FDP', Date: '2024-03-05', 'Topic Presented': 'Feature Engineering', certStatus: 'Available' },
  ]
  return <CertificateTable title="Resource Person Certificate" rows={rows} columns={['Event Name', 'Date', 'Topic Presented']} />
}

// ─── Event Recommendation ──────────────────────────────────────────────────────
const pastRecommendations = [
  { eventName: 'ICML 2024', organizer: 'ACM', date: '2024-07-21', mode: 'Hybrid', status: 'Approved' },
  { eventName: 'NeurIPS Workshop', organizer: 'NeurIPS Foundation', date: '2024-09-10', mode: 'Online', status: 'Pending' },
]

function EventRecommendation() {
  const [form, setForm] = useState({ eventName: '', organizer: '', date: '', mode: 'Online', url: '', relevance: '', reason: '' })
  const [submitted, setSubmitted] = useState(false)
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Event Recommendation</h2>
      {submitted && <div style={successBanner}>Event recommendation submitted!</div>}
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>Recommend an Event</h3>
        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000) }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <FormField label="Event Name"><input type="text" value={form.eventName} onChange={set('eventName')} required placeholder="Event name" style={inputStyle} /></FormField>
            <FormField label="Organizer"><input type="text" value={form.organizer} onChange={set('organizer')} required placeholder="Organising body" style={inputStyle} /></FormField>
            <FormField label="Date"><input type="date" value={form.date} onChange={set('date')} required style={inputStyle} /></FormField>
            <FormField label="Mode">
              <select value={form.mode} onChange={set('mode')} style={inputStyle}>
                {['Online', 'Offline', 'Hybrid'].map(m => <option key={m}>{m}</option>)}
              </select>
            </FormField>
            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="URL / Brochure Link"><input type="url" value={form.url} onChange={set('url')} placeholder="https://..." style={inputStyle} /></FormField>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="Relevance"><input type="text" value={form.relevance} onChange={set('relevance')} required placeholder="Relevant to which domain / department?" style={inputStyle} /></FormField>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="Recommendation Reason">
                <textarea value={form.reason} onChange={set('reason')} required rows={3} placeholder="Why do you recommend this event?" style={{ ...inputStyle, resize: 'vertical' }} />
              </FormField>
            </div>
          </div>
          <button type="submit" style={{ marginTop: 18, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Submit Recommendation</button>
        </form>
      </div>
      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Past Recommendations</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Event Name', 'Organizer', 'Date', 'Mode', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pastRecommendations.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{r.eventName}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{r.organizer}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{r.date}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{r.mode}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ background: r.status === 'Approved' ? '#dcfce7' : '#fef3c7', color: r.status === 'Approved' ? '#16a34a' : '#d97706', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Pre-Proposal Approval View ────────────────────────────────────────────────
const preProposals = [
  { title: 'Blockchain Technology FDP', submittedBy: 'Prof. R. Kumar', date: '2024-06-01', type: 'FDP', status: 'Pending', details: 'A 3-day FDP on Blockchain and its application in academia and industry.' },
  { title: 'Agile & Scrum Workshop', submittedBy: 'Prof. D. Nair', date: '2024-06-05', type: 'Workshop', status: 'Pending', details: 'A 1-day workshop introducing agile methodologies and scrum framework.' },
  { title: 'Green Computing Conference', submittedBy: 'Dr. T. Rao', date: '2024-05-28', type: 'Conference', status: 'Reviewed', details: 'National conference on sustainable computing and energy efficiency.' },
]

function PreProposalApprovalView() {
  const [expanded, setExpanded] = useState(null)
  const [comments, setComments] = useState({})

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Pre-Proposal Approval View</h2>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Title', 'Submitted By', 'Date', 'Type', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preProposals.map((p, i) => (
              <React.Fragment key={i}>
                <tr style={{ borderBottom: '1px solid #f1f5f9', background: expanded === i ? '#eef2ff' : i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{p.title}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{p.submittedBy}</td>
                  <td style={{ padding: '12px 14px', color: MUTED }}>{p.date}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{p.type}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: p.status === 'Reviewed' ? '#dcfce7' : '#fef3c7', color: p.status === 'Reviewed' ? '#16a34a' : '#d97706', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <button onClick={() => setExpanded(expanded === i ? null : i)} style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View Details</button>
                  </td>
                </tr>
                {expanded === i && (
                  <tr style={{ background: '#f8fafc' }}>
                    <td colSpan={6} style={{ padding: '20px 24px', borderBottom: '2px solid #e2e8f0' }}>
                      <div style={{ fontSize: 14, color: TEXT, marginBottom: 12 }}>{p.details}</div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={labelStyle}>Comments</label>
                        <textarea
                          value={comments[i] || ''}
                          onChange={e => setComments(c => ({ ...c, [i]: e.target.value }))}
                          rows={2}
                          placeholder="Add your comments here..."
                          style={{ ...inputStyle, resize: 'vertical' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                        <button style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                        <button style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Request Modification</button>
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

// ─── View Posted Event ─────────────────────────────────────────────────────────
const postedEvents = [
  { name: 'Machine Learning Fundamentals FDP', dept: 'Computer Science', type: 'FDP', date: '2024-07-10', mode: 'Online', regStatus: 'Open' },
  { name: 'Pedagogy Techniques Workshop', dept: 'Education', type: 'Workshop', date: '2024-07-18', mode: 'Offline', regStatus: 'Closed' },
  { name: 'Cybersecurity Awareness Seminar', dept: 'Computer Science', type: 'Seminar', date: '2024-08-02', mode: 'Hybrid', regStatus: 'Open' },
  { name: 'Green Chemistry Conference', dept: 'Chemistry', type: 'Conference', date: '2024-08-15', mode: 'Offline', regStatus: 'Waitlist' },
]

function ViewPostedEvent() {
  const [deptF, setDeptF] = useState('All')
  const [typeF, setTypeF] = useState('All')
  const [modeF, setModeF] = useState('All')

  const filtered = postedEvents.filter(e =>
    (deptF === 'All' || e.dept === deptF) &&
    (typeF === 'All' || e.type === typeF) &&
    (modeF === 'All' || e.mode === modeF)
  )

  const regColor = { Open: '#16a34a', Closed: '#ef4444', Waitlist: '#d97706' }
  const regBg = { Open: '#dcfce7', Closed: '#fee2e2', Waitlist: '#fef3c7' }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>View Posted Event</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
        <FormField label="Department">
          <select value={deptF} onChange={e => setDeptF(e.target.value)} style={inputStyle}>
            {['All', 'Computer Science', 'Education', 'Chemistry'].map(d => <option key={d}>{d}</option>)}
          </select>
        </FormField>
        <FormField label="Type">
          <select value={typeF} onChange={e => setTypeF(e.target.value)} style={inputStyle}>
            {['All', 'FDP', 'Workshop', 'Seminar', 'Conference'].map(t => <option key={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Mode">
          <select value={modeF} onChange={e => setModeF(e.target.value)} style={inputStyle}>
            {['All', 'Online', 'Offline', 'Hybrid'].map(m => <option key={m}>{m}</option>)}
          </select>
        </FormField>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {filtered.map((ev, i) => (
          <div key={i} style={{ ...card, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ fontWeight: 700, color: TEXT, fontSize: 15, flex: 1, lineHeight: 1.4 }}>{ev.name}</div>
              <span style={{ background: regBg[ev.regStatus], color: regColor[ev.regStatus], borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700, marginLeft: 10, flexShrink: 0 }}>{ev.regStatus}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[['Dept', ev.dept], ['Type', ev.type], ['Date', ev.date], ['Mode', ev.mode]].map(([k, v]) => (
                <div key={k} style={{ fontSize: 13, color: MUTED }}>{k}: <span style={{ color: TEXT, fontWeight: 600 }}>{v}</span></div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: MUTED, padding: 40, fontSize: 14 }}>No events match the selected filters.</div>
        )}
      </div>
    </div>
  )
}

// ─── Update Resource Person ────────────────────────────────────────────────────
const coordinatedEvents = ['AI & ML FDP (Jul 2024)', 'Research Writing FDP (Apr 2024)']

function UpdateResourcePerson() {
  const [selectedEvent, setSelectedEvent] = useState(coordinatedEvents[0])
  const [rps, setRPs] = useState([
    { name: 'Dr. V. Kumar', designation: 'Professor', institution: 'IIT Madras', topic: 'Deep Learning', contact: '9900001111' },
  ])
  const [addMode, setAddMode] = useState(false)
  const [newRP, setNewRP] = useState({ name: '', designation: '', institution: '', topic: '', contact: '' })

  const handleAdd = () => {
    setRPs(p => [...p, newRP])
    setNewRP({ name: '', designation: '', institution: '', topic: '', contact: '' })
    setAddMode(false)
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Update Resource Person</h2>
      <div style={{ ...card, padding: 24 }}>
        <FormField label="Select Event">
          <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} style={{ ...inputStyle, marginBottom: 20 }}>
            {coordinatedEvents.map(ev => <option key={ev}>{ev}</option>)}
          </select>
        </FormField>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 600, color: TEXT, fontSize: 14 }}>Resource Persons for: <span style={{ color: ACCENT }}>{selectedEvent}</span></div>
          <button onClick={() => setAddMode(true)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Add Resource Person</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, marginBottom: addMode ? 20 : 0 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Name', 'Designation', 'Institution', 'Topic', 'Contact', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rps.map((rp, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{rp.name}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{rp.designation}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{rp.institution}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{rp.topic}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{rp.contact}</td>
                <td style={{ padding: '12px 14px' }}>
                  <button onClick={() => setRPs(p => p.filter((_, idx) => idx !== i))} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {addMode && (
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 20, border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, color: TEXT, fontSize: 14, marginBottom: 14 }}>Add New Resource Person</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[['Name', 'name'], ['Designation', 'designation'], ['Institution', 'institution'], ['Topic', 'topic'], ['Contact', 'contact']].map(([label, field]) => (
                <FormField key={field} label={label}>
                  <input type="text" value={newRP[field]} onChange={e => setNewRP(p => ({ ...p, [field]: e.target.value }))} placeholder={label} style={inputStyle} />
                </FormField>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button onClick={handleAdd} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add</button>
              <button onClick={() => setAddMode(false)} style={{ background: '#f1f5f9', color: MUTED, border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Quiz Creation ─────────────────────────────────────────────────────────────
function QuizCreation() {
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correct: 0 }])
  const [quizTitle, setQuizTitle] = useState('')
  const [duration, setDuration] = useState(30)
  const [submitted, setSubmitted] = useState(false)

  const addQuestion = () => setQuestions(p => [...p, { question: '', options: ['', '', '', ''], correct: 0 }])
  const updateQ = (qi, field, value) => setQuestions(p => p.map((q, i) => i === qi ? { ...q, [field]: value } : q))
  const updateOpt = (qi, oi, value) => setQuestions(p => p.map((q, i) => i === qi ? { ...q, options: q.options.map((o, j) => j === oi ? value : o) } : q))

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Quiz Creation</h2>
      {submitted && <div style={successBanner}>Quiz created successfully!</div>}
      <div style={{ ...card, padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          <FormField label="Event">
            <select style={inputStyle}>
              {coordinatedEvents.map(ev => <option key={ev}>{ev}</option>)}
            </select>
          </FormField>
          <FormField label="Quiz Title">
            <input type="text" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} placeholder="Enter quiz title" style={inputStyle} />
          </FormField>
          <FormField label="Duration (minutes)">
            <input type="number" min={5} max={120} value={duration} onChange={e => setDuration(e.target.value)} style={inputStyle} />
          </FormField>
        </div>

        {questions.map((q, qi) => (
          <div key={qi} style={{ background: '#f8fafc', borderRadius: 10, padding: 20, marginBottom: 16, border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, color: ACCENT, marginBottom: 12, fontSize: 14 }}>Question {qi + 1}</div>
            <div style={{ marginBottom: 12 }}>
              <FormField label="Question Text">
                <input type="text" value={q.question} onChange={e => updateQ(qi, 'question', e.target.value)} placeholder="Enter the question" style={inputStyle} />
              </FormField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              {q.options.map((opt, oi) => (
                <div key={oi} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="radio" checked={q.correct === oi} onChange={() => updateQ(qi, 'correct', oi)} style={{ accentColor: ACCENT, flexShrink: 0 }} />
                  <input type="text" value={opt} onChange={e => updateOpt(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} style={{ ...inputStyle, flex: 1 }} />
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: MUTED }}>Select the radio button next to the correct answer.</div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button onClick={addQuestion} style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Add Question</button>
          <button onClick={() => setSubmitted(true)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Create Quiz</button>
        </div>
      </div>
    </div>
  )
}

// ─── FDP Quiz ──────────────────────────────────────────────────────────────────
const quizList = [
  { id: 1, title: 'ML Fundamentals Quiz', event: 'Deep Learning FDP', questions: 5, duration: 15 },
  { id: 2, title: 'Research Methods Quiz', event: 'Research Writing FDP', questions: 8, duration: 20 },
]

const sampleQuestions = [
  { q: 'What does CNN stand for in deep learning?', options: ['Convolutional Neural Network', 'Clustered Node Network', 'Computational Neural Node', 'Connected Neural Net'], correct: 0 },
  { q: 'Which activation function is most commonly used in hidden layers?', options: ['Sigmoid', 'Tanh', 'ReLU', 'Softmax'], correct: 2 },
  { q: 'What is the purpose of dropout in neural networks?', options: ['Speed up training', 'Reduce overfitting', 'Increase model size', 'Normalize inputs'], correct: 1 },
]

function FDPQuiz() {
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleAnswer = (qi, optIdx) => setAnswers(p => ({ ...p, [qi]: optIdx }))

  const handleSubmit = () => setSubmitted(true)

  const score = submitted ? Object.entries(answers).filter(([qi, ans]) => sampleQuestions[qi]?.correct === ans).length : 0

  if (activeQuiz && !submitted) {
    const q = sampleQuestions[currentQ]
    return (
      <div>
        <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>FDP Quiz: {activeQuiz.title}</h2>
        <div style={{ ...card, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ color: MUTED, fontSize: 13 }}>Question {currentQ + 1} of {sampleQuestions.length}</span>
            <span style={{ background: '#eef2ff', color: ACCENT, borderRadius: 6, padding: '3px 12px', fontSize: 13, fontWeight: 600 }}>{activeQuiz.duration} min</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 20 }}>{q.q}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {q.options.map((opt, oi) => (
              <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, border: `1px solid ${answers[currentQ] === oi ? ACCENT : '#e2e8f0'}`, background: answers[currentQ] === oi ? '#eef2ff' : '#fff', cursor: 'pointer' }}>
                <input type="radio" checked={answers[currentQ] === oi} onChange={() => handleAnswer(currentQ, oi)} style={{ accentColor: ACCENT }} />
                <span style={{ fontSize: 14, color: TEXT }}>{opt}</span>
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {currentQ > 0 && <button onClick={() => setCurrentQ(p => p - 1)} style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Previous</button>}
            {currentQ < sampleQuestions.length - 1
              ? <button onClick={() => setCurrentQ(p => p + 1)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Next</button>
              : <button onClick={handleSubmit} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Submit Quiz</button>
            }
          </div>
        </div>
      </div>
    )
  }

  if (activeQuiz && submitted) {
    return (
      <div>
        <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Quiz Results</h2>
        <div style={{ ...card, padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 56, fontWeight: 700, color: score >= 2 ? '#16a34a' : '#ef4444' }}>{score}/{sampleQuestions.length}</div>
          <div style={{ fontSize: 16, color: TEXT, fontWeight: 600, marginTop: 8 }}>{score >= 2 ? 'Congratulations! You passed.' : 'Better luck next time.'}</div>
          <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>{activeQuiz.title}</div>
          <button onClick={() => { setActiveQuiz(null); setSubmitted(false); setCurrentQ(0); setAnswers({}) }} style={{ marginTop: 24, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Back to Quizzes</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>FDP Quiz</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {quizList.map(quiz => (
          <div key={quiz.id} style={{ ...card, padding: 22 }}>
            <div style={{ fontWeight: 700, color: TEXT, fontSize: 15, marginBottom: 8 }}>{quiz.title}</div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>Event: {quiz.event}</div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>Questions: {quiz.questions} | Duration: {quiz.duration} min</div>
            <button onClick={() => { setActiveQuiz(quiz); setCurrentQ(0); setAnswers({}) }} style={{ marginTop: 12, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Start Quiz</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Biometric Log ─────────────────────────────────────────────────────────────
const biometricLogs = [
  { event: 'AI & ML FDP', date: '2024-06-10', timeIn: '09:02 AM', timeOut: '05:15 PM', duration: '8h 13m', status: 'Present' },
  { event: 'Research Writing FDP', date: '2024-04-22', timeIn: '09:30 AM', timeOut: '04:45 PM', duration: '7h 15m', status: 'Present' },
  { event: 'Python Bootcamp', date: '2024-05-05', timeIn: '—', timeOut: '—', duration: '—', status: 'Absent' },
]

function BiometricLog() {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Biometric Log</h2>
      <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#92400e' }}>
        Attendance is marked automatically via biometric device. Use "Request Correction" for any discrepancies.
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Event Name', 'Date', 'Time In', 'Time Out', 'Duration', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {biometricLogs.map((log, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{log.event}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{log.date}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{log.timeIn}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{log.timeOut}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{log.duration}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ background: log.status === 'Present' ? '#dcfce7' : '#fee2e2', color: log.status === 'Present' ? '#16a34a' : '#ef4444', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{log.status}</span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <button style={{ background: '#fef3c7', color: '#d97706', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Request Correction</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── POSH Certificate ──────────────────────────────────────────────────────────
function POSHCertificate() {
  const [courseStarted, setCourseStarted] = useState(false)
  const [completed, setCompleted] = useState(false)

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>POSH Certificate</h2>
      <div style={{ ...card, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
            🛡
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: TEXT }}>Prevention of Sexual Harassment (POSH)</div>
            <div style={{ fontSize: 14, color: MUTED, marginTop: 3 }}>Mandatory awareness training for all faculty and staff members</div>
          </div>
        </div>

        {!completed ? (
          <div>
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#92400e', fontWeight: 500 }}>
              Course not yet completed. Please complete the POSH training to receive your certificate.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
              {[['Course Duration', '2 Hours'], ['Format', 'Online Self-Paced'], ['Validity', '3 Years']].map(([k, v]) => (
                <div key={k} style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{v}</div>
                </div>
              ))}
            </div>
            {!courseStarted
              ? <button onClick={() => setCourseStarted(true)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Take Course</button>
              : (
                <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 8, padding: 20 }}>
                  <div style={{ fontWeight: 700, color: ACCENT, marginBottom: 12 }}>POSH Training Module — In Progress</div>
                  <div style={{ fontSize: 14, color: TEXT, marginBottom: 16 }}>Module 1 of 4: Understanding POSH Act 2013 and its implications...</div>
                  <button onClick={() => setCompleted(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Mark as Completed</button>
                </div>
              )
            }
          </div>
        ) : (
          <div>
            <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#166534', fontWeight: 600 }}>
              POSH training completed! Your certificate is ready.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
              {[['Completion Date', '2024-06-05'], ['Valid Until', '2027-06-05'], ['Status', 'Certified']].map(([k, v]) => (
                <div key={k} style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: k === 'Status' ? '#16a34a' : TEXT }}>{v}</div>
                </div>
              ))}
            </div>
            <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Download Certificate</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
const contentMap = {
  'FDP Requisition Form': FDPRequisitionForm,
  'FDP Registration': FDPRegistration,
  'Participant Certificate': ParticipantCertificate,
  'Coordinator Certificate': CoordinatorCertificate,
  'Resource Person Certificate': ResourcePersonCertificate,
  'Event Recommendation': EventRecommendation,
  'Pre-Proposal Approval View': PreProposalApprovalView,
  'View Posted Event': ViewPostedEvent,
  'Update Resource Person': UpdateResourcePerson,
  'Quiz Creation': QuizCreation,
  'FDP Quiz': FDPQuiz,
  'Biometric Log': BiometricLog,
  'POSH Certificate': POSHCertificate,
}

export default function FacultyTLCEFDP() {
  const [activeNav, setActiveNav] = useState('FDP Requisition Form')
  const ActiveComponent = contentMap[activeNav] || (() => <div style={{ color: MUTED }}>Coming soon.</div>)

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Events — TLCE FDP</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Faculty Development Programme management and coordination</p>
      </div>

      <div style={{ ...card, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: 210, borderRight: '1px solid #f1f5f9', padding: '16px 0', flexShrink: 0 }}>
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 20px',
                background: activeNav === item ? '#eef2ff' : 'transparent',
                border: 'none',
                borderLeft: activeNav === item ? '3px solid #6366f1' : '3px solid transparent',
                textAlign: 'left',
                fontSize: 13,
                fontWeight: activeNav === item ? 600 : 400,
                color: activeNav === item ? ACCENT : TEXT,
                cursor: 'pointer',
                lineHeight: 1.4,
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, padding: 28, minWidth: 0, overflowY: 'auto' }}>
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}
