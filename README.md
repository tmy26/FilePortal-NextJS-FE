# File Portal

Next.js frontend for TMY Tuned File Portal — ECU/gearbox uploads, TuningPoints shop,
and request history against the FastAPI backend (`be`).

## Requirements

- Node.js 22+
- npm
- Docker (for containerized runs / deploy)
- Running File Portal API on port 8000 (Poetry or Docker in the `be` repo)

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

That sets `API_BASE_URL=http://host.docker.internal:8000` so the web container can
reach the API published on the host.

### Docker (server)

```bash
cp .env.example .env
# Set:
#   NEXT_PUBLIC_SITE_URL=https://your-public-origin
#   API_BASE_URL=http://host.docker.internal:8000
./scripts/deploy.sh
```

See [Docker](#docker) below.

## Configuration

| Variable | Where | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_SITE_URL` | Build + runtime | Canonical origin (sitemap, OG, JSON-LD) |
| `API_BASE_URL` | Runtime (server) | FastAPI origin used by server actions / proxy |

See `.env.example` for comments. `NEXT_PUBLIC_*` values are inlined at **build** time —
rebuild the image after changing the public site URL.

## Docker

On the server, the web container reaches the API on the host the same way the API
reaches host Postgres in the `be` repo.

### 1. App `.env` (on the server, not committed)

```env
NEXT_PUBLIC_SITE_URL=https://portal.example.com
API_BASE_URL=http://host.docker.internal:8000
```

Containers must use `host.docker.internal`, not `localhost`. `./scripts/deploy.sh`
refuses to start if `API_BASE_URL` still points at `localhost` / `127.0.0.1`.

### 2. Compose `extra_hosts`

`docker-compose.yml` already maps the name for the `web` service:

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

### 3. API must listen on the host

Run the `be` API (Compose or process manager) so port **8000** is reachable from the
Docker host gateway. CORS / `FRONTEND_URL` on the API must allow your public portal origin.

**Summary:** host API on 8000 → web container connects via `host.docker.internal:8000` +
`extra_hosts`.

Local override: `docker-compose.local.yml` forces `API_BASE_URL` to `host.docker.internal:8000`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local Next.js dev server |
| `npm run build` / `npm start` | Production build on the host |
| `./scripts/deploy.sh` | Build + `compose up -d` with URL guards |
| `./scripts/deploy.sh --pull` | `git pull --ff-only` then deploy |
