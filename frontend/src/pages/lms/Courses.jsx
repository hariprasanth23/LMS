import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdAdd, MdSearch, MdClose, MdBook, MdPeople, MdSchool, MdUploadFile } from 'react-icons/md'
import CsvImportModal from '../../components/common/CsvImportModal'
import PageHeader from '../../components/common/PageHeader'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

const CARD_COLORS = [
  { strip: '#6366f1', bg: '#eef2ff', text: '#6366f1' },
  { strip: '#10b981', bg: '#f0fdf4', text: '#10b981' },
  { strip: '#f59e0b', bg: '#fffbeb', text: '#f59e0b' },
  { strip: '#ef4444', bg: '#fef2f2', text: '#ef4444' },
  { strip: '#0ea5e9', bg: '#f0f9ff', text: '#0ea5e9' },
  { strip: '#a855f7', bg: '#fdf4ff', text: '#a855f7' },
]

const DEPARTMENTS = ['All Departments', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Mathematics', 'Physics']
const SEMESTERS = ['All Semesters', '1', '2', '3', '4', '5', '6', '7', '8']

function ProgressBar({ pct, color }) {
  return (
    <div style={{ height: 5, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, pct))}%`, background: color, borderRadius: 3, transition: 'width 0.4s ease' }} />
    </div>
  )
}

const EMPTY_FORM = { courseCode: '', title: '', description: '', credits: '', semester: '', departmentId: '' }

export default function Courses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [allCourses, setAllCourses] = useState([])
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All Departments')
  const [semFilter, setSemFilter] = useState('All Semesters')
  const [tab, setTab] = useState('my') // 'my' | 'all'
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      if (user?.role === 'STUDENT') {
        const [myRes, allRes] = await Promise.all([
          api.get('/courses/my').catch(() => ({ data: { data: [] } })),
          api.get('/courses').catch(() => ({ data: { data: [] } }))
        ])
        setCourses(myRes.data.data || [])
        setAllCourses(allRes.data.data || [])
      } else {
        const endpoint = user?.role === 'FACULTY' ? '/courses/my' : '/courses'
        const res = await api.get(endpoint)
        const data = res.data.data || []
        setCourses(data)
        setAllCourses(data)
        if (user?.role !== 'STUDENT') setTab('my')
      }
    } catch {
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCourses() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.courseCode || !form.title) { toast.error('Course code and title are required'); return }
    setSubmitting(true)
    try {
      await api.post('/courses', form)
      toast.success('Course created successfully')
      setShowModal(false)
      setForm(EMPTY_FORM)
      fetchCourses()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course')
    } finally {
      setSubmitting(false)
    }
  }

  const baseList = tab === 'my' ? courses : allCourses

  const filtered = baseList.filter(c => {
    const matchSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.courseCode?.toLowerCase().includes(search.toLowerCase()) ||
      c.facultyName?.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === 'All Departments' || c.department === deptFilter || c.departmentName === deptFilter
    const matchSem = semFilter === 'All Semesters' || String(c.semester) === semFilter
    return matchSearch && matchDept && matchSem
  })

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
    borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif',
    color: TEXT, outline: 'none', boxSizing: 'border-box', background: '#fff'
  }

  const showTabs = user?.role === 'STUDENT'

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <PageHeader
        title="Courses"
        badge="LMS"
        subtitle={`${baseList.length} course${baseList.length !== 1 ? 's' : ''} available`}
        action={
          (user?.role === 'ADMIN' || user?.role === 'FACULTY') ? (
            <div style={{ display: 'flex', gap: 8 }}>
              {user?.role === 'ADMIN' && (
                <button onClick={() => setShowImport(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: '#fff', color: '#6366f1', border: '1.5px solid #c7d2fe', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <MdUploadFile size={16} /> Import CSV
                </button>
              )}
              <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                <MdAdd size={18} /> Create Course
              </button>
            </div>
          ) : null
        }
      />

      {/* Tabs (student only) */}
      {showTabs && (
        <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '2px solid #f1f5f9' }}>
          {[['my', '📚 My Courses', courses.length], ['all', '🌐 All Courses', allCourses.length]].map(([key, label, count]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '10px 20px', background: 'none', border: 'none',
                borderBottom: tab === key ? `2px solid ${ACCENT}` : '2px solid transparent',
                marginBottom: -2,
                color: tab === key ? ACCENT : MUTED,
                fontSize: 13, fontWeight: tab === key ? 800 : 600,
                cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              {label}
              <span style={{
                background: tab === key ? '#eef2ff' : '#f1f5f9',
                color: tab === key ? ACCENT : MUTED,
                borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 800
              }}>
                {count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, width: isMobile ? '100%' : undefined }}>
          <MdSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 18, pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by title, code, or faculty…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 34px 10px 38px',
              border: '1px solid #e2e8f0', borderRadius: 9, fontSize: 13,
              fontFamily: 'system-ui, sans-serif', color: TEXT, outline: 'none',
              boxSizing: 'border-box', background: '#fff', transition: 'border-color 0.15s'
            }}
            onFocus={e => e.target.style.borderColor = ACCENT}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, display: 'flex', alignItems: 'center', padding: 2 }}>
              <MdClose size={15} />
            </button>
          )}
        </div>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 9, fontSize: 13, fontFamily: 'system-ui, sans-serif', color: TEXT, outline: 'none', background: '#fff', cursor: 'pointer' }}
        >
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
        <select
          value={semFilter}
          onChange={e => setSemFilter(e.target.value)}
          style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 9, fontSize: 13, fontFamily: 'system-ui, sans-serif', color: TEXT, outline: 'none', background: '#fff', cursor: 'pointer' }}
        >
          {SEMESTERS.map(s => <option key={s}>{s}</option>)}
        </select>
        {(search || deptFilter !== 'All Departments' || semFilter !== 'All Semesters') && (
          <button
            onClick={() => { setSearch(''); setDeptFilter('All Departments'); setSemFilter('All Semesters') }}
            style={{ padding: '10px 14px', background: '#f1f5f9', border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 700, color: MUTED, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <MdClose size={14} /> Clear
          </button>
        )}
      </div>

      {/* Course grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 56 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
          <div style={{ color: MUTED, fontSize: 14 }}>Loading courses…</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 64 }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>📭</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, marginBottom: 8 }}>No courses found</div>
          <div style={{ fontSize: 13, color: MUTED, maxWidth: 320, margin: '0 auto' }}>
            {search || deptFilter !== 'All Departments' || semFilter !== 'All Semesters'
              ? 'Try adjusting your search or filter criteria.'
              : tab === 'my'
                ? "You haven't enrolled in any courses yet. Switch to All Courses to browse."
                : 'No courses are available at this time.'}
          </div>
          {(search || deptFilter !== 'All Departments' || semFilter !== 'All Semesters') && (
            <button
              onClick={() => { setSearch(''); setDeptFilter('All Departments'); setSemFilter('All Semesters') }}
              style={{ marginTop: 18, padding: '9px 20px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          {filtered.map((c, i) => {
            const palette = CARD_COLORS[i % CARD_COLORS.length]
            // Mock syllabus progress: derive from id hash or use real field
            const progress = c.syllabusProgress ?? ((parseInt(c.id, 16) || (i * 13 + 37)) % 101)
            const enrolledCount = c.enrolledCount ?? c.studentCount ?? 0

            return (
              <div
                key={c.id}
                style={{
                  background: '#fff', borderRadius: 14,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                  overflow: 'hidden', transition: 'transform 0.15s, box-shadow 0.15s',
                  display: 'flex', flexDirection: 'column'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.11)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)' }}
              >
                {/* Colored top strip */}
                <div style={{ height: 7, background: palette.strip }} />

                <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Course code chip + icon */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '4px 10px', background: palette.bg, color: palette.text,
                      borderRadius: 20, fontSize: 11, fontWeight: 800, letterSpacing: 0.5
                    }}>
                      <MdBook size={12} />
                      {c.courseCode || 'N/A'}
                    </span>
                    {c.semester && (
                      <span style={{ fontSize: 11, color: MUTED, background: '#f8fafc', padding: '3px 8px', borderRadius: 10, fontWeight: 600 }}>
                        Sem {c.semester}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 800, color: TEXT, lineHeight: 1.35 }}>{c.title}</h3>

                  {/* Description */}
                  <p style={{ margin: '0 0 14px', fontSize: 12, color: MUTED, lineHeight: 1.55, flex: 1 }}>
                    {c.description
                      ? c.description.slice(0, 90) + (c.description.length > 90 ? '…' : '')
                      : 'No description provided.'}
                  </p>

                  {/* Faculty + Enrolled row */}
                  <div style={{ display: 'flex', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
                    {(c.facultyName || c.faculty?.name) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED }}>
                        <MdSchool size={14} style={{ color: palette.strip }} />
                        <span>{c.facultyName || c.faculty?.name}</span>
                      </div>
                    )}
                    {enrolledCount > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED }}>
                        <MdPeople size={14} style={{ color: palette.strip }} />
                        <span>{enrolledCount} enrolled</span>
                      </div>
                    )}
                    {c.credits && (
                      <div style={{ fontSize: 12, color: MUTED }}>
                        {c.credits} cr
                      </div>
                    )}
                  </div>

                  {/* Syllabus progress bar */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>Syllabus covered</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: palette.text }}>{progress}%</span>
                    </div>
                    <ProgressBar pct={progress} color={palette.strip} />
                  </div>

                  {/* Footer action */}
                  <Link
                    to={`/courses/${c.id}`}
                    style={{
                      display: 'block', textAlign: 'center',
                      padding: '9px 14px', background: palette.bg,
                      color: palette.text, borderRadius: 9,
                      fontSize: 13, fontWeight: 700, textDecoration: 'none',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = palette.strip.replace(')', ', 0.12)').replace('rgb', 'rgba')}
                    onMouseLeave={e => e.currentTarget.style.background = palette.bg}
                  >
                    Open Course →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create Course Modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: isMobile ? '95vw' : 500, maxHeight: '92vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Create New Course</h2>
              <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: MUTED }}>
                <MdClose size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              {[
                ['Course Code *', 'courseCode', 'text'],
                ['Title *', 'title', 'text'],
                ['Description', 'description', 'text'],
                ['Credits', 'credits', 'number'],
                ['Semester', 'semester', 'number']
              ].map(([label, name, type]) => (
                <div key={name} style={{ marginBottom: 14 }}>
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
                  style={{ flex: 2, padding: '11px', background: submitting ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  {submitting ? 'Creating…' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CsvImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onDone={() => fetchCourses()}
        title="Import Courses"
        sampleFile="sample_courses.csv"
        columns={[
          { key: 'code',         label: 'Course Code',          required: true },
          { key: 'name',         label: 'Course Name',          required: true },
          { key: 'description',  label: 'Description',          required: false },
          { key: 'departmentId', label: 'Department ID (1–5)',  required: true, type: 'number' },
          { key: 'credits',      label: 'Credits',              required: true, type: 'number' },
          { key: 'semester',     label: 'Semester',             required: true, type: 'number', min: 1, max: 8 },
          { key: 'facultyId',    label: 'Faculty ID (UUID)',    required: false },
          { key: 'status',       label: 'Status (ACTIVE)',      required: false },
        ]}
        sampleRows={[
          { code: 'CS7001', name: 'Sample Course A', description: 'Sample description A', departmentId: 1, credits: 3, semester: 5, facultyId: '', status: 'ACTIVE' },
          { code: 'EC5001', name: 'Sample Course B', description: 'Sample description B', departmentId: 2, credits: 4, semester: 3, facultyId: '', status: 'ACTIVE' },
        ]}
        importFn={async (rows) => {
          const results = []
          let successCount = 0, failureCount = 0
          for (let i = 0; i < rows.length; i++) {
            const r = rows[i]
            try {
              await api.post('/courses', {
                code: r.code, name: r.name, description: r.description || null,
                departmentId: Number(r.departmentId), credits: Number(r.credits),
                semester: Number(r.semester), facultyId: r.facultyId || null,
                status: r.status || 'ACTIVE',
              })
              results.push({ row: i + 2, code: r.code, success: true, message: 'Imported successfully' })
              successCount++
            } catch (e) {
              results.push({ row: i + 2, code: r.code, success: false, message: e.response?.data?.message || e.message })
              failureCount++
            }
          }
          return { successCount, failureCount, results }
        }}
      />
    </div>
  )
}
