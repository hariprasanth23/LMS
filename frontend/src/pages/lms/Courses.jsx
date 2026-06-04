import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdAdd, MdBook, MdSearch } from 'react-icons/md'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

const COLORS = ['#eef2ff', '#f0fdf4', '#fffbeb', '#fef2f2', '#f0f9ff']
const ACCENT_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9']

export default function Courses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ courseCode: '', title: '', description: '', credits: '', semester: '', departmentId: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchCourses = async () => {
    try {
      const endpoint = user?.role === 'STUDENT' ? '/courses/my' : '/courses'
      const res = await api.get(endpoint)
      setCourses(res.data.data || [])
    } catch {
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCourses() }, [])

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.courseCode?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.courseCode || !form.title) { toast.error('Course code and title are required'); return }
    setSubmitting(true)
    try {
      await api.post('/courses', form)
      toast.success('Course created successfully')
      setShowModal(false)
      setForm({ courseCode: '', title: '', description: '', credits: '', semester: '', departmentId: '' })
      fetchCourses()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course')
    } finally {
      setSubmitting(false)
    }
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
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>Courses</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>{courses.length} courses available</p>
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'FACULTY') && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
              background: ACCENT, color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer'
            }}
          >
            <MdAdd size={18} /> Create Course
          </button>
        )}
      </div>

      <div style={{ marginBottom: 20, position: 'relative' }}>
        <MdSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 18 }} />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px 10px 38px',
            border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13,
            fontFamily: 'system-ui, sans-serif', color: TEXT, outline: 'none',
            boxSizing: 'border-box', background: '#fff'
          }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, fontFamily: 'system-ui, sans-serif', color: MUTED }}>Loading courses...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, fontFamily: 'system-ui, sans-serif', color: MUTED }}>
          {search ? 'No courses match your search' : 'No courses found'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((c, i) => (
            <div key={c.id} style={{
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <div style={{ height: 6, background: ACCENT_COLORS[i % ACCENT_COLORS.length] }} />
              <div style={{ padding: 20 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: COLORS[i % COLORS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14
                }}>
                  <MdBook style={{ color: ACCENT_COLORS[i % ACCENT_COLORS.length], fontSize: 22 }} />
                </div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, fontWeight: 700, color: ACCENT_COLORS[i % ACCENT_COLORS.length], letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
                  {c.courseCode}
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>{c.title}</h3>
                <p style={{ margin: '0 0 14px', fontSize: 12, color: MUTED, fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
                  {c.description ? c.description.slice(0, 80) + (c.description.length > 80 ? '...' : '') : 'No description'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {c.credits && (
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>
                      {c.credits} credits
                    </span>
                  )}
                  <Link to={`/courses/${c.id}`} style={{
                    marginLeft: 'auto', padding: '5px 12px',
                    background: COLORS[i % COLORS.length],
                    color: ACCENT_COLORS[i % ACCENT_COLORS.length],
                    borderRadius: 6, fontSize: 12, fontWeight: 600,
                    fontFamily: 'system-ui, sans-serif', textDecoration: 'none'
                  }}>
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 480 }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>Create Course</h2>
            <form onSubmit={handleCreate}>
              {[
                ['Course Code *', 'courseCode', 'text'],
                ['Title *', 'title', 'text'],
                ['Description', 'description', 'text'],
                ['Credits', 'credits', 'number'],
                ['Semester', 'semester', 'number']
              ].map(([label, name, type]) => (
                <div key={name} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif' }}>{label}</label>
                  <input type={type} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer', color: MUTED }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '10px', background: submitting ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>
                  {submitting ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
