import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['Feedback Form', 'Course Feedback 24x7']

// ─── Star Rating Component ─────────────────────────────────────────────────────
function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{ fontSize: 22, cursor: 'pointer', color: (hover || value) >= star ? '#f59e0b' : '#e2e8f0', transition: 'color 0.1s' }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

// ─── Feedback Form ─────────────────────────────────────────────────────────────
const courses = [
  { code: 'CS6001', name: 'Machine Learning', faculty: 'Dr. A. Rajesh' },
  { code: 'CS6002', name: 'Computer Networks', faculty: 'Dr. M. Kumar' },
  { code: 'CS6003', name: 'Software Engineering', faculty: 'Dr. R. Priya' },
]

const ratingCriteria = ['Content Delivery', 'Teaching Clarity', 'Student Engagement', 'Use of Technology', 'Availability for Doubts']

const submittedStatus = {
  CS6001: true,
  CS6002: false,
  CS6003: false,
}

function FeedbackForm() {
  const [activeCourse, setActiveCourse] = useState('CS6001')
  const [ratings, setRatings] = useState({
    CS6001: { 'Content Delivery': 4, 'Teaching Clarity': 5, 'Student Engagement': 4, 'Use of Technology': 3, 'Availability for Doubts': 5 },
    CS6002: { 'Content Delivery': 0, 'Teaching Clarity': 0, 'Student Engagement': 0, 'Use of Technology': 0, 'Availability for Doubts': 0 },
    CS6003: { 'Content Delivery': 0, 'Teaching Clarity': 0, 'Student Engagement': 0, 'Use of Technology': 0, 'Availability for Doubts': 0 },
  })
  const [comments, setComments] = useState({ CS6001: '', CS6002: '', CS6003: '' })
  const [localSubmitted, setLocalSubmitted] = useState({ ...submittedStatus })
  const [allSubmitted, setAllSubmitted] = useState(false)

  const handleRating = (course, criterion, val) => {
    setRatings(prev => ({ ...prev, [course]: { ...prev[course], [criterion]: val } }))
  }

  const handleSubmitAll = () => {
    setLocalSubmitted({ CS6001: true, CS6002: true, CS6003: true })
    setAllSubmitted(true)
    setTimeout(() => setAllSubmitted(false), 4000)
  }

  const activeCourseData = courses.find(c => c.code === activeCourse)

  return (
    <div>
      {/* Info Notice */}
      <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 10, padding: '12px 18px', marginBottom: 20, fontSize: 14, color: ACCENT, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>ℹ️</span>
        Your feedback is anonymous and helps improve teaching quality.
      </div>

      {/* Semester Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <span style={{ fontSize: 14, color: MUTED, fontWeight: 600 }}>Current Period:</span>
        <span style={{ background: ACCENT, color: '#fff', borderRadius: 8, padding: '5px 16px', fontSize: 14, fontWeight: 700 }}>Semester 6 · 2024–25</span>
      </div>

      {/* Course Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: '2px solid #e2e8f0' }}>
        {courses.map(c => (
          <button
            key={c.code}
            onClick={() => setActiveCourse(c.code)}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeCourse === c.code ? `2px solid ${ACCENT}` : '2px solid transparent',
              marginBottom: -2,
              fontSize: 14,
              fontWeight: activeCourse === c.code ? 700 : 400,
              color: activeCourse === c.code ? ACCENT : TEXT,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {c.code}
            {localSubmitted[c.code] ? (
              <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 5, padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>✓</span>
            ) : (
              <span style={{ background: '#fef3c7', color: '#d97706', borderRadius: 5, padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>⏳</span>
            )}
          </button>
        ))}
      </div>

      {/* Course Feedback Card */}
      <div style={{ ...card, padding: 24, borderTopLeftRadius: 0, borderTopRightRadius: 0, marginBottom: 20 }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>{activeCourseData.name}</div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{activeCourseData.faculty} · {activeCourseData.code}</div>
        </div>

        {localSubmitted[activeCourse] ? (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 10, padding: '16px 20px', color: '#166534', fontWeight: 600, fontSize: 14 }}>
            Feedback submitted for this course. Thank you!
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: TEXT }}>Rating Criteria</p>
              {ratingCriteria.map(criterion => (
                <div key={criterion} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                  <span style={{ fontSize: 14, color: TEXT, width: 220 }}>{criterion}</span>
                  <StarRating
                    value={ratings[activeCourse][criterion]}
                    onChange={(v) => handleRating(activeCourse, criterion, v)}
                  />
                  <span style={{ fontSize: 13, color: MUTED, width: 40, textAlign: 'right' }}>
                    {ratings[activeCourse][criterion] > 0 ? `${ratings[activeCourse][criterion]}/5` : '—'}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Additional Comments</label>
              <textarea
                value={comments[activeCourse]}
                onChange={e => setComments(p => ({ ...p, [activeCourse]: e.target.value }))}
                rows={3}
                placeholder="Share any suggestions or feedback for the faculty..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
          </>
        )}
      </div>

      {/* Submit All + Status */}
      <div style={{ ...card, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {courses.map(c => (
            <span key={c.code} style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
              {c.code}
              {localSubmitted[c.code]
                ? <span style={{ color: '#16a34a' }}>✅ Submitted</span>
                : <span style={{ color: '#d97706' }}>⏳ Pending</span>}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          {allSubmitted && <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>All feedback submitted!</span>}
          <button
            onClick={handleSubmitAll}
            disabled={Object.values(localSubmitted).every(Boolean)}
            style={{
              background: Object.values(localSubmitted).every(Boolean) ? '#e2e8f0' : ACCENT,
              color: Object.values(localSubmitted).every(Boolean) ? MUTED : '#fff',
              border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600,
              cursor: Object.values(localSubmitted).every(Boolean) ? 'not-allowed' : 'pointer',
            }}
          >
            Submit All Feedback
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Course Feedback 24x7 ─────────────────────────────────────────────────────
const allCourses = [
  'CS6001 — Machine Learning',
  'CS6002 — Computer Networks',
  'CS6003 — Software Engineering',
  'CS5001 — Database Systems',
  'CS5002 — Operating Systems',
]

const prev24x7Feedbacks = [
  { course: 'CS5001 — Database Systems', type: 'Suggestion', topic: 'Content', rating: 4, date: '2024-05-10', status: 'Reviewed' },
  { course: 'CS6001 — Machine Learning', type: 'Appreciation', topic: 'Teaching Method', rating: 5, date: '2024-04-22', status: 'Action Taken' },
  { course: 'CS5002 — Operating Systems', type: 'Complaint', topic: 'Assignments', rating: 2, date: '2024-03-15', status: 'Received' },
]

const feedbackStatusColor = (s) => {
  if (s === 'Action Taken') return { color: '#16a34a', background: '#dcfce7', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
  if (s === 'Reviewed') return { color: ACCENT, background: '#eef2ff', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
  return { color: '#d97706', background: '#fef3c7', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600 }
}

function CourseFeedback24x7() {
  const [form, setForm] = useState({
    course: allCourses[0],
    type: 'Suggestion',
    topic: 'Content',
    rating: 0,
    feedback: '',
    anonymous: true,
  })
  const [submitted, setSubmitted] = useState(false)
  const [charError, setCharError] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.feedback.length < 50) {
      setCharError(true)
      return
    }
    setCharError(false)
    setSubmitted(true)
    setForm({ course: allCourses[0], type: 'Suggestion', topic: 'Content', rating: 0, feedback: '', anonymous: true })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div>
      {/* Info Card */}
      <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 10, padding: '14px 20px', marginBottom: 24, fontSize: 14, color: ACCENT, fontWeight: 500 }}>
        You can provide feedback on any course at any time, not just during the feedback window.
      </div>

      {/* Form */}
      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Submit Feedback</h3>
        {submitted && <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>Feedback submitted successfully!</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Course */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Course *</label>
              <select name="course" value={form.course} onChange={handleChange} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}>
                {allCourses.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Feedback Type */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Feedback Type</label>
              <select name="type" value={form.type} onChange={handleChange} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}>
                {['Suggestion', 'Appreciation', 'Complaint', 'General'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Topic</label>
              <select name="topic" value={form.topic} onChange={handleChange} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}>
                {['Content', 'Teaching Method', 'Resources', 'Assignments', 'Assessment', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Rating */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 8 }}>Overall Rating</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <StarRating value={form.rating} onChange={(v) => setForm(p => ({ ...p, rating: v }))} />
                {form.rating > 0 && <span style={{ fontSize: 14, color: MUTED }}>{form.rating}/5</span>}
              </div>
            </div>

            {/* Detailed Feedback */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>
                Detailed Feedback <span style={{ color: MUTED, fontWeight: 400 }}>(minimum 50 characters)</span>
              </label>
              <textarea
                name="feedback"
                value={form.feedback}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe your feedback in detail (at least 50 characters)..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: charError ? '1px solid #ef4444' : '1px solid #e2e8f0', fontSize: 14, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                {charError && <span style={{ fontSize: 12, color: '#ef4444' }}>Minimum 50 characters required.</span>}
                <span style={{ fontSize: 12, color: form.feedback.length >= 50 ? '#16a34a' : MUTED, marginLeft: 'auto' }}>{form.feedback.length} characters</span>
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <div
                  onClick={() => setForm(p => ({ ...p, anonymous: !p.anonymous }))}
                  style={{
                    width: 42, height: 24, borderRadius: 99, background: form.anonymous ? ACCENT : '#e2e8f0',
                    position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 3, left: form.anonymous ? 21 : 3,
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
                <span style={{ fontSize: 14, color: TEXT, fontWeight: 500 }}>Submit Anonymously</span>
              </label>
              <span style={{ fontSize: 13, color: MUTED }}>{form.anonymous ? '(Your identity will not be shared)' : '(Your name will be visible to the faculty)'}</span>
            </div>
          </div>

          <button type="submit" style={{ marginTop: 22, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Submit Feedback
          </button>
        </form>
      </div>

      {/* Previous 24x7 Feedbacks */}
      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>My Previous 24x7 Feedbacks</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Course', 'Type', 'Topic', 'Rating', 'Date', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prev24x7Feedbacks.map((f, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600, fontSize: 13 }}>{f.course}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{f.type}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{f.topic}</td>
                <td style={{ padding: '12px 14px', color: '#f59e0b' }}>{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{f.date}</td>
                <td style={{ padding: '12px 14px' }}><span style={feedbackStatusColor(f.status)}>{f.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FeedbackGeneral() {
  const [activeNav, setActiveNav] = useState('Feedback Form')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Feedback</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Course feedback and continuous improvement surveys</p>
      </div>

      {/* Card: left nav + content */}
      <div style={{ ...card, display: 'flex', overflow: 'hidden' }}>
        {/* Left Nav */}
        <div style={{ width: 210, borderRight: '1px solid #f1f5f9', padding: '16px 0', flexShrink: 0 }}>
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              style={{
                display: 'block',
                width: '100%',
                padding: '11px 20px',
                background: activeNav === item ? '#eef2ff' : 'transparent',
                border: 'none',
                borderLeft: activeNav === item ? '3px solid #6366f1' : '3px solid transparent',
                textAlign: 'left',
                fontSize: 14,
                fontWeight: activeNav === item ? 600 : 400,
                color: activeNav === item ? ACCENT : TEXT,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 28, minWidth: 0 }}>
          {activeNav === 'Feedback Form' && <FeedbackForm />}
          {activeNav === 'Course Feedback 24x7' && <CourseFeedback24x7 />}
        </div>
      </div>
    </div>
  )
}
