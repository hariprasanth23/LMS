import React, { useState } from 'react'

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

const statusBadge = (status) => {
  const map = {
    Approved: { color: '#16a34a', bg: '#f0fdf4' },
    Pending: { color: '#d97706', bg: '#fffbeb' },
    Rejected: { color: '#dc2626', bg: '#fef2f2' },
    Scheduled: { color: '#0369a1', bg: '#eff6ff' },
  }
  const s = map[status] || { color: MUTED, bg: BG }
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: s.color, background: s.bg }}>{status}</span>
}

const eligibleCourses = [
  'CS6001 - Data Structures',
  'CS6002 - Operating Systems',
  'CS6003 - Database Management',
  'CS6004 - Computer Networks',
  'CS6005 - Software Engineering',
  'CS6006 - Web Technologies',
]

const existingApplications = [
  { course: 'CS6004 Computer Networks', reason: 'Medical', doc: 'Medical Certificate.pdf', absenceDate: '2025-05-20', status: 'Approved' },
  { course: 'CS6002 Operating Systems', reason: 'Event Representation', doc: 'Event Letter.pdf', absenceDate: '2025-05-22', status: 'Pending' },
]

function RegistrationSection() {
  const [formData, setFormData] = useState({
    course: '',
    reason: '',
    absenceDate: '',
    detailedReason: '',
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Info banner */}
      <div style={{ padding: '14px 18px', background: '#eff6ff', borderRadius: 10, borderLeft: '4px solid #3b82f6', fontSize: 13, color: '#1d4ed8' }}>
        <strong>Information:</strong> Make-up exam is available for students who missed a regular exam due to valid reasons. Supporting documents are mandatory.
      </div>

      <SectionCard>
        <SectionHeader title="Apply for Make-up Exam" />
        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {/* Course */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Course <span style={{ color: '#dc2626' }}>*</span></label>
              <select
                value={formData.course}
                onChange={e => handleChange('course', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
              >
                <option value="">Select eligible course...</option>
                {eligibleCourses.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Reason */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Reason for Absence <span style={{ color: '#dc2626' }}>*</span></label>
              <select
                value={formData.reason}
                onChange={e => handleChange('reason', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
              >
                <option value="">Select reason...</option>
                <option>Medical</option>
                <option>Emergency</option>
                <option>Event Representation</option>
                <option>Other</option>
              </select>
            </div>

            {/* Date of Absence */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Date of Absence <span style={{ color: '#dc2626' }}>*</span></label>
              <input
                type="date"
                value={formData.absenceDate}
                onChange={e => handleChange('absenceDate', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Supporting Document */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Supporting Document <span style={{ color: '#dc2626' }}>*</span></label>
            <div style={{ border: '2px dashed #e2e8f0', borderRadius: 8, padding: '20px', textAlign: 'center', color: MUTED, fontSize: 13, background: BG }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>📎</div>
              <div>Drag & drop or <span style={{ color: ACCENT, cursor: 'pointer', fontWeight: 600 }}>Browse file</span></div>
              <div style={{ fontSize: 11, marginTop: 4 }}>Medical certificate, event letter, or other relevant document (PDF, JPG up to 5MB)</div>
            </div>
          </div>

          {/* Detailed Reason */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Detailed Reason <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea
              rows={4}
              value={formData.detailedReason}
              onChange={e => handleChange('detailedReason', e.target.value)}
              placeholder="Provide a detailed explanation for your absence and why you are requesting a make-up exam..."
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }}
            />
          </div>

          <button
            style={{ padding: '10px 24px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Submit Application
          </button>
        </div>
      </SectionCard>

      {/* Existing applications */}
      {existingApplications.length > 0 && (
        <SectionCard>
          <SectionHeader title="My Applications" />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <thead>
                <tr>{['Course', 'Reason', 'Supporting Doc', 'Date of Absence', 'Status'].map(h => <Th key={h}>{h}</Th>)}</tr>
              </thead>
              <tbody>
                {existingApplications.map((a, i) => (
                  <tr key={i}>
                    <Td style={{ fontWeight: 600 }}>{a.course}</Td>
                    <Td>{a.reason}</Td>
                    <Td>
                      <span style={{ color: ACCENT, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        📄 {a.doc}
                      </span>
                    </Td>
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
  const schedule = [
    {
      code: 'CS6004',
      name: 'Computer Networks',
      originalDate: '2025-05-20',
      makeupDate: '2025-06-18',
      time: '10:00 AM',
      venue: 'Hall A - 105',
      status: 'Scheduled',
    },
    {
      code: 'CS6002',
      name: 'Operating Systems',
      originalDate: '2025-05-22',
      makeupDate: '2025-06-20',
      time: '02:00 PM',
      venue: 'Hall B - 201',
      status: 'Pending',
    },
    {
      code: 'CS6001',
      name: 'Data Structures',
      originalDate: '2025-05-18',
      makeupDate: '2025-06-16',
      time: '10:00 AM',
      venue: 'Hall A - 101',
      status: 'Scheduled',
    },
  ]

  return (
    <SectionCard>
      <SectionHeader title="Make-up Exam Schedule" />
      <div style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9', fontSize: 13, color: MUTED }}>
        Showing scheduled make-up exams for approved applications.
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <thead>
            <tr>{['Course Code', 'Course Name', 'Original Exam Date', 'Make-up Exam Date', 'Time', 'Venue', 'Status'].map(h => <Th key={h}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {schedule.map((e, i) => (
              <tr key={i}>
                <Td><span style={{ color: ACCENT, fontWeight: 600 }}>{e.code}</span></Td>
                <Td style={{ fontWeight: 600 }}>{e.name}</Td>
                <Td style={{ color: MUTED, textDecoration: 'line-through' }}>{e.originalDate}</Td>
                <Td style={{ fontWeight: 700, color: TEXT }}>{e.makeupDate}</Td>
                <Td>{e.time}</Td>
                <Td>{e.venue}</Td>
                <Td>{statusBadge(e.status)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: 12, color: MUTED }}>
          <strong>Note:</strong> Make-up exam schedule is subject to change. Please check your registered email for any updates.
        </div>
      </div>
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
        {/* Left nav */}
        <div style={{ width: 210, borderRight: '1px solid #e2e8f0', padding: '12px 0', flexShrink: 0 }}>
          {navItems.map(item => {
            const isActive = active === item
            return (
              <button
                key={item}
                onClick={() => setActive(item)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 18px',
                  background: isActive ? '#eef2ff' : 'transparent',
                  color: isActive ? ACCENT : TEXT,
                  borderLeft: isActive ? `3px solid ${ACCENT}` : '3px solid transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 13,
                  border: 'none',
                  cursor: 'pointer',
                  lineHeight: 1.4,
                }}
              >
                {item}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 28, background: BG, overflowX: 'auto' }}>
          {ActiveSection ? <ActiveSection /> : null}
        </div>
      </div>
    </div>
  )
}
