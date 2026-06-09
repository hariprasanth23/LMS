import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdAdd, MdEdit, MdClose, MdBusiness, MdUploadFile, MdEmail, MdPhone, MdLocationOn, MdPeople } from 'react-icons/md'
import PageHeader from '../../components/common/PageHeader'
import CsvImportModal from '../../components/common/CsvImportModal'

const TEXT    = '#1e293b'
const MUTED   = '#64748b'
const ACCENT  = '#6366f1'
const ff      = 'system-ui, -apple-system, sans-serif'

const DEPT_COLORS = [
  ['#eef2ff','#6366f1'], ['#f0fdf4','#10b981'], ['#fffbeb','#f59e0b'],
  ['#fef2f2','#ef4444'], ['#f0f9ff','#0ea5e9'], ['#fdf4ff','#a855f7'],
]

const EMPTY = { code: '', name: '', description: '', email: '', phone: '', location: '', establishedYear: '', totalSeats: '' }

export default function Departments() {
  const { user } = useAuth()
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editDept, setEditDept] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)

  const fetchDepts = async () => {
    try {
      const res = await api.get('/departments')
      setDepartments(res.data.data || [])
    } catch { toast.error('Failed to load departments') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchDepts() }, [])

  const openAdd = () => { setEditDept(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (d) => { setEditDept(d); setForm({ code: d.code, name: d.name, description: d.description || '', email: d.email || '', phone: d.phone || '', location: d.location || '', establishedYear: d.establishedYear || '', totalSeats: d.totalSeats || '' }); setShowModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.code || !form.name) return toast.error('Code and Name are required')
    setSubmitting(true)
    try {
      if (editDept) {
        await api.put(`/departments/${editDept.id}`, form)
        toast.success('Department updated')
      } else {
        await api.post('/departments', form)
        toast.success('Department created')
      }
      setShowModal(false)
      fetchDepts()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save')
    } finally { setSubmitting(false) }
  }

  const inp = {
    width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0',
    borderRadius: 8, fontSize: 14, fontFamily: ff, color: TEXT, outline: 'none', boxSizing: 'border-box',
  }
  const lbl = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5, fontFamily: ff }

  return (
    <div style={{ fontFamily: ff }}>
      <PageHeader
        title="Departments"
        badge="Admin"
        subtitle={`${departments.length} departments configured`}
        action={
          user?.role === 'ADMIN' ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowImport(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: '#fff', color: ACCENT, border: '1.5px solid #c7d2fe', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <MdUploadFile size={16} /> Import CSV
              </button>
              <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <MdAdd size={18} /> Add Department
              </button>
            </div>
          ) : null
        }
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: MUTED }}>Loading…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {departments.map((dept, i) => {
            const [bg, color] = DEPT_COLORS[i % DEPT_COLORS.length]
            return (
              <div key={dept.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MdBusiness style={{ fontSize: 24, color }} />
                  </div>
                  {user?.role === 'ADMIN' && (
                    <button onClick={() => openEdit(dept)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, display: 'flex', padding: 4 }}>
                      <MdEdit size={18} />
                    </button>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 2 }}>{dept.name}</div>
                  <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color, background: bg, borderRadius: 4, padding: '2px 7px', marginBottom: dept.description ? 6 : 10 }}>{dept.code}</div>
                  {dept.description && <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5, marginBottom: 10 }}>{dept.description}</div>}
                  {/* Extra info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {dept.email && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: MUTED }}><MdEmail size={13} style={{ color, flexShrink: 0 }} />{dept.email}</div>}
                    {dept.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: MUTED }}><MdPhone size={13} style={{ color, flexShrink: 0 }} />{dept.phone}</div>}
                    {dept.location && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: MUTED }}><MdLocationOn size={13} style={{ color, flexShrink: 0 }} />{dept.location}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 11, color: MUTED }}>
                    {dept.establishedYear ? <span>Est. {dept.establishedYear}</span> : null}
                    {dept.totalSeats ? <span style={{ marginLeft: dept.establishedYear ? 10 : 0 }}><MdPeople size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />{dept.totalSeats} seats</span> : null}
                    {!dept.establishedYear && !dept.totalSeats ? <span>ID: <span style={{ fontFamily: 'monospace' }}>{dept.id}</span></span> : null}
                  </div>
                  <div style={{ fontSize: 11, color: MUTED, fontFamily: 'monospace' }}>#{dept.id}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>{editDept ? 'Edit Department' : 'Add Department'}</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED }}><MdClose size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Row 1: Code + Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
                <div>
                  <label style={lbl}>Code *</label>
                  <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="CSE" style={inp} required />
                </div>
                <div>
                  <label style={lbl}>Department Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Computer Science & Engineering" style={inp} required />
                </div>
              </div>

              {/* Row 2: Email + Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={lbl}>Contact Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="dept@college.edu" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Contact Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="044-XXXXXXXX" style={inp} />
                </div>
              </div>

              {/* Row 3: Location */}
              <div>
                <label style={lbl}>Location / Office</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Block A, 2nd Floor, Room 201" style={inp} />
              </div>

              {/* Row 4: Established Year + Total Seats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={lbl}>Established Year</label>
                  <input type="number" value={form.establishedYear} onChange={e => setForm({ ...form, establishedYear: e.target.value })} placeholder="e.g. 1995" min={1800} max={new Date().getFullYear()} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Total Seats / Intake</label>
                  <input type="number" value={form.totalSeats} onChange={e => setForm({ ...form, totalSeats: e.target.value })} placeholder="e.g. 120" min={1} style={inp} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={lbl}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief overview of the department" rows={2} style={{ ...inp, resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '9px 18px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={{ padding: '9px 22px', background: submitting ? '#a5b4fc' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  {submitting ? 'Saving…' : editDept ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CsvImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onDone={() => fetchDepts()}
        title="Import Departments"
        sampleFile="sample_departments.csv"
        columns={[
          { key: 'code',        label: 'Department Code', required: true },
          { key: 'name',        label: 'Department Name', required: true },
          { key: 'description', label: 'Description',     required: false },
        ]}
        sampleRows={[
          { code: 'MECH', name: 'Mechanical Engineering', description: 'Department of Mechanical Engineering' },
          { code: 'CIVIL', name: 'Civil Engineering',      description: 'Department of Civil Engineering' },
        ]}
        importFn={async (rows) => {
          const results = []
          let successCount = 0, failureCount = 0
          for (let i = 0; i < rows.length; i++) {
            const r = rows[i]
            try {
              await api.post('/departments', { code: r.code, name: r.name, description: r.description || null })
              results.push({ row: i + 2, code: r.code, success: true, message: 'Imported successfully' })
              successCount++
            } catch (e) {
              results.push({ row: i + 2, code: r.code, success: false, message: e.response?.data?.message || e.message })
              failureCount++
            }
          }
          return { successCount, failureCount, results }
        }}
      />
    </div>
  )
}
