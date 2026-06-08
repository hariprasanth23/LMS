import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'
const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['Dashboard', 'Job Board', 'Alumni Directory', 'Events', 'Give Back', 'My Profile']

const jobListings = [
  { title: 'Senior Software Engineer', company: 'Zoho Corporation', location: 'Chennai', type: 'Full-time', posted: '2 days ago', salary: '₹18–25 LPA', skills: ['Java', 'React', 'AWS'] },
  { title: 'Data Scientist', company: 'TATA Consultancy Services', location: 'Bangalore', type: 'Full-time', posted: '5 days ago', salary: '₹15–22 LPA', skills: ['Python', 'ML', 'SQL'] },
  { title: 'Cloud Architect', company: 'Infosys', location: 'Hyderabad', type: 'Full-time', posted: '1 week ago', salary: '₹25–35 LPA', skills: ['AWS', 'Azure', 'Kubernetes'] },
  { title: 'Product Manager', company: 'Freshworks', location: 'Chennai', type: 'Full-time', posted: '3 days ago', salary: '₹20–30 LPA', skills: ['Product Strategy', 'Agile', 'Analytics'] },
  { title: 'ML Engineer', company: 'Ola Electric', location: 'Bangalore', type: 'Full-time', posted: '1 day ago', salary: '₹16–24 LPA', skills: ['PyTorch', 'TensorFlow', 'Python'] },
]

const alumniDirectory = [
  { name: 'Priya Ramesh', batch: '2018', company: 'Google', role: 'Software Engineer', location: 'Bangalore' },
  { name: 'Karthik Suresh', batch: '2019', company: 'Microsoft', role: 'Product Manager', location: 'Hyderabad' },
  { name: 'Meena Venkat', batch: '2017', company: 'Amazon', role: 'Data Scientist', location: 'Bangalore' },
  { name: 'Rahul Sharma', batch: '2020', company: 'Zoho', role: 'Backend Engineer', location: 'Chennai' },
  { name: 'Ananya Krishnan', batch: '2016', company: 'Infosys', role: 'Cloud Architect', location: 'Pune' },
  { name: 'Vijay Babu', batch: '2021', company: 'Freshworks', role: 'Frontend Developer', location: 'Chennai' },
]

const upcomingEvents = [
  { title: 'Annual Alumni Meet 2025', date: 'Dec 20, 2025', venue: 'College Auditorium', type: 'In-person', registered: false },
  { title: 'Tech Talk: AI in Production', date: 'Jul 15, 2025', venue: 'Online (Zoom)', type: 'Virtual', registered: true },
  { title: 'Career Fair 2025', date: 'Aug 5, 2025', venue: 'College Ground, Block A', type: 'In-person', registered: false },
]

export default function AlumniPortal() {
  const { user } = useAuth()
  const [active, setActive] = useState('Dashboard')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  useEffect(() => {
    api.get('/auth/me').then(r => setProfile(r.data.data)).catch(() => {})
  }, [])

  const navStyle = (item) => ({
    display: isMobile ? 'inline-block' : 'block',
    width: isMobile ? 'auto' : '100%',
    padding: isMobile ? '6px 12px' : '10px 18px',
    background: active === item ? '#eef2ff' : 'transparent',
    border: 'none',
    borderLeft: isMobile ? 'none' : (active === item ? `3px solid ${ACCENT}` : '3px solid transparent'),
    borderBottom: isMobile ? (active === item ? '2px solid #6366f1' : '2px solid transparent') : 'none',
    borderRadius: isMobile ? 100 : 0,
    textAlign: 'left',
    fontSize: isMobile ? 12 : 14,
    fontWeight: active === item ? 600 : 400,
    color: active === item ? ACCENT : TEXT,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  })

  function Dashboard() {
    return (
      <div>
        <div style={{ ...card, padding: 28, marginBottom: 20, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#fff', borderRadius: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Welcome back, {profile?.name?.split(' ')[0] || 'Alumni'}! 👋</div>
          <div style={{ fontSize: 14, opacity: 0.85 }}>B.E. Computer Science & Engineering · Batch 2018–2022</div>
          <div style={{ display: 'flex', gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
            {[['Networks', '342', '👥'], ['Events Attended', '5', '🎓'], ['Jobs Referred', '3', '💼']].map(([label, val, icon]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 22 }}>{icon}</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {[
            { title: 'New Job Listings', value: jobListings.length, sub: 'Matching your profile', icon: '💼', color: '#6366f1', bg: '#eef2ff', action: () => setActive('Job Board') },
            { title: 'Upcoming Events', value: upcomingEvents.length, sub: 'Register to attend', icon: '📅', color: '#10b981', bg: '#f0fdf4', action: () => setActive('Events') },
            { title: 'Alumni Network', value: '342+', sub: 'Connected alumni', icon: '🤝', color: '#f59e0b', bg: '#fffbeb', action: () => setActive('Alumni Directory') },
            { title: 'Contribute', value: '₹1,200', sub: 'Your total donation', icon: '❤️', color: '#ef4444', bg: '#fef2f2', action: () => setActive('Give Back') },
          ].map(s => (
            <div key={s.title} onClick={s.action} style={{ ...card, padding: 20, cursor: 'pointer', borderTop: `4px solid ${s.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{s.sub}</div>
                </div>
                <div style={{ fontSize: 28, background: s.bg, borderRadius: 10, padding: 10 }}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function JobBoard() {
    const [search, setSearch] = useState('')
    const filtered = jobListings.filter(j => !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()))
    return (
      <div>
        <div style={{ marginBottom: 20, display: 'flex', gap: 12 }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs, companies, skills..."
            style={{ flex: 1, padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((job, i) => (
            <div key={i} style={{ ...card, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: TEXT, marginBottom: 4 }}>{job.title}</div>
                <div style={{ fontSize: 13, color: MUTED, marginBottom: 8 }}>{job.company} · {job.location} · {job.type}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {job.skills.map(s => <span key={s} style={{ background: '#eef2ff', color: ACCENT, borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{s}</span>)}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, color: '#16a34a', fontSize: 14 }}>{job.salary}</div>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>{job.posted}</div>
                <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Apply</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: MUTED }}>No jobs match your search.</div>}
        </div>
      </div>
    )
  }

  function AlumniDirectorySection() {
    const [search, setSearch] = useState('')
    const filtered = alumniDirectory.filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase()))
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search alumni by name or company..."
            style={{ width: '100%', padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {filtered.map((a, i) => (
            <div key={i} style={{ ...card, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#eef2ff', color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {a.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>Batch {a.batch}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: TEXT, marginBottom: 4 }}>{a.role}</div>
              <div style={{ fontSize: 13, color: MUTED, marginBottom: 10 }}>{a.company} · {a.location}</div>
              <button style={{ width: '100%', background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 7, padding: '7px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Connect</button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function Events() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {upcomingEvents.map((ev, i) => (
          <div key={i} style={{ ...card, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: TEXT, marginBottom: 4 }}>{ev.title}</div>
              <div style={{ fontSize: 13, color: MUTED }}>📅 {ev.date} · 📍 {ev.venue}</div>
              <span style={{ display: 'inline-block', marginTop: 8, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: ev.type === 'Virtual' ? '#eef2ff' : '#f0fdf4', color: ev.type === 'Virtual' ? ACCENT : '#16a34a' }}>
                {ev.type}
              </span>
            </div>
            <button style={{ padding: '8px 20px', background: ev.registered ? '#f0fdf4' : ACCENT, color: ev.registered ? '#16a34a' : '#fff', border: ev.registered ? '1px solid #86efac' : 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: ev.registered ? 'default' : 'pointer' }}>
              {ev.registered ? '✓ Registered' : 'Register'}
            </button>
          </div>
        ))}
      </div>
    )
  }

  function GiveBack() {
    const [amount, setAmount] = useState('')
    const [preset, setPreset] = useState(null)
    return (
      <div>
        <div style={{ ...card, padding: 28, marginBottom: 20, background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderLeft: '4px solid #16a34a' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#166534', marginBottom: 8 }}>Support Your Alma Mater 🎓</div>
          <div style={{ fontSize: 14, color: '#15803d' }}>Your contributions fund scholarships, lab equipment, and student development programs.</div>
        </div>
        <div style={{ ...card, padding: 28, marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: TEXT }}>Make a Donation</h3>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            {[500, 1000, 2500, 5000].map(amt => (
              <button key={amt} onClick={() => { setPreset(amt); setAmount(String(amt)) }}
                style={{ padding: '8px 18px', borderRadius: 8, border: preset === amt ? 'none' : '1px solid #e2e8f0', background: preset === amt ? ACCENT : '#fff', color: preset === amt ? '#fff' : TEXT, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Custom Amount</label>
            <input value={amount} onChange={e => { setAmount(e.target.value); setPreset(null) }}
              placeholder="Enter amount in ₹"
              style={{ width: '100%', maxWidth: 240, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, color: TEXT, boxSizing: 'border-box' }} />
          </div>
          <button style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Donate ₹{amount || '—'}
          </button>
        </div>
        <div style={{ ...card, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: TEXT }}>Donation History</h3>
          {[{ date: 'Jan 15, 2025', amount: '₹1,000', purpose: 'Scholarship Fund', receipt: 'DON2025001' },
            { date: 'Mar 10, 2024', amount: '₹200', purpose: 'Lab Equipment', receipt: 'DON2024001' }].map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i === 0 ? '1px solid #f1f5f9' : 'none', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{d.purpose}</div>
                <div style={{ fontSize: 12, color: MUTED }}>{d.date} · {d.receipt}</div>
              </div>
              <div style={{ fontWeight: 700, color: '#16a34a', fontSize: 15 }}>{d.amount}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function MyProfileSection() {
    return (
      <div style={{ ...card, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eef2ff', color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, flexShrink: 0 }}>
            {profile?.name?.split(' ').map(w => w[0]).join('').slice(0, 2) || 'AL'}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: TEXT }}>{profile?.name || 'Alumni'}</div>
            <div style={{ fontSize: 14, color: MUTED }}>B.E. Computer Science & Engineering · 2018–2022</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            ['Email',           profile?.email || '—'],
            ['Phone',           profile?.phone || '—'],
            ['Batch',           '2018–2022'],
            ['Department',      'Computer Science & Engineering'],
            ['Current Company', 'TCS (update in profile)'],
            ['LinkedIn',        'linkedin.com/in/alumni (update)'],
          ].map(([k, v]) => (
            <div key={k} style={{ background: BG, borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k}</div>
              <div style={{ fontSize: 14, color: TEXT, fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>
        <button style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Edit Profile</button>
      </div>
    )
  }

  const sectionMap = { Dashboard, 'Job Board': JobBoard, 'Alumni Directory': AlumniDirectorySection, Events, 'Give Back': GiveBack, 'My Profile': MyProfileSection }
  const ActiveSection = sectionMap[active]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: TEXT }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: TEXT }}>Alumni Portal</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: MUTED }}>Stay connected, grow your career, and give back</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 500 }}>
        <div style={{
          width: isMobile ? '100%' : 200, borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
          borderBottom: isMobile ? '1px solid #e2e8f0' : 'none', padding: isMobile ? '8px 4px' : '12px 0',
          flexShrink: 0, display: isMobile ? 'flex' : 'block', flexWrap: isMobile ? 'wrap' : undefined, overflowX: isMobile ? 'auto' : undefined,
        }}>
          {navItems.map(item => (
            <button key={item} onClick={() => setActive(item)} style={navStyle(item)}>{item}</button>
          ))}
        </div>
        <div style={{ flex: 1, padding: isMobile ? 16 : 28, background: BG, overflowX: 'auto' }}>
          <ActiveSection />
        </div>
      </div>
    </div>
  )
}
