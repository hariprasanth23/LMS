import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  MdPerson, MdEmail, MdPhone, MdEdit, MdSave, MdClose,
  MdLocationOn, MdWork, MdSchool, MdSecurity, MdHistory,
  MdDevices, MdLock, MdCheck, MdVisibility, MdVisibilityOff,
  MdNotifications, MdAssignment, MdBook, MdPeople,
  MdAccessTime, MdVerifiedUser, MdWarning, MdLogout,
  MdBloodtype, MdContactPhone, MdHome, MdBadge
} from 'react-icons/md'

/* ─── Design tokens ──────────────────────────────────────────────── */
const TEXT    = '#1e293b'
const MUTED   = '#64748b'
const ACCENT  = '#6366f1'
const BORDER  = '#e2e8f0'
const SURFACE = '#f8fafc'
const FF      = 'system-ui, -apple-system, sans-serif'

/* ─── Role config ────────────────────────────────────────────────── */
const ROLE_CFG = {
  ADMIN:   { bg: '#fef2f2', color: '#ef4444', grad: 'linear-gradient(135deg,#ef4444,#f97316)', label: 'Administrator' },
  FACULTY: { bg: '#eef2ff', color: '#6366f1', grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)', label: 'Faculty Member' },
  STUDENT: { bg: '#f0fdf4', color: '#10b981', grad: 'linear-gradient(135deg,#10b981,#06b6d4)', label: 'Student' },
  STAFF:   { bg: '#fffbeb', color: '#f59e0b', grad: 'linear-gradient(135deg,#f59e0b,#ef4444)', label: 'Staff' },
  PARENT:  { bg: '#fdf4ff', color: '#a855f7', grad: 'linear-gradient(135deg,#a855f7,#6366f1)', label: 'Parent' },
  ALUMNI:  { bg: '#f0f9ff', color: '#0ea5e9', grad: 'linear-gradient(135deg,#0ea5e9,#6366f1)', label: 'Alumni' },
}

/* ─── Static demo data ───────────────────────────────────────────── */
const DEMO_PERSONAL = {
  dob: '2003-08-15', gender: 'Male', bloodGroup: 'O+', nationality: 'Indian',
  alternatePhone: '+91 98765 43210',
  address: '42, Gandhi Nagar, 2nd Cross Street, Chennai – 600 020, Tamil Nadu',
  emergencyName: 'Rajesh Kumar', emergencyPhone: '+91 94321 56789', emergencyRelation: 'Father',
}

const DEMO_STUDENT = {
  studentId: 'CB.EN.U4CSE22045', rollNo: '22CSE045',
  department: 'Computer Science & Engineering', programme: 'B.E. Computer Science',
  batch: '2022–2026', semester: '6th Semester', section: 'B',
  cgpa: '8.74', attendance: '87%', advisor: 'Dr. Meena Kumari',
  hostelStatus: 'Day Scholar',
  guardianName: 'Rajesh Kumar', guardianContact: '+91 94321 56789', guardianEmail: 'rajesh.kumar@gmail.com',
}

const DEMO_FACULTY = {
  employeeId: 'AMCS-F0142', department: 'Computer Science & Engineering',
  designation: 'Associate Professor', joiningDate: '2015-07-01',
  experience: '9 Years', subjects: ['Data Structures', 'Algorithms', 'DBMS', 'Cloud Computing'],
  qualifications: ['Ph.D – Computer Science, IIT Madras (2014)', 'M.E – Software Engineering, Anna University (2010)'],
  cabin: 'Block-C, Room 214', reportingManager: 'Dr. S. Balakrishnan (HoD)',
}

const DEMO_SESSIONS = [
  { id: 1, device: 'Chrome on macOS', location: 'Chennai, TN', lastActive: '2 minutes ago', current: true },
  { id: 2, device: 'Safari on iPhone 14', location: 'Chennai, TN', lastActive: '3 hours ago', current: false },
  { id: 3, device: 'Firefox on Windows 11', location: 'Coimbatore, TN', lastActive: '2 days ago', current: false },
]

const DEMO_LOGIN_HISTORY = [
  { date: 'Jun 6, 2026 · 9:15 AM', device: 'Chrome, macOS', ip: '49.207.x.x', status: 'success' },
  { date: 'Jun 5, 2026 · 8:02 PM', device: 'Safari, iPhone', ip: '49.207.x.x', status: 'success' },
  { date: 'Jun 4, 2026 · 10:44 AM', device: 'Chrome, macOS', ip: '49.207.x.x', status: 'success' },
  { date: 'Jun 3, 2026 · 3:27 PM', device: 'Unknown Browser', ip: '117.239.x.x', status: 'failed' },
  { date: 'Jun 2, 2026 · 9:00 AM', device: 'Chrome, macOS', ip: '49.207.x.x', status: 'success' },
]

const DEMO_STUDENT_ACTIVITY = [
  { icon: MdBook,         label: 'Viewed course material',    sub: 'Data Structures – Unit 3 Notes',      time: '10 min ago',   color: '#6366f1' },
  { icon: MdAssignment,   label: 'Submitted assignment',      sub: 'OS Lab – Experiment 7',               time: '2 hrs ago',    color: '#10b981' },
  { icon: MdHistory,      label: 'Checked attendance',        sub: 'Overall: 87%',                        time: '5 hrs ago',    color: '#f59e0b' },
  { icon: MdSchool,       label: 'Registered for exam',       sub: 'End Semester – June 2026',            time: 'Yesterday',    color: '#0ea5e9' },
  { icon: MdBook,         label: 'Viewed result',             sub: 'CAT-2 Marks published',               time: '2 days ago',   color: '#a855f7' },
  { icon: MdNotifications,label: 'New announcement',          sub: 'Hackathon registrations open',        time: '3 days ago',   color: '#ef4444' },
  { icon: MdAssignment,   label: 'Completed quiz',            sub: 'DBMS Chapter 5 Quiz – 9/10',          time: '4 days ago',   color: '#10b981' },
  { icon: MdPeople,       label: 'Joined study group',        sub: 'Cloud Computing – Group B',           time: '5 days ago',   color: '#6366f1' },
]

const DEMO_FACULTY_ACTIVITY = [
  { icon: MdAssignment,   label: 'Marks entered',             sub: 'DBMS CAT-2 – Section A, 68 students', time: '30 min ago',   color: '#6366f1' },
  { icon: MdPeople,       label: 'Attendance marked',         sub: 'Data Structures – 6th sem B',         time: '2 hrs ago',    color: '#10b981' },
  { icon: MdBook,         label: 'Course material uploaded',  sub: 'Cloud Computing – Unit 4 PPT',        time: '5 hrs ago',    color: '#f59e0b' },
  { icon: MdHistory,      label: 'Leave request approved',    sub: 'Karthik S (22CSE032)',                 time: 'Yesterday',    color: '#0ea5e9' },
  { icon: MdAssignment,   label: 'Assignment created',        sub: 'Algorithms – Module 5 Problem Set',   time: '2 days ago',   color: '#a855f7' },
  { icon: MdNotifications,label: 'Announcement published',    sub: 'Syllabus update – DBMS Unit 6',       time: '3 days ago',   color: '#ef4444' },
  { icon: MdSchool,       label: 'Faculty meeting attended',  sub: 'Academic Council – Q4 Review',        time: '4 days ago',   color: '#10b981' },
  { icon: MdWork,         label: 'Timetable updated',         sub: 'Swapped Wednesday slot with Friday',  time: '5 days ago',   color: '#6366f1' },
]

/* ─── Helpers ────────────────────────────────────────────────────── */
function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function isStudentLike(role) {
  return ['STUDENT', 'ALUMNI', 'PARENT'].includes(role)
}

function isFacultyLike(role) {
  return ['FACULTY', 'STAFF', 'ADMIN'].includes(role)
}

/* ─── Shared style helpers ───────────────────────────────────────── */
const label = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#374151',
  marginBottom: 5, fontFamily: FF, textTransform: 'uppercase', letterSpacing: 0.6,
}

function fieldBox(editing) {
  return {
    width: '100%', padding: '9px 13px', border: `1px solid ${editing ? ACCENT : BORDER}`,
    borderRadius: 8, fontSize: 14, fontFamily: FF, color: TEXT, outline: 'none',
    boxSizing: 'border-box', background: editing ? '#fff' : SURFACE,
    transition: 'border-color .2s',
  }
}

function textareaBox(editing) {
  return { ...fieldBox(editing), minHeight: 76, resize: 'vertical', lineHeight: 1.55 }
}

function Field({ label: lbl, value, editing, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label style={label}>{lbl}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        disabled={!editing}
        placeholder={editing ? placeholder || `Enter ${lbl.toLowerCase()}` : '—'}
        style={fieldBox(editing)}
      />
    </div>
  )
}

function SelectField({ label: lbl, value, editing, onChange, options }) {
  return (
    <div>
      <label style={label}>{lbl}</label>
      {editing ? (
        <select
          value={value}
          onChange={e => onChange && onChange(e.target.value)}
          style={{ ...fieldBox(true), cursor: 'pointer' }}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type="text" disabled value={value || '—'} style={fieldBox(false)} />
      )}
    </div>
  )
}

function ReadOnlyField({ label: lbl, value, accent }) {
  return (
    <div>
      <label style={label}>{lbl}</label>
      <div style={{
        padding: '9px 13px', borderRadius: 8, background: SURFACE,
        border: `1px solid ${BORDER}`, fontSize: 14, fontFamily: FF,
        color: accent ? ACCENT : TEXT, fontWeight: accent ? 700 : 400,
      }}>{value || '—'}</div>
    </div>
  )
}

function SectionTitle({ title, sub }) {
  return (
    <div style={{ marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ fontFamily: FF, fontSize: 15, fontWeight: 700, color: TEXT }}>{title}</div>
      {sub && <div style={{ fontFamily: FF, fontSize: 12, color: MUTED, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function Chip({ text, color, bg }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 11px', borderRadius: 20,
      fontSize: 12, fontWeight: 600, fontFamily: FF,
      background: bg || '#eef2ff', color: color || ACCENT, marginRight: 6, marginBottom: 6,
    }}>{text}</span>
  )
}

function TabBtn({ label: lbl, active, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px',
        border: 'none', borderBottom: active ? `2px solid ${ACCENT}` : '2px solid transparent',
        background: 'none', cursor: 'pointer', fontFamily: FF, fontSize: 13,
        fontWeight: active ? 700 : 500, color: active ? ACCENT : MUTED,
        transition: 'all .2s', whiteSpace: 'nowrap',
      }}
    >
      <Icon size={16} />
      {lbl}
    </button>
  )
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function Profile() {
  const { user } = useAuth()
  const [activeTab, setActiveTab]   = useState(0)
  const [editMode, setEditMode]     = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [sessions, setSessions]     = useState(DEMO_SESSIONS)
  const [twoFA, setTwoFA]           = useState(false)
  const [showPwForm, setShowPwForm] = useState(false)
  const [showPw, setShowPw]         = useState({ cur: false, new: false, con: false })
  const [pwForm, setPwForm]         = useState({ current: '', newPw: '', confirm: '' })

  /* personal form state */
  const [pf, setPf] = useState({
    name: '', email: '', phone: '',
    dob: DEMO_PERSONAL.dob, gender: DEMO_PERSONAL.gender,
    bloodGroup: DEMO_PERSONAL.bloodGroup, nationality: DEMO_PERSONAL.nationality,
    alternatePhone: DEMO_PERSONAL.alternatePhone, address: DEMO_PERSONAL.address,
    emergencyName: DEMO_PERSONAL.emergencyName,
    emergencyPhone: DEMO_PERSONAL.emergencyPhone,
    emergencyRelation: DEMO_PERSONAL.emergencyRelation,
  })

  /* ── Fetch /auth/me on mount ─────────────────────────────────── */
  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        const d = res.data.data
        setProfileData(d)
        setPf(prev => ({ ...prev, name: d.name || '', email: d.email || '', phone: d.phone || '' }))
      })
      .catch(() => {
        if (user) {
          setProfileData(user)
          setPf(prev => ({ ...prev, name: user.name || '', email: user.email || '', phone: '' }))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  /* ── Save handler ────────────────────────────────────────────── */
  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/auth/profile', { name: pf.name, email: pf.email, phone: pf.phone })
      setProfileData(prev => ({ ...prev, name: pf.name, email: pf.email, phone: pf.phone }))
      toast.success('Profile updated successfully')
      setEditMode(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setPf(prev => ({
      ...prev,
      name: profileData?.name || '', email: profileData?.email || '',
      phone: profileData?.phone || '',
    }))
    setEditMode(false)
  }

  const handleChangePassword = async () => {
    if (!pwForm.current || !pwForm.newPw) { toast.error('Please fill all fields'); return }
    if (pwForm.newPw !== pwForm.confirm) { toast.error('Passwords do not match'); return }
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.current, newPassword: pwForm.newPw })
      toast.success('Password changed successfully')
      setShowPwForm(false)
      setPwForm({ current: '', newPw: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    }
  }

  const revokeSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    toast.success('Session revoked')
  }

  /* ── Loading ─────────────────────────────────────────────────── */
  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60, fontFamily: FF, color: MUTED }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
      <div style={{ fontSize: 15 }}>Loading profile…</div>
    </div>
  )

  /* ── Derived values ──────────────────────────────────────────── */
  const role     = profileData?.role || user?.role || 'STUDENT'
  const rc       = ROLE_CFG[role] || ROLE_CFG.STUDENT
  const initials = getInitials(profileData?.name || user?.name || 'U')
  const tabs     = ['Personal Info', isStudentLike(role) ? 'Academic Info' : 'Work Info', 'Security', 'Activity']
  const tabIcons = [MdPerson, MdSchool, MdSecurity, MdHistory]

  const activity = isFacultyLike(role) ? DEMO_FACULTY_ACTIVITY : DEMO_STUDENT_ACTIVITY

  /* ── Styles ──────────────────────────────────────────────────── */
  const card = { background: '#fff', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }
  const editBtn = (variant = 'primary') => ({
    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
    border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: FF,
    fontSize: 13, fontWeight: 600, transition: 'opacity .2s',
    ...(variant === 'primary'
      ? { background: ACCENT, color: '#fff' }
      : variant === 'ghost'
      ? { background: '#eef2ff', color: ACCENT }
      : { background: SURFACE, color: MUTED }),
  })

  /* ═══════════════════════════════════════════════════════════════ */
  return (
    <div style={{ fontFamily: FF, color: TEXT, maxWidth: 1060, margin: '0 auto' }}>

      {/* PAGE HEADER ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT }}>My Profile</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED }}>Manage your personal information and account settings</p>
      </div>

      {/* ── PROFILE HEADER CARD ──────────────────────────────────── */}
      <div style={{ ...card, marginBottom: 20, overflow: 'hidden' }}>
        {/* Cover band */}
        <div style={{ height: 120, background: rc.grad, position: 'relative' }} />

        {/* Content row */}
        <div style={{ padding: '0 28px 24px', display: 'flex', alignItems: 'flex-start', gap: 22, flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: rc.grad, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: '#fff',
            border: '4px solid #fff', marginTop: -40, flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          }}>
            {initials}
          </div>

          {/* Info */}
          <div style={{ flex: 1, paddingTop: 10, minWidth: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: TEXT }}>{profileData?.name || user?.name}</span>
              <span style={{
                padding: '3px 12px', borderRadius: 20, fontSize: 11,
                fontWeight: 700, background: rc.bg, color: rc.color,
              }}>{rc.label}</span>
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 8, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: MUTED }}>
                <MdEmail size={15} style={{ color: ACCENT }} />
                {profileData?.email || user?.email || '—'}
              </span>
              {(profileData?.phone || pf.phone) && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: MUTED }}>
                  <MdPhone size={15} style={{ color: ACCENT }} />
                  {profileData?.phone || pf.phone}
                </span>
              )}
              {profileData?.createdAt && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: MUTED }}>
                  <MdAccessTime size={15} style={{ color: ACCENT }} />
                  Member since {new Date(profileData.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
          </div>

          {/* Edit Profile button */}
          <button
            onClick={() => { setActiveTab(0); setEditMode(true) }}
            style={{ ...editBtn('ghost'), marginTop: 12 }}
          >
            <MdEdit size={16} /> Edit Profile
          </button>
        </div>
      </div>

      {/* ── TAB BAR ──────────────────────────────────────────────── */}
      <div style={{ ...card, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', borderBottom: `1px solid ${BORDER}`,
          overflowX: 'auto', padding: '0 12px',
        }}>
          {tabs.map((t, i) => (
            <TabBtn
              key={t} label={t} active={activeTab === i}
              onClick={() => setActiveTab(i)} icon={tabIcons[i]}
            />
          ))}
        </div>

        {/* ── TAB 0 : PERSONAL INFO ──────────────────────────────── */}
        {activeTab === 0 && (
          <div style={{ padding: '24px 28px' }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Personal Information</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Your personal details on record</div>
              </div>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} style={editBtn('ghost')}>
                  <MdEdit size={16} /> Edit
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleCancel} style={editBtn('muted')}>
                    <MdClose size={16} /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} style={{ ...editBtn('primary'), opacity: saving ? 0.7 : 1 }}>
                    <MdSave size={16} /> {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            {/* Basic identity */}
            <SectionTitle title="Basic Identity" sub="Your core profile details" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18, marginBottom: 28 }}>
              <Field label="Full Name"        value={pf.name}          editing={editMode} onChange={v => setPf({ ...pf, name: v })} />
              <Field label="Date of Birth"    value={pf.dob}           editing={editMode} onChange={v => setPf({ ...pf, dob: v })} type="date" />
              <SelectField
                label="Gender" value={pf.gender} editing={editMode}
                onChange={v => setPf({ ...pf, gender: v })}
                options={['Male', 'Female', 'Prefer not to say']}
              />
              <SelectField
                label="Blood Group" value={pf.bloodGroup} editing={editMode}
                onChange={v => setPf({ ...pf, bloodGroup: v })}
                options={['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']}
              />
              <Field label="Nationality"      value={pf.nationality}   editing={editMode} onChange={v => setPf({ ...pf, nationality: v })} />
            </div>

            {/* Contact */}
            <SectionTitle title="Contact Details" sub="Your registered contact information" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18, marginBottom: 28 }}>
              <Field label="Mobile Number"    value={pf.phone}          editing={editMode} onChange={v => setPf({ ...pf, phone: v })} type="tel" />
              <Field label="Email Address"    value={pf.email}          editing={editMode} onChange={v => setPf({ ...pf, email: v })} type="email" />
              <Field label="Alternate Phone"  value={pf.alternatePhone} editing={editMode} onChange={v => setPf({ ...pf, alternatePhone: v })} type="tel" />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={label}>Address</label>
              {editMode ? (
                <textarea
                  value={pf.address}
                  onChange={e => setPf({ ...pf, address: e.target.value })}
                  style={textareaBox(true)}
                />
              ) : (
                <div style={{ ...fieldBox(false), lineHeight: 1.6 }}>{pf.address || '—'}</div>
              )}
            </div>

            {/* Emergency contact */}
            <SectionTitle title="Emergency Contact" sub="Person to contact in case of emergency" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
              <Field label="Contact Name"     value={pf.emergencyName}     editing={editMode} onChange={v => setPf({ ...pf, emergencyName: v })} />
              <Field label="Contact Phone"    value={pf.emergencyPhone}    editing={editMode} onChange={v => setPf({ ...pf, emergencyPhone: v })} type="tel" />
              <Field label="Relation"         value={pf.emergencyRelation} editing={editMode} onChange={v => setPf({ ...pf, emergencyRelation: v })} />
            </div>
          </div>
        )}

        {/* ── TAB 1 : ACADEMIC / WORK INFO ───────────────────────── */}
        {activeTab === 1 && (
          <div style={{ padding: '24px 28px' }}>
            {isStudentLike(role) ? (
              <>
                <SectionTitle
                  title={role === 'ALUMNI' ? 'Alumni Academic Record' : role === 'PARENT' ? 'Linked Student Academic Info' : 'Academic Information'}
                  sub="Your academic record at the institution"
                />

                {/* IDs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18, marginBottom: 28 }}>
                  <ReadOnlyField label="Student ID"   value={DEMO_STUDENT.studentId} accent />
                  <ReadOnlyField label="Roll Number"  value={DEMO_STUDENT.rollNo} />
                  <ReadOnlyField label="Department"   value={DEMO_STUDENT.department} />
                  <ReadOnlyField label="Programme"    value={DEMO_STUDENT.programme} />
                  <ReadOnlyField label="Batch"        value={DEMO_STUDENT.batch} />
                  <ReadOnlyField label="Semester"     value={DEMO_STUDENT.semester} />
                  <ReadOnlyField label="Section"      value={DEMO_STUDENT.section} />
                </div>

                {/* Academic stats */}
                <SectionTitle title="Academic Performance" sub="Current academic standing" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
                  {[
                    { label: 'CGPA',        value: DEMO_STUDENT.cgpa,       color: '#10b981', bg: '#f0fdf4', icon: '📊' },
                    { label: 'Attendance',  value: DEMO_STUDENT.attendance, color: '#6366f1', bg: '#eef2ff', icon: '📅' },
                    { label: 'Advisor',     value: DEMO_STUDENT.advisor,    color: '#f59e0b', bg: '#fffbeb', icon: '👩‍🏫' },
                  ].map(s => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '16px 18px' }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{s.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Hostel */}
                <SectionTitle title="Residential Status" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18, marginBottom: 28 }}>
                  <ReadOnlyField label="Hostel Status"    value={DEMO_STUDENT.hostelStatus} />
                  {DEMO_STUDENT.hostelStatus !== 'Day Scholar' && (
                    <>
                      <ReadOnlyField label="Hostel Block" value={DEMO_STUDENT.hostelBlock} />
                      <ReadOnlyField label="Room Number"  value={DEMO_STUDENT.roomNumber} />
                    </>
                  )}
                </div>

                {/* Guardian */}
                <SectionTitle title="Guardian / Parent Details" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
                  <ReadOnlyField label="Guardian Name"    value={DEMO_STUDENT.guardianName} />
                  <ReadOnlyField label="Guardian Contact" value={DEMO_STUDENT.guardianContact} />
                  <ReadOnlyField label="Guardian Email"   value={DEMO_STUDENT.guardianEmail} />
                </div>
              </>
            ) : (
              <>
                <SectionTitle title="Employment Information" sub="Your official employment details" />

                {/* IDs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18, marginBottom: 28 }}>
                  <ReadOnlyField label="Employee ID"      value={DEMO_FACULTY.employeeId} accent />
                  <ReadOnlyField label="Department"       value={DEMO_FACULTY.department} />
                  <ReadOnlyField label="Designation"      value={DEMO_FACULTY.designation} />
                  <ReadOnlyField label="Date of Joining"  value={DEMO_FACULTY.joiningDate} />
                  <ReadOnlyField label="Years of Exp."    value={DEMO_FACULTY.experience} />
                  <ReadOnlyField label="Cabin / Office"   value={DEMO_FACULTY.cabin} />
                  <ReadOnlyField label="Reporting Manager" value={DEMO_FACULTY.reportingManager} />
                </div>

                {/* Subjects */}
                <SectionTitle title="Subjects Handling" />
                <div style={{ marginBottom: 28 }}>
                  {DEMO_FACULTY.subjects.map(s => (
                    <Chip key={s} text={s} />
                  ))}
                </div>

                {/* Qualifications */}
                <SectionTitle title="Qualifications" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {DEMO_FACULTY.qualifications.map((q, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '12px 16px', background: SURFACE, borderRadius: 10,
                      border: `1px solid ${BORDER}`,
                    }}>
                      <MdSchool size={18} style={{ color: ACCENT, marginTop: 1, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: TEXT }}>{q}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── TAB 2 : SECURITY ────────────────────────────────────── */}
        {activeTab === 2 && (
          <div style={{ padding: '24px 28px' }}>

            {/* Last login banner */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
              background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0', marginBottom: 28,
            }}>
              <MdVerifiedUser size={24} style={{ color: '#10b981', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#065f46' }}>Last Successful Login</div>
                <div style={{ fontSize: 12, color: '#047857', marginTop: 2 }}>
                  Jun 6, 2026 at 9:15 AM &nbsp;·&nbsp; Chrome on macOS &nbsp;·&nbsp; Chennai, Tamil Nadu
                </div>
              </div>
            </div>

            {/* Active sessions */}
            <SectionTitle title="Active Sessions" sub="Devices currently logged in to your account" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {sessions.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: 12, border: `1px solid ${BORDER}`,
                  background: s.current ? '#eef2ff' : '#fff', flexWrap: 'wrap', gap: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <MdDevices size={20} style={{ color: s.current ? ACCENT : MUTED }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>
                        {s.device}
                        {s.current && (
                          <Chip text="Current" color="#10b981" bg="#f0fdf4" />
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                        {s.location} &nbsp;·&nbsp; Last active: {s.lastActive}
                      </div>
                    </div>
                  </div>
                  {!s.current && (
                    <button
                      onClick={() => revokeSession(s.id)}
                      style={{
                        padding: '5px 14px', borderRadius: 8, border: '1px solid #fca5a5',
                        background: '#fef2f2', color: '#ef4444', cursor: 'pointer',
                        fontSize: 12, fontWeight: 600, fontFamily: FF,
                      }}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* 2FA */}
            <SectionTitle title="Two-Factor Authentication" sub="Add an extra layer of security to your account" />
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderRadius: 12, border: `1px solid ${BORDER}`,
              background: twoFA ? '#f0fdf4' : '#fff', marginBottom: 28, flexWrap: 'wrap', gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <MdLock size={22} style={{ color: twoFA ? '#10b981' : MUTED }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Authenticator App (TOTP)</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                    {twoFA ? 'Two-factor authentication is enabled.' : 'Scan a QR code with Google Authenticator or Authy.'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setTwoFA(!twoFA); toast.success(twoFA ? '2FA disabled' : '2FA enabled') }}
                style={{
                  padding: '7px 18px', borderRadius: 8, border: 'none',
                  background: twoFA ? '#fee2e2' : ACCENT,
                  color: twoFA ? '#ef4444' : '#fff',
                  cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: FF,
                }}
              >
                {twoFA ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>

            {/* Change password */}
            <SectionTitle title="Password" sub="Change your account password" />
            {!showPwForm ? (
              <button
                onClick={() => setShowPwForm(true)}
                style={{ ...editBtn('primary'), width: 'max-content' }}
              >
                <MdLock size={16} /> Change Password
              </button>
            ) : (
              <div style={{
                padding: '20px 22px', borderRadius: 12,
                border: `1px solid ${BORDER}`, background: SURFACE, marginBottom: 20,
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
                  {[
                    { key: 'cur',  lbl: 'Current Password', val: pwForm.current,  field: 'current' },
                    { key: 'new',  lbl: 'New Password',      val: pwForm.newPw,    field: 'newPw'   },
                    { key: 'con',  lbl: 'Confirm Password',  val: pwForm.confirm,  field: 'confirm' },
                  ].map(({ key, lbl, val, field }) => (
                    <div key={key} style={{ position: 'relative' }}>
                      <label style={label}>{lbl}</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPw[key] ? 'text' : 'password'}
                          value={val}
                          onChange={e => setPwForm({ ...pwForm, [field]: e.target.value })}
                          placeholder={`Enter ${lbl.toLowerCase()}`}
                          style={{ ...fieldBox(true), paddingRight: 38 }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(prev => ({ ...prev, [key]: !prev[key] }))}
                          style={{
                            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 0,
                          }}
                        >
                          {showPw[key] ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button onClick={handleChangePassword} style={editBtn('primary')}>
                    <MdCheck size={16} /> Update Password
                  </button>
                  <button
                    onClick={() => { setShowPwForm(false); setPwForm({ current: '', newPw: '', confirm: '' }) }}
                    style={editBtn('muted')}
                  >
                    <MdClose size={16} /> Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Login history */}
            <div style={{ marginTop: 32 }}>
              <SectionTitle title="Login History" sub="Last 5 sign-in events" />
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: FF }}>
                  <thead>
                    <tr style={{ background: SURFACE }}>
                      {['Date & Time', 'Device', 'IP Address', 'Status'].map(h => (
                        <th key={h} style={{
                          padding: '10px 14px', textAlign: 'left', fontWeight: 700,
                          color: MUTED, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5,
                          borderBottom: `1px solid ${BORDER}`,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_LOGIN_HISTORY.map((row, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <td style={{ padding: '11px 14px', color: TEXT }}>{row.date}</td>
                        <td style={{ padding: '11px 14px', color: MUTED }}>{row.device}</td>
                        <td style={{ padding: '11px 14px', color: MUTED, fontFamily: 'monospace' }}>{row.ip}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                            background: row.status === 'success' ? '#f0fdf4' : '#fef2f2',
                            color: row.status === 'success' ? '#10b981' : '#ef4444',
                          }}>
                            {row.status === 'success' ? '✓ Success' : '✗ Failed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3 : ACTIVITY ────────────────────────────────────── */}
        {activeTab === 3 && (
          <div style={{ padding: '24px 28px' }}>
            <SectionTitle
              title={isFacultyLike(role) ? 'Recent Faculty Activity' : 'Recent Portal Activity'}
              sub="Your last 8 interactions on the portal"
            />

            {/* Quick stats row */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))',
              gap: 14, marginBottom: 28,
            }}>
              {(isFacultyLike(role)
                ? [
                    { label: 'Marks Entries',    value: '142', icon: '📝', color: '#6366f1', bg: '#eef2ff' },
                    { label: 'Attendance Marked', value: '38',  icon: '📅', color: '#10b981', bg: '#f0fdf4' },
                    { label: 'Materials Uploaded', value: '12', icon: '📂', color: '#f59e0b', bg: '#fffbeb' },
                    { label: 'Leaves Approved',   value: '5',   icon: '✅', color: '#0ea5e9', bg: '#f0f9ff' },
                  ]
                : [
                    { label: 'Pages Viewed',      value: '84',   icon: '👁', color: '#6366f1', bg: '#eef2ff' },
                    { label: 'Submissions',        value: '12',   icon: '📤', color: '#10b981', bg: '#f0fdf4' },
                    { label: 'Quizzes Taken',      value: '7',    icon: '🎯', color: '#f59e0b', bg: '#fffbeb' },
                    { label: 'Days Active',        value: '18',   icon: '📆', color: '#0ea5e9', bg: '#f0f9ff' },
                  ]
              ).map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <SectionTitle title="Activity Timeline" sub="Chronological view of your recent actions" />
            <div style={{ position: 'relative', paddingLeft: 28 }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute', left: 12, top: 10, bottom: 10,
                width: 2, background: BORDER, borderRadius: 2,
              }} />

              {activity.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    marginBottom: i < activity.length - 1 ? 20 : 0,
                    position: 'relative',
                  }}>
                    {/* Dot */}
                    <div style={{
                      position: 'absolute', left: -22, top: 3,
                      width: 22, height: 22, borderRadius: '50%',
                      background: item.color + '20',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `2px solid ${item.color}`,
                      flexShrink: 0,
                    }}>
                      <Icon size={11} style={{ color: item.color }} />
                    </div>

                    {/* Content */}
                    <div style={{
                      flex: 1, padding: '12px 16px', borderRadius: 10,
                      background: '#fff', border: `1px solid ${BORDER}`,
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', gap: 12, flexWrap: 'wrap',
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{item.sub}</div>
                      </div>
                      <div style={{
                        fontSize: 11, color: MUTED, fontWeight: 500,
                        whiteSpace: 'nowrap', paddingTop: 2,
                      }}>
                        <MdAccessTime size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                        {item.time}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM STATS STRIP ───────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))',
        gap: 14, marginBottom: 8,
      }}>
        {[
          { label: 'Account Status', value: (profileData?.active !== false) ? 'Active' : 'Inactive', color: '#10b981', bg: '#f0fdf4' },
          { label: 'Role',           value: rc.label,                                                  color: rc.color,  bg: rc.bg   },
          { label: 'Portal',         value: localStorage.getItem('college_portal') || 'Student',       color: ACCENT,    bg: '#eef2ff' },
          { label: 'User ID',        value: String(profileData?.userId || profileData?.id || '').slice(0, 8) || 'N/A', color: MUTED, bg: SURFACE },
        ].map(s => (
          <div key={s.label} style={{ ...card, background: s.bg, padding: '14px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
