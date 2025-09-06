<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import http from '../api/http';

interface Row { id:number; server_id:number; server_name:string; ip_address:string; connected_at:string; disconnected_at:string|null }

const rows = ref<Row[]>([]);
const loading = ref(false);
const servers = ref<{id:number; name:string}[]>([]);
const selectedServer = ref<number | null>(null);
const bandwidth = ref<{server:string; limit:number; used:number; remaining:number} | null>(null);

const filtered = computed(() => selectedServer.value ? rows.value.filter(r => r.server_id === selectedServer.value) : rows.value);

async function fetchConnections() {
  loading.value = true;
  try {
    const [{ data: cons }, { data: svs }] = await Promise.all([
      http.get('/admin/connections'),
      http.get('/admin/servers'),
    ]);
    rows.value = cons;
    servers.value = svs.map((s: any) => ({ id: s.id, name: s.name }));
  } finally { loading.value = false; }
}

async function exportCSV() {
  const res = await http.get('/admin/connections/export', { responseType: 'blob' });
  const url = URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement('a');
  a.href = url; a.download = 'connections.csv'; a.click(); URL.revokeObjectURL(url);
}

async function checkBandwidth() {
  if (!selectedServer.value) { bandwidth.value = null; return; }
  const { data } = await http.get(`/admin/servers/${selectedServer.value}/bandwidth`);
  bandwidth.value = data;
}

onMounted(fetchConnections);
</script>

<template>
  <div class="p-6 space-y-4 max-w-6xl mx-auto">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Connections</h1>
      <div class="flex items-center gap-2">
        <select v-model.number="selectedServer" @change="checkBandwidth" class="border rounded-lg p-2">
          <option :value="null">All servers</option>
          <option v-for="s in servers" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
        <button class="px-3 py-2 rounded-lg bg-black text-white" @click="exportCSV">Export CSV</button>
      </div>
    </div>

    <div v-if="bandwidth" class="rounded-2xl border p-4 bg-white">
      <div class="text-sm text-gray-500">Bandwidth for {{ bandwidth.server }}</div>
      <div class="mt-2">Limit: {{ bandwidth.limit.toLocaleString() }} bytes</div>
      <div>Used: {{ bandwidth.used.toLocaleString() }} bytes</div>
      <div class="font-semibold">Remaining: {{ bandwidth.remaining.toLocaleString() }} bytes</div>
    </div>

    <div class="rounded-2xl border overflow-x-auto bg-white">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left p-3">Server</th>
            <th class="text-left p-3">IP</th>
            <th class="text-left p-3">Connected</th>
            <th class="text-left p-3">Disconnected</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in filtered" :key="r.id" class="border-t">
            <td class="p-3">{{ r.server_name }}</td>
            <td class="p-3">{{ r.ip_address }}</td>
            <td class="p-3">{{ r.connected_at }}</td>
            <td class="p-3">{{ r.disconnected_at || '-' }}</td>
          </tr>
          <tr v-if="!filtered.length && !loading"><td colspan="4" class="p-6 text-center text-gray-500">No data</td></tr>
          <tr v-if="loading"><td colspan="4" class="p-6 text-center text-gray-500">Loading…</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>