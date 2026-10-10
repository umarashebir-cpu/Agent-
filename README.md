# Unified AI Cloud Workspace

A full-stack application for managing AI projects, tasks, and agents (Qwen 3, OpenHands) with GitHub integration — built on Cloudflare Workers.

## Architecture

| Component | Technology |
|-----------|-----------|
| Backend | Cloudflare Worker + itty-router |
| Database | Cloudflare D1 (SQLite) |
| Cache | Cloudflare KV |
| File Storage | Cloudflare R2 |
| Frontend | Single-page app (Tailwind CSS + Alpine.js) |

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create D1 database
```bash
npx wrangler d1 create ai-cloud-workspace-db
# Copy the database_id into wrangler.toml
```

### 3. Create KV namespace
```bash
npx wrangler kv namespace create CACHE
# Copy the id into wrangler.toml
```

### 4. Create R2 bucket
```bash
npx wrangler r2 bucket create ai-cloud-workspace-storage
```

### 5. Apply D1 schema
```bash
npx wrangler d1 execute ai-cloud-workspace-db --file=src/schema.sql
# Remote:
npx wrangler d1 execute ai-cloud-workspace-db --remote --file=src/schema.sql
```

### 6. Set secrets
```bash
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put QWEN_KEY
npx wrangler secret put OPENHANDS_KEY
```

### 7. Deploy
```bash
npm run deploy
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check + binding status |
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Get a project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |
| GET | `/api/tasks` | List all tasks (filter: `?project_id=`) |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/:id` | Get a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/activity` | Recent activity feed |
| GET | `/api/providers` | List AI providers + status |
| PUT | `/api/providers/:id` | Update provider config |
| GET | `/api/github/repos` | List GitHub repos (requires GITHUB_TOKEN secret) |

## Features

- ✅ Full CRUD for projects and tasks
- ✅ Activity feed with timestamped events
- ✅ Provider status management (Qwen 3, OpenHands, GitHub)
- ✅ GitHub repository listing via GitHub API
- ✅ Responsive mobile-friendly dark-mode UI
- ✅ D1, KV, and R2 bindings configured
- ✅ Error handling with truthful status codes

## Notes

- The GitHub integration requires a `GITHUB_TOKEN` secret. Without it, the endpoint returns a truthful "not connected" response.
- Qwen 3 and OpenHands API calls require their respective keys as secrets. The UI shows connection status based on the providers table.
- The frontend is embedded in the Worker as a fallback and can also be served from R2.
