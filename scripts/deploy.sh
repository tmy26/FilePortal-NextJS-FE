#!/usr/bin/env bash
# Roll out the File Portal web container on a server that already runs the API
# (typically the be container) on the host.
#
# Prerequisites (once per machine):
#   - Docker + Compose plugin
#   - API reachable as described in README "Docker"
#   - .env in the repo root with:
#       API_BASE_URL=http://host.docker.internal:8000
#       NEXT_PUBLIC_SITE_URL=https://your-public-origin
#
# Usage (from the repo root on the server):
#   ./scripts/deploy.sh
#   ./scripts/deploy.sh --pull          # git pull --ff-only first
#   ./scripts/deploy.sh --no-build      # recreate from an existing image

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/deploy_lib.sh
source "$SCRIPT_DIR/deploy_lib.sh"

DO_PULL=0
DO_BUILD=1

usage() {
  cat <<'EOF'
Usage: ./scripts/deploy.sh [--pull] [--no-build] [-h|--help]

  --pull       git pull --ff-only before building
  --no-build   skip docker compose build (use the image already present)
  -h, --help   show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pull) DO_PULL=1 ;;
    --no-build) DO_BUILD=0 ;;
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

if [[ "$DO_BUILD" -eq 1 ]]; then
  echo "==> docker compose build"
  compose build \
    --build-arg "NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}"
fi

echo "==> docker compose up -d"
compose up -d --remove-orphans

echo "==> waiting for web health"
for _ in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:3000/" >/dev/null 2>&1; then
    echo "deploy ok: File Portal is healthy"
    compose ps
    exit 0
  fi
  sleep 2
done

echo "error: web did not become healthy within ~60s" >&2
compose logs --tail=80 web >&2 || true
exit 1
