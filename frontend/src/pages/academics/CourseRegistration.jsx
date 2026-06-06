import React, { useState, useEffect } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const ITEMS = [
  'WishList', 'Course Withdraw', 'EXC Registration', 'MOOC Registration',
  'Industrial Internship', 'Project', 'SET Conference Registration', 'Registration Schedule'
]

function WishList() {
  const [wishlist, setWishlist] = useState([
    { code: 'CS7001', name: 'Deep Learning', faculty: 'Dr. S. Priya', credits: 3, slot: 'A2', seats: 12, total: 30 },
    { code: 'CS7002', name: 'Blockchain Technology', faculty: 'Mr. K. Vignesh', credits: 3, slot: 'B2', seats: 5, total: 25 },
    { code: 'CS7003', name: 'Natural Language Processing', faculty: 'Dr. A. Meenakshi', credits: 3, slot: 'C2', seats: 18, total: 30 },
    { code: 'CS7004', name: 'Edge Computing', faculty: 'Mr. T. Arun Kumar', credits: 3, slot: 'D2', seats: 7, total: 20 },
    { code: 'MA7001', name: 'Operations Research', faculty: 'Dr. R. Ramya', credits: 4, slot: 'E2', seats: 22, total: 35 },
    { code: 'GE7001', name: 'Professional Ethics', faculty: 'Ms. P. Nithya', credits: 2, slot: 'F2', seats: 30, total: 40 }
  ])
  const remove = (code) => setWishlist(w => w.filter(c => c.code !== code))
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>
          Total wishlist: <span style={{ fontWeight: 700, color: ACCENT }}>{wishlist.length} courses</span>
        </div>
        <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>+ Browse Catalog</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 600 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Course Code', 'Name', 'Faculty', 'Credits', 'Slot', 'Seats', 'Actions'].map(h => (
              <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {wishlist.map((c, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{c.code}</td>
              <td style={{ padding: '9px 10px', color: TEXT }}>{c.name}</td>
              <td style={{ padding: '9px 10px', color: MUTED }}>{c.faculty}</td>
              <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 600, textAlign: 'center' }}>{c.credits}</td>
              <td style={{ padding: '9px 10px' }}><span style={{ background: '#eef2ff', color: ACCENT, fontSize: 11, borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>{c.slot}</span></td>
              <td style={{ padding: '9px 10px' }}>
                <div style={{ fontSize: 12, color: c.seats < 8 ? '#dc2626' : '#15803d', fontWeight: 600 }}>
                  {c.seats}/{c.total}
                </div>
              </td>
              <td style={{ padding: '9px 10px' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ background: '#dcfce7', color: '#15803d', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Register</button>
                  <button onClick={() => remove(c.code)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
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

function CourseWithdraw() {
  const courses = [
    { code: 'CS6001', name: 'Data Warehousing', credits: 4, faculty: 'Dr. Ramesh Kumar', eligible: true },
    { code: 'CS6002', name: 'Compiler Design', credits: 4, faculty: 'Ms. R. Divya', eligible: true },
    { code: 'CS6003', name: 'Cloud Computing', credits: 4, faculty: 'Dr. S. Priya', eligible: false },
    { code: 'CS6004', name: 'Cryptography & Security', credits: 3, faculty: 'Mr. T. Arun Kumar', eligible: false },
    { code: 'CS6005', name: 'Elective I — Big Data', credits: 3, faculty: 'Dr. A. Meenakshi', eligible: true },
    { code: 'CS6081', name: 'Project Phase I', credits: 4, faculty: 'Dr. S. Priya', eligible: false }
  ]
  return (
    <div>
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 16 }}>⚠️</span>
        <div style={{ fontSize: 13, fontFamily: 'system-ui' }}>
          <span style={{ fontWeight: 700, color: '#b45309' }}>Course Withdrawal Deadline: June 10, 2025</span>
          <span style={{ color: '#92400e' }}> — Courses marked as ineligible cannot be withdrawn after the deadline.</span>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 500 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Course Code', 'Name', 'Credits', 'Faculty', 'Action'].map(h => (
              <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', opacity: c.eligible ? 1 : 0.65 }}>
              <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{c.code}</td>
              <td style={{ padding: '9px 10px', color: TEXT }}>{c.name}</td>
              <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 600, textAlign: 'center' }}>{c.credits}</td>
              <td style={{ padding: '9px 10px', color: MUTED }}>{c.faculty}</td>
              <td style={{ padding: '9px 10px' }}>
                <button disabled={!c.eligible} style={{ background: c.eligible ? '#fee2e2' : '#f1f5f9', color: c.eligible ? '#dc2626' : '#94a3b8', border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 12, fontFamily: 'system-ui', cursor: c.eligible ? 'pointer' : 'not-allowed', fontWeight: 600 }}>
                  {c.eligible ? 'Withdraw' : 'Past Deadline'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

function EXCRegistration() {
  const [selected, setSelected] = useState('')
  const excCourses = [
    { code: 'EXC001', name: 'Design Thinking & Innovation', credits: 2, faculty: 'Dr. M. Suresh', slots: 8 },
    { code: 'EXC002', name: 'Entrepreneurship Development', credits: 2, faculty: 'Ms. L. Kaveri', slots: 5 },
    { code: 'EXC003', name: 'Universal Human Values', credits: 2, faculty: 'Dr. P. Anand', slots: 12 },
    { code: 'EXC004', name: 'Environmental Science', credits: 2, faculty: 'Mr. R. Balaji', slots: 3 }
  ]
  const registered = [
    { code: 'EXC005', name: 'Yoga & Wellness', credits: 2, status: 'Approved', sem: 4 }
  ]
  const selectedCourse = excCourses.find(c => c.code === selected)
  return (
    <div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>Register for Extra Credit Course (EXC)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Select EXC Course</label>
            <select value={selected} onChange={e => setSelected(e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%' }}>
              <option value="">Choose a course...</option>
              {excCourses.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
            </select>
          </div>
          {selectedCourse && (
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[['Faculty', selectedCourse.faculty], ['Credits', selectedCourse.credits], ['Seats Available', `${selectedCourse.slots} seats`]].map(([k, v]) => (
                <div key={k} style={{ fontSize: 13, fontFamily: 'system-ui' }}>
                  <div style={{ color: MUTED, marginBottom: 2 }}>{k}</div>
                  <div style={{ color: TEXT, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
          )}
          <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Register for EXC Course</button>
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 10 }}>Previously Registered EXC Courses</div>
      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 400 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Code', 'Course Name', 'Credits', 'Semester', 'Status'].map(h => (
              <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {registered.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{r.code}</td>
              <td style={{ padding: '9px 10px', color: TEXT }}>{r.name}</td>
              <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 600, textAlign: 'center' }}>{r.credits}</td>
              <td style={{ padding: '9px 10px', color: MUTED, textAlign: 'center' }}>Sem {r.sem}</td>
              <td style={{ padding: '9px 10px' }}><span style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

function MOOCRegistration() {
  const platforms = [
    { name: 'Coursera', icon: '🎓', color: '#0891b2', bg: '#e0f2fe', desc: 'Upload certificate from Coursera courses' },
    { name: 'NPTEL', icon: '🏛️', color: '#7c3aed', bg: '#ede9fe', desc: 'Recognized by AICTE — score & certificate required' },
    { name: 'Swayam', icon: '📚', color: '#059669', bg: '#d1fae5', desc: 'Government of India platform — proctored exam needed' },
    { name: 'edX', icon: '🌐', color: '#1d4ed8', bg: '#dbeafe', desc: 'MIT, Harvard and other partner courses' },
    { name: 'Udemy', icon: '🎯', color: '#b45309', bg: '#fef3c7', desc: 'Professional skill development courses' }
  ]
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 22 }}>
        {platforms.map((p, i) => (
          <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 9, padding: 14 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 8 }}>{p.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui', lineHeight: 1.4 }}>{p.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>Submit MOOC Completion</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Platform', type: 'select', options: ['Coursera', 'NPTEL', 'Swayam', 'edX', 'Udemy'] },
            { label: 'Course Name', type: 'text', placeholder: 'Enter exact course title...' },
            { label: 'Duration (Weeks)', type: 'number', placeholder: 'e.g. 8' },
            { label: 'Completion Date', type: 'date' }
          ].map((f, i) => (
            <div key={i}>
              <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>{f.label}</label>
              {f.type === 'select'
                ? <select style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%' }}>
                    <option value="">Select platform...</option>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                : <input type={f.type} placeholder={f.placeholder} style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%', boxSizing: 'border-box' }} />}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Upload Certificate</label>
          <div style={{ border: '2px dashed #c7d2fe', borderRadius: 8, padding: '18px 16px', textAlign: 'center', background: '#fafbff', cursor: 'pointer' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>📄</div>
            <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>Drag & drop certificate or <span style={{ color: ACCENT, fontWeight: 600 }}>browse</span></div>
            <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui', marginTop: 3 }}>PDF or JPG — max 5 MB</div>
          </div>
        </div>
        <button style={{ marginTop: 14, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600, width: '100%' }}>Submit for Credit Transfer</button>
      </div>
    </div>
  )
}

function IndustrialInternship() {
  const registered = [
    { company: 'Zoho Corporation', role: 'Software Intern', duration: '8 weeks', start: 'May 1, 2025', end: 'Jun 30, 2025', status: 'Ongoing' }
  ]
  return (
    <div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, marginBottom: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>Register Industrial Internship</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Company Name', placeholder: 'e.g. Infosys, TCS, Zoho...' },
            { label: 'Role / Designation', placeholder: 'e.g. Software Development Intern' },
            { label: 'Start Date', type: 'date' },
            { label: 'End Date', type: 'date' },
            { label: 'Duration (Weeks)', placeholder: 'e.g. 8', type: 'number' },
            { label: 'Stipend (if any)', placeholder: 'Enter monthly stipend or "Unpaid"' },
            { label: 'Mentor Name', placeholder: 'Industry mentor full name' },
            { label: 'Mentor Email', placeholder: 'mentor@company.com', type: 'email' }
          ].map((f, i) => (
            <div key={i}>
              <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input type={f.type || 'text'} placeholder={f.placeholder} style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Upload Offer Letter</label>
          <div style={{ border: '2px dashed #c7d2fe', borderRadius: 8, padding: '16px', textAlign: 'center', background: '#fafbff', cursor: 'pointer' }}>
            <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>📎 Drag & drop or <span style={{ color: ACCENT, fontWeight: 600 }}>browse</span> — PDF/JPG, max 5 MB</div>
          </div>
        </div>
        <button style={{ marginTop: 14, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600, width: '100%' }}>Submit Internship Details</button>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 10 }}>Registered Internships</div>
      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 500 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Company', 'Role', 'Duration', 'Start', 'End', 'Status'].map(h => (
              <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {registered.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '9px 10px', color: TEXT, fontWeight: 600 }}>{r.company}</td>
              <td style={{ padding: '9px 10px', color: MUTED }}>{r.role}</td>
              <td style={{ padding: '9px 10px', color: MUTED }}>{r.duration}</td>
              <td style={{ padding: '9px 10px', color: MUTED }}>{r.start}</td>
              <td style={{ padding: '9px 10px', color: MUTED }}>{r.end}</td>
              <td style={{ padding: '9px 10px' }}><span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

function Project() {
  const [type, setType] = useState('')
  const guides = ['Dr. R. Sundaramurthy', 'Dr. A. Meenakshi', 'Mr. K. Vignesh', 'Dr. S. Priya', 'Mr. T. Arun Kumar', 'Ms. R. Divya']
  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 16 }}>Project Registration Form</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Project Type</label>
            <select value={type} onChange={e => setType(e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%' }}>
              <option value="">Select project type...</option>
              <option>Internal — Department Project</option>
              <option>External — Industry Collaboration</option>
              <option>Industry Sponsored — Funded Project</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Project Title</label>
            <input placeholder="Enter project title..." style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Project Guide</label>
              <select style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%' }}>
                <option value="">Select guide...</option>
                {guides.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Team Size</label>
              <select style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%' }}>
                <option>2 members</option>
                <option>3 members</option>
                <option selected>4 members</option>
                <option>5 members</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Problem Statement</label>
            <textarea rows={4} placeholder="Describe the problem your project addresses..." style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5 }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Domain / Technology Stack</label>
            <input placeholder="e.g. Machine Learning, React, Node.js..." style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%', boxSizing: 'border-box' }} />
          </div>
          <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600 }}>Submit Project Proposal</button>
        </div>
      </div>
    </div>
  )
}

function SETConferenceRegistration() {
  const registered = [
    { conf: 'NCST 2025', date: 'Mar 15, 2025', venue: 'SRMIST, Chennai', title: 'Deep Learning for Medical Imaging', status: 'Presented' }
  ]
  return (
    <div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, marginBottom: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>Register for SET / Conference</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Conference Name', placeholder: 'Enter conference name...' },
            { label: 'Venue', placeholder: 'College / Location' },
            { label: 'Conference Date', type: 'date' },
            { label: 'Submission Deadline', type: 'date' },
            { label: 'Paper Title', placeholder: 'Full paper title...', full: true },
            { label: 'Co-authors', placeholder: 'Comma-separated names...', full: true }
          ].map((f, i) => (
            <div key={i} style={{ gridColumn: f.full ? '1 / -1' : 'auto' }}>
              <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input type={f.type || 'text'} placeholder={f.placeholder} style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui', width: '100%', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui', display: 'block', marginBottom: 4 }}>Upload Abstract / Paper</label>
          <div style={{ border: '2px dashed #c7d2fe', borderRadius: 8, padding: '14px', textAlign: 'center', background: '#fafbff', cursor: 'pointer' }}>
            <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui' }}>📄 Upload abstract or paper (PDF, max 10 MB)</div>
          </div>
        </div>
        <button style={{ marginTop: 14, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 600, width: '100%' }}>Register for Conference</button>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 10 }}>Registered Conferences</div>
      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'system-ui', minWidth: 500 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Conference', 'Date', 'Venue', 'Paper Title', 'Status'].map(h => (
              <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {registered.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{r.conf}</td>
              <td style={{ padding: '9px 10px', color: MUTED }}>{r.date}</td>
              <td style={{ padding: '9px 10px', color: MUTED }}>{r.venue}</td>
              <td style={{ padding: '9px 10px', color: TEXT }}>{r.title}</td>
              <td style={{ padding: '9px 10px' }}><span style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

function RegistrationSchedule() {
  const phases = [
    { phase: 'Phase 1 Registration', start: 'Apr 1, 2025', end: 'Apr 10, 2025', status: 'Completed', note: 'Initial course registration' },
    { phase: 'Withdrawal Window', start: 'Jun 1, 2025', end: 'Jun 10, 2025', status: 'Active', note: 'Drop courses without academic penalty' },
    { phase: 'EXC / MOOC Registration', start: 'Jun 5, 2025', end: 'Jun 15, 2025', status: 'Active', note: 'Extra credit & MOOC submissions' },
    { phase: 'Phase 2 Registration', start: 'Jun 12, 2025', end: 'Jun 18, 2025', status: 'Upcoming', note: 'Add courses for next semester' },
    { phase: 'Final Confirmation', start: 'Jun 22, 2025', end: 'Jun 25, 2025', status: 'Upcoming', note: 'Freeze and confirm all registrations' }
  ]
  const statusColor = {
    Completed: ['#dcfce7', '#15803d'],
    Active: ['#dbeafe', '#1d4ed8'],
    Upcoming: ['#f1f5f9', '#64748b']
  }
  return (
    <div>
      <div style={{ background: '#eef2ff', borderRadius: 8, padding: '10px 16px', marginBottom: 18, fontSize: 13, fontFamily: 'system-ui', color: ACCENT, fontWeight: 500 }}>
        Current date: <strong>June 5, 2025</strong> — The <strong>Withdrawal Window</strong> and <strong>EXC/MOOC Registration</strong> are currently active.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {phases.map((p, i) => {
          const [bg, color] = statusColor[p.status]
          const isActive = p.status === 'Active'
          return (
            <div key={i} style={{ border: `1px solid ${isActive ? '#bfdbfe' : '#e2e8f0'}`, borderLeft: `4px solid ${color}`, borderRadius: 9, padding: '14px 18px', background: isActive ? '#fafbff' : '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui' }}>{p.phase}</div>
                <span style={{ background: bg, color, fontSize: 11, borderRadius: 10, padding: '2px 10px', fontWeight: 700, fontFamily: 'system-ui' }}>{p.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 20, fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>
                <span>Start: <span style={{ color: TEXT, fontWeight: 500 }}>{p.start}</span></span>
                <span>End: <span style={{ color: TEXT, fontWeight: 500 }}>{p.end}</span></span>
                <span>{p.note}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const CONTENT_MAP = [
  WishList, CourseWithdraw, EXCRegistration, MOOCRegistration,
  IndustrialInternship, Project, SETConferenceRegistration, RegistrationSchedule
]

export default function CourseRegistration() {
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
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1e293b', fontFamily: 'system-ui' }}>Academics — Course Registration</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b', fontFamily: 'system-ui' }}>Register, withdraw, and manage your course enrollments</p>
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
