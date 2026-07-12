<script setup lang="ts">
import { ref, onMounted } from "vue";

export interface SwipeAction {
  /** Stable id. */
  id: string;
  /** Action label (stacked under the icon). */
  label?: string;
  /** Inline SVG/HTML markup for the icon (rendered with v-html). */
  icon?: string;
  /** Color treatment. @default "neutral" */
  tone?: "neutral" | "accent" | "warning" | "danger";
}

const props = defineProps<{
  /** Trailing actions, revealed right-to-left. Keep to 1–3. */
  actions: SwipeAction[];
  /** Px the row must be dragged to latch open. @default 40% of the actions' width */
  threshold?: number;
}>();

const emit = defineEmits<{ action: [action: SwipeAction] }>();

const actionsRef = ref<HTMLElement | null>(null);
const offset = ref(0);
const animate = ref(false);
const actWidth = ref(0);
const finePointer = ref(false);
let drag: { x: number; base: number; moved: boolean } | null = null;

onMounted(() => {
  if (actionsRef.value) actWidth.value = actionsRef.value.offsetWidth;
  if (typeof window !== "undefined" && window.matchMedia) {
    finePointer.value = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }
});

function open() {
  animate.value = true;
  offset.value = -actWidth.value;
}
function close() {
  animate.value = true;
  offset.value = 0;
}

function onEnter() {
  if (finePointer.value && !drag) open();
}
function onLeave() {
  if (finePointer.value && !drag) close();
}

function onDown(e: PointerEvent) {
  if (e.pointerType === "mouse") return; // mouse uses hover cluster
  drag = { x: e.clientX, base: offset.value, moved: false };
  animate.value = false;
}
function onMove(e: PointerEvent) {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  if (Math.abs(dx) > 4) drag.moved = true;
  let next = drag.base + dx;
  next = Math.max(-actWidth.value - 24, Math.min(0, next));
  if (next > 0) next = 0;
  offset.value = next;
}
function onUp() {
  if (!drag) return;
  const t = props.threshold != null ? props.threshold : actWidth.value * 0.4;
  if (-offset.value > t) open();
  else close();
  drag = null;
}
function onClickCapture(e: MouseEvent) {
  if (drag && drag.moved) {
    e.stopPropagation();
    e.preventDefault();
  }
}

function trigger(action: SwipeAction) {
  emit("action", action);
  close();
}
</script>

<template>
  <div
    :class="['jl-swiperow', offset < -2 ? 'jl-swiperow--open' : '']"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <div ref="actionsRef" class="jl-swiperow__actions">
      <button
        v-for="a in actions"
        :key="a.id"
        type="button"
        class="jl-swiperow__action"
        :data-tone="a.tone || 'neutral'"
        @click="trigger(a)"
      >
        <!-- eslint-disable-next-line vue/no-v-html -- icon is developer-authored inline SVG markup, not user input -->
        <span v-if="a.icon" style="display: contents" v-html="a.icon" />
        <span v-if="a.label">{{ a.label }}</span>
      </button>
    </div>
    <div
      :class="['jl-swiperow__panel', animate ? 'jl-swiperow__panel--animate' : '']"
      :style="{ transform: `translateX(${offset}px)` }"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
      @click.capture="onClickCapture"
    >
      <slot />
    </div>
  </div>
</template>

<style src="./swipe-row.css"></style>
