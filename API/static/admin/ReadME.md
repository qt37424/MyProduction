# 📦 Monorepo Structure

```
server-admin/
├─ api/                      # Backend (Node.js + TypeScript + Express)
│  ├─ src/
│  │  ├─ index.ts            # App bootstrap
│  │  ├─ routes/
│  │  │  ├─ auth.ts
│  │  │  ├─ servers.ts
│  │  │  ├─ commands.ts
│  │  │  └─ logs.ts
│  │  ├─ services/
│  │  │  ├─ ssh.ts           # Real SSH (ssh2) + graceful mock fallback
│  │  │  ├─ inventory.ts     # CRUD for servers list (SQLite)
│  │  │  └─ audit.ts         # Append/read logs
│  │  ├─ ws.ts               # Socket.IO for live logs
│  │  ├─ db.ts               # SQLite connection (better-sqlite3)
│  │  └─ types.ts
│  ├─ .env.example
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ README.md
└─ web/                      # Frontend (Vue 3 + Vite + Pinia + Tailwind)
   ├─ src/
   │  ├─ main.ts
   │  ├─ App.vue
   │  ├─ router.ts
   │  ├─ stores/
   │  │  └─ servers.ts
   │  ├─ api/
   │  │  └─ client.ts
   │  ├─ components/
   │  │  ├─ ServerCard.vue
   │  │  ├─ StatusBadge.vue
   │  │  └─ TerminalView.vue
   │  └─ pages/
   │     ├─ Dashboard.vue
   │     ├─ Servers.vue
   │     └─ ServerDetail.vue
   ├─ index.html
   ├─ package.json
   ├─ postcss.config.cjs
   ├─ tailwind.config.cjs
   └─ vite.config.ts
```

---

## 🚀 Quick Start

```bash
# 1) Clone structure
mkdir server-admin && cd server-admin

# Backend
mkdir -p api && cd api
npm init -y
npm i express cors dotenv socket.io jsonwebtoken bcryptjs better-sqlite3 ssh2
npm i -D typescript ts-node-dev @types/express @types/cors @types/jsonwebtoken
npx tsc --init --rootDir src --outDir dist --esModuleInterop true --resolveJsonModule true --lib ES2020,DOM
mkdir -p src/{routes,services} && cd ..

# Frontend
mkdir -p web && cd web
npm create vite@latest . -- --template vue-ts
npm i axios pinia vue-router@4
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
cd ..
```

---

## 🔐 API/.env.example
```
PORT=5050
JWT_SECRET=dev-secret-change
ALLOW_DEV_NO_AUTH=true
SQLITE_PATH=./data.db
```

---

## 🧠 API/src/types.ts
```ts
export type ServerItem = {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  authType: 'password' | 'key';
  password?: string;       // store hashed in real life; plain for mock only
  privateKeyPath?: string; // for key auth (future)
  tags?: string[];
};
```

---

## 🗃️ API/src/db.ts
```ts
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.SQLITE_PATH || path.join(process.cwd(), 'data.db');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS servers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  host TEXT NOT NULL,
  port INTEGER NOT NULL,
  username TEXT NOT NULL,
  authType TEXT NOT NULL,
  password TEXT,
  privateKeyPath TEXT,
  tags TEXT
);
CREATE TABLE IF NOT EXISTS audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  meta TEXT
);
`);
```

---

## 📒 API/src/services/inventory.ts
```ts
import { db } from '../db';
import { ServerItem } from '../types';
import { randomUUID } from 'crypto';

export function listServers(): ServerItem[] {
  const rows = db.prepare('SELECT * FROM servers').all();
  return rows.map((r:any)=>({ ...r, tags: r.tags ? JSON.parse(r.tags) : [] }));
}

export function getServer(id: string): ServerItem | null {
  const r = db.prepare('SELECT * FROM servers WHERE id = ?').get(id);
  return r ? { ...r, tags: r.tags ? JSON.parse(r.tags) : [] } : null;
}

export function createServer(data: Omit<ServerItem,'id'>): ServerItem {
  const id = randomUUID();
  db.prepare(`INSERT INTO servers(id,name,host,port,username,authType,password,privateKeyPath,tags)
    VALUES(@id,@name,@host,@port,@username,@authType,@password,@privateKeyPath,@tags)
  `).run({ ...data, id, tags: JSON.stringify(data.tags||[]) });
  return getServer(id)!;
}

export function updateServer(id: string, patch: Partial<ServerItem>): ServerItem {
  const s = getServer(id);
  if (!s) throw new Error('Not found');
  const merged = { ...s, ...patch };
  db.prepare(`UPDATE servers SET name=@name,host=@host,port=@port,username=@username,authType=@authType,
    password=@password,privateKeyPath=@privateKeyPath,tags=@tags WHERE id=@id`).run({
    ...merged, tags: JSON.stringify(merged.tags||[])
  });
  return getServer(id)!;
}

export function deleteServer(id: string){
  db.prepare('DELETE FROM servers WHERE id = ?').run(id);
}
```

---

## 🧾 API/src/services/audit.ts
```ts
import { db } from '../db';

export type LogEntry = { ts: number; level: 'info'|'warn'|'error'; message: string; meta?: any };

export function log(entry: LogEntry){
  db.prepare('INSERT INTO audit(ts,level,message,meta) VALUES(?,?,?,?)')
    .run(entry.ts, entry.level, entry.message, entry.meta ? JSON.stringify(entry.meta) : null);
}

export function read(limit = 100){
  return db.prepare('SELECT * FROM audit ORDER BY ts DESC LIMIT ?').all(limit)
    .map((r:any)=>({ ...r, meta: r.meta ? JSON.parse(r.meta): undefined }));
}
```

---

## 🔌 API/src/services/ssh.ts
```ts
import { Client } from 'ssh2';
import type { ServerItem } from '../types';

const hasSsh2 = !!Client; // always true if installed, mock if connection fails

export async function pingServer(s: ServerItem): Promise<{ ok: boolean; reason?: string }>{
  if (!hasSsh2) return { ok: true, reason: 'mock-ssh enabled' };
  return new Promise((resolve)=>{
    const conn = new Client();
    const timer = setTimeout(()=>{
      try { conn.end(); } catch {}
      resolve({ ok:false, reason:'timeout' });
    }, 8000);
    conn.on('ready', ()=>{ clearTimeout(timer); conn.end(); resolve({ ok:true }); })
        .on('error', (err)=>{ clearTimeout(timer); resolve({ ok:false, reason: String(err.message||err) }); })
        .connect({
          host: s.host,
          port: s.port,
          username: s.username,
          password: s.authType==='password' ? s.password : undefined,
          // TODO: privateKey for key auth
          readyTimeout: 7000,
        });
  });
}

export async function execCommand(s: ServerItem, cmd: string): Promise<{ exitCode:number; stdout:string; stderr:string }>{
  if (cmd.trim().startsWith('mock:')){
    return { exitCode:0, stdout:`MOCK ${cmd.slice(5).trim()}`, stderr:'' };
  }
  return new Promise((resolve)=>{
    const conn = new Client();
    let stdout = '';
    let stderr = '';
    conn.on('ready', ()=>{
      conn.exec(cmd, (err, stream)=>{
        if (err){ resolve({ exitCode:1, stdout:'', stderr:String(err) }); return; }
        stream.on('close', (code:number)=>{ conn.end(); resolve({ exitCode: code ?? 0, stdout, stderr }); })
              .on('data', (d:Buffer)=>{ stdout += d.toString(); })
              .stderr.on('data', (d:Buffer)=>{ stderr += d.toString(); });
      });
    }).on('error', (err)=>{
      resolve({ exitCode:1, stdout:'', stderr:String(err) });
    }).connect({ host: s.host, port: s.port, username: s.username, password: s.password });
  });
}
```

---

## 🌐 API/src/routes/servers.ts
```ts
import { Router } from 'express';
import { createServer, deleteServer, getServer, listServers, updateServer } from '../services/inventory';
import { log } from '../services/audit';
import { pingServer, execCommand } from '../services/ssh';

export const serversRouter = Router();

serversRouter.get('/', (req,res)=>{ res.json(listServers()); });

serversRouter.post('/', async (req,res)=>{
  const s = createServer(req.body);
  log({ ts: Date.now(), level:'info', message:'server.create', meta: { id: s.id, name: s.name } });
  res.status(201).json(s);
});

serversRouter.get('/:id', (req,res)=>{
  const s = getServer(req.params.id);
  if (!s) return res.status(404).json({ error:'not found' });
  res.json(s);
});

serversRouter.put('/:id', (req,res)=>{
  try{ const s = updateServer(req.params.id, req.body); res.json(s); }
  catch{ res.status(404).json({ error:'not found' }); }
});

serversRouter.delete('/:id', (req,res)=>{ deleteServer(req.params.id); res.status(204).end(); });

serversRouter.post('/:id/ping', async (req,res)=>{
  const s = getServer(req.params.id);
  if (!s) return res.status(404).json({ error:'not found' });
  const r = await pingServer(s);
  res.json(r);
});

serversRouter.post('/:id/exec', async (req,res)=>{
  const s = getServer(req.params.id);
  if (!s) return res.status(404).json({ error:'not found' });
  const { cmd } = req.body as { cmd: string };
  const r = await execCommand(s, cmd);
  res.json(r);
});
```

---

## 🗺️ API/src/routes/logs.ts
```ts
import { Router } from 'express';
import { read } from '../services/audit';
export const logsRouter = Router();
logsRouter.get('/', (req,res)=>{ res.json(read(200)); });
```

---

## 🔑 API/src/routes/auth.ts (dev-friendly)
```ts
import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/login', (req,res)=>{
  if (process.env.ALLOW_DEV_NO_AUTH === 'true'){
    return res.json({ token: 'dev-token' });
  }
  // TODO: real auth w/ JWT
  res.status(501).json({ error: 'Auth not implemented. Set ALLOW_DEV_NO_AUTH=true for dev.' });
});
```

---

## 🔊 API/src/ws.ts
```ts
import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';

export function attachWS(httpServer: HttpServer){
  const io = new Server(httpServer, { path: '/ws', cors: { origin: '*' } });
  io.on('connection', (socket)=>{
    socket.emit('hello', 'connected');
  });
  return io;
}
```

---

## 🏁 API/src/index.ts
```ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { serversRouter } from './routes/servers';
import { logsRouter } from './routes/logs';
import { authRouter } from './routes/auth';
import { attachWS } from './ws';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/servers', serversRouter);
app.use('/api/logs', logsRouter);

const port = Number(process.env.PORT||5050);
const server = http.createServer(app);
attachWS(server);

server.listen(port, ()=>{
  console.log(`[api] listening on http://localhost:${port}`);
});
```

---

## 📦 API/package.json
```json
{
  "name": "server-admin-api",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "better-sqlite3": "^9.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "socket.io": "^4.7.5",
    "ssh2": "^1.16.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.4.5"
  }
}
```

---

# 🖥️ Frontend (Vue 3)

## web/tailwind.config.cjs
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  theme: { extend: {} },
  plugins: [],
};
```

## web/postcss.config.cjs
```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

## web/src/main.ts
```ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './style.css';

createApp(App).use(createPinia()).use(router).mount('#app');
```

## web/src/style.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## web/src/router.ts
```ts
import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from './pages/Dashboard.vue';
import Servers from './pages/Servers.vue';
import ServerDetail from './pages/ServerDetail.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Dashboard },
    { path: '/servers', component: Servers },
    { path: '/servers/:id', component: ServerDetail, props: true },
  ],
});
```

## web/src/api/client.ts
```ts
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:5050/api' });
export default api;
```

## web/src/stores/servers.ts
```ts
import { defineStore } from 'pinia';
import api from '../api/client';

export type ServerItem = {
  id: string; name: string; host: string; port: number; username: string; authType: 'password'|'key'; tags?: string[];
};

export const useServers = defineStore('servers', {
  state: ()=>({ list: [] as ServerItem[], loading:false }),
  actions: {
    async fetch(){ this.loading = true; const { data } = await api.get('/servers'); this.list = data; this.loading=false; },
    async create(payload: Omit<ServerItem,'id'> & { password?: string }){ const { data } = await api.post('/servers', payload); this.list.push(data); return data; },
    async ping(id:string){ const { data } = await api.post(`/servers/${id}/ping`); return data; },
  }
});
```

## web/src/components/StatusBadge.vue
```vue
<template>
  <span :class="['px-2 py-1 rounded text-xs', ok ? 'bg-green-100' : 'bg-red-100']">
    <slot />
  </span>
</template>
<script setup lang="ts">
defineProps<{ ok: boolean }>();
</script>
```

## web/src/components/ServerCard.vue
```vue
<template>
  <div class="p-4 rounded-2xl shadow border flex items-center justify-between">
    <div>
      <h3 class="font-semibold text-lg">{{ s.name }}</h3>
      <p class="text-sm text-gray-600">{{ s.username }}@{{ s.host }}:{{ s.port }}</p>
      <div class="mt-2 flex gap-2 flex-wrap">
        <span v-for="t in s.tags" :key="t" class="text-xs bg-gray-100 px-2 py-1 rounded">{{ t }}</span>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <StatusBadge :ok="status === 'up'">{{ status === 'up' ? 'Online' : 'Unknown' }}</StatusBadge>
      <button @click="onPing" class="px-3 py-1 rounded-xl border">Ping</button>
      <router-link :to="`/servers/${s.id}`" class="px-3 py-1 rounded-xl bg-black text-white">Open</router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useServers, type ServerItem } from '../stores/servers';
import StatusBadge from './StatusBadge.vue';

const props = defineProps<{ s: ServerItem }>();
const store = useServers();
const status = ref<'up'|'down'|'unknown'>('unknown');

async function onPing(){
  const r = await store.ping(props.s.id);
  status.value = r.ok ? 'up' : 'down';
}
</script>
```

## web/src/pages/Dashboard.vue
```vue
<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <p class="text-gray-600">Quản lý kết nối tới server (Windows/Kali). Bản demo chạy localhost.</p>
    <router-link to="/servers" class="inline-block px-4 py-2 rounded-xl bg-black text-white">Quản lý Servers</router-link>
  </div>
</template>
```

## web/src/pages/Servers.vue
```vue
<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Servers</h1>
      <button @click="showAdd = !showAdd" class="px-4 py-2 rounded-xl bg-black text-white">Thêm server</button>
    </div>

    <form v-if="showAdd" class="grid grid-cols-2 gap-3 p-4 border rounded-2xl" @submit.prevent="create">
      <input v-model="form.name" placeholder="Name" class="border p-2 rounded" required />
      <input v-model="form.host" placeholder="Host (e.g. 192.168.1.10)" class="border p-2 rounded" required />
      <input v-model.number="form.port" type="number" placeholder="Port (22)" class="border p-2 rounded" />
      <input v-model="form.username" placeholder="Username" class="border p-2 rounded" required />
      <select v-model="form.authType" class="border p-2 rounded">
        <option value="password">Password</option>
        <option value="key" disabled>Key (soon)</option>
      </select>
      <input v-if="form.authType==='password'" v-model="form.password" placeholder="Password (dev)" class="border p-2 rounded" />
      <input v-model="tagsInput" placeholder="Tags (comma)" class="border p-2 rounded col-span-2" />
      <button class="col-span-2 px-4 py-2 rounded-xl bg-black text-white">Lưu</button>
    </form>

    <div class="grid gap-4">
      <ServerCard v-for="s in store.list" :key="s.id" :s="s" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useServers } from '../stores/servers';
import ServerCard from '../components/ServerCard.vue';

const store = useServers();
const showAdd = ref(false);
const tagsInput = ref('');
const form = reactive({ name:'', host:'', port:22, username:'root', authType:'password', password:'' });

onMounted(()=> store.fetch());

async function create(){
  const tags = tagsInput.value.split(',').map(s=>s.trim()).filter(Boolean);
  await store.create({ ...(form as any), tags });
  showAdd.value = false; tagsInput.value = ''; Object.assign(form, { name:'', host:'', port:22, username:'root', authType:'password', password:'' });
}
</script>
```

## web/src/pages/ServerDetail.vue
```vue
<template>
  <div class="p-6 space-y-4">
    <router-link to="/servers" class="text-sm">← Back</router-link>
    <h1 class="text-2xl font-bold">Server Detail</h1>
    <div v-if="server" class="space-y-2">
      <p class="text-gray-700">{{ server.username }}@{{ server.host }}:{{ server.port }}</p>
      <div class="flex gap-2">
        <input v-model="cmd" placeholder="Command (e.g. uname -a or mock:status)" class="border p-2 rounded w-full" />
        <button @click="run" class="px-4 py-2 rounded-xl bg-black text-white">Run</button>
      </div>
      <pre class="bg-gray-950 text-gray-100 p-4 rounded-2xl overflow-auto"><code>{{ output }}</code></pre>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useServers } from '../stores/servers';
import api from '../api/client';

const props = defineProps<{ id: string }>();
const store = useServers();
const server = computed(()=> store.list.find(x=>x.id === props.id));
const cmd = ref('mock:status');
const output = ref('');

onMounted(()=> store.fetch());

async function run(){
  if (!server.value) return;
  const { data } = await api.post(`/servers/${server.value.id}/exec`, { cmd: cmd.value });
  output.value = `$ ${cmd.value}\n\n` + (data.stdout || data.stderr || JSON.stringify(data,null,2));
}
</script>
```

## web/src/App.vue
```vue
<template>
  <div class="max-w-5xl mx-auto">
    <nav class="p-4 flex gap-4 border-b sticky top-0 bg-white/80 backdrop-blur z-10">
      <router-link to="/" class="font-bold">Server Admin</router-link>
      <router-link to="/servers">Servers</router-link>
    </nav>
    <router-view />
  </div>
</template>
```

## web/package.json (patch)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 5173"
  }
}
```

## web/vite.config.ts (ensure CORS friendly dev)
```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: { port: 5173 },
});
```

---

## ▶️ Run Locally

```bash
# Terminal 1 (API)
cd api
cp .env.example .env
npm run dev

# Terminal 2 (Web)
cd web
npm run dev
# open http://localhost:5173
```

- Add a server with host `127.0.0.1`, user `your-windows-username` (SSH usually off on Windows). For demo, use **exec command** `mock:hello` — backend returns mock output.
- When you point to a **Kali** box with SSH enabled, use real commands (e.g., `uname -a`).

---

## 🧭 Deploy Advice (ngắn gọn)
- **Khuyến nghị:** Ubuntu Server + Docker + Nginx reverse proxy. Chạy API (Node) bằng `docker compose`, Web build tĩnh (Vite) serve qua Nginx. Dễ di chuyển sang VPS/Cloud.
- **Windows Server:** có thể chạy API bằng `pm2` hoặc NSSM + reverse proxy IIS; web tĩnh qua IIS.
- **Bảo mật:** bật HTTPS (Let's Encrypt), disable password SSH (dùng key), JWT cho web admin, audit logs lưu 30–90 ngày.

> Mọi thứ trên đã tối giản để chạy ngay trên localhost, và có chỗ trống để nâng cấp (auth, RBAC, key-based SSH, service management, WebSocket streaming logs/metrics).
