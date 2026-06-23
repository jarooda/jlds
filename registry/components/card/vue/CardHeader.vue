<script setup lang="ts">
import { useSlots } from "vue";

defineProps<{
  title?: string;
  subtitle?: string;
}>();

const slots = useSlots();
</script>

<template>
  <div class="jl-card__header">
    <slot name="icon" />
    <div v-if="title || subtitle" class="jl-card__header-text">
      <div v-if="title" class="jl-card__title">{{ title }}</div>
      <div v-if="subtitle" class="jl-card__subtitle">{{ subtitle }}</div>
    </div>
    <slot />
    <div v-if="slots.action" class="jl-card__header-action"><slot name="action" /></div>
  </div>
</template>
