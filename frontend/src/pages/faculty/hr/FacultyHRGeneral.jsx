import React, { useState } from 'react'

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

// ─── Employee Search ───────────────────────────────────────────────────────────
const employeeData = [
  { empCode: 'FAC001', name: 'Dr. A. Rajesh', designation: 'Professor', department: 'Computer Science', email: 'arajesh@college.edu', phone: '9876543210', status: 'Active' },
  { empCode: 'FAC002', name: 'Dr. S. Meena', designation: 'Associate Professor', department: 'Electronics', email: 'smeena@college.edu', phone: '9876543211', status: 'Active' },
  { empCode: 'FAC003', name: 'Prof. K. Ramesh', designation: 'Assistant Professor', department: 'Mathematics', email: 'kramesh@college.edu', phone: '9876543212', status: 'Active' },
  { empCode: 'FAC004', name: 'Dr. L. Venkatesan', designation: 'Professor', department: 'Computer Science', email: 'lvenkat@college.edu', phone: '9876543213', status: 'On Leave' },
  { empCode: 'FAC005', name: 'Prof. M. Priya', designation: 'Assistant Professor', department: 'Physics', email: 'mpriya@college.edu', phone: '9876543214', status: 'Active' },
]

function EmployeeSearch() {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [roleFilter, setRoleFilter] = useState('All')
  const [expandedRow, setExpandedRow] = useState(null)

  const departments = ['All', 'Computer Science', 'Electronics', 'Mathematics', 'Physics']
  const roles = ['All', 'Professor', 'Associate Professor', 'Assistant Professor']

  const filtered = employeeData.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.empCode.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === 'All' || e.department === deptFilter
    const matchRole = roleFilter === 'All' || e.designation === roleFilter
    return matchSearch && matchDept && matchRole
  })

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Employee Search</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Search by Name / Emp Code</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Enter name or employee code..."
            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Department</label>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, background: '#fff', boxSizing: 'border-box' }}>
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Role</label>
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
              <React.Fragment key={emp.empCode}>
                <tr
                  onClick={() => setExpandedRow(expandedRow === emp.empCode ? null : emp.empCode)}
                  style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: expandedRow === emp.empCode ? '#eef2ff' : i % 2 === 0 ? '#fff' : '#fafafa' }}
                >
                  <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{emp.empCode}</td>
                  <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{emp.name}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{emp.designation}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{emp.department}</td>
                  <td style={{ padding: '12px 14px', color: MUTED }}>{emp.email}</td>
                  <td style={{ padding: '12px 14px', color: MUTED }}>{emp.phone}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: emp.status === 'Active' ? '#dcfce7' : '#fef3c7', color: emp.status === 'Active' ? '#16a34a' : '#d97706', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{emp.status}</span>
                  </td>
                </tr>
                {expandedRow === emp.empCode && (
                  <tr style={{ background: '#f8fafc' }}>
                    <td colSpan={7} style={{ padding: '20px 24px', borderBottom: '2px solid #e2e8f0' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        <div style={{ ...card, padding: 16 }}>
                          <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, marginBottom: 4 }}>EMPLOYEE CODE</div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT }}>{emp.empCode}</div>
                        </div>
                        <div style={{ ...card, padding: 16 }}>
                          <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, marginBottom: 4 }}>FULL NAME</div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{emp.name}</div>
                        </div>
                        <div style={{ ...card, padding: 16 }}>
                          <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, marginBottom: 4 }}>DEPARTMENT</div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{emp.department}</div>
                        </div>
                        <div style={{ ...card, padding: 16 }}>
                          <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, marginBottom: 4 }}>DESIGNATION</div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{emp.designation}</div>
                        </div>
                        <div style={{ ...card, padding: 16 }}>
                          <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, marginBottom: 4 }}>EMAIL</div>
                          <div style={{ fontSize: 14, color: TEXT }}>{emp.email}</div>
                        </div>
                        <div style={{ ...card, padding: 16 }}>
                          <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, marginBottom: 4 }}>PHONE</div>
                          <div style={{ fontSize: 14, color: TEXT }}>{emp.phone}</div>
                        </div>
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
  { roleName: 'Department Timetable Coordinator', assignedDate: '2023-07-01', validUntil: '2024-06-30', department: 'Computer Science', responsibilities: 'Manage and publish semester timetable for the department. Coordinate with faculty for availability. Update changes in the ERP portal.', expanded: false },
  { roleName: 'Placement Cell Mentor', assignedDate: '2022-06-15', validUntil: '2025-06-14', department: 'Placement Cell', responsibilities: 'Guide students for placement preparation. Coordinate with companies for campus recruitment. Conduct mock interviews and resume reviews.', expanded: false },
  { roleName: 'Anti-Ragging Committee Member', assignedDate: '2023-06-01', validUntil: '2024-05-31', department: 'Student Welfare', responsibilities: 'Investigate complaints of ragging incidents. Conduct awareness programs. Submit quarterly reports to the Anti-Ragging Cell.', expanded: false },
]

function ViewAddlRoleDetails() {
  const [expandedRole, setExpandedRole] = useState(null)

  return (
    <div>
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
                <tr
                  onClick={() => setExpandedRole(expandedRole === i ? null : i)}
                  style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: expandedRole === i ? '#eef2ff' : i % 2 === 0 ? '#fff' : '#fafafa' }}
                >
                  <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{role.roleName}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{role.assignedDate}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{role.validUntil}</td>
                  <td style={{ padding: '12px 14px', color: TEXT }}>{role.department}</td>
                  <td style={{ padding: '12px 14px', color: MUTED, fontSize: 13 }}>
                    <button style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      {expandedRole === i ? 'Hide' : 'View'}
                    </button>
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
const centreEmployees = [
  { empCode: 'FAC001', name: 'Dr. A. Rajesh', designation: 'Professor', joinDate: '2015-07-01', email: 'arajesh@college.edu', phone: '9876543210' },
  { empCode: 'FAC002', name: 'Dr. S. Meena', designation: 'Associate Professor', joinDate: '2018-01-15', email: 'smeena@college.edu', phone: '9876543211' },
  { empCode: 'FAC003', name: 'Prof. K. Ramesh', designation: 'Assistant Professor', joinDate: '2020-06-01', email: 'kramesh@college.edu', phone: '9876543212' },
  { empCode: 'FAC004', name: 'Dr. L. Venkatesan', designation: 'Professor', joinDate: '2012-07-01', email: 'lvenkat@college.edu', phone: '9876543213' },
  { empCode: 'FAC005', name: 'Prof. M. Priya', designation: 'Assistant Professor', joinDate: '2021-07-01', email: 'mpriya@college.edu', phone: '9876543214' },
  { empCode: 'FAC006', name: 'Dr. R. Suresh', designation: 'Associate Professor', joinDate: '2016-01-10', email: 'rsuresh@college.edu', phone: '9876543215' },
]

const deptStats = [
  { label: 'Total Faculty', value: 6, color: ACCENT },
  { label: 'Professors', value: 2, color: '#16a34a' },
  { label: 'Assoc. Professors', value: 2, color: '#d97706' },
  { label: 'Asst. Professors', value: 2, color: '#7c3aed' },
]

function MySchoolCentreEmployees() {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>My School/Centre Employees</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {deptStats.map(s => (
          <div key={s.label} style={{ ...card, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>School of Computer Science &amp; Engineering</div>
        <button style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Export CSV</button>
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Emp Code', 'Name', 'Designation', 'Join Date', 'Email', 'Phone'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {centreEmployees.map((emp, i) => (
              <tr key={emp.empCode} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{emp.empCode}</td>
                <td style={{ padding: '12px 14px', color: TEXT, fontWeight: 600 }}>{emp.name}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{emp.designation}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{emp.joinDate}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{emp.email}</td>
                <td style={{ padding: '12px 14px', color: MUTED }}>{emp.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Mobile Number Updation ────────────────────────────────────────────────────
const mobileHistory = [
  { date: '2023-06-15 10:34 AM', oldNumber: '9876543000', newNumber: '9876543210', updatedBy: 'Self' },
  { date: '2022-01-10 02:15 PM', oldNumber: '9876540000', newNumber: '9876543000', updatedBy: 'Admin' },
]

function MobileNumberUpdation() {
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

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT }}>Mobile Number Updation</h2>
      {success && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          Mobile number updated successfully!
        </div>
      )}
      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: TEXT, marginBottom: 16 }}>
          <span style={{ color: MUTED, fontWeight: 600 }}>Current Mobile Number: </span>
          <span style={{ fontSize: 18, fontWeight: 700, color: ACCENT }}>+91 9876543210</span>
        </div>
        {step === 'view' ? (
          <button onClick={() => setStep('update')} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Update Mobile Number
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
            {otpSent && (
              <div style={{ fontSize: 12, color: '#16a34a', marginTop: 8 }}>OTP sent to +91 {newMobile}</div>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button
                onClick={handleConfirm}
                disabled={!otpSent || otp.length < 6}
                style={{ background: otpSent && otp.length >= 6 ? ACCENT : '#e2e8f0', color: otpSent && otp.length >= 6 ? '#fff' : MUTED, border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: otpSent && otp.length >= 6 ? 'pointer' : 'not-allowed' }}
              >
                Confirm Update
              </button>
              <button onClick={() => setStep('view')} style={{ background: '#f1f5f9', color: MUTED, border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      <div style={{ ...card, padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Change History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Date & Time', 'Old Number', 'New Number', 'Updated By'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mobileHistory.map((h, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 14px', color: MUTED }}>{h.date}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{h.oldNumber}</td>
                <td style={{ padding: '12px 14px', color: ACCENT, fontWeight: 600 }}>{h.newNumber}</td>
                <td style={{ padding: '12px 14px', color: TEXT }}>{h.updatedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Get Details Using Email ───────────────────────────────────────────────────
function GetDetailsByEmail() {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const employeeByEmail = {
    'arajesh@college.edu': { empCode: 'FAC001', name: 'Dr. A. Rajesh', designation: 'Professor', department: 'Computer Science & Engineering', email: 'arajesh@college.edu', phone: '9876543210', joinDate: '2015-07-01', reportingManager: 'Dr. V. Kumar (HoD)', school: 'School of Engineering' },
    'smeena@college.edu': { empCode: 'FAC002', name: 'Dr. S. Meena', designation: 'Associate Professor', department: 'Electronics & Communication', email: 'smeena@college.edu', phone: '9876543211', joinDate: '2018-01-15', reportingManager: 'Dr. P. Anand (HoD)', school: 'School of Engineering' },
  }

  const handleSearch = () => {
    const found = employeeByEmail[email.toLowerCase()]
    if (found) { setResult(found); setNotFound(false) }
    else { setResult(null); setNotFound(true) }
  }

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
        <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>Try: arajesh@college.edu or smeena@college.edu</div>
      </div>

      {notFound && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', color: '#991b1b', fontSize: 14 }}>
          No employee found with that email address.
        </div>
      )}

      {result && (
        <div style={{ ...card, padding: 28 }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0 }}>
              👤
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{result.name}</div>
              <div style={{ fontSize: 14, color: ACCENT, fontWeight: 600, marginBottom: 16 }}>{result.designation} — {result.department}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  ['Employee Code', result.empCode],
                  ['School / Centre', result.school],
                  ['Email', result.email],
                  ['Phone', result.phone],
                  ['Date of Joining', result.joinDate],
                  ['Reporting Manager', result.reportingManager],
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
const contentMap = {
  'Employee Search': EmployeeSearch,
  'View Addl Role Details': ViewAddlRoleDetails,
  'My School/Centre Employees': MySchoolCentreEmployees,
  'Mobile Number Updation': MobileNumberUpdation,
  'Get Details Using Email': GetDetailsByEmail,
}

export default function FacultyHRGeneral() {
  const [activeNav, setActiveNav] = useState('Employee Search')
  const ActiveComponent = contentMap[activeNav] || (() => <div style={{ color: MUTED }}>Coming soon.</div>)

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
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
                display: 'block',
                width: '100%',
                padding: '10px 20px',
                background: activeNav === item ? '#eef2ff' : 'transparent',
                border: 'none',
                borderLeft: activeNav === item ? '3px solid #6366f1' : '3px solid transparent',
                textAlign: 'left',
                fontSize: 13,
                fontWeight: activeNav === item ? 600 : 400,
                color: activeNav === item ? ACCENT : TEXT,
                cursor: 'pointer',
                lineHeight: 1.4,
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, padding: 28, minWidth: 0, overflowY: 'auto' }}>
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}
