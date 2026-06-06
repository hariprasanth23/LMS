import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdAssignment, MdCheck, MdGrade, MdAdd, MdClose, MdUpload, MdCalendarToday, MdAccessTime, MdOutlineSchool } from 'react-icons/md'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

const STATUS_CONFIG = {
  PENDING:   { bg: '#fffbeb', color: '#f59e0b', label: 'Pending' },
  SUBMITTED: { bg: '#f0fdf4', color: '#10b981', label: 'Submitted' },
  GRADED:    { bg: '#f0f9ff', color: '#0ea5e9', label: 'Graded' },
  OVERDUE:   { bg: '#fef2f2', color: '#ef4444', label: 'Overdue' },
  LATE:      { bg: '#fef2f2', color: '#ef4444', label: 'Late' },
}

function StatusChip({ status }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: s.bg, color: s.color, fontFamily: 'system-ui, sans-serif', whiteSpace: 'nowrap'
    }}>
      {s.label}
    </span>
  )
}

function CourseBadge({ course }) {
  if (!course) return null
  return (
    <span style={{
      padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 700,
      background: '#eef2ff', color: ACCENT, fontFamily: 'system-ui, sans-serif', whiteSpace: 'nowrap'
    }}>
      {course}
    </span>
  )
}

function getDaysInfo(dueDateStr) {
  if (!dueDateStr) return null
  const due = new Date(dueDateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
  return diff
}

function DueDateBadge({ dueDate, status }) {
  if (!dueDate) return null
  const diff = getDaysInfo(dueDate)
  const isOverdue = diff < 0
  const isDueSoon = diff >= 0 && diff <= 2
  const color = isOverdue ? '#ef4444' : isDueSoon ? '#f59e0b' : MUTED
  const bg = isOverdue ? '#fef2f2' : isDueSoon ? '#fffbeb' : '#f8fafc'
  const label = isOverdue ? `${Math.abs(diff)}d overdue` : diff === 0 ? 'Due today' : `${diff}d left`
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: bg, padding: '3px 9px', borderRadius: 6, width: 'fit-content' }}>
      <MdAccessTime size={12} style={{ color }} />
      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, fontWeight: 600, color }}>{label}</span>
    </div>
  )
}

const FILTER_TABS = ['All', 'Active', 'Submitted', 'Graded', 'Overdue']

const COURSES_LIST = ['Mathematics I', 'Physics', 'Computer Science', 'Chemistry', 'English', 'Data Structures', 'Algorithms', 'DBMS']

export default function Assignments() {
  const { user } = useAuth()
  const isFaculty = user?.role === 'FACULTY'
  const isStudent = user?.role === 'STUDENT'

  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')

  // Submit modal state
  const [submitModal, setSubmitModal] = useState(null)
  const [submitUrl, setSubmitUrl] = useState('')
  const [submitNotes, setSubmitNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Grade modal state
  const [gradeModal, setGradeModal] = useState(null)
  const [grade, setGrade] = useState('')
  const [gradeFeedback, setGradeFeedback] = useState('')

  // Add Assignment modal (faculty)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState({
    course: '', title: '', instructions: '', dueDate: '', maxMarks: '100'
  })
  const [addSubmitting, setAddSubmitting] = useState(false)

  const fetchAssignments = async () => {
    try {
      const endpoint = isStudent ? '/assignments/my' : '/assignments'
      const res = await api.get(endpoint)
      setAssignments(res.data.data || [])
    } catch {
      toast.error('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAssignments() }, [])

  const getAssignmentStatus = (a) => {
    if (a.submissionStatus) return a.submissionStatus
    if (a.graded) return 'GRADED'
    if (a.submitted) return 'SUBMITTED'
    const diff = getDaysInfo(a.dueDate)
    if (diff !== null && diff < 0) return 'OVERDUE'
    return 'PENDING'
  }

  const filteredAssignments = assignments.filter(a => {
    const status = getAssignmentStatus(a)
    if (activeTab === 'All') return true
    if (activeTab === 'Submitted') return status === 'SUBMITTED'
    if (activeTab === 'Graded') return status === 'GRADED'
    if (activeTab === 'Overdue') return status === 'OVERDUE' || status === 'LATE'
    if (activeTab === 'Active') return status === 'PENDING'
    return true
  })

  const tabCounts = {
    All: assignments.length,
    Active: assignments.filter(a => getAssignmentStatus(a) === 'PENDING').length,
    Submitted: assignments.filter(a => getAssignmentStatus(a) === 'SUBMITTED').length,
    Graded: assignments.filter(a => getAssignmentStatus(a) === 'GRADED').length,
    Overdue: assignments.filter(a => ['OVERDUE', 'LATE'].includes(getAssignmentStatus(a))).length,
  }

  const handleSubmit = async () => {
    if (!submitUrl.trim()) { toast.error('Please enter a submission URL'); return }
    setSubmitting(true)
    try {
      await api.post(`/assignments/${submitModal.id}/submit`, { submissionUrl: submitUrl, notes: submitNotes })
      toast.success('Assignment submitted!')
      setSubmitModal(null)
      setSubmitUrl('')
      setSubmitNotes('')
      fetchAssignments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGrade = async () => {
    if (!grade) { toast.error('Please enter a grade'); return }
    setSubmitting(true)
    try {
      await api.put(`/assignments/submissions/${gradeModal.submissionId}/grade`, { grade: Number(grade), feedback: gradeFeedback })
      toast.success('Graded successfully!')
      setGradeModal(null)
      setGrade('')
      setGradeFeedback('')
      fetchAssignments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to grade')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddAssignment = async (e) => {
    e.preventDefault()
    if (!addForm.title || !addForm.dueDate) {
      toast.error('Title and due date are required')
      return
    }
    setAddSubmitting(true)
    try {
      await api.post('/assignments', { ...addForm, maxMarks: Number(addForm.maxMarks) })
      toast.success('Assignment created!')
      setShowAddModal(false)
      setAddForm({ course: '', title: '', instructions: '', dueDate: '', maxMarks: '100' })
      fetchAssignments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create assignment')
    } finally {
      setAddSubmitting(false)
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

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT }}>Assignments</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED }}>{assignments.length} assignments</p>
        </div>
        {isFaculty && (
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
              background: ACCENT, color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}
          >
            <MdAdd size={18} /> Add Assignment
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 0, background: '#f8fafc', borderRadius: 10, padding: 4, width: 'fit-content', marginBottom: 20 }}>
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '7px 16px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              background: activeTab === tab ? '#fff' : 'transparent',
              color: activeTab === tab ? ACCENT : MUTED,
              boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            {tab}
            {tabCounts[tab] > 0 && (
              <span style={{
                marginLeft: 6, fontSize: 11, fontWeight: 700,
                background: activeTab === tab ? (tab === 'Overdue' ? '#fef2f2' : '#eef2ff') : '#e2e8f0',
                color: activeTab === tab ? (tab === 'Overdue' ? '#ef4444' : ACCENT) : MUTED,
                padding: '1px 7px', borderRadius: 10
              }}>
                {tabCounts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Assignment Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: MUTED }}>Loading...</div>
      ) : filteredAssignments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: MUTED }}>
          <MdAssignment style={{ fontSize: 48, opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
          No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} assignments found
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {filteredAssignments.map(a => {
            const status = getAssignmentStatus(a)
            const diff = getDaysInfo(a.dueDate)
            return (
              <div
                key={a.id}
                style={{
                  background: '#fff', borderRadius: 14,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  border: `1px solid ${status === 'OVERDUE' || status === 'LATE' ? '#fecaca' : '#f1f5f9'}`,
                  padding: '20px 22px',
                  transition: 'box-shadow 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.09)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  {/* Left: icon + info */}
                  <div style={{ display: 'flex', gap: 14, flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                      background: status === 'GRADED' ? '#f0f9ff' : status === 'SUBMITTED' ? '#f0fdf4' : status === 'OVERDUE' || status === 'LATE' ? '#fef2f2' : '#eef2ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <MdAssignment size={22} style={{
                        color: status === 'GRADED' ? '#0ea5e9' : status === 'SUBMITTED' ? '#10b981' : status === 'OVERDUE' || status === 'LATE' ? '#ef4444' : ACCENT
                      }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>{a.title}</h3>
                        <CourseBadge course={a.courseName || a.course} />
                      </div>
                      {a.description && (
                        <p style={{ margin: '0 0 8px', fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
                          {a.description.length > 120 ? a.description.slice(0, 120) + '...' : a.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        {a.dueDate && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED }}>
                            <MdCalendarToday size={12} />
                            <span>Due: {new Date(a.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>
                        )}
                        {a.dueDate && <DueDateBadge dueDate={a.dueDate} status={status} />}
                        {a.maxMarks && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED }}>
                            <MdOutlineSchool size={12} />
                            <span>Max: {a.maxMarks} marks</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: status + actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <StatusChip status={status} />

                    {a.grade != null && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>{a.grade}</div>
                        <div style={{ fontSize: 10, color: MUTED }}>/ {a.maxMarks || '?'}</div>
                      </div>
                    )}

                    {isStudent && status === 'PENDING' && (
                      <button
                        onClick={() => setSubmitModal(a)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '7px 14px', background: ACCENT, color: '#fff',
                          border: 'none', borderRadius: 7, fontSize: 12,
                          fontWeight: 600, cursor: 'pointer'
                        }}
                      >
                        <MdCheck size={14} /> Submit
                      </button>
                    )}

                    {isStudent && (status === 'OVERDUE' || status === 'LATE') && !a.submitted && (
                      <button
                        onClick={() => setSubmitModal(a)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '7px 14px', background: '#fef2f2', color: '#ef4444',
                          border: '1px solid #fecaca', borderRadius: 7, fontSize: 12,
                          fontWeight: 600, cursor: 'pointer'
                        }}
                      >
                        <MdCheck size={14} /> Submit Late
                      </button>
                    )}

                    {isFaculty && a.submissionId && !a.graded && (
                      <button
                        onClick={() => setGradeModal(a)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '7px 14px', background: '#10b981', color: '#fff',
                          border: 'none', borderRadius: 7, fontSize: 12,
                          fontWeight: 600, cursor: 'pointer'
                        }}
                      >
                        <MdGrade size={14} /> Grade
                      </button>
                    )}
                  </div>
                </div>

                {/* Grade feedback */}
                {a.feedback && (
                  <div style={{ marginTop: 12, background: '#f0f9ff', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#0369a1' }}>
                    <strong>Feedback:</strong> {a.feedback}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Submit Modal */}
      {submitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 460 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: TEXT }}>Submit Assignment</h2>
              <button onClick={() => setSubmitModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED }}><MdClose size={20} /></button>
            </div>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: MUTED }}>{submitModal.title}</p>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Submission URL *</label>
              <input type="url" value={submitUrl} onChange={e => setSubmitUrl(e.target.value)} placeholder="https://..." style={inputStyle}
                onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Upload File</label>
              <div style={{
                border: '2px dashed #e2e8f0', borderRadius: 8, padding: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: 'pointer', color: MUTED, fontSize: 13, textAlign: 'center',
                position: 'relative'
              }}>
                <MdUpload size={18} />
                <span>Click to upload file or drag & drop</span>
                <input type="file" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Notes (optional)</label>
              <textarea value={submitNotes} onChange={e => setSubmitNotes(e.target.value)} rows={3}
                style={{ ...inputStyle, resize: 'vertical' }} placeholder="Any additional notes..." />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setSubmitModal(null)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: MUTED }}>Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} style={{ flex: 1, padding: '10px', background: submitting ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {gradeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 420 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: TEXT }}>Grade Submission</h2>
              <button onClick={() => setGradeModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED }}><MdClose size={20} /></button>
            </div>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: MUTED }}>{gradeModal.title}</p>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Grade * (out of {gradeModal.maxMarks || 100})</label>
              <input type="number" value={grade} onChange={e => setGrade(e.target.value)}
                placeholder={`0 – ${gradeModal.maxMarks || 100}`} min={0} max={gradeModal.maxMarks || 100}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Feedback</label>
              <textarea value={gradeFeedback} onChange={e => setGradeFeedback(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Leave feedback for the student..." />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setGradeModal(null)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: MUTED }}>Cancel</button>
              <button onClick={handleGrade} disabled={submitting} style={{ flex: 1, padding: '10px', background: submitting ? '#6ee7b7' : '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                {submitting ? 'Saving...' : 'Save Grade'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Assignment Modal (Faculty) */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: TEXT }}>Add Assignment</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED }}><MdClose size={20} /></button>
            </div>
            <form onSubmit={handleAddAssignment}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Course</label>
                <select value={addForm.course} onChange={e => setAddForm({ ...addForm, course: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Select Course</option>
                  {COURSES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Title *</label>
                <input type="text" value={addForm.title} onChange={e => setAddForm({ ...addForm, title: e.target.value })}
                  placeholder="Assignment title" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Instructions</label>
                <textarea value={addForm.instructions} onChange={e => setAddForm({ ...addForm, instructions: e.target.value })}
                  rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Describe the assignment requirements..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Due Date *</label>
                  <input type="datetime-local" value={addForm.dueDate} onChange={e => setAddForm({ ...addForm, dueDate: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <div>
                  <label style={labelStyle}>Max Marks</label>
                  <input type="number" value={addForm.maxMarks} onChange={e => setAddForm({ ...addForm, maxMarks: e.target.value })}
                    min={1} max={1000} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: MUTED }}>Cancel</button>
                <button type="submit" disabled={addSubmitting} style={{ flex: 1, padding: '10px', background: addSubmitting ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {addSubmitting ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
