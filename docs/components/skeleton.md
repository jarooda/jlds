# Skeleton

A loading placeholder with a soft shimmer, shown while content is fetching. Comes in three
shapes: `text` (single or multi-line), `circle`, and `rect`.

```bash
jlds add skeleton
```

## Usage

<Preview src="/preview/skeleton/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/skeleton.css">

<span class="jl-skel jl-skel--text" style="width: 220px"></span>
```

```vue [Vue]
<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton"
</script>

<template>
  <Skeleton :width="220" />
</template>
```

```tsx [React]
import { Skeleton } from "@/components/ui/skeleton"

<Skeleton width={220} />
```

:::

## Shapes

`text` · `circle` · `rect`

<Preview src="/preview/skeleton/shapes.html" />

::: code-group

```html [HTML]
<span class="jl-skel jl-skel--circle" style="width: 40px; height: 40px"></span>
<span class="jl-skel jl-skel--rect" style="width: 120px; height: 64px"></span>
<span class="jl-skel jl-skel--text" style="width: 160px"></span>
```

```vue [Vue]
<template>
  <Skeleton variant="circle" />
  <Skeleton variant="rect" :width="120" :height="64" />
  <Skeleton variant="text" :width="160" />
</template>
```

```tsx [React]
<Skeleton variant="circle" />
<Skeleton variant="rect" width={120} height={64} />
<Skeleton variant="text" width={160} />
```

:::

## Multi-line text

For `variant="text"`, set `lines` to render a stacked paragraph (the last line is shortened).

<Preview src="/preview/skeleton/lines.html" />

::: code-group

```html [HTML]
<div class="jl-skel-lines">
  <span class="jl-skel jl-skel--text"></span>
  <span class="jl-skel jl-skel--text"></span>
  <span class="jl-skel jl-skel--text" style="width: 62%"></span>
</div>
```

```vue [Vue]
<template>
  <Skeleton :lines="3" />
</template>
```

```tsx [React]
<Skeleton lines={3} />
```

:::

## Composed example

Skeletons are most effective combined to mirror the real layout.

<Preview src="/preview/skeleton/card.html" />

::: code-group

```html [HTML]
<div style="display: flex; gap: 12px; align-items: center;">
  <span class="jl-skel jl-skel--circle" style="width: 44px; height: 44px"></span>
  <div class="jl-skel-lines" style="flex: 1;">
    <span class="jl-skel jl-skel--text" style="width: 40%"></span>
    <span class="jl-skel jl-skel--text" style="width: 70%"></span>
  </div>
</div>
```

```vue [Vue]
<template>
  <div style="display: flex; gap: 12px; align-items: center;">
    <Skeleton variant="circle" :width="44" />
    <div style="flex: 1;">
      <Skeleton :width="'40%'" />
      <Skeleton :width="'70%'" />
    </div>
  </div>
</template>
```

```tsx [React]
<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
  <Skeleton variant="circle" width={44} />
  <div style={{ flex: 1 }}>
    <Skeleton width="40%" />
    <Skeleton width="70%" />
  </div>
</div>
```

:::

## Props

### React

`Skeleton` extends `React.HTMLAttributes<HTMLSpanElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"text" \| "circle" \| "rect"` | `"text"` | Shape. `text` honors `lines`; `circle` defaults to 40px |
| `width` | `number \| string` | — | CSS width (number → px) |
| `height` | `number \| string` | — | CSS height (number → px) |
| `lines` | `number` | `1` | For `variant="text"`: number of stacked lines |
| `radius` | `number \| string` | — | Override border radius (number → px) |

### Vue

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"text" \| "circle" \| "rect"` | `"text"` | Shape |
| `width` | `number \| string` | — | CSS width (number → px) |
| `height` | `number \| string` | — | CSS height (number → px) |
| `lines` | `number` | `1` | Number of stacked text lines |
| `radius` | `number \| string` | — | Override border radius |

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-skel` | Base class with the shimmer animation — always required |
| `.jl-skel--text` / `--circle` / `--rect` | Shape |
| `.jl-skel-lines` | Flex column wrapper for multi-line text skeletons |
