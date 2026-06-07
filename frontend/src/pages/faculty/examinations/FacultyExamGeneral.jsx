import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['Mark Report']

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid #e2e8f0', fontSize: 14, color: TEXT,
  outline: 'none', boxSizing: 'border-box', background: '#fff',
}

const thStyle = {
  padding: '10px 14px', textAlign: 'left', fontSize: 12,
  fontWeight: 600, color: MUTED, textTransform: 'uppercase',
  borderBottom: '1px solid #e2e8f0', background: '#f8fafc',
}

const tdStyle = { padding: '12px 14px', fontSize: 14, color: TEXT, borderBottom: '1px solid #f1f5f9' }

function useFacultyCourses(userId) {
  const [courses, setCourses] = useState([])
  useEffect(() => {
    if (!userId) return
    api.get('/courses').then(r => setCourses((r.data?.data || []).filter(c => c.facultyId === userId))).catch(console.error)
  }, [userId])
  return courses
}

const generateReportData = (course, examType) => [
  { rollNo: '22BCE0001', name: 'Arun Kumar', marks: 42, max: 50, grade: 'A+', result: 'Pass' },
  { rollNo: '22BCE0011', name: 'Priya Sharma', marks: 38, max: 50, grade: 'A', result: 'Pass' },
  { rollNo: '22BCE0023', name: 'Karthik Rajan', marks: 31, max: 50, grade: 'B+', result: 'Pass' },
  { rollNo: '22BCE0034', name: 'Meena Devi', marks: 24, max: 50, grade: 'B', result: 'Pass' },
  { rollNo: '22BCE0042', name: 'Suresh Kumar', marks: 18, max: 50, grade: 'U', result: 'Fail' },
  { rollNo: '22BCE0055', name: 'Anjali Nair', marks: 45, max: 50, grade: 'O', result: 'Pass' },
  { rollNo: '22BCE0067', name: 'Rahul Singh', marks: 27, max: 50, grade: 'B', result: 'Pass' },
  { rollNo: '22BCE0079', name: 'Divya Krishnan', marks: 19, max: 50, grade: 'U', result: 'Fail' },
]

// ─── Mark Distribution (CSS bar chart) ────────────────────────────────────────
function MarkDistributionChart({ data }) {
  const brackets = ['0-10', '11-20', '21-30', '31-40', '41-50']
  const counts = brackets.map((b, idx) => {
    const [lo, hi] = b.split('-').map(Number)
    return data.filter(r => r.marks >= lo && r.marks <= hi).length
  })
  const maxCount = Math.max(...counts, 1)

  return (
    <div style={{ ...card, padding: 24 }}>
      <h4 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 700, color: TEXT }}>Mark Distribution</h4>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 140 }}>
        {brackets.map((b, i) => (
          <div key={b} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>{counts[i]}</span>
            <div style={{
              width: '100%', background: ACCENT, borderRadius: '6px 6px 0 0',
              height: `${(counts[i] / maxCount) * 100}px`, opacity: 0.8, minHeight: counts[i] > 0 ? 4 : 0,
              transition: 'height 0.4s',
            }} />
            <span style={{ fontSize: 11, color: MUTED }}>{b}</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: MUTED }}>Marks Range</div>
    </div>
  )
}

// ─── Mark Report Section ───────────────────────────────────────────────────────
function MarkReportSection({ courses }) {
  const [filters, setFilters] = useState({
    courseId: '',
    examType: 'CA1',
    academicYear: '2024-25',
    semester: 'Semester 6',
  })
  const [reportGenerated, setReportGenerated] = useState(false)
  const [reportData, setReportData] = useState([])

  useEffect(() => { if (courses.length && !filters.courseId) setFilters(p => ({ ...p, courseId: courses[0].id })) }, [courses])

  const handleGenerate = () => {
    setReportData(generateReportData(filters.courseId, filters.examType))
    setReportGenerated(true)
  }

  const passCount = reportData.filter(r => r.result === 'Pass').length
  const failCount = reportData.filter(r => r.result === 'Fail').length
  const avg = reportData.length ? (reportData.reduce((s, r) => s + r.marks, 0) / reportData.length).toFixed(1) : 0
  const highest = reportData.length ? Math.max(...reportData.map(r => r.marks)) : 0
  const lowest = reportData.length ? Math.min(...reportData.map(r => r.marks)) : 0
  const passPct = reportData.length ? ((passCount / reportData.length) * 100).toFixed(0) : 0
  const failPct = reportData.length ? ((failCount / reportData.length) * 100).toFixed(0) : 0

  return (
    <div>
      {/* Filters */}
      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Generate Mark Report</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Course *</label>
            <select style={inputStyle} value={filters.courseId} onChange={e => setFilters(p => ({ ...p, courseId: e.target.value }))}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Exam Type *</label>
            <select style={inputStyle} value={filters.examType} onChange={e => setFilters(p => ({ ...p, examType: e.target.value }))}>
              {['CA1', 'CA2', 'CA3', 'Model', 'End Sem'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Academic Year *</label>
            <select style={inputStyle} value={filters.academicYear} onChange={e => setFilters(p => ({ ...p, academicYear: e.target.value }))}>
              {['2024-25', '2023-24', '2022-23'].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Semester *</label>
            <select style={inputStyle} value={filters.semester} onChange={e => setFilters(p => ({ ...p, semester: e.target.value }))}>
              {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleGenerate} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Generate Report
        </button>
      </div>

      {reportGenerated && (
        <>
          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { label: 'Class Average', value: `${avg} / ${reportData[0]?.max}`, color: ACCENT },
              { label: 'Highest', value: highest, color: '#16a34a' },
              { label: 'Lowest', value: lowest, color: '#dc2626' },
              { label: 'Pass %', value: `${passPct}%`, color: '#0284c7' },
              { label: 'Fail %', value: `${failPct}%`, color: '#d97706' },
            ].map((s, i) => (
              <div key={i} style={{ ...card, padding: 18, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: MUTED }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Report Table */}
          <div style={{ ...card, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: TEXT }}>
                {courses.find(c => c.id === filters.courseId)?.code ?? '—'} — {filters.examType} — {filters.semester} · {filters.academicYear}
              </span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ background: '#f8fafc', color: TEXT, border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Download PDF
                </button>
                <button style={{ background: '#f8fafc', color: TEXT, border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Download Excel
                </button>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>{['Roll No', 'Student Name', `Marks / ${reportData[0]?.max}`, 'Grade', 'Result'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {reportData.map((r, i) => (
                  <tr key={i}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.rollNo}</td>
                    <td style={tdStyle}>{r.name}</td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{r.marks}</td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 700, color: r.grade === 'O' ? '#16a34a' : r.grade === 'U' ? '#dc2626' : TEXT }}>{r.grade}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: r.result === 'Pass' ? '#dcfce7' : '#fee2e2', color: r.result === 'Pass' ? '#16a34a' : '#dc2626' }}>
                        {r.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bar Chart */}
          <MarkDistributionChart data={reportData} />
        </>
      )}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyExamGeneral() {
  const { user } = useAuth()
  const courses = useFacultyCourses(user?.userId)
  const [activeNav, setActiveNav] = useState('Mark Report')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Examinations — General</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Mark reports and examination overview</p>
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
          {activeNav === 'Mark Report' && <MarkReportSection courses={courses} />}
        </div>
      </div>
    </div>
  )
}
