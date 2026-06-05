import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MdSchool,
  MdBadge,
  MdPeople,
  MdStar
} from 'react-icons/md'

const PORTAL_COLOR = {
  student: '#3b82f6',
  staff: '#8b5cf6',
  parent: '#f59e0b',
  alumni: '#14b8a6'
}

const DEMO_CREDENTIALS = {
  student: { email: 'student@demo.com', password: 'Demo@123' },
  staff: { email: 'staff@demo.com', password: 'Demo@123' },
  parent: { email: 'parent@demo.com', password: 'Demo@123' },
  alumni: { email: 'alumni@demo.com', password: 'Demo@123' }
}

const FEATURES = [
  {
    emoji: '📚',
    title: 'Academics',
    description: 'Curriculum, timetable, attendance, assignments and course registration',
    accent: '#6366f1'
  },
  {
    emoji: '📝',
    title: 'Examinations',
    description: 'Exam schedule, marks, grades, online exams and arrear management',
    accent: '#ef4444'
  },
  {
    emoji: '💰',
    title: 'Finance',
    description: 'Fee payments, wallet, receipts, scholarships and refund requests',
    accent: '#10b981'
  },
  {
    emoji: '🛠️',
    title: 'Services',
    description: 'Certificates, transport, library, hostel and facility registration',
    accent: '#f59e0b'
  },
  {
    emoji: '🔬',
    title: 'Research',
    description: 'PhD portal, thesis submission, publications and guide meetings',
    accent: '#8b5cf6'
  },
  {
    emoji: '💬',
    title: 'Feedback',
    description: 'Course feedback, 24x7 continuous feedback and surveys',
    accent: '#14b8a6'
  }
]

const PORTALS = [
  {
    key: 'student',
    label: 'Student',
    color: '#3b82f6',
    icon: MdSchool,
    description: 'Full academic portal with curriculum, exams, finance and services'
  },
  {
    key: 'staff',
    label: 'Staff',
    color: '#8b5cf6',
    icon: MdBadge,
    description: 'Manage courses, mark attendance, handle leave and payroll'
  },
  {
    key: 'parent',
    label: 'Parent',
    color: '#f59e0b',
    icon: MdPeople,
    description: "Track your ward's attendance, marks and fee payment status"
  },
  {
    key: 'alumni',
    label: 'Alumni',
    color: '#14b8a6',
    icon: MdStar,
    description: 'Stay connected, access transcripts and alumni network'
  }
]

function FeatureCard({ emoji, title, description, accent }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 28,
        boxShadow: hovered
          ? '0 8px 32px rgba(0,0,0,0.12)'
          : '0 4px 20px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
        cursor: 'default'
      }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: `${accent}18`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        marginBottom: 16
      }}>
        {emoji}
      </div>
      <div style={{
        fontSize: 16,
        fontWeight: 700,
        color: '#1e293b',
        marginBottom: 8,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {title}
      </div>
      <div style={{
        fontSize: 14,
        color: '#64748b',
        lineHeight: 1.6,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {description}
      </div>
    </div>
  )
}

function PortalCard({ portal, onLogin }) {
  const [hovered, setHovered] = useState(false)
  const Icon = portal.icon
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 28,
        boxShadow: hovered
          ? '0 8px 32px rgba(0,0,0,0.12)'
          : '0 4px 20px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: `${portal.color}18`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon style={{ fontSize: 26, color: portal.color }} />
      </div>
      <div style={{
        fontSize: 16,
        fontWeight: 700,
        color: '#1e293b',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {portal.label}
      </div>
      <div style={{
        fontSize: 13,
        color: '#64748b',
        lineHeight: 1.6,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        flexGrow: 1
      }}>
        {portal.description}
      </div>
      <button
        onClick={() => onLogin(portal.key)}
        style={{
          width: '100%',
          padding: '10px 16px',
          background: portal.color,
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          cursor: 'pointer',
          marginTop: 4
        }}
      >
        Login as {portal.label} →
      </button>
    </div>
  )
}

function DemoCard({ portal, onLogin }) {
  const [copiedField, setCopiedField] = useState(null)
  const creds = DEMO_CREDENTIALS[portal.key]
  const color = PORTAL_COLOR[portal.key]

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 1500)
    })
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: `1px solid ${color}30`
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16
      }}>
        <span style={{
          fontSize: 15,
          fontWeight: 700,
          color: '#1e293b',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {portal.label}
        </span>
        <span style={{
          background: `${color}18`,
          color: color,
          fontSize: 11,
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 20,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          Demo
        </span>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{
          fontSize: 12,
          color: '#64748b',
          marginBottom: 4,
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          📧 Email:
        </div>
        <div
          onClick={() => copyToClipboard(creds.email, 'email')}
          title="Click to copy"
          style={{
            fontFamily: 'monospace',
            fontSize: 13,
            color: '#1e293b',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            padding: '6px 10px',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'background 0.15s'
          }}
        >
          {copiedField === 'email' ? '✓ Copied!' : creds.email}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{
          fontSize: 12,
          color: '#64748b',
          marginBottom: 4,
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          🔑 Password:
        </div>
        <div
          onClick={() => copyToClipboard(creds.password, 'password')}
          title="Click to copy"
          style={{
            fontFamily: 'monospace',
            fontSize: 13,
            color: '#1e293b',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            padding: '6px 10px',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'background 0.15s'
          }}
        >
          {copiedField === 'password' ? '✓ Copied!' : creds.password}
        </div>
      </div>

      <button
        onClick={() => onLogin(portal.key)}
        style={{
          width: '100%',
          padding: '10px 16px',
          background: color,
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          cursor: 'pointer'
        }}
      >
        Login as {portal.label}
      </button>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  const handlePortalLogin = (portalKey) => {
    navigate(`/login?portal=${portalKey}`)
  }

  const handleDemoLogin = (portalKey) => {
    navigate(`/login?portal=${portalKey}&demo=true`)
  }

  const scrollToDemo = () => {
    const el = document.getElementById('demo')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>

      {/* ── Fixed Navbar ── */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        zIndex: 1000
      }}>
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            background: '#6366f1',
            borderRadius: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MdSchool style={{ color: '#fff', fontSize: 22 }} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
            College ERP
          </span>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#6366f1',
            background: '#6366f118',
            padding: '2px 7px',
            borderRadius: 20
          }}>
            v2.0
          </span>
        </div>

        {/* Right: Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            to="/login"
            style={{
              padding: '8px 20px',
              border: '1.5px solid #6366f1',
              borderRadius: 8,
              color: '#6366f1',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
              background: 'transparent',
              transition: 'all 0.2s'
            }}
          >
            Login
          </Link>
          <Link
            to="/register"
            style={{
              padding: '8px 20px',
              background: '#6366f1',
              border: '1.5px solid #6366f1',
              borderRadius: 8,
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            Register
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{
        minHeight: '100vh',
        paddingTop: 80,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 40px 80px'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>

          {/* Badge chip */}
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 24,
            padding: '6px 16px',
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
            marginBottom: 24
          }}>
            🎓 Student Management System
          </div>

          {/* H1 */}
          <h1 style={{
            fontSize: 52,
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 20px',
            lineHeight: 1.15,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Your Complete College Portal
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.85)',
            margin: '0 0 36px',
            lineHeight: 1.7,
            maxWidth: 640,
            marginLeft: 'auto',
            marginRight: 'auto',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Manage academics, exams, finance, services and research — all in one unified platform.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            <Link
              to="/login"
              style={{
                padding: '14px 28px',
                background: '#fff',
                color: '#6366f1',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
            >
              Get Started →
            </Link>
            <button
              onClick={scrollToDemo}
              style={{
                padding: '14px 28px',
                background: 'transparent',
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.7)',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                transition: 'all 0.2s'
              }}
            >
              Try Demo
            </button>
          </div>

          {/* Small info text */}
          <p style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.65)',
            margin: '0 0 56px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            4 portals · Student · Staff · Parent · Alumni
          </p>

          {/* Floating stat cards */}
          <div style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {[
              { main: '50+ Features', sub: 'Complete ERP' },
              { main: '4 Portals', sub: 'Role-based access' },
              { main: 'Real-time', sub: 'Live updates' }
            ].map((stat) => (
              <div
                key={stat.main}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 12,
                  padding: '16px 24px',
                  textAlign: 'center',
                  minWidth: 140
                }}
              >
                <div style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#fff',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  {stat.main}
                </div>
                <div style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.75)',
                  marginTop: 2,
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section style={{
        background: '#fff',
        padding: '80px 40px'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          {/* Label chip */}
          <div style={{
            display: 'inline-block',
            background: '#6366f118',
            color: '#6366f1',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '4px 14px',
            borderRadius: 20,
            marginBottom: 16
          }}>
            Features
          </div>
          <h2 style={{
            fontSize: 36,
            fontWeight: 800,
            color: '#1e293b',
            margin: '0 0 12px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Everything you need in one place
          </h2>

          {/* 3-column grid of 6 feature cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            marginTop: 48
          }}>
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Portal Section ── */}
      <section style={{
        background: '#f8fafc',
        padding: '80px 40px'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 36,
            fontWeight: 800,
            color: '#1e293b',
            margin: '0 0 12px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Choose Your Portal
          </h2>
          <p style={{
            fontSize: 16,
            color: '#64748b',
            margin: '0 0 48px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Each portal is tailored for your specific role and responsibilities
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20
          }}>
            {PORTALS.map((portal) => (
              <PortalCard key={portal.key} portal={portal} onLogin={handlePortalLogin} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo Access Section ── */}
      <section id="demo" style={{
        background: '#fff',
        padding: '80px 40px'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          {/* Green badge chip */}
          <div style={{
            display: 'inline-block',
            background: '#10b98118',
            color: '#10b981',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '4px 14px',
            borderRadius: 20,
            marginBottom: 16
          }}>
            Demo Access
          </div>

          <h2 style={{
            fontSize: 36,
            fontWeight: 800,
            color: '#1e293b',
            margin: '0 0 12px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Try the demo instantly
          </h2>
          <p style={{
            fontSize: 16,
            color: '#64748b',
            margin: '0 0 48px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            No signup needed. Use these pre-filled credentials to explore each portal.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20
          }}>
            {PORTALS.map((portal) => (
              <DemoCard key={portal.key} portal={portal} onLogin={handleDemoLogin} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: '#1e293b',
        padding: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            background: '#6366f1',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MdSchool style={{ color: '#fff', fontSize: 18 }} />
          </div>
          <div>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#fff',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              College ERP
            </div>
            <div style={{
              fontSize: 12,
              color: '#94a3b8',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              © 2025 All rights reserved
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{
          fontSize: 13,
          color: '#94a3b8',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Built for modern institutions
        </div>
      </footer>

    </div>
  )
}
