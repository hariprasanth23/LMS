import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['Health Center Feedback', 'FAQ']

const faqData = [
  {
    category: 'Academic',
    items: [
      { q: 'How do I register for courses?', a: 'Log in to the student portal and navigate to Course Registration under the Academics section. Select your desired courses before the registration deadline.' },
      { q: 'What is the minimum attendance requirement?', a: 'The minimum attendance requirement is 75% for all courses. Students below this threshold may be barred from appearing in examinations.' },
      { q: 'How are grades calculated?', a: 'Grades are calculated based on internal assessments (40%) and end-semester examinations (60%). Refer to the academic regulations for the grading scale.' },
    ],
  },
  {
    category: 'Examination',
    items: [
      { q: 'When is the exam schedule released?', a: 'The examination schedule is typically released 4 weeks before the examination period. Check the Examinations section in the portal for updates.' },
      { q: 'How to apply for revaluation?', a: 'After results are published, apply for revaluation through the Examinations portal within 15 days. A fee of ₹300 per subject applies.' },
      { q: 'What documents are needed for makeup exam?', a: 'Medical certificate from a registered doctor, original hospital receipts, and a written application to the Dean of Examinations are required.' },
    ],
  },
  {
    category: 'Finance',
    items: [
      { q: 'When are fees due?', a: 'Tuition fees are due at the start of each semester, typically by the end of the first week. Late payments attract a penalty of ₹100/day.' },
      { q: 'How do I apply for scholarship?', a: 'Visit the Finance section and click on Scholarships. Fill out the application form and upload required documents before the deadline.' },
      { q: 'What is the refund policy?', a: 'Full refund is available if withdrawal is before the semester starts. 50% refund is available within the first 30 days. No refund after 30 days.' },
    ],
  },
  {
    category: 'Services',
    items: [
      { q: 'How to get a bonafide certificate?', a: 'Go to Services > Bonafide Certificate in the portal and fill out the application form. The certificate will be ready within 2 working days.' },
      { q: 'How to register for hostel?', a: 'Hostel registration is done at the start of each academic year through the Services section. Fill the hostel allotment form and submit required documents.' },
      { q: 'How to apply for transport?', a: 'Navigate to Services > Transport Registration. Select your route and submit the application. Transport fees will be added to your fee statement.' },
    ],
  },
  {
    category: 'Technical',
    items: [
      { q: 'How to reset my password?', a: 'Click "Forgot Password" on the login page and enter your registered email. A reset link will be sent to your email within a few minutes.' },
      { q: 'How to access online learning resources?', a: 'All online learning resources are available in the LMS section. Log in with your student credentials to access course materials and recordings.' },
      { q: 'Who do I contact for portal issues?', a: 'Contact the IT Helpdesk at ithelpdesk@college.edu or call extension 1234. Support is available Monday to Friday, 9 AM to 5 PM.' },
    ],
  },
]

const prevFeedbacks = [
  { date: '2024-04-10', doctor: 'Dr. Priya Nair', rating: 4, comment: 'Good consultation, waiting time was acceptable.' },
  { date: '2024-02-22', doctor: 'Nurse Kavitha', rating: 5, comment: 'Very helpful and attentive.' },
]

function StarRating({ value, onChange, label }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
      <span style={{ width: 180, fontSize: 13, color: TEXT }}>{label}</span>
      <div style={{ display: 'flex', gap: 4 }}>
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
    </div>
  )
}

function HealthCenterFeedback() {
  const [form, setForm] = useState({
    visitDate: '',
    doctor: 'Dr. Priya Nair',
    ratings: { waitingTime: 0, doctorConsultation: 0, medicationAvailability: 0, cleanliness: 0, overall: 0 },
    comments: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleRating = (key, val) => {
    setForm(prev => ({ ...prev, ratings: { ...prev.ratings, [key]: val } }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div>
      {/* Health Center Info */}
      <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: ACCENT }}>Health Center Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14 }}>
          {[
            ['Location', 'Block A, Ground Floor'],
            ['Hours', '8 AM – 8 PM (Mon–Sat)'],
            ['Doctor', 'Dr. Priya Nair (MBBS)'],
            ['Emergency', '044-XXXX-XXXX'],
          ].map(([k, v]) => (
            <div key={k}>
              <span style={{ color: MUTED, fontWeight: 600 }}>{k}: </span>
              <span style={{ color: TEXT }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Form */}
      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Submit Feedback</h3>
        {submitted && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
            Thank you for your feedback!
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Visit Date *</label>
              <input
                type="date"
                name="visitDate"
                value={form.visitDate}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Doctor Consulted</label>
              <select
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}
              >
                {['Dr. Priya Nair', 'Nurse Kavitha', 'Others'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: TEXT }}>Service Ratings</p>
            {[
              ['waitingTime', 'Waiting Time'],
              ['doctorConsultation', 'Doctor Consultation'],
              ['medicationAvailability', 'Medication Availability'],
              ['cleanliness', 'Cleanliness'],
              ['overall', 'Overall Experience'],
            ].map(([key, label]) => (
              <StarRating key={key} value={form.ratings[key]} onChange={(v) => handleRating(key, v)} label={label} />
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Comments</label>
            <textarea
              name="comments"
              value={form.comments}
              onChange={handleChange}
              rows={3}
              placeholder="Share your experience or suggestions..."
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
          >
            Submit Feedback
          </button>
        </form>
      </div>

      {/* Previous Feedbacks */}
      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>My Previous Feedbacks</h3>
        {prevFeedbacks.length === 0 ? (
          <p style={{ color: MUTED, fontSize: 14 }}>No previous feedbacks.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Date', 'Doctor', 'Rating', 'Comment'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prevFeedbacks.map((fb, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{fb.date}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{fb.doctor}</td>
                  <td style={{ padding: '12px 14px', color: '#f59e0b' }}>{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</td>
                  <td style={{ padding: '12px 14px', color: MUTED }}>{fb.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function FAQ() {
  const [search, setSearch] = useState('')
  const [openItems, setOpenItems] = useState({})

  const toggle = (key) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const filtered = faqData.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      search === '' || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0)

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search FAQs..."
          style={{ width: '100%', padding: '11px 16px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        />
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: MUTED, fontSize: 14 }}>No results found for "{search}".</p>
      ) : (
        filtered.map(cat => (
          <div key={cat.category} style={{ marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.category}</h3>
            {cat.items.map((item, idx) => {
              const key = `${cat.category}-${idx}`
              const isOpen = openItems[key]
              return (
                <div
                  key={idx}
                  style={{ border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 8, overflow: 'hidden', background: '#fff' }}
                >
                  <button
                    onClick={() => toggle(key)}
                    style={{ width: '100%', padding: '14px 18px', background: isOpen ? '#eef2ff' : '#fff', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 600, color: isOpen ? ACCENT : TEXT }}
                  >
                    <span>{item.q}</span>
                    <span style={{ fontSize: 18, color: ACCENT, marginLeft: 12, flexShrink: 0 }}>{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '12px 18px 16px', fontSize: 14, color: MUTED, lineHeight: 1.6, borderTop: '1px solid #e2e8f0', background: '#fafafa' }}>
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))
      )}
    </div>
  )
}

export default function InfoCorner() {
  const [activeNav, setActiveNav] = useState('Health Center Feedback')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Services — Info Corner</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Health center feedback and frequently asked questions</p>
      </div>

      {/* Card with left nav + content */}
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
          {activeNav === 'Health Center Feedback' && <HealthCenterFeedback />}
          {activeNav === 'FAQ' && <FAQ />}
        </div>
      </div>
    </div>
  )
}
