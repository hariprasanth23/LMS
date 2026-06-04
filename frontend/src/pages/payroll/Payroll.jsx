import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdPayment, MdAdd, MdCheck } from 'react-icons/md'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function StatusBadge({ status }) {
  const config = {
    DRAFT: { bg: '#f8fafc', color: MUTED },
    PROCESSED: { bg: '#f0f9ff', color: '#0ea5e9' },
    PAID: { bg: '#f0fdf4', color: '#10b981' }
  }
  const s = config[status] || config.DRAFT
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, fontFamily: 'system-ui, sans-serif' }}>
      {status}
    </span>
  )
}

function formatCurrency(amount) {
  if (amount == null) return '-'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export default function Payroll() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [showGenModal, setShowGenModal] = useState(false)
  const [filterMonth, setFilterMonth] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [genForm, setGenForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    remarks: ''
  })
  const [generating, setGenerating] = useState(false)
  const [detailModal, setDetailModal] = useState(null)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const fetchRecords = async () => {
    try {
      let url = isAdmin ? '/payroll' : '/payroll/my'
      const params = new URLSearchParams()
      if (isAdmin && filterMonth) params.append('month', filterMonth)
      if (isAdmin && filterYear) params.append('year', filterYear)
      if (params.toString()) url += '?' + params.toString()
      const res = await api.get(url)
      setRecords(res.data.data || [])
    } catch {
      toast.error('Failed to load payroll records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRecords() }, [filterMonth, filterYear])

  const handleGenerate = async (e) => {
    e.preventDefault()
    setGenerating(true)
    try {
      const res = await api.post('/payroll/generate', genForm)
      const count = res.data.data?.length || 0
      toast.success(`Payroll generated for ${count} employees`)
      setShowGenModal(false)
      fetchRecords()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate payroll')
    } finally {
      setGenerating(false)
    }
  }

  const handleProcess = async (id) => {
    try {
      await api.put(`/payroll/${id}/process`)
      toast.success('Payroll marked as processed')
      fetchRecords()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process')
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
    borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif',
    color: TEXT, outline: 'none', boxSizing: 'border-box'
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>
            {isAdmin ? 'Payroll Management' : 'My Payslips'}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>
            {records.length} records
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowGenModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
              background: ACCENT, color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer'
            }}
          >
            <MdAdd size={18} /> Generate Payroll
          </button>
        )}
      </div>

      {/* Filters (admin only) */}
      {isAdmin && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '16px 20px', marginBottom: 16, display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, fontFamily: 'system-ui, sans-serif' }}>Month</label>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif', color: TEXT, outline: 'none', cursor: 'pointer' }}>
              <option value="">All Months</option>
              {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, fontFamily: 'system-ui, sans-serif' }}>Year</label>
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif', color: TEXT, outline: 'none', cursor: 'pointer' }}>
              <option value="">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {(filterMonth || filterYear) && (
            <button onClick={() => { setFilterMonth(''); setFilterYear('') }}
              style={{ padding: '8px 14px', background: '#f1f5f9', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>
              Clear
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: MUTED }}>Loading...</div>
        ) : records.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <MdPayment style={{ fontSize: 44, opacity: 0.3, display: 'block', margin: '0 auto 10px', color: ACCENT }} />
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: MUTED }}>No payroll records found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {[isAdmin ? 'Employee' : null, 'Period', 'Base Salary', 'Allowances', 'Deductions', 'Net Salary', 'Status', 'Actions'].filter(Boolean).map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f8fafc' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  {isAdmin && (
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: TEXT }}>{r.employeeName || 'Unknown'}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>{r.empCode}</div>
                    </td>
                  )}
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: TEXT }}>
                    {MONTHS[(r.month || 1) - 1]} {r.year}
                  </td>
                  <td style={{ padding: '12px 16px', color: TEXT }}>{formatCurrency(r.baseSalary)}</td>
                  <td style={{ padding: '12px 16px', color: '#10b981' }}>+{formatCurrency(r.allowances)}</td>
                  <td style={{ padding: '12px 16px', color: '#ef4444' }}>-{formatCurrency(r.deductions)}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: ACCENT, fontSize: 14 }}>{formatCurrency(r.netSalary)}</td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={r.status} /></td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => setDetailModal(r)}
                        style={{ padding: '5px 10px', background: '#eef2ff', border: 'none', borderRadius: 6, cursor: 'pointer', color: ACCENT, fontSize: 12, fontWeight: 600 }}
                      >
                        View
                      </button>
                      {isAdmin && r.status === 'DRAFT' && (
                        <button
                          onClick={() => handleProcess(r.id)}
                          style={{ padding: '5px 10px', background: '#f0f9ff', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#0ea5e9', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <MdCheck size={12} /> Process
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Generate Modal */}
      {showGenModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 400 }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>Generate Payroll</h2>
            <form onSubmit={handleGenerate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif' }}>Month *</label>
                  <select value={genForm.month} onChange={e => setGenForm({ ...genForm, month: Number(e.target.value) })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif' }}>Year *</label>
                  <select value={genForm.year} onChange={e => setGenForm({ ...genForm, year: Number(e.target.value) })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif' }}>Remarks</label>
                <textarea value={genForm.remarks} onChange={e => setGenForm({ ...genForm, remarks: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowGenModal(false)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer', color: MUTED }}>Cancel</button>
                <button type="submit" disabled={generating} style={{ flex: 1, padding: '10px', background: generating ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>
                  {generating ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 420 }}>
            <h2 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>Payslip Details</h2>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>
              {MONTHS[(detailModal.month || 1) - 1]} {detailModal.year}
            </p>

            <div style={{ background: '#f8fafc', borderRadius: 10, padding: '16px 20px' }}>
              {[
                ['Employee', detailModal.employeeName || 'N/A'],
                ['Emp Code', detailModal.empCode || 'N/A'],
                ['Base Salary', formatCurrency(detailModal.baseSalary)],
                ['Allowances', `+${formatCurrency(detailModal.allowances)}`],
                ['Deductions', `-${formatCurrency(detailModal.deductions)}`],
                ['Leave Deductions', `-${formatCurrency(detailModal.leaveDeductions)}`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
                  <span style={{ color: MUTED }}>{label}</span>
                  <span style={{ color: TEXT, fontWeight: 500 }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontFamily: 'system-ui, sans-serif', fontSize: 15 }}>
                <span style={{ fontWeight: 700, color: TEXT }}>Net Salary</span>
                <span style={{ fontWeight: 700, color: ACCENT }}>{formatCurrency(detailModal.netSalary)}</span>
              </div>
            </div>

            {detailModal.remarks && (
              <div style={{ marginTop: 14, fontFamily: 'system-ui, sans-serif', fontSize: 12, color: MUTED }}>
                <strong>Remarks:</strong> {detailModal.remarks}
              </div>
            )}

            <div style={{ marginTop: 20 }}>
              <button onClick={() => setDetailModal(null)} style={{ width: '100%', padding: '10px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
