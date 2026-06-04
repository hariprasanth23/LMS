import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { MdArrowBack, MdPerson, MdEmail, MdPhone, MdSchool } from 'react-icons/md'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

export default function StudentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, eRes] = await Promise.allSettled([
          api.get(`/students/${id}`),
          api.get(`/enrollments/student/${id}`)
        ])
        if (sRes.status === 'fulfilled') setStudent(sRes.value.data.data)
        if (eRes.status === 'fulfilled') setEnrollments(eRes.value.data.data || [])
      } catch {
        toast.error('Failed to load student details')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 40, fontFamily: 'system-ui, sans-serif', color: MUTED }}>Loading...</div>
  )

  if (!student) return (
    <div style={{ textAlign: 'center', padding: 40, fontFamily: 'system-ui, sans-serif', color: MUTED }}>Student not found</div>
  )

  const InfoRow = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ color: ACCENT, fontSize: 18 }}>{icon}</span>
      <div>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: TEXT, fontWeight: 500, marginTop: 2 }}>{value || '-'}</div>
      </div>
    </div>
  )

  return (
    <div>
      <button
        onClick={() => navigate('/students')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: MUTED, fontFamily: 'system-ui, sans-serif', fontSize: 13,
          fontWeight: 500, marginBottom: 20, padding: 0
        }}
      >
        <MdArrowBack size={18} /> Back to Students
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>
        {/* Profile Card */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 24 }}>
          <div style={{ textAlign: 'center', paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: '#eef2ff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 12px'
            }}>
              <MdPerson style={{ color: ACCENT, fontSize: 40 }} />
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>{student.name}</h2>
            <div style={{ marginTop: 6 }}>
              <span style={{
                padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                background: student.status === 'ACTIVE' ? '#f0fdf4' : '#f8fafc',
                color: student.status === 'ACTIVE' ? '#10b981' : MUTED,
                fontFamily: 'system-ui, sans-serif'
              }}>
                {student.status || 'ACTIVE'}
              </span>
            </div>
          </div>

          <div style={{ paddingTop: 8 }}>
            <InfoRow icon={<MdPerson />} label="Roll Number" value={student.rollNumber} />
            <InfoRow icon={<MdEmail />} label="Email" value={student.email} />
            <InfoRow icon={<MdPhone />} label="Phone" value={student.phone} />
            <InfoRow icon={<MdSchool />} label="Semester" value={student.semester ? `Semester ${student.semester}` : null} />
            <InfoRow icon={<MdSchool />} label="Section" value={student.section} />
          </div>
        </div>

        {/* Enrolled Courses */}
        <div>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontFamily: 'system-ui, sans-serif', fontSize: 15, fontWeight: 700, color: TEXT }}>
              Enrolled Courses
            </div>
            <div style={{ padding: 20 }}>
              {enrollments.length === 0 ? (
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED, margin: 0 }}>No enrolled courses</p>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {enrollments.map(e => (
                    <div key={e.id} style={{
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: '#eef2ff', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <MdSchool style={{ color: ACCENT, fontSize: 20 }} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, fontWeight: 600, color: TEXT }}>{e.courseName || e.courseId}</div>
                        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: MUTED, marginTop: 2 }}>
                          Enrolled: {e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : '-'}
                        </div>
                      </div>
                      <span style={{
                        marginLeft: 'auto',
                        padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: '#f0fdf4', color: '#10b981', fontFamily: 'system-ui, sans-serif'
                      }}>
                        {e.status || 'ACTIVE'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
