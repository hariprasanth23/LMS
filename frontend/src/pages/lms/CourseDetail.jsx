import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdArrowBack, MdBook, MdAssignment, MdPeople, MdCampaign, MdQuiz, MdAdd } from 'react-icons/md'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [activeTab, setActiveTab] = useState('materials')
  const [data, setData] = useState({ materials: [], assignments: [], quizzes: [], students: [], announcements: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cRes, mRes, aRes, qRes, anRes] = await Promise.allSettled([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/materials`),
          api.get(`/courses/${id}/assignments`),
          api.get(`/courses/${id}/quizzes`),
          api.get(`/courses/${id}/announcements`)
        ])
        if (cRes.status === 'fulfilled') setCourse(cRes.value.data.data)
        setData({
          materials: mRes.status === 'fulfilled' ? (mRes.value.data.data || []) : [],
          assignments: aRes.status === 'fulfilled' ? (aRes.value.data.data || []) : [],
          quizzes: qRes.status === 'fulfilled' ? (qRes.value.data.data || []) : [],
          students: [],
          announcements: anRes.status === 'fulfilled' ? (anRes.value.data.data || []) : []
        })
      } catch {
        toast.error('Failed to load course details')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  const tabs = [
    { key: 'materials', label: 'Materials', icon: <MdBook /> },
    { key: 'assignments', label: 'Assignments', icon: <MdAssignment /> },
    { key: 'quizzes', label: 'Quizzes', icon: <MdQuiz /> },
    { key: 'students', label: 'Students', icon: <MdPeople /> },
    { key: 'announcements', label: 'Announcements', icon: <MdCampaign /> }
  ]

  if (loading) return <div style={{ textAlign: 'center', padding: 40, fontFamily: 'system-ui, sans-serif', color: MUTED }}>Loading...</div>
  if (!course) return <div style={{ textAlign: 'center', padding: 40, fontFamily: 'system-ui, sans-serif', color: MUTED }}>Course not found</div>

  const renderContent = () => {
    const items = data[activeTab]
    if (items.length === 0) {
      return <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', fontSize: 13, color: MUTED }}>No {activeTab} available yet.</div>
    }
    return (
      <div style={{ padding: 20, display: 'grid', gap: 10 }}>
        {items.map((item) => (
          <div key={item.id} style={{
            padding: '14px 18px', border: '1px solid #e2e8f0',
            borderRadius: 10, background: '#fafbff',
            fontFamily: 'system-ui, sans-serif'
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{item.title || item.name || item.subject || 'Item'}</div>
            {(item.description || item.content) && (
              <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{item.description || item.content}</div>
            )}
            {item.dueDate && <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 4 }}>Due: {item.dueDate}</div>}
            {item.createdAt && (
              <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate('/courses')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontFamily: 'system-ui, sans-serif', fontSize: 13, fontWeight: 500, marginBottom: 20, padding: 0 }}
      >
        <MdArrowBack size={18} /> Back to Courses
      </button>

      {/* Header card */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MdBook style={{ color: ACCENT, fontSize: 28 }} />
          </div>
          <div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 0.5, textTransform: 'uppercase' }}>{course.courseCode}</div>
            <h1 style={{ margin: '4px 0 6px', fontSize: 20, fontWeight: 700, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>{course.title}</h1>
            <p style={{ margin: 0, fontSize: 13, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>{course.description || 'No description available'}</p>
            {course.credits && (
              <div style={{ marginTop: 8, fontSize: 12, color: MUTED, fontFamily: 'system-ui, sans-serif' }}>
                {course.credits} Credits &bull; Semester {course.semester || '-'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '14px 20px', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
                fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 500,
                color: activeTab === tab.key ? ACCENT : MUTED,
                borderBottom: activeTab === tab.key ? `2px solid ${ACCENT}` : '2px solid transparent',
                whiteSpace: 'nowrap', transition: 'color 0.15s'
              }}
            >
              {tab.icon} {tab.label}
              {data[tab.key]?.length > 0 && (
                <span style={{
                  background: activeTab === tab.key ? ACCENT : '#f1f5f9',
                  color: activeTab === tab.key ? '#fff' : MUTED,
                  borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 700
                }}>
                  {data[tab.key].length}
                </span>
              )}
            </button>
          ))}
        </div>
        {renderContent()}
      </div>
    </div>
  )
}
