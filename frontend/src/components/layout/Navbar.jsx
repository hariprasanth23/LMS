import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { MdLogout, MdPerson } from 'react-icons/md'

const roleColors = {
  ADMIN: { bg: '#fef2f2', color: '#ef4444' },
  FACULTY: { bg: '#eef2ff', color: '#6366f1' },
  STUDENT: { bg: '#f0fdf4', color: '#10b981' },
  STAFF: { bg: '#fffbeb', color: '#f59e0b' }
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const roleStyle = roleColors[user?.role] || { bg: '#eef2ff', color: '#6366f1' }

  return (
    <header style={{
      height: 60,
      background: '#fff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0
    }}>
      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
        Welcome back, {user?.name?.split(' ')[0] || 'User'}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Role badge */}
        <span style={{
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'system-ui, sans-serif',
          background: roleStyle.bg,
          color: roleStyle.color,
          letterSpacing: 0.5
        }}>
          {user?.role}
        </span>

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: '#eef2ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MdPerson style={{ color: '#6366f1', fontSize: 18 }} />
          </div>
          <div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>
              {user?.name}
            </div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: '#64748b', lineHeight: 1.2 }}>
              {user?.email}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 500,
            color: '#64748b',
            transition: 'all 0.15s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fef2f2'
            e.currentTarget.style.borderColor = '#fca5a5'
            e.currentTarget.style.color = '#ef4444'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff'
            e.currentTarget.style.borderColor = '#e2e8f0'
            e.currentTarget.style.color = '#64748b'
          }}
        >
          <MdLogout style={{ fontSize: 16 }} />
          Logout
        </button>
      </div>
    </header>
  )
}
