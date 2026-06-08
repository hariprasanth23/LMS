import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'
const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const recStatusColor = (s) => {
  if (s === 'Approved')  return { color: '#16a34a', background: '#dcfce7', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
  if (s === 'Pending')   return { color: '#d97706', background: '#fef3c7', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
  if (s === 'Purchased') return { color: ACCENT,    background: '#eef2ff', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
  return { color: '#ef4444', background: '#fee2e2', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
}

export default function Library() {
  const [issuedBooks, setIssuedBooks] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recForm, setRecForm] = useState({ title: '', author: '', publisher: '', isbn: '', category: 'Textbook', reason: '' })
  const [recSubmitting, setRecSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/services/library/issued'),
      api.get('/services/library/recommendations'),
      api.get('/services/library/stats'),
    ]).then(([booksRes, recsRes, statsRes]) => {
      setIssuedBooks(booksRes.data.data || [])
      setRecommendations(recsRes.data.data || [])
      setStats(statsRes.data.data)
    }).catch(() => toast.error('Failed to load library data'))
      .finally(() => setLoading(false))
  }, [])

  const handleRenew = async (bookId) => {
    try {
      const res = await api.post(`/services/library/renew/${bookId}`)
      setIssuedBooks(prev => prev.map(b => b.id === bookId ? res.data.data : b))
      toast.success('Book renewed!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Renewal failed')
    }
  }

  const handleRecChange = (e) => {
    const { name, value } = e.target
    setRecForm(prev => ({ ...prev, [name]: value }))
  }

  const handleRecSubmit = async (e) => {
    e.preventDefault()
    if (!recForm.title || !recForm.author || !recForm.reason) { toast.error('Fill all required fields'); return }
    setRecSubmitting(true)
    try {
      const res = await api.post('/services/library/recommend', recForm)
      setRecommendations(prev => [res.data.data, ...prev])
      setRecForm({ title: '', author: '', publisher: '', isbn: '', category: 'Textbook', reason: '' })
      toast.success('Recommendation submitted!')
    } catch {
      toast.error('Submission failed')
    } finally {
      setRecSubmitting(false)
    }
  }

  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontFamily: 'system-ui' }}>Loading…</div>

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Services — Library</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Online book recommendations and library services</p>
      </div>

      {/* Issued Books */}
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
              {issuedBooks.map((book, i) => {
                const overdue = book.dueDate && new Date(book.dueDate) < new Date()
                const renewalsLeft = (book.maxRenewals || 2) - (book.renewalsUsed || 0)
                return (
                  <tr key={book.id || i} style={{ borderBottom: '1px solid #f1f5f9', background: overdue ? '#fff7ed' : (i % 2 === 0 ? '#fff' : '#fafafa') }}>
                    <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>
                      {book.title}
                      {overdue && <span style={{ marginLeft: 8, background: '#fee2e2', color: '#ef4444', borderRadius: 5, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>OVERDUE</span>}
                    </td>
                    <td style={{ padding: '12px 14px', color: TEXT }}>{book.author}</td>
                    <td style={{ padding: '12px 14px', color: MUTED, fontFamily: 'monospace', fontSize: 12 }}>{book.isbn}</td>
                    <td style={{ padding: '12px 14px', color: TEXT }}>{book.issueDate}</td>
                    <td style={{ padding: '12px 14px', color: overdue ? '#ef4444' : TEXT, fontWeight: overdue ? 700 : 400 }}>{book.dueDate}</td>
                    <td style={{ padding: '12px 14px', color: renewalsLeft === 0 ? '#ef4444' : TEXT }}>{renewalsLeft}</td>
                    <td style={{ padding: '12px 14px' }}>
                      {renewalsLeft > 0
                        ? <button onClick={() => handleRenew(book.id)}
                            style={{ background: '#eef2ff', color: ACCENT, border: '1px solid #c7d2fe', borderRadius: 6, padding: '5px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                            Renew
                          </button>
                        : <span style={{ color: MUTED, fontSize: 13 }}>No renewals</span>}
                    </td>
                  </tr>
                )
              })}
              {issuedBooks.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 20, textAlign: 'center', color: MUTED }}>No books currently issued</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {issuedBooks.some(b => b.dueDate && new Date(b.dueDate) < new Date()) && (
          <div style={{ marginTop: 12, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '10px 16px', color: '#c2410c', fontSize: 13, fontWeight: 500 }}>
            You have overdue books. Please return them at the earliest to avoid fines.
          </div>
        )}
      </div>

      {/* Book Recommendation Form */}
      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Online Book Recommendation</h2>
        <form onSubmit={handleRecSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Book Title *</label>
              <input type="text" name="title" value={recForm.title} onChange={handleRecChange} required placeholder="Book title" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Author Name *</label>
              <input type="text" name="author" value={recForm.author} onChange={handleRecChange} required placeholder="Author name" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Publisher <span style={{ color: MUTED, fontWeight: 400 }}>(optional)</span></label>
              <input type="text" name="publisher" value={recForm.publisher} onChange={handleRecChange} placeholder="Publisher name" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>ISBN <span style={{ color: MUTED, fontWeight: 400 }}>(optional)</span></label>
              <input type="text" name="isbn" value={recForm.isbn} onChange={handleRecChange} placeholder="e.g. 978-XXXXXXXXXX" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Category</label>
              <select name="category" value={recForm.category} onChange={handleRecChange} style={inputStyle}>
                {['Textbook', 'Reference', 'Fiction', 'Research', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Why do you recommend this book? *</label>
              <textarea name="reason" value={recForm.reason} onChange={handleRecChange} required rows={3}
                placeholder="Explain the relevance and usefulness of this book..."
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
          <button type="submit" disabled={recSubmitting}
            style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            {recSubmitting ? 'Submitting…' : 'Submit Recommendation'}
          </button>
        </form>
      </div>

      {/* My Recommendations */}
      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 18px', fontSize: 17, fontWeight: 700, color: TEXT }}>My Recommendations</h2>
        {recommendations.length === 0 ? (
          <div style={{ color: MUTED, fontSize: 14 }}>No recommendations yet</div>
        ) : (
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
                <tr key={rec.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{rec.title}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{rec.author}</td>
                  <td style={{ padding: '12px 14px', color: MUTED }}>{rec.category}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{rec.submittedAt ? new Date(rec.submittedAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td style={{ padding: '12px 14px' }}><span style={recStatusColor(rec.status)}>{rec.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Library Stats */}
      {stats && (
        <div style={{ ...card, padding: 24 }}>
          <h2 style={{ margin: '0 0 18px', fontSize: 17, fontWeight: 700, color: TEXT }}>Library Statistics</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Books Borrowed', value: stats.booksBorrowed, color: ACCENT },
              { label: 'Overdue Books',  value: stats.overdueCount,  color: '#ef4444' },
              { label: 'Recommendations', value: stats.recommendations, color: '#16a34a' },
            ].map(stat => (
              <div key={stat.label} style={{ flex: 1, minWidth: 120, background: BG, borderRadius: 10, padding: '18px 20px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
