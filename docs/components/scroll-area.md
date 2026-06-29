# Scroll Area

A scroll container with a thin, themed scrollbar (consistent across Firefox and WebKit) plus
optional fade masks at the scrollable edges. Constrain it with `maxHeight` (or a fixed height via
`style`). The scrollbar styling is pure CSS; the fade reacts to scroll position.

```bash
jlds add scroll-area
```

## Usage

Wrap content and cap the viewport height. `axis` controls which directions scroll (`y`, `x`,
`both`).

<Preview src="/preview/scroll-area/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/scroll-area.css">

<div class="jl-scrollarea jl-scrollarea--y">
  <div class="jl-scrollarea__viewport" style="max-height: 220px">
    <!-- long content … -->
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { ScrollArea } from "@/components/ui/scroll-area"
</script>

<template>
  <ScrollArea :max-height="220">
    <!-- long content … -->
  </ScrollArea>
</template>
```

```tsx [React]
import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea maxHeight={220}>
  {/* long content … */}
</ScrollArea>
```

:::

## Edge fades

Set `fade` to mask the top/bottom edges while there's more to scroll. In HTML, add `data-fade` to
the root and include the two `__fade` elements — the behavior script toggles `data-fade-top` /
`data-fade-bottom`. Match the fade to a non-card background with `fadeColor`.

<Preview src="/preview/scroll-area/fade.html" />

::: code-group

```html [HTML]
<!-- behavior layer: toggles the edge fades on scroll -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/scroll-area.js" defer></script>

<div class="jl-scrollarea jl-scrollarea--y" data-fade>
  <div class="jl-scrollarea__fade jl-scrollarea__fade--top"></div>
  <div class="jl-scrollarea__viewport" style="max-height: 220px">
    <!-- long content … -->
  </div>
  <div class="jl-scrollarea__fade jl-scrollarea__fade--bottom"></div>
</div>
```

```vue [Vue]
<template>
  <ScrollArea :max-height="220" fade>
    <!-- long content … -->
  </ScrollArea>
</template>
```

```tsx [React]
<ScrollArea maxHeight={220} fade>
  {/* long content … */}
</ScrollArea>
```

:::

## Props

### React

`ScrollArea` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `axis` | `"x" \| "y" \| "both"` | `"y"` | Scrollable direction(s) |
| `maxHeight` | `number \| string` | — | Caps the viewport height |
| `fade` | `boolean` | `false` | Show edge fade masks |
| `fadeColor` | `string` | `--surface-card` | Fade gradient base color |
| `viewportRef` | `Ref<HTMLDivElement>` | — | Ref to the scrolling viewport |
| `onScroll` | `(e) => void` | — | Viewport scroll handler |

### Vue

Same options. Listen with `@scroll`; the scrolling viewport element is exposed via a template ref
(`defineExpose({ viewport })`).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-scrollarea` + `--y` / `--x` / `--both` | Container and scroll axis |
| `.jl-scrollarea__viewport` | The scrolling element (set `max-height` here) |
| `[data-fade]` | Enables the JS fade behavior |
| `.jl-scrollarea__fade` + `--top` / `--bottom` | Edge gradient masks |
| `[data-fade-top]` / `[data-fade-bottom]` | Toggled by the behavior to reveal each fade |
