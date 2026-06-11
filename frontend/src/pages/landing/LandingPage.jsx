import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── intersection ─────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function Reveal({ children, delay = 0, dir = 'up', style = {} }) {
  const [ref, inView] = useInView()
  const from = dir === 'left' ? 'translateX(-24px)' : dir === 'right' ? 'translateX(24px)' : 'translateY(28px)'
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : from,
      transition: `opacity 1s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 1s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      ...style,
    }}>{children}</div>
  )
}

// ─── data ─────────────────────────────────────────────────────────────────────
const MODULES = [
  { idx: '01', name: 'Academic Management',  desc: 'Curriculum, timetables, course materials, attendance.', count: 22 },
  { idx: '02', name: 'Examinations',          desc: 'Schedules, marks, grades, arrear and makeup workflows.', count: 18 },
  { idx: '03', name: 'Finance & Payments',    desc: 'Fees, wallet, receipts, refunds, library dues.', count: 12 },
  { idx: '04', name: 'Student Services',      desc: 'Bonafide, transcripts, library, scholarships, eSanad.', count: 26 },
  { idx: '05', name: 'Research Portal',       desc: 'PhD lifecycle, guide meetings, thesis submission.', count: 14 },
  { idx: '06', name: 'Learning Management',   desc: 'Course pages, digital assignments, online quizzes.', count: 16 },
  { idx: '07', name: 'HR & Payroll',          desc: 'Employee records, leave workflows, payslip generation.', count: 18 },
  { idx: '08', name: 'Notifications',         desc: 'Cross-portal alerts, reminders, announcements.', count: 8 },
]

const PORTALS = [
  { key: 'admin',   name: 'Admin',   subtitle: 'Operations, HR & Payroll',          features: '30 features' },
  { key: 'student', name: 'Student', subtitle: 'Curriculum, exams, finance, profile', features: '50 features' },
  { key: 'staff',   name: 'Faculty', subtitle: 'Teaching, evaluation, attendance',    features: '20 features' },
  { key: 'parent',  name: 'Parent',  subtitle: 'Ward progress, fees, communication',  features: '10 features' },
  { key: 'alumni',  name: 'Alumni',  subtitle: 'Network, updates, achievements',       features: '08 features' },
]

const VOICES = [
  {
    text: 'Marks entry and assignment grading used to take three hours per class. Now it takes twenty minutes.',
    name: 'Dr. Priya Shankar',
    role: 'Associate Professor, Department of Electronics',
  },
  {
    text: 'Processing payroll for two hundred employees manually was a nightmare. The automation saves two full days every month.',
    name: 'Ramesh Kumar',
    role: 'Human Resources, Administrative Office',
  },
  {
    text: 'I check attendance, grades, and exam schedules from one place. No more hunting through five different portals.',
    name: 'Arjun Ravi',
    role: 'B.Tech Computer Science, Semester Six',
  },
]

const FAQS = [
  { q: 'Does every role get its own portal?',
    a: 'Yes. Five purpose-built portals — Student, Faculty, Admin, Parent, Alumni — each with its own dashboard, feature set, and JWT-secured login. Role boundaries are enforced at both API and UI layers.' },
  { q: 'How is sensitive data protected?',
    a: 'All endpoints require a signed JWT. Sessions auto-expire after fifteen minutes of inactivity. Passwords are bcrypt-hashed; role-based method security prevents cross-portal access.' },
  { q: 'Can existing data be migrated?',
    a: 'Bulk CSV import is built into the HR and student modules, allowing migration from spreadsheets or legacy databases in a single upload.' },
  { q: 'How is fee payment handled?',
    a: 'Payments are recorded in real time. Receipts generate as downloadable PDFs. Parents see updated fee status immediately in their portal.' },
  { q: 'Where does it run?',
    a: 'Containerised deployment (frontend, backend, PostgreSQL, nginx). Cloud-hosted by default; on-premise installations available for institutions with dedicated infrastructure.' },
]

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']

// ─── theme toggle ─────────────────────────────────────────────────────────────
function ThemeToggle({ isDark, onToggle, c }) {
  return (
    <button onClick={onToggle} aria-label="Toggle theme"
      style={{
        background: 'transparent', border: `1px solid ${c.rule}`, borderRadius: 0,
        padding: '6px 14px', cursor: 'pointer', font: 'inherit', fontSize: 11,
        letterSpacing: '0.18em', textTransform: 'uppercase', color: c.muted,
        transition: 'all .25s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = c.text; e.currentTarget.style.color = c.bg }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.muted }}
    >{isDark ? '☼ Light' : '☾ Dark'}</button>
  )
}

// ─── landing page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768)
  const [openFaq, setOpenFaq] = useState(null)
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('erp_theme') === 'dark' } catch { return false }
  })

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    try { localStorage.setItem('erp_theme', next ? 'dark' : 'light') } catch { /* ignore */ }
  }

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  // ─── palette ────────────────────────────────────────────────────────────────
  const c = isDark ? {
    bg:       '#0d0a06',
    bgSoft:   '#15110b',
    text:     '#ebe0c8',
    muted:    'rgba(235,224,200,0.58)',
    faint:    'rgba(235,224,200,0.32)',
    rule:     'rgba(235,224,200,0.18)',
    ruleSoft: 'rgba(235,224,200,0.08)',
    accent:   '#d18a6e',
    accent2:  '#c4a574',
    invertBg: '#ebe0c8',
    invertText:'#0d0a06',
  } : {
    bg:       '#f3ead2',
    bgSoft:   '#ebe0c4',
    text:     '#1a1410',
    muted:    'rgba(26,20,16,0.62)',
    faint:    'rgba(26,20,16,0.38)',
    rule:     'rgba(26,20,16,0.18)',
    ruleSoft: 'rgba(26,20,16,0.08)',
    accent:   '#7a1f1f',
    accent2:  '#9c5a1a',
    invertBg: '#1a1410',
    invertText:'#f3ead2',
  }

  const SERIF = "'Fraunces', 'Cormorant Garamond', Georgia, 'Times New Roman', serif"
  const SANS  = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  const MONO  = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace"

  // ─── reusable styles ────────────────────────────────────────────────────────
  const root = {
    background: c.bg, color: c.text, fontFamily: SANS,
    minHeight: '100vh', overflowX: 'hidden',
    transition: 'background .4s ease, color .4s ease',
  }

  const sectionPad = isMobile ? '80px 24px' : '120px 64px'
  const maxW       = 1240

  const eyebrow = {
    fontFamily: MONO, fontSize: 11, letterSpacing: '0.22em',
    textTransform: 'uppercase', color: c.muted, marginBottom: 14,
    display: 'flex', alignItems: 'center', gap: 14,
  }
  const eyebrowLine = { flex: 1, height: 1, background: c.rule }

  const displayH2 = {
    fontFamily: SERIF, fontWeight: 400,
    fontSize: isMobile ? 'clamp(40px,9vw,56px)' : 'clamp(48px,5.5vw,84px)',
    lineHeight: 1.02, letterSpacing: '-0.03em', color: c.text,
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
  }

  const italicAccent = {
    fontStyle: 'italic', color: c.accent, fontWeight: 300,
  }

  const body = {
    fontFamily: SANS, fontSize: 16, lineHeight: 1.7, color: c.muted, fontWeight: 400,
  }

  return (
    <div style={root}>

      {/* ─── global css ──────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { background: ${c.bg}; color: ${c.text}; transition: background .4s ease, color .4s ease; }
        ::selection { background: ${c.text}; color: ${c.bg}; }
        a { color: inherit; text-decoration: none; }

        @keyframes drift { 0%,100% { transform: translateX(0) } 50% { transform: translateX(-12px) } }
        @keyframes pulse-rule { 0%,100% { opacity: .4 } 50% { opacity: 1 } }
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes blink { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }

        .underline-grow { position: relative; cursor: pointer; }
        .underline-grow::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: -2px;
          height: 1px; background: currentColor; transform: scaleX(0);
          transform-origin: right; transition: transform .4s cubic-bezier(.7,0,.2,1);
        }
        .underline-grow:hover::after { transform: scaleX(1); transform-origin: left; }

        .arrow-link { display: inline-flex; align-items: center; gap: 8px; }
        .arrow-link .arrow { transition: transform .3s ease; }
        .arrow-link:hover .arrow { transform: translateX(4px); }

        .ledger-row {
          transition: background .25s ease, padding .25s ease;
        }
        .ledger-row:hover { background: ${c.ruleSoft}; }

        .big-cta {
          display: inline-block; padding: 18px 36px;
          background: ${c.text}; color: ${c.bg};
          font-family: ${MONO}; font-size: 12px; letter-spacing: 0.22em;
          text-transform: uppercase; border: none; cursor: pointer;
          transition: all .3s cubic-bezier(.7,0,.2,1); position: relative; overflow: hidden;
        }
        .big-cta::before {
          content: ''; position: absolute; inset: 0;
          background: ${c.accent}; transform: scaleX(0); transform-origin: right;
          transition: transform .4s cubic-bezier(.7,0,.2,1); z-index: -1;
        }
        .big-cta:hover { color: ${c.bg === '#f3ead2' ? '#fff' : '#fff'}; }
        .big-cta:hover::before { transform: scaleX(1); transform-origin: left; }

        .ghost-cta {
          display: inline-block; padding: 18px 24px;
          background: transparent; color: ${c.text};
          font-family: ${MONO}; font-size: 12px; letter-spacing: 0.22em;
          text-transform: uppercase; border: none; cursor: pointer;
          border-bottom: 1px solid ${c.text};
        }
      `}</style>

      {/* ─── nav ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: c.bg, borderBottom: `1px solid ${c.rule}`,
        padding: isMobile ? '16px 24px' : '20px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>
            College <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Erp</span>
          </span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: c.faint, letterSpacing: '0.15em' }}>
            EST. 2025
          </span>
        </div>

        {!isMobile && (
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[
              { l: 'Index',    id: 'index' },
              { l: 'Portals',  id: 'portals' },
              { l: 'Voices',   id: 'voices' },
              { l: 'Inquiry',  id: 'faq' },
            ].map(item => (
              <span key={item.id} onClick={() => scrollTo(item.id)}
                className="underline-grow"
                style={{ fontSize: 13, letterSpacing: '0.04em', color: c.text }}>
                {item.l}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} c={c} />
          <button onClick={() => navigate('/auth/login')}
            style={{
              background: c.text, color: c.bg, border: 'none', padding: '8px 18px',
              fontFamily: MONO, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all .25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = c.accent; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = c.text; e.currentTarget.style.color = c.bg }}
          >Sign In →</button>
        </div>
      </nav>

      {/* ─── hero ────────────────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '60px 24px 80px' : '100px 64px 140px', position: 'relative' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto', position: 'relative' }}>

          {/* meta strip */}
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: 18, marginBottom: isMobile ? 56 : 88,
            paddingBottom: 24, borderBottom: `1px solid ${c.rule}`,
          }}>
            {[
              { label: 'Volume',     value: 'II · 2026' },
              { label: 'Sections',   value: 'Eight' },
              { label: 'Portals',    value: 'Five' },
              { label: 'Status',     value: 'In Service' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em', color: c.faint, textTransform: 'uppercase', marginBottom: 6 }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 18, color: c.text, fontWeight: 400 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <Reveal>
            <h1 style={{
              fontFamily: SERIF, fontWeight: 400,
              fontSize: isMobile ? 'clamp(56px,15vw,84px)' : 'clamp(80px,11vw,180px)',
              lineHeight: 0.92, letterSpacing: '-0.045em',
              fontVariationSettings: '"opsz" 144, "SOFT" 30',
              marginBottom: 28,
            }}>
              The
              <br />
              <span style={italicAccent}>institution,</span>
              <br />
              in one place.
              <span style={{
                display: 'inline-block', width: '0.4em', height: '0.85em',
                background: c.text, marginLeft: 12, verticalAlign: '-0.05em',
                animation: 'blink 1.1s steps(2) infinite',
              }} />
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <div style={{
              display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
              gap: isMobile ? 24 : 96, marginTop: 56, alignItems: 'start',
            }}>
              <div>
                <p style={{
                  fontFamily: SERIF, fontWeight: 300, fontStyle: 'italic',
                  fontSize: isMobile ? 22 : 28, lineHeight: 1.4, color: c.text,
                  marginBottom: 24, maxWidth: 640,
                }}>
                  A campus-wide platform for students, faculty, administration, parents
                  and alumni — designed to replace the fragmentation that defines most
                  Indian institutions today.
                </p>
                <p style={{ ...body, maxWidth: 520, marginBottom: 36 }}>
                  Built from first principles around the realities of running a
                  modern college: attendance, examinations, finance, research, and
                  the dozen smaller systems each typically managed in spreadsheets
                  and separate logins.
                </p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <button className="big-cta" onClick={() => navigate('/auth/login')}>
                    Enter Platform →
                  </button>
                  <button className="ghost-cta" onClick={() => scrollTo('index')}>
                    Read Index
                  </button>
                </div>
              </div>

              {/* index card — right */}
              <div style={{
                border: `1px solid ${c.rule}`, padding: '28px 28px 24px',
                background: c.bgSoft,
              }}>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.22em', color: c.faint, marginBottom: 22, textTransform: 'uppercase' }}>
                  Contents
                </div>
                {MODULES.slice(0, 6).map((m, i) => (
                  <div key={m.idx} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    padding: '8px 0', borderBottom: i === 5 ? 'none' : `1px dashed ${c.ruleSoft}`,
                  }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: c.faint }}>{m.idx}</span>
                      <span style={{ fontFamily: SERIF, fontSize: 15, color: c.text }}>{m.name}</span>
                    </div>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: c.faint }}>p. {Number(m.idx) * 3 + 7}</span>
                  </div>
                ))}
                <div style={{
                  marginTop: 16, fontFamily: MONO, fontSize: 11, color: c.accent,
                  letterSpacing: '0.1em', cursor: 'pointer',
                }}
                  onClick={() => scrollTo('index')}>
                  See full index →
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* drift line at bottom */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          fontFamily: MONO, fontSize: 10, color: c.faint, letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          ↓ Continue reading
        </div>
      </section>

      {/* ─── ticker / colophon strip ─────────────────────────────────────── */}
      <div style={{
        background: c.text, color: c.bg, padding: '20px 0', overflow: 'hidden',
        borderTop: `1px solid ${c.text}`, borderBottom: `1px solid ${c.text}`,
      }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 50s linear infinite' }}>
          {Array(2).fill(0).map((_, dup) => (
            <div key={dup} style={{ display: 'flex', gap: 48, paddingRight: 48, flexShrink: 0 }}>
              {[
                'Academic Records', 'Course Registration', 'Digital Assignments',
                'Examination Schedules', 'Marks & Grades', 'Fee Payments',
                'Wallet Top-Up', 'Refund Workflows', 'Bonafide Certificates',
                'eSanad Requests', 'Library Services', 'APAAR ID Upload',
                'Project Portal', 'Research Submissions', 'Guide Meetings',
                'Employee Management', 'Leave Approvals', 'Payroll Automation',
                'Smart Notifications', 'Parent Dashboard', 'Alumni Network',
              ].map(item => (
                <span key={item} style={{
                  fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
                  fontSize: 22, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 24,
                }}>
                  {item}
                  <span style={{ fontFamily: SANS, fontSize: 16, opacity: 0.4 }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── I. INDEX / MODULES ──────────────────────────────────────────── */}
      <section id="index" style={{ padding: sectionPad, borderBottom: `1px solid ${c.rule}` }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>

          <Reveal>
            <div style={eyebrow}>
              <span>§ {NUMERALS[0]} — The Index</span>
              <span style={eyebrowLine} />
              <span>Eight modules · Eighty features</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{
              display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr',
              gap: isMobile ? 40 : 96, marginBottom: 72,
            }}>
              <h2 style={displayH2}>
                Every campus<br />workflow,<br /><span style={italicAccent}>cataloged.</span>
              </h2>
              <p style={{
                ...body, fontSize: isMobile ? 16 : 18, alignSelf: 'end',
                paddingBottom: 12, maxWidth: 520,
              }}>
                Each of the eight modules is independently scoped, with its own data
                model, repository, and access controls — yet integrated where it
                matters. A grade entered by faculty appears immediately on the
                parent dashboard, the student's transcript, and the analytics feed.
              </p>
            </div>
          </Reveal>

          {/* ledger table */}
          <Reveal delay={150}>
            <div style={{ borderTop: `2px solid ${c.text}` }}>
              {MODULES.map((m, i) => (
                <div key={m.idx} className="ledger-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '40px 1fr 50px' : '60px 1.5fr 3fr 80px 40px',
                    gap: 16, alignItems: 'baseline',
                    padding: isMobile ? '20px 0' : '24px 0',
                    borderBottom: `1px solid ${c.rule}`,
                  }}>
                  <span style={{
                    fontFamily: MONO, fontSize: 12, color: c.faint, letterSpacing: '0.1em',
                  }}>{m.idx}</span>
                  <span style={{
                    fontFamily: SERIF, fontSize: isMobile ? 20 : 26, fontWeight: 400,
                    color: c.text, letterSpacing: '-0.01em',
                  }}>{m.name}</span>
                  {!isMobile && (
                    <span style={{ fontSize: 14, color: c.muted, lineHeight: 1.6 }}>{m.desc}</span>
                  )}
                  {!isMobile && (
                    <span style={{ fontFamily: MONO, fontSize: 12, color: c.muted, textAlign: 'right' }}>
                      {m.count} fns
                    </span>
                  )}
                  <span style={{
                    fontFamily: SERIF, fontStyle: 'italic', fontSize: 18,
                    color: c.accent, textAlign: 'right', cursor: 'pointer',
                  }}>→</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div style={{
              marginTop: 56, display: 'flex', flexDirection: isMobile ? 'column' : 'row',
              gap: 16, alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between',
            }}>
              <p style={{
                fontFamily: SERIF, fontStyle: 'italic', fontSize: 22, color: c.text, maxWidth: 540,
              }}>
                One database, one filter chain, one signing key — and{' '}
                <span style={{ color: c.accent }}>five doors.</span>
              </p>
              <button className="big-cta" onClick={() => scrollTo('portals')}>
                See the doors →
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── II. PORTALS ─────────────────────────────────────────────────── */}
      <section id="portals" style={{ padding: sectionPad, background: c.bgSoft }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>

          <Reveal>
            <div style={eyebrow}>
              <span>§ {NUMERALS[1]} — The Portals</span>
              <span style={eyebrowLine} />
              <span>Role-bound · JWT-secured</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 style={{ ...displayH2, marginBottom: 64 }}>
              Five entries,<br />
              <span style={italicAccent}>same building.</span>
            </h2>
          </Reveal>

          {/* portal cards as paragraphs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)',
            borderTop: `2px solid ${c.text}`, borderBottom: `2px solid ${c.text}`,
          }}>
            {PORTALS.map((p, i) => (
              <Reveal key={p.key} delay={i * 80}>
                <div style={{
                  padding: '36px 24px',
                  borderRight: !isMobile && i < PORTALS.length - 1 ? `1px solid ${c.rule}` : 'none',
                  borderBottom: isMobile && i < PORTALS.length - 1 ? `1px solid ${c.rule}` : 'none',
                  minHeight: isMobile ? 'auto' : 320,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  cursor: 'pointer', transition: 'background .3s ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = c.ruleSoft}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => navigate(`/auth/login?portal=${p.key}`)}
                >
                  <div>
                    <div style={{
                      fontFamily: MONO, fontSize: 10, color: c.faint, letterSpacing: '0.22em',
                      textTransform: 'uppercase', marginBottom: 18,
                    }}>0{i + 1}</div>
                    <h3 style={{
                      fontFamily: SERIF, fontSize: 36, fontWeight: 400, color: c.text,
                      letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1,
                    }}>{p.name}</h3>
                    <p style={{ fontSize: 13, color: c.muted, lineHeight: 1.6, marginBottom: 18 }}>
                      {p.subtitle}
                    </p>
                  </div>
                  <div>
                    <div style={{ height: 1, background: c.rule, marginBottom: 14 }} />
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    }}>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: c.faint, letterSpacing: '0.1em' }}>
                        {p.features}
                      </span>
                      <span style={{
                        fontFamily: SERIF, fontStyle: 'italic', color: c.accent, fontSize: 16,
                      }}>enter →</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <p style={{
              marginTop: 48, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
              fontSize: isMobile ? 18 : 24, color: c.muted, maxWidth: 760, lineHeight: 1.5,
            }}>
              Each portal renders only what the user's role permits. The same
              underlying schema; five different views, enforced server-side.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── III. PHILOSOPHY / PRINCIPLES ───────────────────────────────── */}
      <section style={{ padding: sectionPad, borderBottom: `1px solid ${c.rule}` }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <Reveal>
            <div style={eyebrow}>
              <span>§ {NUMERALS[2]} — Principles</span>
              <span style={eyebrowLine} />
              <span>How it was built</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{
              display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? 32 : 96, marginBottom: 72,
            }}>
              <h2 style={displayH2}>
                A short<br />
                <span style={italicAccent}>credo.</span>
              </h2>
              <div style={{ alignSelf: 'end' }}>
                <p style={{ ...body, fontSize: 17, paddingBottom: 8 }}>
                  Four convictions that shaped every decision in this codebase.
                  We list them so that the choices we made are legible —
                  and so that what we deliberately did <em style={{ fontFamily: SERIF }}>not</em> build is legible too.
                </p>
              </div>
            </div>
          </Reveal>

          {/* principle blocks */}
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: 0, borderTop: `2px solid ${c.text}`,
          }}>
            {[
              {
                n: 'I',
                title: 'Replace, do not augment.',
                body: 'A new layer on top of legacy systems is still legacy. Every workflow — attendance, fees, payroll — is rebuilt from scratch with one database of record.'
              },
              {
                n: 'II',
                title: 'Real-time, or it does not count.',
                body: 'A grade entered by faculty appears on the parent dashboard the same second. A leave approved by HR updates the payroll within the transaction.'
              },
              {
                n: 'III',
                title: 'Role boundaries, server-enforced.',
                body: 'The UI never decides who sees what. Spring Security checks every method invocation; the frontend simply requests and renders.'
              },
              {
                n: 'IV',
                title: 'No new accounts to maintain.',
                body: 'One identity per user — student, faculty, parent — with five portal views derived from a single role enum. Onboarding takes a CSV upload.'
              },
            ].map((p, i) => (
              <Reveal key={p.n} delay={i * 80}>
                <div style={{
                  padding: isMobile ? '36px 0' : '48px 32px',
                  borderRight: !isMobile && i % 2 === 0 ? `1px solid ${c.rule}` : 'none',
                  borderBottom: `1px solid ${c.rule}`,
                  minHeight: 220,
                }}>
                  <div style={{
                    fontFamily: SERIF, fontStyle: 'italic', fontSize: 56,
                    color: c.accent, lineHeight: 1, marginBottom: 16, fontWeight: 300,
                  }}>{p.n}</div>
                  <h3 style={{
                    fontFamily: SERIF, fontSize: isMobile ? 22 : 28, fontWeight: 400,
                    color: c.text, marginBottom: 14, letterSpacing: '-0.015em', lineHeight: 1.2,
                  }}>{p.title}</h3>
                  <p style={{ ...body, fontSize: 15, lineHeight: 1.7 }}>{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IV. ARCHITECTURE NOTE ───────────────────────────────────────── */}
      <section style={{ padding: sectionPad, background: c.bgSoft }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <Reveal>
            <div style={eyebrow}>
              <span>§ {NUMERALS[3]} — A note on architecture</span>
              <span style={eyebrowLine} />
              <span>For the curious</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{
              display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.5fr 1fr',
              gap: isMobile ? 32 : 80,
            }}>
              <div>
                <p style={{
                  fontFamily: SERIF, fontSize: isMobile ? 26 : 36, fontWeight: 400,
                  color: c.text, lineHeight: 1.2, letterSpacing: '-0.02em',
                }}>
                  Spring Boot 3 monolith.<br />
                  React 18 SPA.<br />
                  PostgreSQL 16 with thirteen schemas.<br />
                  <span style={italicAccent}>One container per role.</span>
                </p>
              </div>
              <div>
                <p style={{ ...body, fontSize: 16, marginBottom: 20 }}>
                  Domain-driven structure: fifteen domains (academics, attendance,
                  auth, employee, examination, feedback, finance, leave, lms,
                  notification, payroll, research, services, student, common),
                  each with its own controller, service, repository, model, and
                  DTO layers.
                </p>
                <p style={{ ...body, fontSize: 16, marginBottom: 28 }}>
                  Authentication runs through a custom JWT filter ordered ahead
                  of Spring's anonymous filter. Sessions auto-expire after fifteen
                  minutes of inactivity, enforced at the React context and the
                  refresh-token table.
                </p>

                <div style={{
                  display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                  gap: 20, paddingTop: 24, borderTop: `1px solid ${c.rule}`,
                }}>
                  {[
                    { k: 'Backend',  v: 'Spring Boot 3' },
                    { k: 'Frontend', v: 'React 18 + Vite' },
                    { k: 'Database', v: 'PostgreSQL 16' },
                    { k: 'Deploy',   v: 'Docker + nginx' },
                  ].map(t => (
                    <div key={t.k}>
                      <div style={{
                        fontFamily: MONO, fontSize: 10, color: c.faint,
                        letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6,
                      }}>{t.k}</div>
                      <div style={{ fontFamily: SERIF, fontSize: 17, color: c.text }}>
                        {t.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── V. VOICES ───────────────────────────────────────────────────── */}
      <section id="voices" style={{ padding: sectionPad, borderBottom: `1px solid ${c.rule}` }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <Reveal>
            <div style={eyebrow}>
              <span>§ {NUMERALS[4]} — Voices from the field</span>
              <span style={eyebrowLine} />
              <span>Edited for length</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 style={{ ...displayH2, marginBottom: 80 }}>
              What they<br />
              <span style={italicAccent}>actually said.</span>
            </h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 56 : 96 }}>
            {VOICES.map((v, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : (i % 2 ? '1fr 0.35fr' : '0.35fr 1fr'),
                  gap: isMobile ? 16 : 64, alignItems: 'baseline',
                }}>
                  {/* attribution column */}
                  <div style={{
                    order: !isMobile && i % 2 ? 2 : 1,
                    paddingTop: 8,
                  }}>
                    <div style={{
                      fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em',
                      color: c.faint, marginBottom: 8, textTransform: 'uppercase',
                    }}>— Voice {NUMERALS[i]}</div>
                    <div style={{
                      fontFamily: SERIF, fontSize: 20, color: c.text, fontWeight: 400,
                      marginBottom: 4, letterSpacing: '-0.01em',
                    }}>{v.name}</div>
                    <div style={{ fontSize: 13, color: c.muted, lineHeight: 1.5 }}>{v.role}</div>
                  </div>

                  {/* quote column */}
                  <div style={{ order: !isMobile && i % 2 ? 1 : 2 }}>
                    <span style={{
                      fontFamily: SERIF, fontSize: 64, color: c.accent, lineHeight: 0.4,
                      verticalAlign: '-0.6em', marginRight: 8, display: 'inline-block',
                    }}>“</span>
                    <p style={{
                      display: 'inline', fontFamily: SERIF, fontWeight: 400,
                      fontSize: isMobile ? 24 : 38, lineHeight: 1.3, letterSpacing: '-0.015em',
                      color: c.text,
                    }}>{v.text}<span style={{
                      fontFamily: SERIF, fontSize: 38, color: c.accent, lineHeight: 0.4,
                      verticalAlign: '-0.6em', marginLeft: 4,
                    }}>”</span></p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VI. INQUIRY / FAQ ──────────────────────────────────────────── */}
      <section id="faq" style={{ padding: sectionPad, background: c.bgSoft }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <Reveal>
            <div style={eyebrow}>
              <span>§ {NUMERALS[5]} — Inquiry</span>
              <span style={eyebrowLine} />
              <span>Questions, answered briefly</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{
              display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.6fr 1fr',
              gap: isMobile ? 40 : 96, marginBottom: 64,
            }}>
              <h2 style={displayH2}>
                On the record,<br />
                <span style={italicAccent}>briefly.</span>
              </h2>
              <p style={{ ...body, fontSize: 17, alignSelf: 'end' }}>
                The questions we hear most often, with answers that cite the code
                rather than the brochure.
              </p>
            </div>
          </Reveal>

          <div style={{ borderTop: `2px solid ${c.text}` }}>
            {FAQS.map((item, i) => (
              <Reveal key={i} delay={i * 50}>
                <div
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    borderBottom: `1px solid ${c.rule}`, cursor: 'pointer',
                    padding: isMobile ? '24px 0' : '32px 0', transition: 'all .35s ease',
                  }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '40px 1fr 40px' : '80px 1fr 60px',
                    gap: 16, alignItems: 'baseline',
                  }}>
                    <span style={{
                      fontFamily: MONO, fontSize: 12, color: c.faint, letterSpacing: '0.1em',
                    }}>0{i + 1}.</span>
                    <h3 style={{
                      fontFamily: SERIF, fontSize: isMobile ? 19 : 24, fontWeight: 400,
                      color: c.text, letterSpacing: '-0.01em', lineHeight: 1.3,
                    }}>{item.q}</h3>
                    <span style={{
                      fontFamily: SERIF, fontSize: 32, color: c.accent, textAlign: 'right',
                      lineHeight: 1, transition: 'transform .35s cubic-bezier(.7,0,.2,1)',
                      transform: openFaq === i ? 'rotate(45deg)' : 'none',
                    }}>+</span>
                  </div>
                  <div style={{
                    maxHeight: openFaq === i ? 300 : 0, overflow: 'hidden',
                    transition: 'max-height .55s cubic-bezier(.7,0,.2,1)',
                    paddingLeft: isMobile ? 56 : 96,
                  }}>
                    <p style={{
                      ...body, fontSize: 16, paddingTop: 16, maxWidth: 720,
                    }}>{item.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VII. CLOSING ─────────────────────────────────────────────────── */}
      <section style={{
        padding: isMobile ? '120px 24px' : '180px 64px',
        background: c.text, color: c.bg, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ maxWidth: maxW, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{
              fontFamily: MONO, fontSize: 11, letterSpacing: '0.22em',
              color: `${c.bg}99`, marginBottom: 28, textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <span>§ {NUMERALS[6]} — In closing</span>
              <span style={{ flex: 1, height: 1, background: `${c.bg}30` }} />
              <span>One last note</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 style={{
              fontFamily: SERIF, fontWeight: 300,
              fontSize: isMobile ? 'clamp(48px,12vw,72px)' : 'clamp(72px,9vw,160px)',
              lineHeight: 0.95, letterSpacing: '-0.04em', color: c.bg,
              marginBottom: 56, fontVariationSettings: '"opsz" 144',
            }}>
              Stop running<br />
              your campus<br />
              <span style={{ fontStyle: 'italic', color: c.accent2 }}>like it's 2008.</span>
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p style={{
              fontFamily: SERIF, fontWeight: 300, fontSize: isMobile ? 18 : 24,
              lineHeight: 1.5, color: `${c.bg}99`, maxWidth: 640, marginBottom: 56,
              fontStyle: 'italic',
            }}>
              Three minutes from sign-up to first attendance entry. A single
              database, five doors, one source of truth — and no more spreadsheets
              passed by email.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => navigate('/auth/login')}
                style={{
                  background: c.bg, color: c.text, border: 'none',
                  padding: '20px 40px', fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all .3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = c.accent2; e.currentTarget.style.color = c.text }}
                onMouseLeave={e => { e.currentTarget.style.background = c.bg; e.currentTarget.style.color = c.text }}
              >Begin Now →</button>
              <span style={{
                fontFamily: SERIF, fontStyle: 'italic', fontSize: 18, color: `${c.bg}80`,
              }}>or browse the index above</span>
            </div>
          </Reveal>

          {/* big numeral background */}
          <div style={{
            position: 'absolute', top: '50%', right: -40, transform: 'translateY(-50%)',
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300,
            fontSize: isMobile ? 200 : 480, lineHeight: 1, color: `${c.bg}08`,
            pointerEvents: 'none', userSelect: 'none',
          }}>VII</div>
        </div>
      </section>

      {/* ─── colophon / footer ──────────────────────────────────────────── */}
      <footer style={{ padding: isMobile ? '60px 24px 40px' : '80px 64px 56px', background: c.bg }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.8fr 1fr 1fr 1fr',
            gap: isMobile ? 40 : 64, paddingBottom: 56,
            borderBottom: `1px solid ${c.rule}`,
          }}>
            <div>
              <div style={{
                fontFamily: MONO, fontSize: 10, letterSpacing: '0.22em',
                color: c.faint, textTransform: 'uppercase', marginBottom: 18,
              }}>Colophon</div>
              <p style={{
                fontFamily: SERIF, fontSize: 22, fontWeight: 400,
                color: c.text, lineHeight: 1.4, marginBottom: 24, maxWidth: 460,
              }}>
                Set in <em>Fraunces</em> for display and <em>Inter</em> for body.
                Built in Chennai. Deployed worldwide.
              </p>
              <p style={{ fontSize: 13, color: c.muted, lineHeight: 1.7, maxWidth: 460 }}>
                College ERP is an independent platform built by a small team —
                no investor commitments, no vendor lock-in, no surprise
                renewals. Self-hostable on request.
              </p>
            </div>

            <div>
              <div style={{
                fontFamily: MONO, fontSize: 10, letterSpacing: '0.22em',
                color: c.faint, textTransform: 'uppercase', marginBottom: 18,
              }}>Navigate</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { l: 'The Index', id: 'index' },
                  { l: 'The Portals', id: 'portals' },
                  { l: 'Voices', id: 'voices' },
                  { l: 'Inquiry', id: 'faq' },
                ].map(i => (
                  <span key={i.id} onClick={() => scrollTo(i.id)}
                    className="underline-grow"
                    style={{ fontSize: 14, color: c.text }}>
                    {i.l}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: MONO, fontSize: 10, letterSpacing: '0.22em',
                color: c.faint, textTransform: 'uppercase', marginBottom: 18,
              }}>Portals</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {PORTALS.map(p => (
                  <span key={p.key}
                    onClick={() => navigate(`/auth/login?portal=${p.key}`)}
                    className="underline-grow"
                    style={{ fontSize: 14, color: c.text }}>
                    {p.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: MONO, fontSize: 10, letterSpacing: '0.22em',
                color: c.faint, textTransform: 'uppercase', marginBottom: 18,
              }}>Correspondence</div>
              <p style={{ fontSize: 14, color: c.text, marginBottom: 10, fontFamily: MONO }}>
                contact@collegeerp.in
              </p>
              <p style={{ fontSize: 13, color: c.muted, lineHeight: 1.6 }}>
                Chennai · Tamil Nadu<br />India · 600 001
              </p>
            </div>
          </div>

          <div style={{
            paddingTop: 28, display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'baseline',
            gap: 12,
          }}>
            <p style={{ fontFamily: MONO, fontSize: 11, color: c.faint, letterSpacing: '0.05em' }}>
              © MMXXVI · College Erp · All rights reserved
            </p>
            <p style={{
              fontFamily: SERIF, fontStyle: 'italic', fontSize: 14, color: c.muted,
            }}>
              Made by hand, in Chennai.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
