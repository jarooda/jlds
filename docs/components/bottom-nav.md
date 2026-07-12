# Bottom Nav

A fixed bottom tab bar for phone layouts — the mobile counterpart to the
[Sidebar](/components/sidebar). Safe-area aware, ≥44px touch targets, 3–5 destinations, with
optional count badges. A Tier-3 native-only pattern.

```bash
jlds add bottom-nav
```

## Usage

<Preview src="/preview/bottom-nav/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/bottom-nav.css">
<!-- behavior layer: active-tab switching -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/bottom-nav.js" defer></script>

<nav class="jl-bottomnav jl-bottomnav--fixed" aria-label="Primary">
  <button type="button" class="jl-bottomnav__item" data-id="home" aria-current="page">
    <span class="jl-bottomnav__icon"><!-- icon svg --></span>
    <span class="jl-bottomnav__label">Home</span>
  </button>
  <button type="button" class="jl-bottomnav__item" data-id="inbox">
    <span class="jl-bottomnav__icon"><!-- icon svg --><span class="jl-bottomnav__badge">3</span></span>
    <span class="jl-bottomnav__label">Inbox</span>
  </button>
</nav>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { BottomNav } from "@/components/ui/bottom-nav"

const tab = ref("home")
const items = [
  { id: "home", label: "Home", icon: "<svg …></svg>" },
  { id: "inbox", label: "Inbox", icon: "<svg …></svg>", badge: 3 },
]
</script>

<template>
  <BottomNav v-model="tab" :items="items" />
</template>
```

```tsx [React]
import { useState } from "react"
import { BottomNav } from "@/components/ui/bottom-nav"

const [tab, setTab] = useState("home")

<BottomNav
  value={tab}
  onChange={setTab}
  items={[
    { id: "home", label: "Home", icon: <HomeIcon /> },
    { id: "inbox", label: "Inbox", icon: <InboxIcon />, badge: 3 },
  ]}
/>
```

:::

Pass `fixed={false}` (React) / `:fixed="false"` (Vue) or drop `jl-bottomnav--fixed` (HTML) to keep
the bar in normal flow — useful inside a device frame or a scroll container. In HTML the behavior
layer sets `aria-current="page"` on the tapped item and emits `jl-bottomnav:change`.

## Props

### React

`BottomNav` extends `React.HTMLAttributes<HTMLElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `BottomNavItem[]` | — | Destinations, left to right (3–5) |
| `value` | `string` | — | Id of the active tab |
| `onChange` | `(id: string) => void` | — | Fires with the tapped item's id |
| `showLabels` | `boolean` | `true` | Show text labels under icons |
| `fixed` | `boolean` | `true` | Pin to the viewport bottom |

Each `BottomNavItem` is `{ id, label?, icon?, badge? }` — `badge` is a number/string, or `true` for
a bare attention dot.

### Vue

Same options. `value` is a `v-model` (`v-model`); also emits `change`. Item `icon` is an inline
SVG/HTML string.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-bottomnav` | The bar (`<nav>`) |
| `.jl-bottomnav--fixed` | Pin to the viewport bottom |
| `.jl-bottomnav__item` | A destination button (`data-id`, `aria-current="page"` when active) |
| `.jl-bottomnav__icon` | Icon wrapper (position anchor for the badge) |
| `.jl-bottomnav__label` | Text label under the icon |
| `.jl-bottomnav__badge` / `__dot` | Count badge / bare attention dot |
