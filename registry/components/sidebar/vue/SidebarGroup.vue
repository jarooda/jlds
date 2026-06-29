<script setup lang="ts">
defineProps<{ label?: string }>();
</script>

<template>
  <div class="jl-sidebar__group">
    <div v-if="label || $slots.label" class="jl-sidebar__group-label"><slot name="label">{{ label }}</slot></div>
    <slot />
  </div>
</template>
