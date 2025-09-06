<script setup lang="ts">
import { ref } from 'vue';
import http from '../api/http';
// import api from "../services/api";
import { useAuthStore } from '../stores/auth';
import { useRouter, useRoute } from 'vue-router';

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const store = useAuthStore();
const router = useRouter();
const route = useRoute();

async function login() {
  error.value = ''; loading.value = true;
  try {
    const { data } = await http.post('/auth/login', { username: username.value, password: password.value });
    store.setAuth(data.token, data.user);
    router.push((route.query.redirect as string) || '/admin');
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-sm bg-white rounded-2xl shadow p-6 space-y-4">
      <h1 class="text-xl font-semibold">Admin Login</h1>
      <div class="space-y-2">
        <label class="text-sm">Username</label>
        <input v-model="username" class="w-full border rounded-lg p-2" />
      </div>
      <div class="space-y-2">
        <label class="text-sm">Password</label>
        <input v-model="password" type="password" class="w-full border rounded-lg p-2" />
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button @click="login" :disabled="loading" class="w-full rounded-xl p-2 bg-black text-white">
        {{ loading ? 'Logging in…' : 'Login' }}
      </button>
    </div>
  </div>
</template>