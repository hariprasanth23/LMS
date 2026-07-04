#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Local dev startup. Brings up the full stack:
#   - Colima (if not already running)
#   - Postgres + Redis + LocalStack (via docker-compose)
#   - All 13 Spring Boot services (via `./gradlew bootRun`)
#   - Frontend (via `npm run dev`)
#
# Handles the two things that have burned this project before:
#   1. rogue non-Docker processes bound to our host ports
#   2. Postgres 5432 collision with native PostgreSQL installs
#
# Usage:
#   ./scripts/dev-up.sh              # full stack, native bootRun services
#   ./scripts/dev-up.sh --docker     # everything in Docker (no bootRun)
#   ./scripts/dev-up.sh --frontend-only
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"
LOGS="/tmp/lms-logs"
ENVFILE="/tmp/lms-bootrun.env"
mkdir -p "$LOGS"

MODE="${1:-native}"

# ── Colors for output ──────────────────────────────────────────────────────
c_ok()   { printf "\033[32m%s\033[0m\n" "$*"; }
c_warn() { printf "\033[33m%s\033[0m\n" "$*"; }
c_err()  { printf "\033[31m%s\033[0m\n" "$*"; }
c_hdr()  { printf "\n\033[1;36m═══ %s ═══\033[0m\n" "$*"; }

# ── 1. Check for rogue processes on our ports ──────────────────────────────
check_port() {
  local port=$1 svc=$2
  local pid_info
  pid_info=$(lsof -iTCP:"$port" -sTCP:LISTEN -P -n 2>/dev/null | tail -n +2 | head -1 || true)
  if [ -n "$pid_info" ]; then
    local proc pid
    proc=$(echo "$pid_info" | awk '{print $1}')
    pid=$(echo "$pid_info" | awk '{print $2}')
    # Docker's port forwarding shows up under the `docker-pr` or `com.docker` names
    # OR under vpnkit/colima — treat those as OK.
    if echo "$proc" | grep -qE "docker|com\.dock|vpnkit|colima|qemu"; then
      return 0
    fi
    c_err "  ✗ port $port ($svc) is held by non-Docker: $proc (PID $pid)"
    ps -p "$pid" -o command= 2>/dev/null | head -c 120 | sed 's|^|      |'; echo
    return 1
  fi
  return 0
}

c_hdr "1. Port collision check"
FAIL=0
for entry in 8080:gateway 8081:auth 8082:users 8083:courses 8084:exams \
             8085:attendance 8086:finance 8087:hr 8088:notifications \
             8089:academics 8090:feedback 8091:research 8092:student-services \
             5173:vite 6379:redis; do
  check_port "${entry%:*}" "${entry#*:}" || FAIL=1
done

# Postgres is special: native PG installs commonly own :5432.
POSTGRES_HOST_PORT=5432
if lsof -iTCP:5432 -sTCP:LISTEN -P -n >/dev/null 2>&1; then
  # See if it's a native PostgreSQL from a system launchd
  if ps -eo command= | grep -qE "^/Library/PostgreSQL|/usr/local/opt/postgresql"; then
    POSTGRES_HOST_PORT=5433
    c_warn "  ⚠ native PostgreSQL detected on :5432 — using :5433 for the compose Postgres"
    # Write an override compose file
    cat > "$BACKEND/docker-compose.override.yml" <<EOF
services:
  postgres:
    ports:
      - "$POSTGRES_HOST_PORT:5432"
EOF
  fi
fi

if [ $FAIL -eq 1 ]; then
  c_err "One or more ports blocked. Kill the offending processes and re-run."
  exit 1
fi
c_ok "  ✓ all ports clear"

# ── 2. Colima ──────────────────────────────────────────────────────────────
c_hdr "2. Docker runtime"
if ! colima status >/dev/null 2>&1; then
  c_warn "  starting Colima…"
  colima start --cpu 4 --memory 6 --disk 20 >/dev/null 2>&1 || { c_err "colima start failed"; exit 1; }
fi
# make sure the Docker CLI is pointed at Colima, not Docker Desktop
docker context use colima >/dev/null 2>&1 || true
c_ok "  ✓ Colima running, Docker CLI on colima context"

# ── 3. Infra (Postgres + Redis + LocalStack) ───────────────────────────────
c_hdr "3. Infrastructure containers"
cd "$BACKEND"
docker compose up -d postgres redis localstack >/dev/null 2>&1
c_ok "  ✓ postgres/redis/localstack up"

# Wait for Postgres to be reachable + healthy
for i in {1..30}; do
  if docker compose exec -T postgres pg_isready -U lmsadmin >/dev/null 2>&1; then
    c_ok "  ✓ postgres accepting connections after ${i}s"
    break
  fi
  sleep 1
done

# ── 4. Backend services ────────────────────────────────────────────────────
if [ "$MODE" = "--docker" ]; then
  c_hdr "4. Backend (Docker mode)"
  docker compose up -d --build >/dev/null 2>&1
  c_ok "  ✓ 13 service containers up"
elif [ "$MODE" != "--frontend-only" ]; then
  c_hdr "4. Backend (native bootRun mode)"

  # Build the shared env file
  python3 <<PY > "$ENVFILE"
env = {}
for line in open("$BACKEND/.env"):
    line = line.strip()
    if line.startswith("#") or "=" not in line: continue
    k, _, v = line.partition("=")
    env[k.strip()] = v.strip()

print(f"JWT_SECRET={env.get('JWT_SECRET', 'set-me')}")
print(f"INTERNAL_SECRET={env.get('INTERNAL_SECRET', 'set-me')}")
print("INTERNAL_ENFORCE=true")
print("AWS_REGION=us-east-1")
print("AWS_ACCESS_KEY_ID=test")
print("AWS_SECRET_ACCESS_KEY=test")
print("REDIS_HOST=localhost")
print("REDIS_PORT=6379")
print("FRONTEND_URL=http://localhost:5173")
print("SPRING_PROFILES_ACTIVE=local")
print("JWT_ISSUER=lms-auth-service")
print("JWT_AUDIENCE=lms-gateway")
print("JWT_CLOCK_SKEW=30")
print("COOKIE_SECURE=false")
for name, port in [("AUTH", 8081), ("USER", 8082), ("COURSE", 8083),
                   ("EXAM", 8084), ("ATTENDANCE", 8085), ("FINANCE", 8086),
                   ("HR", 8087), ("NOTIFICATION", 8088), ("ACADEMICS", 8089),
                   ("FEEDBACK", 8090), ("RESEARCH", 8091),
                   ("STUDENT_SERVICES", 8092)]:
    print(f"{name}_SERVICE_URL=http://localhost:{port}")
PY

  # Kill any stragglers from previous runs
  pkill -f "gradle.*bootRun" 2>/dev/null || true
  sleep 2

  # Start each service
  services=(
    "gateway:8080:"
    "auth:8081:lms_auth_db"
    "users:8082:lms_user_db"
    "courses:8083:lms_course_db"
    "exams:8084:lms_exam_db"
    "attendance:8085:lms_attendance_db"
    "finance:8086:lms_finance_db"
    "hr:8087:lms_hr_db"
    "notifications:8088:lms_notification_db"
    "academics:8089:lms_academics_db"
    "feedback:8090:lms_feedback_db"
    "research:8091:lms_research_db"
    "student-services:8092:lms_services_db"
  )

  for entry in "${services[@]}"; do
    svc="${entry%%:*}"
    rest="${entry#*:}"
    port="${rest%%:*}"
    db="${rest#*:}"
    log="$LOGS/${svc}.log"
    (
      set -a
      # shellcheck disable=SC1090
      . "$ENVFILE"
      export DB_URL="jdbc:postgresql://localhost:${POSTGRES_HOST_PORT}/${db}"
      export DB_USERNAME=lmsadmin
      export DB_PASSWORD=changeme
      export SERVER_PORT="$port"
      cd "$BACKEND/$svc"
      nohup ./gradlew bootRun --no-daemon -q > "$log" 2>&1 &
      echo $! > "$LOGS/${svc}.pid"
    )
    echo "  → $svc :$port  (log: $log)"
  done

  c_ok "  ✓ 13 bootRun processes kicked off — startup takes ~60–90s in parallel"
fi

# ── 5. Frontend ────────────────────────────────────────────────────────────
c_hdr "5. Frontend (Vite)"
cd "$FRONTEND"
[ ! -d node_modules ] && npm install >/dev/null 2>&1
pkill -f "vite" 2>/dev/null || true
sleep 1
nohup npm run dev > "$LOGS/vite.log" 2>&1 &
echo $! > "$LOGS/vite.pid"
c_ok "  ✓ vite starting on http://localhost:5173"

# ── 6. Wait for readiness ──────────────────────────────────────────────────
if [ "$MODE" != "--frontend-only" ]; then
  c_hdr "6. Waiting for gateway to answer"
  for i in {1..60}; do
    if curl -s -o /dev/null -m 2 http://localhost:8080/actuator/health 2>/dev/null; then
      c_ok "  ✓ gateway ready after ${i}s"
      break
    fi
    sleep 2
  done
fi

# ── Done ───────────────────────────────────────────────────────────────────
c_hdr "Ready"
cat <<EOF
  Frontend:  http://localhost:5173
  Gateway:   http://localhost:8080
  Postgres:  localhost:${POSTGRES_HOST_PORT}  (user lmsadmin / password changeme)

  Demo accounts (password Demo@123):
    admin@sample.edu           ADMIN
    faculty1@sample.edu … faculty5@sample.edu   FACULTY
    student1@sample.edu … student5@sample.edu   STUDENT
    parent1@sample.edu                          PARENT

  Logs:      tail -f $LOGS/<service>.log
  Stop all:  ./scripts/dev-down.sh
EOF
