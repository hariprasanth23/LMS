import React, { useState, useEffect } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const ITEMS = [
  'My Curriculum', 'HOD and Dean Info', 'Faculty Info', 'Biometric Info', 'Biometric Search', 'Class Messages',
  'Regulation', 'Minor / Honour', 'Time Table', 'Class Attendance', 'Course Page Consolidated',
  'Digital Assignment Upload', 'QCM View', 'Outcome SET Conference', 'Co-Extra Curricular',
  'Academics Calendar', 'Course Registration Allocation', 'Project Course', 'Project Mark View',
  'Apaar ID Upload'
]

const gradeBadge = (grade) => {
  const map = { O: ['#dcfce7', '#15803d'], 'A+': ['#dbeafe', '#1d4ed8'], A: ['#ccfbf1', '#0f766e'], 'B+': ['#f1f5f9', '#475569'], B: ['#fef9c3', '#854d0e'] }
  const [bg, color] = map[grade] || ['#f1f5f9', '#475569']
  return (
    <span style={{ background: bg, color, borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700, fontFamily: 'system-ui' }}>{grade}</span>
  )
}

const semData = [
  { sem: 1, courses: [{ code: 'MA3151', name: 'Matrices & Calculus', credits: 4, grade: 'O' }, { code: 'PH3151', name: 'Engineering Physics', credits: 4, grade: 'A+' }, { code: 'CY3151', name: 'Engineering Chemistry', credits: 4, grade: 'A' }, { code: 'CS3251', name: 'Programming in C', credits: 3, grade: 'O' }, { code: 'GE3151', name: 'Problem Solving', credits: 3, grade: 'A+' }, { code: 'CS3211', name: 'Programming Lab', credits: 2, grade: 'O' }] },
  { sem: 2, courses: [{ code: 'MA3251', name: 'Statistics & Numerical Methods', credits: 4, grade: 'A+' }, { code: 'PH3256', name: 'Physics for IT', credits: 4, grade: 'A' }, { code: 'BE3251', name: 'Basic Electrical Engineering', credits: 3, grade: 'B+' }, { code: 'CS3291', name: 'Data Structures', credits: 4, grade: 'O' }, { code: 'CS3281', name: 'Data Structures Lab', credits: 2, grade: 'A+' }, { code: 'HS3251', name: 'Technical English', credits: 2, grade: 'A' }] },
  { sem: 3, courses: [{ code: 'MA3354', name: 'Discrete Mathematics', credits: 4, grade: 'A+' }, { code: 'CS3351', name: 'Digital Principles', credits: 4, grade: 'A' }, { code: 'CS3391', name: 'Object Oriented Programming', credits: 3, grade: 'O' }, { code: 'CS3401', name: 'Algorithms', credits: 4, grade: 'A+' }, { code: 'CS3381', name: 'OOP Lab', credits: 2, grade: 'O' }, { code: 'CS3371', name: 'Algorithms Lab', credits: 2, grade: 'A+' }] },
  { sem: 4, courses: [{ code: 'MA4491', name: 'Probability & Random Processes', credits: 4, grade: 'A' }, { code: 'CS3491', name: 'AI & Machine Learning', credits: 4, grade: 'O' }, { code: 'CS3492', name: 'Database Management Systems', credits: 4, grade: 'A+' }, { code: 'CS3451', name: 'Introduction to OS', credits: 4, grade: 'A' }, { code: 'CS3481', name: 'DBMS Lab', credits: 2, grade: 'A+' }, { code: 'CS3461', name: 'OS Lab', credits: 2, grade: 'A' }] },
  { sem: 5, courses: [{ code: 'CS3591', name: 'Computer Networks', credits: 4, grade: 'B+' }, { code: 'CS3501', name: 'Theory of Computation', credits: 4, grade: 'A' }, { code: 'CS3551', name: 'Distributed Computing', credits: 4, grade: 'A+' }, { code: 'CS3571', name: 'Software Engineering', credits: 3, grade: 'A' }, { code: 'CS3581', name: 'Networks Lab', credits: 2, grade: 'A+' }, { code: 'CS3561', name: 'Mini Project', credits: 2, grade: 'O' }] },
  { sem: 6, courses: [{ code: 'CS6001', name: 'Data Warehousing', credits: 4, grade: '-' }, { code: 'CS6002', name: 'Compiler Design', credits: 4, grade: '-' }, { code: 'CS6003', name: 'Cloud Computing', credits: 4, grade: '-' }, { code: 'CS6004', name: 'Cryptography & Security', credits: 3, grade: '-' }, { code: 'CS6081', name: 'Project Phase I', credits: 4, grade: '-' }] }
]

function MyCurriculum() {
  return (
    <div>
      <div style={{ background: '#eef2ff', borderRadius: 8, padding: '10px 16px', marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: ACCENT, fontFamily: 'system-ui' }}>B.E. Computer Science & Engineering | Regulation 2021</span>
        <div style={{ background: '#fff', borderRadius: 8, padding: '6px 14px', border: '1.5px solid #6366f1', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>CGPA</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: ACCENT, fontFamily: 'system-ui' }}>8.74</div>
        </div>
      </div>
      {semData.map(s => (
        <div key={s.sem} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: s.sem === 6 ? ACCENT : TEXT, fontFamily: 'system-ui', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            Semester {s.sem}
            {s.sem === 6 && <span style={{ background: '#eef2ff', color: ACCENT, fontSize: 11, borderRadius: 10, padding: '1px 8px', fontWeight: 600 }}>Current</span>}
          </div>
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 600 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Course Code', 'Course Name', 'Credits', 'Grade'].map(h => (
                  <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.courses.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '7px 10px', color: ACCENT, fontWeight: 600 }}>{c.code}</td>
                  <td style={{ padding: '7px 10px', color: TEXT }}>{c.name}</td>
                  <td style={{ padding: '7px 10px', color: MUTED, textAlign: 'center' }}>{c.credits}</td>
                  <td style={{ padding: '7px 10px', textAlign: 'center' }}>{c.grade === '-' ? <span style={{ color: MUTED }}>—</span> : gradeBadge(c.grade)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ))}
    </div>
  )
}

function HODDeanInfo() {
  const cards = [
    { name: 'Dr. R. Sundaramurthy', role: 'Head of Department', dept: 'Computer Science & Engineering', qual: 'Ph.D (IIT Madras)', email: 'sundaramurthy@college.edu', phone: '+91 98765 43210', initials: 'RS', color: '#6366f1', bg: '#eef2ff', chip: 'HOD' },
    { name: 'Dr. P. Kavitha', role: 'Dean of Academic Affairs', dept: 'Anna University', qual: 'Ph.D (Anna University)', email: 'dean.academics@college.edu', phone: '+91 98456 12300', initials: 'PK', color: '#0891b2', bg: '#e0f2fe', chip: 'Dean' }
  ]
  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      {cards.map((c, i) => (
        <div key={i} style={{ flex: '1 1 260px', border: '1px solid #e2e8f0', borderRadius: 12, padding: 22, background: '#fafafa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 54, height: 54, borderRadius: '50%', background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, fontFamily: 'system-ui', flexShrink: 0 }}>{c.initials}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>{c.name}</div>
              <span style={{ background: c.bg, color: c.color, fontSize: 11, borderRadius: 10, padding: '2px 10px', fontWeight: 600, fontFamily: 'system-ui' }}>{c.chip}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['Role', c.role], ['Department', c.dept], ['Qualification', c.qual], ['Email', c.email], ['Phone', c.phone]].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', gap: 8, fontSize: 13, fontFamily: 'system-ui' }}>
                <span style={{ color: MUTED, width: 110, flexShrink: 0 }}>{label}</span>
                <span style={{ color: TEXT, fontWeight: 500 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function FacultyInfo() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const ff = 'system-ui, -apple-system, sans-serif'

  const faculty = [
    {
      sno: 1, name: 'Dr. R. Sundaramurthy', initials: 'RS', avatarColor: '#6366f1', avatarBg: '#eef2ff',
      designation: 'Professor & HOD', department: 'Computer Science & Engineering',
      subjects: ['Theory of Computation', 'Formal Languages & Automata'],
      cabin: 'CSE-101', email: 'sundaramurthy@college.edu', phone: '+91 98400 11001',
      experience: '22 years', qualification: 'Ph.D – IIT Madras, M.E – Anna University',
      officeHours: [
        { day: 'Monday',    time: '10:00 AM – 12:00 PM' },
        { day: 'Wednesday', time: '2:00 PM – 4:00 PM'   },
        { day: 'Friday',    time: '10:00 AM – 11:00 AM' },
      ],
      researchAreas: ['Automata Theory', 'Compiler Design', 'Formal Methods'],
      publications: 28, projects: 4,
    },
    {
      sno: 2, name: 'Dr. A. Meenakshi', initials: 'AM', avatarColor: '#059669', avatarBg: '#d1fae5',
      designation: 'Associate Professor', department: 'Computer Science & Engineering',
      subjects: ['Data Structures & Algorithms', 'Design & Analysis of Algorithms'],
      cabin: 'CSE-104', email: 'meenakshi.a@college.edu', phone: '+91 98400 11002',
      experience: '14 years', qualification: 'Ph.D – Anna University, B.E – PSG Tech',
      officeHours: [
        { day: 'Tuesday',  time: '9:00 AM – 11:00 AM' },
        { day: 'Thursday', time: '3:00 PM – 5:00 PM'  },
      ],
      researchAreas: ['Graph Algorithms', 'Optimization', 'Computational Complexity'],
      publications: 17, projects: 2,
    },
    {
      sno: 3, name: 'Mr. K. Vignesh', initials: 'KV', avatarColor: '#0891b2', avatarBg: '#e0f2fe',
      designation: 'Assistant Professor', department: 'Computer Science & Engineering',
      subjects: ['Database Management Systems', 'Big Data Analytics'],
      cabin: 'CSE-107', email: 'vignesh.k@college.edu', phone: '+91 98400 11003',
      experience: '8 years', qualification: 'M.E – NIT Trichy, B.E – CEG Anna University',
      officeHours: [
        { day: 'Monday',   time: '2:00 PM – 4:00 PM'   },
        { day: 'Thursday', time: '10:00 AM – 12:00 PM' },
      ],
      researchAreas: ['NoSQL Databases', 'Data Mining', 'Cloud Data Management'],
      publications: 9, projects: 1,
    },
    {
      sno: 4, name: 'Dr. S. Priya', initials: 'SP', avatarColor: '#7c3aed', avatarBg: '#ede9fe',
      designation: 'Associate Professor', department: 'Computer Science & Engineering',
      subjects: ['Machine Learning', 'Deep Learning', 'Cloud Computing'],
      cabin: 'CSE-109', email: 'priya.s@college.edu', phone: '+91 98400 11004',
      experience: '12 years', qualification: 'Ph.D – IIT Bombay, M.Tech – BITS Pilani',
      officeHours: [
        { day: 'Monday',   time: '11:00 AM – 1:00 PM' },
        { day: 'Friday',   time: '2:00 PM – 4:00 PM'  },
      ],
      researchAreas: ['Deep Neural Networks', 'Computer Vision', 'NLP'],
      publications: 21, projects: 5,
    },
    {
      sno: 5, name: 'Mr. T. Arun Kumar', initials: 'TA', avatarColor: '#b45309', avatarBg: '#fef3c7',
      designation: 'Assistant Professor', department: 'Computer Science & Engineering',
      subjects: ['Computer Networks', 'Cryptography & Network Security'],
      cabin: 'CSE-112', email: 'arunkumar.t@college.edu', phone: '+91 98400 11005',
      experience: '6 years', qualification: 'M.E – Anna University, B.E – SRM University',
      officeHours: [
        { day: 'Wednesday', time: '10:00 AM – 12:00 PM' },
        { day: 'Friday',    time: '3:00 PM – 5:00 PM'   },
      ],
      researchAreas: ['Network Security', 'IoT', 'Wireless Networks'],
      publications: 6, projects: 1,
    },
    {
      sno: 6, name: 'Ms. R. Divya', initials: 'RD', avatarColor: '#db2777', avatarBg: '#fce7f3',
      designation: 'Assistant Professor', department: 'Computer Science & Engineering',
      subjects: ['Software Engineering', 'Agile Development'],
      cabin: 'CSE-115', email: 'divya.r@college.edu', phone: '+91 98400 11006',
      experience: '5 years', qualification: 'M.E – Sathyabama University, B.E – Saveetha Engineering',
      officeHours: [
        { day: 'Tuesday',  time: '11:00 AM – 1:00 PM' },
        { day: 'Thursday', time: '2:00 PM – 4:00 PM'  },
      ],
      researchAreas: ['Software Testing', 'DevOps', 'Agile Methodologies'],
      publications: 5, projects: 1,
    },
  ]

  const filtered = faculty.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.subjects.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
    f.designation.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ fontFamily: ff }}>
      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94a3b8' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, subject or designation…"
          style={{
            width: '100%', padding: '10px 14px 10px 38px',
            border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13,
            fontFamily: ff, outline: 'none', boxSizing: 'border-box',
            background: '#f8fafc', transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = ACCENT}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 16 }}>×</button>
        )}
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 12, fontFamily: ff }}>
        {filtered.length} faculty member{filtered.length !== 1 ? 's' : ''} found
      </div>

      {/* Faculty cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: MUTED, fontSize: 14, fontFamily: ff }}>
            No faculty found matching "{search}"
          </div>
        ) : filtered.map((f) => (
          <div key={f.sno} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 16px',
            background: '#fff', transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none' }}
          >
            {/* Avatar */}
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: f.avatarBg,
              color: f.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 800, flexShrink: 0, fontFamily: ff,
              border: `2px solid ${f.avatarColor}30`,
            }}>
              {f.initials}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: ff, marginBottom: 2 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: f.avatarColor, fontWeight: 600, fontFamily: ff, marginBottom: 4 }}>{f.designation}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {f.subjects.slice(0, 2).map(s => (
                  <span key={s} style={{ background: '#f1f5f9', color: MUTED, fontSize: 11, borderRadius: 6, padding: '2px 8px', fontFamily: ff }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Cabin + View */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: ACCENT, fontWeight: 600, fontFamily: ff }}>📍 {f.cabin}</span>
              <button
                onClick={() => setSelected(f)}
                style={{
                  background: ACCENT, color: '#fff', border: 'none', borderRadius: 8,
                  padding: '6px 16px', fontSize: 12, fontWeight: 700, fontFamily: ff,
                  cursor: 'pointer', transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.target.style.opacity = '0.85'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Faculty Profile Modal ── */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 20, width: '100%', maxWidth: 580,
              maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
            }}
          >
            {/* Modal header with gradient */}
            <div style={{
              background: `linear-gradient(135deg, ${selected.avatarColor}18 0%, ${selected.avatarColor}08 100%)`,
              borderBottom: `1px solid ${selected.avatarColor}20`,
              padding: '28px 28px 24px',
              position: 'relative',
            }}>
              <button
                onClick={() => setSelected(null)}
                style={{
                  position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.06)',
                  border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
                  fontSize: 18, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >×</button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                {/* Large avatar */}
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', background: selected.avatarBg,
                  color: selected.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800, fontFamily: ff, flexShrink: 0,
                  border: `3px solid ${selected.avatarColor}40`,
                  boxShadow: `0 4px 16px ${selected.avatarColor}30`,
                }}>
                  {selected.initials}
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: TEXT, fontFamily: ff, marginBottom: 4 }}>{selected.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: selected.avatarColor, fontFamily: ff, marginBottom: 6 }}>{selected.designation}</div>
                  <div style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>{selected.department}</div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    <span style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>📚 {selected.publications} publications</span>
                    <span style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>🔬 {selected.projects} projects</span>
                    <span style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>⏱ {selected.experience}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal body */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>

              {/* Contact info */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10, fontFamily: ff }}>Contact Information</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { icon: '📧', label: 'Email', value: selected.email },
                    { icon: '📞', label: 'Phone', value: selected.phone },
                    { icon: '🏢', label: 'Cabin', value: selected.cabin },
                    { icon: '🎓', label: 'Qualification', value: selected.qualification },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: 11, color: MUTED, fontFamily: ff, marginBottom: 3 }}>{icon} {label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: ff, wordBreak: 'break-word' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office hours */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10, fontFamily: ff }}>Office Hours</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selected.officeHours.map(({ day, time }) => (
                    <div key={day} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: `${selected.avatarColor}08`, border: `1px solid ${selected.avatarColor}20`,
                      borderRadius: 10, padding: '10px 14px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: selected.avatarColor, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: ff }}>{day}</span>
                      </div>
                      <span style={{ fontSize: 12, color: selected.avatarColor, fontWeight: 700, fontFamily: ff }}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subjects */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10, fontFamily: ff }}>Subjects Handled</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selected.subjects.map(s => (
                    <span key={s} style={{
                      background: `${selected.avatarColor}12`, color: selected.avatarColor,
                      border: `1px solid ${selected.avatarColor}25`,
                      borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 600, fontFamily: ff,
                    }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Research areas */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10, fontFamily: ff }}>Research Areas</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selected.researchAreas.map(r => (
                    <span key={r} style={{
                      background: '#f1f5f9', color: '#475569',
                      borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 500, fontFamily: ff,
                    }}>🔬 {r}</span>
                  ))}
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                style={{
                  width: '100%', padding: '12px', background: ACCENT, color: '#fff',
                  border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
                  fontFamily: ff, cursor: 'pointer', marginTop: 4,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BiometricInfo() {
  const fields = [
    ['Device ID', 'BIO-CSE-03'],
    ['Location', 'CSE Block Lab, Ground Floor'],
    ['Status', 'Enrolled'],
    ['Last Sync', 'Today, 9:15 AM'],
    ['Fingerprints Enrolled', '2 of 2'],
    ['Face ID', 'Registered']
  ]
  return (
    <div style={{ maxWidth: 440 }}>
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18 }}>✅</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#15803d', fontFamily: 'system-ui' }}>Biometric Enrollment Active</div>
          <div style={{ fontSize: 12, color: '#166534', fontFamily: 'system-ui' }}>Your biometrics are enrolled and synced successfully.</div>
        </div>
        <span style={{ marginLeft: 'auto', background: '#15803d', color: '#fff', fontSize: 11, borderRadius: 10, padding: '2px 10px', fontWeight: 700, fontFamily: 'system-ui' }}>Active</span>
      </div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        {fields.map(([label, val], i) => (
          <div key={i} style={{ display: 'flex', borderBottom: i < fields.length - 1 ? '1px solid #f1f5f9' : 'none', padding: '12px 16px', background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
            <span style={{ color: MUTED, fontSize: 13, fontFamily: 'system-ui', width: 180 }}>{label}</span>
            <span style={{ color: label === 'Status' ? '#15803d' : TEXT, fontSize: 13, fontFamily: 'system-ui', fontWeight: label === 'Status' ? 700 : 500 }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ClassMessages() {
  const [read, setRead] = useState(false)
  const msgs = [
    { sender: 'Dr. Ramesh Kumar', date: 'Jun 3, 2025 · 10:42 AM', subject: 'Unit 4 — New Syllabus Portion', text: 'Unit 3 portion completed. Unit 4 starts Monday. Kindly refer the textbook chapters 8–10 before attending class.', course: 'CS6001', avatar: 'RK', color: '#6366f1', bg: '#eef2ff' },
    { sender: 'Ms. R. Divya', date: 'Jun 2, 2025 · 3:15 PM', subject: 'Assignment 2 — Extended Deadline', text: 'Deadline for Assignment 2 has been extended to June 8, 2025. Please submit via the digital assignment portal.', course: 'CS6002', avatar: 'RD', color: '#0891b2', bg: '#e0f2fe' },
    { sender: 'Dr. S. Priya', date: 'Jun 1, 2025 · 9:00 AM', subject: 'Quiz Next Week', text: 'There will be an online quiz on Unit 2 & 3 next Tuesday (June 10). Syllabus has been uploaded to the course page.', course: 'CS6003', avatar: 'SP', color: '#7c3aed', bg: '#ede9fe' },
    { sender: 'Mr. T. Arun Kumar', date: 'May 30, 2025 · 11:30 AM', subject: 'Lab Schedule Change', text: 'This week\'s lab session on Thursday is rescheduled to Wednesday 2–4 PM due to departmental event. Please note the change.', course: 'CS6004', avatar: 'TA', color: '#b45309', bg: '#fef3c7' },
    { sender: 'Dr. A. Meenakshi', date: 'May 29, 2025 · 4:00 PM', subject: 'Project Phase I — Guidelines', text: 'Project Phase I guidelines have been uploaded. Team formation deadline is June 12. Please form teams of 3–4 members.', course: 'CS6081', avatar: 'AM', color: '#059669', bg: '#d1fae5' }
  ]
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>5 messages — {read ? '0 unread' : '5 unread'}</span>
        <button onClick={() => setRead(true)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Mark all as read</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, background: read ? '#fff' : '#fafbff', display: 'flex', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: m.bg, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, fontFamily: 'system-ui', flexShrink: 0 }}>{m.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>{m.sender} <span style={{ background: '#f1f5f9', color: MUTED, fontSize: 11, borderRadius: 6, padding: '1px 7px', fontWeight: 500 }}>{m.course}</span></div>
                <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>{m.date}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, fontFamily: 'system-ui', marginBottom: 3 }}>{m.subject}</div>
              <div style={{ fontSize: 13, color: TEXT, fontFamily: 'system-ui', lineHeight: 1.5 }}>{m.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Regulation() {
  return (
    <div style={{ maxWidth: 580 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 260px', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>Regulation 2021</span>
            <span style={{ background: '#eef2ff', color: ACCENT, fontSize: 11, borderRadius: 10, padding: '2px 10px', fontWeight: 600, fontFamily: 'system-ui' }}>Current</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[['Total Credits', '160 credits required'], ['Minimum Attendance', '75% per course'], ['CGPA Requirement', 'Minimum 5.0 to pass semester'], ['Grading Policy', 'O(91-100), A+(81-90), A(71-80), B+(61-70), B(51-60)'], ['Arrear Policy', 'Max 2 backlogs to progress'], ['Project', 'Mandatory in Sem 7 & 8']].map(([k, v]) => (
              <div key={k} style={{ fontSize: 13, fontFamily: 'system-ui' }}>
                <div style={{ color: MUTED, marginBottom: 1 }}>{k}</div>
                <div style={{ color: TEXT, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
          <button style={{ marginTop: 18, background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: 12, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600, width: '100%' }}>Download Regulation PDF</button>
        </div>
        <div style={{ flex: '1 1 200px', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 12 }}>Credit Distribution</div>
          {[['Core Courses', '96 credits'], ['Electives', '24 credits'], ['Labs', '24 credits'], ['Project', '12 credits'], ['Mandatory', '4 credits']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13, fontFamily: 'system-ui' }}>
              <span style={{ color: MUTED }}>{k}</span>
              <span style={{ color: TEXT, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MinorHonour() {
  const options = [
    { name: 'Data Science', credits: 20, seats: 15, available: 8, status: 'Open', enrolled: true, color: '#6366f1', bg: '#eef2ff' },
    { name: 'Cyber Security', credits: 20, seats: 20, available: 12, status: 'Open', enrolled: false, color: '#0891b2', bg: '#e0f2fe' },
    { name: 'IoT & Embedded Systems', credits: 20, seats: 12, available: 0, status: 'Closed', enrolled: false, color: '#7c3aed', bg: '#ede9fe' },
    { name: 'Full Stack Development', credits: 20, seats: 18, available: 5, status: 'Open', enrolled: false, color: '#059669', bg: '#d1fae5' }
  ]
  return (
    <div>
      <div style={{ background: '#eef2ff', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: ACCENT, fontFamily: 'system-ui', fontWeight: 500 }}>
        You are currently enrolled in the <strong>Data Science</strong> minor degree programme.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {options.map((o, i) => (
          <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, background: o.enrolled ? '#fafbff' : '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: o.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                {['📊', '🔐', '🔌', '🌐'][i]}
              </div>
              <span style={{ background: o.status === 'Open' ? '#dcfce7' : '#fee2e2', color: o.status === 'Open' ? '#15803d' : '#dc2626', fontSize: 11, borderRadius: 10, padding: '2px 8px', fontWeight: 700, fontFamily: 'system-ui' }}>{o.status}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 4 }}>{o.name}</div>
            <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', marginBottom: 10 }}>{o.credits} credits required · {o.available}/{o.seats} seats available</div>
            {o.enrolled
              ? <span style={{ background: o.bg, color: o.color, fontSize: 11, borderRadius: 10, padding: '3px 10px', fontWeight: 700, fontFamily: 'system-ui' }}>✓ Enrolled</span>
              : <button disabled={o.status === 'Closed'} style={{ background: o.status === 'Closed' ? '#f1f5f9' : o.bg, color: o.status === 'Closed' ? MUTED : o.color, border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 12, fontFamily: 'system-ui', cursor: o.status === 'Closed' ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                {o.status === 'Closed' ? 'Registration Closed' : 'Apply Now'}
              </button>}
          </div>
        ))}
      </div>
    </div>
  )
}

function TimeTable() {
  const slots = ['8:00 – 9:00', '9:00 – 10:00', '10:00 – 11:00', '11:00 – 12:00', 'LUNCH', '1:00 – 2:00', '2:00 – 3:00', '3:00 – 4:00']
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const subjectColors = { 'CS6001': ['#eef2ff', '#6366f1'], 'CS6002': ['#e0f2fe', '#0891b2'], 'CS6003': ['#d1fae5', '#059669'], 'CS6004': ['#ede9fe', '#7c3aed'], 'CS6005': ['#fef3c7', '#b45309'], 'CS6006': ['#fce7f3', '#be185d'], 'Lab': ['#f0fdf4', '#16a34a'] }
  const grid = [
    ['CS6001', 'CS6002', 'CS6003', 'CS6004', 'CS6005', ''],
    ['CS6002', 'CS6001', 'CS6004', 'CS6003', 'CS6006', ''],
    ['CS6003', 'CS6004', 'CS6001', 'CS6006', 'CS6002', ''],
    ['CS6004', 'CS6003', 'CS6005', 'CS6001', 'CS6002', 'CS6006'],
    ['LUNCH', 'LUNCH', 'LUNCH', 'LUNCH', 'LUNCH', 'LUNCH'],
    ['CS6005', 'Lab', 'CS6006', 'CS6002', 'CS6001', ''],
    ['CS6006', 'Lab', 'CS6002', 'CS6005', 'CS6004', ''],
    ['', '', 'Lab', 'Lab', '', '']
  ]
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {[['CS6001', 'Data Warehousing'], ['CS6002', 'Compiler Design'], ['CS6003', 'Cloud Computing'], ['CS6004', 'Cryptography'], ['CS6005', 'Elective I'], ['CS6006', 'Elective II'], ['Lab', 'Lab Session']].map(([code, name]) => (
          <span key={code} style={{ background: subjectColors[code][0], color: subjectColors[code][1], fontSize: 11, borderRadius: 6, padding: '2px 8px', fontFamily: 'system-ui', fontWeight: 600 }}>{code}: {name}</span>
        ))}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'system-ui' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px 10px', background: '#f8fafc', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0', textAlign: 'left', width: 100 }}>Time</th>
            {days.map(d => <th key={d} style={{ padding: '8px 10px', background: '#f8fafc', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, si) => (
            <tr key={si} style={{ background: slot === 'LUNCH' ? '#fafafa' : '#fff' }}>
              <td style={{ padding: '8px 10px', color: MUTED, fontWeight: 500, borderBottom: '1px solid #f1f5f9' }}>{slot}</td>
              {slot === 'LUNCH'
                ? <td colSpan={6} style={{ padding: '8px 10px', textAlign: 'center', color: MUTED, fontStyle: 'italic', borderBottom: '1px solid #f1f5f9' }}>Lunch Break (12:00 – 1:00)</td>
                : grid[si].map((cell, di) => {
                    const [bg, color] = subjectColors[cell] || ['transparent', MUTED]
                    return (
                      <td key={di} style={{ padding: '6px 8px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                        {cell ? <span style={{ background: bg, color, fontSize: 11, borderRadius: 6, padding: '3px 7px', fontWeight: 600, display: 'inline-block' }}>{cell}</span> : <span style={{ color: '#cbd5e1', fontSize: 11 }}>—</span>}
                      </td>
                    )
                  })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ClassAttendance() {
  const courses = [
    { code: 'CS6001', name: 'Data Warehousing', present: 21, total: 24 },
    { code: 'CS6002', name: 'Compiler Design', present: 22, total: 24 },
    { code: 'CS6003', name: 'Cloud Computing', present: 17, total: 24 },
    { code: 'CS6004', name: 'Cryptography & Security', present: 23, total: 27 },
    { code: 'CS6005', name: 'Elective I', present: 19, total: 24 },
    { code: 'CS6006', name: 'Elective II', present: 16, total: 17 }
  ]
  const getColor = (pct) => pct >= 75 ? ['#15803d', '#dcfce7'] : pct >= 65 ? ['#b45309', '#fef3c7'] : ['#dc2626', '#fee2e2']
  const overall = Math.round(courses.reduce((a, c) => a + c.present, 0) / courses.reduce((a, c) => a + c.total, 0) * 100)
  return (
    <div>
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: overall >= 75 ? '#15803d' : '#b45309', fontFamily: 'system-ui' }}>{overall}%</div>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>Overall Attendance</div>
        </div>
        <div style={{ flex: 1, height: 8, background: '#e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ width: `${overall}%`, height: '100%', background: overall >= 75 ? '#22c55e' : '#f59e0b', borderRadius: 10, transition: 'width 0.3s' }} />
        </div>
        <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>{courses.reduce((a, c) => a + c.present, 0)} / {courses.reduce((a, c) => a + c.total, 0)} classes attended</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {courses.map((c, i) => {
          const pct = Math.round(c.present / c.total * 100)
          const [clr, bg] = getColor(pct)
          return (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 9, padding: '12px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>{c.code} </span>
                  <span style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>— {c.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>{c.present}/{c.total} classes</span>
                  <span style={{ background: bg, color: clr, fontSize: 12, borderRadius: 8, padding: '2px 9px', fontWeight: 700, fontFamily: 'system-ui' }}>{pct}%</span>
                </div>
              </div>
              <div style={{ height: 6, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: pct >= 75 ? '#22c55e' : pct >= 65 ? '#f59e0b' : '#ef4444', borderRadius: 6 }} />
              </div>
              {pct < 75 && <div style={{ fontSize: 11, color: pct < 65 ? '#dc2626' : '#b45309', fontFamily: 'system-ui', marginTop: 4 }}>⚠ {pct < 65 ? 'Attendance critically low — detainment risk' : `Need ${Math.ceil((0.75 * c.total - c.present) / 0.25)} more classes to reach 75%`}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CoursePageConsolidated() {
  const data = [
    { code: 'CS6001', name: 'Data Warehousing', materials: 8, assignments: 2, announcements: 3 },
    { code: 'CS6002', name: 'Compiler Design', materials: 12, assignments: 3, announcements: 1 },
    { code: 'CS6003', name: 'Cloud Computing', materials: 6, assignments: 2, announcements: 4 },
    { code: 'CS6004', name: 'Cryptography & Security', materials: 10, assignments: 1, announcements: 2 },
    { code: 'CS6005', name: 'Elective I — Big Data', materials: 5, assignments: 2, announcements: 1 },
    { code: 'CS6006', name: 'Elective II — DevOps', materials: 7, assignments: 3, announcements: 2 }
  ]
  const badge = (n, color) => <span style={{ background: color + '22', color, fontSize: 11, borderRadius: 10, padding: '1px 7px', fontWeight: 700, fontFamily: 'system-ui', marginLeft: 4 }}>{n}</span>
  return (
    <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 600 }}>
      <thead>
        <tr style={{ background: '#f8fafc' }}>
          {['Course Code', 'Course Name', 'Materials', 'Assignments', 'Announcements'].map(h => (
            <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{d.code}</td>
            <td style={{ padding: '9px 10px', color: TEXT }}>{d.name}</td>
            <td style={{ padding: '9px 10px' }}><button style={{ color: '#0891b2', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'system-ui', fontWeight: 500 }}>View {badge(d.materials, '#0891b2')}</button></td>
            <td style={{ padding: '9px 10px' }}><button style={{ color: '#7c3aed', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'system-ui', fontWeight: 500 }}>View {badge(d.assignments, '#7c3aed')}</button></td>
            <td style={{ padding: '9px 10px' }}><button style={{ color: '#b45309', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'system-ui', fontWeight: 500 }}>View {badge(d.announcements, '#b45309')}</button></td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )
}

function DigitalAssignmentUpload() {
  const [course, setCourse] = useState('')
  const submitted = [
    { course: 'CS6001', title: 'Unit 2 — SQL Queries', submitted: 'May 20, 2025', due: 'May 22, 2025', status: 'Graded', marks: '18/20' },
    { course: 'CS6002', title: 'LL(1) Parser Construction', submitted: 'May 28, 2025', due: 'May 30, 2025', status: 'Submitted', marks: '—' },
    { course: 'CS6003', title: 'AWS Architecture Report', submitted: 'Jun 1, 2025', due: 'Jun 3, 2025', status: 'Graded', marks: '17/20' },
    { course: 'CS6004', title: 'RSA Encryption Lab', submitted: '—', due: 'Jun 8, 2025', status: 'Pending', marks: '—' }
  ]
  const statusColor = { Graded: ['#dcfce7', '#15803d'], Submitted: ['#dbeafe', '#1d4ed8'], Pending: ['#fee2e2', '#dc2626'] }
  return (
    <div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>Upload New Assignment</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Course</label>
            <select value={course} onChange={e => setCourse(e.target.value)} style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%' }}>
              <option value="">Select course...</option>
              <option>CS6001 — Data Warehousing</option>
              <option>CS6002 — Compiler Design</option>
              <option>CS6003 — Cloud Computing</option>
              <option>CS6004 — Cryptography & Security</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Assignment Title</label>
            <input placeholder="Enter assignment title..." style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Due Date (set by faculty)</label>
            <input readOnly value="June 8, 2025" style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%', background: '#f8fafc', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Upload File</label>
            <div style={{ border: '2px dashed #c7d2fe', borderRadius: 8, padding: '24px 16px', textAlign: 'center', background: '#fafbff', cursor: 'pointer' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>📎</div>
              <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Drag & drop file here, or <span style={{ color: ACCENT, fontWeight: 600 }}>browse</span></div>
              <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui', marginTop: 4 }}>PDF, DOCX, ZIP — max 10 MB</div>
            </div>
          </div>
          <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Submit Assignment</button>
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 10 }}>Submitted Assignments</div>
      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 600 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Course', 'Title', 'Submitted', 'Due Date', 'Status', 'Marks'].map(h => (
              <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {submitted.map((s, i) => {
            const [bg, color] = statusColor[s.status]
            return (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '8px 10px', color: ACCENT, fontWeight: 600 }}>{s.course}</td>
                <td style={{ padding: '8px 10px', color: TEXT }}>{s.title}</td>
                <td style={{ padding: '8px 10px', color: MUTED }}>{s.submitted}</td>
                <td style={{ padding: '8px 10px', color: MUTED }}>{s.due}</td>
                <td style={{ padding: '8px 10px' }}><span style={{ background: bg, color, fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{s.status}</span></td>
                <td style={{ padding: '8px 10px', color: TEXT, fontWeight: 600 }}>{s.marks}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </div>
  )
}

function QCMView() {
  const data = [
    { course: 'CS6001', quiz: 'Unit 1 Quiz', date: 'Apr 15, 2025', max: 20, scored: 18 },
    { course: 'CS6002', quiz: 'Unit 2 QCM', date: 'Apr 22, 2025', max: 25, scored: 19 },
    { course: 'CS6003', quiz: 'Cloud Basics', date: 'May 5, 2025', max: 20, scored: 14 },
    { course: 'CS6004', quiz: 'Cryptography Quiz', date: 'May 14, 2025', max: 30, scored: 28 },
    { course: 'CS6001', quiz: 'Unit 3 Quiz', date: 'May 28, 2025', max: 20, scored: 17 }
  ]
  const pctColor = (p) => p >= 80 ? ['#dcfce7', '#15803d'] : p >= 60 ? ['#fef3c7', '#b45309'] : ['#fee2e2', '#dc2626']
  return (
    <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 500 }}>
      <thead>
        <tr style={{ background: '#f8fafc' }}>
          {['Course', 'Quiz Name', 'Date', 'Max Marks', 'Scored', 'Percentage'].map(h => (
            <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => {
          const pct = Math.round(d.scored / d.max * 100)
          const [bg, color] = pctColor(pct)
          return (
            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{d.course}</td>
              <td style={{ padding: '9px 10px', color: TEXT }}>{d.quiz}</td>
              <td style={{ padding: '9px 10px', color: MUTED }}>{d.date}</td>
              <td style={{ padding: '9px 10px', color: MUTED, textAlign: 'center' }}>{d.max}</td>
              <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 600, textAlign: 'center' }}>{d.scored}</td>
              <td style={{ padding: '9px 10px' }}><span style={{ background: bg, color, fontSize: 12, borderRadius: 8, padding: '2px 9px', fontWeight: 700 }}>{pct}%</span></td>
            </tr>
          )
        })}
      </tbody>
    </table>
    </div>
  )
}

function OutcomeSETConference() {
  const courses = [
    { code: 'CS6001', name: 'Data Warehousing', co: [85, 78, 92, 75, 88] },
    { code: 'CS6002', name: 'Compiler Design', co: [72, 80, 68, 85, 79] },
    { code: 'CS6003', name: 'Cloud Computing', co: [90, 85, 83, 91, 87] },
    { code: 'CS6004', name: 'Cryptography', co: [76, 82, 79, 73, 88] }
  ]
  const cellColor = (v) => v >= 80 ? '#dcfce7' : v >= 70 ? '#fef9c3' : '#fee2e2'
  const cellText = (v) => v >= 80 ? '#15803d' : v >= 70 ? '#854d0e' : '#dc2626'
  return (
    <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 500 }}>
      <thead>
        <tr style={{ background: '#f8fafc' }}>
          {['Course', 'Name', 'CO1', 'CO2', 'CO3', 'CO4', 'CO5'].map(h => (
            <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {courses.map((c, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{c.code}</td>
            <td style={{ padding: '9px 10px', color: TEXT }}>{c.name}</td>
            {c.co.map((v, j) => (
              <td key={j} style={{ padding: '9px 10px' }}>
                <span style={{ background: cellColor(v), color: cellText(v), fontSize: 12, borderRadius: 7, padding: '3px 8px', fontWeight: 700 }}>{v}%</span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )
}

function CoExtraCurricular() {
  const activities = [
    { name: 'Sports', icon: '⚽', status: 'Active', points: 45, certs: 2, role: 'State-level Football', color: '#6366f1', bg: '#eef2ff' },
    { name: 'NSS', icon: '🌿', status: 'Active', points: 60, certs: 3, role: '120 hours completed', color: '#059669', bg: '#d1fae5' },
    { name: 'NCC', icon: '⚔️', status: 'Inactive', points: 0, certs: 0, role: 'Not enrolled', color: '#64748b', bg: '#f1f5f9' },
    { name: 'Cultural Club', icon: '🎭', status: 'Active', points: 30, certs: 1, role: 'Dance — Core Member', color: '#be185d', bg: '#fce7f3' },
    { name: 'Technical Club', icon: '🔧', status: 'Active', points: 55, certs: 4, role: 'Treasurer', color: '#b45309', bg: '#fef3c7' },
    { name: 'IEEE Student Branch', icon: '💡', status: 'Active', points: 40, certs: 2, role: 'General Member', color: '#0891b2', bg: '#e0f2fe' }
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
      {activities.map((a, i) => (
        <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{a.icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>{a.name}</div>
              <span style={{ background: a.status === 'Active' ? '#dcfce7' : '#f1f5f9', color: a.status === 'Active' ? '#15803d' : MUTED, fontSize: 10, borderRadius: 8, padding: '1px 7px', fontWeight: 700, fontFamily: 'system-ui' }}>{a.status}</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', marginBottom: 8 }}>{a.role}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'system-ui' }}>
            <span style={{ color: a.color, fontWeight: 700 }}>{a.points} pts</span>
            <span style={{ color: MUTED }}>{a.certs} cert{a.certs !== 1 ? 's' : ''}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function AcademicsCalendar() {
  const events = [
    { date: 2, label: 'Internal Assessment 3', type: 'exam' },
    { date: 10, label: 'QCM — Unit 4', type: 'exam' },
    { date: 12, label: 'Cultural Fest', type: 'event' },
    { date: 20, label: 'End Semester Exam', type: 'exam' },
    { date: 22, label: 'Holiday — Eid', type: 'holiday' },
    { date: 28, label: 'Last Working Day', type: 'event' }
  ]
  const eventMap = {}
  events.forEach(e => { eventMap[e.date] = e })
  const typeColor = { exam: '#ef4444', event: '#6366f1', holiday: '#22c55e' }
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const startDay = 0 // June 2025 starts on Sunday
  const daysInMonth = 30
  const cells = Array(startDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))
  while (cells.length % 7 !== 0) cells.push(null)
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 12 }}>June 2025</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'system-ui', marginBottom: 20 }}>
        <thead>
          <tr>
            {days.map(d => <th key={d} style={{ padding: '6px', textAlign: 'center', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, ri) => (
            <tr key={ri}>
              {cells.slice(ri * 7, ri * 7 + 7).map((day, ci) => {
                const ev = day && eventMap[day]
                return (
                  <td key={ci} style={{ padding: '6px', textAlign: 'center', border: '1px solid #f1f5f9', background: ev ? (ev.type === 'holiday' ? '#f0fdf4' : ev.type === 'exam' ? '#fef2f2' : '#eef2ff') : '#fff', height: 44, verticalAlign: 'top' }}>
                    {day && <>
                      <div style={{ fontWeight: ev ? 700 : 400, color: ev ? typeColor[ev.type] : TEXT }}>{day}</div>
                      {ev && <div style={{ fontSize: 9, color: typeColor[ev.type], lineHeight: 1.2, marginTop: 2 }}>{ev.label}</div>}
                    </>}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 10 }}>Upcoming Events</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {events.map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, borderLeft: `4px solid ${typeColor[e.type]}` }}>
            <div style={{ textAlign: 'center', width: 36 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: typeColor[e.type], fontFamily: 'system-ui' }}>{e.date}</div>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: 'system-ui' }}>Jun</div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: 'system-ui' }}>{e.label}</div>
              <span style={{ background: typeColor[e.type] + '22', color: typeColor[e.type], fontSize: 10, borderRadius: 8, padding: '1px 7px', fontWeight: 700, fontFamily: 'system-ui', textTransform: 'capitalize' }}>{e.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CourseRegistrationAllocation() {
  const courses = [
    { code: 'CS6001', name: 'Data Warehousing', credits: 4, faculty: 'Dr. Ramesh Kumar', slot: 'A1+TA1' },
    { code: 'CS6002', name: 'Compiler Design', credits: 4, faculty: 'Ms. R. Divya', slot: 'B1+TB1' },
    { code: 'CS6003', name: 'Cloud Computing', credits: 4, faculty: 'Dr. S. Priya', slot: 'C1+TC1' },
    { code: 'CS6004', name: 'Cryptography & Security', credits: 3, faculty: 'Mr. T. Arun Kumar', slot: 'D1+TD1' },
    { code: 'CS6005', name: 'Elective I — Big Data', credits: 3, faculty: 'Dr. A. Meenakshi', slot: 'E1' },
    { code: 'CS6006', name: 'Elective II — DevOps', credits: 3, faculty: 'Mr. K. Vignesh', slot: 'F1' },
    { code: 'CS6081', name: 'Project Phase I', credits: 4, faculty: 'Dr. S. Priya', slot: 'TF1+TF2' }
  ]
  const total = courses.reduce((a, c) => a + c.credits, 0)
  return (
    <div>
      <div style={{ background: '#eef2ff', borderRadius: 8, padding: '10px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT, fontFamily: 'system-ui' }}>Semester 6 — Current Registration</span>
        <span style={{ fontSize: 13, fontFamily: 'system-ui' }}><span style={{ color: MUTED }}>Total Credits: </span><span style={{ color: ACCENT, fontWeight: 800, fontSize: 16 }}>{total}</span></span>
      </div>
      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 600 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Course Code', 'Course Name', 'Credits', 'Faculty', 'Slot'].map(h => (
              <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{c.code}</td>
              <td style={{ padding: '9px 10px', color: TEXT }}>{c.name}</td>
              <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 600, textAlign: 'center' }}>{c.credits}</td>
              <td style={{ padding: '9px 10px', color: MUTED }}>{c.faculty}</td>
              <td style={{ padding: '9px 10px' }}><span style={{ background: '#eef2ff', color: ACCENT, fontSize: 11, borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>{c.slot}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

function ProjectCourse() {
  const steps = [
    { label: 'Team Formation', date: 'Jan 10, 2025', done: true },
    { label: 'Topic Submission', date: 'Jan 20, 2025', done: true },
    { label: 'Guide Allocation', date: 'Feb 5, 2025', done: true },
    { label: 'Review 1', date: 'Mar 15, 2025', done: true },
    { label: 'Review 2', date: 'May 10, 2025', done: true },
    { label: 'Final Viva', date: 'Jun 25, 2025', done: false },
    { label: 'Report Submission', date: 'Jul 5, 2025', done: false }
  ]
  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>Project Phase I Details</div>
          <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: 12, borderRadius: 10, padding: '3px 10px', fontWeight: 700, fontFamily: 'system-ui' }}>In Progress</span>
        </div>
        {[['Project Title', 'AI-based Smart Campus Resource Allocation System'], ['Domain', 'Machine Learning / IoT'], ['Guide', 'Dr. S. Priya (CSE Dept.)'], ['Co-Guide', 'Mr. K. Vignesh (CSE Dept.)'], ['Team Members', 'Arun S., Divya R., Karthik M., Preethi V.'], ['Start Date', 'January 10, 2025'], ['Project Code', 'CSE-P6-2025-042']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13, fontFamily: 'system-ui' }}>
            <span style={{ color: MUTED, width: 130, flexShrink: 0 }}>{k}</span>
            <span style={{ color: TEXT, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 12 }}>Project Timeline</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: s.done ? '#22c55e' : '#e2e8f0', border: s.done ? '3px solid #16a34a' : '3px solid #cbd5e1', flexShrink: 0, marginTop: 2 }} />
              {i < steps.length - 1 && <div style={{ width: 2, height: 28, background: s.done ? '#22c55e' : '#e2e8f0' }} />}
            </div>
            <div style={{ paddingBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: s.done ? 600 : 400, color: s.done ? TEXT : MUTED, fontFamily: 'system-ui' }}>{s.label}</div>
              <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>{s.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectMarkView() {
  const components = [
    { label: 'Review 1', marks: 22, max: 25, date: 'Mar 15, 2025', status: 'Completed' },
    { label: 'Review 2', marks: 23, max: 25, date: 'May 10, 2025', status: 'Completed' },
    { label: 'Final Viva', marks: null, max: 25, date: 'Jun 25, 2025', status: 'Pending' },
    { label: 'Project Report', marks: null, max: 25, date: 'Jul 5, 2025', status: 'Pending' }
  ]
  const scored = components.filter(c => c.marks !== null).reduce((a, c) => a + c.marks, 0)
  const maxSoFar = components.filter(c => c.marks !== null).reduce((a, c) => a + c.max, 0)
  return (
    <div>
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 18px', marginBottom: 18, display: 'flex', gap: 24 }}>
        <div><div style={{ fontSize: 24, fontWeight: 800, color: ACCENT, fontFamily: 'system-ui' }}>{scored}<span style={{ fontSize: 14, fontWeight: 500, color: MUTED }}>/{maxSoFar}</span></div><div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>Scored so far</div></div>
        <div><div style={{ fontSize: 24, fontWeight: 800, color: '#6b7280', fontFamily: 'system-ui' }}>50</div><div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>Total marks</div></div>
        <div><div style={{ fontSize: 24, fontWeight: 800, color: '#059669', fontFamily: 'system-ui' }}>{maxSoFar > 0 ? Math.round(scored / maxSoFar * 100) : 0}%</div><div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>Current %</div></div>
      </div>
      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 400 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Component', 'Date', 'Marks', 'Status'].map(h => (
              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {components.map((c, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '10px 12px', color: TEXT, fontWeight: 600 }}>{c.label}</td>
              <td style={{ padding: '10px 12px', color: MUTED }}>{c.date}</td>
              <td style={{ padding: '10px 12px' }}>
                {c.marks !== null
                  ? <span style={{ color: TEXT, fontWeight: 700 }}>{c.marks}<span style={{ color: MUTED, fontWeight: 400 }}>/{c.max}</span></span>
                  : <span style={{ color: MUTED }}>—/{c.max}</span>}
              </td>
              <td style={{ padding: '10px 12px' }}>
                <span style={{ background: c.status === 'Completed' ? '#dcfce7' : '#fef3c7', color: c.status === 'Completed' ? '#15803d' : '#b45309', fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{c.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

function ApaarIDUpload() {
  const [status, setStatus] = useState('Not Uploaded')
  return (
    <div style={{ maxWidth: 480 }}>
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', marginBottom: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#b45309', fontFamily: 'system-ui', marginBottom: 4 }}>About APAAR ID (Academic Bank of Credits)</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#92400e', fontFamily: 'system-ui', lineHeight: 1.7 }}>
          <li>APAAR is a unique 12-digit ID issued to every student under the National Education Policy 2020.</li>
          <li>It is linked to your Aadhaar and enables credit transfer across institutions.</li>
          <li>Upload your APAAR ID card or ABC certificate to complete verification.</li>
          <li>Submission deadline: June 30, 2025</li>
        </ul>
      </div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>APAAR ID Submission</span>
          <span style={{ background: status === 'Uploaded' ? '#dcfce7' : '#fee2e2', color: status === 'Uploaded' ? '#15803d' : '#dc2626', fontSize: 11, borderRadius: 10, padding: '2px 10px', fontWeight: 700, fontFamily: 'system-ui' }}>{status}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>APAAR / ABC ID Number</label>
            <input placeholder="Enter 12-digit APAAR ID..." maxLength={12} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%', boxSizing: 'border-box', letterSpacing: '2px' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Upload APAAR ID Card / ABC Certificate</label>
            <div style={{ border: '2px dashed #c7d2fe', borderRadius: 8, padding: '20px 16px', textAlign: 'center', background: '#fafbff', cursor: 'pointer' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>🪪</div>
              <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Drag & drop or <span style={{ color: ACCENT, fontWeight: 600 }}>browse file</span></div>
              <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui', marginTop: 4 }}>PDF, JPG, PNG — max 5 MB</div>
            </div>
          </div>
          <button onClick={() => setStatus('Uploaded')} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Submit APAAR ID</button>
        </div>
      </div>
    </div>
  )
}

// ─── Biometric Search ────────────────────────────────────────────────────────
function BiometricSearch() {
  const ff = 'system-ui, -apple-system, sans-serif'
  const today = new Date()
  const [viewYear, setViewYear]   = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())       // 0-indexed
  const [selected, setSelected]   = useState(null)                   // Date object

  // Demo biometric log — keyed as YYYY-MM-DD
  const bioLog = {
    // June 2025
    [`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-02`]: [
      { time: '08:47 AM', location: 'CSE Block — Main Entrance', type: 'Attendance', status: 'Present' },
      { time: '01:10 PM', location: 'Library — Entry Gate',      type: 'Library Access', status: 'Accessed' },
    ],
    [`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-03`]: [
      { time: '08:52 AM', location: 'CSE Block — Main Entrance', type: 'Attendance', status: 'Present' },
      { time: '02:30 PM', location: 'CSE Block Lab — Lab 2',     type: 'Lab Access',  status: 'Accessed' },
    ],
    [`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-04`]: [
      { time: '09:05 AM', location: 'CSE Block — Main Entrance', type: 'Attendance', status: 'Late' },
    ],
    [`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-05`]: [],  // no biometric
    [`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-06`]: [
      { time: '08:44 AM', location: 'CSE Block — Main Entrance', type: 'Attendance', status: 'Present' },
      { time: '10:15 AM', location: 'Exam Hall — Block C',       type: 'Exam Entry',  status: 'Verified' },
      { time: '12:30 PM', location: 'Cafeteria Gate',            type: 'Canteen Access', status: 'Accessed' },
    ],
    [`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-09`]: [
      { time: '08:50 AM', location: 'CSE Block — Main Entrance', type: 'Attendance', status: 'Present' },
    ],
    [`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-10`]: [
      { time: '08:41 AM', location: 'CSE Block — Main Entrance', type: 'Attendance', status: 'Present' },
      { time: '03:00 PM', location: 'Library — Entry Gate',      type: 'Library Access', status: 'Accessed' },
    ],
    [`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-11`]: [
      { time: '09:15 AM', location: 'CSE Block — Main Entrance', type: 'Attendance', status: 'Late' },
    ],
    [`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-12`]: [
      { time: '08:38 AM', location: 'CSE Block — Main Entrance', type: 'Attendance', status: 'Present' },
      { time: '11:00 AM', location: 'Seminar Hall — Main Block', type: 'Event Entry',  status: 'Verified' },
    ],
    [`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-13`]: [
      { time: '08:55 AM', location: 'CSE Block — Main Entrance', type: 'Attendance', status: 'Present' },
    ],
  }

  const daysInMonth   = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()  // 0=Sun
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const dayLabels  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  const toKey = (d) => `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
    setSelected(null)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
    setSelected(null)
  }

  const isToday  = (d) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
  const isFuture = (d) => new Date(viewYear, viewMonth, d) > today
  const selectedKey = selected
    ? `${selected.year}-${String(selected.month + 1).padStart(2, '0')}-${String(selected.day).padStart(2, '0')}`
    : null
  const records = selectedKey ? (bioLog[selectedKey] ?? null) : null

  const statusColor = (s) => ({
    'Present': '#16a34a', 'Late': '#d97706', 'Absent': '#dc2626',
    'Accessed': '#6366f1', 'Verified': '#0891b2',
  }[s] || '#64748b')

  const statusBg = (s) => ({
    'Present': '#f0fdf4', 'Late': '#fffbeb', 'Absent': '#fef2f2',
    'Accessed': '#eef2ff', 'Verified': '#e0f2fe',
  }[s] || '#f8fafc')

  const typeIcon = (t) => ({
    'Attendance': '👆', 'Library Access': '📚', 'Lab Access': '🔬',
    'Exam Entry': '📝', 'Canteen Access': '🍽️', 'Event Entry': '🎟️',
  }[t] || '🔒')

  return (
    <div style={{ fontFamily: ff }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: ff, marginBottom: 4 }}>Biometric Activity Search</div>
        <div style={{ fontSize: 13, color: MUTED, fontFamily: ff }}>Select a date to view your biometric records for that day.</div>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* ── Calendar ── */}
        <div style={{
          background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16,
          padding: 20, minWidth: 300, flex: '0 0 auto',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          {/* Month header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <button onClick={prevMonth} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: ff }}>
              {monthNames[viewMonth]} {viewYear}
            </div>
            <button onClick={nextMonth} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          </div>

          {/* Day labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
            {dayLabels.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: MUTED, fontFamily: ff, padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e${i}`} />)}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
              const key = toKey(d)
              const hasData = bioLog[key] !== undefined
              const hasRecords = hasData && bioLog[key].length > 0
              const isSelected = selected?.day === d && selected?.month === viewMonth && selected?.year === viewYear
              const future = isFuture(d)
              const todayCell = isToday(d)

              return (
                <button
                  key={d}
                  disabled={future}
                  onClick={() => setSelected({ day: d, month: viewMonth, year: viewYear })}
                  style={{
                    width: '100%', aspectRatio: '1', border: 'none', borderRadius: 8,
                    cursor: future ? 'default' : 'pointer',
                    background: isSelected
                      ? ACCENT
                      : todayCell
                        ? '#eef2ff'
                        : hasRecords
                          ? '#f0fdf4'
                          : 'transparent',
                    color: isSelected ? '#fff' : future ? '#cbd5e1' : TEXT,
                    fontSize: 13, fontFamily: ff, fontWeight: todayCell || isSelected ? 700 : 400,
                    position: 'relative', transition: 'background 0.12s',
                    outline: todayCell && !isSelected ? `2px solid ${ACCENT}` : 'none',
                    outlineOffset: -2,
                  }}
                >
                  {d}
                  {/* Dot indicator */}
                  {hasRecords && !isSelected && (
                    <span style={{
                      position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
                      width: 4, height: 4, borderRadius: '50%',
                      background: '#16a34a', display: 'block',
                    }} />
                  )}
                  {hasData && !hasRecords && !isSelected && (
                    <span style={{
                      position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
                      width: 4, height: 4, borderRadius: '50%',
                      background: '#dc2626', display: 'block',
                    }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 14, marginTop: 14, paddingTop: 14, borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
            {[
              { color: '#16a34a', label: 'Has records' },
              { color: '#dc2626', label: 'No activity' },
              { color: ACCENT,    label: 'Selected' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: MUTED, fontFamily: ff }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Records panel ── */}
        <div style={{ flex: 1, minWidth: 260 }}>
          {!selected ? (
            <div style={{
              border: '1.5px dashed #e2e8f0', borderRadius: 16, padding: '48px 24px',
              textAlign: 'center', background: '#fafbff',
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: ff, marginBottom: 6 }}>Select a date</div>
              <div style={{ fontSize: 13, color: MUTED, fontFamily: ff }}>Click any date on the calendar to view your biometric activity for that day.</div>
            </div>
          ) : (
            <div>
              {/* Selected date header */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: ff }}>
                  {new Date(selected.year, selected.month, selected.day).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div style={{ fontSize: 12, color: MUTED, fontFamily: ff, marginTop: 2 }}>
                  {records === null
                    ? 'No data available for this date'
                    : records.length === 0
                      ? 'No biometric activity recorded'
                      : `${records.length} biometric event${records.length > 1 ? 's' : ''} recorded`}
                </div>
              </div>

              {records === null || records.length === 0 ? (
                <div style={{
                  border: '1.5px solid #fecaca', borderRadius: 12, padding: '20px 20px',
                  background: '#fef2f2', display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <span style={{ fontSize: 28 }}>🚫</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#991b1b', fontFamily: ff, marginBottom: 4 }}>No Biometric Activity</div>
                    <div style={{ fontSize: 12, color: '#b91c1c', fontFamily: ff }}>
                      {records === null
                        ? 'This date is not in the biometric log system.'
                        : 'Biometric was not used anywhere in the college on this day.'}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {records.map((r, i) => (
                    <div key={i} style={{
                      border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 16px',
                      background: '#fff', display: 'flex', gap: 14, alignItems: 'flex-start',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                      {/* Icon */}
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, background: statusBg(r.status),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, flexShrink: 0,
                      }}>
                        {typeIcon(r.type)}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: ff }}>{r.type}</div>
                          <span style={{
                            fontSize: 11, fontWeight: 700, color: statusColor(r.status),
                            background: statusBg(r.status), border: `1px solid ${statusColor(r.status)}25`,
                            borderRadius: 20, padding: '2px 10px', fontFamily: ff,
                          }}>{r.status}</span>
                        </div>
                        <div style={{ fontSize: 12, color: MUTED, fontFamily: ff, marginBottom: 3 }}>
                          📍 {r.location}
                        </div>
                        <div style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>
                          🕐 {r.time}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Summary strip */}
                  <div style={{
                    background: 'linear-gradient(135deg, #eef2ff, #f0fdf4)',
                    border: '1px solid #c7d2fe', borderRadius: 10,
                    padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, marginTop: 4,
                  }}>
                    <span style={{ fontSize: 16 }}>✅</span>
                    <span style={{ fontSize: 12, color: '#1e40af', fontWeight: 600, fontFamily: ff }}>
                      Biometric verified at {records.length} location{records.length > 1 ? 's' : ''} on this day
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const CONTENT_MAP = [
  MyCurriculum, HODDeanInfo, FacultyInfo, BiometricInfo, BiometricSearch, ClassMessages,
  Regulation, MinorHonour, TimeTable, ClassAttendance, CoursePageConsolidated,
  DigitalAssignmentUpload, QCMView, OutcomeSETConference, CoExtraCurricular,
  AcademicsCalendar, CourseRegistrationAllocation, ProjectCourse, ProjectMarkView, ApaarIDUpload
]

export default function AcademicsGeneral() {
  const [active, setActive] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const ActiveComponent = CONTENT_MAP[active]

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100%', padding: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1e293b', fontFamily: 'system-ui' }}>Academics — General</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b', fontFamily: 'system-ui' }}>Curriculum, faculty, schedule and course information</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 520 }}>
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
          {ITEMS.map((item, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              padding: isMobile ? '6px 12px' : '9px 16px', cursor: 'pointer',
              fontSize: isMobile ? 12 : 13,
              fontFamily: 'system-ui', color: active === i ? '#6366f1' : '#475569',
              background: active === i ? '#eef2ff' : 'transparent',
              borderLeft: isMobile ? 'none' : (active === i ? '3px solid #6366f1' : '3px solid transparent'),
              borderBottom: isMobile ? (active === i ? '2px solid #6366f1' : '2px solid transparent') : 'none',
              borderRadius: isMobile ? 100 : 0,
              fontWeight: active === i ? 600 : 400,
              whiteSpace: 'nowrap',
            }}>{item}</div>
          ))}
        </div>
        <div style={{ flex: 1, padding: isMobile ? '16px' : 28, overflowY: 'auto' }}>
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}
