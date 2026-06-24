# Dropdown Menu

A trigger that opens a floating list of actions — row menus, "more" buttons, overflow actions.
Compose with items, labels, and separators; items support icons, a shortcut hint, and a `danger`
tone.

```bash
jlds add dropdown-menu
```

## Usage

<Preview src="/preview/dropdown-menu/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/dropdown-menu.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/button.css">
<!-- behavior layer: open/close, outside-click + Esc (needs util.js) -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/util.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/dropdown-menu.js" defer></script>

<span class="jl-menu">
  <button class="jl-btn jl-btn--secondary jl-btn--md">Actions</button>
  <div class="jl-menu__pop" role="menu" data-side="bottom" data-align="start" hidden>
    <div class="jl-menu__label">Manage</div>
    <button type="button" role="menuitem" class="jl-menu__item">
      <span class="jl-menu__item-label">Edit</span>
      <span class="jl-menu__item-shortcut">⌘E</span>
    </button>
    <button type="button" role="menuitem" class="jl-menu__item">
      <span class="jl-menu__item-label">Duplicate</span>
    </button>
    <div class="jl-menu__sep" role="separator"></div>
    <button type="button" role="menuitem" class="jl-menu__item jl-menu__item--danger">
      <span class="jl-menu__item-label">Delete</span>
    </button>
  </div>
</span>
```

```vue [Vue]
<script setup lang="ts">
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
</script>

<template>
  <DropdownMenu>
    <template #trigger><Button variant="secondary">Actions</Button></template>
    <DropdownMenuLabel>Manage</DropdownMenuLabel>
    <DropdownMenuItem shortcut="⌘E" @select="edit">Edit</DropdownMenuItem>
    <DropdownMenuItem @select="duplicate">Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem tone="danger" @select="remove">Delete</DropdownMenuItem>
  </DropdownMenu>
</template>
```

```tsx [React]
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

<DropdownMenu trigger={<Button variant="secondary">Actions</Button>}>
  <DropdownMenu.Label>Manage</DropdownMenu.Label>
  <DropdownMenu.Item shortcut="⌘E" onSelect={edit}>Edit</DropdownMenu.Item>
  <DropdownMenu.Item onSelect={duplicate}>Duplicate</DropdownMenu.Item>
  <DropdownMenu.Separator />
  <DropdownMenu.Item tone="danger" onSelect={remove}>Delete</DropdownMenu.Item>
</DropdownMenu>
```

:::

## Placement

`side` is `bottom` (default) / `top`; `align` is `start` (default) / `end`.

<Preview src="/preview/dropdown-menu/align.html" />

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `trigger` | `React.ReactElement` | — | The toggle element (React). Vue uses the `trigger` slot |
| `align` | `"start" \| "end"` | `"start"` | Horizontal alignment |
| `side` | `"bottom" \| "top"` | `"bottom"` | Side to open toward |

**`Item`:** `icon`, `shortcut`, `tone` (`default` / `danger`), `disabled`, `onSelect` (React) /
`@select` (Vue) — the menu closes automatically after select. **`Label`** and **`Separator`** are
structural.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-menu` | Wrapper around trigger + panel |
| `.jl-menu__pop` + `data-side` / `data-align` | The floating menu (start it `hidden`) |
| `.jl-menu__item` + `--danger` | An action (`role="menuitem"`) |
| `.jl-menu__item-icon` / `-label` / `-shortcut` | Item parts |
| `.jl-menu__label` / `.jl-menu__sep` | Section heading / divider |

The behavior layer toggles the panel's `hidden`, closes on item click / outside-click / Esc (via
`JLDS.util`). The trigger is the first `<button>` (or `[data-menu-trigger]`).
