import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['Minutes View', 'Regulations View']

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

const minutesData = [
  { date: '2025-04-10', type: 'Academic Council', agenda: 'Curriculum revision for 2025-26', document: 'AC_April2025.pdf' },
  { date: '2025-03-05', type: 'Board of Studies', agenda: 'New elective course approval — AI & Ethics', document: 'BoS_March2025.pdf' },
  { date: '2025-02-18', type: 'Dept Council', agenda: 'Lab infrastructure planning', document: 'DC_Feb2025.pdf' },
  { date: '2024-12-12', type: 'Academic Council', agenda: 'Examination schedule finalization', document: 'AC_Dec2024.pdf' },
  { date: '2024-11-07', type: 'Board of Studies', agenda: 'Syllabus update for CS6001', document: 'BoS_Nov2024.pdf' },
  { date: '2024-09-20', type: 'Dept Council', agenda: 'Faculty workload distribution', document: 'DC_Sep2024.pdf' },
]

const meetingTypeBadge = (type) => {
  const map = {
    'Academic Council': { bg: '#dbeafe', color: '#1d4ed8' },
    'Board of Studies': { bg: '#dcfce7', color: '#16a34a' },
    'Dept Council': { bg: '#fef3c7', color: '#d97706' },
  }
  const s = map[type] || { bg: '#f1f5f9', color: MUTED }
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
      {type}
    </span>
  )
}

const regulationsData = [
  {
    title: 'Regulation 2021',
    rules: [
      'Credit-based semester system with 180 total credits for B.E./B.Tech.',
      'Minimum attendance of 75% required for exam eligibility.',
      'Continuous Assessment: 50 marks (internals) + 50 marks (end semester).',
      'Maximum of 2 arrear papers allowed for lateral promotion.',
      'Project work carries 12 credits in final year.',
    ],
    pdf: 'Regulation_2021.pdf',
  },
  {
    title: 'Regulation 2018',
    rules: [
      'Credit-based semester system with 160 total credits.',
      'Minimum attendance of 75%; condonation up to 65% with valid reason.',
      'Continuous Assessment: 40 marks internal + 60 marks end semester.',
      'Open electives compulsory from 5th semester.',
      'Industrial training of 4 weeks mandatory.',
    ],
    pdf: 'Regulation_2018.pdf',
  },
  {
    title: 'Regulation 2015',
    rules: [
      'Annual scheme converted to semester system.',
      'Total credits: 150 for B.E./B.Tech.',
      'Internal assessment: 20 marks per subject.',
      'End semester: 80 marks per subject.',
      'No backlog policy enforced for 3rd year promotion.',
    ],
    pdf: 'Regulation_2015.pdf',
  },
]

// ─── Minutes View ──────────────────────────────────────────────────────────────
function MinutesViewSection() {
  const [yearFilter, setYearFilter] = useState('All')
  const [noteForm, setNoteForm] = useState({ topic: '', date: '', description: '' })
  const [noteSent, setNoteSent] = useState(false)

  const years = ['All', '2025', '2024', '2023']
  const filtered = yearFilter === 'All' ? minutesData : minutesData.filter(m => m.date.startsWith(yearFilter))

  const handleNoteSubmit = (e) => {
    e.preventDefault()
    setNoteSent(true)
    setNoteForm({ topic: '', date: '', description: '' })
    setTimeout(() => setNoteSent(false), 3500)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Filter by Year:</span>
        {years.map(y => (
          <button key={y} onClick={() => setYearFilter(y)}
            style={{
              padding: '6px 16px', borderRadius: 8, border: '1px solid',
              borderColor: yearFilter === y ? ACCENT : '#e2e8f0',
              background: yearFilter === y ? '#eef2ff' : '#fff',
              color: yearFilter === y ? ACCENT : TEXT,
              fontSize: 13, fontWeight: yearFilter === y ? 700 : 400, cursor: 'pointer',
            }}
          >{y}</button>
        ))}
      </div>

      <div style={{ ...card, overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>
          Council Meeting Minutes Archive
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Meeting Date', 'Meeting Type', 'Agenda', 'Document'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={i}>
                <td style={tdStyle}>{m.date}</td>
                <td style={tdStyle}>{meetingTypeBadge(m.type)}</td>
                <td style={tdStyle}>{m.agenda}</td>
                <td style={tdStyle}>
                  <button style={{
                    background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac',
                    borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ ...card, padding: 28 }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Submit Agenda Note for Upcoming Meeting</h3>
        {noteSent && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
            Agenda note submitted successfully!
          </div>
        )}
        <form onSubmit={handleNoteSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Agenda Topic *</label>
              <input style={inputStyle} value={noteForm.topic} onChange={e => setNoteForm(p => ({ ...p, topic: e.target.value }))} placeholder="e.g. Syllabus revision proposal" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Proposed Meeting Date *</label>
              <input type="date" style={inputStyle} value={noteForm.date} onChange={e => setNoteForm(p => ({ ...p, date: e.target.value }))} required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Description</label>
              <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={noteForm.description} onChange={e => setNoteForm(p => ({ ...p, description: e.target.value }))} placeholder="Provide context or supporting details for this agenda item..." />
            </div>
          </div>
          <button type="submit" style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Submit Note
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Regulations View ──────────────────────────────────────────────────────────
function RegulationsViewSection() {
  const [openIndex, setOpenIndex] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = regulationsData.map(reg => ({
    ...reg,
    rules: search.trim() ? reg.rules.filter(r => r.toLowerCase().includes(search.toLowerCase())) : reg.rules,
  })).filter(reg => !search.trim() || reg.rules.length > 0 || reg.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <input
          style={{ ...inputStyle, maxWidth: 400 }}
          placeholder="Search within regulations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map((reg, i) => (
          <div key={i} style={{ ...card, overflow: 'hidden' }}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                width: '100%', padding: '16px 20px', background: openIndex === i ? '#f5f3ff' : '#fff',
                border: 'none', borderLeft: openIndex === i ? '3px solid #6366f1' : '3px solid transparent',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: openIndex === i ? ACCENT : TEXT }}>{reg.title}</span>
              <span style={{ fontSize: 18, color: MUTED, fontWeight: 300 }}>{openIndex === i ? '−' : '+'}</span>
            </button>
            {openIndex === i && (
              <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f1f5f9' }}>
                <ul style={{ margin: '16px 0 20px', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {reg.rules.map((rule, j) => (
                    <li key={j} style={{ fontSize: 14, color: TEXT, lineHeight: 1.6 }}>{rule}</li>
                  ))}
                </ul>
                <button style={{
                  background: ACCENT, color: '#fff', border: 'none', borderRadius: 8,
                  padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                  Download Full PDF — {reg.pdf}
                </button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ ...card, padding: 32, textAlign: 'center', color: MUTED, fontSize: 14 }}>
            No regulations match your search.
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyCouncil() {
  const [activeNav, setActiveNav] = useState('Minutes View')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Academics — Council</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>School/department council minutes and regulations</p>
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
          {activeNav === 'Minutes View' && <MinutesViewSection />}
          {activeNav === 'Regulations View' && <RegulationsViewSection />}
        </div>
      </div>
    </div>
  )
}
