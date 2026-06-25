<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, provide } from "vue";

const props = withDefaults(
  defineProps<{ align?: "start" | "end"; side?: "bottom" | "top" }>(),
  { align: "start", side: "bottom" }
);

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const close = () => (open.value = false);
const toggle = () => (open.value = !open.value);
provide("jlMenu", { close });

function onDown(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) close();
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") close();
}
watch(open, (v) => {
  if (v) {
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
  } else {
    document.removeEventListener("mousedown", onDown);
    document.removeEventListener("keydown", onKey);
  }
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onDown);
  document.removeEventListener("keydown", onKey);
});

const origin = computed(
  () => `${props.side === "top" ? "bottom" : "top"} ${props.align === "end" ? "right" : "left"}`
);
</script>

<template>
  <span ref="root" class="jl-menu">
    <span :aria-haspopup="'menu'" :aria-expanded="open" @click="toggle">
      <slot name="trigger" />
    </span>
    <div
      v-if="open"
      class="jl-menu__pop"
      role="menu"
      :data-side="side"
      :data-align="align"
      :style="{ '--_origin': origin }"
    >
      <slot />
    </div>
  </span>
</template>

<style src="./dropdown-menu.css"></style>
