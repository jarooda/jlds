# Divider

A thin rule that separates content. Horizontal by default, vertical for inline groups, or a
centered label to break up a stack (e.g. "OR").

```bash
jlds add divider
```

## Usage

<Preview src="/preview/divider/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/divider.css">

<hr class="jl-divider jl-divider--h" role="separator" />
```

```vue [Vue]
<script setup lang="ts">
import { Divider } from "@/components/ui/divider"
</script>

<template>
  <Divider />
</template>
```

```tsx [React]
import { Divider } from "@/components/ui/divider"

<Divider />
```

:::

## Vertical

Use `orientation="vertical"` for separating inline items. It stretches to its flex parent's
height.

<Preview src="/preview/divider/vertical.html" />

::: code-group

```html [HTML]
<div style="display: flex; align-items: center;">
  <span>Edit</span>
  <hr class="jl-divider jl-divider--v" role="separator" aria-orientation="vertical" />
  <span>Duplicate</span>
  <hr class="jl-divider jl-divider--v" role="separator" aria-orientation="vertical" />
  <span>Delete</span>
</div>
```

```vue [Vue]
<template>
  <div style="display: flex; align-items: center;">
    <span>Edit</span>
    <Divider orientation="vertical" />
    <span>Duplicate</span>
    <Divider orientation="vertical" />
    <span>Delete</span>
  </div>
</template>
```

```tsx [React]
<div style={{ display: "flex", alignItems: "center" }}>
  <span>Edit</span>
  <Divider orientation="vertical" />
  <span>Duplicate</span>
  <Divider orientation="vertical" />
  <span>Delete</span>
</div>
```

:::

## With a label

Pass a `label` (React/Vue) — or use the `jl-divider--labeled` element (HTML) — for a centered
caption between two rules.

<Preview src="/preview/divider/label.html" />

::: code-group

```html [HTML]
<div class="jl-divider jl-divider--labeled" role="separator">OR</div>
```

```vue [Vue]
<template>
  <Divider label="OR" />
</template>
```

```tsx [React]
<Divider label="OR" />
```

:::

## Props

### React

`Divider` extends `React.HTMLAttributes<HTMLElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Direction (ignored when `label` is set) |
| `label` | `React.ReactNode` | — | Centered label; renders a labeled separator |

### Vue

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Direction (ignored when labeled) |
| `label` | `string` | — | Centered label text |

**Slots:** `default` — label content (alternative to the `label` prop).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-divider` | Base class — always required |
| `.jl-divider--h` | Horizontal rule |
| `.jl-divider--v` | Vertical rule (stretches to flex parent height) |
| `.jl-divider--labeled` | Labeled separator with rules on either side |
