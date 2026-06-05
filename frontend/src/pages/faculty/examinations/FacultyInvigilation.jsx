import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['Duty Exchange', 'Duty View']

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

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const myDuties = [
  { id: 1, date: '2025-11-10', session: 'FN', time: '09:00 AM – 12:00 PM', venue: 'Exam Hall A', course: 'CS5101 — Machine Learning', room: 'Room 101', capacity: 40, coInvigilator: 'Dr. Priya Nair', upcoming: true },
  { id: 2, date: '2025-11-12', session: 'AN', time: '02:00 PM – 05:00 PM', venue: 'Exam Hall B', course: 'CS5102 — Compiler Design', room: 'Room 203', capacity: 35, coInvigilator: 'Dr. Karthik S', upcoming: true },
  { id: 3, date: '2025-11-14', session: 'FN', time: '09:00 AM – 12:00 PM', venue: 'Exam Hall C', course: 'CS5103 — Distributed Systems', room: 'Room 305', capacity: 42, coInvigilator: 'Dr. Ramesh Kumar', upcoming: true },
  { id: 4, date: '2025-10-20', session: 'FN', time: '09:00 AM – 12:00 PM', venue: 'Exam Hall A', course: 'CS4003 — Theory of Computation', room: 'Room 102', capacity: 38, coInvigilator: 'Dr. Anjali Menon', upcoming: false },
]

const facultyPool = [
  { id: 'F001', name: 'Dr. Ramesh Kumar', dept: 'Computer Science' },
  { id: 'F002', name: 'Dr. Priya Nair', dept: 'Computer Science' },
  { id: 'F003', name: 'Dr. Karthik Subramanian', dept: 'Computer Science' },
  { id: 'F004', name: 'Dr. Anjali Menon', dept: 'Electronics' },
  { id: 'F005', name: 'Dr. Suresh Babu', dept: 'Mathematics' },
  { id: 'F006', name: 'Dr. Meenakshi Rajan', dept: 'Physics' },
]

const incomingRequests = [
  { id: 1, from: 'Dr. Anjali Menon', date: '2025-11-16', session: 'AN', venue: 'Exam Hall D', course: 'MA4101 — Numerical Methods', room: 'Room 401', reason: 'Conference attendance on that date', status: 'Pending' },
  { id: 2, from: 'Dr. Suresh Babu', date: '2025-11-18', session: 'FN', venue: 'Exam Hall B', course: 'PH3101 — Quantum Mechanics', room: 'Room 205', reason: 'Medical appointment', status: 'Pending' },
]

// ─── Duty Exchange Section ─────────────────────────────────────────────────────
function DutyExchangeSection() {
  const [selectedDutyId, setSelectedDutyId] = useState('')
  const [facultySearch, setFacultySearch] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState(null)
  const [reason, setReason] = useState('')
  const [requestSent, setRequestSent] = useState(false)
  const [requestStatuses, setRequestStatuses] = useState(
    incomingRequests.reduce((acc, r) => ({ ...acc, [r.id]: r.status }), {})
  )

  const upcomingDuties = myDuties.filter(d => d.upcoming)
  const selectedDuty = myDuties.find(d => d.id === parseInt(selectedDutyId))

  const filteredFaculty = facultyPool.filter(f =>
    facultySearch.trim() === '' ? true :
    f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
    f.dept.toLowerCase().includes(facultySearch.toLowerCase())
  )

  const handleSendRequest = (e) => {
    e.preventDefault()
    setRequestSent(true)
    setSelectedDutyId('')
    setSelectedFaculty(null)
    setReason('')
    setFacultySearch('')
    setTimeout(() => setRequestSent(false), 4000)
  }

  const handleAction = (id, action) => {
    setRequestStatuses(prev => ({ ...prev, [id]: action === 'accept' ? 'Accepted' : 'Rejected' }))
  }

  return (
    <div>
      {/* Send Exchange Request */}
      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: TEXT }}>Request Duty Exchange</h3>
        {requestSent && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
            Exchange request sent successfully!
          </div>
        )}

        {/* My Upcoming Duties */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 10 }}>My Upcoming Duties</div>
          <div style={{ ...card, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>{['Select', 'Date', 'Session', 'Time', 'Course', 'Venue'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {upcomingDuties.map((d, i) => (
                  <tr key={d.id} style={{ background: selectedDutyId === String(d.id) ? '#eef2ff' : 'transparent' }}>
                    <td style={tdStyle}>
                      <input
                        type="radio" name="duty" value={d.id}
                        checked={selectedDutyId === String(d.id)}
                        onChange={() => setSelectedDutyId(String(d.id))}
                        style={{ accentColor: ACCENT }}
                      />
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{d.date}</td>
                    <td style={tdStyle}>
                      <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: d.session === 'FN' ? '#dbeafe' : '#fef9c3', color: d.session === 'FN' ? '#1d4ed8' : '#854d0e' }}>
                        {d.session}
                      </span>
                    </td>
                    <td style={tdStyle}>{d.time}</td>
                    <td style={tdStyle}>{d.course}</td>
                    <td style={tdStyle}>{d.venue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedDuty && (
          <form onSubmit={handleSendRequest}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {/* Faculty Search */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Search Faculty to Exchange With *</label>
                <input
                  style={inputStyle} value={facultySearch}
                  onChange={e => { setFacultySearch(e.target.value); setSelectedFaculty(null) }}
                  placeholder="Search by name or department..."
                />
                {facultySearch && !selectedFaculty && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, marginTop: 4, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', maxHeight: 200, overflowY: 'auto' }}>
                    {filteredFaculty.length === 0
                      ? <div style={{ padding: '12px 16px', fontSize: 13, color: MUTED }}>No faculty found</div>
                      : filteredFaculty.map(f => (
                        <div key={f.id}
                          onClick={() => { setSelectedFaculty(f); setFacultySearch(f.name) }}
                          style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: 14 }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                        >
                          <span style={{ fontWeight: 600, color: TEXT }}>{f.name}</span>
                          <span style={{ fontSize: 12, color: MUTED, marginLeft: 10 }}>{f.dept}</span>
                        </div>
                      ))
                    }
                  </div>
                )}
                {selectedFaculty && (
                  <div style={{ marginTop: 8, padding: '8px 14px', background: '#eef2ff', borderRadius: 8, fontSize: 13, color: ACCENT, fontWeight: 600 }}>
                    Selected: {selectedFaculty.name} ({selectedFaculty.dept})
                  </div>
                )}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Reason for Exchange *</label>
                <textarea
                  rows={3} required
                  style={{ ...inputStyle, resize: 'vertical' }}
                  value={reason} onChange={e => setReason(e.target.value)}
                  placeholder="Reason for requesting duty exchange..."
                />
              </div>
            </div>

            {/* Summary */}
            <div style={{ marginTop: 16, padding: '14px 18px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, color: TEXT }}>
              <strong>Exchange Summary:</strong> Duty on <strong>{selectedDuty.date}</strong> ({selectedDuty.session}, {selectedDuty.venue})
              {selectedFaculty && <> → Request to <strong>{selectedFaculty.name}</strong></>}
            </div>

            <button
              type="submit"
              disabled={!selectedFaculty || !reason.trim()}
              style={{
                marginTop: 16, background: selectedFaculty && reason.trim() ? ACCENT : '#e2e8f0',
                color: selectedFaculty && reason.trim() ? '#fff' : MUTED,
                border: 'none', borderRadius: 8, padding: '10px 28px',
                fontSize: 14, fontWeight: 600,
                cursor: selectedFaculty && reason.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Send Exchange Request
            </button>
          </form>
        )}
      </div>

      {/* Incoming Requests */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>
          Incoming Exchange Requests
          <span style={{ marginLeft: 10, fontSize: 12, background: '#fee2e2', color: '#dc2626', padding: '2px 10px', borderRadius: 20, fontWeight: 700 }}>
            {Object.values(requestStatuses).filter(s => s === 'Pending').length} Pending
          </span>
        </div>
        {incomingRequests.length === 0
          ? <div style={{ padding: '28px 20px', textAlign: 'center', color: MUTED, fontSize: 14 }}>No incoming exchange requests.</div>
          : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>{['From', 'Date', 'Session', 'Course', 'Venue', 'Reason', 'Status', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {incomingRequests.map((r) => {
                  const status = requestStatuses[r.id]
                  return (
                    <tr key={r.id}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{r.from}</td>
                      <td style={tdStyle}>{r.date}</td>
                      <td style={tdStyle}>
                        <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: r.session === 'FN' ? '#dbeafe' : '#fef9c3', color: r.session === 'FN' ? '#1d4ed8' : '#854d0e' }}>
                          {r.session}
                        </span>
                      </td>
                      <td style={tdStyle}>{r.course}</td>
                      <td style={tdStyle}>{r.venue} · {r.room}</td>
                      <td style={{ ...tdStyle, color: MUTED, maxWidth: 180 }}>{r.reason}</td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: status === 'Pending' ? '#fef3c7' : status === 'Accepted' ? '#dcfce7' : '#fee2e2',
                          color: status === 'Pending' ? '#d97706' : status === 'Accepted' ? '#16a34a' : '#dc2626',
                        }}>
                          {status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {status === 'Pending'
                          ? (
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                onClick={() => handleAction(r.id, 'accept')}
                                style={{ background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                              >Accept</button>
                              <button
                                onClick={() => handleAction(r.id, 'reject')}
                                style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                              >Reject</button>
                            </div>
                          )
                          : <span style={{ fontSize: 13, color: MUTED }}>—</span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        }
      </div>
    </div>
  )
}

// ─── Duty View Section ─────────────────────────────────────────────────────────
function DutyViewSection() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? myDuties : filter === 'Upcoming' ? myDuties.filter(d => d.upcoming) : myDuties.filter(d => !d.upcoming)

  return (
    <div>
      <div style={{ ...card, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>Show:</span>
          {['All', 'Upcoming', 'Completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '7px 18px', borderRadius: 20, border: '1px solid', cursor: 'pointer',
                borderColor: filter === f ? ACCENT : '#e2e8f0',
                background: filter === f ? '#eef2ff' : '#fff',
                color: filter === f ? ACCENT : MUTED,
                fontWeight: filter === f ? 700 : 400, fontSize: 13,
              }}
            >{f}</button>
          ))}
        </div>
        <button
          onClick={() => window.print()}
          style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          Print Schedule
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Duties', value: myDuties.length, color: ACCENT },
          { label: 'Upcoming', value: myDuties.filter(d => d.upcoming).length, color: '#16a34a' },
          { label: 'Completed', value: myDuties.filter(d => !d.upcoming).length, color: MUTED },
        ].map((s, i) => (
          <div key={i} style={{ ...card, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: MUTED }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Schedule Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>
          Invigilation Schedule — {filter} Duties
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Date', 'Session', 'Time', 'Course', 'Venue', 'Room', 'Capacity', 'Co-Invigilator', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={d.id} style={{ background: d.upcoming ? '#fffbeb' : 'transparent' }}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{d.date}</td>
                <td style={tdStyle}>
                  <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: d.session === 'FN' ? '#dbeafe' : '#fef9c3', color: d.session === 'FN' ? '#1d4ed8' : '#854d0e' }}>
                    {d.session}
                  </span>
                </td>
                <td style={tdStyle}>{d.time}</td>
                <td style={tdStyle}>{d.course}</td>
                <td style={tdStyle}>{d.venue}</td>
                <td style={tdStyle}>{d.room}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{d.capacity}</td>
                <td style={tdStyle}>{d.coInvigilator}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: d.upcoming ? '#fef3c7' : '#dcfce7',
                    color: d.upcoming ? '#d97706' : '#16a34a',
                  }}>
                    {d.upcoming ? 'Upcoming' : 'Completed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '10px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: 12, color: MUTED }}>
          Rows highlighted in yellow indicate upcoming duties.
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyInvigilation() {
  const [activeNav, setActiveNav] = useState('Duty Exchange')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Examinations — Invigilation</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Manage invigilation duties and exchange requests</p>
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
          {activeNav === 'Duty Exchange' && <DutyExchangeSection />}
          {activeNav === 'Duty View' && <DutyViewSection />}
        </div>
      </div>
    </div>
  )
}
