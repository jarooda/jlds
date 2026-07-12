<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, type CSSProperties } from "vue";

export interface ChartPoint {
  /** X-axis label. */
  label: string;
  /** Y value. */
  value: number;
}

const props = withDefaults(
  defineProps<{
    /** Data — plain numbers (auto-indexed) or `{ label, value }` points. */
    data: number[] | ChartPoint[];
    /** Visual form. */
    type?: "area" | "line" | "bar";
    /** Plot height in px (width is always fluid). */
    height?: number;
    /** Override the series color (any CSS color). Defaults to `--accent`. */
    color?: string | undefined;
    /** Draw horizontal grid lines. */
    showGrid?: boolean;
    /** Draw value + label axes. */
    showAxis?: boolean;
    /** Always show point markers (line/area). */
    showDots?: boolean;
    /** Format axis ticks and tooltip values. */
    valueFormat?: (v: number) => string;
  }>(),
  {
    type: "area",
    height: 200,
    color: undefined,
    showGrid: true,
    showAxis: true,
    showDots: false,
    valueFormat: (v: number) => String(v),
  }
);

const wrapRef = ref<HTMLElement | null>(null);
const w = ref(560);
const hover = ref<{ i: number; x: number; y: number } | null>(null);
let ro: ResizeObserver | null = null;

onMounted(() => {
  const el = wrapRef.value;
  if (!el) return;
  const update = () => (w.value = el.clientWidth || 560);
  update();
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(update);
    ro.observe(el);
  }
});
onBeforeUnmount(() => {
  if (ro) ro.disconnect();
});

const points = computed<ChartPoint[]>(() =>
  (props.data || []).map((d, i) =>
    typeof d === "number" ? { label: String(i + 1), value: d } : { label: d.label, value: d.value }
  )
);

const geom = computed(() => {
  const pts = points.value;
  const padL = props.showAxis ? 34 : 6;
  const padR = 6;
  const padT = 10;
  const padB = props.showAxis ? 22 : 6;
  const innerW = Math.max(10, w.value - padL - padR);
  const innerH = Math.max(10, props.height - padT - padB);
  const vals = pts.map((p) => p.value);
  const maxV = Math.max(1, ...vals);
  const minV = Math.min(0, ...vals);
  const span = maxV - minV || 1;
  const x = (i: number) =>
    padL + (pts.length <= 1 ? innerW / 2 : (innerW * i) / (pts.length - 1));
  const y = (v: number) => padT + innerH - ((v - minV) / span) * innerH;
  const ticks = 3;
  const gridLines = Array.from({ length: ticks + 1 }, (_, i) => {
    const v = minV + (span * i) / ticks;
    return { v, yy: padT + innerH - (innerH * i) / ticks };
  });
  return { padL, padR, padT, padB, innerW, innerH, x, y, gridLines };
});

const bars = computed(() => {
  if (props.type !== "bar") return [];
  const { padL, innerW, y } = geom.value;
  const pts = points.value;
  const bw = pts.length ? Math.min(46, (innerW / pts.length) * 0.62) : 10;
  return pts.map((p, i) => ({
    x: padL + (innerW * (i + 0.5)) / pts.length - bw / 2,
    y: y(Math.max(0, p.value)),
    w: bw,
    h: Math.max(1, Math.abs(y(p.value) - y(0))),
    i,
  }));
});

const linePath = computed(() => {
  if (props.type === "bar") return "";
  const { x, y } = geom.value;
  return points.value.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.value)}`).join(" ");
});
const areaPath = computed(() => {
  if (props.type !== "area") return "";
  const { x, padT, innerH } = geom.value;
  const n = points.value.length;
  return `${linePath.value} L${x(n - 1)},${padT + innerH} L${x(0)},${padT + innerH} Z`;
});

function showXLabel(i: number) {
  const n = points.value.length;
  return n <= 8 || i % Math.ceil(n / 8) === 0;
}
function xLabelPos(i: number) {
  const { padL, innerW, x } = geom.value;
  return props.type === "bar" ? padL + (innerW * (i + 0.5)) / points.value.length : x(i);
}

const rootStyle = computed<CSSProperties | undefined>(() =>
  props.color ? ({ ["--_c" as string]: props.color } as CSSProperties) : undefined
);

function onMove(e: MouseEvent) {
  if (!wrapRef.value) return;
  const pts = points.value;
  if (!pts.length) return;
  const { padL, innerW, x, y } = geom.value;
  const rect = wrapRef.value.getBoundingClientRect();
  const px = e.clientX - rect.left;
  let i: number;
  if (props.type === "bar") i = Math.floor(((px - padL) / innerW) * pts.length);
  else i = Math.round(((px - padL) / innerW) * (pts.length - 1));
  i = Math.max(0, Math.min(pts.length - 1, i));
  const p = pts[i];
  if (!p) return;
  hover.value = {
    i,
    x: x(i),
    y: props.type === "bar" ? y(Math.max(0, p.value)) : y(p.value),
  };
}

const hoverPoint = computed(() => (hover.value ? points.value[hover.value.i] : null));
</script>

<template>
  <div
    ref="wrapRef"
    class="jl-chart"
    :style="rootStyle"
    @mousemove="points.length ? onMove($event) : undefined"
    @mouseleave="hover = null"
  >
    <svg :viewBox="`0 0 ${w} ${height}`" :height="height" role="img" aria-label="Chart">
      <template v-if="showGrid">
        <line
          v-for="(g, i) in geom.gridLines"
          :key="`g${i}`"
          class="jl-chart__grid"
          :x1="geom.padL"
          :y1="g.yy"
          :x2="w - geom.padR"
          :y2="g.yy"
          :opacity="i === 0 ? 1 : 0.6"
        />
      </template>
      <template v-if="showAxis">
        <text
          v-for="(g, i) in geom.gridLines"
          :key="`a${i}`"
          class="jl-chart__axis"
          :x="geom.padL - 8"
          :y="g.yy + 3"
          text-anchor="end"
        >
          {{ valueFormat(Math.round(g.v)) }}
        </text>
      </template>
      <template v-if="showAxis">
        <text
          v-for="(p, i) in points"
          v-show="showXLabel(i)"
          :key="`x${i}`"
          class="jl-chart__axis"
          :x="xLabelPos(i)"
          :y="height - 6"
          text-anchor="middle"
        >
          {{ p.label }}
        </text>
      </template>
      <line
        v-if="hover"
        class="jl-chart__cursor"
        :x1="hover.x"
        :y1="geom.padT"
        :x2="hover.x"
        :y2="geom.padT + geom.innerH"
      />
      <template v-if="type === 'bar'">
        <rect
          v-for="b in bars"
          :key="b.i"
          class="jl-chart__bar"
          :x="b.x"
          :y="b.y"
          :width="b.w"
          :height="b.h"
          rx="4"
          :opacity="hover && hover.i !== b.i ? 0.55 : 1"
        />
      </template>
      <template v-else>
        <path v-if="type === 'area'" class="jl-chart__area" :d="areaPath" />
        <path class="jl-chart__line" :d="linePath" />
        <template v-for="(p, i) in points" :key="`d${i}`">
          <circle
            v-if="showDots || (hover && hover.i === i)"
            class="jl-chart__dot"
            :cx="geom.x(i)"
            :cy="geom.y(p.value)"
            r="3.5"
          />
        </template>
      </template>
    </svg>
    <div
      v-if="hover && hoverPoint"
      class="jl-chart__tip"
      :style="{ left: `${hover.x}px`, top: `${hover.y - 8}px` }"
    >
      {{ hoverPoint.label }} · <b>{{ valueFormat(hoverPoint.value) }}</b>
    </div>
  </div>
</template>

<style src="./chart.css"></style>
