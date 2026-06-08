import React, { useState, useEffect, useMemo } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdAdd, MdCheck, MdClose, MdBeachAccess, MdChevronLeft, MdChevronRight, MdUpload } from 'react-icons/md'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

const LEAVE_TYPES = ['CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY', 'UNPAID']

const LEAVE_TYPE_COLORS = {
  CASUAL:    { bg: '#eef2ff', color: ACCENT },
  SICK:      { bg: '#fef2f2', color: '#ef4444' },
  EARNED:    { bg: '#f0fdf4', color: '#10b981' },
  MATERNITY: { bg: '#fdf4ff', color: '#a855f7' },
  PATERNITY: { bg: '#f0f9ff', color: '#0ea5e9' },
  UNPAID:    { bg: '#f8fafc', color: MUTED },
}

const STATUS_CONFIG = {
  PENDING:   { bg: '#fffbeb', color: '#f59e0b' },
  APPROVED:  { bg: '#f0fdf4', color: '#10b981' },
  REJECTED:  { bg: '#fef2f2', color: '#ef4444' },
  CANCELLED: { bg: '#f8fafc', color: MUTED },
}

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, fontFamily: 'system-ui, sans-serif', whiteSpace: 'nowrap' }}>
      {status}
    </span>
  )
}

function LeaveTypeBadge({ type }) {
  const c = LEAVE_TYPE_COLORS[type] || { bg: '#f8fafc', color: MUTED }
  return (
    <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.bg, color: c.color, fontFamily: 'system-ui, sans-serif', whiteSpace: 'nowrap' }}>
      {type}
    </span>
  )
}

function AvatarCircle({ name, size = 34 }) {
  const colors = [['#eef2ff', ACCENT], ['#f0fdf4', '#10b981'], ['#fffbeb', '#f59e0b'], ['#fef2f2', '#ef4444'], ['#f0f9ff', '#0ea5e9']]
  const [bg, color] = colors[(name?.charCodeAt(0) || 0) % colors.length]
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: size * 0.4, fontWeight: 700, color, fontFamily: 'system-ui, sans-serif' }}>
      {name?.charAt(0)?.toUpperCase() || '?'}
    </div>
  )
}

const calcDays = (from, to) => {
  if (!from || !to) return 0
  const d = Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1
  return d > 0 ? d : 0
}

// Mini calendar helpers
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function MiniCalendar({ leaves }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  // Build a map of date -> status for leave dots
  const leaveDates = useMemo(() => {
    const map = {}
    leaves.forEach(l => {
      if (!l.fromDate || !l.toDate) return
      const from = new Date(l.fromDate)
      const to = new Date(l.toDate)
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().slice(0, 10)
        if (!map[key]) map[key] = []
        map[key].push(l.status)
      }
    })
    return map
  }, [leaves])

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const statusDotColor = (statuses) => {
    if (statuses.includes('APPROVED')) return '#10b981'
    if (statuses.includes('PENDING')) return '#f59e0b'
    if (statuses.includes('REJECTED')) return '#ef4444'
    return MUTED
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '16px 18px', minWidth: 260 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4, borderRadius: 6, display: 'flex' }}>
          <MdChevronLeft size={18} />
        </button>
        <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, fontWeight: 700, color: TEXT }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4, borderRadius: 6, display: 'flex' }}>
          <MdChevronRight size={18} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center' }}>
        {DAYS.map(d => (
          <div key={d} style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, fontWeight: 700, color: MUTED, padding: '2px 0', marginBottom: 2 }}>{d}</div>
        ))}
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />
          const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const statuses = leaveDates[dateKey]
          const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
          return (
            <div key={day} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '3px 2px', borderRadius: 6,
              background: isToday ? '#eef2ff' : 'transparent'
            }}>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: isToday ? ACCENT : TEXT, fontWeight: isToday ? 700 : 400 }}>{day}</span>
              {statuses && (
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusDotColor(statuses), marginTop: 1 }} />
              )}
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[['#10b981', 'Approved'], ['#f59e0b', 'Pending'], ['#ef4444', 'Rejected']].map(([c, l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'system-ui, sans-serif', fontSize: 10, color: MUTED }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
            {l}
          </div>
        ))}
      </div>
    </div>
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
  const [confirmAction, setConfirmAction] = useState(null) // { type: 'approve'|'reject', leave }
  const [reviewNote, setReviewNote] = useState('')
  const [activeTab, setActiveTab] = useState('ALL')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const isAdmin = user?.role === 'ADMIN'
  const isFaculty = user?.role === 'FACULTY'
  const isAdminOrFaculty = isAdmin || isFaculty

  const fetchData = async () => {
    try {
      const [lRes, bRes] = await Promise.allSettled([
        api.get(isAdminOrFaculty ? '/leaves' : '/leaves/my'),
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
      setConfirmAction(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve')
    }
  }

  const handleReject = async () => {
    try {
      await api.put(`/leaves/${confirmAction.leave.id}/reject`, { reviewNote })
      toast.success('Leave rejected')
      setConfirmAction(null)
      setReviewNote('')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject')
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
    borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif',
    color: TEXT, outline: 'none', boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif'
  }

  const TABS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']

  const filteredLeaves = activeTab === 'ALL' ? leaves : leaves.filter(l => l.status === activeTab)

  // Balance display values (use API data if available, else fallback)
  const balanceCards = balance ? [
    { label: 'Casual Leave', used: balance.casualUsed ?? 0, total: balance.casualTotal ?? 12, color: ACCENT, bg: '#eef2ff', border: '#c7d2fe' },
    { label: 'Sick Leave', used: balance.sickUsed ?? 0, total: balance.sickTotal ?? 10, color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
    { label: 'Earned Leave', used: balance.earnedUsed ?? 0, total: balance.earnedTotal ?? 15, color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0' },
  ] : [
    { label: 'Casual Leave', used: 7, total: 12, color: ACCENT, bg: '#eef2ff', border: '#c7d2fe' },
    { label: 'Sick Leave', used: 2, total: 10, color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
    { label: 'Earned Leave', used: 1, total: 15, color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0' },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT }}>
            {isAdminOrFaculty ? 'Leave Management' : 'My Leaves'}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED }}>
            {leaves.length} {isAdminOrFaculty ? 'total' : ''} requests
          </p>
        </div>
        {!isAdminOrFaculty && (
          <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <MdAdd size={18} /> Apply for Leave
          </button>
        )}
      </div>

      {/* Non-admin layout: balance cards + calendar on the right */}
      {!isAdminOrFaculty && (
        <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row' }}>
          {/* Balance cards */}
          <div style={{ display: isMobile ? 'grid' : 'flex', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : undefined, flexDirection: isMobile ? undefined : 'column', gap: 12, flex: 1, minWidth: 240 }}>
            {balanceCards.map(item => {
              const remaining = item.total - item.used
              const pct = Math.round((item.used / item.total) * 100)
              return (
                <div key={item.label} style={{
                  background: '#fff', borderRadius: 12, padding: '16px 20px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: `1px solid ${item.border}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{remaining} <span style={{ fontWeight: 400, color: MUTED, fontSize: 12 }}>/ {item.total} left</span></div>
                  </div>
                  <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: item.color, borderRadius: 3, transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ marginTop: 5, fontSize: 11, color: MUTED }}>{item.used} used of {item.total} days</div>
                </div>
              )
            })}
          </div>
          {/* Mini Calendar */}
          <MiniCalendar leaves={leaves} />
        </div>
      )}

      {/* Admin/Faculty layout: filter tabs */}
      {isAdminOrFaculty && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 0, background: '#f8fafc', borderRadius: 10, padding: 4, width: 'fit-content', marginBottom: 16 }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600,
                  background: activeTab === tab ? '#fff' : 'transparent',
                  color: activeTab === tab ? ACCENT : MUTED,
                  boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                {tab}
                <span style={{
                  marginLeft: 6, fontSize: 11, fontWeight: 700,
                  background: activeTab === tab ? '#eef2ff' : '#e2e8f0',
                  color: activeTab === tab ? ACCENT : MUTED,
                  padding: '1px 7px', borderRadius: 10
                }}>
                  {tab === 'ALL' ? leaves.length : leaves.filter(l => l.status === tab).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: MUTED }}>Loading...</div>
        ) : filteredLeaves.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <MdBeachAccess style={{ fontSize: 44, opacity: 0.3, display: 'block', margin: '0 auto 10px', color: ACCENT }} />
            <div style={{ fontSize: 14, color: MUTED }}>No {activeTab !== 'ALL' ? activeTab.toLowerCase() : ''} leave requests</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {[isAdminOrFaculty ? 'Employee' : null, 'Type', 'Duration', 'Days', 'Reason', 'Status', isAdminOrFaculty ? 'Actions' : null].filter(Boolean).map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid #f8fafc' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  {isAdminOrFaculty && (
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AvatarCircle name={l.employeeName || l.employeeId} />
                        <div>
                          <div style={{ fontWeight: 600, color: TEXT }}>{l.employeeName || 'Employee'}</div>
                          <div style={{ fontSize: 11, color: MUTED }}>{l.empCode || l.employeeId?.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                  )}
                  <td style={{ padding: '12px 16px' }}><LeaveTypeBadge type={l.leaveType} /></td>
                  <td style={{ padding: '12px 16px', color: TEXT }}>
                    <div style={{ fontWeight: 500 }}>{l.fromDate}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>to {l.toDate}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: ACCENT }}>{calcDays(l.fromDate, l.toDate)}d</td>
                  <td style={{ padding: '12px 16px', color: MUTED, maxWidth: 160 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason || '-'}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={l.status} /></td>
                  {isAdminOrFaculty && (
                    <td style={{ padding: '12px 16px' }}>
                      {l.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => setConfirmAction({ type: 'approve', leave: l })}
                            style={{ padding: '5px 10px', background: '#f0fdf4', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#10b981', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <MdCheck size={14} /> Approve
                          </button>
                          <button
                            onClick={() => { setConfirmAction({ type: 'reject', leave: l }); setReviewNote('') }}
                            style={{ padding: '5px 10px', background: '#fef2f2', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#ef4444', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <MdClose size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        l.reviewNote && <span style={{ fontSize: 11, color: MUTED, fontStyle: 'italic' }}>{l.reviewNote}</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Non-admin: My Leave History label */}
      {!isAdminOrFaculty && leaves.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: TEXT }}>My Leave History</h3>
        </div>
      )}

      {/* Calendar for admin/faculty */}
      {isAdminOrFaculty && leaves.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: TEXT }}>Leave Calendar</h3>
          <MiniCalendar leaves={leaves} />
        </div>
      )}

      {/* Confirmation Dialog (Approve/Reject) */}
      {confirmAction && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: isMobile ? '95vw' : 420 }}>
            {confirmAction.type === 'approve' ? (
              <>
                <h2 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: TEXT }}>Confirm Approval</h2>
                <p style={{ margin: '0 0 20px', fontSize: 13, color: MUTED }}>
                  Approve <strong>{confirmAction.leave.leaveType}</strong> leave for <strong>{confirmAction.leave.employeeName || 'this employee'}</strong>?
                  <br />{confirmAction.leave.fromDate} → {confirmAction.leave.toDate} ({calcDays(confirmAction.leave.fromDate, confirmAction.leave.toDate)} days)
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setConfirmAction(null)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: MUTED }}>Cancel</button>
                  <button onClick={() => handleApprove(confirmAction.leave.id)} style={{ flex: 1, padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Yes, Approve
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: TEXT }}>Reject Leave Request</h2>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: MUTED }}>
                  {confirmAction.leave.leaveType} leave: {confirmAction.leave.fromDate} to {confirmAction.leave.toDate}
                </p>
                <div style={{ marginBottom: 18 }}>
                  <label style={labelStyle}>Reason for rejection</label>
                  <textarea
                    value={reviewNote}
                    onChange={e => setReviewNote(e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    placeholder="Provide a reason..."
                  />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setConfirmAction(null)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: MUTED }}>Cancel</button>
                  <button onClick={handleReject} style={{ flex: 1, padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: isMobile ? '95vw' : 480, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: TEXT }}>Apply for Leave</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED }}><MdClose size={20} /></button>
            </div>
            <form onSubmit={handleApply}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Leave Type *</label>
                <select value={form.leaveType} onChange={e => setForm({ ...form, leaveType: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>From Date *</label>
                  <input type="date" value={form.fromDate} onChange={e => setForm({ ...form, fromDate: e.target.value })} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <div>
                  <label style={labelStyle}>To Date *</label>
                  <input type="date" value={form.toDate} onChange={e => setForm({ ...form, toDate: e.target.value })} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              </div>
              {form.fromDate && form.toDate && (
                <div style={{ marginBottom: 14, fontSize: 13, color: ACCENT, fontWeight: 600 }}>
                  Duration: {calcDays(form.fromDate, form.toDate)} day(s)
                </div>
              )}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Reason *</label>
                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Reason for leave..." />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Upload Document (optional)</label>
                <div style={{
                  border: '2px dashed #e2e8f0', borderRadius: 8, padding: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  cursor: 'pointer', color: MUTED, fontSize: 13
                }}>
                  <MdUpload size={18} />
                  <span>Click to upload or drag & drop</span>
                  <input type="file" style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: MUTED }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '10px', background: submitting ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
