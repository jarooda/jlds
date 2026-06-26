<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  /** Fixed column count. Omit for a responsive auto-fit grid. */
  columns?: number;
}>();

const style = computed(() =>
  props.columns
    ? { gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))` }
    : undefined
);
</script>

<template>
  <div class="jl-stat-group" :style="style">
    <slot />
  </div>
</template>

<style src="./stat.css"></style>
