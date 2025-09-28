<template>
  <div class="bg-white p-4 rounded-lg shadow flex flex-col">
    <span class="text-sm text-gray-500">{{ title }}</span>
    <span class="text-2xl font-bold">{{ value }}</span>
    <span
      :class="[
        percent >= 0 ? 'text-green-500' : 'text-red-500',
        'text-sm mt-1',
      ]"
    >
      {{ percent >= 0 ? '+' : '' }}{{ percent }}%
    </span>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  percent: Number,
});
</script>