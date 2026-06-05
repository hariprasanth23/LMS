import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = [
  'Club/Chapter Enrollment View',
  'Event Registration',
  'Event Requisition',
  'Event Attendance',
  'Event Approval',
  'Event Achievers',
  'Add Board Members',
  'Event Summary Report',
  'Event Reports',
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

// ─── Club/Chapter Enrollment View ─────────────────────────────────────────────
const enrolledStudents = [
  { student: 'Arun Kumar', rollNo: 'CS21001', club: 'Robotics Club', enrollDate: '2024-06-01', status: 'Active' },
  { student: 'Priya Devi', rollNo: 'CS21002', club: 'Coding Club', enrollDate: '2024-06-05', status: 'Active' },
  { student: 'Ramesh S', rollNo: 'IT21005', club: 'Robotics Club', enrollDate: '2024-06-08', status: 'Active' },
  { student: 'Meena R', rollNo: 'CS21010', club: 'Photography Club', enrollDate: '2024-05-20', status: 'Inactive' },
  { student: 'Karthik P', rollNo: 'EC21003', club: 'Coding Club', enrollDate: '2024-06-10', status: 'Active' },
  { student: 'Lakshmi V', rollNo: 'CS21015', club: 'Photography Club', enrollDate: '2024-05-28', status: 'Active' },
]

const clubs = ['All', 'Robotics Club', 'Coding Club', 'Photography Club']

function ClubEnrollmentView() {
  const [clubFilter, setClubFilter] = useState('All')

  const filtered = enrolledStudents.filter(s => clubFilter === 'All' || s.club === clubFilter)

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Club/Chapter Enrollment View</h2>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 20 }}>
        <div style={{ width: 260 }}>
          <FormField label="Filter by Club / Chapter">
            <select value={clubFilter} onChange={e => setClubFilter(e.target.value)} style={inputStyle}>
              {clubs.map(c => <option key={c}>{c}</option>)}
            </select>
          </FormField>
        </div>
        <div style={{ fontSize: 13, color: MUTED, paddingBottom: 10 }}>{filtered.length} student(s) found</div>
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Student Name', 'Roll No', 'Club / Chapter', 'Enrollment Date', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{s.student}</td>
                <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{s.rollNo}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{s.club}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{s.enrollDate}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ background: s.status === 'Active' ? '#dcfce7' : '#f1f5f9', color: s.status === 'Active' ? '#16a34a' : MUTED, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{s.status}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: MUTED, fontSize: 14 }}>No students found for the selected club.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Event Registration ────────────────────────────────────────────────────────
const swEvents = [
  { id: 1, name: 'Inter-Club Hackathon 2024', club: 'Coding Club', type: 'Competition', date: '2024-07-20', venue: 'Main Auditorium', seats: 12 },
  { id: 2, name: 'Annual Photography Exhibition', club: 'Photography Club', type: 'Exhibition', date: '2024-08-05', venue: 'Gallery Hall', seats: 20 },
  { id: 3, name: 'Robotics Workshop', club: 'Robotics Club', type: 'Workshop', date: '2024-08-15', venue: 'Lab 301', seats: 5 },
  { id: 4, name: 'Cultural Fest — Spandan', club: 'Cultural Club', type: 'Fest', date: '2024-09-01', venue: 'Open Air Theatre', seats: 50 },
]

const myRegistrations = [
  { name: 'CodeSprint 2024', club: 'Coding Club', date: '2024-05-18', status: 'Completed' },
  { name: 'Robo Race Qualifier', club: 'Robotics Club', date: '2024-06-10', status: 'Registered' },
]

function EventRegistration() {
  const [registered, setRegistered] = useState({})

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Event Registration</h2>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Available SW Events</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {swEvents.map(ev => (
            <div key={ev.id} style={{ ...card, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, color: TEXT, fontSize: 14, flex: 1, lineHeight: 1.4 }}>{ev.name}</div>
                <span style={{ background: '#eef2ff', color: ACCENT, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 600, marginLeft: 10, flexShrink: 0 }}>{ev.type}</span>
              </div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 3 }}>Club: <span style={{ color: TEXT, fontWeight: 600 }}>{ev.club}</span></div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 3 }}>Date: {ev.date}</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>Venue: {ev.venue} &nbsp;&middot;&nbsp; Seats Left: <span style={{ color: ev.seats > 10 ? '#16a34a' : '#ef4444', fontWeight: 700 }}>{ev.seats}</span></div>
              {registered[ev.id]
                ? <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 6, padding: '5px 14px', fontSize: 13, fontWeight: 700 }}>Registered</span>
                : <button onClick={() => setRegistered(p => ({ ...p, [ev.id]: true }))} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Register</button>
              }
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>My Registrations</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Event Name', 'Club', 'Date', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myRegistrations.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{r.name}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{r.club}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{r.date}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ background: r.status === 'Completed' ? '#dcfce7' : '#eef2ff', color: r.status === 'Completed' ? '#16a34a' : ACCENT, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Event Requisition ─────────────────────────────────────────────────────────
const requisitionHistory = [
  { name: 'Annual Tech Fest', club: 'Coding Club', type: 'Fest', date: '2024-09-10', status: 'Approved' },
  { name: 'Industry Visit — Infosys', club: 'Placement Cell', type: 'Visit', date: '2024-08-20', status: 'Pending' },
]

function EventRequisition() {
  const [form, setForm] = useState({ name: '', club: 'Coding Club', type: 'Workshop', date: '', venue: '', budget: '', objectives: '' })
  const [submitted, setSubmitted] = useState(false)
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Event Requisition</h2>
      {submitted && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          Event requisition submitted successfully!
        </div>
      )}
      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>New Event Requisition</h3>
        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 4000) }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="Event Name">
                <input type="text" value={form.name} onChange={set('name')} required placeholder="Enter event name" style={inputStyle} />
              </FormField>
            </div>
            <FormField label="Club / Chapter">
              <select value={form.club} onChange={set('club')} style={inputStyle}>
                {['Coding Club', 'Robotics Club', 'Photography Club', 'Cultural Club', 'Literary Club'].map(c => <option key={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Event Type">
              <select value={form.type} onChange={set('type')} style={inputStyle}>
                {['Workshop', 'Seminar', 'Competition', 'Fest', 'Exhibition', 'Industry Visit', 'Guest Lecture'].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Proposed Date">
              <input type="date" value={form.date} onChange={set('date')} required style={inputStyle} />
            </FormField>
            <FormField label="Venue">
              <input type="text" value={form.venue} onChange={set('venue')} required placeholder="e.g. Main Auditorium" style={inputStyle} />
            </FormField>
            <FormField label="Budget Estimate (INR)">
              <input type="number" min={0} value={form.budget} onChange={set('budget')} required placeholder="e.g. 15000" style={inputStyle} />
            </FormField>
            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="Objectives / Description">
                <textarea value={form.objectives} onChange={set('objectives')} required rows={3} placeholder="Describe the objectives and expected outcomes..." style={{ ...inputStyle, resize: 'vertical' }} />
              </FormField>
            </div>
          </div>
          <button type="submit" style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Submit Requisition</button>
        </form>
      </div>
      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Requisition History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Event Name', 'Club', 'Type', 'Date', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requisitionHistory.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{r.name}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{r.club}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{r.type}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{r.date}</td>
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

// ─── Event Attendance ──────────────────────────────────────────────────────────
const attendanceEvents = ['Inter-Club Hackathon 2024', 'Annual Photography Exhibition', 'Robotics Workshop']

const studentLists = {
  'Inter-Club Hackathon 2024': [
    { rollNo: 'CS21001', name: 'Arun Kumar' },
    { rollNo: 'CS21002', name: 'Priya Devi' },
    { rollNo: 'IT21005', name: 'Ramesh S' },
    { rollNo: 'EC21003', name: 'Karthik P' },
    { rollNo: 'CS21010', name: 'Meena R' },
  ],
  'Annual Photography Exhibition': [
    { rollNo: 'CS21015', name: 'Lakshmi V' },
    { rollNo: 'CS21010', name: 'Meena R' },
    { rollNo: 'IT21008', name: 'Suresh T' },
  ],
  'Robotics Workshop': [
    { rollNo: 'CS21001', name: 'Arun Kumar' },
    { rollNo: 'EC21003', name: 'Karthik P' },
  ],
}

function EventAttendance() {
  const [selectedEvent, setSelectedEvent] = useState(attendanceEvents[0])
  const [present, setPresent] = useState({})

  const students = studentLists[selectedEvent] || []
  const presentCount = Object.values(present).filter(Boolean).length
  const totalCount = students.length

  const toggleAll = (val) => {
    const updated = {}
    students.forEach(s => { updated[s.rollNo] = val })
    setPresent(updated)
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Event Attendance</h2>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <FormField label="Select Event">
            <select value={selectedEvent} onChange={e => { setSelectedEvent(e.target.value); setPresent({}) }} style={inputStyle}>
              {attendanceEvents.map(ev => <option key={ev}>{ev}</option>)}
            </select>
          </FormField>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', paddingBottom: 2 }}>
            <div style={{ ...card, padding: '12px 18px', textAlign: 'center', flex: 1, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: ACCENT }}>{presentCount}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Present</div>
            </div>
            <div style={{ ...card, padding: '12px 18px', textAlign: 'center', flex: 1, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#ef4444' }}>{totalCount - presentCount}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Absent</div>
            </div>
            <div style={{ ...card, padding: '12px 18px', textAlign: 'center', flex: 1, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: TEXT }}>{totalCount}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Total</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <button onClick={() => toggleAll(true)} style={{ background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Mark All Present</button>
          <button onClick={() => toggleAll(false)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Mark All Absent</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {students.map(s => (
            <label key={s.rollNo} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 8, background: present[s.rollNo] ? '#dcfce7' : '#f8fafc', border: `1px solid ${present[s.rollNo] ? '#86efac' : '#e2e8f0'}`, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!!present[s.rollNo]}
                onChange={e => setPresent(p => ({ ...p, [s.rollNo]: e.target.checked }))}
                style={{ accentColor: ACCENT, width: 16, height: 16 }}
              />
              <span style={{ fontWeight: 600, color: ACCENT, fontSize: 13, minWidth: 80 }}>{s.rollNo}</span>
              <span style={{ fontSize: 14, color: TEXT, flex: 1 }}>{s.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: present[s.rollNo] ? '#16a34a' : MUTED }}>{present[s.rollNo] ? 'Present' : 'Absent'}</span>
            </label>
          ))}
        </div>
        <button style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save Attendance</button>
      </div>
    </div>
  )
}

// ─── Event Approval ────────────────────────────────────────────────────────────
const pendingApprovals = [
  { id: 1, name: 'Annual Tech Fest', club: 'Coding Club', type: 'Fest', date: '2024-09-10', budget: 35000, submittedBy: 'Student Coordinator', status: 'Pending' },
  { id: 2, name: 'Photography Walk', club: 'Photography Club', type: 'Activity', date: '2024-08-18', budget: 5000, submittedBy: 'Club Secretary', status: 'Pending' },
  { id: 3, name: 'Industry Visit — TCS', club: 'Placement Cell', type: 'Visit', date: '2024-08-25', budget: 12000, submittedBy: 'Placement Coordinator', status: 'Under Review' },
]

function EventApproval() {
  const [expanded, setExpanded] = useState(null)
  const [comments, setComments] = useState({})
  const [statuses, setStatuses] = useState({})

  const take = (id, action) => {
    setStatuses(p => ({ ...p, [id]: action }))
    setExpanded(null)
  }

  const statusColors = { Approved: { bg: '#dcfce7', color: '#16a34a' }, Rejected: { bg: '#fee2e2', color: '#ef4444' }, 'Under Review': { bg: '#fef3c7', color: '#d97706' }, Pending: { bg: '#fef3c7', color: '#d97706' } }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Event Approval</h2>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Event Name', 'Club', 'Type', 'Date', 'Budget (INR)', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pendingApprovals.map((ev, i) => {
              const currentStatus = statuses[ev.id] || ev.status
              const sc = statusColors[currentStatus] || statusColors['Pending']
              return (
                <React.Fragment key={ev.id}>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', background: expanded === ev.id ? '#eef2ff' : i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{ev.name}</td>
                    <td style={{ padding: '12px 14px', color: MUTED }}>{ev.club}</td>
                    <td style={{ padding: '12px 14px', color: TEXT }}>{ev.type}</td>
                    <td style={{ padding: '12px 14px', color: MUTED }}>{ev.date}</td>
                    <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>₹{ev.budget.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: sc.bg, color: sc.color, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{currentStatus}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {!statuses[ev.id] && (
                        <button onClick={() => setExpanded(expanded === ev.id ? null : ev.id)} style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Review</button>
                      )}
                    </td>
                  </tr>
                  {expanded === ev.id && (
                    <tr style={{ background: '#f8fafc' }}>
                      <td colSpan={7} style={{ padding: '20px 24px', borderBottom: '2px solid #e2e8f0' }}>
                        <div style={{ fontSize: 14, color: MUTED, marginBottom: 12 }}>Submitted by: <span style={{ fontWeight: 600, color: TEXT }}>{ev.submittedBy}</span></div>
                        <div style={{ marginBottom: 12 }}>
                          <label style={labelStyle}>Comments / Remarks</label>
                          <textarea
                            value={comments[ev.id] || ''}
                            onChange={e => setComments(c => ({ ...c, [ev.id]: e.target.value }))}
                            rows={2}
                            placeholder="Add comments before approving or rejecting..."
                            style={{ ...inputStyle, resize: 'vertical' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button onClick={() => take(ev.id, 'Approved')} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                          <button onClick={() => take(ev.id, 'Rejected')} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                          <button onClick={() => take(ev.id, 'Under Review')} style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Request Modification</button>
                          <button onClick={() => setExpanded(null)} style={{ background: '#f1f5f9', color: MUTED, border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
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
    </div>
  )
}

// ─── Event Achievers ───────────────────────────────────────────────────────────
const achieversList = [
  { event: 'CodeSprint 2024', student: 'Arun Kumar', rollNo: 'CS21001', achievement: '1st Place', award: 'Gold Medal', date: '2024-05-18' },
  { event: 'Robo Race', student: 'Karthik P', rollNo: 'EC21003', achievement: '2nd Place', award: 'Silver Medal', date: '2024-06-10' },
]

function EventAchievers() {
  const [form, setForm] = useState({ event: '', studentSearch: '', studentName: '', rollNo: '', achievement: '', award: 'Certificate of Excellence', date: '' })
  const [achievers, setAchievers] = useState(achieversList)
  const [submitted, setSubmitted] = useState(false)
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    setAchievers(p => [...p, { event: form.event, student: form.studentName, rollNo: form.rollNo, achievement: form.achievement, award: form.award, date: form.date }])
    setSubmitted(true)
    setForm({ event: '', studentSearch: '', studentName: '', rollNo: '', achievement: '', award: 'Certificate of Excellence', date: '' })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Event Achievers</h2>
      {submitted && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          Achievement logged successfully!
        </div>
      )}
      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>Log New Achievement</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <FormField label="Event">
              <input type="text" value={form.event} onChange={set('event')} required placeholder="Event name" style={inputStyle} />
            </FormField>
            <FormField label="Award Type">
              <select value={form.award} onChange={set('award')} style={inputStyle}>
                {['Certificate of Excellence', 'Gold Medal', 'Silver Medal', 'Bronze Medal', 'Best Performer', 'Special Recognition'].map(a => <option key={a}>{a}</option>)}
              </select>
            </FormField>
            <FormField label="Student Name">
              <input type="text" value={form.studentName} onChange={set('studentName')} required placeholder="Search and enter student name" style={inputStyle} />
            </FormField>
            <FormField label="Roll Number">
              <input type="text" value={form.rollNo} onChange={set('rollNo')} required placeholder="e.g. CS21001" style={inputStyle} />
            </FormField>
            <FormField label="Achievement / Position">
              <input type="text" value={form.achievement} onChange={set('achievement')} required placeholder="e.g. 1st Place, Best Paper" style={inputStyle} />
            </FormField>
            <FormField label="Date">
              <input type="date" value={form.date} onChange={set('date')} required style={inputStyle} />
            </FormField>
          </div>
          <button type="submit" style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Log Achievement</button>
        </form>
      </div>
      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Achievers Record</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Event', 'Student', 'Roll No', 'Achievement', 'Award', 'Date'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {achievers.map((a, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{a.event}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{a.student}</td>
                <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{a.rollNo}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{a.achievement}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ background: '#fef3c7', color: '#d97706', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{a.award}</span>
                </td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{a.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Add Board Members ─────────────────────────────────────────────────────────
const clubBoards = {
  'Coding Club': [
    { rollNo: 'CS21001', name: 'Arun Kumar', position: 'President', term: '2024–2025' },
    { rollNo: 'CS21002', name: 'Priya Devi', position: 'Secretary', term: '2024–2025' },
  ],
  'Robotics Club': [
    { rollNo: 'EC21003', name: 'Karthik P', position: 'President', term: '2024–2025' },
  ],
  'Photography Club': [
    { rollNo: 'CS21015', name: 'Lakshmi V', position: 'Coordinator', term: '2024–2025' },
  ],
}

function AddBoardMembers() {
  const [selectedClub, setSelectedClub] = useState('Coding Club')
  const [boards, setBoards] = useState(clubBoards)
  const [addMode, setAddMode] = useState(false)
  const [newMember, setNewMember] = useState({ rollNo: '', name: '', position: '', term: '' })

  const currentBoard = boards[selectedClub] || []

  const handleAdd = () => {
    if (newMember.rollNo && newMember.name && newMember.position) {
      setBoards(p => ({ ...p, [selectedClub]: [...(p[selectedClub] || []), newMember] }))
      setNewMember({ rollNo: '', name: '', position: '', term: '' })
      setAddMode(false)
    }
  }

  const handleRemove = (rollNo) => {
    setBoards(p => ({ ...p, [selectedClub]: p[selectedClub].filter(m => m.rollNo !== rollNo) }))
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Add Board Members</h2>
      <div style={{ ...card, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, gap: 16 }}>
          <div style={{ width: 260 }}>
            <FormField label="Select Club / Chapter">
              <select value={selectedClub} onChange={e => { setSelectedClub(e.target.value); setAddMode(false) }} style={inputStyle}>
                {Object.keys(clubBoards).map(c => <option key={c}>{c}</option>)}
              </select>
            </FormField>
          </div>
          <button onClick={() => setAddMode(true)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Add Member</button>
        </div>

        {addMode && (
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 20, border: '1px solid #e2e8f0', marginBottom: 20 }}>
            <div style={{ fontWeight: 700, color: TEXT, fontSize: 14, marginBottom: 14 }}>New Board Member</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              {[['Roll Number', 'rollNo'], ['Full Name', 'name'], ['Position', 'position'], ['Term', 'term']].map(([label, field]) => (
                <FormField key={field} label={label}>
                  <input type="text" value={newMember[field]} onChange={e => setNewMember(p => ({ ...p, [field]: e.target.value }))} placeholder={label} style={inputStyle} />
                </FormField>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button onClick={handleAdd} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add</button>
              <button onClick={() => setAddMode(false)} style={{ background: '#f1f5f9', color: MUTED, border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ fontWeight: 700, color: TEXT, fontSize: 14, marginBottom: 12 }}>Current Board — <span style={{ color: ACCENT }}>{selectedClub}</span></div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Roll No', 'Name', 'Position', 'Term', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentBoard.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: MUTED, fontSize: 14 }}>No board members added yet.</td>
              </tr>
            )}
            {currentBoard.map((m, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{m.rollNo}</td>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{m.name}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{m.position}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{m.term}</td>
                <td style={{ padding: '12px 14px' }}>
                  <button onClick={() => handleRemove(m.rollNo)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Event Summary Report ──────────────────────────────────────────────────────
const summaryData = {
  'Inter-Club Hackathon 2024': { attendance: 48, registered: 55, budget: 30000, spent: 28500, highlights: ['32 projects submitted', 'Best project award won by CS team', 'Industry judges from 3 companies participated'], date: '2024-07-20', club: 'Coding Club' },
  'Annual Photography Exhibition': { attendance: 120, registered: 130, budget: 10000, spent: 9200, highlights: ['45 photographs displayed', 'Guest photographer from National Geographic', '3 students won state-level recognition'], date: '2024-08-05', club: 'Photography Club' },
  'Robotics Workshop': { attendance: 22, registered: 25, budget: 15000, spent: 13800, highlights: ['Students built 8 working prototypes', 'Sponsored by local tech company', 'Live demo of autonomous robot'], date: '2024-08-15', club: 'Robotics Club' },
}

function EventSummaryReport() {
  const [selectedEvent, setSelectedEvent] = useState(Object.keys(summaryData)[0])
  const data = summaryData[selectedEvent]

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Event Summary Report</h2>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 24 }}>
        <div style={{ width: 340 }}>
          <FormField label="Select Event">
            <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} style={inputStyle}>
              {Object.keys(summaryData).map(ev => <option key={ev}>{ev}</option>)}
            </select>
          </FormField>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Attendance', value: data.attendance, color: ACCENT },
          { label: 'Registered', value: data.registered, color: '#7c3aed' },
          { label: 'Budget (INR)', value: `₹${data.budget.toLocaleString()}`, color: '#d97706' },
          { label: 'Spent (INR)', value: `₹${data.spent.toLocaleString()}`, color: '#16a34a' },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[['Event', selectedEvent], ['Club', data.club], ['Date', data.date], ['Attendance Rate', `${Math.round((data.attendance / data.registered) * 100)}%`]].map(([k, v]) => (
            <div key={k} style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontWeight: 700, color: TEXT, fontSize: 14, marginBottom: 10 }}>Event Highlights</div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {data.highlights.map((h, i) => (
            <li key={i} style={{ fontSize: 14, color: TEXT, lineHeight: 1.8 }}>{h}</li>
          ))}
        </ul>
        <button style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Download PDF Report</button>
      </div>
    </div>
  )
}

// ─── Event Reports ─────────────────────────────────────────────────────────────
const allEventsReport = [
  { name: 'CodeSprint 2024', club: 'Coding Club', type: 'Competition', date: '2024-05-18', attendance: 92, budget: 20000 },
  { name: 'Robo Race Qualifier', club: 'Robotics Club', type: 'Competition', date: '2024-06-10', attendance: 38, budget: 8000 },
  { name: 'Inter-Club Hackathon', club: 'Coding Club', type: 'Competition', date: '2024-07-20', attendance: 48, budget: 30000 },
  { name: 'Photography Exhibition', club: 'Photography Club', type: 'Exhibition', date: '2024-08-05', attendance: 120, budget: 10000 },
  { name: 'Robotics Workshop', club: 'Robotics Club', type: 'Workshop', date: '2024-08-15', attendance: 22, budget: 15000 },
  { name: 'Cultural Fest Spandan', club: 'Cultural Club', type: 'Fest', date: '2024-09-01', attendance: 380, budget: 75000 },
]

function EventReports() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [clubFilter, setClubFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  const clubOptions = ['All', ...Array.from(new Set(allEventsReport.map(e => e.club)))]
  const typeOptions = ['All', ...Array.from(new Set(allEventsReport.map(e => e.type)))]

  const filtered = allEventsReport.filter(ev => {
    const matchClub = clubFilter === 'All' || ev.club === clubFilter
    const matchType = typeFilter === 'All' || ev.type === typeFilter
    const matchFrom = !dateFrom || ev.date >= dateFrom
    const matchTo = !dateTo || ev.date <= dateTo
    return matchClub && matchType && matchFrom && matchTo
  })

  const totalAttendance = filtered.reduce((sum, e) => sum + e.attendance, 0)
  const totalBudget = filtered.reduce((sum, e) => sum + e.budget, 0)

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Event Reports</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
        <FormField label="From Date">
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
        </FormField>
        <FormField label="To Date">
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
        </FormField>
        <FormField label="Club">
          <select value={clubFilter} onChange={e => setClubFilter(e.target.value)} style={inputStyle}>
            {clubOptions.map(c => <option key={c}>{c}</option>)}
          </select>
        </FormField>
        <FormField label="Type">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={inputStyle}>
            {typeOptions.map(t => <option key={t}>{t}</option>)}
          </select>
        </FormField>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Events Found', value: filtered.length, color: ACCENT },
          { label: 'Total Attendance', value: totalAttendance, color: '#16a34a' },
          { label: 'Total Budget (INR)', value: `₹${totalBudget.toLocaleString()}`, color: '#d97706' },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Export CSV</button>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Event Name', 'Club', 'Type', 'Date', 'Attendance', 'Budget (INR)'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((ev, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{ev.name}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{ev.club}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{ev.type}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{ev.date}</td>
                <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 700 }}>{ev.attendance}</td>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>₹{ev.budget.toLocaleString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: MUTED, fontSize: 14 }}>No events match the selected filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
const contentMap = {
  'Club/Chapter Enrollment View': ClubEnrollmentView,
  'Event Registration': EventRegistration,
  'Event Requisition': EventRequisition,
  'Event Attendance': EventAttendance,
  'Event Approval': EventApproval,
  'Event Achievers': EventAchievers,
  'Add Board Members': AddBoardMembers,
  'Event Summary Report': EventSummaryReport,
  'Event Reports': EventReports,
}

export default function FacultySWEvents() {
  const [activeNav, setActiveNav] = useState('Club/Chapter Enrollment View')
  const ActiveComponent = contentMap[activeNav] || (() => <div style={{ color: MUTED }}>Coming soon.</div>)

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Events — SW Events</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Student welfare events, clubs and chapter management</p>
      </div>

      <div style={{ ...card, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: 210, borderRight: '1px solid #e2e8f0', padding: '16px 0', flexShrink: 0 }}>
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
