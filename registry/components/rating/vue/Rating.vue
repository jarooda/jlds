<script setup lang="ts">
import { computed, ref } from "vue";

type RatingSize = "sm" | "md" | "lg";
type RatingTone = "accent" | "warning" | "danger" | "neutral";

const props = withDefaults(
  defineProps<{
    /** v-model value */
    modelValue?: number;
    max?: number;
    allowHalf?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    size?: RatingSize;
    tone?: RatingTone;
    showValue?: boolean;
    count?: number;
    ariaLabel?: string;
  }>(),
  {
    modelValue: 0,
    max: 5,
    allowHalf: false,
    readOnly: false,
    disabled: false,
    size: "md",
    tone: "accent",
    showValue: false,
    count: undefined,
    ariaLabel: "Rating",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
  (e: "change", value: number): void;
}>();

const SIZES: Record<RatingSize, number> = { sm: 16, md: 20, lg: 26 };
const STAR_PATH = "m12 3.2 2.7 5.5 6 .9-4.35 4.24 1.03 6L12 17.1 6.62 19.84l1.03-6L3.3 9.6l6-.9Z";

const hover = ref<number | null>(null);
const interactive = computed(() => !props.readOnly && !props.disabled);
const display = computed(() => (hover.value != null ? hover.value : props.modelValue));
const px = computed(() => SIZES[props.size] || SIZES.md);

function set(v: number) {
  if (!interactive.value) return;
  emit("update:modelValue", v);
  emit("change", v);
}

function fillFor(i: number): "full" | "half" | "empty" {
  const starVal = i + 1;
  if (display.value >= starVal) return "full";
  if (props.allowHalf && display.value >= starVal - 0.5) return "half";
  return "empty";
}

function valueAt(i: number, e: MouseEvent) {
  if (!props.allowHalf) return i + 1;
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  return e.clientX - r.left < r.width / 2 ? i + 0.5 : i + 1;
}

function onKey(e: KeyboardEvent) {
  if (!interactive.value) return;
  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
    e.preventDefault();
    set(Math.min(props.max, props.modelValue + (props.allowHalf ? 0.5 : 1)));
  }
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
    e.preventDefault();
    set(Math.max(0, props.modelValue - (props.allowHalf ? 0.5 : 1)));
  }
}
</script>

<template>
  <span
    class="jl-rating"
    :data-readonly="props.readOnly || undefined"
    :data-disabled="props.disabled || undefined"
    :data-tone="props.tone !== 'accent' ? props.tone : undefined"
    :role="interactive ? 'slider' : 'img'"
    :aria-label="interactive ? props.ariaLabel : `${props.ariaLabel}: ${props.modelValue} of ${props.max}`"
    :aria-valuenow="interactive ? props.modelValue : undefined"
    :aria-valuemin="interactive ? 0 : undefined"
    :aria-valuemax="interactive ? props.max : undefined"
    @mouseleave="hover = null"
  >
    <span class="jl-rating__stars">
      <button
        v-for="i in props.max"
        :key="i"
        type="button"
        class="jl-rating__btn"
        :data-fill="fillFor(i - 1)"
        :tabindex="interactive ? 0 : -1"
        :aria-hidden="!interactive"
        :aria-label="`${i} star${i > 1 ? 's' : ''}`"
        :disabled="props.disabled"
        @mousemove="interactive && props.allowHalf ? (hover = valueAt(i - 1, $event)) : undefined"
        @mouseenter="interactive && !props.allowHalf ? (hover = i) : undefined"
        @click="interactive ? set(valueAt(i - 1, $event)) : undefined"
        @keydown="onKey"
      >
        <span class="jl-rating__star" :style="{ position: 'relative', width: `${px}px`, height: `${px}px` }">
          <svg :width="px" :height="px" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="position: absolute; inset: 0">
            <path :d="STAR_PATH" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
          </svg>
          <svg class="jl-rating__fg jl-rating__fill" :width="px" :height="px" viewBox="0 0 24 24" aria-hidden="true" style="position: absolute; inset: 0">
            <path :d="STAR_PATH" fill="currentColor" />
          </svg>
        </span>
      </button>
    </span>
    <span v-if="props.showValue" class="jl-rating__value">
      {{ props.modelValue.toFixed(props.allowHalf ? 1 : 0) }}
      <span v-if="props.count != null" class="jl-rating__count"> ({{ props.count.toLocaleString() }})</span>
    </span>
  </span>
</template>

<style src="./rating.css"></style>
