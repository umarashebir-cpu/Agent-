// Embedded frontend HTML — served as fallback when R2 is empty
const html = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Unified AI Cloud Workspace</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: { extend: { colors: {
        brand: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a' }
      }}}
    }
  </script>
  <style>
    [x-cloak]{display:none}
    ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:#374151;border-radius:3px}
  </style>
</head>
<body class="bg-gray-950 text-gray-100 min-h-screen">

<div id="app" class="flex min-h-screen" x-data="app()">

  <!-- Sidebar -->
  <aside class="w-16 md:w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
    <div class="p-4 border-b border-gray-800 flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm shrink-0">AI</div>
      <span class="hidden md:block font-semibold text-sm">AI Workspace</span>
    </div>
    <nav class="flex-1 py-2 space-y-1">
      <a href="#" @click.prevent="nav='dashboard'" :class="nav==='dashboard'?'bg-brand-600 text-white':'text-gray-400 hover:bg-gray-800'" class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-none transition">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        <span class="hidden md:inline">Dashboard</span>
      </a>
      <a href="#" @click.prevent="nav='projects'" :class="nav==='projects'?'bg-brand-600 text-white':'text-gray-400 hover:bg-gray-800'" class="flex items-center gap-3 px-4 py-2.5 text-sm transition">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/></svg>
        <span class="hidden md:inline">Projects</span>
      </a>
      <a href="#" @click.prevent="nav='tasks'" :class="nav==='tasks'?'bg-brand-600 text-white':'text-gray-400 hover:bg-gray-800'" class="flex items-center gap-3 px-4 py-2.5 text-sm transition">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        <span class="hidden md:inline">Tasks</span>
      </a>
      <a href="#" @click.prevent="nav='models'" :class="nav==='models'?'bg-brand-600 text-white':'text-gray-400 hover:bg-gray-800'" class="flex items-center gap-3 px-4 py-2.5 text-sm transition">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        <span class="hidden md:inline">Models</span>
      </a>
      <a href="#" @click.prevent="nav='agents'" :class="nav==='agents'?'bg-brand-600 text-white':'text-gray-400 hover:bg-gray-800'" class="flex items-center gap-3 px-4 py-2.5 text-sm transition">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        <span class="hidden md:inline">Agents</span>
      </a>
      <a href="#" @click.prevent="nav='github'" :class="nav==='github'?'bg-brand-600 text-white':'text-gray-400 hover:bg-gray-800'" class="flex items-center gap-3 px-4 py-2.5 text-sm transition">
        <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.02A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.29 2.747-1.02 2.747-1.02.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
        <span class="hidden md:inline">GitHub</span>
      </a>
      <a href="#" @click.prevent="nav='settings'" :class="nav==='settings'?'bg-brand-600 text-white':'text-gray-400 hover:bg-gray-800'" class="flex items-center gap-3 px-4 py-2.5 text-sm transition">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        <span class="hidden md:inline">Settings</span>
      </a>
    </nav>
    <div class="p-3 border-t border-gray-800 text-xs text-gray-500 hidden md:block">Powered by Cloudflare Workers</div>
  </aside>

  <main class="flex-1 overflow-auto p-4 md:p-8">
    <!-- DASHBOARD -->
    <div x-show="nav==='dashboard'" x-cloak>
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-gray-900 rounded-xl p-5 border border-gray-800"><p class="text-gray-500 text-xs uppercase tracking-wide mb-1">Projects</p><p class="text-3xl font-bold" x-text="projects.length"></p></div>
        <div class="bg-gray-900 rounded-xl p-5 border border-gray-800"><p class="text-gray-500 text-xs uppercase tracking-wide mb-1">Tasks</p><p class="text-3xl font-bold" x-text="tasks.length"></p></div>
        <div class="bg-gray-900 rounded-xl p-5 border border-gray-800"><p class="text-gray-500 text-xs uppercase tracking-wide mb-1">Completed</p><p class="text-3xl font-bold text-green-500" x-text="tasks.filter(t=>t.status==='completed').length"></p></div>
        <div class="bg-gray-900 rounded-xl p-5 border border-gray-800"><p class="text-gray-500 text-xs uppercase tracking-wide mb-1">Running</p><p class="text-3xl font-bold text-yellow-500" x-text="tasks.filter(t=>t.status==='running').length"></p></div>
      </div>
      <h2 class="text-lg font-semibold mb-3">Connection Status</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <template x-for="p in providers" :key="p.id">
          <div class="bg-gray-900 rounded-xl p-5 border border-gray-800 flex items-center justify-between">
            <div><p class="font-semibold" x-text="p.label"></p><p class="text-xs text-gray-500 mt-1" x-text="p.base_url"></p></div>
            <span :class="p.status==='connected'?'bg-green-500/20 text-green-400':p.status==='error'?'bg-red-500/20 text-red-400':'bg-gray-700 text-gray-400'" class="px-3 py-1 rounded-full text-xs font-medium" x-text="p.status"></span>
          </div>
        </template>
      </div>
      <h2 class="text-lg font-semibold mb-3">Recent Activity</h2>
      <div class="bg-gray-900 rounded-xl border border-gray-800 divide-y divide-gray-800">
        <template x-if="activity.length===0"><p class="p-4 text-gray-500 text-sm">No activity yet.</p></template>
        <template x-for="a in activity" :key="a.id">
          <div class="p-4 flex items-start gap-3"><div class="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0"></div><div class="flex-1"><p class="text-sm" x-text="a.message"></p><p class="text-xs text-gray-500 mt-0.5" x-text="new Date(a.created_at).toLocaleString()"></p></div></div>
        </template>
      </div>
    </div>

    <!-- PROJECTS -->
    <div x-show="nav==='projects'" x-cloak>
      <div class="flex items-center justify-between mb-6"><h1 class="text-2xl font-bold">Projects</h1><button @click="newProject={name:'',description:'',repo_url:'',prompt:''}; showProjectModal=true" class="bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-medium transition">+ New Project</button></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <template x-if="projects.length===0"><p class="text-gray-500 col-span-full text-center py-12">No projects yet. Create one to get started.</p></template>
        <template x-for="p in projects" :key="p.id">
          <div class="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-brand-600 transition">
            <div class="flex items-start justify-between mb-2"><h3 class="font-semibold" x-text="p.name"></h3><span :class="p.status==='active'?'bg-green-500/20 text-green-400':p.status==='paused'?'bg-yellow-500/20 text-yellow-400':'bg-gray-700 text-gray-400'" class="px-2 py-0.5 rounded text-xs" x-text="p.status"></span></div>
            <p class="text-sm text-gray-400 mb-3" x-text="p.description || 'No description'"></p>
            <template x-if="p.repo_url"><a :href="p.repo_url" target="_blank" class="text-xs text-brand-400 hover:underline" x-text="p.repo_url"></a></template>
            <div class="flex gap-2 mt-4"><button @click="deleteProject(p.id)" class="text-xs text-red-400 hover:text-red-300">Delete</button></div>
          </div>
        </template>
      </div>
      <div x-show="showProjectModal" x-cloak class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="showProjectModal=false">
        <div class="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800">
          <h2 class="text-lg font-bold mb-4">New Project</h2>
          <input x-model="newProject.name" placeholder="Project name" class="w-full bg-gray-800 rounded-lg px-3 py-2 mb-3 text-sm border border-gray-700 focus:border-brand-500 outline-none" />
          <textarea x-model="newProject.description" placeholder="Description" rows="2" class="w-full bg-gray-800 rounded-lg px-3 py-2 mb-3 text-sm border border-gray-700 focus:border-brand-500 outline-none"></textarea>
          <input x-model="newProject.repo_url" placeholder="GitHub repo URL (optional)" class="w-full bg-gray-800 rounded-lg px-3 py-2 mb-3 text-sm border border-gray-700 focus:border-brand-500 outline-none" />
          <textarea x-model="newProject.prompt" placeholder="System prompt (optional)" rows="3" class="w-full bg-gray-800 rounded-lg px-3 py-2 mb-4 text-sm border border-gray-700 focus:border-brand-500 outline-none"></textarea>
          <div class="flex justify-end gap-2"><button @click="showProjectModal=false" class="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button><button @click="createProject()" class="bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-medium">Create</button></div>
        </div>
      </div>
    </div>

    <!-- TASKS -->
    <div x-show="nav==='tasks'" x-cloak>
      <div class="flex items-center justify-between mb-6"><h1 class="text-2xl font-bold">Tasks</h1><button @click="newTask={title:'',project_id:'',agent:'manual',prompt:''}; showTaskModal=true" class="bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-medium transition">+ New Task</button></div>
      <div class="bg-gray-900 rounded-xl border border-gray-800 divide-y divide-gray-800">
        <template x-if="tasks.length===0"><p class="p-4 text-gray-500 text-sm">No tasks yet.</p></template>
        <template x-for="t in tasks" :key="t.id">
          <div class="p-4 flex items-center justify-between">
            <div class="flex-1"><p class="font-medium text-sm" x-text="t.title"></p><div class="flex items-center gap-3 mt-1"><span :class="{'pending':'bg-gray-700 text-gray-400','running':'bg-yellow-500/20 text-yellow-400','completed':'bg-green-500/20 text-green-400','failed':'bg-red-500/20 text-red-400'}[t.status]" class="px-2 py-0.5 rounded text-xs" x-text="t.status"></span><span class="text-xs text-gray-500" x-text="t.agent"></span></div></div>
            <div class="flex gap-2"><select @change="updateTaskStatus(t.id, $event.target.value)" class="bg-gray-800 text-xs rounded px-2 py-1 border border-gray-700"><option value="pending">pending</option><option value="running">running</option><option value="completed">completed</option><option value="failed">failed</option></select><button @click="deleteTask(t.id)" class="text-xs text-red-400 hover:text-red-300">Delete</button></div>
          </div>
        </template>
      </div>
      <div x-show="showTaskModal" x-cloak class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="showTaskModal=false">
        <div class="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800">
          <h2 class="text-lg font-bold mb-4">New Task</h2>
          <input x-model="newTask.title" placeholder="Task title" class="w-full bg-gray-800 rounded-lg px-3 py-2 mb-3 text-sm border border-gray-700 focus:border-brand-500 outline-none" />
          <select x-model="newTask.project_id" class="w-full bg-gray-800 rounded-lg px-3 py-2 mb-3 text-sm border border-gray-700"><option value="">No project</option><template x-for="p in projects" :key="p.id"><option :value="p.id" x-text="p.name"></option></template></select>
          <select x-model="newTask.agent" class="w-full bg-gray-800 rounded-lg px-3 py-2 mb-3 text-sm border border-gray-700"><option value="manual">Manual</option><option value="qwen3">Qwen 3</option><option value="openhands">OpenHands</option></select>
          <textarea x-model="newTask.prompt" placeholder="Prompt / instructions" rows="3" class="w-full bg-gray-800 rounded-lg px-3 py-2 mb-4 text-sm border border-gray-700 focus:border-brand-500 outline-none"></textarea>
          <div class="flex justify-end gap-2"><button @click="showTaskModal=false" class="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button><button @click="createTask()" class="bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-medium">Create</button></div>
        </div>
      </div>
    </div>

    <!-- MODELS -->
    <div x-show="nav==='models'" x-cloak>
      <h1 class="text-2xl font-bold mb-6">Models</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-gray-900 rounded-xl p-5 border border-gray-800"><h3 class="font-semibold mb-1">Qwen 3</h3><p class="text-sm text-gray-400 mb-3">Alibaba's Qwen 3 model family for text generation, code, and reasoning.</p><span class="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-400">Requires API key</span></div>
        <div class="bg-gray-900 rounded-xl p-5 border border-gray-800"><h3 class="font-semibold mb-1">Workers AI</h3><p class="text-sm text-gray-400 mb-3">Cloudflare's built-in AI inference. Enable via the AI binding in wrangler.toml.</p><span class="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">Available</span></div>
        <div class="bg-gray-900 rounded-xl p-5 border border-gray-800"><h3 class="font-semibold mb-1">OpenHands</h3><p class="text-sm text-gray-400 mb-3">Autonomous coding agent. Connect via OpenHands API for task execution.</p><span class="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-400">Requires API key</span></div>
      </div>
    </div>

    <!-- AGENTS -->
    <div x-show="nav==='agents'" x-cloak>
      <h1 class="text-2xl font-bold mb-6">Agents</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-900 rounded-xl p-5 border border-gray-800"><div class="flex items-center justify-between mb-3"><h3 class="font-semibold">Qwen 3 Agent</h3><span class="px-2 py-0.5 rounded text-xs" :class="providers.find(p=>p.name==='qwen3')?.status==='connected'?'bg-green-500/20 text-green-400':'bg-gray-700 text-gray-400'" x-text="providers.find(p=>p.name==='qwen3')?.status || 'unknown'"></span></div><p class="text-sm text-gray-400">Use Qwen 3 for code generation, analysis, and task prompts. Configure the API key in Settings.</p></div>
        <div class="bg-gray-900 rounded-xl p-5 border border-gray-800"><div class="flex items-center justify-between mb-3"><h3 class="font-semibold">OpenHands Agent</h3><span class="px-2 py-0.5 rounded text-xs" :class="providers.find(p=>p.name==='openhands')?.status==='connected'?'bg-green-500/20 text-green-400':'bg-gray-700 text-gray-400'" x-text="providers.find(p=>p.name==='openhands')?.status || 'unknown'"></span></div><p class="text-sm text-gray-400">Autonomous agent for executing multi-step coding tasks. Connect via the OpenHands API.</p></div>
      </div>
    </div>

    <!-- GITHUB -->
    <div x-show="nav==='github'" x-cloak>
      <h1 class="text-2xl font-bold mb-6">GitHub Integration</h1>
      <div class="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-4"><div class="flex items-center justify-between mb-3"><h3 class="font-semibold">Connection</h3><span class="px-2 py-0.5 rounded text-xs" :class="github.connected?'bg-green-500/20 text-green-400':'bg-gray-700 text-gray-400'" x-text="github.connected?'Connected':'Not connected'"></span></div><p class="text-sm text-gray-400 mb-4" x-text="github.message || 'Click to check GitHub connection.'"></p><button @click="loadGithubRepos()" class="bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-medium">Check Connection & Load Repos</button></div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3"><template x-for="repo in github.repos" :key="repo.id"><a :href="repo.url" target="_blank" class="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-brand-600 transition block"><div class="flex items-center justify-between"><span class="font-medium text-sm" x-text="repo.full_name"></span><span class="text-xs px-2 py-0.5 rounded" :class="repo.private?'bg-yellow-500/20 text-yellow-400':'bg-green-500/20 text-green-400'" x-text="repo.private?'private':'public'"></span></div><p class="text-xs text-gray-500 mt-1" x-text="'Updated ' + new Date(repo.updated_at).toLocaleDateString()"></p></a></template></div>
    </div>

    <!-- SETTINGS -->
    <div x-show="nav==='settings'" x-cloak>
      <h1 class="text-2xl font-bold mb-6">Settings</h1>
      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-4"><h3 class="font-semibold mb-4">Provider Configuration</h3><template x-for="p in providers" :key="p.id"><div class="mb-4 pb-4 border-b border-gray-800 last:border-0"><p class="font-medium text-sm mb-2" x-text="p.label"></p><input :value="p.base_url" @change="updateProvider(p.id, {base_url:$event.target.value})" class="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700 focus:border-brand-500 outline-none mb-2" /><select :value="p.status" @change="updateProvider(p.id, {status:$event.target.value})" class="bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"><option value="connected">connected</option><option value="disconnected">disconnected</option><option value="error">error</option></select></div></template></div>
      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800"><h3 class="font-semibold mb-3">Secrets</h3><p class="text-sm text-gray-400 mb-2">Set the following secrets using the Wrangler CLI:</p><pre class="bg-gray-950 rounded-lg p-3 text-xs text-gray-400 overflow-x-auto">wrangler secret put GITHUB_TOKEN\nwrangler secret put QWEN_KEY\nwrangler secret put OPENHANDS_KEY</pre></div>
    </div>
  </main>
</div>

<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
<script>
document.addEventListener('alpine:init', () => {
  Alpine.data('app', () => ({
    nav: 'dashboard', projects: [], tasks: [], activity: [], providers: [], github: { connected: false, repos: [], message: '' },
    showProjectModal: false, showTaskModal: false, newProject: {}, newTask: {},
    async init() { await Promise.all([this.loadProjects(), this.loadTasks(), this.loadActivity(), this.loadProviders()]); },
    async api(path, opts = {}) {
      const res = await fetch('/api/' + path, { headers: { 'Content-Type': 'application/json' }, ...opts });
      if (!res.ok) { const err = await res.json().catch(() => ({ error: res.statusText })); throw new Error(err.error || 'Request failed'); }
      return res.status === 204 ? null : res.json();
    },
    async loadProjects() { try { this.projects = await this.api('projects'); } catch(e){ console.error(e); } },
    async loadTasks() { try { this.tasks = await this.api('tasks'); } catch(e){ console.error(e); } },
    async loadActivity() { try { this.activity = await this.api('activity'); } catch(e){ console.error(e); } },
    async loadProviders() { try { this.providers = await this.api('providers'); } catch(e){ console.error(e); } },
    async createProject() { try { await this.api('projects', { method: 'POST', body: JSON.stringify(this.newProject) }); this.showProjectModal = false; await this.loadProjects(); await this.loadActivity(); } catch(e) { alert(e.message); } },
    async deleteProject(id) { if (!confirm('Delete this project?')) return; try { await this.api('projects/' + id, { method: 'DELETE' }); await this.loadProjects(); await this.loadTasks(); await this.loadActivity(); } catch(e) { alert(e.message); } },
    async createTask() { try { await this.api('tasks', { method: 'POST', body: JSON.stringify(this.newTask) }); this.showTaskModal = false; await this.loadTasks(); await this.loadActivity(); } catch(e) { alert(e.message); } },
    async updateTaskStatus(id, status) { try { await this.api('tasks/' + id, { method: 'PUT', body: JSON.stringify({ status }) }); await this.loadTasks(); await this.loadActivity(); } catch(e) { alert(e.message); } },
    async deleteTask(id) { if (!confirm('Delete this task?')) return; try { await this.api('tasks/' + id, { method: 'DELETE' }); await this.loadTasks(); } catch(e) { alert(e.message); } },
    async updateProvider(id, body) { try { await this.api('providers/' + id, { method: 'PUT', body: JSON.stringify(body) }); await this.loadProviders(); } catch(e) { alert(e.message); } },
    async loadGithubRepos() { try { const res = await fetch('/api/github/repos'); const data = await res.json(); this.github = data; await this.loadProviders(); } catch(e) { alert(e.message); } },
  }));
});
</script>
</body>
</html>`;

export default html;
