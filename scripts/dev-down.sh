#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Stop everything that dev-up.sh started.
#
# Usage:
#   ./scripts/dev-down.sh              # stop services + containers, keep DB volume
#   ./scripts/dev-down.sh --wipe       # also delete DB volume (clean slate)
#   ./scripts/dev-down.sh --colima     # also stop the Colima VM
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND="$ROOT/backend"

c_ok()  { printf "\033[32m%s\033[0m\n" "$*"; }
c_hdr() { printf "\n\033[1;36m═══ %s ═══\033[0m\n" "$*"; }

c_hdr "1. Native bootRun processes"
if pgrep -f "gradle.*bootRun" > /dev/null; then
  pkill -f "gradle.*bootRun"
  c_ok "  ✓ killed gradle bootRun processes"
else
  c_ok "  ✓ (none running)"
fi

c_hdr "2. Vite dev server"
if pgrep -f "vite" > /dev/null; then
  pkill -f "vite"
  c_ok "  ✓ killed vite"
else
  c_ok "  ✓ (none running)"
fi

c_hdr "3. Docker containers"
cd "$BACKEND"
docker context use colima >/dev/null 2>&1 || true
if [ "${1:-}" = "--wipe" ]; then
  docker compose down -v 2>&1 | tail -5
  c_ok "  ✓ containers + DB volume removed"
else
  docker compose down 2>&1 | tail -5
  c_ok "  ✓ containers stopped (DB volume kept)"
fi

if [ "${1:-}" = "--colima" ] || [ "${2:-}" = "--colima" ]; then
  c_hdr "4. Colima VM"
  colima stop
  c_ok "  ✓ Colima stopped"
fi

echo
c_ok "Done."
