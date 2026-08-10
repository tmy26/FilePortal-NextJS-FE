#!/usr/bin/env bash
# Shared deploy helpers. Sourced by scripts/deploy.sh — not meant to be run alone.
#
# Guards exist so a laptop-style API_BASE_URL never ships to the server:
# the web container must reach the API via host.docker.internal, not localhost.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

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
  local url="${API_BASE_URL:-}"
  if [[ -z "$url" ]]; then
    echo "error: API_BASE_URL is unset in the environment / .env" >&2
    return 1
  fi

  local pattern
  for pattern in "${FORBIDDEN_API_HOST_PATTERNS[@]}"; do
    if [[ "$url" == *"$pattern"* ]]; then
      echo "error: API_BASE_URL must not use '${pattern#://}' from inside Docker on the server." >&2
      echo "       Use host.docker.internal so the container reaches the host API, e.g.:" >&2
      echo "       API_BASE_URL=http://host.docker.internal:8000" >&2
      return 1
    fi
  done

  if [[ "$url" != *"host.docker.internal"* ]]; then
    echo "error: API_BASE_URL must target host.docker.internal on the server." >&2
    echo "       got: $url" >&2
    return 1
  fi
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
}

compose() {
  docker compose -f "$REPO_ROOT/docker-compose.yml" "$@"
}
