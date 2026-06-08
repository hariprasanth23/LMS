import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const navItems = ['Registration', 'ME Exam Schedule']

function Th({ children }) {
  return <th style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #f1f5f9', background: BG, whiteSpace: 'nowrap' }}>{children}</th>
}
function Td({ children, style = {} }) {
  return <td style={{ padding: '10px 14px', color: TEXT, fontSize: 13, borderBottom: '1px solid #f8fafc', ...style }}>{children}</td>
}
function SectionCard({ children }) {
  return <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>{children}</div>
}
function SectionHeader({ title }) {
  return <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}><span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{title}</span></div>
}
function Loading() {
  return <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontSize: 14 }}>Loading…</div>
}

const statusBadge = (status) => {
  const map = {
    Approved:  { color: '#16a34a', bg: '#f0fdf4' },
    Pending:   { color: '#d97706', bg: '#fffbeb' },
    Rejected:  { color: '#dc2626', bg: '#fef2f2' },
    Scheduled: { color: '#0369a1', bg: '#eff6ff' },
  }
  const s = map[status] || { color: MUTED, bg: BG }
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: s.color, background: s.bg }}>{status}</span>
}

function RegistrationSection() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ courseCode: '', courseName: '', reason: '', absenceDate: '', detailedReason: '' })

  const eligibleCourses = [
    { code: 'CS6001', name: 'Data Warehousing & Mining' },
    { code: 'CS6002', name: 'Compiler Design' },
    { code: 'CS6003', name: 'Cloud Computing' },
    { code: 'CS6004', name: 'Cryptography & Network Security' },
    { code: 'CS6005', name: 'Elective I — Big Data Analytics' },
    { code: 'CS6006', name: 'Elective II — DevOps' },
  ]

  useEffect(() => {
    api.get('/examination/makeup/applications')
      .then(r => setApplications(r.data.data || []))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleCourseChange = (code) => {
    const course = eligibleCourses.find(c => c.code === code)
    setForm(prev => ({ ...prev, courseCode: code, courseName: course?.name || '' }))
  }

  const handleSubmit = async () => {
    if (!form.courseCode || !form.reason || !form.absenceDate) {
      toast.error('Please fill all required fields')
      return
    }
    setSubmitting(true)
    try {
      const res = await api.post('/examination/makeup/apply', {
        courseCode: form.courseCode,
        courseName: form.courseName,
        reason: form.reason,
        absenceDate: form.absenceDate,
        detailedReason: form.detailedReason,
      })
      setApplications(prev => [res.data.data, ...prev])
      setForm({ courseCode: '', courseName: '', reason: '', absenceDate: '', detailedReason: '' })
      toast.success('Application submitted!')
    } catch {
      toast.error('Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ padding: '14px 18px', background: '#eff6ff', borderRadius: 10, borderLeft: '4px solid #3b82f6', fontSize: 13, color: '#1d4ed8' }}>
        <strong>Information:</strong> Make-up exam is available for students who missed a regular exam due to valid reasons. Supporting documents are mandatory.
      </div>

      <SectionCard>
        <SectionHeader title="Apply for Make-up Exam" />
        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Course <span style={{ color: '#dc2626' }}>*</span></label>
              <select value={form.courseCode} onChange={e => handleCourseChange(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' }}>
                <option value="">Select eligible course...</option>
                {eligibleCourses.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Reason for Absence <span style={{ color: '#dc2626' }}>*</span></label>
              <select value={form.reason} onChange={e => handleChange('reason', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' }}>
                <option value="">Select reason...</option>
                {['Medical', 'Emergency', 'Event Representation', 'Other'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Date of Absence <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="date" value={form.absenceDate} onChange={e => handleChange('absenceDate', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Supporting Document</label>
            <div style={{ border: '2px dashed #e2e8f0', borderRadius: 8, padding: 20, textAlign: 'center', color: MUTED, fontSize: 13 }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>📎</div>
              <div>Drag & drop or <span style={{ color: ACCENT, cursor: 'pointer', fontWeight: 600 }}>Browse file</span></div>
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Detailed Reason</label>
            <textarea rows={4} value={form.detailedReason} onChange={e => handleChange('detailedReason', e.target.value)}
              placeholder="Provide a detailed explanation for your absence..."
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <button onClick={handleSubmit} disabled={submitting}
            style={{ padding: '10px 24px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {submitting ? 'Submitting…' : 'Submit Application'}
          </button>
        </div>
      </SectionCard>

      {loading ? null : applications.length > 0 && (
        <SectionCard>
          <SectionHeader title="My Applications" />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr>{['Course', 'Reason', 'Date of Absence', 'Status'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
              <tbody>
                {applications.map((a, i) => (
                  <tr key={i}>
                    <Td style={{ fontWeight: 600 }}>{a.courseName}</Td>
                    <Td>{a.reason}</Td>
                    <Td>{a.absenceDate}</Td>
                    <Td>{statusBadge(a.status)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  )
}

function MEScheduleSection() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/examination/makeup/applications')
      .then(r => setApplications((r.data.data || []).filter(a => a.status === 'Approved' && a.makeupDate)))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SectionCard>
      <SectionHeader title="Make-up Exam Schedule" />
      {loading ? <Loading /> : applications.length === 0 ? (
        <div style={{ padding: 24, color: MUTED, fontSize: 14 }}>No scheduled make-up exams yet.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>{['Course Code', 'Course Name', 'Make-up Date', 'Time', 'Venue', 'Status'].map(h => <Th key={h}>{h}</Th>)}</tr>
            </thead>
            <tbody>
              {applications.map((e, i) => (
                <tr key={i}>
                  <Td><span style={{ color: ACCENT, fontWeight: 600 }}>{e.courseCode}</span></Td>
                  <Td style={{ fontWeight: 600 }}>{e.courseName}</Td>
                  <Td style={{ fontWeight: 700 }}>{e.makeupDate}</Td>
                  <Td>{e.makeupTime || '—'}</Td>
                  <Td>{e.makeupVenue || '—'}</Td>
                  <Td>{statusBadge(e.status)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  )
}

const sectionComponents = {
  'Registration': RegistrationSection,
  'ME Exam Schedule': MEScheduleSection,
}

export default function MakeupExam() {
  const [active, setActive] = useState('Registration')
  const ActiveSection = sectionComponents[active]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: TEXT }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: TEXT }}>Examinations — Make-up Exam</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: MUTED }}>Register and view schedule for make-up examinations</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', minHeight: 500 }}>
        <div style={{ width: 210, borderRight: '1px solid #e2e8f0', padding: '12px 0', flexShrink: 0 }}>
          {navItems.map(item => {
            const isActive = active === item
            return (
              <button key={item} onClick={() => setActive(item)} style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '10px 18px',
                background: isActive ? '#eef2ff' : 'transparent', color: isActive ? ACCENT : TEXT,
                borderLeft: isActive ? `3px solid ${ACCENT}` : '3px solid transparent',
                fontWeight: isActive ? 600 : 400, fontSize: 13, border: 'none', cursor: 'pointer', lineHeight: 1.4,
              }}>
                {item}
              </button>
            )
          })}
        </div>
        <div style={{ flex: 1, padding: 28, background: BG, overflowX: 'auto' }}>
          {ActiveSection ? <ActiveSection /> : null}
        </div>
      </div>
    </div>
  )
}
