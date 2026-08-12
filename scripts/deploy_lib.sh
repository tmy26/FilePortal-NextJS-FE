#!/usr/bin/env bash
# Shared deploy helpers. Sourced by scripts/deploy.sh — not meant to be run alone.
#
# Guards exist so a laptop-style API_BASE_URL / NEXT_PUBLIC_SITE_URL never ships
# to production.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_DIR="$REPO_ROOT/.deploy"
ACTIVE_SLOT_FILE="$DEPLOY_DIR/active_slot"

FORBIDDEN_API_HOST_PATTERNS=(
  "://localhost"
  "://127.0.0.1"
)

require_command() {
  local name="$1"
  if ! command -v "$name" >/dev/null 2>&1; then
    echo "error: required command not found: $name" >&2
    return 1
  fi
}

load_dotenv() {
  local env_file="${1:-$REPO_ROOT/.env}"
  if [[ ! -f "$env_file" ]]; then
    echo "error: missing $env_file (copy .env.example and fill server values)" >&2
    return 1
  fi
  set -a
  # shellcheck disable=SC1090
  source "$env_file"
  set +a
}

require_api_base_url_for_host() {
  # Prefer server-only API_BASE_URL; fall back to NEXT_PUBLIC_API_BASE_URL (app accepts both).
  local url="${API_BASE_URL:-${NEXT_PUBLIC_API_BASE_URL:-}}"

  if [[ -z "$url" ]]; then
    echo "error: API_BASE_URL is unset in the environment / .env" >&2
    echo "       Expected something like:" >&2
    echo "         API_BASE_URL=http://host.docker.internal:8001" >&2
    echo "       Common mistakes:" >&2
    echo "         NEXT_PUBLICAPI_BASE_URL  ← missing underscore (wrong)" >&2
    echo "         NEXT_PUBLIC_API_BASE_URL ← works as fallback, but prefer API_BASE_URL" >&2
    if [[ -n "${NEXT_PUBLICAPI_BASE_URL:-}" ]]; then
      echo "       Found typo NEXT_PUBLICAPI_BASE_URL=${NEXT_PUBLICAPI_BASE_URL}" >&2
      echo "       Rename it to API_BASE_URL=..." >&2
    fi
    return 1
  fi

  # Keep both names in sync for compose / Next runtime.
  export API_BASE_URL="$url"

  local pattern
  for pattern in "${FORBIDDEN_API_HOST_PATTERNS[@]}"; do
    if [[ "$url" == *"$pattern"* ]]; then
      echo "error: API_BASE_URL must not use '${pattern#://}' from inside Docker on the server." >&2
      echo "       Prefer the public API origin, e.g. https://api.example.com" >&2
      echo "       or host.docker.internal to reach Nginx/API on the Docker host." >&2
      return 1
    fi
  done

  # Accept public https API (recommended with be blue-green) or host.docker.internal.
  if [[ "$url" == https://* ]]; then
    return 0
  fi
  if [[ "$url" == *"host.docker.internal"* ]]; then
    return 0
  fi

  echo "error: API_BASE_URL must be https://… or use host.docker.internal on the server." >&2
  echo "       got: $url" >&2
  return 1
}

require_public_site_url() {
  local url="${NEXT_PUBLIC_SITE_URL:-}"
  if [[ -z "$url" ]]; then
    echo "error: NEXT_PUBLIC_SITE_URL is unset in the environment / .env" >&2
    echo "       Set the public origin, e.g. https://portal.tmytuned.com" >&2
    return 1
  fi
  if [[ "$url" == *"localhost"* || "$url" == *"127.0.0.1"* ]]; then
    echo "error: NEXT_PUBLIC_SITE_URL looks like a local URL: $url" >&2
    echo "       Use the public https origin on the server." >&2
    return 1
  fi
  # Catch unfinished template values from docs (Cyrillic “ТВОЯ…”, YOUR_VPS_IP, etc.).
  if [[ "$url" == *"ТВОЯ"* || "$url" == *"YOUR_"* ]]; then
    echo "error: NEXT_PUBLIC_SITE_URL still looks like a placeholder: $url" >&2
    echo "       Replace it with your real VPS IP or domain, e.g.:" >&2
    echo "         NEXT_PUBLIC_SITE_URL=http://203.0.113.10:3001" >&2
    echo "         NEXT_PUBLIC_SITE_URL=https://portal.tmytuned.com" >&2
    return 1
  fi
}

compose() {
  docker compose -f "$REPO_ROOT/docker-compose.yml" "$@"
}

slot_service() {
  local slot="$1"
  echo "web-${slot}"
}

slot_port() {
  case "$1" in
    blue) echo 3001 ;;
    green) echo 3002 ;;
    *)
      echo "error: unknown slot: $1 (expected blue|green)" >&2
      return 1
      ;;
  esac
}

other_slot() {
  case "$1" in
    blue) echo green ;;
    green) echo blue ;;
    *)
      echo "error: unknown slot: $1 (expected blue|green)" >&2
      return 1
      ;;
  esac
}

read_active_slot() {
  if [[ -f "$ACTIVE_SLOT_FILE" ]]; then
    local slot
    slot="$(tr -d '[:space:]' <"$ACTIVE_SLOT_FILE")"
    case "$slot" in
      blue | green) echo "$slot" ;;
      *)
        echo "error: invalid active slot in $ACTIVE_SLOT_FILE: '$slot'" >&2
        return 1
        ;;
    esac
  else
    echo blue
  fi
}

write_active_slot() {
  local slot="$1"
  case "$slot" in
    blue | green) ;;
    *)
      echo "error: cannot write unknown slot: $slot" >&2
      return 1
      ;;
  esac
  mkdir -p "$DEPLOY_DIR"
  echo "$slot" >"$ACTIVE_SLOT_FILE"
}

slot_is_running() {
  local service
  service="$(slot_service "$1")"
  local id
  id="$(compose ps -q "$service" 2>/dev/null || true)"
  [[ -n "$id" ]]
}

wait_for_health() {
  local url="$1"
  local attempts="${2:-30}"
  local i
  for i in $(seq 1 "$attempts"); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done
  return 1
}

compose_build() {
  compose build \
    --build-arg "NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}" \
    --build-arg "NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID:-}"
}
