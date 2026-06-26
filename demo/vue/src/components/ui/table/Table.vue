<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    density?: "comfortable" | "compact";
    stickyHeader?: boolean;
  }>(),
  { density: "comfortable", stickyHeader: false }
);

const cls = computed(() =>
  [
    "jl-table",
    props.density === "compact" ? "jl-table--compact" : "",
    props.stickyHeader ? "jl-table--sticky" : "",
  ]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <div class="jl-table-wrap">
    <table :class="cls"><slot /></table>
  </div>
</template>

<style src="./table.css"></style>
