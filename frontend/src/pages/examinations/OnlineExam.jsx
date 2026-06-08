import React, { useState, useEffect } from 'react'
import api from '../../services/api'

const TEXT = '#1e293b'
const MUTED = '#64748b'
const ACCENT = '#6366f1'
const BG = '#f8fafc'

const navItems = ['Comprehensive Exam', 'Question Preview', 'Exam Information']

function SectionCard({ children }) {
  return <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>{children}</div>
}
function SectionHeader({ title }) {
  return <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}><span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{title}</span></div>
}

function ComprehensiveExamSection() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/examination/online-exam/scheduled')
      .then(r => setExams(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const sysReqs = [
    { label: 'Browser: Chrome 120+', ok: true },
    { label: 'Camera: Connected', ok: true },
    { label: 'Microphone: Connected', ok: true },
    { label: 'Internet: Stable', ok: true },
  ]

  const exam = exams[0] || null
  const examStarted = false

  const daysUntil = exam?.examDate
    ? Math.max(0, Math.ceil((new Date(exam.examDate) - new Date()) / 86400000))
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionCard>
        <SectionHeader title="Scheduled Comprehensive Exam" />
        <div style={{ padding: 20 }}>
          {loading ? (
            <div style={{ color: '#64748b', fontSize: 14 }}>Loading…</div>
          ) : !exam ? (
            <div style={{ color: '#64748b', fontSize: 14 }}>No online exams scheduled at this time.</div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                {[
                  { label: 'Subject Code',  value: exam.subjectCode },
                  { label: 'Subject Name',  value: exam.subjectName },
                  { label: 'Date',          value: exam.examDate },
                  { label: 'Time',          value: exam.timeSlot },
                  { label: 'Duration',      value: `${exam.durationMinutes} Minutes` },
                  { label: 'Max Marks',     value: String(exam.maxMarks) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: BG, borderRadius: 8, padding: '12px 16px' }}>
                    <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px 18px', background: '#eff6ff', borderRadius: 10, borderLeft: '4px solid #3b82f6', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#1d4ed8', fontWeight: 500 }}>Exam starts in:</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#1d4ed8', fontFamily: 'monospace' }}>{daysUntil} day{daysUntil !== 1 ? 's' : ''}</span>
              </div>
              <button disabled={!examStarted} style={{
                width: '100%', padding: '14px', fontSize: 15, fontWeight: 700,
                background: examStarted ? '#16a34a' : '#d1d5db',
                color: '#fff', border: 'none', borderRadius: 10,
                cursor: examStarted ? 'pointer' : 'not-allowed', letterSpacing: 0.5,
              }}>
                {examStarted ? '▶ Join Exam Now' : '🔒 Exam Not Started Yet'}
              </button>
              {!examStarted && (
                <p style={{ fontSize: 12, color: MUTED, textAlign: 'center', marginTop: 8 }}>The "Join Exam" button will activate 10 minutes before the scheduled time.</p>
              )}
            </>
          )}
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader title="System Requirements Check" />
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sysReqs.map((req, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: req.ok ? '#f0fdf4' : '#fef2f2', borderRadius: 8 }}>
              <span style={{ fontSize: 18 }}>{req.ok ? '✅' : '❌'}</span>
              <span style={{ fontSize: 14, fontWeight: req.ok ? 600 : 400, color: req.ok ? '#15803d' : '#dc2626' }}>{req.label}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function QuestionPreviewSection() {
  const [selectedAnswers, setSelectedAnswers] = useState({})

  const questions = [
    {
      q: 'What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?',
      opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correct: 1,
    },
    {
      q: 'Which data structure uses LIFO (Last In First Out) order?',
      opts: ['Queue', 'Linked List', 'Stack', 'Heap'],
      correct: 2,
    },
    {
      q: 'Which sorting algorithm has the best average-case time complexity?',
      opts: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'],
      correct: 2,
    },
    {
      q: 'In a Min-Heap, the root element is always:',
      opts: ['The largest element', 'The median element', 'The smallest element', 'A random element'],
      correct: 2,
    },
    {
      q: 'Which traversal of a Binary Tree visits: Left subtree → Root → Right subtree?',
      opts: ['Pre-order', 'Post-order', 'Level-order', 'In-order'],
      correct: 3,
    },
  ]

  return (
    <SectionCard>
      <SectionHeader title="CS6001 - Data Structures | Sample Questions" />
      <div style={{ padding: '12px 20px', background: '#fef9c3', borderBottom: '1px solid #fde047', fontSize: 13, color: '#854d0e', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>⚠</span>
        <span><strong>Note:</strong> These are sample questions for practice only. Actual exam questions will differ.</span>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {questions.map((q, qi) => (
          <div key={qi} style={{ background: BG, borderRadius: 10, padding: '16px 18px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 8 }}>Question {qi + 1}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 14, lineHeight: 1.6 }}>{q.q}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.opts.map((opt, oi) => {
                const letter = ['A', 'B', 'C', 'D'][oi]
                return (
                  <div key={oi} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px', borderRadius: 8,
                    background: '#fff', border: '1px solid #e2e8f0',
                    fontSize: 13, color: TEXT,
                  }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: MUTED, flexShrink: 0 }}>{letter}</span>
                    {opt}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function ExamInformationSection() {
  const infoSections = [
    {
      icon: '📋',
      title: 'Eligibility Criteria',
      color: '#eff6ff',
      borderColor: '#3b82f6',
      points: [
        'Must have minimum 75% attendance in the subject.',
        'No pending dues or library fines.',
        'Must be registered for the course in the current semester.',
        'No disciplinary actions during the semester.',
      ]
    },
    {
      icon: '💻',
      title: 'Technical Requirements',
      color: '#f0fdf4',
      borderColor: '#22c55e',
      points: [
        'Desktop or Laptop with updated Google Chrome (v120+).',
        'Stable internet connection (minimum 2 Mbps).',
        'Functioning webcam and microphone.',
        'No VPN or proxy connections during the exam.',
      ]
    },
    {
      icon: '📏',
      title: 'Exam Rules',
      color: '#fef9c3',
      borderColor: '#f59e0b',
      points: [
        'No other tabs or applications should be open during the exam.',
        'Screen sharing will be monitored by the invigilator.',
        'Switching browser tabs will be flagged as malpractice.',
        'Exam auto-submits when time expires.',
      ]
    },
    {
      icon: '🕐',
      title: 'Before the Exam',
      color: '#faf5ff',
      borderColor: '#a855f7',
      points: [
        'Log in to the portal 15 minutes before the exam starts.',
        'Complete the system check (camera, mic, internet).',
        'Keep your Hall Ticket and ID card visible.',
        'Ensure a quiet, well-lit environment.',
      ]
    },
    {
      icon: '✍️',
      title: 'During the Exam',
      color: '#fff7ed',
      borderColor: '#f97316',
      points: [
        'Stay on the exam tab at all times.',
        'Do not communicate with anyone during the exam.',
        'If you face a technical issue, raise a hand / contact support via chat.',
        'Review your answers before submitting.',
      ]
    },
    {
      icon: '✅',
      title: 'After the Exam',
      color: '#f0fdfa',
      borderColor: '#14b8a6',
      points: [
        'Download the submission confirmation receipt.',
        'Results will be published within 5 working days.',
        'Contact the exam coordinator for any discrepancies.',
        'Retain your submission receipt until results are declared.',
      ]
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {infoSections.map((sec, i) => (
        <div key={i} style={{ background: sec.color, borderRadius: 10, borderLeft: `4px solid ${sec.borderColor}`, padding: '16px 18px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{sec.icon}</span>
            <span>{sec.title}</span>
          </div>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {sec.points.map((pt, pi) => (
              <li key={pi} style={{ fontSize: 13, color: TEXT, lineHeight: 1.7, marginBottom: 2 }}>{pt}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

const sectionComponents = {
  'Comprehensive Exam': ComprehensiveExamSection,
  'Question Preview': QuestionPreviewSection,
  'Exam Information': ExamInformationSection,
}

export default function OnlineExam() {
  const [active, setActive] = useState('Comprehensive Exam')
  const ActiveSection = sectionComponents[active]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: TEXT }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: TEXT }}>Examinations — Online Examinations</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: MUTED }}>Comprehensive exams, question previews and exam information</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', minHeight: 500 }}>
        {/* Left nav */}
        <div style={{ width: 210, borderRight: '1px solid #e2e8f0', padding: '12px 0', flexShrink: 0 }}>
          {navItems.map(item => {
            const isActive = active === item
            return (
              <button
                key={item}
                onClick={() => setActive(item)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 18px',
                  background: isActive ? '#eef2ff' : 'transparent',
                  color: isActive ? ACCENT : TEXT,
                  borderLeft: isActive ? `3px solid ${ACCENT}` : '3px solid transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 13,
                  border: 'none',
                  cursor: 'pointer',
                  lineHeight: 1.4,
                }}
              >
                {item}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 28, background: BG, overflowX: 'auto' }}>
          {ActiveSection ? <ActiveSection /> : null}
        </div>
      </div>
    </div>
  )
}
