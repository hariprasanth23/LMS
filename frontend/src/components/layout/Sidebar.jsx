import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  MdDashboard,
  MdPeople,
  MdSchool,
  MdBook,
  MdAssignment,
  MdBadge,
  MdEventNote,
  MdBeachAccess,
  MdPayment,
  MdPerson,
  MdApartment,
  MdMenuBook,
  MdMiscellaneousServices,
  MdScience,
  MdFeedback,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdLogout,
  MdSupervisorAccount,
  MdEvent
} from 'react-icons/md'

const FONT = 'system-ui, -apple-system, sans-serif'
const ACCENT = '#6366f1'
const ACCENT_LIGHT = '#eef2ff'
const TEXT = '#1e293b'
const MUTED = '#64748b'
const BG = '#f8fafc'

// ─── Non-student nav link style ──────────────────────────────────────────────

const navLinkStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 16px',
  borderRadius: 8,
  textDecoration: 'none',
  fontFamily: FONT,
  fontSize: 14,
  fontWeight: isActive ? 600 : 400,
  color: isActive ? ACCENT : TEXT,
  background: isActive ? ACCENT_LIGHT : 'transparent',
  transition: 'all 0.15s ease',
  margin: '1px 0'
})

function NavItem({ to, icon, label }) {
  return (
    <NavLink to={to} style={({ isActive }) => navLinkStyle(isActive)}>
      <span style={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

// ─── Student accordion sections ──────────────────────────────────────────────

const STUDENT_SECTIONS = [
  {
    key: 'academics',
    label: 'Academics',
    icon: MdMenuBook,
    iconColor: '#6366f1',
    items: [
      { label: 'General', to: '/academics/general' },
      { label: 'Course Registration', to: '/academics/course-registration' },
      { label: 'Project Proposal', to: '/academics/project-proposal' }
    ]
  },
  {
    key: 'examinations',
    label: 'Examinations',
    icon: MdAssignment,
    iconColor: '#ef4444',
    items: [
      { label: 'General', to: '/examinations/general' },
      { label: 'Arrear', to: '/examinations/arrear' },
      { label: 'Online Examinations', to: '/examinations/online' },
      { label: 'Make-up Exam', to: '/examinations/makeup' }
    ]
  },
  {
    key: 'finance',
    label: 'Finance',
    icon: MdPayment,
    iconColor: '#10b981',
    items: [
      { label: 'Online Payments', to: '/finance/payments' }
    ]
  },
  {
    key: 'services',
    label: 'Services',
    icon: MdMiscellaneousServices,
    iconColor: '#f59e0b',
    items: [
      { label: 'General', to: '/services/general' },
      { label: 'My Info', to: '/services/my-info' },
      { label: 'My Account', to: '/services/my-account' },
      { label: 'Bonafide', to: '/services/bonafide' },
      { label: 'Library', to: '/services/library' },
      { label: 'Info Corner', to: '/services/info-corner' }
    ]
  },
  {
    key: 'research',
    label: 'Research',
    icon: MdScience,
    iconColor: '#8b5cf6',
    items: [
      { label: 'General', to: '/research/general' }
    ]
  },
  {
    key: 'feedback',
    label: 'Feedback',
    icon: MdFeedback,
    iconColor: '#14b8a6',
    items: [
      { label: 'General', to: '/feedback/general' }
    ]
  }
]

const FACULTY_SECTIONS = [
  {
    key: 'academics', label: 'Academics', icon: MdMenuBook, color: '#6366f1',
    items: [
      { label: 'General', to: '/faculty/academics/general' },
      { label: 'Outcome Set Conference', to: '/faculty/academics/outcome-set-conference' },
      { label: 'SET Conference', to: '/faculty/academics/set-conference' },
      { label: 'Course', to: '/faculty/academics/course' },
      { label: 'Attendance', to: '/faculty/academics/attendance' },
      { label: 'Council', to: '/faculty/academics/council' },
      { label: 'QC Meeting', to: '/faculty/academics/qc-meeting' },
      { label: 'Outcome & Course Plan', to: '/faculty/academics/outcome-course-plan' },
      { label: 'Extra Curricular Activity', to: '/faculty/academics/extra-curricular' },
      { label: 'Project Registration', to: '/faculty/academics/project-registration' },
    ]
  },
  {
    key: 'examinations', label: 'Examinations', icon: MdAssignment, color: '#ef4444',
    items: [
      { label: 'General', to: '/faculty/examinations/general' },
      { label: 'Evaluations', to: '/faculty/examinations/evaluations' },
      { label: 'Question Paper', to: '/faculty/examinations/question-paper' },
      { label: 'Invigilation', to: '/faculty/examinations/invigilation' },
    ]
  },
  {
    key: 'proctor', label: 'Proctor', icon: MdSupervisorAccount, color: '#f97316',
    items: [
      { label: 'General', to: '/faculty/proctor/general' },
      { label: 'Student Medical Info', to: '/faculty/proctor/medical-info' },
      { label: 'Students Info', to: '/faculty/proctor/students-info' },
    ]
  },
  {
    key: 'research', label: 'Research', icon: MdScience, color: '#8b5cf6',
    items: [
      { label: 'General', to: '/faculty/research/general' },
      { label: 'Coursework Allocation', to: '/faculty/research/coursework-allocation' },
    ]
  },
  {
    key: 'events', label: 'Events', icon: MdEvent, color: '#10b981',
    items: [
      { label: 'TLCE FDP', to: '/faculty/events/tlce-fdp' },
      { label: 'Event Pre-Proposal', to: '/faculty/events/pre-proposal' },
      { label: 'SW Events', to: '/faculty/events/sw-events' },
    ]
  },
  {
    key: 'hr', label: 'Human Resource', icon: MdPeople, color: '#0ea5e9',
    items: [
      { label: 'General', to: '/faculty/hr/general' },
    ]
  },
  {
    key: 'services', label: 'Services', icon: MdMiscellaneousServices, color: '#f59e0b',
    items: [
      { label: 'General', to: '/faculty/services/general' },
      { label: 'My Account', to: '/faculty/services/my-account' },
      { label: 'Biometric Info', to: '/faculty/services/biometric-info' },
      { label: 'Library', to: '/faculty/services/library' },
      { label: 'Finance', to: '/faculty/services/finance' },
      { label: 'Info Corner', to: '/faculty/services/info-corner' },
      { label: 'Physical Education', to: '/faculty/services/physical-education' },
      { label: 'International Relations', to: '/faculty/services/international-relations' },
    ]
  },
  {
    key: 'feedback', label: 'Feedback', icon: MdFeedback, color: '#14b8a6',
    items: [
      { label: 'General', to: '/faculty/feedback/general' },
    ]
  },
]

function StudentAccordionSection({ section, isOpen, onToggle }) {
  const SectionIcon = section.icon
  const ArrowIcon = isOpen ? MdKeyboardArrowDown : MdKeyboardArrowRight

  return (
    <div style={{ marginBottom: 2 }}>
      {/* Section header */}
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          padding: '10px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 700,
          color: TEXT,
          textAlign: 'left',
          borderRadius: 8,
          transition: 'background 0.15s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = BG }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
      >
        <SectionIcon style={{ fontSize: 18, color: section.iconColor || section.color, flexShrink: 0 }} />
        <span style={{ flex: 1 }}>{section.label}</span>
        <ArrowIcon style={{ fontSize: 16, color: MUTED, flexShrink: 0 }} />
      </button>

      {/* Sub-items */}
      <div style={{ display: isOpen ? 'flex' : 'none', flexDirection: 'column' }}>
        {section.items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'block',
              padding: '8px 16px 8px 44px',
              textDecoration: 'none',
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? ACCENT : '#475569',
              background: isActive ? ACCENT_LIGHT : 'transparent',
              borderLeft: isActive ? `3px solid ${ACCENT}` : '3px solid transparent',
              transition: 'all 0.15s ease'
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = BG
              }
            }}
            onMouseLeave={(e) => {
              // Let React Router's style function handle the final background
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const { user, logout } = useAuth()
  const role = user?.role

  const isFaculty = role === 'FACULTY'

  // Accordion state: default first section ('academics') is open for both STUDENT and FACULTY
  const [openSections, setOpenSections] = useState(['academics'])

  const toggleSection = (key) => {
    setOpenSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  // ── Role-specific items for non-student roles ──

  const adminItems = [
    { to: '/students', icon: <MdPeople />, label: 'Students' },
    { to: '/courses', icon: <MdBook />, label: 'Courses' },
    { to: '/employees', icon: <MdBadge />, label: 'Employees' },
    { to: '/attendance', icon: <MdEventNote />, label: 'Attendance' },
    { to: '/leaves', icon: <MdBeachAccess />, label: 'Leaves' },
    { to: '/payroll', icon: <MdPayment />, label: 'Payroll' },
    { to: '/departments', icon: <MdApartment />, label: 'Departments' }
  ]

  const facultyItems = [
    { to: '/courses', icon: <MdBook />, label: 'My Courses' },
    { to: '/assignments', icon: <MdAssignment />, label: 'Assignments' },
    { to: '/attendance', icon: <MdEventNote />, label: 'Mark Attendance' },
    { to: '/leaves', icon: <MdBeachAccess />, label: 'Leaves' }
  ]

  const staffItems = [
    { to: '/leaves', icon: <MdBeachAccess />, label: 'Leaves' },
    { to: '/attendance', icon: <MdEventNote />, label: 'Attendance' }
  ]

  const roleItems = {
    ADMIN: adminItems,
    FACULTY: facultyItems,
    STAFF: staffItems
  }

  const roleColors = {
    ADMIN: '#ef4444',
    FACULTY: '#6366f1',
    STUDENT: '#10b981',
    STAFF: '#f59e0b'
  }

  const isStudent = role === 'STUDENT'
  const isAccordionRole = isStudent || isFaculty
  const specificItems = roleItems[role] || []

  return (
    <aside style={{
      width: 260,
      minHeight: '100vh',
      background: '#fff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>
      {/* Logo / Brand */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid #f1f5f9',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            background: ACCENT,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <MdSchool style={{ color: '#fff', fontSize: 20 }} />
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: TEXT }}>
              College ERP
            </div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: MUTED }}>
              Management System
            </div>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div style={{ padding: '12px 16px 8px', flexShrink: 0 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: `${roleColors[role] || ACCENT}18`,
          color: roleColors[role] || ACCENT,
          borderRadius: 20,
          padding: '4px 10px',
          fontSize: 11,
          fontWeight: 700,
          fontFamily: FONT,
          letterSpacing: 0.5,
          textTransform: 'uppercase'
        }}>
          {role || 'USER'}
        </div>
      </div>

      {/* Nav area — scrollable */}
      <nav style={{
        flex: 1,
        overflowY: 'auto',
        padding: isAccordionRole ? '4px 0' : '4px 12px'
      }}>
        {/* Dashboard — always visible */}
        {isAccordionRole ? (
          <div style={{ padding: '0 12px', marginBottom: 4 }}>
            <NavLink
              to="/dashboard"
              style={({ isActive }) => navLinkStyle(isActive)}
            >
              <span style={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>
                <MdDashboard />
              </span>
              <span>Dashboard</span>
            </NavLink>
          </div>
        ) : (
          <NavItem to="/dashboard" icon={<MdDashboard />} label="Dashboard" />
        )}

        {/* ── STUDENT accordion menu ── */}
        {isStudent && (
          <div style={{ marginTop: 8, padding: '0 8px' }}>
            {STUDENT_SECTIONS.map((section) => (
              <StudentAccordionSection
                key={section.key}
                section={section}
                isOpen={openSections.includes(section.key)}
                onToggle={() => toggleSection(section.key)}
              />
            ))}
          </div>
        )}

        {/* ── FACULTY accordion menu ── */}
        {isFaculty && (
          <div style={{ marginTop: 8, padding: '0 8px' }}>
            {FACULTY_SECTIONS.map((section) => (
              <StudentAccordionSection
                key={section.key}
                section={section}
                isOpen={openSections.includes(section.key)}
                onToggle={() => toggleSection(section.key)}
              />
            ))}
          </div>
        )}

        {/* ── Non-accordion role-specific items ── */}
        {!isAccordionRole && specificItems.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{
              padding: '8px 4px 4px',
              fontSize: 10,
              fontWeight: 700,
              color: MUTED,
              fontFamily: FONT,
              letterSpacing: 1,
              textTransform: 'uppercase'
            }}>
              {role === 'ADMIN' ? 'Management' : 'My Work'}
            </div>
            {specificItems.map((item) => (
              <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
            ))}
          </div>
        )}

        {/* ── Profile link (non-accordion roles) ── */}
        {!isAccordionRole && (
          <div style={{ marginTop: 8 }}>
            <div style={{
              padding: '8px 4px 4px',
              fontSize: 10,
              fontWeight: 700,
              color: MUTED,
              fontFamily: FONT,
              letterSpacing: 1,
              textTransform: 'uppercase'
            }}>
              Account
            </div>
            <NavItem to="/profile" icon={<MdPerson />} label="Profile" />
          </div>
        )}
      </nav>

      {/* Bottom bar — Profile + Logout (student) or just Logout (others) */}
      <div style={{
        padding: '8px 12px 12px',
        borderTop: '1px solid #f1f5f9',
        flexShrink: 0
      }}>
        {isAccordionRole && (
          <NavLink
            to="/profile"
            style={({ isActive }) => ({
              ...navLinkStyle(isActive),
              marginBottom: 4
            })}
          >
            <span style={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>
              <MdPerson />
            </span>
            <span>Profile</span>
          </NavLink>
        )}

        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '10px 16px',
            background: 'transparent',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 400,
            color: '#ef4444',
            textAlign: 'left',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <span style={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>
            <MdLogout />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
