import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const ITEMS = ['Faculty Open Project']

const DOMAIN_COLORS = {
  'Machine Learning': ['#eef2ff', '#6366f1'],
  'Web Development': ['#d1fae5', '#059669'],
  'IoT': ['#fef3c7', '#b45309'],
  'Blockchain': ['#ede9fe', '#7c3aed'],
  'Computer Vision': ['#dbeafe', '#1d4ed8'],
  'NLP': ['#fce7f3', '#be185d'],
  'Cloud Computing': ['#e0f2fe', '#0891b2'],
  'Cyber Security': ['#fee2e2', '#dc2626'],
  'Data Analytics': ['#ecfdf5', '#059669'],
  'Embedded Systems': ['#fffbeb', '#b45309'],
  'AR / VR': ['#f5f3ff', '#7c3aed'],
  'DevOps': ['#f0f9ff', '#0ea5e9']
}

const PROJECTS = [
  {
    id: 1,
    title: 'Smart Campus Energy Monitoring using IoT & ML',
    faculty: 'Dr. S. Priya',
    dept: 'CSE Department',
    domains: ['Machine Learning', 'IoT'],
    description: 'Develop an IoT-based real-time energy monitoring dashboard for campus buildings. Use ML models to predict peak usage and suggest optimization strategies to reduce electricity consumption.',
    slots: 2,
    totalSlots: 3,
    applied: true
  },
  {
    id: 2,
    title: 'Federated Learning Framework for Healthcare Privacy',
    faculty: 'Dr. A. Meenakshi',
    dept: 'CSE Department',
    domains: ['Machine Learning', 'Cyber Security'],
    description: 'Implement a federated learning architecture that enables hospitals to collaboratively train AI models without sharing sensitive patient data, ensuring HIPAA compliance throughout.',
    slots: 1,
    totalSlots: 3,
    applied: false
  },
  {
    id: 3,
    title: 'Blockchain-based Academic Certificate Verification System',
    faculty: 'Mr. K. Vignesh',
    dept: 'CSE Department',
    domains: ['Blockchain', 'Web Development'],
    description: 'Build a decentralized application on Ethereum to issue and verify academic certificates. Students and employers can independently verify credentials without contacting the institution.',
    slots: 3,
    totalSlots: 4,
    applied: false
  },
  {
    id: 4,
    title: 'Real-time Sign Language Recognition using Computer Vision',
    faculty: 'Dr. R. Sundaramurthy',
    dept: 'CSE Department',
    domains: ['Computer Vision', 'Machine Learning'],
    description: 'Develop a deep learning pipeline using MediaPipe and CNN to recognize Indian Sign Language gestures in real-time through a webcam feed and convert them to text or speech.',
    slots: 0,
    totalSlots: 2,
    applied: false
  },
  {
    id: 5,
    title: 'Multi-tenant SaaS Platform for College Administration',
    faculty: 'Ms. R. Divya',
    dept: 'CSE Department',
    domains: ['Web Development', 'Cloud Computing'],
    description: 'Design and develop a scalable multi-tenant SaaS platform for college administration including student records, fee management, and faculty portals, deployed on AWS using microservices.',
    slots: 2,
    totalSlots: 3,
    applied: false
  },
  {
    id: 6,
    title: 'Automated Code Review Tool using Large Language Models',
    faculty: 'Mr. T. Arun Kumar',
    dept: 'CSE Department',
    domains: ['NLP', 'DevOps'],
    description: 'Integrate a fine-tuned LLM (based on CodeLlama or similar) into a CI/CD pipeline to automatically review pull requests for bugs, code quality, and security vulnerabilities.',
    slots: 1,
    totalSlots: 3,
    applied: false
  }
]

const INITIAL_APPLICATIONS = [
  { id: 1, title: 'Smart Campus Energy Monitoring using IoT & ML', faculty: 'Dr. S. Priya', appliedOn: 'May 28, 2025', status: 'Under Review' }
]

function DomainChip({ label }) {
  const [bg, color] = DOMAIN_COLORS[label] || ['#f1f5f9', MUTED]
  return (
    <span style={{ background: bg, color, fontSize: 11, borderRadius: 20, padding: '3px 9px', fontWeight: 600, fontFamily: 'system-ui', display: 'inline-block' }}>{label}</span>
  )
}

function SlotBar({ slots, total }) {
  const filled = total - slots
  const pct = total > 0 ? Math.round(filled / total * 100) : 100
  const color = slots === 0 ? '#ef4444' : slots <= 1 ? '#f59e0b' : '#22c55e'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12, fontFamily: 'system-ui' }}>
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
  const [search, setSearch] = useState('')
  const [domainFilter, setDomainFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS)
  const [projects, setProjects] = useState(PROJECTS)

  const appliedIds = new Set(applications.map(a => a.id))

  const filtered = projects.filter(p => {
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.faculty.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchDomain = !domainFilter || p.domains.includes(domainFilter)
    const matchDept = !deptFilter || p.dept === deptFilter
    return matchSearch && matchDomain && matchDept
  })

  const handleApply = (project) => {
    if (appliedIds.has(project.id)) return
    setApplications(prev => [...prev, {
      id: project.id,
      title: project.title,
      faculty: project.faculty,
      appliedOn: 'Jun 5, 2025',
      status: 'Under Review'
    }])
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, applied: true } : p))
  }

  const statusColor = {
    'Under Review': ['#fef3c7', '#b45309'],
    'Accepted': ['#dcfce7', '#15803d'],
    'Rejected': ['#fee2e2', '#dc2626']
  }

  const allDomains = [...new Set(PROJECTS.flatMap(p => p.domains))].sort()

  return (
    <div>
      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search projects, faculty, keywords..."
          style={{ flex: '1 1 220px', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', outline: 'none', minWidth: 180 }}
        />
        <select value={domainFilter} onChange={e => setDomainFilter(e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', minWidth: 160 }}>
          <option value="">All Domains</option>
          {allDomains.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', minWidth: 160 }}>
          <option value="">All Departments</option>
          <option>CSE Department</option>
          <option>ECE Department</option>
          <option>IT Department</option>
        </select>
        {(search || domainFilter || deptFilter) && (
          <button onClick={() => { setSearch(''); setDomainFilter(''); setDeptFilter('') }} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontFamily: 'system-ui', cursor: 'pointer', color: MUTED, background: '#fff' }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Summary bar */}
      <div style={{ fontSize: 13, color: MUTED, fontFamily: 'system-ui', marginBottom: 14 }}>
        Showing <span style={{ fontWeight: 700, color: TEXT }}>{filtered.length}</span> project{filtered.length !== 1 ? 's' : ''}
        {domainFilter && <> in <span style={{ color: ACCENT, fontWeight: 600 }}>{domainFilter}</span></>}
      </div>

      {/* Project cards grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: MUTED, fontFamily: 'system-ui' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
          <div style={{ fontSize: 14 }}>No projects match your filters.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
          {filtered.map((project) => {
            const isApplied = appliedIds.has(project.id)
            const isFull = project.slots === 0
            return (
              <div key={project.id} style={{ border: `1px solid ${isApplied ? '#c7d2fe' : '#e2e8f0'}`, borderRadius: 12, padding: 18, background: isApplied ? '#fafbff' : '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Header */}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', lineHeight: 1.4, marginBottom: 6 }}>{project.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#eef2ff', color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontFamily: 'system-ui', flexShrink: 0 }}>
                      {project.faculty.split(' ').filter(w => w.length > 2).slice(-1)[0]?.[0] || 'F'}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: 'system-ui' }}>{project.faculty}</div>
                      <div style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>{project.dept}</div>
                    </div>
                  </div>
                </div>

                {/* Domain tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {project.domains.map(d => <DomainChip key={d} label={d} />)}
                </div>

                {/* Description */}
                <p style={{ margin: 0, fontSize: 12, color: MUTED, fontFamily: 'system-ui', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {project.description}
                </p>

                {/* Slots bar */}
                <SlotBar slots={project.slots} total={project.totalSlots} />

                {/* Action */}
                <div style={{ marginTop: 'auto' }}>
                  {isApplied ? (
                    <span style={{ background: '#eef2ff', color: ACCENT, fontSize: 12, borderRadius: 20, padding: '5px 14px', fontWeight: 700, fontFamily: 'system-ui', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      ✓ Applied
                    </span>
                  ) : (
                    <button
                      disabled={isFull}
                      onClick={() => handleApply(project)}
                      style={{
                        background: isFull ? '#f1f5f9' : '#16a34a',
                        color: isFull ? MUTED : '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '7px 18px',
                        fontSize: 12,
                        fontFamily: 'system-ui',
                        cursor: isFull ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        width: '100%'
                      }}
                    >
                      {isFull ? 'All Slots Filled' : 'Apply for this Project'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* My Applications section */}
      {applications.length > 0 && (
        <div>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 24, marginTop: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 14 }}>
              My Applications
              <span style={{ background: '#eef2ff', color: ACCENT, fontSize: 11, borderRadius: 10, padding: '2px 8px', fontWeight: 700, fontFamily: 'system-ui', marginLeft: 8 }}>{applications.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {applications.map((app, i) => {
                const [bg, color] = statusColor[app.status] || ['#f1f5f9', MUTED]
                return (
                  <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: 'system-ui', marginBottom: 3 }}>{app.title}</div>
                      <div style={{ fontSize: 12, color: MUTED, fontFamily: 'system-ui' }}>
                        <span style={{ fontWeight: 500, color: TEXT }}>{app.faculty}</span> · Applied on {app.appliedOn}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ background: bg, color, fontSize: 12, borderRadius: 10, padding: '4px 12px', fontWeight: 700, fontFamily: 'system-ui' }}>{app.status}</span>
                      {app.status === 'Under Review' && (
                        <span style={{ fontSize: 11, color: MUTED, fontFamily: 'system-ui' }}>Avg. response: 5–7 days</span>
                      )}
                    </div>
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
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1e293b', fontFamily: 'system-ui' }}>Academics — Project Proposal</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b', fontFamily: 'system-ui' }}>Browse faculty-posted open projects and apply</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', minHeight: 520 }}>
        <div style={{ width: 210, borderRight: '1px solid #e2e8f0', padding: '12px 0', flexShrink: 0 }}>
          {ITEMS.map((item, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              padding: '9px 16px', cursor: 'pointer', fontSize: 13,
              fontFamily: 'system-ui', color: active === i ? '#6366f1' : '#475569',
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
