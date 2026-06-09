import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  MdSchool, MdBadge, MdPeople, MdStar, MdAdminPanelSettings,
  MdVisibility, MdVisibilityOff, MdArrowForward, MdShield,
  MdCheck, MdLock, MdAutoAwesome,
} from 'react-icons/md'

// ── Star field ─────────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 1.6 + 0.5,
  delay: Math.random() * 6, dur: Math.random() * 3 + 2,
}))

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return isMobile
}

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

const PORTALS = [
  { key: 'admin',   label: 'Admin',   icon: MdAdminPanelSettings, color: '#f87171', bg: 'rgba(239,68,68,0.14)',   glow: 'rgba(239,68,68,0.3)',   desc: 'System administration',  idLabel: 'Admin ID / Email',    badge: 'Full Access' },
  { key: 'student', label: 'Student', icon: MdSchool,             color: '#60a5fa', bg: 'rgba(59,130,246,0.14)',  glow: 'rgba(59,130,246,0.3)',  desc: 'Academic portal',        idLabel: 'Roll Number / Email', badge: null },
  { key: 'staff',   label: 'Staff',   icon: MdBadge,              color: '#c084fc', bg: 'rgba(168,85,247,0.14)', glow: 'rgba(168,85,247,0.3)',  desc: 'Faculty & teaching',     idLabel: 'Employee ID / Email', badge: null },
  { key: 'parent',  label: 'Parent',  icon: MdPeople,             color: '#fbbf24', bg: 'rgba(245,158,11,0.14)', glow: 'rgba(245,158,11,0.3)',  desc: "Ward's progress",        idLabel: 'Phone / Email',       badge: null },
  { key: 'alumni',  label: 'Alumni',  icon: MdStar,               color: '#34d399', bg: 'rgba(16,185,129,0.14)', glow: 'rgba(16,185,129,0.3)',  desc: 'Alumni network',         idLabel: 'Alumni ID / Email',   badge: null },
]

const FEATURES = [
  { text: 'Academic management & attendance', icon: MdSchool },
  { text: 'Exams, grades & online tests', icon: MdCheck },
  { text: 'Fee payments & finance portal', icon: MdLock },
  { text: 'PhD research & thesis tracking', icon: MdAutoAwesome },
  { text: 'Employee, leave & payroll system', icon: MdShield },
]

const DEMO_ACCOUNTS = [
  { role: 'Admin',   email: 'demo@college.com',   color: '#f87171' },
  { role: 'Student', email: 'student@demo.com',   color: '#60a5fa' },
  { role: 'Faculty', email: 'staff@demo.com',     color: '#c084fc' },
  { role: 'Parent',  email: 'parent@demo.com',    color: '#fbbf24' },
  { role: 'Alumni',  email: 'alumni@demo.com',    color: '#34d399' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isMobile = useIsMobile()
  const [selectedPortal, setSelectedPortal] = useState(null)
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [idFocus, setIdFocus] = useState(false)
  const [pwFocus, setPwFocus] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [featVisible, setFeatVisible] = useState(false)
  const featRef = useRef(null)

  useEffect(() => {
    const p = searchParams.get('portal')
    if (p && PORTALS.some(x => x.key === p)) setSelectedPortal(p)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setFeatVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  const handlePortalSelect = (key) => {
    setSelectedPortal(key)
    setForm({ identifier: '', password: '' })
    setShowPassword(false)
  }

  const activePortal = PORTALS.find(p => p.key === selectedPortal)
  const activeColor  = activePortal?.color ?? '#818cf8'
  const activeBg     = activePortal?.bg    ?? 'rgba(129,140,248,0.12)'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPortal) { toast.error('Please select a portal'); return }
    if (!form.identifier || !form.password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      await login(form.identifier, form.password, selectedPortal)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  // ── CSS ──────────────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #04081a; }

    @keyframes aurora       { 0%,100%{ transform:translate(-50%,-50%) rotate(0deg) scale(1); opacity:.18 } 33%{ transform:translate(-50%,-50%) rotate(120deg) scale(1.1); opacity:.26 } 66%{ transform:translate(-50%,-50%) rotate(240deg) scale(.95); opacity:.2 } }
    @keyframes starTwinkle  { 0%,100%{ opacity:0 } 50%{ opacity:.85 } }
    @keyframes spinSlow     { from{ transform:rotate(0deg) } to{ transform:rotate(360deg) } }
    @keyframes floatY       { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-10px) } }
    @keyframes floatBadge   { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-6px) } }
    @keyframes pageIn       { from{ opacity:0; transform:translateY(16px) } to{ opacity:1; transform:translateY(0) } }
    @keyframes slideUp      { from{ opacity:0; transform:translateY(20px) } to{ opacity:1; transform:translateY(0) } }
    @keyframes shimmer      { from{ left:-100% } to{ left:160% } }
    @keyframes pulse        { 0%,100%{ opacity:.6 } 50%{ opacity:1 } }
    @keyframes ripple       { 0%{ transform:scale(.8);opacity:1 } 100%{ transform:scale(2.4);opacity:0 } }
    @keyframes gradFlow     { 0%,100%{ background-position:0% 50% } 50%{ background-position:100% 50% } }
    @keyframes featIn       { from{ opacity:0; transform:translateX(-12px) } to{ opacity:1; transform:translateX(0) } }
    @keyframes spin360      { from{ transform:rotate(0deg) } to{ transform:rotate(360deg) } }
    @keyframes loadSpin     { from{ transform:rotate(0deg) } to{ transform:rotate(360deg) } }
    @keyframes portalPop    { 0%{ transform:scale(.94);opacity:0 } 100%{ transform:scale(1);opacity:1 } }

    .aurora-bg {
      position:absolute; width:140%; height:140%; top:50%; left:50%;
      background: conic-gradient(from 0deg at 50% 50%, rgba(99,102,241,.28) 0deg, rgba(139,92,246,.18) 60deg, rgba(16,185,129,.13) 120deg, rgba(14,165,233,.1) 180deg, rgba(236,72,153,.08) 240deg, rgba(99,102,241,.2) 300deg, rgba(99,102,241,.28) 360deg);
      filter:blur(80px); animation:aurora 22s linear infinite; pointer-events:none;
    }
    .grid-bg {
      background-image: linear-gradient(rgba(99,102,241,.05) 1px,transparent 1px), linear-gradient(90deg,rgba(99,102,241,.05) 1px,transparent 1px);
      background-size:48px 48px;
    }
    .portal-btn { transition: all .22s cubic-bezier(.22,1,.36,1); cursor:pointer; font-family:inherit; will-change:transform; }
    .portal-btn:hover { transform:translateY(-2px); }
    .portal-btn-selected { transform:translateY(-2px) scale(1.01) !important; }
    .input-dark {
      width:100%; background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.12);
      borderRadius:12px; padding:13px 16px; font-size:14px; color:#fff; font-family:inherit;
      outline:none; transition:border-color .2s, box-shadow .2s; box-sizing:border-box;
    }
    .input-dark::placeholder { color:rgba(255,255,255,0.28); }
    .btn-submit {
      position:relative; overflow:hidden; border:none; cursor:pointer; font-family:inherit;
      transition:all .22s cubic-bezier(.22,1,.36,1); will-change:transform;
    }
    .btn-submit::after {
      content:''; position:absolute; top:0; left:-100%; width:55%; height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);
      transform:skewX(-20deg);
    }
    .btn-submit:hover::after { animation:shimmer .65s ease forwards; }
    .btn-submit:hover:not(:disabled) { transform:translateY(-2px); filter:brightness(1.08); }
    .demo-toggle { transition:all .2s; cursor:pointer; font-family:inherit; }
    .demo-toggle:hover { opacity:.8; }
    .back-link { transition:color .15s; }
    .back-link:hover { color:#a78bfa !important; }
    .noise-overlay {
      position:absolute; inset:-50%; width:200%; height:200%; pointer-events:none;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      opacity:.022;
    }
  `

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: FONT, minHeight: '100vh', display: 'flex', background: '#04081a', color: '#f1f5f9', overflowX: 'hidden' }}>
      <style>{css}</style>

      {/* ── Left Panel ──────────────────────────────────────────────────────── */}
      {!isMobile && (
        <div style={{ width: '44%', flexShrink: 0, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 52px', background: 'linear-gradient(160deg,#04081a 0%,#0a0a2e 50%,#04081a 100%)' }}>
          <div className="aurora-bg" />
          <div className="noise-overlay" />
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .35 }} />

          {/* Stars */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {STARS.map(s => (
              <div key={s.id} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: '50%', background: s.id % 3 === 0 ? '#a78bfa' : s.id % 3 === 1 ? '#34d399' : '#fff', opacity: 0, animation: `starTwinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
            ))}
          </div>

          {/* Rotating rings */}
          <div style={{ position: 'absolute', top: '20%', right: '-8%', width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(99,102,241,0.12)', animation: 'spinSlow 35s linear infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '16%', right: '-12%', width: 400, height: 400, borderRadius: '50%', border: '1px dashed rgba(139,92,246,0.07)', animation: 'spinSlow 55s linear infinite reverse', pointerEvents: 'none' }} />

          {/* Logo */}
          <div style={{ position: 'relative', zIndex: 1, animation: 'pageIn .6s ease both' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(99,102,241,0.5)', flexShrink: 0 }}>
                <MdSchool style={{ fontSize: 24, color: '#fff' }} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-.3px' }}>College<span style={{ color: '#a78bfa' }}>ERP</span></div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Campus Management Platform</div>
              </div>
            </Link>
          </div>

          {/* Main copy */}
          <div style={{ position: 'relative', zIndex: 1, animation: 'pageIn .7s ease .1s both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.28)', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
              <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981', opacity: .6, animation: 'ripple 2s ease-out infinite' }} />
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', position: 'relative', zIndex: 1 }} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.82)' }}>All portals live · 5 role dashboards</span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px,3.5vw,48px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 14 }}>
              Welcome<br />
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>back.</span>
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.48)', lineHeight: 1.75, marginBottom: 40, maxWidth: 360 }}>
              Your campus, your portal. Sign in to access every academic, financial and administrative tool in one place.
            </p>

            {/* Animated feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FEATURES.map((feat, i) => {
                const Icon = feat.icon
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: featVisible ? 1 : 0, transform: featVisible ? 'none' : 'translateX(-12px)', transition: `opacity .5s ease ${i * 100 + 200}ms, transform .5s ease ${i * 100 + 200}ms` }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon style={{ fontSize: 14, color: '#a78bfa' }} />
                    </div>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{feat.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom security badges */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 8, flexWrap: 'wrap', animation: 'pageIn .7s ease .3s both' }}>
            {[{ label: 'SSL Secured', color: '#34d399' }, { label: 'JWT Auth', color: '#818cf8' }, { label: 'bcrypt Hashed', color: '#fbbf24' }, { label: '15-min Session', color: '#60a5fa' }].map(b => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 100, padding: '5px 12px' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: b.color, boxShadow: `0 0 6px ${b.color}` }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Right Panel ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: isMobile ? '32px 20px' : '40px 52px', overflowY: 'auto', position: 'relative' }}>
        {/* Subtle bg glow */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', width: 500, height: 400, transform: 'translateX(-50%)', borderRadius: '50%', background: `radial-gradient(ellipse,${activeBg.replace('0.14', '0.06')} 0%,transparent 70%)`, pointerEvents: 'none', transition: 'background 0.5s ease' }} />

        <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>

          {/* Mobile logo */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, animation: 'pageIn .5s ease both' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
                <MdSchool style={{ fontSize: 21, color: '#fff' }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>College<span style={{ color: '#a78bfa' }}>ERP</span></span>
            </div>
          )}

          {/* Header */}
          <div style={{ marginBottom: 28, animation: 'pageIn .55s ease .05s both' }}>
            <h2 style={{ fontSize: isMobile ? 26 : 30, fontWeight: 900, color: '#fff', letterSpacing: '-.8px', marginBottom: 6 }}>
              {selectedPortal ? `Sign in as ${activePortal?.label}` : 'Sign in to your portal'}
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
              {selectedPortal ? `Enter your ${activePortal?.idLabel?.toLowerCase()} and password` : 'Choose your role to continue'}
            </p>
          </div>

          {/* Portal selector */}
          <div style={{ marginBottom: 20, animation: 'pageIn .6s ease .1s both' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Select Portal</div>

            {/* Admin — full width */}
            {(() => {
              const p = PORTALS[0]; const Icon = p.icon; const sel = selectedPortal === p.key
              return (
                <button type="button" className={`portal-btn ${sel ? 'portal-btn-selected' : ''}`} onClick={() => handlePortalSelect(p.key)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14, border: `1.5px solid ${sel ? p.color + '60' : 'rgba(255,255,255,0.09)'}`, background: sel ? p.bg : 'rgba(255,255,255,0.04)', boxShadow: sel ? `0 8px 28px ${p.color}22, inset 0 1px 0 rgba(255,255,255,0.08)` : 'none', marginBottom: 10, textAlign: 'left' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: sel ? p.color : `${p.color}20`, border: `1px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .22s', boxShadow: sel ? `0 4px 14px ${p.color}50` : 'none' }}>
                    <Icon style={{ fontSize: 22, color: sel ? '#fff' : p.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: sel ? '#fff' : 'rgba(255,255,255,0.8)' }}>Administrator</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{p.desc}</div>
                  </div>
                  {sel && <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, boxShadow: `0 0 10px ${p.color}`, animation: 'pulse 2s infinite', flexShrink: 0 }} />}
                  <span style={{ flexShrink: 0, background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}35`, borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 700 }}>Full Access</span>
                </button>
              )
            })()}

            {/* 2+2 grid */}
            {[[1, 2], [3, 4]].map((pair, ri) => (
              <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                {pair.map(idx => {
                  const p = PORTALS[idx]; const Icon = p.icon; const sel = selectedPortal === p.key
                  return (
                    <button key={p.key} type="button" className={`portal-btn ${sel ? 'portal-btn-selected' : ''}`} onClick={() => handlePortalSelect(p.key)} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 16px', borderRadius: 14, border: `1.5px solid ${sel ? p.color + '60' : 'rgba(255,255,255,0.09)'}`, background: sel ? p.bg : 'rgba(255,255,255,0.04)', boxShadow: sel ? `0 8px 28px ${p.color}22, inset 0 1px 0 rgba(255,255,255,0.08)` : 'none', textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: sel ? p.color : `${p.color}20`, border: `1px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .22s', boxShadow: sel ? `0 4px 12px ${p.color}45` : 'none' }}>
                          <Icon style={{ fontSize: 19, color: sel ? '#fff' : p.color }} />
                        </div>
                        {sel && <div style={{ width: 7, height: 7, borderRadius: '50%', background: p.color, boxShadow: `0 0 8px ${p.color}`, animation: 'pulse 2s infinite' }} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: sel ? '#fff' : 'rgba(255,255,255,0.78)' }}>{p.label}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>{p.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Login form — appears when portal selected */}
          {selectedPortal && (
            <div style={{ animation: 'slideUp .35s cubic-bezier(.22,1,.36,1) both' }}>
              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: activeBg, border: `1px solid ${activeColor}30`, borderRadius: 100, padding: '5px 14px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: activeColor, boxShadow: `0 0 8px ${activeColor}`, animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: activeColor }}>Enter Credentials</span>
                </div>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              </div>

              <form onSubmit={handleSubmit}>
                {/* Identifier */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)', marginBottom: 8, letterSpacing: '.02em' }}>
                    {activePortal?.idLabel}
                  </label>
                  <input
                    type="text" name="identifier" value={form.identifier}
                    onChange={e => setForm({ ...form, identifier: e.target.value })}
                    placeholder={`Enter ${activePortal?.idLabel?.toLowerCase()}`}
                    className="input-dark"
                    style={{ borderColor: idFocus ? activeColor : 'rgba(255,255,255,0.12)', boxShadow: idFocus ? `0 0 0 3px ${activeColor}18` : 'none' }}
                    onFocus={() => setIdFocus(true)} onBlur={() => setIdFocus(false)}
                  />
                </div>

                {/* Password */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)', marginBottom: 8, letterSpacing: '.02em' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      placeholder="Enter password"
                      className="input-dark"
                      style={{ paddingRight: 48, borderColor: pwFocus ? activeColor : 'rgba(255,255,255,0.12)', boxShadow: pwFocus ? `0 0 0 3px ${activeColor}18` : 'none' }}
                      onFocus={() => setPwFocus(true)} onBlur={() => setPwFocus(false)}
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.38)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                      {showPassword ? <MdVisibilityOff size={19} /> : <MdVisibility size={19} />}
                    </button>
                  </div>
                </div>

                {/* Remember + forgot */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ accentColor: activeColor, width: 14, height: 14 }} />
                    Remember me
                  </label>
                  <Link to="/auth/forgot-password" style={{ fontSize: 13, fontWeight: 600, color: activeColor, textDecoration: 'none', transition: 'opacity .15s' }}
                    onMouseEnter={e => e.target.style.opacity = '.7'} onMouseLeave={e => e.target.style.opacity = '1'}>
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} className="btn-submit"
                  style={{ width: '100%', padding: '15px', borderRadius: 13, fontSize: 15, fontWeight: 800, color: '#fff', background: loading ? `${activeColor}99` : `linear-gradient(135deg, ${activeColor}, ${activeColor}cc)`, boxShadow: loading ? 'none' : `0 6px 24px ${activeColor}45`, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, letterSpacing: '.02em' }}>
                  {loading ? (
                    <>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'loadSpin .7s linear infinite' }} />
                      Signing in…
                    </>
                  ) : (
                    <>Sign in as {activePortal?.label} <MdArrowForward size={18} /></>
                  )}
                </button>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '22px 0' }} />
                <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                  Don&apos;t have an account?{' '}
                  <Link to="/auth/register" style={{ fontWeight: 700, color: activeColor, textDecoration: 'none' }}>Register here</Link>
                </p>
              </form>
            </div>
          )}

          {/* Demo credentials */}
          <div style={{ marginTop: 24, animation: 'pageIn .7s ease .25s both' }}>
            <button type="button" className="demo-toggle" onClick={() => setShowDemo(v => !v)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: '12px 16px', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MdAutoAwesome style={{ fontSize: 15, color: '#fbbf24' }} />
                Demo accounts · password: Demo@123
              </div>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.3)', transform: showDemo ? 'rotate(45deg)' : 'none', transition: 'transform .22s', lineHeight: 1 }}>+</span>
            </button>

            {showDemo && (
              <div style={{ marginTop: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden', animation: 'slideUp .25s ease both' }}>
                {DEMO_ACCOUNTS.map((d, i) => (
                  <div key={d.role} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: i < DEMO_ACCOUNTS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer', transition: 'background .15s' }}
                    onClick={() => { handlePortalSelect(d.role.toLowerCase()); setForm({ identifier: d.email, password: 'Demo@123' }) }}
                    onMouseEnter={e => e.currentTarget.style.background = `${d.color}08`}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ background: `${d.color}15`, color: d.color, border: `1px solid ${d.color}30`, borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{d.role}</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace' }}>{d.email}</span>
                    </div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontWeight: 600, flexShrink: 0 }}>click to fill</span>
                  </div>
                ))}
                <div style={{ padding: '8px 16px', background: 'rgba(251,191,36,0.06)', borderTop: '1px solid rgba(251,191,36,0.12)' }}>
                  <span style={{ fontSize: 11, color: 'rgba(251,191,36,0.7)', fontWeight: 600 }}>⚡ Click any row to auto-fill credentials</span>
                </div>
              </div>
            )}
          </div>

          {/* Back link */}
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <Link to="/" className="back-link" style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', textDecoration: 'none' }}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
