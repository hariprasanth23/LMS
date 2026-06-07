import React, { useState, useEffect } from 'react'
import api from '../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'
const ff = 'system-ui, -apple-system, sans-serif'

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px 0' }}>
      <div style={{ width: 32, height: 32, border: `3px solid #e2e8f0`, borderTopColor: ACCENT, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function EmptyState({ icon = '📭', title = 'No data available', desc = 'This information will be loaded from the backend once it is available.' }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: MUTED }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: ff, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: MUTED, fontFamily: ff, maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>{desc}</div>
    </div>
  )
}

function ErrorState({ message = 'Failed to load data.', onRetry }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 24px' }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#dc2626', fontFamily: ff, marginBottom: 6 }}>{message}</div>
      {onRetry && <button onClick={onRetry} style={{ marginTop: 8, padding: '7px 18px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: ff, cursor: 'pointer' }}>Retry</button>}
    </div>
  )
}

const ITEMS = [
  'My Curriculum', 'HOD and Dean Info', 'Faculty Info', 'Biometric Info', 'Biometric Search', 'Class Messages',
  'Regulation', 'Minor / Honour', 'Time Table', 'Class Attendance', 'Course Page Consolidated',
  'Digital Assignment Upload', 'QCM View', 'Outcome SET Conference', 'Co-Extra Curricular',
  'Academics Calendar', 'Course Registration Allocation', 'Project Course', 'Project Mark View',
  'Apaar ID Upload'
]

function MyCurriculum() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true); setError(null)
    api.get('/students/me')
      .then(r => setData(r.data.data))
      .catch(() => setError('Could not load curriculum data.'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  if (loading) return <Spinner />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!data) return <EmptyState icon="📚" title="No curriculum data" desc="Your curriculum details have not been loaded yet." />

  return (
    <div>
      <div style={{ background: '#eef2ff', borderRadius: 8, padding: '10px 16px', marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: ACCENT, fontFamily: ff }}>{data.programme || 'B.E. Computer Science & Engineering'}</span>
        <div style={{ background: '#fff', borderRadius: 8, padding: '6px 14px', border: '1.5px solid #6366f1', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: ff }}>Student</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT, fontFamily: ff }}>{data.rollNumber}</div>
        </div>
      </div>
      <EmptyState icon="📋" title="Semester-wise curriculum not yet available" desc="Your semester grades and course history will appear here once the academic records are uploaded to the system." />
    </div>
  )
}

function HODDeanInfo() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true); setError(null)
    api.get('/employees')
      .then(r => {
        const all = r.data.data || []
        // Show only HOD-level staff (designation contains HOD or Dean)
        const hods = all.filter(e => /hod|head|dean/i.test(e.designation))
        setEmployees(hods)
      })
      .catch(() => setError('Could not load HOD / Dean information.'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  if (loading) return <Spinner />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!employees.length) return <EmptyState icon="🏛️" title="No HOD / Dean records found" desc="HOD and Dean information will appear here once employee records are updated in the system." />

  const colors = ['#6366f1', '#0891b2', '#059669', '#7c3aed']
  const bgs    = ['#eef2ff', '#e0f2fe', '#d1fae5', '#ede9fe']

  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      {employees.map((e, i) => {
        const color = colors[i % colors.length]
        const bg    = bgs[i % bgs.length]
        const initials = e.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        return (
          <div key={e.id} style={{ flex: '1 1 260px', border: '1px solid #e2e8f0', borderRadius: 12, padding: 22, background: '#fafafa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, fontFamily: ff, flexShrink: 0 }}>{initials}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: ff }}>{e.name}</div>
                <span style={{ background: bg, color, fontSize: 11, borderRadius: 10, padding: '2px 10px', fontWeight: 600, fontFamily: ff }}>{e.designation}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['Employee Code', e.empCode], ['Email', e.email], ['Phone', e.phone]].map(([label, val]) => val ? (
                <div key={label} style={{ display: 'flex', gap: 8, fontSize: 13, fontFamily: ff }}>
                  <span style={{ color: MUTED, width: 120, flexShrink: 0 }}>{label}</span>
                  <span style={{ color: TEXT, fontWeight: 500 }}>{val}</span>
                </div>
              ) : null)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FacultyInfo() {
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState(null)
  const [faculty, setFaculty]  = useState([])
  const [loading, setLoading]  = useState(true)
  const [error, setError]      = useState(null)

  const AVATAR_COLORS = ['#6366f1','#059669','#0891b2','#7c3aed','#b45309','#db2777','#dc2626','#16a34a']
  const AVATAR_BGS    = ['#eef2ff','#d1fae5','#e0f2fe','#ede9fe','#fef3c7','#fce7f3','#fee2e2','#f0fdf4']

  const load = () => {
    setLoading(true); setError(null)
    api.get('/employees')
      .then(r => {
        const all = (r.data.data || []).filter(e => /faculty|professor|lecturer/i.test(e.employeeType || e.designation || ''))
        setFaculty(all.length ? all : (r.data.data || []))
      })
      .catch(() => setError('Could not load faculty data.'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = faculty.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.designation?.toLowerCase().includes(search.toLowerCase()) ||
    f.empCode?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Spinner />
  if (error)   return <ErrorState message={error} onRetry={load} />

  return (
    <div style={{ fontFamily: ff }}>
      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94a3b8' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or designation…"
          style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontFamily: ff, outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }}
          onFocus={e => e.target.style.borderColor = ACCENT}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 16 }}>×</button>}
      </div>

      <div style={{ fontSize: 12, color: MUTED, marginBottom: 12, fontFamily: ff }}>{filtered.length} faculty member{filtered.length !== 1 ? 's' : ''} found</div>

      {!filtered.length
        ? <EmptyState icon="👩‍🏫" title={search ? `No faculty matching "${search}"` : 'No faculty records'} desc="Faculty records will appear here once employee data is available." />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((f, idx) => {
              const color    = AVATAR_COLORS[idx % AVATAR_COLORS.length]
              const bg       = AVATAR_BGS[idx % AVATAR_BGS.length]
              const initials = f.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '??'
              return (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', background: '#fff', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, flexShrink: 0, fontFamily: ff, border: `2px solid ${color}30` }}>{initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: ff, marginBottom: 2 }}>{f.name}</div>
                    <div style={{ fontSize: 12, color, fontWeight: 600, fontFamily: ff, marginBottom: 4 }}>{f.designation}</div>
                    <div style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>{f.empCode}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => setSelected({ ...f, avatarColor: color, avatarBg: bg, initials })} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 12, fontWeight: 700, fontFamily: ff, cursor: 'pointer' }}>View Profile</button>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }

      {/* ── Faculty Profile Modal ── */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.22)' }}>
            <div style={{ background: `linear-gradient(135deg, ${selected.avatarColor}18, ${selected.avatarColor}06)`, borderBottom: `1px solid ${selected.avatarColor}20`, padding: '24px 24px 20px', position: 'relative' }}>
              <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 18, color: '#64748b' }}>×</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: selected.avatarBg, color: selected.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, fontFamily: ff, flexShrink: 0, border: `3px solid ${selected.avatarColor}40` }}>{selected.initials}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, fontFamily: ff, marginBottom: 3 }}>{selected.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: selected.avatarColor, fontFamily: ff, marginBottom: 4 }}>{selected.designation}</div>
                  <div style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>{selected.employeeType} · {selected.empCode}</div>
                </div>
              </div>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10, fontFamily: ff }}>Contact Information</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[['📧','Email', selected.email], ['📞','Phone', selected.phone], ['🗓️','Joined', selected.joinDate], ['🎓','Qualifications', selected.qualifications]].map(([icon, label, value]) => value ? (
                    <div key={label} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: 11, color: MUTED, fontFamily: ff, marginBottom: 3 }}>{icon} {label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: ff, wordBreak: 'break-word' }}>{value}</div>
                    </div>
                  ) : null)}
                </div>
              </div>
              <div style={{ background: '#fafbff', border: '1px dashed #c7d2fe', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>Office hours, subjects taught, and research areas will be shown here once added to the faculty profile.</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ width: '100%', padding: '11px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: ff, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BiometricInfo() {
  return <EmptyState icon="👆" title="Biometric enrollment status not available" desc="Your biometric device registration and sync status will be shown here once the biometric system is integrated." />
}

function ClassMessages() {
  const [msgs, setMsgs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true); setError(null)
    api.get('/announcements')
      .then(r => setMsgs(r.data.data || []))
      .catch(() => setError('Could not load class messages.'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  if (loading) return <Spinner />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!msgs.length) return <EmptyState icon="💬" title="No class messages" desc="Messages and announcements from your faculty will appear here." />

  const colors = ['#6366f1','#0891b2','#7c3aed','#b45309','#059669','#be185d']
  const bgs    = ['#eef2ff','#e0f2fe','#ede9fe','#fef3c7','#d1fae5','#fce7f3']

  return (
    <div>
      <div style={{ fontSize: 13, color: MUTED, fontFamily: ff, marginBottom: 14 }}>{msgs.length} announcement{msgs.length !== 1 ? 's' : ''}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.map((m, i) => {
          const color = colors[i % colors.length]
          const bg    = bgs[i % bgs.length]
          const initials = (m.createdBy || 'FA').substring(0, 2).toUpperCase()
          return (
            <div key={m.id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, background: '#fafbff', display: 'flex', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, fontFamily: ff, flexShrink: 0 }}>{initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: ff }}>
                    {m.courseCode && <span style={{ background: '#f1f5f9', color: MUTED, fontSize: 11, borderRadius: 6, padding: '1px 7px', fontWeight: 500, marginRight: 6 }}>{m.courseCode}</span>}
                    {m.title}
                  </div>
                  <div style={{ fontSize: 11, color: MUTED, fontFamily: ff }}>{m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN') : ''}</div>
                </div>
                <div style={{ fontSize: 13, color: TEXT, fontFamily: ff, lineHeight: 1.5 }}>{m.content}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Regulation() {
  return <EmptyState icon="📜" title="Regulation details not available" desc="Your programme regulation document will be available here once uploaded by the department." />
}

function MinorHonour() {
  return <EmptyState icon="🎓" title="Minor / Honour degree info not available" desc="Available minor and honour degree programmes will be listed here once configured by the academic section." />
}

function TimeTable() {
  const ff = 'system-ui, -apple-system, sans-serif'
  const todayIdx = new Date().getDay()                    // 0=Sun, 1=Mon … 6=Sat
  const todayColIdx = todayIdx === 0 ? -1 : todayIdx - 1 // map to 0=Mon…5=Sat, -1=Sun
  const nowHour = new Date().getHours()

  const [view, setView]       = useState('week')          // 'week' | 'day'
  const [activeDay, setActiveDay] = useState(Math.max(0, todayColIdx))

  const DAYS = [
    { short: 'Mon', full: 'Monday'    },
    { short: 'Tue', full: 'Tuesday'   },
    { short: 'Wed', full: 'Wednesday' },
    { short: 'Thu', full: 'Thursday'  },
    { short: 'Fri', full: 'Friday'    },
    { short: 'Sat', full: 'Saturday'  },
  ]

  // Subject definitions come from backend — empty until timetable is published
  const SUBJECTS = {}

  // grid[slotIdx][dayIdx] = subject key or null
  const SLOTS = [
    { time: '8:00',  label: '8:00 – 9:00',   period: 1 },
    { time: '9:00',  label: '9:00 – 10:00',  period: 2 },
    { time: '10:00', label: '10:00 – 11:00', period: 3 },
    { time: '11:00', label: '11:00 – 12:00', period: 4 },
    { time: '12:00', label: '12:00 – 1:00',  period: null, isLunch: true },
    { time: '13:00', label: '1:00 – 2:00',   period: 5 },
    { time: '14:00', label: '2:00 – 3:00',   period: 6 },
    { time: '15:00', label: '3:00 – 4:00',   period: 7 },
  ]

  // Timetable data comes from backend — empty until published by the department
  const GRID = SLOTS.map(() => [null, null, null, null, null, null])

  const isCurrentSlot = (slotIdx) => {
    if (todayColIdx < 0 || todayColIdx > 5) return false
    const h = parseInt(SLOTS[slotIdx].time)
    return nowHour === h && !SLOTS[slotIdx].isLunch
  }

  const SubjectCard = ({ code, compact = false }) => {
    if (!code) return <div style={{ height: compact ? 40 : 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#e2e8f0', fontSize: 18 }}>—</span></div>
    const s = SUBJECTS[code]
    return (
      <div style={{
        background: s.bg, border: `1.5px solid ${s.color}25`,
        borderLeft: `3px solid ${s.color}`,
        borderRadius: 8, padding: compact ? '6px 8px' : '8px 10px',
        height: compact ? 40 : 70,
        display: 'flex', flexDirection: compact ? 'row' : 'column',
        alignItems: compact ? 'center' : 'flex-start',
        gap: compact ? 8 : 2, boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        <span style={{ fontSize: compact ? 10 : 11, fontWeight: 800, color: s.color, fontFamily: ff, whiteSpace: 'nowrap' }}>{s.short}</span>
        {!compact && <>
          <span style={{ fontSize: 10, color: '#475569', fontFamily: ff, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{s.name}</span>
          <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: ff, marginTop: 'auto' }}>📍 {s.room}</span>
        </>}
        {compact && <span style={{ fontSize: 10, color: '#475569', fontFamily: ff, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{s.name}</span>}
      </div>
    )
  }

  return (
    <div style={{ fontFamily: ff }}>

      {/* ── Header toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: ff }}>Sem 6 — Time Table</div>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>CSE Dept · Batch 2022–26 · Reg. 2021</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { setView('week') }} style={{ padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${view === 'week' ? ACCENT : '#e2e8f0'}`, background: view === 'week' ? '#eef2ff' : '#fff', color: view === 'week' ? ACCENT : MUTED, fontSize: 12, fontWeight: 600, fontFamily: ff, cursor: 'pointer' }}>Week View</button>
          <button onClick={() => { setView('day') }} style={{ padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${view === 'day' ? ACCENT : '#e2e8f0'}`, background: view === 'day' ? '#eef2ff' : '#fff', color: view === 'day' ? ACCENT : MUTED, fontSize: 12, fontWeight: 600, fontFamily: ff, cursor: 'pointer' }}>Day View</button>
          {todayColIdx >= 0 && todayColIdx <= 5 && (
            <button onClick={() => { setView('day'); setActiveDay(todayColIdx) }} style={{ padding: '6px 14px', borderRadius: 8, border: '1.5px solid #6366f1', background: '#6366f1', color: '#fff', fontSize: 12, fontWeight: 600, fontFamily: ff, cursor: 'pointer' }}>Today</button>
          )}
        </div>
      </div>

      {/* ── Day tabs (always visible) ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 2 }}>
        {DAYS.map((d, i) => {
          const isToday = i === todayColIdx
          const isActive = i === activeDay
          const hasClass = GRID.some(row => row[i] !== null)
          return (
            <button
              key={d.short}
              onClick={() => { setActiveDay(i); setView('day') }}
              style={{
                flexShrink: 0, padding: '8px 14px', borderRadius: 10, border: 'none',
                background: isActive && view === 'day'
                  ? ACCENT
                  : isToday ? '#eef2ff' : '#f1f5f9',
                color: isActive && view === 'day' ? '#fff' : isToday ? ACCENT : MUTED,
                fontSize: 12, fontWeight: 600, fontFamily: ff, cursor: 'pointer',
                outline: isToday && !(isActive && view === 'day') ? `2px solid ${ACCENT}` : 'none',
                outlineOffset: 1,
                opacity: !hasClass && i === 5 ? 0.5 : 1,
              }}
            >
              <div>{d.short}</div>
              {isToday && <div style={{ fontSize: 9, marginTop: 1 }}>Today</div>}
            </button>
          )
        })}
      </div>

      {/* ── WEEK VIEW ── */}
      {view === 'week' && (
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 640 }}>
            {/* Day header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '72px repeat(6, 1fr)', gap: 4, marginBottom: 4 }}>
              <div />
              {DAYS.map((d, i) => (
                <div key={d.short} style={{
                  textAlign: 'center', padding: '8px 4px',
                  borderRadius: 8,
                  background: i === todayColIdx ? '#eef2ff' : '#f8fafc',
                  border: i === todayColIdx ? `1.5px solid ${ACCENT}40` : '1.5px solid transparent',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: i === todayColIdx ? ACCENT : TEXT, fontFamily: ff }}>{d.short}</div>
                  {i === todayColIdx && <div style={{ fontSize: 9, color: ACCENT, fontFamily: ff }}>Today</div>}
                </div>
              ))}
            </div>

            {/* Slot rows */}
            {SLOTS.map((slot, si) => (
              <div key={si} style={{
                display: 'grid',
                gridTemplateColumns: '72px repeat(6, 1fr)',
                gap: 4, marginBottom: 4,
                background: isCurrentSlot(si) ? '#fafbff' : 'transparent',
                borderRadius: 8,
                outline: isCurrentSlot(si) ? `1.5px solid ${ACCENT}30` : 'none',
              }}>
                {/* Time label */}
                <div style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  paddingRight: 8, paddingTop: 2,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: isCurrentSlot(si) ? ACCENT : MUTED, fontFamily: ff, textAlign: 'right' }}>
                    {slot.isLunch ? '12:00' : slot.time}
                  </div>
                  {slot.period && <div style={{ fontSize: 9, color: '#cbd5e1', fontFamily: ff, textAlign: 'right' }}>P{slot.period}</div>}
                </div>

                {slot.isLunch ? (
                  <div style={{
                    gridColumn: '2 / -1', background: '#fffbeb',
                    border: '1px dashed #fcd34d', borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32,
                  }}>
                    <span style={{ fontSize: 11, color: '#92400e', fontWeight: 600, fontFamily: ff }}>🍽️ Lunch Break — 12:00 to 1:00 PM</span>
                  </div>
                ) : (
                  DAYS.map((_, di) => (
                    <div key={di} style={{
                      background: di === todayColIdx ? '#fafbff' : 'transparent',
                      borderRadius: 8,
                      outline: di === todayColIdx && !slot.isLunch ? `1px solid ${ACCENT}15` : 'none',
                    }}>
                      <SubjectCard code={GRID[si][di]} compact />
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DAY VIEW ── */}
      {view === 'day' && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: ff, marginBottom: 14 }}>
            {DAYS[activeDay].full}
            {activeDay === todayColIdx && <span style={{ marginLeft: 8, background: '#eef2ff', color: ACCENT, fontSize: 11, borderRadius: 20, padding: '2px 10px', fontWeight: 600 }}>Today</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SLOTS.map((slot, si) => {
              const code = GRID[si][activeDay]
              const isCurrent = isCurrentSlot(si) && activeDay === todayColIdx

              if (slot.isLunch) return (
                <div key={si} style={{ background: '#fffbeb', border: '1px dashed #fcd34d', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>🍽️</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e', fontFamily: ff }}>Lunch Break</div>
                    <div style={{ fontSize: 11, color: '#b45309', fontFamily: ff }}>12:00 PM – 1:00 PM</div>
                  </div>
                </div>
              )

              return (
                <div key={si} style={{
                  border: `1.5px solid ${isCurrent ? ACCENT : code ? (SUBJECTS[code]?.color + '30') : '#f1f5f9'}`,
                  borderRadius: 12, padding: '12px 16px',
                  background: isCurrent ? '#fafbff' : '#fff',
                  display: 'flex', alignItems: 'center', gap: 14,
                  boxShadow: isCurrent ? `0 0 0 3px ${ACCENT}15` : 'none',
                  transition: 'all 0.15s',
                }}>
                  {/* Time + Period */}
                  <div style={{ textAlign: 'center', width: 58, flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isCurrent ? ACCENT : MUTED, fontFamily: ff }}>{slot.time}</div>
                    {slot.period && <div style={{ fontSize: 10, color: '#cbd5e1', fontFamily: ff }}>Period {slot.period}</div>}
                    {isCurrent && <div style={{ fontSize: 9, color: ACCENT, fontWeight: 700, fontFamily: ff, marginTop: 2 }}>NOW</div>}
                  </div>

                  {/* Divider */}
                  <div style={{ width: 3, height: 56, borderRadius: 4, background: code ? SUBJECTS[code]?.color : '#e2e8f0', flexShrink: 0 }} />

                  {/* Subject info */}
                  {code ? (
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ background: SUBJECTS[code].bg, color: SUBJECTS[code].color, fontSize: 11, fontWeight: 800, borderRadius: 6, padding: '2px 8px', fontFamily: ff }}>{code}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: ff }}>{SUBJECTS[code].name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>👩‍🏫 {SUBJECTS[code].faculty}</span>
                        <span style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>📍 {SUBJECTS[code].room}</span>
                        <span style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>⏱ {slot.label}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: '#cbd5e1', fontFamily: ff }}>No class scheduled</div>
                      <div style={{ fontSize: 11, color: '#e2e8f0', fontFamily: ff }}>{slot.label}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Legend ── */}
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8, fontFamily: ff }}>Course Legend</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.entries(SUBJECTS).map(([code, s]) => (
            <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 6, background: s.bg, border: `1px solid ${s.color}25`, borderRadius: 8, padding: '4px 10px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: s.color, fontFamily: ff }}>{code}</span>
              <span style={{ fontSize: 11, color: '#475569', fontFamily: ff }}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ClassAttendance() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true); setError(null)
    api.get('/students/me')
      .then(r => {
        const studentId = r.data.data?.id
        if (!studentId) { setData([]); return }
        return api.get(`/attendance/student/${studentId}/summary`)
          .then(r2 => setData(r2.data.data || []))
      })
      .catch(() => setError('Could not load attendance data.'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  if (loading) return <Spinner />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!data || !data.length) return <EmptyState icon="📊" title="No attendance records" desc="Your course-wise attendance will appear here once classes are recorded in the system." />

  const getColor = (pct) => pct >= 75 ? ['#15803d', '#dcfce7'] : pct >= 65 ? ['#b45309', '#fef3c7'] : ['#dc2626', '#fee2e2']
  const totalPresent = data.reduce((a, c) => a + (c.present || 0), 0)
  const totalClasses = data.reduce((a, c) => a + (c.total || 0), 0)
  const overall = totalClasses > 0 ? Math.round(totalPresent / totalClasses * 100) : 0

  return (
    <div>
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: overall >= 75 ? '#15803d' : '#b45309', fontFamily: ff }}>{overall}%</div>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: ff }}>Overall Attendance</div>
        </div>
        <div style={{ flex: 1, height: 8, background: '#e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ width: `${overall}%`, height: '100%', background: overall >= 75 ? '#22c55e' : '#f59e0b', borderRadius: 10 }} />
        </div>
        <div style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>{totalPresent} / {totalClasses} classes attended</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((c, i) => {
          const present = c.present || 0
          const total = c.total || 0
          const pct = total > 0 ? Math.round(present / total * 100) : 0
          const [clr, bg] = getColor(pct)
          return (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 9, padding: '12px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: ff }}>{c.courseCode || c.courseName} </span>
                  {c.courseName && <span style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>— {c.courseName}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: MUTED, fontFamily: ff }}>{present}/{total} classes</span>
                  <span style={{ background: bg, color: clr, fontSize: 12, borderRadius: 8, padding: '2px 9px', fontWeight: 700, fontFamily: ff }}>{pct}%</span>
                </div>
              </div>
              <div style={{ height: 6, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: pct >= 75 ? '#22c55e' : pct >= 65 ? '#f59e0b' : '#ef4444', borderRadius: 6 }} />
              </div>
              {pct < 75 && total > 0 && <div style={{ fontSize: 11, color: pct < 65 ? '#dc2626' : '#b45309', fontFamily: ff, marginTop: 4 }}>⚠ Need more attendance to reach 75%</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CoursePageConsolidated() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true); setError(null)
    api.get('/courses')
      .then(r => setCourses(r.data.data || []))
      .catch(() => setError('Could not load courses.'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  if (loading) return <Spinner />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!courses.length) return <EmptyState icon="📖" title="No courses found" desc="Your enrolled courses will appear here once course allocations are made for this semester." />

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: ff, minWidth: 500 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {['Course Code', 'Course Name', 'Credits', 'Instructor'].map(h => (
              <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{c.code}</td>
              <td style={{ padding: '9px 10px', color: TEXT }}>{c.name}</td>
              <td style={{ padding: '9px 10px', color: MUTED, textAlign: 'center' }}>{c.credits}</td>
              <td style={{ padding: '9px 10px', color: MUTED }}>{c.instructorName || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DigitalAssignmentUpload() {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [assignments, setAssignments] = useState([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [loadingAssignments, setLoadingAssignments] = useState(false)

  useEffect(() => {
    api.get('/courses')
      .then(r => setCourses(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingCourses(false))
  }, [])

  useEffect(() => {
    if (!selectedCourse) { setAssignments([]); return }
    setLoadingAssignments(true)
    api.get(`/courses/${selectedCourse}/assignments`)
      .then(r => setAssignments(r.data || []))
      .catch(() => setAssignments([]))
      .finally(() => setLoadingAssignments(false))
  }, [selectedCourse])

  const statusColor = { GRADED: ['#dcfce7', '#15803d'], SUBMITTED: ['#dbeafe', '#1d4ed8'], PENDING: ['#fee2e2', '#dc2626'] }

  return (
    <div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: ff, marginBottom: 14 }}>Upload New Assignment</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: ff, display: 'block', marginBottom: 4 }}>Course</label>
            {loadingCourses ? <div style={{ fontSize: 13, color: MUTED }}>Loading courses…</div> : (
              <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: ff, width: '100%' }}>
                <option value="">Select course...</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
              </select>
            )}
          </div>
          <div>
            <label style={{ fontSize: 12, color: MUTED, fontFamily: ff, display: 'block', marginBottom: 4 }}>Upload File</label>
            <div style={{ border: '2px dashed #c7d2fe', borderRadius: 8, padding: '24px 16px', textAlign: 'center', background: '#fafbff', cursor: 'pointer' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>📎</div>
              <div style={{ fontSize: 13, color: MUTED, fontFamily: ff }}>Drag & drop file here, or <span style={{ color: ACCENT, fontWeight: 600 }}>browse</span></div>
              <div style={{ fontSize: 11, color: MUTED, fontFamily: ff, marginTop: 4 }}>PDF, DOCX, ZIP — max 10 MB</div>
            </div>
          </div>
          <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, fontFamily: ff, cursor: 'pointer', fontWeight: 600 }}>Submit Assignment</button>
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: ff, marginBottom: 10 }}>Assignments</div>
      {loadingAssignments ? <Spinner /> : !assignments.length
        ? <EmptyState icon="📝" title={selectedCourse ? 'No assignments for this course' : 'Select a course to view assignments'} desc="" />
        : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: ff, minWidth: 500 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Title', 'Due Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assignments.map((a, i) => {
                  const status = a.status || 'PENDING'
                  const [bg, clr] = statusColor[status] || ['#f1f5f9', MUTED]
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 10px', color: TEXT }}>{a.title}</td>
                      <td style={{ padding: '8px 10px', color: MUTED }}>{a.dueDate ? new Date(a.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td style={{ padding: '8px 10px' }}><span style={{ background: bg, color: clr, fontSize: 11, borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>{status}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  )
}

function QCMView() {
  return <EmptyState icon="📋" title="No QCM records" desc="Your quiz and continuous monitoring marks will appear here once published by the faculty." />
}

function OutcomeSETConference() {
  return <EmptyState icon="📈" title="No course outcome data" desc="Course outcome attainment data will be displayed here once entered by your faculty." />
}

function CoExtraCurricular() {
  return <EmptyState icon="🏆" title="No co-curricular records" desc="Your co-curricular and extra-curricular activity records will appear here once submitted to the department." />
}

function AcademicsCalendar() {
  const today = new Date()
  const [viewYear, setViewYear]   = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const dayLabels  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const daysInMonth    = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()

  const prevMonth = () => viewMonth === 0 ? (setViewYear(y => y - 1), setViewMonth(11)) : setViewMonth(m => m - 1)
  const nextMonth = () => viewMonth === 11 ? (setViewYear(y => y + 1), setViewMonth(0)) : setViewMonth(m => m + 1)
  const isToday   = (d) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={prevMonth} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: TEXT }}>‹</button>
        <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: ff }}>{monthNames[viewMonth]} {viewYear}</div>
        <button onClick={nextMonth} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: TEXT }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {dayLabels.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: MUTED, fontFamily: ff, padding: '4px 0' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 20 }}>
        {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
          <div key={d} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 8, background: isToday(d) ? ACCENT : '#f8fafc', color: isToday(d) ? '#fff' : TEXT, fontSize: 13, fontFamily: ff, fontWeight: isToday(d) ? 700 : 400 }}>{d}</div>
        ))}
      </div>
      <EmptyState icon="📅" title="No events scheduled" desc="Academic events, exam dates, and holidays will be shown here once published by the department." />
    </div>
  )
}

function CourseRegistrationAllocation() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true); setError(null)
    api.get('/students/me')
      .then(r => {
        const studentId = r.data.data?.id
        if (!studentId) { setEnrollments([]); return }
        return api.get(`/enrollments/student/${studentId}`)
          .then(r2 => setEnrollments(r2.data.data || []))
      })
      .catch(() => setError('Could not load enrollment data.'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  if (loading) return <Spinner />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!enrollments.length) return <EmptyState icon="📋" title="No course registrations found" desc="Your current semester course allocation will appear here once the department finalises registrations." />

  const total = enrollments.reduce((a, e) => a + (e.credits || 0), 0)
  return (
    <div>
      <div style={{ background: '#eef2ff', borderRadius: 8, padding: '10px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT, fontFamily: ff }}>Current Registration</span>
        <span style={{ fontSize: 13, fontFamily: ff }}><span style={{ color: MUTED }}>Total Credits: </span><span style={{ color: ACCENT, fontWeight: 800, fontSize: 16 }}>{total}</span></span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: ff, minWidth: 500 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Course Code', 'Course Name', 'Credits', 'Status'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '9px 10px', color: ACCENT, fontWeight: 700 }}>{e.courseCode || e.course?.code}</td>
                <td style={{ padding: '9px 10px', color: TEXT }}>{e.courseName || e.course?.name}</td>
                <td style={{ padding: '9px 10px', color: MUTED, textAlign: 'center' }}>{e.credits || e.course?.credits || '—'}</td>
                <td style={{ padding: '9px 10px' }}><span style={{ background: '#eef2ff', color: ACCENT, fontSize: 11, borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>{e.status || 'Enrolled'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProjectCourse() {
  return <EmptyState icon="🔬" title="No project records" desc="Your project phase details, guide information, team members and review timeline will appear here once assigned." />
}

function ProjectMarkView() {
  return <EmptyState icon="🏅" title="No project marks" desc="Project review marks and final viva scores will be published here by your guide after each review." />
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
  const today = new Date()
  const [viewYear, setViewYear]   = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selected, setSelected]   = useState(null)

  // Biometric records come from the backend — no hardcoded data
  const records = null  // will be replaced with API call when biometric endpoint is available

  const daysInMonth    = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const dayLabels  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

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
              const hasData    = false  // no backend biometric API yet
              const hasRecords = false
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
