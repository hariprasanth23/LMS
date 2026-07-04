# College LMS — Learning Management & College Administration System

A full-stack web application for managing all academic and administrative operations of a college or university. The system provides dedicated portals for Admins, Faculty, Students, Parents, Staff, and Alumni.

> **v2.0 (June 2026):** The legacy Spring Boot monolith has been fully retired. All backend code now lives in `backend/` as 13 independent microservices behind a Spring Cloud Gateway. Schema isolation is per-service (12 Postgres DBs), JWTs are validated only at the gateway, and inter-service writes flow through SQS. See `backend/README.md` and `backend/MIGRATION-STATUS.md` for the per-service breakdown.

---

## Table of Contents

- [Project Scope](#project-scope)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Database Design](#database-design)
- [API Overview](#api-overview)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Open Items](#open-items)

---

## Project Scope

The LMS covers end-to-end operations of a college environment across 15 functional domains:

| Domain | Features |
|---|---|
| **Authentication** | Login, registration, JWT-based sessions, password management, role-based access |
| **Student Management** | Student profiles, department/batch/semester tracking, guardian details |
| **Faculty Management** | Faculty profiles, course assignments, evaluation ownership |
| **Course (LMS)** | Course creation, materials, assignments, quizzes, quiz attempts, announcements |
| **Examination** | Regular exams, internal marks, semester grades, makeup requests, arrear registration |
| **Attendance** | Student and employee attendance marking and tracking |
| **Finance** | Fee records, payment receipts, wallet transactions, refund requests |
| **Leave Management** | Leave requests, leave balance per category |
| **Payroll** | Monthly payroll records with allowances and deductions |
| **Feedback** | Course feedback, 24/7 anonymous feedback |
| **Notifications** | System-wide notification delivery |
| **Research** | Faculty research profiles, weekly progress logs |
| **Student Services** | Bonafide certificate requests, library book tracking, health feedback |
| **Academics** | Conference submissions, MOOC completions, internship records |
| **Portals** | Separate UIs for Parent, Alumni roles |

**User Roles:** `ADMIN`, `FACULTY`, `STUDENT`, `STAFF`, `PARENT`, `ALUMNI`

---

## Technology Stack

### Backend

| Component | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.3.4 (13 microservices) |
| Gateway | Spring Cloud Gateway 2023.0.3 (reactive Resilience4j) |
| Build Tool | Gradle 8.7 (one project per service) |
| ORM | Spring Data JPA (Hibernate) |
| Security | JJWT 0.12.3 (gateway-only) + HMAC inter-service signing |
| Database | PostgreSQL 16 — one DB per service, Flyway migrations |
| Cache / denylist | Redis (JWT revocation cache + ShedLock backing) |
| Async | SQS (LocalStack in dev) — notifications is the only consumer |
| Observability | Micrometer + OTLP exporter, Logback + LogstashEncoder |
| Testing | JUnit 5 + Testcontainers (real Postgres per test) |

### Frontend

| Component | Technology |
|---|---|
| Language | JavaScript (ES6+) |
| Framework | React 18.2.0 |
| Build Tool | Vite 5.2.0 |
| Routing | React Router DOM 6.22.3 |
| HTTP Client | Axios 1.6.8 |
| Icons | React Icons 5.0.1 |
| Notifications | React Hot Toast 2.4.1 |
| Styling | Inline CSS (no external UI framework) |

### Infrastructure

| Component | Technology |
|---|---|
| Database | PostgreSQL (multi-schema) |
| Local Dev Proxy | Vite dev server proxy (`/api` → `localhost:8080`) |

---

## Architecture

A decoupled React SPA talks to an API gateway that fans out to 13 independent Spring Boot services, each with its own Postgres database.

```
┌─────────────────────────────────────────┐
│           React SPA (Vite)              │
│         localhost:5173                  │
│                                         │
│  AuthContext → Axios (httpOnly cookie)  │
└──────────────────┬──────────────────────┘
                   │  /api/* (Vite proxy → gateway)
┌──────────────────▼──────────────────────┐
│      Spring Cloud Gateway (8080)        │
│  Validates JWT once, injects:           │
│    X-User-Id, X-User-Role               │
│  Circuit breakers + body cap + tracing  │
└──────────────────┬──────────────────────┘
                   │  per-route prefix
   ┌───────────────┼─────────────────────────────┐
   ▼               ▼                             ▼
auth-svc      user-svc … (11 more)        notification-svc
  │              │                            ▲ SQS
  ▼              ▼                            │
lms_auth_db   lms_user_db   …            queues
```

Each service owns its schema; no cross-database foreign keys. Cross-service reads go via Feign to `/internal/**` endpoints. Cross-service writes publish events through SQS; only `notifications` consumes.

### Per-service layout

```
controller/   @RestController — reads X-User-Id from header
service/      Business logic, @Transactional
repository/   Spring Data JPA (often bundled in <Domain>Repositories.java)
model/        @Entity classes (often bundled in Entities.java)
common/       ApiResponse, error mapping — copied per-service
```

### Authentication flow

1. Client `POST /api/auth/login` — auth verifies bcrypt password, issues a JWT (iss/aud/jti claims).
2. Gateway sets the JWT in an httpOnly `lms_token` cookie; the SPA never sees the raw token.
3. On every protected request the gateway validates the cookie's JWT, checks Redis for revocation, then strips the cookie and injects `X-User-Id` + `X-User-Role`.
4. Downstream services read identity from those headers — they never parse JWTs.
5. Logout writes the JTI to a Postgres denylist; ShedLock-guarded `@Scheduled` job prunes expired entries hourly across replicas.

---

## Directory Structure

```
LMS/
├── frontend/                       # React SPA
│   ├── src/
│   │   ├── pages/                  # Feature modules (18 domains)
│   │   │   ├── academics/
│   │   │   ├── alumni/
│   │   │   ├── attendance/
│   │   │   ├── auth/               # Login, Register, ForgotPassword
│   │   │   ├── dashboard/
│   │   │   ├── employee/
│   │   │   ├── examinations/
│   │   │   ├── faculty/            # 11 sub-modules
│   │   │   ├── feedback/
│   │   │   ├── finance/
│   │   │   ├── landing/
│   │   │   ├── leave/
│   │   │   ├── lms/                # Courses, assignments, quizzes
│   │   │   ├── parent/
│   │   │   ├── payroll/
│   │   │   ├── profile/
│   │   │   ├── research/
│   │   │   ├── services/
│   │   │   └── student/
│   │   ├── components/
│   │   │   ├── common/             # PageHeader, shared UI
│   │   │   └── layout/             # App layout wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state
│   │   ├── services/
│   │   │   └── api.js              # Axios instance with JWT interceptor
│   │   ├── App.jsx                 # 60+ route definitions
│   │   └── main.jsx                # React entry point
│   ├── vite.config.js              # Build config + API proxy
│   └── package.json
│
├── backend/                        # 13 Spring Boot microservices
│   ├── gateway/                # 8080 — JWT + circuit breakers + routing
│   ├── auth/               # 8081 — login/register/JWT issuance + revocation
│   ├── users/               # 8082 — students, employees, departments
│   ├── courses/             # 8083 — courses, materials, assignments, quizzes
│   ├── exams/        # 8084 — exam schedule, marks, grades, arrear
│   ├── attendance/         # 8085 — student + employee attendance
│   ├── finance/            # 8086 — fees, receipts, wallet, refunds
│   ├── hr/                 # 8087 — leave + payroll
│   ├── notifications/       # 8088 — SQS consumer + in-app notifications
│   ├── academics/          # 8089 — MOOC, ECC, internship, conference
│   ├── feedback/           # 8090 — course feedback + 24/7 anonymous
│   ├── research/           # 8091 — research profiles + weekly logs
│   ├── student-services/           # 8092 — bonafide, library, health feedback
│   ├── docker-compose.yml          # Local stack: Postgres × 12 + Redis + LocalStack
│   ├── infra/                      # AWS task defs, LocalStack bootstrap, deploy scripts
│   ├── CLAUDE.md                   # Backend-specific guidance
│   └── MIGRATION-STATUS.md         # Per-service migration ledger
│
└── .gitignore
```

Each service has the same shape: `build.gradle`, `Dockerfile`, `src/main/resources/application.yml`, one `Application.java`, Flyway migrations under `src/main/resources/db/migration/`, and a `common/ApiResponse.java` copy.

---

## Database Design

PostgreSQL is organized into **13 domain-specific schemas**:

| Schema | Purpose |
|---|---|
| `auth` | Users, refresh tokens |
| `student` | Students, departments, enrollments |
| `lms` | Courses, assignments, quizzes, materials, announcements |
| `employee` | Employee records, documents |
| `attendance` | Student and employee attendance |
| `leave_mgmt` | Leave requests and balances |
| `payroll` | Monthly payroll records |
| `notification` | System notifications |
| `examination` | Exam schedules, internal marks, grades |
| `feedback` | Course feedback, 24/7 anonymous feedback |
| `finance` | Fees, payments, wallets, refunds |
| `services` | Bonafide requests, library, health |
| `research` | Research profiles, weekly logs |

**Key design choices:**
- UUID primary keys (`gen_random_uuid()`)
- Soft deletes via a `status` column on most tables
- `created_at` / `updated_at` auto-populated via Hibernate annotations
- Hibernate `ddl-auto=update` (currently — not suitable for production)

---

## API Overview

All endpoints are prefixed with `/api`. Protected endpoints require `Authorization: Bearer <token>`.

### Auth — `/api/auth`

| Method | Path | Access |
|---|---|---|
| POST | `/login` | Public |
| POST | `/register` | Public |
| GET | `/me` | Authenticated |
| PUT | `/profile` | Authenticated |
| PUT | `/change-password` | Authenticated |
| PUT | `/update-email` | Authenticated |
| PUT | `/update-mobile` | Authenticated |

### Core Modules

| Module | Base Path | CRUD | Notes |
|---|---|---|---|
| Students | `/api/students` | Full | Admin manages; Student reads own via `/me` |
| Courses | `/api/courses` | Full | Materials sub-resource at `/{id}/materials` |
| Assignments | `/api/assignments` | Full | Submissions sub-resource |
| Quizzes | `/api/quizzes` | Full | Questions, attempts sub-resources |
| Examinations | `/api/examinations` | Full | Internal marks, grade sheets |
| Arrear/Makeup | `/api/arrear`, `/api/makeup` | Full | Student exam retry workflows |
| Attendance | `/api/attendance` | Read/Write | Mark and fetch per student/employee |
| Finance | `/api/finance` | Full | Fees, payments, wallet, refunds |
| Leave | `/api/leaves` | Full | Requests and balances |
| Employees | `/api/employees` | Full | Admin managed |
| Payroll | `/api/payroll` | Full | Monthly records |
| Feedback | `/api/feedback` | Full | Course and 24/7 feedback |
| Notifications | `/api/notifications` | Read | System-pushed |
| Research | `/api/research` | Full | Faculty profiles and logs |
| Services | `/api/services` | Full | Bonafide, library, health |
| Academics | `/api/academics` | Full | Conferences, MOOC, internships |

**Public endpoints:** `/api/auth/login`, `/api/auth/register`, `/actuator/health`

---

## Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL 14+
- Gradle 8.7 (or use the included wrapper)

### 1. Backend (Docker Compose — recommended)

```bash
cd backend
cp .env.example .env   # fill in JWT_SECRET at minimum
docker-compose up --build
```

This spins up all 12 Postgres databases, Redis, LocalStack (SQS), the gateway, and every microservice. Flyway runs migrations per service on first start.

Gateway is at `http://localhost:8080`. The SPA's Vite proxy points there.

### 2. Backend (one service at a time, optional)

```bash
cd backend/<service>
./gradlew bootRun --args='--spring.profiles.active=local'
```

Each service expects its DB + Redis to be running (start them via `docker-compose up postgres redis localstack`).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at `http://localhost:5173`. All `/api` requests are proxied to the backend via `vite.config.js`.

---

## Environment Variables

Minimum `.env` for `docker-compose up`:

```
JWT_SECRET=any-string-at-least-32-characters-long
POSTGRES_USER=lmsadmin
POSTGRES_PASSWORD=changeme
```

Per-service config lives in each service's `application.yml`. Service-to-service URLs default to `http://localhost:<port>` and are overridden by Docker Compose service names in containerized runs.

In production, all secrets come from **AWS Secrets Manager** paths like `/lms/prod/auth-db`. ECS task definitions in `backend/infra/aws/ecs/task-definitions/` reference these paths — update `ACCOUNT_ID` and image URIs before registering.

---

## Open Items

The migration is functionally complete (every monolith controller has an owner in `backend/`), but a few cross-cutting concerns are still parked. The authoritative ledger lives in `backend/MIGRATION-STATUS.md`.

| Item | Status |
|---|---|
| Feign clients for cross-service reads (`courses` ↔ `users`, `academics` ↔ `course`) | 🟡 some endpoints return `[]` |
| Bulk CSV import (`/api/students/import`, `/api/employees/import`) | 🟡 not migrated — needs an admin-only `auth` endpoint |
| Saga / outbox for cross-DB writes (enrollment + notification + audit) | 🟡 not implemented |
| SQS consumers in `notifications` | 🟡 queues exist; `@SqsListener` not wired |
| Frontend: replace inline CSS with a design system | 🟡 ongoing |
