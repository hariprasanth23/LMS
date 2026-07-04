# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

The legacy Spring Boot monolith has been retired. All backend work now lives in `backend/` (13 microservices). See `backend/CLAUDE.md` for backend-specific guidance.

## Commands

### Backend (Spring Boot microservices — run from `backend/`)

```bash
# All services + infra via Docker Compose
cd backend
cp .env.example .env   # fill in JWT_SECRET at minimum
docker-compose up --build

# Run a single service locally
cd backend/<service-name>
./gradlew bootRun --args='--spring.profiles.active=local'

# Build / test a single service
./gradlew build
./gradlew test
```

The 13 services: `gateway` (8080), `auth` (8081), `users` (8082), `courses` (8083), `exams` (8084), `attendance` (8085), `finance` (8086), `hr` (8087), `notifications` (8088), `academics` (8089), `feedback` (8090), `research` (8091), `student-services` (8092).

### Frontend (React/Vite — run from `frontend/`)

```bash
npm install
npm run dev      # dev server on :5173
npm run build    # production build
npm run preview  # preview production build
```

### Database setup

Each backend service owns its own PostgreSQL database (`lms_auth_db`, `lms_user_db`, …). Schema is managed via Flyway — never `ddl-auto`. Compose spins up Postgres, Redis, and LocalStack automatically.

### Demo credentials (seeded by auth on first run)

| Role | Email | Password |
|---|---|---|
| Admin | `demo@college.com` | `Demo@123` |
| Student | `student@demo.com` | `Demo@123` |
| Faculty | `staff@demo.com` | `Demo@123` |
| Parent | `parent@demo.com` | `Demo@123` |
| Alumni | `alumni@demo.com` | `Demo@123` |

---

## Architecture

### Request lifecycle

```
React SPA (:5173)
  → Axios (lms_token httpOnly cookie, baseURL: /api)
  → Vite dev proxy (/api → :8080)
  → gateway (validates JWT, injects X-User-Id / X-User-Role)
  → downstream @RestController (reads identity from headers)
  → @Service → @Repository → per-service PostgreSQL
```

### Backend layout

Each service under `backend/<service>/` is a self-contained Gradle project: `build.gradle`, `Dockerfile`, `src/main/resources/application.yml`, one `Application.java`, Flyway migrations under `src/main/resources/db/migration/`.

Per-service package layout:

```
controller/   @RestController — HTTP mapping only, reads X-User-Id from header
service/      Business logic, @Transactional
repository/   Spring Data JPA interfaces (often bundled in *Repositories.java)
model/        @Entity classes (often bundled in Entities.java)
common/       ApiResponse, error handling — copied per-service, not a shared lib
```

### Security model

- `gateway` is the only service that parses/validates JWTs. It reads the `lms_token` httpOnly cookie and injects `X-User-Id` + `X-User-Role` headers downstream.
- Downstream services never re-parse the JWT — they trust the gateway headers.
- The `/api/auth/**` route bypasses `JwtAuthFilter` at the gateway (public).
- HMAC-SHA256 (`X-Internal-Ts` + `X-Internal-Sig`) signs internal gateway→service calls.
- Redis caches the JWT revocation denylist; ShedLock serialises the cleanup `@Scheduled` job across auth replicas.

### Auth state (frontend)

`AuthContext.jsx` is the single source of truth for auth state. It:
- Stores the user object + portal type in `localStorage`; the JWT lives in the `lms_token` httpOnly cookie set by auth.
- Runs a 15-minute inactivity timer that auto-logs-out the user.
- Exposes `{ user, portalType, login, logout, isAuthenticated }` via `useAuth()`.

`api.js` is the pre-configured Axios instance with `withCredentials: true`. Its response interceptor redirects to `/auth/login` on 401.

### Frontend routing

All 60+ routes are declared in `App.jsx`. Routes are nested inside a `<Layout>` component except for auth and landing pages. The `portalType` from `AuthContext` drives which portal-specific view is rendered.

### Database isolation

There are no cross-database foreign keys. When a service needs data owned by another, it either makes a synchronous Feign call to `/internal/**` or stores only the UUID reference. Feign URLs come from `services.<target>.url` in `application.yml`.

### Async events (SQS)

`notifications` is the only SQS consumer. Other services publish events to queues (`lms-payment-done`, `lms-leave-approved`, etc.); they never call notifications directly. LocalStack simulates SQS locally.

### API response convention

All endpoints return `ApiResponse<T>`:

```json
{ "success": true, "message": "...", "data": { ... }, "timestamp": "..." }
```

`ApiResponse` is defined per-service in `src/main/java/com/lms/<service>/common/ApiResponse.java` — not a shared library.
