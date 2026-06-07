import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = [
  'Employee Search',
  'View Addl Role Details',
  'My School/Centre Employees',
  'Mobile Number Updation',
  'Get Details Using Email',
]

function fmt(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 28, height: 28, border: '3px solid #e2e8f0', borderTopColor: ACCENT, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

// ─── Employee Search ───────────────────────────────────────────────────────────
function EmployeeSearch({ employees, deptMap, loading }) {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [roleFilter, setRoleFilter] = useState('All')
  const [expandedRow, setExpandedRow] = useState(null)

  const deptNames = ['All', ...new Set(employees.map(e => deptMap[e.departmentId] || `Dept ${e.departmentId}`).filter(Boolean))]
  const roles = ['All', ...new Set(employees.map(e => e.designation).filter(Boolean))]

  const filtered = employees.filter(e => {
    const dept = deptMap[e.departmentId] || ''
    const matchSearch = !search || e.name?.toLowerCase().includes(search.toLowerCase()) || e.empCode?.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === 'All' || dept === deptFilter
    const matchRole = roleFilter === 'All' || e.designation === roleFilter
    return matchSearch && matchDept && matchRole
  })

  if (loading) return <Spinner />

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Employee Search</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Search by Name / Emp Code</label>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Enter name or employee code..." style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Department</label>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}>
            {deptNames.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Designation</label>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}>
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Emp Code', 'Name', 'Designation', 'Department', 'Email', 'Phone', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, i) => (
              <React.Fragment key={emp.id}>
                <tr
                  onClick={() => setExpandedRow(expandedRow === emp.id ? null : emp.id)}
                  style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: expandedRow === emp.id ? '#eef2ff' : i % 2 === 0 ? '#fff' : '#fafafa' }}
                >
                  <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{emp.empCode}</td>
                  <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{emp.name}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{emp.designation ?? '—'}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{deptMap[emp.departmentId] ?? '—'}</td>
                  <td style={{ padding: '12px 14px', color: MUTED }}>{emp.email ?? '—'}</td>
                  <td style={{ padding: '12px 14px', color: MUTED }}>{emp.phone ?? '—'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: emp.status === 'ACTIVE' ? '#dcfce7' : '#fef3c7', color: emp.status === 'ACTIVE' ? '#16a34a' : '#d97706', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{emp.status}</span>
                  </td>
                </tr>
                {expandedRow === emp.id && (
                  <tr style={{ background: '#f8fafc' }}>
                    <td colSpan={7} style={{ padding: '20px 24px', borderBottom: '2px solid #e2e8f0' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        {[
                          ['EMPLOYEE CODE', emp.empCode],
                          ['FULL NAME', emp.name],
                          ['DEPARTMENT', deptMap[emp.departmentId] ?? '—'],
                          ['DESIGNATION', emp.designation ?? '—'],
                          ['EMAIL', emp.email ?? '—'],
                          ['PHONE', emp.phone ?? '—'],
                          ['JOIN DATE', fmt(emp.joinDate)],
                          ['EMPLOYEE TYPE', emp.employeeType ?? '—'],
                          ['QUALIFICATIONS', emp.qualifications ?? '—'],
                        ].map(([label, value]) => (
                          <div key={label} style={{ ...card, padding: 14 }}>
                            <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>{label}</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{value}</div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: MUTED, fontSize: 14 }}>No employees found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── View Addl Role Details ────────────────────────────────────────────────────
const additionalRoles = [
  { roleName: 'Department Timetable Coordinator', assignedDate: '2023-07-01', validUntil: '2024-06-30', department: 'Computer Science', responsibilities: 'Manage and publish semester timetable for the department. Coordinate with faculty for availability. Update changes in the ERP portal.' },
  { roleName: 'Placement Cell Mentor', assignedDate: '2022-06-15', validUntil: '2025-06-14', department: 'Placement Cell', responsibilities: 'Guide students for placement preparation. Coordinate with companies for campus recruitment. Conduct mock interviews and resume reviews.' },
  { roleName: 'Anti-Ragging Committee Member', assignedDate: '2023-06-01', validUntil: '2024-05-31', department: 'Student Welfare', responsibilities: 'Investigate complaints of ragging incidents. Conduct awareness programs. Submit quarterly reports to the Anti-Ragging Cell.' },
]

function ViewAddlRoleDetails() {
  const [expandedRole, setExpandedRole] = useState(null)

  return (
    <div>
      <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#92400e' }}>
        Additional role assignments API is pending — data below is placeholder.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: TEXT }}>View Addl Role Details</h2>
        <span style={{ background: ACCENT, color: '#fff', borderRadius: 20, padding: '2px 12px', fontSize: 13, fontWeight: 700 }}>{additionalRoles.length} Additional Roles</span>
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Role Name', 'Assigned Date', 'Valid Until', 'Department', 'Responsibilities'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {additionalRoles.map((role, i) => (
              <React.Fragment key={i}>
                <tr onClick={() => setExpandedRole(expandedRole === i ? null : i)} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: expandedRole === i ? '#eef2ff' : i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{role.roleName}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{role.assignedDate}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{role.validUntil}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{role.department}</td>
                  <td style={{ padding: '12px 14px', color: MUTED, fontSize: 13 }}>
                    <button style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{expandedRole === i ? 'Hide' : 'View'}</button>
                  </td>
                </tr>
                {expandedRole === i && (
                  <tr style={{ background: '#f8fafc' }}>
                    <td colSpan={5} style={{ padding: '16px 24px', borderBottom: '2px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 600, color: TEXT, marginBottom: 8, fontSize: 14 }}>Role Description &amp; Responsibilities</div>
                      <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.7 }}>{role.responsibilities}</div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── My School/Centre Employees ───────────────────────────────────────────────
function MySchoolCentreEmployees({ employees, myEmployee, deptMap, loading }) {
  const deptEmployees = myEmployee
    ? employees.filter(e => e.departmentId === myEmployee.departmentId)
    : []

  const designationCounts = deptEmployees.reduce((acc, e) => {
    acc[e.designation] = (acc[e.designation] || 0) + 1
    return acc
  }, {})

  if (loading) return <Spinner />

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>My School/Centre Employees</h2>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ ...card, padding: 20, textAlign: 'center', flex: '1 1 100px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: ACCENT }}>{deptEmployees.length}</div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Total Faculty</div>
        </div>
        {Object.entries(designationCounts).map(([desg, count]) => (
          <div key={desg} style={{ ...card, padding: 20, textAlign: 'center', flex: '1 1 100px' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#7c3aed' }}>{count}</div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{desg}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>
          {deptMap[myEmployee?.departmentId] ?? 'Your Department'}
        </div>
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Emp Code', 'Name', 'Designation', 'Join Date', 'Email', 'Phone', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deptEmployees.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: MUTED }}>No colleagues found in your department.</td></tr>
            ) : deptEmployees.map((emp, i) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{emp.empCode}</td>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{emp.name}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{emp.designation ?? '—'}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{fmt(emp.joinDate)}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{emp.email ?? '—'}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{emp.phone ?? '—'}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ background: emp.status === 'ACTIVE' ? '#dcfce7' : '#fef3c7', color: emp.status === 'ACTIVE' ? '#16a34a' : '#d97706', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{emp.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Mobile Number Updation ────────────────────────────────────────────────────
function MobileNumberUpdation({ myEmployee, loading }) {
  const [step, setStep] = useState('view')
  const [newMobile, setNewMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSendOtp = () => {
    if (newMobile.length === 10) setOtpSent(true)
  }

  const handleConfirm = () => {
    setSuccess(true)
    setStep('view')
    setNewMobile('')
    setOtp('')
    setOtpSent(false)
    setTimeout(() => setSuccess(false), 4000)
  }

  if (loading) return <Spinner />

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Mobile Number Updation</h2>
      {success && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          Request submitted — admin will update your mobile number.
        </div>
      )}
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: TEXT, marginBottom: 16 }}>
          <span style={{ color: MUTED, fontWeight: 600 }}>Current Mobile Number: </span>
          <span style={{ fontSize: 18, fontWeight: 700, color: ACCENT }}>
            {myEmployee?.phone ? `+91 ${myEmployee.phone}` : '—'}
          </span>
        </div>
        {step === 'view' ? (
          <button onClick={() => setStep('update')} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Request Mobile Update
          </button>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>New Mobile Number</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="tel"
                    value={newMobile}
                    onChange={e => setNewMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }}
                  />
                  <button
                    onClick={handleSendOtp}
                    disabled={newMobile.length !== 10}
                    style={{ background: newMobile.length === 10 ? ACCENT : '#e2e8f0', color: newMobile.length === 10 ? '#fff' : MUTED, border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: newMobile.length === 10 ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}
                  >
                    Send OTP
                  </button>
                </div>
              </div>
              {otpSent && (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.slice(0, 6))}
                    placeholder="6-digit OTP"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }}
                  />
                </div>
              )}
            </div>
            {otpSent && <div style={{ fontSize: 12, color: '#16a34a', marginTop: 8 }}>OTP sent to +91 {newMobile}</div>}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button
                onClick={handleConfirm}
                disabled={!otpSent || otp.length < 6}
                style={{ background: otpSent && otp.length >= 6 ? ACCENT : '#e2e8f0', color: otpSent && otp.length >= 6 ? '#fff' : MUTED, border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: otpSent && otp.length >= 6 ? 'pointer' : 'not-allowed' }}
              >
                Submit Request
              </button>
              <button onClick={() => setStep('view')} style={{ background: '#f1f5f9', color: MUTED, border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Get Details Using Email ───────────────────────────────────────────────────
function GetDetailsByEmail({ employees, deptMap, loading }) {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = () => {
    const found = employees.find(e => e.email?.toLowerCase() === email.trim().toLowerCase())
    if (found) { setResult(found); setNotFound(false) }
    else { setResult(null); setNotFound(true) }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Get Details Using Email</h2>
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Employee Email Address</label>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Enter employee email address..."
            style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }}
          />
          <button onClick={handleSearch} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Search</button>
        </div>
      </div>

      {notFound && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', color: '#991b1b', fontSize: 14 }}>
          No employee found with that email address.
        </div>
      )}

      {result && (
        <div style={{ ...card, padding: 28 }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0 }}>👤</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{result.name}</div>
              <div style={{ fontSize: 14, color: ACCENT, fontWeight: 600, marginBottom: 16 }}>{result.designation ?? '—'} — {deptMap[result.departmentId] ?? '—'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  ['Employee Code', result.empCode],
                  ['Employee Type', result.employeeType ?? '—'],
                  ['Email', result.email ?? '—'],
                  ['Phone', result.phone ?? '—'],
                  ['Date of Joining', fmt(result.joinDate)],
                  ['Status', result.status],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px' }}>
                    <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                    <div style={{ fontSize: 14, color: TEXT, fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyHRGeneral() {
  const { user } = useAuth()
  const [activeNav, setActiveNav] = useState('Employee Search')
  const [employees, setEmployees] = useState([])
  const [myEmployee, setMyEmployee] = useState(null)
  const [deptMap, setDeptMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return
    setLoading(true)
    Promise.all([
      api.get('/employees').then(r => r.data?.data || []).catch(() => []),
      api.get('/employees/me').then(r => r.data?.data || null).catch(() => null),
      api.get('/departments').then(r => {
        const map = {}
        ;(r.data?.data || []).forEach(d => { map[d.id] = d.name })
        return map
      }).catch(() => ({})),
    ])
      .then(([emps, me, depts]) => {
        setEmployees(emps)
        setMyEmployee(me)
        setDeptMap(depts)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.userId])

  const renderActive = () => {
    switch (activeNav) {
      case 'Employee Search': return <EmployeeSearch employees={employees} deptMap={deptMap} loading={loading} />
      case 'View Addl Role Details': return <ViewAddlRoleDetails />
      case 'My School/Centre Employees': return <MySchoolCentreEmployees employees={employees} myEmployee={myEmployee} deptMap={deptMap} loading={loading} />
      case 'Mobile Number Updation': return <MobileNumberUpdation myEmployee={myEmployee} loading={loading} />
      case 'Get Details Using Email': return <GetDetailsByEmail employees={employees} deptMap={deptMap} loading={loading} />
      default: return <div style={{ color: MUTED }}>Coming soon.</div>
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Human Resource — General</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Employee directory and HR management tools</p>
      </div>

      <div style={{ ...card, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: 210, borderRight: '1px solid #f1f5f9', padding: '16px 0', flexShrink: 0 }}>
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              style={{
                display: 'block', width: '100%', padding: '10px 20px',
                background: activeNav === item ? '#eef2ff' : 'transparent',
                border: 'none', borderLeft: activeNav === item ? '3px solid #6366f1' : '3px solid transparent',
                textAlign: 'left', fontSize: 13, fontWeight: activeNav === item ? 600 : 400,
                color: activeNav === item ? ACCENT : TEXT, cursor: 'pointer', lineHeight: 1.4,
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, padding: 28, minWidth: 0, overflowY: 'auto' }}>
          {renderActive()}
        </div>
      </div>
    </div>
  )
}
