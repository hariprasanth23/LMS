import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdAdd, MdCheck, MdClose, MdBeachAccess } from 'react-icons/md'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

const LEAVE_TYPES = ['CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY', 'UNPAID']

function StatusBadge({ status }) {
  const config = {
    PENDING: { bg: '#fffbeb', color: '#f59e0b' },
    APPROVED: { bg: '#f0fdf4', color: '#10b981' },
    REJECTED: { bg: '#fef2f2', color: '#ef4444' },
    CANCELLED: { bg: '#f8fafc', color: MUTED }
  }
  const s = config[status] || config.PENDING
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, fontFamily: 'system-ui, sans-serif' }}>
      {status}
    </span>
  )
}

export default function Leaves() {
  const { user } = useAuth()
  const [leaves, setLeaves] = useState([])
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ leaveType: 'CASUAL', fromDate: '', toDate: '', reason: '' })
  const [submitting, setSubmitting] = useState(false)
  const [rejectModal, setRejectModal] = useState(null)
  const [reviewNote, setReviewNote] = useState('')

  const isAdmin = user?.role === 'ADMIN'

  const fetchData = async () => {
    try {
      const [lRes, bRes] = await Promise.allSettled([
        api.get(isAdmin ? '/leaves' : '/leaves/my'),
        api.get('/leaves/balance')
      ])
      if (lRes.status === 'fulfilled') setLeaves(lRes.value.data.data || [])
      if (bRes.status === 'fulfilled') setBalance(bRes.value.data.data)
    } catch {
      toast.error('Failed to load leaves')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!form.leaveType || !form.fromDate || !form.toDate) {
      toast.error('Please fill in all required fields')
      return
    }
    if (new Date(form.toDate) < new Date(form.fromDate)) {
      toast.error('End date must be after start date')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/leaves', form)
      toast.success('Leave request submitted!')
      setShowModal(false)
      setForm({ leaveType: 'CASUAL', fromDate: '', toDate: '', reason: '' })
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit leave request')
    } finally {
      setSubmitting(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await api.put(`/leaves/${id}/approve`, {})
      toast.success('Leave approved')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve')
    }
  }

  const handleReject = async () => {
    try {
      await api.put(`/leaves/${rejectModal.id}/reject`, { reviewNote })
      toast.success('Leave rejected')
      setRejectModal(null)
      setReviewNote('')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject')
    }
  }

  const calcDays = (from, to) => {
    if (!from || !to) return 0
    const d = Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1
    return d > 0 ? d : 0
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
    borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif',
    color: TEXT, outline: 'none', boxSizing: 'border-box'
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>
            {isAdmin ? 'Leave Management' : 'My Leaves'}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>
            {leaves.length} {isAdmin ? 'total' : ''} requests
          </p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
              background: ACCENT, color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer'
            }}
          >
            <MdAdd size={18} /> Apply for Leave
          </button>
        )}
      </div>

      {/* Balance cards (non-admin) */}
      {!isAdmin && balance && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Casual Leave', value: balance.casualBalance, color: ACCENT, bg: '#eef2ff' },
            { label: 'Sick Leave', value: balance.sickBalance, color: '#10b981', bg: '#f0fdf4' },
            { label: 'Earned Leave', value: balance.earnedBalance, color: '#f59e0b', bg: '#fffbeb' }
          ].map(item => (
            <div key={item.label} style={{
              background: '#fff', borderRadius: 12, padding: '16px 20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flex: 1, minWidth: 130
            }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 28, fontWeight: 700, color: item.color }}>{item.value}</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: MUTED, marginTop: 4 }}>{item.label} remaining</div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: MUTED }}>Loading...</div>
        ) : leaves.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <MdBeachAccess style={{ fontSize: 44, opacity: 0.3, display: 'block', margin: '0 auto 10px', color: ACCENT }} />
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: MUTED }}>No leave requests yet</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {[isAdmin ? 'Employee' : null, 'Type', 'From', 'To', 'Days', 'Reason', 'Status', isAdmin ? 'Actions' : null].filter(Boolean).map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaves.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid #f8fafc' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  {isAdmin && <td style={{ padding: '12px 16px', color: TEXT }}>{l.employeeId?.slice(0, 8)}...</td>}
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                      background: '#f8fafc', color: MUTED, fontFamily: 'system-ui, sans-serif'
                    }}>
                      {l.leaveType}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: TEXT }}>{l.fromDate}</td>
                  <td style={{ padding: '12px 16px', color: TEXT }}>{l.toDate}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: ACCENT }}>{calcDays(l.fromDate, l.toDate)}</td>
                  <td style={{ padding: '12px 16px', color: MUTED, maxWidth: 160 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.reason || '-'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={l.status} /></td>
                  {isAdmin && (
                    <td style={{ padding: '12px 16px' }}>
                      {l.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => handleApprove(l.id)}
                            style={{ padding: '5px 10px', background: '#f0fdf4', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#10b981', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <MdCheck size={14} /> Approve
                          </button>
                          <button
                            onClick={() => { setRejectModal(l); setReviewNote('') }}
                            style={{ padding: '5px 10px', background: '#fef2f2', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#ef4444', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <MdClose size={14} /> Reject
                          </button>
                        </div>
                      )}
                      {l.reviewNote && l.status !== 'PENDING' && (
                        <span style={{ fontSize: 11, color: MUTED, fontStyle: 'italic' }}>{l.reviewNote}</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 460 }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>Apply for Leave</h2>
            <form onSubmit={handleApply}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif' }}>Leave Type *</label>
                <select value={form.leaveType} onChange={e => setForm({ ...form, leaveType: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif' }}>From Date *</label>
                  <input type="date" value={form.fromDate} onChange={e => setForm({ ...form, fromDate: e.target.value })} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif' }}>To Date *</label>
                  <input type="date" value={form.toDate} onChange={e => setForm({ ...form, toDate: e.target.value })} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              </div>
              {form.fromDate && form.toDate && (
                <div style={{ marginBottom: 14, fontFamily: 'system-ui, sans-serif', fontSize: 13, color: ACCENT, fontWeight: 600 }}>
                  Duration: {calcDays(form.fromDate, form.toDate)} day(s)
                </div>
              )}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif' }}>Reason</label>
                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Reason for leave..." />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer', color: MUTED }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '10px', background: submitting ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 400 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>Reject Leave Request</h2>
            <p style={{ margin: '0 0 18px', fontSize: 13, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>
              {rejectModal.leaveType} leave: {rejectModal.fromDate} to {rejectModal.toDate}
            </p>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, fontFamily: 'system-ui, sans-serif' }}>Reason for rejection</label>
              <textarea
                value={reviewNote}
                onChange={e => setReviewNote(e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Provide a reason..."
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setRejectModal(null)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer', color: MUTED }}>Cancel</button>
              <button onClick={handleReject} style={{ flex: 1, padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
