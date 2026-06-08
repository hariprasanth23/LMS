import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const NAV_ITEMS = ['Payments', 'Wallet Amount Add', 'Payment Receipts', 'Fees Intimation', 'Online Transfer', 'Library Due', 'Refund Request']

export default function OnlinePayments() {
  const [active, setActive] = useState('Payments')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const card = { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }
  const btn = (variant = 'primary') => ({
    padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
    background: variant === 'primary' ? ACCENT : variant === 'danger' ? '#ef4444' : variant === 'success' ? '#10b981' : '#f1f5f9',
    color: ['primary', 'danger', 'success'].includes(variant) ? '#fff' : TEXT,
  })
  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: TEXT, outline: 'none', boxSizing: 'border-box' }
  const thStyle = { padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: MUTED, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }
  const tdStyle = { padding: '12px 14px', fontSize: 14, color: TEXT, borderBottom: '1px solid #f1f5f9' }

  const navStyle = (item) => ({
    padding: '10px 18px', cursor: 'pointer', fontSize: 14,
    borderLeft: active === item ? '3px solid #6366f1' : '3px solid transparent',
    background: active === item ? '#eef2ff' : 'transparent',
    color: active === item ? ACCENT : TEXT, fontWeight: active === item ? 600 : 400,
  })

  function Loading() { return <div style={{ padding: 40, textAlign: 'center', color: MUTED }}>Loading…</div> }

  // ── Payments ──────────────────────────────────────────────────────────────────
  function PaymentsSection() {
    const [fees, setFees] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      api.get('/finance/fees')
        .then(r => setFees(r.data.data || []))
        .catch(() => toast.error('Failed to load fees'))
        .finally(() => setLoading(false))
    }, [])

    const totalPending = fees.filter(f => f.status === 'PENDING').reduce((s, f) => s + parseFloat(f.amount), 0)

    return loading ? <Loading /> : (
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
              <thead><tr>{['Fee Type', 'Amount', 'Due Date', 'Status', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>
                {fees.map((item, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{item.feeType}</td>
                    <td style={tdStyle}>₹{parseFloat(item.amount).toLocaleString('en-IN')}</td>
                    <td style={tdStyle}>{item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                    <td style={tdStyle}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: item.status === 'PAID' ? '#dcfce7' : '#fee2e2', color: item.status === 'PAID' ? '#16a34a' : '#dc2626' }}>{item.status}</span>
                    </td>
                    <td style={tdStyle}>{item.status === 'PENDING' && <button style={btn('primary')}>Pay Now</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // ── Wallet ────────────────────────────────────────────────────────────────────
  function WalletSection() {
    const [wallet, setWallet] = useState({ balance: 0, transactions: [] })
    const [loading, setLoading] = useState(true)
    const [customAmount, setCustomAmount] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('UPI')
    const [walletPreset, setWalletPreset] = useState(null)
    const [adding, setAdding] = useState(false)

    useEffect(() => {
      api.get('/finance/wallet')
        .then(r => setWallet(r.data.data || { balance: 0, transactions: [] }))
        .catch(() => toast.error('Failed to load wallet'))
        .finally(() => setLoading(false))
    }, [])

    const handleAdd = async () => {
      if (!customAmount || parseFloat(customAmount) <= 0) { toast.error('Enter a valid amount'); return }
      setAdding(true)
      try {
        const res = await api.post('/finance/wallet/add', { amount: parseFloat(customAmount), mode: paymentMethod })
        setWallet(prev => ({ balance: res.data.data.balanceAfter, transactions: [res.data.data, ...prev.transactions] }))
        setCustomAmount(''); setWalletPreset(null)
        toast.success('Wallet updated!')
      } catch { toast.error('Failed to add to wallet') }
      finally { setAdding(false) }
    }

    if (loading) return <Loading />
    return (
      <div>
        <div style={{ ...card, padding: 24, marginBottom: 24, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#fff' }}>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>Current Balance</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>₹{parseFloat(wallet.balance || 0).toLocaleString('en-IN')}</div>
        </div>
        <div style={{ ...card, padding: 24, marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: TEXT }}>Add Money to Wallet</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            {[500, 1000, 2000, 5000].map(amt => (
              <button key={amt} onClick={() => { setWalletPreset(amt); setCustomAmount(String(amt)) }}
                style={{ ...btn(walletPreset === amt ? 'primary' : 'outline'), padding: '8px 18px', border: walletPreset === amt ? 'none' : '1px solid #e2e8f0' }}>
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Custom Amount</label>
            <input style={{ ...inputStyle, maxWidth: 240 }} placeholder="Enter amount" value={customAmount}
              onChange={e => { setCustomAmount(e.target.value); setWalletPreset(null) }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 8 }}>Payment Method</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {['Net Banking', 'UPI', 'Card'].map(m => (
                <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14, color: TEXT }}>
                  <input type="radio" name="payMethod" value={m} checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} /> {m}
                </label>
              ))}
            </div>
          </div>
          <button style={btn('primary')} onClick={handleAdd} disabled={adding}>{adding ? 'Processing…' : 'Add to Wallet'}</button>
        </div>
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15 }}>Recent Transactions</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
              <thead><tr>{['Date', 'Type', 'Mode', 'Amount', 'Balance'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>
                {wallet.transactions.map((t, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                    <td style={tdStyle}><span style={{ color: t.type === 'Credit' ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{t.type}</span></td>
                    <td style={tdStyle}>{t.mode}</td>
                    <td style={tdStyle}><span style={{ color: t.type === 'Credit' ? '#16a34a' : '#dc2626' }}>{t.type === 'Credit' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString('en-IN')}</span></td>
                    <td style={tdStyle}>₹{parseFloat(t.balanceAfter || 0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // ── Receipts ──────────────────────────────────────────────────────────────────
  function ReceiptsSection() {
    const [receipts, setReceipts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      api.get('/finance/receipts')
        .then(r => setReceipts(r.data.data || []))
        .catch(() => toast.error('Failed to load receipts'))
        .finally(() => setLoading(false))
    }, [])

    return loading ? <Loading /> : (
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead><tr>{['Receipt No', 'Date', 'Description', 'Amount', 'Mode', 'Status', 'Download'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
            <tbody>
              {receipts.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.receiptNumber}</td>
                  <td style={tdStyle}>{r.paidAt ? new Date(r.paidAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td style={tdStyle}>{r.description}</td>
                  <td style={tdStyle}>₹{parseFloat(r.amount).toLocaleString('en-IN')}</td>
                  <td style={tdStyle}>{r.paymentMode}</td>
                  <td style={tdStyle}><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#dcfce7', color: '#16a34a' }}>{r.status}</span></td>
                  <td style={tdStyle}><button style={{ ...btn('outline'), padding: '5px 12px', border: '1px solid #e2e8f0', fontSize: 12 }}>⬇ Download</button></td>
                </tr>
              ))}
              {receipts.length === 0 && <tr><td colSpan={7} style={{ padding: 20, textAlign: 'center', color: MUTED }}>No receipts found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // ── Fees Intimation (static) ──────────────────────────────────────────────────
  function FeesIntimationSection() {
    const sections = [
      { title: 'Tuition & Academic Fees', rows: [['Tuition Fee', 45000], ['University Development Fund', 5000], ['Exam Fee', 500], ['Lab Fee', 2000]] },
      { title: 'Hostel & Mess Fees',       rows: [['Hostel Rent', 8000], ['Mess Charges', 7000]] },
      { title: 'Other Charges',            rows: [['Library Fee', 500], ['Sports Fee', 1000], ['Bus Fee (optional)', 3500]] },
    ]
    const grandTotal = sections.flatMap(s => s.rows).reduce((a, [, v]) => a + v, 0)
    return (
      <div>
        <div style={{ ...card, padding: '14px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eef2ff' }}>
          <span style={{ fontWeight: 600, color: ACCENT }}>Academic Year: 2024-25 | Semester: 6</span>
          <button style={btn('primary')}>⬇ Download PDF</button>
        </div>
        {sections.map(({ title, rows }) => (
          <div key={title} style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: TEXT, marginBottom: 10 }}>{title}</div>
            <div style={{ ...card, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Fee Name', 'Amount (₹)'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                <tbody>
                  {rows.map(([name, amt]) => (
                    <tr key={name}><td style={tdStyle}>{name}</td><td style={tdStyle}>₹{amt.toLocaleString('en-IN')}</td></tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td style={{ ...tdStyle, fontWeight: 700 }}>Subtotal</td><td style={{ ...tdStyle, fontWeight: 700, color: ACCENT }}>₹{rows.reduce((a, [, v]) => a + v, 0).toLocaleString('en-IN')}</td></tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))}
        <div style={{ ...card, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Grand Total</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#fbbf24' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>
    )
  }

  // ── Online Transfer (static form) ─────────────────────────────────────────────
  function OnlineTransferSection() {
    return (
      <div>
        <div style={{ ...card, padding: 24, marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: TEXT }}>Payment Transfer Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {[['Challan / Invoice No', 'Enter challan number'], ['Amount (₹)', 'Auto-filled on challan entry'], ['Transaction Reference No', 'Bank transaction reference']].map(([label, ph]) => (
              <div key={label}>
                <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>{label}</label>
                <input style={inputStyle} placeholder={ph} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Upload Payment Proof</label>
              <input type="file" style={{ ...inputStyle, padding: '7px 12px' }} />
            </div>
          </div>
          <button style={btn('primary')}>Submit for Verification</button>
        </div>
      </div>
    )
  }

  // ── Library Due (static) ──────────────────────────────────────────────────────
  function LibraryDueSection() {
    const dues = [
      { title: 'Data Structures & Algorithms', isbn: '978-0-13-468599-1', issued: '2024-05-01', due: '2024-05-15', overdue: 28, fine: 140 },
      { title: 'Operating Systems Concepts',   isbn: '978-1-118-06333-0', issued: '2024-05-10', due: '2024-05-24', overdue: 19, fine: 95 },
    ]
    const totalFine = dues.reduce((s, d) => s + d.fine, 0)
    return (
      <div>
        <div style={{ ...card, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fef2f2', borderLeft: '4px solid #ef4444' }}>
          <span style={{ fontWeight: 600, color: '#dc2626' }}>Total Fine: ₹{totalFine}</span>
          <button style={btn('danger')}>Pay All Fines</button>
        </div>
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead><tr>{['Book Title', 'ISBN', 'Issued Date', 'Due Date', 'Days Overdue', 'Fine Amount', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>
                {dues.map((d, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{d.title}</td>
                    <td style={{ ...tdStyle, fontSize: 12, color: MUTED }}>{d.isbn}</td>
                    <td style={tdStyle}>{d.issued}</td>
                    <td style={tdStyle}>{d.due}</td>
                    <td style={tdStyle}><span style={{ color: '#dc2626', fontWeight: 600 }}>{d.overdue} days</span></td>
                    <td style={tdStyle}><span style={{ fontWeight: 700, color: '#dc2626' }}>₹{d.fine}</span></td>
                    <td style={tdStyle}><button style={btn('danger')}>Pay Fine</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // ── Refund Request ────────────────────────────────────────────────────────────
  function RefundSection() {
    const [refunds, setRefunds] = useState([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({ feeType: '', reason: '', amount: '', desc: '' })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
      api.get('/finance/refunds')
        .then(r => setRefunds(r.data.data || []))
        .catch(() => {})
        .finally(() => setLoading(false))
    }, [])

    const handleSubmit = async () => {
      if (!form.feeType || !form.reason || !form.amount) { toast.error('Please fill required fields'); return }
      setSubmitting(true)
      try {
        const res = await api.post('/finance/refunds', { feeType: form.feeType, reason: form.reason, amount: parseFloat(form.amount), description: form.desc })
        setRefunds(prev => [res.data.data, ...prev])
        setForm({ feeType: '', reason: '', amount: '', desc: '' })
        toast.success('Refund request submitted!')
      } catch { toast.error('Failed to submit refund') }
      finally { setSubmitting(false) }
    }

    const statusColors = { 'Under Review': { bg: '#fef9c3', color: '#854d0e' }, 'Approved': { bg: '#dcfce7', color: '#16a34a' }, 'Rejected': { bg: '#fee2e2', color: '#dc2626' } }

    return (
      <div>
        <div style={{ ...card, padding: 24, marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16, color: TEXT }}>New Refund Request</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Fee Type</label>
              <select style={inputStyle} value={form.feeType} onChange={e => setForm(f => ({ ...f, feeType: e.target.value }))}>
                <option value="">Select fee type</option>
                {['Tuition Fee', 'Hostel Fee', 'Bus Fee', 'Lab Fee', 'Library Fee', 'Exam Fee'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Reason</label>
              <select style={inputStyle} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}>
                <option value="">Select reason</option>
                {['Withdrawal', 'Overpayment', 'Cancelled Service', 'Other'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Amount (₹)</label>
              <input style={inputStyle} type="number" placeholder="Refund amount" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: 13, color: MUTED, display: 'block', marginBottom: 6 }}>Description</label>
              <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} placeholder="Describe your refund reason..." value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
            </div>
          </div>
          <button style={btn('primary')} onClick={handleSubmit} disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Request'}</button>
        </div>
        {!loading && (
          <div style={{ ...card, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15 }}>My Refund Requests</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                <thead><tr>{['Request ID', 'Fee Type', 'Reason', 'Amount', 'Status', 'Date'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                <tbody>
                  {refunds.map((r, i) => {
                    const sc = statusColors[r.status] || { bg: '#f1f5f9', color: MUTED }
                    return (
                      <tr key={i}>
                        <td style={{ ...tdStyle, fontWeight: 600, color: ACCENT }}>{r.requestNumber}</td>
                        <td style={tdStyle}>{r.feeType}</td>
                        <td style={tdStyle}>{r.reason}</td>
                        <td style={tdStyle}>₹{parseFloat(r.amount || 0).toLocaleString('en-IN')}</td>
                        <td style={tdStyle}><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>{r.status}</span></td>
                        <td style={tdStyle}>{r.requestedAt ? new Date(r.requestedAt).toLocaleDateString('en-IN') : '—'}</td>
                      </tr>
                    )
                  })}
                  {refunds.length === 0 && <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', color: MUTED }}>No refund requests</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  const contentMap = {
    'Payments':         PaymentsSection,
    'Wallet Amount Add': WalletSection,
    'Payment Receipts': ReceiptsSection,
    'Fees Intimation':  FeesIntimationSection,
    'Online Transfer':  OnlineTransferSection,
    'Library Due':      LibraryDueSection,
    'Refund Request':   RefundSection,
  }
  const ActiveSection = contentMap[active]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: BG, minHeight: '100vh', padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: TEXT, margin: 0, marginBottom: 4 }}>Finance — Online Payments</h1>
        <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>Pay fees, manage wallet and view payment history</p>
      </div>

      <div style={{ ...card, display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 520 }}>
        <div style={{
          width: isMobile ? '100%' : 210, borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
          borderBottom: isMobile ? '1px solid #e2e8f0' : 'none',
          padding: isMobile ? '8px 4px' : undefined, paddingTop: isMobile ? undefined : 8, paddingBottom: isMobile ? undefined : 8,
          flexShrink: 0, display: isMobile ? 'flex' : 'block', flexWrap: isMobile ? 'wrap' : undefined, overflowX: isMobile ? 'auto' : undefined,
        }}>
          {NAV_ITEMS.map(item => (
            <div key={item} onClick={() => setActive(item)} style={{
              ...navStyle(item),
              padding: isMobile ? '6px 12px' : navStyle(item).padding,
              fontSize: isMobile ? 12 : 14,
              borderLeft: isMobile ? 'none' : navStyle(item).borderLeft,
              borderBottom: isMobile ? (active === item ? '2px solid #6366f1' : '2px solid transparent') : 'none',
              borderRadius: isMobile ? 100 : 0, whiteSpace: 'nowrap',
            }}>
              {item}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: isMobile ? '16px' : 28, overflowY: 'auto' }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: TEXT, marginBottom: 20 }}>{active}</div>
          {ActiveSection && <ActiveSection />}
        </div>
      </div>
    </div>
  )
}
