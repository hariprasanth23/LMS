import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }
const navItems = ['Health Center Feedback', 'General', 'Academics Calendar']

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid #e2e8f0', fontSize: 14, color: TEXT,
  outline: 'none', boxSizing: 'border-box', background: '#fff',
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{ fontSize: 22, cursor: 'pointer', color: (hover || value) >= star ? '#f59e0b' : '#e2e8f0', transition: 'color 0.1s' }}
        >★</span>
      ))}
    </div>
  )
}

// ─── Health Center Feedback ────────────────────────────────────────────────────
const hcCriteria = ['Staff Behaviour', 'Waiting Time', 'Cleanliness', 'Availability of Medicines', 'Treatment Quality']

const prevHCFeedbacks = [
  { date: '2025-05-10', ratings: { 'Staff Behaviour': 5, 'Waiting Time': 3, 'Cleanliness': 4, 'Availability of Medicines': 4, 'Treatment Quality': 5 }, comment: 'Good service overall', status: 'Reviewed' },
  { date: '2025-03-15', ratings: { 'Staff Behaviour': 4, 'Waiting Time': 2, 'Cleanliness': 4, 'Availability of Medicines': 3, 'Treatment Quality': 4 }, comment: 'Waiting time too long', status: 'Reviewed' },
]

function HealthCenterFeedbackSection() {
  const [ratings, setRatings] = useState(Object.fromEntries(hcCriteria.map(c => [c, 0])))
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setRatings(Object.fromEntries(hcCriteria.map(c => [c, 0])))
    setComment('')
    setTimeout(() => setSubmitted(false), 3500)
  }

  return (
    <div>
      <div style={{ ...card, padding: 20, marginBottom: 24, background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: '#fff', display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ fontSize: 40 }}>🏥</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>VIT Health Center</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>Open: Mon–Sat, 8:00 AM – 8:00 PM | Emergency: 24x7</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>Contact: 0416-220-0000 ext 3000 | health@vit.ac.in</div>
        </div>
      </div>

      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: TEXT }}>Rate Your Experience</h3>
        {submitted && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
            Feedback submitted successfully. Thank you!
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {hcCriteria.map(c => (
            <div key={c} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: TEXT, width: 220 }}>{c}</span>
              <StarRating value={ratings[c]} onChange={v => setRatings(p => ({ ...p, [c]: v }))} />
              <span style={{ fontSize: 13, color: MUTED, width: 40, textAlign: 'right' }}>{ratings[c] > 0 ? `${ratings[c]}/5` : '—'}</span>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Additional Comments</label>
            <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={comment} onChange={e => setComment(e.target.value)} placeholder="Any additional feedback..." />
          </div>
          <button type="submit" style={{ marginTop: 16, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Submit Feedback
          </button>
        </form>
      </div>

      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Previous Feedbacks</h3>
        {prevHCFeedbacks.map((f, i) => (
          <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: MUTED }}>{f.date}</span>
              <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#eef2ff', color: ACCENT }}>{f.status}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
              {hcCriteria.map(c => (
                <span key={c} style={{ fontSize: 12, color: MUTED }}>
                  {c}: <span style={{ color: '#f59e0b' }}>{'★'.repeat(f.ratings[c])}</span>
                </span>
              ))}
            </div>
            <div style={{ fontSize: 13, color: MUTED, fontStyle: 'italic' }}>"{f.comment}"</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function fmt(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── General Notices ───────────────────────────────────────────────────────────
function GeneralSection() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [readStatus, setReadStatus] = useState({})
  const [pinnedStatus, setPinnedStatus] = useState({})
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    api.get('/announcements').then(r => {
      const list = (r.data?.data || []).filter(a => !a.courseId)
      setAnnouncements(list)
      setReadStatus(Object.fromEntries(list.map(a => [a.id, false])))
      setPinnedStatus(Object.fromEntries(list.map(a => [a.id, false])))
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const sorted = [...announcements].sort((a, b) => (pinnedStatus[b.id] ? 1 : 0) - (pinnedStatus[a.id] ? 1 : 0))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>General Announcements</h3>
        <span style={{ fontSize: 13, color: MUTED }}>{Object.values(readStatus).filter(Boolean).length} of {announcements.length} read</span>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 32, color: MUTED }}>Loading announcements…</div>
      ) : sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: MUTED }}>No general announcements at this time.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.map(n => (
            <div key={n.id} style={{ ...card, border: pinnedStatus[n.id] ? `1px solid ${ACCENT}` : '1px solid #e2e8f0', opacity: readStatus[n.id] ? 0.75 : 1 }}>
              <div style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      {pinnedStatus[n.id] && <span style={{ fontSize: 12, background: '#eef2ff', color: ACCENT, borderRadius: 6, padding: '1px 8px', fontWeight: 700 }}>Pinned</span>}
                      <span style={{ fontSize: 12, color: MUTED }}>{fmt(n.createdAt)}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 4 }}>{n.title}</div>
                    {expanded[n.id] && <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, marginTop: 8 }}>{n.content}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => setExpanded(p => ({ ...p, [n.id]: !p[n.id] }))} style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      {expanded[n.id] ? 'Collapse' : 'View'}
                    </button>
                    {!readStatus[n.id] && (
                      <button onClick={() => setReadStatus(p => ({ ...p, [n.id]: true }))} style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 7, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Mark Read
                      </button>
                    )}
                    <button onClick={() => setPinnedStatus(p => ({ ...p, [n.id]: !p[n.id] }))} style={{ background: pinnedStatus[n.id] ? '#eef2ff' : '#f8fafc', color: pinnedStatus[n.id] ? ACCENT : MUTED, border: '1px solid #e2e8f0', borderRadius: 7, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      {pinnedStatus[n.id] ? 'Unpin' : 'Pin'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Academics Calendar ────────────────────────────────────────────────────────
const calendarEvents = [
  { date: 4, category: 'Exam', label: 'Mid Sem Exams Begin' },
  { date: 10, category: 'Event', label: 'Faculty Seminar' },
  { date: 15, category: 'Deadline', label: 'Grade Submission' },
  { date: 20, category: 'Holiday', label: 'Summer Vacation Starts' },
  { date: 25, category: 'Event', label: 'Research Symposium' },
  { date: 30, category: 'Deadline', label: 'Research Grant Deadline' },
]

const eventColors = {
  Exam: { bg: '#fee2e2', color: '#dc2626' },
  Holiday: { bg: '#e0e7ff', color: ACCENT },
  Event: { bg: '#f0fdf4', color: '#16a34a' },
  Deadline: { bg: '#fef3c7', color: '#d97706' },
}

function AcademicsCalendarSection() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [personalEvents, setPersonalEvents] = useState([])
  const [newEvent, setNewEvent] = useState({ date: '', title: '', type: 'Personal' })

  const addEvent = (e) => {
    e.preventDefault()
    setPersonalEvents(p => [...p, { ...newEvent, id: Date.now() }])
    setNewEvent({ date: '', title: '', type: 'Personal' })
    setShowAddForm(false)
  }

  const eventDates = Object.fromEntries(calendarEvents.map(e => [e.date, e]))

  return (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>June 2025</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Object.entries(eventColors).map(([cat, style]) => (
              <span key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: style.bg, border: `1px solid ${style.color}`, display: 'inline-block' }} />
                {cat}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: MUTED, padding: '4px 0' }}>{d}</div>
          ))}
          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
            const ev = eventDates[day]
            const style = ev ? eventColors[ev.category] : { bg: '#f8fafc', color: TEXT }
            return (
              <div key={day} title={ev ? ev.label : ''} style={{
                textAlign: 'center', padding: '8px 2px', borderRadius: 7, background: style.bg,
                color: style.color, fontSize: 13, fontWeight: ev ? 700 : 400, cursor: ev ? 'pointer' : 'default',
                border: ev ? `1px solid ${style.color}30` : '1px solid transparent',
              }}>
                {day}
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>Events This Month</h3>
        <button onClick={() => setShowAddForm(p => !p)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + Add Personal Event
        </button>
      </div>

      {showAddForm && (
        <div style={{ ...card, padding: 20, marginBottom: 16, border: '1px solid #c7d2fe' }}>
          <form onSubmit={addEvent}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 5 }}>Date</label>
                <input type="date" style={inputStyle} value={newEvent.date} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 5 }}>Title</label>
                <input style={inputStyle} value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} placeholder="Event title" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 5 }}>Type</label>
                <select style={inputStyle} value={newEvent.type} onChange={e => setNewEvent(p => ({ ...p, type: e.target.value }))}>
                  {['Personal', 'Reminder', 'Meeting'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <button type="submit" style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {calendarEvents.map((e, i) => {
          const style = eventColors[e.category]
          return (
            <div key={i} style={{ ...card, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14, border: `1px solid ${style.bg}` }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: style.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: style.color }}>{e.date}</div>
                <div style={{ fontSize: 10, color: style.color, fontWeight: 600 }}>JUN</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{e.label}</div>
                <span style={{ fontSize: 11, background: style.bg, color: style.color, padding: '1px 8px', borderRadius: 5, fontWeight: 600 }}>{e.category}</span>
              </div>
            </div>
          )
        })}
        {personalEvents.map((e, i) => (
          <div key={e.id} style={{ ...card, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14, border: '1px dashed #c7d2fe' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eef2ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT }}>{e.date.split('-')[2]}</div>
              <div style={{ fontSize: 9, color: ACCENT, fontWeight: 600 }}>Personal</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{e.title}</div>
              <span style={{ fontSize: 11, background: '#eef2ff', color: ACCENT, padding: '1px 8px', borderRadius: 5, fontWeight: 600 }}>{e.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyInfoCorner() {
  const [activeNav, setActiveNav] = useState('Health Center Feedback')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Services — Info Corner</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Health center, general info and academics calendar</p>
      </div>

      <div style={{ ...card, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: 210, borderRight: '1px solid #f1f5f9', padding: '16px 0', flexShrink: 0 }}>
          {navItems.map(item => (
            <button key={item} onClick={() => setActiveNav(item)}
              style={{
                display: 'block', width: '100%', padding: '11px 20px',
                background: activeNav === item ? '#eef2ff' : 'transparent',
                border: 'none', borderLeft: activeNav === item ? '3px solid #6366f1' : '3px solid transparent',
                textAlign: 'left', fontSize: 14, fontWeight: activeNav === item ? 600 : 400,
                color: activeNav === item ? ACCENT : TEXT, cursor: 'pointer',
              }}
            >{item}</button>
          ))}
        </div>
        <div style={{ flex: 1, padding: 28, minWidth: 0 }}>
          {activeNav === 'Health Center Feedback' && <HealthCenterFeedbackSection />}
          {activeNav === 'General' && <GeneralSection />}
          {activeNav === 'Academics Calendar' && <AcademicsCalendarSection />}
        </div>
      </div>
    </div>
  )
}
