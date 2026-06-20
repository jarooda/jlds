<script setup lang="ts">
import { computed } from "vue";

type SelectOption = string | { value: string; label: string };
type SelectSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    size?: SelectSize;
    options?: SelectOption[];
    placeholder?: string;
    modelValue?: string;
    disabled?: boolean;
  }>(),
  { size: "md", options: () => [], disabled: false }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const normalized = computed(() =>
  props.options.map((o) => (typeof o === "string" ? { value: o, label: o } : o))
);

const isPlaceholder = computed(
  () => props.placeholder != null && (props.modelValue === "" || props.modelValue == null)
);

function onChange(event: Event) {
  emit("update:modelValue", (event.target as HTMLSelectElement).value);
}
</script>

<template>
  <span class="jl-select-wrap">
    <select
      class="jl-select"
      :class="`jl-select--${props.size}`"
      :data-placeholder="isPlaceholder || undefined"
      :value="props.modelValue"
      :disabled="props.disabled"
      v-bind="$attrs"
      @change="onChange"
    >
      <option v-if="props.placeholder" value="" disabled>{{ props.placeholder }}</option>
      <option v-for="opt in normalized" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      <slot />
    </select>
    <span class="jl-select-chevron">
      <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
  </span>
</template>

<style src="./select.css"></style>
