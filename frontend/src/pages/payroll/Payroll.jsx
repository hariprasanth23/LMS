import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdPayment, MdAdd, MdCheck, MdDownload, MdClose, MdTrendingUp, MdPeople, MdAccountBalanceWallet, MdUploadFile } from 'react-icons/md'
import CsvImportModal from '../../components/common/CsvImportModal'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function StatusBadge({ status }) {
  const config = {
    DRAFT:     { bg: '#f8fafc', color: MUTED },
    PROCESSED: { bg: '#f0f9ff', color: '#0ea5e9' },
    PAID:      { bg: '#f0fdf4', color: '#10b981' }
  }
  const s = config[status] || config.DRAFT
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, fontFamily: 'system-ui, sans-serif', whiteSpace: 'nowrap' }}>
      {status}
    </span>
  )
}

function formatCurrency(amount) {
  if (amount == null) return '-'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden', marginTop: 6 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.5s' }} />
    </div>
  )
}

function SalaryBreakdownCard({ record }) {
  const gross = (record.baseSalary || 0) + (record.allowances || 0)
  const pf = Math.round(((record.baseSalary || 0) * 0.06))
  const tds = record.tds || Math.round(gross * 0.033)
  const other = record.otherDeductions || 500
  const totalDeductions = (record.deductions || 0) || (pf + tds + other)
  const net = record.netSalary || (gross - totalDeductions)

  return (
    <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #818cf8 100%)`, padding: '20px 24px', color: '#fff' }}>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4, fontFamily: 'system-ui, sans-serif' }}>
          {MONTHS[(record.month || 1) - 1]} {record.year} Payslip
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'system-ui, sans-serif' }}>{formatCurrency(net)}</div>
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2, fontFamily: 'system-ui, sans-serif' }}>Net Take-Home</div>
        <div style={{ marginTop: 10 }}>
          <StatusBadge status={record.status} />
        </div>
      </div>

      <div style={{ padding: '20px 24px' }}>
        {/* Gross */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: TEXT }}>Gross Earnings</span>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 15, fontWeight: 800, color: '#10b981' }}>{formatCurrency(gross)}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            {[
              ['Base Salary', record.baseSalary || 0, TEXT],
              ['Allowances', record.allowances || 0, '#10b981'],
            ].map(([label, val, color]) => (
              <div key={label} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: MUTED }}>{label}</div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, fontWeight: 700, color, marginTop: 2 }}>{formatCurrency(val)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Deductions */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: TEXT }}>Deductions</span>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, fontWeight: 700, color: '#ef4444' }}>-{formatCurrency(totalDeductions)}</span>
          </div>
          {[
            { label: 'Provident Fund (PF)', value: pf, color: '#6366f1', pct: (pf / gross) * 100 },
            { label: 'TDS / Income Tax', value: tds, color: '#f59e0b', pct: (tds / gross) * 100 },
            { label: 'Other Deductions', value: other, color: '#ef4444', pct: (other / gross) * 100 },
          ].map(d => (
            <div key={d.label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: MUTED }}>{d.label}</span>
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, fontWeight: 600, color: d.color }}>-{formatCurrency(d.value)}</span>
              </div>
              <ProgressBar value={d.value} max={gross} color={d.color} />
            </div>
          ))}
        </div>

        {/* Net */}
        <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 15, fontWeight: 700, color: TEXT }}>Net Salary</span>
          <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 18, fontWeight: 800, color: ACCENT }}>{formatCurrency(net)}</span>
        </div>

        <button style={{
          width: '100%', marginTop: 16, padding: '10px', background: '#f8fafc',
          border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600,
          cursor: 'pointer', color: TEXT, fontFamily: 'system-ui, sans-serif',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
        }}>
          <MdDownload size={16} /> Download Payslip
        </button>
      </div>
    </div>
  )
}

export default function Payroll() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [showGenModal, setShowGenModal] = useState(false)
  const [showImport, setShowImport] = useState(false)
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

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: '#374151', marginBottom: 5, fontFamily: 'system-ui, sans-serif'
  }

  // Admin summary stats
  const totalPayroll = records.reduce((s, r) => s + (r.netSalary || 0), 0)
  const avgSalary = records.length ? Math.round(totalPayroll / records.length) : 0
  const paidCount = records.filter(r => r.status === 'PAID').length

  // Most recent record for salary card (non-admin)
  const latestRecord = records[0] || null

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT }}>
            {isAdmin ? 'Payroll Management' : 'My Payroll'}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED }}>
            {records.length} records
          </p>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowImport(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: '#fff', color: '#6366f1', border: '1.5px solid #c7d2fe', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <MdUploadFile size={16} /> Import CSV
            </button>
            <button onClick={() => setShowGenModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <MdAdd size={18} /> Generate Payroll
            </button>
          </div>
        )}
      </div>

      {/* Admin Summary Stats */}
      {isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { icon: MdAccountBalanceWallet, label: 'Total Payroll', value: formatCurrency(totalPayroll), color: ACCENT, bg: '#eef2ff', border: '#c7d2fe' },
            { icon: MdTrendingUp, label: 'Average Salary', value: formatCurrency(avgSalary), color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0' },
            { icon: MdPeople, label: 'Employees Paid', value: paidCount, color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Non-admin: latest salary breakdown card */}
      {!isAdmin && latestRecord && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: TEXT }}>Current Month Salary</h3>
          <SalaryBreakdownCard record={latestRecord} />
        </div>
      )}

      {/* Filters (admin only) */}
      {isAdmin && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '14px 18px', marginBottom: 16, display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={labelStyle}>Month</label>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif', color: TEXT, outline: 'none', cursor: 'pointer' }}>
              <option value="">All Months</option>
              {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Year</label>
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontFamily: 'system-ui, sans-serif', color: TEXT, outline: 'none', cursor: 'pointer' }}>
              <option value="">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {(filterMonth || filterYear) && (
            <button onClick={() => { setFilterMonth(''); setFilterYear('') }}
              style={{ padding: '8px 14px', background: '#f1f5f9', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: MUTED }}>
              Clear
            </button>
          )}
        </div>
      )}

      {/* Non-admin salary history heading */}
      {!isAdmin && records.length > 0 && (
        <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: TEXT }}>Salary History</h3>
      )}

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: MUTED }}>Loading...</div>
        ) : records.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <MdPayment style={{ fontSize: 44, opacity: 0.3, display: 'block', margin: '0 auto 10px', color: ACCENT }} />
            <div style={{ fontSize: 14, color: MUTED }}>No payroll records found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {[isAdmin ? 'Employee' : null, 'Period', 'Gross', 'Deductions', 'Net Salary', 'Status', 'Actions'].filter(Boolean).map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 12, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map(r => {
                const gross = (r.baseSalary || 0) + (r.allowances || 0)
                return (
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
                    <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: 500 }}>{formatCurrency(gross)}</td>
                    <td style={{ padding: '12px 16px', color: '#ef4444', fontWeight: 500 }}>-{formatCurrency(r.deductions)}</td>
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
                        <button
                          style={{ padding: '5px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', color: MUTED, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <MdDownload size={13} /> Payslip
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
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Generate Modal */}
      {showGenModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 420 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: TEXT }}>Generate Payroll</h2>
              <button onClick={() => setShowGenModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED }}><MdClose size={20} /></button>
            </div>
            <form onSubmit={handleGenerate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Month *</label>
                  <select value={genForm.month} onChange={e => setGenForm({ ...genForm, month: Number(e.target.value) })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Year *</label>
                  <select value={genForm.year} onChange={e => setGenForm({ ...genForm, year: Number(e.target.value) })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Remarks</label>
                <textarea value={genForm.remarks} onChange={e => setGenForm({ ...genForm, remarks: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'none' }} />
              </div>
              <div style={{ background: '#fffbeb', borderRadius: 8, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: '#92400e', fontFamily: 'system-ui, sans-serif' }}>
                This will generate payroll records for all active employees for the selected period.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowGenModal(false)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: MUTED }}>Cancel</button>
                <button type="submit" disabled={generating} style={{ flex: 1, padding: '10px', background: generating ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
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
          <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 440, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 0' }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: TEXT }}>Payslip Details</h2>
              <button onClick={() => setDetailModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED }}><MdClose size={20} /></button>
            </div>
            <div style={{ padding: '16px 24px 24px' }}>
              <SalaryBreakdownCard record={detailModal} />
              {detailModal.remarks && (
                <div style={{ marginTop: 14, fontSize: 12, color: MUTED }}>
                  <strong>Remarks:</strong> {detailModal.remarks}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <CsvImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onDone={() => fetchRecords()}
        title="Generate Payroll via CSV"
        sampleFile="sample_payroll_periods.csv"
        columns={[
          { key: 'month',   label: 'Month (1–12)', required: true, type: 'number', min: 1, max: 12 },
          { key: 'year',    label: 'Year',         required: true, type: 'number' },
          { key: 'remarks', label: 'Remarks',      required: false },
        ]}
        sampleRows={[
          { month: 9, year: 2026, remarks: 'September payroll' },
          { month: 10, year: 2026, remarks: 'October payroll' },
        ]}
        importFn={async (rows) => {
          const results = []
          let successCount = 0, failureCount = 0
          const seen = new Set()
          for (let i = 0; i < rows.length; i++) {
            const r = rows[i]
            const key = `${r.month}-${r.year}`
            if (seen.has(key)) {
              results.push({ row: i + 2, empCode: key, success: false, message: 'Duplicate month/year — skipped' })
              failureCount++
              continue
            }
            seen.add(key)
            try {
              const res = await api.post('/payroll/generate', { month: Number(r.month), year: Number(r.year), remarks: r.remarks || null })
              const count = res.data.data?.length || 0
              results.push({ row: i + 2, empCode: `${r.month}/${r.year}`, success: true, message: `Generated for ${count} employees` })
              successCount++
            } catch (e) {
              results.push({ row: i + 2, empCode: `${r.month}/${r.year}`, success: false, message: e.response?.data?.message || e.message })
              failureCount++
            }
          }
          return { successCount, failureCount, results }
        }}
      />
    </div>
  )
}
