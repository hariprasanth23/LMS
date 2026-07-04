#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# End-to-end smoke test.
#
# Assumes the stack is already up (via scripts/dev-up.sh). Runs the paths
# that have historically broken: login response shape, JWT cookie handling,
# gateway routing, downstream Spring Page envelope unwrap.
#
# Exits non-zero on the first failure. Suitable for CI.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

GATEWAY="${GATEWAY:-http://localhost:8080}"
COOKIE=$(mktemp)
trap 'rm -f "$COOKIE"' EXIT

c_ok()   { printf "\033[32m ✓ %s\033[0m\n" "$*"; }
c_fail() { printf "\033[31m ✗ %s\033[0m\n" "$*"; exit 1; }
c_hdr()  { printf "\n\033[1;36m═══ %s ═══\033[0m\n" "$*"; }

expect_field() {
  local body=$1 field=$2 label=$3
  if echo "$body" | python3 -c "
import sys, json
try:
    d = json.loads(sys.stdin.read())
    v = d
    for part in '$field'.split('.'):
        v = v.get(part) if isinstance(v, dict) else None
        if v is None: sys.exit(1)
    print(v)
except Exception:
    sys.exit(1)
" >/dev/null 2>&1; then
    c_ok "$label"
  else
    c_fail "$label — response was: $body"
  fi
}

# ── 1. Gateway health ──────────────────────────────────────────────────────
c_hdr "Gateway"
health=$(curl -s -m 5 "$GATEWAY/actuator/health")
[[ "$health" == *'"status":"UP"'* ]] \
  && c_ok "gateway /actuator/health = UP" \
  || c_fail "gateway health check failed: $health"

# ── 2. Anonymous register (should always create STUDENT) ───────────────────
c_hdr "Anonymous register"
STAMP=$(date +%s)
EMAIL="e2e-$STAMP@sample.edu"
body=$(curl -s -X POST "$GATEWAY/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"E2E $STAMP\",\"email\":\"$EMAIL\",\"password\":\"Demo@123\"}")

expect_field "$body" "data.user.role" "user created"
role=$(echo "$body" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['user']['role'])")
[[ "$role" == "STUDENT" ]] \
  && c_ok "anonymous register defaulted to STUDENT" \
  || c_fail "role should have been STUDENT, was $role"

# Try to register as ADMIN anonymously — must be rejected
body=$(curl -s -X POST "$GATEWAY/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"E2E rogue\",\"email\":\"rogue-$STAMP@sample.edu\",\"password\":\"Demo@123\",\"role\":\"ADMIN\"}")
success=$(echo "$body" | python3 -c "import sys,json; print(json.load(sys.stdin)['success'])")
[[ "$success" == "False" ]] \
  && c_ok "anonymous request for role=ADMIN was rejected" \
  || c_fail "anonymous ADMIN registration should have failed"

# ── 3. Login as admin ──────────────────────────────────────────────────────
c_hdr "Admin login"
body=$(curl -s -c "$COOKIE" -X POST "$GATEWAY/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@sample.edu","password":"Demo@123"}')

expect_field "$body" "data.accessToken" "access token issued"
expect_field "$body" "data.refreshToken" "refresh token issued"
role=$(echo "$body" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['user']['role'])")
[[ "$role" == "ADMIN" ]] \
  && c_ok "logged in as ADMIN" \
  || c_fail "expected ADMIN role, got $role"

grep -q "lms_token" "$COOKIE" \
  && c_ok "lms_token cookie set" \
  || c_fail "no lms_token cookie in Set-Cookie"

# ── 4. Authenticated /api/auth/me ──────────────────────────────────────────
c_hdr "Authenticated identity"
body=$(curl -s -b "$COOKIE" "$GATEWAY/api/auth/me")
expect_field "$body" "data.email" "identity returned"

# ── 5. Downstream data via gateway ─────────────────────────────────────────
c_hdr "Downstream reads (via gateway)"

check_list() {
  local path=$1 min=$2
  local body count
  body=$(curl -s -b "$COOKIE" "$GATEWAY$path")
  count=$(echo "$body" | python3 -c "
import sys, json
d = json.load(sys.stdin)['data']
if isinstance(d, list): print(len(d))
elif isinstance(d, dict) and 'content' in d: print(len(d['content']))
else: print(-1)
")
  [[ "$count" -ge "$min" ]] \
    && c_ok "$path returned $count rows (>= $min)" \
    || c_fail "$path returned $count, expected >= $min"
}

check_list "/api/departments" 5
check_list "/api/courses"     10
check_list "/api/students"    5
check_list "/api/employees"   5

# ── 6. Admin lists all users, promotes one to FACULTY ──────────────────────
c_hdr "Admin operations"
body=$(curl -s -b "$COOKIE" "$GATEWAY/api/auth/admin/users")
count=$(echo "$body" | python3 -c "import sys,json; d=json.load(sys.stdin)['data']; print(len(d))" 2>/dev/null || echo -1)
[[ "$count" -ge 10 ]] \
  && c_ok "GET /admin/users returned $count users" \
  || c_fail "admin listing failed: $body"

# Find the anonymous STUDENT we just registered and promote them
victim_id=$(echo "$body" | python3 -c "
import sys, json
for u in json.load(sys.stdin)['data']:
    if u.get('email') == '$EMAIL': print(u['id']); break
")
[[ -n "$victim_id" ]] \
  && c_ok "found the freshly-registered user in admin list" \
  || c_fail "could not find $EMAIL in admin listing"

body=$(curl -s -b "$COOKIE" -X PUT "$GATEWAY/api/auth/admin/users/$victim_id/role" \
  -H "Content-Type: application/json" \
  -d '{"role":"FACULTY"}')
new_role=$(echo "$body" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['role'])" 2>/dev/null || echo "")
[[ "$new_role" == "FACULTY" ]] \
  && c_ok "admin promoted STUDENT → FACULTY" \
  || c_fail "role change failed: $body"

# ── Done ───────────────────────────────────────────────────────────────────
c_hdr "All checks passed"
