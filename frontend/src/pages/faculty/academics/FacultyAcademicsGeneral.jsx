import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const ITEMS = ['Open Hours', 'Work Load', 'Mark Configuration', 'Project', 'Co-Faculty WorkLoad']

// ─── Open Hours ──────────────────────────────────────────────────────────────
function OpenHours() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const timeSlots = ['8:00–9:00', '9:00–10:00', '10:00–11:00', '11:00–12:00', '1:00–2:00', '2:00–3:00', '3:00–4:00']
  const [available, setAvailable] = useState({ 'Mon-9:00–10:00': true, 'Tue-2:00–3:00': true, 'Wed-10:00–11:00': true, 'Fri-1:00–2:00': true })
  const [form, setForm] = useState({ day: 'Mon', start: '', end: '', location: 'Office', maxStudents: '' })
  const [saved, setSaved] = useState(false)

  const toggle = (key) => setAvailable(prev => ({ ...prev, [key]: !prev[key] }))

  const appointments = [
    { student: 'Arun S. (21CS040)', course: 'CS6003', date: 'Jun 6, Mon', time: '9:00–10:00', topic: 'Doubt — Unit 3' },
    { student: 'Preethi V. (21CS078)', course: 'CS6001', date: 'Jun 7, Tue', time: '2:00–3:00', topic: 'Assignment help' },
    { student: 'Karthik M. (21CS055)', course: 'CS6004', date: 'Jun 9, Wed', time: '10:00–11:00', topic: 'Lab report review' },
  ]

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 10 }}>Weekly Availability Grid</div>
      <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', marginBottom: 12 }}>Click a cell to mark as available for student consultations.</div>
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'system-ui' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px 10px', background: '#f8fafc', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0', textAlign: 'left', width: 110 }}>Time</th>
              {days.map(d => <th key={d} style={{ padding: '8px 10px', background: '#f8fafc', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, si) => (
              <tr key={si}>
                <td style={{ padding: '7px 10px', color: MUTED, fontWeight: 500, borderBottom: '1px solid #f1f5f9', fontSize: 11 }}>{slot}</td>
                {days.map(d => {
                  const key = `${d}-${slot}`
                  const on = !!available[key]
                  return (
                    <td key={d} style={{ padding: '5px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                      <div
                        onClick={() => toggle(key)}
                        style={{
                          margin: '0 auto', width: 36, height: 26, borderRadius: 6, cursor: 'pointer',
                          background: on ? '#eef2ff' : '#f8fafc',
                          border: on ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, color: on ? ACCENT : MUTED, fontWeight: on ? 700 : 400
                        }}
                      >{on ? 'Open' : '—'}</div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>Add Open Hour</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {[['Day', 'day', 'select', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']],
            ['Start Time', 'start', 'time'],
            ['End Time', 'end', 'time'],
            ['Location', 'location', 'select', ['Office', 'Lab', 'Online']],
            ['Max Students', 'maxStudents', 'number']].map(([label, key, type, opts]) => (
            <div key={key}>
              <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>{label}</label>
              {type === 'select'
                ? <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui' }}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                : <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={label} style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box' }} />
              }
            </div>
          ))}
        </div>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }} style={{ marginTop: 14, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>
          {saved ? 'Saved!' : 'Add Open Hour'}
        </button>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 10 }}>Student Appointments</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {appointments.map((a, i) => (
          <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 9, padding: '12px 16px', display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eef2ff', color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, fontFamily: 'system-ui', flexShrink: 0 }}>{a.student.slice(0, 2).toUpperCase()}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>{a.student}</div>
              <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>{a.course} · {a.topic}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, fontFamily: 'system-ui' }}>{a.time}</div>
              <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>{a.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Work Load ────────────────────────────────────────────────────────────────
function WorkLoad() {
  const courses = [
    { code: 'CS6001', name: 'Data Warehousing', cls: 'III-CSE-A', credits: 4, hrsWeek: 4, type: 'Theory', enrolled: 62 },
    { code: 'CS6002', name: 'Compiler Design', cls: 'III-CSE-B', credits: 4, hrsWeek: 4, type: 'Theory', enrolled: 60 },
    { code: 'CS6081L', name: 'Data Warehousing Lab', cls: 'III-CSE-A', credits: 2, hrsWeek: 3, type: 'Lab', enrolled: 30 },
    { code: 'CS6082L', name: 'Compiler Design Lab', cls: 'III-CSE-B', credits: 2, hrsWeek: 3, type: 'Lab', enrolled: 30 },
    { code: 'CS6003T', name: 'Cloud Computing (Tutorial)', cls: 'III-CSE-A', credits: 0, hrsWeek: 1, type: 'Tutorial', enrolled: 62 },
  ]
  const theoryHrs = courses.filter(c => c.type !== 'Lab').reduce((a, c) => a + c.hrsWeek, 0)
  const labHrs = courses.filter(c => c.type === 'Lab').reduce((a, c) => a + c.hrsWeek, 0)
  const total = theoryHrs + labHrs
  const typeColor = { Theory: ['#eef2ff', ACCENT], Lab: ['#d1fae5', '#059669'], Tutorial: ['#fef3c7', '#b45309'] }
  const loadStatus = total >= 18 ? ['Overload', '#fee2e2', '#dc2626'] : total >= 16 ? ['Within Limit', '#dcfce7', '#15803d'] : ['Under Load', '#fef3c7', '#b45309']

  return (
    <div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['Teaching Hrs/Week', theoryHrs, ACCENT, '#eef2ff'], ['Lab Hrs/Week', labHrs, '#059669', '#d1fae5'], ['Total Contact Hrs', total, loadStatus[2], loadStatus[1]]].map(([label, val, color, bg]) => (
          <div key={label} style={{ flex: '1 1 140px', background: bg, borderRadius: 10, padding: '14px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: 'system-ui' }}>{val}</div>
            <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>{label}</div>
          </div>
        ))}
        <div style={{ flex: '1 1 160px', background: loadStatus[1], borderRadius: 10, padding: '14px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: loadStatus[2], fontFamily: 'system-ui' }}>{loadStatus[0]}</div>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>University norm: 16–18 hrs/week</div>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui' }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Course Code', 'Course Name', 'Class', 'Credits', 'Hrs/Week', 'Type', 'Students'].map(h => (
              <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => {
            const [tbg, tcl] = typeColor[c.type]
            return (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{c.code}</td>
                <td style={{ padding: '9px 10px', color: TEXT }}>{c.name}</td>
                <td style={{ padding: '9px 10px', color: MUTED }}>{c.cls}</td>
                <td style={{ padding: '9px 10px', color: TEXT, textAlign: 'center' }}>{c.credits}</td>
                <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 600, textAlign: 'center' }}>{c.hrsWeek}</td>
                <td style={{ padding: '9px 10px' }}><span style={{ background: tbg, color: tcl, fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{c.type}</span></td>
                <td style={{ padding: '9px 10px', color: MUTED, textAlign: 'center' }}>{c.enrolled}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Mark Configuration ───────────────────────────────────────────────────────
function MarkConfiguration() {
  const [selectedCourse, setSelectedCourse] = useState('CS6001')
  const courses = ['CS6001 — Data Warehousing', 'CS6002 — Compiler Design', 'CS6003 — Cloud Computing', 'CS6004 — Cryptography & Security']
  const [components, setComponents] = useState([
    { name: 'CA1', max: 20, passing: 10, weightage: 10 },
    { name: 'CA2', max: 20, passing: 10, weightage: 10 },
    { name: 'CA3', max: 20, passing: 10, weightage: 10 },
    { name: 'Model Exam', max: 50, passing: 25, weightage: 20 },
    { name: 'End Sem', max: 100, passing: 50, weightage: 50 },
  ])
  const [saved, setSaved] = useState(false)

  const update = (i, field, val) => setComponents(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: Number(val) } : c))

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Select Course</label>
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value.split(' ')[0])} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', width: 280 }}>
          {courses.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: MUTED, fontFamily: 'system-ui', marginBottom: 8 }}>Assessment Components — {selectedCourse}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', marginBottom: 16 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Component', 'Max Marks', 'Passing Marks', 'Weightage (%)'].map(h => (
              <th key={h} style={{ padding: '9px 12px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {components.map((c, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '9px 12px', fontWeight: 700, color: TEXT }}>{c.name}</td>
              <td style={{ padding: '9px 12px' }}>
                <input type="number" value={c.max} onChange={e => update(i, 'max', e.target.value)} style={{ width: 70, padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, fontFamily: 'system-ui' }} />
              </td>
              <td style={{ padding: '9px 12px' }}>
                <input type="number" value={c.passing} onChange={e => update(i, 'passing', e.target.value)} style={{ width: 70, padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, fontFamily: 'system-ui' }} />
              </td>
              <td style={{ padding: '9px 12px' }}>
                <input type="number" value={c.weightage} onChange={e => update(i, 'weightage', e.target.value)} style={{ width: 70, padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, fontFamily: 'system-ui' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Save Configuration</button>
        {saved && <span style={{ fontSize: 13, color: '#15803d', fontFamily: 'system-ui', fontWeight: 600 }}>Configuration saved!</span>}
        <div style={{ marginLeft: 'auto', fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>
          Total weightage: <strong style={{ color: components.reduce((a, c) => a + c.weightage, 0) === 100 ? '#15803d' : '#dc2626' }}>{components.reduce((a, c) => a + c.weightage, 0)}%</strong>
        </div>
      </div>
    </div>
  )
}

// ─── Project ──────────────────────────────────────────────────────────────────
function Project() {
  const [showForm, setShowForm] = useState(false)
  const stageColor = { Proposal: ['#fef3c7', '#b45309'], Review1: ['#dbeafe', '#1d4ed8'], Review2: ['#ede9fe', '#7c3aed'], Final: ['#dcfce7', '#15803d'] }
  const projects = [
    { title: 'AI-based Smart Attendance System', team: 'Arun, Divya, Karthik', sem: 6, stage: 'Review2', lastReview: 'May 10, 2025', nextReview: 'Jun 20, 2025' },
    { title: 'Blockchain-based Certificate Verification', team: 'Preethi, Ranjith, Siva', sem: 6, stage: 'Review1', lastReview: 'Apr 22, 2025', nextReview: 'Jun 5, 2025' },
    { title: 'Smart Parking IoT System', team: 'Meena, Kavi, Arjun', sem: 6, stage: 'Final', lastReview: 'May 28, 2025', nextReview: '—' },
    { title: 'NLP-based Exam Answer Evaluator', team: 'Surya, Priya, Deepak', sem: 6, stage: 'Proposal', lastReview: 'Mar 15, 2025', nextReview: 'Jun 8, 2025' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>Internal Projects — Guide Responsibilities</div>
        <button onClick={() => setShowForm(f => !f)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 12, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>+ Schedule Review</button>
      </div>

      {showForm && (
        <div style={{ border: '1px solid #c7d2fe', borderRadius: 10, padding: 18, background: '#fafbff', marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 12 }}>Schedule Review / Upload Comments</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[['Project', 'select', projects.map(p => p.title.slice(0, 30) + '...')], ['Review Type', 'select', ['Review 1', 'Review 2', 'Final Review']], ['Date', 'date', []], ['Venue', 'text', []]].map(([label, type, opts]) => (
              <div key={label}>
                <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>{label}</label>
                {type === 'select'
                  ? <select style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui' }}>
                      <option>Select...</option>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  : <input type={type} placeholder={label} style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box' }} />
                }
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Review Comments</label>
            <textarea rows={3} placeholder="Enter review remarks..." style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Upload Review Document</label>
            <div style={{ border: '2px dashed #c7d2fe', borderRadius: 8, padding: '16px', textAlign: 'center', background: '#fff', cursor: 'pointer' }}>
              <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>Drop PDF/DOCX here or <span style={{ color: ACCENT, fontWeight: 600 }}>browse</span></div>
            </div>
          </div>
          <button onClick={() => setShowForm(false)} style={{ marginTop: 12, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Save</button>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui' }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Project Title', 'Team', 'Sem', 'Stage', 'Last Review', 'Next Review'].map(h => (
              <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map((p, i) => {
            const [sbg, scl] = stageColor[p.stage]
            return (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 600, maxWidth: 200 }}>{p.title}</td>
                <td style={{ padding: '9px 10px', color: MUTED, fontSize: 12 }}>{p.team}</td>
                <td style={{ padding: '9px 10px', color: TEXT, textAlign: 'center' }}>{p.sem}</td>
                <td style={{ padding: '9px 10px' }}><span style={{ background: sbg, color: scl, fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{p.stage}</span></td>
                <td style={{ padding: '9px 10px', color: MUTED }}>{p.lastReview}</td>
                <td style={{ padding: '9px 10px', color: p.nextReview === '—' ? MUTED : ACCENT, fontWeight: p.nextReview === '—' ? 400 : 600 }}>{p.nextReview}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Co-Faculty WorkLoad ──────────────────────────────────────────────────────
function CoFacultyWorkLoad() {
  const [filterCourse, setFilterCourse] = useState('')
  const data = [
    { name: 'Dr. A. Meenakshi', course: 'CS6001 — Data Warehousing', section: 'III-CSE-B', hrsWeek: 4 },
    { name: 'Mr. K. Vignesh', course: 'CS6002 — Compiler Design', section: 'III-CSE-A', hrsWeek: 4 },
    { name: 'Ms. R. Divya', course: 'CS6003 — Cloud Computing', section: 'III-CSE-B', hrsWeek: 4 },
    { name: 'Mr. T. Arun Kumar', course: 'CS6001 — Data Warehousing', section: 'III-CSE-C', hrsWeek: 4 },
    { name: 'Dr. S. Priya', course: 'CS6004 — Cryptography & Security', section: 'III-CSE-A', hrsWeek: 3 },
    { name: 'Dr. R. Sundaramurthy', course: 'CS6002 — Compiler Design', section: 'III-CSE-C', hrsWeek: 4 },
  ]
  const courses = [...new Set(data.map(d => d.course.split(' — ')[0]))]
  const filtered = filterCourse ? data.filter(d => d.course.startsWith(filterCourse)) : data

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <label style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Filter by Course:</label>
        <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui' }}>
          <option value="">All Courses</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui' }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Faculty Name', 'Course', 'Section', 'Hrs/Week'].map(h => (
              <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((d, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 600 }}>{d.name}</td>
              <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 600 }}>{d.course}</td>
              <td style={{ padding: '9px 10px', color: MUTED }}>{d.section}</td>
              <td style={{ padding: '9px 10px', textAlign: 'center' }}>
                <span style={{ background: '#eef2ff', color: ACCENT, fontSize: 12, borderRadius: 8, padding: '2px 10px', fontWeight: 700 }}>{d.hrsWeek} hrs</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 14, fontSize: 12, color: MUTED, fontFamily: 'system-ui', background: '#f8fafc', borderRadius: 8, padding: '8px 14px' }}>
        Showing {filtered.length} of {data.length} co-faculty records. Use the filter above to narrow by course for coordination planning.
      </div>
    </div>
  )
}

const CONTENT_MAP = [OpenHours, WorkLoad, MarkConfiguration, Project, CoFacultyWorkLoad]

export default function FacultyAcademicsGeneral() {
  const [active, setActive] = useState(0)
  const ActiveComponent = CONTENT_MAP[active]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100%', padding: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>Academics — General</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Workload, open hours, marks configuration and project management</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', minHeight: 520 }}>
        <div style={{ width: 210, borderRight: '1px solid #e2e8f0', padding: '12px 0', flexShrink: 0 }}>
          {ITEMS.map((item, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              padding: '9px 16px', cursor: 'pointer', fontSize: 13,
              fontFamily: 'system-ui', color: active === i ? ACCENT : '#475569',
              background: active === i ? '#eef2ff' : 'transparent',
              borderLeft: active === i ? '3px solid #6366f1' : '3px solid transparent',
              fontWeight: active === i ? 600 : 400
            }}>{item}</div>
          ))}
        </div>
        <div style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}
