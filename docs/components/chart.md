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

## Props

### React

`Chart` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `number[] \| { label, value }[]` | — | Series data |
| `type` | `"area" \| "line" \| "bar"` | `"area"` | Visual form |
| `height` | `number` | `200` | Plot height (px); width is fluid |
| `color` | `string` | `--accent` | Series color |
| `showGrid` | `boolean` | `true` | Horizontal grid lines |
| `showAxis` | `boolean` | `true` | Value + label axes |
| `showDots` | `boolean` | `false` | Always show point markers (line/area) |
| `valueFormat` | `(v: number) => string` | `String` | Format ticks + tooltip values |

### Vue

Same options. `valueFormat` maps to `:value-format`.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-chart` | Root (self-measuring); the SVG + tooltip are generated inside |
| `.jl-chart__grid` / `__axis` | Grid lines and axis labels |
| `.jl-chart__area` / `__line` / `__bar` / `__dot` | Series marks |
| `.jl-chart__cursor` / `__tip` | Hover cursor line and value tooltip |

Data attributes on the root: `data-values` (comma-separated), `data-labels`, `data-type`,
`data-height`, `data-grid="false"`, `data-axis="false"`, `data-dots="true"`, `data-suffix`.
