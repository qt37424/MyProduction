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