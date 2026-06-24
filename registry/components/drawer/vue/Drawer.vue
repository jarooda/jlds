<script setup lang="ts">
import { watch, onBeforeUnmount, computed } from "vue";

const props = withDefaults(
  defineProps<{
    open: boolean;
    side?: "right" | "left" | "bottom";
    size?: number | string;
    title?: string;
    description?: string;
    showClose?: boolean;
  }>(),
  { side: "right", showClose: true }
);

const emit = defineEmits<{ (e: "close"): void; (e: "update:open", v: boolean): void }>();

function close() {
  emit("close");
  emit("update:open", false);
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") close();
}
watch(
  () => props.open,
  (v) => {
    if (v) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    }
  }
);
onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKey);
  document.body.style.overflow = "";
});

const sizeVar = computed(() =>
  props.size != null ? (typeof props.size === "number" ? `${props.size}px` : props.size) : undefined
);
</script>

<template>
  <div v-if="open" class="jl-drawer__overlay" :data-side="side" @mousedown.self="close">
    <div class="jl-drawer" role="dialog" aria-modal="true" :style="{ '--_size': sizeVar }">
      <div v-if="title || showClose" class="jl-drawer__header">
        <div class="jl-drawer__header-text">
          <div v-if="title" class="jl-drawer__title">{{ title }}</div>
          <div v-if="description" class="jl-drawer__desc">{{ description }}</div>
        </div>
        <button v-if="showClose" type="button" class="jl-drawer__close" aria-label="Close" @click="close">
          <svg viewBox="0 0 18 18" width="18" height="18" fill="none" aria-hidden="true">
            <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </button>
      </div>
      <div v-if="$slots.default" class="jl-drawer__body"><slot /></div>
      <div v-if="$slots.footer" class="jl-drawer__footer"><slot name="footer" /></div>
    </div>
  </div>
</template>

<style src="./drawer.css"></style>
