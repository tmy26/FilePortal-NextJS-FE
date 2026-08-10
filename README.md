# File Portal

Next.js frontend for TMY Tuned File Portal — ECU/gearbox uploads, TuningPoints shop,
and request history against the FastAPI backend (`be`).

## Requirements

- Node.js 22+
- npm
- Docker (for containerized runs / deploy)
- Running File Portal API (Poetry or Docker in the `be` repo)

## Getting started

```bash
cp .env.example .env.local   # API_BASE_URL=http://localhost:8000
npm install
npm run dev
```

Open http://localhost:3000.

### Docker (local, API on the host)

```bash
cp .env.example .env
# Start the API first (in the be repo), then:
docker compose -f docker-compose.yml -f docker-compose.local.yml up --build
```

That starts `web-blue` on http://localhost:3000 with
`API_BASE_URL=http://host.docker.internal:8000`. `web-green` stays off via a Compose
profile. Use this on a laptop only.

### Docker (server)

```bash
cp .env.example .env
# Set:
#   NEXT_PUBLIC_SITE_URL=https://your-public-origin
#   API_BASE_URL=https://api.yourdomain.com   # recommended with be blue-green
./scripts/deploy.sh
```

Blue-green slots listen on host ports **3001** (blue) and **3002** (green); Nginx fronts
the active one. See [Docker](#docker) and [Blue-green deploy](#blue-green-deploy).

## Configuration

| Variable | Where | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_SITE_URL` | Build + runtime | Canonical origin (sitemap, OG, JSON-LD) |
| `API_BASE_URL` | Runtime (server) | FastAPI origin used by server actions / proxy |

See `.env.example` for comments. `NEXT_PUBLIC_*` values are inlined at **build** time —
rebuild the image after changing the public site URL.

## Docker

### 1. App `.env` (on the server, not committed)

```env
NEXT_PUBLIC_SITE_URL=https://portal.example.com
API_BASE_URL=https://api.example.com
```

`./scripts/deploy.sh` refuses `localhost` / `127.0.0.1`. On the server prefer a **public
https** API origin (works with `be` blue-green behind Nginx). `host.docker.internal` is
still accepted if you point at a stable host listener.

### 2. Compose `extra_hosts`

`docker-compose.yml` maps the name for both `web-blue` and `web-green`:

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

### 3. API must be reachable

CORS / `FRONTEND_URL` on the API must allow your public portal origin.

Local override: `docker-compose.local.yml` forces `API_BASE_URL` to
`host.docker.internal:8000` on `web-blue`.

## Blue-green deploy

Production runs two web slots that share one image:

| Slot | Compose service | Host port |
| --- | --- | --- |
| blue | `web-blue` | `3001` |
| green | `web-green` | `3002` |

Active slot is recorded in `.deploy/active_slot` on the server (gitignored). Do not expose
3001/3002 on the public firewall — only Nginx 80/443.

### Deploy flow (`./scripts/deploy.sh`)

1. Build the shared image `fileportal-web:latest` (with `NEXT_PUBLIC_SITE_URL` build-arg).
2. Start the **idle** slot (`--force-recreate`), wait for `http://127.0.0.1:<idle-port>/`.
3. On success: rewrite Nginx upstream, write `.deploy/active_slot`, stop the previous slot.
4. On health failure: stop the idle slot, **leave the active slot and Nginx unchanged**.

First run with no `.deploy/active_slot` and no running slots **bootstraps** `web-blue` on
`:3001` and points Nginx there.

```bash
./scripts/deploy.sh            # normal blue-green cutover
./scripts/deploy.sh --pull     # git pull --ff-only first
./scripts/deploy.sh --rollback # start the other slot, switch Nginx back (best-effort)
```

### Nginx

`scripts/nginx_web_upstream.sh` writes `/etc/nginx/conf.d/fileportal-web-active.conf`:

```nginx
# managed by scripts/nginx_web_upstream.sh — do not edit by hand
upstream fileportal_web {
    server 127.0.0.1:3001;  # or 3002
}
```

Portal server block:

```nginx
location / {
    proxy_pass http://fileportal_web;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

The deploy user needs passwordless sudo for that write + `nginx -t` / reload, for example:

```
deploy ALL=(root) NOPASSWD: /usr/bin/tee /etc/nginx/conf.d/fileportal-web-active.conf, /usr/sbin/nginx, /bin/systemctl reload nginx
```

## Deploy / CI CD

GitHub Actions pipeline (`.github/workflows/pipeline.yml`), three jobs:

| Job | When | What |
| --- | --- | --- |
| `check` | every push / PR | lint, compose validate, deploy URL guards |
| `build` | after `check` | `npm run build` |
| `deploy (prod)` | `main` only (push or manual Run workflow) | SSH → `./scripts/deploy.sh` |

Configure these secrets on the repo (or on the `production` environment):

| Secret | Purpose |
| --- | --- |
| `DEPLOY_HOST` | Server hostname |
| `DEPLOY_USER` | SSH user |
| `DEPLOY_SSH_KEY` | Private key PEM |
| `DEPLOY_PATH` | Absolute path to the clone on the server |
| `DEPLOY_SSH_PORT` | Optional, default `22` |

The server clone must already contain a production `.env`.

```bash
./scripts/check_deploy_guards.sh
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local Next.js dev server |
| `npm run build` / `npm start` | Production build on the host |
| `./scripts/deploy.sh` | Blue-green deploy with URL guards |
| `./scripts/deploy.sh --pull` | `git pull --ff-only` then deploy |
| `./scripts/deploy.sh --rollback` | Switch Nginx back to the other slot |
| `./scripts/check_deploy_guards.sh` | Same URL guards CI runs |
