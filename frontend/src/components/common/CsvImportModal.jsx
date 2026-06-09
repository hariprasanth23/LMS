import React, { useState, useRef, useCallback } from 'react'
import { MdClose, MdUploadFile, MdDownload, MdCheckCircle, MdError, MdWarning, MdCloudUpload } from 'react-icons/md'

const ff = 'system-ui, -apple-system, sans-serif'

// ── CSV parser ─────────────────────────────────────────────────────────────────
function parseCsvLine(line) {
  const result = []
  let cur = '', inQuote = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { inQuote = !inQuote }
    else if (ch === ',' && !inQuote) { result.push(cur.trim()); cur = '' }
    else { cur += ch }
  }
  result.push(cur.trim())
  return result
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim())
  if (lines.length < 2) return { headers: [], rows: [] }
  const headers = parseCsvLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim())
  const rows = lines.slice(1).map((line, i) => {
    const vals = parseCsvLine(line)
    const row = { _row: i + 2 }
    headers.forEach((h, j) => { row[h] = (vals[j] || '').replace(/^"|"$/g, '').trim() })
    return row
  })
  return { headers, rows }
}

function downloadCsv(filename, columns, sampleRows) {
  const header = columns.map(c => c.label).join(',')
  const dataRows = sampleRows.map(r =>
    columns.map(c => {
      const v = r[c.key] != null ? String(r[c.key]) : ''
      return v.includes(',') ? `"${v}"` : v
    }).join(',')
  )
  const csv = [header, ...dataRows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function validateRow(row, columns) {
  const errors = []
  columns.forEach(col => {
    const val = row[col.key]
    if (col.required && (val === undefined || val === '')) {
      errors.push(`"${col.label}" is required`); return
    }
    if (val && col.type === 'number' && isNaN(Number(val)))
      errors.push(`"${col.label}" must be a number`)
    if (val && col.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      errors.push(`"${col.label}" must be a valid email`)
    if (val && col.type === 'date' && isNaN(Date.parse(val)))
      errors.push(`"${col.label}" must be a valid date (YYYY-MM-DD)`)
    if (val && col.min != null && Number(val) < col.min)
      errors.push(`"${col.label}" must be ≥ ${col.min}`)
    if (val && col.max != null && Number(val) > col.max)
      errors.push(`"${col.label}" must be ≤ ${col.max}`)
    if (val && col.enum && !col.enum.includes(val.toUpperCase()))
      errors.push(`"${col.label}" must be one of: ${col.enum.join(', ')}`)
    if (col.validate) {
      const err = col.validate(val, row)
      if (err) errors.push(err)
    }
  })
  return errors
}

// ── Step indicator ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'upload',    label: 'Upload' },
  { id: 'preview',   label: 'Validate' },
  { id: 'importing', label: 'Import' },
  { id: 'done',      label: 'Done' },
]

function StepBar({ current }) {
  const idx = STEPS.findIndex(s => s.id === current)
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 24px 0' }}>
      {STEPS.map((s, i) => (
        <React.Fragment key={s.id}>
          {i > 0 && (
            <div style={{ flex: 1, height: 2, background: i <= idx ? '#6366f1' : '#e2e8f0', transition: 'background 0.3s', margin: '0 4px' }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              background: i < idx ? '#6366f1' : i === idx ? '#6366f1' : '#e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.3s',
              boxShadow: i === idx ? '0 0 0 3px #eef2ff' : 'none',
            }}>
              {i < idx
                ? <MdCheckCircle style={{ color: '#fff', fontSize: 14 }} />
                : <div style={{ width: 7, height: 7, borderRadius: '50%', background: i === idx ? '#fff' : '#94a3b8' }} />
              }
            </div>
            <span style={{ fontSize: 10, fontWeight: i === idx ? 700 : 500, color: i <= idx ? '#6366f1' : '#94a3b8', letterSpacing: 0.3, whiteSpace: 'nowrap' }}>
              {s.label}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

// ── Column chip ────────────────────────────────────────────────────────────────
function ColChip({ col }) {
  const req = col.required
  return (
    <span title={col.label} style={{
      padding: '3px 8px', borderRadius: 5, fontSize: 11, fontFamily: 'monospace',
      fontWeight: req ? 700 : 400, whiteSpace: 'nowrap',
      background: req ? '#fef2f2' : '#f8fafc',
      color: req ? '#991b1b' : '#64748b',
      border: req ? '1px solid #fecaca' : '1px solid #e2e8f0',
    }}>
      {col.key}
    </span>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function CsvImportModal({
  isOpen, onClose, onDone,
  title = 'Import Data',
  columns = [],
  sampleRows = [],
  sampleFile = 'sample.csv',
  importFn,
}) {
  const [step, setStep]               = useState('upload')
  const [dragging, setDragging]       = useState(false)
  const [fileName, setFileName]       = useState('')
  const [validated, setValidated]     = useState([])
  const [importResults, setImportResults] = useState([])
  const [importSummary, setImportSummary] = useState(null)
  const [importing, setImporting]     = useState(false)
  const [importedCount, setImportedCount] = useState(0)
  const [showOptional, setShowOptional]   = useState(false)
  const [expandedRows, setExpandedRows]   = useState(new Set())
  const fileRef = useRef()

  const reset = () => {
    setStep('upload'); setFileName(''); setValidated([])
    setImportResults([]); setImportSummary(null)
    setImporting(false); setImportedCount(0)
    setShowOptional(false); setExpandedRows(new Set())
  }

  const handleClose = () => { reset(); onClose() }

  const processFile = useCallback((file) => {
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const { rows } = parseCsv(e.target.result)
      const results = rows.map(row => ({
        row: row._row, data: row,
        errors: validateRow(row, columns),
      }))
      setValidated(results)
      setExpandedRows(new Set())
      setStep('preview')
    }
    reader.readAsText(file)
  }, [columns])

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.csv')) processFile(file)
  }, [processFile])

  const handleFileInput = (e) => { processFile(e.target.files[0]); e.target.value = '' }

  const toggleRow = (idx) => setExpandedRows(prev => {
    const next = new Set(prev)
    next.has(idx) ? next.delete(idx) : next.add(idx)
    return next
  })

  const validRows    = validated.filter(r => r.errors.length === 0)
  const invalidRows  = validated.filter(r => r.errors.length > 0)
  const requiredCols = columns.filter(c => c.required)
  const optionalCols = columns.filter(c => !c.required)
  const previewCols  = requiredCols.length >= 2 ? requiredCols.slice(0, 3) : columns.slice(0, 3)

  const handleImport = async () => {
    if (!importFn || validRows.length === 0) return
    setImporting(true); setStep('importing'); setImportedCount(0)
    try {
      const result = await importFn(validRows.map(r => r.data), (n) => setImportedCount(n))
      setImportSummary(result)
      setImportResults(result.results || [])
      setStep('done')
      if (onDone) onDone(result)
    } catch (err) {
      setImportSummary({ successCount: 0, failureCount: validRows.length, error: err.message })
      setStep('done')
    } finally { setImporting(false) }
  }

  if (!isOpen) return null

  const validPct = validated.length ? (validRows.length / validated.length) * 100 : 0

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16, fontFamily: ff }}
      onClick={e => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 800, maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.20)', overflow: 'hidden' }}>

        {/* ── Header ── */}
        <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MdUploadFile style={{ color: '#fff', fontSize: 20 }} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{title}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  {step === 'upload'    && `${requiredCols.length} required · ${optionalCols.length} optional fields`}
                  {step === 'preview'   && `${validated.length} rows parsed — ${validRows.length} valid, ${invalidRows.length} with errors`}
                  {step === 'importing' && `Saving ${importedCount} of ${validRows.length} records…`}
                  {step === 'done'      && `${importSummary?.successCount ?? 0} imported · ${importSummary?.failureCount ?? 0} failed`}
                </div>
              </div>
            </div>
            <button onClick={handleClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
              <MdClose size={18} />
            </button>
          </div>
          <StepBar current={step} />
          <div style={{ height: 1, background: '#f1f5f9', marginTop: 16 }} />
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* ══ UPLOAD ══ */}
          {step === 'upload' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 256px', gap: 18, alignItems: 'start' }}>

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${dragging ? '#6366f1' : '#cbd5e1'}`,
                  borderRadius: 14, padding: '44px 24px',
                  textAlign: 'center', cursor: 'pointer',
                  background: dragging ? '#f0f0fe' : '#f8fafc',
                  transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minHeight: 220,
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, background: dragging ? '#eef2ff' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, transition: 'all 0.2s' }}>
                  <MdCloudUpload style={{ fontSize: 30, color: dragging ? '#6366f1' : '#94a3b8' }} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 5 }}>
                  {dragging ? 'Drop your CSV here' : 'Drag & drop your CSV file'}
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 18 }}>or click to browse</div>
                <div style={{ padding: '8px 22px', background: 'linear-gradient(135deg,#6366f1,#7c3aed)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 600, boxShadow: '0 2px 8px rgba(99,102,241,0.35)' }}>
                  Choose File
                </div>
                <div style={{ marginTop: 14, fontSize: 11, color: '#cbd5e1' }}>Accepts .csv · UTF-8 encoded</div>
                <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileInput} />
              </div>

              {/* Right panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Template download */}
                <button
                  onClick={e => { e.stopPropagation(); downloadCsv(sampleFile, columns, sampleRows) }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 9, padding: '10px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#15803d', width: '100%', boxSizing: 'border-box' }}
                >
                  <MdDownload size={16} /> Download Template
                </button>

                {/* Required columns */}
                <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: 0.6 }}>Required</span>
                    <span style={{ fontSize: 10, fontWeight: 800, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 10, padding: '1px 6px' }}>
                      {requiredCols.length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {requiredCols.map(col => <ColChip key={col.key} col={col} />)}
                  </div>
                </div>

                {/* Optional columns — collapsible */}
                {optionalCols.length > 0 && (
                  <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
                    <button
                      onClick={e => { e.stopPropagation(); setShowOptional(v => !v) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', cursor: 'pointer', padding: '11px 14px', width: '100%', textAlign: 'left' }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: 0.6 }}>Optional</span>
                      <span style={{ fontSize: 10, fontWeight: 800, background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1px 6px' }}>
                        {optionalCols.length}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#6366f1', fontWeight: 600 }}>
                        {showOptional ? '▲' : '▼'}
                      </span>
                    </button>
                    {showOptional && (
                      <div style={{ padding: '0 14px 12px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {optionalCols.map(col => <ColChip key={col.key} col={col} />)}
                      </div>
                    )}
                  </div>
                )}

                {/* Hint */}
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.65, padding: '9px 12px', background: '#fafafa', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                  💡 First row must be the header. Column names must match exactly (case-sensitive).
                </div>
              </div>
            </div>
          )}

          {/* ══ PREVIEW ══ */}
          {step === 'preview' && (
            <div>
              {/* Summary bar */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: '#16a34a' }}>
                  <MdCheckCircle size={15} /> {validRows.length} Ready
                </div>
                {invalidRows.length > 0 && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: '#dc2626' }}>
                    <MdError size={15} /> {invalidRows.length} Error{invalidRows.length > 1 ? 's' : ''}
                  </div>
                )}
                {/* Valid % bar */}
                <div style={{ flex: 1, minWidth: 80 }}>
                  <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, transition: 'width 0.4s', width: `${validPct}%`, background: validPct === 100 ? '#10b981' : 'linear-gradient(90deg,#f59e0b,#10b981)' }} />
                  </div>
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', flexShrink: 0 }}>{fileName}</span>
              </div>

              {/* Validation table — click error rows to expand */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 700, color: '#374151', width: 40 }}>#</th>
                      {previewCols.map(c => (
                        <th key={c.key} style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>{c.label}</th>
                      ))}
                      <th style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 700, color: '#374151', width: 110 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validated.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <tr
                          style={{ borderTop: '1px solid #f1f5f9', background: item.errors.length ? '#fff8f8' : '#fff', cursor: item.errors.length ? 'pointer' : 'default', transition: 'background 0.1s' }}
                          onClick={() => item.errors.length && toggleRow(idx)}
                          title={item.errors.length ? 'Click to see errors' : ''}
                        >
                          <td style={{ padding: '8px 12px', color: '#94a3b8', fontWeight: 600 }}>{item.row}</td>
                          {previewCols.map(c => (
                            <td key={c.key} style={{ padding: '8px 12px', color: '#334155', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.data[c.key] || <span style={{ color: '#cbd5e1' }}>—</span>}
                            </td>
                          ))}
                          <td style={{ padding: '8px 12px' }}>
                            {item.errors.length === 0 ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#16a34a', fontSize: 11, fontWeight: 700, background: '#f0fdf4', padding: '3px 9px', borderRadius: 6 }}>
                                <MdCheckCircle size={12} /> Ready
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#dc2626', fontSize: 11, fontWeight: 700, background: '#fef2f2', padding: '3px 9px', borderRadius: 6 }}>
                                <MdError size={12} />
                                {item.errors.length} error{item.errors.length > 1 ? 's' : ''}
                                <span style={{ fontSize: 10, opacity: 0.7 }}>{expandedRows.has(idx) ? '▲' : '▼'}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                        {item.errors.length > 0 && expandedRows.has(idx) && (
                          <tr style={{ background: '#fff0f0' }}>
                            <td colSpan={previewCols.length + 2} style={{ padding: '4px 12px 10px 44px', borderTop: '1px dashed #fecaca' }}>
                              {item.errors.map((e, ei) => (
                                <div key={ei} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, color: '#b91c1c', fontSize: 11, marginTop: 5, lineHeight: 1.4 }}>
                                  <MdError size={12} style={{ marginTop: 1, flexShrink: 0 }} /> {e}
                                </div>
                              ))}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {invalidRows.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: 12, color: '#92400e' }}>
                  <MdWarning size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>
                    {validRows.length > 0
                      ? `${invalidRows.length} row${invalidRows.length > 1 ? 's' : ''} with errors will be skipped. Only ${validRows.length} valid row${validRows.length > 1 ? 's' : ''} will be imported. Click any error row above to see details.`
                      : 'All rows have errors. Fix them and re-upload the file.'
                    }
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ══ IMPORTING ══ */}
          {step === 'importing' && (
            <div style={{ textAlign: 'center', padding: '52px 24px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
                <MdUploadFile style={{ color: '#fff', fontSize: 30 }} />
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Importing records…</div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 30 }}>Please wait while your data is being saved</div>
              <div style={{ maxWidth: 360, margin: '0 auto' }}>
                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 4, transition: 'width 0.3s', width: validRows.length ? `${(importedCount / validRows.length) * 100}%` : '8%' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
                  <span>{importedCount} saved</span>
                  <span>{validRows.length} total</span>
                </div>
              </div>
            </div>
          )}

          {/* ══ DONE ══ */}
          {step === 'done' && (
            <div>
              <div style={{ textAlign: 'center', padding: '28px 24px 20px' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: importSummary?.failureCount === 0 ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                  {importSummary?.failureCount === 0
                    ? <MdCheckCircle style={{ color: '#fff', fontSize: 34 }} />
                    : <MdWarning style={{ color: '#fff', fontSize: 34 }} />
                  }
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>
                  {importSummary?.failureCount === 0 ? 'Import Complete!' : 'Import Finished with Issues'}
                </div>
                <div style={{ display: 'inline-flex', gap: 14 }}>
                  <div style={{ textAlign: 'center', padding: '14px 32px', background: '#f0fdf4', borderRadius: 12, border: '1.5px solid #bbf7d0' }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#16a34a' }}>{importSummary?.successCount ?? 0}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 3, fontWeight: 600 }}>Imported</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '14px 32px', background: '#fef2f2', borderRadius: 12, border: '1.5px solid #fecaca' }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#dc2626' }}>{importSummary?.failureCount ?? 0}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 3, fontWeight: 600 }}>Failed</div>
                  </div>
                </div>
              </div>

              {importResults.length > 0 && (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', maxHeight: 240, overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#374151', width: 50 }}>Row</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Record</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importResults.map((r, i) => (
                        <tr key={i} style={{ borderTop: '1px solid #f1f5f9', background: r.success ? '#fff' : '#fff8f8' }}>
                          <td style={{ padding: '7px 12px', color: '#94a3b8' }}>{r.row}</td>
                          <td style={{ padding: '7px 12px', color: '#334155', fontFamily: 'monospace', fontSize: 11 }}>
                            {r.rollNumber || r.empCode || r.code || `Row ${r.row}`}
                          </td>
                          <td style={{ padding: '7px 12px' }}>
                            {r.success ? (
                              <span style={{ color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MdCheckCircle size={13} /> {r.message || 'Imported'}
                              </span>
                            ) : (
                              <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MdError size={13} /> {r.message}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#fafafa' }}>
          <button
            onClick={step === 'done' || step === 'preview' ? reset : handleClose}
            style={{ padding: '9px 18px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}
          >
            {step === 'done' ? 'Import Again' : step === 'preview' ? '← Back' : 'Cancel'}
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            {step === 'preview' && (
              <button onClick={handleClose}
                style={{ padding: '9px 18px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                Cancel
              </button>
            )}
            {step === 'preview' && validRows.length > 0 && (
              <button onClick={handleImport} disabled={importing}
                style={{ padding: '9px 24px', background: invalidRows.length === 0 ? 'linear-gradient(135deg,#6366f1,#7c3aed)' : 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                {invalidRows.length === 0
                  ? `Import ${validRows.length} Record${validRows.length !== 1 ? 's' : ''}`
                  : `Import ${validRows.length} Valid · Skip ${invalidRows.length}`}
              </button>
            )}
            {step === 'preview' && validRows.length === 0 && (
              <div style={{ padding: '9px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#dc2626' }}>
                Fix all errors before importing
              </div>
            )}
            {step === 'done' && (
              <button onClick={handleClose}
                style={{ padding: '9px 24px', background: 'linear-gradient(135deg,#6366f1,#7c3aed)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(99,102,241,0.35)' }}>
                Close
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
