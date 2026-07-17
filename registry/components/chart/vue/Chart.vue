<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, type CSSProperties } from "vue";

export interface ChartPoint {
  /** X-axis label. */
  label: string;
  /** Y value. */
  value: number;
}

export interface ChartSeries {
  name: string;
  data: number[] | ChartPoint[];
  color?: string;
}

export interface ChartReferenceLine {
  value: number;
  label?: string;
  color?: string;
}

const props = withDefaults(
  defineProps<{
    /** Single-series data — plain numbers (auto-indexed) or `{ label, value }` points. */
    data?: number[] | ChartPoint[];
    /** Multi-series data — overrides `data` when present. */
    series?: ChartSeries[];
    /** Visual form. `sparkline` is a tiny axis-less inline trend. */
    type?: "area" | "line" | "bar" | "sparkline";
    /** Stack multiple bar series instead of grouping them. */
    stacked?: boolean;
    /** Draw a dashed horizontal threshold line. */
    referenceLine?: number | ChartReferenceLine;
    /** Show the series legend. Defaults to true when multi-series (never for sparkline). */
    showLegend?: boolean;
    /** Plot height in px (width is always fluid). */
    height?: number;
    /** Override the series color (any CSS color). Defaults to `--accent`. */
    color?: string;
    showGrid?: boolean;
    showAxis?: boolean;
    showDots?: boolean;
    valueFormat?: (v: number) => string;
  }>(),
  {
    data: () => [],
    series: undefined,
    type: "area",
    stacked: false,
    referenceLine: undefined,
    showLegend: undefined,
    height: undefined,
    color: undefined,
    showGrid: true,
    showAxis: true,
    showDots: false,
    valueFormat: (v: number) => String(v),
  }
);

const PALETTE = [
  "var(--accent)",
  "var(--info)",
  "var(--warning)",
  "var(--danger)",
  "var(--success)",
  "var(--text-brand)",
];

interface ResolvedSeries {
  name: string;
  color: string;
  values: number[];
  labels: string[];
}

function normValues(data: number[] | ChartPoint[] | undefined): ChartPoint[] {
  return (data || []).map((d, i) =>
    typeof d === "number" ? { label: String(i + 1), value: d } : { label: d.label, value: d.value }
  );
}

const spark = computed(() => props.type === "sparkline");
const isBar = computed(() => props.type === "bar");
const H = computed(() => (props.height != null ? props.height : spark.value ? 44 : 200));
const gridOn = computed(() => (spark.value ? false : props.showGrid));
const axisOn = computed(() => (spark.value ? false : props.showAxis));

const wrapRef = ref<HTMLElement | null>(null);
const w = ref(560);
const hover = ref<{ i: number; x: number; y: number } | null>(null);
let ro: ResizeObserver | null = null;

onMounted(() => {
  const el = wrapRef.value;
  if (!el) return;
  const update = () => (w.value = el.clientWidth || (spark.value ? 120 : 560));
  update();
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(update);
    ro.observe(el);
  }
});
onBeforeUnmount(() => {
  if (ro) ro.disconnect();
});

const resolved = computed<{ list: ResolvedSeries[]; labels: string[]; multi: boolean }>(() => {
  if (Array.isArray(props.series) && props.series.length) {
    const list = props.series.map((s, i) => {
      const pts = normValues(s.data);
      return {
        name: s.name || `Series ${i + 1}`,
        color: s.color || PALETTE[i % PALETTE.length]!,
        values: pts.map((p) => p.value),
        labels: pts.map((p) => p.label),
      };
    });
    return { list, labels: list[0] ? list[0].labels : [], multi: list.length > 1 };
  }
  const pts = normValues(props.data);
  return {
    list: [
      {
        name: "Series 1",
        color: props.color || PALETTE[0]!,
        values: pts.map((p) => p.value),
        labels: pts.map((p) => p.label),
      },
    ],
    labels: pts.map((p) => p.label),
    multi: false,
  };
});

const legendOn = computed(() =>
  props.showLegend != null ? props.showLegend : resolved.value.multi && !spark.value
);
const stackedBar = computed(() => isBar.value && props.stacked && resolved.value.multi);

const geom = computed(() => {
  const { list, labels } = resolved.value;
  const n = labels.length;
  const padL = axisOn.value ? 34 : spark.value ? 1 : 6;
  const padR = spark.value ? 1 : 6;
  const padT = spark.value ? 3 : 10;
  const padB = axisOn.value ? 22 : spark.value ? 3 : 6;
  const innerW = Math.max(10, w.value - padL - padR);
  const innerH = Math.max(10, H.value - padT - padB);

  let maxV: number, minV: number;
  if (stackedBar.value) {
    const sums = labels.map((_, i) => list.reduce((a, s) => a + Math.max(0, s.values[i] || 0), 0));
    maxV = Math.max(1, ...sums);
    minV = 0;
  } else {
    const all = list.flatMap((s) => s.values);
    maxV = Math.max(1, ...all);
    minV = isBar.value ? 0 : Math.min(0, ...all);
  }
  const span = maxV - minV || 1;
  const x = (i: number) => padL + (n <= 1 ? innerW / 2 : (innerW * i) / (n - 1));
  const y = (v: number) => padT + innerH - ((v - minV) / span) * innerH;
  const ticks = 3;
  const gridLines = Array.from({ length: ticks + 1 }, (_, i) => {
    const v = minV + (span * i) / ticks;
    return { v, yy: padT + innerH - (innerH * i) / ticks };
  });
  return { n, padL, padR, padT, padB, innerW, innerH, x, y, gridLines };
});

const bars = computed(() => {
  const out: Array<{ x: number; y: number; w: number; h: number; color: string; i: number }> = [];
  if (!isBar.value) return out;
  const { list } = resolved.value;
  const { n, padL, innerW, y } = geom.value;
  const band = n ? innerW / n : innerW;
  if (stackedBar.value) {
    const bw = Math.min(46, band * 0.62);
    for (let i = 0; i < n; i++) {
      let acc = 0;
      list.forEach((s) => {
        const val = Math.max(0, s.values[i] || 0);
        const y0 = y(acc);
        const y1 = y(acc + val);
        acc += val;
        out.push({ x: padL + band * i + (band - bw) / 2, y: y1, w: bw, h: Math.max(0, y0 - y1), color: s.color, i });
      });
    }
  } else {
    const groupW = band * 0.62;
    const bw = groupW / list.length;
    for (let i = 0; i < n; i++) {
      list.forEach((s, si) => {
        const val = s.values[i] || 0;
        out.push({
          x: padL + band * i + (band - groupW) / 2 + bw * si,
          y: y(Math.max(0, val)),
          w: Math.max(1, bw - 1),
          h: Math.max(1, Math.abs(y(val) - y(0))),
          color: s.color,
          i,
        });
      });
    }
  }
  return out;
});

const lines = computed(() => {
  const out: Array<{ color: string; line: string; area: string; dots: Array<{ cx: number; cy: number; i: number }> }> = [];
  if (isBar.value) return out;
  const { list, labels } = resolved.value;
  const { x, y, padT, innerH } = geom.value;
  const n = labels.length;
  list.forEach((s) => {
    const line = s.values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
    out.push({
      color: s.color,
      line,
      area: `${line} L${x(n - 1)},${padT + innerH} L${x(0)},${padT + innerH} Z`,
      dots: s.values.map((v, i) => ({ cx: x(i), cy: y(v), i })),
    });
  });
  return out;
});

const refLine = computed<ChartReferenceLine | null>(() =>
  props.referenceLine != null
    ? typeof props.referenceLine === "number"
      ? { value: props.referenceLine }
      : props.referenceLine
    : null
);

function showXLabel(i: number) {
  const n = geom.value.n;
  return n <= 8 || i % Math.ceil(n / 8) === 0;
}
function xLabelPos(i: number) {
  const { padL, innerW, x, n } = geom.value;
  return isBar.value ? padL + (innerW * (i + 0.5)) / n : x(i);
}

function onMove(e: MouseEvent) {
  if (spark.value || !wrapRef.value) return;
  const { list, labels } = resolved.value;
  const n = labels.length;
  if (!n) return;
  const { padL, innerW, x, y } = geom.value;
  const rect = wrapRef.value.getBoundingClientRect();
  const px = e.clientX - rect.left;
  let i = isBar.value
    ? Math.floor(((px - padL) / innerW) * n)
    : Math.round(((px - padL) / innerW) * (n - 1));
  i = Math.max(0, Math.min(n - 1, i));
  const cx = isBar.value ? padL + (innerW * (i + 0.5)) / n : x(i);
  const topV = stackedBar.value
    ? list.reduce((a, s) => a + Math.max(0, s.values[i] || 0), 0)
    : Math.max(...list.map((s) => s.values[i] || 0));
  hover.value = { i, x: cx, y: y(topV) };
}
</script>

<template>
  <div
    ref="wrapRef"
    class="jl-chart"
    :class="spark ? 'jl-chart--spark' : ''"
    @mousemove="onMove"
    @mouseleave="hover = null"
  >
    <svg :viewBox="`0 0 ${w} ${H}`" :height="H" role="img" aria-label="Chart">
      <template v-if="gridOn">
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
      <template v-if="axisOn">
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
        <text
          v-for="(lb, i) in resolved.labels"
          v-show="showXLabel(i)"
          :key="`x${i}`"
          class="jl-chart__axis"
          :x="xLabelPos(i)"
          :y="H - 6"
          text-anchor="middle"
        >
          {{ lb }}
        </text>
      </template>
      <g v-if="refLine" :style="{ '--_rc': refLine.color || 'var(--text-tertiary)' } as CSSProperties">
        <line
          class="jl-chart__ref"
          :x1="geom.padL"
          :y1="geom.y(refLine.value)"
          :x2="w - geom.padR"
          :y2="geom.y(refLine.value)"
        />
        <text
          v-if="refLine.label"
          class="jl-chart__ref-label"
          :x="w - geom.padR"
          :y="geom.y(refLine.value) - 4"
          text-anchor="end"
        >
          {{ refLine.label }}
        </text>
      </g>
      <line
        v-if="hover && !spark"
        class="jl-chart__cursor"
        :x1="hover.x"
        :y1="geom.padT"
        :x2="hover.x"
        :y2="geom.padT + geom.innerH"
      />
      <template v-if="isBar">
        <rect
          v-for="(b, bi) in bars"
          :key="bi"
          class="jl-chart__bar"
          :x="b.x"
          :y="b.y"
          :width="b.w"
          :height="b.h"
          rx="3"
          :style="{ '--_c': b.color } as CSSProperties"
          :opacity="hover && hover.i !== b.i ? 0.55 : 1"
        />
      </template>
      <template v-else>
        <g v-for="(s, si) in lines" :key="si" :style="{ '--_c': s.color } as CSSProperties">
          <path v-if="type === 'area'" class="jl-chart__area" :d="s.area" />
          <path class="jl-chart__line" :d="s.line" />
          <template v-for="d in s.dots" :key="d.i">
            <circle
              v-if="showDots || (hover && !spark && hover.i === d.i)"
              class="jl-chart__dot"
              :cx="d.cx"
              :cy="d.cy"
              r="3.5"
            />
          </template>
        </g>
      </template>
    </svg>
    <div
      v-if="hover && resolved.labels.length"
      class="jl-chart__tip"
      :style="{ left: `${hover.x}px`, top: `${hover.y - 8}px` }"
    >
      <div :style="{ marginBottom: resolved.multi ? '3px' : '0', opacity: resolved.multi ? 0.75 : 1 }">
        {{ resolved.labels[hover.i] }}
      </div>
      <template v-if="resolved.multi">
        <div v-for="(s, si) in resolved.list" :key="si" class="jl-chart__tip-row">
          <span class="jl-chart__tip-dot" :style="{ background: s.color }" />
          <span>{{ s.name }}</span>
          <b style="margin-left: auto">{{ valueFormat(s.values[hover.i] ?? 0) }}</b>
        </div>
      </template>
      <b v-else>{{ valueFormat(resolved.list[0]?.values[hover.i] ?? 0) }}</b>
    </div>
    <div v-if="legendOn" class="jl-chart__legend">
      <span v-for="(s, si) in resolved.list" :key="si" class="jl-chart__legend-item">
        <span class="jl-chart__swatch" :style="{ background: s.color }" />
        {{ s.name }}
      </span>
    </div>
  </div>
</template>

<style src="./chart.css"></style>
