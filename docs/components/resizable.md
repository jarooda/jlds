# Resizable

Draggable split panes. Compose `Resizable.Panel` children (React) / `ResizablePanel` (Vue) and a
drag handle is inserted between each. Sizes are percentages that sum to 100 — growing one panel
shrinks its neighbor. Drag with the pointer or focus a handle and use the arrow keys. `direction`
is `horizontal` (default) or `vertical`.

```bash
jlds add resizable
```

## Usage

<Preview src="/preview/resizable/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/resizable.css">
<!-- behavior layer: pointer drag + arrow keys -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/resizable.js" defer></script>

<div class="jl-resizable jl-resizable--horizontal">
  <div class="jl-resizable__panel" style="flex: 0 0 30%" data-min-size="15">Files</div>
  <div class="jl-resizable__handle" role="separator" tabindex="0" aria-orientation="vertical">
    <span class="jl-resizable__grip"><span></span><span></span><span></span></span>
  </div>
  <div class="jl-resizable__panel" style="flex: 0 0 70%" data-min-size="20">Editor</div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { Resizable, ResizablePanel } from "@/components/ui/resizable"
</script>

<template>
  <Resizable direction="horizontal">
    <ResizablePanel :default-size="30" :min-size="15">Files</ResizablePanel>
    <ResizablePanel :min-size="20">Editor</ResizablePanel>
  </Resizable>
</template>
```

```tsx [React]
import { Resizable } from "@/components/ui/resizable"

<Resizable direction="horizontal">
  <Resizable.Panel defaultSize={30} minSize={15}>Files</Resizable.Panel>
  <Resizable.Panel minSize={20}>Editor</Resizable.Panel>
</Resizable>
```

:::

In HTML, set the starting split via each panel's `flex-basis` (e.g. `style="flex: 0 0 30%"`) and an
optional `data-min-size` (percent). The handle must sit between the two panels it resizes.

## Vertical

`direction="vertical"` (HTML: `jl-resizable--vertical`) stacks the panels and drags up/down.

<Preview src="/preview/resizable/vertical.html" />

::: code-group

```html [HTML]
<div class="jl-resizable jl-resizable--vertical">
  <div class="jl-resizable__panel" style="flex: 0 0 60%">Preview</div>
  <div class="jl-resizable__handle" role="separator" tabindex="0" aria-orientation="horizontal">…</div>
  <div class="jl-resizable__panel" style="flex: 0 0 40%">Console</div>
</div>
```

```vue [Vue]
<template>
  <Resizable direction="vertical">
    <ResizablePanel :default-size="60">Preview</ResizablePanel>
    <ResizablePanel :default-size="40">Console</ResizablePanel>
  </Resizable>
</template>
```

```tsx [React]
<Resizable direction="vertical">
  <Resizable.Panel defaultSize={60}>Preview</Resizable.Panel>
  <Resizable.Panel defaultSize={40}>Console</Resizable.Panel>
</Resizable>
```

:::

## Props

### React

`Resizable` extends `React.HTMLAttributes<HTMLDivElement>` (minus `onResize`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` | Split orientation |
| `onResize` | `(sizes: number[]) => void` | — | Fires with the new percent sizes |

`Resizable.Panel` props: `defaultSize` (percent), `minSize` (percent, default `8`), plus standard
`div` attributes.

### Vue

Same options as separate components: `Resizable` (emits `@resize`) and `ResizablePanel`
(`defaultSize`, `minSize` props). Panels self-register with the parent so the handle and sizing are
wired automatically.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-resizable` + `--horizontal` / `--vertical` | The container and orientation |
| `.jl-resizable__panel` | A pane (set its `flex-basis`; `data-min-size` clamps it) |
| `.jl-resizable__handle` | The drag separator between two panels |
| `[data-dragging="true"]` | Set on the handle while dragging |
| `.jl-resizable__grip` | The grip dots shown on hover/drag |
