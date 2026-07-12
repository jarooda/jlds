# Toolbar

A horizontal action bar that **measures its own container** and folds the lowest-priority items into
a trailing "More" menu when width runs out — no breakpoint, no API change. Tier-2 adaptive.

```bash
jlds add toolbar
```

## Usage

<Preview src="/preview/toolbar/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/toolbar.css">
<!-- behavior layer: overflow measuring + More menu -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/toolbar.js" defer></script>

<div class="jl-toolbar jl-toolbar--block" role="toolbar" data-more-label="More">
  <button type="button" class="jl-toolbar__btn"><!-- icon -->New</button>
  <button type="button" class="jl-toolbar__btn"><!-- icon -->Filter</button>
  <span class="jl-toolbar__sep" aria-hidden="true"></span>
  <button type="button" class="jl-toolbar__btn"><!-- icon -->Delete</button>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { Toolbar } from "@/components/ui/toolbar"

const items = [
  { id: "new", label: "New", icon: "<svg …></svg>" },
  { id: "filter", label: "Filter", icon: "<svg …></svg>", active: false },
  { type: "separator" },
  { id: "del", label: "Delete", icon: "<svg …></svg>" },
]
</script>

<template>
  <Toolbar :items="items" block @select="(it) => run(it.id)" />
</template>
```

```tsx [React]
import { Toolbar } from "@/components/ui/toolbar"

<Toolbar
  block
  items={[
    { id: "new", label: "New", icon: <PlusIcon />, onClick: create },
    { id: "filter", label: "Filter", icon: <FilterIcon />, active: filtered, onClick: toggle },
    { type: "separator" },
    { id: "del", label: "Delete", icon: <TrashIcon />, onClick: remove },
  ]}
/>
```

:::

Items are listed in **priority order** — the first survive longest as width shrinks. Give an item
`active: true` for a pressed (accent) toggle state, or `type: "separator"` for a vertical rule.

## Props

### React

`Toolbar` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `ToolbarItem[]` | — | Actions, in priority order |
| `block` | `boolean` | `false` | Stretch to fill the parent width |
| `moreLabel` | `string` | `"More"` | Accessible label for the overflow button |

Each `ToolbarItem` is `{ id?, type?, label?, icon?, tooltip?, active?, disabled?, onClick? }`. Omit
`label` for an icon-only button (give it a `tooltip` for the accessible name).

### Vue

Same options. Item `icon` is an inline SVG/HTML string; clicking an item emits `select` with the
`ToolbarItem`.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-toolbar` (+ `--block`) | The bar (`role="toolbar"`); `--block` fills the width |
| `.jl-toolbar__btn` (+ `--icon`) | An action button; `--icon` tightens icon-only padding |
| `.jl-toolbar__sep` | Vertical rule between groups |
| `.jl-toolbar__more` / `__menu` / `__mitem` | Generated overflow control, menu, and items |

Optional `data-more-label` sets the overflow button's label. The behavior layer measures the bar and
rebuilds the menu on resize.
