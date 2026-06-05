import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const issuedBooks = [
  { title: 'Introduction to Algorithms', author: 'CLRS', isbn: '978-0262046305', issueDate: '2024-05-01', dueDate: '2024-05-22', renewalsLeft: 1, overdue: false },
  { title: 'Deep Learning', author: 'Goodfellow et al.', isbn: '978-0262035613', issueDate: '2024-04-20', dueDate: '2024-05-11', renewalsLeft: 0, overdue: true },
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', issueDate: '2024-05-05', dueDate: '2024-05-26', renewalsLeft: 2, overdue: false },
]

const recommendations = [
  { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', category: 'Reference', date: '2024-03-10', status: 'Approved' },
  { title: 'Designing Data-Intensive Apps', author: 'Martin Kleppmann', category: 'Textbook', date: '2024-04-01', status: 'Pending' },
  { title: 'Atomic Habits', author: 'James Clear', category: 'Other', date: '2024-04-15', status: 'Declined' },
]

const recStatusColor = (s) => {
  if (s === 'Approved') return { color: '#16a34a', background: '#dcfce7', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
  if (s === 'Pending') return { color: '#d97706', background: '#fef3c7', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
  if (s === 'Purchased') return { color: ACCENT, background: '#eef2ff', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
  return { color: '#ef4444', background: '#fee2e2', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
}

export default function Library() {
  const [recForm, setRecForm] = useState({ title: '', author: '', publisher: '', isbn: '', category: 'Textbook', reason: '' })
  const [recSubmitted, setRecSubmitted] = useState(false)
  const [renewedRows, setRenewedRows] = useState({})

  const handleRecChange = (e) => {
    const { name, value } = e.target
    setRecForm(prev => ({ ...prev, [name]: value }))
  }

  const handleRecSubmit = (e) => {
    e.preventDefault()
    setRecSubmitted(true)
    setRecForm({ title: '', author: '', publisher: '', isbn: '', category: 'Textbook', reason: '' })
    setTimeout(() => setRecSubmitted(false), 3000)
  }

  const handleRenew = (idx) => {
    setRenewedRows(prev => ({ ...prev, [idx]: true }))
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Services — Library</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Online book recommendations and library services</p>
      </div>

      {/* Currently Issued Books */}
      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 18px', fontSize: 17, fontWeight: 700, color: TEXT }}>Currently Issued Books</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Book Title', 'Author', 'ISBN', 'Issue Date', 'Due Date', 'Renewals Left', 'Action'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issuedBooks.map((book, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: book.overdue ? '#fff7ed' : (i % 2 === 0 ? '#fff' : '#fafafa') }}>
                  <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>
                    {book.title}
                    {book.overdue && <span style={{ marginLeft: 8, background: '#fee2e2', color: '#ef4444', borderRadius: 5, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>OVERDUE</span>}
                  </td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{book.author}</td>
                  <td style={{ padding: '12px 14px', color: MUTED, fontFamily: 'monospace', fontSize: 12 }}>{book.isbn}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{book.issueDate}</td>
                  <td style={{ padding: '12px 14px', color: book.overdue ? '#ef4444' : TEXT, fontWeight: book.overdue ? 700 : 400 }}>{book.dueDate}</td>
                  <td style={{ padding: '12px 14px', color: book.renewalsLeft === 0 ? '#ef4444' : TEXT }}>{book.renewalsLeft}</td>
                  <td style={{ padding: '12px 14px' }}>
                    {renewedRows[i] ? (
                      <span style={{ color: '#16a34a', fontSize: 13, fontWeight: 600 }}>Renewed</span>
                    ) : book.renewalsLeft > 0 ? (
                      <button
                        onClick={() => handleRenew(i)}
                        style={{ background: '#eef2ff', color: ACCENT, border: '1px solid #c7d2fe', borderRadius: 6, padding: '5px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Renew
                      </button>
                    ) : (
                      <span style={{ color: MUTED, fontSize: 13 }}>No renewals</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {issuedBooks.some(b => b.overdue) && (
          <div style={{ marginTop: 12, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '10px 16px', color: '#c2410c', fontSize: 13, fontWeight: 500 }}>
            You have overdue books. Please return them at the earliest to avoid fines.
          </div>
        )}
      </div>

      {/* Book Recommendation Form */}
      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Online Book Recommendation</h2>
        {recSubmitted && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
            Recommendation submitted successfully!
          </div>
        )}
        <form onSubmit={handleRecSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Book Title *</label>
              <input
                type="text"
                name="title"
                value={recForm.title}
                onChange={handleRecChange}
                required
                placeholder="Book title"
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Author Name *</label>
              <input
                type="text"
                name="author"
                value={recForm.author}
                onChange={handleRecChange}
                required
                placeholder="Author name"
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Publisher <span style={{ color: MUTED, fontWeight: 400 }}>(optional)</span></label>
              <input
                type="text"
                name="publisher"
                value={recForm.publisher}
                onChange={handleRecChange}
                placeholder="Publisher name"
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>ISBN <span style={{ color: MUTED, fontWeight: 400 }}>(optional)</span></label>
              <input
                type="text"
                name="isbn"
                value={recForm.isbn}
                onChange={handleRecChange}
                placeholder="e.g. 978-XXXXXXXXXX"
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Category</label>
              <select
                name="category"
                value={recForm.category}
                onChange={handleRecChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}
              >
                {['Textbook', 'Reference', 'Fiction', 'Research', 'Other'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Why do you recommend this book? *</label>
              <textarea
                name="reason"
                value={recForm.reason}
                onChange={handleRecChange}
                required
                rows={3}
                placeholder="Explain the relevance and usefulness of this book..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <button
            type="submit"
            style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
          >
            Submit Recommendation
          </button>
        </form>
      </div>

      {/* My Recommendations Table */}
      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 18px', fontSize: 17, fontWeight: 700, color: TEXT }}>My Recommendations</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Book Title', 'Author', 'Category', 'Date Submitted', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{rec.title}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{rec.author}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{rec.category}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{rec.date}</td>
                <td style={{ padding: '12px 14px' }}><span style={recStatusColor(rec.status)}>{rec.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Library Statistics */}
      <div style={{ ...card, padding: 24 }}>
        <h2 style={{ margin: '0 0 18px', fontSize: 17, fontWeight: 700, color: TEXT }}>Library Statistics</h2>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'Books Borrowed This Year', value: '12', color: ACCENT },
            { label: 'Fines Paid', value: '₹30', color: '#ef4444' },
            { label: 'Active Reservations', value: '2', color: '#16a34a' },
          ].map(stat => (
            <div key={stat.label} style={{ flex: 1, background: BG, borderRadius: 10, padding: '18px 20px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
