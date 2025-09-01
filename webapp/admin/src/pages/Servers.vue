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