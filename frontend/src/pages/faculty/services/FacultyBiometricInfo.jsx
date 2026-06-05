import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }
const navItems = ['Time Based', 'Class Number Based']

const thStyle = {
  padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600,
  color: MUTED, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', background: '#f8fafc',
}
const tdStyle = { padding: '11px 14px', fontSize: 14, color: TEXT, borderBottom: '1px solid #f1f5f9' }

// ─── Time Based ────────────────────────────────────────────────────────────────
const timeLog = [
  { date: '2025-06-02', day: 'Mon', timeIn: '08:52', timeOut: '17:05', duration: '8h 13m', status: 'Present' },
  { date: '2025-06-03', day: 'Tue', timeIn: '09:10', timeOut: '17:00', duration: '7h 50m', status: 'Late' },
  { date: '2025-06-04', day: 'Wed', timeIn: '08:45', timeOut: '17:20', duration: '8h 35m', status: 'Present' },
  { date: '2025-06-05', day: 'Thu', timeIn: '—', timeOut: '—', duration: '—', status: 'Absent' },
  { date: '2025-05-30', day: 'Fri', timeIn: '08:58', timeOut: '17:10', duration: '8h 12m', status: 'Present' },
  { date: '2025-05-29', day: 'Thu', timeIn: '08:50', timeOut: '17:00', duration: '8h 10m', status: 'Present' },
  { date: '2025-05-28', day: 'Wed', timeIn: '09:20', timeOut: '17:15', duration: '7h 55m', status: 'Late' },
  { date: '2025-05-27', day: 'Tue', timeIn: '08:55', timeOut: '17:05', duration: '8h 10m', status: 'Present' },
]

const calendarData = {
  1: 'P', 2: 'P', 3: 'L', 4: 'A', 5: 'P', 6: 'P', 7: 'P',
  8: 'P', 9: 'L', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'H',
  15: 'P', 16: 'P', 17: 'P', 18: 'A', 19: 'P', 20: 'P', 21: 'P',
  22: 'P', 23: 'P', 24: 'P', 25: 'P', 26: 'H', 27: 'P', 28: 'P',
  29: 'P', 30: 'P',
}

const calDayColors = { P: { bg: '#dcfce7', color: '#16a34a' }, A: { bg: '#fee2e2', color: '#dc2626' }, L: { bg: '#fef3c7', color: '#d97706' }, H: { bg: '#e0e7ff', color: '#6366f1' } }

function statusBadge(status) {
  const map = { Present: { bg: '#dcfce7', color: '#16a34a' }, Late: { bg: '#fef3c7', color: '#d97706' }, Absent: { bg: '#fee2e2', color: '#dc2626' } }
  const sc = map[status] || { bg: '#f1f5f9', color: MUTED }
  return <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>{status}</span>
}

function TimeBasedSection() {
  const present = Object.values(calendarData).filter(v => v === 'P').length
  const absent = Object.values(calendarData).filter(v => v === 'A').length
  const late = Object.values(calendarData).filter(v => v === 'L').length

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Present', value: present, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Absent', value: absent, color: '#dc2626', bg: '#fee2e2' },
          { label: 'Late', value: late, color: '#d97706', bg: '#fef3c7' },
          { label: 'Holidays', value: 2, color: ACCENT, bg: '#eef2ff' },
        ].map((s, i) => (
          <div key={i} style={{ ...card, padding: 18, textAlign: 'center', background: s.bg }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: s.color, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>June 2025 — Attendance Calendar</h3>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: MUTED }}>
            {[['P', '#16a34a', 'Present'], ['A', '#dc2626', 'Absent'], ['L', '#d97706', 'Late'], ['H', ACCENT, 'Holiday']].map(([key, color, label]) => (
              <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: calDayColors[key].bg, border: `1px solid ${color}`, display: 'inline-block' }} />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: MUTED, padding: '4px 0' }}>{d}</div>
          ))}
          {Array.from({ length: 0 }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
            const status = calendarData[day]
            const style = status ? calDayColors[status] : { bg: '#f8fafc', color: MUTED }
            return (
              <div key={day} style={{ textAlign: 'center', padding: '7px 2px', borderRadius: 6, background: style.bg, color: style.color, fontSize: 13, fontWeight: status ? 700 : 400 }}>
                {day}
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT }}>Biometric Log</h3>
        <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Export CSV
        </button>
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Date', 'Day', 'Time In', 'Time Out', 'Duration', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {timeLog.map((r, i) => (
              <tr key={i}>
                <td style={tdStyle}>{r.date}</td>
                <td style={tdStyle}>{r.day}</td>
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 600 }}>{r.timeIn}</td>
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 600 }}>{r.timeOut}</td>
                <td style={tdStyle}>{r.duration}</td>
                <td style={tdStyle}>{statusBadge(r.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Class Number Based ────────────────────────────────────────────────────────
const classLog = [
  { date: '2025-06-04', classNo: 'CL001', courseCode: 'CS6001', time: '09:00–09:50', present: 52, total: 60, recorded: true },
  { date: '2025-06-04', classNo: 'CL002', courseCode: 'CS6002', time: '10:00–10:50', present: 45, total: 55, recorded: true },
  { date: '2025-06-04', classNo: 'CL003', courseCode: 'CS6001', time: '11:00–11:50', present: 0, total: 60, recorded: false },
  { date: '2025-06-03', classNo: 'CL004', courseCode: 'CS5001', time: '14:00–14:50', present: 38, total: 42, recorded: true },
  { date: '2025-06-03', classNo: 'CL005', courseCode: 'CS6003', time: '15:00–15:50', present: 29, total: 35, recorded: true },
  { date: '2025-06-02', classNo: 'CL006', courseCode: 'CS6002', time: '09:00–09:50', present: 50, total: 55, recorded: true },
]

function ClassNumberBasedSection() {
  const [marked, setMarked] = useState({})

  const handleMark = (classNo) => {
    setMarked(p => ({ ...p, [classNo]: true }))
  }

  return (
    <div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15, color: TEXT }}>
          Class-wise Attendance Record
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Date', 'Class No', 'Course Code', 'Time', 'Students Present', 'Students Total', 'Attendance %', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {classLog.map((r, i) => {
              const pct = r.recorded || marked[r.classNo] ? ((r.present / r.total) * 100).toFixed(1) : null
              const isRecorded = r.recorded || marked[r.classNo]
              return (
                <tr key={i}>
                  <td style={tdStyle}>{r.date}</td>
                  <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>{r.classNo}</td>
                  <td style={tdStyle}>{r.courseCode}</td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace' }}>{r.time}</td>
                  <td style={tdStyle}>{isRecorded ? r.present : <span style={{ color: MUTED }}>—</span>}</td>
                  <td style={tdStyle}>{r.total}</td>
                  <td style={tdStyle}>
                    {pct ? (
                      <span style={{ fontWeight: 700, color: parseFloat(pct) >= 75 ? '#16a34a' : '#dc2626' }}>{pct}%</span>
                    ) : <span style={{ color: MUTED }}>—</span>}
                  </td>
                  <td style={tdStyle}>
                    {isRecorded ? (
                      <span style={{ color: '#16a34a', fontWeight: 600, fontSize: 13 }}>Recorded</span>
                    ) : (
                      <button
                        onClick={() => handleMark(r.classNo)}
                        style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Mark Attendance
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyBiometricInfo() {
  const [activeNav, setActiveNav] = useState('Time Based')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Services — Biometric Info</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Attendance via biometric systems</p>
      </div>

      <div style={{ ...card, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: 210, borderRight: '1px solid #f1f5f9', padding: '16px 0', flexShrink: 0 }}>
          {navItems.map(item => (
            <button key={item} onClick={() => setActiveNav(item)}
              style={{
                display: 'block', width: '100%', padding: '11px 20px',
                background: activeNav === item ? '#eef2ff' : 'transparent',
                border: 'none', borderLeft: activeNav === item ? '3px solid #6366f1' : '3px solid transparent',
                textAlign: 'left', fontSize: 14, fontWeight: activeNav === item ? 600 : 400,
                color: activeNav === item ? ACCENT : TEXT, cursor: 'pointer',
              }}
            >{item}</button>
          ))}
        </div>
        <div style={{ flex: 1, padding: 28, minWidth: 0 }}>
          {activeNav === 'Time Based' && <TimeBasedSection />}
          {activeNav === 'Class Number Based' && <ClassNumberBasedSection />}
        </div>
      </div>
    </div>
  )
}
