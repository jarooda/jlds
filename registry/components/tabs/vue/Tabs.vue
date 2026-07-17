<script setup lang="ts">
import { computed } from "vue";

type TabItem =
  | string
  | { value: string; label: string; count?: number; disabled?: boolean };

const props = withDefaults(
  defineProps<{
    items: TabItem[];
    modelValue: string;
    variant?: "line" | "pill";
    orientation?: "horizontal" | "vertical";
  }>(),
  { variant: "line", orientation: "horizontal" }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
}>();

const vertical = computed(() => props.orientation === "vertical");
const norm = computed(() =>
  props.items.map((it) => (typeof it === "string" ? { value: it, label: it } : it))
);

function select(v: string, disabled?: boolean) {
  if (disabled) return;
  emit("update:modelValue", v);
  emit("change", v);
}
</script>

<template>
  <div
    :class="['jl-tabs', `jl-tabs--${variant}`, vertical ? 'jl-tabs--vertical' : '']"
    role="tablist"
    :aria-orientation="vertical ? 'vertical' : undefined"
  >
    <button
      v-for="t in norm"
      :key="t.value"
      type="button"
      role="tab"
      class="jl-tab"
      :aria-selected="modelValue === t.value"
      :aria-disabled="('disabled' in t && t.disabled) || undefined"
      :disabled="('disabled' in t && t.disabled) || undefined"
      @click="select(t.value, 'disabled' in t ? t.disabled : false)"
    >
      {{ t.label }}
      <span v-if="'count' in t && t.count != null" class="jl-tab__count">{{ t.count }}</span>
    </button>
  </div>
</template>

<style src="./tabs.css"></style>
