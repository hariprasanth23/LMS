import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { MdPeople, MdSchool, MdBook, MdBeachAccess, MdPayment, MdTrendingUp } from 'react-icons/md'

const ACCENT = '#6366f1'
const TEXT = '#1e293b'
const MUTED = '#64748b'

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '22px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      flex: 1
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <span style={{ color, fontSize: 24 }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 26, fontWeight: 700, color: TEXT, lineHeight: 1 }}>
          {value ?? '-'}
        </div>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED, marginTop: 4 }}>{label}</div>
      </div>
    </div>
  )
}

function SectionCard({ title, children }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #f1f5f9',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 15,
        fontWeight: 700,
        color: TEXT
      }}>
        {title}
      </div>
      <div style={{ padding: '16px 20px' }}>{children}</div>
    </div>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, faculty: 0, courses: 0, pendingLeaves: 0 })
  const [leaves, setLeaves] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studRes, empRes, leaveRes] = await Promise.allSettled([
          api.get('/students'),
          api.get('/employees'),
          api.get('/leaves')
        ])
        const students = studRes.status === 'fulfilled' ? (studRes.value.data.data?.length || 0) : 0
        const employees = empRes.status === 'fulfilled' ? empRes.value.data.data : []
        const faculty = employees.filter(e => e.employeeType === 'FACULTY').length
        const allLeaves = leaveRes.status === 'fulfilled' ? (leaveRes.value.data.data || []) : []
        const pending = allLeaves.filter(l => l.status === 'PENDING').length
        setStats({ students, faculty, courses: 0, pendingLeaves: pending })
        setLeaves(allLeaves.slice(0, 5))
      } catch {}
    }
    fetchData()
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <StatCard icon={<MdPeople />} label="Total Students" value={stats.students} color="#6366f1" bg="#eef2ff" />
        <StatCard icon={<MdSchool />} label="Faculty Members" value={stats.faculty} color="#10b981" bg="#f0fdf4" />
        <StatCard icon={<MdBook />} label="Active Courses" value={stats.courses} color="#f59e0b" bg="#fffbeb" />
        <StatCard icon={<MdBeachAccess />} label="Pending Leaves" value={stats.pendingLeaves} color="#ef4444" bg="#fef2f2" />
      </div>

      <SectionCard title="Recent Leave Requests">
        {leaves.length === 0 ? (
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED, margin: 0 }}>No recent leave requests</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Employee ID', 'Type', 'From', 'To', 'Status'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: MUTED, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaves.map(l => (
                <tr key={l.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', color: TEXT }}>{l.employeeId?.slice(0, 8)}...</td>
                  <td style={{ padding: '10px 12px', color: TEXT }}>{l.leaveType}</td>
                  <td style={{ padding: '10px 12px', color: TEXT }}>{l.fromDate}</td>
                  <td style={{ padding: '10px 12px', color: TEXT }}>{l.toDate}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      background: l.status === 'PENDING' ? '#fffbeb' : l.status === 'APPROVED' ? '#f0fdf4' : '#fef2f2',
                      color: l.status === 'PENDING' ? '#f59e0b' : l.status === 'APPROVED' ? '#10b981' : '#ef4444'
                    }}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>
    </div>
  )
}

function FacultyDashboard() {
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

  return (
    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr 1fr' }}>
      <SectionCard title="My Courses">
        {courses.length === 0 ? (
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED, margin: 0 }}>No courses assigned</p>
        ) : courses.map(c => (
          <div key={c.id} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{c.title || c.name}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{c.courseCode}</div>
          </div>
        ))}
      </SectionCard>
      <SectionCard title="Recent Assignments">
        {assignments.length === 0 ? (
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED, margin: 0 }}>No assignments yet</p>
        ) : assignments.map(a => (
          <div key={a.id} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{a.title}</div>
            <div style={{ fontSize: 12, color: MUTED }}>Due: {a.dueDate}</div>
          </div>
        ))}
      </SectionCard>
    </div>
  )
}

function StudentDashboard() {
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

  return (
    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr 1fr' }}>
      <SectionCard title="Enrolled Courses">
        {courses.length === 0 ? (
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED, margin: 0 }}>No enrolled courses</p>
        ) : courses.map(c => (
          <div key={c.id} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{c.title || c.name}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{c.courseCode}</div>
          </div>
        ))}
      </SectionCard>
      <SectionCard title="Upcoming Assignments">
        {assignments.length === 0 ? (
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED, margin: 0 }}>No upcoming assignments</p>
        ) : assignments.map(a => (
          <div key={a.id} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{a.title}</div>
            <div style={{ fontSize: 12, color: MUTED }}>Due: {a.dueDate}</div>
          </div>
        ))}
      </SectionCard>
    </div>
  )
}

function StaffDashboard() {
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    api.get('/leaves/balance').then(res => setBalance(res.data.data)).catch(() => {})
  }, [])

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <StatCard icon={<MdBeachAccess />} label="Casual Leave" value={balance?.casualBalance ?? '-'} color="#6366f1" bg="#eef2ff" />
      <StatCard icon={<MdBeachAccess />} label="Sick Leave" value={balance?.sickBalance ?? '-'} color="#10b981" bg="#f0fdf4" />
      <StatCard icon={<MdBeachAccess />} label="Earned Leave" value={balance?.earnedBalance ?? '-'} color="#f59e0b" bg="#fffbeb" />
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const role = user?.role

  const roleGreeting = {
    ADMIN: 'Admin Dashboard',
    FACULTY: 'Faculty Dashboard',
    STUDENT: 'Student Dashboard',
    STAFF: 'Staff Dashboard'
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>
          {roleGreeting[role] || 'Dashboard'}
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>
          Here's what's happening today
        </p>
      </div>

      {role === 'ADMIN' && <AdminDashboard />}
      {role === 'FACULTY' && <FacultyDashboard />}
      {role === 'STUDENT' && <StudentDashboard />}
      {role === 'STAFF' && <StaffDashboard />}
    </div>
  )
}
