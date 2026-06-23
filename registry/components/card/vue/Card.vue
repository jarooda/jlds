<script setup lang="ts">
import { computed } from "vue";

type CardElevation = "flat" | "raised" | "floating";

const props = withDefaults(
  defineProps<{
    elevation?: CardElevation;
    interactive?: boolean;
  }>(),
  { elevation: "flat", interactive: false }
);

const cls = computed(() =>
  [
    "jl-card",
    `jl-card--${props.elevation}`,
    props.interactive ? "jl-card--interactive" : "",
  ]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <div :class="cls">
    <slot />
  </div>
</template>

<style src="./card.css"></style>
