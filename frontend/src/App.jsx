import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import LandingPage from './pages/landing/LandingPage'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
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

import FacultyResearchGeneral from './pages/faculty/research/FacultyResearchGeneral'
import FacultyCourseworkAllocation from './pages/faculty/research/FacultyCourseworkAllocation'

import FacultyFeedbackGeneral from './pages/faculty/feedback/FacultyFeedbackGeneral'

import FacultyServicesGeneral from './pages/faculty/services/FacultyServicesGeneral'
import FacultyMyAccount from './pages/faculty/services/FacultyMyAccount'
import FacultyBiometricInfo from './pages/faculty/services/FacultyBiometricInfo'
import FacultyLibrary from './pages/faculty/services/FacultyLibrary'
import FacultyFinance from './pages/faculty/services/FacultyFinance'
import FacultyInfoCorner from './pages/faculty/services/FacultyInfoCorner'
import FacultyPhysicalEducation from './pages/faculty/services/FacultyPhysicalEducation'
import FacultyInternationalRelations from './pages/faculty/services/FacultyInternationalRelations'

import FacultyHRGeneral from './pages/faculty/hr/FacultyHRGeneral'

import FacultyTLCEFDP from './pages/faculty/events/FacultyTLCEFDP'
import FacultyEventPreProposal from './pages/faculty/events/FacultyEventPreProposal'
import FacultySWEvents from './pages/faculty/events/FacultySWEvents'

import FacultyProctorGeneral from './pages/faculty/proctor/FacultyProctorGeneral'
import FacultyProctorMedical from './pages/faculty/proctor/FacultyProctorMedical'
import FacultyProctorStudents from './pages/faculty/proctor/FacultyProctorStudents'

import FacultyExamGeneral from './pages/faculty/examinations/FacultyExamGeneral'
import FacultyEvaluations from './pages/faculty/examinations/FacultyEvaluations'
import FacultyQuestionPaper from './pages/faculty/examinations/FacultyQuestionPaper'
import FacultyInvigilation from './pages/faculty/examinations/FacultyInvigilation'

import FacultyAcademicsGeneral from './pages/faculty/academics/FacultyAcademicsGeneral'
import FacultyOutcomeSetConference from './pages/faculty/academics/FacultyOutcomeSetConference'
import FacultySETConference from './pages/faculty/academics/FacultySETConference'
import FacultyCourse from './pages/faculty/academics/FacultyCourse'
import FacultyAttendance from './pages/faculty/academics/FacultyAttendance'
import FacultyCouncil from './pages/faculty/academics/FacultyCouncil'
import FacultyQCMeeting from './pages/faculty/academics/FacultyQCMeeting'
import FacultyOutcomeCoursePlan from './pages/faculty/academics/FacultyOutcomeCoursePlan'
import FacultyExtraCurricular from './pages/faculty/academics/FacultyExtraCurricular'
import FacultyProjectRegistration from './pages/faculty/academics/FacultyProjectRegistration'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
        <div style={{ color: '#6366f1', fontSize: 18, fontFamily: 'system-ui, sans-serif' }}>Loading...</div>
      </div>
    )
  }
  return isAuthenticated ? children : <Navigate to="/auth/login" replace />
}

function LandingOrDashboard() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
}

function CatchAll() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<LandingOrDashboard />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
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

        <Route path="faculty/research/general" element={<FacultyResearchGeneral />} />
        <Route path="faculty/research/coursework-allocation" element={<FacultyCourseworkAllocation />} />

        <Route path="faculty/feedback/general" element={<FacultyFeedbackGeneral />} />

        <Route path="faculty/services/general" element={<FacultyServicesGeneral />} />
        <Route path="faculty/services/my-account" element={<FacultyMyAccount />} />
        <Route path="faculty/services/biometric-info" element={<FacultyBiometricInfo />} />
        <Route path="faculty/services/library" element={<FacultyLibrary />} />
        <Route path="faculty/services/finance" element={<FacultyFinance />} />
        <Route path="faculty/services/info-corner" element={<FacultyInfoCorner />} />
        <Route path="faculty/services/physical-education" element={<FacultyPhysicalEducation />} />
        <Route path="faculty/services/international-relations" element={<FacultyInternationalRelations />} />

        <Route path="faculty/hr/general" element={<FacultyHRGeneral />} />

        <Route path="faculty/events/tlce-fdp" element={<FacultyTLCEFDP />} />
        <Route path="faculty/events/pre-proposal" element={<FacultyEventPreProposal />} />
        <Route path="faculty/events/sw-events" element={<FacultySWEvents />} />

        <Route path="faculty/proctor/general" element={<FacultyProctorGeneral />} />
        <Route path="faculty/proctor/medical-info" element={<FacultyProctorMedical />} />
        <Route path="faculty/proctor/students-info" element={<FacultyProctorStudents />} />

        <Route path="faculty/examinations/general" element={<FacultyExamGeneral />} />
        <Route path="faculty/examinations/evaluations" element={<FacultyEvaluations />} />
        <Route path="faculty/examinations/question-paper" element={<FacultyQuestionPaper />} />
        <Route path="faculty/examinations/invigilation" element={<FacultyInvigilation />} />

        <Route path="faculty/academics/general" element={<FacultyAcademicsGeneral />} />
        <Route path="faculty/academics/outcome-set-conference" element={<FacultyOutcomeSetConference />} />
        <Route path="faculty/academics/set-conference" element={<FacultySETConference />} />
        <Route path="faculty/academics/course" element={<FacultyCourse />} />
        <Route path="faculty/academics/attendance" element={<FacultyAttendance />} />
        <Route path="faculty/academics/council" element={<FacultyCouncil />} />
        <Route path="faculty/academics/qc-meeting" element={<FacultyQCMeeting />} />
        <Route path="faculty/academics/outcome-course-plan" element={<FacultyOutcomeCoursePlan />} />
        <Route path="faculty/academics/extra-curricular" element={<FacultyExtraCurricular />} />
        <Route path="faculty/academics/project-registration" element={<FacultyProjectRegistration />} />
      </Route>
      <Route path="*" element={<CatchAll />} />
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
