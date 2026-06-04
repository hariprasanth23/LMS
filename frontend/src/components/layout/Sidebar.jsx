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
  MdQuiz
} from 'react-icons/md'

const ACCENT = '#6366f1'
const ACCENT_LIGHT = '#eef2ff'
const TEXT = '#1e293b'
const MUTED = '#64748b'

const navLinkStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 16px',
  borderRadius: 8,
  textDecoration: 'none',
  fontFamily: 'system-ui, -apple-system, sans-serif',
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

export default function Sidebar() {
  const { user } = useAuth()
  const role = user?.role

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

  const studentItems = [
    { to: '/courses', icon: <MdBook />, label: 'My Courses' },
    { to: '/assignments', icon: <MdAssignment />, label: 'Assignments' },
    { to: '/attendance', icon: <MdEventNote />, label: 'My Attendance' }
  ]

  const staffItems = [
    { to: '/leaves', icon: <MdBeachAccess />, label: 'Leaves' },
    { to: '/attendance', icon: <MdEventNote />, label: 'Attendance' }
  ]

  const roleItems = {
    ADMIN: adminItems,
    FACULTY: facultyItems,
    STUDENT: studentItems,
    STAFF: staffItems
  }

  const roleColors = {
    ADMIN: '#ef4444',
    FACULTY: '#6366f1',
    STUDENT: '#10b981',
    STAFF: '#f59e0b'
  }

  const specificItems = roleItems[role] || []

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: '#fff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            background: ACCENT,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MdSchool style={{ color: '#fff', fontSize: 20 }} />
          </div>
          <div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: 14, color: TEXT }}>
              College ERP
            </div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: MUTED }}>
              Management System
            </div>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div style={{ padding: '12px 16px 8px' }}>
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
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: 0.5,
          textTransform: 'uppercase'
        }}>
          {role || 'USER'}
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ padding: '4px 12px', flex: 1 }}>
        <NavItem to="/dashboard" icon={<MdDashboard />} label="Dashboard" />

        {specificItems.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{
              padding: '8px 4px 4px',
              fontSize: 10,
              fontWeight: 700,
              color: MUTED,
              fontFamily: 'system-ui, sans-serif',
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

        <div style={{ marginTop: 8 }}>
          <div style={{
            padding: '8px 4px 4px',
            fontSize: 10,
            fontWeight: 700,
            color: MUTED,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: 1,
            textTransform: 'uppercase'
          }}>
            Account
          </div>
          <NavItem to="/profile" icon={<MdPerson />} label="Profile" />
        </div>
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #f1f5f9',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 11,
        color: MUTED,
        textAlign: 'center'
      }}>
        College ERP v1.0
      </div>
    </aside>
  )
}
