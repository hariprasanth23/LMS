import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const navItems = ['Registration', 'Registration Details', 'Exam Schedule', 'Grade View', 'Paper See/Rev']

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
    Paid: { color: '#16a34a', bg: '#f0fdf4' },
    Pending: { color: '#d97706', bg: '#fffbeb' },
    Pass: { color: '#16a34a', bg: '#f0fdf4' },
    Fail: { color: '#dc2626', bg: '#fef2f2' },
    Applied: { color: '#7c3aed', bg: '#f5f3ff' },
    Eligible: { color: '#0369a1', bg: '#eff6ff' },
    Registered: { color: '#16a34a', bg: '#f0fdf4' },
  }
  const s = map[status] || { color: MUTED, bg: BG }
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: s.color, background: s.bg }}>{status}</span>
}

const eligibleSubjects = [
  { code: 'CS4002', name: 'Algorithms & Complexity', regulation: 'R2021', fee: 500 },
  { code: 'MA4001', name: 'Numerical Methods', regulation: 'R2021', fee: 500 },
  { code: 'CS5001', name: 'Microprocessors & Interfacing', regulation: 'R2021', fee: 500 },
]

function RegistrationSection() {
  const [selected, setSelected] = useState({})
  const toggle = (code) => setSelected(prev => ({ ...prev, [code]: !prev[code] }))
  const total = eligibleSubjects.filter(s => selected[s.code]).reduce((a, b) => a + b.fee, 0)
  const daysLeft = 8
  return (
    <SectionCard>
      <SectionHeader title="Arrear Exam Registration" />
      <div style={{ padding: '14px 20px', background: '#fef9c3', borderLeft: '4px solid #f59e0b', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: '#854d0e', fontWeight: 500 }}>Registration Deadline: <strong>June 20, 2025</strong></span>
        <span style={{ padding: '4px 12px', background: '#fef08a', borderRadius: 20, fontSize: 12, fontWeight: 700, color: '#92400e' }}>{daysLeft} days left</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <thead>
            <tr>{['', 'Course Code', 'Course Name', 'Regulation', 'Exam Fee'].map(h => <Th key={h}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {eligibleSubjects.map((s, i) => (
              <tr key={i} style={{ background: selected[s.code] ? '#f5f3ff' : 'transparent' }}>
                <Td>
                  <input type="checkbox" checked={!!selected[s.code]} onChange={() => toggle(s.code)} style={{ width: 15, height: 15, cursor: 'pointer', accentColor: ACCENT }} />
                </Td>
                <Td><span style={{ color: ACCENT, fontWeight: 600 }}>{s.code}</span></Td>
                <Td>{s.name}</Td>
                <Td>{s.regulation}</Td>
                <Td>₹{s.fee}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 14 }}>
          <span style={{ color: MUTED }}>Total Fee: </span>
          <span style={{ fontWeight: 800, color: ACCENT, fontSize: 18 }}>₹{total}</span>
        </div>
        <button
          disabled={total === 0}
          style={{ padding: '9px 22px', background: total > 0 ? '#16a34a' : '#d1d5db', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: total > 0 ? 'pointer' : 'not-allowed' }}
        >
          Submit & Pay
        </button>
      </div>
    </SectionCard>
  )
}

function RegistrationDetailsSection() {
  const details = [
    { code: 'CS4002', name: 'Algorithms & Complexity', regulation: 'R2021', fee: '₹500', receipt: 'RCT-2024-0812', date: '2024-10-05', status: 'Paid' },
    { code: 'MA4001', name: 'Numerical Methods', regulation: 'R2021', fee: '₹500', receipt: 'RCT-2024-0813', date: '2024-10-05', status: 'Paid' },
  ]
  return (
    <SectionCard>
      <SectionHeader title="Arrear Registration Details — Current Cycle" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <thead>
            <tr>{['Course Code', 'Course Name', 'Regulation', 'Fee Paid', 'Receipt No', 'Registration Date', 'Status'].map(h => <Th key={h}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {details.map((r, i) => (
              <tr key={i}>
                <Td><span style={{ color: ACCENT, fontWeight: 600 }}>{r.code}</span></Td>
                <Td>{r.name}</Td>
                <Td>{r.regulation}</Td>
                <Td style={{ fontWeight: 600 }}>{r.fee}</Td>
                <Td style={{ color: MUTED, fontFamily: 'monospace' }}>{r.receipt}</Td>
                <Td>{r.date}</Td>
                <Td>{statusBadge(r.status)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{ padding: '8px 18px', background: BG, border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: TEXT, display: 'flex', alignItems: 'center', gap: 6 }}>
          🖨 Print Receipt
        </button>
      </div>
    </SectionCard>
  )
}

function ArrearScheduleSection() {
  const schedule = [
    { date: '2025-07-08', session: 'FN', code: 'CS4002', name: 'Algorithms & Complexity', venue: 'Hall A - 101' },
    { date: '2025-07-10', session: 'AN', code: 'MA4001', name: 'Numerical Methods', venue: 'Hall B - 202' },
    { date: '2025-07-12', session: 'FN', code: 'CS5001', name: 'Microprocessors & Interfacing', venue: 'Hall A - 102' },
    { date: '2025-07-15', session: 'AN', code: 'CS3003', name: 'Digital Electronics', venue: 'Hall C - 301' },
  ]
  return (
    <SectionCard>
      <SectionHeader title="Arrear Exam Timetable — July 2025" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <thead>
            <tr>{['Date', 'Session', 'Course Code', 'Course Name', 'Venue'].map(h => <Th key={h}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {schedule.map((e, i) => (
              <tr key={i}>
                <Td style={{ fontWeight: 600 }}>{e.date}</Td>
                <Td>
                  <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, background: e.session === 'FN' ? '#eff6ff' : '#f0fdf4', color: e.session === 'FN' ? '#2563eb' : '#16a34a' }}>
                    {e.session === 'FN' ? 'FN (Forenoon)' : 'AN (Afternoon)'}
                  </span>
                </Td>
                <Td><span style={{ color: ACCENT, fontWeight: 600 }}>{e.code}</span></Td>
                <Td>{e.name}</Td>
                <Td>{e.venue}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

function GradeViewSection() {
  const history = [
    { course: 'CS4002 Algorithms', attempt: 1, period: 'Nov 2023', marks: 28, grade: 'F', status: 'Fail' },
    { course: 'CS4002 Algorithms', attempt: 2, period: 'Apr 2024', marks: 54, grade: 'C', status: 'Pass' },
    { course: 'MA4001 Numerical Methods', attempt: 1, period: 'Nov 2023', marks: 35, grade: 'F', status: 'Fail' },
    { course: 'MA4001 Numerical Methods', attempt: 2, period: 'Apr 2024', marks: 48, grade: 'F', status: 'Fail' },
    { course: 'MA4001 Numerical Methods', attempt: 3, period: 'Nov 2024', marks: 61, grade: 'C+', status: 'Pass' },
    { course: 'CS5001 Microprocessors', attempt: 1, period: 'Apr 2024', marks: 41, grade: 'F', status: 'Fail' },
    { course: 'CS5001 Microprocessors', attempt: 2, period: 'Nov 2024', marks: 55, grade: 'C', status: 'Pass' },
  ]
  return (
    <SectionCard>
      <SectionHeader title="Arrear Attempt History" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <thead>
            <tr>{['Course', 'Attempt No', 'Exam Month/Year', 'Marks (/100)', 'Grade', 'Status'].map(h => <Th key={h}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {history.map((r, i) => (
              <tr key={i}>
                <Td style={{ fontWeight: 600 }}>{r.course}</Td>
                <Td style={{ textAlign: 'center' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 10, background: BG, fontSize: 12, fontWeight: 600, border: '1px solid #e2e8f0' }}>#{r.attempt}</span>
                </Td>
                <Td>{r.period}</Td>
                <Td style={{ textAlign: 'center', fontWeight: 700, color: r.marks >= 50 ? '#16a34a' : '#dc2626' }}>{r.marks}</Td>
                <Td style={{ fontWeight: 700 }}>{r.grade}</Td>
                <Td>{statusBadge(r.status)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

function ArrearPaperSeeRevSection() {
  const papers = [
    { sem: 'Sem 4', course: 'CS4002 Algorithms', period: 'Nov 2023', marks: 28, seeFee: '₹200', revFee: '₹500', status: 'Eligible' },
    { sem: 'Sem 4', course: 'MA4001 Numerical Methods', period: 'Apr 2024', marks: 48, seeFee: '₹200', revFee: '₹500', status: 'Applied' },
  ]
  return (
    <SectionCard>
      <SectionHeader title="Arrear Paper Seeing / Revaluation" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <thead>
            <tr>{['Semester', 'Course', 'Exam Period', 'Marks Obtained', 'See Fee', 'Rev Fee', 'Status', 'Action'].map(h => <Th key={h}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {papers.map((r, i) => (
              <tr key={i}>
                <Td>{r.sem}</Td>
                <Td style={{ fontWeight: 600 }}>{r.course}</Td>
                <Td>{r.period}</Td>
                <Td style={{ textAlign: 'center', fontWeight: 700, color: r.marks >= 50 ? '#16a34a' : '#dc2626' }}>{r.marks}</Td>
                <Td>{r.seeFee}</Td>
                <Td>{r.revFee}</Td>
                <Td>{statusBadge(r.status)}</Td>
                <Td>
                  {r.status === 'Eligible' ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ padding: '4px 10px', background: '#eff6ff', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#2563eb', fontSize: 12, fontWeight: 600 }}>See</button>
                      <button style={{ padding: '4px 10px', background: '#f5f3ff', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#7c3aed', fontSize: 12, fontWeight: 600 }}>Review</button>
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: MUTED }}>Applied</span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

const sectionComponents = {
  'Registration': RegistrationSection,
  'Registration Details': RegistrationDetailsSection,
  'Exam Schedule': ArrearScheduleSection,
  'Grade View': GradeViewSection,
  'Paper See/Rev': ArrearPaperSeeRevSection,
}

export default function ArrearExam() {
  const [active, setActive] = useState('Registration')
  const ActiveSection = sectionComponents[active]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: TEXT }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: TEXT }}>Examinations — Arrear</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: MUTED }}>Regular arrear and ReFAT examination management</p>
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
                  borderLeft: isActive ? `3px solid ${ACCENT}` : '3px solid transparent',
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
