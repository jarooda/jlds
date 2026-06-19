# Badge

A compact status or metadata label. Six semantic colors, soft-tinted by default or `solid`
for high emphasis, with optional pill shape and status dot.

```bash
jlds add badge
```

## Usage

<Preview src="/preview/badge/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/badge.css">

<span class="jl-badge jl-badge--neutral">Badge</span>
```

```vue [Vue]
<script setup lang="ts">
import { Badge } from "@/components/ui/badge"
</script>

<template>
  <Badge color="neutral">Badge</Badge>
</template>
```

```tsx [React]
import { Badge } from "@/components/ui/badge"

<Badge color="neutral">Badge</Badge>
```

:::

## Colors

`neutral` · `brand` · `success` · `warning` · `danger` · `info`

<Preview src="/preview/badge/colors.html" />

::: code-group

```html [HTML]
<span class="jl-badge jl-badge--neutral">Neutral</span>
<span class="jl-badge jl-badge--brand">Brand</span>
<span class="jl-badge jl-badge--success">Success</span>
<span class="jl-badge jl-badge--warning">Warning</span>
<span class="jl-badge jl-badge--danger">Danger</span>
<span class="jl-badge jl-badge--info">Info</span>
```

```vue [Vue]
<template>
  <Badge color="neutral">Neutral</Badge>
  <Badge color="brand">Brand</Badge>
  <Badge color="success">Success</Badge>
  <Badge color="warning">Warning</Badge>
  <Badge color="danger">Danger</Badge>
  <Badge color="info">Info</Badge>
</template>
```

```tsx [React]
<Badge color="neutral">Neutral</Badge>
<Badge color="brand">Brand</Badge>
<Badge color="success">Success</Badge>
<Badge color="warning">Warning</Badge>
<Badge color="danger">Danger</Badge>
<Badge color="info">Info</Badge>
```

:::

## Solid

Add `solid` (React/Vue prop) or the `jl-badge--solid` class (HTML) for a filled, high-emphasis
badge.

<Preview src="/preview/badge/solid.html" />

::: code-group

```html [HTML]
<span class="jl-badge jl-badge--solid jl-badge--brand">Brand</span>
<span class="jl-badge jl-badge--solid jl-badge--success">Success</span>
<span class="jl-badge jl-badge--solid jl-badge--danger">Danger</span>
```

```vue [Vue]
<template>
  <Badge solid color="brand">Brand</Badge>
  <Badge solid color="success">Success</Badge>
  <Badge solid color="danger">Danger</Badge>
</template>
```

```tsx [React]
<Badge solid color="brand">Brand</Badge>
<Badge solid color="success">Success</Badge>
<Badge solid color="danger">Danger</Badge>
```

:::

## Pill & dot

Add `pill` for fully-rounded corners and `dot` for a leading status dot.

<Preview src="/preview/badge/pill-dot.html" />

::: code-group

```html [HTML]
<span class="jl-badge jl-badge--pill jl-badge--success">
  <span class="jl-badge__dot"></span>
  Online
</span>
<span class="jl-badge jl-badge--pill jl-badge--neutral">Pill</span>
```

```vue [Vue]
<template>
  <Badge pill dot color="success">Online</Badge>
  <Badge pill color="neutral">Pill</Badge>
</template>
```

```tsx [React]
<Badge pill dot color="success">Online</Badge>
<Badge pill color="neutral">Pill</Badge>
```

:::

## Props

### React

`Badge` extends `React.HTMLAttributes<HTMLSpanElement>` (so `className`, `onClick`, etc. pass
through).

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"neutral" \| "brand" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Semantic color |
| `solid` | `boolean` | `false` | Filled instead of tinted |
| `pill` | `boolean` | `false` | Fully rounded |
| `dot` | `boolean` | `false` | Show a leading status dot |
| `icon` | `React.ReactNode` | — | Leading icon node |

### Vue

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"neutral" \| "brand" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Semantic color |
| `solid` | `boolean` | `false` | Filled instead of tinted |
| `pill` | `boolean` | `false` | Fully rounded |
| `dot` | `boolean` | `false` | Show a leading status dot |

**Slots:** `default` (label), `icon` (leading icon).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-badge` | Base class — always required |
| `.jl-badge--neutral` / `--brand` / `--success` / `--warning` / `--danger` / `--info` | Color |
| `.jl-badge--solid` | Filled, high-emphasis style |
| `.jl-badge--pill` | Fully rounded corners |
| `.jl-badge__dot` | Leading status dot element |
