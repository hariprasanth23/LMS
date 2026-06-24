# LMS v2.0 — Microservices Architecture

> **Decoupled, cloud-native rewrite of the College LMS monolith.**
> Each domain is an independent Spring Boot service, deployable and scalable on AWS.

---

## Table of Contents

- [Why v2.0?](#why-v20)
- [Architecture Overview](#architecture-overview)
- [Microservices Catalog](#microservices-catalog)
- [Technology Stack](#technology-stack)
- [Domain → Service Mapping](#domain--service-mapping)
- [Inter-Service Communication](#inter-service-communication)
- [Database Strategy](#database-strategy)
- [Security Model](#security-model)
- [Local Development](#local-development)
- [AWS Deployment](#aws-deployment)
- [API Contract](#api-contract)
- [Migration from v1](#migration-from-v1)
- [Project Structure](#project-structure)

---

## Why v2.0?

The v1 monolith has 15 domains all coupled in a single Spring Boot app sharing one PostgreSQL database. This creates:

| Problem | Impact |
|---|---|
| Single deployable unit | A change in `notification` requires re-deploying all 15 domains |
| Shared DB across all domains | Schema changes in one domain risk breaking others |
| No independent scaling | Can't scale `examination` during exam season without scaling everything |
| Coupled failure modes | A bug in `finance` can take down `lms` |
| No team autonomy | All 15 domains share one codebase and one release cycle |

**v2.0 solves this by:**
- Splitting 15 domains into 12 independently deployable Spring Boot microservices
- Each service owns its own PostgreSQL database (database-per-service pattern)
- Services communicate via HTTP (sync) and Amazon SQS (async events)
- Single API Gateway handles routing, JWT verification, and rate limiting
- AWS ECS Fargate for container orchestration — no server management

---

## Architecture Overview

```
                        ┌─────────────────────────────────────────┐
                        │         React SPA (CloudFront + S3)     │
                        │         lms.yourdomain.com              │
                        └──────────────────┬──────────────────────┘
                                           │  HTTPS
                        ┌──────────────────▼──────────────────────┐
                        │        AWS Application Load Balancer    │
                        │         (SSL Termination, WAF)          │
                        └──────────────────┬──────────────────────┘
                                           │
                        ┌──────────────────▼──────────────────────┐
                        │           API Gateway Service           │
                        │     (Spring Cloud Gateway, Port 8080)   │
                        │   JWT Validation · Rate Limiting · CORS │
                        └──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬───┘
                           │  │  │  │  │  │  │  │  │  │  │  │
            ┌──────────────┘  │  │  │  │  │  │  │  │  │  │  └──────────────┐
            │     ┌───────────┘  │  │  │  │  │  │  │  │  └───────────┐     │
            │     │   ┌──────────┘  │  │  │  │  │  │  └──────────┐   │     │
            │     │   │  ┌──────────┘  │  │  │  │  └──────────┐  │   │     │
            ▼     ▼   ▼  ▼             ▼  ▼  ▼  ▼             ▼  ▼   ▼     ▼
         ┌────┐┌────┐┌───┐┌──────┐┌────┐┌──┐┌──┐┌─────┐┌─────┐┌──┐┌────┐┌─────┐
         │auth││user││lms││exam  ││attn││fin││hr ││notif││acad ││fb ││res ││svcs │
         │svc ││svc ││svc││  svc ││svc ││svc││svc││ svc ││ svc ││svc││svc ││ svc │
         │8081││8082││8083││ 8084 ││8085││8086││8087││ 8088 ││ 8089 ││8090││8091││8092 │
         └──┬─┘└──┬─┘└─┬─┘└──┬───┘└──┬─┘└─┬┘└─┬─┘└──┬──┘└──┬──┘└─┬┘└─┬─┘└──┬─┘
            │     │    │     │       │    │   │     │      │    │   │     │
            ▼     ▼    ▼     ▼       ▼    ▼   ▼     ▼      ▼    ▼   ▼     ▼
         ┌─────────────────────────────────────────────────────────────────────┐
         │                    Amazon RDS PostgreSQL                            │
         │   auth-db  user-db  lms-db  exam-db  attn-db  fin-db  hr-db  ...  │
         │              (separate database per service)                        │
         └─────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────────────────────────────┐
                        │           Amazon SQS / SNS              │
                        │  (Async event bus for cross-service     │
                        │   notifications, email triggers, etc.)  │
                        └─────────────────────────────────────────┘
```

---

## Microservices Catalog

| Service | Port | Domain(s) Covered | Database |
|---|---|---|---|
| `api-gateway` | 8080 | Routing, JWT validation, rate limiting | — |
| `auth-service` | 8081 | auth | `lms_auth_db` |
| `user-service` | 8082 | student, employee, department | `lms_user_db` |
| `course-service` | 8083 | lms (courses, assignments, quizzes, materials) | `lms_course_db` |
| `examination-service` | 8084 | examination (exams, marks, grades, arrears) | `lms_exam_db` |
| `attendance-service` | 8085 | attendance | `lms_attendance_db` |
| `finance-service` | 8086 | finance (fees, payments, wallet, refunds) | `lms_finance_db` |
| `hr-service` | 8087 | leave, payroll | `lms_hr_db` |
| `notification-service` | 8088 | notification | `lms_notification_db` |
| `academics-service` | 8089 | academics (MOOC, internship, conference, ECC) | `lms_academics_db` |
| `feedback-service` | 8090 | feedback | `lms_feedback_db` |
| `research-service` | 8091 | research | `lms_research_db` |
| `student-services` | 8092 | services (bonafide, library, health) | `lms_services_db` |
| `frontend` | 5173 | React SPA | — |

---

## Technology Stack

### Backend (all microservices)

| Component | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.3.x |
| Build | Gradle 8.8 |
| ORM | Spring Data JPA (Hibernate) |
| Security | Spring Security + JWT (JJWT 0.12.x) |
| DB Driver | PostgreSQL JDBC |
| Migrations | Flyway |
| Validation | Spring Validation (`@Valid`) |
| API Docs | SpringDoc OpenAPI 3 (`/swagger-ui.html`) |
| Messaging | Spring Cloud AWS SQS |
| Logging | Logback JSON + MDC correlation IDs |
| Monitoring | Spring Actuator + Micrometer → CloudWatch |
| Testing | JUnit 5 + Testcontainers |
| Inter-service HTTP | Spring Cloud OpenFeign |

### API Gateway

| Component | Technology |
|---|---|
| Framework | Spring Cloud Gateway 4.x |
| JWT Validation | JJWT (validates at gateway, propagates user ID in headers) |
| Rate Limiting | Spring Cloud Gateway + Redis |

### Frontend

| Component | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS |
| HTTP | Axios (with interceptors) |
| Auth State | React Context + httpOnly cookies |

### Infrastructure (AWS)

| Component | AWS Service |
|---|---|
| Container Orchestration | Amazon ECS Fargate |
| Container Registry | Amazon ECR |
| Load Balancer | Application Load Balancer (ALB) |
| Database | Amazon RDS PostgreSQL 16 (Multi-AZ) |
| Object Storage | Amazon S3 (file uploads) |
| Email | Amazon SES |
| Async Messaging | Amazon SQS + SNS |
| Secrets | AWS Secrets Manager |
| DNS | Amazon Route 53 |
| CDN / Frontend | Amazon CloudFront + S3 |
| CI/CD | AWS CodePipeline + CodeBuild |
| Monitoring | Amazon CloudWatch + AWS X-Ray |
| Service Discovery | AWS Cloud Map |

---

## Domain → Service Mapping

### From monolith package → microservice

| Monolith Package | v2.0 Service | Reason for grouping |
|---|---|---|
| `com.college.auth` | `auth-service` | Identity boundary — owns JWT & user credentials |
| `com.college.student` `com.college.employee` | `user-service` | Both are "people" entities; departments owned here |
| `com.college.lms` | `course-service` | Full course lifecycle (materials, assignments, quizzes) |
| `com.college.examination` | `examination-service` | Exam domain is self-contained |
| `com.college.attendance` | `attendance-service` | High-write domain; can scale independently |
| `com.college.finance` | `finance-service` | PCI/financial isolation |
| `com.college.leave` `com.college.payroll` | `hr-service` | HR workflow: leave affects payroll |
| `com.college.notification` | `notification-service` | Cross-cutting concern; consumers publish events, this service delivers |
| `com.college.academics` | `academics-service` | Student academic activities (MOOC, ECC, internship) |
| `com.college.feedback` | `feedback-service` | Low-traffic, isolated survey data |
| `com.college.research` | `research-service` | Faculty research tracking |
| `com.college.services` | `student-services` | Student administrative requests |

---

## Inter-Service Communication

### Synchronous (HTTP via OpenFeign)

Used when the calling service needs an immediate response:

```
course-service   →  auth-service        (validate user role before course creation)
examination-svc  →  user-service        (fetch student profile for grade sheet)
attendance-svc   →  course-service      (validate course exists before marking attendance)
finance-svc      →  user-service        (fetch student fee category)
hr-service       →  user-service        (fetch employee base salary for payroll)
academics-svc    →  course-service      (validate course before wishlist add)
```

### Asynchronous (Amazon SQS events)

Used for cross-cutting concerns where the publisher doesn't need to wait:

| Event | Publisher | Subscriber | Queue |
|---|---|---|---|
| `UserRegistered` | auth-service | user-service, notification-service | `lms-user-registered` |
| `CourseEnrolled` | course-service | notification-service, attendance-service | `lms-course-enrolled` |
| `AssignmentGraded` | course-service | notification-service | `lms-assignment-graded` |
| `PaymentCompleted` | finance-service | notification-service | `lms-payment-done` |
| `LeaveApproved` | hr-service | notification-service | `lms-leave-approved` |
| `ExamScheduled` | examination-service | notification-service | `lms-exam-scheduled` |

---

## Database Strategy

### Database-per-Service Pattern

Each service owns its own PostgreSQL database. No shared tables. No cross-database foreign keys.

```
auth-service      → lms_auth_db      (users, refresh_tokens)
user-service      → lms_user_db      (students, employees, departments, bank_info)
course-service    → lms_course_db    (courses, materials, assignments, quizzes, enrollments)
examination-svc   → lms_exam_db      (exam_schedule, marks, grades, arrears, makeup)
attendance-svc    → lms_attendance_db (student_attendance, employee_attendance)
finance-svc       → lms_finance_db   (fee_records, payments, wallet, refunds)
hr-service        → lms_hr_db        (leave_requests, leave_balances, payroll_records)
notification-svc  → lms_notification_db (notifications)
academics-svc     → lms_academics_db (wishlist, exc, mooc, internship, conference, projects)
feedback-svc      → lms_feedback_db  (course_feedback, feedback_247)
research-svc      → lms_research_db  (research_profiles, weekly_logs)
student-services  → lms_services_db  (bonafide, library, health_feedback)
```

### Cross-Service Data References

Instead of JPA `@ManyToOne` FK across services, services store only the **UUID reference**:

```java
// course-service: Assignment entity
@Column(name = "course_id")
private UUID courseId;   // local FK — course is in same service

@Column(name = "student_id")
private UUID studentId;  // cross-service reference — student lives in user-service
```

When the full student object is needed, the service makes a Feign call to `user-service`.

### Migrations

All services use **Flyway** for schema versioning:
- Migration files in `src/main/resources/db/migration/`
- Files named `V1__init_schema.sql`, `V2__add_index.sql`, etc.
- `spring.flyway.enabled=true` in `application.yml`

---

## Security Model

### JWT Flow in v2.0

```
1. Client → POST /api/auth/login
2. auth-service issues JWT (claims: userId, role, name, email)
3. Client stores token in httpOnly cookie (NOT localStorage)
4. Client → GET /api/courses (with cookie)
5. api-gateway validates JWT signature
6. api-gateway extracts userId + role, adds to headers:
     X-User-Id: <uuid>
     X-User-Role: ROLE_STUDENT
7. Downstream service trusts these headers (never re-validates JWT)
8. Service uses @PreAuthorize with headers, not re-parsing JWT
```

### Gateway Security Rules

| Path Pattern | Allowed Roles | Action |
|---|---|---|
| `/api/auth/**` | Public | Pass through |
| `/api/courses/**` | ADMIN, FACULTY, STUDENT | Validate JWT → route |
| `/api/admin/**` | ADMIN only | Validate JWT + role check |
| `/api/finance/**` | ADMIN, STUDENT | Validate JWT → route |

### Secret Management

All secrets (DB passwords, JWT secret, mail credentials) stored in **AWS Secrets Manager**. Services fetch on startup via Spring Cloud AWS:

```yaml
spring:
  config:
    import: "aws-secretsmanager:/lms/prod/auth-service"
```

---

## Local Development

### Prerequisites

- Java 21+
- Node.js 18+
- Docker Desktop
- AWS CLI (for SQS local via LocalStack, optional)

### Start all services locally

```bash
# Clone the repo
git clone <repo-url>
cd backend

# Copy environment template
cp .env.example .env
# Edit .env with your values

# Start everything with Docker Compose
docker-compose up --build

# Or start just infrastructure (DB, SQS)
docker-compose up postgres redis localstack
```

### Service-level development

Each service can run independently:

```bash
cd auth-service
./gradlew bootRun --args='--spring.profiles.active=local'
```

### Service URLs (local)

| Service | URL | Swagger |
|---|---|---|
| API Gateway | http://localhost:8080 | — |
| Auth Service | http://localhost:8081 | http://localhost:8081/swagger-ui.html |
| User Service | http://localhost:8082 | http://localhost:8082/swagger-ui.html |
| Course Service | http://localhost:8083 | http://localhost:8083/swagger-ui.html |
| Examination | http://localhost:8084 | http://localhost:8084/swagger-ui.html |
| Attendance | http://localhost:8085 | http://localhost:8085/swagger-ui.html |
| Finance | http://localhost:8086 | http://localhost:8086/swagger-ui.html |
| HR Service | http://localhost:8087 | http://localhost:8087/swagger-ui.html |
| Notification | http://localhost:8088 | http://localhost:8088/swagger-ui.html |
| Academics | http://localhost:8089 | http://localhost:8089/swagger-ui.html |
| Feedback | http://localhost:8090 | http://localhost:8090/swagger-ui.html |
| Research | http://localhost:8091 | http://localhost:8091/swagger-ui.html |
| Student Services | http://localhost:8092 | http://localhost:8092/swagger-ui.html |
| Frontend | http://localhost:5173 | — |

---

## AWS Deployment

See **[AWS-DEPLOYMENT.md](./AWS-DEPLOYMENT.md)** for the complete step-by-step AWS deployment game plan.

**Summary:** ECS Fargate + RDS PostgreSQL + ALB + ECR + SQS + CloudFront

---

## API Contract

All services return the same envelope:

```json
{
  "success": true,
  "message": "Operation completed",
  "data": { ... },
  "timestamp": "2025-01-15T10:30:00Z",
  "traceId": "abc-123-xyz"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Student not found",
  "errorCode": "USER_NOT_FOUND",
  "timestamp": "2025-01-15T10:30:00Z",
  "traceId": "abc-123-xyz"
}
```

HTTP status codes follow REST conventions:
- `200` — OK
- `201` — Created
- `400` — Validation error
- `401` — Unauthenticated
- `403` — Insufficient role
- `404` — Resource not found
- `409` — Conflict (duplicate)
- `500` — Internal server error

---

## Migration from v1

See **[MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md)** for the complete phased migration plan from the monolith.

**High-level migration phases:**
1. **Phase 1** — Extract `auth-service` first (lowest risk, no cross-domain writes)
2. **Phase 2** — Extract `user-service` (student, employee)
3. **Phase 3** — Extract `course-service`, `examination-service` (core academic domains)
4. **Phase 4** — Extract `finance-service`, `hr-service` (financial domains, need care)
5. **Phase 5** — Extract remaining services (attendance, notification, academics, feedback, research, student-services)
6. **Phase 6** — Decommission monolith

---

## Project Structure

```
backend/
├── README.md                        ← This file
├── ARCHITECTURE.md                  ← Detailed architecture decisions
├── AWS-DEPLOYMENT.md                ← AWS deployment game plan
├── MIGRATION-GUIDE.md               ← v1 → v2 migration phases
├── docker-compose.yml               ← Local dev (all services + infra)
├── docker-compose.infra.yml         ← Infrastructure only (Postgres, Redis, LocalStack)
├── .env.example                     ← Environment variable template
│
├── api-gateway/                     ← Spring Cloud Gateway
│   ├── src/main/java/com/lms/gateway/
│   │   ├── GatewayApplication.java
│   │   ├── config/
│   │   │   ├── GatewayConfig.java   ← Route definitions
│   │   │   └── SecurityConfig.java  ← JWT validation filter
│   │   └── filter/
│   │       ├── JwtAuthFilter.java
│   │       └── RateLimitFilter.java
│   ├── src/main/resources/application.yml
│   └── Dockerfile
│
├── auth-service/                    ← Authentication & JWT
│   ├── src/main/java/com/lms/auth/
│   │   ├── AuthServiceApplication.java
│   │   ├── controller/AuthController.java
│   │   ├── service/AuthService.java
│   │   ├── model/User.java
│   │   ├── model/RefreshToken.java
│   │   ├── repository/UserRepository.java
│   │   ├── security/JwtUtil.java
│   │   └── dto/
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/V1__init_auth_schema.sql
│   ├── Dockerfile
│   └── build.gradle
│
├── user-service/                    ← Students, Employees, Departments
├── course-service/                  ← Courses, Assignments, Quizzes
├── examination-service/             ← Exams, Marks, Grades
├── attendance-service/              ← Attendance tracking
├── finance-service/                 ← Fees, Payments, Wallet
├── hr-service/                      ← Leave, Payroll
├── notification-service/            ← In-app + Email notifications
├── academics-service/               ← MOOC, ECC, Internship, Conference
├── feedback-service/                ← Course feedback, 24/7 feedback
├── research-service/                ← Research profiles, logs
├── student-services/                ← Bonafide, Library, Health
│
├── frontend/                        ← React SPA (updated for microservices)
│   └── src/
│       ├── services/api.js          ← Single API base URL (gateway)
│       └── ...
│
└── infra/
    ├── aws/
    │   ├── ecs/
    │   │   └── task-definitions/    ← ECS task definition JSONs per service
    │   ├── cloudformation/
    │   │   ├── vpc.yml
    │   │   ├── rds.yml
    │   │   ├── ecs-cluster.yml
    │   │   └── alb.yml
    │   └── scripts/
    │       ├── deploy.sh            ← Build → ECR push → ECS deploy
    │       └── migrate-db.sh        ← Run Flyway migrations
    └── localstack/
        └── setup.sh                 ← Create SQS queues locally
```

---

## Demo Credentials

Same as v1 (seeded by each service's DataInitializer):

| Role | Email | Password |
|---|---|---|
| Admin | `demo@college.com` | `Demo@123` |
| Student | `student@demo.com` | `Demo@123` |
| Faculty | `staff@demo.com` | `Demo@123` |
| Parent | `parent@demo.com` | `Demo@123` |
| Alumni | `alumni@demo.com` | `Demo@123` |
