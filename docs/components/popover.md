# Popover

A floating panel anchored to a trigger — richer than [Tooltip](/components/tooltip): it holds
interactive content (forms, menus, info with links). Opens on click; closes on outside-click or
Escape.

```bash
jlds add popover
```

## Usage

<Preview src="/preview/popover/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/popover.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/button.css">
<!-- behavior layer: open/close, outside-click + Esc (needs util.js) -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/util.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/popover.js" defer></script>

<span class="jl-popover">
  <button class="jl-btn jl-btn--secondary jl-btn--md">Open</button>
  <div class="jl-popover__pop" role="dialog" data-side="bottom" data-align="center" hidden>
    <span class="jl-popover__arrow" aria-hidden="true"></span>
    <p style="margin:0 0 8px;font-weight:600">Share this project</p>
    <p style="margin:0;color:var(--text-secondary)">Anyone with the link can view.</p>
  </div>
</span>
```

```vue [Vue]
<script setup lang="ts">
import { Popover } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
</script>

<template>
  <Popover>
    <template #trigger><Button variant="secondary">Open</Button></template>
    <p style="margin:0 0 8px;font-weight:600">Share this project</p>
    <p style="margin:0;color:var(--text-secondary)">Anyone with the link can view.</p>
  </Popover>
</template>
```

```tsx [React]
import { Popover } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

<Popover trigger={<Button variant="secondary">Open</Button>}>
  <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Share this project</p>
  <p style={{ margin: 0, color: "var(--text-secondary)" }}>Anyone with the link can view.</p>
</Popover>
```

:::

## Placement

`side` is `bottom` (default) or `top`; `align` is `start` · `center` · `end`.

<Preview src="/preview/popover/align.html" />

::: code-group

```html [HTML]
<div class="jl-popover__pop" data-side="bottom" data-align="start" hidden>…</div>
```

```vue [Vue]
<template>
  <Popover side="bottom" align="start">…</Popover>
</template>
```

```tsx [React]
<Popover side="bottom" align="start" trigger={<Button>Menu</Button>}>…</Popover>
```

:::

## Flush content & close from inside

Set `padded={false}` for flush content (e.g. a menu). React/Vue expose a `close` function — in
React the children can be a function `({ close }) => …`; in Vue it's a slot prop.

::: code-group

```vue [Vue]
<template>
  <Popover v-slot="{ close }" :padded="false">
    <template #trigger><Button>Account</Button></template>
    <button class="jl-btn jl-btn--ghost" @click="close()">Sign out</button>
  </Popover>
</template>
```

```tsx [React]
<Popover padded={false} trigger={<Button>Account</Button>}>
  {({ close }) => <button className="jl-btn jl-btn--ghost" onClick={close}>Sign out</button>}
</Popover>
```

:::

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `trigger` | `React.ReactElement` | — | The toggle element (React). Vue uses the `trigger` slot |
| `side` | `"bottom" \| "top"` | `"bottom"` | Side to open toward |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Horizontal alignment |
| `arrow` | `boolean` | `true` | Show the pointer arrow |
| `padded` | `boolean` | `true` | Default inner padding (false for flush menus) |
| `open` / `defaultOpen` | `boolean` | — | Controlled / uncontrolled open state |
| `onOpenChange` | `(open: boolean) => void` | — | React; Vue uses `v-model:open` |

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-popover` | Wrapper (relative anchor) around trigger + panel |
| `.jl-popover__pop` + `data-side` / `data-align` | The floating panel (start it `hidden`) |
| `.jl-popover__arrow` | The pointer arrow |

The behavior layer toggles the panel's `hidden` on trigger click and closes on outside-click /
Esc (via `JLDS.util`). The trigger is the first `<button>` (or any `[data-popover-trigger]`).
Set inline `--_pad: 0` on the panel for flush content.
