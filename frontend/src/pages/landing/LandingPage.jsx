import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MdSchool, MdBadge, MdPeople, MdStar, MdAdminPanelSettings,
  MdMenuBook, MdAssignment, MdPayment, MdMiscellaneousServices,
  MdScience, MdFeedback, MdArrowForward, MdCheck, MdShield,
  MdSpeed, MdPublic, MdAccessTime, MdLayers, MdAnalytics,
  MdDashboard
} from 'react-icons/md'

// ─── Counter Component (copied from mymoneyman) ───────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    if (typeof target !== 'number') { setCount(target); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1800, steps = 60, increment = target / steps
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

// ─── Data ─────────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  'My Curriculum', 'Time Table', 'Class Attendance', 'Exam Schedule',
  'Online Payments', 'Research Portal', 'Course Registration', 'Bonafide Certificate',
  'APAAR ID Upload', 'Digital Assignment', 'Faculty Info', 'eSanad Request',
  'Marks & Grades', 'MOOC Registration', 'Feedback System', 'HOD and Dean Info',
  'Project Portal', 'Library Services'
]

const STATS_DATA = [
  { icon: MdMenuBook, value: 6, label: 'Main Menus', suffix: '+' },
  { icon: MdLayers, value: 50, label: 'Features', suffix: '+' },
  { icon: MdPeople, value: 5, label: 'User Portals', suffix: '' },
  { icon: MdAnalytics, value: 100, label: '% Secure', suffix: '' },
]

const FEATURES = [
  { icon: MdMenuBook, title: 'Academic Management', desc: 'Curriculum, timetable, attendance, class messages, biometric info and faculty directory.', color: '#6366f1', bg: '#eef2ff' },
  { icon: MdAssignment, title: 'Examination System', desc: 'Exam schedules, marks, grades, grade history, online exams, arrear and makeup registration.', color: '#ef4444', bg: '#fef2f2' },
  { icon: MdPayment, title: 'Finance & Payments', desc: 'Fee payments, wallet management, receipts, fees intimation, library dues and refunds.', color: '#10b981', bg: '#f0fdf4' },
  { icon: MdMiscellaneousServices, title: 'Student Services', desc: 'Transport, hostel, bonafide, library, transcript, scholarships, and eSanad digital certificates.', color: '#f59e0b', bg: '#fffbeb' },
  { icon: MdScience, title: 'Research Portal', desc: 'PhD registration, course work, thesis submission, guide meetings, and weekly workload tracking.', color: '#8b5cf6', bg: '#f5f3ff' },
  { icon: MdFeedback, title: 'Feedback System', desc: 'Course feedback forms, 24x7 continuous feedback, and instructor ratings.', color: '#14b8a6', bg: '#f0fdfa' },
  { icon: MdSchool, title: 'Course Registration', desc: 'Wishlist, course withdrawal, EXC, MOOC, industrial internship, and SET conference registration.', color: '#3b82f6', bg: '#eff6ff' },
  { icon: MdPeople, title: 'Profile & Info', desc: 'Student profile, credentials, dayboarder info, bank details, scholarships and acknowledgements.', color: '#ec4899', bg: '#fdf2f8', badge: 'NEW' },
  { icon: MdBadge, title: 'Project Portal', desc: 'Faculty open projects, project proposals, progress reviews and project mark viewing.', color: '#a855f7', bg: '#faf5ff' },
  { icon: MdShield, title: 'Account Security', desc: 'Two-factor backup codes, password management and login ID updates.', color: '#0ea5e9', bg: '#f0f9ff' },
  { icon: MdAnalytics, title: 'Online Examinations', desc: 'Comprehensive online exams, question preview, exam timer and system requirements check.', color: '#f97316', bg: '#fff7ed', badge: 'NEW' },
  { icon: MdPublic, title: 'APAAR & eSanad', desc: 'Upload APAAR ID for Academic Bank of Credits, and request eSanad digital certificates.', color: '#6366f1', bg: '#eef2ff', badge: 'NEW' },
]

const ACADEMICS_GENERAL_ITEMS = [
  'My Curriculum', 'HOD and Dean Info', 'Faculty Info', 'Biometric Info',
  'Class Messages', 'Regulation', 'Minor/Honour', 'Time Table',
  'Class Attendance', 'Course Page Consolidated', 'Digital Assignment Upload',
  'QCM View', 'Outcome SET Conference', 'Co-Extra Curricular',
  'Academics Calendar', 'Course Registration Allocation', 'Project Course',
  'Project Mark View', 'Apaar ID Upload'
]

const EXAM_GENERAL = [
  'Exam Schedule', 'Marks', 'Grades', 'Grade History',
  'Regular Paper See/Rev', 'Additional Learning', 'MOOC File Upload',
  'Project File Upload', 'ECA File Upload', 'EPT Schedule',
  'Re-Exam Application', 'Code of Conduct'
]

const EXAM_ARREAR = ['Registration', 'Registration Details', 'Exam Schedule', 'Grade View', 'Paper See/Rev']
const EXAM_ONLINE = ['Comprehensive Exam', 'Question Preview', 'Exam Information']
const EXAM_MAKEUP = ['Registration', 'ME Exam Schedule']

const FINANCE_ITEMS = [
  { icon: MdPayment, label: 'Payments', color: '#10b981', bg: '#f0fdf4', desc: 'Pay tuition, hostel and other fees online securely.' },
  { icon: MdPayment, label: 'Wallet Amount Add', color: '#059669', bg: '#ecfdf5', desc: 'Top up your ERP wallet for quick payments.' },
  { icon: MdAssignment, label: 'Payment Receipts', color: '#0284c7', bg: '#f0f9ff', desc: 'Download and view all payment history.' },
  { icon: MdAssignment, label: 'Fees Intimation', color: '#6366f1', bg: '#eef2ff', desc: 'Get notified about upcoming fee dues.' },
  { icon: MdPayment, label: 'Online Transfer', color: '#7c3aed', bg: '#f5f3ff', desc: 'Transfer funds between accounts seamlessly.' },
  { icon: MdMenuBook, label: 'Library Due', color: '#d97706', bg: '#fffbeb', desc: 'Check and pay library dues and fines.' },
  { icon: MdAssignment, label: 'Refund Request', color: '#dc2626', bg: '#fef2f2', desc: 'Apply for fee refunds with digital approval.' },
]

const SERVICES_GROUPS = [
  {
    title: 'General', color: '#f59e0b', bg: '#fffbeb',
    items: ['Facility Registration', 'Transport Registration', 'PAT Registration', 'Transcript Request', 'Financial Assistance/Scholarship', 'Achievements', 'Programme Migration', 'Late Hour Request', 'Final Year Registration', 'Certificate Upload', 'eSanad Request']
  },
  {
    title: 'My Info', color: '#3b82f6', bg: '#eff6ff',
    items: ['Profile', 'Credentials', 'Dayboarder Info', 'Acknowledgement View', 'Student Bank Info', 'My Scholarships']
  },
  {
    title: 'My Account', color: '#8b5cf6', bg: '#f5f3ff',
    items: ['Backup Codes', 'Change Password', 'Update Login ID']
  },
  {
    title: 'Bonafide', color: '#ec4899', bg: '#fdf2f8',
    items: ['Apply Bonafide']
  },
  {
    title: 'Library', color: '#14b8a6', bg: '#f0fdfa',
    items: ['Online Book Recommendation']
  },
  {
    title: 'Info Corner', color: '#6366f1', bg: '#eef2ff',
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
  { key: 'admin', label: 'Admin', color: '#dc2626', icon: MdAdminPanelSettings, description: 'Full system administration' },
  { key: 'student', label: 'Student', color: '#3b82f6', icon: MdSchool, description: 'Academic portal' },
  { key: 'staff', label: 'Staff', color: '#8b5cf6', icon: MdBadge, description: 'Teaching tools' },
  { key: 'parent', label: 'Parent', color: '#f59e0b', icon: MdPeople, description: 'Track ward progress' },
  { key: 'alumni', label: 'Alumni', color: '#14b8a6', icon: MdStar, description: 'Alumni network' },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [hoveredPortal, setHoveredPortal] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isSmall, setIsSmall] = useState(window.innerWidth <= 640)
  const [hoveredNav, setHoveredNav] = useState(null)
  const [hoveredCTA, setHoveredCTA] = useState(null)
  const [hoveredStat, setHoveredStat] = useState(null)
  const [hoveredFinance, setHoveredFinance] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsSmall(window.innerWidth <= 640)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const announcementH = showAnnouncement ? 36 : 0


  const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

  return (
    <div style={{ fontFamily: FONT, color: '#1e293b', margin: 0, padding: 0, overflowX: 'hidden', background: '#0f172a' }}>

      {/* ── Keyframes ──────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }
        @keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0) } 50% { transform: translateX(-50%) translateY(6px) } }
        @keyframes pulse-glow { 0%,100% { opacity: 1 } 50% { opacity: 0.5 } }
        @keyframes float { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-8px) } }
        * { box-sizing: border-box; }
        body, html { margin: 0; padding: 0; background: #0f172a; }
      `}</style>

      {/* ── 1. Announcement Bar ────────────────────────────────────────────── */}
      {showAnnouncement && (
        <div style={{
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 1100
        }}>
          <span style={{ color: '#fff', fontSize: 13, textAlign: 'center', padding: '0 40px', fontFamily: FONT }}>
            🎓 College ERP v2.0 — Research Portal, APAAR ID &amp; eSanad now live
          </span>
          <button
            onClick={() => setShowAnnouncement(false)}
            style={{
              position: 'absolute', right: 14, background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: 18, lineHeight: 1,
              padding: '4px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >×</button>
        </div>
      )}

      {/* ── 2. Fixed Navbar ────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: announcementH, left: 0, right: 0, height: 64, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.08)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 20px' : '0 48px',
        transition: 'background 0.3s, box-shadow 0.3s, top 0.3s'
      }}>
        {/* Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
          }}>
            <MdSchool style={{ color: '#fff', fontSize: 22 }} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: scrolled ? '#1e293b' : '#fff', letterSpacing: '-0.3px' }}>
            College ERP
          </span>
        </div>

        {/* Center Nav */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {[
              { label: 'Features', id: 'features' },
              { label: 'Portals', id: 'portals' },
              { label: 'Academics', id: 'academics' },
            ].map(link => (
              <button
                key={link.id}
                onMouseEnter={() => setHoveredNav(link.id)}
                onMouseLeave={() => setHoveredNav(null)}
                onClick={() => scrollTo(link.id)}
                style={{
                  fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  padding: '8px 14px', borderRadius: 8,
                  background: hoveredNav === link.id
                    ? (scrolled ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.1)')
                    : 'transparent',
                  color: hoveredNav === link.id
                    ? (scrolled ? '#6366f1' : '#fff')
                    : (scrolled ? '#475569' : 'rgba(255,255,255,0.8)'),
                  border: 'none', fontFamily: FONT,
                  transition: 'all 0.15s'
                }}
              >
                {link.label}
              </button>
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
              padding: '9px 20px', border: '1.5px solid',
              borderColor: scrolled ? '#6366f1' : 'rgba(255,255,255,0.35)',
              borderRadius: 9, fontSize: 14, fontWeight: 600,
              background: hoveredCTA === 'signin'
                ? (scrolled ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.12)')
                : 'transparent',
              color: scrolled ? '#6366f1' : '#fff',
              cursor: 'pointer', fontFamily: FONT, transition: 'all 0.15s'
            }}
          >
            Sign In
          </button>
          {!isMobile && (
            <button
              onMouseEnter={() => setHoveredCTA('start')}
              onMouseLeave={() => setHoveredCTA(null)}
              onClick={() => navigate('/auth/login')}
              style={{
                padding: '9px 22px',
                background: hoveredCTA === 'start'
                  ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                  : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600,
                color: '#fff', cursor: 'pointer', fontFamily: FONT,
                boxShadow: hoveredCTA === 'start'
                  ? '0 6px 28px rgba(99,102,241,0.65)'
                  : '0 4px 18px rgba(99,102,241,0.45)',
                transform: hoveredCTA === 'start' ? 'translateY(-1px)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              Get Started
            </button>
          )}
        </div>
      </nav>

      {/* ── 3. Hero Section ────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #0f172a 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
        paddingTop: 64 + announcementH, paddingBottom: 80,
        padding: isMobile ? `${64 + announcementH}px 24px 80px` : `${64 + announcementH}px 48px 80px`
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        {/* Glow blobs */}
        <div style={{
          position: 'absolute', top: '15%', left: '-8%', width: 500, height: 500,
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-5%', width: 400, height: 400,
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)'
        }} />
        <div style={{
          position: 'absolute', top: '55%', left: '45%', width: 300, height: 300,
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)'
        }} />

        <div style={{
          maxWidth: 1280, margin: '0 auto', width: '100%',
          display: 'flex', alignItems: 'center', gap: isMobile ? 40 : 72,
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          {/* Left Column */}
          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            {/* Live badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 32
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: '#10b981',
                boxShadow: '0 0 8px #10b981', animation: 'pulse-glow 2s ease-in-out infinite',
                display: 'inline-block', flexShrink: 0
              }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}>
                Student · Staff · Parent · Alumni · Admin
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(40px, 5.5vw, 68px)', fontWeight: 800,
              color: '#fff', lineHeight: 1.08, letterSpacing: '-2px',
              margin: '0 0 24px', fontFamily: FONT
            }}>
              Your Complete<br />
              <span style={{
                background: 'linear-gradient(90deg, #6366f1, #a78bfa, #10b981)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>
                College Management
              </span>
              <br />Platform
            </h1>

            <p style={{
              fontSize: 18, color: 'rgba(255,255,255,0.62)', lineHeight: 1.7,
              maxWidth: 520, margin: '0 0 36px', fontFamily: FONT
            }}>
              One unified platform for Students, Staff, Parents, Alumni and Administrators.
              Academics, examinations, finance, research — everything in one place.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 36, flexDirection: isMobile ? 'column' : 'row' }}>
              <button
                onMouseEnter={() => setHoveredCTA('hero-start')}
                onMouseLeave={() => setHoveredCTA(null)}
                onClick={() => navigate('/auth/login')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 30px', borderRadius: 12, border: 'none',
                  background: hoveredCTA === 'hero-start'
                    ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                  fontFamily: FONT,
                  boxShadow: hoveredCTA === 'hero-start'
                    ? '0 8px 32px rgba(99,102,241,0.7)'
                    : '0 4px 24px rgba(99,102,241,0.55)',
                  transform: hoveredCTA === 'hero-start' ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.18s'
                }}
              >
                Get Started Free <MdArrowForward style={{ fontSize: 18 }} />
              </button>
              <button
                onMouseEnter={() => setHoveredCTA('hero-exp')}
                onMouseLeave={() => setHoveredCTA(null)}
                onClick={() => scrollTo('features')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px', borderRadius: 12,
                  background: hoveredCTA === 'hero-exp' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                  fontFamily: FONT,
                  transform: hoveredCTA === 'hero-exp' ? 'translateY(-2px)' : 'none',
                  boxShadow: hoveredCTA === 'hero-exp' ? '0 8px 24px rgba(0,0,0,0.25)' : 'none',
                  transition: 'all 0.18s'
                }}
              >
                <MdSpeed style={{ fontSize: 18 }} /> Explore Features
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { icon: MdShield, label: 'Secured' },
                { icon: MdCheck, label: 'Role-Based Access' },
                { icon: MdPublic, label: 'Always Online' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 500
                }}>
                  <Icon style={{ fontSize: 15, color: 'rgba(99,102,241,0.9)' }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Glassmorphism Student Portal Widget */}
          {!isMobile && (
            <div style={{ flex: '0 0 420px', position: 'relative', zIndex: 1 }}>
              {/* Main widget */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 20, padding: 24,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                animation: 'float 6s ease-in-out infinite'
              }}>
                {/* Widget header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginBottom: 2 }}>
                      Student Portal
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Sem 6 — CSE</div>
                  </div>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <MdDashboard style={{ fontSize: 20, color: '#a78bfa' }} />
                  </div>
                </div>

                {/* 3-col mini stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                  {[
                    { label: 'Attendance', value: '87.5%', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
                    { label: 'CGPA', value: '8.74', color: '#a78bfa', bg: 'rgba(99,102,241,0.12)' },
                    { label: 'Pending', value: '3', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: stat.bg, borderRadius: 12, padding: '12px 10px', textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mini bar chart — semester performance */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.05em' }}>
                    SEMESTER GPA
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 56 }}>
                    {[7.8, 8.1, 8.5, 8.3, 8.6, 8.74].map((val, i) => {
                      const pct = ((val - 7) / (10 - 7)) * 100
                      const isLast = i === 5
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{
                            width: '100%', borderRadius: '4px 4px 0 0',
                            height: `${Math.round(pct * 0.48 + 12)}px`,
                            background: isLast
                              ? 'linear-gradient(180deg, #a78bfa, #6366f1)'
                              : 'rgba(99,102,241,0.3)',
                            transition: 'height 0.3s'
                          }} />
                          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>S{i + 1}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recent items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { title: 'Digital Assignment Upload', cat: 'Academics', tag: 'Due Today', tagColor: '#f59e0b' },
                    { title: 'End Semester Exam', cat: 'Examinations', tag: 'Jun 20', tagColor: '#ef4444' },
                    { title: 'Fee Payment', cat: 'Finance', tag: '₹47,500', tagColor: '#10b981' },
                  ].map(item => (
                    <div key={item.title} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'rgba(255,255,255,0.04)', borderRadius: 10,
                      padding: '9px 12px', border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.82)', marginBottom: 2 }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>{item.cat}</div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: item.tagColor,
                        background: `${item.tagColor}18`, border: `1px solid ${item.tagColor}30`,
                        padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap'
                      }}>{item.tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge — top right */}
              <div style={{
                position: 'absolute', top: -18, right: -18,
                background: 'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(5,150,105,0.9))',
                border: '1px solid rgba(16,185,129,0.4)',
                borderRadius: 100, padding: '7px 14px',
                display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
                backdropFilter: 'blur(10px)'
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>CGPA +0.4 this sem</span>
              </div>

              {/* Floating badge — bottom left */}
              <div style={{
                position: 'absolute', bottom: -18, left: -18,
                background: 'rgba(99,102,241,0.85)',
                border: '1px solid rgba(99,102,241,0.4)',
                borderRadius: 100, padding: '7px 14px',
                display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                backdropFilter: 'blur(10px)'
              }}>
                <MdMenuBook style={{ fontSize: 14, color: '#fff' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>50+ Features</span>
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%',
          animation: 'bounce 2s ease-in-out infinite',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          cursor: 'pointer', opacity: 0.5
        }} onClick={() => scrollTo('marquee')}>
          <div style={{
            width: 24, height: 38, border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: 12, display: 'flex', justifyContent: 'center', paddingTop: 6
          }}>
            <div style={{ width: 3, height: 8, borderRadius: 2, background: 'rgba(255,255,255,0.6)' }} />
          </div>
        </div>
      </section>

      {/* ── 4. Marquee Ticker ──────────────────────────────────────────────── */}
      <div id="marquee" style={{
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)',
        padding: '14px 0', overflow: 'hidden', position: 'relative'
      }}>
        <div style={{
          display: 'flex', width: 'max-content',
          animation: 'marquee 30s linear infinite'
        }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '0 24px', whiteSpace: 'nowrap'
            }}>
              <MdSpeed style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Stats Bar ───────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: isSmall ? '48px 20px' : '72px 48px' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: isSmall ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 24
        }}>
          {STATS_DATA.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                onMouseEnter={() => setHoveredStat(i)}
                onMouseLeave={() => setHoveredStat(null)}
                style={{
                  background: '#fafafa', borderRadius: 16, padding: '28px 24px',
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: hoveredStat === i ? 'rgba(99,102,241,0.25)' : '#f1f5f9',
                  boxShadow: hoveredStat === i
                    ? '0 12px 40px rgba(99,102,241,0.15)'
                    : '0 2px 8px rgba(0,0,0,0.04)',
                  transform: hoveredStat === i ? 'translateY(-4px)' : 'none',
                  transition: 'all 0.22s ease', cursor: 'default'
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Icon style={{ fontSize: 26, color: '#6366f1' }} />
                </div>
                <div style={{
                  fontSize: 40, fontWeight: 800, color: '#1e293b', lineHeight: 1,
                  marginBottom: 8, letterSpacing: '-1.5px'
                }}>
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>{stat.label}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 6. Features Grid ───────────────────────────────────────────────── */}
      <section id="features" style={{ background: '#f8fafc', padding: isMobile ? '60px 20px' : '88px 48px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 20
            }}>
              <MdLayers style={{ fontSize: 14, color: '#6366f1' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#6366f1' }}>50+ Core Features</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: '#1e293b',
              margin: '0 0 16px', letterSpacing: '-1px', fontFamily: FONT
            }}>
              Everything you need to manage your college
            </h2>
            <p style={{
              fontSize: 17, color: '#64748b', maxWidth: 600, margin: '0 auto', lineHeight: 1.7
            }}>
              From curriculum tracking to research thesis submission — College ERP covers every aspect.
            </p>
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24
          }}>
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon
              const hov = hoveredFeature === i
              return (
                <div
                  key={feat.title}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{
                    background: '#fff', borderRadius: 18, padding: '28px 26px',
                    border: `1.5px solid ${hov ? feat.color + '50' : '#f1f5f9'}`,
                    boxShadow: hov ? `0 16px 48px ${feat.color}22` : '0 2px 12px rgba(0,0,0,0.04)',
                    transform: hov ? 'translateY(-4px)' : 'none',
                    transition: 'all 0.22s ease', cursor: 'default', position: 'relative'
                  }}
                >
                  {feat.badge && (
                    <div style={{
                      position: 'absolute', top: 18, right: 18,
                      background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                      color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: '0.08em',
                      padding: '3px 9px', borderRadius: 20, textTransform: 'uppercase'
                    }}>{feat.badge}</div>
                  )}
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, background: feat.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18
                  }}>
                    <Icon style={{ fontSize: 28, color: feat.color }} />
                  </div>
                  <h3 style={{
                    fontSize: 17, fontWeight: 700, color: '#1e293b',
                    margin: '0 0 10px', fontFamily: FONT
                  }}>{feat.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{feat.desc}</p>
                  {hov && (
                    <div style={{
                      marginTop: 16, fontSize: 13, fontWeight: 600,
                      color: feat.color, display: 'flex', alignItems: 'center', gap: 4
                    }}>
                      Learn more <MdArrowForward style={{ fontSize: 14 }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 7. Academics Deep Section ──────────────────────────────────────── */}
      <section id="academics" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        padding: isMobile ? '60px 20px' : '96px 48px', position: 'relative', overflow: 'hidden'
      }}>
        {/* Glow blobs */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%', width: 450, height: 450,
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-5%', left: '-5%', width: 350, height: 350,
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)'
        }} />

        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', gap: 72, alignItems: 'flex-start',
          flexDirection: isMobile ? 'column' : 'row', position: 'relative', zIndex: 1
        }}>
          {/* Left */}
          <div style={{ flex: '1 1 340px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 100, padding: '6px 14px', marginBottom: 24
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>📚 ACADEMICS</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 800, color: '#fff',
              margin: '0 0 18px', lineHeight: 1.15, letterSpacing: '-1px', fontFamily: FONT
            }}>
              Complete Academic Management —<br />All in One Place
            </h2>
            <p style={{
              fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75,
              maxWidth: 460, margin: '0 0 36px'
            }}>
              From curriculum planning to project submissions, digital assignments to APAAR ID — every academic function managed in a single, intuitive portal.
            </p>

            {/* Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ACADEMICS_GENERAL_ITEMS.slice(0, 14).map(item => (
                <span key={item} style={{
                  background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: 100, padding: '5px 14px', fontSize: 13,
                  fontWeight: 600, color: '#a5b4fc'
                }}>
                  {item}
                </span>
              ))}
              <span style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 100, padding: '5px 14px', fontSize: 13,
                fontWeight: 600, color: 'rgba(255,255,255,0.35)'
              }}>
                +{ACADEMICS_GENERAL_ITEMS.length - 14} more
              </span>
            </div>
          </div>

          {/* Right — 2x2 sub-section cards */}
          <div style={{
            flex: '1 1 300px',
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16
          }}>
            {[
              { title: 'General', count: 19, color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', icon: MdMenuBook },
              { title: 'Course Registration', count: 8, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', icon: MdSchool },
              { title: 'Project Proposal', count: 1, color: '#a855f7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.25)', icon: MdBadge },
              { title: 'More coming soon', count: null, color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.15)', icon: MdAccessTime },
            ].map(card => {
              const Icon = card.icon
              return (
                <div key={card.title} style={{
                  background: card.bg, border: `1px solid ${card.border}`,
                  borderRadius: 14, padding: 20,
                  transition: 'transform 0.18s',
                  cursor: 'default'
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: `${card.color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12
                  }}>
                    <Icon style={{ fontSize: 20, color: card.color }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{card.title}</div>
                  {card.count !== null && (
                    <div style={{ fontSize: 12, color: card.color, fontWeight: 600 }}>{card.count} items</div>
                  )}
                  {card.count === null && (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>In progress</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 8. Examinations Section ────────────────────────────────────────── */}
      <section id="examinations" style={{
        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        padding: isMobile ? '60px 20px' : '96px 48px'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 20
            }}>
              <MdAssignment style={{ fontSize: 14, color: '#ef4444' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>Examination System</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: '#1e293b',
              margin: '0 0 16px', letterSpacing: '-1px', fontFamily: FONT
            }}>
              Complete Examination Management
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
              Covers regular, arrear, online and make-up examinations with full transparency on marks, grades and re-evaluation.
            </p>
          </div>

          <div style={{
            display: 'flex', gap: 48, alignItems: 'flex-start',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            {/* Left — checklists */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 20 }}>
                {[
                  { title: 'General', items: EXAM_GENERAL, color: '#ef4444' },
                  { title: 'Arrear', items: EXAM_ARREAR, color: '#f97316' },
                  { title: 'Online', items: EXAM_ONLINE, color: '#8b5cf6' },
                  { title: 'Makeup', items: EXAM_MAKEUP, color: '#06b6d4' },
                ].map(group => (
                  <div key={group.title} style={{
                    background: '#fff', borderRadius: 16, padding: '24px',
                    border: `1.5px solid ${group.color}25`,
                    borderTop: `4px solid ${group.color}`,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: group.color }}>{group.title}</span>
                      <span style={{
                        background: `${group.color}15`, color: group.color,
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20
                      }}>{group.items.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {group.items.map(item => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                            background: `${group.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <MdCheck style={{ fontSize: 11, color: group.color }} />
                          </div>
                          <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — mock exam card */}
            <div style={{ flex: '0 0 340px' }}>
              <div style={{
                background: '#fff', borderRadius: 20, padding: 28,
                boxShadow: '0 16px 48px rgba(239,68,68,0.12)',
                border: '1.5px solid rgba(239,68,68,0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Upcoming Exams</span>
                  <span style={{
                    background: '#fef2f2', color: '#ef4444',
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20
                  }}>3 Scheduled</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { date: 'Jun 15', course: 'Operating Systems', venue: 'Hall A - R101', type: 'Theory', typeColor: '#6366f1', typeBg: '#eef2ff' },
                    { date: 'Jun 18', course: 'Database Systems', venue: 'Hall B - R204', type: 'Practical', typeColor: '#10b981', typeBg: '#f0fdf4' },
                    { date: 'Jun 20', course: 'Software Engineering', venue: 'Hall A - R110', type: 'Theory', typeColor: '#6366f1', typeBg: '#eef2ff' },
                  ].map(exam => (
                    <div key={exam.course} style={{
                      display: 'grid', gridTemplateColumns: '52px 1fr auto',
                      gap: 12, alignItems: 'center', padding: '12px 14px',
                      background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9'
                    }}>
                      <div style={{
                        background: '#fff', borderRadius: 8, padding: '6px',
                        textAlign: 'center', border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444', lineHeight: 1 }}>
                          {exam.date.split(' ')[1]}
                        </div>
                        <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{exam.date.split(' ')[0]}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>{exam.course}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{exam.venue}</div>
                      </div>
                      <span style={{
                        background: exam.typeBg, color: exam.typeColor,
                        fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20
                      }}>{exam.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Finance Section ─────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: isMobile ? '60px 20px' : '96px 48px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 20
            }}>
              <MdPayment style={{ fontSize: 14, color: '#10b981' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>Finance & Payments</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: '#1e293b',
              margin: '0 0 16px', letterSpacing: '-1px', fontFamily: FONT
            }}>
              Transparent Fee &amp; Payment Management
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              Complete financial visibility — from fee intimation to online payments, wallet top-ups, and refund processing.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20
          }}>
            {FINANCE_ITEMS.map((item, i) => {
              const Icon = item.icon
              const hov = hoveredFinance === i
              return (
                <div
                  key={item.label}
                  onMouseEnter={() => setHoveredFinance(i)}
                  onMouseLeave={() => setHoveredFinance(null)}
                  style={{
                    background: hov ? item.bg : '#fafafa',
                    borderRadius: 16, padding: '24px 22px',
                    border: `1.5px solid ${hov ? item.color + '35' : '#f1f5f9'}`,
                    boxShadow: hov ? `0 12px 32px ${item.color}18` : '0 2px 8px rgba(0,0,0,0.03)',
                    transform: hov ? 'translateY(-4px)' : 'none',
                    transition: 'all 0.2s ease', cursor: 'default'
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 13, background: item.bg,
                    border: `1.5px solid ${item.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                  }}>
                    <Icon style={{ fontSize: 24, color: item.color }} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 10. Portal Section ─────────────────────────────────────────────── */}
      <section id="portals" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        padding: isMobile ? '60px 20px' : '96px 48px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 60%)'
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800, color: '#fff',
              margin: '0 0 16px', letterSpacing: '-1.5px', fontFamily: FONT
            }}>
              Choose Your Portal
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto' }}>
              Each portal is purpose-built for your specific role in the institution.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
            gap: 20
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
                    background: hov ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${hov ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 16, padding: 28,
                    display: 'flex', flexDirection: 'column', gap: 14,
                    transform: hov ? 'translateY(-5px)' : 'none',
                    boxShadow: hov ? `0 20px 48px rgba(0,0,0,0.3)` : 'none',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    transition: 'all 0.22s ease', cursor: 'default'
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 13,
                    background: `${portal.color}25`, border: `1px solid ${portal.color}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon style={{ fontSize: 26, color: portal.color }} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{portal.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, flex: 1 }}>
                    {portal.description}
                  </div>
                  <button
                    onClick={() => navigate(`/auth/login?portal=${portal.key}`)}
                    style={{
                      padding: '10px 16px', background: portal.color, border: 'none',
                      borderRadius: 9, fontSize: 13, fontWeight: 700, color: '#fff',
                      cursor: 'pointer', fontFamily: FONT, width: '100%',
                      boxShadow: `0 4px 14px ${portal.color}55`,
                      transition: 'opacity 0.15s'
                    }}
                    onMouseEnter={e => e.target.style.opacity = '0.88'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                  >
                    Login →
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 12. Services Spotlight ─────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: isMobile ? '60px 20px' : '96px 48px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 20
            }}>
              <MdMiscellaneousServices style={{ fontSize: 14, color: '#f59e0b' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>Student Services</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: '#1e293b',
              margin: '0 0 16px', letterSpacing: '-1px', fontFamily: FONT
            }}>
              Everything a Student Needs
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              One-stop access to registrations, certificates, profile management, library, and more — all without paperwork.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20
          }}>
            {SERVICES_GROUPS.map(group => (
              <div
                key={group.title}
                style={{
                  background: '#fff', borderRadius: 18, padding: 24,
                  border: `1.5px solid ${group.color}20`,
                  borderTop: `4px solid ${group.color}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'box-shadow 0.2s, transform 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 16px 40px ${group.color}18`
                  e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{group.title}</span>
                  <span style={{
                    background: `${group.color}12`, color: group.color,
                    fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20
                  }}>{group.items.length} items</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {group.items.map(item => (
                    <span key={item} style={{
                      background: group.bg, color: group.color,
                      border: `1px solid ${group.color}20`,
                      borderRadius: 20, padding: '4px 11px', fontSize: 12, fontWeight: 500
                    }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. Research Section ───────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        padding: isMobile ? '60px 20px' : '96px 48px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-5%', width: 400, height: 400,
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)'
        }} />

        <div style={{
          maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1,
          display: 'flex', gap: 72, alignItems: 'flex-start',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          {/* Left */}
          <div style={{ flex: '1 1 340px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 24
            }}>
              <MdScience style={{ fontSize: 14, color: '#a78bfa' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa' }}>🔬 RESEARCH PORTAL</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, color: '#fff',
              margin: '0 0 18px', lineHeight: 1.15, letterSpacing: '-1px', fontFamily: FONT
            }}>
              PhD &amp; Research Scholar Portal
            </h2>
            <p style={{
              fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75,
              maxWidth: 460, margin: '0 0 36px'
            }}>
              A dedicated research portal covering all aspects of the PhD journey — from registration to thesis submission and weekly workload tracking.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {RESEARCH_ITEMS.map(item => (
                <span key={item} style={{
                  background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                  borderRadius: 100, padding: '5px 14px', fontSize: 13,
                  fontWeight: 600, color: '#c4b5fd'
                }}>{item}</span>
              ))}
            </div>
          </div>

          {/* Right — mini research dashboard */}
          <div style={{ flex: '0 0 360px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20, padding: 28,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 2, fontWeight: 500 }}>Research Dashboard</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>PhD Scholar Status</div>
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: 'rgba(139,92,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <MdScience style={{ fontSize: 20, color: '#a78bfa' }} />
                </div>
              </div>

              {/* Progress bars */}
              {[
                { label: 'Course Work', pct: 80, color: '#a78bfa' },
                { label: 'Thesis Progress', pct: 35, color: '#6366f1' },
                { label: 'Meetings Done', pct: 60, color: '#10b981' },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 18, marginTop: 4 }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 12, fontWeight: 600 }}>RECENT ACTIVITY</div>
                {[
                  { text: 'Thesis Chapter 2 submitted', time: '2h ago', color: '#10b981' },
                  { text: 'Guide meeting scheduled', time: '1d ago', color: '#a78bfa' },
                  { text: 'Weekly workload updated', time: '3d ago', color: '#6366f1' },
                ].map(act => (
                  <div key={act.text} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: act.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{act.text}</span>
                    </div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 14. Meet the Team ─────────────────────────────────────────────── */}
      <section style={{
        background: '#f8fafc',
        padding: isMobile ? '60px 20px' : '96px 48px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 100, padding: '6px 18px', marginBottom: 20
            }}>
              <MdPeople style={{ fontSize: 14, color: '#6366f1' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#6366f1' }}>The Builders</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: '#1e293b',
              margin: '0 0 16px', letterSpacing: '-1px', fontFamily: FONT
            }}>
              Meet the Team
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              The passionate people who designed, built, and launched College ERP.
            </p>
          </div>

          {/* Team cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: 28,
            maxWidth: 960,
            margin: '0 auto'
          }}>
            {[
              {
                name: 'Manoj Kumar',
                role: 'Founder & Marketing Team Lead',
                initials: 'MK',
                gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                glow: 'rgba(99,102,241,0.25)',
                tag: 'Founder',
                tagBg: '#eef2ff',
                tagColor: '#6366f1',
                desc: 'Driving the vision, strategy and growth of College ERP — from concept to campus.',
              },
              {
                name: 'Hari Prasanth',
                role: 'Co Founder & Full Stack Developer',
                initials: 'HP',
                gradient: 'linear-gradient(135deg, #10b981, #059669)',
                glow: 'rgba(16,185,129,0.25)',
                tag: 'Co Founder',
                tagBg: '#f0fdf4',
                tagColor: '#10b981',
                desc: 'Architecting and building the entire platform — backend, frontend, and everything in between.',
              },
              {
                name: 'Pavitaran',
                role: 'Co Founder & DevOps Lead',
                initials: 'PV',
                gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
                glow: 'rgba(245,158,11,0.25)',
                tag: 'Co Founder',
                tagBg: '#fffbeb',
                tagColor: '#d97706',
                desc: 'Ensuring zero downtime and bulletproof infrastructure — keeping College ERP always online.',
              },
            ].map((member, i) => (
              <div
                key={member.name}
                style={{
                  background: '#fff', borderRadius: 20,
                  padding: '32px 28px', textAlign: 'center',
                  border: '1.5px solid #f1f5f9',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = `0 20px 48px ${member.glow}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)'
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: member.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: 1,
                  boxShadow: `0 8px 24px ${member.glow}`,
                  fontFamily: FONT,
                }}>
                  {member.initials}
                </div>

                {/* Role tag */}
                <span style={{
                  display: 'inline-block',
                  background: member.tagBg, color: member.tagColor,
                  border: `1px solid ${member.tagColor}30`,
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.06em',
                  textTransform: 'uppercase', padding: '3px 12px', borderRadius: 20,
                  marginBottom: 14,
                }}>
                  {member.tag}
                </span>

                {/* Name */}
                <div style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', marginBottom: 6, fontFamily: FONT }}>
                  {member.name}
                </div>

                {/* Title */}
                <div style={{ fontSize: 13, fontWeight: 600, color: member.tagColor, marginBottom: 16 }}>
                  {member.role}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: '#f1f5f9', margin: '0 0 16px' }} />

                {/* Desc */}
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 15. Final CTA ──────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        padding: isMobile ? '60px 20px' : '96px 48px', position: 'relative', overflow: 'hidden', textAlign: 'center'
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 700, height: 700, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 60%)'
        }} />
        <div style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          position: 'absolute', inset: 0, pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 28
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>Ready to modernize your campus?</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(32px, 4.5vw, 58px)', fontWeight: 800, color: '#fff',
            margin: '0 0 20px', lineHeight: 1.1, letterSpacing: '-2px', fontFamily: FONT
          }}>
            Start managing your college{' '}
            <span style={{
              background: 'linear-gradient(90deg, #6366f1, #a78bfa, #10b981)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              smarter today
            </span>
          </h2>

          <p style={{
            fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7,
            margin: '0 0 44px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto'
          }}>
            Join thousands of students, faculty, and administrators already using College ERP to streamline every workflow.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onMouseEnter={() => setHoveredCTA('cta-start')}
              onMouseLeave={() => setHoveredCTA(null)}
              onClick={() => navigate('/auth/login')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '16px 36px', borderRadius: 12, border: 'none',
                background: hoveredCTA === 'cta-start'
                  ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                  : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', fontSize: 16, fontWeight: 700,
                cursor: 'pointer', fontFamily: FONT,
                boxShadow: hoveredCTA === 'cta-start'
                  ? '0 10px 36px rgba(99,102,241,0.7)'
                  : '0 6px 28px rgba(99,102,241,0.55)',
                transform: hoveredCTA === 'cta-start' ? 'translateY(-2px)' : 'none',
                transition: 'all 0.18s'
              }}
            >
              Get Started Free <MdArrowForward style={{ fontSize: 20 }} />
            </button>

          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 40, flexWrap: 'wrap' }}>
            {[
              { icon: MdShield, text: 'Enterprise Secured' },
              { icon: MdCheck, text: 'Role-Based Access' },
              { icon: MdPublic, text: '24/7 Available' },
              { icon: MdAccessTime, text: 'Real-Time Sync' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
                <Icon style={{ fontSize: 15, color: 'rgba(99,102,241,0.8)' }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 15. Footer ─────────────────────────────────────────────────────── */}
      <footer style={{ background: '#0f172a', padding: isMobile ? '48px 20px 0' : '72px 48px 0', fontFamily: FONT }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2.2fr 1fr 1fr 1.4fr',
          gap: 52, paddingBottom: 52,
          borderBottom: '1px solid rgba(255,255,255,0.07)'
        }}>
          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(99,102,241,0.4)'
              }}>
                <MdSchool style={{ color: '#fff', fontSize: 22 }} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>College ERP</div>
                <div style={{ fontSize: 11, color: '#475569', fontWeight: 500 }}>v2.0 — Modern Campus Platform</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.75, maxWidth: 280, margin: '0 0 22px' }}>
              A comprehensive college management platform for modern educational institutions. Manage academics, exams, finance, services and research in one place.
            </p>
            {/* Tech stack badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {['React 18', 'Spring Boot', 'MySQL', 'JWT'].map(tech => (
                <span key={tech} style={{
                  background: 'rgba(255,255,255,0.06)', color: '#64748b',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20
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
              { label: 'Features', id: 'features' },
              { label: 'Academics', id: 'academics' },
              { label: 'Examinations', id: 'examinations' },
              { label: 'Finance', id: null, path: null },
            ].map(link => (
              <div key={link.label} style={{ marginBottom: 12 }}>
                <button
                  onClick={() => link.id ? scrollTo(link.id) : null}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    fontSize: 14, color: '#475569', cursor: 'pointer',
                    fontFamily: FONT, fontWeight: 400,
                    transition: 'color 0.15s'
                  }}
                  onMouseEnter={e => e.target.style.color = '#a5b4fc'}
                  onMouseLeave={e => e.target.style.color = '#475569'}
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
              <div key={p.key} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <button
                  onClick={() => navigate(`/auth/login?portal=${p.key}`)}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    fontSize: 14, color: '#475569', cursor: 'pointer',
                    fontFamily: FONT, fontWeight: 400, transition: 'color 0.15s'
                  }}
                  onMouseEnter={e => e.target.style.color = p.color}
                  onMouseLeave={e => e.target.style.color = '#475569'}
                >
                  {p.label} Portal
                </button>
              </div>
            ))}
          </div>

          {/* Sign In / Register */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Get Started
            </div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, marginBottom: 20 }}>
              Sign in to your portal to access your dashboard.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => navigate('/auth/login')}
                style={{
                  padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700,
                  color: '#fff', cursor: 'pointer', fontFamily: FONT,
                  boxShadow: '0 4px 16px rgba(99,102,241,0.35)', textAlign: 'center'
                }}
              >
                Sign In →
              </button>

            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '22px 0',
          display: 'flex', justifyContent: isMobile ? 'center' : 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12, flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left'
        }}>
          <span style={{ fontSize: 13, color: '#334155', fontWeight: 400 }}>
            © 2025 College ERP · Built for Modern Institutions · Chennai, India
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Support'].map(link => (
              <span key={link} style={{ fontSize: 12, color: '#334155', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = '#64748b'}
                onMouseLeave={e => e.target.style.color = '#334155'}
              >{link}</span>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}
