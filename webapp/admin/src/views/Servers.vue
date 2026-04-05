<script setup lang="ts">
import { onMounted, ref } from "vue";
import http from "../api/http";

interface Server {
  id: number;
  name: string;
  host: string;
  port: number;
  bandwidth_limit: number;
  bandwidth_used: number;
}
const rows = ref<Server[]>([]);
const loading = ref(false);
const selected: any = ref(null);
const bw = ref<any>(null);

async function fetchServers() {
  loading.value = true;
  try {
    const { data } = await http.get("/admin/servers");
    rows.value = data;
  } finally {
    loading.value = false;
  }
}

async function viewBandwidth(id: number) {
  const { data } = await http.get(`/admin/servers/${id}/bandwidth`);
  selected.value = id;
  bw.value = data;
}

onMounted(fetchServers);
</script>

<template>
  <div class="p-6 space-y-4 max-w-6xl mx-auto">
    <h1 class="text-xl font-semibold">Servers</h1>
    <div class="rounded-2xl border overflow-x-auto bg-white">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left p-3">Name</th>
            <th class="text-left p-3">Host</th>
            <th class="text-left p-3">Port</th>
            <th class="text-left p-3">Bandwidth</th>
            <th class="text-left p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in rows" :key="s.id" class="border-t">
            <td class="p-3">{{ s.name }}</td>
            <td class="p-3">{{ s.host }}</td>
            <td class="p-3">{{ s.port }}</td>
            <td class="p-3">
              {{ s.bandwidth_used.toLocaleString() }} /
              {{ s.bandwidth_limit.toLocaleString() }} bytes
            </td>
            <td class="p-3">
              <button
                class="px-3 py-1.5 rounded-lg bg-black text-white text-xs"
                @click="viewBandwidth(s.id)"
              >
                Check
              </button>
            </td>
          </tr>
          <tr v-if="!rows.length && !loading">
            <td colspan="5" class="p-6 text-center text-gray-500">No data</td>
          </tr>
          <tr v-if="loading">
            <td colspan="5" class="p-6 text-center text-gray-500">Loading…</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="bw" class="rounded-2xl border p-4 bg-white">
      <div class="text-sm text-gray-500">Bandwidth</div>
      <div class="mt-2">Limit: {{ bw.limit.toLocaleString() }} bytes</div>
      <div>Used: {{ bw.used.toLocaleString() }} bytes</div>
      <div class="font-semibold">
        Remaining: {{ bw.remaining.toLocaleString() }} bytes
      </div>
    </div>
  </div>
</template>
