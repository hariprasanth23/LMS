import React, { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const NAV_ITEMS = [
  'Facility Registration',
  'Transport Registration',
  'PAT Registration',
  'Transcript Request',
  'Financial Assistance / Scholarship',
  'Achievements',
  'Programme Migration',
  'Late Hour Request',
  'Final Year Registration',
  'Certificate Upload',
  'eSanad Request',
]

const facilities = [
  { name: 'Gym', icon: '🏋️', capacity: 50, slots: 12 },
  { name: 'Swimming Pool', icon: '🏊', capacity: 30, slots: 5 },
  { name: 'Seminar Hall', icon: '🎤', capacity: 200, slots: 20 },
  { name: 'Conference Room', icon: '🏢', capacity: 25, slots: 8 },
  { name: 'Sports Complex', icon: '⚽', capacity: 100, slots: 30 },
  { name: 'Computer Lab (Extra Hours)', icon: '💻', capacity: 40, slots: 15 },
]

const registeredFacilities = [
  { name: 'Gym', registeredOn: '2024-06-01', validTill: '2024-06-30' },
  { name: 'Computer Lab (Extra Hours)', registeredOn: '2024-06-05', validTill: '2024-06-30' },
]

const busRoutes = [
  { no: 'R-01', route: 'Central Bus Stand → Campus', stops: 8, fee: 1200, seats: 5 },
  { no: 'R-02', route: 'Railway Station → Campus', stops: 6, fee: 900, seats: 0 },
  { no: 'R-03', route: 'West Nagar → Campus', stops: 10, fee: 1500, seats: 3 },
  { no: 'R-04', route: 'North Town → Campus', stops: 7, fee: 1100, seats: 12 },
  { no: 'R-05', route: 'East Colony → Campus', stops: 5, fee: 800, seats: 2 },
]

const patActivities = [
  { name: 'Yoga', days: 'Mon, Wed, Fri', time: '6:00 - 7:00 AM', instructor: 'Mr. Suresh', slots: 20 },
  { name: 'Aerobics', days: 'Tue, Thu', time: '6:00 - 7:00 AM', instructor: 'Ms. Priya', slots: 15 },
  { name: 'Zumba', days: 'Mon, Wed', time: '5:30 - 6:30 PM', instructor: 'Ms. Kavitha', slots: 8 },
  { name: 'Athletics', days: 'Daily', time: '5:00 - 6:30 AM', instructor: 'Mr. Rajan', slots: 30 },
  { name: 'Swimming', days: 'Tue, Thu, Sat', time: '6:00 - 7:30 AM', instructor: 'Mr. David', slots: 10 },
  { name: 'Martial Arts', days: 'Sat, Sun', time: '7:00 - 8:30 AM', instructor: 'Mr. Vikram', slots: 5 },
]

const scholarships = [
  { name: 'State Government Merit Scholarship', eligibility: 'First class in prev sem, Family income < 2.5L', amount: '₹10,000/year', deadline: '2024-07-31', category: 'Merit' },
  { name: 'Central Sector Scholarship', eligibility: '80%+ in Class 12, Family income < 4.5L', amount: '₹12,000/year', deadline: '2024-08-15', category: 'Merit' },
  { name: 'OBC Scholarship', eligibility: 'OBC Category, Family income < 1L', amount: '₹5,000/year', deadline: '2024-07-20', category: 'Category' },
  { name: 'Minority Scholarship', eligibility: 'Minority community, 50%+ in prev class', amount: '₹7,500/year', deadline: '2024-07-25', category: 'Category' },
  { name: 'Need-Based Financial Aid', eligibility: 'Family income < 1L, Regular attendance > 75%', amount: 'Up to ₹20,000/sem', deadline: '2024-07-10', category: 'Need' },
]

const myScholarshipApplications = [
  { name: 'State Government Merit Scholarship', date: '2024-06-10', status: 'Under Review' },
]

const myAchievements = [
  { category: 'Academic', title: 'Best Paper Award', event: 'National Tech Symposium', date: '2024-03-15', position: '1st', points: 10 },
  { category: 'Sports', title: 'Gold Medal', event: 'Inter-College Athletics Meet', date: '2024-02-20', position: '1st', points: 8 },
]

const transcriptRequests = [
  { id: 'TR2024001', purpose: 'Higher Studies', copies: 2, mode: 'Hard Copy', date: '2024-06-01', status: 'Processing', tracking: 'TRK001' },
]

const lateHourRequests = [
  { facility: 'Library', date: '2024-06-10', from: '8:00 PM', to: '10:00 PM', purpose: 'Exam Prep', status: 'Approved' },
  { facility: 'Computer Lab', date: '2024-06-12', from: '7:00 PM', to: '9:00 PM', purpose: 'Project Work', status: 'Pending' },
]

const uploadedCerts = [
  { type: 'Bonafide', desc: 'For bank loan', date: '2024-05-20', size: '240KB' },
  { type: 'TC', desc: 'Transfer certificate', date: '2024-04-10', size: '180KB' },
]

const esanadRequests = [
  { id: 'ESN001', type: 'Degree Certificate', purpose: 'Higher Studies', date: '2024-06-01', status: 'Processing', link: '' },
]

export default function ServicesGeneral() {
  const [active, setActive] = useState('Facility Registration')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  const [transportForm, setTransportForm] = useState({ route: '', stop: '', semester: '' })
  const [transcriptForm, setTranscriptForm] = useState({ purpose: '', copies: '1', mode: 'Hard Copy', address: '', urgency: 'Normal' })
  const [achievementForm, setAchievementForm] = useState({ category: '', title: '', event: '', date: '', position: '', cert: null })
  const [lateForm, setLateForm] = useState({ facility: '', date: '', from: '', to: '', purpose: '', count: '' })
  const [finalYearForm, setFinalYearForm] = useState({ title: '', domain: '', guide: '', coguide: '', industry: '', startDate: '', abstract: '' })
  const [certForm, setCertForm] = useState({ type: '', desc: '', file: null })
  const [esanadForm, setEsanadForm] = useState({ type: '', purpose: '', digilocker: '' })
  const [migrationForm, setMigrationForm] = useState({ current: '', desired: '', reason: '', doc: null })

  // ── Shared API submit helper ────────────────────────────────────────────────
  const [myRequests, setMyRequests] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const submitRequest = useCallback(async (requestType, details) => {
    setSubmitting(true)
    try {
      const res = await api.post('/services/requests', { requestType, details })
      setMyRequests(prev => [res.data.data, ...prev])
      toast.success('Request submitted successfully!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed')
      return false
    } finally {
      setSubmitting(false)
    }
  }, [])

  const navStyle = (item) => ({
    padding: '10px 18px',
    cursor: 'pointer',
    fontSize: 13,
    borderLeft: active === item ? '3px solid #6366f1' : '3px solid transparent',
    background: active === item ? '#eef2ff' : 'transparent',
    color: active === item ? ACCENT : TEXT,
    fontWeight: active === item ? 600 : 400,
    transition: 'all 0.15s',
    userSelect: 'none',
    lineHeight: 1.4,
  })

  const card = {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  }

  const btn = (variant = 'primary') => ({
    padding: '8px 18px',
    borderRadius: 8,
    border: variant === 'outline' ? '1px solid #e2e8f0' : 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    background: variant === 'primary' ? ACCENT : variant === 'danger' ? '#ef4444' : variant === 'success' ? '#10b981' : '#f1f5f9',
    color: variant === 'primary' || variant === 'danger' || variant === 'success' ? '#fff' : TEXT,
  })

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    fontSize: 14,
    color: TEXT,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const thStyle = {
    padding: '10px 14px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 600,
    color: MUTED,
    textTransform: 'uppercase',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc',
  }

  const tdStyle = {
    padding: '12px 14px',
    fontSize: 14,
    color: TEXT,
    borderBottom: '1px solid #f1f5f9',
  }

  const statusBadge = (status) => {
    const map = {
      'Approved': { bg: '#dcfce7', color: '#16a34a' },
      'Pending': { bg: '#fef9c3', color: '#854d0e' },
      'Processing': { bg: '#dbeafe', color: '#1d4ed8' },
      'Rejected': { bg: '#fee2e2', color: '#dc2626' },
      'Under Review': { bg: '#fef9c3', color: '#854d0e' },
      'Submitted': { bg: '#e0e7ff', color: '#4338ca' },
    }
    const sc = map[status] || { bg: '#f1f5f9', color: MUTED }
    return (
      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>
        {status}
      </span>
    )
  }

  const renderFacilityRegistration = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {facilities.map((f, i) => (
          <div key={i} style={{ ...card, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 15, color: TEXT, marginBottom: 8 }}>{f.name}</div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Capacity: {f.capacity}</div>
            <div style={{ fontSize: 12, color: f.slots > 0 ? '#16a34a' : '#dc2626', fontWeight: 600, marginBottom: 12 }}>
              {f.slots > 0 ? `${f.slots} slots available` : 'Fully Booked'}
            </div>
            <button style={{ ...btn(f.slots > 0 ? 'primary' : 'outline'), width: '100%' }} disabled={f.slots === 0}>
              {f.slots > 0 ? 'Register' : 'Full'}
            </button>
          </div>
        ))}
      </div>

      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12, color: TEXT }}>My Registered Facilities</div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
          <thead>
            <tr>
              {['Facility', 'Registered On', 'Valid Till', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {registeredFacilities.map((r, i) => (
              <tr key={i}>
                <td style={tdStyle}>{r.name}</td>
                <td style={tdStyle}>{r.registeredOn}</td>
                <td style={tdStyle}>{r.validTill}</td>
                <td style={tdStyle}>{statusBadge('Approved')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )

  const renderTransport = () => (
    <div>
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14, color: TEXT }}>Available Bus Routes</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {busRoutes.map((r, i) => (
          <div key={i} style={{ ...card, padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <div style={{ width: 52, height: 52, background: '#eef2ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: ACCENT, fontSize: 15 }}>
                {r.no}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{r.route}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{r.stops} stops</div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: TEXT }}>₹{r.fee.toLocaleString('en-IN')}/month</div>
              <div style={{ fontSize: 12, color: r.seats > 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                {r.seats > 0 ? `${r.seats} seats left` : 'Full'}
              </div>
            </div>
            <button style={btn(r.seats > 0 ? 'primary' : 'outline')} disabled={r.seats === 0}>
              {r.seats > 0 ? 'Register' : 'Waitlist'}
            </button>
          </div>
        ))}
      </div>

      <div style={{ ...card, padding: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Registration Form</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Select Route</label>
            <select style={inputStyle} value={transportForm.route} onChange={e => setTransportForm({ ...transportForm, route: e.target.value })}>
              <option value="">Choose route</option>
              {busRoutes.map(r => <option key={r.no} value={r.no}>{r.no} - {r.route}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Boarding Stop</label>
            <input style={inputStyle} placeholder="Your boarding stop" value={transportForm.stop} onChange={e => setTransportForm({ ...transportForm, stop: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Semester</label>
            <select style={inputStyle} value={transportForm.semester} onChange={e => setTransportForm({ ...transportForm, semester: e.target.value })}>
              <option value="">Select semester</option>
              {['Odd Semester 2024', 'Even Semester 2025'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <button style={btn('primary')} disabled={submitting} onClick={() => submitRequest('TRANSPORT', JSON.stringify(transportForm))}>
          {submitting ? 'Submitting…' : 'Submit Registration'}
        </button>
      </div>
    </div>
  )

  const renderPAT = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        {patActivities.map((a, i) => (
          <div key={i} style={{ ...card, padding: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: TEXT, marginBottom: 12 }}>{a.name}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: MUTED }}>Days: <span style={{ color: TEXT, fontWeight: 500 }}>{a.days}</span></div>
              <div style={{ fontSize: 12, color: MUTED }}>Time: <span style={{ color: TEXT, fontWeight: 500 }}>{a.time}</span></div>
              <div style={{ fontSize: 12, color: MUTED }}>Instructor: <span style={{ color: TEXT, fontWeight: 500 }}>{a.instructor}</span></div>
              <div style={{ fontSize: 12, color: a.slots > 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                {a.slots > 0 ? `${a.slots} slots left` : 'Full'}
              </div>
            </div>
            <button style={{ ...btn(a.slots > 0 ? 'primary' : 'outline') }} disabled={a.slots === 0}>
              {a.slots > 0 ? 'Register' : 'Full'}
            </button>
          </div>
        ))}
      </div>
      <div style={{ ...card, padding: 20, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#16a34a', marginBottom: 6 }}>Current PAT Enrollment</div>
        <div style={{ fontSize: 14, color: TEXT }}>Not enrolled in any PAT activity. Register above to get started.</div>
      </div>
    </div>
  )

  const renderTranscript = () => (
    <div>
      <div style={{ ...card, padding: 20, marginBottom: 20, background: '#fffbeb', border: '1px solid #fde68a' }}>
        <div style={{ fontWeight: 600, color: '#92400e', marginBottom: 4 }}>Processing Time Notice</div>
        <div style={{ fontSize: 13, color: '#78350f' }}>Normal: 5-7 working days | Urgent: 1-2 working days (additional charges may apply)</div>
      </div>

      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>New Transcript Request</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Purpose</label>
            <select style={inputStyle} value={transcriptForm.purpose} onChange={e => setTranscriptForm({ ...transcriptForm, purpose: e.target.value })}>
              <option value="">Select purpose</option>
              {['Higher Studies', 'Job', 'Other'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Number of Copies</label>
            <input type="number" min="1" max="10" style={inputStyle} value={transcriptForm.copies} onChange={e => setTranscriptForm({ ...transcriptForm, copies: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Mode of Delivery</label>
            <select style={inputStyle} value={transcriptForm.mode} onChange={e => setTranscriptForm({ ...transcriptForm, mode: e.target.value })}>
              {['Hard Copy', 'Soft Copy', 'Both'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Urgency</label>
            <select style={inputStyle} value={transcriptForm.urgency} onChange={e => setTranscriptForm({ ...transcriptForm, urgency: e.target.value })}>
              {['Normal', 'Urgent'].map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          {(transcriptForm.mode === 'Hard Copy' || transcriptForm.mode === 'Both') && (
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Delivery Address</label>
              <textarea style={{ ...inputStyle, height: 70, resize: 'vertical' }} placeholder="Full delivery address..." value={transcriptForm.address} onChange={e => setTranscriptForm({ ...transcriptForm, address: e.target.value })} />
            </div>
          )}
        </div>
        <button style={btn('primary')} disabled={submitting} onClick={() => submitRequest('TRANSCRIPT', JSON.stringify(transcriptForm))}>
          {submitting ? 'Submitting…' : 'Submit Request'}
        </button>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>Previous Requests</div>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr>{['ID', 'Purpose', 'Copies', 'Mode', 'Date', 'Status', 'Tracking'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {transcriptRequests.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.id}</td>
                <td style={tdStyle}>{r.purpose}</td>
                <td style={tdStyle}>{r.copies}</td>
                <td style={tdStyle}>{r.mode}</td>
                <td style={tdStyle}>{r.date}</td>
                <td style={tdStyle}>{statusBadge(r.status)}</td>
                <td style={tdStyle}>{r.tracking}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )

  const renderScholarship = () => (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        {scholarships.map((s, i) => (
          <div key={i} style={{ ...card, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: TEXT }}>{s.name}</div>
                <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#eef2ff', color: ACCENT }}>{s.category}</span>
              </div>
              <div style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>Eligibility: {s.eligibility}</div>
              <div style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>Amount: {s.amount}</div>
            </div>
            <div style={{ textAlign: 'right', marginLeft: 20 }}>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>Deadline: {s.deadline}</div>
              <button style={btn('primary')}>Apply</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>My Applications</div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
          <thead>
            <tr>{['Scholarship Name', 'Applied Date', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {myScholarshipApplications.map((a, i) => (
              <tr key={i}>
                <td style={tdStyle}>{a.name}</td>
                <td style={tdStyle}>{a.date}</td>
                <td style={tdStyle}>{statusBadge(a.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )

  const renderAchievements = () => (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Add Achievement</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Category</label>
            <select style={inputStyle} value={achievementForm.category} onChange={e => setAchievementForm({ ...achievementForm, category: e.target.value })}>
              <option value="">Select category</option>
              {['Academic', 'Sports', 'Cultural', 'Technical', 'National', 'International'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Title</label>
            <input style={inputStyle} placeholder="e.g. Best Paper Award" value={achievementForm.title} onChange={e => setAchievementForm({ ...achievementForm, title: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Event Name</label>
            <input style={inputStyle} placeholder="Event or competition name" value={achievementForm.event} onChange={e => setAchievementForm({ ...achievementForm, event: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Date</label>
            <input type="date" style={inputStyle} value={achievementForm.date} onChange={e => setAchievementForm({ ...achievementForm, date: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Position / Award</label>
            <input style={inputStyle} placeholder="e.g. 1st Place, Gold Medal" value={achievementForm.position} onChange={e => setAchievementForm({ ...achievementForm, position: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Certificate Upload</label>
            <input type="file" style={{ ...inputStyle, padding: '7px 12px' }} />
          </div>
        </div>
        <button style={btn('primary')} disabled={submitting} onClick={() => submitRequest('ACHIEVEMENT', JSON.stringify(achievementForm))}>
          {submitting ? 'Submitting…' : 'Add Achievement'}
        </button>
      </div>

      <div style={{ ...card, padding: '12px 20px', marginBottom: 16, background: '#eef2ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, color: ACCENT }}>Total Points Earned</span>
        <span style={{ fontSize: 24, fontWeight: 700, color: ACCENT }}>
          {myAchievements.reduce((s, a) => s + a.points, 0)} pts
        </span>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr>{['Category', 'Title', 'Event', 'Date', 'Position', 'Points', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {myAchievements.map((a, i) => (
              <tr key={i}>
                <td style={tdStyle}><span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 12, background: '#eef2ff', color: ACCENT }}>{a.category}</span></td>
                <td style={tdStyle}>{a.title}</td>
                <td style={tdStyle}>{a.event}</td>
                <td style={tdStyle}>{a.date}</td>
                <td style={tdStyle}>{a.position}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{a.points}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ ...btn('outline'), padding: '4px 10px', fontSize: 12, border: '1px solid #e2e8f0' }}>Edit</button>
                    <button style={{ ...btn('danger'), padding: '4px 10px', fontSize: 12 }}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )

  const renderProgrammeMigration = () => (
    <div>
      <div style={{ ...card, padding: 20, marginBottom: 20, background: '#fffbeb', border: '1px solid #fde68a' }}>
        <div style={{ fontWeight: 600, color: '#92400e', marginBottom: 8 }}>Eligibility Criteria</div>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#78350f', fontSize: 14 }}>
          <li>Minimum CGPA of 8.0</li>
          <li>No arrears / backlogs</li>
          <li>Must have completed at least 2 semesters</li>
          <li>HOD approval is mandatory for processing</li>
        </ul>
      </div>

      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Migration Request Form</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Current Programme</label>
            <input style={{ ...inputStyle, background: '#f8fafc', color: MUTED }} value="B.Tech — Computer Science (Readonly)" readOnly />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Desired Programme</label>
            <select style={inputStyle} value={migrationForm.desired} onChange={e => setMigrationForm({ ...migrationForm, desired: e.target.value })}>
              <option value="">Select programme</option>
              {['B.Tech — Electronics & Communication', 'B.Tech — Mechanical', 'B.Tech — Civil', 'B.Tech — Information Technology'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Reason for Migration</label>
            <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} placeholder="Explain your reason..." value={migrationForm.reason} onChange={e => setMigrationForm({ ...migrationForm, reason: e.target.value })} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Supporting Documents</label>
            <input type="file" style={{ ...inputStyle, padding: '7px 12px' }} />
          </div>
        </div>
        <div style={{ padding: '12px 16px', background: '#fff7ed', borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#92400e' }}>
          Note: HOD approval is required. Your request will be forwarded to your current HOD for approval.
        </div>
        <button style={btn('primary')} disabled={submitting} onClick={() => submitRequest('MIGRATION', JSON.stringify(migrationForm))}>
          {submitting ? 'Submitting…' : 'Submit Migration Request'}
        </button>
      </div>

      <div style={{ ...card, padding: 20, background: '#f8fafc' }}>
        <div style={{ color: MUTED, fontSize: 14, textAlign: 'center' }}>No previous migration requests found.</div>
      </div>
    </div>
  )

  const renderLateHour = () => (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>New Late Hour Request</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Facility</label>
            <select style={inputStyle} value={lateForm.facility} onChange={e => setLateForm({ ...lateForm, facility: e.target.value })}>
              <option value="">Select facility</option>
              {['Library', 'Computer Lab', 'Research Lab', 'Drawing Hall', 'Sports Complex'].map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Date</label>
            <input type="date" style={inputStyle} value={lateForm.date} onChange={e => setLateForm({ ...lateForm, date: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>From Time</label>
            <input type="time" style={inputStyle} value={lateForm.from} onChange={e => setLateForm({ ...lateForm, from: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>To Time</label>
            <input type="time" style={inputStyle} value={lateForm.to} onChange={e => setLateForm({ ...lateForm, to: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Number of Students</label>
            <input type="number" min="1" style={inputStyle} value={lateForm.count} onChange={e => setLateForm({ ...lateForm, count: e.target.value })} placeholder="1" />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Purpose</label>
            <input style={inputStyle} placeholder="Reason for late access" value={lateForm.purpose} onChange={e => setLateForm({ ...lateForm, purpose: e.target.value })} />
          </div>
        </div>
        <button style={btn('primary')} disabled={submitting} onClick={() => submitRequest('LATE_HOUR', JSON.stringify(lateForm))}>
          {submitting ? 'Submitting…' : 'Submit Request'}
        </button>
      </div>

      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>My Requests</div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
          <thead>
            <tr>{['Facility', 'Date', 'From', 'To', 'Purpose', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {lateHourRequests.map((r, i) => (
              <tr key={i}>
                <td style={tdStyle}>{r.facility}</td>
                <td style={tdStyle}>{r.date}</td>
                <td style={tdStyle}>{r.from}</td>
                <td style={tdStyle}>{r.to}</td>
                <td style={tdStyle}>{r.purpose}</td>
                <td style={tdStyle}>{statusBadge(r.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )

  const renderFinalYear = () => (
    <div>
      <div style={{ ...card, padding: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Final Year Project Registration</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Project Title</label>
            <input style={inputStyle} placeholder="Enter your project title" value={finalYearForm.title} onChange={e => setFinalYearForm({ ...finalYearForm, title: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Domain</label>
            <select style={inputStyle} value={finalYearForm.domain} onChange={e => setFinalYearForm({ ...finalYearForm, domain: e.target.value })}>
              <option value="">Select domain</option>
              {['Machine Learning / AI', 'Web Development', 'Mobile App', 'IoT', 'Cybersecurity', 'Data Science', 'Cloud Computing', 'Other'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Start Date</label>
            <input type="date" style={inputStyle} value={finalYearForm.startDate} onChange={e => setFinalYearForm({ ...finalYearForm, startDate: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Guide (Faculty)</label>
            <select style={inputStyle} value={finalYearForm.guide} onChange={e => setFinalYearForm({ ...finalYearForm, guide: e.target.value })}>
              <option value="">Select guide</option>
              {['Dr. A. Ramesh', 'Dr. B. Priya', 'Prof. C. Kumar', 'Dr. D. Meena', 'Prof. E. Suresh'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Co-Guide (Optional)</label>
            <select style={inputStyle} value={finalYearForm.coguide} onChange={e => setFinalYearForm({ ...finalYearForm, coguide: e.target.value })}>
              <option value="">Select co-guide (optional)</option>
              {['Dr. A. Ramesh', 'Dr. B. Priya', 'Prof. C. Kumar', 'Dr. D. Meena', 'Prof. E. Suresh'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Industry Partner (if applicable)</label>
            <input style={inputStyle} placeholder="Company name (optional)" value={finalYearForm.industry} onChange={e => setFinalYearForm({ ...finalYearForm, industry: e.target.value })} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Abstract</label>
            <textarea style={{ ...inputStyle, height: 100, resize: 'vertical' }} placeholder="Brief description of your project..." value={finalYearForm.abstract} onChange={e => setFinalYearForm({ ...finalYearForm, abstract: e.target.value })} />
          </div>
        </div>
        <button style={btn('primary')} disabled={submitting} onClick={() => submitRequest('FINAL_YEAR', JSON.stringify(finalYearForm))}>
          {submitting ? 'Submitting…' : 'Register Project'}
        </button>
      </div>
    </div>
  )

  const renderCertUpload = () => (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Upload Certificate</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Certificate Type</label>
            <select style={inputStyle} value={certForm.type} onChange={e => setCertForm({ ...certForm, type: e.target.value })}>
              <option value="">Select type</option>
              {['Bonafide', 'TC', 'Migration', 'Conduct', 'Degree', 'Others'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Description</label>
            <input style={inputStyle} placeholder="Brief description" value={certForm.desc} onChange={e => setCertForm({ ...certForm, desc: e.target.value })} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Upload File</label>
            <input type="file" style={{ ...inputStyle, padding: '7px 12px' }} />
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Accepted: PDF, JPG, PNG (max 10MB)</div>
          </div>
        </div>
        <button style={btn('primary')} disabled={submitting} onClick={() => submitRequest('CERTIFICATE', JSON.stringify(certForm))}>
          {submitting ? 'Submitting…' : 'Upload Certificate'}
        </button>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>Uploaded Certificates</div>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
          <thead>
            <tr>{['Type', 'Description', 'Date', 'Size', 'Download'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {uploadedCerts.map((c, i) => (
              <tr key={i}>
                <td style={tdStyle}><span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 12, background: '#eef2ff', color: ACCENT }}>{c.type}</span></td>
                <td style={tdStyle}>{c.desc}</td>
                <td style={tdStyle}>{c.date}</td>
                <td style={tdStyle}>{c.size}</td>
                <td style={tdStyle}>
                  <button style={{ ...btn('outline'), padding: '5px 12px', fontSize: 12, border: '1px solid #e2e8f0' }}>⬇ Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )

  const renderESanad = () => (
    <div>
      <div style={{ ...card, padding: 20, marginBottom: 20, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <div style={{ fontWeight: 600, color: '#1e40af', marginBottom: 6 }}>About eSanad</div>
        <div style={{ fontSize: 13, color: '#1e3a8a', lineHeight: 1.6 }}>
          eSanad is a Government of India initiative for online verification and attestation of academic certificates. Your certificates will be digitally signed and delivered to your DigiLocker account for instant sharing with employers and institutions.
        </div>
      </div>

      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>New eSanad Request</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Certificate Type</label>
            <select style={inputStyle} value={esanadForm.type} onChange={e => setEsanadForm({ ...esanadForm, type: e.target.value })}>
              <option value="">Select certificate</option>
              {['Degree Certificate', 'Provisional Certificate', 'Transcript', 'Migration Certificate', 'Conduct Certificate'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Purpose</label>
            <input style={inputStyle} placeholder="e.g. Job Application, Higher Studies" value={esanadForm.purpose} onChange={e => setEsanadForm({ ...esanadForm, purpose: e.target.value })} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>DigiLocker Account (Mobile / Aadhar linked)</label>
            <input style={inputStyle} placeholder="Enter your DigiLocker registered mobile number" value={esanadForm.digilocker} onChange={e => setEsanadForm({ ...esanadForm, digilocker: e.target.value })} />
          </div>
        </div>
        <button style={btn('primary')} disabled={submitting} onClick={() => submitRequest('ESANAD', JSON.stringify(esanadForm))}>
          {submitting ? 'Submitting…' : 'Submit eSanad Request'}
        </button>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>My eSanad Requests</div>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
          <thead>
            <tr>{['ID', 'Certificate Type', 'Purpose', 'Date', 'Status', 'DigiLocker Link'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {esanadRequests.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.id}</td>
                <td style={tdStyle}>{r.type}</td>
                <td style={tdStyle}>{r.purpose}</td>
                <td style={tdStyle}>{r.date}</td>
                <td style={tdStyle}>{statusBadge(r.status)}</td>
                <td style={tdStyle}>{r.link ? <a href={r.link} style={{ color: ACCENT }}>View</a> : <span style={{ color: MUTED }}>Pending</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )

  const contentMap = {
    'Facility Registration': renderFacilityRegistration,
    'Transport Registration': renderTransport,
    'PAT Registration': renderPAT,
    'Transcript Request': renderTranscript,
    'Financial Assistance / Scholarship': renderScholarship,
    'Achievements': renderAchievements,
    'Programme Migration': renderProgrammeMigration,
    'Late Hour Request': renderLateHour,
    'Final Year Registration': renderFinalYear,
    'Certificate Upload': renderCertUpload,
    'eSanad Request': renderESanad,
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: TEXT, margin: 0, marginBottom: 4 }}>Services — General</h1>
        <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>Facility registration, certificates, scholarships and more</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 520 }}>
        <div style={{
          width: isMobile ? '100%' : 210,
          borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
          borderBottom: isMobile ? '1px solid #e2e8f0' : 'none',
          padding: isMobile ? '8px 4px' : undefined,
          paddingTop: isMobile ? undefined : 8,
          paddingBottom: isMobile ? undefined : 8,
          flexShrink: 0,
          display: isMobile ? 'flex' : 'block',
          flexDirection: isMobile ? 'row' : undefined,
          flexWrap: isMobile ? 'wrap' : undefined,
          overflowX: isMobile ? 'auto' : undefined,
        }}>
          {NAV_ITEMS.map(item => (
            <div key={item} onClick={() => setActive(item)} style={{
              ...navStyle(item),
              padding: isMobile ? '6px 12px' : navStyle(item).padding,
              fontSize: isMobile ? 12 : navStyle(item).fontSize,
              borderLeft: isMobile ? 'none' : navStyle(item).borderLeft,
              borderBottom: isMobile ? (active === item ? '2px solid #6366f1' : '2px solid transparent') : 'none',
              borderRadius: isMobile ? 100 : 0,
              whiteSpace: 'nowrap',
            }}>
              {item}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, padding: isMobile ? '16px' : 28, overflowY: 'auto' }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: TEXT, marginBottom: 20 }}>{active}</div>
          {contentMap[active]?.()}
        </div>
      </div>
    </div>
  )
}
