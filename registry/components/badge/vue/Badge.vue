<script setup lang="ts">
type BadgeColor = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

const props = withDefaults(
  defineProps<{
    color?: BadgeColor;
    solid?: boolean;
    pill?: boolean;
    dot?: boolean;
  }>(),
  {
    color: "neutral",
    solid: false,
    pill: false,
    dot: false,
  }
);

const cls = [
  "jl-badge",
  `jl-badge--${props.color}`,
  props.solid ? "jl-badge--solid" : "",
  props.pill ? "jl-badge--pill" : "",
]
  .filter(Boolean)
  .join(" ");
</script>

<template>
  <span :class="cls">
    <span v-if="props.dot" class="jl-badge__dot" />
    <slot name="icon" />
    <slot />
  </span>
</template>

<style src="./badge.css"></style>
