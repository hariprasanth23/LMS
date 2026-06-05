import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['QCM View & Response']

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

const qcmItems = [
  { id: 'QCM-01', date: '2025-05-20', itemNo: '3', description: 'Review of CO-PO attainment levels for Sem 6 courses', category: 'Academic Quality', responseBy: '2025-05-30', status: 'Pending' },
  { id: 'QCM-02', date: '2025-05-20', itemNo: '5', description: 'Improvement plan for students with < 50% in mid-semester', category: 'Student Related', responseBy: '2025-05-30', status: 'Responded' },
  { id: 'QCM-03', date: '2025-03-15', itemNo: '2', description: 'Lab equipment maintenance schedule update', category: 'Infrastructure', responseBy: '2025-03-25', status: 'Closed' },
  { id: 'QCM-04', date: '2025-03-15', itemNo: '4', description: 'Standardize assessment rubrics across departments', category: 'Process', responseBy: '2025-03-25', status: 'Responded' },
  { id: 'QCM-05', date: '2025-01-10', itemNo: '1', description: 'Bridge course effectiveness analysis', category: 'Academic Quality', responseBy: '2025-01-20', status: 'Closed' },
]

const pastResponses = [
  { qcmId: 'QCM-05', date: '2025-01-18', stance: 'Agree', comment: 'Bridge course showed 15% improvement in results.', actionPlan: 'Continue with updated content.', timeline: '2025-06-30', evidence: 'bridge_report.pdf' },
  { qcmId: 'QCM-04', date: '2025-03-22', stance: 'Partially Agree', comment: 'Rubrics standardized for written exams; lab rubrics need revision.', actionPlan: 'Draft lab rubric template by April end.', timeline: '2025-04-30', evidence: null },
  { qcmId: 'QCM-02', date: '2025-05-28', stance: 'Agree', comment: 'Remedial sessions scheduled for low-performers.', actionPlan: 'Extra class every Saturday for identified students.', timeline: '2025-06-15', evidence: 'remedial_schedule.pdf' },
]

const meetingSummaries = [
  { date: '2025-05-20', chair: 'Dr. R. Meenakshisundaram', items: 6, attended: 14, nextMeeting: '2025-07-15' },
  { date: '2025-03-15', chair: 'Dr. R. Meenakshisundaram', items: 5, attended: 13, nextMeeting: '2025-05-20' },
  { date: '2025-01-10', chair: 'Prof. S. Vijayalakshmi', items: 4, attended: 11, nextMeeting: '2025-03-15' },
]

const statusBadge = (status) => {
  const map = {
    'Pending': { bg: '#fef9c3', color: '#854d0e' },
    'Responded': { bg: '#dbeafe', color: '#1d4ed8' },
    'Closed': { bg: '#dcfce7', color: '#16a34a' },
  }
  const s = map[status] || { bg: '#f1f5f9', color: MUTED }
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
      {status}
    </span>
  )
}

const categoryBadge = (cat) => {
  const map = {
    'Academic Quality': { bg: '#f5f3ff', color: '#7c3aed' },
    'Process': { bg: '#fef3c7', color: '#d97706' },
    'Infrastructure': { bg: '#fee2e2', color: '#dc2626' },
    'Student Related': { bg: '#dcfce7', color: '#16a34a' },
  }
  const s = map[cat] || { bg: '#f1f5f9', color: MUTED }
  return (
    <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>
      {cat}
    </span>
  )
}

// ─── QCM View & Response ───────────────────────────────────────────────────────
function QCMViewResponseSection() {
  const [selectedItem, setSelectedItem] = useState(null)
  const [responseForm, setResponseForm] = useState({ stance: '', comment: '', actionPlan: '', timeline: '', evidence: null })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitResponse = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setResponseForm({ stance: '', comment: '', actionPlan: '', timeline: '', evidence: null })
    setTimeout(() => { setSubmitted(false); setSelectedItem(null) }, 3000)
  }

  return (
    <div>
      {/* Meeting Summary Cards */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: '0 0 14px' }}>Meeting Summaries</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {meetingSummaries.map((m, i) => (
            <div key={i} style={{ ...card, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, marginBottom: 8 }}>QCM — {m.date}</div>
              <div style={{ fontSize: 13, color: TEXT, marginBottom: 4 }}>Chair: {m.chair}</div>
              <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: TEXT }}>{m.items}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>Items</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>{m.attended}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>Attended</div>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: MUTED }}>Next: {m.nextMeeting}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Items Table */}
      <div style={{ ...card, overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>
          QCM Action Items — Pending Response
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Meeting Date', 'Item No', 'Description', 'Category', 'Response By', 'Status', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {qcmItems.map((item, i) => (
              <tr key={i} style={{ background: selectedItem?.id === item.id ? '#f5f3ff' : 'transparent' }}>
                <td style={tdStyle}>{item.date}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>#{item.itemNo}</td>
                <td style={{ ...tdStyle, maxWidth: 260 }}>{item.description}</td>
                <td style={tdStyle}>{categoryBadge(item.category)}</td>
                <td style={tdStyle}>{item.responseBy}</td>
                <td style={tdStyle}>{statusBadge(item.status)}</td>
                <td style={tdStyle}>
                  {item.status === 'Pending' ? (
                    <button
                      onClick={() => setSelectedItem(item)}
                      style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >Respond</button>
                  ) : (
                    <button
                      onClick={() => setSelectedItem(item)}
                      style={{ background: '#f1f5f9', color: MUTED, border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >View</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Response Form */}
      {selectedItem && (
        <div style={{ ...card, padding: 28, marginBottom: 28, border: '1px solid #e0e7ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: TEXT }}>
                Response — Item #{selectedItem.itemNo} ({selectedItem.date})
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: MUTED }}>{selectedItem.description}</p>
            </div>
            <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MUTED }}>×</button>
          </div>

          {submitted && (
            <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
              Response submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmitResponse}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 10 }}>Stance *</label>
              <div style={{ display: 'flex', gap: 16 }}>
                {['Agree', 'Partially Agree', 'Disagree'].map(stance => (
                  <label key={stance} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: TEXT }}>
                    <input
                      type="radio" name="stance" value={stance}
                      checked={responseForm.stance === stance}
                      onChange={() => setResponseForm(p => ({ ...p, stance }))}
                      required
                    />
                    {stance}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Comments *</label>
                <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={responseForm.comment} onChange={e => setResponseForm(p => ({ ...p, comment: e.target.value }))} placeholder="Provide your observations and comments..." required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Action Plan *</label>
                <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={responseForm.actionPlan} onChange={e => setResponseForm(p => ({ ...p, actionPlan: e.target.value }))} placeholder="Describe the action plan you will implement..." required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Timeline</label>
                <input type="date" style={inputStyle} value={responseForm.timeline} onChange={e => setResponseForm(p => ({ ...p, timeline: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Evidence Upload</label>
                <input type="file" style={{ ...inputStyle, padding: '7px 12px' }} onChange={e => setResponseForm(p => ({ ...p, evidence: e.target.files[0] }))} />
              </div>
            </div>

            <button type="submit" style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Submit Response
            </button>
          </form>
        </div>
      )}

      {/* Response History */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>History of Past Responses</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['QCM Item', 'Response Date', 'Stance', 'Comments', 'Action Plan', 'Timeline', 'Evidence'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {pastResponses.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{r.qcmId}</td>
                <td style={tdStyle}>{r.date}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: r.stance === 'Agree' ? '#dcfce7' : r.stance === 'Disagree' ? '#fee2e2' : '#fef3c7',
                    color: r.stance === 'Agree' ? '#16a34a' : r.stance === 'Disagree' ? '#dc2626' : '#d97706',
                  }}>{r.stance}</span>
                </td>
                <td style={{ ...tdStyle, maxWidth: 200 }}>{r.comment}</td>
                <td style={{ ...tdStyle, maxWidth: 180 }}>{r.actionPlan}</td>
                <td style={tdStyle}>{r.timeline}</td>
                <td style={tdStyle}>
                  {r.evidence
                    ? <button style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Download</button>
                    : <span style={{ color: MUTED, fontSize: 12 }}>—</span>
                  }
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
export default function FacultyQCMeeting() {
  const [activeNav, setActiveNav] = useState('QCM View & Response')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Academics — QC Meeting</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Quality Circle Meeting views and responses</p>
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
          {activeNav === 'QCM View & Response' && <QCMViewResponseSection />}
        </div>
      </div>
    </div>
  )
}
