<!-- <script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>-->

<script setup lang="ts">
import { useAuthStore } from './stores/auth';
const store = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <router-link to="/admin" class="font-semibold">Admin Web</router-link>
          <router-link v-if="store.user?.role==='admin'" to="/admin/connections" class="text-sm text-gray-600 hover:text-black">Connections</router-link>
          <router-link v-if="store.user?.role==='admin'" to="/admin/servers" class="text-sm text-gray-600 hover:text-black">Servers</router-link>
          <router-link v-if="store.user?.role==='admin'" to="/admin/users" class="text-sm text-gray-600 hover:text-black">Users</router-link>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="store.user" class="text-sm text-gray-600">{{ store.user.username }} ({{ store.user.role }})</span>
          <button v-if="store.user" @click="store.logout(); $router.push('/login')" class="px-3 py-1.5 rounded-lg bg-black text-white text-sm">Logout</button>
          <router-link v-else to="/login" class="px-3 py-1.5 rounded-lg bg-black text-white text-sm">Login</router-link>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>