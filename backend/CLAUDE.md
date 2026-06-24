# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

### Run a single service locally (from its directory)

```bash
cd <service-name>
./gradlew bootRun --args='--spring.profiles.active=local'
```

Each service needs a running Postgres database. Start infrastructure first:

```bash
docker-compose up postgres redis localstack
```

### Build a service

```bash
cd <service-name>
./gradlew build
```

### Run tests for a service

```bash
cd <service-name>
./gradlew test

# Single test class
./gradlew test --tests "com.lms.auth.AuthServiceTest"
```

Tests use Testcontainers (spins up a real Postgres container). Docker must be running.

### Start everything with Docker Compose

```bash
cp .env.example .env   # fill in JWT_SECRET at minimum
docker-compose up --build
```

### Deploy a single service to ECS (requires AWS credentials)

```bash
./infra/aws/scripts/deploy.sh auth-service [optional-tag]
./infra/aws/scripts/deploy-all.sh           # deploys all 13 services in order
```

### Run Flyway migrations manually

```bash
cd <service-name>
./gradlew flywayMigrate -Dflyway.url=jdbc:postgresql://localhost:5432/<db-name> \
  -Dflyway.user=lmsadmin -Dflyway.password=changeme
```

---

## Architecture

### Monorepo of 13 independent Spring Boot services

```
api-gateway/        → Spring Cloud Gateway (port 8080) — single entry point
auth-service/       → JWT issuance, user auth (port 8081)
user-service/       → Students, employees, departments (port 8082)
course-service/     → Courses, assignments, quizzes, enrollments (port 8083)
examination-service/→ Exam schedules, marks, grades, arrears (port 8084)
attendance-service/ → Student and employee attendance (port 8085)
finance-service/    → Fees, payments, wallet, refunds (port 8086)
hr-service/         → Leave requests and payroll (port 8087)
notification-service/ → In-app notifications + email via SQS consumers (port 8088)
academics-service/  → MOOC, ECC, internship, conference registrations (port 8089)
feedback-service/   → Course and 24/7 feedback (port 8090)
research-service/   → Research profiles and weekly logs (port 8091)
student-services/   → Bonafide, library, health feedback (port 8092)
```

Each service is a self-contained Gradle project: `build.gradle`, `Dockerfile`, `src/main/resources/application.yml`, one `Application.java` entry point, and Flyway migrations under `src/main/resources/db/migration/`.

### JWT and user identity

The `api-gateway` validates the JWT from the `lms_token` **httpOnly cookie** on every protected request. It does not forward the cookie downstream — instead it injects two headers:

```
X-User-Id:   <uuid>
X-User-Role: ROLE_STUDENT
```

Downstream controllers read identity exclusively from these headers, never from the cookie or a re-parsed JWT:

```java
@GetMapping("/me")
public ResponseEntity<ApiResponse<UserDto>> me(@RequestHeader("X-User-Id") String userId) { ... }
```

Never add JWT parsing logic inside a downstream service. Only `api-gateway` and `auth-service` touch the JWT.

### Database isolation

Each service has its own PostgreSQL database (`lms_auth_db`, `lms_user_db`, …). There are no cross-database foreign keys. When a service needs data owned by another service, it either:
- Makes a synchronous **Feign client** call to that service's `/internal/**` endpoint, or
- Stores only the **UUID reference** and resolves it lazily via Feign.

Feign client URL comes from `services.<target>.url` in `application.yml`, defaulting to `http://localhost:<port>`.

### Async events via SQS

`notification-service` is the sole SQS consumer. Other services publish events to queues (`lms-payment-done`, `lms-leave-approved`, etc.) and never call `notification-service` directly. LocalStack simulates SQS locally; `infra/localstack/setup.sh` creates the queues on container start.

### Schema migrations

All schema changes go through **Flyway**. Never use `ddl-auto=create` or `ddl-auto=update`. New migration files are named `V2__description.sql`, `V3__description.sql`, etc. Existing migration files must not be edited once applied.

### API response envelope

All endpoints return `ApiResponse<T>`:

```json
{ "success": true, "message": "...", "data": { ... }, "timestamp": "..." }
```

`ApiResponse` is defined per-service in `src/main/java/com/lms/<service>/common/ApiResponse.java`. It is not a shared library — each service has its own copy.

### Route ownership (api-gateway)

Prefix → service mapping lives in `api-gateway/src/main/resources/application.yml`. If you add a new controller path in a downstream service, add the corresponding route predicate there too. The `/api/auth/**` route has no `JwtAuthFilter` (public); all others require it.

---

## Environment

Minimum `.env` to run locally:

```
JWT_SECRET=any-string-at-least-32-characters-long
POSTGRES_USER=lmsadmin
POSTGRES_PASSWORD=changeme
```

In production, all secrets come from **AWS Secrets Manager** paths like `/lms/prod/auth-service-db`. The ECS task definitions in `infra/aws/ecs/task-definitions/` reference these paths — update `ACCOUNT_ID` and image URIs before registering them.
