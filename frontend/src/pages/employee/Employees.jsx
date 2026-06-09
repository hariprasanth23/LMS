import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  MdAdd, MdSearch, MdBadge, MdEdit, MdDeleteOutline, MdClose,
  MdPerson, MdEmail, MdPhone, MdWork, MdCalendarToday,
  MdUploadFile, MdCheckCircle
} from 'react-icons/md'
import CsvImportModal from '../../components/common/CsvImportModal'

const TEXT   = '#1e293b'
const MUTED  = '#64748b'
const ACCENT = '#6366f1'

const DESIGNATIONS = [
  'Professor', 'Associate Professor', 'Assistant Professor',
  'Lecturer', 'Lab Instructor', 'Admin Staff', 'Support Staff',
]
const EMP_TYPES  = ['FACULTY', 'STAFF', 'ADMIN']
const DEPARTMENTS = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry',
  'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering',
  'Administration', 'Library', 'Accounts',
]
const AVATAR_COLORS = [
  ['#eef2ff', ACCENT], ['#f0fdf4', '#10b981'], ['#fffbeb', '#f59e0b'],
  ['#fef2f2', '#ef4444'], ['#f0f9ff', '#0ea5e9'], ['#fdf4ff', '#a855f7'],
]

function getAvatarColors(name) {
  const idx = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

function AvatarCircle({ name, size = 40 }) {
  const [bg, color] = getAvatarColors(name)
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'system-ui, sans-serif', fontSize: size * 0.38, fontWeight: 700, color }}>
      {name?.charAt(0)?.toUpperCase() || '?'}
    </div>
  )
}

const typeColors = {
  FACULTY: { bg: '#eef2ff', color: ACCENT },
  STAFF:   { bg: '#fffbeb', color: '#f59e0b' },
  ADMIN:   { bg: '#f0fdf4', color: '#10b981' },
}

// ── Step indicator ─────────────────────────────────────────────────────────────
const EMP_STEPS = ['Basic Information', 'Role & Compensation']

function EmpStepBar({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 20 }}>
      {EMP_STEPS.map((label, i) => {
        const done   = current > i + 1
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
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? ACCENT : done ? '#64748b' : '#94a3b8', textAlign: 'center', lineHeight: 1.3, maxWidth: 80 }}>{label}</span>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

const EMPTY_FORM = {
  empCode: '', name: '', email: '', phone: '',
  designation: 'Professor', employeeType: 'FACULTY',
  department: '', joinDate: '', baseSalary: '', qualifications: '',
}

export default function Employees() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState([])
  const [search, setSearch]       = useState('')
  const [filterDept, setFilterDept]     = useState('')
  const [filterType, setFilterType]     = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy]       = useState('name-asc')
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editEmp, setEditEmp]     = useState(null)
  const [detailEmp, setDetailEmp] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [empStep, setEmpStep]     = useState(1)
  const [isMobile, setIsMobile]   = useState(window.innerWidth <= 768)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees')
      setEmployees(res.data.data || [])
    } catch { toast.error('Failed to load employees') }
    finally   { setLoading(false) }
  }

  useEffect(() => { fetchEmployees() }, [])

  const total   = employees.length
  const faculty = employees.filter(e => e.employeeType === 'FACULTY').length
  const staff   = employees.filter(e => e.employeeType === 'STAFF').length
  const active  = employees.filter(e => (e.status || 'ACTIVE') === 'ACTIVE').length
  const onLeave = employees.filter(e => e.status === 'ON_LEAVE').length

  let filtered = employees.filter(e => {
    const q = search.toLowerCase()
    const matchSearch  = !q || e.name?.toLowerCase().includes(q) || e.empCode?.toLowerCase().includes(q)
    const matchDept    = !filterDept   || e.department === filterDept
    const matchType    = !filterType   || e.employeeType === filterType
    const matchStatus  = !filterStatus || (e.status || 'ACTIVE') === filterStatus
    return matchSearch && matchDept && matchType && matchStatus
  })
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'name-asc')  return (a.name || '').localeCompare(b.name || '')
    if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '')
    if (sortBy === 'newest')    return new Date(b.joinDate || 0) - new Date(a.joinDate || 0)
    if (sortBy === 'dept')      return (a.department || '').localeCompare(b.department || '')
    return 0
  })

  const openCreate = () => {
    setEditEmp(null); setForm(EMPTY_FORM); setEmpStep(1); setShowModal(true)
  }
  const openEdit = (emp) => {
    setEditEmp(emp)
    setForm({
      empCode: emp.empCode || '', name: emp.name || '', email: emp.email || '',
      phone: emp.phone || '', designation: emp.designation || 'Professor',
      employeeType: emp.employeeType || 'FACULTY', department: emp.department || '',
      joinDate: emp.joinDate || '', baseSalary: emp.baseSalary || '',
      qualifications: emp.qualifications || '',
    })
    setEmpStep(1); setShowModal(true)
  }

  const handleNext = () => {
    if (!form.empCode || !form.name || !form.employeeType) {
      toast.error('Emp code, name, and type are required'); return
    }
    setEmpStep(2)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editEmp) {
        await api.put(`/employees/${editEmp.id}`, form)
        toast.success('Employee updated')
      } else {
        await api.post('/employees', form)
        toast.success('Employee created')
      }
      setShowModal(false); fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    } finally { setSubmitting(false) }
  }

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this employee?')) return
    try {
      await api.delete(`/employees/${id}`)
      toast.success('Employee deactivated'); fetchEmployees()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to deactivate') }
  }

  const inp = {
    width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
    borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif',
    color: TEXT, outline: 'none', boxSizing: 'border-box',
  }
  const lbl = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif' }
  const onFocus = e => { e.target.style.borderColor = ACCENT }
  const onBlur  = e => { e.target.style.borderColor = '#e2e8f0' }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT }}>Employees</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED }}>{total} employees total</p>
        </div>
        {user?.role === 'ADMIN' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowImport(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: '#fff', color: ACCENT, border: '1.5px solid #c7d2fe', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <MdUploadFile size={16} /> Import CSV
            </button>
            <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <MdAdd size={18} /> Add Employee
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total',    value: total,   color: TEXT,      bg: '#f8fafc', border: '#e2e8f0' },
          { label: 'Faculty',  value: faculty,  color: ACCENT,    bg: '#eef2ff', border: '#c7d2fe' },
          { label: 'Staff',    value: staff,    color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
          { label: 'Active',   value: active,   color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0' },
          { label: 'On Leave', value: onLeave,  color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: '14px 18px' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', flexDirection: isMobile ? 'column' : 'row' }}>
        <div style={{ flex: 2, minWidth: 200, position: 'relative', width: isMobile ? '100%' : undefined }}>
          <MdSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 17, pointerEvents: 'none' }} />
          <input type="text" placeholder="Search by name or emp code…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, paddingLeft: 34 }} onFocus={onFocus} onBlur={onBlur} />
        </div>
        {[
          { label: 'Department', value: filterDept,   set: setFilterDept,   opts: [['', 'All Departments'], ...DEPARTMENTS.map(d => [d, d])] },
          { label: 'Type',       value: filterType,   set: setFilterType,   opts: [['', 'All Types'], ...EMP_TYPES.map(t => [t, t])] },
          { label: 'Status',     value: filterStatus, set: setFilterStatus, opts: [['', 'All Status'], ['ACTIVE', 'Active'], ['INACTIVE', 'Inactive'], ['ON_LEAVE', 'On Leave']] },
          { label: 'Sort By',    value: sortBy,       set: setSortBy,       opts: [['name-asc', 'Name A-Z'], ['name-desc', 'Name Z-A'], ['newest', 'Newest First'], ['dept', 'Department']] },
        ].map(f => (
          <div key={f.label} style={{ flex: 1, minWidth: 130 }}>
            <label style={{ ...lbl, marginBottom: 4 }}>{f.label}</label>
            <select value={f.value} onChange={e => f.set(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
              {f.opts.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
            </select>
          </div>
        ))}
        {(search || filterDept || filterType || filterStatus) && (
          <button onClick={() => { setSearch(''); setFilterDept(''); setFilterType(''); setFilterStatus('') }}
            style={{ padding: '9px 14px', background: '#f1f5f9', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: MUTED, alignSelf: 'flex-end' }}>
            Clear
          </button>
        )}
      </div>

      {/* Card grid */}
      {loading ? (
        <div style={{ padding: 32, textAlign: 'center', color: MUTED }}>Loading employees…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 48, textAlign: 'center', color: MUTED }}>
          <MdBadge style={{ fontSize: 44, opacity: 0.3, display: 'block', margin: '0 auto 10px' }} />
          {search ? 'No employees match your search' : 'No employees found'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
          {filtered.map(emp => {
            const tc     = typeColors[emp.employeeType] || { bg: '#f8fafc', color: MUTED }
            const status = emp.status || 'ACTIVE'
            return (
              <div key={emp.id}
                style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14, border: '1px solid #f1f5f9', transition: 'box-shadow 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.10)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)'}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <AvatarCircle name={emp.name} size={48} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.name}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{emp.empCode}</div>
                    <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: tc.bg, color: tc.color }}>{emp.employeeType}</span>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: status === 'ACTIVE' ? '#f0fdf4' : status === 'ON_LEAVE' ? '#fffbeb' : '#fef2f2', color: status === 'ACTIVE' ? '#10b981' : status === 'ON_LEAVE' ? '#f59e0b' : '#ef4444' }}>{status}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {emp.designation && <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: MUTED }}><MdWork size={13} style={{ flexShrink: 0, color: ACCENT, opacity: 0.7 }} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.designation}</span></div>}
                  {emp.department && <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: MUTED }}><MdBadge size={13} style={{ flexShrink: 0, color: ACCENT, opacity: 0.7 }} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.department}</span></div>}
                  {emp.email     && <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: MUTED }}><MdEmail size={13} style={{ flexShrink: 0, color: ACCENT, opacity: 0.7 }} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.email}</span></div>}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  <button onClick={() => setDetailEmp(emp)} style={{ flex: 1, padding: '7px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: TEXT }}>View Details</button>
                  {user?.role === 'ADMIN' && (<>
                    <button onClick={() => openEdit(emp)} style={{ padding: '7px 10px', background: '#eef2ff', border: 'none', borderRadius: 7, cursor: 'pointer', color: ACCENT, display: 'flex', alignItems: 'center' }}><MdEdit size={14} /></button>
                    {status === 'ACTIVE' && <button onClick={() => handleDeactivate(emp.id)} style={{ padding: '7px 10px', background: '#fef2f2', border: 'none', borderRadius: 7, cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}><MdDeleteOutline size={14} /></button>}
                  </>)}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail side panel */}
      {detailEmp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}
          onClick={e => { if (e.target === e.currentTarget) setDetailEmp(null) }}>
          <div style={{ background: '#fff', width: isMobile ? '100%' : 380, height: '100%', overflowY: 'auto', boxShadow: '-4px 0 20px rgba(0,0,0,0.12)', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: TEXT }}>Employee Profile</h2>
              <button onClick={() => setDetailEmp(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4 }}><MdClose size={20} /></button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><AvatarCircle name={detailEmp.name} size={72} /></div>
              <div style={{ fontSize: 18, fontWeight: 700, color: TEXT }}>{detailEmp.name}</div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 3 }}>{detailEmp.empCode}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10 }}>
                {(() => {
                  const tc = typeColors[detailEmp.employeeType] || { bg: '#f8fafc', color: MUTED }
                  const status = detailEmp.status || 'ACTIVE'
                  return (<>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: tc.bg, color: tc.color }}>{detailEmp.employeeType}</span>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: status === 'ACTIVE' ? '#f0fdf4' : '#fef2f2', color: status === 'ACTIVE' ? '#10b981' : '#ef4444' }}>{status}</span>
                  </>)
                })()}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { icon: MdWork,          label: 'Designation',    value: detailEmp.designation },
                { icon: MdBadge,         label: 'Department',     value: detailEmp.department },
                { icon: MdEmail,         label: 'Email',          value: detailEmp.email },
                { icon: MdPhone,         label: 'Phone',          value: detailEmp.phone },
                { icon: MdCalendarToday, label: 'Join Date',      value: detailEmp.joinDate ? new Date(detailEmp.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : null },
                { icon: MdPerson,        label: 'Qualifications', value: detailEmp.qualifications },
              ].filter(r => r.value).map(row => (
                <div key={row.label} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <row.icon size={15} style={{ color: ACCENT }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 2 }}>{row.label}</div>
                    <div style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>{row.value}</div>
                  </div>
                </div>
              ))}
            </div>
            {user?.role === 'ADMIN' && (
              <div style={{ marginTop: 24 }}>
                <button onClick={() => { setDetailEmp(null); openEdit(detailEmp) }}
                  style={{ width: '100%', padding: '10px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Edit Employee
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal — 2-step wizard ──────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: isMobile ? '95vw' : 560, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: TEXT }}>
                {editEmp ? 'Edit Employee' : 'Add Employee'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: MUTED }}>
                <MdClose size={18} />
              </button>
            </div>

            <EmpStepBar current={empStep} />

            <form onSubmit={handleSave}>
              {/* ── Step 1: Basic Information ── */}
              {empStep === 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                  {/* Identity fields */}
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: 1 }}>Identity</span>
                    <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                  </div>
                  {[
                    { label: 'Emp Code', key: 'empCode', type: 'text', placeholder: 'e.g. FAC001', required: true },
                    { label: 'Full Name', key: 'name',    type: 'text', placeholder: 'e.g. Dr. Ravi Kumar', required: true },
                    { label: 'Email',    key: 'email',   type: 'email', placeholder: 'faculty@college.edu' },
                    { label: 'Phone',    key: 'phone',   type: 'tel',  placeholder: '10-digit mobile' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={lbl}>{f.label}{f.required && <span style={{ color: '#ef4444' }}> *</span>}</label>
                      <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        style={inp} onFocus={onFocus} onBlur={onBlur} />
                    </div>
                  ))}

                  {/* Role fields */}
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 2px' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: 1 }}>Role</span>
                    <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                  </div>
                  <div>
                    <label style={lbl}>Employee Type <span style={{ color: '#ef4444' }}>*</span></label>
                    <select value={form.employeeType} onChange={e => setForm({ ...form, employeeType: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>
                      {EMP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Designation</label>
                    <select value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>
                      {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* ── Step 2: Role & Compensation ── */}
              {empStep === 2 && (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: 1 }}>Department & Employment</span>
                    <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={lbl}>Department</label>
                    <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Join Date</label>
                    <input type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} style={inp} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    <label style={lbl}>Base Salary (₹)</label>
                    <input type="number" value={form.baseSalary} onChange={e => setForm({ ...form, baseSalary: e.target.value })} placeholder="e.g. 65000" style={inp} onFocus={onFocus} onBlur={onBlur} min={0} />
                  </div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 2px' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: 1 }}>Qualifications</span>
                    <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={lbl}>Qualifications / Degrees</label>
                    <textarea value={form.qualifications} onChange={e => setForm({ ...form, qualifications: e.target.value })}
                      placeholder="e.g. M.Tech (IIT Madras), Ph.D (IIT Bombay)" rows={3}
                      style={{ ...inp, resize: 'vertical' }} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                {empStep === 2 ? (
                  <button type="button" onClick={() => setEmpStep(1)}
                    style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: MUTED }}>
                    ← Back
                  </button>
                ) : (
                  <button type="button" onClick={() => setShowModal(false)}
                    style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: MUTED }}>
                    Cancel
                  </button>
                )}
                {empStep === 1 ? (
                  <button type="button" onClick={handleNext}
                    style={{ flex: 1, padding: '10px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Next →
                  </button>
                ) : (
                  <button type="submit" disabled={submitting}
                    style={{ flex: 1, padding: '10px', background: submitting ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    {submitting ? 'Saving…' : editEmp ? 'Update' : 'Create'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CSV Import ─────────────────────────────────────────────────── */}
      <CsvImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onDone={() => fetchEmployees()}
        title="Import Employees"
        sampleFile="sample_employees.csv"
        columns={[
          { key: 'empCode',        label: 'Emp Code',               required: true },
          { key: 'name',           label: 'Full Name',              required: true },
          { key: 'email',          label: 'Email',                  required: true, type: 'email' },
          { key: 'phone',          label: 'Phone',                  required: false },
          { key: 'departmentId',   label: 'Department ID (1–5)',    required: true,  type: 'number' },
          { key: 'designation',    label: 'Designation',            required: true },
          { key: 'employeeType',   label: 'Type (FACULTY/STAFF/ADMIN)', required: true, enum: ['FACULTY', 'STAFF', 'ADMIN'] },
          { key: 'joinDate',       label: 'Join Date (YYYY-MM-DD)', required: true,  type: 'date' },
          { key: 'baseSalary',     label: 'Base Salary',            required: true,  type: 'number' },
          { key: 'qualifications', label: 'Qualifications',         required: false },
        ]}
        sampleRows={[
          { empCode: 'FAC006', name: 'Sample Faculty A', email: 'facA@college.edu', phone: '9000000201', departmentId: 1, designation: 'Assistant Professor', employeeType: 'FACULTY', joinDate: '2024-06-01', baseSalary: 65000, qualifications: 'M.Tech' },
          { empCode: 'STF002', name: 'Sample Staff B',   email: 'stfB@college.edu', phone: '9000000202', departmentId: 2, designation: 'Lab Instructor',       employeeType: 'STAFF',   joinDate: '2024-07-01', baseSalary: 40000, qualifications: 'B.E.' },
        ]}
        importFn={async (rows) => {
          const res = await api.post('/employees/import', rows.map(r => ({
            empCode: r.empCode, name: r.name, email: r.email, phone: r.phone || null,
            departmentId: Number(r.departmentId), designation: r.designation,
            employeeType: r.employeeType, joinDate: r.joinDate,
            baseSalary: Number(r.baseSalary), qualifications: r.qualifications || null,
          })))
          return res.data.data
        }}
      />
    </div>
  )
}
