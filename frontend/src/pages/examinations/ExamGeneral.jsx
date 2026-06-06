import React, { useState, useEffect } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const navItems = [
  'Exam Schedule', 'Marks', 'Grades', 'Grade History', 'Regular Paper See/Rev',
  'Additional Learning', 'MOOC File Upload', 'Project File Upload', 'ECA File Upload',
  'EPT Schedule', 'Re-Exam Application', 'Code of Conduct'
]

const examSchedule = [
  { date: '2025-06-02', day: 'Monday', time: '10:00 AM', code: 'CS6001', name: 'Data Structures', venue: 'Hall A - 101', type: 'End Semester' },
  { date: '2025-06-04', day: 'Wednesday', time: '02:00 PM', code: 'CS6002', name: 'Operating Systems', venue: 'Hall B - 203', type: 'End Semester' },
  { date: '2025-06-06', day: 'Friday', time: '10:00 AM', code: 'CS6003', name: 'Database Management', venue: 'Hall A - 102', type: 'End Semester' },
  { date: '2025-06-09', day: 'Monday', time: '02:00 PM', code: 'CS6004', name: 'Computer Networks', venue: 'Hall C - 301', type: 'End Semester' },
  { date: '2025-06-11', day: 'Wednesday', time: '10:00 AM', code: 'CS6005', name: 'Software Engineering', venue: 'Hall B - 204', type: 'End Semester' },
  { date: '2025-06-13', day: 'Friday', time: '02:00 PM', code: 'CS6006', name: 'Web Technologies', venue: 'Hall A - 103', type: 'End Semester' },
]

const marksData = [
  { code: 'CS6001', name: 'Data Structures', ca1: 18, ca2: 17, ca3: 19, model: 43, attendance: 5 },
  { code: 'CS6002', name: 'Operating Systems', ca1: 15, ca2: 16, ca3: 14, model: 38, attendance: 4 },
  { code: 'CS6003', name: 'Database Management', ca1: 19, ca2: 18, ca3: 20, model: 46, attendance: 5 },
  { code: 'CS6004', name: 'Computer Networks', ca1: 16, ca2: 15, ca3: 17, model: 40, attendance: 4 },
  { code: 'CS6005', name: 'Software Engineering', ca1: 20, ca2: 19, ca3: 18, model: 45, attendance: 5 },
  { code: 'CS6006', name: 'Web Technologies', ca1: 14, ca2: 16, ca3: 15, model: 35, attendance: 3 },
]

const gradesData = [
  { course: 'CS6001 Data Structures', credits: 4, grade: 'O', gradePoints: 10 },
  { course: 'CS6002 Operating Systems', credits: 4, grade: 'A+', gradePoints: 9 },
  { course: 'CS6003 Database Management', credits: 4, grade: 'O', gradePoints: 10 },
  { course: 'CS6004 Computer Networks', credits: 3, grade: 'A', gradePoints: 8 },
  { course: 'CS6005 Software Engineering', credits: 3, grade: 'A+', gradePoints: 9 },
  { course: 'CS6006 Web Technologies', credits: 3, grade: 'B+', gradePoints: 7 },
]

const semesterGPA = [
  { sem: 'Sem 1', sgpa: 7.8 },
  { sem: 'Sem 2', sgpa: 8.1 },
  { sem: 'Sem 3', sgpa: 8.4 },
  { sem: 'Sem 4', sgpa: 8.2 },
  { sem: 'Sem 5', sgpa: 8.6 },
  { sem: 'Sem 6', sgpa: 8.7 },
]

const paperSeeRevData = [
  { sem: 'Sem 4', course: 'CS4002 Algorithms', date: 'Nov 2023', marks: 52, seeFee: '₹200', revFee: '₹500', status: 'Applied' },
  { sem: 'Sem 5', course: 'CS5003 Theory of Computation', date: 'Apr 2024', marks: 61, seeFee: '₹200', revFee: '₹500', status: 'Eligible' },
  { sem: 'Sem 5', course: 'CS5001 Microprocessors', date: 'Apr 2024', marks: 48, seeFee: '₹200', revFee: '₹500', status: 'Eligible' },
]

const additionalLearning = [
  { activity: 'Python for Data Science', provider: 'NPTEL', date: '2024-04-15', credits: 2 },
  { activity: 'Cloud Computing Basics', provider: 'Coursera', date: '2024-06-20', credits: 1 },
  { activity: 'Machine Learning Fundamentals', provider: 'edX', date: '2024-09-10', credits: 2 },
]

const moocData = [
  { course: 'Deep Learning Specialization', platform: 'Coursera', duration: '4 months', date: '2024-05-01', status: 'Verified' },
  { course: 'AWS Cloud Practitioner', platform: 'AWS', duration: '2 months', date: '2024-08-15', status: 'Pending' },
]

const projectFiles = [
  { title: 'Smart Campus System', phase: 'Review 2', type: 'Report', uploaded: '2024-11-20 10:30 AM' },
  { title: 'Smart Campus System', phase: 'Proposal', type: 'PPT', uploaded: '2024-09-05 02:15 PM' },
]

const ecaData = [
  { activity: 'State Chess Championship', category: 'Sports', date: '2024-08-12', achievement: '2nd Place', status: 'Verified' },
  { activity: 'Hackathon 2024', category: 'Technical', date: '2024-10-05', achievement: 'Finalist', status: 'Pending' },
]

const gradeColor = (g) => {
  if (g === 'O') return { color: '#16a34a', background: '#f0fdf4' }
  if (g === 'A+') return { color: '#2563eb', background: '#eff6ff' }
  if (g === 'A') return { color: '#0d9488', background: '#f0fdfa' }
  return { color: '#64748b', background: '#f8fafc' }
}

const statusBadge = (status) => {
  const map = {
    Verified: { color: '#16a34a', bg: '#f0fdf4' },
    Pending: { color: '#d97706', bg: '#fffbeb' },
    Rejected: { color: '#dc2626', bg: '#fef2f2' },
    Applied: { color: '#7c3aed', bg: '#f5f3ff' },
    Eligible: { color: '#0369a1', bg: '#eff6ff' },
    Pass: { color: '#16a34a', bg: '#f0fdf4' },
    Fail: { color: '#dc2626', bg: '#fef2f2' },
  }
  const s = map[status] || { color: MUTED, bg: BG }
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: s.color, background: s.bg }}>
      {status}
    </span>
  )
}

function SectionCard({ children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      {children}
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{title}</span>
    </div>
  )
}

function Th({ children }) {
  return <th style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #f1f5f9', background: BG, whiteSpace: 'nowrap' }}>{children}</th>
}
function Td({ children, style = {} }) {
  return <td style={{ padding: '10px 14px', color: TEXT, fontSize: 13, borderBottom: '1px solid #f8fafc', ...style }}>{children}</td>
}

// ---- Section components ----

function ExamScheduleSection() {
  const todayStr = '2025-06-04'
  const nextExam = examSchedule.find(e => e.date >= todayStr)
  return (
    <SectionCard>
      <SectionHeader title="Exam Schedule — Semester 6 (June 2025)" />
      {nextExam && (
        <div style={{ margin: '16px 20px', padding: '14px 18px', background: '#eff6ff', borderRadius: 10, borderLeft: '4px solid #3b82f6', fontSize: 13, color: '#1d4ed8' }}>
          <strong>Next Exam:</strong> {nextExam.name} on {nextExam.date} at {nextExam.time} — {nextExam.venue}
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <thead>
            <tr>{['Date', 'Day', 'Time', 'Course Code', 'Course Name', 'Venue', 'Exam Type'].map(h => <Th key={h}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {examSchedule.map((e, i) => {
              const isToday = e.date === todayStr
              return (
                <tr key={i} style={{ background: isToday ? '#fefce8' : 'transparent' }}>
                  <Td style={isToday ? { fontWeight: 700 } : {}}>{e.date}</Td>
                  <Td>{e.day}</Td>
                  <Td>{e.time}</Td>
                  <Td><span style={{ color: ACCENT, fontWeight: 600 }}>{e.code}</span></Td>
                  <Td>{e.name}</Td>
                  <Td>{e.venue}</Td>
                  <Td><span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: '#f0fdf4', color: '#16a34a' }}>{e.type}</span></Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

function MarksSection() {
  const rows = marksData.map(r => {
    const total = r.ca1 + r.ca2 + r.ca3 + r.model + r.attendance
    return { ...r, total }
  })
  const totals = rows.map(r => r.total)
  const highest = Math.max(...totals)
  const lowest = Math.min(...totals)
  const avg = (totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(1)
  return (
    <SectionCard>
      <SectionHeader title="Internal Assessment Marks — Semester 6" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <thead>
            <tr>{['Course Code', 'Course Name', 'CA1 (/20)', 'CA2 (/20)', 'CA3 (/20)', 'Model Exam (/50)', 'Attendance (/5)', 'Total (/100)', 'Status'].map(h => <Th key={h}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <Td><span style={{ color: ACCENT, fontWeight: 600 }}>{r.code}</span></Td>
                <Td>{r.name}</Td>
                <Td style={{ textAlign: 'center' }}>{r.ca1}</Td>
                <Td style={{ textAlign: 'center' }}>{r.ca2}</Td>
                <Td style={{ textAlign: 'center' }}>{r.ca3}</Td>
                <Td style={{ textAlign: 'center' }}>{r.model}</Td>
                <Td style={{ textAlign: 'center' }}>{r.attendance}</Td>
                <Td><span style={{ fontWeight: 700, color: r.total >= 50 ? '#16a34a' : '#dc2626' }}>{r.total}</span></Td>
                <Td>{statusBadge(r.total >= 50 ? 'Pass' : 'Fail')}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: 24, padding: '14px 20px', borderTop: '1px solid #f1f5f9', fontSize: 13 }}>
        {[{ label: 'Highest', val: highest, color: '#16a34a' }, { label: 'Average', val: avg, color: ACCENT }, { label: 'Lowest', val: lowest, color: '#dc2626' }].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: MUTED }}>{s.label}:</span>
            <span style={{ fontWeight: 700, color: s.color }}>{s.val}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function GradesSection() {
  const totalCredits = gradesData.reduce((a, b) => a + b.credits, 0)
  const weightedSum = gradesData.reduce((a, b) => a + b.credits * b.gradePoints, 0)
  const sgpa = (weightedSum / totalCredits).toFixed(2)
  return (
    <SectionCard>
      <SectionHeader title="Grade Card — Semester 6" />
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: 'linear-gradient(135deg, #6366f1, #818cf8)', borderRadius: 12, padding: '14px 24px', color: '#fff', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>SGPA</div>
            <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{sgpa}</div>
          </div>
          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ fontSize: 12, opacity: 0.85 }}>Semester 6<br />June 2025</div>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <thead>
            <tr>{['Course', 'Credits', 'Grade', 'Grade Points'].map(h => <Th key={h}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {gradesData.map((r, i) => (
              <tr key={i}>
                <Td>{r.course}</Td>
                <Td style={{ textAlign: 'center' }}>{r.credits}</Td>
                <Td>
                  <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 13, fontWeight: 700, ...gradeColor(r.grade) }}>{r.grade}</span>
                </Td>
                <Td style={{ textAlign: 'center', fontWeight: 600 }}>{r.gradePoints}</Td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: BG }}>
              <td colSpan={4} style={{ padding: '12px 14px', borderTop: '2px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: 32, fontSize: 13, fontWeight: 700, color: TEXT }}>
                  <span>Total Credits: <span style={{ color: ACCENT }}>{totalCredits}</span></span>
                  <span>SGPA: <span style={{ color: ACCENT }}>{sgpa}</span></span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </SectionCard>
  )
}

function GradeHistorySection() {
  const maxGpa = 10
  const barColors = ['#818cf8', '#6366f1', '#4f46e5', '#818cf8', '#6366f1', '#4338ca']
  return (
    <SectionCard>
      <SectionHeader title="Grade History — Semester-wise GPA" />
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 200, padding: '0 10px 0', marginBottom: 12 }}>
          {semesterGPA.map((s, i) => {
            const heightPct = (s.sgpa / maxGpa) * 100
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: barColors[i] }}>{s.sgpa}</span>
                <div style={{
                  width: '100%', height: `${heightPct * 1.7}px`,
                  background: barColors[i], borderRadius: '6px 6px 0 0',
                  position: 'relative', transition: 'height 0.3s'
                }} />
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, paddingLeft: 10 }}>
          {semesterGPA.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 12, color: MUTED, fontWeight: 600 }}>{s.sem}</div>
          ))}
        </div>
        <div style={{ marginTop: 20, padding: '12px 16px', background: BG, borderRadius: 8, display: 'inline-flex', gap: 32 }}>
          <span style={{ fontSize: 13, color: MUTED }}>CGPA: <strong style={{ color: TEXT, fontSize: 15 }}>8.30</strong></span>
          <span style={{ fontSize: 13, color: MUTED }}>Current SGPA: <strong style={{ color: ACCENT, fontSize: 15 }}>8.70</strong></span>
        </div>
      </div>
    </SectionCard>
  )
}

function PaperSeeRevSection() {
  return (
    <SectionCard>
      <SectionHeader title="Regular Paper Seeing / Revaluation" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <thead>
            <tr>{['Semester', 'Course', 'Exam Date', 'Marks Obtained', 'See Fee', 'Rev Fee', 'Status', 'Action'].map(h => <Th key={h}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {paperSeeRevData.map((r, i) => (
              <tr key={i}>
                <Td>{r.sem}</Td>
                <Td>{r.course}</Td>
                <Td>{r.date}</Td>
                <Td style={{ textAlign: 'center', fontWeight: 600 }}>{r.marks}</Td>
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

function AdditionalLearningSection() {
  const total = additionalLearning.reduce((a, b) => a + b.credits, 0)
  return (
    <SectionCard>
      <SectionHeader title="Additional Learning Credits" />
      <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{ fontSize: 13, color: MUTED }}>Total Credits Earned: <strong style={{ color: ACCENT }}>{total}</strong></span>
        <button style={{ padding: '7px 14px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ Add Activity</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif', minWidth: 400 }}>
        <thead>
          <tr>{['Activity', 'Provider', 'Date Completed', 'Credits Earned'].map(h => <Th key={h}>{h}</Th>)}</tr>
        </thead>
        <tbody>
          {additionalLearning.map((r, i) => (
            <tr key={i}>
              <Td style={{ fontWeight: 600 }}>{r.activity}</Td>
              <Td>{r.provider}</Td>
              <Td>{r.date}</Td>
              <Td><span style={{ padding: '2px 10px', borderRadius: 20, background: '#f0fdf4', color: '#16a34a', fontWeight: 700, fontSize: 13 }}>{r.credits}</span></Td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </SectionCard>
  )
}

function MOOCUploadSection() {
  return (
    <SectionCard>
      <SectionHeader title="MOOC Certificate Upload" />
      <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          {[['Course Name', 'text', 'e.g. Machine Learning'], ['Platform', 'text', 'e.g. Coursera, edX, NPTEL'], ['Duration', 'text', 'e.g. 8 weeks'], ['Completion Date', 'date', '']].map(([label, type, ph]) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
              <input type={type} placeholder={ph} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Certificate File</label>
          <div style={{ border: '2px dashed #e2e8f0', borderRadius: 8, padding: '20px', textAlign: 'center', color: MUTED, fontSize: 13 }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>📎</div>
            <div>Drag & drop or <span style={{ color: ACCENT, cursor: 'pointer', fontWeight: 600 }}>Browse</span></div>
            <div style={{ fontSize: 11, marginTop: 4 }}>PDF, JPG, PNG up to 5MB</div>
          </div>
        </div>
        <button style={{ padding: '8px 20px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Upload Certificate</button>
      </div>
      <div style={{ padding: '12px 20px 4px', fontSize: 13, fontWeight: 700, color: TEXT }}>Uploaded MOOCs</div>
      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif', minWidth: 500 }}>
        <thead>
          <tr>{['Course Name', 'Platform', 'Duration', 'Completion Date', 'Verification Status'].map(h => <Th key={h}>{h}</Th>)}</tr>
        </thead>
        <tbody>
          {moocData.map((r, i) => (
            <tr key={i}>
              <Td style={{ fontWeight: 600 }}>{r.course}</Td>
              <Td>{r.platform}</Td>
              <Td>{r.duration}</Td>
              <Td>{r.date}</Td>
              <Td>{statusBadge(r.status)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </SectionCard>
  )
}

function ProjectUploadSection() {
  return (
    <SectionCard>
      <SectionHeader title="Project File Upload" />
      <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          {[['Project Title', 'text', 'Enter project title'], ['Document Type', 'text', 'e.g. Report, PPT, Code']].map(([label, type, ph]) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
              <input type={type} placeholder={ph} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Phase</label>
            <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
              {['Proposal', 'Review 1', 'Review 2', 'Final'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>File Upload</label>
          <div style={{ border: '2px dashed #e2e8f0', borderRadius: 8, padding: '20px', textAlign: 'center', color: MUTED, fontSize: 13 }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>📁</div>
            <div>Drag & drop or <span style={{ color: ACCENT, cursor: 'pointer', fontWeight: 600 }}>Browse</span></div>
          </div>
        </div>
        <button style={{ padding: '8px 20px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Upload File</button>
      </div>
      <div style={{ padding: '12px 20px 4px', fontSize: 13, fontWeight: 700, color: TEXT }}>Uploaded Files</div>
      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 400 }}>
        <thead>
          <tr>{['Project Title', 'Phase', 'Document Type', 'Uploaded At'].map(h => <Th key={h}>{h}</Th>)}</tr>
        </thead>
        <tbody>
          {projectFiles.map((r, i) => (
            <tr key={i}>
              <Td style={{ fontWeight: 600 }}>{r.title}</Td>
              <Td>{r.phase}</Td>
              <Td>{r.type}</Td>
              <Td style={{ color: MUTED }}>{r.uploaded}</Td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </SectionCard>
  )
}

function ECAUploadSection() {
  return (
    <SectionCard>
      <SectionHeader title="Extra Curricular Activity (ECA) File Upload" />
      <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          {[['Activity Name', 'text', 'e.g. State Championship'], ['Event Date', 'date', ''], ['Achievement', 'text', 'e.g. 1st Place, Participant']].map(([label, type, ph]) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
              <input type={type} placeholder={ph} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Category</label>
            <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
              {['Sports', 'Cultural', 'Technical', 'NSS', 'NCC'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Certificate Upload</label>
          <div style={{ border: '2px dashed #e2e8f0', borderRadius: 8, padding: '20px', textAlign: 'center', color: MUTED, fontSize: 13 }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>🏆</div>
            <div>Drag & drop or <span style={{ color: ACCENT, cursor: 'pointer', fontWeight: 600 }}>Browse</span></div>
          </div>
        </div>
        <button style={{ padding: '8px 20px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Upload</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
        <thead>
          <tr>{['Activity', 'Category', 'Event Date', 'Achievement', 'Status'].map(h => <Th key={h}>{h}</Th>)}</tr>
        </thead>
        <tbody>
          {ecaData.map((r, i) => (
            <tr key={i}>
              <Td style={{ fontWeight: 600 }}>{r.activity}</Td>
              <Td>{r.category}</Td>
              <Td>{r.date}</Td>
              <Td>{r.achievement}</Td>
              <Td>{statusBadge(r.status)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </SectionCard>
  )
}

function EPTSection() {
  const registered = false
  return (
    <SectionCard>
      <SectionHeader title="English Proficiency Test (EPT) Schedule" />
      <div style={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {[
            { label: 'Test Date', value: 'July 5, 2025' },
            { label: 'Time', value: '10:00 AM – 12:00 PM' },
            { label: 'Venue', value: 'Computer Lab 3, Block B' },
            { label: 'Registration Deadline', value: 'June 25, 2025' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: BG, borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <a href="#syllabus" style={{ color: ACCENT, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>📄 View Syllabus</a>
          <span style={{ color: MUTED, fontSize: 12 }}>|</span>
          <span style={{ fontSize: 13 }}>Status: {statusBadge(registered ? 'Verified' : 'Eligible')}</span>
        </div>
        {!registered && (
          <div style={{ padding: '14px 18px', background: '#fef9c3', border: '1px solid #fde047', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#854d0e' }}>You are not yet registered. Deadline: <strong>June 25, 2025</strong></span>
            <button style={{ padding: '8px 18px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Register Now</button>
          </div>
        )}
      </div>
    </SectionCard>
  )
}

function ReExamSection() {
  const eligible = [
    { code: 'CS6002', name: 'Operating Systems', marks: 45 },
    { code: 'CS6006', name: 'Web Technologies', marks: 38 },
  ]
  const applications = [
    { course: 'CS5001 Microprocessors', type: 'Arrear', fee: '₹500', status: 'Approved' },
  ]
  return (
    <SectionCard>
      <SectionHeader title="Re-Examination Application" />
      <div style={{ padding: 20, borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ marginBottom: 14, padding: '10px 14px', background: '#fef9c3', borderRadius: 8, fontSize: 13, color: '#854d0e', borderLeft: '3px solid #f59e0b' }}>
          Courses with marks below 50 are eligible for re-examination.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Eligible Course</label>
            <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
              <option value="">Select course...</option>
              {eligible.map(c => <option key={c.code}>{c.code} — {c.name} ({c.marks}/100)</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Exam Type</label>
            <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
              <option>Supplementary</option>
              <option>Arrear</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 14, padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: 13, color: '#166534', fontWeight: 600 }}>
          Application Fee: ₹500
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Reason for Application</label>
          <textarea rows={3} placeholder="Brief reason for re-examination..." style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, color: TEXT, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        <button style={{ padding: '8px 20px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Submit Application</button>
      </div>
      {applications.length > 0 && (
        <>
          <div style={{ padding: '12px 20px 4px', fontSize: 13, fontWeight: 700, color: TEXT }}>Existing Applications</div>
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 400 }}>
            <thead>
              <tr>{['Course', 'Exam Type', 'Fee', 'Status'].map(h => <Th key={h}>{h}</Th>)}</tr>
            </thead>
            <tbody>
              {applications.map((a, i) => (
                <tr key={i}>
                  <Td style={{ fontWeight: 600 }}>{a.course}</Td>
                  <Td>{a.type}</Td>
                  <Td>{a.fee}</Td>
                  <Td>{statusBadge(a.status)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </SectionCard>
  )
}

function CodeOfConductSection() {
  const [acknowledged, setAcknowledged] = useState(false)
  const sections = [
    {
      title: 'Before the Exam',
      rules: [
        'Arrive at the examination hall at least 15 minutes before the scheduled time.',
        'Bring your Hall Ticket and College Identity Card.',
        'Keep all electronic devices switched off before entering the hall.',
        'Occupy only the seat assigned to you by the invigilator.',
        'Do not bring any study material inside the examination hall.',
      ]
    },
    {
      title: 'During the Exam',
      rules: [
        'Write only with a black or blue ballpoint pen.',
        'Do not communicate with other candidates in any manner.',
        'Raise your hand to get the attention of the invigilator.',
        'Do not leave the hall within the first 30 minutes of the exam.',
        'Submit your answer sheet to the invigilator before leaving.',
      ]
    },
    {
      title: 'Prohibited Items',
      rules: [
        'Mobile phones, smartwatches, and electronic gadgets.',
        'Programmable calculators (unless explicitly permitted).',
        'Books, notes, or printed/handwritten materials.',
        'Bluetooth devices or earphones of any kind.',
      ]
    },
    {
      title: 'Disciplinary Actions',
      rules: [
        'Possession of prohibited items will result in cancellation of the paper.',
        'Malpractice or copying will lead to cancellation of all papers of that semester.',
        'Repeated violations may lead to suspension from examinations.',
        'Any damage to question paper, answer sheet or hall property is a punishable offence.',
      ]
    },
  ]
  return (
    <SectionCard>
      <SectionHeader title="Code of Conduct — Examination Rules & Regulations" />
      <div style={{ padding: 20 }}>
        {sections.map((sec, si) => (
          <div key={si} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT, marginBottom: 10, borderBottom: '2px solid #eef2ff', paddingBottom: 6 }}>{si + 1}. {sec.title}</div>
            <ol style={{ paddingLeft: 20, margin: 0 }}>
              {sec.rules.map((rule, ri) => (
                <li key={ri} style={{ fontSize: 13, color: TEXT, lineHeight: 1.8, marginBottom: 4 }}>{rule}</li>
              ))}
            </ol>
          </div>
        ))}
        <div style={{ marginTop: 20, padding: '16px 18px', background: acknowledged ? '#f0fdf4' : BG, border: `1px solid ${acknowledged ? '#86efac' : '#e2e8f0'}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="checkbox"
            id="ack"
            checked={acknowledged}
            onChange={e => setAcknowledged(e.target.checked)}
            style={{ width: 16, height: 16, cursor: 'pointer' }}
          />
          <label htmlFor="ack" style={{ fontSize: 13, fontWeight: 600, color: acknowledged ? '#16a34a' : TEXT, cursor: 'pointer' }}>
            I have read and understood the Code of Conduct for Examinations.
          </label>
        </div>
      </div>
    </SectionCard>
  )
}

const sectionComponents = {
  'Exam Schedule': ExamScheduleSection,
  'Marks': MarksSection,
  'Grades': GradesSection,
  'Grade History': GradeHistorySection,
  'Regular Paper See/Rev': PaperSeeRevSection,
  'Additional Learning': AdditionalLearningSection,
  'MOOC File Upload': MOOCUploadSection,
  'Project File Upload': ProjectUploadSection,
  'ECA File Upload': ECAUploadSection,
  'EPT Schedule': EPTSection,
  'Re-Exam Application': ReExamSection,
  'Code of Conduct': CodeOfConductSection,
}

export default function ExamGeneral() {
  const [active, setActive] = useState('Exam Schedule')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const ActiveSection = sectionComponents[active]

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: TEXT }}>
      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: TEXT }}>Examinations — General</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: MUTED }}>Exam schedule, marks, grades and related information</p>
      </div>

      {/* Card with left nav + content */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 500 }}>
        {/* Left nav */}
        <div style={{
          width: isMobile ? '100%' : 210,
          borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
          borderBottom: isMobile ? '1px solid #e2e8f0' : 'none',
          padding: isMobile ? '8px 4px' : '12px 0',
          flexShrink: 0,
          display: isMobile ? 'flex' : 'block',
          flexDirection: isMobile ? 'row' : undefined,
          flexWrap: isMobile ? 'wrap' : undefined,
          overflowX: isMobile ? 'auto' : undefined,
        }}>
          {navItems.map(item => {
            const isActive = active === item
            return (
              <button
                key={item}
                onClick={() => setActive(item)}
                style={{
                  display: isMobile ? 'inline-block' : 'block',
                  width: isMobile ? 'auto' : '100%',
                  textAlign: 'left',
                  padding: isMobile ? '6px 12px' : '10px 18px',
                  background: isActive ? '#eef2ff' : 'transparent',
                  color: isActive ? ACCENT : TEXT,
                  borderLeft: isMobile ? 'none' : (isActive ? `3px solid ${ACCENT}` : '3px solid transparent'),
                  borderBottom: isMobile ? (isActive ? '2px solid #6366f1' : '2px solid transparent') : 'none',
                  borderRadius: isMobile ? 100 : 0,
                  fontWeight: isActive ? 600 : 400,
                  fontSize: isMobile ? 12 : 13,
                  border: isMobile ? 'none' : undefined,
                  cursor: 'pointer',
                  lineHeight: 1.4,
                  whiteSpace: 'nowrap',
                  borderBottom: isMobile ? (isActive ? '2px solid #6366f1' : '2px solid transparent') : 'none',
                  borderLeft: isMobile ? 'none' : (isActive ? `3px solid ${ACCENT}` : '3px solid transparent'),
                }}
              >
                {item}
              </button>
            )
          })}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, padding: isMobile ? '16px' : 28, background: BG, overflowX: 'auto' }}>
          {ActiveSection ? <ActiveSection /> : null}
        </div>
      </div>
    </div>
  )
}
