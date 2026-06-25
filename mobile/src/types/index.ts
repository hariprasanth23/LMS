// Shared API + domain types.

export type Role = 'ADMIN' | 'FACULTY' | 'STUDENT' | 'STAFF' | 'PARENT' | 'ALUMNI'
export type PortalKey = 'STUDENT' | 'FACULTY' | 'PARENT'

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
  code?: string
  timestamp?: string
  pageMeta?: SpringPageMeta
}

export type SpringPageMeta = {
  pageable?: { pageNumber: number; pageSize: number }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  size: number
  number: number
  numberOfElements: number
  empty: boolean
}

export type User = {
  id: string
  name: string
  email: string
  phone?: string
  role: Role
  active: boolean
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  expiresInSeconds: number
  user: User
}

// ── Domain ─────────────────────────────────────────────────────────────────

export type Department = {
  id: number
  code: string
  name: string
  description?: string
  email?: string
  totalSeats?: number
}

export type Course = {
  id: string
  code: string
  name: string
  description?: string
  credits?: number
  semester?: number
  departmentId?: number
  facultyId?: string
  status: string
}

export type Student = {
  id: string
  userId: string
  rollNumber: string
  departmentId: number
  program: string
  semester: number
  section?: string
  batch: string
  admissionYear: number
  status: string
}

export type Employee = {
  id: string
  userId: string
  empCode: string
  name: string
  email: string
  phone?: string
  departmentId: number
  designation?: string
  employeeType: string
  status: string
}

export type AttendanceRecord = {
  id: string
  studentId: string
  courseId?: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
}

export type LeaveBalance = {
  employeeId: string
  leaveType: 'CL' | 'SL' | 'EL' | 'ML' | 'COL'
  totalDays: number
  usedDays: number
  balance: number
  year: number
}

export type Announcement = {
  id: string
  title: string
  body: string
  audience?: string
  createdAt: string
}
