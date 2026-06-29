# Collapsible

A single show/hide region with a trigger — lighter than [Accordion](/components/accordion) when you
only need one panel. The region animates open with a `grid-template-rows` transition (no fixed
heights). `ghost` (bare) or `bordered` (wrapped in a card), with the chevron at the `start` or `end`.

```bash
jlds add collapsible
```

## Usage

<Preview src="/preview/collapsible/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/collapsible.css">
<!-- behavior layer: open/close on click -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/collapsible.js" defer></script>

<div class="jl-collapsible jl-collapsible--ghost" data-open="true">
  <button type="button" class="jl-collapsible__trigger" data-chevron="end" aria-expanded="true" aria-controls="c1">
    <span class="jl-collapsible__label">Show advanced options</span>
    <span class="jl-collapsible__chevron"><svg viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  </button>
  <div class="jl-collapsible__region" id="c1" role="region">
    <div class="jl-collapsible__content"><div class="jl-collapsible__inner">Hidden content.</div></div>
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { Collapsible } from "@/components/ui/collapsible"
</script>

<template>
  <Collapsible trigger="Show advanced options" :default-open="true">
    These settings are hidden by default.
  </Collapsible>
</template>
```

```tsx [React]
import { Collapsible } from "@/components/ui/collapsible"

<Collapsible trigger="Show advanced options" defaultOpen>
  These settings are hidden by default.
</Collapsible>
```

:::

## Bordered

`variant="bordered"` wraps the region in a surface card. Use `chevronPosition="start"` to move the
chevron before the label, and pass an `icon` to lead the trigger.

<Preview src="/preview/collapsible/bordered.html" />

::: code-group

```html [HTML]
<div class="jl-collapsible jl-collapsible--bordered">
  <button type="button" class="jl-collapsible__trigger" data-chevron="start" aria-expanded="false" aria-controls="c2">
    <span class="jl-collapsible__leadicon"><!-- icon svg --></span>
    <span class="jl-collapsible__label">Order details</span>
  </button>
  <div class="jl-collapsible__region" id="c2" role="region">
    <div class="jl-collapsible__content"><div class="jl-collapsible__inner">Panel body.</div></div>
  </div>
</div>
```

```vue [Vue]
<template>
  <Collapsible variant="bordered" chevron-position="start" trigger="Order details">
    <template #icon><MenuIcon /></template>
    Panel body.
  </Collapsible>
</template>
```

```tsx [React]
<Collapsible variant="bordered" chevronPosition="start" icon={<MenuIcon />} trigger="Order details">
  Panel body.
</Collapsible>
```

:::

## Props

### React

`Collapsible` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `trigger` | `React.ReactNode` | — | Header label content |
| `icon` | `React.ReactNode` | — | Optional leading icon |
| `open` | `boolean` | — | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial state |
| `onOpenChange` | `(open: boolean) => void` | — | Fires on toggle |
| `disabled` | `boolean` | `false` | Disable the trigger |
| `variant` | `"ghost" \| "bordered"` | `"ghost"` | Visual treatment |
| `chevronPosition` | `"start" \| "end"` | `"end"` | Chevron placement |

### Vue

Same options. `open` is a `v-model` (`v-model:open`); pass the header via the `trigger` prop or the
`trigger` slot, and the leading icon via the `icon` slot. Emits `update:open`.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-collapsible` + `--ghost` / `--bordered` | Container and variant |
| `[data-open="true"]` | On the container: open state |
| `.jl-collapsible__trigger` + `[data-chevron="start\|end"]` | The header button and chevron placement |
| `.jl-collapsible__leadicon` / `__label` / `__chevron` | Trigger parts |
| `.jl-collapsible__region` / `__content` / `__inner` | The animated collapsible panel |
