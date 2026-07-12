# Swipe Row

A list row whose trailing actions are revealed by a horizontal **swipe** on touch, and by a
hover-revealed button cluster on fine-pointer (desktop) devices. A Tier-3 native pattern — no desktop
equivalent, so it ships its own file.

```bash
jlds add swipe-row
```

## Usage

<Preview src="/preview/swipe-row/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/swipe-row.css">
<!-- behavior layer: swipe / hover reveal -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/swipe-row.js" defer></script>

<div class="jl-swiperow">
  <div class="jl-swiperow__actions">
    <button type="button" class="jl-swiperow__action" data-tone="accent"><!-- icon -->Pin</button>
    <button type="button" class="jl-swiperow__action" data-tone="danger"><!-- icon -->Delete</button>
  </div>
  <div class="jl-swiperow__panel">
    <!-- row content -->
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { SwipeRow } from "@/components/ui/swipe-row"

const actions = [
  { id: "pin", label: "Pin", icon: "<svg …></svg>", tone: "accent" },
  { id: "del", label: "Delete", icon: "<svg …></svg>", tone: "danger" },
]
function onAction(a) { if (a.id === "del") remove() }
</script>

<template>
  <SwipeRow :actions="actions" @action="onAction">
    <div class="row"><!-- row content --></div>
  </SwipeRow>
</template>
```

```tsx [React]
import { SwipeRow } from "@/components/ui/swipe-row"

<SwipeRow
  actions={[
    { id: "pin", label: "Pin", icon: <StarIcon />, tone: "accent", onClick: pin },
    { id: "del", label: "Delete", icon: <TrashIcon />, tone: "danger", onClick: remove },
  ]}
>
  <div className="row">{/* row content */}</div>
</SwipeRow>
```

:::

## Props

### React

`SwipeRow` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `actions` | `SwipeAction[]` | — | Trailing actions, revealed right-to-left (1–3) |
| `children` | `React.ReactNode` | — | The always-visible row panel |
| `threshold` | `number` | 40% of actions width | Px the row must be dragged to latch open |

Each `SwipeAction` is `{ id, label?, icon?, tone?, onClick? }` — `tone` is
`"neutral" \| "accent" \| "warning" \| "danger"`.

### Vue

Same options. `actions` carry an inline SVG/HTML `icon` string; tapping one emits `action` with the
`SwipeAction`. The row is the default slot.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-swiperow` | The row container (clips the actions) |
| `.jl-swiperow__actions` | Trailing action strip (right-anchored) |
| `.jl-swiperow__action` + `[data-tone]` | An action button and its color treatment |
| `.jl-swiperow__panel` | The always-visible, draggable content panel |

Optional `data-threshold="60"` on `.jl-swiperow` overrides the latch distance.
