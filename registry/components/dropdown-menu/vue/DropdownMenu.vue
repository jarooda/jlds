<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount, provide } from "vue";

const props = withDefaults(
  defineProps<{ align?: "start" | "end"; side?: "bottom" | "top" }>(),
  { align: "start", side: "bottom" }
);

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const close = () => (open.value = false);
const toggle = () => (open.value = !open.value);
provide("jlMenu", { close });

function onDown(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) close();
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") close();
}
/** Roving arrow-key navigation across the menu's items. */
function onPanelKey(e: KeyboardEvent) {
  if (!panel.value) return;
  const items = Array.from(
    panel.value.querySelectorAll<HTMLElement>('[role^="menuitem"]')
  ).filter((el) => el.getAttribute("aria-disabled") !== "true");
  if (!items.length) return;
  const i = items.indexOf(document.activeElement as HTMLElement);
  if (e.key === "ArrowDown") {
    e.preventDefault();
    items[(i + 1) % items.length]?.focus();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    items[(i - 1 + items.length) % items.length]?.focus();
  } else if (e.key === "Home") {
    e.preventDefault();
    items[0]?.focus();
  } else if (e.key === "End") {
    e.preventDefault();
    items[items.length - 1]?.focus();
  }
}
watch(open, (v) => {
  if (v) {
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    nextTick(() => {
      const first = panel.value?.querySelector<HTMLElement>(
        '[role^="menuitem"]:not([aria-disabled="true"])'
      );
      first?.focus();
    });
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
      ref="panel"
      class="jl-menu__pop"
      role="menu"
      :data-side="side"
      :data-align="align"
      :style="{ '--_origin': origin }"
      @keydown="onPanelKey"
    >
      <slot />
    </div>
  </span>
</template>

<style src="./dropdown-menu.css"></style>
