# College LMS — Learning Management & College Administration System

A full-stack web application for managing all academic and administrative operations of a college or university. The system provides dedicated portals for Admins, Faculty, Students, Parents, Staff, and Alumni.

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
- [Known Issues & Areas for Improvement](#known-issues--areas-for-improvement)
- [Roadmap](#roadmap)

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
| Framework | Spring Boot 3.2.5 |
| Build Tool | Gradle 8.7 |
| ORM | Spring Data JPA (Hibernate) |
| Security | Spring Security + JWT (JJWT 0.12.3) |
| Database Driver | PostgreSQL JDBC |
| Email | Spring Mail |
| Monitoring | Spring Actuator |
| Utilities | Lombok |
| Testing | JUnit 5, Spring Boot Test (configured but unused) |

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

The system follows a **monolithic layered architecture** with a decoupled SPA frontend communicating via REST APIs.

```
┌─────────────────────────────────────────┐
│           React SPA (Vite)              │
│         localhost:5173                  │
│                                         │
│  AuthContext → Axios (JWT interceptor)  │
└──────────────────┬──────────────────────┘
                   │  HTTP + Bearer Token
                   │  /api/* (proxied by Vite)
┌──────────────────▼──────────────────────┐
│       Spring Boot Monolith              │
│         localhost:8080                  │
│                                         │
│  SecurityFilter → Controller            │
│       → Service → Repository           │
│       → JPA Entity                     │
└──────────────────┬──────────────────────┘
                   │  JDBC
┌──────────────────▼──────────────────────┐
│           PostgreSQL                    │
│   13 schemas (auth, student, lms, ...)  │
└─────────────────────────────────────────┘
```

### Backend Layering

```
@RestController  — HTTP endpoints, request/response mapping
      ↓
DTOs             — Request/Response objects (data contract)
      ↓
@Service         — Business logic, @Transactional
      ↓
@Repository      — JPA data access (Spring Data)
      ↓
@Entity          — JPA-mapped database models
```

### Authentication Flow

1. Client `POST /api/auth/login` with credentials
2. Server validates, returns a signed JWT
3. Client stores token (currently in `localStorage`)
4. All subsequent requests include `Authorization: Bearer <token>`
5. `JwtAuthenticationFilter` validates token on every request
6. `@PreAuthorize` annotations enforce role-based access per endpoint

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
├── monolith/                       # Spring Boot backend
│   ├── src/main/java/com/college/
│   │   ├── CollegeApplication.java # @SpringBootApplication entry point
│   │   ├── academics/              # Conferences, MOOC, internships
│   │   ├── attendance/             # Student & employee attendance
│   │   ├── auth/                   # JWT security, user management
│   │   ├── common/                 # SecurityConfig, DataInitializer, utils
│   │   ├── employee/
│   │   ├── examination/
│   │   ├── feedback/
│   │   ├── finance/
│   │   ├── leave/
│   │   ├── lms/                    # Courses, assignments, quizzes
│   │   ├── notification/
│   │   ├── payroll/
│   │   ├── research/
│   │   ├── services/               # Bonafide, library, health
│   │   └── student/
│   ├── src/main/resources/
│   │   ├── application.properties  # Config (env var references)
│   │   └── db/
│   │       ├── schema-setup.sql
│   │       └── employee-leave-payroll-schema.sql
│   └── build.gradle
│
├── schema-setup.sql                # Root-level DB schema init
└── .gitignore
```

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

### 1. Database Setup

```sql
-- Run as a PostgreSQL superuser
\i schema-setup.sql
\i monolith/src/main/resources/db/employee-leave-payroll-schema.sql
```

### 2. Backend

Create `monolith/src/main/resources/application-local.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lms_db
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
jwt.secret=your_256bit_secret_key
spring.mail.host=smtp.example.com
spring.mail.username=your_email
spring.mail.password=your_email_password
```

Then run:

```bash
cd monolith
./gradlew bootRun --args='--spring.profiles.active=local'
```

Backend will start at `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at `http://localhost:5173`. All `/api` requests are proxied to the backend via `vite.config.js`.

---

## Environment Variables

The backend reads the following from environment variables or `application-local.properties`:

| Variable | Description |
|---|---|
| `DB_URL` | PostgreSQL JDBC URL |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | 256-bit JWT signing secret |
| `JWT_EXPIRATION` | Token expiry in milliseconds |
| `MAIL_HOST` | SMTP host |
| `MAIL_PORT` | SMTP port |
| `MAIL_USERNAME` | SMTP username |
| `MAIL_PASSWORD` | SMTP password |
| `FRONTEND_URL` | Allowed CORS origin (e.g. `http://localhost:5173`) |

---

## Known Issues & Areas for Improvement

### Critical

| Issue | Detail |
|---|---|
| **No tests** | Zero unit or integration tests exist. `spring-boot-starter-test` is a dependency but no test files are present. |
| **No CI/CD** | No GitHub Actions, Dockerfiles, or deployment scripts. All builds and deploys are manual. |
| **Hibernate DDL auto-update** | Using `ddl-auto=update` in production is unsafe. Should migrate to Flyway or Liquibase. |
| **JWT in localStorage** | Tokens stored in `localStorage` are vulnerable to XSS. A comment in `AuthContext.jsx` acknowledges this. Should move to `httpOnly` cookies. |

### Security

| Issue | Detail |
|---|---|
| **XSS risk** | `localStorage` JWT storage allows token theft if XSS is exploited |
| **No rate limiting** | Auth endpoints have no brute-force protection |
| **No input validation layer** | Backend lacks consistent `@Valid` annotations and custom validators |
| **Entity exposure** | Some endpoints return raw JPA entities instead of DTOs, potentially leaking sensitive fields |

### Code Quality

| Issue | Detail |
|---|---|
| **No linting** | No ESLint/Prettier config for frontend; no SpotBugs/SonarQube for backend |
| **Inline CSS** | All frontend styling is inline; no design system, no responsive design framework |
| **Hardcoded data** | Departments, semesters, leave types are hardcoded in React components instead of fetched from the API |
| **No API documentation** | No Swagger/OpenAPI (SpringDoc) integration |
| **Inconsistent logging** | No structured logging strategy; log levels and format vary by module |
| **Missing `@Transactional`** | Some multi-step service methods lack transactional boundaries |

### Infrastructure

| Issue | Detail |
|---|---|
| **No Docker support** | No Dockerfile or `docker-compose.yml` for consistent local/production environments |
| **No database migrations** | Schema versioning not tracked; changes are not reproducible |
| **No environment-specific config** | No `application-prod.properties` or `application-test.properties` profiles |

---

## Roadmap

Suggested priorities for hardening this system for production:

1. **Add database migration tool** — Integrate Flyway or Liquibase to replace `ddl-auto=update`
2. **Write tests** — Start with auth and LMS service layer unit tests; add controller integration tests
3. **Add CI pipeline** — GitHub Actions: build, lint, test on every PR
4. **Containerize** — Add `Dockerfile` for backend and `docker-compose.yml` for full local stack
5. **Fix JWT storage** — Move from `localStorage` to `httpOnly` cookies
6. **Add API documentation** — Integrate SpringDoc OpenAPI (`/swagger-ui.html`)
7. **Add linting** — ESLint + Prettier for frontend; Checkstyle for backend
8. **Add input validation** — `@Valid` on all controller request bodies with consistent error responses
9. **Add a UI framework** — Replace inline CSS with Tailwind CSS or Material UI
10. **Add structured logging** — Logback JSON format + request tracing (MDC correlation ID)
