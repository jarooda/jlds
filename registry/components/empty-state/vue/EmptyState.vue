<script setup lang="ts">
import { computed, useSlots } from "vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    size?: "sm" | "md";
    bordered?: boolean;
  }>(),
  { size: "md", bordered: false }
);

const slots = useSlots();
const cls = computed(() =>
  [
    "jl-empty",
    props.size === "sm" ? "jl-empty--sm" : "",
    props.bordered ? "jl-empty--bordered" : "",
  ]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <div :class="cls">
    <span class="jl-empty__media">
      <slot name="icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 13h5l1.5 3h5L21 13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M5 5h14l2 8v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </slot>
    </span>
    <p v-if="title" class="jl-empty__title">{{ title }}</p>
    <p v-if="description" class="jl-empty__desc">{{ description }}</p>
    <slot />
    <div v-if="slots.actions" class="jl-empty__actions"><slot name="actions" /></div>
  </div>
</template>

<style src="./empty-state.css"></style>
