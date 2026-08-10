#!/usr/bin/env bash
# Write the Nginx upstream snippet for the active web slot and reload Nginx.
#
# Usage:
#   ./scripts/nginx_web_upstream.sh 3001
#   ./scripts/nginx_web_upstream.sh 3002
#
# Requires passwordless sudo for writing the conf and reloading Nginx, e.g.:
#   deploy ALL=(root) NOPASSWD: /usr/bin/tee /etc/nginx/conf.d/fileportal-web-active.conf, /usr/sbin/nginx
#
# Your portal server block should proxy to this upstream:
#   proxy_pass http://fileportal_web;

set -euo pipefail

PORT="${1:-}"
CONF_PATH="${NGINX_WEB_UPSTREAM_CONF:-/etc/nginx/conf.d/fileportal-web-active.conf}"

if [[ -z "$PORT" ]]; then
  echo "usage: $0 <3001|3002>" >&2
  exit 1
fi

case "$PORT" in
  3001 | 3002) ;;
  *)
    echo "error: port must be 3001 (blue) or 3002 (green), got: $PORT" >&2
    exit 1
    ;;
esac

if ! command -v sudo >/dev/null 2>&1; then
  echo "error: sudo is required to update $CONF_PATH" >&2
  exit 1
fi

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

cat >"$TMP" <<EOF
# managed by scripts/nginx_web_upstream.sh — do not edit by hand
upstream fileportal_web {
    server 127.0.0.1:${PORT};
}
EOF

echo "==> writing $CONF_PATH"
sudo tee "$CONF_PATH" <"$TMP" >/dev/null

echo "==> nginx -t && reload"
sudo nginx -t
if sudo nginx -s reload 2>/dev/null; then
  :
elif sudo systemctl reload nginx 2>/dev/null; then
  :
else
  echo "error: could not reload nginx (tried nginx -s reload and systemctl reload nginx)" >&2
  exit 1
fi

echo "nginx upstream fileportal_web → 127.0.0.1:${PORT}"
