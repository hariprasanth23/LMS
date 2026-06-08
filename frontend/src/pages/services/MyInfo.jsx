import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const NAV_ITEMS = ['Profile', 'Credentials', 'Dayboarder Info', 'Acknowledgement View', 'Student Bank Info', 'My Scholarships']

function Loading() { return <div style={{ padding: 40, textAlign: 'center', color: MUTED }}>Loading…</div> }

function InfoRow({ label, value, accent }) {
  return (
    <div style={{ background: BG, borderRadius: 8, padding: '12px 14px' }}>
      <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 14, color: accent ? ACCENT : TEXT, fontWeight: accent ? 700 : 400 }}>{value || '—'}</div>
    </div>
  )
}

// ── Profile ───────────────────────────────────────────────────────────────────
function Profile({ infoData }) {
  if (!infoData) return <Loading />
  const { user, student } = infoData
  const dept = student?.department

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, #6366f1, #8b5cf6)`, borderRadius: 14, padding: '24px 28px', color: '#fff', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, flexShrink: 0 }}>
          {(user?.name || '').split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{user?.name || '—'}</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{student?.rollNumber || '—'} · {dept?.name || '—'}</div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 12 }}>Personal Information</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          <InfoRow label="Full Name"   value={user?.name} />
          <InfoRow label="Email"       value={user?.email} />
          <InfoRow label="Mobile"      value={user?.phone} />
          <InfoRow label="Role"        value={user?.role} />
          <InfoRow label="Account Status" value={user?.active ? 'Active' : 'Inactive'} />
        </div>
      </div>

      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 12 }}>Academic Information</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          <InfoRow label="Roll Number"  value={student?.rollNumber} accent />
          <InfoRow label="Department"   value={dept?.name} />
          <InfoRow label="Semester"     value={student?.semester ? `Semester ${student.semester}` : '—'} />
          <InfoRow label="Batch"        value={student?.batch} />
          <InfoRow label="Status"       value={student?.status} />
          <InfoRow label="Guardian"     value={student?.guardianName} />
          <InfoRow label="Guardian Ph." value={student?.guardianPhone} />
          <InfoRow label="Address"      value={student?.address} />
        </div>
      </div>
    </div>
  )
}

// ── Credentials (static — institutional IDs) ──────────────────────────────────
function Credentials({ infoData }) {
  const rollNo = infoData?.student?.rollNumber || '—'
  const email  = infoData?.user?.email || '—'
  const rows = [
    { label: 'Roll Number',         value: rollNo,              icon: '🎓' },
    { label: 'Institute Email',      value: email,               icon: '📧' },
    { label: 'Library Card No.',    value: `LIB-${rollNo}`,     icon: '📚' },
    { label: 'Hostel ID',           value: 'Day Scholar',       icon: '🏠' },
    { label: 'Bus Pass No.',        value: 'N/A',               icon: '🚌' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 24 }}>{r.icon}</span>
          <div>
            <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, marginBottom: 2 }}>{r.label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{r.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Dayboarder Info ───────────────────────────────────────────────────────────
function DayboarderInfo() {
  return (
    <div>
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px 18px', marginBottom: 20, fontSize: 14, color: '#15803d', fontWeight: 500 }}>
        ✅ You are registered as a <strong>Day Scholar</strong>.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {[['Home City', 'Chennai'], ['Distance from College', '12 km'], ['Transport Mode', 'Bus'], ['Bus Route', 'Route 4 — Anna Nagar'], ['Bus Pass Validity', 'Jun 2025'], ['Emergency Contact', '+91 9876543210']].map(([label, value]) => (
          <InfoRow key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  )
}

// ── Acknowledgements (static) ─────────────────────────────────────────────────
function AcknowledgementView() {
  const acks = [
    { doc: 'Anti-Ragging Undertaking', date: '2022-09-01', year: '2022-23', status: 'Signed' },
    { doc: 'Code of Conduct',          date: '2022-09-01', year: '2022-23', status: 'Signed' },
    { doc: 'Hostel Rules & Regulations', date: '2022-09-05', year: '2022-23', status: 'Signed' },
    { doc: 'Examination Rules',        date: '2022-11-01', year: '2022-23', status: 'Signed' },
    { doc: 'Anti-Ragging Undertaking', date: '2023-08-01', year: '2023-24', status: 'Signed' },
    { doc: 'Code of Conduct',          date: '2023-08-01', year: '2023-24', status: 'Signed' },
  ]
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: BG }}>
            {['Document', 'Date Signed', 'Academic Year', 'Status'].map(h => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #e2e8f0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {acks.map((a, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
              <td style={{ padding: '12px 14px', fontWeight: 600, color: TEXT }}>{a.doc}</td>
              <td style={{ padding: '12px 14px', color: MUTED }}>{a.date}</td>
              <td style={{ padding: '12px 14px', color: MUTED }}>{a.year}</td>
              <td style={{ padding: '12px 14px' }}>
                <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{a.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Student Bank Info ─────────────────────────────────────────────────────────
function StudentBankInfo() {
  const [bankInfo, setBankInfo] = useState(null)
  const [form, setForm] = useState({ accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '', branch: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    api.get('/students/me/bank-info')
      .then(r => {
        const d = r.data.data
        setBankInfo(d)
        if (d) setForm({ accountHolderName: d.accountHolderName || '', bankName: d.bankName || '', accountNumber: d.accountNumber || '', ifscCode: d.ifscCode || '', branch: d.branch || '' })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await api.put('/students/me/bank-info', form)
      setBankInfo(res.data.data)
      setEditing(false)
      toast.success('Bank info saved!')
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  if (loading) return <Loading />

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }
  const fields = [
    { label: 'Account Holder Name', key: 'accountHolderName' },
    { label: 'Bank Name', key: 'bankName' },
    { label: 'Account Number', key: 'accountNumber' },
    { label: 'IFSC Code', key: 'ifscCode' },
    { label: 'Branch', key: 'branch' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>Bank Account Details</div>
        {!editing && <button onClick={() => setEditing(true)} style={{ background: '#eef2ff', color: ACCENT, border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{bankInfo ? 'Edit' : 'Add'}</button>}
      </div>

      {editing ? (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 12, color: MUTED, fontWeight: 600, display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} placeholder={`Enter ${f.label.toLowerCase()}`} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleSave} disabled={saving} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setEditing(false)} style={{ background: BG, color: MUTED, border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      ) : bankInfo ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {fields.map(f => <InfoRow key={f.key} label={f.label} value={form[f.key]} />)}
        </div>
      ) : (
        <div style={{ padding: 32, textAlign: 'center', color: MUTED, fontSize: 14 }}>No bank information added yet. Click "Add" to enter your details.</div>
      )}
    </div>
  )
}

// ── My Scholarships (static) ──────────────────────────────────────────────────
function MyScholarships() {
  const data = [
    { name: 'State Government Merit Scholarship', applied: '2022-09-01', status: 'Credited',     amount: 10000, credited: '2022-12-15', ref: 'SCH2022001' },
    { name: 'Central Sector Scholarship',         applied: '2023-08-15', status: 'Credited',     amount: 12000, credited: '2023-11-20', ref: 'SCH2023001' },
    { name: 'OBC Scholarship',                    applied: '2024-06-10', status: 'Under Review', amount: 5000,  credited: '—',          ref: 'SCH2024001' },
  ]
  const statusColor = { Credited: ['#dcfce7', '#16a34a'], 'Under Review': ['#fef9c3', '#854d0e'], Rejected: ['#fee2e2', '#dc2626'] }
  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: BG }}>
              {['Scholarship Name', 'Applied On', 'Amount (₹)', 'Status', 'Credited On', 'Ref No'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((s, i) => {
              const [bg, color] = statusColor[s.status] || ['#f1f5f9', MUTED]
              return (
                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: TEXT }}>{s.name}</td>
                  <td style={{ padding: '12px 14px', color: MUTED }}>{s.applied}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#16a34a' }}>₹{s.amount.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 14px' }}><span style={{ background: bg, color, borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{s.status}</span></td>
                  <td style={{ padding: '12px 14px', color: MUTED }}>{s.credited}</td>
                  <td style={{ padding: '12px 14px', color: ACCENT, fontFamily: 'monospace', fontSize: 12 }}>{s.ref}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function MyInfo() {
  const [active, setActive] = useState('Profile')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [infoData, setInfoData] = useState(null)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  useEffect(() => {
    api.get('/students/me/info')
      .then(r => setInfoData(r.data.data))
      .catch(() => toast.error('Failed to load student info'))
  }, [])

  const navStyle = (item) => ({
    display: isMobile ? 'inline-block' : 'block',
    width: isMobile ? 'auto' : '100%',
    padding: isMobile ? '6px 12px' : '10px 18px',
    background: active === item ? '#eef2ff' : 'transparent',
    border: 'none',
    borderLeft: isMobile ? 'none' : (active === item ? `3px solid ${ACCENT}` : '3px solid transparent'),
    borderBottom: isMobile ? (active === item ? '2px solid #6366f1' : '2px solid transparent') : 'none',
    borderRadius: isMobile ? 100 : 0,
    textAlign: 'left', fontSize: isMobile ? 12 : 14,
    fontWeight: active === item ? 600 : 400,
    color: active === item ? ACCENT : TEXT,
    cursor: 'pointer', whiteSpace: 'nowrap',
  })

  const sectionMap = {
    'Profile':              () => <Profile infoData={infoData} />,
    'Credentials':          () => <Credentials infoData={infoData} />,
    'Dayboarder Info':      () => <DayboarderInfo />,
    'Acknowledgement View': () => <AcknowledgementView />,
    'Student Bank Info':    () => <StudentBankInfo />,
    'My Scholarships':      () => <MyScholarships />,
  }
  const ActiveSection = sectionMap[active]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: TEXT, margin: 0, marginBottom: 4 }}>Services — My Info</h1>
        <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>Your personal, academic and financial information</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 520 }}>
        <div style={{
          width: isMobile ? '100%' : 210, borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
          borderBottom: isMobile ? '1px solid #e2e8f0' : 'none', padding: isMobile ? '8px 4px' : '12px 0',
          flexShrink: 0, display: isMobile ? 'flex' : 'block', flexWrap: isMobile ? 'wrap' : undefined, overflowX: isMobile ? 'auto' : undefined,
        }}>
          {NAV_ITEMS.map(item => <button key={item} onClick={() => setActive(item)} style={navStyle(item)}>{item}</button>)}
        </div>
        <div style={{ flex: 1, padding: isMobile ? '16px' : 28, background: BG, overflowY: 'auto' }}>
          {ActiveSection && <ActiveSection />}
        </div>
      </div>
    </div>
  )
}
