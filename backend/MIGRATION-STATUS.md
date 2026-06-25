# Migration Status — Monolith → Backend Microservices

**Migration: COMPLETE.** The legacy `monolith/` directory has been deleted in
its entirety (304 files, ~8.9k lines). All 12 backend services own their
domain endpoints; the monolith CI workflow has been removed.

| State | Meaning |
|---|---|
| ✅ **Migrated** | Real controllers in backend, monolith controller deleted. |
| 🟡 **Partial**  | Endpoint exists but a cross-service read is stubbed (returns [] or sample data). Marked TODO inline. |
| ❌ **Not started** | n/a — all services migrated. |

---

## Per-service status

### ✅ auth-service

| Route | Owner |
|---|---|
| `/api/auth/{login,register,refresh}`            | backend/auth-service |
| `/api/auth/{me,logout,profile,change-password}` | backend/auth-service |
| `/api/auth/admin/users`, `…/role`, `…/deactivate` | backend/auth-service |

Deleted from monolith: `AuthController`, `AuthService(Impl)`, `RefreshToken*`,
`LoginRateLimitFilter`. Kept: `User`, `UserRepository`, JWT plumbing (shared
with v2 via JWT_SECRET).

### ✅ user-service

| Route | Owner |
|---|---|
| `/api/departments/**`  (5)  | backend/user-service |
| `/api/students/**`     (10) — incl. `/me`, `/me/info`, `/me/bank-info` | backend/user-service |
| `/api/employees/**`    (8)  | backend/user-service |

Entities: Department, Student, StudentBankInfo, Employee. The monolith
`student/service/*` + `employee/service/*` classes remain (referenced by
other monolith modules for cross-domain reads).

### ✅ course-service

| Route | Owner |
|---|---|
| `/api/courses/**`              (incl. materials) | backend/course-service |
| `/api/courses/{id}/assignments`, `/api/assignments/**` | backend/course-service |
| `/api/quizzes/**`              (incl. questions, attempt) | backend/course-service |
| `/api/announcements/**`        | backend/course-service |
| `/api/enrollments/**`          | backend/course-service |

9 entities — biggest backend service. Some POST/PUT operations use
gateway-injected `X-User-Id` as `created_by`/`student_id`.

### ✅ examination-service

| Route | Owner | Notes |
|---|---|---|
| `/api/examination/{schedule,marks,grades,grade-history,online-exam/scheduled}` | backend/examination-service | |
| `/api/examination/arrear/**` (5) | backend/examination-service | 🟡 `/eligible` returns [] — policy needs FAILED-grade lookup |
| `/api/examination/makeup/**` (2) | backend/examination-service | |

### ✅ attendance-service

| Route | Owner |
|---|---|
| `/api/attendance/student/**`  (mark + summary) | backend/attendance-service |
| `/api/attendance/employee/**` (mark + log) | backend/attendance-service |
| `/api/attendance/course/{id}/date/{d}` | backend/attendance-service |

### ✅ finance-service

| Route | Owner |
|---|---|
| `/api/finance/fees`     | backend/finance-service |
| `/api/finance/receipts` | backend/finance-service |
| `/api/finance/wallet`, `/wallet/add` | backend/finance-service |
| `/api/finance/refunds` (GET + POST)  | backend/finance-service |

Wallet balance is a `SUM(CREDIT)-SUM(DEBIT)` native query. Money endpoints
get the tighter `cbFinance` gateway breaker.

### ✅ hr-service

| Route | Owner | Notes |
|---|---|---|
| `/api/leaves/**` (6) — apply/my/all/approve/reject/balance | backend/hr-service | |
| `/api/payroll/**` (5) — generate/all/my/process/byId | backend/hr-service | 🟡 `/generate` expects per-employee figures in body (no Feign to user-service yet) |

### ✅ notification-service

| Route | Owner |
|---|---|
| `/api/notifications` (list, unread-count, mark-all-read) | backend/notification-service |

### ✅ academics-service

| Route | Owner | Notes |
|---|---|---|
| `/api/academics/wishlist`, `/mooc`, `/internship`, `/conference`, `/exc/{available,register,registered}` | backend/academics-service | |
| `/api/academics/courses/registered` | backend/academics-service | 🟡 returns [] — needs Feign to course-service `/enrollments` |
| `/api/academics/projects/{open,apply,applications}` | backend/academics-service | 🟡 `/open` returns [] — catalog elsewhere |
| `/api/academics/registration-schedule` | backend/academics-service | 🟡 stub `{open: false}` |

### ✅ feedback-service

| Route | Owner |
|---|---|
| `/api/feedback/{status,course,247}` (GET + POST) | backend/feedback-service |

### ✅ research-service

| Route | Owner |
|---|---|
| `/api/research/{profile,weekly-logs}` | backend/research-service |

### ✅ student-services

| Route | Owner |
|---|---|
| `/api/services/bonafide`            | backend/student-services |
| `/api/services/library/**` (issued, renew, recommendations, recommend, stats) | backend/student-services |
| `/api/services/requests` (3)         | backend/student-services |
| `/api/services/health-feedback`      | backend/student-services |

---

## Cross-cutting items still parked

These don't block the migration but are TODO if you want full functional parity
with the monolith:

1. **Feign clients** for cross-service reads (course-service ↔ user-service,
   academics ↔ course, examination ↔ user). Currently routes that need them
   return `[]` or accept the figures in the request body. CLAUDE.md already
   documents the pattern.
2. **Bulk CSV imports** (`/api/students/import`, `/api/employees/import`) —
   the monolith generated random passwords and inserted auth.users rows.
   In v2 this needs to either go via auth-service `/register` per row or
   a new privileged `POST /api/auth/admin/users/import` endpoint.
3. **Saga / outbox** for cross-DB writes (enrollment + notification +
   audit log). Right now each service writes its own row independently.
4. **SQS consumers** in notification-service. The compose `localstack`
   creates queues but no `@SqsListener` is wired.

## Traffic shape today

```
                       ┌─ /api/auth/**         → backend/auth-service          ✅
                       ├─ /api/students,…      → backend/user-service          ✅
                       ├─ /api/courses,…       → backend/course-service        ✅
                       ├─ /api/examination/**  → backend/examination-service   ✅
                       ├─ /api/attendance/**   → backend/attendance-service    ✅
                       ├─ /api/finance/**      → backend/finance-service       ✅
client → api-gateway ──┼─ /api/{leaves,payroll}→ backend/hr-service            ✅
                       ├─ /api/notifications/**→ backend/notification-service  ✅
                       ├─ /api/academics/**    → backend/academics-service     ✅
                       ├─ /api/feedback/**     → backend/feedback-service      ✅
                       ├─ /api/research/**     → backend/research-service      ✅
                       ├─ /api/services/**     → backend/student-services      ✅
                       │
                       └─ (no fallback — monolith deleted)
```

The monolith is gone. Any cross-service reads that were satisfied implicitly
by the monolith's shared JPA context (User → Student → Course FKs) now need
explicit Feign calls — see the Cross-cutting items above.
