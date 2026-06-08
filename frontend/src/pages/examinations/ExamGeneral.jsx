import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const navItems = [
  'Exam Schedule', 'Marks', 'Grades', 'Grade History', 'Regular Paper See/Rev',
  'Additional Learning', 'MOOC File Upload', 'Project File Upload', 'ECA File Upload',
  'EPT Schedule', 'Re-Exam Application', 'Code of Conduct'
]

const gradeColor = (g) => {
  if (g === 'O')  return { color: '#16a34a', background: '#f0fdf4' }
  if (g === 'A+') return { color: '#2563eb', background: '#eff6ff' }
  if (g === 'A')  return { color: '#0d9488', background: '#f0fdfa' }
  return { color: '#64748b', background: '#f8fafc' }
}

const statusBadge = (status) => {
  const map = {
    Verified:  { color: '#16a34a', bg: '#f0fdf4' },
    Pending:   { color: '#d97706', bg: '#fffbeb' },
    Rejected:  { color: '#dc2626', bg: '#fef2f2' },
    Applied:   { color: '#7c3aed', bg: '#f5f3ff' },
    Eligible:  { color: '#0369a1', bg: '#eff6ff' },
    Pass:      { color: '#16a34a', bg: '#f0fdf4' },
    Fail:      { color: '#dc2626', bg: '#fef2f2' },
  }
  const s = map[status] || { color: MUTED, bg: BG }
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: s.color, background: s.bg }}>
      {status}
    </span>
  )
}

function SectionCard({ children }) {
  return <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>{children}</div>
}
function SectionHeader({ title }) {
  return <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}><span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{title}</span></div>
}
function Th({ children }) {
  return <th style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #f1f5f9', background: BG, whiteSpace: 'nowrap' }}>{children}</th>
}
function Td({ children, style = {} }) {
  return <td style={{ padding: '10px 14px', color: TEXT, fontSize: 13, borderBottom: '1px solid #f8fafc', ...style }}>{children}</td>
}
function Loading() {
  return <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontSize: 14 }}>Loading…</div>
}

// ── Exam Schedule ─────────────────────────────────────────────────────────────
function ExamScheduleSection() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/examination/schedule')
      .then(r => setSchedule(r.data.data || []))
      .catch(() => toast.error('Failed to load exam schedule'))
      .finally(() => setLoading(false))
  }, [])

  const todayStr = new Date().toISOString().split('T')[0]
  const nextExam = schedule.find(e => e.examDate >= todayStr)

  return (
    <SectionCard>
      <SectionHeader title="Exam Schedule — Current Semester" />
      {loading ? <Loading /> : (
        <>
          {nextExam && (
            <div style={{ margin: '16px 20px', padding: '14px 18px', background: '#eff6ff', borderRadius: 10, borderLeft: '4px solid #3b82f6', fontSize: 13, color: '#1d4ed8' }}>
              <strong>Next Exam:</strong> {nextExam.courseName} on {nextExam.examDate} at {nextExam.timeSlot} — {nextExam.venue}
            </div>
          )}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>{['Date', 'Time', 'Course Code', 'Course Name', 'Venue', 'Exam Type'].map(h => <Th key={h}>{h}</Th>)}</tr>
              </thead>
              <tbody>
                {schedule.map((e, i) => (
                  <tr key={i} style={{ background: e.examDate === todayStr ? '#fefce8' : 'transparent' }}>
                    <Td style={e.examDate === todayStr ? { fontWeight: 700 } : {}}>{e.examDate}</Td>
                    <Td>{e.timeSlot}</Td>
                    <Td><span style={{ color: ACCENT, fontWeight: 600 }}>{e.courseCode}</span></Td>
                    <Td>{e.courseName}</Td>
                    <Td>{e.venue}</Td>
                    <Td><span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: '#f0fdf4', color: '#16a34a' }}>{e.examType}</span></Td>
                  </tr>
                ))}
                {schedule.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', color: MUTED }}>No exam schedule found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </SectionCard>
  )
}

// ── Marks ─────────────────────────────────────────────────────────────────────
function MarksSection() {
  const [marks, setMarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/examination/marks')
      .then(r => setMarks(r.data.data || []))
      .catch(() => toast.error('Failed to load marks'))
      .finally(() => setLoading(false))
  }, [])

  const rows = marks.map(r => ({
    ...r,
    total: (r.ca1 || 0) + (r.ca2 || 0) + (r.ca3 || 0) + (r.modelExam || 0) + (r.attendanceMark || 0)
  }))
  const totals = rows.map(r => r.total)
  const highest = totals.length ? Math.max(...totals) : 0
  const lowest  = totals.length ? Math.min(...totals) : 0
  const avg     = totals.length ? (totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(1) : '0'

  return (
    <SectionCard>
      <SectionHeader title="Internal Assessment Marks" />
      {loading ? <Loading /> : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>{['Course Code', 'Course Name', 'CA1 (/20)', 'CA2 (/20)', 'CA3 (/20)', 'Model (/50)', 'Attend (/5)', 'Total (/100)', 'Status'].map(h => <Th key={h}>{h}</Th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <Td><span style={{ color: ACCENT, fontWeight: 600 }}>{r.courseCode}</span></Td>
                    <Td>{r.courseName}</Td>
                    <Td style={{ textAlign: 'center' }}>{r.ca1}</Td>
                    <Td style={{ textAlign: 'center' }}>{r.ca2}</Td>
                    <Td style={{ textAlign: 'center' }}>{r.ca3}</Td>
                    <Td style={{ textAlign: 'center' }}>{r.modelExam}</Td>
                    <Td style={{ textAlign: 'center' }}>{r.attendanceMark}</Td>
                    <Td><span style={{ fontWeight: 700, color: r.total >= 50 ? '#16a34a' : '#dc2626' }}>{r.total}</span></Td>
                    <Td>{statusBadge(r.total >= 50 ? 'Pass' : 'Fail')}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > 0 && (
            <div style={{ display: 'flex', gap: 24, padding: '14px 20px', borderTop: '1px solid #f1f5f9', fontSize: 13 }}>
              {[{ label: 'Highest', val: highest, color: '#16a34a' }, { label: 'Average', val: avg, color: ACCENT }, { label: 'Lowest', val: lowest, color: '#dc2626' }].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: MUTED }}>{s.label}:</span>
                  <span style={{ fontWeight: 700, color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </SectionCard>
  )
}

// ── Grades ────────────────────────────────────────────────────────────────────
function GradesSection() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/examination/grades')
      .then(r => setData(r.data.data))
      .catch(() => toast.error('Failed to load grades'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <SectionCard><SectionHeader title="Grade Card" /><Loading /></SectionCard>
  if (!data) return null

  const { grades = [], totalCredits = 0, sgpa = 0, semester = '' } = data

  return (
    <SectionCard>
      <SectionHeader title={`Grade Card — Semester ${semester}`} />
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: 'linear-gradient(135deg, #6366f1, #818cf8)', borderRadius: 12, padding: '14px 24px', color: '#fff', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>SGPA</div>
            <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{sgpa}</div>
          </div>
          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ fontSize: 12, opacity: 0.85 }}>Semester {semester}</div>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>{['Course', 'Credits', 'Grade', 'Grade Points'].map(h => <Th key={h}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {grades.map((r, i) => (
              <tr key={i}>
                <Td>{r.courseCode} — {r.courseName}</Td>
                <Td style={{ textAlign: 'center' }}>{r.credits}</Td>
                <Td><span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 13, fontWeight: 700, ...gradeColor(r.grade) }}>{r.grade}</span></Td>
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

// ── Grade History ─────────────────────────────────────────────────────────────
function GradeHistorySection() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/examination/grade-history')
      .then(r => setData(r.data.data))
      .catch(() => toast.error('Failed to load grade history'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <SectionCard><SectionHeader title="Grade History" /><Loading /></SectionCard>
  if (!data) return null

  const { semesters = [], cgpa = 0, currentSgpa = 0 } = data
  const maxGpa = 10
  const barColors = ['#818cf8', '#6366f1', '#4f46e5', '#818cf8', '#6366f1', '#4338ca']

  return (
    <SectionCard>
      <SectionHeader title="Grade History — Semester-wise GPA" />
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 200, padding: '0 10px 0', marginBottom: 12 }}>
          {semesters.map((s, i) => {
            const heightPct = (parseFloat(s.sgpa) / maxGpa) * 100
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: barColors[i % barColors.length] }}>{s.sgpa}</span>
                <div style={{ width: '100%', height: `${heightPct * 1.7}px`, background: barColors[i % barColors.length], borderRadius: '6px 6px 0 0' }} />
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, paddingLeft: 10 }}>
          {semesters.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 12, color: MUTED, fontWeight: 600 }}>{s.sem}</div>
          ))}
        </div>
        <div style={{ marginTop: 20, padding: '12px 16px', background: BG, borderRadius: 8, display: 'inline-flex', gap: 32 }}>
          <span style={{ fontSize: 13, color: MUTED }}>CGPA: <strong style={{ color: TEXT, fontSize: 15 }}>{cgpa}</strong></span>
          <span style={{ fontSize: 13, color: MUTED }}>Current SGPA: <strong style={{ color: ACCENT, fontSize: 15 }}>{currentSgpa}</strong></span>
        </div>
      </div>
    </SectionCard>
  )
}

// ── Remaining sections (static / local state) ─────────────────────────────────
function PaperSeeRevSection() {
  const data = [
    { sem: 'Sem 4', course: 'CS4002 Algorithms', date: 'Nov 2023', marks: 52, seeFee: '₹200', revFee: '₹500', status: 'Applied' },
    { sem: 'Sem 5', course: 'CS5003 Theory of Computation', date: 'Apr 2024', marks: 61, seeFee: '₹200', revFee: '₹500', status: 'Eligible' },
  ]
  return (
    <SectionCard>
      <SectionHeader title="Regular Paper Seeing / Revaluation" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr>{['Semester', 'Course', 'Exam Date', 'Marks', 'See Fee', 'Rev Fee', 'Status', 'Action'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i}>
                <Td>{r.sem}</Td><Td>{r.course}</Td><Td>{r.date}</Td>
                <Td style={{ textAlign: 'center', fontWeight: 600 }}>{r.marks}</Td>
                <Td>{r.seeFee}</Td><Td>{r.revFee}</Td>
                <Td>{statusBadge(r.status)}</Td>
                <Td>
                  {r.status === 'Eligible'
                    ? <div style={{ display: 'flex', gap: 6 }}>
                        <button style={{ padding: '4px 10px', background: '#eff6ff', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#2563eb', fontSize: 12, fontWeight: 600 }}>See</button>
                        <button style={{ padding: '4px 10px', background: '#f5f3ff', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#7c3aed', fontSize: 12, fontWeight: 600 }}>Review</button>
                      </div>
                    : <span style={{ fontSize: 12, color: MUTED }}>Applied</span>}
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
  const data = [
    { activity: 'Python for Data Science', provider: 'NPTEL', date: '2024-04-15', credits: 2 },
    { activity: 'Cloud Computing Basics', provider: 'Coursera', date: '2024-06-20', credits: 1 },
    { activity: 'Machine Learning Fundamentals', provider: 'edX', date: '2024-09-10', credits: 2 },
  ]
  return (
    <SectionCard>
      <SectionHeader title="Additional Learning Credits" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr>{['Activity', 'Provider', 'Date Completed', 'Credits'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i}>
                <Td style={{ fontWeight: 600 }}>{r.activity}</Td>
                <Td>{r.provider}</Td><Td>{r.date}</Td>
                <Td><span style={{ padding: '2px 10px', borderRadius: 20, background: '#f0fdf4', color: '#16a34a', fontWeight: 700 }}>{r.credits}</span></Td>
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
      <div style={{ padding: 20, borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          {[['Course Name', 'text', 'e.g. Machine Learning'], ['Platform', 'text', 'e.g. Coursera, edX, NPTEL'], ['Duration', 'text', 'e.g. 8 weeks'], ['Completion Date', 'date', '']].map(([label, type, ph]) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
              <input type={type} placeholder={ph} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
        <div style={{ border: '2px dashed #e2e8f0', borderRadius: 8, padding: 20, textAlign: 'center', color: MUTED, fontSize: 13, marginBottom: 14 }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>📎</div>
          <div>Drag & drop or <span style={{ color: ACCENT, cursor: 'pointer', fontWeight: 600 }}>Browse</span></div>
          <div style={{ fontSize: 11, marginTop: 4 }}>PDF, JPG, PNG up to 5MB</div>
        </div>
        <button style={{ padding: '8px 20px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Upload Certificate</button>
      </div>
    </SectionCard>
  )
}

function ProjectUploadSection() {
  return (
    <SectionCard>
      <SectionHeader title="Project File Upload" />
      <div style={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Project Title</label><input placeholder="Enter project title" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' }} /></div>
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Document Type</label><input placeholder="e.g. Report, PPT, Code" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' }} /></div>
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Phase</label>
            <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' }}>
              {['Proposal', 'Review 1', 'Review 2', 'Final'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div style={{ border: '2px dashed #e2e8f0', borderRadius: 8, padding: 20, textAlign: 'center', color: MUTED, fontSize: 13, marginBottom: 14 }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>📁</div>
          <div>Drag & drop or <span style={{ color: ACCENT, cursor: 'pointer', fontWeight: 600 }}>Browse</span></div>
        </div>
        <button style={{ padding: '8px 20px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Upload File</button>
      </div>
    </SectionCard>
  )
}

function ECAUploadSection() {
  return (
    <SectionCard>
      <SectionHeader title="Extra Curricular Activity (ECA) File Upload" />
      <div style={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          {[['Activity Name', 'text', 'e.g. State Championship'], ['Event Date', 'date', ''], ['Achievement', 'text', 'e.g. 1st Place, Participant']].map(([label, type, ph]) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
              <input type={type} placeholder={ph} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' }} />
            </div>
          ))}
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Category</label>
            <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' }}>
              {['Sports', 'Cultural', 'Technical', 'NSS', 'NCC'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ border: '2px dashed #e2e8f0', borderRadius: 8, padding: 20, textAlign: 'center', color: MUTED, fontSize: 13, marginBottom: 14 }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>🏆</div>
          <div>Drag & drop or <span style={{ color: ACCENT, cursor: 'pointer', fontWeight: 600 }}>Browse</span></div>
        </div>
        <button style={{ padding: '8px 20px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Upload</button>
      </div>
    </SectionCard>
  )
}

function EPTSection() {
  return (
    <SectionCard>
      <SectionHeader title="English Proficiency Test (EPT) Schedule" />
      <div style={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {[['Test Date', 'July 5, 2025'], ['Time', '10:00 AM – 12:00 PM'], ['Venue', 'Computer Lab 3, Block B'], ['Registration Deadline', 'June 25, 2025']].map(([label, value]) => (
            <div key={label} style={{ background: BG, borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '14px 18px', background: '#fef9c3', border: '1px solid #fde047', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: '#854d0e' }}>You are not yet registered. Deadline: <strong>June 25, 2025</strong></span>
          <button style={{ padding: '8px 18px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Register Now</button>
        </div>
      </div>
    </SectionCard>
  )
}

function ReExamSection() {
  return (
    <SectionCard>
      <SectionHeader title="Re-Examination Application" />
      <div style={{ padding: 20 }}>
        <div style={{ marginBottom: 14, padding: '10px 14px', background: '#fef9c3', borderRadius: 8, fontSize: 13, color: '#854d0e', borderLeft: '3px solid #f59e0b' }}>
          Courses with marks below 50 are eligible for re-examination.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Eligible Course</label>
            <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' }}>
              <option>Select course...</option>
            </select>
          </div>
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Exam Type</label>
            <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, boxSizing: 'border-box' }}>
              <option>Supplementary</option><option>Arrear</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 14, padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: 13, color: '#166534', fontWeight: 600 }}>Application Fee: ₹500</div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Reason for Application</label>
          <textarea rows={3} placeholder="Brief reason for re-examination..." style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        <button style={{ padding: '8px 20px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Submit Application</button>
      </div>
    </SectionCard>
  )
}

function CodeOfConductSection() {
  const [acknowledged, setAcknowledged] = useState(false)
  const sections = [
    { title: 'Before the Exam', rules: ['Arrive at the examination hall at least 15 minutes before the scheduled time.', 'Bring your Hall Ticket and College Identity Card.', 'Keep all electronic devices switched off before entering the hall.'] },
    { title: 'During the Exam', rules: ['Write only with a black or blue ballpoint pen.', 'Do not communicate with other candidates in any manner.', 'Submit your answer sheet to the invigilator before leaving.'] },
    { title: 'Prohibited Items', rules: ['Mobile phones, smartwatches, and electronic gadgets.', 'Programmable calculators (unless explicitly permitted).', 'Books, notes, or printed/handwritten materials.'] },
    { title: 'Disciplinary Actions', rules: ['Possession of prohibited items will result in cancellation of the paper.', 'Malpractice or copying will lead to cancellation of all papers of that semester.', 'Repeated violations may lead to suspension from examinations.'] },
  ]
  return (
    <SectionCard>
      <SectionHeader title="Code of Conduct — Examination Rules" />
      <div style={{ padding: 20 }}>
        {sections.map((sec, si) => (
          <div key={si} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT, marginBottom: 10, borderBottom: '2px solid #eef2ff', paddingBottom: 6 }}>{si + 1}. {sec.title}</div>
            <ol style={{ paddingLeft: 20, margin: 0 }}>
              {sec.rules.map((rule, ri) => <li key={ri} style={{ fontSize: 13, color: TEXT, lineHeight: 1.8, marginBottom: 4 }}>{rule}</li>)}
            </ol>
          </div>
        ))}
        <div style={{ marginTop: 20, padding: '16px 18px', background: acknowledged ? '#f0fdf4' : BG, border: `1px solid ${acknowledged ? '#86efac' : '#e2e8f0'}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
          <input type="checkbox" id="ack" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
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
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: TEXT }}>Examinations — General</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: MUTED }}>Exam schedule, marks, grades and related information</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 500 }}>
        <div style={{
          width: isMobile ? '100%' : 210, borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
          borderBottom: isMobile ? '1px solid #e2e8f0' : 'none', padding: isMobile ? '8px 4px' : '12px 0',
          flexShrink: 0, display: isMobile ? 'flex' : 'block', flexWrap: isMobile ? 'wrap' : undefined,
          overflowX: isMobile ? 'auto' : undefined,
        }}>
          {navItems.map(item => {
            const isActive = active === item
            return (
              <button key={item} onClick={() => setActive(item)} style={{
                display: isMobile ? 'inline-block' : 'block', width: isMobile ? 'auto' : '100%',
                textAlign: 'left', padding: isMobile ? '6px 12px' : '10px 18px',
                background: isActive ? '#eef2ff' : 'transparent', color: isActive ? ACCENT : TEXT,
                borderLeft: isMobile ? 'none' : (isActive ? `3px solid ${ACCENT}` : '3px solid transparent'),
                borderBottom: isMobile ? (isActive ? '2px solid #6366f1' : '2px solid transparent') : 'none',
                borderRadius: isMobile ? 100 : 0, fontWeight: isActive ? 600 : 400,
                fontSize: isMobile ? 12 : 13, border: isMobile ? 'none' : undefined,
                cursor: 'pointer', lineHeight: 1.4, whiteSpace: 'nowrap',
              }}>
                {item}
              </button>
            )
          })}
        </div>
        <div style={{ flex: 1, padding: isMobile ? '16px' : 28, background: BG, overflowX: 'auto' }}>
          {ActiveSection ? <ActiveSection /> : null}
        </div>
      </div>
    </div>
  )
}
