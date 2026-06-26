<script setup lang="ts">
import { computed } from "vue";

type TabItem =
  | string
  | { value: string; label: string; count?: number };

const props = withDefaults(
  defineProps<{
    items: TabItem[];
    modelValue: string;
    variant?: "line" | "pill";
  }>(),
  { variant: "line" }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
}>();

const norm = computed(() =>
  props.items.map((it) => (typeof it === "string" ? { value: it, label: it } : it))
);

function select(v: string) {
  emit("update:modelValue", v);
  emit("change", v);
}
</script>

<template>
  <div :class="['jl-tabs', `jl-tabs--${variant}`]" role="tablist">
    <button
      v-for="t in norm"
      :key="t.value"
      type="button"
      role="tab"
      class="jl-tab"
      :aria-selected="modelValue === t.value"
      @click="select(t.value)"
    >
      {{ t.label }}
      <span v-if="'count' in t && t.count != null" class="jl-tab__count">{{ t.count }}</span>
    </button>
  </div>
</template>

<style src="./tabs.css"></style>
