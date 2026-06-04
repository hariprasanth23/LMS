import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdAdd, MdSearch, MdBadge, MdEdit, MdDeleteOutline } from 'react-icons/md'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

const DESIGNATIONS = [
  'Professor', 'Associate Professor', 'Assistant Professor',
  'Lecturer', 'Lab Instructor', 'Admin Staff', 'Support Staff'
]

const EMP_TYPES = ['FACULTY', 'STAFF']

export default function Employees() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editEmp, setEditEmp] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    empCode: '', name: '', email: '', phone: '',
    designation: 'Professor', employeeType: 'FACULTY',
    joinDate: '', baseSalary: '', qualifications: ''
  })

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees')
      setEmployees(res.data.data || [])
    } catch {
      toast.error('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEmployees() }, [])

  const filtered = employees.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.empCode?.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditEmp(null)
    setForm({ empCode: '', name: '', email: '', phone: '', designation: 'Professor', employeeType: 'FACULTY', joinDate: '', baseSalary: '', qualifications: '' })
    setShowModal(true)
  }

  const openEdit = (emp) => {
    setEditEmp(emp)
    setForm({
      empCode: emp.empCode || '',
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      designation: emp.designation || 'Professor',
      employeeType: emp.employeeType || 'FACULTY',
      joinDate: emp.joinDate || '',
      baseSalary: emp.baseSalary || '',
      qualifications: emp.qualifications || ''
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.empCode || !form.name || !form.employeeType) {
      toast.error('Emp code, name, and type are required')
      return
    }
    setSubmitting(true)
    try {
      if (editEmp) {
        await api.put(`/employees/${editEmp.id}`, form)
        toast.success('Employee updated')
      } else {
        await api.post('/employees', form)
        toast.success('Employee created')
      }
      setShowModal(false)
      fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this employee?')) return
    try {
      await api.delete(`/employees/${id}`)
      toast.success('Employee deactivated')
      fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate')
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
    borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif',
    color: TEXT, outline: 'none', boxSizing: 'border-box'
  }

  const typeColors = { FACULTY: { bg: '#eef2ff', color: ACCENT }, STAFF: { bg: '#fffbeb', color: '#f59e0b' } }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>Employees</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>{employees.length} employees</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button
            onClick={openCreate}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
              background: ACCENT, color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer'
            }}
          >
            <MdAdd size={18} /> Add Employee
          </button>
        )}
      </div>

      <div style={{ marginBottom: 16, position: 'relative' }}>
        <MdSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 18 }} />
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px 10px 38px', border: '1px solid #e2e8f0',
            borderRadius: 8, fontSize: 13, fontFamily: 'system-ui, sans-serif',
            color: TEXT, outline: 'none', boxSizing: 'border-box', background: '#fff'
          }}
        />
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: MUTED }}>Loading employees...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: MUTED }}>
            <MdBadge style={{ fontSize: 44, opacity: 0.3, display: 'block', margin: '0 auto 10px' }} />
            {search ? 'No employees match your search' : 'No employees found'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Emp Code', 'Name', 'Designation', 'Type', 'Email', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => {
                const tc = typeColors[emp.employeeType] || { bg: '#f8fafc', color: MUTED }
                return (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #f8fafc' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: ACCENT }}>{emp.empCode}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MdBadge style={{ color: ACCENT, fontSize: 17 }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: TEXT }}>{emp.name}</div>
                          <div style={{ fontSize: 11, color: MUTED }}>{emp.phone || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: MUTED }}>{emp.designation || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: tc.bg, color: tc.color }}>
                        {emp.employeeType}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: MUTED }}>{emp.email || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: emp.status === 'ACTIVE' ? '#f0fdf4' : '#fef2f2',
                        color: emp.status === 'ACTIVE' ? '#10b981' : '#ef4444'
                      }}>
                        {emp.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {user?.role === 'ADMIN' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => openEdit(emp)}
                            style={{ padding: '5px 10px', background: '#eef2ff', border: 'none', borderRadius: 6, cursor: 'pointer', color: ACCENT, fontSize: 12 }}
                          >
                            <MdEdit size={14} />
                          </button>
                          {emp.status === 'ACTIVE' && (
                            <button
                              onClick={() => handleDeactivate(emp.id)}
                              style={{ padding: '5px 10px', background: '#fef2f2', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#ef4444', fontSize: 12 }}
                            >
                              <MdDeleteOutline size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>
              {editEmp ? 'Edit Employee' : 'Add Employee'}
            </h2>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[['Emp Code *', 'empCode', 'text'], ['Full Name *', 'name', 'text'], ['Email', 'email', 'email'], ['Phone', 'phone', 'tel'], ['Join Date', 'joinDate', 'date'], ['Base Salary', 'baseSalary', 'number']].map(([label, name, type]) => (
                  <div key={name}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif' }}>{label}</label>
                    <input type={type} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif' }}>Designation</label>
                  <select value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif' }}>Employee Type *</label>
                  <select value={form.employeeType} onChange={e => setForm({ ...form, employeeType: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {EMP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif' }}>Qualifications</label>
                <textarea value={form.qualifications} onChange={e => setForm({ ...form, qualifications: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer', color: MUTED }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '10px', background: submitting ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>
                  {submitting ? 'Saving...' : editEmp ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
