# Drawer

A panel that slides in from a screen edge — detail views, filters, multi-step forms. Enters from
`right` (default), `left`, or `bottom`, locks body scroll while open, and closes on overlay
click, Esc, or ×. Use a [Dialog](/components/dialog) for short blocking decisions.

```bash
jlds add drawer
```

## Usage

<Preview src="/preview/drawer/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/drawer.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/button.css">
<!-- behavior layer: slide-in, scroll-lock + focus-trap (needs util.js) -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/util.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/drawer.js" defer></script>

<button class="jl-btn jl-btn--secondary" data-drawer-trigger data-drawer-target="#filters">Filters</button>

<div class="jl-drawer__overlay" id="filters" data-side="right" hidden>
  <div class="jl-drawer" role="dialog" aria-modal="true" style="--_size: 380px">
    <div class="jl-drawer__header">
      <div class="jl-drawer__header-text">
        <div class="jl-drawer__title">Filters</div>
        <div class="jl-drawer__desc">Narrow down the results.</div>
      </div>
      <button type="button" class="jl-drawer__close" aria-label="Close">
        <svg viewBox="0 0 18 18" width="18" height="18" fill="none"><path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="jl-drawer__body">…filter controls…</div>
    <div class="jl-drawer__footer">
      <button class="jl-btn jl-btn--secondary" data-drawer-close>Reset</button>
      <button class="jl-btn jl-btn--primary" data-drawer-close>Apply</button>
    </div>
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Drawer } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

const open = ref(false)
</script>

<template>
  <Button variant="secondary" @click="open = true">Filters</Button>
  <Drawer v-model:open="open" side="right" :size="380" title="Filters" description="Narrow down the results.">
    …filter controls…
    <template #footer>
      <Button variant="secondary" @click="open = false">Reset</Button>
      <Button @click="open = false">Apply</Button>
    </template>
  </Drawer>
</template>
```

```tsx [React]
import { useState } from "react"
import { Drawer } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

const [open, setOpen] = useState(false)

<>
  <Button variant="secondary" onClick={() => setOpen(true)}>Filters</Button>
  <Drawer
    open={open}
    onClose={() => setOpen(false)}
    side="right"
    size={380}
    title="Filters"
    description="Narrow down the results."
    footer={
      <>
        <Button variant="secondary" onClick={() => setOpen(false)}>Reset</Button>
        <Button onClick={() => setOpen(false)}>Apply</Button>
      </>
    }
  >
    …filter controls…
  </Drawer>
</>
```

:::

## Sides

`right` (default) · `left` · `bottom`. Set `size` (number → px) for the panel width (left/right)
or height (bottom).

<Preview src="/preview/drawer/sides.html" />

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Whether it's shown (Vue: `v-model:open`) |
| `onClose` | `() => void` | — | Overlay click / Esc / × (Vue: `@close`) |
| `side` | `"right" \| "left" \| "bottom"` | `"right"` | Edge the panel enters from |
| `size` | `number \| string` | — | Width (left/right) or height (bottom) |
| `title` / `description` | `React.ReactNode` | — | Header content |
| `footer` | `React.ReactNode` | — | Pinned footer (Vue: `footer` slot) |
| `showClose` | `boolean` | `true` | Show the × button |

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-drawer__overlay` + `data-side` | The fixed backdrop + entry edge (start it `hidden`) |
| `.jl-drawer` | The sliding panel (set `--_size` for width/height) |
| `.jl-drawer__header` / `__title` / `__desc` / `__close` | Header parts |
| `.jl-drawer__body` / `__footer` | Scrollable body and pinned footer |

The behavior layer: `[data-drawer-trigger]` (+ optional `data-drawer-target="#id"`) opens it;
`.jl-drawer__close` / `[data-drawer-close]`, overlay-click, and Esc close it. Scroll-lock +
focus-trap come from `JLDS.util`.
