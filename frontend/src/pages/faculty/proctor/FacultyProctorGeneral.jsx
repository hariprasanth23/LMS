import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = [
  'Proctee Dashboard',
  'No Dues Form - Proctor Approvals',
  'Leave Approval',
  'Edit Student Contact Details',
  'Proctee Message',
  'Hostel Attendance',
  'Late Hour Request',
  'Hostel Vacating Proctor Approvals',
]

// ─── Proctee Dashboard ────────────────────────────────────────────────────────
const proctees = [
  { roll: 'CB22CS001', name: 'Arun Kumar', dept: 'CSE', sem: 6, attendance: 82, gpa: 8.4, type: 'Hostel' },
  { roll: 'CB22CS002', name: 'Priya Nair', dept: 'CSE', sem: 6, attendance: 91, gpa: 9.1, type: 'Day' },
  { roll: 'CB22CS003', name: 'Rahul Verma', dept: 'CSE', sem: 6, attendance: 68, gpa: 7.2, type: 'Hostel' },
  { roll: 'CB22ME004', name: 'Sneha Rajan', dept: 'MECH', sem: 4, attendance: 79, gpa: 8.0, type: 'Hostel' },
  { roll: 'CB22ME005', name: 'Karthik Raj', dept: 'MECH', sem: 4, attendance: 55, gpa: 6.8, type: 'Day' },
  { roll: 'CB22EE006', name: 'Divya Mohan', dept: 'EEE', sem: 2, attendance: 88, gpa: 8.7, type: 'Day' },
  { roll: 'CB22EE007', name: 'Arjun Singh', dept: 'EEE', sem: 2, attendance: 95, gpa: 9.5, type: 'Hostel' },
  { roll: 'CB22IT008', name: 'Lakshmi Devi', dept: 'IT', sem: 6, attendance: 74, gpa: 7.8, type: 'Hostel' },
  { roll: 'CB22IT009', name: 'Suresh Kumar', dept: 'IT', sem: 6, attendance: 83, gpa: 8.2, type: 'Day' },
  { roll: 'CB22EC010', name: 'Meera Pillai', dept: 'ECE', sem: 4, attendance: 71, gpa: 7.5, type: 'Hostel' },
  { roll: 'CB22EC011', name: 'Vikram Nair', dept: 'ECE', sem: 4, attendance: 90, gpa: 9.0, type: 'Day' },
  { roll: 'CB22CS012', name: 'Ananya Bose', dept: 'CSE', sem: 2, attendance: 86, gpa: 8.6, type: 'Day' },
]

function ProcteeDashboard() {
  const [expandedRow, setExpandedRow] = useState(null)

  const summary = [
    { label: 'Total Proctees', value: 12, color: ACCENT, bg: '#eef2ff' },
    { label: 'Present Today', value: 10, color: '#16a34a', bg: '#dcfce7' },
    { label: 'Pending Leave Requests', value: 3, color: '#d97706', bg: '#fef3c7' },
    { label: 'Low Attendance (<75%)', value: 2, color: '#ef4444', bg: '#fee2e2' },
  ]

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Proctee Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {summary.map(s => (
          <div key={s.label} style={{ ...card, padding: 20, borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Roll No', 'Name', 'Dept', 'Sem', 'Attendance %', 'GPA', 'Type', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proctees.map((p, i) => (
              <React.Fragment key={p.roll}>
                <tr
                  style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: expandedRow === i ? '#fafafa' : (i % 2 === 0 ? '#fff' : '#fafafa') }}
                  onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                >
                  <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{p.roll}</td>
                  <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '12px 14px', color: MUTED }}>{p.dept}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{p.sem}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontWeight: 700, color: p.attendance < 75 ? '#ef4444' : '#16a34a' }}>{p.attendance}%</span>
                    {p.attendance < 75 && <span style={{ marginLeft: 6, fontSize: 11, background: '#fee2e2', color: '#ef4444', borderRadius: 4, padding: '1px 6px' }}>Low</span>}
                  </td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{p.gpa}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: p.type === 'Hostel' ? '#eef2ff' : '#f0fdf4', color: p.type === 'Hostel' ? ACCENT : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{p.type}</span>
                  </td>
                  <td style={{ padding: '12px 14px', color: MUTED, fontSize: 18 }}>{expandedRow === i ? '▲' : '▼'}</td>
                </tr>
                {expandedRow === i && (
                  <tr style={{ background: '#f8fafc' }}>
                    <td colSpan={8} style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', gap: 32 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 8 }}>Mini Profile — {p.name}</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px', fontSize: 13 }}>
                            {[['Roll No', p.roll], ['Department', p.dept], ['Semester', p.sem], ['Attendance', `${p.attendance}%`], ['GPA', p.gpa], ['Hostel/Day', p.type]].map(([k, v]) => (
                              <div key={k}><span style={{ color: MUTED }}>{k}: </span><span style={{ color: TEXT, fontWeight: 600 }}>{v}</span></div>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 22 }}>
                          <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View Full Profile</button>
                          <button style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 7, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Send Message</button>
                        </div>
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

// ─── No Dues Form - Proctor Approvals ─────────────────────────────────────────
const noDuesRequests = [
  { name: 'Arun Kumar', roll: 'CB22CS001', purpose: 'Graduation', submitted: '2024-05-10', pending: 'Library Fine' },
  { name: 'Priya Nair', roll: 'CB22CS002', purpose: 'Exam', submitted: '2024-05-12', pending: 'None' },
  { name: 'Lakshmi Devi', roll: 'CB22IT008', purpose: 'TC', submitted: '2024-05-08', pending: 'Lab Equipment' },
  { name: 'Suresh Kumar', roll: 'CB22IT009', purpose: 'Graduation', submitted: '2024-05-14', pending: 'None' },
]

function NoDuesApprovals() {
  const [statuses, setStatuses] = useState({})
  const [remarks, setRemarks] = useState({})

  const setStatus = (roll, status) => setStatuses(p => ({ ...p, [roll]: status }))
  const setRemark = (roll, val) => setRemarks(p => ({ ...p, [roll]: val }))

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>No Dues Form — Proctor Approvals</h2>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: MUTED }}>Students below have applied for No Dues clearance. Review pending items and approve or reject each request.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {noDuesRequests.map((r) => {
          const status = statuses[r.roll]
          return (
            <div key={r.roll} style={{ ...card, padding: 20, borderLeft: status === 'Approved' ? '4px solid #16a34a' : status === 'Rejected' ? '4px solid #ef4444' : '4px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color: TEXT, fontSize: 15 }}>{r.name}</span>
                    <span style={{ color: MUTED, fontSize: 13 }}>{r.roll}</span>
                    <span style={{ background: '#eef2ff', color: ACCENT, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{r.purpose}</span>
                    {status && (
                      <span style={{ background: status === 'Approved' ? '#dcfce7' : '#fee2e2', color: status === 'Approved' ? '#16a34a' : '#ef4444', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{status}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: MUTED, marginBottom: 10 }}>
                    <span>Submitted: {r.submitted}</span>
                    <span style={{ margin: '0 12px' }}>·</span>
                    <span>Items Pending: <strong style={{ color: r.pending === 'None' ? '#16a34a' : '#d97706' }}>{r.pending}</strong></span>
                  </div>
                  <input
                    type="text"
                    value={remarks[r.roll] || ''}
                    onChange={e => setRemark(r.roll, e.target.value)}
                    placeholder="Add remarks (optional)..."
                    style={{ width: '100%', padding: '7px 12px', borderRadius: 7, border: '1px solid #e2e8f0', fontSize: 13, color: TEXT, boxSizing: 'border-box', maxWidth: 480 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => setStatus(r.roll, 'Approved')}
                    style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac', borderRadius: 7, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >Approve</button>
                  <button
                    onClick={() => setStatus(r.roll, 'Rejected')}
                    style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: 7, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >Reject</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Leave Approval ───────────────────────────────────────────────────────────
const leaveRequests = [
  { name: 'Rahul Verma', roll: 'CB22CS003', type: 'Medical', from: '2024-05-20', to: '2024-05-22', days: 3, reason: 'Fever and throat infection', doc: true },
  { name: 'Meera Pillai', roll: 'CB22EC010', type: 'Personal', from: '2024-05-25', to: '2024-05-25', days: 1, reason: 'Family function', doc: false },
  { name: 'Karthik Raj', roll: 'CB22ME005', type: 'Event', from: '2024-06-01', to: '2024-06-03', days: 3, reason: 'State level sports meet', doc: true },
]

const leaveTypeColor = { Medical: { bg: '#fef3c7', color: '#92400e' }, Personal: { bg: '#e0f2fe', color: '#0369a1' }, Event: { bg: '#f3e8ff', color: '#7e22ce' } }

function LeaveApproval() {
  const [statuses, setStatuses] = useState({})
  const [infoRequests, setInfoRequests] = useState({})

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Leave Approval</h2>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: MUTED }}>Pending leave requests from your proctees. Review and take action.</p>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Student', 'Roll No', 'Leave Type', 'From', 'To', 'Days', 'Reason', 'Docs', 'Action'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((r) => {
              const status = statuses[r.roll]
              const tc = leaveTypeColor[r.type]
              return (
                <tr key={r.roll} style={{ borderBottom: '1px solid #f1f5f9', background: status ? '#fafafa' : '#fff' }}>
                  <td style={{ padding: '12px 12px', color: TEXT, fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: '12px 12px', color: ACCENT, fontWeight: 600 }}>{r.roll}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ background: tc.bg, color: tc.color, borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{r.type}</span>
                  </td>
                  <td style={{ padding: '12px 12px', color: MUTED, fontSize: 13 }}>{r.from}</td>
                  <td style={{ padding: '12px 12px', color: MUTED, fontSize: 13 }}>{r.to}</td>
                  <td style={{ padding: '12px 12px', color: TEXT, fontWeight: 600, textAlign: 'center' }}>{r.days}</td>
                  <td style={{ padding: '12px 12px', color: TEXT, maxWidth: 160, fontSize: 13 }}>{r.reason}</td>
                  <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                    {r.doc ? <span style={{ color: '#16a34a', fontSize: 18 }}>✓</span> : <span style={{ color: '#ef4444', fontSize: 15 }}>—</span>}
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    {status ? (
                      <span style={{ background: status === 'Approved' ? '#dcfce7' : status === 'Rejected' ? '#fee2e2' : '#fef3c7', color: status === 'Approved' ? '#16a34a' : status === 'Rejected' ? '#ef4444' : '#92400e', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>{status}</span>
                    ) : (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                        <button onClick={() => setStatuses(p => ({ ...p, [r.roll]: 'Approved' }))} style={{ background: '#dcfce7', color: '#166534', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                        <button onClick={() => setStatuses(p => ({ ...p, [r.roll]: 'Rejected' }))} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                        <button onClick={() => setStatuses(p => ({ ...p, [r.roll]: 'More Info' }))} style={{ background: '#fef3c7', color: '#92400e', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Ask Info</button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Edit Student Contact Details ─────────────────────────────────────────────
function EditStudentContact() {
  const [searchRoll, setSearchRoll] = useState('')
  const [found, setFound] = useState(null)
  const [form, setForm] = useState({})
  const [reason, setReason] = useState('')
  const [saved, setSaved] = useState(false)

  const sampleData = {
    'CB22CS001': { name: 'Arun Kumar', mobile: '9876543210', parentMobile: '9876543211', email: 'arun@student.edu', address: '12, Gandhi Nagar, Chennai - 600001', emergency: '9876543212' },
    'CB22CS002': { name: 'Priya Nair', mobile: '9123456789', parentMobile: '9123456780', email: 'priya@student.edu', address: '45, Nair Colony, Coimbatore - 641001', emergency: '9123456781' },
  }

  const handleSearch = () => {
    const data = sampleData[searchRoll.toUpperCase()]
    if (data) {
      setFound(searchRoll.toUpperCase())
      setForm({ ...data })
      setSaved(false)
    } else {
      setFound(null)
      setForm({})
      alert('Student not found. Try CB22CS001 or CB22CS002.')
    }
  }

  const handleChange = (field, val) => setForm(p => ({ ...p, [field]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const fields = [
    { key: 'mobile', label: 'Mobile Number', type: 'tel' },
    { key: 'parentMobile', label: 'Parent Mobile', type: 'tel' },
    { key: 'email', label: 'Email Address', type: 'email' },
    { key: 'emergency', label: 'Emergency Contact', type: 'tel' },
  ]

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Edit Student Contact Details</h2>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Search by Roll Number</label>
            <input
              type="text"
              value={searchRoll}
              onChange={e => setSearchRoll(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. CB22CS001"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }}
            />
          </div>
          <button onClick={handleSearch} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Search</button>
        </div>
      </div>

      {found && (
        <div style={{ ...card, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
            <div>
              <div style={{ fontWeight: 700, color: TEXT, fontSize: 15 }}>{form.name}</div>
              <div style={{ color: MUTED, fontSize: 13 }}>{found}</div>
            </div>
          </div>
          {saved && <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>Contact details updated successfully!</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key] || ''}
                    onChange={e => handleChange(f.key, e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Address</label>
                <textarea
                  value={form.address || ''}
                  onChange={e => handleChange('address', e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Reason for Update</label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  required
                  placeholder="State reason for editing contact details..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <button type="submit" style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Submit Updates</button>
          </form>
        </div>
      )}
    </div>
  )
}

// ─── Proctee Message ──────────────────────────────────────────────────────────
const inboxMessages = [
  { from: 'Arun Kumar', roll: 'CB22CS001', subject: 'Leave extension request', time: '10:30 AM', body: 'Sir, I need 2 more days of leave due to health reasons. Please approve.' },
  { from: 'Priya Nair', roll: 'CB22CS002', subject: 'Clarification on attendance', time: 'Yesterday', body: 'Madam, my attendance shows incorrect. Could you please verify?' },
  { from: 'Karthik Raj', roll: 'CB22ME005', subject: 'Sports NOC required', time: '2 days ago', body: 'Sir, I need an NOC for the state sports event. Kindly issue at the earliest.' },
]

const sentMessages = [
  { to: 'All Proctees', subject: 'Parent-teacher meeting on 20th June', time: '2024-06-01', priority: 'Urgent' },
  { to: 'Rahul Verma', subject: 'Attendance warning — please meet me', time: '2024-05-28', priority: 'Normal' },
]

function ProcteeMessage() {
  const [recipient, setRecipient] = useState('All Proctees')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [priority, setPriority] = useState('Normal')
  const [sent, setSent] = useState(false)
  const [activeTab, setActiveTab] = useState('compose')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')

  const handleSend = (e) => {
    e.preventDefault()
    setSent(true)
    setSubject(''); setBody(''); setRecipient('All Proctees'); setPriority('Normal')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Proctee Message</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['compose', 'Compose'], ['inbox', `Inbox (${inboxMessages.length})`], ['sent', 'Sent']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{ padding: '8px 20px', borderRadius: 8, border: `1px solid ${activeTab === key ? ACCENT : '#e2e8f0'}`, background: activeTab === key ? ACCENT : '#fff', color: activeTab === key ? '#fff' : TEXT, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >{label}</button>
        ))}
      </div>

      {activeTab === 'compose' && (
        <div style={{ ...card, padding: 24 }}>
          {sent && <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>Message sent successfully!</div>}
          <form onSubmit={handleSend}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Recipient</label>
                <select value={recipient} onChange={e => setRecipient(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}>
                  <option>All Proctees</option>
                  {proctees.map(p => <option key={p.roll}>{p.name} ({p.roll})</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}>
                  <option>Normal</option>
                  <option>Urgent</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Subject</label>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required placeholder="Message subject" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Message</label>
                <textarea value={body} onChange={e => setBody(e.target.value)} required rows={5} placeholder="Type your message here..." style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            </div>
            <button type="submit" style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Send Message</button>
          </form>
        </div>
      )}

      {activeTab === 'inbox' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {inboxMessages.map((m, i) => (
            <div key={i} style={{ ...card, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <span style={{ fontWeight: 700, color: TEXT }}>{m.from}</span>
                  <span style={{ color: MUTED, fontSize: 13, marginLeft: 8 }}>{m.roll}</span>
                </div>
                <span style={{ color: MUTED, fontSize: 13 }}>{m.time}</span>
              </div>
              <div style={{ fontWeight: 600, color: TEXT, marginBottom: 6, fontSize: 14 }}>{m.subject}</div>
              <div style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>{m.body}</div>
              {replyingTo === i ? (
                <div>
                  <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={3} placeholder="Type your reply..." style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, color: TEXT, resize: 'vertical', boxSizing: 'border-box', marginBottom: 8 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setReplyingTo(null); setReplyText('') }} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '7px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Send Reply</button>
                    <button onClick={() => setReplyingTo(null)} style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 7, padding: '7px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setReplyingTo(i)} style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 7, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Reply</button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'sent' && (
        <div style={{ ...card, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['To', 'Subject', 'Date', 'Priority'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sentMessages.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{m.to}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{m.subject}</td>
                  <td style={{ padding: '12px 14px', color: MUTED }}>{m.time}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: m.priority === 'Urgent' ? '#fee2e2' : '#f1f5f9', color: m.priority === 'Urgent' ? '#ef4444' : MUTED, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{m.priority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Hostel Attendance ────────────────────────────────────────────────────────
const hostelProctees = proctees.filter(p => p.type === 'Hostel')

const hostelAttendanceData = hostelProctees.map(p => ({
  ...p,
  block: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
  room: `${Math.floor(Math.random() * 3) + 1}0${Math.floor(Math.random() * 9) + 1}`,
  present: Math.floor(p.attendance / 100 * 26),
  absent: 26 - Math.floor(p.attendance / 100 * 26),
}))

function HostelAttendance() {
  const [view, setView] = useState('month')

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Hostel Attendance</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: MUTED, marginRight: 4 }}>View:</span>
        {['month', 'week'].map(v => (
          <button key={v} onClick={() => setView(v)} style={{ padding: '6px 18px', borderRadius: 7, border: `1px solid ${view === v ? ACCENT : '#e2e8f0'}`, background: view === v ? ACCENT : '#fff', color: view === v ? '#fff' : TEXT, fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>{v === 'month' ? 'Monthly' : 'Weekly'}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: MUTED }}>Showing: {view === 'month' ? 'May 2024 (26 working days)' : 'May 20–26, 2024'}</span>
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Student Name', 'Roll No', 'Block', 'Room', 'Present', 'Absent', 'Attendance %', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hostelAttendanceData.map((p, i) => (
              <tr key={p.roll} style={{ borderBottom: '1px solid #f1f5f9', background: p.attendance < 75 ? '#fff7f7' : (i % 2 === 0 ? '#fff' : '#fafafa') }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{p.roll}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>Block {p.block}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{p.room}</td>
                <td style={{ padding: '12px 14px', color: '#16a34a', fontWeight: 600 }}>{view === 'month' ? p.present : Math.floor(p.present / 4)}</td>
                <td style={{ padding: '12px 14px', color: '#ef4444', fontWeight: 600 }}>{view === 'month' ? p.absent : Math.ceil(p.absent / 4)}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ fontWeight: 700, color: p.attendance < 75 ? '#ef4444' : '#16a34a' }}>{p.attendance}%</span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  {p.attendance < 75 ? (
                    <span style={{ background: '#fee2e2', color: '#ef4444', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>Flagged</span>
                  ) : (
                    <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>Regular</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 14, padding: '12px 16px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, fontSize: 13, color: '#92400e' }}>
        <strong>Note:</strong> Students with hostel attendance below 75% are automatically flagged and a report is sent to the hostel warden.
      </div>
    </div>
  )
}

// ─── Late Hour Request ────────────────────────────────────────────────────────
const lateHourRequests = [
  { name: 'Arun Kumar', roll: 'CB22CS001', date: '2024-06-05', purpose: 'Library project work', duration: '9:00 PM – 11:00 PM', status: 'Pending' },
  { name: 'Sneha Rajan', roll: 'CB22ME004', date: '2024-06-06', purpose: 'Lab experiment continuation', duration: '8:00 PM – 10:30 PM', status: 'Pending' },
  { name: 'Lakshmi Devi', roll: 'CB22IT008', date: '2024-06-04', purpose: 'Group project submission', duration: '9:30 PM – 11:30 PM', status: 'Approved' },
  { name: 'Arjun Singh', roll: 'CB22EE007', date: '2024-06-03', purpose: 'Night canteen visit', duration: '9:00 PM – 9:30 PM', status: 'Rejected' },
]

const lateStatusColor = { Pending: { bg: '#fef3c7', color: '#92400e' }, Approved: { bg: '#dcfce7', color: '#16a34a' }, Rejected: { bg: '#fee2e2', color: '#ef4444' } }

function LateHourRequest() {
  const [statuses, setStatuses] = useState(
    Object.fromEntries(lateHourRequests.map(r => [r.roll + r.date, r.status]))
  )

  const updateStatus = (key, status) => setStatuses(p => ({ ...p, [key]: status }))

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Late Hour Request</h2>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: MUTED }}>Hostel proctees requesting permission to stay out past curfew hours.</p>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Student Name', 'Roll No', 'Requested Date', 'Purpose', 'Duration', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lateHourRequests.map((r) => {
              const key = r.roll + r.date
              const status = statuses[key]
              const sc = lateStatusColor[status] || lateStatusColor.Pending
              return (
                <tr key={key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 12px', color: TEXT, fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: '12px 12px', color: ACCENT, fontWeight: 600 }}>{r.roll}</td>
                  <td style={{ padding: '12px 12px', color: MUTED, fontSize: 13 }}>{r.date}</td>
                  <td style={{ padding: '12px 12px', color: TEXT, fontSize: 13 }}>{r.purpose}</td>
                  <td style={{ padding: '12px 12px', color: MUTED, fontSize: 13, whiteSpace: 'nowrap' }}>{r.duration}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ background: sc.bg, color: sc.color, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{status}</span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    {status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => updateStatus(key, 'Approved')} style={{ background: '#dcfce7', color: '#166534', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                        <button onClick={() => updateStatus(key, 'Rejected')} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                      </div>
                    ) : (
                      <button onClick={() => updateStatus(key, 'Pending')} style={{ background: '#f1f5f9', color: MUTED, border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer' }}>Undo</button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Hostel Vacating Proctor Approvals ────────────────────────────────────────
const vacatingRequests = [
  { name: 'Arun Kumar', roll: 'CB22CS001', room: 'A-104', reason: 'Course Completion', date: '2024-06-30', items: ['Mattress', 'Key', 'Locker Key', 'ID Card Returned'] },
  { name: 'Sneha Rajan', roll: 'CB22ME004', room: 'B-201', reason: 'Medical Emergency', date: '2024-06-10', items: ['Mattress', 'Key', 'Locker Key', 'ID Card Returned'] },
  { name: 'Meera Pillai', roll: 'CB22EC010', room: 'C-305', reason: 'Transfer to Day Scholar', date: '2024-06-15', items: ['Mattress', 'Key', 'Locker Key', 'ID Card Returned'] },
]

function HostelVacatingApprovals() {
  const [checkedItems, setCheckedItems] = useState({})
  const [remarks, setRemarks] = useState({})
  const [approved, setApproved] = useState({})

  const toggleItem = (roll, item) => {
    setCheckedItems(p => ({
      ...p,
      [roll]: { ...(p[roll] || {}), [item]: !(p[roll]?.[item]) }
    }))
  }

  const allChecked = (roll, items) => items.every(item => checkedItems[roll]?.[item])

  const handleApprove = (roll) => setApproved(p => ({ ...p, [roll]: true }))

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Hostel Vacating — Proctor Approvals</h2>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: MUTED }}>Students applying to vacate the hostel require your sign-off. Verify all items are returned before approving.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {vacatingRequests.map(r => (
          <div key={r.roll} style={{ ...card, padding: 24, borderLeft: approved[r.roll] ? '4px solid #16a34a' : '4px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, color: TEXT, fontSize: 15 }}>{r.name}</span>
                  <span style={{ color: MUTED, fontSize: 13 }}>{r.roll}</span>
                  {approved[r.roll] && <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>Approved</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', fontSize: 13, marginBottom: 14 }}>
                  {[['Room No', r.room], ['Reason', r.reason], ['Vacating Date', r.date]].map(([k, v]) => (
                    <div key={k}><span style={{ color: MUTED }}>{k}: </span><span style={{ color: TEXT, fontWeight: 600 }}>{v}</span></div>
                  ))}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 8 }}>Items Returned Checklist:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {r.items.map(item => (
                      <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: TEXT, cursor: 'pointer', background: checkedItems[r.roll]?.[item] ? '#dcfce7' : '#f8fafc', padding: '5px 12px', borderRadius: 7, border: `1px solid ${checkedItems[r.roll]?.[item] ? '#86efac' : '#e2e8f0'}` }}>
                        <input type="checkbox" checked={!!checkedItems[r.roll]?.[item]} onChange={() => toggleItem(r.roll, item)} style={{ accentColor: ACCENT }} />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Proctor Remarks</label>
                  <textarea
                    value={remarks[r.roll] || ''}
                    onChange={e => setRemarks(p => ({ ...p, [r.roll]: e.target.value }))}
                    rows={2}
                    placeholder="Add remarks before approving..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: '1px solid #e2e8f0', fontSize: 13, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div style={{ flexShrink: 0, marginTop: 4 }}>
                <button
                  onClick={() => handleApprove(r.roll)}
                  disabled={!allChecked(r.roll, r.items) || approved[r.roll]}
                  style={{
                    background: allChecked(r.roll, r.items) && !approved[r.roll] ? '#16a34a' : '#e2e8f0',
                    color: allChecked(r.roll, r.items) && !approved[r.roll] ? '#fff' : MUTED,
                    border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600,
                    cursor: allChecked(r.roll, r.items) && !approved[r.roll] ? 'pointer' : 'not-allowed',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {approved[r.roll] ? 'Approved' : 'Approve Vacating'}
                </button>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 6, textAlign: 'center' }}>
                  {!allChecked(r.roll, r.items) && 'Check all items first'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
const contentMap = {
  'Proctee Dashboard': ProcteeDashboard,
  'No Dues Form - Proctor Approvals': NoDuesApprovals,
  'Leave Approval': LeaveApproval,
  'Edit Student Contact Details': EditStudentContact,
  'Proctee Message': ProcteeMessage,
  'Hostel Attendance': HostelAttendance,
  'Late Hour Request': LateHourRequest,
  'Hostel Vacating Proctor Approvals': HostelVacatingApprovals,
}

export default function FacultyProctorGeneral() {
  const [activeNav, setActiveNav] = useState('Proctee Dashboard')
  const ActiveComponent = contentMap[activeNav] || (() => <div style={{ color: MUTED }}>Coming soon.</div>)

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Proctor — General</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Manage proctees — attendance, leave, messages and hostel</p>
      </div>

      {/* Card: left nav + content */}
      <div style={{ ...card, display: 'flex', overflow: 'hidden' }}>
        {/* Left Nav */}
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

        {/* Content */}
        <div style={{ flex: 1, padding: 28, minWidth: 0, overflowY: 'auto' }}>
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}
