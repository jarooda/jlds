<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { toasts, removeToast, type ToastRecord } from "./toast";

const props = withDefaults(
  defineProps<{
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "top-center";
  }>(),
  { position: "bottom-right" }
);

const leaving = ref<Set<number>>(new Set());
const scheduled = new Set<number>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function dismiss(id: number) {
  const next = new Set(leaving.value);
  next.add(id);
  leaving.value = next;
  setTimeout(() => {
    removeToast(id);
    scheduled.delete(id);
    timers.delete(id);
  }, 180);
}
function onAction(t: ToastRecord) {
  t.action?.onClick?.();
  dismiss(t.id);
}

watch(
  toasts,
  (list) => {
    list.forEach((t) => {
      if (scheduled.has(t.id)) return;
      scheduled.add(t.id);
      if (t.duration === Infinity || t.duration === 0) return;
      timers.set(
        t.id,
        setTimeout(() => dismiss(t.id), t.duration ?? 4500)
      );
    });
  },
  { deep: true, immediate: true }
);
onBeforeUnmount(() => timers.forEach((tm) => clearTimeout(tm)));

const ordered = computed(() =>
  props.position.startsWith("top") ? [...toasts.value].reverse() : toasts.value
);
</script>

<template>
  <div class="jl-toaster" :data-pos="position">
    <div
      v-for="t in ordered"
      :key="t.id"
      class="jl-toast"
      :class="t.tone ? `jl-toast--${t.tone}` : ''"
      role="status"
      :data-leaving="leaving.has(t.id) || undefined"
    >
      <span v-if="t.tone" class="jl-toast__icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" opacity="0.35" />
          <template v-if="t.tone === 'success'"><path d="M8 12.5l2.5 2.5 5.5-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></template>
          <template v-else-if="t.tone === 'warning'"><path d="M12 8.5v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none" /></template>
          <template v-else-if="t.tone === 'danger'"><path d="M12 8v4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none" /></template>
          <template v-else><path d="M12 11v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><circle cx="12" cy="8" r="0.7" fill="currentColor" stroke="none" /></template>
        </svg>
      </span>
      <div class="jl-toast__body">
        <div v-if="t.title" class="jl-toast__title">{{ t.title }}</div>
        <div v-if="t.description" class="jl-toast__desc">{{ t.description }}</div>
        <button v-if="t.action" type="button" class="jl-toast__action" @click="onAction(t)">
          {{ t.action.label }}
        </button>
      </div>
      <button type="button" class="jl-toast__close" aria-label="Dismiss" @click="dismiss(t.id)">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style src="./toast.css"></style>
