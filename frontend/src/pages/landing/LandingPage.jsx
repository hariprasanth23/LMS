import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MdSchool, MdAdminPanelSettings, MdPeople, MdFamilyRestroom,
  MdWorkHistory, MdClose, MdContentCopy, MdDone,
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
  {
    key: 'admin',
    label: 'Admin',
    accent: '#DC2626',
    gradient: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)',
    border: '#FCA5A5',
    icon: MdAdminPanelSettings,
    description: 'Full system control: HR, events, approvals, configurations, reports.',
  },
  {
    key: 'student',
    label: 'Student',
    accent: '#6366F1',
    gradient: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
    border: '#A5B4FC',
    icon: MdSchool,
    description: 'Attendance, marks, fees, courses, exams and everything academic.',
  },
  {
    key: 'staff',
    label: 'Staff',
    accent: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
    border: '#C4B5FD',
    icon: MdPeople,
    description: 'Teach, grade, mentor, upload resources and manage your classes.',
  },
  {
    key: 'parent',
    label: 'Parent',
    accent: '#F59E0B',
    gradient: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
    border: '#FCD34D',
    icon: MdFamilyRestroom,
    description: "Track your child's attendance, grades, fees and communications.",
  },
  {
    key: 'alumni',
    label: 'Alumni',
    accent: '#10B981',
    gradient: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
    border: '#6EE7B7',
    icon: MdWorkHistory,
    description: 'Stay connected, update career info and access certifications.',
  },
]

const DEMO_CREDS = [
  { key: 'admin',   email: 'admin@demo.com',   password: 'Demo@123', accent: '#DC2626', label: 'Admin' },
  { key: 'student', email: 'student@demo.com', password: 'Demo@123', accent: '#6366F1', label: 'Student' },
  { key: 'staff',   email: 'staff@demo.com',   password: 'Demo@123', accent: '#8B5CF6', label: 'Staff' },
  { key: 'parent',  email: 'parent@demo.com',  password: 'Demo@123', accent: '#F59E0B', label: 'Parent' },
  { key: 'alumni',  email: 'alumni@demo.com',  password: 'Demo@123', accent: '#10B981', label: 'Alumni' },
]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [showAnnounce, setShowAnnounce] = useState(true)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredPortal, setHoveredPortal] = useState(null)
  const [copiedKey, setCopiedKey] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1800)
  }

  // ─── Chip helper ─────────────────────────────────────────────────────────
  const Chip = ({ label, bg = 'rgba(255,255,255,0.7)', color = '#5B21B6' }) => (
    <span style={{
      background: bg,
      color,
      borderRadius: 100,
      padding: '3px 10px',
      fontSize: 11,
      fontWeight: 600,
      fontFamily: FONT,
      display: 'inline-block',
      margin: '2px 3px',
      lineHeight: 1.6,
    }}>
      {label}
    </span>
  )

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: FONT, background: '#FFFFFF', color: '#18181B', overflowX: 'hidden' }}>

      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0) }
          to   { transform: translateX(-33.333%) }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0) }
          50%       { transform: translateX(-50%) translateY(7px) }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════════
          1. ANNOUNCEMENT BAR
      ══════════════════════════════════════════════════════════════════════ */}
      {showAnnounce && (
        <div style={{
          background: '#7C3AED',
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          padding: '0 48px',
        }}>
          <p style={{
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 500,
            margin: 0,
            textAlign: 'center',
            letterSpacing: 0.1,
          }}>
            🚀 College ERP v2.0 — Research Portal · APAAR ID · eSanad now live
          </p>
          <button
            onClick={() => setShowAnnounce(false)}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.75)',
              cursor: 'pointer',
              fontSize: 18,
              lineHeight: 1,
              padding: 4,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <MdClose />
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          2. NAVBAR
      ══════════════════════════════════════════════════════════════════════ */}
      <nav style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #F4F4F5',
        height: 64,
        position: 'fixed',
        top: showAnnounce ? 44 : 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.06)' : 'none',
        display: 'flex',
        alignItems: 'center',
        transition: 'box-shadow 0.2s, top 0.2s',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 40px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <MdSchool style={{ color: '#FFFFFF', fontSize: 20 }} />
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, color: '#18181B', letterSpacing: -0.5 }}>
              College ERP
            </span>
          </div>

          {/* Center nav links (desktop) */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {['Features', 'Portals', 'Academics', 'Demo'].map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  style={{
                    fontSize: 14,
                    color: '#71717A',
                    fontWeight: 500,
                    transition: 'color 0.15s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.target.style.color = '#7C3AED'}
                  onMouseLeave={e => e.target.style.color = '#71717A'}
                >
                  {item}
                </a>
              ))}
            </div>
          )}

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <button
              onClick={() => navigate('/auth/login')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
                color: '#18181B',
                fontFamily: FONT,
                padding: '4px 8px',
              }}
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/auth/register')}
              style={{
                background: '#7C3AED',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 10,
                padding: '8px 20px',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: FONT,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.target.style.opacity = '0.88'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          3. HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        background: '#FFFFFF',
        paddingTop: showAnnounce ? 140 : 96,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 65%)',
          }} />
          <div style={{
            position: 'absolute',
            top: '40%',
            left: '40%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 65%)',
          }} />
        </div>

        {/* Two-column layout */}
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          gap: 60,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* LEFT */}
          <div style={{ flex: 1, paddingRight: isMobile ? 0 : 60, minWidth: 0 }}>
            {/* Pill */}
            <div style={{
              display: 'inline-block',
              background: '#F3F0FF',
              color: '#7C3AED',
              borderRadius: 100,
              padding: '6px 16px',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 24,
            }}>
              Student Information System
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(52px, 6.5vw, 96px)',
              fontWeight: 900,
              letterSpacing: -4,
              lineHeight: 1.0,
              color: '#18181B',
              margin: 0,
            }}>
              Complete<br />College<br />
              <span style={{
                background: 'linear-gradient(135deg, #7C3AED, #0EA5E9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Management
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 18,
              color: '#71717A',
              lineHeight: 1.8,
              maxWidth: 480,
              marginTop: 20,
              marginBottom: 0,
            }}>
              One platform for every role — students, faculty, parents, alumni and administrators.
            </p>

            {/* CTA row */}
            <div style={{
              marginTop: 32,
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
            }}>
              <button
                onClick={() => navigate('/auth/login')}
                style={{
                  background: '#7C3AED',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 12,
                  padding: '13px 28px',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,0.35)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                Explore the Platform →
              </button>
              <button
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: 'transparent',
                  color: '#18181B',
                  border: '2px solid #E4E4E7',
                  borderRadius: 12,
                  padding: '13px 28px',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Try Demo
              </button>
            </div>

            {/* Trust row */}
            <div style={{
              marginTop: 24,
              display: 'flex',
              gap: 24,
              flexWrap: 'wrap',
              color: '#A1A1AA',
              fontSize: 13,
            }}>
              <span>✓ 5 User Portals</span>
              <span>✓ 50+ Features</span>
              <span>✓ Always Secure</span>
            </div>
          </div>

          {/* RIGHT — 2×2 feature preview grid */}
          {!isMobile && (
            <div style={{
              flex: '0 0 500px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}>
              {[
                {
                  emoji: '📚',
                  title: 'Academics',
                  chips: ['My Curriculum', 'Time Table', 'Attendance'],
                  bg: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
                  rot: 'rotate(-1deg)',
                },
                {
                  emoji: '📝',
                  title: 'Examinations',
                  chips: ['Marks', 'Grades', 'Online Exams'],
                  bg: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
                  rot: 'rotate(1deg)',
                },
                {
                  emoji: '💰',
                  title: 'Finance',
                  chips: ['Payments', 'Receipts', 'Wallet'],
                  bg: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                  rot: 'rotate(1deg)',
                },
                {
                  emoji: '🔬',
                  title: 'Research',
                  chips: ['Thesis', 'Scholars', 'Publications'],
                  bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                  rot: 'rotate(-1deg)',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  style={{
                    background: card.bg,
                    borderRadius: 20,
                    padding: 24,
                    height: 160,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    transform: card.rot,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 28, lineHeight: 1 }}>{card.emoji}</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#18181B', marginTop: 8 }}>
                      {card.title}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {card.chips.map(c => (
                      <span key={c} style={{
                        background: 'rgba(255,255,255,0.7)',
                        borderRadius: 100,
                        padding: '2px 9px',
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#3F3F46',
                      }}>{c}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#D4D4D8',
          fontSize: 13,
          fontWeight: 500,
          animation: 'bounce 2s ease-in-out infinite',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          ↓ Explore
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. FEATURE TICKER
      ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        background: '#FAFAFA',
        borderTop: '1px solid #F4F4F5',
        borderBottom: '1px solid #F4F4F5',
        padding: '14px 0',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          width: 'max-content',
          animation: 'marquee 28s linear infinite',
        }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '0 20px',
              fontSize: 13,
              fontWeight: 600,
              color: '#3F3F46',
              whiteSpace: 'nowrap',
            }}>
              <span style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#7C3AED',
                flexShrink: 0,
              }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          5. STATS
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        background: '#FFFFFF',
        padding: '64px 40px',
        borderBottom: '1px solid #F4F4F5',
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: 24,
        }}>
          {[
            { target: 6,   suffix: '+', label: 'Main Menus',  accent: '#7C3AED' },
            { target: 50,  suffix: '+', label: 'Features',    accent: '#0EA5E9' },
            { target: 5,   suffix: '',  label: 'User Portals', accent: '#F59E0B' },
            { target: 100, suffix: '%', label: 'Uptime',      accent: '#10B981' },
          ].map(({ target, suffix, label, accent }) => (
            <div key={label} style={{ textAlign: 'left' }}>
              <div style={{
                width: 40,
                height: 3,
                background: accent,
                borderRadius: 2,
                marginBottom: 16,
              }} />
              <div style={{
                fontSize: 60,
                fontWeight: 900,
                color: '#18181B',
                letterSpacing: -3,
                lineHeight: 1,
              }}>
                <Counter target={target} suffix={suffix} />
              </div>
              <div style={{
                fontSize: 14,
                color: '#71717A',
                fontWeight: 500,
                marginTop: 8,
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. FEATURES — COLORFUL BENTO
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="features" style={{
        background: '#FAFAFA',
        padding: '88px 40px',
      }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            color: '#7C3AED',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            BUILT FOR MODERN INSTITUTIONS
          </div>
          <h2 style={{
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1.1,
            color: '#18181B',
            margin: '0 0 16px',
          }}>
            Every Feature<br />You Need
          </h2>
          <p style={{ fontSize: 17, color: '#71717A', maxWidth: 520, margin: '0 auto' }}>
            From daily attendance to PhD thesis — one platform, every module.
          </p>
        </div>

        {/* Bento grid */}
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(12, 1fr)',
          gap: 16,
        }}>
          {/* Card 1 — Academics (span 5, row span 2) */}
          <div
            onMouseEnter={() => setHoveredCard('academics')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              gridColumn: isMobile ? 'auto' : 'span 5',
              gridRow: isMobile ? 'auto' : 'span 2',
              background: 'linear-gradient(145deg, #EDE9FE 0%, #DDD6FE 50%, #C4B5FD 100%)',
              borderRadius: 24,
              padding: 32,
              minHeight: isMobile ? 'auto' : 320,
              border: '1px solid #C4B5FD',
              transition: 'transform 0.2s, box-shadow 0.2s',
              transform: hoveredCard === 'academics' ? 'scale(1.01)' : 'scale(1)',
              boxShadow: hoveredCard === 'academics' ? '0 20px 60px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#4C1D95', marginBottom: 8 }}>Academics</div>
            <div style={{ fontSize: 14, color: '#6D28D9', marginBottom: 16, lineHeight: 1.6 }}>
              Complete academic management from curriculum to project submissions.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
              {['My Curriculum','Time Table','Class Attendance','Biometric Info','Faculty Info',
                'HOD Info','Regulation','Minor/Honour','Course Registration','Project Course',
                'Digital Assignment','QCM View','Outcome SET Conf','Co-Extra Curricular',
                'Academics Calendar','Project Mark View','Apaar ID Upload'].map(c => (
                <Chip key={c} label={c} />
              ))}
            </div>
          </div>

          {/* Card 2 — Examinations (span 7) */}
          <div
            onMouseEnter={() => setHoveredCard('exam')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              gridColumn: isMobile ? 'auto' : 'span 7',
              background: 'linear-gradient(145deg, #FEE2E2 0%, #FECACA 100%)',
              borderRadius: 24,
              padding: 28,
              minHeight: 160,
              border: '1px solid #FCA5A5',
              transition: 'transform 0.2s, box-shadow 0.2s',
              transform: hoveredCard === 'exam' ? 'scale(1.01)' : 'scale(1)',
              boxShadow: hoveredCard === 'exam' ? '0 20px 60px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 18, color: '#991B1B', marginBottom: 12 }}>📝 Examinations</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
              {['Exam Schedule','Marks','Grades','Grade History','Regular Paper See/Rev',
                'Additional Learning','MOOC Upload','Re-Exam Application','Arrear Exam',
                'Online Exam','Makeup Exam','Code of Conduct'].map(c => (
                <Chip key={c} label={c} bg="rgba(255,255,255,0.65)" color="#991B1B" />
              ))}
            </div>
          </div>

          {/* Card 3 — Finance (span 4) */}
          <div
            onMouseEnter={() => setHoveredCard('finance')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              gridColumn: isMobile ? 'auto' : 'span 4',
              background: 'linear-gradient(145deg, #DCFCE7 0%, #BBF7D0 100%)',
              borderRadius: 24,
              padding: 28,
              minHeight: 160,
              border: '1px solid #86EFAC',
              transition: 'transform 0.2s, box-shadow 0.2s',
              transform: hoveredCard === 'finance' ? 'scale(1.01)' : 'scale(1)',
              boxShadow: hoveredCard === 'finance' ? '0 20px 60px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 18, color: '#14532D', marginBottom: 12 }}>💰 Finance</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
              {['Fee Payment','Receipts','Wallet','Due List','Scholarship','Fine','Transaction History'].map(c => (
                <Chip key={c} label={c} bg="rgba(255,255,255,0.65)" color="#14532D" />
              ))}
            </div>
          </div>

          {/* Card 4 — Services (span 3) */}
          <div
            onMouseEnter={() => setHoveredCard('services')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              gridColumn: isMobile ? 'auto' : 'span 3',
              background: 'linear-gradient(145deg, #FEF3C7 0%, #FDE68A 100%)',
              borderRadius: 24,
              padding: 28,
              minHeight: 160,
              border: '1px solid #FCD34D',
              transition: 'transform 0.2s, box-shadow 0.2s',
              transform: hoveredCard === 'services' ? 'scale(1.01)' : 'scale(1)',
              boxShadow: hoveredCard === 'services' ? '0 20px 60px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 18, color: '#78350F', marginBottom: 12 }}>🛠️ Services</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
              {['Bonafide','Proctor','TC Request','Library','Hostel','Bus Pass','NOC'].map(c => (
                <Chip key={c} label={c} bg="rgba(255,255,255,0.65)" color="#78350F" />
              ))}
            </div>
          </div>

          {/* Card 5 — Research (span 5) */}
          <div
            onMouseEnter={() => setHoveredCard('research')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              gridColumn: isMobile ? 'auto' : 'span 5',
              background: 'linear-gradient(145deg, #F5F3FF 0%, #EDE9FE 100%)',
              borderRadius: 24,
              padding: 28,
              minHeight: 160,
              border: '1px solid #DDD6FE',
              transition: 'transform 0.2s, box-shadow 0.2s',
              transform: hoveredCard === 'research' ? 'scale(1.01)' : 'scale(1)',
              boxShadow: hoveredCard === 'research' ? '0 20px 60px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 18, color: '#4C1D95', marginBottom: 12 }}>🔬 Research</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
              {['Thesis Submission','PhD Scholars','Publications','Conferences','Research Grants',
                'FDP Events','Patents','Collaborations','eSanad','Symposium','JRF/SRF'].map(c => (
                <Chip key={c} label={c} />
              ))}
            </div>
          </div>

          {/* Card 6 — Feedback (span 7) */}
          <div
            onMouseEnter={() => setHoveredCard('feedback')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              gridColumn: isMobile ? 'auto' : 'span 7',
              background: 'linear-gradient(145deg, #ECFEFF 0%, #CFFAFE 100%)',
              borderRadius: 24,
              padding: 28,
              minHeight: 160,
              border: '1px solid #67E8F9',
              transition: 'transform 0.2s, box-shadow 0.2s',
              transform: hoveredCard === 'feedback' ? 'scale(1.01)' : 'scale(1)',
              boxShadow: hoveredCard === 'feedback' ? '0 20px 60px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#164E63', marginBottom: 12 }}>💬 Feedback & Communication</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                  {['Student Feedback','Faculty Rating','Course Feedback','Exit Survey',
                    'Mentor Connect','Notifications','Circular Board','Event Registration'].map(c => (
                    <Chip key={c} label={c} bg="rgba(255,255,255,0.7)" color="#0C4A6E" />
                  ))}
                </div>
              </div>
              {/* Star decoration */}
              <div style={{
                display: 'flex',
                gap: 2,
                fontSize: 18,
                color: '#F59E0B',
                flexShrink: 0,
                paddingLeft: 16,
              }}>
                {'★★★★★'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          7. FOR EVERY ROLE
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="portals" style={{
        background: '#FFFFFF',
        padding: '88px 40px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            color: '#7C3AED',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            5 DEDICATED PORTALS
          </div>
          <h2 style={{
            fontSize: 'clamp(36px, 4.5vw, 52px)',
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1.1,
            color: '#18181B',
            margin: '0 0 16px',
          }}>
            A Dedicated Portal<br />For Everyone
          </h2>
          <p style={{ fontSize: 17, color: '#71717A', maxWidth: 500, margin: '0 auto' }}>
            Each portal is purpose-built with the tools each role actually needs.
          </p>
        </div>

        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)',
          gap: 16,
        }}>
          {PORTALS.map(p => {
            const Icon = p.icon
            const isHovered = hoveredPortal === p.key
            return (
              <div
                key={p.key}
                onMouseEnter={() => setHoveredPortal(p.key)}
                onMouseLeave={() => setHoveredPortal(null)}
                style={{
                  background: p.gradient,
                  border: `1px solid ${p.border}`,
                  borderRadius: 20,
                  padding: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isHovered ? '0 16px 50px rgba(0,0,0,0.12)' : '0 2px 10px rgba(0,0,0,0.04)',
                  cursor: 'default',
                }}
              >
                {/* Icon circle */}
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                }}>
                  <Icon style={{ fontSize: 28, color: p.accent }} />
                </div>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#18181B', marginBottom: 8 }}>
                  {p.label}
                </div>
                <p style={{
                  fontSize: 13,
                  color: '#52525B',
                  lineHeight: 1.6,
                  margin: 0,
                  flex: 1,
                }}>
                  {p.description}
                </p>
                <button
                  onClick={() => navigate(`/auth/login?portal=${p.key}`)}
                  style={{
                    marginTop: 16,
                    background: p.accent,
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 0',
                    width: '100%',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    fontFamily: FONT,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Login as {p.label}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          8. DEMO ACCESS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="demo" style={{
        background: '#FAFAFA',
        padding: '88px 40px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            color: '#7C3AED',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            INSTANT ACCESS
          </div>
          <h2 style={{
            fontSize: 'clamp(36px, 4.5vw, 52px)',
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1.1,
            color: '#18181B',
            margin: '0 0 16px',
          }}>
            Try It Free<br />Right Now
          </h2>
          <p style={{ fontSize: 17, color: '#71717A', maxWidth: 460, margin: '0 auto' }}>
            Pick any portal and log in instantly with the demo credentials below.
          </p>
        </div>

        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
        }}>
          {DEMO_CREDS.map(d => (
            <div
              key={d.key}
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                border: '1px solid #F4F4F5',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Accent strip */}
              <div style={{ height: 6, background: d.accent }} />
              <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Portal name + badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontWeight: 800, fontSize: 16, color: '#18181B' }}>{d.label}</span>
                  <span style={{
                    background: d.accent,
                    color: '#FFFFFF',
                    borderRadius: 100,
                    padding: '2px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                  }}>
                    DEMO
                  </span>
                </div>

                {/* Email */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: '#A1A1AA', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</div>
                  <div style={{
                    background: '#F4F4F5',
                    borderRadius: 8,
                    padding: '7px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 6,
                  }}>
                    <code style={{ fontSize: 12, color: '#18181B', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {d.email}
                    </code>
                    <button
                      onClick={() => copyToClipboard(d.email, `${d.key}-email`)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#71717A',
                        padding: 2,
                        display: 'flex',
                        flexShrink: 0,
                      }}
                    >
                      {copiedKey === `${d.key}-email` ? <MdDone style={{ fontSize: 16, color: '#10B981' }} /> : <MdContentCopy style={{ fontSize: 16 }} />}
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: '#A1A1AA', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Password</div>
                  <div style={{
                    background: '#F4F4F5',
                    borderRadius: 8,
                    padding: '7px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 6,
                  }}>
                    <code style={{ fontSize: 12, color: '#18181B', fontFamily: 'monospace' }}>
                      {d.password}
                    </code>
                    <button
                      onClick={() => copyToClipboard(d.password, `${d.key}-pass`)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#71717A',
                        padding: 2,
                        display: 'flex',
                        flexShrink: 0,
                      }}
                    >
                      {copiedKey === `${d.key}-pass` ? <MdDone style={{ fontSize: 16, color: '#10B981' }} /> : <MdContentCopy style={{ fontSize: 16 }} />}
                    </button>
                  </div>
                </div>

                {/* Login button */}
                <button
                  onClick={() => navigate(`/auth/login?portal=${d.key}`)}
                  style={{
                    marginTop: 'auto',
                    background: d.accent,
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 0',
                    width: '100%',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    fontFamily: FONT,
                  }}
                >
                  Login as {d.label}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          9. HOW IT WORKS
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        background: '#FFFFFF',
        padding: '88px 40px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            color: '#7C3AED',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            GETTING STARTED
          </div>
          <h2 style={{
            fontSize: 'clamp(36px, 4vw, 52px)',
            fontWeight: 900,
            letterSpacing: -2,
            color: '#18181B',
            margin: 0,
          }}>
            Up and Running in Minutes
          </h2>
        </div>

        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 32,
        }}>
          {[
            { num: '01', title: 'Select Your Portal', desc: 'Choose from Admin, Student, Staff, Parent or Alumni portals based on your role.', accent: '#7C3AED', emoji: '🎯' },
            { num: '02', title: 'Enter Credentials',  desc: 'Use your institution-provided credentials or try the demo accounts to explore.', accent: '#0EA5E9', emoji: '🔐' },
            { num: '03', title: 'Access Your Dashboard', desc: 'Your personalised dashboard loads instantly with all relevant modules and data.', accent: '#10B981', emoji: '🚀' },
          ].map(step => (
            <div key={step.num} style={{ position: 'relative', padding: '8px 0' }}>
              {/* Big decorative number */}
              <div style={{
                position: 'absolute',
                top: -24,
                left: -8,
                fontSize: 120,
                fontWeight: 900,
                color: '#F4F4F5',
                lineHeight: 1,
                userSelect: 'none',
                zIndex: 0,
              }}>
                {step.num}
              </div>
              {/* Content */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: `${step.accent}18`,
                  border: `2px solid ${step.accent}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  marginBottom: 20,
                  marginTop: 56,
                }}>
                  {step.emoji}
                </div>
                <h3 style={{
                  fontWeight: 800,
                  fontSize: 22,
                  color: '#18181B',
                  margin: '0 0 12px',
                  letterSpacing: -0.5,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: 15,
                  color: '#71717A',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          10. CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #4C1D95 100%)',
        padding: '88px 40px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(36px, 5vw, 52px)',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: -2,
            margin: '0 0 20px',
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.7,
            margin: '0 0 40px',
          }}>
            Join institutions across the country using College ERP to streamline campus operations.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <button
              onClick={() => navigate('/auth/register')}
              style={{
                background: '#FFFFFF',
                color: '#7C3AED',
                border: 'none',
                borderRadius: 12,
                padding: '14px 32px',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                fontFamily: FONT,
              }}
            >
              Create Account
            </button>
            <button
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent',
                color: '#FFFFFF',
                border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: 12,
                padding: '14px 32px',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                fontFamily: FONT,
              }}
            >
              Try Demo
            </button>
          </div>

          {/* Trust badges */}
          <div style={{
            display: 'flex',
            gap: 24,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {['🔒 Enterprise Security', '⚡ 99.9% Uptime', '📱 Mobile Friendly'].map(badge => (
              <div key={badge} style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 100,
                padding: '8px 20px',
                fontSize: 13,
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 600,
                backdropFilter: 'blur(4px)',
              }}>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          11. FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer style={{
        background: '#18181B',
        padding: '56px 40px 24px',
        color: '#FFFFFF',
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
        }}>
          {/* 4-column grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr',
            gap: 40,
            marginBottom: 48,
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <MdSchool style={{ color: '#FFFFFF', fontSize: 20 }} />
                </div>
                <span style={{ fontWeight: 900, fontSize: 18, color: '#FFFFFF' }}>College ERP</span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 260, margin: 0 }}>
                A comprehensive Student Information System for modern educational institutions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#FFFFFF', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
                Quick Links
              </div>
              {['Features', 'Portals', 'Demo Access', 'Academics', 'Support'].map(link => (
                <a
                  key={link}
                  href="#"
                  style={{
                    display: 'block',
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.45)',
                    marginBottom: 10,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.85)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Portals */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#FFFFFF', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
                Portals
              </div>
              {['Admin Portal', 'Student Portal', 'Staff Portal', 'Parent Portal', 'Alumni Portal'].map(link => (
                <a
                  key={link}
                  href="#"
                  style={{
                    display: 'block',
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.45)',
                    marginBottom: 10,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.85)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#FFFFFF', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
                Contact
              </div>
              {[
                'support@collegeerp.in',
                '+91 98765 43210',
                'Mon–Fri 9AM–6PM IST',
                'Chennai, Tamil Nadu',
              ].map(item => (
                <div
                  key={item}
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.45)',
                    marginBottom: 10,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
              © 2026 College ERP. All rights reserved.
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
              Made in India 🇮🇳
            </span>
          </div>
        </div>
      </footer>

    </div>
  )
}
