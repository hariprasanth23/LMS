import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import LandingPage from './pages/landing/LandingPage'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Students from './pages/student/Students'
import StudentDetail from './pages/student/StudentDetail'
import Courses from './pages/lms/Courses'
import CourseDetail from './pages/lms/CourseDetail'
import Assignments from './pages/lms/Assignments'
import Employees from './pages/employee/Employees'
import Attendance from './pages/attendance/Attendance'
import Leaves from './pages/leave/Leaves'
import Payroll from './pages/payroll/Payroll'
import Profile from './pages/profile/Profile'

import AcademicsGeneral from './pages/academics/AcademicsGeneral'
import CourseRegistration from './pages/academics/CourseRegistration'
import ProjectProposal from './pages/academics/ProjectProposal'

import ExamGeneral from './pages/examinations/ExamGeneral'
import ArrearExam from './pages/examinations/ArrearExam'
import OnlineExam from './pages/examinations/OnlineExam'
import MakeupExam from './pages/examinations/MakeupExam'

import OnlinePayments from './pages/finance/OnlinePayments'

import ServicesGeneral from './pages/services/ServicesGeneral'
import MyInfo from './pages/services/MyInfo'
import MyAccount from './pages/services/MyAccount'
import Bonafide from './pages/services/Bonafide'
import Library from './pages/services/Library'
import InfoCorner from './pages/services/InfoCorner'

import ResearchGeneral from './pages/research/ResearchGeneral'

import FeedbackGeneral from './pages/feedback/FeedbackGeneral'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
        <div style={{ color: '#6366f1', fontSize: 18, fontFamily: 'system-ui, sans-serif' }}>Loading...</div>
      </div>
    )
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function LandingOrDashboard() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<LandingOrDashboard />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="employees" element={<Employees />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leaves" element={<Leaves />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="profile" element={<Profile />} />

        <Route path="academics/general" element={<AcademicsGeneral />} />
        <Route path="academics/course-registration" element={<CourseRegistration />} />
        <Route path="academics/project-proposal" element={<ProjectProposal />} />

        <Route path="examinations/general" element={<ExamGeneral />} />
        <Route path="examinations/arrear" element={<ArrearExam />} />
        <Route path="examinations/online" element={<OnlineExam />} />
        <Route path="examinations/makeup" element={<MakeupExam />} />

        <Route path="finance/payments" element={<OnlinePayments />} />

        <Route path="services/general" element={<ServicesGeneral />} />
        <Route path="services/my-info" element={<MyInfo />} />
        <Route path="services/my-account" element={<MyAccount />} />
        <Route path="services/bonafide" element={<Bonafide />} />
        <Route path="services/library" element={<Library />} />
        <Route path="services/info-corner" element={<InfoCorner />} />

        <Route path="research/general" element={<ResearchGeneral />} />

        <Route path="feedback/general" element={<FeedbackGeneral />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
