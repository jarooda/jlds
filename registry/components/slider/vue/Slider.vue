<script setup lang="ts">
import { ref, computed } from "vue";

type SliderMark = number | { value: number; label: string };
type SliderSize = "sm" | "md" | "lg";
type SliderValue = number | [number, number];

const props = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    step?: number;
    modelValue?: SliderValue;
    range?: boolean;
    disabled?: boolean;
    size?: SliderSize;
    marks?: SliderMark[];
    showValue?: boolean;
    formatValue?: (v: number) => string | number;
    label?: string;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    modelValue: undefined,
    range: false,
    disabled: false,
    size: "md",
    marks: undefined,
    showValue: false,
    formatValue: (v: number) => v,
    label: "",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: SliderValue): void;
  (e: "changeEnd", value: SliderValue): void;
}>();

const trackRef = ref<HTMLDivElement | null>(null);
const dragIndex = ref<number | null>(null);

const current = computed<SliderValue>(() =>
  props.modelValue != null ? props.modelValue : props.range ? [props.min, props.max] : props.min
);
const vals = computed<number[]>(() =>
  props.range ? (current.value as [number, number]) : [current.value as number]
);

const clamp = (v: number) => Math.min(props.max, Math.max(props.min, v));
const roundStep = (v: number) =>
  clamp(Number((Math.round((v - props.min) / props.step) * props.step + props.min).toFixed(10)));
const pct = (v: number) => ((v - props.min) / (props.max - props.min)) * 100;

function applyThumb(i: number, v: number, end: boolean) {
  const cur = vals.value;
  let next: SliderValue;
  if (props.range) {
    const arr = [...cur];
    if (i === 0) arr[0] = Math.min(v, cur[1]);
    else arr[1] = Math.max(v, cur[0]);
    next = [arr[0], arr[1]];
  } else {
    next = v;
  }
  emit("update:modelValue", next);
  if (end) emit("changeEnd", next);
}

function valueFromClient(clientX: number) {
  const rect = trackRef.value!.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  return roundStep(props.min + ratio * (props.max - props.min));
}

function onTrackPointerDown(e: PointerEvent) {
  if (props.disabled) return;
  const v = valueFromClient(e.clientX);
  const cur = vals.value;
  const i = props.range ? (Math.abs(cur[0] - v) <= Math.abs(cur[1] - v) ? 0 : 1) : 0;
  dragIndex.value = i;
  applyThumb(i, v, false);
  const move = (ev: PointerEvent) => applyThumb(dragIndex.value!, valueFromClient(ev.clientX), false);
  const up = (ev: PointerEvent) => {
    applyThumb(dragIndex.value!, valueFromClient(ev.clientX), true);
    dragIndex.value = null;
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

function onThumbKeyDown(i: number, e: KeyboardEvent) {
  if (props.disabled) return;
  const cur = vals.value[i];
  const big = props.step * 10;
  let v = cur;
  switch (e.key) {
    case "ArrowRight":
    case "ArrowUp":
      v = cur + props.step;
      break;
    case "ArrowLeft":
    case "ArrowDown":
      v = cur - props.step;
      break;
    case "PageUp":
      v = cur + big;
      break;
    case "PageDown":
      v = cur - big;
      break;
    case "Home":
      v = props.min;
      break;
    case "End":
      v = props.max;
      break;
    default:
      return;
  }
  e.preventDefault();
  applyThumb(i, roundStep(v), true);
}

const fillStyle = computed(() =>
  props.range
    ? { left: `${pct(vals.value[0])}%`, right: `${100 - pct(vals.value[1])}%` }
    : { left: "0", width: `${pct(vals.value[0])}%` }
);

const valueText = computed(() =>
  props.range
    ? `${props.formatValue(vals.value[0])} – ${props.formatValue(vals.value[1])}`
    : `${props.formatValue(vals.value[0])}`
);

const normalizedMarks = computed(() =>
  (props.marks ?? []).map((m) => (typeof m === "object" ? m : { value: m, label: String(m) }))
);
</script>

<template>
  <div class="jl-slider" :class="[`jl-slider--${props.size}`, props.disabled ? 'jl-slider--disabled' : '']">
    <div v-if="props.label || props.showValue" class="jl-slider__head">
      <span v-if="props.label" class="jl-slider__label">{{ props.label }}</span>
      <span v-if="props.showValue" class="jl-slider__value">{{ valueText }}</span>
    </div>
    <div ref="trackRef" class="jl-slider__track" @pointerdown="onTrackPointerDown">
      <span class="jl-slider__fill" :style="fillStyle" />
      <button
        v-for="(v, i) in vals"
        :key="i"
        type="button"
        class="jl-slider__thumb"
        :style="{ left: `${pct(v)}%` }"
        role="slider"
        :aria-valuemin="props.min"
        :aria-valuemax="props.max"
        :aria-valuenow="v"
        :aria-disabled="props.disabled || undefined"
        :tabindex="props.disabled ? -1 : 0"
        @keydown="onThumbKeyDown(i, $event)"
        @pointerdown.stop
        @click.prevent
      />
    </div>
    <div v-if="normalizedMarks.length" class="jl-slider__marks">
      <span
        v-for="(m, i) in normalizedMarks"
        :key="i"
        class="jl-slider__mark"
        :style="{ left: `${pct(m.value)}%` }"
      >{{ m.label }}</span>
    </div>
  </div>
</template>

<style src="./slider.css"></style>
