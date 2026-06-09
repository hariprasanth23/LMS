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
function Reveal({ children, delay = 0, dir = 'up' }) {
  const [ref, inView] = useInView()
  const from = { up: 'translateY(28px)', left: 'translateX(-28px)', right: 'translateX(28px)', scale: 'scale(0.93)' }[dir] || 'translateY(28px)'
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translate(0) scale(1)' : from,
      transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.8s cubic-bezier(.22,1,.36,1)', filter: `drop-shadow(0 0 7px ${color})` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{count}{suffix}</span>
      </div>
    </div>
  )
}

// ── Glass card ─────────────────────────────────────────────────────────────────
function GlassCard({ children, style = {}, hover = true }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${hov ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 20,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: hov ? '0 24px 48px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.1)' : '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
        transform: hov ? 'translateY(-4px)' : 'none',
        transition: 'all 0.3s cubic-bezier(.22,1,.36,1)',
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
  { icon: MdMenuBook,            title: 'Academic Management',  desc: 'Curriculum, timetable, attendance, class messages, biometric info and faculty directory.',             color: '#818cf8', bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.25)',  span: 2 },
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
  { key: 'admin',   label: 'Admin',   icon: MdAdminPanelSettings, color: '#f87171', bg: 'rgba(239,68,68,0.15)',   desc: 'Full system administration, employee management, payroll, departments & bulk imports.' },
  { key: 'student', label: 'Student', icon: MdSchool,             color: '#60a5fa', bg: 'rgba(59,130,246,0.15)',  desc: 'Academic portal — courses, attendance, exams, fees, research & personal profile.' },
  { key: 'staff',   label: 'Staff',   icon: MdBadge,              color: '#c084fc', bg: 'rgba(168,85,247,0.15)',  desc: 'Teaching tools — course management, assignments, marks entry & student feedback.' },
  { key: 'parent',  label: 'Parent',  icon: MdPeople,             color: '#fbbf24', bg: 'rgba(245,158,11,0.15)',  desc: 'Track ward progress — attendance, performance, fee status & announcements.' },
  { key: 'alumni',  label: 'Alumni',  icon: MdStar,               color: '#34d399', bg: 'rgba(16,185,129,0.15)', desc: 'Alumni network — updates, achievements, reconnect with the institution.' },
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
        <div key={i} style={{ border: `1px solid ${open === i ? 'rgba(139,92,246,0.45)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color .2s', background: open === i ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.03)' }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor: 'pointer', textAlign: 'left', gap: 16 }}>
            {item.q}
            <span style={{ flexShrink: 0, fontSize: 22, color: '#a78bfa', transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform .25s cubic-bezier(.22,1,.36,1)', lineHeight: 1 }}>+</span>
          </button>
          <div style={{ maxHeight: open === i ? 200 : 0, overflow: 'hidden', transition: 'max-height .38s cubic-bezier(.22,1,.36,1)' }}>
            <div style={{ padding: '0 22px 20px', fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}>{item.a}</div>
          </div>
        </div>
      ))}
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [])

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const navH = 64 + (announcement ? 36 : 0)

  return (
    <div style={{ fontFamily: FONT, margin: 0, padding: 0, overflowX: 'hidden', background: '#04081a', color: '#f1f5f9' }}>

      {/* ── CSS ───────────────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { background: #04081a; }

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
        @keyframes mobileSlideIn  { from { transform: translateX(100%) } to { transform: translateX(0) } }
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
        .btn-ghost { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); transition: all .2s ease; cursor: pointer; }
        .btn-ghost:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); }
        .feature-card { transition: all .3s cubic-bezier(.22,1,.36,1); cursor: default; }
        .feature-card:hover { transform: translateY(-6px); }
        .portal-card { transition: all .35s cubic-bezier(.22,1,.36,1); }
        .portal-card:hover { transform: translateY(-8px) scale(1.01); }
        .team-card { transition: all .35s cubic-bezier(.22,1,.36,1); }
        .team-card:hover { transform: translateY(-8px); }
        .nav-link { transition: all .15s; cursor: pointer; border: none; font-family: inherit; background: none; }
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
      <nav style={{ position: 'fixed', top: announcement ? 36 : 0, left: 0, right: 0, height: 64, zIndex: 1000, background: scrolled ? 'rgba(4,8,26,0.94)' : 'transparent', backdropFilter: scrolled ? 'blur(24px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0 20px' : '0 48px', transition: 'all .3s' }}>
        {/* Logo */}
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.5)' }}>
            <MdSchool style={{ color: '#fff', fontSize: 22 }} />
          </div>
          <span style={{ fontSize: 19, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>College<span style={{ color: '#a78bfa' }}>ERP</span></span>
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
                style={{ padding: '8px 13px', borderRadius: 9, fontSize: 13, fontWeight: 500, color: hovNav === l.id ? '#a78bfa' : 'rgba(255,255,255,0.75)', background: hovNav === l.id ? 'rgba(99,102,241,0.1)' : 'transparent' }}>
                {l.label}
              </button>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {!isMobile && <button className="btn-ghost" onClick={() => navigate('/auth/login')} style={{ padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, color: '#fff' }}>Sign In</button>}
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
      <section className="hero-bg" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', paddingTop: navH + 40, paddingBottom: 80, padding: isMobile ? `${navH + 40}px 24px 80px` : `${navH + 40}px 48px 80px` }}>
        {/* Aurora conic mesh */}
        <div className="aurora-mesh" style={{ position:'absolute', width:'140%', height:'140%', top:'50%', left:'50%', pointerEvents:'none', zIndex:0 }} />
        {/* Film grain noise */}
        <div className="noise-layer" style={{ zIndex:1 }} />
        {/* Grid overlay */}
        <div className="grid-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex:1 }} />

        {/* Star particles */}
        <StarField />

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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '7px 18px', marginBottom: 32, animation: 'slideLeft .6s ease' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Student · Staff · Parent · Alumni · Admin</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: isMobile ? 'clamp(34px,10vw,52px)' : 'clamp(44px,5vw,72px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2px', color: '#fff', marginBottom: 24, animation: 'zoomIn .7s ease .1s both' }}>
              The Campus Platform<br />
              <span style={{ fontSize: isMobile ? 'clamp(28px,8vw,42px)' : 'clamp(36px,4vw,58px)', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '-1px' }}>built for </span>
              <Typewriter />
            </h1>

            {/* Sub */}
            <p style={{ fontSize: isMobile ? 16 : 19, color: 'rgba(255,255,255,0.58)', lineHeight: 1.75, maxWidth: 520, marginBottom: 40, fontWeight: 400, animation: 'zoomIn .7s ease .2s both' }}>
              One unified platform for every role in your institution —
              from academics and research to payroll and alumni. 50+ features, zero friction.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48, animation: 'zoomIn .7s ease .3s both', flexDirection: isMobile ? 'column' : 'row' }}>
              <button className="btn-primary" onClick={() => navigate('/auth/login')} style={{ padding: '15px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Get Started Free <MdArrowForward size={18} />
              </button>
              <button className="btn-ghost" onClick={() => scrollTo('features')} style={{ padding: '15px 28px', borderRadius: 12, fontSize: 16, fontWeight: 700, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <MdSpeed size={18} /> Explore Features
              </button>
            </div>

            {/* Trust row */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', animation: 'zoomIn .7s ease .4s both' }}>
              {[{ icon: MdShield, text: 'Enterprise Secure' }, { icon: MdCheck, text: 'Role-Based Access' }, { icon: MdPublic, text: '24/7 Online' }].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                  <Icon style={{ fontSize: 15, color: '#a78bfa' }} />{text}
                </div>
              ))}
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
              <div style={{ position: 'absolute', top: -18, right: -18, background: 'linear-gradient(135deg,rgba(16,185,129,.9),rgba(5,150,105,.9))', border: '1px solid rgba(16,185,129,.4)', borderRadius: 100, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 20px rgba(16,185,129,.4)', animation: 'floatSlow 5s ease-in-out infinite .5s' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>CGPA +0.4 this sem</span>
              </div>
              <div style={{ position: 'absolute', bottom: -18, left: -18, background: 'rgba(99,102,241,.85)', border: '1px solid rgba(99,102,241,.4)', borderRadius: 100, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 20px rgba(99,102,241,.4)', animation: 'floatSlow 6s ease-in-out infinite 1s' }}>
                <MdMenuBook style={{ fontSize: 13, color: '#fff' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>50+ Features</span>
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
              <MdStar style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.78)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Stats ────────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg,#04081a 0%,#080f2e 100%)', padding: isMobile ? '64px 20px' : '88px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 700, height: 700, borderRadius: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(99,102,241,0.12)', color: '#a78bfa', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 16, margin: '0 auto 16px' }}>
                <MdAnalytics size={14} /> Platform by the numbers
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3vw,40px)', fontWeight: 800, color: '#fff', letterSpacing: '-.8px' }}>
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
                <div className="stat-card" style={{ background: `${s.color}10`, border: `1.5px solid ${s.color}25`, borderRadius: 20, padding: '32px 18px', textAlign: 'center', boxShadow: `0 4px 24px ${s.color}12` }}>
                  <RingCounter target={s.val} suffix={s.suf} color={s.color} size={110} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>{s.sublabel}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Features Bento Grid ──────────────────────────────────────────── */}
      <section id="features" style={{ background: 'linear-gradient(180deg,#04081a 0%,#060b20 100%)', padding: isMobile ? '64px 20px' : '96px 48px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(99,102,241,0.12)', color: '#a78bfa', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdLayers size={14} /> 80+ Core Features
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,46px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 16 }}>
                Everything your college needs
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.48)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                From curriculum tracking to research thesis submission — College ERP covers every aspect of campus life.
              </p>
            </div>
          </Reveal>

          {/* Bento grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: 18 }}>
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon
              const isWide = feat.span === 2 && !isMobile
              return (
                <Reveal key={feat.title} delay={i * 40}>
                  <div
                    className="feature-card"
                    style={{
                      gridColumn: isWide ? 'span 2' : undefined,
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: 18,
                      padding: '26px 24px',
                      border: `1.5px solid rgba(255,255,255,0.07)`,
                      boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.border = `1.5px solid ${feat.border}`
                      e.currentTarget.style.boxShadow = `0 16px 40px ${feat.color}18`
                      e.currentTarget.style.transform = 'translateY(-6px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.border = '1.5px solid #f1f5f9'
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'
                      e.currentTarget.style.transform = 'none'
                    }}
                  >
                    {/* Subtle bg gradient */}
                    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 80% 20%, ${feat.color}06 0%, transparent 60%)`, pointerEvents: 'none' }} />
                    {feat.badge && (
                      <div style={{ position: 'absolute', top: 16, right: 16, background: 'linear-gradient(135deg,#ec4899,#8b5cf6)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 20, letterSpacing: '.06em' }}>{feat.badge}</div>
                    )}
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: feat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                      <Icon style={{ fontSize: 28, color: feat.color }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{feat.title}</h3>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{feat.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ background: 'linear-gradient(135deg,#04081a 0%,#080f2e 100%)', padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden' }}>
        <div className="grid-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .4 }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 600, height: 600, borderRadius: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div className="section-tag" style={{ background: 'rgba(99,102,241,0.12)', color: '#a78bfa', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdHowToReg size={14} /> Simple Onboarding
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,46px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 16 }}>
                Get started in <GradText from="#a78bfa" to="#34d399">4 simple steps</GradText>
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,.48)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
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
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{step.title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.7, maxWidth: 220, margin: '0 auto' }}>{step.desc}</div>
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
      <section style={{ background: 'linear-gradient(180deg,#060b20 0%,#04081a 100%)', padding: isMobile ? '64px 20px' : '88px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div className="section-tag" style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.22)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdVerified size={14} /> Why College ERP
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 14 }}>
                Traditional vs <GradText from="#a78bfa" to="#34d399">College ERP</GradText>
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 460, margin: '0 auto' }}>
                See exactly what gets replaced when you switch.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(255,255,255,0.04)', padding: isMobile ? '14px 16px' : '16px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Category</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '.08em' }}>Traditional</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '.08em' }}>College ERP</div>
              </div>
              {COMPARISON_ROWS.map((row, i) => (
                <div key={row.category} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: isMobile ? '14px 16px' : '18px 28px', borderBottom: i < COMPARISON_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{row.category}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontSize: 10, color: '#f87171', fontWeight: 800 }}>✕</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{row.old}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <MdCheck style={{ fontSize: 11, color: '#34d399' }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, fontWeight: 500 }}>{row.erp}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 7. Portal Section ───────────────────────────────────────────────── */}
      <section id="portals" style={{ background: 'linear-gradient(135deg,#04081a 0%,#0d1537 50%,#04081a 100%)', padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden' }}>
        <div className="grid-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .5 }} />
        <div style={{ position: 'absolute', top: '30%', left: '50%', width: 700, height: 700, borderRadius: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(99,102,241,0.12)', color: '#a78bfa', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdGroups size={14} /> 5 Dedicated Portals
              </div>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', marginBottom: 16 }}>
                Choose Your Portal
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,.5)', maxWidth: 500, margin: '0 auto' }}>
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
                      background: hov ? p.bg : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${hov ? p.color + '50' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 18,
                      padding: '28px 20px',
                      display: 'flex', flexDirection: 'column', gap: 16,
                      boxShadow: hov ? `0 24px 48px ${p.color}20` : 'none',
                    }}
                  >
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${p.color}20`, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ fontSize: 28, color: p.color }} />
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{p.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', lineHeight: 1.65, flex: 1 }}>{p.desc}</div>
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
      <section id="academics" style={{ background: 'linear-gradient(135deg,#04081a 0%,#0d1537 100%)', padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 72, alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row', position: 'relative', zIndex: 1 }}>
          <Reveal dir="left" style={{ flex: '1 1 340px' }}>
            <div style={{ flex: '1 1 340px' }}>
              <div className="section-tag" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)', marginBottom: 24 }}>
                📚 Academics
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3vw,44px)', fontWeight: 800, color: '#fff', marginBottom: 18, lineHeight: 1.15, letterSpacing: '-1px' }}>
                Complete Academic<br />Management — All in One
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,.55)', lineHeight: 1.8, maxWidth: 440, marginBottom: 36 }}>
                From curriculum planning to project submissions, digital assignments to APAAR ID — every academic function managed in a single, intuitive portal.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ACADEMICS_GENERAL_ITEMS.slice(0, 15).map(item => (
                  <span key={item} className="chip" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', padding: '5px 14px', fontSize: 12, fontWeight: 600, color: '#a5b4fc' }}>{item}</span>
                ))}
                <span className="chip" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 14px', fontSize: 12, color: 'rgba(255,255,255,.35)', fontWeight: 500 }}>+{ACADEMICS_GENERAL_ITEMS.length - 15} more</span>
              </div>
            </div>
          </Reveal>

          <Reveal dir="right" delay={150} style={{ flex: '1 1 300px' }}>
            <div style={{ flex: '1 1 300px', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
              {[
                { title: 'General',           count: 19, color: '#818cf8', bg: 'rgba(99,102,241,.12)',  icon: MdMenuBook },
                { title: 'Course Reg.',        count: 8,  color: '#60a5fa', bg: 'rgba(59,130,246,.12)', icon: MdSchool },
                { title: 'Project Proposal',   count: 1,  color: '#c084fc', bg: 'rgba(168,85,247,.12)', icon: MdBadge },
                { title: 'More coming soon',   count: null, color: '#475569', bg: 'rgba(71,85,105,.08)', icon: MdAccessTime },
              ].map(card => {
                const Icon = card.icon
                return (
                  <div key={card.title} style={{ background: card.bg, border: `1px solid ${card.color}25`, borderRadius: 14, padding: 20, transition: 'transform .2s', cursor: 'default' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: `${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <Icon style={{ fontSize: 20, color: card.color }} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{card.title}</div>
                    {card.count !== null
                      ? <div style={{ fontSize: 12, color: card.color, fontWeight: 600 }}>{card.count} items</div>
                      : <div style={{ fontSize: 12, color: 'rgba(255,255,255,.25)', fontWeight: 500 }}>In progress</div>}
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── LMS ─────────────────────────────────────────────────────────────── */}
      <section id="lms" style={{ background: 'linear-gradient(135deg,#04081a 0%,#0d1537 100%)', padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdCastForEducation size={14} /> Learning Management System
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 16 }}>
                Digital Learning, <GradText from="#60a5fa" to="#a78bfa">Fully Integrated</GradText>
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,.48)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
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
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{feat.title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', lineHeight: 1.7 }}>{feat.desc}</div>
                  </div>
                </Reveal>
              )
            })}
          </div>
          {/* LMS dashboard mockup */}
          <Reveal delay={200}>
            <div style={{ marginTop: 40, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: isMobile ? '20px' : '28px 36px', display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MdComputer style={{ fontSize: 28, color: '#60a5fa' }} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Active for all roles</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>Students submit · Faculty grade · Admin oversee</div>
                </div>
              </div>
              {[{ label: 'Courses Available', val: '60+', color: '#60a5fa' }, { label: 'Assignments/sem', val: '200+', color: '#a78bfa' }, { label: 'Submission Rate', val: '98%', color: '#34d399' }].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: '-1px' }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 9. Examinations ─────────────────────────────────────────────────── */}
      <section id="examinations" style={{ background: 'linear-gradient(135deg,#06091e 0%,#0d1235 100%)', padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-8%', right: '-4%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(239,68,68,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdAssignment size={14} /> Examination System
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 16 }}>
                Complete Examination Management
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.48)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
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
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{item}</span>
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
      <section style={{ background: 'linear-gradient(135deg,#04081a 0%,#060d24 100%)', padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdPayment size={14} /> Finance & Payments
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 16 }}>
                Transparent Fee Management
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.48)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
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
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.48)', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Employee & HR ───────────────────────────────────────────────────── */}
      <section id="hr" style={{ background: 'linear-gradient(135deg,#04081a 0%,#0d1537 100%)', padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-5%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdBusinessCenter size={14} /> HR & Administration
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 16 }}>
                Complete <GradText from="#fbbf24" to="#f87171">HR Management</GradText> Suite
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,.48)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
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
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{mod.title}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {mod.items.map(item => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${mod.color}18`, border: `1px solid ${mod.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <MdCheck style={{ fontSize: 12, color: mod.color }} />
                          </div>
                          <span style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', fontWeight: 500 }}>{item}</span>
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
      <section style={{ background: 'linear-gradient(135deg,#04081a 0%,#070d28 100%)', padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-8%', left: '50%', width: 600, height: 400, borderRadius: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse,rgba(245,158,11,0.08) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdMiscellaneousServices size={14} /> Student Services
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 16 }}>
                Everything a Student Needs
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.48)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
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
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{group.title}</span>
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
      <section id="notifications" style={{ background: 'linear-gradient(135deg,#04081a 0%,#08102e 100%)', padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(99,102,241,0.12)', color: '#a78bfa', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdNotificationsActive size={14} /> Smart Notifications
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 16 }}>
                Stay informed. <GradText from="#a78bfa" to="#34d399">Always.</GradText>
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.48)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
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
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{feat.title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{feat.desc}</div>
                  </div>
                </Reveal>
              )
            })}
          </div>
          {/* Live notification preview */}
          <Reveal delay={250}>
            <div style={{ marginTop: 40, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: isMobile ? '20px' : '28px 36px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 18 }}>Live Notification Feed</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: MdAssignment, color: '#6366f1', text: 'Digital Assignment due in 2 hours — Data Structures (CS3201)', time: 'Just now', role: 'Student' },
                  { icon: MdCalendarToday, color: '#10b981', text: 'Leave request approved by HOD — Dr. Ravi Kumar', time: '5 min ago', role: 'Faculty' },
                  { icon: MdMonetizationOn, color: '#f59e0b', text: 'Payroll processed for March 2025 — 142 employees', time: '1 hr ago', role: 'Admin' },
                  { icon: MdSchool, color: '#f87171', text: 'End Semester Exam scheduled — June 20, Hall A', time: '3 hrs ago', role: 'Student' },
                ].map((notif, i) => {
                  const Icon = notif.icon
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${notif.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon style={{ fontSize: 20, color: notif.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{notif.text}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: notif.color, background: `${notif.color}12`, padding: '2px 8px', borderRadius: 20 }}>{notif.role}</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{notif.time}</span>
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
      <section id="research" style={{ background: 'linear-gradient(135deg,#04081a 0%,#0d1537 100%)', padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 72, alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row', position: 'relative', zIndex: 1 }}>
          <Reveal dir="left" style={{ flex: '1 1 340px' }}>
            <div style={{ flex: '1 1 340px' }}>
              <div className="section-tag" style={{ background: 'rgba(139,92,246,0.12)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.25)', marginBottom: 24 }}>
                <MdScience size={14} /> 🔬 Research Portal
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3vw,42px)', fontWeight: 800, color: '#fff', marginBottom: 18, lineHeight: 1.15, letterSpacing: '-1px' }}>
                PhD &amp; Research<br />Scholar Portal
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,.55)', lineHeight: 1.8, maxWidth: 440, marginBottom: 36 }}>
                A dedicated research portal covering all aspects of the PhD journey — from registration to thesis submission and weekly workload tracking.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {RESEARCH_ITEMS.map(item => (
                  <span key={item} className="chip" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', padding: '5px 14px', fontSize: 12, fontWeight: 600, color: '#c4b5fd' }}>{item}</span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal dir="right" delay={150} style={{ flex: '0 0 360px' }}>
            <GlassCard style={{ padding: 28, flex: '0 0 360px' }} hover={false}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 2, fontWeight: 500 }}>Research Dashboard</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>PhD Scholar Status</div>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MdScience style={{ fontSize: 20, color: '#c084fc' }} />
                </div>
              </div>
              {[{ label: 'Course Work', pct: 80, color: '#a78bfa' }, { label: 'Thesis Progress', pct: 35, color: '#6366f1' }, { label: 'Meetings Done', pct: 60, color: '#10b981' }].map(item => (
                <div key={item.label} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 3, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 18, marginTop: 4 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 12, fontWeight: 700, letterSpacing: '.06em' }}>RECENT ACTIVITY</div>
                {[{ text: 'Thesis Chapter 2 submitted', time: '2h ago', color: '#10b981' }, { text: 'Guide meeting scheduled', time: '1d ago', color: '#a78bfa' }, { text: 'Weekly workload updated', time: '3d ago', color: '#6366f1' }].map(act => (
                  <div key={act.text} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: act.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', fontWeight: 500 }}>{act.text}</span>
                    </div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', fontWeight: 500 }}>{act.time}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ── 13. Meet the Team ───────────────────────────────────────────────── */}
      <section id="team" style={{ background: 'linear-gradient(135deg,#04081a 0%,#080f2e 100%)', padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div className="section-tag" style={{ background: 'rgba(99,102,241,0.12)', color: '#a78bfa', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdGroups size={14} /> The Builders
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 16 }}>
                Meet the Team
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.48)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                The passionate people who designed, built, and launched College ERP.
              </p>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 28, maxWidth: 980, margin: '0 auto' }}>
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 100}>
                <div className="team-card" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 22, padding: '36px 30px', textAlign: 'center', border: '1.5px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden', cursor: 'default' }}
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
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{m.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: m.tagColor, marginBottom: 18 }}>{m.role}</div>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 18 }} />
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>{m.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg,#04081a 0%,#060c22 100%)', padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 800, height: 400, borderRadius: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(ellipse,rgba(99,102,241,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-tag" style={{ background: 'rgba(139,92,246,0.12)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdStar size={14} /> User Stories
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 14 }}>
                Loved by every role
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
                From students to administrators — see what real users say about College ERP.
              </p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <GlassCard style={{ padding: '32px 28px' }}>
                  <div style={{ fontSize: 56, fontWeight: 900, color: 'rgba(167,139,250,0.18)', lineHeight: .8, marginBottom: 16, fontFamily: 'Georgia, serif' }}>&ldquo;</div>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 1.8, marginBottom: 24, marginTop: 0 }}>{t.quote}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${t.color}25`, border: `2px solid ${t.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: t.color, flexShrink: 0 }}>{t.initials}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{t.role}</div>
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
      <section style={{ background: '#04081a', padding: isMobile ? '64px 20px' : '96px 48px', position: 'relative', overflow: 'hidden' }}>
        <div className="grid-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .35 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div className="section-tag" style={{ background: 'rgba(99,102,241,0.12)', color: '#a78bfa', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 18, margin: '0 auto 18px' }}>
                <MdFeedback size={14} /> Got Questions
              </div>
              <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 14 }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 460, margin: '0 auto' }}>
                Everything you need to know about College ERP.
              </p>
            </div>
          </Reveal>
          <FAQAccordion items={FAQS} />
        </div>
      </section>

      {/* ── 14. Final CTA ───────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg,#04081a 0%,#0d1537 50%,#04081a 100%)', padding: isMobile ? '72px 20px' : '112px 48px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div className="grid-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '7px 18px', marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.78)' }}>Ready to modernize your campus?</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 style={{ fontSize: isMobile ? 'clamp(32px,10vw,48px)' : 'clamp(36px,5vw,64px)', fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1.08, marginBottom: 20 }}>
              Start managing your college&nbsp;
              <GradText from="#a78bfa" to="#34d399">smarter today</GradText>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 48px' }}>
              Join students, faculty, and administrators already using College ERP to streamline every campus workflow.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 52 }}>
              <button className="btn-primary" onClick={() => navigate('/auth/login')} style={{ padding: '17px 40px', borderRadius: 14, fontSize: 17, fontWeight: 800, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                Get Started Free <MdArrowForward size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
              {[{ icon: MdShield, t: 'Enterprise Secure' }, { icon: MdCheck, t: 'Role-Based Access' }, { icon: MdPublic, t: '24/7 Available' }, { icon: MdAccessTime, t: 'Real-Time Sync' }].map(({ icon: Icon, t }) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,.4)', fontSize: 13 }}>
                  <Icon style={{ fontSize: 14, color: '#a78bfa' }} />{t}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 15. Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ background: '#020611', padding: isMobile ? '56px 20px 0' : '80px 48px 0' }}>
        {/* Gradient top border */}
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.5),rgba(139,92,246,0.5),transparent)', marginBottom: 60 }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2.2fr 1fr 1fr 1.4fr', gap: 52, paddingBottom: 56, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
                <MdSchool style={{ color: '#fff', fontSize: 22 }} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>College<span style={{ color: '#a78bfa' }}>ERP</span></div>
                <div style={{ fontSize: 11, color: '#334155', fontWeight: 500 }}>v2.0 — Modern Campus Platform</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.8, maxWidth: 280, marginBottom: 22 }}>
              A comprehensive college management platform for modern educational institutions. Academics, exams, finance, research — all in one place.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {['React 18', 'Spring Boot', 'PostgreSQL', 'Docker', 'JWT'].map(tech => (
                <span key={tech} style={{ background: 'rgba(255,255,255,0.05)', color: '#475569', border: '1px solid rgba(255,255,255,0.07)', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{tech}</span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '.1em' }}>Quick Links</div>
            {[{ label: 'Features', id: 'features' }, { label: 'How It Works', id: 'how-it-works' }, { label: 'Academics', id: 'academics' }, { label: 'LMS', id: 'lms' }, { label: 'HR & Payroll', id: 'hr' }, { label: 'Examinations', id: 'examinations' }, { label: 'Research', id: 'research' }, { label: 'Team', id: 'team' }].map(l => (
              <div key={l.label} style={{ marginBottom: 12 }}>
                <button onClick={() => scrollTo(l.id)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 14, color: '#334155', cursor: 'pointer', fontFamily: FONT, transition: 'color .15s' }}
                  onMouseEnter={e => e.target.style.color = '#a78bfa'}
                  onMouseLeave={e => e.target.style.color = '#334155'}>
                  {l.label}
                </button>
              </div>
            ))}
          </div>

          {/* Portals */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '.1em' }}>Portals</div>
            {PORTALS.map(p => (
              <div key={p.key} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <button onClick={() => navigate(`/auth/login?portal=${p.key}`)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 14, color: '#334155', cursor: 'pointer', fontFamily: FONT, transition: 'color .15s' }}
                  onMouseEnter={e => e.target.style.color = p.color}
                  onMouseLeave={e => e.target.style.color = '#334155'}>
                  {p.label} Portal
                </button>
              </div>
            ))}
          </div>

          {/* CTA column */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '.1em' }}>Get Started</div>
            <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.75, marginBottom: 20 }}>Sign in to your portal to access your personalized dashboard.</p>
            <button className="btn-primary" onClick={() => navigate('/auth/login')} style={{ padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 7, width: '100%', justifyContent: 'center' }}>
              Sign In <MdArrowForward size={15} />
            </button>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#334155' }}>
                <MdEmail size={14} style={{ color: '#475569', flexShrink: 0 }} /> contact@collegeerp.in
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#334155' }}>
                <MdRocketLaunch size={14} style={{ color: '#475569', flexShrink: 0 }} /> Chennai, Tamil Nadu, India
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '22px 0', display: 'flex', justifyContent: isMobile ? 'center' : 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left' }}>
          <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 400 }}>
            © 2025 College ERP · Built with ❤️ in Chennai, India
          </span>
          <div style={{ display: 'flex', gap: 22 }}>
            {['Privacy Policy', 'Terms of Service', 'Support'].map(l => (
              <span key={l} style={{ fontSize: 12, color: '#1e293b', cursor: 'pointer', transition: 'color .15s' }}
                onMouseEnter={e => e.target.style.color = '#64748b'}
                onMouseLeave={e => e.target.style.color = '#1e293b'}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}
