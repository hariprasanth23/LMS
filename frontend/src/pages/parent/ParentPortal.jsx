import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'
const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['Overview', 'Attendance', 'Academic Performance', 'Fee Status', 'Notices', 'Contact Faculty']

// Static demo data for linked student (in a real app this comes from a parent-student link table)
const STUDENT_INFO = {
  name: 'Arjun Kumar',
  rollNo: 'CSE2022001',
  dept: 'Computer Science & Engineering',
  semester: '6th Semester (B.E.)',
  section: 'B',
  batch: '2022–2026',
  cgpa: '8.74',
  attendance: '85%',
  advisor: 'Dr. Meena Kumari',
}

const ATTENDANCE_DATA = [
  { subject: 'Data Warehousing & Mining', code: 'CS6001', attended: 17, total: 20, pct: 85 },
  { subject: 'Compiler Design',           code: 'CS6002', attended: 18, total: 20, pct: 90 },
  { subject: 'Cloud Computing',           code: 'CS6003', attended: 14, total: 20, pct: 70 },
  { subject: 'Cryptography & Security',   code: 'CS6004', attended: 19, total: 20, pct: 95 },
  { subject: 'Big Data Analytics',        code: 'CS6005', attended: 16, total: 20, pct: 80 },
  { subject: 'DevOps',                    code: 'CS6006', attended: 15, total: 20, pct: 75 },
]

const MARKS_DATA = [
  { subject: 'Data Warehousing & Mining', ca1: 18, ca2: 17, ca3: 19, model: 43, total: 102 },
  { subject: 'Compiler Design',           ca1: 15, ca2: 16, ca3: 14, model: 38, total: 88 },
  { subject: 'Cloud Computing',           ca1: 19, ca2: 18, ca3: 20, model: 46, total: 108 },
  { subject: 'Cryptography & Security',   ca1: 16, ca2: 15, ca3: 17, model: 40, total: 93 },
  { subject: 'Big Data Analytics',        ca1: 20, ca2: 19, ca3: 18, model: 45, total: 107 },
  { subject: 'DevOps',                    ca1: 14, ca2: 16, ca3: 15, model: 35, total: 85 },
]

const FEES = [
  { type: 'Tuition Fee', amount: 45000, due: 'Jul 1, 2025', status: 'PENDING' },
  { type: 'Hostel Fee',  amount: 15000, due: 'Jul 1, 2025', status: 'PAID'    },
  { type: 'Exam Fee',    amount: 500,   due: 'Jun 15, 2025', status: 'PAID'   },
  { type: 'Lab Fee',     amount: 2000,  due: 'Jul 1, 2025',  status: 'PENDING'},
]

const NOTICES = [
  { title: 'End Semester Exam Schedule Released', date: 'Jun 5, 2025', category: 'Exams', important: true },
  { title: 'Fee Payment Deadline — Jul 1, 2025', date: 'Jun 1, 2025', category: 'Finance', important: true },
  { title: 'Semester 7 Registration Opens', date: 'May 28, 2025', category: 'Academics', important: false },
  { title: 'Annual Day Celebration — Jul 20', date: 'May 20, 2025', category: 'Event', important: false },
]

export default function ParentPortal() {
  const { user } = useAuth()
  const [active, setActive] = useState('Overview')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [parentProfile, setParentProfile] = useState(null)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  useEffect(() => {
    api.get('/auth/me').then(r => setParentProfile(r.data.data)).catch(() => {})
  }, [])

  const navStyle = (item) => ({
    display: isMobile ? 'inline-block' : 'block',
    width: isMobile ? 'auto' : '100%',
    padding: isMobile ? '6px 12px' : '10px 18px',
    background: active === item ? '#eef2ff' : 'transparent',
    border: 'none',
    borderLeft: isMobile ? 'none' : (active === item ? `3px solid ${ACCENT}` : '3px solid transparent'),
    borderBottom: isMobile ? (active === item ? '2px solid #6366f1' : '2px solid transparent') : 'none',
    borderRadius: isMobile ? 100 : 0,
    textAlign: 'left',
    fontSize: isMobile ? 12 : 14,
    fontWeight: active === item ? 600 : 400,
    color: active === item ? ACCENT : TEXT,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  })

  function Overview() {
    const overallAtt = Math.round(ATTENDANCE_DATA.reduce((s, a) => s + a.pct, 0) / ATTENDANCE_DATA.length)
    const pending = FEES.filter(f => f.status === 'PENDING').reduce((s, f) => s + f.amount, 0)
    return (
      <div>
        {/* Student card */}
        <div style={{ ...card, padding: 24, marginBottom: 20, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', borderLeft: '4px solid #6366f1' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#eef2ff', color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, flexShrink: 0 }}>
            {STUDENT_INFO.name.split(' ').map(w => w[0]).join('')}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: TEXT }}>{STUDENT_INFO.name}</div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{STUDENT_INFO.rollNo} · {STUDENT_INFO.dept}</div>
            <div style={{ fontSize: 13, color: MUTED }}>{STUDENT_INFO.semester} · Section {STUDENT_INFO.section} · Batch {STUDENT_INFO.batch}</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'CGPA',              value: STUDENT_INFO.cgpa,  color: '#16a34a', bg: '#f0fdf4', icon: '📊' },
            { label: 'Overall Attendance',value: `${overallAtt}%`,   color: overallAtt >= 75 ? '#6366f1' : '#ef4444', bg: '#eef2ff', icon: '📅' },
            { label: 'Fees Pending',      value: `₹${pending.toLocaleString('en-IN')}`, color: '#dc2626', bg: '#fef2f2', icon: '💳' },
            { label: 'Academic Advisor',  value: STUDENT_INFO.advisor.replace('Dr. ', ''), color: '#f59e0b', bg: '#fffbeb', icon: '👩‍🏫' },
          ].map(s => (
            <div key={s.label} style={{ ...card, padding: 18, borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick notices */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: TEXT, marginBottom: 14 }}>Important Notices</div>
          {NOTICES.filter(n => n.important).map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: i === 0 ? '1px solid #f1f5f9' : 'none' }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>🔔</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{n.title}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{n.date} · {n.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function AttendanceSection() {
    return (
      <div>
        <div style={{ ...card, padding: 20, marginBottom: 20, background: '#eef2ff', borderLeft: '4px solid #6366f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: ACCENT, fontWeight: 600 }}>Minimum required attendance: 75%</span>
        </div>
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: BG }}>
                  {['Subject', 'Code', 'Classes Attended', 'Total Classes', 'Attendance %', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ATTENDANCE_DATA.map((a, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc', background: a.pct < 75 ? '#fff7ed' : 'transparent' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: TEXT }}>{a.subject}</td>
                    <td style={{ padding: '12px 14px', color: ACCENT, fontFamily: 'monospace' }}>{a.code}</td>
                    <td style={{ padding: '12px 14px', color: TEXT, textAlign: 'center' }}>{a.attended}</td>
                    <td style={{ padding: '12px 14px', color: MUTED, textAlign: 'center' }}>{a.total}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${a.pct}%`, height: '100%', background: a.pct >= 75 ? '#4ade80' : '#f87171', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontWeight: 700, color: a.pct >= 75 ? '#16a34a' : '#dc2626', fontSize: 13, minWidth: 36 }}>{a.pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: a.pct >= 75 ? '#dcfce7' : '#fee2e2', color: a.pct >= 75 ? '#16a34a' : '#dc2626' }}>
                        {a.pct >= 75 ? 'OK' : 'Low'}
                      </span>
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

  function AcademicPerformance() {
    return (
      <div>
        <div style={{ ...card, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '14px 18px', background: '#eef2ff', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: ACCENT }}>
            Internal Assessment Marks — Semester 6
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: BG }}>
                  {['Subject', 'CA1 (/20)', 'CA2 (/20)', 'CA3 (/20)', 'Model (/50)', 'Total'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MARKS_DATA.map((m, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: TEXT }}>{m.subject}</td>
                    {[m.ca1, m.ca2, m.ca3, m.model].map((v, j) => (
                      <td key={j} style={{ padding: '12px 14px', textAlign: 'center', color: TEXT }}>{v}</td>
                    ))}
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: m.total >= 100 ? '#16a34a' : TEXT }}>{m.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ ...card, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: TEXT, marginBottom: 14 }}>Cumulative Performance</div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['CGPA', '8.74', ACCENT], ['Current SGPA', '9.01', '#16a34a'], ['Credits Completed', '118/160', '#f59e0b']].map(([label, val, color]) => (
              <div key={label} style={{ background: BG, borderRadius: 10, padding: '16px 20px', textAlign: 'center', flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color }}>{val}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function FeeStatus() {
    const pending = FEES.filter(f => f.status === 'PENDING').reduce((s, f) => s + f.amount, 0)
    return (
      <div>
        {pending > 0 && (
          <div style={{ ...card, padding: 16, marginBottom: 20, background: '#fef2f2', borderLeft: '4px solid #ef4444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#dc2626' }}>Total Outstanding: ₹{pending.toLocaleString('en-IN')}</span>
            <button style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Pay Now</button>
          </div>
        )}
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: BG }}>
                  {['Fee Type', 'Amount', 'Due Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEES.map((f, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc', background: f.status === 'PENDING' ? '#fff7ed' : 'transparent' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: TEXT }}>{f.type}</td>
                    <td style={{ padding: '12px 14px', color: TEXT }}>₹{f.amount.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 14px', color: MUTED }}>{f.due}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: f.status === 'PAID' ? '#dcfce7' : '#fee2e2', color: f.status === 'PAID' ? '#16a34a' : '#dc2626' }}>
                        {f.status}
                      </span>
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

  function Notices() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {NOTICES.map((n, i) => (
          <div key={i} style={{ ...card, padding: 18, borderLeft: n.important ? '4px solid #ef4444' : '4px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 4 }}>{n.title}</div>
              <div style={{ fontSize: 12, color: MUTED }}>{n.date}</div>
            </div>
            <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#eef2ff', color: ACCENT, flexShrink: 0 }}>{n.category}</span>
          </div>
        ))}
      </div>
    )
  }

  function ContactFaculty() {
    const [form, setForm] = useState({ subject: '', message: '' })
    const [sent, setSent] = useState(false)
    return (
      <div>
        <div style={{ ...card, padding: 24, marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Contact Academic Advisor</h3>
          <div style={{ background: BG, borderRadius: 10, padding: '16px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#eef2ff', color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>DM</div>
            <div>
              <div style={{ fontWeight: 700, color: TEXT }}>{STUDENT_INFO.advisor}</div>
              <div style={{ fontSize: 13, color: MUTED }}>Academic Advisor · CSE Department</div>
            </div>
          </div>
          {sent ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: 16, color: '#166534', fontWeight: 600 }}>✓ Message sent successfully!</div>
          ) : (
            <>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: TEXT, display: 'block', marginBottom: 6 }}>Subject</label>
                <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="e.g. Attendance concern / Academic query"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: TEXT, display: 'block', marginBottom: 6 }}>Message</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4}
                  placeholder="Write your message here..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <button onClick={() => setSent(true)} disabled={!form.subject || !form.message}
                style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Send Message
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  const sectionMap = { Overview, Attendance: AttendanceSection, 'Academic Performance': AcademicPerformance, 'Fee Status': FeeStatus, Notices, 'Contact Faculty': ContactFaculty }
  const ActiveSection = sectionMap[active]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: TEXT }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: TEXT }}>Parent Portal</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: MUTED }}>Monitor your ward's academic progress and campus life</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 500 }}>
        <div style={{
          width: isMobile ? '100%' : 210, borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
          borderBottom: isMobile ? '1px solid #e2e8f0' : 'none', padding: isMobile ? '8px 4px' : '12px 0',
          flexShrink: 0, display: isMobile ? 'flex' : 'block', flexWrap: isMobile ? 'wrap' : undefined, overflowX: isMobile ? 'auto' : undefined,
        }}>
          {navItems.map(item => (
            <button key={item} onClick={() => setActive(item)} style={navStyle(item)}>{item}</button>
          ))}
        </div>
        <div style={{ flex: 1, padding: isMobile ? 16 : 28, background: BG, overflowX: 'auto' }}>
          <ActiveSection />
        </div>
      </div>
    </div>
  )
}
