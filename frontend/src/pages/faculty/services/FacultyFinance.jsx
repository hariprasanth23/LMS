import React, { useState } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }
const navItems = ['Employee Wallet', 'Payment Receipts', 'Payments']

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid #e2e8f0', fontSize: 14, color: TEXT,
  outline: 'none', boxSizing: 'border-box', background: '#fff',
}
const thStyle = {
  padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600,
  color: MUTED, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', background: '#f8fafc',
}
const tdStyle = { padding: '11px 14px', fontSize: 14, color: TEXT, borderBottom: '1px solid #f1f5f9' }

// ─── Employee Wallet ───────────────────────────────────────────────────────────
const transactions = [
  { date: '2025-06-04', description: 'Canteen — Lunch', amount: -150, type: 'debit' },
  { date: '2025-06-03', description: 'Wallet Top-up', amount: 2000, type: 'credit' },
  { date: '2025-06-02', description: 'Photocopy — Library', amount: -40, type: 'debit' },
  { date: '2025-06-01', description: 'Canteen — Coffee', amount: -60, type: 'debit' },
  { date: '2025-05-30', description: 'Stationery Store', amount: -120, type: 'debit' },
  { date: '2025-05-28', description: 'Wallet Top-up', amount: 1000, type: 'credit' },
  { date: '2025-05-25', description: 'Sports Complex Entry', amount: -100, type: 'debit' },
]

function EmployeeWalletSection() {
  const balance = 2630
  const [amount, setAmount] = useState('')
  const [added, setAdded] = useState(false)
  const presets = [500, 1000, 2000, 5000]

  const handleAdd = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return
    setAdded(true)
    setAmount('')
    setTimeout(() => setAdded(false), 3000)
  }

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: 16, padding: 28, marginBottom: 24, color: '#fff',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.85, marginBottom: 8 }}>Available Balance</div>
        <div style={{ fontSize: 40, fontWeight: 800, marginBottom: 4 }}>₹{balance.toLocaleString('en-IN')}</div>
        <div style={{ fontSize: 13, opacity: 0.75 }}>Employee Wallet · Faculty ID: VIT-FAC-2025</div>
      </div>

      {added && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 500, fontSize: 14 }}>
          Amount added to wallet successfully!
        </div>
      )}

      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: TEXT }}>Add Money</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          {presets.map(p => (
            <button key={p}
              onClick={() => setAmount(String(p))}
              style={{
                padding: '9px 20px', borderRadius: 8, border: '1px solid',
                borderColor: amount === String(p) ? ACCENT : '#e2e8f0',
                background: amount === String(p) ? '#eef2ff' : '#fff',
                color: amount === String(p) ? ACCENT : TEXT,
                fontWeight: amount === String(p) ? 700 : 500, fontSize: 14, cursor: 'pointer',
              }}
            >₹{p.toLocaleString('en-IN')}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            type="number" min="1" style={{ ...inputStyle, flex: 1 }}
            placeholder="Or enter custom amount"
            value={amount} onChange={e => setAmount(e.target.value)}
          />
          <button
            onClick={handleAdd}
            style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >Add Money</button>
        </div>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 15, color: TEXT }}>Transaction History</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Date', 'Description', 'Amount'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i}>
                <td style={tdStyle}>{t.date}</td>
                <td style={tdStyle}>{t.description}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: t.type === 'credit' ? '#10b981' : '#ef4444' }}>
                  {t.type === 'credit' ? '+' : ''}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Payment Receipts ──────────────────────────────────────────────────────────
const receipts = [
  { id: 'RCP2025001', date: '2025-05-31', description: 'Salary — May 2025', amount: 85000, mode: 'Bank Transfer' },
  { id: 'RCP2025002', date: '2025-05-15', description: 'Travel Allowance', amount: 3200, mode: 'NEFT' },
  { id: 'RCP2025003', date: '2025-05-01', description: 'HRA Reimbursement', amount: 12000, mode: 'Bank Transfer' },
  { id: 'RCP2025004', date: '2025-04-30', description: 'Salary — April 2025', amount: 85000, mode: 'Bank Transfer' },
  { id: 'RCP2025005', date: '2025-04-20', description: 'Medical Reimbursement', amount: 4500, mode: 'NEFT' },
]

function PaymentReceiptsSection() {
  const [fromDate, setFromDate] = useState('2025-04-01')
  const [toDate, setToDate] = useState('2025-06-30')

  const filtered = receipts.filter(r => r.date >= fromDate && r.date <= toDate)

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>From Date</label>
          <input type="date" style={inputStyle} value={fromDate} onChange={e => setFromDate(e.target.value)} />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>To Date</label>
          <input type="date" style={inputStyle} value={toDate} onChange={e => setToDate(e.target.value)} />
        </div>
      </div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Receipt No', 'Date', 'Description', 'Amount', 'Mode', 'Download'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.id}</td>
                <td style={tdStyle}>{r.date}</td>
                <td style={tdStyle}>{r.description}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: '#10b981' }}>₹{r.amount.toLocaleString('en-IN')}</td>
                <td style={tdStyle}>{r.mode}</td>
                <td style={tdStyle}>
                  <button style={{ background: '#eef2ff', color: ACCENT, border: '1px solid #c7d2fe', borderRadius: 7, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: MUTED, fontSize: 14 }}>No receipts found for selected date range.</div>
        )}
      </div>
    </div>
  )
}

// ─── Payments ──────────────────────────────────────────────────────────────────
const pendingPayments = [
  { id: 'PAY001', feeType: 'Professional Development Fee', amount: 2500, dueDate: '2025-06-15' },
  { id: 'PAY002', feeType: 'Staff Association Membership', amount: 500, dueDate: '2025-06-30' },
  { id: 'PAY003', feeType: 'Library Security Deposit', amount: 1000, dueDate: '2025-07-01' },
]

function PaymentsSection() {
  const [modal, setModal] = useState(null)
  const [paid, setPaid] = useState({})
  const [paymentMode, setPaymentMode] = useState('UPI')
  const [paySuccess, setPaySuccess] = useState(false)

  const handlePay = () => {
    setPaid(p => ({ ...p, [modal.id]: true }))
    setPaySuccess(true)
    setTimeout(() => {
      setModal(null)
      setPaySuccess(false)
    }, 2500)
  }

  return (
    <div>
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ ...card, padding: 32, width: 420, maxWidth: '90vw' }}>
            <h3 style={{ margin: '0 0 20px', color: TEXT }}>Complete Payment</h3>
            {paySuccess ? (
              <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '16px 20px', color: '#166534', fontWeight: 600, textAlign: 'center' }}>
                Payment of ₹{modal.amount.toLocaleString('en-IN')} successful!
              </div>
            ) : (
              <>
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: '14px 16px', marginBottom: 20 }}>
                  <div style={{ fontSize: 13, color: MUTED }}>Fee Type</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{modal.feeType}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: ACCENT }}>₹{modal.amount.toLocaleString('en-IN')}</div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 8 }}>Payment Mode</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {['UPI', 'Net Banking', 'Card', 'Wallet'].map(m => (
                      <button key={m}
                        onClick={() => setPaymentMode(m)}
                        style={{
                          flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid',
                          borderColor: paymentMode === m ? ACCENT : '#e2e8f0',
                          background: paymentMode === m ? '#eef2ff' : '#fff',
                          color: paymentMode === m ? ACCENT : TEXT,
                          fontWeight: paymentMode === m ? 700 : 400, fontSize: 12, cursor: 'pointer',
                        }}
                      >{m}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handlePay} style={{ flex: 1, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '11px 0', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Pay Now
                  </button>
                  <button onClick={() => setModal(null)} style={{ background: '#f1f5f9', color: TEXT, border: 'none', borderRadius: 8, padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 15, color: TEXT }}>Pending Payments</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>{['Fee Type', 'Amount', 'Due Date', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {pendingPayments.map((p, i) => (
              <tr key={i}>
                <td style={tdStyle}>{p.feeType}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: TEXT }}>₹{p.amount.toLocaleString('en-IN')}</td>
                <td style={tdStyle}>{p.dueDate}</td>
                <td style={tdStyle}>
                  {paid[p.id] ? (
                    <span style={{ color: '#10b981', fontWeight: 600, fontSize: 13 }}>Paid</span>
                  ) : (
                    <button
                      onClick={() => setModal(p)}
                      style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 7, padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >Pay Now</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FacultyFinance() {
  const [activeNav, setActiveNav] = useState('Employee Wallet')

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: TEXT }}>Services — Finance</h1>
        <p style={{ margin: '6px 0 0', color: MUTED, fontSize: 15 }}>Wallet, payments and receipts</p>
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
          {activeNav === 'Employee Wallet' && <EmployeeWalletSection />}
          {activeNav === 'Payment Receipts' && <PaymentReceiptsSection />}
          {activeNav === 'Payments' && <PaymentsSection />}
        </div>
      </div>
    </div>
  )
}
