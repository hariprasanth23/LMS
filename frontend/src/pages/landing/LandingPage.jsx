import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/* ───────────────────── intersection / reveal ───────────────────── */
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
  const from = dir === 'left' ? 'translateX(-24px)'
             : dir === 'right' ? 'translateX(24px)'
             : dir === 'scale' ? 'scale(0.94)'
             : 'translateY(24px)'
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : from,
      transition: `opacity 1s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 1s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      ...style,
    }}>{children}</div>
  )
}

/* ───────────────────── data ───────────────────── */
const PILLARS = [
  { glyph: '✦', title: 'Excellence in Teaching',  body: 'A faculty drawn from the foremost institutions of India, committed to the long discipline of close instruction.' },
  { glyph: '❦', title: 'Distinction in Research', body: 'Active doctoral programmes in eight disciplines, with sustained guidance from registration to thesis defence.' },
  { glyph: '✺', title: 'Character of Service',    body: 'A philosophy of stewardship — towards students, colleagues, parents and the wider community we serve.' },
  { glyph: '✧', title: 'Modern Administration',   body: 'A unified platform replacing five fragmented systems — built so the institution can attend to what matters.' },
]

const FACULTIES = [
  { code: 'CSE', name: 'Computer Science & Engineering', deg: 'B.Tech · M.Tech · PhD', count: 480 },
  { code: 'ECE', name: 'Electronics & Communication',    deg: 'B.Tech · M.Tech · PhD', count: 360 },
  { code: 'MEC', name: 'Mechanical Engineering',          deg: 'B.Tech · M.Tech',      count: 320 },
  { code: 'CIV', name: 'Civil Engineering',               deg: 'B.Tech · PhD',         count: 240 },
  { code: 'MGT', name: 'School of Management',            deg: 'MBA · PhD',            count: 200 },
  { code: 'SCI', name: 'Basic & Applied Sciences',        deg: 'M.Sc · PhD',           count: 180 },
  { code: 'ART', name: 'Humanities & Languages',          deg: 'BA · MA · PhD',        count: 140 },
  { code: 'LAW', name: 'School of Legal Studies',         deg: 'LLB · LLM',            count: 120 },
]

const HALLS = [
  { key: 'student', name: 'Student Portal',   subtitle: 'Curriculum, examinations, finance, profile',     features: 50, color: '#b08a3c' },
  { key: 'staff',   name: 'Faculty Portal',   subtitle: 'Teaching, evaluation, attendance, research',     features: 20, color: '#7a8e6c' },
  { key: 'admin',   name: 'Administration',   subtitle: 'Operations, HR, payroll, departments',           features: 30, color: '#8b5e3c' },
  { key: 'parent',  name: 'Parent Portal',    subtitle: 'Progress, attendance, fees, communication',      features: 10, color: '#6e7d8e' },
  { key: 'alumni',  name: 'Alumni Network',   subtitle: 'Connections, achievements, mentorship',          features:  8, color: '#a07560' },
]

const VOICES = [
  { text: 'In thirty years of teaching, I have not known an administrative system that respected the rhythms of an academic department as this one does.', name: 'Dr. Priya Shankar',  role: 'Associate Professor, Department of Electronics', monogram: 'PS' },
  { text: 'My ward’s attendance, marks and fee receipts arrive in one place. I no longer make weekly telephone calls to the office.',                       name: 'Lakshmi Venkat',     role: 'Parent, Department of Computer Science',         monogram: 'LV' },
  { text: 'I check my timetable, exam schedule and CGPA without leaving a single window. It is a quieter way to study.',                                    name: 'Arjun Ravi',         role: 'B.Tech Computer Science, Semester Six',          monogram: 'AR' },
]

const NOTABLE = [
  { num: '4,200', label: 'Students Enrolled' },
  { num: '320',   label: 'Faculty Members' },
  { num: '08',    label: 'Schools & Departments' },
  { num: '40+',   label: 'Years of Service' },
]

const FAQS = [
  { q: 'How does each role have its own dashboard?',
    a: 'Five portals — Student, Faculty, Administration, Parent and Alumni — each present a tailored interface to the same underlying institutional database, with strict role boundaries enforced by Spring Security on every request.' },
  { q: 'How are student records and payments secured?',
    a: 'Every API endpoint requires a signed JSON Web Token. Sessions auto-expire after fifteen minutes of inactivity. Passwords are stored as bcrypt hashes; payments are processed over TLS with audited receipts.' },
  { q: 'Can existing institutional records be imported?',
    a: 'The administration portal supports bulk CSV import of employees and students, allowing migration from legacy spreadsheets or earlier systems in a single upload — typically completed within an afternoon.' },
  { q: 'Is parent access truly real-time?',
    a: 'Yes. The parent portal reflects attendance, marks and fee status the instant they are recorded by faculty or finance. There is no nightly batch — the underlying database is the single source of truth.' },
]

/* ───────────────────── crest ───────────────────── */
function Crest({ size = 64, color, accent }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <path d="M50 4 L92 14 L92 60 Q92 88 50 110 Q8 88 8 60 L8 14 Z" stroke={color} strokeWidth="1.4" fill="none" />
      <path d="M50 12 L84 20 L84 58 Q84 82 50 100 Q16 82 16 58 L16 20 Z" stroke={color} strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M28 50 Q40 46 50 50 Q60 46 72 50 L72 68 Q60 64 50 68 Q40 64 28 68 Z" stroke={color} strokeWidth="1.2" fill="none" />
      <line x1="50" y1="50" x2="50" y2="68" stroke={color} strokeWidth="0.8" />
      <text x="50" y="40" textAnchor="middle" fontSize="11" fill={accent} fontFamily="'Cormorant Garamond', serif" fontWeight="500">✦</text>
      <text x="50" y="84" textAnchor="middle" fontSize="9" fill={color} fontFamily="'Cormorant Garamond', serif" fontStyle="italic">MMXXV</text>
    </svg>
  )
}

function Ornament({ c }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '20px auto', color: c.gold }}>
      <span style={{ height: 1, width: 60, background: c.gold, opacity: 0.4 }} />
      <span style={{ fontSize: 14, letterSpacing: '0.3em' }}>❦</span>
      <span style={{ height: 1, width: 60, background: c.gold, opacity: 0.4 }} />
    </div>
  )
}

function ThemeToggle({ isDark, onToggle, c }) {
  return (
    <button onClick={onToggle} aria-label="Toggle theme"
      style={{
        background: 'transparent', border: `1px solid ${c.rule}`,
        padding: '7px 12px', cursor: 'pointer', fontFamily: 'inherit',
        fontSize: 14, color: c.muted, borderRadius: 2, transition: 'all .25s ease',
        lineHeight: 1,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = c.gold; e.currentTarget.style.color = c.gold }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = c.rule; e.currentTarget.style.color = c.muted }}
    >{isDark ? '☼' : '☾'}</button>
  )
}

/* ───────────────────── main ───────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768)
  const [openFaq, setOpenFaq] = useState(0)
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

  /* ── palette: collegiate navy + champagne gold ── */
  const c = isDark ? {
    bg:        '#0f1828',
    bgSoft:    '#16213a',
    bgPaper:   '#1a2840',
    text:      '#f4ecd6',
    muted:     'rgba(244,236,214,0.62)',
    faint:     'rgba(244,236,214,0.38)',
    rule:      'rgba(244,236,214,0.16)',
    ruleSoft:  'rgba(244,236,214,0.07)',
    gold:      '#d4a857',
    goldSoft:  '#b88c3c',
    accent:    '#d4a857',
    invertBg:  '#f4ecd6',
    invertText:'#0f1828',
  } : {
    bg:        '#f6efdb',
    bgSoft:    '#efe5c8',
    bgPaper:   '#fbf6e8',
    text:      '#1a2942',
    muted:     '#4d5468',
    faint:     '#7a7b85',
    rule:      'rgba(26,41,66,0.18)',
    ruleSoft:  'rgba(26,41,66,0.07)',
    gold:      '#a8762b',
    goldSoft:  '#c89752',
    accent:    '#7d2e2a',
    invertBg:  '#1a2942',
    invertText:'#f4ecd6',
  }

  const SERIF = "'Cormorant Garamond', 'EB Garamond', Georgia, 'Times New Roman', serif"
  const SANS  = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

  const sectionPad = isMobile ? '80px 24px' : '120px 64px'
  const maxW = 1200

  const smallcap = {
    fontFamily: SANS, fontSize: 11, fontWeight: 500,
    letterSpacing: '0.28em', textTransform: 'uppercase', color: c.gold,
  }

  const displayH2 = {
    fontFamily: SERIF, fontWeight: 400,
    fontSize: isMobile ? 'clamp(36px,8vw,48px)' : 'clamp(44px,5vw,68px)',
    lineHeight: 1.08, letterSpacing: '-0.015em', color: c.text,
  }

  const italicAcc = { fontStyle: 'italic', fontWeight: 400, color: c.accent }

  const body = {
    fontFamily: SANS, fontSize: 16, lineHeight: 1.75, color: c.muted, fontWeight: 400,
  }

  return (
    <div style={{
      background: c.bg, color: c.text, fontFamily: SANS,
      minHeight: '100vh', overflowX: 'hidden',
      transition: 'background .45s ease, color .45s ease',
    }}>

      {/* ── global css ─────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { background: ${c.bg}; color: ${c.text}; transition: background .45s ease, color .45s ease; }
        ::selection { background: ${c.gold}; color: ${c.bg}; }
        a { color: inherit; text-decoration: none; }

        @keyframes drift { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }

        .nav-link {
          position: relative; cursor: pointer; padding: 6px 2px;
          transition: color .25s ease;
        }
        .nav-link::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 0;
          height: 1px; background: ${c.gold}; transform: scaleX(0);
          transform-origin: right; transition: transform .35s cubic-bezier(.7,0,.2,1);
        }
        .nav-link:hover { color: ${c.gold}; }
        .nav-link:hover::after { transform: scaleX(1); transform-origin: left; }

        .btn-gold {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px; background: ${c.text}; color: ${c.bg};
          font-family: ${SANS}; font-size: 12px; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase;
          border: none; cursor: pointer; border-radius: 2px;
          transition: all .3s cubic-bezier(.7,0,.2,1);
          position: relative; overflow: hidden;
        }
        .btn-gold::before {
          content: ''; position: absolute; inset: 0;
          background: ${c.gold}; transform: scaleX(0); transform-origin: right;
          transition: transform .4s cubic-bezier(.7,0,.2,1); z-index: 0;
        }
        .btn-gold > span { position: relative; z-index: 1; }
        .btn-gold:hover::before { transform: scaleX(1); transform-origin: left; }
        .btn-gold:hover { color: ${isDark ? '#0f1828' : '#fff'}; }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 13px 28px; background: transparent; color: ${c.text};
          font-family: ${SANS}; font-size: 12px; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase;
          border: 1px solid ${c.text}; cursor: pointer; border-radius: 2px;
          transition: all .25s ease;
        }
        .btn-outline:hover { background: ${c.text}; color: ${c.bg}; }

        .hall-row { transition: background .35s ease; }
        .hall-row:hover { background: ${c.ruleSoft}; }
        .hall-row:hover .hall-arrow { transform: translateX(6px); color: ${c.gold}; }

        .faculty-card {
          transition: transform .35s cubic-bezier(.7,0,.2,1), border-color .35s ease, background .35s ease;
        }
        .faculty-card:hover {
          transform: translateY(-3px); border-color: ${c.gold};
          background: ${isDark ? 'rgba(212,168,87,0.04)' : 'rgba(168,118,43,0.04)'};
        }
        .faculty-card:hover .faculty-code { color: ${c.gold}; }

        .voice-card { transition: transform .35s ease, border-color .35s ease; }
        .voice-card:hover { transform: translateY(-4px); border-color: ${c.gold}; }

        .crest-glow {
          filter: drop-shadow(0 4px 24px ${isDark ? 'rgba(212,168,87,0.20)' : 'rgba(168,118,43,0.18)'});
        }
      `}</style>

      {/* ═════════ NAVIGATION ═════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: `${c.bg}f5`, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${c.rule}`,
        padding: isMobile ? '14px 24px' : '18px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Crest size={32} color={c.text} accent={c.gold} />
          <div>
            <div style={{
              fontFamily: SERIF, fontSize: 20, fontWeight: 500, color: c.text,
              letterSpacing: '-0.01em', lineHeight: 1,
            }}>
              College <span style={{ fontStyle: 'italic', color: c.gold }}>Erp</span>
            </div>
            <div style={{
              fontSize: 9, letterSpacing: '0.22em', color: c.faint,
              textTransform: 'uppercase', marginTop: 3,
            }}>Est. MMXXV · Chennai</div>
          </div>
        </div>

        {!isMobile && (
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {[
              { l: 'About',     id: 'pillars' },
              { l: 'Faculties', id: 'faculties' },
              { l: 'Halls',     id: 'halls' },
              { l: 'Testimony', id: 'voices' },
              { l: 'Inquiry',   id: 'faq' },
            ].map(item => (
              <span key={item.id} onClick={() => scrollTo(item.id)}
                className="nav-link"
                style={{ fontSize: 13, color: c.text, fontWeight: 500 }}>
                {item.l}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} c={c} />
          <button onClick={() => navigate('/auth/login')} className="btn-gold"
            style={{ padding: '10px 20px', fontSize: 11 }}>
            <span>Sign In</span>
          </button>
        </div>
      </nav>

      {/* ═════════ HERO ═════════ */}
      <section style={{
        background: c.bgPaper, padding: isMobile ? '60px 24px 90px' : '90px 64px 140px',
        position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${c.rule}`,
      }}>
        <div style={{
          position: 'absolute', top: 30, left: 30, fontFamily: SERIF,
          fontSize: 40, color: c.gold, opacity: 0.18, lineHeight: 1, userSelect: 'none',
        }}>❦</div>
        <div style={{
          position: 'absolute', bottom: 30, right: 30, fontFamily: SERIF,
          fontSize: 40, color: c.gold, opacity: 0.18, lineHeight: 1, userSelect: 'none',
        }}>❦</div>

        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Reveal>
            <div className="crest-glow" style={{
              display: 'flex', justifyContent: 'center', marginBottom: 32,
              animation: 'drift 6s ease-in-out infinite',
            }}>
              <Crest size={isMobile ? 70 : 96} color={c.text} accent={c.gold} />
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div style={{ ...smallcap, marginBottom: 22 }}>
              <span style={{ display: 'inline-block', margin: '0 14px', color: c.gold }}>✦</span>
              An Institution for the Whole Campus
              <span style={{ display: 'inline-block', margin: '0 14px', color: c.gold }}>✦</span>
            </div>
          </Reveal>

          <Reveal delay={250}>
            <h1 style={{
              fontFamily: SERIF, fontWeight: 400,
              fontSize: isMobile ? 'clamp(46px,11vw,68px)' : 'clamp(68px,7vw,108px)',
              lineHeight: 1.02, letterSpacing: '-0.025em',
              color: c.text, marginBottom: 28,
            }}>
              The campus, <br />
              <span style={italicAcc}>at one address.</span>
            </h1>
          </Reveal>

          <Reveal delay={350}>
            <p style={{
              fontFamily: SERIF, fontSize: isMobile ? 18 : 22, fontWeight: 300,
              fontStyle: 'italic', color: c.muted, lineHeight: 1.55,
              maxWidth: 640, margin: '0 auto 18px',
            }}>
              A platform for the modern college — uniting students, faculty,
              administration, parents and alumni in a single, dignified place
              of record.
            </p>
          </Reveal>

          <Reveal delay={420}><Ornament c={c} /></Reveal>

          <Reveal delay={500}>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
              <button className="btn-gold" onClick={() => navigate('/auth/login')}>
                <span>Enter the Halls</span>
                <span style={{ position: 'relative', zIndex: 1 }}>→</span>
              </button>
              <button className="btn-outline" onClick={() => scrollTo('pillars')}>
                Discover More
              </button>
            </div>
          </Reveal>

          <Reveal delay={650}>
            <div style={{
              marginTop: isMobile ? 64 : 96, paddingTop: 36,
              borderTop: `1px solid ${c.rule}`,
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: isMobile ? 28 : 24,
            }}>
              {NOTABLE.map((s, i) => (
                <div key={s.label} style={{
                  textAlign: 'center',
                  borderRight: !isMobile && i < NOTABLE.length - 1 ? `1px solid ${c.rule}` : 'none',
                }}>
                  <div style={{
                    fontFamily: SERIF, fontSize: isMobile ? 38 : 48, fontWeight: 400,
                    color: c.text, lineHeight: 1, marginBottom: 8, letterSpacing: '-0.02em',
                  }}>{s.num}</div>
                  <div style={{
                    fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: c.faint, fontWeight: 500,
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═════════ MOTTO TICKER ═════════ */}
      <div style={{ background: c.text, color: c.bg, padding: '18px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 60s linear infinite' }}>
          {Array(2).fill(0).map((_, dup) => (
            <div key={dup} style={{ display: 'flex', gap: 56, paddingRight: 56, flexShrink: 0 }}>
              {[
                'Academic Records', 'Curriculum Management', 'Examination Schedules',
                'Marks & Grades', 'Online Fees', 'Wallet Top-Up', 'Library Services',
                'Digital Assignments', 'Bonafide Certificates', 'eSanad Requests',
                'Research Portal', 'Thesis Submission', 'Project Tracking',
                'Employee Management', 'Leave Approvals', 'Payroll Automation',
                'Parent Dashboard', 'Alumni Network', 'Smart Notifications',
              ].map(item => (
                <span key={item} style={{
                  fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
                  fontSize: 22, display: 'flex', alignItems: 'center', gap: 26,
                }}>
                  {item}
                  <span style={{ color: c.gold, fontSize: 14 }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═════════ PILLARS ═════════ */}
      <section id="pillars" style={{ padding: sectionPad, borderBottom: `1px solid ${c.rule}` }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ ...smallcap, marginBottom: 18 }}>The Four Pillars</div>
              <h2 style={displayH2}>
                A philosophy of <span style={italicAcc}>quiet excellence.</span>
              </h2>
              <Ornament c={c} />
              <p style={{
                ...body, fontSize: isMobile ? 16 : 18, maxWidth: 620,
                margin: '12px auto 0', fontStyle: 'italic', fontFamily: SERIF,
                fontWeight: 300, lineHeight: 1.6,
              }}>
                Four principles that guide every workflow, every screen, and
                every line of code in this institution’s platform.
              </p>
            </div>
          </Reveal>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: 0,
            borderTop: `1px solid ${c.gold}`, borderBottom: `1px solid ${c.gold}`,
          }}>
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <div style={{
                  padding: isMobile ? '36px 8px' : '48px 28px',
                  textAlign: 'center', minHeight: 280,
                  borderRight: !isMobile && i < 3 ? `1px solid ${c.rule}` : 'none',
                  borderBottom: isMobile && i < 3 ? `1px solid ${c.rule}` : 'none',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
                }}>
                  <div style={{ fontFamily: SERIF, fontSize: 44, color: c.gold, marginBottom: 18, lineHeight: 1 }}>{p.glyph}</div>
                  <div style={{
                    fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase',
                    color: c.faint, marginBottom: 14, fontWeight: 500,
                  }}>{['I','II','III','IV'][i]}</div>
                  <h3 style={{
                    fontFamily: SERIF, fontSize: isMobile ? 22 : 26, fontWeight: 500,
                    color: c.text, lineHeight: 1.2, marginBottom: 14, letterSpacing: '-0.01em',
                  }}>{p.title}</h3>
                  <p style={{ ...body, fontSize: 14, lineHeight: 1.7 }}>{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ FACULTIES ═════════ */}
      <section id="faculties" style={{ padding: sectionPad, background: c.bgSoft }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <Reveal>
            <div style={{
              display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? 32 : 64, marginBottom: 60, alignItems: 'end',
            }}>
              <div>
                <div style={{ ...smallcap, marginBottom: 16 }}>Schools &amp; Faculties</div>
                <h2 style={displayH2}>
                  Eight schools,<br />
                  <span style={italicAcc}>one register.</span>
                </h2>
              </div>
              <p style={{ ...body, fontSize: isMobile ? 16 : 17, paddingBottom: 10 }}>
                The platform is built to serve any number of academic schools
                within a single institution — each with its own curriculum,
                faculty, students and examinations, unified through one register
                of record.
              </p>
            </div>
          </Reveal>

          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: 16,
          }}>
            {FACULTIES.map((f, i) => (
              <Reveal key={f.code} delay={i * 60}>
                <div className="faculty-card" style={{
                  background: c.bg, border: `1px solid ${c.rule}`,
                  padding: '26px 22px', minHeight: 180, borderRadius: 2,
                  display: 'flex', flexDirection: 'column', cursor: 'default',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    marginBottom: 16,
                  }}>
                    <span className="faculty-code" style={{
                      fontFamily: SERIF, fontSize: 20, fontWeight: 500, color: c.text,
                      letterSpacing: '0.05em', transition: 'color .25s ease',
                    }}>{f.code}</span>
                    <span style={{
                      fontSize: 10, letterSpacing: '0.18em', color: c.faint, textTransform: 'uppercase',
                    }}>0{i + 1}</span>
                  </div>
                  <h3 style={{
                    fontFamily: SERIF, fontSize: 19, fontWeight: 500, color: c.text,
                    lineHeight: 1.25, marginBottom: 14, letterSpacing: '-0.005em',
                  }}>{f.name}</h3>
                  <div style={{ fontSize: 12, color: c.muted, lineHeight: 1.6, marginBottom: 'auto' }}>{f.deg}</div>
                  <div style={{
                    marginTop: 18, paddingTop: 14, borderTop: `1px solid ${c.ruleSoft}`,
                    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 400, color: c.gold }}>{f.count}</span>
                    <span style={{
                      fontSize: 10, letterSpacing: '0.18em', color: c.faint, textTransform: 'uppercase',
                    }}>students</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ HALLS ═════════ */}
      <section id="halls" style={{ padding: sectionPad, borderBottom: `1px solid ${c.rule}` }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ ...smallcap, marginBottom: 18 }}>The Five Halls</div>
              <h2 style={displayH2}>
                Five doors, <span style={italicAcc}>one institution.</span>
              </h2>
              <Ornament c={c} />
              <p style={{ ...body, fontSize: isMobile ? 15 : 17, maxWidth: 580, margin: '12px auto 0' }}>
                Each member of the campus enters through their own threshold —
                a hall built for their role, their needs, and their daily rhythm.
              </p>
            </div>
          </Reveal>

          <div style={{ borderTop: `1px solid ${c.gold}` }}>
            {HALLS.map((h, i) => (
              <Reveal key={h.key} delay={i * 70}>
                <div className="hall-row"
                  onClick={() => navigate(`/auth/login?portal=${h.key}`)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '40px 1fr 30px' : '70px 1.5fr 3fr 130px 40px',
                    gap: 18, alignItems: 'center',
                    padding: isMobile ? '24px 12px' : '32px 24px',
                    borderBottom: `1px solid ${c.rule}`, cursor: 'pointer',
                  }}>
                  <span style={{
                    fontFamily: SERIF, fontStyle: 'italic', fontSize: 22, color: h.color, fontWeight: 400,
                  }}>{['I','II','III','IV','V'][i]}</span>
                  <span style={{
                    fontFamily: SERIF, fontSize: isMobile ? 22 : 30, fontWeight: 500,
                    color: c.text, letterSpacing: '-0.01em',
                  }}>{h.name}</span>
                  {!isMobile && (
                    <span style={{ fontSize: 14, color: c.muted, lineHeight: 1.5 }}>{h.subtitle}</span>
                  )}
                  {!isMobile && (
                    <span style={{
                      fontSize: 11, color: c.faint, letterSpacing: '0.18em',
                      textTransform: 'uppercase', textAlign: 'right',
                    }}>{h.features} features</span>
                  )}
                  <span className="hall-arrow" style={{
                    fontSize: 22, color: c.muted, textAlign: 'right',
                    transition: 'transform .35s ease, color .35s ease', fontFamily: SERIF,
                  }}>→</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <div style={{
              marginTop: 48, textAlign: 'center',
              fontFamily: SERIF, fontStyle: 'italic', fontSize: 18,
              color: c.muted, fontWeight: 300,
            }}>
              One database. One signing key. <span style={{ color: c.gold }}>Five entrances.</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═════════ VOICES ═════════ */}
      <section id="voices" style={{ padding: sectionPad, background: c.bgSoft }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ ...smallcap, marginBottom: 18 }}>Testimony</div>
              <h2 style={displayH2}>
                Voices from <span style={italicAcc}>the campus.</span>
              </h2>
            </div>
          </Reveal>

          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24,
          }}>
            {VOICES.map((v, i) => (
              <Reveal key={v.name} delay={i * 100}>
                <div className="voice-card" style={{
                  background: c.bg, border: `1px solid ${c.rule}`,
                  padding: '32px 28px', borderRadius: 2,
                  height: '100%', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{
                    fontFamily: SERIF, fontSize: 62, color: c.gold,
                    lineHeight: 0.6, height: 22, marginBottom: 18,
                  }}>“</div>
                  <p style={{
                    fontFamily: SERIF, fontSize: isMobile ? 17 : 18, fontWeight: 400,
                    color: c.text, lineHeight: 1.55, marginBottom: 28, flex: 1, fontStyle: 'italic',
                  }}>{v.text}</p>
                  <div style={{
                    paddingTop: 22, borderTop: `1px solid ${c.ruleSoft}`,
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      border: `1px solid ${c.gold}`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontFamily: SERIF, fontSize: 14, color: c.gold,
                      fontWeight: 500, letterSpacing: '0.05em', flexShrink: 0,
                    }}>{v.monogram}</div>
                    <div>
                      <div style={{
                        fontFamily: SERIF, fontSize: 16, fontWeight: 500, color: c.text, marginBottom: 2,
                      }}>{v.name}</div>
                      <div style={{ fontSize: 11, color: c.faint, letterSpacing: '0.04em' }}>{v.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ INQUIRY ═════════ */}
      <section id="faq" style={{ padding: sectionPad, borderBottom: `1px solid ${c.rule}` }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ ...smallcap, marginBottom: 16 }}>Inquiry</div>
              <h2 style={displayH2}>
                Matters of <span style={italicAcc}>frequent inquiry.</span>
              </h2>
              <Ornament c={c} />
            </div>
          </Reveal>

          <div style={{ borderTop: `1px solid ${c.gold}` }}>
            {FAQS.map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    borderBottom: `1px solid ${c.rule}`, cursor: 'pointer', padding: '26px 4px',
                  }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '36px 1fr 36px' : '60px 1fr 50px',
                    gap: 16, alignItems: 'baseline',
                  }}>
                    <span style={{
                      fontFamily: SERIF, fontStyle: 'italic', fontSize: 18,
                      color: c.gold, fontWeight: 400,
                    }}>{['I','II','III','IV'][i]}</span>
                    <h3 style={{
                      fontFamily: SERIF, fontSize: isMobile ? 19 : 22, fontWeight: 500,
                      color: c.text, lineHeight: 1.3, letterSpacing: '-0.005em',
                    }}>{item.q}</h3>
                    <span style={{
                      fontFamily: SERIF, fontSize: 30, color: c.gold,
                      textAlign: 'right', lineHeight: 1, fontWeight: 300,
                      transition: 'transform .35s cubic-bezier(.7,0,.2,1)',
                      transform: openFaq === i ? 'rotate(45deg)' : 'none',
                    }}>+</span>
                  </div>
                  <div style={{
                    maxHeight: openFaq === i ? 320 : 0, overflow: 'hidden',
                    transition: 'max-height .55s cubic-bezier(.7,0,.2,1)',
                    paddingLeft: isMobile ? 52 : 76,
                  }}>
                    <p style={{ ...body, fontSize: 16, paddingTop: 16, lineHeight: 1.75, maxWidth: 720 }}>{item.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ APPLY / CTA ═════════ */}
      <section style={{
        padding: isMobile ? '100px 24px' : '160px 64px',
        background: c.invertBg, color: c.invertText,
        position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', top: 28, left: 28, fontFamily: SERIF, fontSize: 36, color: c.gold, opacity: 0.5 }}>❦</div>
        <div style={{ position: 'absolute', top: 28, right: 28, fontFamily: SERIF, fontSize: 36, color: c.gold, opacity: 0.5 }}>❦</div>
        <div style={{ position: 'absolute', bottom: 28, left: 28, fontFamily: SERIF, fontSize: 36, color: c.gold, opacity: 0.5 }}>❦</div>
        <div style={{ position: 'absolute', bottom: 28, right: 28, fontFamily: SERIF, fontSize: 36, color: c.gold, opacity: 0.5 }}>❦</div>

        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
          <Reveal>
            <div style={{
              display: 'flex', justifyContent: 'center', marginBottom: 28,
              animation: 'drift 6s ease-in-out infinite',
            }}>
              <Crest size={isMobile ? 64 : 84} color={c.invertText} accent={c.gold} />
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div style={{ ...smallcap, marginBottom: 22, color: c.gold }}>Begin Your Tenure</div>
          </Reveal>

          <Reveal delay={250}>
            <h2 style={{
              fontFamily: SERIF, fontWeight: 400,
              fontSize: isMobile ? 'clamp(40px,10vw,56px)' : 'clamp(56px,6vw,84px)',
              lineHeight: 1.05, letterSpacing: '-0.025em',
              color: c.invertText, marginBottom: 28,
            }}>
              The doors are <span style={{ fontStyle: 'italic', color: c.gold }}>open.</span>
            </h2>
          </Reveal>

          <Reveal delay={350}>
            <p style={{
              fontFamily: SERIF, fontSize: isMobile ? 18 : 22, fontWeight: 300,
              fontStyle: 'italic', lineHeight: 1.5, color: `${c.invertText}aa`,
              marginBottom: 48, maxWidth: 560, margin: '0 auto 48px',
            }}>
              Five portals, eight departments, fifteen modules — bound in one
              register of record. Step in.
            </p>
          </Reveal>

          <Reveal delay={450}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
              <button onClick={() => navigate('/auth/login')}
                style={{
                  padding: '17px 36px', background: c.gold, color: c.invertBg,
                  border: 'none', fontFamily: SANS, fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer',
                  borderRadius: 2, transition: 'all .3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = c.invertText; e.currentTarget.style.color = c.invertBg }}
                onMouseLeave={e => { e.currentTarget.style.background = c.gold; e.currentTarget.style.color = c.invertBg }}
              >Enter the Institution →</button>
              <button onClick={() => scrollTo('halls')}
                style={{
                  padding: '16px 32px', background: 'transparent', color: c.invertText,
                  border: `1px solid ${c.invertText}`, fontFamily: SANS, fontSize: 12,
                  fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase',
                  cursor: 'pointer', borderRadius: 2,
                }}>Choose a Portal</button>
            </div>
          </Reveal>

          <Reveal delay={550}>
            <div style={{
              display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap',
              paddingTop: 32, borderTop: `1px solid ${c.invertText}22`,
            }}>
              {[
                { l: 'Secure', sym: '✦' },
                { l: 'Real-Time', sym: '✺' },
                { l: 'Role-Bound', sym: '❦' },
                { l: 'Self-Hostable', sym: '✧' },
              ].map(item => (
                <div key={item.l} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: `${c.invertText}88`, fontSize: 12,
                  letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
                }}>
                  <span style={{ color: c.gold, fontSize: 14 }}>{item.sym}</span>
                  {item.l}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═════════ FOOTER ═════════ */}
      <footer style={{
        background: c.bg, padding: isMobile ? '64px 24px 40px' : '88px 64px 48px',
      }}>
        <div style={{ maxWidth: maxW, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Crest size={48} color={c.text} accent={c.gold} />
            </div>
            <div style={{
              fontFamily: SERIF, fontSize: 24, fontWeight: 500,
              color: c.text, marginTop: 18, letterSpacing: '-0.01em',
            }}>
              College <span style={{ fontStyle: 'italic', color: c.gold }}>Erp</span>
            </div>
            <div style={{ ...smallcap, color: c.faint, marginTop: 6 }}>
              Est. MMXXV · Chennai · Tamil Nadu
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? 36 : 48,
            paddingTop: 40, paddingBottom: 40,
            borderTop: `1px solid ${c.rule}`, borderBottom: `1px solid ${c.rule}`,
          }}>
            <div>
              <div style={{ ...smallcap, marginBottom: 18, color: c.muted }}>The Platform</div>
              <p style={{ ...body, fontSize: 13, lineHeight: 1.75 }}>
                A unified administration system for the modern campus — built
                for institutions that value clarity, dignity, and the long discipline
                of good record-keeping.
              </p>
            </div>

            <div>
              <div style={{ ...smallcap, marginBottom: 18, color: c.muted }}>Navigate</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { l: 'About', id: 'pillars' },
                  { l: 'Faculties', id: 'faculties' },
                  { l: 'Halls', id: 'halls' },
                  { l: 'Testimony', id: 'voices' },
                  { l: 'Inquiry', id: 'faq' },
                ].map(i => (
                  <span key={i.id} onClick={() => scrollTo(i.id)}
                    className="nav-link"
                    style={{ fontSize: 14, color: c.text }}>{i.l}</span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ ...smallcap, marginBottom: 18, color: c.muted }}>The Halls</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {HALLS.map(h => (
                  <span key={h.key}
                    onClick={() => navigate(`/auth/login?portal=${h.key}`)}
                    className="nav-link"
                    style={{ fontSize: 14, color: c.text }}>{h.name}</span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ ...smallcap, marginBottom: 18, color: c.muted }}>Correspondence</div>
              <p style={{ fontSize: 14, color: c.text, marginBottom: 10, fontFamily: SERIF, letterSpacing: '0.01em' }}>
                contact@collegeerp.in
              </p>
              <p style={{ fontSize: 13, color: c.muted, lineHeight: 1.7 }}>
                Chennai, Tamil Nadu<br />India · 600 001
              </p>
            </div>
          </div>

          <div style={{
            paddingTop: 32, display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'baseline',
            gap: 12,
          }}>
            <p style={{ fontFamily: SERIF, fontSize: 13, color: c.faint, letterSpacing: '0.05em' }}>
              © MMXXVI · College Erp · All rights reserved
            </p>
            <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 14, color: c.muted }}>
              Per studium, per diligentiam.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
