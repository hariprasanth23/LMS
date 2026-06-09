import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import {
  MdSearch,
  MdNotifications,
  MdPerson,
  MdSettings,
  MdLock,
  MdLogout,
  MdAssignment,
  MdEvent,
  MdPayment,
  MdHome,
  MdChevronRight,
  MdMenu,
} from 'react-icons/md'

// ─── Constants ───────────────────────────────────────────────────────────────

const TEXT   = '#1e293b'
const MUTED  = '#64748b'
const ACCENT = '#6366f1'

const roleColors = {
  ADMIN:   { bg: '#fef2f2', color: '#ef4444',  avatar: '#ef4444'  },
  FACULTY: { bg: '#eef2ff', color: ACCENT,      avatar: ACCENT     },
  STUDENT: { bg: '#f0fdf4', color: '#10b981',  avatar: '#10b981'  },
  STAFF:   { bg: '#fffbeb', color: '#f59e0b',  avatar: '#f59e0b'  },
  PARENT:  { bg: '#fdf4ff', color: '#a855f7',  avatar: '#a855f7'  },
  ALUMNI:  { bg: '#fff7ed', color: '#ea580c',  avatar: '#ea580c'  },
}

// Icon + colour map keyed by notification type from the backend
const TYPE_ICON = {
  ASSIGNMENT: { icon: MdAssignment, color: ACCENT      },
  EXAM:       { icon: MdEvent,      color: '#10b981'   },
  PAYMENT:    { icon: MdPayment,    color: '#f59e0b'   },
  ALERT:      { icon: MdEvent,      color: '#ef4444'   },
  EVENT:      { icon: MdEvent,      color: '#8b5cf6'   },
  INFO:       { icon: MdAssignment, color: MUTED       },
}

function relativeTime(isoString) {
  if (!isoString) return ''
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000)
  if (diff < 60)    return 'just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
  return `${Math.floor(diff / 86400)} day ago`
}

// ─── Page title / breadcrumb helpers ─────────────────────────────────────────

/**
 * Map a slug segment (kebab-case) to a display label.
 */
const SEGMENT_LABELS = {
  dashboard:                 'Dashboard',
  students:                  'Students',
  courses:                   'Courses',
  assignments:               'Assignments',
  employees:                 'Employees',
  attendance:                'Attendance',
  leaves:                    'Leaves',
  payroll:                   'Payroll',
  profile:                   'Profile',
  academics:                 'Academics',
  examinations:              'Examinations',
  finance:                   'Finance',
  services:                  'Services',
  research:                  'Research',
  feedback:                  'Feedback',
  faculty:                   'Faculty',
  hr:                        'HR',
  events:                    'Events',
  proctor:                   'Proctor',
  general:                   'General',
  'course-registration':     'Course Registration',
  'project-proposal':        'Project Proposal',
  arrear:                    'Arrear Exam',
  online:                    'Online Exam',
  makeup:                    'Makeup Exam',
  payments:                  'Online Payments',
  'my-info':                 'My Info',
  'my-account':              'My Account',
  bonafide:                  'Bonafide',
  library:                   'Library',
  'info-corner':             'Info Corner',
  'coursework-allocation':   'Coursework Allocation',
  'biometric-info':          'Biometric Info',
  'physical-education':      'Physical Education',
  'international-relations': 'International Relations',
  'tlce-fdp':                'TLCE / FDP',
  'pre-proposal':            'Pre-Proposal',
  'sw-events':               'SW Events',
  'medical-info':            'Medical Info',
  'students-info':           'Students Info',
  evaluations:               'Evaluations',
  'question-paper':          'Question Paper',
  invigilation:              'Invigilation',
  'outcome-set-conference':  'Outcome Set Conference',
  'set-conference':          'SET Conference',
  course:                    'Course',
  council:                   'Council',
  'qc-meeting':              'QC Meeting',
  'outcome-course-plan':     'Outcome Course Plan',
  'extra-curricular':        'Extra Curricular',
  'project-registration':    'Project Registration',
}

function labelFor(slug) {
  return SEGMENT_LABELS[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Returns { title, breadcrumbs } for a given pathname.
 *
 * breadcrumbs is an array of { label, path } objects.
 * The page title is formed by joining the last two meaningful segments with " — ".
 */
function getPageTitle(pathname) {
  // Strip leading slash and split
  const parts = pathname.replace(/^\//, '').split('/').filter(Boolean)

  if (parts.length === 0) {
    return { title: 'Dashboard', breadcrumbs: [{ label: 'Home', path: '/dashboard' }] }
  }

  // Build breadcrumb chain: Home > seg1 > seg2 …
  const crumbs = [{ label: 'Home', path: '/dashboard' }]
  let builtPath = ''
  parts.forEach(seg => {
    builtPath += '/' + seg
    crumbs.push({ label: labelFor(seg), path: builtPath })
  })

  // Title: for nested paths use "Section — Page", for single use just the label
  let title
  if (parts.length === 1) {
    title = labelFor(parts[0])
  } else {
    // Pick the first "section" segment and the last "leaf" segment
    const section = labelFor(parts[parts.length - 2])
    const leaf    = labelFor(parts[parts.length - 1])
    title = `${section} — ${leaf}`
  }

  return { title, breadcrumbs: crumbs }
}

// ─── Avatar helpers ───────────────────────────────────────────────────────────

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CircleButton({ onClick, children, style = {} }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: '1px solid #e2e8f0',
        background: hovered ? '#eef2ff' : '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
        borderColor: hovered ? ACCENT : '#e2e8f0',
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function DropdownPanel({ children, style = {} }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 48,
        right: 0,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: '1px solid #e2e8f0',
        zIndex: 1000,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── Notifications dropdown ───────────────────────────────────────────────────

function NotificationsDropdown({ onClose, onCountChange }) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    api.get('/notifications')
      .then(r => setNotifications(r.data.data || []))
      .catch(() => {})
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAllRead = async () => {
    try {
      await api.post('/notifications/mark-all-read')
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      onCountChange?.(0)
    } catch { /* silent */ }
  }

  return (
    <DropdownPanel style={{ width: 320, padding: 0 }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px 10px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: 14, color: TEXT }}>
          Notifications
        </span>
        {unreadCount > 0 && (
          <span style={{
            background: '#fef2f2',
            color: '#ef4444',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'system-ui, sans-serif',
            padding: '2px 8px',
            borderRadius: 99,
          }}>
            {unreadCount} unread
          </span>
        )}
      </div>

      {/* Items */}
      <div style={{ maxHeight: 260, overflowY: 'auto' }}>
        {notifications.length === 0 && (
          <div style={{ padding: '20px 16px', textAlign: 'center', color: MUTED, fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
            No notifications
          </div>
        )}
        {notifications.map(n => {
          const { icon: Icon, color: iconColor } = TYPE_ICON[n.type] || TYPE_ICON.INFO
          return (
            <div
              key={n.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '11px 16px',
                borderBottom: '1px solid #f8fafc',
                background: !n.isRead ? '#fafbff' : '#fff',
                cursor: 'default',
              }}
            >
              {/* Icon bubble */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: iconColor + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1,
              }}>
                <Icon style={{ color: iconColor, fontSize: 16 }} />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: TEXT, fontWeight: !n.isRead ? 600 : 400, lineHeight: 1.4, whiteSpace: 'normal' }}>
                  {n.title}
                </div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: MUTED, marginTop: 2 }}>
                  {relativeTime(n.createdAt)}
                </div>
              </div>

              {/* Unread dot */}
              {!n.isRead && (
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: ACCENT, flexShrink: 0, marginTop: 5 }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <button
          onClick={markAllRead}
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 12,
            fontWeight: 500,
            color: ACCENT,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          Mark all as read
        </button>
        <button
          onClick={onClose}
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 12,
            fontWeight: 500,
            color: MUTED,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          View all
        </button>
      </div>
    </DropdownPanel>
  )
}

// ─── User menu dropdown ───────────────────────────────────────────────────────

function UserMenuDropdown({ user, roleStyle, onClose, onLogout, onProfile }) {
  const initials = getInitials(user?.name)

  const MenuItem = ({ icon, label, onClick, danger = false }) => {
    const [hovered, setHovered] = useState(false)
    return (
      <button
        onClick={() => { onClick(); onClose() }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          padding: '9px 16px',
          background: hovered ? (danger ? '#fef2f2' : '#f8fafc') : 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 13,
          fontWeight: 500,
          color: danger ? '#ef4444' : TEXT,
          transition: 'background 0.12s',
        }}
      >
        <span style={{ fontSize: 15 }}>{icon}</span>
        {label}
      </button>
    )
  }

  return (
    <DropdownPanel style={{ width: 220, padding: 0 }}>
      {/* User header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: roleStyle.avatar,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 14,
        }}>
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            color: TEXT,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {user?.name || 'User'}
          </div>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 11,
            color: MUTED,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {user?.email}
          </div>
          <span style={{
            display: 'inline-block',
            marginTop: 3,
            padding: '1px 7px',
            borderRadius: 99,
            fontSize: 10,
            fontWeight: 700,
            fontFamily: 'system-ui, sans-serif',
            background: roleStyle.bg,
            color: roleStyle.color,
            letterSpacing: 0.3,
          }}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Menu items */}
      <div style={{ padding: '6px 0' }}>
        <MenuItem icon="👤" label="My Profile"      onClick={onProfile} />
        <MenuItem icon="⚙️" label="Settings"        onClick={() => {}} />
        <MenuItem icon="🔑" label="Change Password" onClick={() => {}} />
      </div>

      <div style={{ borderTop: '1px solid #f1f5f9', padding: '6px 0' }}>
        <MenuItem icon="🚪" label="Sign Out" onClick={onLogout} danger />
      </div>
    </DropdownPanel>
  )
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar({ onToggleSidebar, isMobile }) {
  const { user, logout, portalType } = useAuth()
  const location  = useLocation()
  const navigate  = useNavigate()

  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu,      setShowUserMenu]      = useState(false)
  const [unreadCount,       setUnreadCount]       = useState(0)

  const notifRef   = useRef(null)
  const userMenuRef = useRef(null)

  // Fetch unread count on mount (lightweight — just a number)
  useEffect(() => {
    api.get('/notifications/unread-count')
      .then(r => setUnreadCount(r.data.data?.count ?? 0))
      .catch(() => {})
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const roleStyle = roleColors[user?.role] || roleColors.FACULTY
  const initials  = getInitials(user?.name)

  const { title, breadcrumbs } = getPageTitle(location.pathname)

  // Portal badge label: prefer portalType from context, fall back to role
  const portalLabel = (portalType || user?.role || '').toUpperCase()

  return (
    <header style={{
      height: 64,
      minHeight: 64,
      background: '#fff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '0 16px' : '0 24px',
      flexShrink: 0,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      gap: isMobile ? 10 : 16,
    }}>

      {/* ── Left: Hamburger (mobile) + Page title + breadcrumbs ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 0, minWidth: 0, flex: 1 }}>

        {/* Hamburger button — mobile only */}
        {isMobile && (
          <button
            onClick={() => onToggleSidebar?.()}
            aria-label="Toggle sidebar"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              padding: 0,
            }}
          >
            <MdMenu style={{ color: MUTED, fontSize: 22 }} />
          </button>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, flex: 1 }}>
          <h1 style={{
            margin: 0,
            fontSize: isMobile ? 14 : 16,
            fontWeight: 700,
            color: TEXT,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.3,
          }}>
            {title}
          </h1>

          {/* Breadcrumbs — hidden on mobile */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              marginTop: 2,
              flexWrap: 'nowrap',
              overflow: 'hidden',
            }}>
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1
                return (
                  <React.Fragment key={crumb.path}>
                    {idx > 0 && (
                      <MdChevronRight style={{ color: '#cbd5e1', fontSize: 13, flexShrink: 0 }} />
                    )}
                    <span
                      onClick={isLast ? undefined : () => navigate(crumb.path)}
                      style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: 11,
                        fontWeight: isLast ? 600 : 400,
                        color: isLast ? ACCENT : MUTED,
                        cursor: isLast ? 'default' : 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'color 0.12s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                      onMouseEnter={e => { if (!isLast) e.currentTarget.style.color = TEXT }}
                      onMouseLeave={e => { if (!isLast) e.currentTarget.style.color = MUTED }}
                    >
                      {idx === 0 && <MdHome style={{ fontSize: 12 }} />}
                      {crumb.label}
                    </span>
                  </React.Fragment>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10, flexShrink: 0 }}>

        {/* Portal badge — hidden on mobile */}
        {portalLabel && !isMobile && (
          <span style={{
            padding: '3px 10px',
            borderRadius: 99,
            fontSize: 10,
            fontWeight: 800,
            background: roleStyle.bg,
            color: roleStyle.color,
            letterSpacing: 0.8,
            fontFamily: 'system-ui, sans-serif',
            textTransform: 'uppercase',
            border: `1px solid ${roleStyle.color}28`,
          }}>
            {portalLabel}
          </span>
        )}

        {/* Search button — hidden on mobile */}
        {!isMobile && (
          <CircleButton onClick={() => alert('Search coming soon')}>
            <MdSearch style={{ color: MUTED, fontSize: 18 }} />
          </CircleButton>
        )}

        {/* Notifications bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <CircleButton onClick={() => { setShowNotifications(p => !p); setShowUserMenu(false) }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdNotifications style={{ color: showNotifications ? ACCENT : MUTED, fontSize: 18 }} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  background: '#ef4444',
                  border: '2px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8,
                  fontWeight: 700,
                  color: '#fff',
                  fontFamily: 'system-ui, sans-serif',
                  lineHeight: 1,
                }}>
                  {unreadCount}
                </span>
              )}
            </div>
          </CircleButton>

          {showNotifications && (
            <NotificationsDropdown
              onClose={() => setShowNotifications(false)}
              onCountChange={setUnreadCount}
            />
          )}
        </div>

        {/* User avatar + dropdown */}
        <div ref={userMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowUserMenu(p => !p); setShowNotifications(false) }}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: roleStyle.avatar,
              border: showUserMenu ? `2px solid ${ACCENT}` : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 700,
              fontSize: 13,
              transition: 'border-color 0.15s, box-shadow 0.15s',
              boxShadow: showUserMenu ? `0 0 0 3px ${ACCENT}28` : 'none',
              flexShrink: 0,
            }}
          >
            {initials}
          </button>

          {showUserMenu && (
            <UserMenuDropdown
              user={user}
              roleStyle={roleStyle}
              onClose={() => setShowUserMenu(false)}
              onLogout={logout}
              onProfile={() => navigate('/profile')}
            />
          )}
        </div>

      </div>
    </header>
  )
}
