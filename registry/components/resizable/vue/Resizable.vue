<script setup lang="ts">
import { ref, provide, computed, onMounted, type Ref } from "vue";

export interface ResizableCtx {
  horizontal: Ref<boolean>;
  sizes: Ref<number[]>;
  count: Ref<number>;
  register: (config: { defaultSize?: number; minSize?: number }) => number;
  startDrag: (e: PointerEvent, i: number) => void;
  onMove: (e: PointerEvent) => void;
  endDrag: (e: PointerEvent) => void;
  onKey: (e: KeyboardEvent, i: number) => void;
}

const props = withDefaults(
  defineProps<{ direction?: "horizontal" | "vertical" }>(),
  { direction: "horizontal" }
);

const emit = defineEmits<{ (e: "resize", sizes: number[]): void }>();

const horizontal = computed(() => props.direction === "horizontal");
const container = ref<HTMLElement | null>(null);
const configs: { defaultSize?: number; minSize?: number }[] = [];
const sizes = ref<number[]>([]);
const count = ref(0);

function register(config: { defaultSize?: number; minSize?: number }) {
  configs.push(config);
  count.value = configs.length;
  return configs.length - 1;
}

function mins() {
  return configs.map((c) => (c.minSize != null ? c.minSize : 8));
}

onMounted(() => {
  const explicit = configs.map((c) => (c.defaultSize != null ? c.defaultSize : null));
  const given = explicit.filter((v): v is number => v != null).reduce((a, b) => a + b, 0);
  const missing = explicit.filter((v) => v == null).length;
  const fill = missing > 0 ? (100 - given) / missing : 0;
  sizes.value = explicit.map((v) => (v != null ? v : fill));
});

let drag: { i: number; start: number; total: number; sizes: number[] } | null = null;

function startDrag(e: PointerEvent, i: number) {
  e.preventDefault();
  const rect = container.value!.getBoundingClientRect();
  const total = horizontal.value ? rect.width : rect.height;
  drag = { i, start: horizontal.value ? e.clientX : e.clientY, total, sizes: [...sizes.value] };
  document.body.setAttribute("data-jl-resizing", horizontal.value ? "x" : "y");
  const el = e.currentTarget as HTMLElement;
  el.setAttribute("data-dragging", "true");
  el.setPointerCapture?.(e.pointerId);
}

function onMove(e: PointerEvent) {
  if (!drag) return;
  const m = mins();
  const pos = horizontal.value ? e.clientX : e.clientY;
  let deltaPct = ((pos - drag.start) / drag.total) * 100;
  const a = drag.sizes[drag.i]!;
  const b = drag.sizes[drag.i + 1]!;
  deltaPct = Math.max(deltaPct, -(a - m[drag.i]!));
  deltaPct = Math.min(deltaPct, b - m[drag.i + 1]!);
  const next = [...drag.sizes];
  next[drag.i] = a + deltaPct;
  next[drag.i + 1] = b - deltaPct;
  sizes.value = next;
  emit("resize", next);
}

function endDrag(e: PointerEvent) {
  if (!drag) return;
  drag = null;
  document.body.removeAttribute("data-jl-resizing");
  (e.currentTarget as HTMLElement).removeAttribute("data-dragging");
}

function onKey(e: KeyboardEvent, i: number) {
  const step = 2;
  let dir = 0;
  if (e.key === (horizontal.value ? "ArrowRight" : "ArrowDown")) dir = 1;
  else if (e.key === (horizontal.value ? "ArrowLeft" : "ArrowUp")) dir = -1;
  if (!dir) return;
  e.preventDefault();
  const m = mins();
  const a = sizes.value[i]!;
  const b = sizes.value[i + 1]!;
  let delta = dir * step;
  delta = Math.max(delta, -(a - m[i]!));
  delta = Math.min(delta, b - m[i + 1]!);
  const next = [...sizes.value];
  next[i] = a + delta;
  next[i + 1] = b - delta;
  sizes.value = next;
  emit("resize", next);
}

provide<ResizableCtx>("jlResizable", {
  horizontal,
  sizes,
  count,
  register,
  startDrag,
  onMove,
  endDrag,
  onKey,
});
</script>

<template>
  <div ref="container" :class="['jl-resizable', `jl-resizable--${direction}`]">
    <slot />
  </div>
</template>

<style src="./resizable.css"></style>
