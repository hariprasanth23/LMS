import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  MdSchool,
  MdBadge,
  MdPeople,
  MdStar,
  MdAdminPanelSettings,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

const PORTALS = [
  { key: 'admin',   label: 'Admin',   color: '#dc2626', icon: MdAdminPanelSettings, description: 'System administration', idLabel: 'Admin ID / Email' },
  { key: 'student', label: 'Student', color: '#3b82f6', icon: MdSchool,             description: 'Academic portal',        idLabel: 'Roll Number / Email' },
  { key: 'staff',   label: 'Staff',   color: '#8b5cf6', icon: MdBadge,              description: 'Faculty & staff',        idLabel: 'Employee ID / Email' },
  { key: 'parent',  label: 'Parent',  color: '#f59e0b', icon: MdPeople,             description: "Ward's progress",        idLabel: 'Phone / Email' },
  { key: 'alumni',  label: 'Alumni',  color: '#14b8a6', icon: MdStar,               description: 'Alumni network',         idLabel: 'Alumni ID / Email' },
]

const FEATURES = [
  'Complete Academic Management',
  'Real-time Exam & Grade Tracking',
  'Online Fee Payment & Receipts',
  'Research & Project Portal',
  '24/7 Feedback System',
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

  useEffect(() => {
    const portalParam = searchParams.get('portal')
    if (portalParam && PORTALS.some((p) => p.key === portalParam)) {
      setSelectedPortal(portalParam)
    }
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePortalSelect = (key) => {
    setSelectedPortal(key)
    setForm({ identifier: '', password: '' })
    setShowPassword(false)
  }

  const activePortal = PORTALS.find((p) => p.key === selectedPortal)
  const activeColor = activePortal?.color ?? '#6366f1'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPortal) { toast.error('Please select a portal type'); return }
    if (!form.identifier || !form.password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      await login(form.identifier, form.password, selectedPortal)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const adminPortal = PORTALS.find((p) => p.key === 'admin')
  const row2 = PORTALS.filter((p) => p.key === 'student' || p.key === 'staff')
  const row3 = PORTALS.filter((p) => p.key === 'parent' || p.key === 'alumni')

  const renderPortalButton = (portal, fullWidth = false) => {
    const { key, label, color, icon: Icon, description } = portal
    const isSelected = selectedPortal === key
    const isAdmin = key === 'admin'

    return (
      <button
        key={key}
        type="button"
        onClick={() => handlePortalSelect(key)}
        className={`flex items-center gap-2.5 rounded-[10px] border-2 p-2.5 text-left outline-none transition-all duration-150 ${fullWidth ? 'w-full' : ''}`}
        style={{
          background: isSelected ? `${color}10` : '#f8fafc',
          borderColor: isSelected ? color : '#e2e8f0',
        }}
      >
        <div
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md"
          style={{ background: isSelected ? color : `${color}20` }}
        >
          <Icon style={{ fontSize: 16, color: isSelected ? '#fff' : color }} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold leading-tight" style={{ color: isSelected ? color : '#1e293b' }}>
            {isAdmin ? 'Administrator' : label}
          </div>
          <div className="mt-0.5 text-[11px] text-slate-500">{description}</div>
        </div>

        {isAdmin && !isMobile && (
          <span className="flex-shrink-0 rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700">
            System Admin
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="flex min-h-screen font-sans">
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-form-appear { animation: fadeSlideIn 0.25s ease forwards; }
      `}</style>

      {/* Left panel */}
      {!isMobile && (
        <div
          className="flex w-[42%] flex-shrink-0 flex-col justify-between px-10 py-12 text-white"
          style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] bg-white">
              <MdSchool style={{ fontSize: 22, color: '#312e81' }} />
            </div>
            <div>
              <div className="text-[22px] font-extrabold leading-tight">College ERP</div>
              <div className="mt-0.5 text-xs opacity-70">Student Management System</div>
            </div>
          </div>

          <div>
            <h2 className="m-0 whitespace-pre-line text-[32px] font-extrabold leading-snug">
              {'Welcome\nBack'}
            </h2>
            <p className="mb-0 mt-3 text-sm leading-relaxed opacity-75">
              Sign in to access your personalized portal. All your academic tools in one place.
            </p>
            <ul className="mt-8 list-none p-0">
              {FEATURES.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 border-b border-white/[0.08] py-2 text-[13px] opacity-85">
                  <span className="inline-flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold">
                    ✓
                  </span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            {['🔒 SSL Secured', '🛡️ JWT Auth', '⚡ Live Data'].map((badge) => (
              <span key={badge} className="rounded-full bg-white/10 px-3 py-1.5 text-[11px]">
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Right panel */}
      <div className={`flex flex-col justify-center overflow-y-auto bg-white ${isMobile ? 'w-full px-5 py-8' : 'w-[58%] px-12 py-12'}`}>
        <div className="mx-auto w-full max-w-[520px]">

          <h1 className="mb-1 text-[28px] font-extrabold text-slate-800">Sign In</h1>
          <p className="mb-7 text-sm text-slate-500">Select your portal and enter credentials</p>

          <div className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.5px] text-slate-700">
            Select Portal
          </div>

          <div className="mb-2">{renderPortalButton(adminPortal, true)}</div>

          <div className="mb-2 grid grid-cols-2 gap-2">
            {row2.map((p) => renderPortalButton(p))}
          </div>

          <div className="mb-2 grid grid-cols-2 gap-2">
            {row3.map((p) => renderPortalButton(p))}
          </div>

          {/* Sample credentials */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border-[1.5px] border-blue-200 bg-gradient-to-r from-sky-50 to-blue-50 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500">
                <span className="text-[15px]">🔑</span>
              </div>
              <div>
                <div className="mb-0.5 text-[12px] font-bold text-blue-800">
                  All sample accounts share the same password
                </div>
                <div className="text-[11px] text-slate-500">Use any email below to sign in</div>
              </div>
            </div>
            <div className="flex-shrink-0 rounded-lg border border-blue-200 bg-white px-3.5 py-1.5 text-center">
              <div className="mb-0.5 text-[10px] font-semibold text-slate-500">PASSWORD</div>
              <div className="font-mono text-[13px] font-extrabold tracking-wider text-slate-800">Demo@123</div>
            </div>
          </div>

          {/* Per-role sample accounts */}
          <div className="mt-2.5 rounded-xl border-[1.5px] border-slate-200 bg-slate-50 px-4 py-3">
            <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.5px] text-slate-400">
              Sample accounts · password: Demo@123
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                { role: 'Admin',   email: 'admin@sample.edu',    note: null,    color: '#dc2626', bg: '#fef2f2' },
                { role: 'Student', email: 'student1@sample.edu', note: '1 – 5', color: '#3b82f6', bg: '#eff6ff' },
                { role: 'Faculty', email: 'faculty1@sample.edu', note: '1 – 5', color: '#8b5cf6', bg: '#f5f3ff' },
              ].map(({ role, email, note, color, bg }) => (
                <div key={role} className="flex items-center justify-between gap-2 rounded-lg px-3 py-1.5" style={{ background: bg }}>
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold"
                      style={{ color, background: '#fff', border: `1px solid ${color}30` }}
                    >
                      {role}
                    </span>
                    <span className="truncate font-mono text-xs text-slate-600">{email}</span>
                    {note && (
                      <span className="flex-shrink-0 text-[10px] font-semibold opacity-80" style={{ color }}>
                        ({note})
                      </span>
                    )}
                  </div>
                  <span className="flex-shrink-0 font-mono text-[11px] font-bold text-slate-500">Demo@123</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              e.g. student2@sample.edu, faculty3@sample.edu also work
            </div>
          </div>

          {/* Login form */}
          {selectedPortal && (
            <div className="login-form-appear">
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="whitespace-nowrap text-xs font-semibold text-slate-400">Enter Credentials</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
                    {activePortal?.idLabel}
                  </label>
                  <input
                    type="text"
                    name="identifier"
                    value={form.identifier}
                    onChange={handleChange}
                    placeholder={`Enter ${activePortal?.idLabel?.toLowerCase()}`}
                    className="w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors duration-200 box-border"
                    onFocus={(e) => (e.target.style.borderColor = activeColor)}
                    onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                  />
                </div>

                <div className="mb-4">
                  <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="w-full rounded-lg border-[1.5px] border-slate-200 bg-white py-2.5 pl-3.5 pr-11 text-sm text-slate-800 outline-none transition-colors duration-200 box-border"
                      onFocus={(e) => (e.target.style.borderColor = activeColor)}
                      onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center border-none bg-transparent p-0 text-slate-500 cursor-pointer"
                    >
                      {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                    </button>
                  </div>
                </div>

                <div className="mb-5 flex items-center justify-between">
                  <label className="flex cursor-pointer select-none items-center gap-1.5 text-[13px] text-slate-700">
                    <input type="checkbox" className="h-3.5 w-3.5" style={{ accentColor: activeColor }} />
                    Remember me
                  </label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-[13px] font-semibold no-underline"
                    style={{ color: activeColor }}
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-[10px] border-none py-3 text-[15px] font-bold tracking-[0.2px] text-white transition-opacity duration-200"
                  style={{
                    background: loading ? `${activeColor}99` : activeColor,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Signing in…' : `Sign In as ${activePortal?.label}`}
                </button>

                <div className="my-5 h-px bg-slate-200" />

                <p className="m-0 text-center text-[13px] text-slate-500">
                  Don't have an account?{' '}
                  <Link to="/auth/register" className="font-semibold no-underline" style={{ color: activeColor }}>
                    Register here
                  </Link>
                </p>
              </form>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/" className="text-[13px] text-slate-400 no-underline">
              ← Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
