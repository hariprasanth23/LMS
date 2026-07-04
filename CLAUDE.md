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

---

## Troubleshooting

Everything below has bitten this project at least once.

### `/api/**` returns `404 "No static resource api/..."` from the browser or a device

Something on the host is bound to port 8080 *before* Docker forwards it. Almost always a stale Java process from a sibling `Project N/` workspace whose gateway is still running under launchd or a leftover Colima session.

```bash
lsof -i :8080 -P | grep LISTEN
# If the process is NOT `com.docker.backend` / `docker-proxy` / `vpnkit`, kill it:
kill -9 <PID>
docker compose restart gateway
```

`scripts/dev-up.sh` does this check automatically and refuses to start if any of `:5173, :6379, :8080-:8092` is held by a non-Docker process.

### Backend can't start Postgres — `bind: address already in use` on 5432

A native PostgreSQL install owns the port. The EnterpriseDB installer drops `/Library/LaunchDaemons/postgresql-XX.plist` which starts a postmaster on boot. Symptoms:

- `docker compose up postgres` fails with the bind error
- `lsof -i :5432` returns empty (the daemon runs as user `postgres` and lsof needs sudo)
- `ps aux | grep -E '/Library/PostgreSQL'` finds `postgres -D /Library/PostgreSQL/XX/data`

Either stop the native install:

```bash
sudo launchctl unload -w /Library/LaunchDaemons/postgresql-*.plist
```

…or let `scripts/dev-up.sh` detect it and publish Colima's Postgres on **5433** via an auto-generated `backend/docker-compose.override.yml`. Services connect via `DB_URL=jdbc:postgresql://localhost:5433/...` in that case.

### `docker compose` talks to Docker Desktop instead of Colima

If you have Docker Desktop installed, its context becomes the default (`desktop-linux`) and every `docker compose up` runs there instead of Colima. Symptom: `docker compose ps` shows nothing but the containers are actually running elsewhere.

```bash
docker context ls           # look for the `*` next to `desktop-linux`
docker context use colima   # pin the CLI to Colima
```

### Login screen returns 400 with `"must not be blank"` for every field

The `AuthContext` on the SPA is destructuring the login response with the old (v1 monolith) shape. `data.user.role` moved and the interceptor needs to unwrap Spring `Page<T>` responses. If you touched `frontend/src/services/api.js` or `frontend/src/context/AuthContext.jsx`, re-verify the interceptor keeps `res.data.data` as a flat array for paged endpoints.

### All admin pages render as empty tables

Spring `Page<T>` envelope isn't being unwrapped. Check `frontend/src/services/api.js` — the response interceptor should transform `{ data: { content: [...], pageable: {...} } }` into `{ data: [...], pageMeta: {...} }` before hitting any page component.

### Fresh clone but no data anywhere

Two things need to run in order:

1. `auth/DemoDataSeeder` runs on auth-service startup and inserts 12 demo users with deterministic UUIDs. Enabled by default; disable in prod with `app.demo-seed.enabled=false`.
2. `backend/infra/db/seed-demo-data.sql` inserts departments, students, employees, courses, leave balances (referencing the same UUIDs). Auto-run by `scripts/dev-up.sh` after all services report healthy. Manual run:

    ```bash
    docker compose exec -T postgres psql -U lmsadmin -f /docker-entrypoint-initdb.d/02-seed.sql
    ```

### Everything hangs and IntelliJ won't compile

You're probably out of memory. 13 Spring Boot `bootRun` processes + Colima's 6 GB VM + the IDE + Chrome + Docker Desktop is easily 25 GB of memory pressure. Either kill Docker Desktop or run in `--docker` mode where only Colima's memory is used.

## Useful one-liners

```bash
# tail every backend service log at once
tail -f /tmp/lms-logs/*.log

# get a JWT cookie for scripting
curl -c /tmp/lms.cookies -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"identifier":"admin@sample.edu","password":"Demo@123"}'

# run the smoke test
./scripts/e2e-smoke.sh
```
