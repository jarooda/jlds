# Stat

A metric / KPI tile: a small uppercase label, a large value, and an optional trend delta. The
delta's arrow and color auto-derive from a leading `+`/`-` (override with `deltaTone`). Use the
group wrapper to lay out a responsive row.

```bash
jlds add stat
```

## Usage

<Preview src="/preview/stat/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/stat.css">

<div class="jl-stat">
  <div class="jl-stat__top">
    <span class="jl-stat__label">Revenue</span>
  </div>
  <div class="jl-stat__value">$48,210</div>
  <div class="jl-stat__foot">
    <span class="jl-stat__delta jl-stat__delta--positive">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </svg>
      +12%
    </span>
    <span class="jl-stat__caption">vs last month</span>
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { Stat } from "@/components/ui/stat"
</script>

<template>
  <Stat label="Revenue" value="$48,210" delta="+12%" caption="vs last month" />
</template>
```

```tsx [React]
import { Stat } from "@/components/ui/stat"

<Stat label="Revenue" value="$48,210" delta="+12%" caption="vs last month" />
```

:::

## Trend tone

The delta sign sets the arrow direction and color automatically: `+` → up/green, `-` →
down/red, neither → neutral. Override with `deltaTone`.

<Preview src="/preview/stat/trend.html" />

::: code-group

```html [HTML]
<div class="jl-stat">
  <div class="jl-stat__top"><span class="jl-stat__label">Churn</span></div>
  <div class="jl-stat__value">2.4%</div>
  <div class="jl-stat__foot">
    <span class="jl-stat__delta jl-stat__delta--negative">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </svg>
      -0.4%
    </span>
    <span class="jl-stat__caption">vs last week</span>
  </div>
</div>
```

```vue [Vue]
<template>
  <Stat label="Churn" value="2.4%" delta="-0.4%" caption="vs last week" />
</template>
```

```tsx [React]
<Stat label="Churn" value="2.4%" delta="-0.4%" caption="vs last week" />
```

:::

## Group with icons

`Stat.Group` (React) / `StatGroup` (Vue) — or the `.jl-stat-group` wrapper (HTML) — lays out a
responsive grid. Pass an `icon` for the tinted chip in the top-right.

<Preview src="/preview/stat/group.html" />

::: code-group

```html [HTML]
<div class="jl-stat-group">
  <div class="jl-stat">
    <div class="jl-stat__top">
      <span class="jl-stat__label">Deploys</span>
      <span class="jl-stat__icon"><svg>…</svg></span>
    </div>
    <div class="jl-stat__value">1,843</div>
    <div class="jl-stat__foot"><span class="jl-stat__delta jl-stat__delta--positive">+8%</span></div>
  </div>
  <!-- more .jl-stat tiles -->
</div>
```

```vue [Vue]
<script setup lang="ts">
import { Stat, StatGroup } from "@/components/ui/stat"
</script>

<template>
  <StatGroup>
    <Stat label="Deploys" value="1,843" delta="+8%">
      <template #icon><RocketIcon /></template>
    </Stat>
    <Stat label="Avg build" value="38s" delta="-5%" />
    <Stat label="Uptime" value="99.98%" delta="0%" />
  </StatGroup>
</template>
```

```tsx [React]
import { Rocket } from "lucide-react"

<Stat.Group>
  <Stat label="Deploys" value="1,843" delta="+8%" icon={<Rocket />} />
  <Stat label="Avg build" value="38s" delta="-5%" />
  <Stat label="Uptime" value="99.98%" delta="0%" />
</Stat.Group>
```

:::

## Inline sparkline

Pass a `data` array (≥2 numbers) to render a small trend sparkline under the delta — the classic
dashboard tile. `sparkColor` overrides the stroke (defaults to the delta tone).

<Preview src="/preview/stat/sparkline.html" />

::: code-group

```html [HTML]
<div class="jl-stat">
  <div class="jl-stat__top"><span class="jl-stat__label">Requests</span></div>
  <div class="jl-stat__value">1.2M</div>
  <div class="jl-stat__spark">
    <svg viewBox="0 0 100 36" preserveAspectRatio="none" width="100%" height="36" aria-hidden="true">
      <path class="jl-stat__spark-line" vector-effect="non-scaling-stroke" d="M3,33 L16.4,23 L29.9,30.5 L43.3,18 L56.7,20.5 L70.1,8 L83.6,10.5 L97,3" />
    </svg>
  </div>
</div>
```

```vue [Vue]
<template>
  <StatGroup :columns="2">
    <Stat label="Requests" value="1.2M" delta="+8%" :data="[8, 12, 9, 14, 13, 18, 17, 20]" />
    <Stat label="Error rate" value="0.4%" delta="-0.1%" :data="[9, 7, 8, 6, 5, 6, 4, 3]" />
  </StatGroup>
</template>
```

```tsx [React]
<Stat.Group columns={2}>
  <Stat label="Requests" value="1.2M" delta="+8%" data={[8, 12, 9, 14, 13, 18, 17, 20]} />
  <Stat label="Error rate" value="0.4%" delta="-0.1%" data={[9, 7, 8, 6, 5, 6, 4, 3]} />
</Stat.Group>
```

:::

## Props

### React — `Stat`

`Stat` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `React.ReactNode` | — | Small uppercase caption above the value |
| `value` | `React.ReactNode` | — | The headline figure (required) |
| `delta` | `React.ReactNode` | — | Change indicator; sign drives arrow + tone |
| `deltaTone` | `"positive" \| "negative" \| "neutral"` | auto | Override the derived tone |
| `caption` | `React.ReactNode` | — | Muted text after the delta |
| `icon` | `React.ReactNode` | — | Accent icon in a tinted chip (top-right) |
| `data` | `number[]` | — | Inline sparkline values (≥2 points) |
| `sparkColor` | `string` | tone | Sparkline stroke color |
| `plain` | `boolean` | `false` | Drop the card surface (border/padding) |
| `size` | `"sm" \| "md"` | `"md"` | Value scale |

`Stat.Group` takes an optional `columns` (number); omit for a responsive auto-fit grid.

### Vue

`Stat` takes the same props (text props are strings); pass the icon via the `icon` slot.
`StatGroup` takes `columns`.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-stat` | The tile — always required |
| `.jl-stat--sm` | Smaller value |
| `.jl-stat--plain` | No card surface (border/padding) |
| `.jl-stat__top` / `__label` / `__icon` | Top row: caption + icon chip |
| `.jl-stat__value` | The headline figure |
| `.jl-stat__foot` / `__delta` / `__caption` | Footer: trend delta + caption |
| `.jl-stat__delta--positive` / `--negative` / `--neutral` | Delta tone |
| `.jl-stat__spark` / `__spark-line` | Inline sparkline container + stroke (`--_sc` sets color) |
| `.jl-stat-group` | Responsive grid wrapper for a row of tiles |
