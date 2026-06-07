import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import {
  MdPeople, MdSchool, MdBook, MdBeachAccess, MdPayment, MdTrendingUp,
  MdPersonAdd, MdBadge, MdFactCheck, MdAccountBalance, MdListAlt, MdBarChart,
  MdUpload, MdFeedback, MdCalendarToday, MdViewList, MdNotifications,
  MdFileDownload, MdCheckCircle, MdWarning, MdInfo, MdSchedule,
  MdContactPhone, MdVerifiedUser, MdGroups, MdEmojiEvents, MdEventNote,
  MdCreditCard, MdMenuBook
} from 'react-icons/md'

// ─── Design tokens ───────────────────────────────────────────────────────────
const ACCENT = '#6366f1'
const TEXT = '#1e293b'
const MUTED = '#64748b'
const BG = '#f8fafc'
const CARD = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getTimeOfDay = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening'
}

const timeAgo = (mins) => {
  if (mins < 60) return `${mins}m ago`
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`
  return `${Math.floor(mins / 1440)}d ago`
}

const roleLabelMap = {
  ADMIN: 'Admin',
  FACULTY: 'Faculty',
  STUDENT: 'Student',
  STAFF: 'Staff',
  PARENT: 'Parent',
  ALUMNI: 'Alumni'
}

// ─── Shared Components ────────────────────────────────────────────────────────

function PageHeader({ user, roleLabel }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: -0.5, fontFamily: 'system-ui, sans-serif' }}>
            Good {getTimeOfDay()}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 14, fontFamily: 'system-ui, sans-serif' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ background: '#eef2ff', color: ACCENT, borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
            {roleLabel} Portal
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, bg, trend, trendColor, isMobile }) {
  return (
    <div style={{
      ...CARD,
      padding: '22px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      flex: 1,
      minWidth: isMobile ? '45%' : 180,
      transition: 'box-shadow 0.2s'
    }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <span style={{ color, fontSize: 26 }}>{icon}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 28, fontWeight: 800, color: TEXT, lineHeight: 1 }}>
          {value ?? '-'}
        </div>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED, marginTop: 4 }}>{label}</div>
        {trend && (
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: trendColor || '#10b981', marginTop: 4, fontWeight: 600 }}>
            {trend}
          </div>
        )}
      </div>
    </div>
  )
}

function SectionCard({ title, subtitle, children, action }) {
  return (
    <div style={{ ...CARD, overflow: 'hidden' }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 15, fontWeight: 700, color: TEXT }}>{title}</div>
          {subtitle && <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: MUTED, marginTop: 2 }}>{subtitle}</div>}
        </div>
        {action && (
          <button style={{
            background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 8,
            padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {action}
          </button>
        )}
      </div>
      <div style={{ padding: '16px 20px' }}>{children}</div>
    </div>
  )
}

function QuickActionCard({ icon, label, color, bg, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 10,
        padding: '18px 16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        border: '1px solid #f1f5f9',
        transition: 'all 0.18s',
        boxShadow: hovered ? '0 4px 16px rgba(99,102,241,0.12)' : '0 1px 4px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        textAlign: 'center'
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color, fontSize: 22 }}>{icon}</span>
      </div>
      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, fontWeight: 600, color: TEXT, lineHeight: 1.3 }}>{label}</span>
    </div>
  )
}

function ProgressBar({ value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const barColor = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 99 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color || barColor, borderRadius: 99, transition: 'width 0.4s' }} />
      </div>
      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: MUTED, minWidth: 34, textAlign: 'right' }}>{pct}%</span>
    </div>
  )
}

// ─── CSS Bar Chart ────────────────────────────────────────────────────────────
function BarChart({ data, title, subtitle, valueLabel = '%', maxHeight = 180 }) {
  const maxVal = Math.max(...data.map(d => d.value))
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: maxHeight + 30, paddingLeft: 32, position: 'relative' }}>
          {/* Y-axis labels */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 30, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {[100, 75, 50, 25, 0].map(v => (
              <span key={v} style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, color: MUTED }}>{v}{valueLabel}</span>
            ))}
          </div>
          {data.map((d, i) => {
            const barH = Math.round((d.value / 100) * maxHeight)
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, justifyContent: 'flex-end', height: maxHeight + 30 }}>
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, fontWeight: 700, color: d.highlight ? ACCENT : MUTED }}>
                  {d.value}{valueLabel}
                </span>
                <div
                  title={`${d.label}: ${d.value}${valueLabel}`}
                  style={{
                    width: '70%',
                    height: barH,
                    background: d.highlight
                      ? `linear-gradient(180deg, ${ACCENT} 0%, #818cf8 100%)`
                      : 'rgba(99,102,241,0.25)',
                    borderRadius: '5px 5px 0 0',
                    transition: 'height 0.4s',
                    border: d.highlight ? `2px solid ${ACCENT}` : '2px solid transparent',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: d.highlight ? TEXT : MUTED, fontWeight: d.highlight ? 700 : 400, height: 30, display: 'flex', alignItems: 'center' }}>
                  {d.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Circular progress (CSS conic-gradient)
function CircularProgress({ pct, size = 100, color = ACCENT, label = 'Attendance' }) {
  const inner = size - 24
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `conic-gradient(${color} ${pct * 3.6}deg, #e2e8f0 0deg)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }}>
      <div style={{
        width: inner, height: inner, borderRadius: '50%',
        background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <span style={{ fontSize: size * 0.2, fontWeight: 800, color, fontFamily: 'system-ui, sans-serif', lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: size * 0.1, color: MUTED, fontFamily: 'system-ui, sans-serif', marginTop: 2 }}>{label}</span>
      </div>
    </div>
  )
}

// Status badge
function Badge({ status }) {
  const map = {
    PENDING: { bg: '#fffbeb', color: '#d97706' },
    APPROVED: { bg: '#f0fdf4', color: '#10b981' },
    REJECTED: { bg: '#fef2f2', color: '#ef4444' },
    PRESENT: { bg: '#f0fdf4', color: '#10b981' },
    ABSENT: { bg: '#fef2f2', color: '#ef4444' },
    PAID: { bg: '#f0fdf4', color: '#10b981' },
    UNPAID: { bg: '#fef2f2', color: '#ef4444' },
  }
  const style = map[status] || { bg: '#f1f5f9', color: MUTED }
  return (
    <span style={{
      padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: style.bg, color: style.color, fontFamily: 'system-ui, sans-serif'
    }}>
      {status}
    </span>
  )
}

// Days remaining badge
function DaysLeft({ days }) {
  const bg = days < 7 ? '#fef2f2' : days < 14 ? '#fffbeb' : '#f0fdf4'
  const color = days < 7 ? '#ef4444' : days < 14 ? '#d97706' : '#10b981'
  return (
    <span style={{ background: bg, color, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
      {days}d left
    </span>
  )
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
function AdminDashboard({ isMobile }) {
  const [stats, setStats] = useState({ students: 0, faculty: 0, courses: 0, pendingLeaves: 0 })
  const [leaves, setLeaves] = useState([])
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    Promise.allSettled([
      api.get('/students'),
      api.get('/employees'),
      api.get('/leaves'),
      api.get('/courses'),
      api.get('/announcements')
    ]).then(([studRes, empRes, leaveRes, courseRes, annRes]) => {
      const students = studRes.status === 'fulfilled' ? (studRes.value.data.data?.length || 0) : 0
      const employees = empRes.status === 'fulfilled' ? (empRes.value.data.data || []) : []
      const faculty = employees.filter(e => e.employeeType === 'FACULTY').length
      const allLeaves = leaveRes.status === 'fulfilled' ? (leaveRes.value.data.data || []) : []
      const courses = courseRes.status === 'fulfilled' ? (courseRes.value.data.data?.length || 0) : 0
      const pending = allLeaves.filter(l => l.status === 'PENDING').length
      setStats({ students, faculty, courses, pendingLeaves: pending })
      setLeaves(allLeaves.slice(0, 5))
      setAnnouncements(annRes.status === 'fulfilled' ? (annRes.value.data.data || []).slice(0, 4) : [])
    })
  }, [])

  const quickActions = [
    { icon: <MdPersonAdd />, label: 'Add Student', color: '#6366f1', bg: '#eef2ff' },
    { icon: <MdBadge />, label: 'Add Employee', color: '#10b981', bg: '#f0fdf4' },
    { icon: <MdFactCheck />, label: 'Mark Attendance', color: '#f59e0b', bg: '#fffbeb' },
    { icon: <MdAccountBalance />, label: 'Generate Payroll', color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: <MdListAlt />, label: 'View Leaves', color: '#ef4444', bg: '#fef2f2' },
    { icon: <MdBarChart />, label: 'View Reports', color: '#06b6d4', bg: '#ecfeff' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <StatCard icon={<MdPeople />} label="Total Students" value={stats.students} color="#6366f1" bg="#eef2ff" isMobile={isMobile} />
        <StatCard icon={<MdSchool />} label="Faculty Members" value={stats.faculty} color="#10b981" bg="#f0fdf4" isMobile={isMobile} />
        <StatCard icon={<MdBook />} label="Active Courses" value={stats.courses} color="#f59e0b" bg="#fffbeb" isMobile={isMobile} />
        <StatCard icon={<MdBeachAccess />} label="Pending Leaves" value={stats.pendingLeaves} color="#ef4444" bg="#fef2f2" trend="Needs review" trendColor="#ef4444" isMobile={isMobile} />
      </div>

      <SectionCard title="Quick Actions" subtitle="Frequently used admin operations">
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: 12 }}>
          {quickActions.map((a, i) => <QuickActionCard key={i} {...a} />)}
        </div>
      </SectionCard>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: 20 }}>
        <SectionCard title="Recent Leave Requests" action="Manage All">
          {leaves.length === 0
            ? <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED, margin: 0, textAlign: 'center', padding: '16px 0' }}>No leave requests found</p>
            : <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui, sans-serif', fontSize: 13, minWidth: 400 }}>
                  <thead><tr style={{ background: '#f8fafc' }}>
                    {['Type', 'From', 'To', 'Status'].map(h => <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: MUTED, fontWeight: 600 }}>{h}</th>)}
                  </tr></thead>
                  <tbody>{leaves.map(l => (
                    <tr key={l.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 12px', color: TEXT }}>{l.leaveType}</td>
                      <td style={{ padding: '10px 12px', color: MUTED }}>{l.fromDate}</td>
                      <td style={{ padding: '10px 12px', color: MUTED }}>{l.toDate}</td>
                      <td style={{ padding: '10px 12px' }}><Badge status={l.status} /></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>}
        </SectionCard>

        <SectionCard title="Announcements" action="View All">
          {announcements.length === 0
            ? <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED, margin: 0, textAlign: 'center', padding: '16px 0' }}>No announcements yet</p>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {announcements.map((a, i) => (
                  <div key={i} style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 12 }}>
                    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: TEXT, fontWeight: 600, lineHeight: 1.4 }}>{a.title}</div>
                    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: MUTED, marginTop: 3 }}>{a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN') : ''}</div>
                  </div>
                ))}
              </div>}
        </SectionCard>
      </div>
    </div>
  )
}

// ─── FACULTY DASHBOARD ────────────────────────────────────────────────────────
function FacultyDashboard({ isMobile }) {
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    Promise.allSettled([
      api.get('/courses/my'),
      api.get('/assignments/my')
    ]).then(([cRes, aRes]) => {
      if (cRes.status === 'fulfilled') setCourses(cRes.value.data.data?.slice(0, 4) || [])
      if (aRes.status === 'fulfilled') setAssignments(aRes.value.data.data?.slice(0, 5) || [])
    })
  }, [])

  const todaySchedule = [
    { time: '08:30 – 09:20', course: 'CS3021 – Data Structures', section: 'CSE-B', room: 'LH-204', type: 'Lecture', current: false },
    { time: '10:00 – 10:50', course: 'CS3021 – Data Structures', section: 'CSE-A', room: 'LH-101', type: 'Lecture', current: true },
    { time: '02:00 – 03:50', course: 'CS3024 – DBMS Lab', section: 'CSE-A', room: 'Lab-3', type: 'Lab', current: false },
    { time: '04:00 – 04:50', course: 'CS4011 – Machine Learning', section: 'CSE-C', room: 'LH-305', type: 'Tutorial', current: false }
  ]

  const marksStatus = [
    { course: 'CS3021 – Data Structures', entered: 58, total: 65, code: 'CS3021' },
    { course: 'CS3024 – DBMS Lab', entered: 40, total: 40, code: 'CS3024' },
    { course: 'CS4011 – Machine Learning', entered: 22, total: 55, code: 'CS4011' },
    { course: 'CS2031 – OOP Concepts', entered: 55, total: 60, code: 'CS2031' }
  ]

  const announcements = [
    { title: 'End Semester Exam Timetable Released', category: 'Exam', categoryColor: '#ef4444', categoryBg: '#fef2f2', time: '2h ago' },
    { title: 'Faculty Development Programme — July 14-18', category: 'Event', categoryColor: '#8b5cf6', categoryBg: '#f5f3ff', time: '1d ago' },
    { title: 'Internal Marks submission deadline: Jun 20', category: 'Deadline', categoryColor: '#f59e0b', categoryBg: '#fffbeb', time: '2d ago' }
  ]

  const quickActions = [
    { icon: <MdFactCheck />, label: 'Mark Attendance', color: '#6366f1', bg: '#eef2ff' },
    { icon: <MdUpload />, label: 'Upload Marks', color: '#10b981', bg: '#f0fdf4' },
    { icon: <MdBook />, label: 'Course Material', color: '#f59e0b', bg: '#fffbeb' },
    { icon: <MdFeedback />, label: 'Student Feedback', color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: <MdBeachAccess />, label: 'Leave Request', color: '#ef4444', bg: '#fef2f2' },
    { icon: <MdCalendarToday />, label: 'View Schedule', color: '#06b6d4', bg: '#ecfeff' }
  ]

  const typeColor = { Lecture: { bg: '#eef2ff', color: '#6366f1' }, Lab: { bg: '#f0fdf4', color: '#10b981' }, Tutorial: { bg: '#fffbeb', color: '#d97706' } }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <StatCard icon={<MdBook />} label="My Courses" value={courses.length || 4} color="#6366f1" bg="#eef2ff" trend="This semester" isMobile={isMobile} />
        <StatCard icon={<MdPeople />} label="Total Students" value={242} color="#10b981" bg="#f0fdf4" trend="Across all sections" isMobile={isMobile} />
        <StatCard icon={<MdListAlt />} label="Pending Marks" value={33} color="#f59e0b" bg="#fffbeb" trend="Due Jun 20" trendColor="#ef4444" isMobile={isMobile} />
        <StatCard icon={<MdCalendarToday />} label="Classes Today" value={4} color="#8b5cf6" bg="#f5f3ff" trend="Next: 10:00 AM" isMobile={isMobile} />
      </div>

      {/* Today's Schedule */}
      <SectionCard title="Today's Schedule" subtitle={new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui, sans-serif', fontSize: 13, minWidth: 400 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Time', 'Course', 'Section', 'Room', 'Type'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: MUTED, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {todaySchedule.map((s, i) => (
                <tr key={i} style={{
                  borderTop: '1px solid #f1f5f9',
                  background: s.current ? '#eef2ff' : 'transparent'
                }}>
                  <td style={{ padding: '11px 12px', color: s.current ? ACCENT : TEXT, fontWeight: s.current ? 700 : 400, whiteSpace: 'nowrap' }}>
                    {s.current && <span style={{ width: 7, height: 7, borderRadius: '50%', background: ACCENT, display: 'inline-block', marginRight: 6 }} />}
                    {s.time}
                  </td>
                  <td style={{ padding: '11px 12px', color: TEXT, fontWeight: 600 }}>{s.course}</td>
                  <td style={{ padding: '11px 12px', color: MUTED }}>{s.section}</td>
                  <td style={{ padding: '11px 12px', color: MUTED }}>{s.room}</td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{
                      background: typeColor[s.type]?.bg || '#f1f5f9',
                      color: typeColor[s.type]?.color || MUTED,
                      borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700
                    }}>
                      {s.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Quick Actions */}
      <SectionCard title="Quick Actions">
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: 12 }}>
          {quickActions.map((a, i) => (
            <QuickActionCard key={i} icon={a.icon} label={a.label} color={a.color} bg={a.bg} />
          ))}
        </div>
      </SectionCard>

      {/* Marks Status + Announcements */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        <SectionCard title="Marks Entry Status" subtitle="Internal assessment progress">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {marksStatus.map((m, i) => {
              const pct = Math.round((m.entered / m.total) * 100)
              const barColor = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: TEXT, fontWeight: 600 }}>{m.code}</span>
                    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: MUTED }}>{m.entered}/{m.total} entered</span>
                  </div>
                  <ProgressBar value={m.entered} max={m.total} color={barColor} />
                </div>
              )
            })}
          </div>
        </SectionCard>

        <SectionCard title="Announcements" action="View All">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {announcements.map((a, i) => (
              <div key={i} style={{ borderLeft: `3px solid ${a.categoryColor}`, paddingLeft: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ background: a.categoryBg, color: a.categoryColor, borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
                    {a.category}
                  </span>
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: MUTED }}>{a.time}</span>
                </div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: TEXT, fontWeight: 600, lineHeight: 1.4 }}>{a.title}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────
function StudentDashboard({ isMobile }) {
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    Promise.allSettled([
      api.get('/courses/my'),
      api.get('/assignments/my')
    ]).then(([cRes, aRes]) => {
      if (cRes.status === 'fulfilled') setCourses(cRes.value.data.data?.slice(0, 4) || [])
      if (aRes.status === 'fulfilled') setAssignments(aRes.value.data.data?.slice(0, 5) || [])
    })
  }, [])

  const attendancePct = 87.5
  const subjectAttendance = [
    { subject: 'Data Structures', pct: 92 },
    { subject: 'DBMS', pct: 88 },
    { subject: 'Machine Learning', pct: 79 },
    { subject: 'Computer Networks', pct: 95 },
    { subject: 'Operating Systems', pct: 83 }
  ]

  const exams = [
    { date: 'Jun 12, 2025', course: 'Data Structures (CS3021)', time: '10:00 AM', venue: 'Hall A – Block 2', days: 6 },
    { date: 'Jun 14, 2025', course: 'DBMS (CS3024)', time: '02:00 PM', venue: 'Hall B – Block 2', days: 8 },
    { date: 'Jun 18, 2025', course: 'Machine Learning (CS4011)', time: '10:00 AM', venue: 'Hall C – Block 3', days: 12 }
  ]

  const cgpaData = [
    { label: 'Sem 1', value: 78 },
    { label: 'Sem 2', value: 81 },
    { label: 'Sem 3', value: 84 },
    { label: 'Sem 4', value: 82 },
    { label: 'Sem 5', value: 86 },
    { label: 'Sem 6', value: 87, highlight: true }
  ]

  const notifications = [
    { icon: <MdWarning />, iconColor: '#ef4444', iconBg: '#fef2f2', text: 'Assignment due tomorrow — Data Structures Lab Report', border: '#ef4444', time: '2h ago' },
    { icon: <MdInfo />, iconColor: '#6366f1', iconBg: '#eef2ff', text: 'End Semester Exam schedule released for June 2025', border: '#6366f1', time: '5h ago' },
    { icon: <MdNotifications />, iconColor: '#f59e0b', iconBg: '#fffbeb', text: 'Fee payment deadline: Jul 1, 2025 — ₹47,500 pending', border: '#f59e0b', time: '1d ago' }
  ]

  const quickActions = [
    { icon: <MdCalendarToday />, label: 'View Timetable', color: '#6366f1', bg: '#eef2ff' },
    { icon: <MdFileDownload />, label: 'Download Marks', color: '#10b981', bg: '#f0fdf4' },
    { icon: <MdFactCheck />, label: 'Check Attendance', color: '#f59e0b', bg: '#fffbeb' },
    { icon: <MdCreditCard />, label: 'Fee Payment', color: '#ef4444', bg: '#fef2f2' },
    { icon: <MdBeachAccess />, label: 'Leave Request', color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: <MdMenuBook />, label: 'Course Registration', color: '#06b6d4', bg: '#ecfeff' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Attendance Summary — Top Row */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        <SectionCard title="Attendance Summary" subtitle="Current semester">
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <CircularProgress pct={attendancePct} size={110} color={ACCENT} label="Overall" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {subjectAttendance.map((s, i) => {
                const barColor = s.pct >= 85 ? '#10b981' : s.pct >= 75 ? '#f59e0b' : '#ef4444'
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: TEXT }}>{s.subject}</span>
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: barColor, fontWeight: 700 }}>{s.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99 }}>
                      <div style={{ width: `${s.pct}%`, height: '100%', background: barColor, borderRadius: 99 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Upcoming Exams" subtitle="End semester — June 2025">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui, sans-serif', fontSize: 13, minWidth: 400 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Date', 'Course', 'Time', 'Venue', ''].map((h, i) => (
                    <th key={i} style={{ padding: '7px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exams.map((e, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 10px', color: TEXT, fontWeight: 600, whiteSpace: 'nowrap', fontSize: 12 }}>{e.date}</td>
                    <td style={{ padding: '10px 10px', color: TEXT, fontSize: 12 }}>{e.course}</td>
                    <td style={{ padding: '10px 10px', color: MUTED, fontSize: 12, whiteSpace: 'nowrap' }}>{e.time}</td>
                    <td style={{ padding: '10px 10px', color: MUTED, fontSize: 12 }}>{e.venue}</td>
                    <td style={{ padding: '10px 10px' }}><DaysLeft days={e.days} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {/* Quick Actions */}
      <SectionCard title="Quick Actions">
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: 12 }}>
          {quickActions.map((a, i) => (
            <QuickActionCard key={i} icon={a.icon} label={a.label} color={a.color} bg={a.bg} />
          ))}
        </div>
      </SectionCard>

      {/* CGPA Trend + Notifications */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.3fr 1fr', gap: 20 }}>
        <SectionCard title="CGPA Trend" subtitle="Semester-wise GPA">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED }}>Cumulative GPA:</span>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 22, fontWeight: 800, color: ACCENT }}>8.30</span>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: '#10b981', fontWeight: 600 }}>↑ +0.1 from last sem</span>
          </div>
          <BarChart
            data={cgpaData}
            valueLabel=""
            maxHeight={140}
          />
        </SectionCard>

        <SectionCard title="Recent Notifications" action="View All">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {notifications.map((n, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                borderLeft: `3px solid ${n.border}`, paddingLeft: 12,
                paddingTop: 2, paddingBottom: 2
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: n.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <span style={{ color: n.iconColor, fontSize: 16 }}>{n.icon}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: TEXT, fontWeight: 500, lineHeight: 1.4 }}>{n.text}</div>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: MUTED, marginTop: 3 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

// ─── STAFF DASHBOARD ──────────────────────────────────────────────────────────
function StaffDashboard({ isMobile }) {
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    api.get('/leaves/balance').then(res => setBalance(res.data.data)).catch(() => {})
  }, [])

  const recentLeaves = [
    { type: 'Casual Leave', from: '2025-05-20', to: '2025-05-20', status: 'APPROVED' },
    { type: 'Sick Leave', from: '2025-04-14', to: '2025-04-15', status: 'APPROVED' }
  ]

  const quickActions = [
    { icon: <MdBeachAccess />, label: 'Apply Leave', color: '#6366f1', bg: '#eef2ff' },
    { icon: <MdSchedule />, label: 'My Schedule', color: '#10b981', bg: '#f0fdf4' },
    { icon: <MdPayment />, label: 'Payslips', color: '#f59e0b', bg: '#fffbeb' },
    { icon: <MdListAlt />, label: 'Leave History', color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: <MdBarChart />, label: 'Attendance', color: '#ef4444', bg: '#fef2f2' },
    { icon: <MdNotifications />, label: 'Notices', color: '#06b6d4', bg: '#ecfeff' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <StatCard icon={<MdBeachAccess />} label="Casual Leave" value={balance?.casualBalance ?? 12} color="#6366f1" bg="#eef2ff" trend="Available days" isMobile={isMobile} />
        <StatCard icon={<MdBeachAccess />} label="Sick Leave" value={balance?.sickBalance ?? 8} color="#10b981" bg="#f0fdf4" trend="Available days" isMobile={isMobile} />
        <StatCard icon={<MdBeachAccess />} label="Earned Leave" value={balance?.earnedBalance ?? 18} color="#f59e0b" bg="#fffbeb" trend="Available days" isMobile={isMobile} />
        <StatCard icon={<MdCheckCircle />} label="Attendance" value="96%" color="#10b981" bg="#f0fdf4" trend="This month" isMobile={isMobile} />
      </div>

      <SectionCard title="Quick Actions">
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: 12 }}>
          {quickActions.map((a, i) => (
            <QuickActionCard key={i} icon={a.icon} label={a.label} color={a.color} bg={a.bg} />
          ))}
        </div>
      </SectionCard>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        <SectionCard title="Leave History" subtitle="Recent leave records">
          {recentLeaves.length === 0 ? (
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED, margin: 0 }}>No leave records</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Type', 'From', 'To', 'Status'].map(h => (
                      <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentLeaves.map((l, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 10px', color: TEXT }}>{l.type}</td>
                      <td style={{ padding: '10px 10px', color: MUTED }}>{l.from}</td>
                      <td style={{ padding: '10px 10px', color: MUTED }}>{l.to}</td>
                      <td style={{ padding: '10px 10px' }}><Badge status={l.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Upcoming Events">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { color: '#6366f1', text: 'Staff Meeting — Academic Committee', date: 'Jun 10, 10:00 AM' },
              { color: '#10b981', text: 'Annual Sports Day Coordination', date: 'Jun 15, 09:00 AM' },
              { color: '#f59e0b', text: 'Payroll Processing for June 2025', date: 'Jun 25, all day' }
            ].map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: e.color, marginTop: 4, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: TEXT, fontWeight: 600 }}>{e.text}</div>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: MUTED, marginTop: 2 }}>{e.date}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

// ─── PARENT DASHBOARD ─────────────────────────────────────────────────────────
function ParentDashboard({ isMobile }) {
  const ward = { name: 'Arjun Kumar', dept: 'Computer Science & Engineering', sem: 'Semester 6', roll: 'CSE2022001', cgpa: 8.30 }
  const attendancePct = 87.5

  const examMarks = [
    { exam: 'Internal 1', marks: 42, max: 50, grade: 'A' },
    { exam: 'Internal 2', marks: 45, max: 50, grade: 'A+' },
    { exam: 'Model Exam', marks: 78, max: 100, grade: 'B+' }
  ]

  const quickLinks = [
    { icon: <MdContactPhone />, label: 'Contact Faculty', color: '#6366f1', bg: '#eef2ff' },
    { icon: <MdFactCheck />, label: 'View Attendance', color: '#10b981', bg: '#f0fdf4' },
    { icon: <MdBarChart />, label: 'View Marks', color: '#f59e0b', bg: '#fffbeb' },
    { icon: <MdCreditCard />, label: 'Pay Fees', color: '#ef4444', bg: '#fef2f2' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Ward Info Card */}
      <div style={{ ...CARD, padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{ color: '#fff', fontSize: 28, fontWeight: 800, fontFamily: 'system-ui, sans-serif' }}>
              {ward.name.charAt(0)}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{ward.name}</div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: MUTED, marginTop: 3 }}>
              {ward.dept} &nbsp;·&nbsp; {ward.sem} &nbsp;·&nbsp;
              <span style={{ fontWeight: 600, color: ACCENT }}>Roll: {ward.roll}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 24, fontWeight: 800, color: ACCENT }}>{ward.cgpa}</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: MUTED }}>CGPA</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 24, fontWeight: 800, color: '#10b981' }}>{attendancePct}%</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: MUTED }}>Attendance</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr 1fr', gap: 20 }}>
        {/* Circular Attendance */}
        <SectionCard title="Overall Attendance">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '8px 0' }}>
            <CircularProgress pct={attendancePct} size={120} color={ACCENT} label="Attendance" />
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: attendancePct >= 75 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
              {attendancePct >= 75 ? 'Attendance is satisfactory' : 'Attendance below minimum (75%)'}
            </div>
          </div>
        </SectionCard>

        {/* Exam Marks Summary */}
        <SectionCard title="Recent Exam Performance">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Exam', 'Marks', 'Grade'].map(h => (
                    <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: MUTED, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {examMarks.map((e, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 10px', color: TEXT, fontWeight: 500 }}>{e.exam}</td>
                    <td style={{ padding: '10px 10px', color: TEXT }}>
                      <span style={{ fontWeight: 700 }}>{e.marks}</span>
                      <span style={{ color: MUTED }}>/{e.max}</span>
                    </td>
                    <td style={{ padding: '10px 10px' }}>
                      <span style={{
                        background: e.grade.startsWith('A') ? '#f0fdf4' : '#fffbeb',
                        color: e.grade.startsWith('A') ? '#10b981' : '#d97706',
                        borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700
                      }}>
                        {e.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Fee Status */}
        <SectionCard title="Fee Status">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fef2f2', borderRadius: 10, padding: '14px 16px', border: '1px solid #fecaca' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: '#ef4444', fontWeight: 700, marginBottom: 4 }}>PENDING</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 24, fontWeight: 800, color: '#b91c1c' }}>₹47,500</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: '#ef4444', marginTop: 3 }}>Due by Jul 1, 2025</div>
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '14px 16px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: '#10b981', fontWeight: 700, marginBottom: 4 }}>PAID (Last Sem)</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 24, fontWeight: 800, color: '#15803d' }}>₹47,500</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: '#10b981', marginTop: 3 }}>Paid on Jan 5, 2025</div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Quick Links */}
      <SectionCard title="Quick Links">
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12 }}>
          {quickLinks.map((a, i) => (
            <QuickActionCard key={i} icon={a.icon} label={a.label} color={a.color} bg={a.bg} />
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

// ─── ALUMNI DASHBOARD ─────────────────────────────────────────────────────────
function AlumniDashboard({ isMobile }) {
  const alumniInfo = {
    name: 'Priya Rajan',
    gradYear: 2022,
    dept: 'Computer Science & Engineering',
    cgpa: 8.74,
    currentRole: 'Software Engineer at Infosys',
    batch: '2018–2022'
  }

  const quickLinks = [
    { icon: <MdFileDownload />, label: 'Download Transcripts', color: '#6366f1', bg: '#eef2ff' },
    { icon: <MdGroups />, label: 'Alumni Network', color: '#10b981', bg: '#f0fdf4' },
    { icon: <MdEventNote />, label: 'Events', color: '#f59e0b', bg: '#fffbeb' },
    { icon: <MdVerifiedUser />, label: 'Verify Certificate', color: '#8b5cf6', bg: '#f5f3ff' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome Card */}
      <div style={{
        ...CARD,
        padding: '28px 32px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -40, right: 60, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
            Welcome back, {alumniInfo.name.split(' ')[0]}! 🎓
          </div>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, opacity: 0.85, marginBottom: 20 }}>
            {alumniInfo.dept} &nbsp;·&nbsp; Batch {alumniInfo.batch}
          </div>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 26, fontWeight: 800 }}>{alumniInfo.gradYear}</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, opacity: 0.8 }}>Year of Graduation</div>
            </div>
            <div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 26, fontWeight: 800 }}>{alumniInfo.cgpa}</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, opacity: 0.8 }}>Final CGPA</div>
            </div>
            <div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 26, fontWeight: 800 }}>CSE</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, opacity: 0.8 }}>Department</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr', gap: 20 }}>
        {/* Current Status */}
        <SectionCard title="Current Status">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdBadge style={{ color: ACCENT, fontSize: 22 }} />
              </div>
              <div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: MUTED, fontWeight: 600 }}>CURRENT ROLE</div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: TEXT, fontWeight: 700 }}>{alumniInfo.currentRole}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdEmojiEvents style={{ color: '#10b981', fontSize: 22 }} />
              </div>
              <div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: MUTED, fontWeight: 600 }}>ACHIEVEMENT</div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: TEXT, fontWeight: 700 }}>First Class with Distinction</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdGroups style={{ color: '#d97706', fontSize: 22 }} />
              </div>
              <div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: MUTED, fontWeight: 600 }}>ALUMNI NETWORK</div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: TEXT, fontWeight: 700 }}>3,420 Alumni registered</div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Quick Links */}
        <SectionCard title="Quick Links">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {quickLinks.map((a, i) => (
              <QuickActionCard key={i} icon={a.icon} label={a.label} color={a.color} bg={a.bg} />
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Upcoming Alumni Events */}
      <SectionCard title="Upcoming Alumni Events" action="View All">
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { title: 'Alumni Meet 2025', date: 'Aug 10, 2025', location: 'Campus Auditorium', color: '#6366f1', bg: '#eef2ff' },
            { title: 'Tech Talk: AI in Industry', date: 'Jul 5, 2025', location: 'Online (Zoom)', color: '#10b981', bg: '#f0fdf4' },
            { title: 'Campus Recruitment Drive', date: 'Jul 20, 2025', location: 'Placement Cell', color: '#f59e0b', bg: '#fffbeb' }
          ].map((e, i) => (
            <div key={i} style={{ border: '1px solid #f1f5f9', borderRadius: 10, padding: '16px', borderTop: `3px solid ${e.color}` }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{e.title}</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: MUTED, marginBottom: 4 }}>📅 {e.date}</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: MUTED }}>📍 {e.location}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

// ─── ROOT DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth()
  const role = user?.role
  const roleLabel = roleLabelMap[role] || 'User'

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: TEXT }}>
      <PageHeader user={user} roleLabel={roleLabel} />

      {role === 'ADMIN'   && <AdminDashboard isMobile={isMobile} />}
      {role === 'FACULTY' && <FacultyDashboard isMobile={isMobile} />}
      {role === 'STUDENT' && <StudentDashboard isMobile={isMobile} />}
      {role === 'STAFF'   && <StaffDashboard isMobile={isMobile} />}
      {role === 'PARENT'  && <ParentDashboard isMobile={isMobile} />}
      {role === 'ALUMNI'  && <AlumniDashboard isMobile={isMobile} />}
    </div>
  )
}
