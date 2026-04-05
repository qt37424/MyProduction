<script setup lang="ts">
import { ref, onMounted } from 'vue';
import http from '../api/http';

interface User { id:number; username:string; role:'admin'|'user'|'guest' }
const rows = ref<User[]>([]);
const loading = ref(false);

const username = ref('');
const password = ref('');
const role = ref<'admin'|'user'|'guest'>('user');
const creating = ref(false);
const error = ref('');

async function fetchUsers() {
  loading.value = true;
  try {
    const { data } = await http.get('/users');
    rows.value = data;
  } finally { loading.value = false; }
}

async function createUser() {
  error.value = ''; creating.value = true;
  try {
    await http.post('/users', { username: username.value, password: password.value, role: role.value });
    username.value = ''; password.value = ''; role.value = 'user';
    await fetchUsers();
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Failed to create user';
  } finally { creating.value = false; }
}

onMounted(fetchUsers);
</script>

<template>
  <div class="p-6 space-y-6 max-w-6xl mx-auto">
    <h1 class="text-xl font-semibold">Users</h1>

    <div class="bg-white rounded-2xl border p-4 space-y-3">
      <div class="text-sm text-gray-600">Create User</div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input v-model="username" placeholder="username" class="border rounded-lg p-2" />
        <input v-model="password" placeholder="password" type="password" class="border rounded-lg p-2" />
        <select v-model="role" class="border rounded-lg p-2">
          <option value="admin">admin</option>
          <option value="user">user</option>
          <option value="guest">guest</option>
        </select>
        <button :disabled="creating" @click="createUser" class="px-3 py-2 rounded-lg bg-black text-white">Create</button>
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    </div>

    <div class="rounded-2xl border overflow-x-auto bg-white">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left p-3">ID</th>
            <th class="text-left p-3">Username</th>
            <th class="text-left p-3">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in rows" :key="u.id" class="border-t">
            <td class="p-3">{{ u.id }}</td>
            <td class="p-3">{{ u.username }}</td>
            <td class="p-3">{{ u.role }}</td>
          </tr>
          <tr v-if="!rows.length && !loading"><td colspan="3" class="p-6 text-center text-gray-500">No users</td></tr>
          <tr v-if="loading"><td colspan="3" class="p-6 text-center text-gray-500">Loading…</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>