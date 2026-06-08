import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const ITEMS = ['WishList', 'Course Withdraw', 'EXC Registration', 'MOOC Registration',
  'Industrial Internship', 'Project', 'SET Conference Registration', 'Registration Schedule']

function Loading() { return <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontSize: 14 }}>Loading…</div> }
function Th({ children }) { return <th style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #e2e8f0', background: BG, whiteSpace: 'nowrap' }}>{children}</th> }
function Td({ children, style = {} }) { return <td style={{ padding: '9px 10px', color: TEXT, fontSize: 13, borderBottom: '1px solid #f8fafc', ...style }}>{children}</td> }

// ── WishList ──────────────────────────────────────────────────────────────────
function WishList() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/academics/wishlist')
      .then(r => setWishlist(r.data.data || []))
      .catch(() => toast.error('Failed to load wishlist'))
      .finally(() => setLoading(false))
  }, [])

  const remove = async (courseCode) => {
    try {
      await api.delete(`/academics/wishlist/${courseCode}`)
      setWishlist(w => w.filter(c => c.courseCode !== courseCode))
      toast.success('Removed from wishlist')
    } catch { toast.error('Failed to remove') }
  }

  const register = async (course) => {
    try {
      await api.post('/academics/exc/register', { courseCode: course.courseCode, courseName: course.courseName })
      toast.success(`Registered for ${course.courseCode}`)
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed') }
  }

  if (loading) return <Loading />
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: MUTED }}>Total wishlist: <span style={{ fontWeight: 700, color: ACCENT }}>{wishlist.length} courses</span></div>
      </div>
      {wishlist.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: MUTED }}>Your wishlist is empty</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
            <thead><tr><Th>Course Code</Th><Th>Name</Th><Th>Faculty</Th><Th>Credits</Th><Th>Slot</Th><Th>Seats</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {wishlist.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <Td style={{ color: ACCENT, fontWeight: 700 }}>{c.courseCode}</Td>
                  <Td>{c.courseName}</Td>
                  <Td style={{ color: MUTED }}>{c.faculty}</Td>
                  <Td style={{ textAlign: 'center', fontWeight: 600 }}>{c.credits}</Td>
                  <Td><span style={{ background: '#eef2ff', color: ACCENT, fontSize: 11, borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>{c.slot}</span></Td>
                  <Td>
                    {c.seatsAvailable != null && <div style={{ fontSize: 12, color: c.seatsAvailable < 8 ? '#dc2626' : '#15803d', fontWeight: 600 }}>{c.seatsAvailable}/{c.totalSeats}</div>}
                  </Td>
                  <Td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => register(c)} style={{ background: '#dcfce7', color: '#15803d', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>Register</button>
                      <button onClick={() => remove(c.courseCode)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Course Withdraw ───────────────────────────────────────────────────────────
function CourseWithdraw() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/academics/courses/registered')
      .then(r => setCourses(r.data.data || []))
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  return (
    <div>
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13 }}>
        <span style={{ fontWeight: 700, color: '#b45309' }}>Course Withdrawal Deadline: </span>
        <span style={{ color: '#92400e' }}>Courses can be withdrawn during the active withdrawal window without academic penalty.</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
          <thead><tr><Th>Course Code</Th><Th>Name</Th><Th>Credits</Th><Th>Faculty</Th><Th>Action</Th></tr></thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', opacity: c.eligible ? 1 : 0.65 }}>
                <Td style={{ color: ACCENT, fontWeight: 700 }}>{c.code}</Td>
                <Td>{c.name}</Td>
                <Td style={{ textAlign: 'center', fontWeight: 600 }}>{c.credits}</Td>
                <Td style={{ color: MUTED }}>{c.faculty}</Td>
                <Td>
                  <button disabled={!c.eligible} style={{ background: c.eligible ? '#fee2e2' : '#f1f5f9', color: c.eligible ? '#dc2626' : '#94a3b8', border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 12, cursor: c.eligible ? 'pointer' : 'not-allowed', fontWeight: 600 }}>
                    {c.eligible ? 'Withdraw' : 'Past Deadline'}
                  </button>
                </Td>
              </tr>
            ))}
            {courses.length === 0 && <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center', color: MUTED }}>No enrolled courses found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── EXC Registration ──────────────────────────────────────────────────────────
function EXCRegistration() {
  const [available, setAvailable] = useState([])
  const [registered, setRegistered] = useState([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([api.get('/academics/exc/available'), api.get('/academics/exc/registered')])
      .then(([avRes, regRes]) => { setAvailable(avRes.data.data || []); setRegistered(regRes.data.data || []) })
      .catch(() => toast.error('Failed to load EXC data'))
      .finally(() => setLoading(false))
  }, [])

  const selectedCourse = available.find(c => c.code === selected)

  const handleRegister = async () => {
    if (!selectedCourse) return
    setSubmitting(true)
    try {
      const res = await api.post('/academics/exc/register', {
        courseCode: selectedCourse.code, courseName: selectedCourse.name,
        faculty: selectedCourse.faculty, credits: selectedCourse.credits,
      })
      setRegistered(prev => [res.data.data, ...prev])
      setSelected('')
      toast.success('Registered for EXC course!')
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed') }
    finally { setSubmitting(false) }
  }

  if (loading) return <Loading />
  return (
    <div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Register for Extra Credit Course (EXC)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Select EXC Course</label>
            <select value={selected} onChange={e => setSelected(e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, width: '100%' }}>
              <option value="">Choose a course...</option>
              {available.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
            </select>
          </div>
          {selectedCourse && (
            <div style={{ background: BG, borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[['Faculty', selectedCourse.faculty], ['Credits', selectedCourse.credits], ['Seats Available', `${selectedCourse.slots} seats`]].map(([k, v]) => (
                <div key={k} style={{ fontSize: 13 }}>
                  <div style={{ color: MUTED, marginBottom: 2 }}>{k}</div>
                  <div style={{ color: TEXT, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
          )}
          <button onClick={handleRegister} disabled={!selected || submitting}
            style={{ background: selected ? ACCENT : '#e2e8f0', color: selected ? '#fff' : MUTED, border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, cursor: selected ? 'pointer' : 'not-allowed', fontWeight: 600 }}>
            {submitting ? 'Registering…' : 'Register for EXC Course'}
          </button>
        </div>
      </div>
      {registered.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Previously Registered EXC Courses</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 400 }}>
              <thead><tr><Th>Code</Th><Th>Course Name</Th><Th>Credits</Th><Th>Semester</Th><Th>Status</Th></tr></thead>
              <tbody>
                {registered.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Td style={{ color: ACCENT, fontWeight: 700 }}>{r.courseCode}</Td>
                    <Td>{r.courseName}</Td>
                    <Td style={{ textAlign: 'center', fontWeight: 600 }}>{r.credits}</Td>
                    <Td style={{ textAlign: 'center', color: MUTED }}>{r.semester ? `Sem ${r.semester}` : '—'}</Td>
                    <Td><span style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{r.status}</span></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

// ── MOOC Registration ─────────────────────────────────────────────────────────
function MOOCRegistration() {
  const [moocs, setMoocs] = useState([])
  const [form, setForm] = useState({ platform: '', courseName: '', durationWeeks: '', completionDate: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/academics/mooc').then(r => setMoocs(r.data.data || [])).catch(() => {})
  }, [])

  const platforms = [
    { name: 'Coursera', icon: '🎓', color: '#0891b2', desc: 'Upload certificate from Coursera courses' },
    { name: 'NPTEL',    icon: '🏛️', color: '#7c3aed', desc: 'Recognized by AICTE — score & certificate required' },
    { name: 'Swayam',   icon: '📚', color: '#059669', desc: 'Government of India platform — proctored exam needed' },
    { name: 'edX',      icon: '🌐', color: '#1d4ed8', desc: 'MIT, Harvard and other partner courses' },
    { name: 'Udemy',    icon: '🎯', color: '#b45309', desc: 'Professional skill development courses' },
  ]

  const handleSubmit = async () => {
    if (!form.platform || !form.courseName) { toast.error('Fill platform and course name'); return }
    setSubmitting(true)
    try {
      const res = await api.post('/academics/mooc', form)
      setMoocs(prev => [res.data.data, ...prev])
      setForm({ platform: '', courseName: '', durationWeeks: '', completionDate: '' })
      toast.success('MOOC submitted for credit transfer!')
    } catch { toast.error('Submission failed') }
    finally { setSubmitting(false) }
  }

  const statusBadge = (s) => ({ Pending: '#d97706', Verified: '#16a34a', Rejected: '#dc2626' }[s] || MUTED)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 22 }}>
        {platforms.map((p, i) => (
          <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 9, padding: 14 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: p.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 8 }}>{p.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>{p.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Submit MOOC Completion</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Platform', key: 'platform', type: 'select', options: ['Coursera', 'NPTEL', 'Swayam', 'edX', 'Udemy'] },
            { label: 'Course Name', key: 'courseName', type: 'text', placeholder: 'Enter exact course title...' },
            { label: 'Duration (Weeks)', key: 'durationWeeks', type: 'number', placeholder: 'e.g. 8' },
            { label: 'Completion Date', key: 'completionDate', type: 'date' },
          ].map((f) => (
            <div key={f.key}>
              <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>{f.label}</label>
              {f.type === 'select'
                ? <select value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, width: '100%' }}>
                    <option value="">Select platform...</option>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                : <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, width: '100%', boxSizing: 'border-box' }} />}
            </div>
          ))}
        </div>
        <button onClick={handleSubmit} disabled={submitting}
          style={{ marginTop: 14, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, cursor: 'pointer', fontWeight: 600, width: '100%' }}>
          {submitting ? 'Submitting…' : 'Submit for Credit Transfer'}
        </button>
      </div>
      {moocs.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 400 }}>
            <thead><tr><Th>Platform</Th><Th>Course Name</Th><Th>Duration</Th><Th>Completion</Th><Th>Status</Th></tr></thead>
            <tbody>
              {moocs.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <Td style={{ fontWeight: 600 }}>{m.platform}</Td>
                  <Td>{m.courseName}</Td>
                  <Td>{m.durationWeeks ? `${m.durationWeeks} weeks` : '—'}</Td>
                  <Td>{m.completionDate || '—'}</Td>
                  <Td><span style={{ background: statusBadge(m.status) + '18', color: statusBadge(m.status), borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{m.status}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Industrial Internship ─────────────────────────────────────────────────────
function IndustrialInternship() {
  const [internships, setInternships] = useState([])
  const [form, setForm] = useState({ companyName: '', role: '', startDate: '', endDate: '', durationWeeks: '', stipend: '', mentorName: '', mentorEmail: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/academics/internship').then(r => setInternships(r.data.data || [])).catch(() => {})
  }, [])

  const handleSubmit = async () => {
    if (!form.companyName || !form.role) { toast.error('Fill company name and role'); return }
    setSubmitting(true)
    try {
      const res = await api.post('/academics/internship', form)
      setInternships(prev => [res.data.data, ...prev])
      setForm({ companyName: '', role: '', startDate: '', endDate: '', durationWeeks: '', stipend: '', mentorName: '', mentorEmail: '' })
      toast.success('Internship registered!')
    } catch { toast.error('Submission failed') }
    finally { setSubmitting(false) }
  }

  return (
    <div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, marginBottom: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Register Industrial Internship</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Company Name', key: 'companyName', placeholder: 'e.g. Infosys, TCS, Zoho...' },
            { label: 'Role / Designation', key: 'role', placeholder: 'e.g. Software Development Intern' },
            { label: 'Start Date', key: 'startDate', type: 'date' },
            { label: 'End Date', key: 'endDate', type: 'date' },
            { label: 'Duration (Weeks)', key: 'durationWeeks', placeholder: 'e.g. 8', type: 'number' },
            { label: 'Stipend', key: 'stipend', placeholder: 'Monthly stipend or "Unpaid"' },
            { label: 'Mentor Name', key: 'mentorName', placeholder: 'Industry mentor full name' },
            { label: 'Mentor Email', key: 'mentorEmail', placeholder: 'mentor@company.com', type: 'email' },
          ].map((f) => (
            <div key={f.key}>
              <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, width: '100%', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
        <button onClick={handleSubmit} disabled={submitting}
          style={{ marginTop: 14, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, cursor: 'pointer', fontWeight: 600, width: '100%' }}>
          {submitting ? 'Submitting…' : 'Submit Internship Details'}
        </button>
      </div>
      {internships.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Registered Internships</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
              <thead><tr><Th>Company</Th><Th>Role</Th><Th>Duration</Th><Th>Start</Th><Th>End</Th><Th>Status</Th></tr></thead>
              <tbody>
                {internships.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Td style={{ fontWeight: 600 }}>{r.companyName}</Td>
                    <Td style={{ color: MUTED }}>{r.role}</Td>
                    <Td style={{ color: MUTED }}>{r.durationWeeks ? `${r.durationWeeks} weeks` : '—'}</Td>
                    <Td style={{ color: MUTED }}>{r.startDate || '—'}</Td>
                    <Td style={{ color: MUTED }}>{r.endDate || '—'}</Td>
                    <Td><span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{r.status}</span></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

// ── Project (placeholder — uses academics/projects/apply) ─────────────────────
function Project() {
  const [type, setType] = useState('')
  const guides = ['Dr. R. Sundaramurthy', 'Dr. A. Meenakshi', 'Mr. K. Vignesh', 'Dr. S. Priya', 'Mr. T. Arun Kumar', 'Ms. R. Divya']
  const [form, setForm] = useState({ projectType: '', title: '', guide: '', teamSize: '4 members', problemStatement: '', domain: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!form.title || !form.projectType) { toast.error('Fill project type and title'); return }
    setSubmitting(true)
    try {
      // store as a project application with a synthetic id
      await api.post('/academics/projects/apply', { projectId: Date.now(), title: form.title, faculty: form.guide })
      setForm({ projectType: '', title: '', guide: '', teamSize: '4 members', problemStatement: '', domain: '' })
      toast.success('Project proposal submitted!')
    } catch (err) { toast.error(err.response?.data?.message || 'Submission failed') }
    finally { setSubmitting(false) }
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 16 }}>Project Registration Form</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Project Type', key: 'projectType', type: 'select', options: ['Internal — Department Project', 'External — Industry Collaboration', 'Industry Sponsored — Funded Project'] },
            { label: 'Project Title', key: 'title', placeholder: 'Enter project title...' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>{f.label}</label>
              {f.type === 'select'
                ? <select value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, width: '100%' }}>
                    <option value="">Select project type...</option>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                : <input placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, width: '100%', boxSizing: 'border-box' }} />}
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Project Guide</label>
              <select value={form.guide} onChange={e => setForm(p => ({ ...p, guide: e.target.value }))}
                style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, width: '100%' }}>
                <option value="">Select guide...</option>
                {guides.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Team Size</label>
              <select value={form.teamSize} onChange={e => setForm(p => ({ ...p, teamSize: e.target.value }))}
                style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, width: '100%' }}>
                {['2 members', '3 members', '4 members', '5 members'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Problem Statement</label>
            <textarea rows={4} placeholder="Describe the problem your project addresses..." value={form.problemStatement}
              onChange={e => setForm(p => ({ ...p, problemStatement: e.target.value }))}
              style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, width: '100%', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>Domain / Technology Stack</label>
            <input placeholder="e.g. Machine Learning, React, Node.js..." value={form.domain}
              onChange={e => setForm(p => ({ ...p, domain: e.target.value }))}
              style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, width: '100%', boxSizing: 'border-box' }} />
          </div>
          <button onClick={handleSubmit} disabled={submitting}
            style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
            {submitting ? 'Submitting…' : 'Submit Project Proposal'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── SET Conference Registration ───────────────────────────────────────────────
function SETConferenceRegistration() {
  const [conferences, setConferences] = useState([])
  const [form, setForm] = useState({ conferenceName: '', venue: '', conferenceDate: '', submissionDeadline: '', paperTitle: '', coAuthors: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/academics/conference').then(r => setConferences(r.data.data || [])).catch(() => {})
  }, [])

  const handleSubmit = async () => {
    if (!form.conferenceName) { toast.error('Enter conference name'); return }
    setSubmitting(true)
    try {
      const res = await api.post('/academics/conference', form)
      setConferences(prev => [res.data.data, ...prev])
      setForm({ conferenceName: '', venue: '', conferenceDate: '', submissionDeadline: '', paperTitle: '', coAuthors: '' })
      toast.success('Conference registered!')
    } catch { toast.error('Submission failed') }
    finally { setSubmitting(false) }
  }

  return (
    <div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, marginBottom: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Register for SET / Conference</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Conference Name', key: 'conferenceName', placeholder: 'Enter conference name...' },
            { label: 'Venue', key: 'venue', placeholder: 'College / Location' },
            { label: 'Conference Date', key: 'conferenceDate', type: 'date' },
            { label: 'Submission Deadline', key: 'submissionDeadline', type: 'date' },
            { label: 'Paper Title', key: 'paperTitle', placeholder: 'Full paper title...', full: true },
            { label: 'Co-authors', key: 'coAuthors', placeholder: 'Comma-separated names...', full: true },
          ].map((f) => (
            <div key={f.key} style={{ gridColumn: f.full ? '1 / -1' : 'auto' }}>
              <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, width: '100%', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
        <button onClick={handleSubmit} disabled={submitting}
          style={{ marginTop: 14, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, cursor: 'pointer', fontWeight: 600, width: '100%' }}>
          {submitting ? 'Registering…' : 'Register for Conference'}
        </button>
      </div>
      {conferences.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Registered Conferences</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
              <thead><tr><Th>Conference</Th><Th>Date</Th><Th>Venue</Th><Th>Paper Title</Th><Th>Status</Th></tr></thead>
              <tbody>
                {conferences.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Td style={{ color: ACCENT, fontWeight: 700 }}>{r.conferenceName}</Td>
                    <Td style={{ color: MUTED }}>{r.conferenceDate || '—'}</Td>
                    <Td style={{ color: MUTED }}>{r.venue || '—'}</Td>
                    <Td>{r.paperTitle || '—'}</Td>
                    <Td><span style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{r.status}</span></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

// ── Registration Schedule ─────────────────────────────────────────────────────
function RegistrationSchedule() {
  const [phases, setPhases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/academics/registration-schedule')
      .then(r => setPhases(r.data.data || []))
      .catch(() => toast.error('Failed to load schedule'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  const statusColor = { Completed: ['#dcfce7', '#15803d'], Active: ['#dbeafe', '#1d4ed8'], Upcoming: ['#f1f5f9', '#64748b'] }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {phases.map((p, i) => {
          const [bg, color] = statusColor[p.status] || ['#f1f5f9', MUTED]
          const isActive = p.status === 'Active'
          return (
            <div key={i} style={{ border: `1px solid ${isActive ? '#bfdbfe' : '#e2e8f0'}`, borderLeft: `4px solid ${color}`, borderRadius: 9, padding: '14px 18px', background: isActive ? '#fafbff' : '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{p.phase}</div>
                <span style={{ background: bg, color, fontSize: 11, borderRadius: 10, padding: '2px 10px', fontWeight: 700 }}>{p.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 20, fontSize: 12, color: MUTED }}>
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

const CONTENT_MAP = [WishList, CourseWithdraw, EXCRegistration, MOOCRegistration,
  IndustrialInternship, Project, SETConferenceRegistration, RegistrationSchedule]

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
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: TEXT }}>Academics — Course Registration</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED }}>Register, withdraw, and manage your course enrollments</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 520 }}>
        <div style={{
          width: isMobile ? '100%' : 210, borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
          borderBottom: isMobile ? '1px solid #e2e8f0' : 'none', padding: isMobile ? '8px 4px' : '12px 0',
          flexShrink: 0, display: isMobile ? 'flex' : 'block', flexWrap: isMobile ? 'wrap' : undefined, overflowX: isMobile ? 'auto' : undefined,
        }}>
          {ITEMS.map((item, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              padding: isMobile ? '6px 12px' : '9px 16px', cursor: 'pointer', fontSize: isMobile ? 12 : 13,
              color: active === i ? ACCENT : '#475569', background: active === i ? '#eef2ff' : 'transparent',
              borderLeft: isMobile ? 'none' : (active === i ? '3px solid #6366f1' : '3px solid transparent'),
              borderBottom: isMobile ? (active === i ? '2px solid #6366f1' : '2px solid transparent') : 'none',
              borderRadius: isMobile ? 100 : 0, fontWeight: active === i ? 600 : 400, whiteSpace: 'nowrap',
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
