-- ─────────────────────────────────────────────────────────────
-- Unified AI Cloud Workspace — D1 Schema
-- Run locally:  npx wrangler d1 execute ai-cloud-workspace-db --file=src/schema.sql
-- Run remote:   npx wrangler d1 execute ai-cloud-workspace-db --remote --file=src/schema.sql
-- ─────────────────────────────────────────────────────────────

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT DEFAULT '',
    status      TEXT DEFAULT 'active',   -- active | paused | archived
    repo_url    TEXT DEFAULT '',
    prompt      TEXT DEFAULT '',
    logs        TEXT DEFAULT '[]',        -- JSON array of log lines
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id          TEXT PRIMARY KEY,
    project_id  TEXT,
    title       TEXT NOT NULL,
    status      TEXT DEFAULT 'pending',   -- pending | running | completed | failed
    agent       TEXT DEFAULT '',          -- qwen3 | openhands | manual
    prompt      TEXT DEFAULT '',
    logs        TEXT DEFAULT '[]',
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Activity feed
CREATE TABLE IF NOT EXISTS activity (
    id          TEXT PRIMARY KEY,
    type        TEXT NOT NULL,             -- project_created | task_completed | deployment | etc.
    message     TEXT NOT NULL,
    meta        TEXT DEFAULT '{}',         -- JSON blob
    created_at  TEXT DEFAULT (datetime('now'))
);

-- AI providers config (stored in D1 for persistence)
CREATE TABLE IF NOT EXISTS providers (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,             -- qwen3 | openhands | github
    label       TEXT NOT NULL,
    status      TEXT DEFAULT 'disconnected', -- connected | disconnected | error
    base_url    TEXT DEFAULT '',
    meta        TEXT DEFAULT '{}',
    updated_at  TEXT DEFAULT (datetime('now'))
);

-- Seed default providers
INSERT OR IGNORE INTO providers (id, name, label, status, base_url) VALUES
    ('qwen3',    'qwen3',    'Qwen 3',    'disconnected', 'https://dashscope.aliyuncs.com'),
    ('openhands', 'openhands', 'OpenHands', 'disconnected', 'https://github.com/All-Hands-AI/OpenHands'),
    ('github',   'github',   'GitHub',   'disconnected', 'https://api.github.com');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_created  ON activity(created_at DESC);
