<script setup lang="ts">
import { computed, useSlots, type CSSProperties } from "vue";

type StatDeltaTone = "positive" | "negative" | "neutral";
type StatSize = "sm" | "md";

const props = withDefaults(
  defineProps<{
    label?: string;
    value: string | number;
    delta?: string;
    deltaTone?: StatDeltaTone;
    caption?: string;
    /** Inline sparkline values rendered under the delta. Needs ≥2 points. */
    data?: number[];
    /** Sparkline stroke color. Defaults to the delta tone. */
    sparkColor?: string;
    plain?: boolean;
    size?: StatSize;
  }>(),
  {
    label: "",
    delta: undefined,
    deltaTone: undefined,
    caption: "",
    data: undefined,
    sparkColor: undefined,
    plain: false,
    size: "md",
  }
);

const slots = useSlots();

/** Build a normalized sparkline path in a 100×36 box (stretched to fit). */
function sparkPath(data: number[], w = 100, h = 36, pad = 3): string {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const n = data.length;
  return data
    .map((v, i) => {
      const x = pad + (n <= 1 ? (w - 2 * pad) / 2 : ((w - 2 * pad) * i) / (n - 1));
      const y = pad + (h - 2 * pad) - ((v - min) / span) * (h - 2 * pad);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

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
    <div v-if="props.data && props.data.length > 1" class="jl-stat__spark">
      <svg
        viewBox="0 0 100 36"
        preserveAspectRatio="none"
        width="100%"
        height="36"
        aria-hidden="true"
        :style="{ '--_sc': props.sparkColor || (tone === 'negative' ? 'var(--danger)' : 'var(--accent)') } as CSSProperties"
      >
        <path class="jl-stat__spark-line" vector-effect="non-scaling-stroke" :d="sparkPath(props.data)" />
      </svg>
    </div>
  </div>
</template>

<style src="./stat.css"></style>
