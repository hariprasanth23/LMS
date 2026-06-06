import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdAdd, MdSearch, MdDownload, MdEdit, MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md'
import PageHeader from '../../components/common/PageHeader'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

const AVATAR_COLORS = [
  ['#eef2ff', '#6366f1'],
  ['#f0fdf4', '#10b981'],
  ['#fffbeb', '#f59e0b'],
  ['#fef2f2', '#ef4444'],
  ['#f0f9ff', '#0ea5e9'],
  ['#fdf4ff', '#a855f7'],
]

function getInitials(name = '') {
  return name.trim().split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() || '?'
}

function AvatarCircle({ name, index }) {
  const [bg, fg] = AVATAR_COLORS[index % AVATAR_COLORS.length]
  return (
    <div style={{
      width: 34, height: 34, borderRadius: '50%',
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 800, flexShrink: 0, letterSpacing: 0.5
    }}>
      {getInitials(name)}
    </div>
  )
}

const EMPTY_FORM = { rollNumber: '', name: '', email: '', phone: '', departmentId: '', semester: '', section: '' }
const PAGE_SIZE = 10

export default function Students() {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editStudent, setEditStudent] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const searchRef = useRef(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students')
      setStudents(res.data.data || [])
    } catch {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStudents() }, [])

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [search, statusFilter])

  const filtered = students.filter(s => {
    const matchSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && (s.status === 'ACTIVE' || !s.status)) ||
      (statusFilter === 'INACTIVE' && s.status === 'INACTIVE')
    return matchSearch && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const openAdd = () => {
    setEditStudent(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (s) => {
    setEditStudent(s)
    setForm({
      rollNumber: s.rollNumber || '',
      name: s.name || '',
      email: s.email || '',
      phone: s.phone || '',
      departmentId: s.departmentId || '',
      semester: s.semester || '',
      section: s.section || ''
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.rollNumber || !form.name) { toast.error('Roll number and name are required'); return }
    setSubmitting(true)
    try {
      if (editStudent) {
        await api.put(`/students/${editStudent.id}`, form)
        toast.success('Student updated successfully')
      } else {
        await api.post('/students', form)
        toast.success('Student created successfully')
      }
      setShowModal(false)
      setForm(EMPTY_FORM)
      setEditStudent(null)
      fetchStudents()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save student')
    } finally {
      setSubmitting(false)
    }
  }

  const exportCSV = () => {
    const headers = ['Roll Number', 'Name', 'Email', 'Phone', 'Semester', 'Section', 'Status']
    const rows = filtered.map(s => [
      s.rollNumber || '',
      s.name || '',
      s.email || '',
      s.phone || '',
      s.semester || '',
      s.section || '',
      s.status || 'ACTIVE'
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'students.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${filtered.length} students`)
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
    borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif',
    color: TEXT, outline: 'none', boxSizing: 'border-box', background: '#fff'
  }

  const statusCounts = {
    ALL: students.length,
    ACTIVE: students.filter(s => s.status === 'ACTIVE' || !s.status).length,
    INACTIVE: students.filter(s => s.status === 'INACTIVE').length
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <PageHeader
        title="Students"
        badge="Directory"
        subtitle={`${students.length} total enrolled students`}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={exportCSV}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 14px', background: '#fff', color: TEXT,
                border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13,
                fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer'
              }}
            >
              <MdDownload size={16} /> Export CSV
            </button>
            {user?.role === 'ADMIN' && (
              <button
                onClick={openAdd}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '9px 16px', background: ACCENT, color: '#fff',
                  border: 'none', borderRadius: 8, fontSize: 13,
                  fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer'
                }}
              >
                <MdAdd size={18} /> Add Student
              </button>
            )}
          </div>
        }
      />

      {/* Search + filters row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
        {/* Search bar */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220, width: isMobile ? '100%' : undefined }}>
          <MdSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 18, pointerEvents: 'none' }} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search by name, roll number or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 36px 10px 38px',
              border: '1px solid #e2e8f0', borderRadius: 9,
              fontSize: 13, fontFamily: 'system-ui, sans-serif',
              color: TEXT, outline: 'none', boxSizing: 'border-box',
              background: '#fff', transition: 'border-color 0.15s'
            }}
            onFocus={e => e.target.style.borderColor = ACCENT}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
          {search && (
            <button
              onClick={() => { setSearch(''); searchRef.current?.focus() }}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, display: 'flex', alignItems: 'center', padding: 2 }}
            >
              <MdClose size={16} />
            </button>
          )}
        </div>

        {/* Status filter chips */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['ALL', 'ACTIVE', 'INACTIVE'].map(s => {
            const active = statusFilter === s
            const chipColors = {
              ALL: [ACCENT, '#eef2ff'],
              ACTIVE: ['#10b981', '#f0fdf4'],
              INACTIVE: ['#64748b', '#f1f5f9']
            }
            const [color, bg] = chipColors[s]
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '7px 14px', borderRadius: 20, border: active ? `1.5px solid ${color}` : '1.5px solid #e2e8f0',
                  background: active ? bg : '#fff',
                  color: active ? color : MUTED,
                  fontSize: 12, fontWeight: 700, fontFamily: 'system-ui, sans-serif',
                  cursor: 'pointer', transition: 'all 0.15s',
                  letterSpacing: 0.3
                }}
              >
                {s === 'ALL' ? 'All' : s === 'ACTIVE' ? 'Active' : 'Inactive'}
                <span style={{
                  marginLeft: 6, background: active ? color : '#e2e8f0',
                  color: active ? '#fff' : MUTED,
                  borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 800
                }}>
                  {statusCounts[s]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Table card */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: MUTED }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
            Loading students…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 56, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 6 }}>No students found</div>
            <div style={{ fontSize: 13, color: MUTED }}>
              {search ? `No results for "${search}"` : 'No students match the current filter'}
            </div>
            {(search || statusFilter !== 'ALL') && (
              <button
                onClick={() => { setSearch(''); setStatusFilter('ALL') }}
                style={{ marginTop: 16, padding: '8px 18px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['#', 'Student', 'Email', 'Phone', 'Sem', 'Status', ''].map((h, i) => (
                      <th key={i} style={{
                        padding: '11px 16px', textAlign: 'left', color: MUTED,
                        fontWeight: 700, fontSize: 11, borderBottom: '1px solid #f1f5f9',
                        letterSpacing: 0.5, textTransform: 'uppercase'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((s, idx) => {
                    const globalIdx = (safePage - 1) * PAGE_SIZE + idx
                    return (
                      <tr
                        key={s.id}
                        style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8f9ff'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}
                      >
                        <td style={{ padding: '12px 16px', color: MUTED, fontWeight: 600, fontSize: 12 }}>
                          {s.rollNumber}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <AvatarCircle name={s.name} index={globalIdx} />
                            <div>
                              <div style={{ fontWeight: 600, color: TEXT }}>{s.name}</div>
                              {s.section && <div style={{ fontSize: 11, color: MUTED }}>Section {s.section}</div>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', color: MUTED }}>{s.email || '—'}</td>
                        <td style={{ padding: '12px 16px', color: MUTED }}>{s.phone || '—'}</td>
                        <td style={{ padding: '12px 16px', color: MUTED }}>{s.semester ? `Sem ${s.semester}` : '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                            background: (s.status === 'ACTIVE' || !s.status) ? '#f0fdf4' : '#f8fafc',
                            color: (s.status === 'ACTIVE' || !s.status) ? '#10b981' : MUTED
                          }}>
                            {s.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <Link to={`/students/${s.id}`} style={{
                              color: ACCENT, fontSize: 12, fontWeight: 600, textDecoration: 'none',
                              padding: '4px 10px', borderRadius: 6, background: '#eef2ff'
                            }}>
                              View
                            </Link>
                            {user?.role === 'ADMIN' && (
                              <button
                                onClick={() => openEdit(s)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 4,
                                  color: MUTED, fontSize: 12, fontWeight: 600, background: '#f8fafc',
                                  border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer'
                                }}
                              >
                                <MdEdit size={13} /> Edit
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{
              padding: '12px 20px', borderTop: '1px solid #f1f5f9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: 8
            }}>
              <span style={{ fontSize: 13, color: MUTED }}>
                Showing {Math.min((safePage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} students
              </span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 12px', borderRadius: 7,
                    background: safePage === 1 ? '#f8fafc' : '#fff',
                    border: '1px solid #e2e8f0', color: safePage === 1 ? '#c0ccd8' : TEXT,
                    fontSize: 13, fontWeight: 600, cursor: safePage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <MdChevronLeft size={16} /> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('...')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: MUTED, fontSize: 13 }}>…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        style={{
                          width: 32, height: 32, borderRadius: 7,
                          background: safePage === p ? ACCENT : '#fff',
                          border: `1px solid ${safePage === p ? ACCENT : '#e2e8f0'}`,
                          color: safePage === p ? '#fff' : TEXT,
                          fontSize: 13, fontWeight: 700, cursor: 'pointer'
                        }}
                      >
                        {p}
                      </button>
                    )
                  )
                }
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 12px', borderRadius: 7,
                    background: safePage === totalPages ? '#f8fafc' : '#fff',
                    border: '1px solid #e2e8f0', color: safePage === totalPages ? '#c0ccd8' : TEXT,
                    fontSize: 13, fontWeight: 600, cursor: safePage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next <MdChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div style={{
            background: '#fff', borderRadius: 16, padding: 28,
            width: '100%', maxWidth: isMobile ? '95vw' : 500, maxHeight: '92vh',
            overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                {editStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: MUTED }}
              >
                <MdClose size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
                {[
                  ['Roll Number *', 'rollNumber', 'text', '2'],
                  ['Full Name *', 'name', 'text', '2'],
                  ['Email', 'email', 'email', '2'],
                  ['Phone', 'phone', 'tel', '1'],
                  ['Semester', 'semester', 'number', '1'],
                  ['Section', 'section', 'text', '1'],
                ].map(([label, name, type, span]) => (
                  <div key={name} style={{ gridColumn: isMobile ? 'span 1' : `span ${span}` }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>{label}</label>
                    <input
                      type={type}
                      value={form[name]}
                      onChange={e => setForm({ ...form, [name]: e.target.value })}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = ACCENT}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '11px', background: '#f1f5f9', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', color: MUTED }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 2, padding: '11px', background: submitting ? '#a5b4fc' : ACCENT,
                    color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  {submitting ? 'Saving…' : editStudent ? 'Save Changes' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
