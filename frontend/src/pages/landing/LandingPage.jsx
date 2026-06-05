import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MdSchool,
  MdBadge,
  MdPeople,
  MdStar,
  MdAdminPanelSettings,
  MdClose,
  MdMenuBook,
  MdAssignment,
  MdPayment,
  MdBuild,
  MdScience,
  MdFeedback,
  MdCheckCircle,
  MdContentCopy,
  MdCheck,
  MdLock,
  MdShield,
  MdSpeed,
  MdChevronRight,
  MdEmail,
  MdPhone,
  MdLocationOn
} from 'react-icons/md'

// ─── Data ────────────────────────────────────────────────────────────────────

const ACADEMICS_GENERAL = [
  'My Curriculum', 'HOD and Dean Info', 'Faculty Info', 'Biometric Info',
  'Class Messages', 'Regulation', 'Minor/Honour', 'Time Table',
  'Class Attendance', 'Course Page Consolidated', 'Digital Assignment Upload',
  'QCM View', 'Outcome SET Conference', 'Co-Extra Curricular',
  'Academics Calendar', 'Course Registration Allocation', 'Project Course',
  'Project Mark View', 'Apaar ID Upload'
]

const ACADEMICS_COURSE_REG = [
  'Course Registration'
]

const ACADEMICS_PROJECT = [
  'Project Proposal'
]

const EXAM_GENERAL = [
  'Exam Schedule', 'Marks', 'Grades', 'Grade History',
  'Regular Paper See/Rev', 'Additional Learning', 'MOOC File Upload',
  'Project File Upload', 'ECA File Upload', 'EPT Schedule',
  'Re-Exam Application', 'Code of Conduct'
]

const EXAM_ARREAR = [
  'Registration', 'Registration Details', 'Exam Schedule',
  'Grade View', 'Paper See/Rev'
]

const EXAM_ONLINE = [
  'Comprehensive Exam', 'Question Preview', 'Exam Information'
]

const EXAM_MAKEUP = [
  'Registration', 'ME Exam Schedule'
]

const FINANCE_ITEMS = [
  { icon: MdPayment, label: 'Payments', color: '#10b981' },
  { icon: MdPayment, label: 'Wallet Amount Add', color: '#10b981' },
  { icon: MdAssignment, label: 'Payment Receipts', color: '#10b981' },
  { icon: MdAssignment, label: 'Fees Intimation', color: '#10b981' },
  { icon: MdPayment, label: 'Online Transfer', color: '#10b981' },
  { icon: MdMenuBook, label: 'Library Due', color: '#10b981' },
  { icon: MdAssignment, label: 'Refund Request', color: '#10b981' }
]

const SERVICES_GROUPS = [
  {
    title: 'General',
    items: [
      'Facility Registration', 'Transport Registration', 'PAT Registration',
      'Transcript Request', 'Financial Assistance/Scholarship', 'Achievements',
      'Programme Migration', 'Late Hour Request', 'Final Year Registration',
      'Certificate Upload', 'eSanad Request'
    ]
  },
  {
    title: 'My Info',
    items: [
      'Profile', 'Credentials', 'Dayboarder Info',
      'Acknowledgement View', 'Student Bank Info', 'My Scholarships'
    ]
  },
  {
    title: 'My Account',
    items: ['Backup Codes', 'Change Password', 'Update Login ID']
  },
  {
    title: 'Bonafide',
    items: ['Apply Bonafide']
  },
  {
    title: 'Library',
    items: ['Online Book Recommendation']
  },
  {
    title: 'Info Corner',
    items: ['Health Center Feedback', 'FAQ']
  }
]

const RESEARCH_ITEMS = [
  'Research Regulations', 'My Research Profile', 'Course Work Registration',
  'Registration Status', 'Meeting Info', 'Attendance View',
  'Research Letters', 'Electronic Thesis Submission', 'Research Document Upload',
  'Guide Scholar Meeting', 'Weekly Scholar Workload'
]

const PORTALS = [
  {
    key: 'admin',
    label: 'Admin',
    color: '#dc2626',
    icon: MdAdminPanelSettings,
    description: 'Complete system administration'
  },
  {
    key: 'student',
    label: 'Student',
    color: '#3b82f6',
    icon: MdSchool,
    description: 'Full academic portal'
  },
  {
    key: 'staff',
    label: 'Staff',
    color: '#8b5cf6',
    icon: MdBadge,
    description: 'Teaching & management tools'
  },
  {
    key: 'parent',
    label: 'Parent',
    color: '#f59e0b',
    icon: MdPeople,
    description: 'Track ward progress'
  },
  {
    key: 'alumni',
    label: 'Alumni',
    color: '#14b8a6',
    icon: MdStar,
    description: 'Alumni network'
  }
]

const DEMO_CREDS = {
  admin: { email: 'admin@demo.com', password: 'Demo@123' },
  student: { email: 'student@demo.com', password: 'Demo@123' },
  staff: { email: 'staff@demo.com', password: 'Demo@123' },
  parent: { email: 'parent@demo.com', password: 'Demo@123' },
  alumni: { email: 'alumni@demo.com', password: 'Demo@123' }
}

const STATS = [
  { value: '6', label: 'Main Menus' },
  { value: '50+', label: 'Features' },
  { value: '5', label: 'User Portals' },
  { value: '100%', label: 'Secure Access' },
  { value: '24/7', label: 'Always Online' },
  { value: '0', label: 'Paperwork' }
]

const FEATURE_CARDS = [
  {
    icon: MdMenuBook,
    title: 'Academics',
    color: '#6366f1',
    id: 'academics',
    chips: ['General', 'Course Registration', 'Project Proposal']
  },
  {
    icon: MdAssignment,
    title: 'Examinations',
    color: '#ef4444',
    id: 'examinations',
    chips: ['General', 'Arrear', 'Online Exam', 'Make-up']
  },
  {
    icon: MdPayment,
    title: 'Finance',
    color: '#10b981',
    id: 'finance',
    chips: ['Payments', 'Wallet', 'Receipts', 'Fees', 'Refund']
  },
  {
    icon: MdBuild,
    title: 'Services',
    color: '#f59e0b',
    id: 'services',
    chips: ['General', 'My Info', 'My Account', 'Bonafide', 'Library', 'Info Corner']
  },
  {
    icon: MdScience,
    title: 'Research',
    color: '#8b5cf6',
    id: 'research',
    chips: ['Research Profile', 'Course Work', 'Thesis', 'Guide Meeting', 'Letters']
  },
  {
    icon: MdFeedback,
    title: 'Feedback',
    color: '#14b8a6',
    id: 'feedback',
    chips: ['Feedback Form', 'Course Feedback 24x7']
  }
]

const PORTAL_BG_CARDS = [
  { label: 'Admin Portal', color: '#dc2626', icon: MdAdminPanelSettings, rotate: '-4deg', top: '0px', left: '40px' },
  { label: 'Student Portal', color: '#3b82f6', icon: MdSchool, rotate: '-2deg', top: '60px', left: '20px' },
  { label: 'Staff Portal', color: '#8b5cf6', icon: MdBadge, rotate: '1deg', top: '120px', left: '10px' },
  { label: 'Parent Portal', color: '#f59e0b', icon: MdPeople, rotate: '3deg', top: '180px', left: '20px' },
  { label: 'Alumni Portal', color: '#14b8a6', icon: MdStar, rotate: '5deg', top: '240px', left: '40px' }
]

// ─── Utility: useFadeIn hook ─────────────────────────────────────────────────

function useFadeIn() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, visible]
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Chip({ label, bg = '#f1f5f9', color = '#475569', fontSize = 11 }) {
  return (
    <span style={{
      background: bg,
      color,
      borderRadius: 20,
      padding: '4px 10px',
      fontSize,
      fontWeight: 500,
      display: 'inline-block',
      lineHeight: 1.4
    }}>
      {label}
    </span>
  )
}

function SectionBadge({ text, color }) {
  return (
    <div style={{
      display: 'inline-block',
      background: `${color}18`,
      color,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      padding: '5px 14px',
      borderRadius: 20,
      marginBottom: 16
    }}>
      {text}
    </div>
  )
}

function FeatureOverviewCard({ card }) {
  const [hovered, setHovered] = useState(false)
  const Icon = card.icon
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: '24px',
        borderLeft: `4px solid ${card.color}`,
        boxShadow: hovered ? '0 8px 28px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
        cursor: 'default'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${card.color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon style={{ fontSize: 22, color: card.color }} />
        </div>
        <span style={{ fontSize: 17, fontWeight: 700, color: '#1e293b' }}>{card.title}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {card.chips.map(c => (
          <Chip key={c} label={c} />
        ))}
      </div>
    </div>
  )
}

function DemoCard({ portal, onLogin }) {
  const [copiedField, setCopiedField] = useState(null)
  const creds = DEMO_CREDS[portal.key]
  const Icon = portal.icon

  const copy = (text, field) => {
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
      boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
      border: `1px solid ${portal.color}30`,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: `${portal.color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon style={{ fontSize: 20, color: portal.color }} />
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{portal.label}</span>
        <span style={{
          background: `${portal.color}18`, color: portal.color,
          fontSize: 10, fontWeight: 700, padding: '2px 8px',
          borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.04em'
        }}>Demo</span>
      </div>

      <div>
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Email</div>
        <div
          onClick={() => copy(creds.email, 'email')}
          title="Click to copy"
          style={{
            fontFamily: 'monospace', fontSize: 12, color: '#1e293b',
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 6, padding: '7px 10px', cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            userSelect: 'none'
          }}
        >
          <span>{copiedField === 'email' ? '✓ Copied!' : creds.email}</span>
          {copiedField === 'email'
            ? <MdCheck style={{ fontSize: 14, color: '#10b981' }} />
            : <MdContentCopy style={{ fontSize: 13, color: '#94a3b8' }} />}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Password</div>
        <div
          onClick={() => copy(creds.password, 'password')}
          title="Click to copy"
          style={{
            fontFamily: 'monospace', fontSize: 12, color: '#1e293b',
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 6, padding: '7px 10px', cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            userSelect: 'none'
          }}
        >
          <span>{copiedField === 'password' ? '✓ Copied!' : creds.password}</span>
          {copiedField === 'password'
            ? <MdCheck style={{ fontSize: 14, color: '#10b981' }} />
            : <MdContentCopy style={{ fontSize: 13, color: '#94a3b8' }} />}
        </div>
      </div>

      <button
        onClick={() => onLogin(portal.key)}
        style={{
          width: '100%', padding: '10px 16px',
          background: portal.color, color: '#fff',
          border: 'none', borderRadius: 8,
          fontSize: 13, fontWeight: 600,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          cursor: 'pointer', marginTop: 4
        }}
      >
        Login as {portal.label} →
      </button>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate()
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  // Section fade-in refs
  const [statsRef, statsVisible] = useFadeIn()
  const [featuresRef, featuresVisible] = useFadeIn()
  const [academicsRef, academicsVisible] = useFadeIn()
  const [examRef, examVisible] = useFadeIn()
  const [financeRef, financeVisible] = useFadeIn()
  const [servicesRef, servicesVisible] = useFadeIn()
  const [researchRef, researchVisible] = useFadeIn()
  const [portalsRef, portalsVisible] = useFadeIn()
  const [demoRef, demoVisible] = useFadeIn()
  const [secRef, secVisible] = useFadeIn()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLogin = () => navigate('/auth/login')
  const handleDemoLogin = (key) => navigate(`/auth/login?portal=${key}&demo=true`)

  const announcementHeight = announcementVisible ? 36 : 0
  const navbarTop = announcementHeight

  const fadeStyle = (visible) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease'
  })

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b', margin: 0, padding: 0 }}>

      {/* ── 1. Announcement Bar ─────────────────────────────────────────── */}
      {announcementVisible && (
        <div style={{
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1100
        }}>
          <span style={{ color: '#fff', fontSize: 13, textAlign: 'center', padding: '0 40px' }}>
            🎓 College ERP v2.0 — Now with Research Portal, APAAR ID &amp; eSanad integration
          </span>
          <button
            onClick={() => setAnnouncementVisible(false)}
            style={{
              position: 'absolute', right: 14,
              background: 'none', border: 'none',
              color: '#fff', cursor: 'pointer',
              fontSize: 16, lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 4, borderRadius: 4,
              opacity: 0.8
            }}
            aria-label="Dismiss"
          >
            <MdClose />
          </button>
        </div>
      )}

      {/* ── 2. Fixed Navbar ─────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed',
        top: navbarTop,
        left: 0, right: 0,
        height: 64,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.09)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        zIndex: 1000,
        transition: 'box-shadow 0.3s ease, top 0.3s ease'
      }}>
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: '#6366f1', borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <MdSchool style={{ color: '#fff', fontSize: 22 }} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>College ERP</span>
          <span style={{
            fontSize: 11, fontWeight: 600, color: '#6366f1',
            background: '#6366f118', padding: '2px 7px', borderRadius: 20
          }}>v2.0</span>
        </div>

        {/* Center: Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {[
            { label: 'Features', id: 'features' },
            { label: 'Academics', id: 'academics' },
            { label: 'Examinations', id: 'examinations' },
            { label: 'Finance', id: 'finance' },
            { label: 'Services', id: 'services' },
            { label: 'Research', id: 'research' }
          ].map(link => (
            <NavLink key={link.id} label={link.label} onClick={() => scrollTo(link.id)} />
          ))}
        </div>

        {/* Right: Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleLogin}
            style={{
              padding: '8px 18px',
              border: '1.5px solid #6366f1',
              borderRadius: 8, color: '#6366f1',
              fontWeight: 600, fontSize: 13,
              background: 'transparent', cursor: 'pointer',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            Try Demo
          </button>
          <button
            onClick={handleLogin}
            style={{
              padding: '8px 18px',
              background: '#6366f1',
              border: '1.5px solid #6366f1',
              borderRadius: 8, color: '#fff',
              fontWeight: 600, fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* ── 3. Hero Section ─────────────────────────────────────────────── */}
      <section
        id="hero"
        style={{
          paddingTop: 140 + announcementHeight,
          paddingBottom: 100,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          paddingLeft: 40, paddingRight: 40
        }}
      >
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '60% 40%',
          alignItems: 'center',
          gap: 60
        }}>
          {/* Left */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 24, padding: '6px 14px',
              marginBottom: 28
            }}>
              <span style={{ color: '#10b981', fontSize: 14 }}>✓</span>
              <span style={{ color: '#10b981', fontSize: 13, fontWeight: 600 }}>
                Trusted by 10,000+ Students
              </span>
            </div>

            <h1 style={{
              fontSize: 56, fontWeight: 900, color: '#fff',
              lineHeight: 1.15, margin: '0 0 20px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Your Complete<br />
              <span style={{
                background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                College Management
              </span>
              <br />Platform
            </h1>

            <p style={{
              fontSize: 18, color: 'rgba(255,255,255,0.7)',
              marginTop: 20, lineHeight: 1.7, margin: '20px 0 0'
            }}>
              One unified platform for Students, Staff, Parents, Alumni and Administrators.
              Manage academics, examinations, finance, services and research — all in one place.
            </p>

            <div style={{ display: 'flex', gap: 16, marginTop: 36, flexWrap: 'wrap' }}>
              <button
                onClick={handleLogin}
                style={{
                  background: '#6366f1', color: '#fff',
                  padding: '14px 32px', borderRadius: 10,
                  fontSize: 15, fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                Get Started Free →
              </button>
              <button
                onClick={() => scrollTo('features')}
                style={{
                  background: 'transparent',
                  border: '2px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  padding: '14px 32px', borderRadius: 10,
                  fontSize: 15, fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                Explore All Features ↓
              </button>
            </div>

            <div style={{
              display: 'flex', gap: 24, marginTop: 28,
              flexWrap: 'wrap', alignItems: 'center'
            }}>
              {['6 Main Modules', '50+ Features', '5 User Portals'].map((s, i) => (
                <React.Fragment key={s}>
                  {i > 0 && (
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>·</span>
                  )}
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{s}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right: Floating portal cards */}
          <div style={{ position: 'relative', height: 380, display: 'flex', justifyContent: 'center' }}>
            {PORTAL_BG_CARDS.map((card, i) => {
              const Icon = card.icon
              return (
                <div
                  key={card.label}
                  style={{
                    position: 'absolute',
                    top: card.top,
                    left: card.left,
                    width: 180,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 12,
                    padding: '16px 20px',
                    transform: `rotate(${card.rotate})`,
                    display: 'flex', alignItems: 'center', gap: 10,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: `${card.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon style={{ fontSize: 20, color: card.color }} />
                  </div>
                  <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{card.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Stats Bar ────────────────────────────────────────────────── */}
      <div
        ref={statsRef}
        style={{
          background: '#fff',
          padding: '40px 0',
          borderBottom: '1px solid #f1f5f9',
          ...fadeStyle(statsVisible)
        }}
      >
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', justifyContent: 'center',
          alignItems: 'center', flexWrap: 'wrap',
          gap: 0
        }}>
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && (
                <div style={{ width: 1, height: 48, background: '#e2e8f0', margin: '0 32px' }} />
              )}
              <div style={{ textAlign: 'center', minWidth: 90 }}>
                <div style={{
                  fontSize: 36, fontWeight: 800, color: '#6366f1',
                  lineHeight: 1, marginBottom: 4
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{s.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── 5. All Features Overview ─────────────────────────────────────── */}
      <section
        id="features"
        ref={featuresRef}
        style={{
          background: '#f8fafc', padding: '80px 40px',
          ...fadeStyle(featuresVisible)
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionBadge text="Platform Overview" color="#6366f1" />
            <h2 style={{
              fontSize: 36, fontWeight: 800, color: '#1e293b',
              margin: '0 0 12px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Everything Built Into One Platform
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>
              Explore every module and its capabilities
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24
          }}>
            {FEATURE_CARDS.map(card => (
              <FeatureOverviewCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Academics Deep Dive ───────────────────────────────────────── */}
      <section
        id="academics"
        ref={academicsRef}
        style={{
          background: '#fff', padding: '80px 40px',
          ...fadeStyle(academicsVisible)
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionBadge text="📚 Academics" color="#6366f1" />
            <h2 style={{
              fontSize: 36, fontWeight: 800, color: '#1e293b', margin: '0 0 12px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Complete Academic Management
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 600, margin: '0 auto' }}>
              From curriculum planning to project submissions, every academic need is covered
              in a single, intuitive interface.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {/* General */}
            <div style={{
              background: '#f8fafc', borderRadius: 16, padding: 28,
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#6366f1', marginBottom: 16 }}>
                General
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {ACADEMICS_GENERAL.map(item => (
                  <Chip key={item} label={item} bg="#eef2ff" color="#4f46e5" fontSize={11} />
                ))}
              </div>
            </div>

            {/* Course Registration */}
            <div style={{
              background: '#f8fafc', borderRadius: 16, padding: 28,
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#6366f1', marginBottom: 16 }}>
                Course Registration
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {ACADEMICS_COURSE_REG.map(item => (
                  <Chip key={item} label={item} bg="#eef2ff" color="#4f46e5" fontSize={11} />
                ))}
              </div>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 16, lineHeight: 1.6 }}>
                Streamlined course selection and allocation management for each semester with
                automated prerequisite validation.
              </p>
            </div>

            {/* Project Proposal */}
            <div style={{
              background: '#f8fafc', borderRadius: 16, padding: 28,
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#6366f1', marginBottom: 16 }}>
                Project Proposal
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {ACADEMICS_PROJECT.map(item => (
                  <Chip key={item} label={item} bg="#eef2ff" color="#4f46e5" fontSize={11} />
                ))}
              </div>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 16, lineHeight: 1.6 }}>
                Submit, track and manage project proposals with guide assignment, milestone tracking
                and mark view.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Examinations Deep Dive ────────────────────────────────────── */}
      <section
        id="examinations"
        ref={examRef}
        style={{
          background: '#f8fafc', padding: '80px 40px',
          ...fadeStyle(examVisible)
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionBadge text="📝 Examinations" color="#ef4444" />
            <h2 style={{
              fontSize: 36, fontWeight: 800, color: '#1e293b', margin: '0 0 12px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              End-to-End Examination System
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 600, margin: '0 auto' }}>
              Covers regular, arrear, online and make-up examinations with full transparency on
              marks, grades and re-evaluation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {[
              { title: 'General', items: EXAM_GENERAL, color: '#ef4444' },
              { title: 'Arrear', items: EXAM_ARREAR, color: '#f97316' },
              { title: 'Online Examinations', items: EXAM_ONLINE, color: '#8b5cf6' },
              { title: 'Make-up Exam', items: EXAM_MAKEUP, color: '#06b6d4' }
            ].map(group => (
              <div key={group.title} style={{
                background: '#fff', borderRadius: 16, padding: 28,
                border: '1px solid #e2e8f0',
                borderTop: `4px solid ${group.color}`
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: group.color, marginBottom: 16 }}>
                  {group.title}
                  <span style={{
                    marginLeft: 8, fontSize: 11, fontWeight: 600,
                    background: `${group.color}15`, color: group.color,
                    padding: '2px 8px', borderRadius: 20
                  }}>
                    {group.items.length} items
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {group.items.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MdCheckCircle style={{ fontSize: 15, color: group.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: '#374151' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Finance Section ───────────────────────────────────────────── */}
      <section
        id="finance"
        ref={financeRef}
        style={{
          background: '#fff', padding: '80px 40px',
          ...fadeStyle(financeVisible)
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionBadge text="💰 Finance" color="#10b981" />
            <h2 style={{
              fontSize: 36, fontWeight: 800, color: '#1e293b', margin: '0 0 12px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Transparent Fee &amp; Payment Management
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 600, margin: '0 auto' }}>
              Complete financial visibility — from fee intimation to online payments,
              wallet top-ups, and refund processing.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {FINANCE_ITEMS.map(item => {
              const Icon = item.icon
              return (
                <FinanceCard key={item.label} item={item} />
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 9. Services Section ──────────────────────────────────────────── */}
      <section
        id="services"
        ref={servicesRef}
        style={{
          background: '#f8fafc', padding: '80px 40px',
          ...fadeStyle(servicesVisible)
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionBadge text="🛠️ Services" color="#f59e0b" />
            <h2 style={{
              fontSize: 36, fontWeight: 800, color: '#1e293b', margin: '0 0 12px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Student Services Hub
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 600, margin: '0 auto' }}>
              One-stop access to registrations, certificates, profile management,
              library, and more — all without paperwork.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {SERVICES_GROUPS.map(group => (
              <div key={group.title} style={{
                background: '#fff', borderRadius: 16, padding: 24,
                border: '1px solid #e2e8f0',
                borderLeft: '4px solid #f59e0b'
              }}>
                <div style={{
                  fontSize: 14, fontWeight: 700, color: '#d97706',
                  marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <MdBuild style={{ fontSize: 16 }} />
                  {group.title}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {group.items.map(item => (
                    <Chip key={item} label={item} bg="#fef3c7" color="#92400e" fontSize={11} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Research Section ─────────────────────────────────────────── */}
      <section
        id="research"
        ref={researchRef}
        style={{
          background: '#fff', padding: '60px 40px',
          ...fadeStyle(researchVisible)
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionBadge text="🔬 Research" color="#8b5cf6" />
            <h2 style={{
              fontSize: 36, fontWeight: 800, color: '#1e293b', margin: '0 0 12px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              PhD &amp; Research Scholar Portal
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 600, margin: '0 auto' }}>
              A dedicated research portal covering all aspects of the PhD journey — from
              registration to thesis submission.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
            maxWidth: 900, margin: '0 auto'
          }}>
            {RESEARCH_ITEMS.map((item, i) => (
              <div key={item} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#faf5ff', border: '1px solid #e9d5ff',
                borderRadius: 10, padding: '12px 16px'
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: '#8b5cf6', color: '#fff',
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. Portal Access Section ────────────────────────────────────── */}
      <section
        id="portals"
        ref={portalsRef}
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
          padding: '80px 40px',
          ...fadeStyle(portalsVisible)
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{
              fontSize: 36, fontWeight: 800, color: '#fff', margin: '0 0 12px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Choose Your Portal
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>
              Each portal is purpose-built for your specific role
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 20
          }}>
            {PORTALS.map(portal => {
              const Icon = portal.icon
              return (
                <PortalAccessCard
                  key={portal.key}
                  portal={portal}
                  onLogin={() => navigate('/auth/login')}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 12. Demo Access ──────────────────────────────────────────────── */}
      <section
        id="demo"
        ref={demoRef}
        style={{
          background: '#f8fafc', padding: '80px 40px',
          ...fadeStyle(demoVisible)
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionBadge text="Live Demo" color="#10b981" />
            <h2 style={{
              fontSize: 36, fontWeight: 800, color: '#1e293b', margin: '0 0 12px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Try the Demo — No Sign Up Needed
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 560, margin: '0 auto' }}>
              Click any card below to instantly access a portal with pre-filled credentials.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 20
          }}>
            {PORTALS.map(portal => (
              <DemoCard key={portal.key} portal={portal} onLogin={handleDemoLogin} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. Security & Technology ────────────────────────────────────── */}
      <section
        ref={secRef}
        style={{
          background: '#fff', padding: '60px 40px',
          ...fadeStyle(secVisible)
        }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 28, fontWeight: 800, color: '#1e293b', margin: '0 0 40px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Enterprise-Grade Security &amp; Technology
          </h2>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
            marginBottom: 48
          }}>
            {[
              { icon: MdLock, title: 'JWT Secured', desc: 'Industry-standard JSON Web Token authentication with token refresh and revocation.', color: '#6366f1' },
              { icon: MdShield, title: 'Role-Based Access', desc: 'Granular permission control — every feature is gated by role and portal type.', color: '#10b981' },
              { icon: MdSpeed, title: 'Spring Boot Backend', desc: 'High-performance REST API built on Spring Boot 3 with JPA, Hibernate & MySQL.', color: '#f59e0b' }
            ].map(badge => {
              const Icon = badge.icon
              return (
                <div key={badge.title} style={{
                  background: '#f8fafc', borderRadius: 16, padding: 28,
                  border: '1px solid #e2e8f0', textAlign: 'center'
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: `${badge.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <Icon style={{ fontSize: 28, color: badge.color }} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                    {badge.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                    {badge.desc}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{
            background: '#f8fafc', borderRadius: 12, padding: '20px 32px',
            border: '1px solid #e2e8f0', display: 'inline-flex',
            alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center'
          }}>
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
              Tech Stack:
            </span>
            {['React 18', 'React Router v6', 'Spring Boot 3', 'MySQL', 'JWT', 'Vite'].map(tech => (
              <span key={tech} style={{
                background: '#e2e8f0', color: '#475569',
                fontSize: 12, fontWeight: 600,
                padding: '4px 12px', borderRadius: 20
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 14. Footer ───────────────────────────────────────────────────── */}
      <footer style={{ background: '#0f172a', padding: '60px 40px 0' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
          gap: 48, paddingBottom: 48,
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, background: '#6366f1', borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <MdSchool style={{ color: '#fff', fontSize: 22 }} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>College ERP</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>v2.0</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, maxWidth: 260, margin: 0 }}>
              A comprehensive college management platform for modern educational institutions.
              Manage academics, exams, finance, services and research in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Quick Links
            </div>
            {[
              { label: 'Features', id: 'features' },
              { label: 'Login', path: '/auth/login' },
              { label: 'Register', path: '/auth/register' },
              { label: 'Demo', id: 'demo' }
            ].map(link => (
              <div key={link.label} style={{ marginBottom: 10 }}>
                {link.path ? (
                  <Link to={link.path} style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>
                    {link.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollTo(link.id)}
                    style={{
                      background: 'none', border: 'none', padding: 0,
                      fontSize: 13, color: '#64748b', cursor: 'pointer',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  >
                    {link.label}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Portals */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Portals
            </div>
            {PORTALS.map(p => (
              <div key={p.key} style={{ marginBottom: 10 }}>
                <button
                  onClick={() => navigate('/auth/login')}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    fontSize: 13, color: '#64748b', cursor: 'pointer',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  {p.label} Portal
                </button>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Contact
            </div>
            {[
              { icon: MdEmail, text: 'support@collegeerp.edu' },
              { icon: MdPhone, text: '+91 98765 43210' },
              { icon: MdLocationOn, text: 'Tamil Nadu, India' }
            ].map(c => {
              const Icon = c.icon
              return (
                <div key={c.text} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12
                }}>
                  <Icon style={{ fontSize: 15, color: '#6366f1', marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#64748b' }}>{c.text}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '20px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 10
        }}>
          <span style={{ fontSize: 12, color: '#475569' }}>
            © 2025 College ERP. All rights reserved.
          </span>
          <span style={{ fontSize: 12, color: '#475569' }}>
            Built with Spring Boot &amp; React
          </span>
        </div>
      </footer>

    </div>
  )
}

// ─── Small helper sub-components ─────────────────────────────────────────────

function NavLink({ label, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        fontSize: 13, color: hovered ? '#6366f1' : '#64748b',
        cursor: 'pointer', padding: '8px 12px',
        background: 'none', border: 'none',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: 500,
        transition: 'color 0.15s'
      }}
    >
      {label}
    </button>
  )
}

function FinanceCard({ item }) {
  const [hovered, setHovered] = useState(false)
  const Icon = item.icon
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#f0fdf4' : '#f8fafc',
        border: `1px solid ${hovered ? '#86efac' : '#e2e8f0'}`,
        borderRadius: 12, padding: '20px 18px',
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'default', transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 4px 16px rgba(16,185,129,0.12)' : 'none'
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 9,
        background: '#d1fae515',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#dcfce7'
      }}>
        <Icon style={{ fontSize: 20, color: '#10b981' }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{item.label}</span>
    </div>
  )
}

function PortalAccessCard({ portal, onLogin }) {
  const [hovered, setHovered] = useState(false)
  const Icon = portal.icon
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.08)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 16, padding: 28,
        display: 'flex', flexDirection: 'column', gap: 12,
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        cursor: 'default'
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${portal.color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon style={{ fontSize: 24, color: portal.color }} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{portal.label}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
        {portal.description}
      </div>
      <button
        onClick={onLogin}
        style={{
          padding: '9px 16px',
          background: portal.color,
          color: '#fff', border: 'none',
          borderRadius: 8, fontSize: 13, fontWeight: 600,
          cursor: 'pointer', marginTop: 4,
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        Login →
      </button>
    </div>
  )
}
