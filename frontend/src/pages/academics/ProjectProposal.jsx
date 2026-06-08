import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const ITEMS = ['Faculty Open Project']

const DOMAIN_COLORS = {
  'Machine Learning':  ['#eef2ff', '#6366f1'],
  'Web Development':   ['#d1fae5', '#059669'],
  'IoT':               ['#fef3c7', '#b45309'],
  'Blockchain':        ['#ede9fe', '#7c3aed'],
  'Computer Vision':   ['#dbeafe', '#1d4ed8'],
  'NLP':               ['#fce7f3', '#be185d'],
  'Cloud Computing':   ['#e0f2fe', '#0891b2'],
  'Cyber Security':    ['#fee2e2', '#dc2626'],
  'Data Analytics':    ['#ecfdf5', '#059669'],
  'DevOps':            ['#f0f9ff', '#0ea5e9'],
}

function DomainChip({ label }) {
  const [bg, color] = DOMAIN_COLORS[label] || ['#f1f5f9', MUTED]
  return <span style={{ background: bg, color, fontSize: 11, borderRadius: 20, padding: '3px 9px', fontWeight: 600, display: 'inline-block', marginRight: 4, marginBottom: 4 }}>{label}</span>
}

function SlotBar({ slots, total }) {
  const filled = total - slots
  const pct = total > 0 ? Math.round(filled / total * 100) : 100
  const color = slots === 0 ? '#ef4444' : slots <= 1 ? '#f59e0b' : '#22c55e'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
        <span style={{ color: MUTED }}>{slots === 0 ? 'Full' : `${slots} of ${total} slots available`}</span>
        <span style={{ color, fontWeight: 600 }}>{slots}/{total}</span>
      </div>
      <div style={{ height: 5, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} />
      </div>
    </div>
  )
}

function FacultyOpenProjects() {
  const [projects, setProjects] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [domainFilter, setDomainFilter] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/academics/projects/open'),
      api.get('/academics/projects/applications'),
    ]).then(([projRes, appRes]) => {
      setProjects(projRes.data.data || [])
      setApplications(appRes.data.data || [])
    }).catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [])

  const handleApply = async (project) => {
    if (project.applied || project.slots === 0) return
    try {
      const res = await api.post('/academics/projects/apply', {
        projectId: project.id,
        title: project.title,
        faculty: project.faculty,
      })
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, applied: true } : p))
      setApplications(prev => [res.data.data, ...prev])
      toast.success('Application submitted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed')
    }
  }

  const allDomains = [...new Set(projects.flatMap(p => p.domains || []))].sort()

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.faculty || '').toLowerCase().includes(search.toLowerCase())
    const matchDomain = !domainFilter || (p.domains || []).includes(domainFilter)
    return matchSearch && matchDomain
  })

  const statusColor = { 'Under Review': ['#fef3c7', '#b45309'], 'Accepted': ['#dcfce7', '#15803d'], 'Rejected': ['#fee2e2', '#dc2626'] }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: MUTED }}>Loading…</div>

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search projects, faculty, keywords..."
          style={{ flex: '1 1 220px', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', minWidth: 180 }} />
        <select value={domainFilter} onChange={e => setDomainFilter(e.target.value)}
          style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, minWidth: 160 }}>
          <option value="">All Domains</option>
          {allDomains.map(d => <option key={d}>{d}</option>)}
        </select>
        {(search || domainFilter) && (
          <button onClick={() => { setSearch(''); setDomainFilter('') }}
            style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, cursor: 'pointer', color: MUTED, background: '#fff' }}>
            Clear filters
          </button>
        )}
      </div>

      <div style={{ fontSize: 13, color: MUTED, marginBottom: 14 }}>
        Showing <span style={{ fontWeight: 700, color: TEXT }}>{filtered.length}</span> project{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Project cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: MUTED }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
          <div style={{ fontSize: 14 }}>No projects match your filters.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
          {filtered.map((project) => (
            <div key={project.id} style={{ border: `1px solid ${project.applied ? '#c7d2fe' : '#e2e8f0'}`, borderRadius: 12, padding: 18, background: project.applied ? '#fafbff' : '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, lineHeight: 1.4, marginBottom: 6 }}>{project.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#eef2ff', color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    {(project.faculty || '').split(' ').filter(w => w.length > 2).slice(-1)[0]?.[0] || 'F'}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>{project.faculty}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{project.dept}</div>
                  </div>
                </div>
              </div>
              <div>{(project.domains || []).map(d => <DomainChip key={d} label={d} />)}</div>
              <p style={{ margin: 0, fontSize: 12, color: MUTED, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description}</p>
              <SlotBar slots={project.slots} total={project.totalSlots} />
              <div style={{ marginTop: 'auto' }}>
                {project.applied
                  ? <span style={{ background: '#eef2ff', color: ACCENT, fontSize: 12, borderRadius: 20, padding: '5px 14px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }}>✓ Applied</span>
                  : <button disabled={project.slots === 0} onClick={() => handleApply(project)}
                      style={{ background: project.slots === 0 ? '#f1f5f9' : '#16a34a', color: project.slots === 0 ? MUTED : '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontSize: 12, cursor: project.slots === 0 ? 'not-allowed' : 'pointer', fontWeight: 600, width: '100%' }}>
                      {project.slots === 0 ? 'All Slots Filled' : 'Apply for this Project'}
                    </button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Applications */}
      {applications.length > 0 && (
        <div>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 24, marginTop: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 14 }}>
              My Applications
              <span style={{ background: '#eef2ff', color: ACCENT, fontSize: 11, borderRadius: 10, padding: '2px 8px', fontWeight: 700, marginLeft: 8 }}>{applications.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {applications.map((app, i) => {
                const [bg, color] = statusColor[app.status] || ['#f1f5f9', MUTED]
                return (
                  <div key={app.id || i} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 3 }}>{app.projectTitle}</div>
                      <div style={{ fontSize: 12, color: MUTED }}>
                        <span style={{ fontWeight: 500, color: TEXT }}>{app.facultyName}</span> · Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN') : '—'}
                      </div>
                    </div>
                    <span style={{ background: bg, color, fontSize: 12, borderRadius: 10, padding: '4px 12px', fontWeight: 700 }}>{app.status}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const CONTENT_MAP = [FacultyOpenProjects]

export default function ProjectProposal() {
  const [active, setActive] = useState(0)
  const ActiveComponent = CONTENT_MAP[active]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100%', padding: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1e293b' }}>Academics — Project Proposal</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>Browse faculty-posted open projects and apply</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', minHeight: 520 }}>
        <div style={{ width: 210, borderRight: '1px solid #e2e8f0', padding: '12px 0', flexShrink: 0 }}>
          {ITEMS.map((item, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              padding: '9px 16px', cursor: 'pointer', fontSize: 13, color: active === i ? '#6366f1' : '#475569',
              background: active === i ? '#eef2ff' : 'transparent',
              borderLeft: active === i ? '3px solid #6366f1' : '3px solid transparent', fontWeight: active === i ? 600 : 400,
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
