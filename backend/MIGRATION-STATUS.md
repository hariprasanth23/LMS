# Migration Status — Monolith → Backend Microservices

Snapshot of where each domain stands in the strangler-fig migration.

| State | Meaning |
|---|---|
| ✅ **Migrated** | Endpoints removed from monolith; backend service is the source of truth. |
| 🟡 **Scaffolded** | Backend service compiles + answers `/api/_health/<svc>` + returns HTTP 501 for business endpoints. Monolith **still owns** the routes. |
| ❌ **Not started** | No backend service exists. |

---

## Service-by-service

### ✅ auth-service — **MIGRATED**

| Routes | Owner |
|---|---|
| `POST   /api/auth/login`            | backend/auth-service |
| `POST   /api/auth/register`         | backend/auth-service |
| `POST   /api/auth/refresh`          | backend/auth-service |
| `POST   /api/auth/logout`           | backend/auth-service |
| `GET    /api/auth/me`               | backend/auth-service |
| `PUT    /api/auth/profile`          | backend/auth-service |
| `PUT    /api/auth/change-password`  | backend/auth-service |
| `PUT    /api/auth/update-mobile`    | backend/auth-service (TODO: not yet implemented in v2) |
| `GET    /api/auth/admin/users`            | backend/auth-service |
| `PUT    /api/auth/admin/users/{id}/role`  | backend/auth-service |
| `PUT    /api/auth/admin/users/{id}/deactivate` | backend/auth-service |

Removed from monolith: `controller/AuthController`, `service/AuthService(Impl)`,
`service/RefreshTokenCleanupService`, `model/RefreshToken`, `repository/RefreshTokenRepository`,
`dto/{request,response}/*`, `common/config/LoginRateLimitFilter`, the matching tests.

**Kept in monolith** because the data model is referenced by every other
domain via FK `user_id`: `model/User`, `repository/UserRepository`,
`security/{JwtAuthFilter, JwtUtil, UserDetailsServiceImpl}`. JwtAuthFilter
continues to validate tokens — the v2 auth-service signs with the SAME
`JWT_SECRET` env so its tokens validate on the monolith too.

---

### 🟡 user-service — SCAFFOLDED

Monolith still owns these — implement here next.

| Source controller (monolith) | Endpoints |
|---|---|
| `student/StudentController` | `/api/students/**` (10 endpoints) |
| `student/DepartmentController` | `/api/departments/**` (5) |
| `student/EnrollmentController` | `/api/enrollments/**` (3) |
| `employee/EmployeeController` | `/api/employees/**` (8) |

**Migration prereqs:**
- Implement entities + repos for Student, Department, Employee, EnrollmentLink
- CSV-import endpoint (the monolith one is `POST /api/students/import` / `POST /api/employees/import`)
- Feign client for auth-service `/api/auth/me` to resolve user info

### 🟡 course-service — SCAFFOLDED

| Monolith controller | Endpoints |
|---|---|
| `lms/CourseController` | `/api/courses/**` (8) |
| `lms/AssignmentController` | `/api/courses/{id}/assignments/**`, `/api/assignments/**` (5) |
| `lms/QuizController` | `/api/quizzes/**` (8) |
| `lms/AnnouncementController` | `/api/announcements/**` (4) |

### 🟡 examination-service — SCAFFOLDED

| Monolith controller | Endpoints |
|---|---|
| `examination/ExaminationController` | `/api/examination/**` (5) |
| `examination/ArrearController` | `/api/examination/arrear/**` (5) |
| `examination/MakeupController` | `/api/examination/makeup/**` (2) |

### 🟡 attendance-service — SCAFFOLDED

`attendance/AttendanceController` — `/api/attendance/**` (6 endpoints).

### 🟡 finance-service — SCAFFOLDED

`finance/FinanceController` — `/api/finance/**` (6 endpoints).
**Carries financial data** — needs the dual-write period (48h parity check) in
MIGRATION-GUIDE.md Phase 5 before removing from monolith.

### 🟡 hr-service — SCAFFOLDED

| Monolith controller | Endpoints |
|---|---|
| `leave/LeaveController` | `/api/leaves/**` (6) |
| `payroll/PayrollController` | `/api/payroll/**` (5) |

### 🟡 notification-service — SCAFFOLDED

`notification/NotificationController` — `/api/notifications/**` (3 endpoints).
Should also be the sole SQS consumer per `CLAUDE.md` — wire up
`@SqsListener` for the queues created by `infra/localstack/setup.sh`.

### 🟡 academics-service — SCAFFOLDED

`academics/AcademicsController` — `/api/academics/**` (17 endpoints).

### 🟡 feedback-service — SCAFFOLDED

`feedback/FeedbackController` — `/api/feedback/**` (4 endpoints).

### 🟡 research-service — SCAFFOLDED

`research/ResearchController` — `/api/research/**` (3 endpoints).

### 🟡 student-services — SCAFFOLDED

`services/ServicesController` — `/api/services/**` (12 endpoints).

---

## Where the traffic actually goes today

```
                                ┌─ /api/auth/**   → backend/auth-service ✅
                                │
client → api-gateway ───────────┤
                                │
                                └─ everything else → MONOLITH (still authoritative)
                                                     via monolith-fallback route
                                                     (active when MONOLITH_URL is set)
```

Once a service's endpoints are implemented in `backend/`, repeat the same
pattern: delete the matching controllers from `monolith/`, update this file,
verify CI green, deploy.

## Tracking

Update this file at the same time you migrate each service. The diff
between this file's last commit and HEAD is the migration's audit trail.
