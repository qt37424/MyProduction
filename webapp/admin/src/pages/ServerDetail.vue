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