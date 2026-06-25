<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    align?: "left" | "center" | "right";
    numeric?: boolean;
    sortable?: boolean;
    sortDirection?: "asc" | "desc" | null;
  }>(),
  { align: "left", numeric: false, sortable: false, sortDirection: null }
);

const emit = defineEmits<{ sort: [event: MouseEvent] }>();

const active = computed(
  () => props.sortDirection === "asc" || props.sortDirection === "desc"
);
const cls = computed(() =>
  [
    props.align === "right" ? "jl-th--right" : props.align === "center" ? "jl-th--center" : "",
    props.numeric ? "jl-th--num" : "",
    active.value ? "jl-th--active" : "",
  ]
    .filter(Boolean)
    .join(" ")
);
const ariaSort = computed(() =>
  !props.sortable
    ? undefined
    : active.value
    ? props.sortDirection === "asc"
      ? "ascending"
      : "descending"
    : "none"
);
</script>

<template>
  <th scope="col" :class="cls" :aria-sort="ariaSort">
    <button v-if="sortable" type="button" class="jl-th__btn" @click="emit('sort', $event)">
      <span><slot /></span>
      <span class="jl-th__sort">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path v-if="sortDirection === 'asc'" d="M8 14l4-4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path v-else-if="sortDirection === 'desc'" d="M8 10l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path v-else d="M8 9l4-4 4 4M8 15l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </button>
    <slot v-else />
  </th>
</template>
