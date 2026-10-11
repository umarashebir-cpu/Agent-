// ═══════════════════════════════════════════════════════════════
// Unified AI Cloud Workspace — Cloudflare Worker Backend
// ═══════════════════════════════════════════════════════════════
import { Router, json, status } from 'itty-router';
import FRONTEND_HTML from './frontend.js';

// ── Helpers ────────────────────────────────────────────────────
const uid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

const now = () => new Date().toISOString();

const logActivity = async (db, type, message, meta = {}) => {
  const id = uid();
  await db
    .prepare('INSERT INTO activity (id, type, message, meta) VALUES (?, ?, ?, ?)')
    .bind(id, type, message, JSON.stringify(meta))
    .run();
  return id;
};

// ── Router ──────────────────────────────────────────────────────
const api = Router({ format: json });

// ── Health ─────────────────────────────────────────────────────
api.get('/api/health', () => ({
  status: 'ok',
  service: 'ai-cloud-workspace',
  timestamp: now(),
  bindings: {
    d1: typeof DB !== 'undefined',
    kv: typeof CACHE !== 'undefined',
    r2: typeof STORAGE !== 'undefined',
  },
}));

// ═══════════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════════
api.get('/api/projects', async () => {
  const { results } = await DB.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  return results.map(r => ({ ...r, logs: JSON.parse(r.logs || '[]') }));
});

api.post('/api/projects', async (request) => {
  const body = await request.json();
  if (!body.name) return status(400, { error: 'Project name is required' });
  const id = uid();
  const project = { id, name: body.name, description: body.description || '', status: body.status || 'active', repo_url: body.repo_url || '', prompt: body.prompt || '', logs: [], created_at: now(), updated_at: now() };
  await DB.prepare(`INSERT INTO projects (id, name, description, status, repo_url, prompt, logs, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, '[]', ?, ?)`)
    .bind(project.id, project.name, project.description, project.status, project.repo_url, project.prompt, project.created_at, project.updated_at).run();
  await logActivity(DB, 'project_created', `Project "${project.name}" created`, { id });
  return status(201, project);
});

api.get('/api/projects/:id', async ({ params }) => {
  const project = await DB.prepare('SELECT * FROM projects WHERE id = ?').bind(params.id).first();
  if (!project) return status(404, { error: 'Project not found' });
  return { ...project, logs: JSON.parse(project.logs || '[]') };
});

api.put('/api/projects/:id', async (request) => {
  const { id } = request.params;
  const body = await request.json();
  const existing = await DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
  if (!existing) return status(404, { error: 'Project not found' });
  const updated = { name: body.name ?? existing.name, description: body.description ?? existing.description, status: body.status ?? existing.status, repo_url: body.repo_url ?? existing.repo_url, prompt: body.prompt ?? existing.prompt };
  await DB.prepare(`UPDATE projects SET name=?, description=?, status=?, repo_url=?, prompt=?, updated_at=? WHERE id=?`)
    .bind(updated.name, updated.description, updated.status, updated.repo_url, updated.prompt, now(), id).run();
  return { ...existing, ...updated, updated_at: now() };
});

api.delete('/api/projects/:id', async ({ params }) => {
  const { meta } = await DB.prepare('DELETE FROM projects WHERE id = ?').bind(params.id).run();
  if (meta.changes === 0) return status(404, { error: 'Project not found' });
  await DB.prepare('DELETE FROM tasks WHERE project_id = ?').bind(params.id).run();
  await logActivity(DB, 'project_deleted', `Project ${params.id} deleted`);
  return { success: true };
});

// ═══════════════════════════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════════════════════════
api.get('/api/tasks', async (request) => {
  const url = new URL(request.url);
  const projectId = url.searchParams.get('project_id');
  const stmt = projectId
    ? DB.prepare('SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC').bind(projectId)
    : DB.prepare('SELECT * FROM tasks ORDER BY created_at DESC');
  const { results } = await stmt.all();
  return results.map(r => ({ ...r, logs: JSON.parse(r.logs || '[]') }));
});

api.post('/api/tasks', async (request) => {
  const body = await request.json();
  if (!body.title) return status(400, { error: 'Task title is required' });
  const id = uid();
  const task = { id, project_id: body.project_id || null, title: body.title, status: body.status || 'pending', agent: body.agent || 'manual', prompt: body.prompt || '', logs: [], created_at: now(), updated_at: now() };
  await DB.prepare(`INSERT INTO tasks (id, project_id, title, status, agent, prompt, logs, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, '[]', ?, ?)`)
    .bind(task.id, task.project_id, task.title, task.status, task.agent, task.prompt, task.created_at, task.updated_at).run();
  await logActivity(DB, 'task_created', `Task "${task.title}" created`, { id, agent: task.agent });
  return status(201, task);
});

api.get('/api/tasks/:id', async ({ params }) => {
  const task = await DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(params.id).first();
  if (!task) return status(404, { error: 'Task not found' });
  return { ...task, logs: JSON.parse(task.logs || '[]') };
});

api.put('/api/tasks/:id', async (request) => {
  const { id } = request.params;
  const body = await request.json();
  const existing = await DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(id).first();
  if (!existing) return status(404, { error: 'Task not found' });
  const updated = { title: body.title ?? existing.title, status: body.status ?? existing.status, agent: body.agent ?? existing.agent, prompt: body.prompt ?? existing.prompt };
  await DB.prepare(`UPDATE tasks SET title=?, status=?, agent=?, prompt=?, updated_at=? WHERE id=?`)
    .bind(updated.title, updated.status, updated.agent, updated.prompt, now(), id).run();
  if (body.status && body.status !== existing.status) {
    await logActivity(DB, 'task_status_changed', `Task "${existing.title}" → ${body.status}`, { id });
  }
  return { ...existing, ...updated, updated_at: now() };
});

api.delete('/api/tasks/:id', async ({ params }) => {
  const { meta } = await DB.prepare('DELETE FROM tasks WHERE id = ?').bind(params.id).run();
  if (meta.changes === 0) return status(404, { error: 'Task not found' });
  return { success: true };
});

// ═══════════════════════════════════════════════════════════════
// ACTIVITY
// ═══════════════════════════════════════════════════════════════
api.get('/api/activity', async (request) => {
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 200);
  const { results } = await DB.prepare('SELECT * FROM activity ORDER BY created_at DESC LIMIT ?').bind(limit).all();
  return results.map(r => ({ ...r, meta: JSON.parse(r.meta || '{}') }));
});

// ═══════════════════════════════════════════════════════════════
// PROVIDERS — connection status for Qwen 3, OpenHands, GitHub
// ═══════════════════════════════════════════════════════════════
api.get('/api/providers', async () => {
  const { results } = await DB.prepare('SELECT * FROM providers ORDER BY name').all();
  return results.map(r => ({ ...r, meta: JSON.parse(r.meta || '{}') }));
});

api.put('/api/providers/:id', async (request) => {
  const { id } = request.params;
  const body = await request.json();
  const existing = await DB.prepare('SELECT * FROM providers WHERE id = ?').bind(id).first();
  if (!existing) return status(404, { error: 'Provider not found' });
  await DB.prepare('UPDATE providers SET status=?, base_url=?, meta=?, updated_at=? WHERE id=?')
    .bind(body.status ?? existing.status, body.base_url ?? existing.base_url, JSON.stringify(body.meta || JSON.parse(existing.meta || '{}')), now(), id).run();
  return { ...existing, ...body, updated_at: now() };
});

// ── GitHub integration (uses GITHUB_TOKEN secret if set) ──────
api.get('/api/github/repos', async () => {
  const token = typeof GITHUB_TOKEN !== 'undefined' ? GITHUB_TOKEN : null;
  if (!token) {
    return status(200, { connected: false, message: 'GITHUB_TOKEN secret not set. Use: wrangler secret put GITHUB_TOKEN', repos: [] });
  }
  try {
    const resp = await fetch('https://api.github.com/user/repos?sort=updated&per_page=30', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'ai-cloud-workspace' },
    });
    if (!resp.ok) return status(resp.status, { connected: false, error: `GitHub API returned ${resp.status}`, repos: [] });
    const repos = await resp.json();
    await DB.prepare('UPDATE providers SET status=? WHERE name=?').bind('connected', 'github').run();
    return { connected: true, repos: repos.map(r => ({ id: r.id, name: r.name, full_name: r.full_name, private: r.private, url: r.html_url, updated_at: r.updated_at })) };
  } catch (err) {
    return status(502, { connected: false, error: err.message, repos: [] });
  }
});

// ── Serve frontend ────────────────────────────────────────────
api.all('*', async (request) => {
  const url = new URL(request.url);
  const key = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\//, '');
  if (typeof STORAGE !== 'undefined') {
    const obj = await STORAGE.get(key);
    if (obj) {
      const contentType = key.endsWith('.html') ? 'text/html; charset=utf-8' : key.endsWith('.js') ? 'application/javascript' : key.endsWith('.css') ? 'text/css' : 'application/octet-stream';
      return new Response(obj.body, { headers: { 'Content-Type': contentType } });
    }
  }
  return new Response(FRONTEND_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
});

// ── Export ────────────────────────────────────────────────────
export default { fetch: api.fetch };

