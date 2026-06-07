import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }
const navItems = ['Faculty Inbound Request', 'Faculty Outbound Request', 'Student Outbound - IS Approvals']

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid #e2e8f0', fontSize: 14, color: TEXT,
  outline: 'none', boxSizing: 'border-box', background: '#fff',
}
const thStyle = {
  padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600,
  color: MUTED, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', background: '#f8fafc',
}
const tdStyle = { padding: '11px 14px', fontSize: 14, color: TEXT, borderBottom: '1px solid #f1f5f9' }

function statusBadge(status) {
  const map = {
    Approved:        { bg: '#dcfce7', color: '#16a34a' },
    Rejected:        { bg: '#fee2e2', color: '#dc2626' },
    Pending:         { bg: '#fef3c7', color: '#d97706' },
    'Under Review':  { bg: '#dbeafe', color: '#1d4ed8' },
    'Info Requested':{ bg: '#ede9fe', color: '#7c3aed' },
  }
  const sc = map[status] || { bg: '#f1f5f9', color: MUTED }
  return <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>{status}</span>
}

// ─── Faculty Inbound Request ───────────────────────────────────────────────────
const initialInbound = [
  { id: 'IR001', visitorName: 'Prof. John Smith', institution: 'MIT, USA', country: 'United States', purpose: 'Research Collaboration', dates: 'Jun 20 – Jun 25, 2025', status: 'Pending' },
  { id: 'IR002', visitorName: 'Dr. Yuki Tanaka', institution: 'Osaka Univ., Japan', country: 'Japan', purpose: 'Joint Workshop', dates: 'Jul 5 – Jul 8, 2025', status: 'Approved' },
  { id: 'IR003', visitorName: 'Prof. Maria Russo', institution: 'Univ. of Bologna, Italy', country: 'Italy', purpose: 'Student Exchange MOU', dates: 'Aug 1 – Aug 3, 2025', status: 'Under Review' },
  { id: 'IR004', visitorName: 'Dr. Chen Wei', institution: 'Tsinghua Univ., China', country: 'China', purpose: 'Lecture Series', dates: 'Sep 10 – Sep 14, 2025', status: 'Pending' },
]

function FacultyInboundSection() {
  const [visitors, setVisitors] = useState(initialInbound)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ visitorName: '', institution: '', country: '', purpose: '', dateFrom: '', dateTo: '' })
  const [formSaved, setFormSaved] = useState(false)
  const [infoId, setInfoId] = useState(null)

  const handleAction = (id, action) => {
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: action } : v))
    if (action === 'Info Requested') setInfoId(null)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    setVisitors(prev => [...prev, {
      id: 'IR00' + (prev.length + 5),
      visitorName: form.visitorName, institution: form.institution,
      country: form.country, purpose: form.purpose,
      dates: `${form.dateFrom} – ${form.dateTo}`,
      status: 'Pending',
    }])
    setForm({ visitorName: '', institution: '', country: '', purpose: '', dateFrom: '', dateTo: '' })
    setShowForm(false)
    setFormSaved(true)
    setTimeout(() => setFormSaved(false), 3000)
  }

  return (
    <div>
      {formSaved && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 18, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          Inbound request added successfully.
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>International Visitor Requests</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED }}>Manage and approve inbound international faculty visits</p>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          + New Inbound Request
        </button>
      </div>

      {showForm && (
        <div style={{ ...card, padding: 24, marginBottom: 24, border: '1px solid #c7d2fe' }}>
          <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: TEXT }}>Add New Inbound Visit</h4>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {[
                ['visitorName', 'Visitor Name', 'text'],
                ['institution', 'Institution', 'text'],
                ['country', 'Country', 'text'],
                ['purpose', 'Purpose of Visit', 'text'],
                ['dateFrom', 'Date From', 'date'],
                ['dateTo', 'Date To', 'date'],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>{label} *</label>
                  <input
                    type={type} required style={inputStyle}
                    value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={label}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
              <button type="submit" style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Submit</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['ID', 'Visitor', 'Institution', 'Country', 'Purpose', 'Dates', 'Status', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {visitors.map((v, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{v.id}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{v.visitorName}</td>
                <td style={{ ...tdStyle, fontSize: 13, color: MUTED }}>{v.institution}</td>
                <td style={tdStyle}>{v.country}</td>
                <td style={tdStyle}>{v.purpose}</td>
                <td style={{ ...tdStyle, fontSize: 12, fontFamily: 'monospace' }}>{v.dates}</td>
                <td style={tdStyle}>{statusBadge(v.status)}</td>
                <td style={tdStyle}>
                  {v.status === 'Pending' || v.status === 'Under Review' ? (
                    infoId === v.id ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleAction(v.id, 'Info Requested')} style={{ background: '#ede9fe', color: '#7c3aed', border: 'none', borderRadius: 6, padding: '4px 9px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Send</button>
                        <button onClick={() => setInfoId(null)} style={{ background: '#f1f5f9', color: MUTED, border: 'none', borderRadius: 6, padding: '4px 9px', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button onClick={() => handleAction(v.id, 'Approved')} style={{ background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                        <button onClick={() => handleAction(v.id, 'Rejected')} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                        <button onClick={() => setInfoId(v.id)} style={{ background: '#ede9fe', color: '#7c3aed', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Info</button>
                      </div>
                    )
                  ) : (
                    <span style={{ fontSize: 12, color: MUTED }}>—</span>
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

// ─── Faculty Outbound Request ──────────────────────────────────────────────────
const myOutboundRequests = [
  { id: 'OB001', country: 'Germany', institution: 'TU Munich', purpose: 'Conference', dates: 'Jul 15 – Jul 20, 2025', funding: 'University Grant', status: 'Approved' },
  { id: 'OB002', country: 'Singapore', institution: 'NUS', purpose: 'Research Visit', dates: 'Sep 1 – Sep 14, 2025', funding: 'DST Project', status: 'Under Review' },
  { id: 'OB003', country: 'United Kingdom', institution: 'Imperial College', purpose: 'Workshop', dates: 'Oct 5 – Oct 7, 2025', funding: 'Self-funded', status: 'Pending' },
]

const fundingSources = ['University Grant', 'DST Project', 'SERB Fund', 'Self-funded', 'Host Institution', 'Other']
const purposes = ['Conference', 'Research Visit', 'Workshop', 'MOU Signing', 'Faculty Exchange', 'Collaborative Project', 'Training Programme']

function FacultyOutboundSection() {
  const [requests, setRequests] = useState(myOutboundRequests)
  const [form, setForm] = useState({ country: '', institution: '', purpose: purposes[0], duration: '', dateFrom: '', dateTo: '', funding: fundingSources[0], docName: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setRequests(prev => [...prev, {
      id: 'OB00' + (prev.length + 4),
      country: form.country, institution: form.institution,
      purpose: form.purpose, funding: form.funding,
      dates: `${form.dateFrom} – ${form.dateTo}`,
      status: 'Pending',
    }])
    setForm({ country: '', institution: '', purpose: purposes[0], duration: '', dateFrom: '', dateTo: '', funding: fundingSources[0], docName: '' })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3500)
  }

  return (
    <div>
      <div style={{ ...card, padding: 28, marginBottom: 28 }}>
        <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: TEXT }}>Apply for Outbound Visit</h3>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: MUTED }}>Submit your application for international travel for academic purposes.</p>

        {submitted && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 18, color: '#166534', fontWeight: 500, fontSize: 14 }}>
            Outbound request submitted successfully. You will be notified once reviewed.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Country *</label>
              <input style={inputStyle} value={form.country} required onChange={e => setForm(p => ({ ...p, country: e.target.value }))} placeholder="Destination country" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Institution *</label>
              <input style={inputStyle} value={form.institution} required onChange={e => setForm(p => ({ ...p, institution: e.target.value }))} placeholder="Host institution" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Purpose *</label>
              <select style={inputStyle} value={form.purpose} onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))}>
                {purposes.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Duration (days) *</label>
              <input type="number" min={1} style={inputStyle} value={form.duration} required onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="Number of days" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Date From *</label>
              <input type="date" style={inputStyle} value={form.dateFrom} required onChange={e => setForm(p => ({ ...p, dateFrom: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Date To *</label>
              <input type="date" style={inputStyle} value={form.dateTo} required onChange={e => setForm(p => ({ ...p, dateTo: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Funding Source *</label>
              <select style={inputStyle} value={form.funding} onChange={e => setForm(p => ({ ...p, funding: e.target.value }))}>
                {fundingSources.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Supporting Document</label>
              <div style={{ border: '2px dashed #c7d2fe', borderRadius: 8, padding: '12px 14px', background: '#fafbff', cursor: 'pointer' }}>
                <div style={{ fontSize: 13, color: MUTED }}>
                  {form.docName || <span>Drop file or <span style={{ color: ACCENT, fontWeight: 600 }}>browse</span></span>}
                </div>
              </div>
            </div>
          </div>
          <button type="submit" style={{ marginTop: 22, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Submit Application
          </button>
        </form>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>My Outbound Requests</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['ID', 'Country', 'Institution', 'Purpose', 'Dates', 'Funding', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {requests.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{r.id}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{r.country}</td>
                <td style={{ ...tdStyle, fontSize: 13, color: MUTED }}>{r.institution}</td>
                <td style={tdStyle}>{r.purpose}</td>
                <td style={{ ...tdStyle, fontSize: 12, fontFamily: 'monospace' }}>{r.dates}</td>
                <td style={tdStyle}>{r.funding}</td>
                <td style={tdStyle}>{statusBadge(r.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Student Outbound - IS Approvals ──────────────────────────────────────────
const studentOutbound = [
  { id: 'SO001', studentName: 'Arun Kumar', rollNo: '21CS001', program: 'B.Tech CSE', destCountry: 'Germany', institution: 'RWTH Aachen', duration: '1 Semester', purpose: 'Exchange Program', proctor: 'Dr. R. Sharma', status: 'Pending' },
  { id: 'SO002', studentName: 'Priya Menon', rollNo: '21EC042', program: 'B.Tech ECE', destCountry: 'France', institution: 'CentraleSupélec', duration: '3 Months', purpose: 'Research Internship', proctor: 'Dr. K. Rajan', status: 'Under Review' },
  { id: 'SO003', studentName: 'Mohammed Irfan', rollNo: '21ME015', program: 'B.Tech MECH', destCountry: 'Japan', institution: 'Kyoto Univ.', duration: '2 Months', purpose: 'Summer Research', proctor: 'Dr. A. Senthil', status: 'Pending' },
  { id: 'SO004', studentName: 'Divya Krishnan', rollNo: '21CS089', program: 'B.Tech CSE', destCountry: 'USA', institution: 'UC Berkeley', duration: '1 Year', purpose: 'MS Bridge Program', proctor: 'Dr. R. Sharma', status: 'Approved' },
]

function StudentOutboundSection() {
  const [students, setStudents] = useState(studentOutbound)
  const [viewId, setViewId] = useState(null)
  const [docId, setDocId] = useState(null)

  const handleAction = (id, action) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: action } : s))
    setDocId(null)
  }

  const viewed = students.find(s => s.id === viewId)

  return (
    <div>
      {viewId && viewed && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, maxWidth: 500, width: '100%', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: TEXT }}>Student Outbound Details</h3>
              <button onClick={() => setViewId(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MUTED, lineHeight: 1 }}>×</button>
            </div>
            {[
              ['Student Name', viewed.studentName], ['Roll No', viewed.rollNo], ['Program', viewed.program],
              ['Destination Country', viewed.destCountry], ['Institution', viewed.institution],
              ['Duration', viewed.duration], ['Purpose', viewed.purpose], ['Proctor', viewed.proctor],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>{val}</span>
              </div>
            ))}
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button onClick={() => { handleAction(viewed.id, 'Approved'); setViewId(null) }} style={{ flex: 1, background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: 8, padding: '9px 0', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Approve</button>
              <button onClick={() => { handleAction(viewed.id, 'Rejected'); setViewId(null) }} style={{ flex: 1, background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '9px 0', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Reject</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ ...card, padding: 16, marginBottom: 18, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <div style={{ fontWeight: 600, color: '#1d4ed8', marginBottom: 4, fontSize: 14 }}>IR Coordinator Review Required</div>
        <div style={{ fontSize: 13, color: '#1e40af', lineHeight: 1.6 }}>
          The students listed below require International Relations office approval for their outbound programs.
          Review each application and approve, reject, or request additional documents.
        </div>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: TEXT }}>Pending Student Outbound Approvals</span>
          <span style={{ fontSize: 13, color: MUTED }}>
            {students.filter(s => s.status === 'Pending' || s.status === 'Under Review').length} awaiting action
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['ID', 'Student', 'Roll No', 'Program', 'Country', 'Institution', 'Duration', 'Purpose', 'Status', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{s.id}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{s.studentName}</td>
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 13 }}>{s.rollNo}</td>
                <td style={{ ...tdStyle, fontSize: 13, color: MUTED }}>{s.program}</td>
                <td style={tdStyle}>{s.destCountry}</td>
                <td style={{ ...tdStyle, fontSize: 13, color: MUTED }}>{s.institution}</td>
                <td style={tdStyle}>{s.duration}</td>
                <td style={tdStyle}>{s.purpose}</td>
                <td style={tdStyle}>{statusBadge(s.status)}</td>
                <td style={tdStyle}>
                  {s.status === 'Approved' || s.status === 'Rejected' ? (
                    <span style={{ fontSize: 12, color: MUTED }}>—</span>
                  ) : docId === s.id ? (
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button onClick={() => handleAction(s.id, 'Info Requested')} style={{ background: '#ede9fe', color: '#7c3aed', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Send</button>
                      <button onClick={() => setDocId(null)} style={{ background: '#f1f5f9', color: MUTED, border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer' }}>No</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      <button onClick={() => setViewId(s.id)} style={{ background: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: 6, padding: '4px 9px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Details</button>
                      <button onClick={() => handleAction(s.id, 'Approved')} style={{ background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: 6, padding: '4px 9px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => handleAction(s.id, 'Rejected')} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '4px 9px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                      <button onClick={() => setDocId(s.id)} style={{ background: '#fef3c7', color: '#d97706', border: 'none', borderRadius: 6, padding: '4px 9px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Docs</button>
                    </div>
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

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyInternationalRelations() {
  const [activeNav, setActiveNav] = useState('Faculty Inbound Request')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Services — International Relations</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Manage inbound visits, outbound travel, and student international approvals</p>
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
          {activeNav === 'Faculty Inbound Request' && <FacultyInboundSection />}
          {activeNav === 'Faculty Outbound Request' && <FacultyOutboundSection />}
          {activeNav === 'Student Outbound - IS Approvals' && <StudentOutboundSection />}
        </div>
      </div>
    </div>
  )
}
