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

## Checkable items

`CheckboxItem` (toggle, `role="menuitemcheckbox"`) and `RadioItem` wrapped in a `RadioGroup`
(single-select, `role="menuitemradio"`) add a leading check indicator. Checkable rows keep the menu
open by default — pass `closeOnSelect` (or `data-close-on-select` in HTML) to close after a choice.
The panel also supports roving keyboard navigation (<kbd>↑</kbd> <kbd>↓</kbd> <kbd>Home</kbd>
<kbd>End</kbd>, first item auto-focused on open).

<Preview src="/preview/dropdown-menu/checkable.html" />

::: code-group

```html [HTML]
<div class="jl-menu__pop" role="menu" hidden>
  <div class="jl-menu__label">Show</div>
  <button type="button" role="menuitemcheckbox" aria-checked="true" class="jl-menu__item">
    <span class="jl-menu__item-check"><svg viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    <span class="jl-menu__item-label">Grid lines</span>
  </button>
  <div class="jl-menu__label">Density</div>
  <button type="button" role="menuitemradio" aria-checked="true" class="jl-menu__item">
    <span class="jl-menu__item-check jl-menu__item-check--radio"><svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="3.5" fill="currentColor"/></svg></span>
    <span class="jl-menu__item-label">Comfortable</span>
  </button>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { ref } from "vue"
const grid = ref(true)
const density = ref("comfortable")
</script>

<template>
  <DropdownMenu>
    <template #trigger><Button variant="secondary">View options</Button></template>
    <DropdownMenuCheckboxItem v-model:checked="grid">Grid lines</DropdownMenuCheckboxItem>
    <DropdownMenuRadioGroup v-model="density">
      <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenu>
</template>
```

```tsx [React]
import { DropdownMenu } from "@/components/ui/dropdown-menu"

<DropdownMenu trigger={<Button variant="secondary">View options</Button>}>
  <DropdownMenu.CheckboxItem checked={grid} onCheckedChange={setGrid}>Grid lines</DropdownMenu.CheckboxItem>
  <DropdownMenu.RadioGroup value={density} onChange={setDensity}>
    <DropdownMenu.RadioItem value="comfortable">Comfortable</DropdownMenu.RadioItem>
    <DropdownMenu.RadioItem value="compact">Compact</DropdownMenu.RadioItem>
  </DropdownMenu.RadioGroup>
</DropdownMenu>
```

:::

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `trigger` | `React.ReactElement` | — | The toggle element (React). Vue uses the `trigger` slot |
| `align` | `"start" \| "end"` | `"start"` | Horizontal alignment |
| `side` | `"bottom" \| "top"` | `"bottom"` | Side to open toward |

**`Item`:** `icon`, `shortcut`, `tone` (`default` / `danger`), `disabled`, `onSelect` (React) /
`@select` (Vue) — the menu closes automatically after select. **`Label`** and **`Separator`** are
structural.

**`CheckboxItem`:** `checked`, `onCheckedChange` (React) / `v-model:checked` (Vue), `icon`,
`shortcut`, `disabled`, `closeOnSelect`. **`RadioGroup`:** `value` + `onChange` (React) /
`v-model` (Vue), wrapping **`RadioItem`** (`value`, `icon`, `shortcut`, `disabled`,
`closeOnSelect`). Checkable items keep the menu open unless `closeOnSelect` is set.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-menu` | Wrapper around trigger + panel |
| `.jl-menu__pop` + `data-side` / `data-align` | The floating menu (start it `hidden`) |
| `.jl-menu__item` + `--danger` | An action (`role="menuitem"`) |
| `.jl-menu__item-icon` / `-label` / `-shortcut` | Item parts |
| `.jl-menu__item-check` + `--radio` | Leading check/dot slot (shown when `aria-checked="true"`) |
| `.jl-menu__label` / `.jl-menu__sep` | Section heading / divider |

Use `role="menuitemcheckbox"` / `role="menuitemradio"` with `aria-checked` for checkable rows; the
behavior layer toggles `aria-checked`, keeps the menu open (unless the item has
`data-close-on-select`), and provides roving <kbd>↑</kbd>/<kbd>↓</kbd>/<kbd>Home</kbd>/<kbd>End</kbd>
navigation.

The behavior layer toggles the panel's `hidden`, closes on item click / outside-click / Esc (via
`JLDS.util`). The trigger is the first `<button>` (or `[data-menu-trigger]`).
