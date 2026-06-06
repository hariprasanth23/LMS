import React, { useState, useEffect } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const ITEMS = ['Course Page', 'Course Material Upload', 'Course Syllabus', 'Course Page View', 'Minor / Honour']

// ─── Course Page ──────────────────────────────────────────────────────────────
function CoursePage() {
  const courses = [
    { code: 'CS6001', name: 'Data Warehousing', section: 'III-CSE-A', enrolled: 62, attendance: 87, avgMarks: 72, color: '#6366f1', bg: '#eef2ff' },
    { code: 'CS6002', name: 'Compiler Design', section: 'III-CSE-B', enrolled: 60, attendance: 83, avgMarks: 68, color: '#0891b2', bg: '#e0f2fe' },
    { code: 'CS6003', name: 'Cloud Computing', section: 'III-CSE-A', enrolled: 62, attendance: 79, avgMarks: 74, color: '#7c3aed', bg: '#ede9fe' },
    { code: 'CS6004', name: 'Cryptography & Security', section: 'III-CSE-A', enrolled: 58, attendance: 91, avgMarks: 78, color: '#059669', bg: '#d1fae5' },
  ]

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 16 }}>My Courses — Current Semester</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {courses.map((c, i) => (
          <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: c.color, fontFamily: 'system-ui' }}>{c.code.slice(-2)}</div>
              <span style={{ background: c.bg, color: c.color, fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700, fontFamily: 'system-ui' }}>{c.section}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 2 }}>{c.code}</div>
            <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui', marginBottom: 14 }}>{c.name}</div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, fontFamily: 'system-ui' }}>{c.enrolled}</div>
                <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>Enrolled</div>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: c.attendance >= 80 ? '#15803d' : '#b45309', fontFamily: 'system-ui' }}>{c.attendance}%</div>
                <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>Attendance</div>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: c.color, fontFamily: 'system-ui' }}>{c.avgMarks}</div>
                <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>Avg Marks</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['Marks', 'Attendance', 'Materials'].map(label => (
                <button key={label} style={{ flex: 1, background: c.bg, color: c.color, border: 'none', borderRadius: 7, padding: '5px 0', fontSize: 11, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>{label}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Course Material Upload ────────────────────────────────────────────────────
function CourseMaterialUpload() {
  const [course, setCourse] = useState('')
  const [unit, setUnit] = useState('')
  const [matType, setMatType] = useState('Lecture Notes')

  const materials = [
    { course: 'CS6001', unit: 'Unit 1', type: 'Lecture Notes', name: 'DW_Unit1_Intro.pdf', uploaded: 'May 10, 2025', downloads: 54 },
    { course: 'CS6001', unit: 'Unit 2', type: 'Reference', name: 'DW_Unit2_ODS.pdf', uploaded: 'May 18, 2025', downloads: 48 },
    { course: 'CS6002', unit: 'Unit 1', type: 'Lecture Notes', name: 'CD_Unit1_Lexical.pptx', uploaded: 'May 12, 2025', downloads: 58 },
    { course: 'CS6002', unit: 'Unit 3', type: 'Lab Manual', name: 'CD_Lab_Manual.pdf', uploaded: 'May 22, 2025', downloads: 60 },
    { course: 'CS6003', unit: 'Unit 2', type: 'Video Link', name: 'AWS EC2 — Setup Tutorial', uploaded: 'May 25, 2025', downloads: 45 },
    { course: 'CS6004', unit: 'Unit 1', type: 'Assignment', name: 'RSA_Assignment2.docx', uploaded: 'Jun 1, 2025', downloads: 52 },
  ]

  const typeColor = {
    'Lecture Notes': ['#eef2ff', ACCENT],
    'Video Link': ['#fce7f3', '#be185d'],
    'Reference': ['#e0f2fe', '#0891b2'],
    'Assignment': ['#fef3c7', '#b45309'],
    'Lab Manual': ['#d1fae5', '#059669'],
  }

  return (
    <div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>Upload Material</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
          {[
            ['Course', 'course', 'select', ['CS6001 — Data Warehousing', 'CS6002 — Compiler Design', 'CS6003 — Cloud Computing', 'CS6004 — Cryptography']],
            ['Chapter / Unit', 'unit', 'select', ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5']],
            ['Material Type', 'matType', 'select', ['Lecture Notes', 'Video Link', 'Reference', 'Assignment', 'Lab Manual']],
          ].map(([label, key, , opts]) => (
            <div key={key}>
              <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>{label}</label>
              <select value={key === 'course' ? course : key === 'unit' ? unit : matType} onChange={e => key === 'course' ? setCourse(e.target.value) : key === 'unit' ? setUnit(e.target.value) : setMatType(e.target.value)} style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui' }}>
                <option value="">Select...</option>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Description</label>
            <input placeholder="Brief description..." style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 6 }}>File Upload</label>
          <div style={{ border: '2px dashed #c7d2fe', borderRadius: 8, padding: '24px', textAlign: 'center', background: '#fafbff', cursor: 'pointer' }}>
            <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>Drop file here or <span style={{ color: ACCENT, fontWeight: 600 }}>browse</span></div>
            <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui', marginTop: 4 }}>PDF, PPT, DOCX — max 20 MB</div>
          </div>
        </div>
        <button style={{ marginTop: 14, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Upload Material</button>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 10 }}>Uploaded Materials</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 600 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Course', 'Unit', 'Type', 'File Name', 'Uploaded', 'Downloads', 'Actions'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materials.map((m, i) => {
              const [tbg, tcl] = typeColor[m.type] || ['#f1f5f9', MUTED]
              return (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{m.course}</td>
                  <td style={{ padding: '9px 10px', color: MUTED }}>{m.unit}</td>
                  <td style={{ padding: '9px 10px' }}><span style={{ background: tbg, color: tcl, fontSize: 11, borderRadius: 7, padding: '2px 7px', fontWeight: 700 }}>{m.type}</span></td>
                  <td style={{ padding: '9px 10px', color: TEXT, fontSize: 12 }}>{m.name}</td>
                  <td style={{ padding: '9px 10px', color: MUTED, fontSize: 12 }}>{m.uploaded}</td>
                  <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 600, textAlign: 'center' }}>{m.downloads}</td>
                  <td style={{ padding: '9px 10px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>View</button>
                      <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Course Syllabus ──────────────────────────────────────────────────────────
function CourseSyllabus() {
  const [selectedCourse, setSelectedCourse] = useState('CS6001')
  const [coverage, setCoverage] = useState({ 'Unit 1': 100, 'Unit 2': 100, 'Unit 3': 80, 'Unit 4': 40, 'Unit 5': 0 })

  const courses = ['CS6001 — Data Warehousing', 'CS6002 — Compiler Design', 'CS6003 — Cloud Computing', 'CS6004 — Cryptography & Security']
  const units = Object.keys(coverage)

  const barColor = (pct) => pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : pct > 0 ? '#6366f1' : '#e2e8f0'

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ flex: '1 1 260px' }}>
          <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Select Course</label>
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value.split(' ')[0])} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', width: '100%' }}>
            {courses.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 200px', border: '2px dashed #c7d2fe', borderRadius: 8, padding: '12px 16px', background: '#fafbff', textAlign: 'center', cursor: 'pointer' }}>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>Upload new syllabus version</div>
          <div style={{ fontSize: 11, color: ACCENT, fontFamily: 'system-ui', fontWeight: 600, marginTop: 3 }}>Browse PDF</div>
        </div>
      </div>

      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '18px 20px', background: '#fafafa', marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui', marginBottom: 6 }}>Current Syllabus — {selectedCourse}</div>
        <div style={{ width: '100%', height: 140, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>📄</div>
            <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Syllabus PDF Viewer</div>
            <button style={{ marginTop: 8, background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '6px 16px', fontSize: 12, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Open PDF</button>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>Syllabus Coverage Tracker</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {units.map(unit => (
          <div key={unit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: 'system-ui' }}>{unit}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="number" min={0} max={100} value={coverage[unit]}
                  onChange={e => setCoverage(prev => ({ ...prev, [unit]: Math.min(100, Math.max(0, Number(e.target.value))) }))}
                  style={{ width: 56, padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, fontFamily: 'system-ui', textAlign: 'center' }}
                />
                <span style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>%</span>
              </div>
            </div>
            <div style={{ height: 10, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ width: `${coverage[unit]}%`, height: '100%', background: barColor(coverage[unit]), borderRadius: 10, transition: 'width 0.3s' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: MUTED, fontFamily: 'system-ui', background: '#f8fafc', borderRadius: 8, padding: '8px 14px' }}>
        Overall coverage: <strong style={{ color: ACCENT }}>{Math.round(Object.values(coverage).reduce((a, b) => a + b, 0) / units.length)}%</strong>
      </div>
    </div>
  )
}

// ─── Course Page View (Preview Mode) ─────────────────────────────────────────
function CoursePageView() {
  const [tab, setTab] = useState('materials')
  const tabs = ['materials', 'announcements', 'assignments']

  const materials = [
    { unit: 'Unit 1', name: 'Introduction to Data Warehousing', type: 'Lecture Notes', date: 'May 10' },
    { unit: 'Unit 2', name: 'Operational Data Store', type: 'Reference', date: 'May 18' },
    { unit: 'Unit 3', name: 'ETL Process Video', type: 'Video Link', date: 'May 25' },
  ]

  const announcements = [
    { title: 'CA3 Syllabus Update', body: 'Unit 4 included in CA3. Topics: OLAP, Data Mining basics.', date: 'Jun 1, 2025' },
    { title: 'Lab Session — Rescheduled', body: 'This week\'s lab is moved to Friday 2–4 PM. Please note.', date: 'May 30, 2025' },
  ]

  const assignments = [
    { title: 'Unit 2 — SQL Warehouse Queries', due: 'Jun 8, 2025', status: 'Open' },
    { title: 'ETL Pipeline Design Report', due: 'Jun 15, 2025', status: 'Open' },
  ]

  return (
    <div>
      <div style={{ background: '#eef2ff', borderRadius: 10, padding: '14px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: ACCENT, fontFamily: 'system-ui' }}>CS6001 — Data Warehousing</div>
            <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui', marginTop: 2 }}>III-CSE-A · 62 Students</div>
          </div>
          <span style={{ background: '#fff', color: MUTED, fontSize: 11, borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontFamily: 'system-ui' }}>Preview Mode (Read-only)</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #e2e8f0', marginBottom: 20 }}>
        {tabs.map(t => (
          <div key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', cursor: 'pointer', fontSize: 13, fontFamily: 'system-ui', textTransform: 'capitalize', color: tab === t ? ACCENT : MUTED, fontWeight: tab === t ? 700 : 400, borderBottom: tab === t ? '2px solid #6366f1' : '2px solid transparent', marginBottom: -2 }}>{t}</div>
        ))}
      </div>

      {tab === 'materials' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {materials.map((m, i) => (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 9, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📄</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>{m.name}</div>
                <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>{m.unit} · {m.type} · {m.date}</div>
              </div>
              <button disabled style={{ background: '#f1f5f9', color: MUTED, border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 11, fontFamily: 'system-ui', cursor: 'not-allowed' }}>Download</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {announcements.map((a, i) => (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 9, padding: '14px 16px', borderLeft: `4px solid ${ACCENT}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>{a.title}</div>
              <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', marginTop: 2 }}>{a.date}</div>
              <div style={{ fontSize: 13, color: TEXT, fontFamily: 'system-ui', marginTop: 8, lineHeight: 1.5 }}>{a.body}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {assignments.map((a, i) => (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 9, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>{a.title}</div>
                <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', marginTop: 2 }}>Due: {a.due}</div>
              </div>
              <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700, fontFamily: 'system-ui' }}>{a.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Minor / Honour ───────────────────────────────────────────────────────────
function MinorHonour() {
  const [filterMinor, setFilterMinor] = useState('')

  const minorCourses = ['Data Science', 'Cyber Security', 'Full Stack Development']

  const students = [
    { name: 'Arun S.', rollNo: '21CS001', dept: 'CSE', minor: 'Data Science', course: 'DS6001 — Python for Data Science', progress: 85 },
    { name: 'Bharathi K.', rollNo: '21CS002', dept: 'IT', minor: 'Data Science', course: 'DS6001 — Python for Data Science', progress: 78 },
    { name: 'Divya R.', rollNo: '21CS003', dept: 'ECE', minor: 'Cyber Security', course: 'CS6010 — Network Security', progress: 90 },
    { name: 'Karthik M.', rollNo: '21CS004', dept: 'EEE', minor: 'Full Stack Development', course: 'FS6001 — React & Node.js', progress: 65 },
    { name: 'Meenakshi V.', rollNo: '21CS005', dept: 'MECH', minor: 'Data Science', course: 'DS6001 — Python for Data Science', progress: 92 },
    { name: 'Naveen P.', rollNo: '21CS006', dept: 'CIVIL', minor: 'Full Stack Development', course: 'FS6001 — React & Node.js', progress: 55 },
  ]

  const filtered = filterMinor ? students.filter(s => s.minor === filterMinor) : students
  const barColor = (p) => p >= 80 ? '#22c55e' : p >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <label style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Filter by Minor Programme:</label>
        <select value={filterMinor} onChange={e => setFilterMinor(e.target.value)} style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui' }}>
          <option value="">All</option>
          {minorCourses.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {minorCourses.map(mc => {
          const count = students.filter(s => s.minor === mc).length
          return (
            <div key={mc} style={{ flex: '1 1 130px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 9, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: ACCENT, fontFamily: 'system-ui' }}>{count}</div>
              <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>{mc}</div>
            </div>
          )
        })}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 600 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Roll No', 'Student', 'Dept', 'Minor Programme', 'Course', 'Progress'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{s.rollNo}</td>
                <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 600 }}>{s.name}</td>
                <td style={{ padding: '9px 10px', color: MUTED }}>{s.dept}</td>
                <td style={{ padding: '9px 10px' }}><span style={{ background: '#eef2ff', color: ACCENT, fontSize: 11, borderRadius: 7, padding: '2px 8px', fontWeight: 700 }}>{s.minor}</span></td>
                <td style={{ padding: '9px 10px', color: TEXT, fontSize: 12 }}>{s.course}</td>
                <td style={{ padding: '9px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${s.progress}%`, height: '100%', background: barColor(s.progress), borderRadius: 6 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, width: 36 }}>{s.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const CONTENT_MAP = [CoursePage, CourseMaterialUpload, CourseSyllabus, CoursePageView, MinorHonour]

export default function FacultyCourse() {
  const [active, setActive] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  const ActiveComponent = CONTENT_MAP[active]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100%', padding: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? 18 : 22, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>Academics — Course</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Course pages, materials, syllabus and minor/honour programmes</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 520 }}>
        <div style={isMobile ? {
          borderBottom: '1px solid #e2e8f0', padding: '8px 12px',
          display: 'flex', overflowX: 'auto', gap: 8, flexShrink: 0,
        } : {
          width: 210, borderRight: '1px solid #e2e8f0', padding: '12px 0', flexShrink: 0,
        }}>
          {ITEMS.map((item, i) => (
            isMobile ? (
              <div key={i} onClick={() => setActive(i)} style={{
                padding: '6px 14px', cursor: 'pointer', fontSize: 12,
                fontFamily: 'system-ui', color: active === i ? ACCENT : '#475569',
                background: active === i ? '#eef2ff' : '#f1f5f9',
                border: active === i ? '1.5px solid #6366f1' : '1.5px solid transparent',
                borderRadius: 20, fontWeight: active === i ? 600 : 400,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>{item}</div>
            ) : (
              <div key={i} onClick={() => setActive(i)} style={{
                padding: '9px 16px', cursor: 'pointer', fontSize: 13,
                fontFamily: 'system-ui', color: active === i ? ACCENT : '#475569',
                background: active === i ? '#eef2ff' : 'transparent',
                borderLeft: active === i ? '3px solid #6366f1' : '3px solid transparent',
                fontWeight: active === i ? 600 : 400
              }}>{item}</div>
            )
          ))}
        </div>
        <div style={{ flex: 1, padding: isMobile ? 14 : 28, overflowY: 'auto' }}>
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}
