import React, { useState, useRef, useCallback } from 'react'
import { MdClose, MdUploadFile, MdDownload, MdCheckCircle, MdError, MdWarning, MdCloudUpload } from 'react-icons/md'

const ff = 'system-ui, -apple-system, sans-serif'

// ── Simple CSV parser ──────────────────────────────────────────────────────────
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

// ── CSV download helper ────────────────────────────────────────────────────────
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

// ── Validate a parsed row against column schema ────────────────────────────────
function validateRow(row, columns) {
  const errors = []
  columns.forEach(col => {
    const val = row[col.key]
    if (col.required && (val === undefined || val === '')) {
      errors.push(`"${col.label}" is required`)
      return
    }
    if (val && col.type === 'number' && isNaN(Number(val))) {
      errors.push(`"${col.label}" must be a number`)
    }
    if (val && col.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      errors.push(`"${col.label}" must be a valid email`)
    }
    if (val && col.type === 'date' && isNaN(Date.parse(val))) {
      errors.push(`"${col.label}" must be a valid date (YYYY-MM-DD)`)
    }
    if (val && col.min != null && Number(val) < col.min) {
      errors.push(`"${col.label}" must be ≥ ${col.min}`)
    }
    if (val && col.max != null && Number(val) > col.max) {
      errors.push(`"${col.label}" must be ≤ ${col.max}`)
    }
    if (val && col.enum && !col.enum.includes(val.toUpperCase())) {
      errors.push(`"${col.label}" must be one of: ${col.enum.join(', ')}`)
    }
    if (col.validate) {
      const err = col.validate(val, row)
      if (err) errors.push(err)
    }
  })
  return errors
}

// ── Main component ─────────────────────────────────────────────────────────────
/**
 * Props:
 *   isOpen        boolean
 *   onClose       () => void
 *   onDone        (results) => void   called after import completes
 *   title         string              e.g. "Import Students"
 *   columns       Array<{key, label, required?, type?, min?, max?, enum?, validate?}>
 *   sampleRows    Array<object>       2-3 sample rows for the downloadable template
 *   sampleFile    string              filename for the sample CSV
 *   importFn      async (validRows) => { successCount, failureCount, results[] }
 *                 results[] = [{row, success, message}]
 */
export default function CsvImportModal({
  isOpen, onClose, onDone,
  title = 'Import Data',
  columns = [],
  sampleRows = [],
  sampleFile = 'sample.csv',
  importFn,
}) {
  const [step, setStep] = useState('upload')   // upload | preview | importing | done
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [validated, setValidated] = useState([])   // [{row, data, errors}]
  const [importResults, setImportResults] = useState([])
  const [importSummary, setImportSummary] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importedCount, setImportedCount] = useState(0)
  const fileRef = useRef()

  const reset = () => {
    setStep('upload'); setFileName(''); setValidated([])
    setImportResults([]); setImportSummary(null); setImporting(false); setImportedCount(0)
  }

  const handleClose = () => { reset(); onClose() }

  const processFile = useCallback((file) => {
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const { rows } = parseCsv(e.target.result)
      const results = rows.map(row => ({
        row: row._row,
        data: row,
        errors: validateRow(row, columns),
      }))
      setValidated(results)
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

  const validRows   = validated.filter(r => r.errors.length === 0)
  const invalidRows = validated.filter(r => r.errors.length > 0)

  const handleImport = async () => {
    if (!importFn || validRows.length === 0) return
    setImporting(true)
    setStep('importing')
    setImportedCount(0)

    try {
      const result = await importFn(validRows.map(r => r.data), (n) => setImportedCount(n))
      setImportSummary(result)
      setImportResults(result.results || [])
      setStep('done')
      if (onDone) onDone(result)
    } catch (err) {
      setImportSummary({ successCount: 0, failureCount: validRows.length, error: err.message })
      setStep('done')
    } finally {
      setImporting(false)
    }
  }

  if (!isOpen) return null

  const overlay = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999, padding: 16, fontFamily: ff,
  }
  const modal = {
    background: '#fff', borderRadius: 16,
    width: '100%', maxWidth: 820,
    maxHeight: '90vh', display: 'flex', flexDirection: 'column',
    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
    overflow: 'hidden',
  }

  return (
    <div style={overlay} onClick={e => { if (e.target === e.currentTarget) handleClose() }}>
      <div style={modal}>

        {/* ── Header ── */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdUploadFile style={{ color: '#fff', fontSize: 20 }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{title}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                {step === 'upload'    && 'Upload a CSV file to import records'}
                {step === 'preview'   && `${validated.length} rows parsed — ${validRows.length} valid, ${invalidRows.length} with errors`}
                {step === 'importing' && `Importing ${validRows.length} records…`}
                {step === 'done'      && `Import complete — ${importSummary?.successCount ?? 0} succeeded, ${importSummary?.failureCount ?? 0} failed`}
              </div>
            </div>
          </div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 4 }}>
            <MdClose size={22} />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* UPLOAD STATE */}
          {step === 'upload' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${dragging ? '#6366f1' : '#cbd5e1'}`,
                  borderRadius: 12, padding: '48px 24px',
                  textAlign: 'center', cursor: 'pointer',
                  background: dragging ? '#f0f0fe' : '#f8fafc',
                  transition: 'all 0.2s',
                }}
              >
                <MdCloudUpload style={{ fontSize: 48, color: dragging ? '#6366f1' : '#94a3b8', marginBottom: 12 }} />
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>
                  {dragging ? 'Drop your CSV here' : 'Drag & drop your CSV file'}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>or click to browse</div>
                <div style={{ display: 'inline-block', padding: '8px 20px', background: '#6366f1', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                  Choose File
                </div>
                <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileInput} />
              </div>

              {/* Column reference + sample download */}
              <div>
                <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Required Columns
                  </div>
                  <button
                    onClick={() => downloadCsv(sampleFile, columns, sampleRows)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#16a34a' }}
                  >
                    <MdDownload size={14} /> Sample CSV
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {columns.map(col => (
                    <div key={col.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#f8fafc', borderRadius: 6, border: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 12, color: '#334155', fontFamily: 'monospace' }}>{col.key}</span>
                      {col.required
                        ? <span style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, padding: '1px 5px' }}>required</span>
                        : <span style={{ fontSize: 10, color: '#94a3b8' }}>optional</span>
                      }
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>
                  First row must be the header. UTF-8 encoded CSV only.
                </div>
              </div>
            </div>
          )}

          {/* PREVIEW STATE */}
          {step === 'preview' && (
            <div>
              {/* Summary chips */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: '#16a34a' }}>
                  <MdCheckCircle size={16} /> {validRows.length} Valid
                </div>
                {invalidRows.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: '#dc2626' }}>
                    <MdError size={16} /> {invalidRows.length} Errors
                  </div>
                )}
                <div style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  File: <span style={{ fontFamily: 'monospace', marginLeft: 4 }}>{fileName}</span>
                </div>
              </div>

              {/* Validation table */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#374151', width: 50 }}>#</th>
                      {columns.slice(0, 4).map(c => (
                        <th key={c.key} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#374151', maxWidth: 140 }}>{c.label}</th>
                      ))}
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validated.map((item, idx) => (
                      <tr key={idx} style={{ borderTop: '1px solid #f1f5f9', background: item.errors.length ? '#fff8f8' : '#fff' }}>
                        <td style={{ padding: '8px 12px', color: '#64748b' }}>{item.row}</td>
                        {columns.slice(0, 4).map(c => (
                          <td key={c.key} style={{ padding: '8px 12px', color: '#334155', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.data[c.key] || <span style={{ color: '#cbd5e1' }}>—</span>}
                          </td>
                        ))}
                        <td style={{ padding: '8px 12px' }}>
                          {item.errors.length === 0 ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#16a34a', fontSize: 11, fontWeight: 600 }}>
                              <MdCheckCircle size={13} /> Ready
                            </span>
                          ) : (
                            <div>
                              {item.errors.map((e, ei) => (
                                <div key={ei} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, color: '#dc2626', fontSize: 11 }}>
                                  <MdError size={12} style={{ marginTop: 1, flexShrink: 0 }} /> {e}
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {invalidRows.length > 0 && validRows.length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: 12, color: '#92400e' }}>
                  <MdWarning size={16} style={{ flexShrink: 0 }} />
                  Rows with errors will be skipped. Only {validRows.length} valid row{validRows.length !== 1 ? 's' : ''} will be imported.
                </div>
              )}
            </div>
          )}

          {/* IMPORTING STATE */}
          {step === 'importing' && (
            <div style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <MdUploadFile style={{ color: '#fff', fontSize: 26 }} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Importing records…</div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Please wait while we save your data</div>
              <div style={{ maxWidth: 320, margin: '0 auto' }}>
                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 4, transition: 'width 0.3s', width: validRows.length ? `${(importedCount / validRows.length) * 100}%` : '10%', animation: 'pulse 1.5s infinite' }} />
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>{importedCount} / {validRows.length}</div>
              </div>
            </div>
          )}

          {/* DONE STATE */}
          {step === 'done' && (
            <div>
              <div style={{ textAlign: 'center', padding: '24px 24px 16px' }}>
                {importSummary?.failureCount === 0 ? (
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <MdCheckCircle style={{ color: '#16a34a', fontSize: 32 }} />
                  </div>
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <MdWarning style={{ color: '#d97706', fontSize: 32 }} />
                  </div>
                )}
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                  {importSummary?.failureCount === 0 ? 'Import Successful!' : 'Import Completed with Issues'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
                  <div style={{ textAlign: 'center', padding: '10px 20px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#16a34a' }}>{importSummary?.successCount ?? 0}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Imported</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '10px 20px', background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#dc2626' }}>{importSummary?.failureCount ?? 0}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Failed</div>
                  </div>
                </div>
              </div>

              {importResults.length > 0 && (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', maxHeight: 260, overflowY: 'auto' }}>
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
                          <td style={{ padding: '7px 12px', color: '#64748b' }}>{r.row}</td>
                          <td style={{ padding: '7px 12px', color: '#334155', fontFamily: 'monospace', fontSize: 11 }}>
                            {r.rollNumber || r.empCode || r.code || `Row ${r.row}`}
                          </td>
                          <td style={{ padding: '7px 12px' }}>
                            {r.success ? (
                              <span style={{ color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MdCheckCircle size={13} /> {r.message || 'Success'}
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
          <button onClick={step === 'done' || step === 'preview' ? reset : handleClose}
            style={{ padding: '9px 18px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
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
                style={{ padding: '9px 22px', background: invalidRows.length === 0 ? '#6366f1' : '#f59e0b', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                {invalidRows.length === 0
                  ? `Import ${validRows.length} Record${validRows.length !== 1 ? 's' : ''}`
                  : `Import ${validRows.length} Valid (skip ${invalidRows.length} errors)`}
              </button>
            )}
            {step === 'preview' && validRows.length === 0 && (
              <div style={{ padding: '9px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#dc2626' }}>
                Fix all errors before importing
              </div>
            )}
            {step === 'done' && (
              <button onClick={handleClose}
                style={{ padding: '9px 22px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
