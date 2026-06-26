<script setup lang="ts">
import { computed } from "vue";

type ProgressSize = "sm" | "md" | "lg";
type ProgressTone = "brand" | "success" | "warning" | "danger";

const props = withDefaults(
  defineProps<{
    value?: number;
    max?: number;
    size?: ProgressSize;
    tone?: ProgressTone;
    label?: string;
    showValue?: boolean;
    indeterminate?: boolean;
  }>(),
  { value: 0, max: 100, size: "md", tone: "brand", label: "", showValue: false, indeterminate: false }
);

const pct = computed(() => Math.max(0, Math.min(100, (props.value / props.max) * 100)));
</script>

<template>
  <div class="jl-progress" :class="[`jl-progress--${props.size}`, `jl-progress--${props.tone}`]">
    <div v-if="props.label || props.showValue" class="jl-progress__meta">
      <span v-if="props.label" class="jl-progress__label">{{ props.label }}</span>
      <span v-if="props.showValue" class="jl-progress__value">{{ Math.round(pct) }}%</span>
    </div>
    <div
      class="jl-progress__track"
      :class="props.indeterminate ? 'jl-progress__track--indeterminate' : ''"
      role="progressbar"
      :aria-valuenow="props.indeterminate ? undefined : Math.round(pct)"
      :aria-valuemin="0"
      :aria-valuemax="100"
    >
      <div class="jl-progress__fill" :style="{ width: props.indeterminate ? undefined : `${pct}%` }" />
    </div>
  </div>
</template>

<style src="./progress.css"></style>
