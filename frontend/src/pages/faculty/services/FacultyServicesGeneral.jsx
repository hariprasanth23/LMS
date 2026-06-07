import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }

const navItems = ['FAQ', 'COVID Vaccinated Details', 'VIT Wheels - Travel Detail']

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid #e2e8f0', fontSize: 14, color: TEXT,
  outline: 'none', boxSizing: 'border-box', background: '#fff',
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────
const faqData = {
  Academic: [
    { q: 'How do I submit grades for my students?', a: 'Login to the ERP, go to Academics > Grade Entry, select your course and semester, enter grades, then submit before the deadline.' },
    { q: 'How can I apply for a leave of absence?', a: 'Navigate to Leave Management in the portal, click Apply Leave, fill in the details and submit. Your HOD will be notified for approval.' },
    { q: 'What is the syllabus revision process?', a: 'Submit proposed revisions through the Academic Affairs portal. Changes require BOS (Board of Studies) approval and typically take one academic year.' },
    { q: 'How do I access previous year question papers?', a: 'Visit the LMS portal under Resources > Question Paper Bank. You can filter by course, year, and examination type.' },
    { q: 'Can I extend assignment deadlines for students?', a: 'Yes, with valid justification. Update the deadline in the LMS and notify students at least 48 hours in advance.' },
  ],
  HR: [
    { q: 'How do I update my personal information in the system?', a: 'Go to Services > My Account > Profile Update. Submit required documents for any changes to official records.' },
    { q: 'What is the process for increment appeals?', a: 'Submit an appeal through HR portal within 30 days of the increment letter. Attach performance documents and supporting evidence.' },
    { q: 'How do I apply for maternity/paternity leave?', a: 'Fill the statutory leave form in HR portal, attach required medical certificates, and submit to HR dept with 30 days advance notice if possible.' },
    { q: 'Where can I find my payslip?', a: 'Go to Services > Finance > Payment Receipts to download monthly payslips.' },
    { q: 'How do I claim travel reimbursement?', a: 'Submit TA/DA form in HR portal within 7 days of travel with tickets and receipts attached.' },
  ],
  Events: [
    { q: 'How do I book a seminar hall for an event?', a: 'Use the Services > Facility Registration section to book halls. Bookings must be made at least 5 working days in advance.' },
    { q: 'How can I organize a guest lecture?', a: 'Submit a proposal via the Events portal under Academic Events, get HOD approval, then coordinate with the Events team.' },
    { q: 'What is the process for organizing a national conference?', a: 'Submit a conference proposal to the Research Cell via the Research portal. Budget approval and Dean sign-off are required.' },
    { q: 'Can I bring external participants to campus events?', a: 'Yes, register them via the Visitor Management module at least 48 hours in advance with their details.' },
    { q: 'Where do I submit event feedback?', a: 'Event feedback can be submitted via the Feedback portal under the General section after the event concludes.' },
  ],
  Research: [
    { q: 'How do I submit a research project proposal?', a: 'Navigate to Research > Project Registration, fill in the project details, objectives, and budget, then submit for committee review.' },
    { q: 'How are research publications recorded in the system?', a: 'Add publications via Research > My Publications. Indexed journals get additional points in the performance appraisal.' },
    { q: 'What funding opportunities are available for faculty?', a: 'Check Research > Funding Opportunities for DST, SERB, AICTE, and industry-sponsored grants updated regularly.' },
    { q: 'How do I apply for a research travel grant?', a: 'Submit via Research > Travel Grant with the conference acceptance letter, registration fee details, and estimated expenses.' },
    { q: 'Can students be co-authors on faculty publications?', a: 'Yes, student co-authorship is encouraged for project-based research. Acknowledge student contributions appropriately.' },
  ],
  Technical: [
    { q: 'How do I reset my ERP password?', a: 'Go to Services > My Account > Change Password or click "Forgot Password" on the login page. OTP will be sent to your registered mobile.' },
    { q: 'What should I do if the LMS is not accessible?', a: 'Contact IT Helpdesk at helpdesk@vit.ac.in or call 0416-220-0000 ext 2000. Report with your employee ID and browser details.' },
    { q: 'How do I access the system from home?', a: 'Use the VPN client available in IT Resources > VPN Setup. Download, install, and connect using your employee credentials.' },
    { q: 'Can I use the ERP on mobile?', a: 'Yes, the ERP is mobile-responsive. Download the official VIT app from Play Store or App Store for a better experience.' },
    { q: 'How do I request new software for the lab?', a: 'Submit a software requisition via IT Helpdesk portal with justification, number of licenses needed, and course requirement.' },
  ],
}

function FAQSection() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Academic')
  const [expandedIdx, setExpandedIdx] = useState(null)

  const filteredFaqs = faqData[activeCategory].filter(
    f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <input
        style={{ ...inputStyle, marginBottom: 20, paddingLeft: 14 }}
        placeholder="Search FAQs..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {Object.keys(faqData).map(cat => (
          <button key={cat}
            onClick={() => { setActiveCategory(cat); setExpandedIdx(null) }}
            style={{
              padding: '6px 16px', borderRadius: 20, border: '1px solid',
              borderColor: activeCategory === cat ? ACCENT : '#e2e8f0',
              background: activeCategory === cat ? ACCENT : '#fff',
              color: activeCategory === cat ? '#fff' : TEXT,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >{cat}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredFaqs.length === 0 && (
          <div style={{ color: MUTED, textAlign: 'center', padding: 32, fontSize: 14 }}>No FAQs match your search.</div>
        )}
        {filteredFaqs.map((faq, i) => (
          <div key={i} style={{ ...card, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              style={{
                width: '100%', padding: '14px 18px', background: expandedIdx === i ? '#eef2ff' : '#fff',
                border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', gap: 12,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{faq.q}</span>
              <span style={{ color: ACCENT, fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{expandedIdx === i ? '−' : '+'}</span>
            </button>
            {expandedIdx === i && (
              <div style={{ padding: '0 18px 16px', fontSize: 14, color: MUTED, lineHeight: 1.7, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── COVID Vaccinated Details ──────────────────────────────────────────────────
function COVIDSection() {
  const [form, setForm] = useState({
    vaccineName: 'Covishield', dose1: '2021-03-15', dose2: '2021-06-20', booster: '2022-01-10',
  })
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const status = form.booster ? 'Fully Vaccinated (Boosted)' : form.dose2 ? 'Fully Vaccinated' : form.dose1 ? 'Partially Vaccinated' : 'Not Updated'
  const statusColor = form.dose2 ? { bg: '#dcfce7', color: '#16a34a' } : form.dose1 ? { bg: '#fef3c7', color: '#d97706' } : { bg: '#fee2e2', color: '#dc2626' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, ...card, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: MUTED }}>Current Vaccination Status:</div>
        <span style={{ padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, background: statusColor.bg, color: statusColor.color }}>
          {status}
        </span>
      </div>

      <div style={{ ...card, padding: 28, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: TEXT }}>Vaccination Record</h3>
        {saved && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
            Vaccination details updated successfully!
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Vaccine Name *</label>
              <select style={inputStyle} value={form.vaccineName} onChange={e => setForm(p => ({ ...p, vaccineName: e.target.value }))}>
                {['Covishield', 'Covaxin', 'Others'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Dose 1 Date *</label>
              <input type="date" style={inputStyle} value={form.dose1} onChange={e => setForm(p => ({ ...p, dose1: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Dose 2 Date</label>
              <input type="date" style={inputStyle} value={form.dose2} onChange={e => setForm(p => ({ ...p, dose2: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Booster Date</label>
              <input type="date" style={inputStyle} value={form.booster} onChange={e => setForm(p => ({ ...p, booster: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Certificate Upload</label>
              <input type="file" style={{ ...inputStyle, padding: '7px 12px' }} accept=".pdf,.jpg,.png" />
              <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Accepted: PDF, JPG, PNG (max 5MB)</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Verification Documents</label>
              <input type="file" style={{ ...inputStyle, padding: '7px 12px' }} accept=".pdf,.jpg,.png" multiple />
              <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Upload any supporting documents for verification</div>
            </div>
          </div>
          <button type="submit" style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Save Details
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── VIT Wheels - Travel Detail ────────────────────────────────────────────────
function VITWheelsSection() {
  const [form, setForm] = useState({ vehicleType: 'Car', regNo: '', model: '', color: '', parkingZone: '' })
  const [saved, setSaved] = useState(false)
  const [registered] = useState({
    vehicleType: 'Car', regNo: 'TN07BH1234', model: 'Honda City', color: 'White', parkingZone: 'Zone A — Faculty Block',
    status: 'Active', passExpiry: '2026-03-31',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div style={{ ...card, padding: 20, marginBottom: 20, background: '#eef2ff', border: '1px solid #c7d2fe' }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: ACCENT, marginBottom: 10 }}>Current Registration</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            ['Vehicle Type', registered.vehicleType],
            ['Reg Number', registered.regNo],
            ['Model', registered.model],
            ['Color', registered.color],
            ['Parking Zone', registered.parkingZone],
            ['Pass Expiry', registered.passExpiry],
          ].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
              <div style={{ fontSize: 14, color: TEXT, fontWeight: 600 }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
          <button style={{ background: '#fff', color: ACCENT, border: '1px solid #c7d2fe', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Download Parking Pass
          </button>
          <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Deregister Vehicle
          </button>
        </div>
      </div>

      <div style={{ ...card, padding: 28 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: TEXT }}>Register / Update Vehicle</h3>
        {saved && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
            Vehicle details updated!
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Vehicle Type *</label>
              <select style={inputStyle} value={form.vehicleType} onChange={e => setForm(p => ({ ...p, vehicleType: e.target.value }))}>
                {['Car', 'Bike', 'Bicycle'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Registration Number *</label>
              <input style={inputStyle} value={form.regNo} onChange={e => setForm(p => ({ ...p, regNo: e.target.value }))} placeholder="e.g. TN07AB1234" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Model *</label>
              <input style={inputStyle} value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))} placeholder="e.g. Honda City" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Color *</label>
              <input style={inputStyle} value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} placeholder="e.g. White" required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>Parking Zone *</label>
              <select style={inputStyle} value={form.parkingZone} onChange={e => setForm(p => ({ ...p, parkingZone: e.target.value }))} required>
                <option value="">Select parking zone</option>
                {['Zone A — Faculty Block', 'Zone B — Admin Block', 'Zone C — Tech Tower', 'Zone D — Research Block', 'Zone E — Visitor Area'].map(z => <option key={z}>{z}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" style={{ marginTop: 20, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Update Registration
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyServicesGeneral() {
  const [activeNav, setActiveNav] = useState('FAQ')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Services — General</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>FAQs, COVID details and travel information</p>
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
          {activeNav === 'FAQ' && <FAQSection />}
          {activeNav === 'COVID Vaccinated Details' && <COVIDSection />}
          {activeNav === 'VIT Wheels - Travel Detail' && <VITWheelsSection />}
        </div>
      </div>
    </div>
  )
}
