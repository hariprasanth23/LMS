import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdAdd, MdSearch, MdPerson } from 'react-icons/md'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

export default function Students() {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ rollNumber: '', name: '', email: '', phone: '', departmentId: '', semester: '', section: '' })
  const [submitting, setSubmitting] = useState(false)

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

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.rollNumber || !form.name) { toast.error('Roll number and name are required'); return }
    setSubmitting(true)
    try {
      await api.post('/students', form)
      toast.success('Student created successfully')
      setShowModal(false)
      setForm({ rollNumber: '', name: '', email: '', phone: '', departmentId: '', semester: '', section: '' })
      fetchStudents()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create student')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: 7,
    fontSize: 13,
    fontFamily: 'system-ui, sans-serif',
    color: TEXT,
    outline: 'none',
    boxSizing: 'border-box'
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>Students</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>{students.length} total students</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setShowModal(true)}
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

      {/* Search */}
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <MdSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 18 }} />
        <input
          type="text"
          placeholder="Search by name, roll number or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px 10px 38px',
            border: '1px solid #e2e8f0', borderRadius: 8,
            fontSize: 13, fontFamily: 'system-ui, sans-serif',
            color: TEXT, outline: 'none', boxSizing: 'border-box',
            background: '#fff'
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: MUTED }}>Loading students...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: MUTED }}>
            {search ? 'No students match your search' : 'No students found'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Roll No', 'Name', 'Email', 'Phone', 'Semester', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f8fafc' }} onMouseEnter={e => e.currentTarget.style.background = '#fafbff'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: ACCENT }}>{s.rollNumber}</td>
                  <td style={{ padding: '12px 16px', color: TEXT, fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MdPerson style={{ color: ACCENT, fontSize: 16 }} />
                      </div>
                      {s.name}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: MUTED }}>{s.email || '-'}</td>
                  <td style={{ padding: '12px 16px', color: MUTED }}>{s.phone || '-'}</td>
                  <td style={{ padding: '12px 16px', color: MUTED }}>{s.semester || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: s.status === 'ACTIVE' ? '#f0fdf4' : '#f8fafc',
                      color: s.status === 'ACTIVE' ? '#10b981' : MUTED
                    }}>
                      {s.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Link to={`/students/${s.id}`} style={{ color: ACCENT, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 480, maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>Add Student</h2>
            <form onSubmit={handleCreate}>
              {[
                ['Roll Number *', 'rollNumber', 'text'],
                ['Full Name *', 'name', 'text'],
                ['Email', 'email', 'email'],
                ['Phone', 'phone', 'tel'],
                ['Semester', 'semester', 'number'],
                ['Section', 'section', 'text']
              ].map(([label, name, type]) => (
                <div key={name} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif' }}>{label}</label>
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
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer', color: MUTED }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ flex: 1, padding: '10px', background: submitting ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}
                >
                  {submitting ? 'Saving...' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
