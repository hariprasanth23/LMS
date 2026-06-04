import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdAssignment, MdCheck, MdGrade } from 'react-icons/md'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

function StatusBadge({ status }) {
  const config = {
    PENDING: { bg: '#fffbeb', color: '#f59e0b' },
    SUBMITTED: { bg: '#f0f9ff', color: '#0ea5e9' },
    GRADED: { bg: '#f0fdf4', color: '#10b981' },
    LATE: { bg: '#fef2f2', color: '#ef4444' }
  }
  const s = config[status] || { bg: '#f8fafc', color: MUTED }
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, fontFamily: 'system-ui, sans-serif' }}>
      {status || 'PENDING'}
    </span>
  )
}

export default function Assignments() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitModal, setSubmitModal] = useState(null)
  const [gradeModal, setGradeModal] = useState(null)
  const [submitUrl, setSubmitUrl] = useState('')
  const [grade, setGrade] = useState('')
  const [gradeFeedback, setGradeFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchAssignments = async () => {
    try {
      const endpoint = user?.role === 'STUDENT' ? '/assignments/my' : '/assignments'
      const res = await api.get(endpoint)
      setAssignments(res.data.data || [])
    } catch {
      toast.error('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAssignments() }, [])

  const handleSubmit = async () => {
    if (!submitUrl.trim()) { toast.error('Please enter a submission URL'); return }
    setSubmitting(true)
    try {
      await api.post(`/assignments/${submitModal.id}/submit`, { submissionUrl: submitUrl, notes: '' })
      toast.success('Assignment submitted!')
      setSubmitModal(null)
      setSubmitUrl('')
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

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
    borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif',
    color: TEXT, outline: 'none', boxSizing: 'border-box'
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>Assignments</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>{assignments.length} assignments</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, fontFamily: 'system-ui, sans-serif', color: MUTED }}>Loading...</div>
      ) : assignments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, fontFamily: 'system-ui, sans-serif', color: MUTED }}>
          <MdAssignment style={{ fontSize: 48, opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
          No assignments found
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {assignments.map(a => (
            <div key={a.id} style={{
              background: '#fff', borderRadius: 12,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              padding: '18px 20px',
              display: 'flex', alignItems: 'flex-start',
              gap: 16
            }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MdAssignment style={{ color: ACCENT, fontSize: 22 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>{a.title}</h3>
                    {a.description && <p style={{ margin: '4px 0 0', fontSize: 12, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>{a.description}</p>}
                    {a.dueDate && (
                      <div style={{ marginTop: 6, fontSize: 12, color: '#f59e0b', fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}>
                        Due: {new Date(a.dueDate).toLocaleDateString()}
                      </div>
                    )}
                    {a.maxMarks && (
                      <div style={{ marginTop: 2, fontSize: 12, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>
                        Max marks: {a.maxMarks}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <StatusBadge status={a.submissionStatus || (a.submitted ? 'SUBMITTED' : 'PENDING')} />
                    {user?.role === 'STUDENT' && !a.submitted && (
                      <button
                        onClick={() => setSubmitModal(a)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '6px 12px', background: ACCENT, color: '#fff',
                          border: 'none', borderRadius: 6, fontSize: 12,
                          fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer'
                        }}
                      >
                        <MdCheck size={14} /> Submit
                      </button>
                    )}
                    {user?.role === 'FACULTY' && a.submissionId && !a.graded && (
                      <button
                        onClick={() => setGradeModal(a)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '6px 12px', background: '#10b981', color: '#fff',
                          border: 'none', borderRadius: 6, fontSize: 12,
                          fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer'
                        }}
                      >
                        <MdGrade size={14} /> Grade
                      </button>
                    )}
                    {a.grade != null && (
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981', fontFamily: 'system-ui, sans-serif' }}>
                        {a.grade}/{a.maxMarks || '?'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Modal */}
      {submitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 420 }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>Submit Assignment</h2>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>{submitModal.title}</p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, fontFamily: 'system-ui, sans-serif' }}>Submission URL *</label>
              <input type="url" value={submitUrl} onChange={e => setSubmitUrl(e.target.value)} placeholder="https://..." style={inputStyle}
                onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setSubmitModal(null)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer', color: MUTED }}>Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} style={{ flex: 1, padding: '10px', background: submitting ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>
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
            <h2 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>Grade Submission</h2>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>{gradeModal.title}</p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, fontFamily: 'system-ui, sans-serif' }}>Grade *</label>
              <input type="number" value={grade} onChange={e => setGrade(e.target.value)} placeholder={`Out of ${gradeModal.maxMarks || 100}`} style={inputStyle}
                onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, fontFamily: 'system-ui, sans-serif' }}>Feedback</label>
              <textarea value={gradeFeedback} onChange={e => setGradeFeedback(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setGradeModal(null)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer', color: MUTED }}>Cancel</button>
              <button onClick={handleGrade} disabled={submitting} style={{ flex: 1, padding: '10px', background: submitting ? '#6ee7b7' : '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>
                {submitting ? 'Saving...' : 'Save Grade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
