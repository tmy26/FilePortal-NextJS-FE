#!/usr/bin/env bash
# Self-check for scripts/deploy_lib.sh — run from CI or locally:
#   ./scripts/check_deploy_guards.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/deploy_lib.sh
source "$SCRIPT_DIR/deploy_lib.sh"

pass=0
fail=0

expect_api_fail() {
  local label="$1"
  local url="$2"
  if API_BASE_URL="$url" require_api_base_url_for_host 2>/dev/null; then
    echo "FAIL: expected rejection for $label ($url)"
    fail=$((fail + 1))
  else
    echo "ok: rejected $label"
    pass=$((pass + 1))
  fi
}

expect_api_ok() {
  local label="$1"
  local url="$2"
  if API_BASE_URL="$url" require_api_base_url_for_host; then
    echo "ok: accepted $label"
    pass=$((pass + 1))
  else
    echo "FAIL: expected accept for $label ($url)"
    fail=$((fail + 1))
  fi
}

expect_site_fail() {
  local label="$1"
  local url="$2"
  if NEXT_PUBLIC_SITE_URL="$url" require_public_site_url 2>/dev/null; then
    echo "FAIL: expected rejection for $label ($url)"
    fail=$((fail + 1))
  else
    echo "ok: rejected $label"
    pass=$((pass + 1))
  fi
}

expect_site_ok() {
  local label="$1"
  local url="$2"
  if NEXT_PUBLIC_SITE_URL="$url" require_public_site_url; then
    echo "ok: accepted $label"
    pass=$((pass + 1))
  else
    echo "FAIL: expected accept for $label ($url)"
    fail=$((fail + 1))
  fi
}

expect_api_fail "api localhost" "http://localhost:8000"
expect_api_fail "api loopback" "http://127.0.0.1:8000"
expect_api_fail "api plain http host" "http://api.example.com"
expect_api_ok "api host gateway" "http://host.docker.internal:8001"
expect_api_ok "api public https" "https://api.example.com"

expect_site_fail "site localhost" "http://localhost:3000"
expect_site_ok "site public https" "https://portal.example.com"

echo
echo "$pass passed, $fail failed"
[[ "$fail" -eq 0 ]]
