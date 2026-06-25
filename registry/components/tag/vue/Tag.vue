<script setup lang="ts">
import { computed, useAttrs } from "vue";

const props = withDefaults(
  defineProps<{
    selected?: boolean;
    /** When true, renders an × button that emits `remove`. */
    removable?: boolean;
  }>(),
  { selected: false, removable: false }
);

const emit = defineEmits<{
  remove: [event: MouseEvent];
}>();

const attrs = useAttrs();

const interactive = computed(() => "onClick" in attrs);

const cls = computed(() =>
  [
    "jl-tag",
    interactive.value ? "jl-tag--button" : "",
    props.selected ? "jl-tag--selected" : "",
  ]
    .filter(Boolean)
    .join(" ")
);

function onRemove(event: MouseEvent) {
  event.stopPropagation();
  emit("remove", event);
}
</script>

<template>
  <span :class="cls">
    <slot name="icon" />
    <slot />
    <button
      v-if="props.removable"
      type="button"
      class="jl-tag__remove"
      aria-label="Remove"
      @click="onRemove"
    >
      <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
        <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>
  </span>
</template>

<style src="./tag.css"></style>
