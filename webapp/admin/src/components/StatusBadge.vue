<template>
  <span :class="['px-2 py-1 rounded text-xs', ok ? 'bg-green-100' : 'bg-red-100']">
    <slot />
  </span>
</template>
<script setup lang="ts">
defineProps<{ ok: boolean }>();
</script>