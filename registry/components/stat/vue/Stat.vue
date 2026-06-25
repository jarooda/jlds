<script setup lang="ts">
import { computed, useSlots } from "vue";

type StatDeltaTone = "positive" | "negative" | "neutral";
type StatSize = "sm" | "md";

const props = withDefaults(
  defineProps<{
    label?: string;
    value: string | number;
    delta?: string;
    deltaTone?: StatDeltaTone;
    caption?: string;
    plain?: boolean;
    size?: StatSize;
  }>(),
  { label: "", delta: undefined, deltaTone: undefined, caption: "", plain: false, size: "md" }
);

const slots = useSlots();

const tone = computed<StatDeltaTone>(() => {
  if (props.deltaTone) return props.deltaTone;
  const s = String(props.delta ?? "").trim();
  return s.startsWith("-") ? "negative" : s.startsWith("+") ? "positive" : "neutral";
});

const dir = computed<"up" | "down" | null>(() => {
  const s = String(props.delta ?? "").trim();
  return s.startsWith("-") ? "down" : s.startsWith("+") ? "up" : null;
});
</script>

<template>
  <div class="jl-stat" :class="[`jl-stat--${props.size}`, props.plain ? 'jl-stat--plain' : '']">
    <div class="jl-stat__top">
      <span v-if="props.label" class="jl-stat__label">{{ props.label }}</span>
      <span v-if="slots.icon" class="jl-stat__icon"><slot name="icon" /></span>
    </div>
    <div class="jl-stat__value">{{ props.value }}</div>
    <div v-if="props.delta != null || props.caption" class="jl-stat__foot">
      <span v-if="props.delta != null" class="jl-stat__delta" :class="`jl-stat__delta--${tone}`">
        <svg v-if="dir" viewBox="0 0 24 24" aria-hidden="true">
          <path
            v-if="dir === 'up'"
            d="M12 19V5M6 11l6-6 6 6"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"
          />
          <path
            v-else
            d="M12 5v14M6 13l6 6 6-6"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"
          />
        </svg>
        {{ props.delta }}
      </span>
      <span v-if="props.caption" class="jl-stat__caption">{{ props.caption }}</span>
    </div>
  </div>
</template>

<style src="./stat.css"></style>
