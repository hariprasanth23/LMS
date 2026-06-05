import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = [
  'Pre-Proposal Willingness',
  'Pre-Proposal Requisition Form',
  'FDP Wishlist',
]

const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box', background: '#fff' }
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }

function FormField({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

// ─── Pre-Proposal Willingness ──────────────────────────────────────────────────
const upcomingProposedEvents = [
  { id: 1, title: 'Advanced Data Analytics FDP', date: '2024-08-12', type: 'FDP', organizer: 'TLCE Cell' },
  { id: 2, title: 'Outcome Based Education Workshop', date: '2024-08-25', type: 'Workshop', organizer: 'Academic Council' },
  { id: 3, title: 'Cloud & DevOps Seminar', date: '2024-09-05', type: 'Seminar', organizer: 'Computer Science Dept' },
  { id: 4, title: 'International Research Collaboration Conference', date: '2024-09-20', type: 'Conference', organizer: 'Research Cell' },
]

const myWillingnessRecords = [
  { title: 'Python for AI FDP', date: '2024-06-15', type: 'FDP', organizer: 'TLCE Cell', interest: 'Interested', status: 'Confirmed' },
  { title: 'Accreditation Workshop', date: '2024-06-28', type: 'Workshop', organizer: 'IQAC', interest: 'Not Interested', status: 'Noted' },
]

function PreProposalWillingness() {
  const [willingness, setWillingness] = useState({})

  const toggle = (id, val) => setWillingness(p => ({ ...p, [id]: val }))

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Pre-Proposal Willingness</h2>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Upcoming Events Seeking Willingness</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {upcomingProposedEvents.map(ev => (
            <div key={ev.id} style={{ ...card, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: TEXT, fontSize: 14, marginBottom: 4 }}>{ev.title}</div>
                <div style={{ fontSize: 12, color: MUTED }}>
                  {ev.type} &middot; {ev.date} &middot; {ev.organizer}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                <button
                  onClick={() => toggle(ev.id, 'interested')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 8,
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: willingness[ev.id] === 'interested' ? '#16a34a' : '#dcfce7',
                    color: willingness[ev.id] === 'interested' ? '#fff' : '#16a34a',
                  }}
                >
                  Interested
                </button>
                <button
                  onClick={() => toggle(ev.id, 'not_interested')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 8,
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: willingness[ev.id] === 'not_interested' ? '#ef4444' : '#fee2e2',
                    color: willingness[ev.id] === 'not_interested' ? '#fff' : '#ef4444',
                  }}
                >
                  Not Interested
                </button>
              </div>
              {willingness[ev.id] && (
                <div style={{ fontSize: 12, fontWeight: 600, color: willingness[ev.id] === 'interested' ? '#16a34a' : '#ef4444', minWidth: 80 }}>
                  {willingness[ev.id] === 'interested' ? 'Marked: Interested' : 'Marked: Not Interested'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>My Expressed Willingness</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Event Title', 'Date', 'Type', 'Organizer', 'My Response', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myWillingnessRecords.map((rec, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{rec.title}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{rec.date}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{rec.type}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{rec.organizer}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{
                    background: rec.interest === 'Interested' ? '#dcfce7' : '#fee2e2',
                    color: rec.interest === 'Interested' ? '#16a34a' : '#ef4444',
                    borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700
                  }}>{rec.interest}</span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ background: '#eef2ff', color: ACCENT, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{rec.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Pre-Proposal Requisition Form ────────────────────────────────────────────
const submittedProposals = [
  { title: 'Quantum Computing Awareness FDP', type: 'FDP', mode: 'Online', dateRange: '2024-09-10 to 2024-09-12', status: 'Pending', submitted: '2024-06-01' },
  { title: 'Technical Writing Workshop', type: 'Workshop', mode: 'Offline', dateRange: '2024-08-18', status: 'Approved', submitted: '2024-05-20' },
]

function PreProposalRequisitionForm() {
  const [form, setForm] = useState({
    eventType: 'FDP',
    title: '',
    dateFrom: '',
    dateTo: '',
    duration: '',
    mode: 'Online',
    objectives: '',
    audience: '',
    outcomes: '',
    rpNeeded: '',
    budget: '',
  })
  const [file, setFile] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Pre-Proposal Requisition Form</h2>
      {submitted && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          Pre-proposal submitted successfully! It is now under review.
        </div>
      )}

      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <FormField label="Event Type">
              <select value={form.eventType} onChange={set('eventType')} style={inputStyle}>
                {['FDP', 'Workshop', 'Seminar', 'Conference'].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>

            <FormField label="Mode">
              <select value={form.mode} onChange={set('mode')} style={inputStyle}>
                {['Online', 'Offline', 'Hybrid'].map(m => <option key={m}>{m}</option>)}
              </select>
            </FormField>

            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="Title">
                <input type="text" value={form.title} onChange={set('title')} required placeholder="Proposed event title" style={inputStyle} />
              </FormField>
            </div>

            <FormField label="Proposed Start Date">
              <input type="date" value={form.dateFrom} onChange={set('dateFrom')} required style={inputStyle} />
            </FormField>

            <FormField label="Proposed End Date">
              <input type="date" value={form.dateTo} onChange={set('dateTo')} required style={inputStyle} />
            </FormField>

            <FormField label="Duration (Days)">
              <input type="number" min={1} value={form.duration} onChange={set('duration')} required placeholder="e.g. 3" style={inputStyle} />
            </FormField>

            <FormField label="Budget Estimate (INR)">
              <input type="number" min={0} value={form.budget} onChange={set('budget')} required placeholder="e.g. 20000" style={inputStyle} />
            </FormField>

            <FormField label="Target Audience">
              <input type="text" value={form.audience} onChange={set('audience')} required placeholder="e.g. Faculty, UG/PG Students" style={inputStyle} />
            </FormField>

            <FormField label="Resource Persons Needed">
              <input type="text" value={form.rpNeeded} onChange={set('rpNeeded')} placeholder="e.g. 2 from industry, 1 from academia" style={inputStyle} />
            </FormField>

            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="Objectives">
                <textarea value={form.objectives} onChange={set('objectives')} required rows={3} placeholder="Describe the objectives of this event..." style={{ ...inputStyle, resize: 'vertical' }} />
              </FormField>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="Expected Outcomes">
                <textarea value={form.outcomes} onChange={set('outcomes')} required rows={3} placeholder="What outcomes do you expect from this event?" style={{ ...inputStyle, resize: 'vertical' }} />
              </FormField>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="Supporting Documents">
                <input type="file" onChange={e => setFile(e.target.files[0])} style={{ fontSize: 14, color: TEXT }} />
                {file && <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>File selected: {file.name}</div>}
              </FormField>
            </div>
          </div>

          <button type="submit" style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Submit Pre-Proposal</button>
        </form>
      </div>

      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Submitted Proposals</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Title', 'Type', 'Mode', 'Date Range', 'Submitted On', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {submittedProposals.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{p.title}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{p.type}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{p.mode}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{p.dateRange}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{p.submitted}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{
                    background: p.status === 'Approved' ? '#dcfce7' : '#fef3c7',
                    color: p.status === 'Approved' ? '#16a34a' : '#d97706',
                    borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700
                  }}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── FDP Wishlist ──────────────────────────────────────────────────────────────
const fdpCatalogue = [
  { name: 'Advanced AI & Deep Learning', provider: 'IIT Madras Online', domain: 'Artificial Intelligence' },
  { name: 'Blockchain for Finance', provider: 'IIM Ahmedabad', domain: 'Finance & Technology' },
  { name: 'Design Thinking for Educators', provider: 'AICTE', domain: 'Pedagogy' },
  { name: 'Quantum Computing Basics', provider: 'MIT OpenCourseWare', domain: 'Computing' },
  { name: 'Data Driven Decision Making', provider: 'Coursera / IBM', domain: 'Data Science' },
]

function FDPWishlist() {
  const [search, setSearch] = useState('')
  const [wishlist, setWishlist] = useState([
    { name: 'Advanced AI & Deep Learning', provider: 'IIT Madras Online', domain: 'Artificial Intelligence', priority: 'High', notes: 'Directly related to my research area.' },
  ])
  const [notesInput, setNotesInput] = useState({})
  const [priorityInput, setPriorityInput] = useState({})
  const [addSuccess, setAddSuccess] = useState(null)

  const filteredCatalogue = fdpCatalogue.filter(fdp =>
    !search || fdp.name.toLowerCase().includes(search.toLowerCase()) || fdp.domain.toLowerCase().includes(search.toLowerCase())
  )

  const isInWishlist = name => wishlist.some(w => w.name === name)

  const addToWishlist = (fdp) => {
    if (!isInWishlist(fdp.name)) {
      setWishlist(p => [...p, { ...fdp, priority: priorityInput[fdp.name] || 'Medium', notes: notesInput[fdp.name] || '' }])
      setAddSuccess(fdp.name)
      setTimeout(() => setAddSuccess(null), 3000)
    }
  }

  const remove = (name) => setWishlist(p => p.filter(w => w.name !== name))

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>FDP Wishlist</h2>

      {addSuccess && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          "{addSuccess}" added to your wishlist!
        </div>
      )}

      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Search FDP Catalogue</h3>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by topic or domain..."
          style={{ ...inputStyle, marginBottom: 16 }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredCatalogue.map((fdp, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: TEXT, fontSize: 14 }}>{fdp.name}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{fdp.provider} &middot; {fdp.domain}</div>
              </div>
              <select
                value={priorityInput[fdp.name] || 'Medium'}
                onChange={e => setPriorityInput(p => ({ ...p, [fdp.name]: e.target.value }))}
                style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid #e2e8f0', fontSize: 13, color: TEXT, background: '#fff' }}
              >
                {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
              </select>
              <input
                type="text"
                placeholder="Notes (optional)"
                value={notesInput[fdp.name] || ''}
                onChange={e => setNotesInput(p => ({ ...p, [fdp.name]: e.target.value }))}
                style={{ width: 180, padding: '6px 10px', borderRadius: 7, border: '1px solid #e2e8f0', fontSize: 13, color: TEXT, boxSizing: 'border-box' }}
              />
              {isInWishlist(fdp.name)
                ? <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 700 }}>Added</span>
                : <button onClick={() => addToWishlist(fdp)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Add to Wishlist</button>
              }
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...card, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>My Wishlist</h3>
          <span style={{ background: ACCENT, color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{wishlist.length}</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['FDP Name', 'Provider', 'Domain', 'Priority', 'Notes', 'Action'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {wishlist.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: MUTED, fontSize: 14 }}>Your wishlist is empty. Add FDPs from the catalogue above.</td>
              </tr>
            )}
            {wishlist.map((w, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{w.name}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{w.provider}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{w.domain}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{
                    background: w.priority === 'High' ? '#fee2e2' : w.priority === 'Medium' ? '#fef3c7' : '#f1f5f9',
                    color: w.priority === 'High' ? '#ef4444' : w.priority === 'Medium' ? '#d97706' : MUTED,
                    borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700
                  }}>{w.priority}</span>
                </td>
                <td style={{ padding: '12px 14px', color: MUTED, fontSize: 13 }}>{w.notes || '—'}</td>
                <td style={{ padding: '12px 14px' }}>
                  <button onClick={() => remove(w.name)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
const contentMap = {
  'Pre-Proposal Willingness': PreProposalWillingness,
  'Pre-Proposal Requisition Form': PreProposalRequisitionForm,
  'FDP Wishlist': FDPWishlist,
}

export default function FacultyEventPreProposal() {
  const [activeNav, setActiveNav] = useState('Pre-Proposal Willingness')
  const ActiveComponent = contentMap[activeNav] || (() => <div style={{ color: MUTED }}>Coming soon.</div>)

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Events — Event Pre-Proposal</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Submit and manage event pre-proposals and FDP wishlist</p>
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
