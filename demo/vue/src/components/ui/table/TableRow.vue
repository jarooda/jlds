<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{ selected?: boolean; interactive?: boolean }>(),
  { selected: false, interactive: false }
);

const cls = computed(() =>
  [props.interactive ? "jl-tr--interactive" : "", props.selected ? "jl-tr--selected" : ""]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <tr :class="cls" :aria-selected="selected || undefined"><slot /></tr>
</template>
