<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{ align?: "left" | "center" | "right"; numeric?: boolean }>(),
  { align: "left", numeric: false }
);

const cls = computed(() =>
  [
    props.align === "right" ? "jl-td--right" : props.align === "center" ? "jl-td--center" : "",
    props.numeric ? "jl-td--num" : "",
  ]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <td :class="cls"><slot /></td>
</template>
