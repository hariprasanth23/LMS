import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MdSchool, MdBadge, MdPeople, MdStar, MdAdminPanelSettings,
  MdMenuBook, MdAssignment, MdPayment, MdMiscellaneousServices,
  MdScience, MdFeedback, MdArrowForward, MdCheck, MdShield,
  MdSpeed, MdPublic, MdAccessTime, MdLayers, MdAnalytics,
  MdDashboard, MdSecurity, MdAutoAwesome, MdRocketLaunch,
  MdVerified, MdGroups, MdEmail,
  MdWork, MdNotificationsActive, MdCalendarToday,
  MdMenu, MdClose, MdComputer, MdHowToReg, MdBusinessCenter,
  MdCastForEducation, MdMonetizationOn,
} from 'react-icons/md'

// ── Intersection observer hook ─────────────────────────────────────────────────
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

// ── Scroll-reveal wrapper ──────────────────────────────────────────────────────
function Reveal({ children, delay = 0, dir = 'up', wrapStyle = {} }) {
  const [ref, inView] = useInView()
  const from = { up: 'translateY(32px)', left: 'translateX(-32px)', right: 'translateX(32px)', scale: 'scale(0.92)' }[dir] || 'translateY(32px)'
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translate(0) scale(1)' : from,
      filter: inView ? 'blur(0px)' : 'blur(4px)',
      transition: `opacity .72s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .72s cubic-bezier(.22,1,.36,1) ${delay}ms, filter .72s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      willChange: 'opacity, transform, filter',
      ...wrapStyle,
    }}>
      {children}
    </div>
  )
}

// ── Animated counter ───────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView()
  const started = useRef(false)
  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    if (typeof target !== 'number') { setCount(target); return }
    const steps = 60, dur = 1800
    let cur = 0
    const t = setInterval(() => {
      cur += target / steps
      if (cur >= target) { setCount(target); clearInterval(t) }
      else setCount(Math.floor(cur))
    }, dur / steps)
    return () => clearInterval(t)
  }, [inView, target])
  return <span ref={ref}>{typeof target === 'number' ? count : target}{suffix}</span>
}

// ── Typewriter ─────────────────────────────────────────────────────────────────
const TW_WORDS = ['Students', 'Faculty', 'Admins', 'Researchers', 'Parents']
function Typewriter() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setIdx(i => (i + 1) % TW_WORDS.length); setVisible(true) }, 320)
    }, 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{
      background: 'linear-gradient(135deg, #a78bfa, #34d399)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.32s cubic-bezier(.22,1,.36,1), transform 0.32s cubic-bezier(.22,1,.36,1)',
      display: 'inline-block',
    }}>{TW_WORDS[idx]}</span>
  )
}

// ── Star field ─────────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 70 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 1.8 + 0.6,
  delay: Math.random() * 6, dur: Math.random() * 3 + 2,
}))
function StarField() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {STARS.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: '50%',
          background: s.id % 3 === 0 ? '#a78bfa' : s.id % 3 === 1 ? '#34d399' : '#fff',
          opacity: 0, animation: `starTwinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  )
}

// ── Gradient text ──────────────────────────────────────────────────────────────
function GradText({ children, from = '#a78bfa', to = '#34d399', style = {} }) {
  return (
    <span style={{
      background: `linear-gradient(135deg, ${from}, ${to})`,
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      backgroundClip: 'text', ...style,
    }}>{children}</span>
  )
}

// ── Ring counter (SVG progress ring + animated number) ─────────────────────────
function RingCounter({ target, suffix = '', color, size = 110 }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView()
  const started = useRef(false)
  const r = 42, circumference = 2 * Math.PI * r
  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    if (typeof target !== 'number') { setCount(target); return }
    const steps = 60, dur = 1800; let cur = 0
    const t = setInterval(() => {
      cur += target / steps
      if (cur >= target) { setCount(target); clearInterval(t) } else setCount(Math.floor(cur))
    }, dur / steps)
    return () => clearInterval(t)
  }, [inView, target])
  const pct = typeof target === 'number' ? Math.min(count / target, 1) : 1
  const dash = pct * circumference
  return (
    <div ref={ref} style={{ position: 'relative', width: size, height: size, margin: '0 auto 14px' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${color}20`} strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.8s cubic-bezier(.22,1,.36,1)', filter: `drop-shadow(0 0 7px ${color})` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 24, fontWeight: 900, color: color, letterSpacing: '-1px' }}>{count}{suffix}</span>
      </div>
    </div>
  )
}

// ── Glass card ─────────────────────────────────────────────────────────────────
function GlassCard({ children, style = {}, hover = true, isDark = true }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: hov ? (isDark ? 'rgba(255,255,255,0.06)' : '#f0f4ff') : (isDark ? 'rgba(255,255,255,0.04)' : '#ffffff'),
        border: `1px solid ${hov ? 'rgba(139,92,246,0.5)' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0')}`,
        borderRadius: 20,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: hov ? '0 28px 56px rgba(99,102,241,0.22), inset 0 1px 0 rgba(255,255,255,0.12)' : (isDark ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)' : '0 4px 24px rgba(0,0,0,0.08)'),
        transform: hov ? 'translateY(-5px) scale(1.01)' : 'none',
        transition: 'all 0.35s cubic-bezier(.22,1,.36,1)',
        willChange: 'transform, box-shadow',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── Data ───────────────────────────────────────────────────────────────────────
const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

const MARQUEE_ITEMS = [
  'My Curriculum', 'Time Table', 'Class Attendance', 'Exam Schedule',
  'Online Payments', 'Research Portal', 'Course Registration', 'Bonafide Certificate',
  'APAAR ID Upload', 'Digital Assignment', 'Faculty Info', 'eSanad Request',
  'Marks & Grades', 'MOOC Registration', 'Feedback System', 'HOD and Dean Info',
  'Project Portal', 'Library Services',
]

const FEATURES = [
  { icon: MdMenuBook,            title: 'Academic Management',  desc: 'Curriculum, timetable, attendance, class messages, biometric info and faculty directory.',             color: '#818cf8', bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.25)',  span: 1 },
  { icon: MdAssignment,          title: 'Examination System',   desc: 'Exam schedules, marks, grades, online exams, arrear and makeup registration.',                        color: '#f87171', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)',   span: 1 },
  { icon: MdPayment,             title: 'Finance & Payments',   desc: 'Fee payments, wallet management, receipts, fees intimation, library dues and refunds.',               color: '#34d399', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.25)',  span: 1 },
  { icon: MdMiscellaneousServices, title: 'Student Services',   desc: 'Transport, hostel, bonafide, library, transcript, scholarships, and eSanad digital certificates.',    color: '#fbbf24', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)',  span: 1 },
  { icon: MdScience,             title: 'Research Portal',      desc: 'PhD registration, course work, thesis submission, guide meetings, and weekly workload tracking.',      color: '#c084fc', bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.25)',  span: 1 },
  { icon: MdFeedback,            title: 'Feedback System',      desc: 'Course feedback forms, 24×7 continuous feedback, and instructor ratings.',                            color: '#22d3ee', bg: 'rgba(14,165,233,0.12)',  border: 'rgba(14,165,233,0.25)',  span: 1 },
  { icon: MdSchool,              title: 'Course Registration',  desc: 'Wishlist, course withdrawal, EXC, MOOC, industrial internship, and SET conference registration.',     color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.25)',  span: 1 },
  { icon: MdPeople,              title: 'Profile & Info',       desc: 'Student profile, credentials, dayboarder info, bank details, scholarships and acknowledgements.',     color: '#f472b6', bg: 'rgba(236,72,153,0.12)',  border: 'rgba(236,72,153,0.25)',  span: 1, badge: 'NEW' },
  { icon: MdBadge,               title: 'Project Portal',       desc: 'Faculty open projects, project proposals, progress reviews and project mark viewing.',                 color: '#a78bfa', bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.25)',  span: 1 },
  { icon: MdSecurity,            title: 'Account Security',     desc: 'Two-factor backup codes, password management and login ID updates.',                                  color: '#38bdf8', bg: 'rgba(14,165,233,0.12)',  border: 'rgba(14,165,233,0.25)',  span: 1 },
  { icon: MdAnalytics,           title: 'Online Examinations',  desc: 'Comprehensive online exams, question preview, exam timer and system requirements check.',             color: '#fb923c', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.25)',  span: 1, badge: 'NEW' },
  { icon: MdVerified,            title: 'APAAR & eSanad',       desc: 'Upload APAAR ID for Academic Bank of Credits, and request eSanad digital certificates.',             color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)',  span: 1, badge: 'NEW' },
]

const PORTALS = [
  { key: 'admin',   label: 'Admin',   icon: MdAdminPanelSettings, color: '#f87171', bg: 'rgba(239,68,68,0.15)',   desc: 'Full system administration, employee management, payroll, departments & bulk imports.', count: '30+' },
  { key: 'student', label: 'Student', icon: MdSchool,             color: '#60a5fa', bg: 'rgba(59,130,246,0.15)',  desc: 'Academic portal — courses, attendance, exams, fees, research & personal profile.', count: '50+' },
  { key: 'staff',   label: 'Staff',   icon: MdBadge,              color: '#c084fc', bg: 'rgba(168,85,247,0.15)',  desc: 'Teaching tools — course management, assignments, marks entry & student feedback.', count: '20+' },
  { key: 'parent',  label: 'Parent',  icon: MdPeople,             color: '#fbbf24', bg: 'rgba(245,158,11,0.15)',  desc: 'Track ward progress — attendance, performance, fee status & announcements.', count: '10+' },
  { key: 'alumni',  label: 'Alumni',  icon: MdStar,               color: '#34d399', bg: 'rgba(16,185,129,0.15)', desc: 'Alumni network — updates, achievements, reconnect with the institution.', count: '8+' },
]

const ACADEMICS_GENERAL_ITEMS = [
  'My Curriculum','HOD and Dean Info','Faculty Info','Biometric Info','Class Messages',
  'Regulation','Minor/Honour','Time Table','Class Attendance','Course Page Consolidated',
  'Digital Assignment Upload','QCM View','Outcome SET Conference','Co-Extra Curricular',
  'Academics Calendar','Course Registration Allocation','Project Course','Project Mark View','Apaar ID Upload',
]

const EXAM_GROUPS = [
  { title: 'General',   color: '#f87171', items: ['Exam Schedule','Marks','Grades','Grade History','Regular Paper See/Rev','Additional Learning','MOOC File Upload','Project File Upload','ECA File Upload','EPT Schedule','Re-Exam Application','Code of Conduct'] },
  { title: 'Arrear',    color: '#fb923c', items: ['Registration','Registration Details','Exam Schedule','Grade View','Paper See/Rev'] },
  { title: 'Online',    color: '#c084fc', items: ['Comprehensive Exam','Question Preview','Exam Information'] },
  { title: 'Makeup',    color: '#22d3ee', items: ['Registration','ME Exam Schedule'] },
]

const FINANCE_ITEMS = [
  { label: 'Fee Payments',     icon: MdPayment,    color: '#34d399', desc: 'Pay tuition, hostel and other fees online securely.' },
  { label: 'Wallet Top-Up',    icon: MdPayment,    color: '#059669', desc: 'Top up your ERP wallet for quick campus payments.' },
  { label: 'Payment Receipts', icon: MdAssignment, color: '#38bdf8', desc: 'Download and view complete payment history.' },
  { label: 'Fees Intimation',  icon: MdAssignment, color: '#818cf8', desc: 'Get notified about upcoming fee dues.' },
  { label: 'Online Transfer',  icon: MdPayment,    color: '#a78bfa', desc: 'Transfer funds between accounts seamlessly.' },
  { label: 'Library Due',      icon: MdMenuBook,   color: '#fbbf24', desc: 'Check and pay library dues and fines.' },
  { label: 'Refund Request',   icon: MdAssignment, color: '#f87171', desc: 'Apply for fee refunds with digital approval.' },
]

const SERVICES_GROUPS = [
  { title: 'General',    color: '#fbbf24', items: ['Facility Registration','Transport Registration','PAT Registration','Transcript Request','Financial Assistance','Achievements','Programme Migration','Late Hour Request','Final Year Registration','Certificate Upload','eSanad Request'] },
  { title: 'My Info',    color: '#60a5fa', items: ['Profile','Credentials','Dayboarder Info','Acknowledgement View','Student Bank Info','My Scholarships'] },
  { title: 'My Account', color: '#c084fc', items: ['Backup Codes','Change Password','Update Login ID'] },
  { title: 'Bonafide',   color: '#f472b6', items: ['Apply Bonafide'] },
  { title: 'Library',    color: '#22d3ee', items: ['Online Book Recommendation'] },
  { title: 'Info Corner',color: '#818cf8', items: ['Health Center Feedback','FAQ'] },
]

const RESEARCH_ITEMS = [
  'Research Regulations','My Research Profile','Course Work Registration','Registration Status',
  'Meeting Info','Attendance View','Research Letters','Electronic Thesis Submission',
  'Research Document Upload','Guide Scholar Meeting','Weekly Scholar Workload',
]

const MARQUEE_ITEMS_ROW2 = [
  'Employee Management', 'Payroll Automation', 'Leave Approval', 'PhD Registration',
  'Thesis Submission', 'Smart Notifications', 'Bulk CSV Import', 'JWT Security',
  'Parent Dashboard', 'Alumni Network', 'Biometric Sync', 'eSanad Certificate',
  'APAAR ID Upload', 'MOOC Registration', 'Grade Analytics', 'Fee Receipts', 'Role-Based Access',
]

const TESTIMONIALS = [
  { quote: 'I can check my attendance, CGPA and upcoming exams all from one place. No more hunting through 5 different portals every morning.', name: 'Arjun Ravi', role: 'B.Tech CSE — Semester 6', portal: 'Student', color: '#60a5fa', initials: 'AR' },
  { quote: 'Marks entry and assignment grading used to take 3 hours per class. Now it is done in 20 minutes with the faculty dashboard.', name: 'Dr. Priya Shankar', role: 'Associate Professor, ECE', portal: 'Faculty', color: '#c084fc', initials: 'PS' },
  { quote: 'Processing payroll for 200+ employees manually was a nightmare. The automated payroll module saves our HR team 2 full days every month.', name: 'Ramesh Kumar', role: 'HR Manager, Admin Portal', portal: 'Admin', color: '#f87171', initials: 'RK' },
  { quote: 'As a parent I used to call the college every week to check attendance. Now I see everything in real-time. It is genuinely reassuring.', name: 'Lakshmi Venkat', role: 'Parent — CSE Department', portal: 'Parent', color: '#fbbf24', initials: 'LV' },
]

const COMPARISON_ROWS = [
  { category: 'Attendance Tracking', old: 'Paper register + manual entry', erp: 'Real-time digital sync' },
  { category: 'Fee Payment', old: 'Bank challan + admin counter queue', erp: 'Instant online payment + auto receipt' },
  { category: 'Exam Results', old: 'Physical marksheet, 2-week delay', erp: 'Instant digital grades + history' },
  { category: 'Parent Communication', old: 'Manual phone calls to office', erp: 'Live portal access 24/7' },
  { category: 'Research Submission', old: 'Email attachments, no tracking', erp: 'Structured digital workflow' },
  { category: 'HR & Payroll', old: 'Spreadsheets + manual calculation', erp: 'Automated one-click payslips' },
]

const FAQS = [
  { q: 'Does every student get their own separate portal?', a: 'Yes. Each of the 5 portals — Student, Faculty, Admin, Parent, Alumni — has its own login, dashboard layout, and feature set. Role-based access is enforced at both the API and UI level using JWT and Spring Security.' },
  { q: 'How does the fee payment system work?', a: 'Students pay through the integrated finance portal. Payments are logged in real time, receipts are auto-generated as downloadable PDFs, and parents see the updated fee status immediately in their portal.' },
  { q: 'Can the admin import existing employee data?', a: 'Yes. The HR module supports bulk CSV imports for employee profiles, allowing migration from spreadsheets or legacy systems in minutes with a single upload.' },
  { q: 'Is student attendance data accessible to parents?', a: 'Yes. The parent portal shows live attendance percentages per subject, shortfall alerts, and semester-wise trends for their ward — no calls to the office needed.' },
  { q: 'What security measures protect student data?', a: 'All API endpoints are JWT-secured. Sessions auto-expire after 15 minutes of inactivity. Role-based method-level security prevents cross-portal data access. Passwords are bcrypt-hashed.' },
  { q: 'Is College ERP hosted on-premise or cloud?', a: 'College ERP is cloud-hosted with a fully containerized Docker deployment (frontend, backend, PostgreSQL, nginx). On-premise deployments can be arranged for institutions with dedicated infrastructure.' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Choose Your Portal', desc: 'Select from Student, Faculty, Admin, Parent, or Alumni portal based on your role in the institution.', color: '#6366f1', icon: MdHowToReg },
  { step: '02', title: 'Sign In Securely', desc: 'Authenticate with your institution credentials. JWT-secured sessions with 15-minute inactivity protection.', color: '#8b5cf6', icon: MdShield },
  { step: '03', title: 'Access Your Dashboard', desc: 'Your personalized dashboard shows attendance, grades, fees, assignments and all role-specific data at a glance.', color: '#10b981', icon: MdDashboard },
  { step: '04', title: 'Manage Everything', desc: 'From academics to research, finance to payroll — every campus workflow in one unified, zero-friction platform.', color: '#f59e0b', icon: MdRocketLaunch },
]

const LMS_FEATURES = [
  { title: 'Course Library', desc: 'Browse, enroll in and track all courses with rich digital content, lecture notes and faculty resources.', color: '#60a5fa', bg: 'rgba(59,130,246,0.12)', icon: MdMenuBook },
  { title: 'Digital Assignments', desc: 'Submit assignments digitally, view deadlines, and receive real-time graded feedback from faculty.', color: '#f87171', bg: 'rgba(239,68,68,0.12)', icon: MdAssignment },
  { title: 'Live Course Pages', desc: 'Access course-specific materials, announcements, and faculty-published resources for each subject.', color: '#34d399', bg: 'rgba(16,185,129,0.12)', icon: MdCastForEducation },
  { title: 'Progress Tracking', desc: 'Monitor completion rate, grades and GPA trends across all enrolled courses from one place.', color: '#fbbf24', bg: 'rgba(245,158,11,0.12)', icon: MdAnalytics },
]

const HR_MODULES = [
  {
    title: 'Employee Management', color: '#818cf8', bg: 'rgba(99,102,241,0.10)', icon: MdWork,
    items: ['Employee Profiles', 'Department Assignment', 'Designation Tracking', 'Employment History', 'Bulk CSV Import', 'Biometric Integration'],
  },
  {
    title: 'Leave Management', color: '#34d399', bg: 'rgba(16,185,129,0.10)', icon: MdCalendarToday,
    items: ['Leave Applications', 'Leave Balance', 'Approval Workflow', 'Leave Types', 'Leave Calendar', 'Auto Notifications'],
  },
  {
    title: 'Payroll System', color: '#fbbf24', bg: 'rgba(245,158,11,0.10)', icon: MdMonetizationOn,
    items: ['Salary Calculation', 'Pay Slip Generation', 'Allowances & Deductions', 'Tax Computation', 'Payroll Reports', 'Bank Integration'],
  },
]

const NOTIFICATION_FEATURES = [
  { title: 'Academic Alerts', desc: 'Assignment deadlines, exam schedules, attendance shortfalls and grade updates — delivered instantly to the right user.', color: '#6366f1', icon: MdNotificationsActive },
  { title: 'Fee Reminders', desc: 'Automated payment due dates, overdue notices, and instant receipt confirmations via the portal.', color: '#10b981', icon: MdPayment },
  { title: 'Announcements', desc: 'Institution-wide and department-specific announcements from admin and faculty, visible on every dashboard.', color: '#f59e0b', icon: MdEmail },
  { title: 'Real-Time Sync', desc: 'Live data sync across all portals — whatever the admin updates, students and parents see immediately.', color: '#ec4899', icon: MdSpeed },
]

const TEAM = [
  { name: 'Manoj Kumar',   role: 'Founder & Marketing Team Lead',       initials: 'MK', grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)', glow: 'rgba(99,102,241,0.4)',   tag: 'Founder',    tagColor: '#818cf8', desc: 'Driving vision, strategy, and growth of College ERP — from concept to every campus.' },
  { name: 'Hari Prasanth', role: 'Co Founder & Full Stack Developer',   initials: 'HP', grad: 'linear-gradient(135deg,#10b981,#06b6d4)', glow: 'rgba(16,185,129,0.4)',   tag: 'Co Founder', tagColor: '#34d399', desc: 'Architecting and building the entire platform — backend, frontend, and everything in between.' },
  { name: 'Pavitaran',     role: 'Co Founder & DevOps Lead',            initials: 'PV', grad: 'linear-gradient(135deg,#f59e0b,#ef4444)', glow: 'rgba(245,158,11,0.4)',   tag: 'Co Founder', tagColor: '#fbbf24', desc: 'Ensuring zero downtime and bulletproof infrastructure — keeping College ERP always online.' },
]

// ── FAQ accordion ──────────────────────────────────────────────────────────────
function FAQAccordion({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 800, margin: '0 auto' }}>
      {items.map((item, i) => (
        <div key={i} style={{ border: `1px solid ${open === i ? 'rgba(139,92,246,0.45)' : 'rgba(99,102,241,0.15)'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color .2s', background: open === i ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.03)' }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: 'inherit', fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor: 'pointer', textAlign: 'left', gap: 16 }}>
            {item.q}
            <span style={{ flexShrink: 0, fontSize: 22, color: '#a78bfa', transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform .25s cubic-bezier(.22,1,.36,1)', lineHeight: 1 }}>+</span>
          </button>
          <div style={{ maxHeight: open === i ? 200 : 0, overflow: 'hidden', transition: 'max-height .38s cubic-bezier(.22,1,.36,1)' }}>
            <div style={{ padding: '0 22px 20px', fontSize: 14, color: 'inherit', opacity: 0.6, lineHeight: 1.85 }}>{item.a}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Theme Toggle ───────────────────────────────────────────────────────────────
function ThemeToggle({ isDark, onToggle }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 2,
        background: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
        border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid #d1d5db',
        borderRadius: 100, padding: 3, cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(.22,1,.36,1)',
        boxShadow: hov ? (isDark ? '0 0 0 3px rgba(255,255,255,0.1)' : '0 0 0 3px rgba(99,102,241,0.15)') : 'none',
        flexShrink: 0,
      }}
    >
      {/* Sun */}
      <div style={{
        width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: !isDark ? '#111' : 'transparent',
        transition: 'background 0.25s',
        flexShrink: 0,
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke={!isDark ? '#fff' : (isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.3)')}
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </div>
      {/* Moon */}
      <div style={{
        width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isDark ? '#111' : 'transparent',
        transition: 'background 0.25s',
        flexShrink: 0,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24"
          fill={isDark ? '#fff' : 'rgba(0,0,0,0.28)'}
          stroke="none">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </div>
    </div>
  )
}

// ── Landing Page ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [announcement, setAnnouncement] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [hovNav, setHovNav] = useState(null)
  const [hovPortal, setHovPortal] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('erp_theme') !== 'light' } catch { return true }
  })

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    try { localStorage.setItem('erp_theme', next ? 'dark' : 'light') } catch { /* ignore */ }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [])

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const navH = 64 + (announcement ? 36 : 0)

  const D = isDark

  // Theme tokens — use T.xxx throughout
  const T = {
    // Section backgrounds
    s1:  D ? 'linear-gradient(135deg,#04081a 0%,#080f2e 100%)' : '#ffffff',
    s2:  D ? 'linear-gradient(135deg,#04081a 0%,#0d1537 100%)' : '#f8fafc',
    s3:  D ? 'linear-gradient(180deg,#04081a 0%,#060b20 100%)' : '#ffffff',
    s4:  D ? 'linear-gradient(135deg,#06091e 0%,#0d1235 100%)' : '#f8fafc',
    s5:  D ? 'linear-gradient(135deg,#04081a 0%,#060d24 100%)' : '#ffffff',
    s6:  D ? 'linear-gradient(135deg,#04081a 0%,#070d28 100%)' : '#f8fafc',
    s7:  D ? 'linear-gradient(135deg,#04081a 0%,#08102e 100%)' : '#ffffff',
    s8:  D ? 'linear-gradient(160deg,#04081a 0%,#0b0b2e 45%,#04081a 100%)' : '#f8fafc',
    s9:  D ? 'linear-gradient(180deg,#04081a 0%,#060c22 100%)' : '#ffffff',
    s10: D ? 'linear-gradient(135deg,#04081a 0%,#0d1537 50%,#04081a 100%)' : '#f1f5f9',
    sCta:D ? 'linear-gradient(135deg,#04081a 0%,#0d1537 50%,#04081a 100%)' : 'linear-gradient(135deg,#f0f4ff 0%,#f8fafc 100%)',
    foot:D ? '#020611' : '#0f172a',
    // Text
    h:   D ? '#ffffff' : '#0f172a',
    p:   D ? 'rgba(255,255,255,0.50)' : '#64748b',
    f:   D ? 'rgba(255,255,255,0.28)' : '#94a3b8',
    // Cards / glass
    cb:  D ? 'rgba(255,255,255,0.04)' : '#ffffff',
    cb2: D ? 'rgba(255,255,255,0.03)' : '#f8fafc',
    cbb: D ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
    // Section tag (purple)
    tb:  D ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.07)',
    tc:  D ? '#a78bfa' : '#6366f1',
    tbd: D ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)',
    // Section dividers
    div: D ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
    // Chip styles
    chBg:  D ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.07)',
    chC:   D ? '#a5b4fc' : '#6366f1',
    chBd:  D ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.18)',
    // White text → dark text in light mode
    wh:  D ? '#ffffff' : '#0f172a',
    w90: D ? 'rgba(255,255,255,0.90)' : '#1e293b',
    w88: D ? 'rgba(255,255,255,0.88)' : '#1e293b',
    w85: D ? 'rgba(255,255,255,0.85)' : '#1e293b',
    w82: D ? 'rgba(255,255,255,0.82)' : '#334155',
    w78: D ? 'rgba(255,255,255,0.78)' : '#334155',
    w75: D ? 'rgba(255,255,255,0.75)' : '#374151',
    w72: D ? 'rgba(255,255,255,0.72)' : '#374151',
    w70: D ? 'rgba(255,255,255,0.70)' : '#374151',
    w65: D ? 'rgba(255,255,255,0.65)' : '#4b5563',
    w62: D ? 'rgba(255,255,255,0.62)' : '#4b5563',
    w58: D ? 'rgba(255,255,255,0.58)' : '#4b5563',
    w55: D ? 'rgba(255,255,255,0.55)' : '#4b5563',
    w50: D ? 'rgba(255,255,255,0.50)' : '#6b7280',
    w48: D ? 'rgba(255,255,255,0.48)' : '#6b7280',
    w45: D ? 'rgba(255,255,255,0.45)' : '#6b7280',
    w42: D ? 'rgba(255,255,255,0.42)' : '#9ca3af',
    w40: D ? 'rgba(255,255,255,0.40)' : '#9ca3af',
    w38: D ? 'rgba(255,255,255,0.38)' : '#9ca3af',
    w35: D ? 'rgba(255,255,255,0.35)' : '#9ca3af',
    w30: D ? 'rgba(255,255,255,0.30)' : '#6b7280',
    w28: D ? 'rgba(255,255,255,0.28)' : '#6b7280',
    w25: D ? 'rgba(255,255,255,0.25)' : '#9ca3af',
    w22: D ? 'rgba(255,255,255,0.22)' : '#9ca3af',
    w20: D ? 'rgba(255,255,255,0.20)' : '#d1d5db',
    // Card surfaces (light mode = actual white/light surfaces)
    gbg:  D ? 'rgba(255,255,255,0.04)' : '#ffffff',    // glass card bg
    gbgh: D ? 'rgba(255,255,255,0.06)' : '#f8fafc',   // glass card hover
    gbrd: D ? 'rgba(255,255,255,0.08)' : '#e2e8f0',   // glass card border
    cbg3: D ? 'rgba(255,255,255,0.03)' : '#fafafa',
    cbg4: D ? 'rgba(255,255,255,0.04)' : '#ffffff',
    cbg5: D ? 'rgba(255,255,255,0.05)' : '#f8fafc',
    cbg8: D ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
    // Border opacity shades
    bd5:  D ? 'rgba(255,255,255,0.05)' : '#e2e8f0',
    bd6:  D ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
    bd7:  D ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
    bd8:  D ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
    bd12: D ? 'rgba(255,255,255,0.12)' : '#d1d5db',
    bd15: D ? 'rgba(255,255,255,0.15)' : '#d1d5db',
  }

  return (
    <div style={{ fontFamily: FONT, margin: 0, padding: 0, overflowX: 'hidden', background: D ? '#04081a' : '#f8fafc', color: D ? '#f1f5f9' : '#0f172a', transition: 'background 0.35s ease, color 0.35s ease' }}>

      {/* ── CSS ───────────────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { background: ${D ? '#04081a' : '#f8fafc'}; transition: background 0.35s ease; }

        .hero-bg-light {
          background: radial-gradient(ellipse 100% 60% at 20% 40%, rgba(99,102,241,0.09) 0%, transparent 60%),
                      radial-gradient(ellipse 80% 50% at 80% 80%, rgba(139,92,246,0.07) 0%, transparent 60%),
                      radial-gradient(ellipse 60% 40% at 60% 10%, rgba(16,185,129,0.06) 0%, transparent 60%),
                      #f0f4ff;
        }
        .grid-overlay-light {
          background-image: linear-gradient(rgba(99,102,241,0.07) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(99,102,241,0.07) 1px,transparent 1px);
          background-size: 48px 48px;
        }

        @keyframes marquee        { from { transform: translateX(0) }          to { transform: translateX(-33.333%) } }
        @keyframes float          { 0%,100% { transform: translateY(0) }       50% { transform: translateY(-14px) } }
        @keyframes floatSlow      { 0%,100% { transform: translateY(0) }       50% { transform: translateY(-8px) } }
        @keyframes pulse          { 0%,100% { opacity: .6 }                    50% { opacity: 1 } }
        @keyframes glow           { 0%,100% { opacity: .3 }                    50% { opacity: .7 } }
        @keyframes spin           { from { transform: rotate(0deg) }           to { transform: rotate(360deg) } }
        @keyframes spinSlow       { from { transform: rotate(0deg) }           to { transform: rotate(360deg) } }
        @keyframes bounce         { 0%,100% { transform: translateX(-50%) translateY(0) }  50% { transform: translateX(-50%) translateY(8px) } }
        @keyframes shimmer        { from { background-position: -400% 0 }      to { background-position: 400% 0 } }
        @keyframes gradFlow       { 0%,100% { background-position:0% 50% }    50% { background-position:100% 50% } }
        @keyframes twinkle        { 0%,100% { opacity: 0 }                     50% { opacity: 1 } }
        @keyframes ripple         { 0% { transform: scale(.8); opacity: 1 }   100% { transform: scale(2.2); opacity: 0 } }
        @keyframes slideLeft      { from { transform: translateX(24px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        @keyframes zoomIn         { from { transform: scale(.88); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes starTwinkle    { 0%,100% { opacity: 0 } 50% { opacity: .85 } }
        @keyframes mobileSlideIn  { from { transform: translateX(100%); opacity:0 } to { transform: translateX(0); opacity:1 } }
        @keyframes ripplePulse    { 0% { transform:scale(1); opacity:.6 } 100% { transform:scale(2.6); opacity:0 } }
        @keyframes badgeEntrance  { from { opacity:0; transform:translateY(-8px) scale(.94) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes underlineGrow  { from { transform:scaleX(0) } to { transform:scaleX(1) } }
        @keyframes numberCount    { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes borderFlow     { 0%,100% { border-color: rgba(99,102,241,.3) } 50% { border-color: rgba(139,92,246,.7) } }
        @keyframes heroGlow       { 0%,100% { opacity: .18 } 50% { opacity: .35 } }
        @keyframes aurora         { 0% { transform: translate(-50%,-50%) rotate(0deg) scale(1); opacity:.18 } 33% { transform: translate(-50%,-50%) rotate(120deg) scale(1.1); opacity:.26 } 66% { transform: translate(-50%,-50%) rotate(240deg) scale(.95); opacity:.20 } 100% { transform: translate(-50%,-50%) rotate(360deg) scale(1); opacity:.18 } }
        @keyframes noiseAnim      { 0% { transform:translate(0,0) } 25% { transform:translate(-2%,-3%) } 50% { transform:translate(3%,2%) } 75% { transform:translate(-1%,4%) } 100% { transform:translate(0,0) } }
        @keyframes shimmerLight   { from { left:-100% } to { left:160% } }
        @keyframes ringFill       { from { stroke-dasharray: 0 1000 } }
        .aurora-mesh { background: conic-gradient(from 0deg at 50% 50%, rgba(99,102,241,.28) 0deg, rgba(139,92,246,.18) 60deg, rgba(16,185,129,.13) 120deg, rgba(14,165,233,.12) 180deg, rgba(236,72,153,.1) 240deg, rgba(99,102,241,.22) 300deg, rgba(99,102,241,.28) 360deg); filter: blur(80px); animation: aurora 20s linear infinite; }
        .noise-layer { position: absolute; inset:-50%; width:200%; height:200%; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); opacity:.028; pointer-events:none; animation: noiseAnim 8s steps(4) infinite; }

        .hero-bg {
          background: radial-gradient(ellipse 100% 60% at 20% 40%, rgba(99,102,241,0.22) 0%, transparent 60%),
                      radial-gradient(ellipse 80% 50% at 80% 80%, rgba(139,92,246,0.18) 0%, transparent 60%),
                      radial-gradient(ellipse 60% 40% at 60% 10%, rgba(16,185,129,0.10) 0%, transparent 60%),
                      #04081a;
        }
        .grid-overlay {
          background-image: linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          box-shadow: 0 4px 24px rgba(99,102,241,0.45);
          transition: all .2s ease;
          border: none; cursor: pointer;
          position: relative; overflow: hidden;
        }
        .btn-primary::after { content:''; position:absolute; top:0; left:-100%; width:55%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent); transform:skewX(-20deg); }
        .btn-primary:hover::after { animation: shimmerLight .65s ease forwards; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(99,102,241,0.65); }
        .btn-ghost { background: ${D ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}; border: 1px solid ${D ? 'rgba(255,255,255,0.15)' : '#d1d5db'}; transition: all .2s ease; cursor: pointer; }
        .btn-ghost:hover { background: ${D ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}; transform: translateY(-2px); }
        .feature-card { transition: all .32s cubic-bezier(.22,1,.36,1); cursor: default; will-change: transform, box-shadow; }
        .feature-card:hover { transform: translateY(-7px) scale(1.01); }
        .portal-card { transition: all .35s cubic-bezier(.22,1,.36,1); will-change: transform, box-shadow; }
        .portal-card:hover { transform: translateY(-9px) scale(1.02); }
        .team-card { transition: all .35s cubic-bezier(.22,1,.36,1); will-change: transform, box-shadow; }
        .team-card:hover { transform: translateY(-9px) scale(1.01); }
        .nav-link { transition: all .18s; cursor: pointer; border: none; font-family: inherit; background: none; position: relative; }
        .nav-link::after { content:''; position:absolute; left:14px; right:14px; bottom:3px; height:1.5px; background:linear-gradient(90deg,#6366f1,#a78bfa); border-radius:2px; transform:scaleX(0); transition:transform .22s cubic-bezier(.22,1,.36,1); transform-origin:left; }
        .nav-link:hover::after { transform:scaleX(1); }
        .chip { display: inline-flex; align-items: center; border-radius: 100px; transition: all .2s; }
        .chip:hover { transform: translateY(-1px); }
        .section-tag { display: inline-flex; align-items: center; gap: 7px; border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; }
        .stat-card { transition: all .3s cubic-bezier(.22,1,.36,1); }
        .stat-card:hover { transform: translateY(-4px); }
        .service-card { transition: all .25s ease; }
        .service-card:hover { transform: translateY(-3px); }
        .exam-card { transition: all .25s ease; }
        .exam-card:hover { transform: translateY(-3px); }
        .finance-card { transition: all .25s ease; }
        .finance-card:hover { transform: translateY(-4px); }
      `}</style>

      {/* ── 1. Announcement bar ─────────────────────────────────────────────── */}
      {announcement && (
        <div style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#6366f1)', backgroundSize: '200% 100%', animation: 'gradFlow 4s ease infinite', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1100 }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>
            🎓 College ERP v2.0 — Research Portal, APAAR ID &amp; eSanad now live &nbsp;
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 4, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>NEW</span>
          </span>
          <button onClick={() => setAnnouncement(false)} style={{ position: 'absolute', right: 14, background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '4px 6px' }}>×</button>
        </div>
      )}

      {/* ── 2. Sticky navbar ────────────────────────────────────────────────── */}
      <nav style={{ position: 'fixed', top: announcement ? 36 : 0, left: 0, right: 0, height: 64, zIndex: 1000, background: scrolled ? (D ? 'rgba(4,8,26,0.94)' : 'rgba(255,255,255,0.96)') : 'transparent', backdropFilter: scrolled ? 'blur(24px)' : 'none', borderBottom: scrolled ? (D ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)') : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0 20px' : '0 48px', transition: 'all .3s' }}>
        {/* Logo */}
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.5)' }}>
            <MdSchool style={{ color: '#fff', fontSize: 22 }} />
          </div>
          <span style={{ fontSize: 19, fontWeight: 800, color: T.h, letterSpacing: '-.4px' }}>College<span style={{ color: '#a78bfa' }}>ERP</span></span>
        </div>

        {/* Nav links (desktop) */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 2 }}>
            {[
              { label: 'Features', id: 'features' }, { label: 'How It Works', id: 'how-it-works' },
              { label: 'Portals', id: 'portals' }, { label: 'Academics', id: 'academics' },
              { label: 'LMS', id: 'lms' }, { label: 'HR', id: 'hr' }, { label: 'Team', id: 'team' },
            ].map(l => (
              <button key={l.id} className="nav-link" onMouseEnter={() => setHovNav(l.id)} onMouseLeave={() => setHovNav(null)} onClick={() => scrollTo(l.id)}
                style={{ padding: '8px 13px', borderRadius: 9, fontSize: 13, fontWeight: 500, color: hovNav === l.id ? '#a78bfa' : (D ? 'rgba(255,255,255,0.75)' : '#374151'), background: hovNav === l.id ? 'rgba(99,102,241,0.1)' : 'transparent' }}>
                {l.label}
              </button>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          {!isMobile && <button className="btn-ghost" onClick={() => navigate('/auth/login')} style={{ padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, color: D ? '#fff' : '#0f172a' }}>Sign In</button>}
          {!isMobile && (
            <button className="btn-primary" onClick={() => navigate('/auth/login')} style={{ padding: '8px 20px', borderRadius: 9, fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
              Get Started <MdArrowForward size={15} />
            </button>
          )}
          {isMobile && (
            <button onClick={() => setMobileMenuOpen(o => !o)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, padding: '8px', display: 'flex', alignItems: 'center', color: '#fff', cursor: 'pointer' }}>
              {mobileMenuOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
            </button>
          )}
        </div>
      </nav>

      {/* ── Mobile menu drawer ─────────────────────────────────────────────── */}
      {isMobile && mobileMenuOpen && (
        <div style={{ position: 'fixed', top: (announcement ? 36 : 0) + 64, right: 0, bottom: 0, width: '80%', maxWidth: 320, zIndex: 999, background: 'rgba(8,12,36,0.98)', backdropFilter: 'blur(24px)', borderLeft: '1px solid rgba(255,255,255,0.08)', padding: '32px 24px', animation: 'mobileSlideIn .28s cubic-bezier(.22,1,.36,1)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Features', id: 'features' }, { label: 'How It Works', id: 'how-it-works' },
            { label: 'Portals', id: 'portals' }, { label: 'Academics', id: 'academics' },
            { label: 'LMS', id: 'lms' }, { label: 'HR & Payroll', id: 'hr' },
            { label: 'Examinations', id: 'examinations' }, { label: 'Research', id: 'research' }, { label: 'Team', id: 'team' },
          ].map(l => (
            <button key={l.id} onClick={() => { scrollTo(l.id); setMobileMenuOpen(false) }} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 11, padding: '13px 18px', fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)', cursor: 'pointer', textAlign: 'left', fontFamily: FONT, transition: 'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.color = '#a78bfa' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)' }}>
              {l.label}
            </button>
          ))}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button className="btn-ghost" onClick={() => navigate('/auth/login')} style={{ padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#fff' }}>Sign In</button>
            <button className="btn-primary" onClick={() => navigate('/auth/login')} style={{ padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>Get Started <MdArrowForward size={16} /></button>
          </div>
        </div>
      )}

      {/* ── 3. Hero ─────────────────────────────────────────────────────────── */}
      <section className={D ? 'hero-bg' : 'hero-bg-light'} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', paddingTop: navH + 40, paddingBottom: 80, padding: isMobile ? `${navH + 40}px 24px 80px` : `${navH + 40}px 48px 80px`, transition: 'background 0.35s ease' }}>
        {/* Aurora conic mesh — dark only */}
        {D && <div className="aurora-mesh" style={{ position:'absolute', width:'140%', height:'140%', top:'50%', left:'50%', pointerEvents:'none', zIndex:0 }} />}
        {/* Film grain noise */}
        {D && <div className="noise-layer" style={{ zIndex:1 }} />}
        {/* Grid overlay */}
        <div className={D ? 'grid-overlay' : 'grid-overlay-light'} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex:1 }} />

        {/* Star particles — dark only */}
        {D && <StarField />}

        {/* Animated glow orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)', animation: 'heroGlow 5s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', animation: 'heroGlow 7s ease-in-out infinite 2s', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '45%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', animation: 'heroGlow 6s ease-in-out infinite 1s', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '70%', left: '15%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', animation: 'heroGlow 8s ease-in-out infinite 3s', pointerEvents: 'none' }} />

        {/* Decorative rotating rings */}
        <div style={{ position: 'absolute', top: '15%', right: '10%', width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(99,102,241,0.14)', animation: 'spinSlow 30s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '12%', right: '7%', width: 360, height: 360, borderRadius: '50%', border: '1px dashed rgba(139,92,246,0.09)', animation: 'spinSlow 45s linear infinite reverse', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '8%', right: '4%', width: 430, height: 430, borderRadius: '50%', border: '1px solid rgba(52,211,153,0.05)', animation: 'spinSlow 60s linear infinite', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: isMobile ? 48 : 80, flexDirection: isMobile ? 'column' : 'row', position: 'relative', zIndex: 1 }}>

          {/* Left: Copy */}
          <div style={{ flex: 1 }}>
            {/* Live badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '7px 18px', marginBottom: 32, animation: 'badgeEntrance .65s cubic-bezier(.22,1,.36,1) both' }}>
              <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 10, height: 10 }}>
                <span style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: '#10b981', opacity: .6, animation: 'ripplePulse 2s ease-out infinite' }} />
                <span style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: '#10b981', opacity: .4, animation: 'ripplePulse 2s ease-out infinite .7s' }} />
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', display: 'inline-block', position: 'relative', zIndex: 1 }} />
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.w88 }}>Student · Staff · Parent · Alumni · Admin</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: isMobile ? 'clamp(34px,10vw,52px)' : 'clamp(44px,5vw,72px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2px', color: D ? '#fff' : '#0f172a', marginBottom: 24, animation: 'zoomIn .7s ease .1s both', transition: 'color 0.35s' }}>
              The Campus Platform<br />
              <span style={{ fontSize: isMobile ? 'clamp(28px,8vw,42px)' : 'clamp(36px,4vw,58px)', fontWeight: 700, color: D ? 'rgba(255,255,255,0.5)' : 'rgba(15,23,42,0.45)', letterSpacing: '-1px' }}>built for </span>
              <Typewriter />
            </h1>

            {/* Sub */}
            <p style={{ fontSize: isMobile ? 16 : 19, color: D ? 'rgba(255,255,255,0.58)' : '#475569', lineHeight: 1.75, maxWidth: 520, marginBottom: 40, fontWeight: 400, animation: 'zoomIn .7s ease .2s both', transition: 'color 0.35s' }}>
              One unified platform for every role in your institution —
              from academics and research to payroll and alumni. 50+ features, zero friction.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48, animation: 'zoomIn .7s ease .3s both', flexDirection: isMobile ? 'column' : 'row' }}>
              <button className="btn-primary" onClick={() => navigate('/auth/login')} style={{ padding: '15px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Get Started Free <MdArrowForward size={18} />
              </button>
              <button className="btn-ghost" onClick={() => scrollTo('features')} style={{ padding: '15px 28px', borderRadius: 12, fontSize: 16, fontWeight: 700, color: D ? '#fff' : '#0f172a', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <MdSpeed size={18} /> Explore Features
              </button>
            </div>

            {/* Trust row */}
            <div style={{ animation: 'zoomIn .7s ease .4s both' }}>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 18 }}>
                {[{ icon: MdShield, text: 'Enterprise Secure' }, { icon: MdCheck, text: 'Role-Based Access' }, { icon: MdPublic, text: '24/7 Online' }, { icon: MdSpeed, text: 'Real-Time Sync' }].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, color: D ? 'rgba(255,255,255,0.52)' : '#64748b', fontSize: 13 }}>
                    <Icon style={{ fontSize: 14, color: '#a78bfa' }} />{text}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {['Admin', 'Student', 'Faculty', 'Parent', 'Alumni'].map((role, i) => (
                  <div key={role} style={{ width: 28, height: 28, borderRadius: '50%', background: ['#f87171','#60a5fa','#c084fc','#fbbf24','#34d399'][i] + '22', border: `1.5px solid ${['#f87171','#60a5fa','#c084fc','#fbbf24','#34d399'][i]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: ['#f87171','#60a5fa','#c084fc','#fbbf24','#34d399'][i], marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i }}>{role.slice(0,2).toUpperCase()}</div>
                ))}
                <span style={{ fontSize: 12, color: D ? 'rgba(255,255,255,0.4)' : '#94a3b8', marginLeft: 6 }}>5 portals · 1 unified system</span>
              </div>
            </div>
          </div>

          {/* Right: Dashboard widget */}
          {!isMobile && (
            <div style={{ flex: '0 0 420px', position: 'relative', animation: 'float 7s ease-in-out infinite' }}>
              <GlassCard style={{ padding: 24 }} hover={false}>
                {/* Widget header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginBottom: 2 }}>Student Portal</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Sem 6 &mdash; CSE &apos;A&apos;</div>
                  </div>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MdDashboard style={{ fontSize: 20, color: '#a78bfa' }} />
                  </div>
                </div>

                {/* Stat chips */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                  {[{ l: 'Attendance', v: '87.5%', c: '#34d399', bg: 'rgba(16,185,129,.12)' }, { l: 'CGPA', v: '8.74', c: '#a78bfa', bg: 'rgba(99,102,241,.12)' }, { l: 'Pending', v: '3', c: '#fbbf24', bg: 'rgba(245,158,11,.12)' }].map(s => (
                    <div key={s.l} style={{ background: s.bg, borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
                      <div style={{ fontSize: 19, fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4, fontWeight: 500 }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* Semester GPA bars */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 10, fontWeight: 700, letterSpacing: '.08em' }}>SEMESTER GPA</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 52 }}>
                    {[7.8, 8.1, 8.5, 8.3, 8.6, 8.74].map((v, i) => {
                      const h = Math.round(((v - 7) / 3) * 100 * 0.44 + 10)
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: '100%', borderRadius: '4px 4px 0 0', height: h, background: i === 5 ? 'linear-gradient(180deg,#a78bfa,#6366f1)' : 'rgba(99,102,241,0.28)' }} />
                          <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', fontWeight: 600 }}>S{i + 1}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Activity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[{ t: 'Digital Assignment Upload', c: 'Academics', tag: 'Due Today', tc: '#fbbf24' }, { t: 'End Semester Exam', c: 'Examinations', tag: 'Jun 20', tc: '#f87171' }, { t: 'Fee Payment', c: 'Finance', tag: '₹47,500', tc: '#34d399' }].map(item => (
                    <div key={item.t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '9px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.82)', marginBottom: 2 }}>{item.t}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', fontWeight: 500 }}>{item.c}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: item.tc, background: `${item.tc}18`, border: `1px solid ${item.tc}30`, padding: '3px 8px', borderRadius: 20 }}>{item.tag}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Floating badges */}
              <div style={{ position: 'absolute', top: -18, right: -18, background: 'linear-gradient(135deg,rgba(16,185,129,.92),rgba(5,150,105,.92))', border: '1px solid rgba(16,185,129,.4)', borderRadius: 100, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 20px rgba(16,185,129,.5)', animation: 'floatSlow 5s ease-in-out infinite .5s' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>CGPA +0.4 this sem</span>
              </div>
              <div style={{ position: 'absolute', bottom: -18, left: -18, background: 'rgba(99,102,241,.88)', border: '1px solid rgba(99,102,241,.45)', borderRadius: 100, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 20px rgba(99,102,241,.45)', animation: 'floatSlow 6s ease-in-out infinite 1s' }}>
                <MdMenuBook style={{ fontSize: 13, color: '#fff' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>80+ Features</span>
              </div>
              <div style={{ position: 'absolute', top: '45%', left: -24, background: 'rgba(245,158,11,.88)', border: '1px solid rgba(245,158,11,.4)', borderRadius: 100, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 20px rgba(245,158,11,.4)', animation: 'floatSlow 7s ease-in-out infinite 1.8s' }}>
                <MdNotificationsActive style={{ fontSize: 13, color: '#fff' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>3 new alerts</span>
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', animation: 'bounce 2.2s ease-in-out infinite', opacity: .45, cursor: 'pointer' }} onClick={() => scrollTo('marquee')}>
          <div style={{ width: 24, height: 38, border: '2px solid rgba(255,255,255,.3)', borderRadius: 12, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 3, height: 8, borderRadius: 2, background: 'rgba(255,255,255,.6)' }} />
          </div>
        </div>
      </section>

      {/* ── 4. Dual-Row Marquee ─────────────────────────────────────────────── */}
      <div id="marquee" style={{ background: 'linear-gradient(90deg,#4f46e5,#7c3aed,#4f46e5)', backgroundSize: '200% 100%', animation: 'gradFlow 6s ease infinite', padding: '14px 0', overflow: 'hidden', position: 'relative' }}>
        {/* Fade edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(90deg,#4f46e5,transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(270deg,#4f46e5,transparent)', zIndex: 2, pointerEvents: 'none' }} />
        {/* Row 1 — left to right */}
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 30s linear infinite', marginBottom: 10 }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={`r1-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 26px', whiteSpace: 'nowrap' }}>
              <MdAutoAwesome style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{item}</span>
            </div>
          ))}
        </div>
        {/* Row 2 — right to left */}
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 24s linear infinite reverse' }}>
          {[...MARQUEE_ITEMS_ROW2, ...MARQUEE_ITEMS_ROW2, ...MARQUEE_ITEMS_ROW2].map((item, i) => (
            <div key={`r2-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 26px', whiteSpace: 'nowrap' }}>
              <MdStar style={{ fontSize: 11, color: T.p, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.78)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Stats ────────────────────────────────────────────────────────── */}
      <section style={{ background: T.s1, padding: isMobile ? '64px 20px' : '88px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        {D && <div style={{ position: 'absolute', top: '50%', left: '50%', width: 700, height: 700, borderRadius: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 60%)', pointerEvents: 'none' }} />}
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: T.tb, color: T.tc, border: `1px solid ${T.tbd}`, marginBottom: 16, margin: '0 auto 16px' }}>
                <MdAnalytics size={14} /> Platform by the numbers
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3vw,40px)', fontWeight: 800, color: T.h, letterSpacing: '-.8px' }}>
                Built for modern educational institutions
              </h2>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 20 }}>
            {[
              { val: 80,  suf: '+', label: 'Features',     sublabel: 'across all portals', color: '#818cf8' },
              { val: 5,   suf: '',  label: 'User Portals', sublabel: 'role-based dashboards', color: '#c084fc' },
              { val: 15,  suf: '',  label: 'Modules',      sublabel: 'fully integrated', color: '#34d399' },
              { val: 100, suf: '%', label: 'Secure',       sublabel: 'JWT + bcrypt', color: '#fbbf24' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div className="stat-card" style={{ background: D ? `${s.color}10` : '#fff', border: `1.5px solid ${s.color}25`, borderRadius: 20, padding: '32px 18px', textAlign: 'center', boxShadow: D ? `0 4px 24px ${s.color}12` : `0 2px 12px rgba(0,0,0,0.06)` }}>
                  <RingCounter target={s.val} suffix={s.suf} color={s.color} size={110} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.h, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: T.f, fontWeight: 500 }}>{s.sublabel}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Features Bento Grid ──────────────────────────────────────────── */}
      <section id="features" style={{ background: T.s3, padding: isMobile ? '64px 20px' : '96px 48px', transition: 'background 0.35s' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: T.tb, color: T.tc, border: `1px solid ${T.tbd}`, marginBottom: 18, margin: '0 auto 18px' }}>
                <MdLayers size={14} /> 80+ Core Features
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,46px)', fontWeight: 800, color: T.h, letterSpacing: '-1px', marginBottom: 16 }}>
                Everything your college needs
              </h2>
              <p style={{ fontSize: 17, color: T.p, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                From curriculum tracking to research thesis submission — College ERP covers every aspect of campus life.
              </p>
            </div>
          </Reveal>

          {/* Feature grid — 4 cols, all equal size, stretch rows */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: 18, alignItems: 'stretch' }}>
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon
              return (
                <Reveal key={feat.title} delay={i * 40} wrapStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div
                    className="feature-card"
                    style={{
                      background: T.cb,
                      borderRadius: 18,
                      padding: '26px 24px',
                      border: `1.5px solid ${T.cbb}`,
                      boxShadow: D ? '0 4px 24px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.06)',
                      position: 'relative',
                      overflow: 'hidden',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.border = `1.5px solid ${feat.color}50`
                      e.currentTarget.style.boxShadow = `0 20px 44px ${feat.color}25`
                      e.currentTarget.style.transform = 'translateY(-7px) scale(1.01)'
                      e.currentTarget.style.background = feat.bg
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.border = `1.5px solid ${T.cbb}`
                      e.currentTarget.style.boxShadow = D ? '0 4px 24px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.06)'
                      e.currentTarget.style.transform = 'none'
                      e.currentTarget.style.background = T.cb
                    }}
                  >
                    {/* Subtle bg gradient */}
                    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 75% 15%, ${feat.color}08 0%, transparent 55%)`, pointerEvents: 'none' }} />
                    {feat.badge && (
                      <div style={{ position: 'absolute', top: 14, right: 14, background: 'linear-gradient(135deg,#ec4899,#8b5cf6)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 20, letterSpacing: '.06em' }}>{feat.badge}</div>
                    )}
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: feat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, flexShrink: 0 }}>
                      <Icon style={{ fontSize: 28, color: feat.color }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: T.h, marginBottom: 10 }}>{feat.title}</h3>
                    <p style={{ fontSize: 14, color: T.p, lineHeight: 1.65, margin: 0, flex: 1 }}>{feat.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
          {/* Bottom CTA row */}
          <Reveal delay={500}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 44, paddingTop: 36, borderTop: `1px solid ${T.bd6}` }}>
              <span style={{ fontSize: 14, color: T.w40 }}>Covers every campus workflow end-to-end</span>
              <button className="btn-primary" onClick={() => navigate('/auth/login')} style={{ padding: '11px 26px', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
                Access All Features <MdArrowForward size={16} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ background: T.s1, padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        {D && <div className="grid-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .4 }} />}
        {D && <div style={{ position: 'absolute', top: '50%', left: '50%', width: 600, height: 600, borderRadius: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 60%)', pointerEvents: 'none' }} />}
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div className="section-tag" style={{ background: 'rgba(99,102,241,0.12)', color: '#a78bfa', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdHowToReg size={14} /> Simple Onboarding
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,46px)', fontWeight: 800, color: T.h, letterSpacing: '-1px', marginBottom: 16 }}>
                Get started in <GradText from="#a78bfa" to="#34d399">4 simple steps</GradText>
              </h2>
              <p style={{ fontSize: 17, color: T.w48, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
                From first login to full campus management — it only takes minutes.
              </p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: isMobile ? 20 : 0, position: 'relative' }}>
            {!isMobile && (
              <div style={{ position: 'absolute', top: 44, left: '12.5%', right: '12.5%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.5),rgba(139,92,246,0.5),rgba(16,185,129,0.5),rgba(245,158,11,0.5),transparent)', zIndex: 0 }} />
            )}
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon
              return (
                <Reveal key={step.step} delay={i * 100}>
                  <div style={{ padding: isMobile ? '0' : '0 20px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 88, height: 88, borderRadius: '50%', background: `${step.color}15`, border: `2px solid ${step.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', position: 'relative', boxShadow: `0 0 32px ${step.color}20` }}>
                      <Icon style={{ fontSize: 36, color: step.color }} />
                      <div style={{ position: 'absolute', top: -10, right: -10, width: 28, height: 28, borderRadius: '50%', background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff' }}>{step.step}</div>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: T.h, marginBottom: 10 }}>{step.title}</div>
                    <div style={{ fontSize: 13, color: T.w45, lineHeight: 1.7, maxWidth: 220, margin: '0 auto' }}>{step.desc}</div>
                  </div>
                </Reveal>
              )
            })}
          </div>
          <Reveal delay={400}>
            <div style={{ textAlign: 'center', marginTop: 52 }}>
              <button className="btn-primary" onClick={() => navigate('/auth/login')} style={{ padding: '14px 36px', borderRadius: 12, fontSize: 15, fontWeight: 700, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                Start Now <MdArrowForward size={18} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Comparison: Traditional vs College ERP ──────────────────────────── */}
      <section style={{ background: T.s3, padding: isMobile ? '64px 20px' : '88px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div className="section-tag" style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.22)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdVerified size={14} /> Why College ERP
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: T.h, letterSpacing: '-1px', marginBottom: 14 }}>
                Traditional vs <GradText from="#a78bfa" to="#34d399">College ERP</GradText>
              </h2>
              <p style={{ fontSize: 16, color: T.w45, maxWidth: 460, margin: '0 auto' }}>
                See exactly what gets replaced when you switch.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ background: T.cbg3, border: `1px solid ${T.bd7}`, borderRadius: 20, overflowX: 'auto' }}>
              <div style={{ minWidth: isMobile ? 560 : 'auto' }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: T.cbg4, padding: '16px 28px', borderBottom: `1px solid ${T.bd7}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.w40, textTransform: 'uppercase', letterSpacing: '.08em' }}>Category</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '.08em' }}>Traditional</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '.08em' }}>College ERP</div>
              </div>
              {COMPARISON_ROWS.map((row, i) => (
                <div key={row.category} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px 28px', borderBottom: `1px solid ${T.bd5}`, alignItems: 'center', gap: 12, background: i % 2 === 0 ? (D ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)') : 'transparent', transition: 'background .2s' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.w72 }}>{row.category}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontSize: 10, color: '#f87171', fontWeight: 800 }}>✕</span>
                    </div>
                    <span style={{ fontSize: 12, color: T.w38, lineHeight: 1.5 }}>{row.old}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <MdCheck style={{ fontSize: 11, color: '#34d399' }} />
                    </div>
                    <span style={{ fontSize: 12, color: T.w75, lineHeight: 1.5, fontWeight: 500 }}>{row.erp}</span>
                  </div>
                </div>
              ))}
              {/* Winner summary strip */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px 28px', background: 'rgba(52,211,153,0.06)', borderTop: '1px solid rgba(52,211,153,0.15)', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.w50, textTransform: 'uppercase', letterSpacing: '.06em' }}>Result</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 11, color: '#f87171', fontWeight: 800 }}>0</span></div>
                  <span style={{ fontSize: 12, color: '#f87171', fontWeight: 600 }}>Manual & fragmented</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(52,211,153,0.2)', border: '1px solid rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 10, color: '#34d399', fontWeight: 900 }}>✓</span></div>
                  <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>Unified, digital, instant</span>
                </div>
              </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 7. Portal Section ───────────────────────────────────────────────── */}
      <section id="portals" style={{ background: T.s2, padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        <div className="grid-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .5 }} />
        <div style={{ position: 'absolute', top: '30%', left: '50%', width: 700, height: 700, borderRadius: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(99,102,241,0.12)', color: '#a78bfa', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdGroups size={14} /> 5 Dedicated Portals
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 800, color: T.h, letterSpacing: '-1.5px', marginBottom: 16 }}>
                Choose Your Portal
              </h2>
              <p style={{ fontSize: 17, color: T.p, maxWidth: 500, margin: '0 auto' }}>
                Each portal is purpose-built for your specific role in the institution.
              </p>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(5,1fr)', gap: 18 }}>
            {PORTALS.map((p, i) => {
              const Icon = p.icon
              const hov = hovPortal === p.key
              return (
                <Reveal key={p.key} delay={i * 80}>
                  <div
                    className="portal-card"
                    onMouseEnter={() => setHovPortal(p.key)}
                    onMouseLeave={() => setHovPortal(null)}
                    style={{
                      background: hov ? p.bg : T.cb,
                      border: `1px solid ${hov ? p.color + '50' : T.cbb}`,
                      borderRadius: 18,
                      padding: '28px 20px',
                      display: 'flex', flexDirection: 'column', gap: 16,
                      boxShadow: hov ? `0 24px 48px ${p.color}20` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: `${p.color}20`, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon style={{ fontSize: 28, color: p.color }} />
                      </div>
                      <span style={{ background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30`, borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>{p.count} features</span>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: T.h }}>{p.label}</div>
                    <div style={{ fontSize: 12, color: T.p, lineHeight: 1.65, flex: 1 }}>{p.desc}</div>
                    <button onClick={() => navigate(`/auth/login?portal=${p.key}`)} style={{ padding: '10px', background: p.color, border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: `0 4px 16px ${p.color}45`, transition: 'opacity .15s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                      Login <MdArrowForward size={14} />
                    </button>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 8. Academics ────────────────────────────────────────────────────── */}
      <section id="academics" style={{ background: T.s3, padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 72, alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row', position: 'relative', zIndex: 1 }}>
          <Reveal dir="left" style={{ flex: '1 1 340px' }}>
            <div style={{ flex: '1 1 340px' }}>
              <div className="section-tag" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)', marginBottom: 24 }}>
                📚 Academics
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3vw,44px)', fontWeight: 800, color: T.h, marginBottom: 18, lineHeight: 1.15, letterSpacing: '-1px' }}>
                Complete Academic<br />Management — All in One
              </h2>
              <p style={{ fontSize: 16, color: T.p, lineHeight: 1.8, maxWidth: 440, marginBottom: 36 }}>
                From curriculum planning to project submissions, digital assignments to APAAR ID — every academic function managed in a single, intuitive portal.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ACADEMICS_GENERAL_ITEMS.slice(0, 15).map(item => (
                  <span key={item} className="chip" style={{ background: T.chBg, border: `1px solid ${T.chBd}`, padding: '5px 14px', fontSize: 12, fontWeight: 600, color: T.chC }}>{item}</span>
                ))}
                <span className="chip" style={{ background: T.cbg5, border: `1px solid ${T.bd8}`, padding: '5px 14px', fontSize: 12, color: T.w35, fontWeight: 500 }}>+{ACADEMICS_GENERAL_ITEMS.length - 15} more</span>
              </div>
            </div>
          </Reveal>

          <Reveal dir="right" delay={150} style={{ flex: '1 1 300px' }}>
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { title: 'General Academics', count: 19, color: '#818cf8', bg: 'rgba(99,102,241,.12)', icon: MdMenuBook, items: ['Curriculum', 'Timetable', 'Attendance', 'Digital Assignments', '+15 more'] },
                { title: 'Course Registration', count: 8, color: '#60a5fa', bg: 'rgba(59,130,246,.12)', icon: MdSchool, items: ['Wishlist', 'MOOC', 'EXC', 'Internship', '+4 more'] },
                { title: 'Project & Research', count: 6, color: '#c084fc', bg: 'rgba(168,85,247,.12)', icon: MdBadge, items: ['Open Projects', 'Proposals', 'Progress Review', '+3 more'] },
              ].map(card => {
                const Icon = card.icon
                return (
                  <div key={card.title} style={{ background: card.bg, border: `1px solid ${card.color}25`, borderRadius: 16, padding: '18px 20px', transition: 'all .25s cubic-bezier(.22,1,.36,1)', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = `${card.color}50`; e.currentTarget.style.boxShadow = `0 8px 24px ${card.color}15` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = `${card.color}25`; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon style={{ fontSize: 20, color: card.color }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.h }}>{card.title}</div>
                        <div style={{ fontSize: 11, color: card.color, fontWeight: 600 }}>{card.count} modules</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {card.items.map(item => (
                        <span key={item} style={{ background: `${card.color}10`, color: card.color, border: `1px solid ${card.color}20`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 500 }}>{item}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── LMS ─────────────────────────────────────────────────────────────── */}
      <section id="lms" style={{ background: T.s2, padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdCastForEducation size={14} /> Learning Management System
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: T.h, letterSpacing: '-1px', marginBottom: 16 }}>
                Digital Learning, <GradText from="#60a5fa" to="#a78bfa">Fully Integrated</GradText>
              </h2>
              <p style={{ fontSize: 17, color: T.w48, maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
                Courses, assignments, grades, and resources — all accessible from one unified learning hub for students and faculty alike.
              </p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: 18 }}>
            {LMS_FEATURES.map((feat, i) => {
              const Icon = feat.icon
              return (
                <Reveal key={feat.title} delay={i * 80}>
                  <div style={{ background: feat.bg, border: `1px solid ${feat.color}25`, borderRadius: 18, padding: '28px 22px', transition: 'all .3s cubic-bezier(.22,1,.36,1)', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 40px ${feat.color}20`; e.currentTarget.style.border = `1px solid ${feat.color}50` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.border = `1px solid ${feat.color}25` }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: `${feat.color}20`, border: `1px solid ${feat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                      <Icon style={{ fontSize: 30, color: feat.color }} />
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: T.h, marginBottom: 10 }}>{feat.title}</div>
                    <div style={{ fontSize: 13, color: T.p, lineHeight: 1.7 }}>{feat.desc}</div>
                  </div>
                </Reveal>
              )
            })}
          </div>
          {/* LMS dashboard mockup */}
          <Reveal delay={200}>
            <div style={{ marginTop: 40, background: T.cbg3, border: `1px solid ${T.bd7}`, borderRadius: 20, padding: isMobile ? '20px' : '28px 36px', display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MdComputer style={{ fontSize: 28, color: '#60a5fa' }} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.h }}>Active for all roles</div>
                  <div style={{ fontSize: 13, color: T.w40 }}>Students submit · Faculty grade · Admin oversee</div>
                </div>
              </div>
              {[{ label: 'Courses Available', val: '60+', color: '#60a5fa' }, { label: 'Assignments/sem', val: '200+', color: '#a78bfa' }, { label: 'Submission Rate', val: '98%', color: '#34d399' }].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: '-1px' }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: T.w35, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 9. Examinations ─────────────────────────────────────────────────── */}
      <section id="examinations" style={{ background: T.s4, padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        <div style={{ position: 'absolute', top: '-8%', right: '-4%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(239,68,68,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdAssignment size={14} /> Examination System
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: T.h, letterSpacing: '-1px', marginBottom: 16 }}>
                Complete Examination Management
              </h2>
              <p style={{ fontSize: 17, color: T.p, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                Regular, arrear, online and make-up exams — with full transparency on marks, grades and re-evaluation.
              </p>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: 18 }}>
            {EXAM_GROUPS.map((group, gi) => (
              <Reveal key={group.title} delay={gi * 80}>
                <div className="exam-card" style={{ background: `${group.color}08`, borderRadius: 16, padding: 24, border: `1.5px solid ${group.color}25`, borderTop: `3px solid ${group.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: group.color }}>{group.title}</span>
                    <span style={{ background: `${group.color}15`, color: group.color, fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20 }}>{group.items.length} modules</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {group.items.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${group.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <MdCheck style={{ fontSize: 11, color: group.color }} />
                        </div>
                        <span style={{ fontSize: 13, color: T.w65, fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Finance ─────────────────────────────────────────────────────── */}
      <section style={{ background: T.s3, padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdPayment size={14} /> Finance & Payments
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: T.h, letterSpacing: '-1px', marginBottom: 16 }}>
                Transparent Fee Management
              </h2>
              <p style={{ fontSize: 17, color: T.p, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                Complete financial visibility — from intimation to payments, wallet top-ups, and refund processing.
              </p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? '100%' : '220px'},1fr))`, gap: 18 }}>
            {FINANCE_ITEMS.map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={item.label} delay={i * 60}>
                  <div className="finance-card" style={{ background: `${item.color}0c`, borderRadius: 16, padding: '22px 20px', border: `1.5px solid ${item.color}20`, cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${item.color}18`; e.currentTarget.style.border = `1.5px solid ${item.color}45`; e.currentTarget.style.transform = 'translateY(-4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${item.color}0c`; e.currentTarget.style.border = `1.5px solid ${item.color}20`; e.currentTarget.style.transform = 'none' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${item.color}18`, border: `1.5px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <Icon style={{ fontSize: 24, color: item.color }} />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.h, marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: T.p, lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Employee & HR ───────────────────────────────────────────────────── */}
      <section id="hr" style={{ background: T.s2, padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        <div style={{ position: 'absolute', top: '-5%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-5%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdBusinessCenter size={14} /> HR & Administration
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: T.h, letterSpacing: '-1px', marginBottom: 16 }}>
                Complete <GradText from="#fbbf24" to="#f87171">HR Management</GradText> Suite
              </h2>
              <p style={{ fontSize: 17, color: T.w48, maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
                Employee management, leave workflows, and payroll — fully automated and integrated for admin teams.
              </p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 22 }}>
            {HR_MODULES.map((mod, i) => {
              const Icon = mod.icon
              return (
                <Reveal key={mod.title} delay={i * 100}>
                  <div style={{ background: mod.bg, border: `1.5px solid ${mod.color}25`, borderRadius: 20, padding: '28px 26px', transition: 'all .3s cubic-bezier(.22,1,.36,1)', cursor: 'default', height: '100%' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 24px 48px ${mod.color}18`; e.currentTarget.style.borderColor = `${mod.color}50` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = `${mod.color}25` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: `${mod.color}20`, border: `1px solid ${mod.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon style={{ fontSize: 28, color: mod.color }} />
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: T.h }}>{mod.title}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {mod.items.map(item => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${mod.color}18`, border: `1px solid ${mod.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <MdCheck style={{ fontSize: 12, color: mod.color }} />
                          </div>
                          <span style={{ fontSize: 13, color: T.w65, fontWeight: 500 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
          {/* Admin badge strip */}
          <Reveal delay={300}>
            <div style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Bulk CSV Import', 'Role-Based Access', 'Department Hierarchy', 'Payslip PDF Export', 'Audit Logs', 'Real-Time Sync'].map(badge => (
                <span key={badge} style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 600 }}>{badge}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 11. Services ────────────────────────────────────────────────────── */}
      <section style={{ background: T.s3, padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        <div style={{ position: 'absolute', top: '-8%', left: '50%', width: 600, height: 400, borderRadius: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse,rgba(245,158,11,0.08) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdMiscellaneousServices size={14} /> Student Services
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: T.h, letterSpacing: '-1px', marginBottom: 16 }}>
                Everything a Student Needs
              </h2>
              <p style={{ fontSize: 17, color: T.p, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                One-stop access to registrations, certificates, profile management, library, and more — zero paperwork.
              </p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? '100%' : '260px'},1fr))`, gap: 18 }}>
            {SERVICES_GROUPS.map((group, gi) => (
              <Reveal key={group.title} delay={gi * 70}>
                <div className="service-card" style={{ background: `${group.color}0a`, borderRadius: 18, padding: 24, border: `1.5px solid ${group.color}22`, borderTop: `3px solid ${group.color}`, cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = `${group.color}16`; e.currentTarget.style.borderColor = `${group.color}45`; e.currentTarget.style.boxShadow = `0 16px 36px ${group.color}15` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = `${group.color}0a`; e.currentTarget.style.borderColor = `${group.color}22`; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: T.h }}>{group.title}</span>
                    <span style={{ background: `${group.color}18`, color: group.color, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{group.items.length} items</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {group.items.map(item => (
                      <span key={item} style={{ background: `${group.color}12`, color: group.color, border: `1px solid ${group.color}25`, borderRadius: 20, padding: '4px 11px', fontSize: 12, fontWeight: 500 }}>{item}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Notifications ───────────────────────────────────────────────────── */}
      <section id="notifications" style={{ background: T.s2, padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(99,102,241,0.12)', color: '#a78bfa', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdNotificationsActive size={14} /> Smart Notifications
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: T.h, letterSpacing: '-1px', marginBottom: 16 }}>
                Stay informed. <GradText from="#a78bfa" to="#34d399">Always.</GradText>
              </h2>
              <p style={{ fontSize: 17, color: T.p, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                The right information reaches the right person at the right time — automatically, across every portal and role.
              </p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: 20 }}>
            {NOTIFICATION_FEATURES.map((feat, i) => {
              const Icon = feat.icon
              return (
                <Reveal key={feat.title} delay={i * 80}>
                  <div style={{ background: `${feat.color}08`, border: `1.5px solid ${feat.color}20`, borderRadius: 18, padding: '26px 22px', transition: 'all .3s cubic-bezier(.22,1,.36,1)', cursor: 'default', height: '100%' }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${feat.color}18`; e.currentTarget.style.border = `1.5px solid ${feat.color}50`; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 16px 36px ${feat.color}20` }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${feat.color}08`; e.currentTarget.style.border = `1.5px solid ${feat.color}20`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ width: 54, height: 54, borderRadius: 15, background: `${feat.color}18`, border: `1.5px solid ${feat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                      <Icon style={{ fontSize: 28, color: feat.color }} />
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: T.h, marginBottom: 10 }}>{feat.title}</div>
                    <div style={{ fontSize: 13, color: T.w50, lineHeight: 1.7 }}>{feat.desc}</div>
                  </div>
                </Reveal>
              )
            })}
          </div>
          {/* Live notification preview */}
          <Reveal delay={250}>
            <div style={{ marginTop: 40, background: T.cbg3, border: `1px solid ${T.bd8}`, borderRadius: 20, padding: isMobile ? '20px' : '28px 36px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.w30, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 18 }}>Live Notification Feed</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: MdAssignment, color: '#6366f1', text: 'Digital Assignment due in 2 hours — Data Structures (CS3201)', time: 'Just now', role: 'Student' },
                  { icon: MdCalendarToday, color: '#10b981', text: 'Leave request approved by HOD — Dr. Ravi Kumar', time: '5 min ago', role: 'Faculty' },
                  { icon: MdMonetizationOn, color: '#f59e0b', text: 'Payroll processed for March 2025 — 142 employees', time: '1 hr ago', role: 'Admin' },
                  { icon: MdSchool, color: '#f87171', text: 'End Semester Exam scheduled — June 20, Hall A', time: '3 hrs ago', role: 'Student' },
                ].map((notif, i) => {
                  const Icon = notif.icon
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: T.cbg4, borderRadius: 12, padding: '12px 16px', border: `1px solid ${T.bd7}` }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${notif.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon style={{ fontSize: 20, color: notif.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: T.w85 }}>{notif.text}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: notif.color, background: `${notif.color}12`, padding: '2px 8px', borderRadius: 20 }}>{notif.role}</span>
                        <span style={{ fontSize: 11, color: T.w35 }}>{notif.time}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 12. Research ────────────────────────────────────────────────────── */}
      <section id="research" style={{ background: T.s8, padding: isMobile ? '64px 20px' : '100px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        {/* Background glows */}
        <div style={{ position: 'absolute', top: '-12%', left: '-6%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.16) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-4%', width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.13) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '45%', right: '22%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(52,211,153,0.07) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div className="grid-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .25 }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Centered header */}
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(139,92,246,0.12)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.28)', marginBottom: 20, margin: '0 auto 20px' }}>
                <MdScience size={14} /> PhD & Research
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.8vw,54px)', fontWeight: 900, color: T.h, letterSpacing: '-1.5px', lineHeight: 1.08, marginBottom: 18 }}>
                Complete PhD Journey,<br /><GradText from="#c084fc" to="#34d399">One Platform</GradText>
              </h2>
              <p style={{ fontSize: 17, color: T.p, maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
                From first registration to final thesis submission — every milestone of the research scholar journey, digitally managed and fully trackable.
              </p>
            </div>
          </Reveal>

          {/* 4 Phase Journey Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 14, marginBottom: 24, position: 'relative' }}>
            {[
              { phase: '01', title: 'Registration', desc: 'PhD enrollment, profile & research area', icon: MdHowToReg, color: '#34d399', done: true },
              { phase: '02', title: 'Course Work', desc: 'Subject completion & grade tracking', icon: MdMenuBook, color: '#818cf8', done: true },
              { phase: '03', title: 'Research', desc: 'Guide meetings, workload & documents', icon: MdScience, color: '#a78bfa', active: true },
              { phase: '04', title: 'Thesis & Submit', desc: 'Electronic submission & research letters', icon: MdVerified, color: '#06b6d4' },
            ].map((p, i) => {
              const Icon = p.icon
              return (
                <Reveal key={p.phase} delay={i * 80} wrapStyle={{ zIndex: 1 }}>
                  <div style={{ background: p.active ? 'rgba(167,139,250,0.1)' : T.cbg3, border: `1px solid ${p.active ? 'rgba(167,139,250,0.4)' : p.done ? `${p.color}30` : T.bd7}`, borderRadius: 18, padding: '22px 16px', textAlign: 'center', transition: 'all .3s cubic-bezier(.22,1,.36,1)', cursor: 'default', position: 'relative', boxShadow: p.active ? '0 0 32px rgba(167,139,250,0.12)' : 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${p.color}12`; e.currentTarget.style.borderColor = `${p.color}50`; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 16px 32px ${p.color}15` }}
                    onMouseLeave={e => { e.currentTarget.style.background = p.active ? 'rgba(167,139,250,0.1)' : T.cbg3; e.currentTarget.style.borderColor = p.active ? 'rgba(167,139,250,0.4)' : p.done ? `${p.color}30` : T.bd7; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = p.active ? '0 0 32px rgba(167,139,250,0.12)' : 'none' }}>
                    {p.done && <div style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MdCheck style={{ fontSize: 11, color: '#34d399' }} /></div>}
                    {p.active && <div style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 10px #a78bfa', animation: 'pulse 2s infinite' }} />}
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${p.color}15`, border: `1.5px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: p.active ? `0 0 20px ${p.color}25` : 'none' }}>
                      <Icon style={{ fontSize: 26, color: p.color }} />
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: p.color, letterSpacing: '.1em', marginBottom: 6, textTransform: 'uppercase' }}>Phase {p.phase}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.h, marginBottom: 7 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: T.w40, lineHeight: 1.6 }}>{p.desc}</div>
                  </div>
                </Reveal>
              )
            })}
          </div>

          {/* Rich 3-col Dashboard */}
          <Reveal delay={180}>
            <GlassCard style={{ padding: isMobile ? '24px 18px' : '32px 36px' }} hover={false} isDark={D}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr 1fr', gap: isMobile ? 28 : 36 }}>

                {/* Col 1: PhD Journey Timeline */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: T.w28, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 22 }}>PhD Journey</div>
                  {[
                    { label: 'PhD Registration', sub: 'Enrolled Jul 2022', done: true },
                    { label: 'Course Work', sub: '4 subjects completed', done: true },
                    { label: 'Research Phase', sub: 'Guide: Dr. Arjun Nair', active: true },
                    { label: 'Thesis Writing', sub: 'Chapter 2 in progress' },
                    { label: 'Final Submission', sub: 'Est. Dec 2025' },
                  ].map((step, i, arr) => (
                    <div key={step.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: step.done ? 'rgba(52,211,153,0.12)' : step.active ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)', border: `2px solid ${step.done ? '#34d399' : step.active ? '#a78bfa' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: step.active ? '0 0 14px rgba(167,139,250,0.35)' : 'none', transition: 'all .3s' }}>
                          {step.done ? <MdCheck style={{ fontSize: 14, color: '#34d399' }} /> : step.active ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa', animation: 'pulse 2s infinite' }} /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />}
                        </div>
                        {i < arr.length - 1 && <div style={{ width: 2, height: 28, background: step.done ? 'linear-gradient(180deg,rgba(52,211,153,0.4),rgba(52,211,153,0.1))' : 'rgba(255,255,255,0.05)', margin: '3px 0', borderRadius: 1 }} />}
                      </div>
                      <div style={{ paddingBottom: i < arr.length - 1 ? 22 : 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: step.done ? T.h : step.active ? '#c4b5fd' : T.w35 }}>{step.label}</div>
                        <div style={{ fontSize: 11, color: step.active ? 'rgba(196,181,253,0.55)' : T.w22, marginTop: 2 }}>{step.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Col 2: Thesis Ring + Progress Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: isMobile ? 'none' : '1px solid rgba(255,255,255,0.06)', borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.06)', padding: isMobile ? '0' : '0 28px' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: T.w28, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>Thesis Progress</div>
                  <RingCounter target={35} suffix="%" color="#a78bfa" size={118} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.w45, marginBottom: 22, textAlign: 'center' }}>Chapter 2 of 5 complete</div>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[{ l: 'Course Work', v: 100, c: '#34d399' }, { l: 'Research Hours', v: 62, c: '#818cf8' }, { l: 'Guide Meetings', v: 75, c: '#06b6d4' }].map(bar => (
                      <div key={bar.l}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 11, color: T.w42, fontWeight: 500 }}>{bar.l}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: bar.c }}>{bar.v}%</span>
                        </div>
                        <div style={{ height: 4, background: T.bd6, borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${bar.v}%`, background: `linear-gradient(90deg,${bar.c}cc,${bar.c})`, borderRadius: 2, boxShadow: `0 0 6px ${bar.c}60` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Col 3: Activity + Mini Stats */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: T.w28, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Recent Activity</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                    {[
                      { text: 'Thesis Ch.2 submitted', time: '2h ago', color: '#34d399', icon: MdAssignment },
                      { text: 'Guide meeting logged', time: '1d ago', color: '#a78bfa', icon: MdPeople },
                      { text: 'Weekly workload filed', time: '3d ago', color: '#818cf8', icon: MdMenuBook },
                      { text: 'Research doc uploaded', time: '5d ago', color: '#06b6d4', icon: MdScience },
                    ].map((act, ai) => {
                      const AIcon = act.icon
                      return (
                        <div key={ai} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '9px 11px', background: T.cbg3, borderRadius: 10, border: `1px solid ${T.bd5}` }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${act.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <AIcon style={{ fontSize: 14, color: act.color }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11.5, fontWeight: 600, color: T.w70, lineHeight: 1.3 }}>{act.text}</div>
                            <div style={{ fontSize: 10, color: T.w25, marginTop: 2 }}>{act.time}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[{ label: 'Years Enrolled', val: '2.5', color: '#a78bfa' }, { label: 'Publications', val: '3', color: '#34d399' }].map(stat => (
                      <div key={stat.label} style={{ background: `${stat.color}10`, border: `1px solid ${stat.color}22`, borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 900, color: stat.color, letterSpacing: '-0.5px' }}>{stat.val}</div>
                        <div style={{ fontSize: 10, color: T.w35, marginTop: 3, fontWeight: 500 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </Reveal>

          {/* Feature chips strip */}
          <Reveal delay={280}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 28 }}>
              {RESEARCH_ITEMS.map(item => (
                <span key={item} className="chip" style={{ background: 'rgba(139,92,246,0.09)', border: '1px solid rgba(139,92,246,0.22)', padding: '6px 16px', fontSize: 12, fontWeight: 600, color: '#c4b5fd' }}>{item}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 13. Meet the Team ───────────────────────────────────────────────── */}
      <section id="team" style={{ background: T.s1, padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div className="section-tag" style={{ background: 'rgba(99,102,241,0.12)', color: '#a78bfa', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdGroups size={14} /> The Builders
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: T.h, letterSpacing: '-1px', marginBottom: 16 }}>
                Meet the Team
              </h2>
              <p style={{ fontSize: 17, color: T.p, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                The passionate people who designed, built, and launched College ERP.
              </p>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 28, maxWidth: 980, margin: '0 auto' }}>
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 100}>
                <div className="team-card" style={{ background: T.cb, borderRadius: 22, padding: '36px 30px', textAlign: 'center', border: `1.5px solid ${T.cbb}`, boxShadow: '0 4px 32px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 24px 48px ${m.glow}` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05)' }}>
                  {/* Gradient bg accent */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: `linear-gradient(135deg, ${m.glow.replace('.4)', '.08)')} 0%, transparent 100%)`, pointerEvents: 'none' }} />
                  {/* Avatar */}
                  <div style={{ width: 84, height: 84, borderRadius: '50%', background: m.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 30, fontWeight: 900, color: '#fff', boxShadow: `0 10px 28px ${m.glow}`, position: 'relative', zIndex: 1 }}>
                    {m.initials}
                  </div>
                  {/* Tag */}
                  <span style={{ display: 'inline-block', background: `${m.tagColor}12`, color: m.tagColor, border: `1px solid ${m.tagColor}25`, fontSize: 10, fontWeight: 800, padding: '3px 12px', borderRadius: 20, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 14 }}>
                    {m.tag}
                  </span>
                  <div style={{ fontSize: 20, fontWeight: 800, color: T.h, marginBottom: 6 }}>{m.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: m.tagColor, marginBottom: 18 }}>{m.role}</div>
                  <div style={{ height: 1, background: T.bd7, marginBottom: 18 }} />
                  <p style={{ fontSize: 13, color: T.w50, lineHeight: 1.7, margin: 0 }}>{m.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section style={{ background: T.s3, padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 800, height: 400, borderRadius: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(ellipse,rgba(99,102,241,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(139,92,246,0.12)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdStar size={14} /> User Stories
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: T.h, letterSpacing: '-1px', marginBottom: 14 }}>
                Loved by every role
              </h2>
              <p style={{ fontSize: 17, color: T.w45, maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
                From students to administrators — see what real users say about College ERP.
              </p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <GlassCard style={{ padding: '32px 28px' }} isDark={D}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[...Array(5)].map((_, si) => (
                        <MdStar key={si} style={{ fontSize: 16, color: '#fbbf24', filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.5))' }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 56, fontWeight: 900, color: 'rgba(167,139,250,0.18)', lineHeight: .8, fontFamily: 'Georgia, serif' }}>&ldquo;</div>
                  </div>
                  <p style={{ fontSize: 15, color: T.w72, lineHeight: 1.8, marginBottom: 24, marginTop: 0 }}>{t.quote}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${t.color}25`, border: `2px solid ${t.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: t.color, flexShrink: 0 }}>{t.initials}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.h }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: T.w40, marginTop: 2 }}>{t.role}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', background: `${t.color}15`, color: t.color, border: `1px solid ${t.color}30`, borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{t.portal}</span>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section style={{ background: T.s2, padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden', transition: 'background 0.35s' }}>
        <div className="grid-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .35 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div className="section-tag" style={{ background: 'rgba(99,102,241,0.12)', color: '#a78bfa', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdFeedback size={14} /> Got Questions
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: T.h, letterSpacing: '-1px', marginBottom: 14 }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize: 17, color: T.w45, maxWidth: 460, margin: '0 auto' }}>
                Everything you need to know about College ERP.
              </p>
            </div>
          </Reveal>
          <FAQAccordion items={FAQS} />
        </div>
      </section>

      {/* ── 14. Final CTA ───────────────────────────────────────────────────── */}
      <section style={{ background: T.sCta, padding: isMobile ? '72px 20px' : '112px 48px', position: 'relative', overflow: 'hidden', textAlign: 'center', transition: 'background 0.35s' }}>
        <div className="grid-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '7px 18px', marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: T.w78 }}>Ready to modernize your campus?</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 style={{ fontSize: isMobile ? 'clamp(32px,10vw,48px)' : 'clamp(36px,5vw,64px)', fontWeight: 900, color: T.h, letterSpacing: '-2px', lineHeight: 1.08, marginBottom: 20 }}>
              Start managing your college&nbsp;
              <GradText from="#a78bfa" to="#34d399">smarter today</GradText>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: 18, color: T.p, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 48px' }}>
              Join students, faculty, and administrators already using College ERP to streamline every campus workflow.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
              <button className="btn-primary" onClick={() => navigate('/auth/login')} style={{ padding: '17px 40px', borderRadius: 14, fontSize: 17, fontWeight: 800, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                Get Started Free <MdArrowForward size={20} />
              </button>
              <button className="btn-ghost" onClick={() => scrollTo('how-it-works')} style={{ padding: '17px 28px', borderRadius: 14, fontSize: 15, fontWeight: 600, color: D ? '#fff' : '#374151', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                How it works
              </button>
            </div>
            {/* Demo credentials quick ref */}
            <div style={{ background: T.cbg4, border: `1px solid ${T.bd8}`, borderRadius: 14, padding: '16px 24px', maxWidth: 560, margin: '0 auto 40px', display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: T.w40, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Try demo →</span>
              {[{ role: 'Admin', email: 'demo@college.com', color: '#f87171' }, { role: 'Student', email: 'student@demo.com', color: '#60a5fa' }, { role: 'Faculty', email: 'staff@demo.com', color: '#c084fc' }].map(d => (
                <div key={d.role} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ background: `${d.color}15`, color: d.color, border: `1px solid ${d.color}30`, borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>{d.role}</span>
                  <span style={{ fontSize: 11, color: T.w42, fontFamily: 'monospace' }}>{d.email}</span>
                </div>
              ))}
              <span style={{ fontSize: 11, color: T.w28 }}>pw: Demo@123</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
              {[{ icon: MdShield, t: 'Enterprise Secure' }, { icon: MdCheck, t: 'Role-Based Access' }, { icon: MdPublic, t: '24/7 Available' }, { icon: MdAccessTime, t: 'Real-Time Sync' }].map(({ icon: Icon, t }) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, color: T.w40, fontSize: 13 }}>
                  <Icon style={{ fontSize: 14, color: '#a78bfa' }} />{t}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 15. Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ background: T.foot, padding: isMobile ? '56px 20px 0' : '80px 48px 0', transition: 'background 0.35s' }}>
        {/* Gradient top border */}
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.6),rgba(139,92,246,0.6),transparent)', marginBottom: 60 }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2.2fr 1fr 1fr 1.4fr', gap: 52, paddingBottom: 56, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
                <MdSchool style={{ color: '#fff', fontSize: 22 }} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>College<span style={{ color: '#a78bfa' }}>ERP</span></div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>v2.0 — Modern Campus Platform</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.58)', lineHeight: 1.85, maxWidth: 280, marginBottom: 22 }}>
              A comprehensive college management platform for modern educational institutions. Academics, exams, finance, research — all in one place.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {['React 18', 'Spring Boot', 'PostgreSQL', 'Docker', 'JWT'].map(tech => (
                <span key={tech} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.12)', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{tech}</span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '.1em' }}>Quick Links</div>
            {[{ label: 'Features', id: 'features' }, { label: 'How It Works', id: 'how-it-works' }, { label: 'Academics', id: 'academics' }, { label: 'LMS', id: 'lms' }, { label: 'HR & Payroll', id: 'hr' }, { label: 'Examinations', id: 'examinations' }, { label: 'Research', id: 'research' }, { label: 'Team', id: 'team' }].map(l => (
              <div key={l.label} style={{ marginBottom: 11 }}>
                <button onClick={() => scrollTo(l.id)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 14, color: 'rgba(255,255,255,0.62)', cursor: 'pointer', fontFamily: FONT, transition: 'color .18s' }}
                  onMouseEnter={e => e.target.style.color = '#a78bfa'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.62)'}>
                  {l.label}
                </button>
              </div>
            ))}
          </div>

          {/* Portals */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '.1em' }}>Portals</div>
            {PORTALS.map(p => (
              <div key={p.key} style={{ marginBottom: 11, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0, boxShadow: `0 0 6px ${p.color}80` }} />
                <button onClick={() => navigate(`/auth/login?portal=${p.key}`)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 14, color: 'rgba(255,255,255,0.62)', cursor: 'pointer', fontFamily: FONT, transition: 'color .18s' }}
                  onMouseEnter={e => e.target.style.color = p.color}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.62)'}>
                  {p.label} Portal
                </button>
              </div>
            ))}
          </div>

          {/* CTA column */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '.1em' }}>Get Started</div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.58)', lineHeight: 1.8, marginBottom: 20 }}>Sign in to your portal to access your personalized dashboard.</p>
            <button className="btn-primary" onClick={() => navigate('/auth/login')} style={{ padding: '12px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 7, width: '100%', justifyContent: 'center' }}>
              Sign In <MdArrowForward size={15} />
            </button>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 11 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'rgba(255,255,255,0.62)' }}>
                <MdEmail size={15} style={{ color: '#a78bfa', flexShrink: 0 }} /> contact@collegeerp.in
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'rgba(255,255,255,0.62)' }}>
                <MdRocketLaunch size={15} style={{ color: '#34d399', flexShrink: 0 }} /> Chennai, Tamil Nadu, India
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 0', display: 'flex', justifyContent: isMobile ? 'center' : 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>
            © 2025 College ERP · Built with ❤️ in Chennai, India
          </span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service', 'Support'].map(l => (
              <span key={l} style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', cursor: 'pointer', transition: 'color .18s' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}
