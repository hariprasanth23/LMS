import React, { useState, useEffect } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = [
  'Research Regulations',
  'My Research Profile',
  'Course Work Registration',
  'Registration Status',
  'Meeting Info',
  'Attendance View',
  'Research Letters',
  'Electronic Thesis Submission',
  'Research Document Upload',
  'Guide Scholar Meeting',
  'Weekly Scholar Workload',
]

// ─── Research Regulations ─────────────────────────────────────────────────────
const regulations = [
  { title: 'Eligibility for PhD Registration', icon: '🎓', content: 'Candidates must hold a Master\'s degree with a minimum of 55% marks in the relevant discipline. Candidates from reserved categories require 50%. All candidates must qualify the entrance examination conducted by the institution.' },
  { title: 'Course Work Requirements', icon: '📚', content: 'All full-time Ph.D. scholars must complete 20 credits of course work within the first two semesters. Part-time scholars must complete within the first four semesters. Minimum grade of B is required to pass each course.' },
  { title: 'Synopsis Submission Guidelines', icon: '📝', content: 'Synopsis must be submitted after completing course work and at least two years of research. The synopsis should be a comprehensive summary of the research work (max 5000 words) and must be approved by the Doctoral Committee.' },
  { title: 'Thesis Submission Process', icon: '📄', content: 'The final thesis must be submitted in the prescribed format. Pre-submission seminar is mandatory. Anti-plagiarism check must show less than 10% similarity. Thesis must be evaluated by two external examiners before viva voce.' },
  { title: 'Plagiarism Policy', icon: '⚖️', content: 'All research documents including thesis are subject to plagiarism checks using authorized software. Similarity index must not exceed 10% for thesis and 15% for research articles. Violation may result in cancellation of registration.' },
  { title: 'Publication Requirements', icon: '📰', content: 'Ph.D. scholars are required to publish at least one paper in a UGC-listed journal before thesis submission. Publication in SCI/SCIE indexed journals is strongly encouraged and may accelerate the evaluation process.' },
]

function ResearchRegulations() {
  const [openSections, setOpenSections] = useState({})
  const toggle = (i) => setOpenSections(prev => ({ ...prev, [i]: !prev[i] }))

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Research Regulations</h2>
      {regulations.map((reg, i) => (
        <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
          <button
            onClick={() => toggle(i)}
            style={{ width: '100%', padding: '14px 18px', background: openSections[i] ? '#eef2ff' : '#fff', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 600, color: openSections[i] ? ACCENT : TEXT }}
          >
            <span>{reg.icon} {reg.title}</span>
            <span style={{ fontSize: 18, color: ACCENT }}>{openSections[i] ? '−' : '+'}</span>
          </button>
          {openSections[i] && (
            <div style={{ padding: '12px 18px 16px', fontSize: 14, color: MUTED, lineHeight: 1.7, borderTop: '1px solid #e2e8f0', background: '#fafafa' }}>
              {reg.content}
            </div>
          )}
        </div>
      ))}
      <button style={{ marginTop: 16, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
        Download Full Regulations PDF
      </button>
    </div>
  )
}

// ─── My Research Profile ──────────────────────────────────────────────────────
function MyResearchProfile() {
  const stats = [
    { label: 'Publications', value: 3, color: ACCENT },
    { label: 'Conferences', value: 2, color: '#16a34a' },
    { label: 'Patents', value: 0, color: '#d97706' },
    { label: 'Course Work Credits', value: '12/20', color: '#7c3aed' },
  ]
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>My Research Profile</h2>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>👨‍🎓</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 14 }}>
              {[
                ['Scholar ID', 'RSC2022001'],
                ['Name', 'Hari Prasanth S'],
                ['Department', 'Computer Science & Engineering'],
                ['Programme', 'Ph.D'],
                ['Area of Research', 'Machine Learning & NLP'],
                ['Date of Registration', 'January 2022'],
                ['Guide', 'Dr. A. Rajesh (IIT Alumni)'],
                ['Co-Guide', 'Dr. S. Meena'],
                ['Status', 'Active'],
              ].map(([k, v]) => (
                <div key={k}>
                  <span style={{ color: MUTED, fontWeight: 600, fontSize: 13 }}>{k}: </span>
                  <span style={{ color: k === 'Status' ? '#16a34a' : TEXT, fontWeight: k === 'Status' ? 700 : 400 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Course Work Registration ─────────────────────────────────────────────────
const availableCourses = [
  { code: 'RES7001', name: 'Research Methodology', credits: 3, instructor: 'Dr. K. Ramesh', schedule: 'Mon/Wed 10-11AM' },
  { code: 'RES7002', name: 'Advanced Machine Learning', credits: 4, instructor: 'Dr. A. Rajesh', schedule: 'Tue/Thu 2-4PM' },
  { code: 'RES7003', name: 'Statistical Methods', credits: 3, instructor: 'Dr. M. Priya', schedule: 'Fri 9AM-12PM' },
]

const registeredCourses = [
  { code: 'RES6001', name: 'Technical Writing & Ethics', credits: 2, instructor: 'Dr. L. Venkatesan', grade: 'A' },
  { code: 'RES6002', name: 'Literature Survey Methods', credits: 3, instructor: 'Dr. S. Meena', grade: 'B+' },
]

function CourseWorkRegistration() {
  const [selected, setSelected] = useState({})
  const [registered, setRegistered] = useState(false)

  const toggleCourse = (code) => setSelected(prev => ({ ...prev, [code]: !prev[code] }))

  const handleRegister = () => {
    setRegistered(true)
    setTimeout(() => setRegistered(false), 3000)
    setSelected({})
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Course Work Registration</h2>
      {registered && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          Courses registered successfully!
        </div>
      )}
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Available Courses</h3>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 500 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['', 'Course Code', 'Course Name', 'Credits', 'Instructor', 'Schedule'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {availableCourses.map((c, i) => (
              <tr key={c.code} style={{ borderBottom: '1px solid #f1f5f9', background: selected[c.code] ? '#eef2ff' : (i % 2 === 0 ? '#fff' : '#fafafa') }}>
                <td style={{ padding: '12px 14px' }}>
                  <input type="checkbox" checked={!!selected[c.code]} onChange={() => toggleCourse(c.code)} style={{ accentColor: ACCENT, width: 16, height: 16 }} />
                </td>
                <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{c.code}</td>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{c.credits}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{c.instructor}</td>
                <td style={{ padding: '12px 14px', color: MUTED, fontSize: 13 }}>{c.schedule}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <button
          onClick={handleRegister}
          disabled={!Object.values(selected).some(Boolean)}
          style={{ marginTop: 16, background: Object.values(selected).some(Boolean) ? ACCENT : '#e2e8f0', color: Object.values(selected).some(Boolean) ? '#fff' : MUTED, border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: Object.values(selected).some(Boolean) ? 'pointer' : 'not-allowed' }}
        >
          Register Selected Courses
        </button>
      </div>
      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Already Registered Courses</h3>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 500 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Course Code', 'Course Name', 'Credits', 'Instructor', 'Grade'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registeredCourses.map((c, i) => (
              <tr key={c.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{c.code}</td>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{c.credits}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{c.instructor}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 700 }}>{c.grade}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}

// ─── Registration Status ──────────────────────────────────────────────────────
const milestones = [
  { label: 'Pre-PhD Registration', date: 'Jan 2022', status: 'completed' },
  { label: 'Course Work Completion', date: 'Est. Dec 2022', status: 'in-progress' },
  { label: 'Synopsis Presentation', date: 'Est. Jun 2023', status: 'pending' },
  { label: 'Thesis Submission', date: 'Est. Jan 2024', status: 'pending' },
  { label: 'Viva Voce', date: 'Est. Mar 2024', status: 'pending' },
]

function RegistrationStatus() {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Registration Status</h2>
      <div style={{ ...card, padding: '28px 40px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          {milestones.map((m, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {i < milestones.length - 1 && (
                <div style={{ position: 'absolute', top: 16, left: '50%', width: '100%', height: 3, background: m.status === 'completed' ? ACCENT : '#e2e8f0', zIndex: 0 }} />
              )}
              <div style={{
                width: 34, height: 34, borderRadius: '50%', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700,
                background: m.status === 'completed' ? ACCENT : m.status === 'in-progress' ? '#fef3c7' : '#f1f5f9',
                border: m.status === 'in-progress' ? '2px solid #d97706' : m.status === 'completed' ? 'none' : '2px solid #e2e8f0',
                color: m.status === 'completed' ? '#fff' : m.status === 'in-progress' ? '#d97706' : MUTED,
              }}>
                {m.status === 'completed' ? '✓' : m.status === 'in-progress' ? '⋯' : i + 1}
              </div>
              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: m.status === 'in-progress' ? '#d97706' : TEXT, lineHeight: 1.3 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>{m.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 20px', fontSize: 14, color: '#92400e', fontWeight: 500 }}>
        Current Status: Course Work in Progress — 12 of 20 credits completed.
      </div>
    </div>
  )
}

// ─── Meeting Info ─────────────────────────────────────────────────────────────
const upcomingMeetings = [
  { type: 'DC Meeting', date: '2024-06-15', time: '10:00 AM', venue: 'Seminar Hall A', agenda: 'Review of research progress and course work status', online: false },
  { type: 'Guide Meeting', date: '2024-06-08', time: '3:00 PM', venue: 'Prof. Rajesh\'s Office', agenda: 'Discussion on NLP model results', online: false },
  { type: 'Progress Review', date: '2024-06-20', time: '2:00 PM', venue: 'Google Meet (virtual)', agenda: 'Monthly progress presentation', online: true },
]

const pastMeetings = [
  { type: 'DC Meeting', date: '2024-03-10', duration: '2h', minutes: 'Available' },
  { type: 'Guide Meeting', date: '2024-04-15', duration: '1h', minutes: 'Available' },
  { type: 'Guide Meeting', date: '2024-05-01', duration: '45m', minutes: 'Pending' },
]

function MeetingInfo() {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Meeting Info</h2>
      <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: TEXT }}>Upcoming Meetings</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
        {upcomingMeetings.map((m, i) => (
          <div key={i} style={{ ...card, padding: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {m.type === 'DC Meeting' ? '👥' : m.type === 'Guide Meeting' ? '👨‍🏫' : '📊'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: TEXT, fontSize: 15 }}>{m.type}</div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 3 }}>{m.date} at {m.time} · {m.venue}</div>
              <div style={{ fontSize: 13, color: TEXT, marginTop: 4 }}>Agenda: {m.agenda}</div>
            </div>
            {m.online && (
              <button style={{ background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Join Online
              </button>
            )}
          </div>
        ))}
      </div>
      <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: TEXT }}>Past Meetings Log</h3>
      <div style={{ ...card, padding: 20 }}>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 400 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Type', 'Date', 'Duration', 'Minutes'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pastMeetings.map((m, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{m.type}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{m.date}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{m.duration}</td>
                <td style={{ padding: '12px 14px' }}>
                  {m.minutes === 'Available' ? (
                    <button style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Download</button>
                  ) : (
                    <span style={{ color: '#d97706', fontSize: 13 }}>Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}

// ─── Attendance View ──────────────────────────────────────────────────────────
const monthDays = Array.from({ length: 30 }, (_, i) => {
  const d = i + 1
  const rand = Math.random()
  return { day: d, status: d > 25 ? 'future' : rand > 0.15 ? 'present' : 'absent' }
})

const courseAttendance = [
  { code: 'RES7001', name: 'Research Methodology', total: 20, attended: 18 },
  { code: 'RES7002', name: 'Advanced ML', total: 22, attended: 20 },
  { code: 'RES7003', name: 'Statistical Methods', total: 18, attended: 15 },
]

function AttendanceView() {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Attendance View</h2>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>May 2024 — Monthly Calendar</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: MUTED, padding: '4px 0' }}>{d}</div>
          ))}
          {Array.from({ length: 3 }).map((_, i) => <div key={`pad-${i}`} />)}
          {monthDays.map(({ day, status }) => (
            <div key={day} style={{
              textAlign: 'center', padding: '7px 4px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: status === 'present' ? '#dcfce7' : status === 'absent' ? '#fee2e2' : '#f8fafc',
              color: status === 'present' ? '#16a34a' : status === 'absent' ? '#ef4444' : MUTED,
              border: `1px solid ${status === 'present' ? '#86efac' : status === 'absent' ? '#fca5a5' : '#e2e8f0'}`,
            }}>
              {day}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 16, fontSize: 13 }}>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: '#dcfce7', border: '1px solid #86efac', marginRight: 5 }} />Present</span>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: '#fee2e2', border: '1px solid #fca5a5', marginRight: 5 }} />Absent</span>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: '#f8fafc', border: '1px solid #e2e8f0', marginRight: 5 }} />Future</span>
        </div>
      </div>
      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Course-wise Attendance</h3>
        {courseAttendance.map((c, i) => {
          const pct = Math.round((c.attended / c.total) * 100)
          return (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: TEXT }}>{c.name} <span style={{ color: MUTED, fontWeight: 400 }}>({c.code})</span></span>
                <span style={{ fontWeight: 700, color: pct >= 75 ? '#16a34a' : '#ef4444' }}>{pct}% ({c.attended}/{c.total})</span>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: pct >= 75 ? '#4ade80' : '#f87171', borderRadius: 99, transition: 'width 0.5s' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Research Letters ─────────────────────────────────────────────────────────
const letters = [
  { type: 'Registration Certificate', date: '2022-02-01', purpose: 'Proof of PhD enrollment', validity: 'Permanent' },
  { type: 'NOC for Conference', date: '2023-08-15', purpose: 'ICML 2023, Hawaii', validity: 'Single use' },
  { type: 'Guide Certificate', date: '2024-01-10', purpose: 'Fellowship application', validity: '6 months' },
  { type: 'Progress Report', date: '2024-03-01', purpose: 'Annual DC meeting', validity: 'N/A' },
]

function ResearchLetters() {
  const [reqType, setReqType] = useState('Registration Certificate')
  const [reqPurpose, setReqPurpose] = useState('')
  const [requested, setRequested] = useState(false)

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Research Letters</h2>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Issued Letters</h3>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 500 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Letter Type', 'Date', 'Purpose', 'Validity', 'Download'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {letters.map((l, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{l.type}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{l.date}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{l.purpose}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{l.validity}</td>
                <td style={{ padding: '12px 14px' }}>
                  <button style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>Request New Letter</h3>
        {requested && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 14, color: '#166534', fontWeight: 500, fontSize: 14 }}>Request submitted!</div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Letter Type</label>
            <select value={reqType} onChange={e => setReqType(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}>
              {['Registration Certificate', 'NOC for Conference', 'Guide Certificate', 'Progress Report'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Purpose</label>
            <input type="text" value={reqPurpose} onChange={e => setReqPurpose(e.target.value)} placeholder="State the purpose" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }} />
          </div>
        </div>
        <button onClick={() => { setRequested(true); setTimeout(() => setRequested(false), 3000) }} style={{ marginTop: 16, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Submit Request</button>
      </div>
    </div>
  )
}

// ─── Electronic Thesis Submission ─────────────────────────────────────────────
const thesisSteps = ['Upload Draft', 'Plagiarism Check', 'Guide Approval', 'Department Approval', 'Final Submission']

function ElectronicThesisSubmission() {
  const [currentStep, setCurrentStep] = useState(0)
  const [file, setFile] = useState(null)
  const [plagScore, setPlagScore] = useState(null)

  const handleUpload = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0])
      setTimeout(() => setPlagScore(7.4), 1000)
    }
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Electronic Thesis Submission</h2>
      {/* Stepper */}
      <div style={{ ...card, padding: '24px 32px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {thesisSteps.map((step, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {i < thesisSteps.length - 1 && (
                <div style={{ position: 'absolute', top: 16, left: '50%', width: '100%', height: 3, background: i < currentStep ? ACCENT : '#e2e8f0', zIndex: 0 }} />
              )}
              <div style={{
                width: 34, height: 34, borderRadius: '50%', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700,
                background: i < currentStep ? ACCENT : i === currentStep ? '#eef2ff' : '#f1f5f9',
                border: i === currentStep ? `2px solid ${ACCENT}` : 'none',
                color: i < currentStep ? '#fff' : i === currentStep ? ACCENT : MUTED,
              }}>
                {i < currentStep ? '✓' : i + 1}
              </div>
              <div style={{ marginTop: 10, fontSize: 11, fontWeight: i === currentStep ? 700 : 400, color: i === currentStep ? ACCENT : i < currentStep ? TEXT : MUTED, textAlign: 'center', lineHeight: 1.3 }}>
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>

      {currentStep === 0 && (
        <div style={{ ...card, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>Step 1: Upload Thesis Draft</h3>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} style={{ marginBottom: 16, fontSize: 14, color: TEXT }} />
          {file && (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: '#166534', fontWeight: 600 }}>File uploaded: {file.name}</div>
              {plagScore !== null && (
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 13, color: MUTED }}>Plagiarism Score: </span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: plagScore <= 10 ? '#16a34a' : '#ef4444' }}>{plagScore}%</span>
                  <span style={{ fontSize: 12, color: plagScore <= 10 ? '#16a34a' : '#ef4444', marginLeft: 8 }}>{plagScore <= 10 ? '(Within limit)' : '(Exceeds 10% limit)'}</span>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setCurrentStep(1)}
            disabled={!plagScore}
            style={{ background: plagScore ? ACCENT : '#e2e8f0', color: plagScore ? '#fff' : MUTED, border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: plagScore ? 'pointer' : 'not-allowed' }}
          >
            Proceed to Next Step
          </button>
        </div>
      )}
      {currentStep > 0 && (
        <div style={{ ...card, padding: 24 }}>
          <div style={{ fontSize: 14, color: TEXT }}>
            <strong>Step {currentStep + 1}: {thesisSteps[currentStep]}</strong> — Awaiting action from respective authority.
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: MUTED }}>You will be notified by email once this step is completed.</div>
        </div>
      )}
    </div>
  )
}

// ─── Research Document Upload ─────────────────────────────────────────────────
const uploadedDocs = [
  { type: 'Research Proposal', description: 'Initial research proposal', date: '2022-03-01', file: 'proposal_v1.pdf' },
  { type: 'Progress Report', description: 'Q2 2023 progress report', date: '2023-07-15', file: 'progress_q2_2023.pdf' },
  { type: 'Conference Certificate', description: 'ICML 2023 participation', date: '2023-08-20', file: 'icml_cert.pdf' },
]

function ResearchDocumentUpload() {
  const [docForm, setDocForm] = useState({ type: 'Research Proposal', description: '', date: '', file: null })
  const [uploaded, setUploaded] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setUploaded(true)
    setDocForm({ type: 'Research Proposal', description: '', date: '', file: null })
    setTimeout(() => setUploaded(false), 3000)
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Research Document Upload</h2>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>Upload New Document</h3>
        {uploaded && <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 14, color: '#166534', fontWeight: 500, fontSize: 14 }}>Document uploaded successfully!</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Document Type</label>
              <select value={docForm.type} onChange={e => setDocForm(p => ({ ...p, type: e.target.value }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}>
                {['Research Proposal', 'Progress Report', 'Publication', 'Conference Certificate', 'Fellowship Letter', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Document Date</label>
              <input type="date" value={docForm.date} onChange={e => setDocForm(p => ({ ...p, date: e.target.value }))} required style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Description</label>
              <input type="text" value={docForm.description} onChange={e => setDocForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of the document" required style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>File Upload</label>
              <input type="file" required onChange={e => setDocForm(p => ({ ...p, file: e.target.files[0] }))} style={{ fontSize: 14, color: TEXT }} />
            </div>
          </div>
          <button type="submit" style={{ marginTop: 18, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Upload Document</button>
        </form>
      </div>
      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Uploaded Documents</h3>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 400 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Type', 'Description', 'Date', 'File'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {uploadedDocs.map((d, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{d.type}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{d.description}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{d.date}</td>
                <td style={{ padding: '12px 14px' }}>
                  <button style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{d.file}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}

// ─── Guide Scholar Meeting ────────────────────────────────────────────────────
const meetingHistory = [
  { date: '2024-05-10', type: 'Progress Review', mode: 'Offline', minutes: 'Discussed NLP pipeline improvements. Action: Submit updated dataset by May 20.' },
  { date: '2024-04-05', type: 'Literature Review', mode: 'Online', minutes: 'Reviewed 5 new papers on transformer models. Action: Prepare summary report.' },
]

function GuideScholarMeeting() {
  const [form, setForm] = useState({ meetingType: 'Progress Review', date: '', time: '', duration: '60', agenda: '', mode: 'Offline' })
  const [scheduled, setScheduled] = useState(false)

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleSubmit = (e) => { e.preventDefault(); setScheduled(true); setTimeout(() => setScheduled(false), 3000) }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Guide Scholar Meeting</h2>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>Schedule a Meeting</h3>
        {scheduled && <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 14, color: '#166534', fontWeight: 500, fontSize: 14 }}>Meeting request submitted!</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Meeting Type</label>
              <select name="meetingType" value={form.meetingType} onChange={handleChange} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}>
                {['Progress Review', 'Literature Review', 'Experiment Discussion', 'Thesis Review', 'DC Meeting Prep'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Preferred Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Preferred Time</label>
              <input type="time" name="time" value={form.time} onChange={handleChange} required style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Duration (minutes)</label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange} min={15} max={180} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 8 }}>Mode</label>
              <div style={{ display: 'flex', gap: 20 }}>
                {['Online', 'Offline'].map(m => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: TEXT, cursor: 'pointer' }}>
                    <input type="radio" name="mode" value={m} checked={form.mode === m} onChange={handleChange} style={{ accentColor: ACCENT }} />
                    {m}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Agenda / Discussion Points</label>
              <textarea name="agenda" value={form.agenda} onChange={handleChange} rows={3} required placeholder="List the topics you want to discuss..." style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
          </div>
          <button type="submit" style={{ marginTop: 18, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Schedule Meeting</button>
        </form>
      </div>
      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Meeting History</h3>
        {meetingHistory.map((m, i) => (
          <div key={i} style={{ borderBottom: i < meetingHistory.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: TEXT, fontSize: 14 }}>{m.type}</span>
              <span style={{ background: '#f1f5f9', color: MUTED, borderRadius: 5, padding: '1px 8px', fontSize: 12 }}>{m.mode}</span>
              <span style={{ color: MUTED, fontSize: 13 }}>{m.date}</span>
            </div>
            <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{m.minutes}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Weekly Scholar Workload ──────────────────────────────────────────────────
const weeklyLogs = [
  { week: 'May 13–19, 2024', activities: ['Literature Review', 'Analysis'], hours: 32, summary: 'Completed review of 8 papers, started data analysis pipeline.' },
  { week: 'May 6–12, 2024', activities: ['Experiment', 'Data Collection'], hours: 38, summary: 'Ran baseline experiments, collected dataset samples.' },
  { week: 'Apr 29–May 5, 2024', activities: ['Writing', 'Literature Review'], hours: 28, summary: 'Drafted methodology section, reviewed 5 more papers.' },
]

const allActivities = ['Literature Review', 'Experiment', 'Data Collection', 'Analysis', 'Writing', 'Others']

function WeeklyScholarWorkload() {
  const [form, setForm] = useState({ activities: [], hours: '', summary: '' })
  const [submitted, setSubmitted] = useState(false)
  const currentWeek = 'May 20–26, 2024'

  const toggleActivity = (act) => {
    setForm(p => ({
      ...p,
      activities: p.activities.includes(act) ? p.activities.filter(a => a !== act) : [...p.activities, act],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setForm({ activities: [], hours: '', summary: '' })
    setTimeout(() => setSubmitted(false), 3000)
  }

  const maxHours = Math.max(...weeklyLogs.map(l => l.hours), 1)

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Weekly Scholar Workload</h2>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>Log for Week: <span style={{ color: ACCENT }}>{currentWeek}</span></h3>
        {submitted && <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 14, color: '#166534', fontWeight: 500, fontSize: 14 }}>Weekly log submitted!</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 10 }}>Research Activities (select all that apply)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {allActivities.map(act => (
                <label key={act} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: TEXT, cursor: 'pointer', background: form.activities.includes(act) ? '#eef2ff' : '#f8fafc', padding: '6px 14px', borderRadius: 8, border: `1px solid ${form.activities.includes(act) ? '#c7d2fe' : '#e2e8f0'}` }}>
                  <input type="checkbox" checked={form.activities.includes(act)} onChange={() => toggleActivity(act)} style={{ accentColor: ACCENT }} />
                  {act}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Hours Spent</label>
              <input type="number" value={form.hours} onChange={e => setForm(p => ({ ...p, hours: e.target.value }))} required min={1} max={80} placeholder="e.g. 35" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Weekly Summary</label>
              <textarea value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} required rows={2} placeholder="Brief summary of work done this week..." style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
          </div>
          <button type="submit" style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Submit Weekly Log</button>
        </form>
      </div>
      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>Workload Chart (Previous Weeks)</h3>
        {weeklyLogs.map((log, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span style={{ fontWeight: 600, color: TEXT }}>{log.week}</span>
              <span style={{ color: MUTED }}>{log.hours} hrs · {log.activities.join(', ')}</span>
            </div>
            <div style={{ height: 10, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: `${(log.hours / maxHours) * 100}%`, height: '100%', background: ACCENT, borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 5 }}>{log.summary}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
const contentMap = {
  'Research Regulations': ResearchRegulations,
  'My Research Profile': MyResearchProfile,
  'Course Work Registration': CourseWorkRegistration,
  'Registration Status': RegistrationStatus,
  'Meeting Info': MeetingInfo,
  'Attendance View': AttendanceView,
  'Research Letters': ResearchLetters,
  'Electronic Thesis Submission': ElectronicThesisSubmission,
  'Research Document Upload': ResearchDocumentUpload,
  'Guide Scholar Meeting': GuideScholarMeeting,
  'Weekly Scholar Workload': WeeklyScholarWorkload,
}

export default function ResearchGeneral() {
  const [activeNav, setActiveNav] = useState('Research Regulations')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const ActiveComponent = contentMap[activeNav] || (() => <div style={{ color: MUTED }}>Coming soon.</div>)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Research — General</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Research profile, registrations, meetings and thesis management</p>
      </div>

      {/* Card: left nav + content */}
      <div style={{ ...card, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden' }}>
        {/* Left Nav */}
        <div style={{
          width: isMobile ? '100%' : 210,
          borderRight: isMobile ? 'none' : '1px solid #f1f5f9',
          borderBottom: isMobile ? '1px solid #e2e8f0' : 'none',
          padding: isMobile ? '8px 4px' : '16px 0',
          flexShrink: 0,
          display: isMobile ? 'flex' : 'block',
          flexDirection: isMobile ? 'row' : undefined,
          flexWrap: isMobile ? 'wrap' : undefined,
          overflowX: isMobile ? 'auto' : undefined,
        }}>
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              style={{
                display: isMobile ? 'inline-block' : 'block',
                width: isMobile ? 'auto' : '100%',
                padding: isMobile ? '6px 12px' : '10px 20px',
                background: activeNav === item ? '#eef2ff' : 'transparent',
                border: 'none',
                borderLeft: isMobile ? 'none' : (activeNav === item ? '3px solid #6366f1' : '3px solid transparent'),
                borderBottom: isMobile ? (activeNav === item ? '2px solid #6366f1' : '2px solid transparent') : 'none',
                borderRadius: isMobile ? 100 : 0,
                textAlign: 'left',
                fontSize: isMobile ? 12 : 13,
                fontWeight: activeNav === item ? 600 : 400,
                color: activeNav === item ? ACCENT : TEXT,
                cursor: 'pointer',
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: isMobile ? '16px' : 28, minWidth: 0, overflowY: 'auto' }}>
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}
