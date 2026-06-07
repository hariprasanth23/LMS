import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

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

const issuedBooks = [
  { title: 'Clean Code', author: 'Robert C. Martin', issueDate: '2025-05-20', dueDate: '2025-06-10', overdue: true },
  { title: 'Design Patterns', author: 'Gang of Four', issueDate: '2025-05-28', dueDate: '2025-06-18', overdue: false },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', issueDate: '2025-06-01', dueDate: '2025-06-22', overdue: false },
]

const myRecommendations = [
  { title: 'Deep Learning', author: 'Ian Goodfellow', publisher: 'MIT Press', category: 'Computer Science', date: '2025-04-12', status: 'Approved' },
  { title: 'Atomic Habits', author: 'James Clear', publisher: 'Avery', category: 'Self Development', date: '2025-03-20', status: 'Under Review' },
  { title: 'System Design Interview', author: 'Alex Xu', publisher: 'ByteByteGo', category: 'Computer Science', date: '2025-02-05', status: 'Acquired' },
]

function statusBadge(status) {
  const map = {
    Approved: { bg: '#dcfce7', color: '#16a34a' },
    'Under Review': { bg: '#fef9c3', color: '#854d0e' },
    Acquired: { bg: '#dbeafe', color: '#1d4ed8' },
    Rejected: { bg: '#fee2e2', color: '#dc2626' },
  }
  const sc = map[status] || { bg: '#f1f5f9', color: MUTED }
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>{status}</span>
}

export default function FacultyLibrary() {
  const [recForm, setRecForm] = useState({ title: '', author: '', publisher: '', category: '', reason: '' })
  const [submitted, setSubmitted] = useState(false)
  const [renewed, setRenewed] = useState({})

  const handleRecommend = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setRecForm({ title: '', author: '', publisher: '', category: '', reason: '' })
    setTimeout(() => setSubmitted(false), 3500)
  }

  const handleRenew = (title) => {
    setRenewed(p => ({ ...p, [title]: true }))
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Services — Library</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Book recommendations and library services</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Books Issued', value: 3, icon: '📚', color: ACCENT, bg: '#eef2ff' },
          { label: 'Overdue', value: 1, icon: '⚠️', color: '#dc2626', bg: '#fee2e2' },
          { label: 'Recommendations', value: 3, icon: '✅', color: '#10b981', bg: '#f0fdf4' },
          { label: 'Max Allowed', value: 5, icon: '🔖', color: '#f59e0b', bg: '#fffbeb' },
        ].map((s, i) => (
          <div key={i} style={{ ...card, padding: 20, background: s.bg, textAlign: 'center' }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: s.color, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Currently Issued Books */}
      <div style={{ ...card, overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 15, color: TEXT }}>
          Currently Issued Books
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Book Title', 'Author', 'Issue Date', 'Due Date', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {issuedBooks.map((b, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{b.title}</td>
                <td style={tdStyle}>{b.author}</td>
                <td style={tdStyle}>{b.issueDate}</td>
                <td style={tdStyle}>
                  <span style={{ color: b.overdue ? '#dc2626' : TEXT, fontWeight: b.overdue ? 700 : 400 }}>
                    {b.dueDate} {b.overdue && <span style={{ fontSize: 11, background: '#fee2e2', color: '#dc2626', borderRadius: 5, padding: '1px 6px', marginLeft: 4 }}>OVERDUE</span>}
                  </span>
                </td>
                <td style={tdStyle}>
                  {renewed[b.title] ? (
                    <span style={{ color: '#10b981', fontWeight: 600, fontSize: 13 }}>Renewed</span>
                  ) : (
                    <button
                      onClick={() => handleRenew(b.title)}
                      style={{ background: '#eef2ff', color: ACCENT, border: '1px solid #c7d2fe', borderRadius: 7, padding: '5px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >Renew</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Book Recommendation Form */}
      <div style={{ ...card, padding: 28, marginBottom: 28 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: TEXT }}>Online Book Recommendation</h3>
        {submitted && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
            Recommendation submitted successfully!
          </div>
        )}
        <form onSubmit={handleRecommend}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Book Title *</label>
              <input style={inputStyle} value={recForm.title} onChange={e => setRecForm(p => ({ ...p, title: e.target.value }))} placeholder="Book title" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Author *</label>
              <input style={inputStyle} value={recForm.author} onChange={e => setRecForm(p => ({ ...p, author: e.target.value }))} placeholder="Author name" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Publisher</label>
              <input style={inputStyle} value={recForm.publisher} onChange={e => setRecForm(p => ({ ...p, publisher: e.target.value }))} placeholder="Publisher name" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Category *</label>
              <select style={inputStyle} value={recForm.category} onChange={e => setRecForm(p => ({ ...p, category: e.target.value }))} required>
                <option value="">Select category</option>
                {['Computer Science', 'Mathematics', 'Physics', 'Management', 'Self Development', 'Research', 'Others'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Reason for Recommendation *</label>
              <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={recForm.reason} onChange={e => setRecForm(p => ({ ...p, reason: e.target.value }))} placeholder="Why should this book be added to the library?" required />
            </div>
          </div>
          <button type="submit" style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Submit Recommendation
          </button>
        </form>
      </div>

      {/* My Recommendations */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 15, color: TEXT }}>
          My Recommendations
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Title', 'Author', 'Publisher', 'Category', 'Date', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {myRecommendations.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{r.title}</td>
                <td style={tdStyle}>{r.author}</td>
                <td style={tdStyle}>{r.publisher}</td>
                <td style={tdStyle}>
                  <span style={{ background: '#eef2ff', color: ACCENT, padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{r.category}</span>
                </td>
                <td style={tdStyle}>{r.date}</td>
                <td style={tdStyle}>{statusBadge(r.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
