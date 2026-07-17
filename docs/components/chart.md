# Chart

A dependency-free, responsive **SVG chart** — area, line, or bar — that re-measures its container and
redraws crisply, with hover tooltips on pointer devices. Tier-1 adapt: the width is always fluid. For
dashboards, deploy histories, and usage trends.

```bash
jlds add chart
```

## Usage

<Preview src="/preview/chart/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/chart.css">
<!-- behavior layer: builds the SVG + hover tooltip -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/chart.js" defer></script>

<div
  class="jl-chart"
  data-type="area"
  data-height="210"
  data-values="28,41,35,52,49,63,58"
  data-labels="Mon,Tue,Wed,Thu,Fri,Sat,Sun"
  data-suffix="k"
></div>
```

```vue [Vue]
<script setup lang="ts">
import { Chart } from "@/components/ui/chart"

const series = [
  { label: "Mon", value: 28 }, { label: "Tue", value: 41 }, { label: "Wed", value: 35 },
  { label: "Thu", value: 52 }, { label: "Fri", value: 49 }, { label: "Sat", value: 63 },
]
</script>

<template>
  <Chart type="area" :data="series" :height="210" :value-format="(v) => `${v}k`" />
</template>
```

```tsx [React]
import { Chart } from "@/components/ui/chart"

const series = [
  { label: "Mon", value: 28 }, { label: "Tue", value: 41 }, { label: "Wed", value: 35 },
  { label: "Thu", value: 52 }, { label: "Fri", value: 49 }, { label: "Sat", value: 63 },
]

<Chart type="area" data={series} height={210} valueFormat={(v) => `${v}k`} />
```

:::

`data` accepts plain numbers (auto-indexed labels) or `{ label, value }` points. Switch `type` between
`"area"`, `"line"`, and `"bar"`; override the series color with `color` (any CSS color), defaulting to
`--accent`.

## Line

`type="line"` drops the area fill. Pair with `showDots` to mark each point.

<Preview src="/preview/chart/line.html" />

::: code-group

```html [HTML]
<div class="jl-chart" data-type="line" data-dots="true"
     data-values="120,132,101,134,190,230,210,182"></div>
```

```vue [Vue]
<template>
  <Chart type="line" :data="series" :show-dots="true" />
</template>
```

```tsx [React]
<Chart type="line" data={series} showDots />
```

:::

## Bar

`type="bar"` renders vertical bars — good for discrete buckets. Hover dims the other bars.

<Preview src="/preview/chart/bar.html" />

::: code-group

```html [HTML]
<div class="jl-chart" data-type="bar"
     data-values="18,24,31,22,28,19,12"
     data-labels="Mon,Tue,Wed,Thu,Fri,Sat,Sun"></div>
```

```vue [Vue]
<template>
  <Chart type="bar" :data="series" />
</template>
```

```tsx [React]
<Chart type="bar" data={series} />
```

:::

## Multi-series & reference line

Pass `series` (an array of `{ name, data, color? }`) for multiple lines/areas/bars — a legend and
per-series tooltip appear automatically. Add `referenceLine` (a number, or `{ value, label, color }`)
to draw a dashed threshold. The single-series `data` prop still works unchanged.

<Preview src="/preview/chart/multi.html" />

::: code-group

```html [HTML]
<div
  class="jl-chart"
  data-type="line"
  data-ref="95" data-ref-label="SLA 95%" data-ref-color="var(--danger)"
  data-series='[{"name":"us-east","data":[92,97,99,96,98]},{"name":"eu-west","color":"var(--info)","data":[88,91,94,90,93]}]'
></div>
```

```vue [Vue]
<template>
  <Chart
    type="line"
    :reference-line="{ value: 95, label: 'SLA 95%', color: 'var(--danger)' }"
    :series="[
      { name: 'us-east', data: [92, 97, 99, 96, 98] },
      { name: 'eu-west', color: 'var(--info)', data: [88, 91, 94, 90, 93] },
    ]"
  />
</template>
```

```tsx [React]
<Chart
  type="line"
  referenceLine={{ value: 95, label: "SLA 95%", color: "var(--danger)" }}
  series={[
    { name: "us-east", data: [92, 97, 99, 96, 98] },
    { name: "eu-west", color: "var(--info)", data: [88, 91, 94, 90, 93] },
  ]}
/>
```

:::

## Stacked bars

`type="bar"` with `stacked` stacks multiple series for part-to-whole comparisons.

<Preview src="/preview/chart/stacked.html" />

::: code-group

```html [HTML]
<div class="jl-chart" data-type="bar" data-stacked="true"
  data-series='[{"name":"Production","data":[20,28,24,32]},{"name":"Preview","color":"var(--info)","data":[12,9,15,11]}]'></div>
```

```tsx [React]
<Chart type="bar" stacked series={[
  { name: "Production", data: [20, 28, 24, 32] },
  { name: "Preview", color: "var(--info)", data: [12, 9, 15, 11] },
]} />
```

:::

## Sparkline

`type="sparkline"` is a tiny, axis-less inline trend — perfect under a KPI value.

<Preview src="/preview/chart/sparkline.html" />

::: code-group

```html [HTML]
<div class="jl-chart" data-type="sparkline" data-height="40" data-values="8,12,9,14,13,18,17,20"></div>
```

```tsx [React]
<Chart type="sparkline" height={40} data={[8, 12, 9, 14, 13, 18, 17, 20]} />
```

:::

## Props

### React

`Chart` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `number[] \| { label, value }[]` | — | Single-series data |
| `series` | `{ name, data, color? }[]` | — | Multi-series data (overrides `data`) |
| `type` | `"area" \| "line" \| "bar" \| "sparkline"` | `"area"` | Visual form |
| `stacked` | `boolean` | `false` | Stack bar series instead of grouping |
| `referenceLine` | `number \| { value, label?, color? }` | — | Dashed threshold line |
| `showLegend` | `boolean` | multi | Show the series legend |
| `height` | `number` | `200` (44 spark) | Plot height (px); width is fluid |
| `color` | `string` | `--accent` | Single-series color |
| `showGrid` | `boolean` | `true` | Horizontal grid lines |
| `showAxis` | `boolean` | `true` | Value + label axes |
| `showDots` | `boolean` | `false` | Always show point markers (line/area) |
| `valueFormat` | `(v: number) => string` | `String` | Format ticks + tooltip values |

### Vue

Same options. `valueFormat` maps to `:value-format`, `referenceLine` to `:reference-line`,
`showLegend` to `:show-legend`.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-chart` | Root (self-measuring); the SVG + tooltip are generated inside |
| `.jl-chart__grid` / `__axis` | Grid lines and axis labels |
| `.jl-chart__area` / `__line` / `__bar` / `__dot` | Series marks |
| `.jl-chart__ref` / `__ref-label` | Reference/threshold line + label |
| `.jl-chart__legend` / `__swatch` | Multi-series legend |
| `.jl-chart__cursor` / `__tip` | Hover cursor line and value tooltip |

Data attributes on the root: `data-values` (comma-separated), `data-labels`, `data-type`
(`area`/`line`/`bar`/`sparkline`), `data-height`, `data-grid="false"`, `data-axis="false"`,
`data-dots="true"`, `data-suffix`. Multi-series: `data-series` (a JSON array of
`{ name, data, color? }`) plus `data-stacked="true"`. Reference line: `data-ref`, `data-ref-label`,
`data-ref-color`.
