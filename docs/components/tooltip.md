# Tooltip

A small hover/focus hint that wraps a single trigger element. Four sides and an open delay. Keep
the content to a short phrase — for richer, interactive content use [Popover](/components/popover).

```bash
jlds add tooltip
```

## Usage

<Preview src="/preview/tooltip/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/tooltip.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/button.css">
<!-- behavior layer: show on hover/focus -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/tooltip.js" defer></script>

<span class="jl-tooltip">
  <button class="jl-btn jl-btn--secondary jl-btn--md">Hover me</button>
  <span class="jl-tooltip__pop" role="tooltip" data-side="top">
    Saves automatically
    <span class="jl-tooltip__arrow"></span>
  </span>
</span>
```

```vue [Vue]
<script setup lang="ts">
import { Tooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
</script>

<template>
  <Tooltip content="Saves automatically">
    <Button variant="secondary">Hover me</Button>
  </Tooltip>
</template>
```

```tsx [React]
import { Tooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

<Tooltip content="Saves automatically">
  <Button variant="secondary">Hover me</Button>
</Tooltip>
```

:::

## Sides

`top` (default) · `bottom` · `left` · `right`

<Preview src="/preview/tooltip/sides.html" />

::: code-group

```html [HTML]
<span class="jl-tooltip">
  <button class="jl-btn jl-btn--secondary">Right</button>
  <span class="jl-tooltip__pop" role="tooltip" data-side="right">On the right<span class="jl-tooltip__arrow"></span></span>
</span>
```

```vue [Vue]
<template>
  <Tooltip content="On top" side="top"><Button>Top</Button></Tooltip>
  <Tooltip content="On the right" side="right"><Button>Right</Button></Tooltip>
  <Tooltip content="On bottom" side="bottom"><Button>Bottom</Button></Tooltip>
  <Tooltip content="On the left" side="left"><Button>Left</Button></Tooltip>
</template>
```

```tsx [React]
<Tooltip content="On top" side="top"><Button>Top</Button></Tooltip>
<Tooltip content="On the right" side="right"><Button>Right</Button></Tooltip>
<Tooltip content="On bottom" side="bottom"><Button>Bottom</Button></Tooltip>
<Tooltip content="On the left" side="left"><Button>Left</Button></Tooltip>
```

:::

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `React.ReactNode` | — | Tooltip text / content (Vue: prop or `content` slot) |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Placement relative to the trigger |
| `delay` | `number` | `120` | Open delay in ms |

In Vue, the trigger goes in the default slot; the tip content in the `content` slot (or the
`content` prop).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-tooltip` | Wrapper around the trigger — always required |
| `.jl-tooltip__pop` + `data-side="…"` | The hint bubble and its placement |
| `.jl-tooltip__arrow` | The little pointer |

The behavior layer toggles `data-show` on hover/focus; positioning is pure CSS from `data-side`.
Set `data-delay` on `.jl-tooltip` to change the open delay.
