import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
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
  MdEvent,
  MdSearch,
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/md'

// ─── Sidebar Collapse Context ─────────────────────────────────────────────────

export const SidebarContext = createContext({ collapsed: false })
export function useSidebar() { return useContext(SidebarContext) }

// ─── Design tokens ────────────────────────────────────────────────────────────

const FONT = 'system-ui, -apple-system, sans-serif'
const ACCENT = '#6366f1'
const ACCENT_LIGHT = '#eef2ff'
const TEXT = '#1e293b'
const MUTED = '#64748b'
const BG = '#f8fafc'

// ─── Badge counts (demo) ──────────────────────────────────────────────────────

const BADGE_COUNTS = {
  proctor: {
    'Leave Approval': 3,
    'No Dues': 3
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name) {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// ─── Tooltip wrapper ─────────────────────────────────────────────────────────

function Tooltip({ label, children }) {
  const [visible, setVisible] = useState(false)
  return (
    <div
      style={{ position: 'relative', display: 'flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div style={{
          position: 'absolute',
          left: '110%',
          top: '50%',
          transform: 'translateY(-50%)',
          background: TEXT,
          color: '#fff',
          padding: '5px 10px',
          borderRadius: 6,
          fontSize: 12,
          fontFamily: FONT,
          whiteSpace: 'nowrap',
          zIndex: 1000,
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {label}
          <div style={{
            position: 'absolute',
            right: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            borderWidth: 5,
            borderStyle: 'solid',
            borderColor: `transparent ${TEXT} transparent transparent`
          }} />
        </div>
      )}
    </div>
  )
}

// ─── Non-student nav link style ───────────────────────────────────────────────

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
  transition: 'all 0.2s ease',
  margin: '1px 0',
  position: 'relative',
  overflow: 'hidden'
})

function NavItem({ to, icon, label, collapsed, onClose }) {
  if (collapsed) {
    return (
      <Tooltip label={label}>
        <NavLink
          to={to}
          onClick={onClose}
          style={({ isActive }) => ({
            ...navLinkStyle(isActive),
            padding: '10px',
            justifyContent: 'center',
            width: 40,
            margin: '1px auto'
          })}
        >
          <span style={{ fontSize: 20, display: 'flex', alignItems: 'center' }}>{icon}</span>
        </NavLink>
      </Tooltip>
    )
  }
  return (
    <NavLink to={to} onClick={onClose} style={({ isActive }) => navLinkStyle(isActive)}>
      {({ isActive }) => (
        <>
          {/* animated left bar */}
          <span style={{
            position: 'absolute',
            left: 0,
            top: '15%',
            height: '70%',
            width: isActive ? 3 : 0,
            background: ACCENT,
            borderRadius: '0 3px 3px 0',
            transition: 'width 0.2s ease'
          }} />
          <span style={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>{icon}</span>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  )
}

// ─── Student / Faculty accordion sections ─────────────────────────────────────

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
      { label: 'Leave Approval', to: '/faculty/proctor/leave-approval' },
      { label: 'No Dues', to: '/faculty/proctor/no-dues' },
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

// ─── Accordion Section ─────────────────────────────────────────────────────────

function AccordionSection({ section, isOpen, onToggle, collapsed, sectionBadges, onItemClick }) {
  const SectionIcon = section.icon
  const iconColor = section.iconColor || section.color

  if (collapsed) {
    return (
      <Tooltip label={section.label}>
        <button
          onClick={onToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            margin: '2px auto',
            background: isOpen ? ACCENT_LIGHT : 'transparent',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 8,
            transition: 'background 0.2s ease'
          }}
        >
          <SectionIcon style={{ fontSize: 20, color: isOpen ? ACCENT : iconColor, flexShrink: 0 }} />
        </button>
      </Tooltip>
    )
  }

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
        <SectionIcon style={{ fontSize: 18, color: iconColor, flexShrink: 0 }} />
        <span style={{ flex: 1 }}>{section.label}</span>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: 'transform 0.2s ease'
        }}>
          <MdKeyboardArrowDown style={{ fontSize: 16, color: MUTED }} />
        </span>
      </button>

      {/* Sub-items with smooth expand */}
      <div style={{
        overflow: 'hidden',
        maxHeight: isOpen ? 800 : 0,
        transition: 'max-height 0.25s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {section.items.map((item) => {
          const badgeCount = sectionBadges?.[item.label]
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onItemClick}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 16px 8px 44px',
                textDecoration: 'none',
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? ACCENT : '#475569',
                background: isActive ? ACCENT_LIGHT : 'transparent',
                borderLeft: isActive ? `3px solid ${ACCENT}` : '3px solid transparent',
                transition: 'all 0.2s ease',
                position: 'relative'
              })}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                if (el.getAttribute('aria-current') !== 'page') {
                  el.style.background = BG
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                if (el.getAttribute('aria-current') !== 'page') {
                  el.style.background = 'transparent'
                }
              }}
            >
              <span>{item.label}</span>
              {badgeCount != null && (
                <span style={{
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: FONT,
                  borderRadius: 10,
                  padding: '1px 6px',
                  minWidth: 18,
                  textAlign: 'center',
                  lineHeight: '16px'
                }}>
                  {badgeCount}
                </span>
              )}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

// ─── Bottom User Card ──────────────────────────────────────────────────────────

function UserCard({ user, role, roleColor, logout, collapsed }) {
  const navigate = useNavigate()
  const initials = getInitials(user?.name)

  const Avatar = (
    <div style={{
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: `${roleColor}22`,
      border: `2px solid ${roleColor}44`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 13,
      color: roleColor
    }}>
      {initials}
    </div>
  )

  if (collapsed) {
    return (
      <div style={{
        padding: '8px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        borderTop: '1px solid #f1f5f9'
      }}>
        <Tooltip label={user?.name || 'Profile'}>
          <button
            onClick={() => navigate('/profile')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            {Avatar}
          </button>
        </Tooltip>
        <Tooltip label="Logout">
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              transition: 'background 0.15s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <MdLogout style={{ fontSize: 20 }} />
          </button>
        </Tooltip>
      </div>
    )
  }

  return (
    <div style={{
      borderTop: '1px solid #f1f5f9',
      padding: '10px 12px 12px',
      flexShrink: 0
    }}>
      {/* User info row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
        padding: '8px 8px',
        borderRadius: 10,
        background: BG
      }}>
        {Avatar}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 13,
            color: TEXT,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {user?.name || 'User'}
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            marginTop: 2,
            background: `${roleColor}18`,
            color: roleColor,
            borderRadius: 20,
            padding: '2px 8px',
            fontSize: 10,
            fontWeight: 700,
            fontFamily: FONT,
            letterSpacing: 0.5,
            textTransform: 'uppercase'
          }}>
            {role || 'USER'}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={() => navigate('/profile')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '7px 10px',
            background: 'transparent',
            border: `1px solid #e2e8f0`,
            borderRadius: 8,
            cursor: 'pointer',
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 500,
            color: TEXT,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = ACCENT_LIGHT; e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = TEXT }}
        >
          <MdPerson style={{ fontSize: 16 }} />
          Profile
        </button>
        <button
          onClick={logout}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '7px 10px',
            background: 'transparent',
            border: `1px solid #fee2e2`,
            borderRadius: 8,
            cursor: 'pointer',
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 500,
            color: '#ef4444',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#ef4444' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#fee2e2' }}
        >
          <MdLogout style={{ fontSize: 16 }} />
          Logout
        </button>
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar({ onCollapsedChange, isMobile, sidebarOpen, onClose }) {
  const { user, logout } = useAuth()
  const role = user?.role
  const location = useLocation()

  // ── Collapse state (persisted, desktop only) ──
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  // On mobile, never use collapsed mode
  const effectiveCollapsed = isMobile ? false : collapsed

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      try { localStorage.setItem('sidebar_collapsed', String(next)) } catch { /* ignore storage errors */ }
      return next
    })
  }

  useEffect(() => {
    if (onCollapsedChange) onCollapsedChange(effectiveCollapsed)
  }, [effectiveCollapsed, onCollapsedChange])

  // ── Search ──
  const [search, setSearch] = useState('')
  const searchRef = useRef(null)

  // ── Determine which section the current URL belongs to ──
  const isFaculty = role === 'FACULTY'
  const isStudent = role === 'STUDENT'
  const isAccordionRole = isStudent || isFaculty
  const sections = isStudent ? STUDENT_SECTIONS : isFaculty ? FACULTY_SECTIONS : []

  function getActiveSectionKey(pathname, sects) {
    for (const sec of sects) {
      for (const item of sec.items) {
        if (pathname.startsWith(item.to)) return sec.key
      }
    }
    return null
  }

  const activeSectionKey = getActiveSectionKey(location.pathname, sections)

  // ── Accordion open state: auto-open the active section on mount / navigation ──
  const [openSections, setOpenSections] = useState(() => {
    const initial = activeSectionKey ? [activeSectionKey] : ['academics']
    return initial
  })

  // Keep active section open when route changes
  useEffect(() => {
    if (activeSectionKey) {
      setOpenSections((prev) =>
        prev.includes(activeSectionKey) ? prev : [...prev, activeSectionKey]
      )
    }
  }, [activeSectionKey])

  // When search is active, expand all sections
  useEffect(() => {
    if (search.trim()) {
      setOpenSections(sections.map((s) => s.key))
    }
  }, [search])

  const toggleSection = (key) => {
    setOpenSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  // ── Filter sections by search ──
  const normalizedSearch = search.trim().toLowerCase()
  const visibleSections = normalizedSearch
    ? sections.filter(
        (sec) =>
          sec.label.toLowerCase().includes(normalizedSearch) ||
          sec.items.some((item) => item.label.toLowerCase().includes(normalizedSearch))
      )
    : sections

  // ── Role config ──
  const roleColors = {
    ADMIN:   '#ef4444',
    FACULTY: '#6366f1',
    STUDENT: '#10b981',
    STAFF:   '#f59e0b',
    ALUMNI:  '#0ea5e9',
    PARENT:  '#a855f7',
  }
  const roleColor = roleColors[role] || ACCENT

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

  const alumniItems = [
    { to: '/alumni',  icon: <MdSchool />,   label: 'Alumni Portal' },
    { to: '/profile', icon: <MdPerson />,   label: 'My Profile'   },
  ]

  const parentItems = [
    { to: '/parent',  icon: <MdSupervisorAccount />, label: 'Parent Portal' },
    { to: '/profile', icon: <MdPerson />,            label: 'My Profile'   },
  ]

  const roleItems = {
    ADMIN:   adminItems,
    FACULTY: facultyItems,
    STAFF:   staffItems,
    ALUMNI:  alumniItems,
    PARENT:  parentItems,
  }

  const specificItems = roleItems[role] || []

  return (
    <SidebarContext.Provider value={{ collapsed: effectiveCollapsed }}>
      <aside style={{
        width: effectiveCollapsed ? 64 : 260,
        height: '100%',          // fills the h-screen flex parent on desktop
        background: '#fff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: isMobile
          ? 'left 0.3s ease'
          : 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: isMobile ? 'fixed' : 'relative',
        top: isMobile ? 0 : undefined,
        left: isMobile ? (sidebarOpen ? 0 : -260) : undefined,
        zIndex: isMobile ? 500 : undefined,
        boxShadow: isMobile && sidebarOpen ? '4px 0 24px rgba(0,0,0,0.15)' : undefined,
      }}>

        {/* ── Logo / Brand ── */}
        <div style={{
          padding: effectiveCollapsed ? '20px 0 16px' : '20px 20px 16px',
          borderBottom: '1px solid #f1f5f9',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: effectiveCollapsed ? 'center' : 'flex-start',
          gap: 10,
          transition: 'padding 0.25s ease'
        }}>
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
          {!effectiveCollapsed && (
            <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: TEXT, whiteSpace: 'nowrap' }}>
                College ERP
              </div>
              <div style={{ fontFamily: FONT, fontSize: 11, color: MUTED, whiteSpace: 'nowrap' }}>
                Management System
              </div>
            </div>
          )}
          {/* Close button — mobile only */}
          {isMobile && (
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                fontSize: 16,
                color: MUTED,
                padding: 0,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Collapse toggle button — desktop only ── */}
        {!isMobile && (
          <button
            onClick={toggleCollapsed}
            title={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              position: 'absolute',
              top: 22,
              right: effectiveCollapsed ? -1 : -13,
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#fff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'right 0.25s ease',
              padding: 0
            }}
          >
            {effectiveCollapsed
              ? <MdChevronRight style={{ fontSize: 16, color: MUTED }} />
              : <MdChevronLeft style={{ fontSize: 16, color: MUTED }} />
            }
          </button>
        )}

        {/* ── Role badge ── */}
        {!effectiveCollapsed && (
          <div style={{ padding: '12px 16px 4px', flexShrink: 0 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: `${roleColor}18`,
              color: roleColor,
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
        )}

        {/* ── Search box ── */}
        {!effectiveCollapsed && isAccordionRole && (
          <div style={{ padding: '8px 12px 4px', flexShrink: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: BG,
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '6px 10px',
              transition: 'border-color 0.15s'
            }}
              onFocus={() => {}}
            >
              <MdSearch style={{ fontSize: 15, color: MUTED, flexShrink: 0 }} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontFamily: FONT,
                  fontSize: 13,
                  color: TEXT,
                  outline: 'none',
                  padding: 0
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    color: MUTED,
                    fontSize: 14
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Nav area — scrollable ── */}
        <nav style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: isAccordionRole ? '4px 0' : (effectiveCollapsed ? '4px 0' : '4px 12px')
        }}>

          {/* Dashboard — always visible */}
          {isAccordionRole ? (
            effectiveCollapsed ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                <Tooltip label="Dashboard">
                  <NavLink
                    to="/dashboard"
                    onClick={isMobile ? onClose : undefined}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      textDecoration: 'none',
                      background: isActive ? ACCENT_LIGHT : 'transparent',
                      color: isActive ? ACCENT : TEXT,
                      transition: 'all 0.2s ease'
                    })}
                  >
                    <MdDashboard style={{ fontSize: 20 }} />
                  </NavLink>
                </Tooltip>
              </div>
            ) : (
              <div style={{ padding: '0 12px', marginBottom: 4 }}>
                <NavLink
                  to="/dashboard"
                  onClick={isMobile ? onClose : undefined}
                  style={({ isActive }) => navLinkStyle(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        top: '15%',
                        height: '70%',
                        width: isActive ? 3 : 0,
                        background: ACCENT,
                        borderRadius: '0 3px 3px 0',
                        transition: 'width 0.2s ease'
                      }} />
                      <span style={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>
                        <MdDashboard />
                      </span>
                      <span>Dashboard</span>
                    </>
                  )}
                </NavLink>
              </div>
            )
          ) : (
            <NavItem
              to="/dashboard"
              icon={<MdDashboard />}
              label="Dashboard"
              collapsed={effectiveCollapsed}
              onClose={isMobile ? onClose : undefined}
            />
          )}

          {/* ── STUDENT accordion menu ── */}
          {isStudent && (
            <div style={{ marginTop: 8, padding: effectiveCollapsed ? '0 4px' : '0 8px' }}>
              {effectiveCollapsed
                ? STUDENT_SECTIONS.map((section) => (
                    <AccordionSection
                      key={section.key}
                      section={section}
                      isOpen={openSections.includes(section.key)}
                      onToggle={() => toggleSection(section.key)}
                      collapsed={effectiveCollapsed}
                    />
                  ))
                : visibleSections.map((section) => (
                    <AccordionSection
                      key={section.key}
                      section={section}
                      isOpen={openSections.includes(section.key)}
                      onToggle={() => toggleSection(section.key)}
                      collapsed={false}
                      onItemClick={isMobile ? onClose : undefined}
                    />
                  ))
              }
              {!effectiveCollapsed && normalizedSearch && visibleSections.length === 0 && (
                <div style={{ padding: '12px 16px', fontFamily: FONT, fontSize: 13, color: MUTED }}>
                  No results for "{search}"
                </div>
              )}
            </div>
          )}

          {/* ── FACULTY accordion menu ── */}
          {isFaculty && (
            <div style={{ marginTop: 8, padding: effectiveCollapsed ? '0 4px' : '0 8px' }}>
              {effectiveCollapsed
                ? FACULTY_SECTIONS.map((section) => (
                    <AccordionSection
                      key={section.key}
                      section={section}
                      isOpen={openSections.includes(section.key)}
                      onToggle={() => toggleSection(section.key)}
                      collapsed={effectiveCollapsed}
                    />
                  ))
                : visibleSections.map((section) => (
                    <AccordionSection
                      key={section.key}
                      section={section}
                      isOpen={openSections.includes(section.key)}
                      onToggle={() => toggleSection(section.key)}
                      collapsed={false}
                      sectionBadges={BADGE_COUNTS[section.key]}
                      onItemClick={isMobile ? onClose : undefined}
                    />
                  ))
              }
              {!effectiveCollapsed && normalizedSearch && visibleSections.length === 0 && (
                <div style={{ padding: '12px 16px', fontFamily: FONT, fontSize: 13, color: MUTED }}>
                  No results for "{search}"
                </div>
              )}
            </div>
          )}

          {/* ── Non-accordion role-specific items ── */}
          {!isAccordionRole && specificItems.length > 0 && (
            <div style={{ marginTop: 8 }}>
              {!effectiveCollapsed && (
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
              )}
              {specificItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  collapsed={effectiveCollapsed}
                  onClose={isMobile ? onClose : undefined}
                />
              ))}
            </div>
          )}

          {/* ── Profile link (non-accordion roles) ── */}
          {!isAccordionRole && (
            <div style={{ marginTop: 8 }}>
              {!effectiveCollapsed && (
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
              )}
              <NavItem
                to="/profile"
                icon={<MdPerson />}
                label="Profile"
                collapsed={effectiveCollapsed}
                onClose={isMobile ? onClose : undefined}
              />
            </div>
          )}
        </nav>

        {/* ── Bottom user card ── */}
        <UserCard
          user={user}
          role={role}
          roleColor={roleColor}
          logout={logout}
          collapsed={effectiveCollapsed}
        />
      </aside>
    </SidebarContext.Provider>
  )
}
