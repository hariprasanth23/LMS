import React, { useState, useEffect } from 'react'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const NAV_ITEMS = [
  'Payments',
  'Wallet Amount Add',
  'Payment Receipts',
  'Fees Intimation',
  'Online Transfer',
  'Library Due',
  'Refund Request',
]

const feeItems = [
  { type: 'Tuition Fee', amount: 45000, due: 'Jul 1', status: 'PENDING' },
  { type: 'Hostel Fee', amount: 15000, due: 'Jul 1', status: 'PAID' },
  { type: 'Library Fee', amount: 500, due: 'Jul 1', status: 'PAID' },
  { type: 'Lab Fee', amount: 2000, due: 'Jul 1', status: 'PENDING' },
  { type: 'Exam Fee', amount: 500, due: 'Jun 15', status: 'PAID' },
]

const receiptRows = [
  { no: 'RCP001', date: '2024-06-10', desc: 'Tuition Fee - Sem 2', amount: 45000, mode: 'UPI', status: 'Success' },
  { no: 'RCP002', date: '2024-06-11', desc: 'Hostel Fee - Sem 2', amount: 15000, mode: 'Net Banking', status: 'Success' },
  { no: 'RCP003', date: '2024-05-01', desc: 'Exam Fee - Sem 1', amount: 500, mode: 'Card', status: 'Success' },
  { no: 'RCP004', date: '2024-04-20', desc: 'Lab Fee - Sem 1', amount: 2000, mode: 'UPI', status: 'Success' },
  { no: 'RCP005', date: '2024-03-15', desc: 'Library Fee', amount: 500, mode: 'Wallet', status: 'Success' },
  { no: 'RCP006', date: '2024-02-10', desc: 'Tuition Fee - Sem 1', amount: 45000, mode: 'Net Banking', status: 'Success' },
  { no: 'RCP007', date: '2024-01-05', desc: 'Hostel Fee - Sem 1', amount: 15000, mode: 'Card', status: 'Success' },
  { no: 'RCP008', date: '2023-12-20', desc: 'Bus Fee Q4', amount: 3500, mode: 'UPI', status: 'Success' },
]

const walletHistory = [
  { date: '2024-06-12', type: 'Credit', amount: 1000, mode: 'UPI', balance: 2340 },
  { date: '2024-06-08', type: 'Debit', amount: 500, mode: 'Canteen', balance: 1340 },
  { date: '2024-06-05', type: 'Credit', amount: 2000, mode: 'Net Banking', balance: 1840 },
]

const libraryDues = [
  { title: 'Data Structures & Algorithms', isbn: '978-0-13-468599-1', issued: '2024-05-01', due: '2024-05-15', overdue: 28, fine: 140 },
  { title: 'Operating Systems Concepts', isbn: '978-1-118-06333-0', issued: '2024-05-10', due: '2024-05-24', overdue: 19, fine: 95 },
]

const refundRequests = [
  { id: 'REF001', feeType: 'Bus Fee', reason: 'Cancelled Service', amount: 3500, status: 'Approved', date: '2024-05-10' },
  { id: 'REF002', feeType: 'Lab Fee', reason: 'Overpayment', amount: 500, status: 'Under Review', date: '2024-06-01' },
]

const tuitionFees = [
  { name: 'Tuition Fee', amount: 45000, due: 'Jul 1, 2024', remarks: 'Per semester' },
  { name: 'University Development Fund', amount: 5000, due: 'Jul 1, 2024', remarks: 'Annual' },
  { name: 'Exam Fee', amount: 500, due: 'Jun 15, 2024', remarks: 'Per semester' },
  { name: 'Lab Fee', amount: 2000, due: 'Jul 1, 2024', remarks: 'Per semester' },
]
const hostelFees = [
  { name: 'Hostel Rent', amount: 8000, due: 'Jul 1, 2024', remarks: 'Per semester' },
  { name: 'Mess Charges', amount: 7000, due: 'Jul 1, 2024', remarks: 'Per semester' },
]
const otherFees = [
  { name: 'Library Fee', amount: 500, due: 'Jul 1, 2024', remarks: 'Annual' },
  { name: 'Sports Fee', amount: 1000, due: 'Jul 1, 2024', remarks: 'Annual' },
  { name: 'Bus Fee', amount: 3500, due: 'Jul 1, 2024', remarks: 'Per semester (optional)' },
]

const pendingVerifications = [
  { challan: 'CHN2024001', amount: 45000, date: '2024-06-10', status: 'Under Verification' },
]

export default function OnlinePayments() {
  const [active, setActive] = useState('Payments')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  const [walletPreset, setWalletPreset] = useState(null)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [transferForm, setTransferForm] = useState({ challan: '', amount: '', ref: '', proof: null })
  const [refundForm, setRefundForm] = useState({ feeType: '', reason: '', amount: '', desc: '', doc: null })
  const [showLibraryDues] = useState(libraryDues)
  const [revealCodes] = useState(false)

  const totalPending = feeItems.filter(f => f.status === 'PENDING').reduce((s, f) => s + f.amount, 0)

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
    border: 'none',
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

  const renderPayments = () => (
    <div>
      <div style={{ ...card, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff7ed', borderLeft: '4px solid #f97316' }}>
        <div>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>Total Outstanding</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#c2410c' }}>₹{totalPending.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ fontSize: 36 }}>💳</div>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
          <thead>
            <tr>
              {['Fee Type', 'Amount', 'Due Date', 'Status', 'Action'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {feeItems.map((item, i) => (
              <tr key={i}>
                <td style={tdStyle}>{item.type}</td>
                <td style={tdStyle}>₹{item.amount.toLocaleString('en-IN')}</td>
                <td style={tdStyle}>{item.due}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background: item.status === 'PAID' ? '#dcfce7' : '#fee2e2',
                    color: item.status === 'PAID' ? '#16a34a' : '#dc2626',
                  }}>
                    {item.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  {item.status === 'PENDING' && (
                    <button style={btn('primary')}>Pay Now</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div style={{ padding: '14px 16px', background: '#fef2f2', borderTop: '1px solid #fecaca' }}>
          <span style={{ fontWeight: 700, color: '#dc2626', fontSize: 15 }}>
            Total Pending: ₹{totalPending.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  )

  const renderWallet = () => (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 24, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#fff' }}>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>Current Balance</div>
        <div style={{ fontSize: 32, fontWeight: 700 }}>₹2,340</div>
      </div>

      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: TEXT }}>Add Money to Wallet</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[500, 1000, 2000, 5000].map(amt => (
            <button
              key={amt}
              onClick={() => { setWalletPreset(amt); setCustomAmount(String(amt)) }}
              style={{
                ...btn(walletPreset === amt ? 'primary' : 'outline'),
                padding: '8px 18px',
                border: walletPreset === amt ? 'none' : '1px solid #e2e8f0',
              }}
            >
              ₹{amt.toLocaleString('en-IN')}
            </button>
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Custom Amount</label>
          <input
            style={{ ...inputStyle, maxWidth: 240 }}
            placeholder="Enter amount"
            value={customAmount}
            onChange={e => { setCustomAmount(e.target.value); setWalletPreset(null) }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 8 }}>Payment Method</label>
          <div style={{ display: 'flex', gap: 12 }}>
            {['Net Banking', 'UPI', 'Card'].map(m => (
              <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14, color: TEXT }}>
                <input type="radio" name="payMethod" value={m} checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} />
                {m}
              </label>
            ))}
          </div>
        </div>
        <button style={btn('primary')}>Add to Wallet</button>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15 }}>
          Recent Transactions
        </div>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
          <thead>
            <tr>
              {['Date', 'Type', 'Mode', 'Amount', 'Balance'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {walletHistory.map((t, i) => (
              <tr key={i}>
                <td style={tdStyle}>{t.date}</td>
                <td style={tdStyle}>
                  <span style={{ color: t.type === 'Credit' ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{t.type}</span>
                </td>
                <td style={tdStyle}>{t.mode}</td>
                <td style={tdStyle}>
                  <span style={{ color: t.type === 'Credit' ? '#16a34a' : '#dc2626' }}>
                    {t.type === 'Credit' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </span>
                </td>
                <td style={tdStyle}>₹{t.balance.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )

  const renderReceipts = () => (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'flex-end' }}>
        <div>
          <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>From Date</label>
          <input type="date" style={{ ...inputStyle, width: 'auto' }} value={fromDate} onChange={e => setFromDate(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: MUTED, display: 'block', marginBottom: 4 }}>To Date</label>
          <input type="date" style={{ ...inputStyle, width: 'auto' }} value={toDate} onChange={e => setToDate(e.target.value)} />
        </div>
        <button style={btn('primary')}>Filter</button>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr>
              {['Receipt No', 'Date', 'Description', 'Amount', 'Mode', 'Status', 'Download'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {receiptRows.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.no}</td>
                <td style={tdStyle}>{r.date}</td>
                <td style={tdStyle}>{r.desc}</td>
                <td style={tdStyle}>₹{r.amount.toLocaleString('en-IN')}</td>
                <td style={tdStyle}>{r.mode}</td>
                <td style={tdStyle}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#dcfce7', color: '#16a34a' }}>
                    {r.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button style={{ ...btn('outline'), padding: '5px 12px', border: '1px solid #e2e8f0', fontSize: 12 }}>
                    ⬇ Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )

  const renderFeesSection = (title, rows, total) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontWeight: 600, fontSize: 15, color: TEXT, marginBottom: 10 }}>{title}</div>
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
          <thead>
            <tr>
              {['Fee Name', 'Amount (₹)', 'Due Date', 'Remarks'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={tdStyle}>{r.name}</td>
                <td style={tdStyle}>₹{r.amount.toLocaleString('en-IN')}</td>
                <td style={tdStyle}>{r.due}</td>
                <td style={{ ...tdStyle, color: MUTED }}>{r.remarks}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ ...tdStyle, fontWeight: 700 }}>Subtotal</td>
              <td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>₹{total.toLocaleString('en-IN')}</td>
              <td style={tdStyle} colSpan={2} />
            </tr>
          </tfoot>
        </table>
        </div>
      </div>
    </div>
  )

  const renderFeesIntimation = () => {
    const grandTotal = [...tuitionFees, ...hostelFees, ...otherFees].reduce((s, f) => s + f.amount, 0)
    return (
      <div>
        <div style={{ ...card, padding: '14px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eef2ff' }}>
          <span style={{ fontWeight: 600, color: ACCENT }}>Academic Year: 2024-25 | Semester: 2</span>
          <button style={btn('primary')}>⬇ Download PDF</button>
        </div>
        {renderFeesSection('Tuition & Academic Fees', tuitionFees, tuitionFees.reduce((s, f) => s + f.amount, 0))}
        {renderFeesSection('Hostel & Mess Fees', hostelFees, hostelFees.reduce((s, f) => s + f.amount, 0))}
        {renderFeesSection('Other Charges', otherFees, otherFees.reduce((s, f) => s + f.amount, 0))}
        <div style={{ ...card, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Grand Total</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#fbbf24' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>
    )
  }

  const renderOnlineTransfer = () => (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: TEXT }}>Payment Transfer Details</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Challan / Invoice No</label>
            <input style={inputStyle} placeholder="Enter challan number" value={transferForm.challan} onChange={e => setTransferForm({ ...transferForm, challan: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Amount (₹)</label>
            <input style={inputStyle} placeholder="Auto-filled on challan entry" value={transferForm.amount} onChange={e => setTransferForm({ ...transferForm, amount: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Payer Name</label>
            <input style={{ ...inputStyle, background: '#f8fafc', color: MUTED }} value="Arjun Kumar (Readonly)" readOnly />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Transaction Reference No</label>
            <input style={inputStyle} placeholder="Bank transaction reference" value={transferForm.ref} onChange={e => setTransferForm({ ...transferForm, ref: e.target.value })} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Upload Payment Proof</label>
            <input type="file" style={{ ...inputStyle, padding: '7px 12px' }} />
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Accepted: PDF, JPG, PNG (max 5MB)</div>
          </div>
        </div>
        <button style={btn('primary')}>Submit for Verification</button>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15 }}>
          Pending Verifications
        </div>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
          <thead>
            <tr>
              {['Challan No', 'Amount', 'Submitted Date', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {pendingVerifications.map((v, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{v.challan}</td>
                <td style={tdStyle}>₹{v.amount.toLocaleString('en-IN')}</td>
                <td style={tdStyle}>{v.date}</td>
                <td style={tdStyle}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#fef9c3', color: '#854d0e' }}>
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )

  const renderLibraryDue = () => (
    <div>
      {showLibraryDues.length === 0 ? (
        <div style={{ ...card, padding: 32, textAlign: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#16a34a', marginBottom: 6 }}>No Dues!</div>
          <div style={{ color: MUTED, fontSize: 14 }}>You have no pending library dues at this time.</div>
        </div>
      ) : (
        <>
          <div style={{ ...card, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fef2f2', borderLeft: '4px solid #ef4444' }}>
            <span style={{ fontWeight: 600, color: '#dc2626' }}>
              Total Fine: ₹{showLibraryDues.reduce((s, d) => s + d.fine, 0).toLocaleString('en-IN')}
            </span>
            <button style={btn('danger')}>Pay All Fines</button>
          </div>
          <div style={{ ...card, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr>
                  {['Book Title', 'ISBN', 'Issued Date', 'Due Date', 'Days Overdue', 'Fine Amount', 'Action'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {showLibraryDues.map((d, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{d.title}</td>
                    <td style={{ ...tdStyle, fontSize: 12, color: MUTED }}>{d.isbn}</td>
                    <td style={tdStyle}>{d.issued}</td>
                    <td style={tdStyle}>{d.due}</td>
                    <td style={tdStyle}>
                      <span style={{ color: '#dc2626', fontWeight: 600 }}>{d.overdue} days</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 700, color: '#dc2626' }}>₹{d.fine}</span>
                    </td>
                    <td style={tdStyle}>
                      <button style={btn('danger')}>Pay Fine</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </>
      )}
    </div>
  )

  const renderRefundRequest = () => (
    <div>
      <div style={{ ...card, padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: TEXT }}>New Refund Request</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Fee Type</label>
            <select style={inputStyle} value={refundForm.feeType} onChange={e => setRefundForm({ ...refundForm, feeType: e.target.value })}>
              <option value="">Select fee type</option>
              {['Tuition Fee', 'Hostel Fee', 'Bus Fee', 'Lab Fee', 'Library Fee', 'Exam Fee'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Reason</label>
            <select style={inputStyle} value={refundForm.reason} onChange={e => setRefundForm({ ...refundForm, reason: e.target.value })}>
              <option value="">Select reason</option>
              {['Withdrawal', 'Overpayment', 'Cancelled Service', 'Other'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Amount (₹)</label>
            <input style={inputStyle} type="number" placeholder="Refund amount" value={refundForm.amount} onChange={e => setRefundForm({ ...refundForm, amount: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Supporting Document</label>
            <input type="file" style={{ ...inputStyle, padding: '7px 12px' }} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Description</label>
            <textarea
              style={{ ...inputStyle, height: 80, resize: 'vertical' }}
              placeholder="Describe your refund reason..."
              value={refundForm.desc}
              onChange={e => setRefundForm({ ...refundForm, desc: e.target.value })}
            />
          </div>
        </div>
        <button style={btn('primary')}>Submit Request</button>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15 }}>
          My Refund Requests
        </div>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
          <thead>
            <tr>
              {['Request ID', 'Fee Type', 'Reason', 'Amount', 'Status', 'Date'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {refundRequests.map((r, i) => {
              const statusColors = {
                'Submitted': { bg: '#dbeafe', color: '#1d4ed8' },
                'Under Review': { bg: '#fef9c3', color: '#854d0e' },
                'Approved': { bg: '#dcfce7', color: '#16a34a' },
                'Rejected': { bg: '#fee2e2', color: '#dc2626' },
                'Credited': { bg: '#e0e7ff', color: '#4338ca' },
              }
              const sc = statusColors[r.status] || { bg: '#f1f5f9', color: MUTED }
              return (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.id}</td>
                  <td style={tdStyle}>{r.feeType}</td>
                  <td style={tdStyle}>{r.reason}</td>
                  <td style={tdStyle}>₹{r.amount.toLocaleString('en-IN')}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={tdStyle}>{r.date}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )

  const contentMap = {
    'Payments': renderPayments,
    'Wallet Amount Add': renderWallet,
    'Payment Receipts': renderReceipts,
    'Fees Intimation': renderFeesIntimation,
    'Online Transfer': renderOnlineTransfer,
    'Library Due': renderLibraryDue,
    'Refund Request': renderRefundRequest,
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: TEXT, margin: 0, marginBottom: 4 }}>Finance — Online Payments</h1>
        <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>Pay fees, manage wallet and view payment history</p>
      </div>

      <div style={{ ...card, display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 520 }}>
        <div style={{
          width: isMobile ? '100%' : 210,
          borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
          borderBottom: isMobile ? '1px solid #e2e8f0' : 'none',
          paddingTop: isMobile ? 4 : 8,
          paddingBottom: isMobile ? 4 : 8,
          padding: isMobile ? '8px 4px' : undefined,
          flexShrink: 0,
          display: isMobile ? 'flex' : 'block',
          flexDirection: isMobile ? 'row' : undefined,
          flexWrap: isMobile ? 'wrap' : undefined,
          overflowX: isMobile ? 'auto' : undefined,
        }}>
          {NAV_ITEMS.map(item => (
            <div key={item} onClick={() => setActive(item)} style={{
              ...navStyle(item),
              padding: isMobile ? '6px 12px' : navStyle(item).padding,
              fontSize: isMobile ? 12 : navStyle(item).fontSize,
              borderLeft: isMobile ? 'none' : navStyle(item).borderLeft,
              borderBottom: isMobile ? (active === item ? '2px solid #6366f1' : '2px solid transparent') : 'none',
              borderRadius: isMobile ? 100 : 0,
              whiteSpace: 'nowrap',
            }}>
              {item}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, padding: isMobile ? '16px' : 28, overflowY: 'auto' }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: TEXT, marginBottom: 20 }}>{active}</div>
          {contentMap[active]?.()}
        </div>
      </div>
    </div>
  )
}
