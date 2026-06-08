import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'
const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }
const navItems = ['Feedback Form', 'Course Feedback 24x7']

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} onClick={() => onChange && onChange(star)}
          onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
          style={{ fontSize: 22, cursor: onChange ? 'pointer' : 'default', color: (hover || value) >= star ? '#f59e0b' : '#e2e8f0', transition: 'color 0.1s' }}>★</span>
      ))}
    </div>
  )
}

const ratingCriteria = ['Content Delivery', 'Teaching Clarity', 'Student Engagement', 'Use of Technology', 'Availability for Doubts']
const criteriaKeys = { 'Content Delivery': 'contentDelivery', 'Teaching Clarity': 'teachingClarity', 'Student Engagement': 'studentEngagement', 'Use of Technology': 'useOfTechnology', 'Availability for Doubts': 'availabilityForDoubts' }

function FeedbackForm() {
  const [statusData, setStatusData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeCourse, setActiveCourse] = useState(null)
  const [ratings, setRatings] = useState({})
  const [comments, setComments] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/feedback/status')
      .then(r => {
        const data = r.data.data
        setStatusData(data)
        if (data?.courses?.length) {
          setActiveCourse(data.courses[0].code)
          const initRatings = {}
          const initComments = {}
          data.courses.forEach(c => {
            initRatings[c.code] = { contentDelivery: 0, teachingClarity: 0, studentEngagement: 0, useOfTechnology: 0, availabilityForDoubts: 0 }
            initComments[c.code] = ''
          })
          setRatings(initRatings)
          setComments(initComments)
        }
      })
      .catch(() => toast.error('Failed to load feedback status'))
      .finally(() => setLoading(false))
  }, [])

  const handleRating = (courseCode, key, val) => {
    setRatings(prev => ({ ...prev, [courseCode]: { ...prev[courseCode], [key]: val } }))
  }

  const handleSubmitAll = async () => {
    const courses = statusData?.courses || []
    const pending = courses.filter(c => !c.submitted)
    if (!pending.length) return

    const feedbacks = pending.map(c => ({
      courseCode: c.code,
      courseName: c.name,
      facultyName: c.faculty,
      ...ratings[c.code],
      comments: comments[c.code] || '',
    }))

    setSubmitting(true)
    try {
      await api.post('/feedback/course', { feedbacks })
      toast.success('All feedback submitted!')
      setStatusData(prev => ({
        ...prev,
        courses: prev.courses.map(c => ({ ...c, submitted: true }))
      }))
    } catch {
      toast.error('Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: MUTED }}>Loading…</div>

  const courses = statusData?.courses || []
  const activeCourseData = courses.find(c => c.code === activeCourse)
  const allSubmitted = courses.every(c => c.submitted)

  return (
    <div>
      <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 10, padding: '12px 18px', marginBottom: 20, fontSize: 14, color: ACCENT, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>ℹ️</span> Your feedback is anonymous and helps improve teaching quality.
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <span style={{ fontSize: 14, color: MUTED, fontWeight: 600 }}>Current Period:</span>
        <span style={{ background: ACCENT, color: '#fff', borderRadius: 8, padding: '5px 16px', fontSize: 14, fontWeight: 700 }}>
          Semester {statusData?.semester} · 2024–25
        </span>
      </div>

      {courses.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: MUTED }}>No courses available for feedback</div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: '2px solid #e2e8f0' }}>
            {courses.map(c => (
              <button key={c.code} onClick={() => setActiveCourse(c.code)} style={{
                padding: '10px 20px', background: 'transparent', border: 'none',
                borderBottom: activeCourse === c.code ? `2px solid ${ACCENT}` : '2px solid transparent',
                marginBottom: -2, fontSize: 14, fontWeight: activeCourse === c.code ? 700 : 400,
                color: activeCourse === c.code ? ACCENT : TEXT, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {c.code}
                {c.submitted
                  ? <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 5, padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>✓</span>
                  : <span style={{ background: '#fef3c7', color: '#d97706', borderRadius: 5, padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>⏳</span>}
              </button>
            ))}
          </div>

          <div style={{ ...card, padding: 24, borderTopLeftRadius: 0, borderTopRightRadius: 0, marginBottom: 20 }}>
            {activeCourseData && (
              <>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>{activeCourseData.name}</div>
                  <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{activeCourseData.faculty} · {activeCourseData.code}</div>
                </div>

                {activeCourseData.submitted ? (
                  <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 10, padding: '16px 20px', color: '#166534', fontWeight: 600, fontSize: 14 }}>
                    Feedback submitted for this course. Thank you!
                  </div>
                ) : ratings[activeCourse] ? (
                  <>
                    <div style={{ marginBottom: 20 }}>
                      <p style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: TEXT }}>Rating Criteria</p>
                      {ratingCriteria.map(criterion => (
                        <div key={criterion} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                          <span style={{ fontSize: 14, color: TEXT, width: 220 }}>{criterion}</span>
                          <StarRating value={ratings[activeCourse][criteriaKeys[criterion]] || 0}
                            onChange={v => handleRating(activeCourse, criteriaKeys[criterion], v)} />
                          <span style={{ fontSize: 13, color: MUTED, width: 40, textAlign: 'right' }}>
                            {ratings[activeCourse][criteriaKeys[criterion]] > 0 ? `${ratings[activeCourse][criteriaKeys[criterion]]}/5` : '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Additional Comments</label>
                      <textarea value={comments[activeCourse] || ''} onChange={e => setComments(p => ({ ...p, [activeCourse]: e.target.value }))}
                        rows={3} placeholder="Share any suggestions or feedback for the faculty..."
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }} />
                    </div>
                  </>
                ) : null}
              </>
            )}
          </div>

          <div style={{ ...card, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {courses.map(c => (
                <span key={c.code} style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {c.code}
                  {c.submitted ? <span style={{ color: '#16a34a' }}>✅ Submitted</span> : <span style={{ color: '#d97706' }}>⏳ Pending</span>}
                </span>
              ))}
            </div>
            <button onClick={handleSubmitAll} disabled={allSubmitted || submitting} style={{
              background: allSubmitted ? '#e2e8f0' : ACCENT,
              color: allSubmitted ? MUTED : '#fff',
              border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600,
              cursor: allSubmitted ? 'not-allowed' : 'pointer',
            }}>
              {submitting ? 'Submitting…' : allSubmitted ? 'All Submitted' : 'Submit All Feedback'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const feedbackStatusColor = (s) => {
  if (s === 'Action Taken') return { color: '#16a34a', background: '#dcfce7', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
  if (s === 'Reviewed')     return { color: ACCENT,    background: '#eef2ff', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
  return { color: '#d97706', background: '#fef3c7', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
}

function CourseFeedback24x7() {
  const [form, setForm] = useState({ course: '', feedbackType: 'Suggestion', topic: 'Content', rating: 0, feedbackText: '', anonymous: true })
  const [previousFeedbacks, setPreviousFeedbacks] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [charError, setCharError] = useState(false)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    api.get('/feedback/status')
      .then(r => {
        const c = r.data.data?.courses || []
        setCourses(c)
        if (c.length) setForm(prev => ({ ...prev, course: c[0].code }))
      })
      .catch(() => {})

    api.get('/feedback/247')
      .then(r => setPreviousFeedbacks(r.data.data || []))
      .catch(() => {})
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.feedbackText.length < 50) { setCharError(true); return }
    setCharError(false)
    setSubmitting(true)
    try {
      const courseObj = courses.find(c => c.code === form.course)
      const res = await api.post('/feedback/247', {
        courseCode: form.course,
        courseName: courseObj?.name || form.course,
        feedbackType: form.feedbackType,
        topic: form.topic,
        rating: form.rating,
        feedbackText: form.feedbackText,
        anonymous: form.anonymous,
      })
      setPreviousFeedbacks(prev => [res.data.data, ...prev])
      setForm(prev => ({ ...prev, feedbackText: '', rating: 0 }))
      toast.success('Feedback submitted!')
    } catch {
      toast.error('Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 10, padding: '14px 20px', marginBottom: 24, fontSize: 14, color: ACCENT, fontWeight: 500 }}>
        You can provide feedback on any course at any time, not just during the feedback window.
      </div>

      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Submit Feedback</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Course *</label>
              <select name="course" value={form.course} onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, background: '#fff', boxSizing: 'border-box' }}>
                {courses.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Feedback Type</label>
              <select name="feedbackType" value={form.feedbackType} onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, background: '#fff', boxSizing: 'border-box' }}>
                {['Suggestion', 'Appreciation', 'Complaint', 'General'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Topic</label>
              <select name="topic" value={form.topic} onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, background: '#fff', boxSizing: 'border-box' }}>
                {['Content', 'Teaching Method', 'Resources', 'Assignments', 'Assessment', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 8 }}>Overall Rating</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <StarRating value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
                {form.rating > 0 && <span style={{ fontSize: 14, color: MUTED }}>{form.rating}/5</span>}
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>
                Detailed Feedback <span style={{ color: MUTED, fontWeight: 400 }}>(minimum 50 characters)</span>
              </label>
              <textarea name="feedbackText" value={form.feedbackText} onChange={handleChange} required rows={4}
                placeholder="Describe your feedback in detail (at least 50 characters)..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: charError ? '1px solid #ef4444' : '1px solid #e2e8f0', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                {charError && <span style={{ fontSize: 12, color: '#ef4444' }}>Minimum 50 characters required.</span>}
                <span style={{ fontSize: 12, color: form.feedbackText.length >= 50 ? '#16a34a' : MUTED, marginLeft: 'auto' }}>{form.feedbackText.length} characters</span>
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <div onClick={() => setForm(p => ({ ...p, anonymous: !p.anonymous }))}
                  style={{ width: 42, height: 24, borderRadius: 99, background: form.anonymous ? ACCENT : '#e2e8f0', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 3, left: form.anonymous ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </div>
                <span style={{ fontSize: 14, color: TEXT, fontWeight: 500 }}>Submit Anonymously</span>
              </label>
              <span style={{ fontSize: 13, color: MUTED }}>{form.anonymous ? '(Your identity will not be shared)' : '(Your name will be visible to the faculty)'}</span>
            </div>
          </div>
          <button type="submit" disabled={submitting}
            style={{ marginTop: 22, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            {submitting ? 'Submitting…' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>My Previous 24x7 Feedbacks</h3>
        {previousFeedbacks.length === 0 ? (
          <div style={{ color: MUTED, fontSize: 14 }}>No previous feedbacks</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 500 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Course', 'Type', 'Topic', 'Rating', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previousFeedbacks.map((f, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600, fontSize: 13 }}>{f.courseCode}</td>
                    <td style={{ padding: '12px 14px', color: TEXT }}>{f.feedbackType}</td>
                    <td style={{ padding: '12px 14px', color: MUTED }}>{f.topic}</td>
                    <td style={{ padding: '12px 14px', color: '#f59e0b' }}>{'★'.repeat(f.rating || 0)}{'☆'.repeat(5 - (f.rating || 0))}</td>
                    <td style={{ padding: '12px 14px', color: MUTED }}>{f.submittedAt ? new Date(f.submittedAt).toLocaleDateString('en-IN') : '—'}</td>
                    <td style={{ padding: '12px 14px' }}><span style={feedbackStatusColor(f.status)}>{f.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FeedbackGeneral() {
  const [activeNav, setActiveNav] = useState('Feedback Form')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Feedback</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Course feedback and continuous improvement surveys</p>
      </div>

      <div style={{ ...card, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden' }}>
        <div style={{
          width: isMobile ? '100%' : 210, borderRight: isMobile ? 'none' : '1px solid #f1f5f9',
          borderBottom: isMobile ? '1px solid #e2e8f0' : 'none', padding: isMobile ? '8px 4px' : '16px 0',
          flexShrink: 0, display: isMobile ? 'flex' : 'block', flexWrap: isMobile ? 'wrap' : undefined, overflowX: isMobile ? 'auto' : undefined,
        }}>
          {navItems.map(item => (
            <button key={item} onClick={() => setActiveNav(item)} style={{
              display: isMobile ? 'inline-block' : 'block', width: isMobile ? 'auto' : '100%',
              padding: isMobile ? '6px 12px' : '11px 20px',
              background: activeNav === item ? '#eef2ff' : 'transparent', border: 'none',
              borderLeft: isMobile ? 'none' : (activeNav === item ? '3px solid #6366f1' : '3px solid transparent'),
              borderBottom: isMobile ? (activeNav === item ? '2px solid #6366f1' : '2px solid transparent') : 'none',
              borderRadius: isMobile ? 100 : 0, textAlign: 'left',
              fontSize: isMobile ? 12 : 14, fontWeight: activeNav === item ? 600 : 400,
              color: activeNav === item ? ACCENT : TEXT, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              {item}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, padding: isMobile ? '16px' : 28, minWidth: 0 }}>
          {activeNav === 'Feedback Form' && <FeedbackForm />}
          {activeNav === 'Course Feedback 24x7' && <CourseFeedback24x7 />}
        </div>
      </div>
    </div>
  )
}
