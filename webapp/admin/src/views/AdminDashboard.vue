<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { computed } from 'vue';

const store = useAuthStore();
const name = computed(() => store.user?.username || '');
</script>

<template>
  <div class="p-6 space-y-4 max-w-6xl mx-auto">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Admin Dashboard</h1>
      <router-link to="/admin/connections" class="underline">View Connections</router-link>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded-2xl border p-4">
        <div class="text-gray-500 text-sm">Welcome</div>
        <div class="text-xl">{{ name }}</div>
      </div>
      <div class="rounded-2xl border p-4">
        <div class="text-gray-500 text-sm">Role</div>
        <div class="text-xl">{{ store.user?.role }}</div>
      </div>
      <div class="rounded-2xl border p-4">
        <div class="text-gray-500 text-sm">Quick Actions</div>
        <div class="mt-2 flex gap-2">
          <router-link to="/admin/servers" class="px-3 py-2 rounded-lg bg-black text-white text-sm">Servers</router-link>
          <router-link to="/admin/users" class="px-3 py-2 rounded-lg bg-black text-white text-sm">Users</router-link>
        </div>
      </div>
    </div>
  </div>
</template>