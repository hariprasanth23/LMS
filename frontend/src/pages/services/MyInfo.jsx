import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const NAV_ITEMS = [
  'Profile',
  'Credentials',
  'Dayboarder Info',
  'Acknowledgement View',
  'Student Bank Info',
  'My Scholarships',
]

const studentData = {
  name: 'Arjun Kumar',
  rollNo: 'CS2021001',
  dob: '2003-04-15',
  gender: 'Male',
  bloodGroup: 'B+',
  mobile: '+91 9876543210',
  email: 'arjun.kumar@student.edu.in',
  nationality: 'Indian',
  religion: 'Hindu',
  category: 'OBC',
  department: 'Computer Science & Engineering',
  programme: 'B.Tech',
  batch: '2021-2025',
  semester: 'VI',
  section: 'A',
  hostelStatus: 'Hosteller',
  regulation: 'R2021',
  advisor: 'Dr. A. Ramesh',
}

const emergencyContacts = [
  { name: 'Ramesh Kumar (Father)', phone: '+91 9876500001', relation: 'Father' },
  { name: 'Meena Kumar (Mother)', phone: '+91 9876500002', relation: 'Mother' },
]

const acknowledgements = [
  { doc: 'Anti-Ragging Undertaking', date: '2021-09-01', year: '2021-22', status: 'Signed' },
  { doc: 'Code of Conduct', date: '2021-09-01', year: '2021-22', status: 'Signed' },
  { doc: 'Hostel Rules & Regulations', date: '2021-09-05', year: '2021-22', status: 'Signed' },
  { doc: 'Examination Rules', date: '2021-11-01', year: '2021-22', status: 'Signed' },
  { doc: 'Anti-Ragging Undertaking', date: '2022-08-01', year: '2022-23', status: 'Signed' },
  { doc: 'Code of Conduct', date: '2022-08-01', year: '2022-23', status: 'Signed' },
  { doc: 'Hostel Rules & Regulations', date: '2022-08-03', year: '2022-23', status: 'Signed' },
]

const scholarshipsData = [
  { name: 'State Government Merit Scholarship', applied: '2022-09-01', status: 'Credited', amount: 10000, credited: '2022-12-15', ref: 'SCH2022001' },
  { name: 'Central Sector Scholarship', applied: '2023-08-15', status: 'Credited', amount: 12000, credited: '2023-11-20', ref: 'SCH2023001' },
  { name: 'OBC Scholarship', applied: '2024-06-10', status: 'Under Review', amount: 5000, credited: '-', ref: 'SCH2024001' },
]

export default function MyInfo() {
  const [active, setActive] = useState('Profile')
  const [editMode, setEditMode] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [dayboarderType] = useState('hosteller')
  const [bankForm, setBankForm] = useState({
    bank: 'State Bank of India',
    account: '•••• •••• 4521',
    ifsc: 'SBIN0012345',
    holder: 'Arjun Kumar',
    branch: 'Anna Nagar Branch',
    type: 'Savings',
    verified: true,
  })
  const [bankEdit, setBankEdit] = useState(false)

  const navStyle = (item) => ({
    padding: '10px 18px',
    cursor: 'pointer',
    fontSize: 14,
    borderLeft: active === item ? '3px solid #6366f1' : '3px solid transparent',
    background: active === item ? '#eef2ff' : 'transparent',
    color: active === item ? ACCENT : TEXT,
    fontWeight: active === item ? 600 : 400,
    transition: 'all 0.15s',
    userSelect: 'none',
  })

  const card = {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  }

  const btn = (variant = 'primary') => ({
    padding: '8px 18px',
    borderRadius: 8,
    border: variant === 'outline' ? '1px solid #e2e8f0' : 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    background: variant === 'primary' ? ACCENT : variant === 'danger' ? '#ef4444' : variant === 'success' ? '#10b981' : '#f1f5f9',
    color: variant === 'primary' || variant === 'danger' || variant === 'success' ? '#fff' : TEXT,
  })

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    fontSize: 14,
    color: TEXT,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const thStyle = {
    padding: '10px 14px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 600,
    color: MUTED,
    textTransform: 'uppercase',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc',
  }

  const tdStyle = {
    padding: '12px 14px',
    fontSize: 14,
    color: TEXT,
    borderBottom: '1px solid #f1f5f9',
  }

  const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ width: 180, fontSize: 13, color: MUTED, flexShrink: 0 }}>{label}</div>
      <div style={{ fontSize: 14, color: TEXT, fontWeight: 500 }}>{value}</div>
    </div>
  )

  const renderProfile = () => (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 24, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 28, fontWeight: 700,
          }}>
            AK
          </div>
          <div style={{ fontSize: 12, color: MUTED, textAlign: 'center', marginTop: 6 }}>Student</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 2 }}>{studentData.name}</div>
          <div style={{ fontSize: 14, color: MUTED, marginBottom: 12 }}>{studentData.rollNo} · {studentData.department}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#dcfce7', color: '#16a34a' }}>{studentData.hostelStatus}</span>
            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#eef2ff', color: ACCENT }}>Sem {studentData.semester}</span>
            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#f1f5f9', color: MUTED }}>{studentData.batch}</span>
          </div>
        </div>
        <button style={btn(editMode ? 'success' : 'outline')} onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ ...card, padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: TEXT, marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #eef2ff' }}>Personal Information</div>
          <InfoRow label="Full Name" value={studentData.name} />
          <InfoRow label="Roll Number" value={studentData.rollNo} />
          <InfoRow label="Date of Birth" value={studentData.dob} />
          <InfoRow label="Gender" value={studentData.gender} />
          <InfoRow label="Blood Group" value={studentData.bloodGroup} />
          <InfoRow label="Mobile" value={studentData.mobile} />
          <InfoRow label="Email" value={studentData.email} />
          <InfoRow label="Nationality" value={studentData.nationality} />
          <InfoRow label="Religion" value={studentData.religion} />
          <InfoRow label="Category" value={studentData.category} />
        </div>

        <div style={{ ...card, padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: TEXT, marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #eef2ff' }}>Academic Information</div>
          <InfoRow label="Department" value={studentData.department} />
          <InfoRow label="Programme" value={studentData.programme} />
          <InfoRow label="Batch" value={studentData.batch} />
          <InfoRow label="Semester" value={studentData.semester} />
          <InfoRow label="Section" value={studentData.section} />
          <InfoRow label="Hostel Status" value={studentData.hostelStatus} />
          <InfoRow label="Regulation" value={studentData.regulation} />
          <InfoRow label="Faculty Advisor" value={studentData.advisor} />
        </div>
      </div>

      <div style={{ ...card, padding: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: TEXT, marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #eef2ff' }}>Emergency Contacts</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {emergencyContacts.map((c, i) => (
            <div key={i} style={{ background: BG, borderRadius: 10, padding: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 600, color: TEXT, marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>{c.relation}</div>
              <div style={{ fontSize: 14, color: ACCENT, fontWeight: 500 }}>{c.phone}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCredentials = () => (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Login Credentials</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {[
            ['Username / Login ID', 'CS2021001'],
            ['Registered Email', 'arjun.kumar@student.edu.in'],
            ['Registered Mobile', '+91 9876543210'],
            ['Last Login', '2024-06-12, 10:34 AM'],
            ['Account Created', '2021-08-25'],
            ['Account Status', 'Active'],
          ].map(([label, value], i) => (
            <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', background: i % 4 < 2 ? '#fff' : '#fafafa' }}>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: label === 'Account Status' ? '#16a34a' : TEXT }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button style={btn('primary')}>Change Password</button>
        <button style={btn('outline')}>Update Login ID</button>
      </div>

      <div style={{ ...card, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: TEXT, marginBottom: 4 }}>Two-Factor Authentication</div>
            <div style={{ fontSize: 13, color: MUTED }}>Add an extra layer of security to your account</div>
          </div>
          <div
            onClick={() => setTwoFA(!twoFA)}
            style={{
              width: 48, height: 26, borderRadius: 13,
              background: twoFA ? ACCENT : '#e2e8f0',
              cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
            }}
          >
            <div style={{
              position: 'absolute', top: 3, left: twoFA ? 25 : 3,
              width: 20, height: 20, borderRadius: '50%', background: '#fff',
              transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: twoFA ? '#16a34a' : MUTED, fontWeight: twoFA ? 600 : 400 }}>
          Status: {twoFA ? 'Enabled' : 'Disabled'}
        </div>
      </div>
    </div>
  )

  const renderDayboarder = () => (
    <div>
      {dayboarderType === 'hosteller' ? (
        <div>
          <div style={{ ...card, padding: 24, marginBottom: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: TEXT, marginBottom: 16 }}>Hostel Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {[
                ['Block', 'Block C'],
                ['Room Number', 'C-204'],
                ['Floor', '2nd Floor'],
                ['Warden Name', 'Mr. Gopalan'],
                ['Warden Contact', '+91 9876501234'],
                ['Room Type', 'Triple Sharing'],
              ].map(([label, value], i) => (
                <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: TEXT }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...card, padding: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: TEXT, marginBottom: 12 }}>Hostel Fee Status</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1, background: '#f0fdf4', borderRadius: 10, padding: 16, border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Sem 2 Hostel Fee</div>
                <div style={{ fontWeight: 700, color: '#16a34a', fontSize: 18 }}>Paid ✓</div>
                <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>₹15,000 — Paid on Jun 10, 2024</div>
              </div>
              <div style={{ flex: 1, background: '#fef2f2', borderRadius: 10, padding: 16, border: '1px solid #fecaca' }}>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Mess Charges (Jun)</div>
                <div style={{ fontWeight: 700, color: '#dc2626', fontSize: 18 }}>Pending</div>
                <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>₹2,500 — Due Jun 30, 2024</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ ...card, padding: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Travel Details Form</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Mode of Transport</label>
              <select style={inputStyle}>
                <option>Bus</option>
                <option>Train</option>
                <option>Own Vehicle</option>
                <option>Walk</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>From Location</label>
              <input style={inputStyle} placeholder="Your residential area" />
            </div>
            <div>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Distance (km)</label>
              <input type="number" style={inputStyle} placeholder="One-way distance" />
            </div>
            <div>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Monthly Pass Number (if bus)</label>
              <input style={inputStyle} placeholder="Bus pass number" />
            </div>
          </div>
          <button style={{ ...btn('primary'), marginTop: 16 }}>Save Details</button>
        </div>
      )}
    </div>
  )

  const renderAcknowledgement = () => (
    <div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Document Name', 'Date Signed', 'Academic Year', 'Status', 'Download'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {acknowledgements.map((a, i) => (
              <tr key={i}>
                <td style={tdStyle}>{a.doc}</td>
                <td style={tdStyle}>{a.date}</td>
                <td style={tdStyle}>{a.year}</td>
                <td style={tdStyle}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#dcfce7', color: '#16a34a' }}>
                    {a.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button style={{ ...btn('outline'), padding: '5px 12px', fontSize: 12, border: '1px solid #e2e8f0' }}>
                    ⬇ Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderBankInfo = () => (
    <div>
      <div style={{ ...card, padding: '14px 20px', marginBottom: 20, background: '#fffbeb', border: '1px solid #fde68a' }}>
        <div style={{ fontSize: 13, color: '#92400e', fontWeight: 500 }}>
          Ensure the bank account is in the student's name for scholarship and financial aid credits.
        </div>
      </div>

      <div style={{ ...card, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: TEXT }}>Bank Account Details</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: bankForm.verified ? '#dcfce7' : '#fef9c3', color: bankForm.verified ? '#16a34a' : '#854d0e' }}>
              {bankForm.verified ? 'Verified' : 'Pending Verification'}
            </span>
            <button style={btn(bankEdit ? 'success' : 'outline')} onClick={() => setBankEdit(!bankEdit)}>
              {bankEdit ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            ['Bank Name', 'bank', bankForm.bank],
            ['Account Number', 'account', bankForm.account],
            ['IFSC Code', 'ifsc', bankForm.ifsc],
            ['Account Holder Name', 'holder', bankForm.holder],
            ['Branch Name', 'branch', bankForm.branch],
          ].map(([label, key, value]) => (
            <div key={key}>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>{label}</label>
              <input
                style={{ ...inputStyle, ...(bankEdit ? {} : { background: '#f8fafc', color: MUTED }) }}
                value={value}
                readOnly={!bankEdit}
                onChange={e => setBankForm({ ...bankForm, [key]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Account Type</label>
            {bankEdit ? (
              <select style={inputStyle} value={bankForm.type} onChange={e => setBankForm({ ...bankForm, type: e.target.value })}>
                {['Savings', 'Current'].map(t => <option key={t}>{t}</option>)}
              </select>
            ) : (
              <input style={{ ...inputStyle, background: '#f8fafc', color: MUTED }} value={bankForm.type} readOnly />
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderScholarships = () => {
    const totalReceived = scholarshipsData.filter(s => s.status === 'Credited').reduce((sum, s) => sum + s.amount, 0)
    return (
      <div>
        <div style={{ ...card, padding: 20, marginBottom: 20, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>Total Scholarship Received This Year</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>₹{totalReceived.toLocaleString('en-IN')}</div>
          </div>
          <div style={{ fontSize: 40 }}>🎓</div>
        </div>

        <div style={{ ...card, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Scholarship Name', 'Applied Date', 'Status', 'Amount', 'Credited Date', 'Reference'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scholarshipsData.map((s, i) => {
                const statusMap = {
                  'Credited': { bg: '#dcfce7', color: '#16a34a' },
                  'Under Review': { bg: '#fef9c3', color: '#854d0e' },
                  'Approved': { bg: '#dbeafe', color: '#1d4ed8' },
                  'Rejected': { bg: '#fee2e2', color: '#dc2626' },
                }
                const sc = statusMap[s.status] || { bg: '#f1f5f9', color: MUTED }
                return (
                  <tr key={i}>
                    <td style={tdStyle}>{s.name}</td>
                    <td style={tdStyle}>{s.applied}</td>
                    <td style={tdStyle}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>₹{s.amount.toLocaleString('en-IN')}</td>
                    <td style={tdStyle}>{s.credited}</td>
                    <td style={{ ...tdStyle, color: ACCENT, fontWeight: 500 }}>{s.ref}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const contentMap = {
    'Profile': renderProfile,
    'Credentials': renderCredentials,
    'Dayboarder Info': renderDayboarder,
    'Acknowledgement View': renderAcknowledgement,
    'Student Bank Info': renderBankInfo,
    'My Scholarships': renderScholarships,
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: TEXT, margin: 0, marginBottom: 4 }}>Services — My Info</h1>
        <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>Personal information, bank details and scholarship records</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', minHeight: 520 }}>
        <div style={{ width: 210, borderRight: '1px solid #e2e8f0', paddingTop: 8, paddingBottom: 8, flexShrink: 0 }}>
          {NAV_ITEMS.map(item => (
            <div key={item} style={navStyle(item)} onClick={() => setActive(item)}>
              {item}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: TEXT, marginBottom: 20 }}>{active}</div>
          {contentMap[active]?.()}
        </div>
      </div>
    </div>
  )
}
