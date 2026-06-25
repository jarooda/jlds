<script setup lang="ts">
import { computed } from "vue";

interface ToggleOption {
  value: string;
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    type?: "single" | "multiple";
    modelValue?: string | string[] | null;
    options: (ToggleOption | string)[];
    size?: "sm" | "md" | "lg";
    variant?: "attached" | "spaced";
    disabled?: boolean;
  }>(),
  { type: "single", modelValue: null, size: "md", variant: "attached", disabled: false }
);

const emit = defineEmits<{
  (e: "update:modelValue", v: string | string[] | null): void;
  (e: "change", v: string | string[] | null): void;
}>();

const norm = computed(() =>
  props.options.map((o) => (typeof o === "string" ? { value: o, label: o } : o))
);

function isOn(val: string) {
  return props.type === "multiple"
    ? ((props.modelValue as string[]) || []).includes(val)
    : props.modelValue === val;
}

function select(val: string) {
  let next: string | string[] | null;
  if (props.type === "multiple") {
    const arr = (props.modelValue as string[]) || [];
    next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
  } else {
    next = props.modelValue === val ? null : val;
  }
  emit("update:modelValue", next);
  emit("change", next);
}

const cls = computed(() =>
  [
    "jl-toggle-group",
    `jl-toggle-group--${props.variant}`,
    `jl-toggle-group--${props.size}`,
  ]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <div :class="cls" role="group">
    <button
      v-for="o in norm"
      :key="o.value"
      type="button"
      :class="['jl-toggle', `jl-toggle--${size}`]"
      :aria-pressed="isOn(o.value)"
      :aria-label="o.ariaLabel"
      :disabled="disabled || o.disabled"
      @click="select(o.value)"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<style src="./toggle.css"></style>
