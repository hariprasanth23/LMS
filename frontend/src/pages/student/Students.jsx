import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  MdAdd, MdSearch, MdDownload, MdEdit, MdClose,
  MdChevronLeft, MdChevronRight, MdUploadFile, MdCheckCircle
} from 'react-icons/md'
import PageHeader from '../../components/common/PageHeader'
import CsvImportModal from '../../components/common/CsvImportModal'

const TEXT   = '#1e293b'
const MUTED  = '#64748b'
const ACCENT = '#6366f1'

const AVATAR_COLORS = [
  ['#eef2ff', '#6366f1'], ['#f0fdf4', '#10b981'], ['#fffbeb', '#f59e0b'],
  ['#fef2f2', '#ef4444'], ['#f0f9ff', '#0ea5e9'], ['#fdf4ff', '#a855f7'],
]

function getInitials(name = '') {
  return name.trim().split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() || '?'
}

function AvatarCircle({ name, index }) {
  const [bg, fg] = AVATAR_COLORS[index % AVATAR_COLORS.length]
  return (
    <div style={{ width: 34, height: 34, borderRadius: '50%', background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0, letterSpacing: 0.5 }}>
      {getInitials(name)}
    </div>
  )
}

const EMPTY_FORM = {
  name: '', email: '', phone: '',
  rollNumber: '', departmentId: '', program: '', semester: '', section: '',
  batch: '', admissionYear: '',
  dateOfBirth: '', gender: '', bloodGroup: '', category: '', aadhaarNumber: '',
  address: '',
  fatherName: '', motherName: '', parentPhone: '',
  guardianName: '', guardianPhone: '',
  emergencyContactName: '', emergencyContactPhone: '',
}

const PAGE_SIZE = 10

// ── Shared form primitives ─────────────────────────────────────────────────────
function Field({ label, required, span = 1, children }) {
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>
        {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
    </div>
  )
}

function SectionHeading({ text }) {
  return (
    <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 0' }}>
      <span style={{ fontSize: 10, fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: 1 }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
    </div>
  )
}

// ── Step indicator ─────────────────────────────────────────────────────────────
const STEPS = ['Identity & Academics', 'Personal Details', 'Family & Emergency']

function StepBar({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 20 }}>
      {STEPS.map((label, i) => {
        const done = current > i + 1
        const active = current === i + 1
        return (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ flex: 1, height: 2, marginTop: 11, background: done ? ACCENT : '#e2e8f0', transition: 'background 0.3s' }} />}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: done || active ? ACCENT : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s', boxShadow: active ? '0 0 0 3px #eef2ff' : 'none' }}>
                {done
                  ? <MdCheckCircle style={{ color: '#fff', fontSize: 15 }} />
                  : <span style={{ fontSize: 11, fontWeight: 800, color: active ? '#fff' : '#94a3b8' }}>{i + 1}</span>
                }
              </div>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? ACCENT : done ? '#64748b' : '#94a3b8', textAlign: 'center', lineHeight: 1.3, maxWidth: 70 }}>{label}</span>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function Students() {
  const { user } = useAuth()
  const [students, setStudents]         = useState([])
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading]           = useState(true)
  const [showModal, setShowModal]       = useState(false)
  const [showImport, setShowImport]     = useState(false)
  const [editStudent, setEditStudent]   = useState(null)
  const [form, setForm]                 = useState(EMPTY_FORM)
  const [submitting, setSubmitting]     = useState(false)
  const [page, setPage]                 = useState(1)
  const [createdPassword, setCreatedPassword] = useState(null)
  const [formStep, setFormStep]         = useState(1)
  const [departments, setDepartments]   = useState([])
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
    } catch { toast.error('Failed to load students') }
    finally   { setLoading(false) }
  }

  useEffect(() => { fetchStudents() }, [])
  useEffect(() => { setPage(1) }, [search, statusFilter])
  useEffect(() => {
    api.get('/departments').then(r => setDepartments(r.data.data || [])).catch(() => {})
  }, [])

  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = s.name?.toLowerCase().includes(q) || s.rollNumber?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE'   && (s.status === 'ACTIVE' || !s.status)) ||
      (statusFilter === 'INACTIVE' && s.status === 'INACTIVE')
    return matchSearch && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const openAdd = () => {
    setEditStudent(null); setCreatedPassword(null)
    setForm(EMPTY_FORM); setFormStep(1); setShowModal(true)
  }

  const openEdit = (s) => {
    setEditStudent(s); setCreatedPassword(null)
    setForm({
      name: s.name || '', email: s.email || '', phone: s.phone || '',
      rollNumber: s.rollNumber || '', departmentId: s.departmentId || '',
      program: s.program || '', semester: s.semester || '', section: s.section || '',
      batch: s.batch || '', admissionYear: s.admissionYear || '',
      dateOfBirth: s.dateOfBirth || '', gender: s.gender || '',
      bloodGroup: s.bloodGroup || '', category: s.category || '',
      aadhaarNumber: s.aadhaarNumber || '',
      address: s.address || '',
      fatherName: s.fatherName || '', motherName: s.motherName || '',
      parentPhone: s.parentPhone || '',
      guardianName: s.guardianName || '', guardianPhone: s.guardianPhone || '',
      emergencyContactName: s.emergencyContactName || '',
      emergencyContactPhone: s.emergencyContactPhone || '',
    })
    setFormStep(1); setShowModal(true)
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleNext = () => {
    if (formStep === 1) {
      if (!form.rollNumber || !form.name) { toast.error('Roll number and name are required'); return }
      if (!editStudent && !form.email)    { toast.error('Email is required for new students');  return }
    }
    setFormStep(s => s + 1)
  }

  const buildPayload = () => ({
    ...form,
    // Backend expects Integer/null — never send an empty string for number fields
    semester:      form.semester      !== '' ? Number(form.semester)      : null,
    admissionYear: form.admissionYear !== '' ? Number(form.admissionYear) : null,
    departmentId:  form.departmentId  !== '' ? form.departmentId          : null,
  })

  const handleSubmit = async () => {
    if (!form.rollNumber || !form.name) {
      toast.error('Roll number and name are required')
      setFormStep(1)
      return
    }
    setSubmitting(true)
    try {
      const payload = buildPayload()
      if (editStudent) {
        await api.put(`/students/${editStudent.id}`, payload)
        toast.success('Student updated')
        setShowModal(false); setForm(EMPTY_FORM); setEditStudent(null)
        fetchStudents()
      } else {
        const res = await api.post('/students', payload)
        const pwd = res.data.data?.initialPassword
        setCreatedPassword(pwd)
        toast.success('Student created')
        fetchStudents()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save student')
    } finally { setSubmitting(false) }
  }

  const exportCSV = () => {
    const headers = ['Roll Number', 'Name', 'Email', 'Phone', 'Program', 'Sem', 'Section', 'Batch', 'Admission Year', 'DOB', 'Gender', 'Blood Group', 'Category', 'Father', 'Mother', 'Parent Phone', 'Guardian', 'Guardian Phone', 'Emergency Contact', 'Emergency Phone', 'Address', 'Status']
    const rows = filtered.map(s => [
      s.rollNumber || '', s.name || '', s.email || '', s.phone || '',
      s.program || '', s.semester || '', s.section || '',
      s.batch || '', s.admissionYear || '', s.dateOfBirth || '',
      s.gender || '', s.bloodGroup || '', s.category || '',
      s.fatherName || '', s.motherName || '', s.parentPhone || '',
      s.guardianName || '', s.guardianPhone || '',
      s.emergencyContactName || '', s.emergencyContactPhone || '',
      s.address || '', s.status || 'ACTIVE',
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'students.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${filtered.length} students`)
  }

  const inp = {
    width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
    borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif',
    color: TEXT, outline: 'none', boxSizing: 'border-box', background: '#fff',
  }
  const onFocus = e => { e.target.style.borderColor = ACCENT }
  const onBlur  = e => { e.target.style.borderColor = '#e2e8f0' }

  const statusCounts = {
    ALL:      students.length,
    ACTIVE:   students.filter(s => s.status === 'ACTIVE' || !s.status).length,
    INACTIVE: students.filter(s => s.status === 'INACTIVE').length,
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <PageHeader
        title="Students"
        badge="Directory"
        subtitle={`${students.length} total enrolled students`}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: '#fff', color: TEXT, border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <MdDownload size={16} /> Export CSV
            </button>
            {user?.role === 'ADMIN' && (<>
              <button onClick={() => setShowImport(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: '#fff', color: '#6366f1', border: '1.5px solid #c7d2fe', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <MdUploadFile size={16} /> Import CSV
              </button>
              <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <MdAdd size={18} /> Add Student
              </button>
            </>)}
          </div>
        }
      />

      {/* Search + status filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220, width: isMobile ? '100%' : undefined }}>
          <MdSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 18, pointerEvents: 'none' }} />
          <input ref={searchRef} type="text" placeholder="Search by name, roll number or email…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 36px 10px 38px', border: '1px solid #e2e8f0', borderRadius: 9, fontSize: 13, fontFamily: 'system-ui, sans-serif', color: TEXT, outline: 'none', boxSizing: 'border-box', background: '#fff' }}
            onFocus={onFocus} onBlur={onBlur}
          />
          {search && (
            <button onClick={() => { setSearch(''); searchRef.current?.focus() }} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, display: 'flex', alignItems: 'center', padding: 2 }}>
              <MdClose size={16} />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['ALL', 'ACTIVE', 'INACTIVE'].map(s => {
            const active = statusFilter === s
            const [color, bg] = { ALL: [ACCENT, '#eef2ff'], ACTIVE: ['#10b981', '#f0fdf4'], INACTIVE: ['#64748b', '#f1f5f9'] }[s]
            return (
              <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '7px 14px', borderRadius: 20, border: active ? `1.5px solid ${color}` : '1.5px solid #e2e8f0', background: active ? bg : '#fff', color: active ? color : MUTED, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                {s === 'ALL' ? 'All' : s === 'ACTIVE' ? 'Active' : 'Inactive'}
                <span style={{ marginLeft: 6, background: active ? color : '#e2e8f0', color: active ? '#fff' : MUTED, borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 800 }}>{statusCounts[s]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: MUTED }}><div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>Loading students…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 56, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 6 }}>No students found</div>
            <div style={{ fontSize: 13, color: MUTED }}>{search ? `No results for "${search}"` : 'No students match the current filter'}</div>
            {(search || statusFilter !== 'ALL') && <button onClick={() => { setSearch(''); setStatusFilter('ALL') }} style={{ marginTop: 16, padding: '8px 18px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Clear filters</button>}
          </div>
        ) : (<>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 780 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['#', 'Student', 'Program / Sem', 'Email', 'Phone', 'Category', 'Status', ''].map((h, i) => (
                    <th key={i} style={{ padding: '11px 16px', textAlign: 'left', color: MUTED, fontWeight: 700, fontSize: 11, borderBottom: '1px solid #f1f5f9', letterSpacing: 0.5, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((s, idx) => {
                  const globalIdx = (safePage - 1) * PAGE_SIZE + idx
                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8f9ff'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={{ padding: '12px 16px', color: MUTED, fontWeight: 600, fontSize: 12 }}>{s.rollNumber}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <AvatarCircle name={s.name} index={globalIdx} />
                          <div>
                            <div style={{ fontWeight: 600, color: TEXT }}>{s.name}</div>
                            {s.section && <div style={{ fontSize: 11, color: MUTED }}>Section {s.section}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: MUTED }}>
                        <div style={{ fontWeight: 600, color: TEXT, fontSize: 12 }}>{s.program || '—'}</div>
                        {s.semester && <div style={{ fontSize: 11 }}>Sem {s.semester}</div>}
                      </td>
                      <td style={{ padding: '12px 16px', color: MUTED }}>{s.email || '—'}</td>
                      <td style={{ padding: '12px 16px', color: MUTED }}>{s.phone || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        {s.category ? <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: '#f1f5f9', color: MUTED }}>{s.category}</span> : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: (s.status === 'ACTIVE' || !s.status) ? '#f0fdf4' : '#f8fafc', color: (s.status === 'ACTIVE' || !s.status) ? '#10b981' : MUTED }}>
                          {s.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <Link to={`/students/${s.id}`} style={{ color: ACCENT, fontSize: 12, fontWeight: 600, textDecoration: 'none', padding: '4px 10px', borderRadius: 6, background: '#eef2ff' }}>View</Link>
                          {user?.role === 'ADMIN' && (
                            <button onClick={() => openEdit(s)} style={{ display: 'flex', alignItems: 'center', gap: 4, color: MUTED, fontSize: 12, fontWeight: 600, background: '#f8fafc', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
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
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 13, color: MUTED }}>
              Showing {Math.min((safePage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} students
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 7, background: safePage === 1 ? '#f8fafc' : '#fff', border: '1px solid #e2e8f0', color: safePage === 1 ? '#c0ccd8' : TEXT, fontSize: 13, fontWeight: 600, cursor: safePage === 1 ? 'not-allowed' : 'pointer' }}>
                <MdChevronLeft size={16} /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .reduce((acc, p, i, arr) => { if (i > 0 && p - arr[i - 1] > 1) acc.push('...'); acc.push(p); return acc }, [])
                .map((p, i) => p === '...'
                  ? <span key={`e${i}`} style={{ padding: '0 4px', color: MUTED, fontSize: 13 }}>…</span>
                  : <button key={p} onClick={() => setPage(p)} style={{ width: 32, height: 32, borderRadius: 7, background: safePage === p ? ACCENT : '#fff', border: `1px solid ${safePage === p ? ACCENT : '#e2e8f0'}`, color: safePage === p ? '#fff' : TEXT, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{p}</button>
                )}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 7, background: safePage === totalPages ? '#f8fafc' : '#fff', border: '1px solid #e2e8f0', color: safePage === totalPages ? '#c0ccd8' : TEXT, fontSize: 13, fontWeight: 600, cursor: safePage === totalPages ? 'not-allowed' : 'pointer' }}>
                Next <MdChevronRight size={16} />
              </button>
            </div>
          </div>
        </>)}
      </div>

      {/* ── Add / Edit Modal — 3-step wizard ──────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={e => { if (e.target === e.currentTarget) { setShowModal(false); setCreatedPassword(null) } }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: isMobile ? '95vw' : 620, maxHeight: '92vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                {editStudent ? 'Edit Student' : 'Enrol New Student'}
              </h2>
              <button onClick={() => { setShowModal(false); setCreatedPassword(null) }}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: MUTED }}>
                <MdClose size={18} />
              </button>
            </div>

            {/* Password reveal after create */}
            {createdPassword && (
              <div style={{ marginBottom: 18, padding: '14px 18px', background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 6 }}>
                  ✅ Student created! Share this initial password with the student:
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 800, color: '#15803d', letterSpacing: 1 }}>{createdPassword}</div>
                <div style={{ fontSize: 11, color: '#4ade80', marginTop: 4 }}>The student should reset this on first login.</div>
                <button onClick={() => { setShowModal(false); setCreatedPassword(null); setForm(EMPTY_FORM) }}
                  style={{ marginTop: 10, padding: '7px 14px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  Done
                </button>
              </div>
            )}

            {!createdPassword && (
              <div>
                {/* Step indicator */}
                <StepBar current={formStep} />

                {/* ── Step 1: Identity & Academics ── */}
                {formStep === 1 && (
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                    <SectionHeading text="Student Identity" />
                    <Field label="Full Name" required span={2}>
                      <input type="text" value={form.name} onChange={set('name')} placeholder="e.g. Arjun Kumar" style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </Field>
                    <Field label="Email" required={!editStudent}>
                      <input type="email" value={form.email} onChange={set('email')} placeholder="student@college.edu" style={inp} onFocus={onFocus} onBlur={onBlur} disabled={!!editStudent} />
                    </Field>
                    <Field label="Phone">
                      <input type="tel" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile" style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </Field>

                    <SectionHeading text="Academic Details" />
                    <Field label="Roll Number" required>
                      <input type="text" value={form.rollNumber} onChange={set('rollNumber')} placeholder="CSE2024001" style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </Field>
                    <Field label="Department" required>
                      <select value={form.departmentId} onChange={set('departmentId')} style={inp}>
                        <option value="">Select Department</option>
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Program">
                      <select value={form.program} onChange={set('program')} style={inp}>
                        <option value="">Select program</option>
                        {['B.Tech', 'B.E.', 'M.Tech', 'M.E.', 'MCA', 'MBA', 'B.Sc', 'M.Sc', 'Ph.D'].map(p => <option key={p}>{p}</option>)}
                      </select>
                    </Field>
                    <Field label="Semester" required>
                      <select value={form.semester} onChange={set('semester')} style={inp}>
                        <option value="">Select</option>
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
                      </select>
                    </Field>
                    <Field label="Section">
                      <select value={form.section} onChange={set('section')} style={inp}>
                        <option value="">Select</option>
                        {['A','B','C','D','E'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Batch">
                      <input type="text" value={form.batch} onChange={set('batch')} placeholder="2024-28" style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </Field>
                    <Field label="Admission Year">
                      <input type="number" value={form.admissionYear} onChange={set('admissionYear')} placeholder="2024" style={inp} onFocus={onFocus} onBlur={onBlur} min={2000} max={2100} />
                    </Field>
                  </div>
                )}

                {/* ── Step 2: Personal Details ── */}
                {formStep === 2 && (
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                    <SectionHeading text="Personal Information" />
                    <Field label="Date of Birth">
                      <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </Field>
                    <Field label="Gender">
                      <select value={form.gender} onChange={set('gender')} style={inp}>
                        <option value="">Select</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other / Prefer not to say</option>
                      </select>
                    </Field>
                    <Field label="Blood Group">
                      <select value={form.bloodGroup} onChange={set('bloodGroup')} style={inp}>
                        <option value="">Select</option>
                        {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}
                      </select>
                    </Field>
                    <Field label="Category">
                      <select value={form.category} onChange={set('category')} style={inp}>
                        <option value="">Select</option>
                        {['GENERAL','OBC','SC','ST','NT','EWS'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Aadhaar Number" span={2}>
                      <input type="text" value={form.aadhaarNumber} onChange={set('aadhaarNumber')} placeholder="12-digit number" maxLength={12} style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </Field>

                    <SectionHeading text="Contact" />
                    <Field label="Address" span={2}>
                      <textarea value={form.address} onChange={set('address')} placeholder="Current / permanent address" rows={3}
                        style={{ ...inp, resize: 'vertical', height: 'auto' }} onFocus={onFocus} onBlur={onBlur} />
                    </Field>
                  </div>
                )}

                {/* ── Step 3: Family & Emergency ── */}
                {formStep === 3 && (
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                    <SectionHeading text="Family Details" />
                    <Field label="Father's Name">
                      <input type="text" value={form.fatherName} onChange={set('fatherName')} style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </Field>
                    <Field label="Mother's Name">
                      <input type="text" value={form.motherName} onChange={set('motherName')} style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </Field>
                    <Field label="Parent Phone">
                      <input type="tel" value={form.parentPhone} onChange={set('parentPhone')} style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </Field>
                    <Field label="Guardian Name">
                      <input type="text" value={form.guardianName} onChange={set('guardianName')} style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </Field>
                    <Field label="Guardian Phone">
                      <input type="tel" value={form.guardianPhone} onChange={set('guardianPhone')} style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </Field>

                    <SectionHeading text="Emergency Contact" />
                    <Field label="Contact Name">
                      <input type="text" value={form.emergencyContactName} onChange={set('emergencyContactName')} style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </Field>
                    <Field label="Contact Phone">
                      <input type="tel" value={form.emergencyContactPhone} onChange={set('emergencyContactPhone')} style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </Field>
                  </div>
                )}

                {/* Navigation buttons */}
                <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                  {formStep > 1 ? (
                    <button type="button" onClick={() => setFormStep(s => s - 1)}
                      style={{ flex: 1, padding: '11px', background: '#f1f5f9', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', color: MUTED }}>
                      ← Back
                    </button>
                  ) : (
                    <button type="button" onClick={() => setShowModal(false)}
                      style={{ flex: 1, padding: '11px', background: '#f1f5f9', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', color: MUTED }}>
                      Cancel
                    </button>
                  )}
                  {formStep < 3 ? (
                    <button type="button" onClick={handleNext}
                      style={{ flex: 2, padding: '11px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                      Next →
                    </button>
                  ) : (
                    <button type="button" onClick={handleSubmit} disabled={submitting}
                      style={{ flex: 2, padding: '11px', background: submitting ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                      {submitting ? 'Saving…' : editStudent ? 'Save Changes' : 'Enrol Student'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CSV Import Modal ────────────────────────────────────────────── */}
      <CsvImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onDone={() => fetchStudents()}
        title="Import Students"
        sampleFile="sample_students.csv"
        columns={[
          { key: 'rollNumber',            label: 'Roll Number',               required: true },
          { key: 'name',                  label: 'Full Name',                 required: true },
          { key: 'email',                 label: 'Email',                     required: true, type: 'email' },
          { key: 'phone',                 label: 'Phone',                     required: false },
          { key: 'departmentId',          label: 'Department ID (1–5)',        required: true,  type: 'number' },
          { key: 'program',               label: 'Program (e.g. B.Tech)',      required: false },
          { key: 'semester',              label: 'Semester (1–8)',             required: true,  type: 'number', min: 1, max: 8 },
          { key: 'section',               label: 'Section (A/B/C)',            required: false },
          { key: 'batch',                 label: 'Batch (e.g. 2024-28)',       required: false },
          { key: 'admissionYear',         label: 'Admission Year',             required: false, type: 'number' },
          { key: 'dateOfBirth',           label: 'Date of Birth (YYYY-MM-DD)', required: false },
          { key: 'gender',                label: 'Gender (MALE/FEMALE/OTHER)', required: false },
          { key: 'bloodGroup',            label: 'Blood Group (A+/B+/O+ …)',   required: false },
          { key: 'category',              label: 'Category (GENERAL/OBC/SC/ST/NT/EWS)', required: false },
          { key: 'aadhaarNumber',         label: 'Aadhaar Number (12 digits)', required: false },
          { key: 'fatherName',            label: "Father's Name",              required: false },
          { key: 'motherName',            label: "Mother's Name",              required: false },
          { key: 'parentPhone',           label: 'Parent Phone',               required: false },
          { key: 'guardianName',          label: 'Guardian Name',              required: false },
          { key: 'guardianPhone',         label: 'Guardian Phone',             required: false },
          { key: 'emergencyContactName',  label: 'Emergency Contact Name',     required: false },
          { key: 'emergencyContactPhone', label: 'Emergency Contact Phone',    required: false },
          { key: 'address',               label: 'Address',                    required: false },
        ]}
        sampleRows={[
          { rollNumber: 'CSE2024001', name: 'Arjun Kumar', email: 'arjun@college.edu', phone: '9876543210', departmentId: 1, program: 'B.Tech', semester: 3, section: 'A', batch: '2024-28', admissionYear: 2024, dateOfBirth: '2006-05-15', gender: 'MALE', bloodGroup: 'O+', category: 'GENERAL', aadhaarNumber: '123456789012', fatherName: 'Ramesh Kumar', motherName: 'Sunita Kumar', parentPhone: '9800001234', guardianName: 'Ramesh Kumar', guardianPhone: '9800001234', emergencyContactName: 'Ramesh Kumar', emergencyContactPhone: '9800001234', address: '12 MG Road, Chennai - 600001' },
          { rollNumber: 'ECE2024001', name: 'Priya Singh', email: 'priya@college.edu', phone: '9123456789', departmentId: 2, program: 'B.Tech', semester: 2, section: 'B', batch: '2024-28', admissionYear: 2024, dateOfBirth: '2005-11-22', gender: 'FEMALE', bloodGroup: 'A+', category: 'OBC', aadhaarNumber: '987654321098', fatherName: 'Vikram Singh', motherName: 'Kavitha Singh', parentPhone: '9700009876', guardianName: 'Vikram Singh', guardianPhone: '9700009876', emergencyContactName: 'Kavitha Singh', emergencyContactPhone: '9700009876', address: '45 Anna Nagar, Chennai - 600040' },
        ]}
        importFn={async (rows) => {
          const payload = rows.map(r => ({
            rollNumber: r.rollNumber, name: r.name, email: r.email,
            phone: r.phone || null,
            departmentId: Number(r.departmentId),
            program: r.program || null, semester: Number(r.semester),
            section: r.section || null, batch: r.batch || null,
            admissionYear: r.admissionYear ? Number(r.admissionYear) : null,
            dateOfBirth: r.dateOfBirth || null, gender: r.gender || null,
            bloodGroup: r.bloodGroup || null, category: r.category || null,
            aadhaarNumber: r.aadhaarNumber || null,
            fatherName: r.fatherName || null, motherName: r.motherName || null,
            parentPhone: r.parentPhone || null,
            guardianName: r.guardianName || null, guardianPhone: r.guardianPhone || null,
            emergencyContactName: r.emergencyContactName || null,
            emergencyContactPhone: r.emergencyContactPhone || null,
            address: r.address || null,
          }))
          const res = await api.post('/students/import', payload)
          return res.data.data
        }}
      />
    </div>
  )
}
