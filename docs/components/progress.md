# Progress

A linear progress bar — determinate (`value`/`max`) or an indeterminate animated state for
unknown-duration work. Three heights, four tones, with an optional label and percentage.

```bash
jlds add progress
```

## Usage

<Preview src="/preview/progress/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/progress.css">

<div class="jl-progress jl-progress--md jl-progress--brand">
  <div class="jl-progress__track" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
    <div class="jl-progress__fill" style="width: 60%"></div>
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { Progress } from "@/components/ui/progress"
</script>

<template>
  <Progress :value="60" />
</template>
```

```tsx [React]
import { Progress } from "@/components/ui/progress"

<Progress value={60} />
```

:::

## Label & value

Add a `label` and/or `showValue` for a meta row above the bar.

<Preview src="/preview/progress/label.html" />

::: code-group

```html [HTML]
<div class="jl-progress jl-progress--md jl-progress--brand">
  <div class="jl-progress__meta">
    <span class="jl-progress__label">Uploading…</span>
    <span class="jl-progress__value">72%</span>
  </div>
  <div class="jl-progress__track" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100">
    <div class="jl-progress__fill" style="width: 72%"></div>
  </div>
</div>
```

```vue [Vue]
<template>
  <Progress :value="72" label="Uploading…" show-value />
</template>
```

```tsx [React]
<Progress value={72} label="Uploading…" showValue />
```

:::

## Tones & sizes

Tones: `brand` (default) · `success` · `warning` · `danger`. Sizes: `sm` · `md` · `lg`.

<Preview src="/preview/progress/tones.html" />

::: code-group

```html [HTML]
<div class="jl-progress jl-progress--sm jl-progress--success">
  <div class="jl-progress__track"><div class="jl-progress__fill" style="width: 100%"></div></div>
</div>
<div class="jl-progress jl-progress--md jl-progress--warning">
  <div class="jl-progress__track"><div class="jl-progress__fill" style="width: 45%"></div></div>
</div>
<div class="jl-progress jl-progress--lg jl-progress--danger">
  <div class="jl-progress__track"><div class="jl-progress__fill" style="width: 20%"></div></div>
</div>
```

```vue [Vue]
<template>
  <Progress :value="100" tone="success" size="sm" />
  <Progress :value="45" tone="warning" size="md" />
  <Progress :value="20" tone="danger" size="lg" />
</template>
```

```tsx [React]
<Progress value={100} tone="success" size="sm" />
<Progress value={45} tone="warning" size="md" />
<Progress value={20} tone="danger" size="lg" />
```

:::

## Indeterminate

For work of unknown duration, set `indeterminate` — the fill animates across the track.

<Preview src="/preview/progress/indeterminate.html" />

::: code-group

```html [HTML]
<div class="jl-progress jl-progress--md jl-progress--brand">
  <div class="jl-progress__track jl-progress__track--indeterminate" role="progressbar">
    <div class="jl-progress__fill"></div>
  </div>
</div>
```

```vue [Vue]
<template>
  <Progress indeterminate />
</template>
```

```tsx [React]
<Progress indeterminate />
```

:::

## Props

### React

`Progress` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | `0` | Current value |
| `max` | `number` | `100` | Maximum value |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Track height |
| `tone` | `"brand" \| "success" \| "warning" \| "danger"` | `"brand"` | Fill color |
| `label` | `React.ReactNode` | — | Label shown above the bar |
| `showValue` | `boolean` | `false` | Show the rounded percentage |
| `indeterminate` | `boolean` | `false` | Animated unknown-duration state |

### Vue

Same props (`label` is a `string`).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-progress` | Wrapper — always required |
| `.jl-progress--sm` / `--md` / `--lg` | Track height |
| `.jl-progress--brand` / `--success` / `--warning` / `--danger` | Fill tone |
| `.jl-progress__meta` / `__label` / `__value` | Optional label/percentage row |
| `.jl-progress__track` | The track (set `role="progressbar"` + `aria-value*`) |
| `.jl-progress__fill` | The fill — set `width` inline for determinate |
| `.jl-progress__track--indeterminate` | Animated indeterminate state |
