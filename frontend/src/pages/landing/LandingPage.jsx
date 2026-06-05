import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MdSchool, MdBadge, MdPeople, MdStar, MdAdminPanelSettings,
  MdMenuBook, MdAssignment, MdPayment, MdMiscellaneousServices,
  MdScience, MdFeedback, MdArrowForward, MdCheck, MdContentCopy,
  MdDone, MdShield, MdSpeed, MdVerified, MdLayers, MdGroups,
  MdAutoGraph, MdNotifications, MdKeyboardArrowDown,
} from 'react-icons/md'

// ─── Counter Component ────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    if (typeof target !== 'number') { setCount(target); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1800, steps = 60
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= target) { setCount(target); clearInterval(timer) }
          else setCount(Math.floor(current))
        }, duration / steps)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>{typeof target === 'number' ? count : target}{suffix}</span>
}

// ─── Constants ────────────────────────────────────────────────────────────────
const FONT = "'Inter', system-ui, -apple-system, sans-serif"

const MARQUEE_ITEMS = [
  'Academic Management', 'Exam Schedules', 'Online Payments', 'Faculty Portal',
  'PhD Research', 'Course Registration', 'Biometric Attendance', 'Proctor System',
  'FDP Events', 'Bonafide Certificate', 'APAAR ID', 'eSanad Request',
  'Grade History', 'Project Registration', 'Feedback System', 'Library Services',
  'HR Management', 'International Relations',
]

const PORTALS = [
  { key: 'admin',   label: 'Admin',   color: '#DC2626', icon: MdAdminPanelSettings, description: 'Full system administration' },
  { key: 'student', label: 'Student', color: '#6366F1', icon: MdSchool,             description: 'Complete academic portal' },
  { key: 'staff',   label: 'Staff',   color: '#8B5CF6', icon: MdBadge,              description: 'Teaching & management' },
  { key: 'parent',  label: 'Parent',  color: '#F59E0B', icon: MdPeople,             description: "Track ward's progress" },
  { key: 'alumni',  label: 'Alumni',  color: '#10B981', icon: MdStar,               description: 'Alumni network' },
]

const DEMO_CREDS = {
  admin:   { email: 'admin@demo.com',   password: 'Demo@123' },
  student: { email: 'student@demo.com', password: 'Demo@123' },
  staff:   { email: 'staff@demo.com',   password: 'Demo@123' },
  parent:  { email: 'parent@demo.com',  password: 'Demo@123' },
  alumni:  { email: 'alumni@demo.com',  password: 'Demo@123' },
}

const BENTO_FEATURES = [
  {
    id: 'academics', color: '#6366F1', icon: MdMenuBook, span: 1,
    title: 'Academics',
    desc: 'End-to-end academic lifecycle management — from curriculum to project submissions.',
    chips: ['My Curriculum', 'Time Table', 'Class Attendance', 'Digital Assignment Upload',
      'QCM View', 'Course Registration', 'Biometric Info', 'HOD & Dean Info',
      'Faculty Info', 'Regulation', 'Minor/Honour', 'Academics Calendar',
      'Project Course', 'Project Mark View', 'Apaar ID Upload'],
  },
  {
    id: 'exams', color: '#EF4444', icon: MdAssignment, span: 1,
    title: 'Examinations',
    desc: 'Transparent exam tracking — schedules, results, re-evaluation and online tests.',
    chips: ['Exam Schedule', 'Marks', 'Grades', 'Grade History',
      'Regular Paper See/Rev', 'MOOC File Upload', 'EPT Schedule',
      'Re-Exam Application', 'Arrear Exam', 'Online Examinations',
      'Make-up Exam', 'Code of Conduct'],
  },
  {
    id: 'finance', color: '#10B981', icon: MdPayment, span: 2,
    title: 'Finance & Payments',
    desc: 'Complete financial transparency — from fee intimation and online payments to refund tracking.',
    chips: ['Payments', 'Wallet Amount Add', 'Payment Receipts',
      'Fees Intimation', 'Online Transfer', 'Library Due', 'Refund Request'],
    wide: true,
  },
  {
    id: 'services', color: '#F59E0B', icon: MdMiscellaneousServices, span: 1,
    title: 'Student Services',
    desc: 'Certificates, registrations, and profile management — fully paperless.',
    chips: ['Bonafide', 'Library', 'Transport', 'Facility Registration',
      'Scholarship', 'Transcript', 'eSanad', 'APAAR ID', 'Certificate Upload'],
  },
  {
    id: 'research', color: '#8B5CF6', icon: MdScience, span: 1,
    title: 'Research Portal',
    desc: 'Dedicated PhD journey management from registration to thesis submission.',
    chips: ['PhD Registration', 'Thesis Submission', 'Scholar Reports',
      'Committee Reviews', 'Course Work', 'IRINS', 'ETD Approval'],
  },
  {
    id: 'feedback', color: '#06B6D4', icon: MdFeedback, span: 3,
    title: 'Feedback System',
    desc: 'Structured feedback loops for continuous improvement across all courses and instructors.',
    chips: ['Course Feedback', 'Student Feedback', 'Feedback Report'],
    full: true,
  },
]

const STEPS = [
  { num: '01', color: '#6366F1', title: 'Select Your Portal', desc: 'Choose from Student, Staff, Parent, Alumni or Admin — each tailored to your role.' },
  { num: '02', color: '#A855F7', title: 'Sign In Securely', desc: 'Authenticate with your institution credentials. Role-based access ensures data safety.' },
  { num: '03', color: '#06B6D4', title: 'Access Your Dashboard', desc: 'Land directly on your personalized dashboard — academics, exams, finance, all in view.' },
]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled]           = useState(false)
  const [showAnnounce, setShowAnnounce]   = useState(true)
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [hoveredPortal, setHoveredPortal]   = useState(null)
  const [copiedPortal, setCopiedPortal]     = useState(null)
  const [isMobile, setIsMobile]             = useState(window.innerWidth <= 768)
  const [hoveredCTA, setHoveredCTA]         = useState(null)
  const [hoveredStat, setHoveredStat]       = useState(null)
  const [hoveredStep, setHoveredStep]       = useState(null)
  const [hoveredNav, setHoveredNav]         = useState(null)
  const [copiedField, setCopiedField]       = useState({})

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(prev => ({ ...prev, [key]: true }))
      setTimeout(() => setCopiedField(prev => ({ ...prev, [key]: false })), 2000)
    })
  }

  const ANNOUNCE_H = showAnnounce ? 44 : 0
  const NAV_H = 64
  const TOP_OFFSET = ANNOUNCE_H + NAV_H

  // gradient text style
  const gradientText = {
    background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 50%, #A855F7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }

  return (
    <div style={{ fontFamily: FONT, color: '#0F172A', margin: 0, padding: 0, overflowX: 'hidden', background: '#FAFAFA' }}>

      {/* ── Keyframe Animations ───────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }
        @keyframes bounce  { 0%,100% { transform: translateX(-50%) translateY(0) } 50% { transform: translateX(-50%) translateY(8px) } }
        @keyframes pulse   { 0%,100% { opacity: 1 } 50% { opacity: 0.5 } }
        @keyframes blobPulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.08) } }
        @keyframes float   { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
      `}</style>

      {/* ════════════════════════════════════════════════════════════════════
          1. ANNOUNCEMENT BAR
      ════════════════════════════════════════════════════════════════════ */}
      {showAnnounce && (
        <div style={{
          height: 44,
          background: 'linear-gradient(90deg, #6366F1, #A855F7, #06B6D4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 1100,
        }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 500, textAlign: 'center', padding: '0 48px' }}>
            ✨ College ERP v2.0 is here — APAAR ID, eSanad, Research Portal and more
          </span>
          <button
            onClick={() => setShowAnnounce(false)}
            style={{
              position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)',
              fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: '4px 8px',
              borderRadius: 6, display: 'flex', alignItems: 'center',
            }}
          >✕</button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          2. FIXED NAVBAR
      ════════════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed',
        top: ANNOUNCE_H,
        left: 0, right: 0,
        height: NAV_H,
        zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.06)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 20px' : '0 48px',
        transition: 'all 0.3s',
      }}>
        {/* Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: '#6366F1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
          }}>
            <MdSchool style={{ color: '#fff', fontSize: 22 }} />
          </div>
          <span style={{
            fontSize: 18, fontWeight: 800,
            color: scrolled ? '#0F172A' : '#fff',
            letterSpacing: '-0.4px',
            transition: 'color 0.3s',
          }}>College ERP</span>
        </div>

        {/* Center Nav */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[
              { label: 'Features', id: 'features' },
              { label: 'Portals',  id: 'portals' },
              { label: 'Academics', id: 'how-it-works' },
              { label: 'Demo',    id: 'demo' },
            ].map(link => (
              <button
                key={link.id}
                onMouseEnter={() => setHoveredNav(link.id)}
                onMouseLeave={() => setHoveredNav(null)}
                onClick={() => scrollTo(link.id)}
                style={{
                  fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  padding: '8px 14px', borderRadius: 8,
                  background: 'none',
                  color: hoveredNav === link.id
                    ? (scrolled ? '#6366F1' : '#fff')
                    : (scrolled ? '#64748B' : 'rgba(255,255,255,0.8)'),
                  border: 'none', fontFamily: FONT,
                  transition: 'color 0.2s',
                }}
              >{link.label}</button>
            ))}
          </div>
        )}

        {/* Right Buttons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onMouseEnter={() => setHoveredCTA('signin')}
            onMouseLeave={() => setHoveredCTA(null)}
            onClick={() => navigate('/auth/login')}
            style={{
              padding: '8px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              border: '1.5px solid',
              borderColor: scrolled ? '#E2E8F0' : 'rgba(255,255,255,0.4)',
              background: 'transparent',
              color: scrolled ? '#0F172A' : '#fff',
              cursor: 'pointer', fontFamily: FONT,
              transition: 'all 0.2s',
            }}
          >Sign In</button>
          <button
            onMouseEnter={() => setHoveredCTA('start')}
            onMouseLeave={() => setHoveredCTA(null)}
            onClick={() => navigate('/auth/register')}
            style={{
              padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700,
              background: '#6366F1', border: 'none', color: '#fff',
              cursor: 'pointer', fontFamily: FONT,
              boxShadow: hoveredCTA === 'start'
                ? '0 4px 20px rgba(99,102,241,0.7)'
                : '0 2px 12px rgba(99,102,241,0.4)',
              transform: hoveredCTA === 'start' ? 'translateY(-1px)' : 'none',
              transition: 'all 0.2s',
            }}
          >Get Started</button>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════════════
          3. HERO SECTION
      ════════════════════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh',
        background: '#080B14',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        paddingTop: TOP_OFFSET + 24,
        paddingBottom: 80,
        paddingLeft: isMobile ? 20 : 48,
        paddingRight: isMobile ? 20 : 48,
      }}>
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Blob 1 */}
        <div style={{
          position: 'absolute', top: '20%', left: '15%',
          width: 500, height: 500, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
          animation: 'blobPulse 7s ease-in-out infinite',
        }} />
        {/* Blob 2 */}
        <div style={{
          position: 'absolute', bottom: '15%', right: '10%',
          width: 400, height: 400, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)',
          animation: 'blobPulse 9s ease-in-out infinite',
        }} />
        {/* Blob 3 */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 60%)',
        }} />

        {/* Content */}
        <div style={{
          maxWidth: 900, width: '100%', margin: '0 auto',
          textAlign: 'center', position: 'relative', zIndex: 1,
        }}>
          {/* Badge chip */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 100, padding: '8px 20px', marginBottom: 32,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#10B981',
              boxShadow: '0 0 0 3px rgba(16,185,129,0.2)',
              display: 'inline-block', flexShrink: 0,
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 13, color: '#A5B4FC', fontWeight: 600 }}>
              Complete Student Information System
            </span>
          </div>

          {/* H1 */}
          <h1 style={{
            fontSize: 'clamp(48px, 6vw, 80px)',
            fontWeight: 900,
            letterSpacing: '-3px',
            lineHeight: 1.05,
            color: '#fff',
            marginBottom: 24,
            fontFamily: FONT,
          }}>
            The Modern Platform for{'\n'}
            <span style={gradientText}>Every College Portal</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8,
            maxWidth: 580, margin: '0 auto 40px',
          }}>
            Unified platform for Students, Faculty, Parents, Alumni and Administrators.
            Academics, Examinations, Finance, Research — everything connected.
          </p>

          {/* CTA Row */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <button
              onMouseEnter={() => setHoveredCTA('hero-start')}
              onMouseLeave={() => setHoveredCTA(null)}
              onClick={() => navigate('/auth/login')}
              style={{
                padding: '14px 32px', borderRadius: 12, border: 'none',
                background: '#6366F1', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: FONT,
                boxShadow: hoveredCTA === 'hero-start'
                  ? '0 8px 32px rgba(99,102,241,0.7)'
                  : '0 4px 20px rgba(99,102,241,0.5)',
                transform: hoveredCTA === 'hero-start' ? 'translateY(-2px)' : 'none',
                transition: 'all 0.2s',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              Start Exploring <MdArrowForward style={{ fontSize: 18 }} />
            </button>
            <button
              onMouseEnter={() => setHoveredCTA('hero-feat')}
              onMouseLeave={() => setHoveredCTA(null)}
              onClick={() => scrollTo('features')}
              style={{
                padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                background: hoveredCTA === 'hero-feat' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                color: '#fff', cursor: 'pointer', fontFamily: FONT,
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s',
              }}
            >
              View All Features ↓
            </button>
          </div>

          {/* Trust Pills */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            {[
              { icon: MdShield,   label: 'SSL Secured' },
              { icon: MdVerified, label: 'Role-Based Access' },
              { icon: MdLayers,   label: '6 Main Portals' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 100, padding: '8px 16px',
                color: 'rgba(255,255,255,0.6)', fontSize: 13,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <Icon style={{ fontSize: 14, color: '#A5B4FC' }} />
                {label}
              </div>
            ))}
          </div>

          {/* Dashboard Mockup */}
          <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
            {/* Glassmorphism Card */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24, padding: 24,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
              animation: 'float 6s ease-in-out infinite',
            }}>
              {/* Window chrome */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28CA41' }} />
                <span style={{
                  flex: 1, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.5)',
                  marginLeft: -36, pointerEvents: 'none',
                }}>
                  College ERP — Student Portal
                </span>
              </div>
              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { value: '87.5%',    label: 'Attendance', color: '#06B6D4' },
                  { value: '8.74',     label: 'CGPA',       color: '#6366F1' },
                  { value: '₹47,500',  label: 'Pending',    color: '#F59E0B' },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: `${stat.color}12`, borderRadius: 12,
                    padding: '12px 10px', textAlign: 'center',
                    border: `1px solid ${stat.color}25`,
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />

              {/* Feature chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['📚 Time Table', '📝 Exam Schedule', '💰 Fee Payment', '🔬 Research Portal'].map(chip => (
                  <span key={chip} style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, padding: '8px 14px',
                    color: 'rgba(255,255,255,0.75)', fontSize: 13,
                  }}>{chip}</span>
                ))}
              </div>
            </div>

            {/* Floating badge top-right */}
            <div style={{
              position: 'absolute', top: -16, right: isMobile ? 0 : -20,
              background: 'rgba(16,185,129,0.9)',
              border: '1px solid rgba(16,185,129,0.4)',
              borderRadius: 100, padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 4px 20px rgba(16,185,129,0.4)',
              backdropFilter: 'blur(10px)',
            }}>
              <MdCheck style={{ fontSize: 14, color: '#fff' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
                CGPA 8.74 — Excellent
              </span>
            </div>

            {/* Floating badge bottom-left */}
            <div style={{
              position: 'absolute', bottom: -16, left: isMobile ? 0 : -20,
              background: 'rgba(99,102,241,0.9)',
              border: '1px solid rgba(99,102,241,0.4)',
              borderRadius: 100, padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
              backdropFilter: 'blur(10px)',
            }}>
              <MdAutoGraph style={{ fontSize: 14, color: '#fff' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>50+ Features Available</span>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute', bottom: 32, left: '50%',
            animation: 'bounce 2s ease-in-out infinite',
            color: 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: 500,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            cursor: 'pointer', whiteSpace: 'nowrap',
          }} onClick={() => scrollTo('marquee-strip')}>
            ↓ Scroll to explore
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          4. MARQUEE STRIP
      ════════════════════════════════════════════════════════════════════ */}
      <div id="marquee-strip" style={{
        height: 48,
        background: 'linear-gradient(90deg, #4F46E5, #7C3AED, #2563EB, #4F46E5)',
        overflow: 'hidden',
        borderTop: '1px solid rgba(99,102,241,0.4)',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          display: 'flex', width: 'max-content',
          animation: 'marquee 32s linear infinite',
        }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '0 28px', whiteSpace: 'nowrap',
            }}>
              <MdVerified style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.88)', letterSpacing: '0.03em' }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          5. STATS BAR
      ════════════════════════════════════════════════════════════════════ */}
      <section style={{
        background: '#fff',
        padding: '64px 40px',
        borderBottom: '1px solid #F1F5F9',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
          gap: 24,
        }}>
          {[
            { icon: MdMenuBook,  value: 6,   suffix: '+', label: 'Main Menus',  color: '#6366F1', bg: '#EEF2FF' },
            { icon: MdLayers,    value: 50,  suffix: '+', label: 'Features',    color: '#A855F7', bg: '#F5F3FF' },
            { icon: MdGroups,    value: 5,   suffix: '',  label: 'User Portals',color: '#06B6D4', bg: '#ECFEFF' },
            { icon: MdSpeed,     value: 100, suffix: '%', label: 'Uptime',      color: '#10B981', bg: '#F0FDF4' },
          ].map((stat, i) => {
            const Icon = stat.icon
            const hov = hoveredStat === i
            return (
              <div
                key={stat.label}
                onMouseEnter={() => setHoveredStat(i)}
                onMouseLeave={() => setHoveredStat(null)}
                style={{
                  borderRadius: 16, background: '#FAFAFA',
                  border: '1px solid #F1F5F9',
                  padding: '32px 24px', textAlign: 'center',
                  transform: hov ? 'translateY(-4px)' : 'none',
                  boxShadow: hov ? '0 8px 32px rgba(99,102,241,0.12)' : 'none',
                  transition: 'all 0.22s ease', cursor: 'default',
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: stat.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Icon style={{ fontSize: 26, color: stat.color }} />
                </div>
                <div style={{
                  fontSize: 40, fontWeight: 800, color: '#0F172A',
                  lineHeight: 1, marginBottom: 8, letterSpacing: '-1.5px',
                }}>
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>{stat.label}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          6. FEATURES — BENTO GRID
      ════════════════════════════════════════════════════════════════════ */}
      <section id="features" style={{ background: '#FAFAFA', padding: '88px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 20,
            }}>
              <MdLayers style={{ fontSize: 13, color: '#6366F1' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#6366F1' }}>WHAT'S INCLUDED</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800,
              color: '#0F172A', letterSpacing: '-2px', marginBottom: 16, fontFamily: FONT,
            }}>
              Every Module. Every Feature.
            </h2>
            <p style={{
              fontSize: 17, color: '#475569', lineHeight: 1.7,
              maxWidth: 560, margin: '0 auto',
            }}>
              From daily attendance to PhD thesis submission — one platform handles it all.
            </p>
          </div>

          {/* Bento Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}>
            {BENTO_FEATURES.map((feat, i) => {
              const Icon = feat.icon
              const hov = hoveredFeature === i
              const colSpan = feat.full ? 3 : (feat.wide ? 2 : 1)
              return (
                <div
                  key={feat.id}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{
                    gridColumn: `span ${colSpan}`,
                    background: '#FFFFFF',
                    borderRadius: 20,
                    border: hov ? `1px solid ${feat.color}40` : '1px solid #E2E8F0',
                    padding: 28,
                    boxShadow: hov
                      ? `0 12px 40px rgba(99,102,241,0.15)`
                      : '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.04)',
                    transform: hov ? 'translateY(-4px)' : 'none',
                    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                    borderTop: `4px solid ${feat.color}`,
                    display: 'flex',
                    flexDirection: feat.full && !isMobile ? 'row' : 'column',
                    gap: 20,
                    alignItems: feat.full && !isMobile ? 'center' : 'flex-start',
                  }}
                >
                  {/* Card content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: `${feat.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 16,
                    }}>
                      <Icon style={{ fontSize: 26, color: feat.color }} />
                    </div>
                    <h3 style={{
                      fontSize: 20, fontWeight: 800, color: '#0F172A',
                      marginBottom: 8, fontFamily: FONT,
                    }}>{feat.title}</h3>
                    <p style={{
                      fontSize: 15, color: '#475569', lineHeight: 1.7,
                      marginBottom: 16,
                    }}>{feat.desc}</p>
                    {/* Chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {feat.chips.map(chip => (
                        <span key={chip} style={{
                          background: hov ? `${feat.color}10` : '#F8FAFC',
                          border: hov ? `1px solid ${feat.color}25` : '1px solid #E2E8F0',
                          borderRadius: 100,
                          padding: '4px 12px',
                          fontSize: 12,
                          color: hov ? feat.color : '#475569',
                          fontWeight: 500,
                          transition: 'all 0.2s',
                        }}>{chip}</span>
                      ))}
                    </div>
                  </div>

                  {/* Wide card payment mockup */}
                  {feat.wide && !isMobile && (
                    <div style={{
                      flexShrink: 0, width: 220,
                      background: `${feat.color}08`,
                      border: `1px solid ${feat.color}20`,
                      borderRadius: 16, padding: '20px 18px',
                    }}>
                      <div style={{ fontSize: 11, color: feat.color, fontWeight: 700, marginBottom: 12, letterSpacing: '0.08em' }}>
                        PAYMENT RECEIPT
                      </div>
                      {[
                        { label: 'Tuition Fee', amount: '₹42,000', status: 'Paid', c: '#10B981' },
                        { label: 'Library Due', amount: '₹120',    status: 'Due',  c: '#F59E0B' },
                        { label: 'Wallet',      amount: '₹5,500',  status: 'Available', c: '#6366F1' },
                      ].map(row => (
                        <div key={row.label} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)',
                        }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{row.label}</div>
                            <div style={{ fontSize: 11, color: '#64748B' }}>{row.amount}</div>
                          </div>
                          <span style={{
                            fontSize: 10, fontWeight: 700, color: row.c,
                            background: `${row.c}15`, padding: '3px 8px', borderRadius: 20,
                          }}>{row.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Full width feedback rating */}
                  {feat.full && !isMobile && (
                    <div style={{
                      flexShrink: 0, width: 200,
                      background: `${feat.color}08`,
                      border: `1px solid ${feat.color}20`,
                      borderRadius: 16, padding: '20px 18px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 11, color: feat.color, fontWeight: 700, marginBottom: 12, letterSpacing: '0.08em' }}>
                        COURSE RATING
                      </div>
                      <div style={{ fontSize: 36, fontWeight: 900, color: '#F59E0B', marginBottom: 6 }}>4.8</div>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 8 }}>
                        {[1,2,3,4,5].map(s => (
                          <span key={s} style={{ fontSize: 18, color: s <= 4 ? '#F59E0B' : '#E2E8F0' }}>★</span>
                        ))}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>248 responses</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          7. FOR EVERY ROLE — PORTALS
      ════════════════════════════════════════════════════════════════════ */}
      <section id="portals" style={{ background: '#080B14', padding: '88px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 20,
            }}>
              <MdGroups style={{ fontSize: 13, color: '#A5B4FC' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#A5B4FC' }}>5 PORTALS</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800,
              letterSpacing: '-2px', marginBottom: 16, fontFamily: FONT,
              color: '#fff',
            }}>
              Built for <span style={gradientText}>Every Role</span>
            </h2>
            <p style={{
              fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7,
              maxWidth: 520, margin: '0 auto',
            }}>
              Each portal is purpose-built for its users — tailored features, tailored experience.
            </p>
          </div>

          {/* Portal cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(5,1fr)',
            gap: 16,
          }}>
            {PORTALS.map(portal => {
              const Icon = portal.icon
              const hov = hoveredPortal === portal.key
              return (
                <div
                  key={portal.key}
                  onMouseEnter={() => setHoveredPortal(portal.key)}
                  onMouseLeave={() => setHoveredPortal(null)}
                  style={{
                    background: hov ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
                    border: hov ? `1px solid ${portal.color}40` : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 20, padding: '28px 24px',
                    display: 'flex', flexDirection: 'column', gap: 12,
                    transform: hov ? 'translateY(-4px)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 13,
                    background: `${portal.color}25`,
                    border: `1px solid ${portal.color}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ fontSize: 28, color: portal.color }} />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>{portal.label}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, flex: 1 }}>
                    {portal.description}
                  </div>
                  <button
                    onClick={() => navigate(`/auth/login?portal=${portal.key}`)}
                    style={{
                      padding: '8px 16px', background: portal.color, border: 'none',
                      borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#fff',
                      cursor: 'pointer', fontFamily: FONT,
                      boxShadow: `0 4px 14px ${portal.color}50`,
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Login →
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          8. DEMO ACCESS
      ════════════════════════════════════════════════════════════════════ */}
      <section id="demo" style={{ background: '#F8FAFC', padding: '88px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 20,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: '#10B981',
                boxShadow: '0 0 0 3px rgba(16,185,129,0.2)', display: 'inline-block',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>INSTANT ACCESS</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800,
              color: '#0F172A', letterSpacing: '-2px', marginBottom: 16, fontFamily: FONT,
            }}>
              Try the Demo. No Account Needed.
            </h2>
            <p style={{
              fontSize: 17, color: '#475569', lineHeight: 1.7,
              maxWidth: 520, margin: '0 auto',
            }}>
              Pre-filled credentials — one click to explore any portal.
            </p>
          </div>

          {/* Demo cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
          }}>
            {PORTALS.map(portal => {
              const Icon = portal.icon
              const creds = DEMO_CREDS[portal.key]
              const emailKey = `${portal.key}-email`
              const passKey  = `${portal.key}-pass`
              return (
                <div
                  key={portal.key}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 20,
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.04)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = `0 12px 40px ${portal.color}25`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.04)'
                  }}
                >
                  {/* Top color strip */}
                  <div style={{ height: 6, background: portal.color, borderRadius: '20px 20px 0 0' }} />
                  <div style={{ padding: 24 }}>
                    {/* Portal name + badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 9,
                        background: `${portal.color}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon style={{ fontSize: 20, color: portal.color }} />
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{portal.label}</span>
                      <span style={{
                        background: `${portal.color}15`, color: portal.color,
                        fontSize: 9, fontWeight: 800, padding: '2px 8px',
                        borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em',
                        marginLeft: 'auto',
                      }}>Demo</span>
                    </div>

                    {/* Email field */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{
                        fontFamily: 'monospace', fontSize: 12, color: '#0F172A',
                        background: '#F8FAFC', border: '1px solid #E2E8F0',
                        borderRadius: 8, padding: '8px 12px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          📧 {creds.email}
                        </span>
                        <button
                          onClick={() => copyText(creds.email, emailKey)}
                          title="Copy email"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: copiedField[emailKey] ? '#10B981' : '#94A3B8',
                            display: 'flex', alignItems: 'center', flexShrink: 0, padding: '0 0 0 8px',
                          }}
                        >
                          {copiedField[emailKey]
                            ? <MdDone style={{ fontSize: 15 }} />
                            : <MdContentCopy style={{ fontSize: 13 }} />}
                        </button>
                      </div>
                    </div>

                    {/* Password field */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{
                        fontFamily: 'monospace', fontSize: 12, color: '#0F172A',
                        background: '#F8FAFC', border: '1px solid #E2E8F0',
                        borderRadius: 8, padding: '8px 12px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        <span>🔑 {creds.password}</span>
                        <button
                          onClick={() => copyText(creds.password, passKey)}
                          title="Copy password"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: copiedField[passKey] ? '#10B981' : '#94A3B8',
                            display: 'flex', alignItems: 'center', flexShrink: 0, padding: '0 0 0 8px',
                          }}
                        >
                          {copiedField[passKey]
                            ? <MdDone style={{ fontSize: 15 }} />
                            : <MdContentCopy style={{ fontSize: 13 }} />}
                        </button>
                      </div>
                    </div>

                    {/* Copy buttons row */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                      <button
                        onClick={() => copyText(creds.email, emailKey)}
                        style={{
                          flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 11, fontWeight: 600,
                          background: copiedField[emailKey] ? '#F0FDF4' : '#F8FAFC',
                          border: `1px solid ${copiedField[emailKey] ? '#10B981' : '#E2E8F0'}`,
                          color: copiedField[emailKey] ? '#10B981' : '#64748B',
                          cursor: 'pointer', fontFamily: FONT,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                          transition: 'all 0.2s',
                        }}
                      >
                        {copiedField[emailKey] ? <MdDone style={{ fontSize: 13 }} /> : <MdContentCopy style={{ fontSize: 12 }} />}
                        {copiedField[emailKey] ? 'Copied!' : 'Copy Email'}
                      </button>
                      <button
                        onClick={() => copyText(creds.password, passKey)}
                        style={{
                          flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 11, fontWeight: 600,
                          background: copiedField[passKey] ? '#F0FDF4' : '#F8FAFC',
                          border: `1px solid ${copiedField[passKey] ? '#10B981' : '#E2E8F0'}`,
                          color: copiedField[passKey] ? '#10B981' : '#64748B',
                          cursor: 'pointer', fontFamily: FONT,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                          transition: 'all 0.2s',
                        }}
                      >
                        {copiedField[passKey] ? <MdDone style={{ fontSize: 13 }} /> : <MdContentCopy style={{ fontSize: 12 }} />}
                        {copiedField[passKey] ? 'Copied!' : 'Copy Pass'}
                      </button>
                    </div>

                    {/* Login button */}
                    <button
                      onClick={() => navigate(`/auth/login?portal=${portal.key}&demo=true`)}
                      style={{
                        width: '100%', padding: '10px 0', borderRadius: 10,
                        background: portal.color, border: 'none',
                        fontSize: 13, fontWeight: 700, color: '#fff',
                        cursor: 'pointer', fontFamily: FONT,
                        boxShadow: `0 4px 14px ${portal.color}40`,
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      Login as {portal.label}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          9. HOW IT WORKS
      ════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ background: '#FFFFFF', padding: '88px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 20,
            }}>
              <MdSpeed style={{ fontSize: 13, color: '#6366F1' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#6366F1' }}>SIMPLE ONBOARDING</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800,
              color: '#0F172A', letterSpacing: '-2px', marginBottom: 16, fontFamily: FONT,
            }}>
              Up and Running in 3 Steps
            </h2>
            <p style={{ fontSize: 17, color: '#475569', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
              No lengthy setup. No training required. Just sign in and go.
            </p>
          </div>

          {/* Steps */}
          <div style={{ position: 'relative' }}>
            {/* Connector line */}
            {!isMobile && (
              <div style={{
                position: 'absolute',
                top: 36,
                left: 'calc(16.666% + 36px)',
                right: 'calc(16.666% + 36px)',
                height: 2,
                background: 'linear-gradient(90deg, #6366F1, #A855F7, #06B6D4)',
                zIndex: 0,
              }} />
            )}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
              gap: isMobile ? 32 : 40,
              position: 'relative', zIndex: 1,
            }}>
              {STEPS.map((step, i) => {
                const hov = hoveredStep === i
                return (
                  <div
                    key={step.num}
                    onMouseEnter={() => setHoveredStep(i)}
                    onMouseLeave={() => setHoveredStep(null)}
                    style={{
                      textAlign: 'center',
                      background: hov ? '#FFFFFF' : 'transparent',
                      borderRadius: 20,
                      border: hov ? `1px solid ${step.color}25` : '1px solid transparent',
                      padding: '32px 24px',
                      boxShadow: hov ? `0 12px 40px ${step.color}15` : 'none',
                      transform: hov ? 'translateY(-4px)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* Step circle */}
                    <div style={{
                      width: 72, height: 72, borderRadius: '50%',
                      background: `${step.color}15`,
                      border: `2px solid ${step.color}40`,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 24px',
                    }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: step.color, lineHeight: 1 }}>
                        {step.num}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: 20, fontWeight: 800, color: '#0F172A',
                      marginBottom: 10, fontFamily: FONT,
                    }}>{step.title}</h3>
                    <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7 }}>{step.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          10. FINAL CTA
      ════════════════════════════════════════════════════════════════════ */}
      <section style={{
        background: '#080B14', padding: '88px 40px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700, height: 700, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 60%)',
        }} />

        <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 100, padding: '8px 20px', marginBottom: 32,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#10B981',
              boxShadow: '0 0 0 3px rgba(16,185,129,0.2)', display: 'inline-block',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 13, color: '#A5B4FC', fontWeight: 600 }}>
              Ready to modernize your campus?
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800,
            letterSpacing: '-2px', lineHeight: 1.1, color: '#fff',
            marginBottom: 20, fontFamily: FONT,
          }}>
            Ready to Transform Your{'\n'}
            <span style={gradientText}>College Management?</span>
          </h2>

          <p style={{
            fontSize: 18, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8,
            maxWidth: 540, margin: '0 auto 44px',
          }}>
            Join institutions already using College ERP to streamline every workflow — from classroom to research lab.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <button
              onMouseEnter={() => setHoveredCTA('cta-start')}
              onMouseLeave={() => setHoveredCTA(null)}
              onClick={() => navigate('/auth/login')}
              style={{
                padding: '14px 36px', borderRadius: 12, border: 'none',
                background: '#6366F1', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: FONT,
                boxShadow: hoveredCTA === 'cta-start'
                  ? '0 10px 40px rgba(99,102,241,0.7)'
                  : '0 4px 20px rgba(99,102,241,0.5)',
                transform: hoveredCTA === 'cta-start' ? 'translateY(-2px)' : 'none',
                transition: 'all 0.2s',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              Get Started Free <MdArrowForward style={{ fontSize: 18 }} />
            </button>
            <button
              onMouseEnter={() => setHoveredCTA('cta-demo')}
              onMouseLeave={() => setHoveredCTA(null)}
              onClick={() => scrollTo('demo')}
              style={{
                padding: '14px 34px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                background: hoveredCTA === 'cta-demo' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                color: '#fff', cursor: 'pointer', fontFamily: FONT,
                transition: 'all 0.2s',
              }}
            >
              View Demo
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: MdShield,   label: 'SSL Secured' },
              { icon: MdVerified, label: 'Role-Based Access' },
              { icon: MdSpeed,    label: '99.9% Uptime' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                color: 'rgba(255,255,255,0.4)', fontSize: 13,
              }}>
                <Icon style={{ fontSize: 15, color: '#A5B4FC' }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          11. FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <footer style={{ background: '#0A0F1E', padding: '56px 40px 0', fontFamily: FONT }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1.5fr',
          gap: 48, paddingBottom: 48,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: '#6366F1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
              }}>
                <MdSchool style={{ color: '#fff', fontSize: 22 }} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>College ERP</div>
                <div style={{ fontSize: 11, color: '#334155', fontWeight: 500 }}>v2.0 — Modern Campus Platform</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.8, maxWidth: 280, marginBottom: 20 }}>
              A comprehensive ERP for modern educational institutions. Academics, exams, finance, research — all in one place.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {['Spring Boot', 'React', 'PostgreSQL'].map(tech => (
                <span key={tech} style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: '#475569', border: '1px solid rgba(255,255,255,0.07)',
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                }}>{tech}</span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Quick Links
            </div>
            {[
              { label: 'Features',  action: () => scrollTo('features') },
              { label: 'Portals',   action: () => scrollTo('portals') },
              { label: 'Demo',      action: () => scrollTo('demo') },
              { label: 'Sign In',   action: () => navigate('/auth/login') },
            ].map(link => (
              <div key={link.label} style={{ marginBottom: 12 }}>
                <button
                  onClick={link.action}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    fontSize: 14, color: '#475569', cursor: 'pointer',
                    fontFamily: FONT, fontWeight: 400,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#A5B4FC'}
                  onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                >
                  {link.label}
                </button>
              </div>
            ))}
          </div>

          {/* Portals */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Portals
            </div>
            {PORTALS.map(p => (
              <div key={p.key} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <button
                  onClick={() => navigate(`/auth/login?portal=${p.key}`)}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    fontSize: 14, color: '#475569', cursor: 'pointer',
                    fontFamily: FONT, transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = p.color}
                  onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                >
                  {p.label}
                </button>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Contact
            </div>
            {[
              '📍 Chennai, India',
              '✉️ support@college.edu',
              '🔓 Open Source',
            ].map(item => (
              <div key={item} style={{ fontSize: 13, color: '#475569', marginBottom: 10, lineHeight: 1.6 }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '22px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontSize: 13, color: '#1E293B', fontWeight: 400 }}>
            © 2025 College ERP · Built for Modern Institutions
          </span>
          <span style={{ fontSize: 13, color: '#1E293B' }}>Made in India 🇮🇳</span>
        </div>
      </footer>

    </div>
  )
}
