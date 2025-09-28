<template>
  <aside class="w-64 bg-gray-900 text-gray-200 h-screen flex flex-col">
    <div class="p-4 text-2xl font-bold border-b border-gray-700">
      Admin<span class="text-blue-500">Panel</span>
    </div>
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <li v-for="item in menu" :key="item.label">
          <a
            href="#"
            class="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { Home, Users, BarChart3, Settings } from "lucide-vue-next";

const menu = [
  { label: "Dashboard", icon: Home },
  { label: "Users", icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];
</script>