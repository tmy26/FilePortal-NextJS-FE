#!/usr/bin/env bash
# Blue-green roll-out of the File Portal web app. Nginx fronts the active slot
# (see scripts/nginx_web_upstream.sh).
#
# Prerequisites (once per machine):
#   - Docker + Compose plugin
#   - API reachable (public https URL or host.docker.internal — see README)
#   - .env with NEXT_PUBLIC_SITE_URL + API_BASE_URL
#   - Nginx site using upstream fileportal_web; passwordless sudo for upstream rewrite
#
# Usage (from the repo root on the server):
#   ./scripts/deploy.sh
#   ./scripts/deploy.sh --pull
#   ./scripts/deploy.sh --no-build
#   ./scripts/deploy.sh --rollback

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/deploy_lib.sh
source "$SCRIPT_DIR/deploy_lib.sh"

DO_PULL=0
DO_BUILD=1
DO_ROLLBACK=0

usage() {
  cat <<'EOF'
Usage: ./scripts/deploy.sh [--pull] [--no-build] [--rollback] [-h|--help]

  --pull       git pull --ff-only before building
  --no-build   skip docker compose build (use the image already present)
  --rollback   start the previous slot (if present), switch Nginx back, stop current
  -h, --help   show this help

Blue-green: the idle slot is built/started and health-checked on :3001/:3002.
Nginx switches only after / succeeds; the previous active slot is then stopped.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pull) DO_PULL=1 ;;
    --no-build) DO_BUILD=0 ;;
    --rollback) DO_ROLLBACK=1 ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      echo "error: unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
  shift
done

require_command docker
require_command git
require_command curl

cd "$REPO_ROOT"

if [[ "$DO_PULL" -eq 1 ]]; then
  echo "==> git pull --ff-only"
  git pull --ff-only
fi

load_dotenv
require_api_base_url_for_host
require_public_site_url

echo "==> docker compose config (sanity)"
compose config --quiet

switch_nginx() {
  local port="$1"
  echo "==> nginx upstream → 127.0.0.1:${port}"
  "$SCRIPT_DIR/nginx_web_upstream.sh" "$port"
}

promote_slot() {
  local new_slot="$1"
  local old_slot="$2"
  local new_port
  new_port="$(slot_port "$new_slot")"

  switch_nginx "$new_port"
  write_active_slot "$new_slot"

  if [[ -n "$old_slot" ]] && slot_is_running "$old_slot"; then
    echo "==> stopping previous slot: $(slot_service "$old_slot")"
    compose stop "$(slot_service "$old_slot")"
  fi

  echo "deploy ok: active=${new_slot} port=${new_port}"
  compose ps
}

if [[ "$DO_ROLLBACK" -eq 1 ]]; then
  active="$(read_active_slot)"
  previous="$(other_slot "$active")"
  prev_service="$(slot_service "$previous")"
  prev_port="$(slot_port "$previous")"

  echo "==> rollback: active=${active} → ${previous}"

  if [[ "$DO_BUILD" -eq 1 ]]; then
    echo "==> docker compose build (shared image)"
    compose_build
  fi

  echo "==> starting ${prev_service}"
  compose up -d --no-deps "$prev_service"

  echo "==> waiting for http://127.0.0.1:${prev_port}/"
  if ! wait_for_health "http://127.0.0.1:${prev_port}/"; then
    echo "error: rollback target did not become healthy within ~60s" >&2
    compose logs --tail=80 "$prev_service" >&2 || true
    exit 1
  fi

  promote_slot "$previous" "$active"
  exit 0
fi

active="$(read_active_slot)"
idle="$(other_slot "$active")"
idle_service="$(slot_service "$idle")"
idle_port="$(slot_port "$idle")"

# First boot: nothing running and no slot file yet → start blue as active.
if [[ ! -f "$ACTIVE_SLOT_FILE" ]] && ! slot_is_running blue && ! slot_is_running green; then
  echo "==> bootstrap: no active slot yet — bringing up web-blue"

  if [[ "$DO_BUILD" -eq 1 ]]; then
    echo "==> docker compose build"
    compose_build
  fi

  echo "==> docker compose up -d --no-deps web-blue"
  compose up -d --no-deps web-blue

  echo "==> waiting for http://127.0.0.1:3001/"
  if ! wait_for_health "http://127.0.0.1:3001/"; then
    echo "error: web-blue did not become healthy within ~60s" >&2
    compose logs --tail=80 web-blue >&2 || true
    exit 1
  fi

  promote_slot blue ""
  exit 0
fi

echo "==> blue-green: active=${active} idle=${idle}"

if [[ "$DO_BUILD" -eq 1 ]]; then
  echo "==> docker compose build"
  compose_build
fi

echo "==> starting idle slot ${idle_service} on :${idle_port}"
compose up -d --no-deps --force-recreate "$idle_service"

echo "==> waiting for http://127.0.0.1:${idle_port}/"
if ! wait_for_health "http://127.0.0.1:${idle_port}/"; then
  echo "error: idle slot ${idle} did not become healthy within ~60s — keeping active=${active}" >&2
  compose logs --tail=80 "$idle_service" >&2 || true
  echo "==> stopping failed idle slot"
  compose stop "$idle_service" || true
  exit 1
fi

promote_slot "$idle" "$active"
