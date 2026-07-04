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

### ✅ auth

| Route | Owner |
|---|---|
| `/api/auth/{login,register,refresh}`            | backend/auth |
| `/api/auth/{me,logout,profile,change-password}` | backend/auth |
| `/api/auth/admin/users`, `…/role`, `…/deactivate` | backend/auth |

Deleted from monolith: `AuthController`, `AuthService(Impl)`, `RefreshToken*`,
`LoginRateLimitFilter`. Kept: `User`, `UserRepository`, JWT plumbing (shared
with v2 via JWT_SECRET).

### ✅ users

| Route | Owner |
|---|---|
| `/api/departments/**`  (5)  | backend/users |
| `/api/students/**`     (10) — incl. `/me`, `/me/info`, `/me/bank-info` | backend/users |
| `/api/employees/**`    (8)  | backend/users |

Entities: Department, Student, StudentBankInfo, Employee. The monolith
`student/service/*` + `employee/service/*` classes remain (referenced by
other monolith modules for cross-domain reads).

### ✅ courses

| Route | Owner |
|---|---|
| `/api/courses/**`              (incl. materials) | backend/courses |
| `/api/courses/{id}/assignments`, `/api/assignments/**` | backend/courses |
| `/api/quizzes/**`              (incl. questions, attempt) | backend/courses |
| `/api/announcements/**`        | backend/courses |
| `/api/enrollments/**`          | backend/courses |

9 entities — biggest backend service. Some POST/PUT operations use
gateway-injected `X-User-Id` as `created_by`/`student_id`.

### ✅ exams

| Route | Owner | Notes |
|---|---|---|
| `/api/examination/{schedule,marks,grades,grade-history,online-exam/scheduled}` | backend/exams | |
| `/api/examination/arrear/**` (5) | backend/exams | 🟡 `/eligible` returns [] — policy needs FAILED-grade lookup |
| `/api/examination/makeup/**` (2) | backend/exams | |

### ✅ attendance

| Route | Owner |
|---|---|
| `/api/attendance/student/**`  (mark + summary) | backend/attendance |
| `/api/attendance/employee/**` (mark + log) | backend/attendance |
| `/api/attendance/course/{id}/date/{d}` | backend/attendance |

### ✅ finance

| Route | Owner |
|---|---|
| `/api/finance/fees`     | backend/finance |
| `/api/finance/receipts` | backend/finance |
| `/api/finance/wallet`, `/wallet/add` | backend/finance |
| `/api/finance/refunds` (GET + POST)  | backend/finance |

Wallet balance is a `SUM(CREDIT)-SUM(DEBIT)` native query. Money endpoints
get the tighter `cbFinance` gateway breaker.

### ✅ hr

| Route | Owner | Notes |
|---|---|---|
| `/api/leaves/**` (6) — apply/my/all/approve/reject/balance | backend/hr | |
| `/api/payroll/**` (5) — generate/all/my/process/byId | backend/hr | 🟡 `/generate` expects per-employee figures in body (no Feign to users yet) |

### ✅ notifications

| Route | Owner |
|---|---|
| `/api/notifications` (list, unread-count, mark-all-read) | backend/notifications |

### ✅ academics

| Route | Owner | Notes |
|---|---|---|
| `/api/academics/wishlist`, `/mooc`, `/internship`, `/conference`, `/exc/{available,register,registered}` | backend/academics | |
| `/api/academics/courses/registered` | backend/academics | 🟡 returns [] — needs Feign to courses `/enrollments` |
| `/api/academics/projects/{open,apply,applications}` | backend/academics | 🟡 `/open` returns [] — catalog elsewhere |
| `/api/academics/registration-schedule` | backend/academics | 🟡 stub `{open: false}` |

### ✅ feedback

| Route | Owner |
|---|---|
| `/api/feedback/{status,course,247}` (GET + POST) | backend/feedback |

### ✅ research

| Route | Owner |
|---|---|
| `/api/research/{profile,weekly-logs}` | backend/research |

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

1. **Feign clients** for cross-service reads (courses ↔ users,
   academics ↔ course, examination ↔ user). Currently routes that need them
   return `[]` or accept the figures in the request body. CLAUDE.md already
   documents the pattern.
2. **Bulk CSV imports** (`/api/students/import`, `/api/employees/import`) —
   the monolith generated random passwords and inserted auth.users rows.
   In v2 this needs to either go via auth `/register` per row or
   a new privileged `POST /api/auth/admin/users/import` endpoint.
3. **Saga / outbox** for cross-DB writes (enrollment + notification +
   audit log). Right now each service writes its own row independently.
4. **SQS consumers** in notifications. The compose `localstack`
   creates queues but no `@SqsListener` is wired.

## Traffic shape today

```
                       ┌─ /api/auth/**         → backend/auth          ✅
                       ├─ /api/students,…      → backend/users          ✅
                       ├─ /api/courses,…       → backend/courses        ✅
                       ├─ /api/examination/**  → backend/exams   ✅
                       ├─ /api/attendance/**   → backend/attendance    ✅
                       ├─ /api/finance/**      → backend/finance       ✅
client → gateway ──┼─ /api/{leaves,payroll}→ backend/hr            ✅
                       ├─ /api/notifications/**→ backend/notifications  ✅
                       ├─ /api/academics/**    → backend/academics     ✅
                       ├─ /api/feedback/**     → backend/feedback      ✅
                       ├─ /api/research/**     → backend/research      ✅
                       ├─ /api/services/**     → backend/student-services      ✅
                       │
                       └─ (no fallback — monolith deleted)
```

The monolith is gone. Any cross-service reads that were satisfied implicitly
by the monolith's shared JPA context (User → Student → Course FKs) now need
explicit Feign calls — see the Cross-cutting items above.
