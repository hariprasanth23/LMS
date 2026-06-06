import React from 'react'

const TEXT = '#0f172a'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

export default function PageHeader({ title, subtitle, badge, action }) {
  return (
    <div style={{
      marginBottom: 24,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: 12,
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div>
        {badge && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '3px 10px',
            background: '#eef2ff',
            color: ACCENT,
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            marginBottom: 8
          }}>
            {badge}
          </div>
        )}
        <h1 style={{
          fontSize: 22,
          fontWeight: 800,
          color: TEXT,
          margin: '0 0 6px',
          letterSpacing: -0.5
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: 0, fontSize: 14, color: MUTED }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
