<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";

interface SegmentedOption {
  value: string;
  label?: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    options: (SegmentedOption | string)[];
    modelValue?: string;
    size?: "sm" | "md";
    fullWidth?: boolean;
  }>(),
  { size: "md", fullWidth: false }
);

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
  (e: "change", v: string): void;
}>();

const norm = computed(() =>
  props.options.map((o) => (typeof o === "string" ? { value: o, label: o } : o))
);
const current = computed(() => props.modelValue ?? norm.value[0]?.value);

const root = ref<HTMLElement | null>(null);
const thumb = ref<{ left: number; width: number } | null>(null);

function measure() {
  const r = root.value;
  if (!r) return;
  const idx = Math.max(0, norm.value.findIndex((o) => o.value === current.value));
  const btn = r.querySelectorAll<HTMLElement>(".jl-segmented__option")[idx];
  if (btn) {
    const pad = parseFloat(getComputedStyle(r).paddingLeft) || 0;
    thumb.value = { left: btn.offsetLeft - pad, width: btn.offsetWidth };
  }
}

onMounted(() => {
  nextTick(measure);
  if (typeof document !== "undefined" && document.fonts?.ready) {
    document.fonts.ready.then(measure);
  }
});
watch(
  [current, () => props.fullWidth, () => props.size, () => props.options.length],
  () => nextTick(measure)
);

function select(o: SegmentedOption) {
  if (o.disabled || o.value === current.value) return;
  emit("update:modelValue", o.value);
  emit("change", o.value);
}

const cls = computed(() =>
  [
    "jl-segmented",
    props.size === "sm" ? "jl-segmented--sm" : "",
    props.fullWidth ? "jl-segmented--full" : "",
  ]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <div ref="root" :class="cls" role="radiogroup">
    <span
      v-if="thumb"
      class="jl-segmented__thumb"
      :style="{ transform: `translateX(${thumb.left}px)`, width: thumb.width + 'px' }"
      aria-hidden="true"
    />
    <button
      v-for="o in norm"
      :key="o.value"
      type="button"
      role="radio"
      :aria-checked="o.value === current"
      :disabled="o.disabled"
      class="jl-segmented__option"
      @click="select(o)"
    >
      {{ o.label ?? o.value }}
    </button>
  </div>
</template>

<style src="./segmented-control.css"></style>
