<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: number | null;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    size?: "sm" | "md" | "lg";
    align?: "left" | "center";
    suffix?: string;
    disabled?: boolean;
    invalid?: boolean;
    placeholder?: string;
  }>(),
  {
    modelValue: null,
    min: -Infinity,
    max: Infinity,
    step: 1,
    precision: undefined,
    size: "md",
    align: "center",
    suffix: "",
    disabled: false,
    invalid: false,
    placeholder: "",
  }
);

const emit = defineEmits<{ (e: "update:modelValue", v: number | null): void }>();

const text = ref(props.modelValue == null ? "" : String(props.modelValue));
watch(
  () => props.modelValue,
  (v) => {
    text.value = v == null ? "" : String(v);
  }
);

function decimals(step: number) {
  const s = String(step);
  return s.includes(".") ? s.split(".")[1].length : 0;
}
const prec = computed(() => (props.precision != null ? props.precision : decimals(props.step)));
const clamp = (n: number) => Math.min(props.max, Math.max(props.min, n));
const round = (n: number) => Number(n.toFixed(prec.value));
function cur(): number | null {
  const n = parseFloat(text.value);
  return Number.isNaN(n) ? null : n;
}

function commit(n: number | null) {
  const next = n == null || Number.isNaN(n) ? null : round(clamp(n));
  text.value = next == null ? "" : String(next);
  emit("update:modelValue", next);
}
function bump(dir: number) {
  const b = cur();
  const start = b == null ? (Number.isFinite(props.min) ? props.min : 0) : b;
  commit(start + dir * props.step);
}

const atMin = computed(() => cur() != null && (cur() as number) <= props.min);
const atMax = computed(() => cur() != null && (cur() as number) >= props.max);

function onInput(e: Event) {
  const t = e.target as HTMLInputElement;
  if (/^-?\d*\.?\d*$/.test(t.value)) text.value = t.value;
  else t.value = text.value;
}
function onBlur() {
  commit(cur());
}
function onKey(e: KeyboardEvent) {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    bump(1);
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    bump(-1);
  }
}

const cls = computed(() =>
  [
    "jl-number",
    `jl-number--${props.size}`,
    `jl-number--${props.align}`,
    props.disabled ? "jl-number--disabled" : "",
    props.invalid ? "jl-number--invalid" : "",
  ]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <div :class="cls">
    <button
      type="button"
      class="jl-number__btn jl-number__btn--dec"
      aria-label="Decrease"
      :disabled="disabled || atMin"
      tabindex="-1"
      @click="bump(-1)"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
    </button>
    <input
      class="jl-number__input"
      type="text"
      inputmode="decimal"
      role="spinbutton"
      :value="text"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      @input="onInput"
      @blur="onBlur"
      @keydown="onKey"
    />
    <span v-if="suffix" class="jl-number__affix">{{ suffix }}</span>
    <button
      type="button"
      class="jl-number__btn jl-number__btn--inc"
      aria-label="Increase"
      :disabled="disabled || atMax"
      tabindex="-1"
      @click="bump(1)"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
    </button>
  </div>
</template>

<style src="./number-input.css"></style>
