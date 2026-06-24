# Command Palette

A ⌘K command launcher: fuzzy search across grouped commands, full keyboard navigation (↑/↓,
Enter, Esc), and a scroll-locked overlay. Controlled via `open`/`onOpenChange`, or left
uncontrolled with the built-in global shortcut.

```bash
jlds add command-palette
```

## Usage

Press **⌘K** / **Ctrl-K**, or use the button. Type to filter, ↑/↓ to move, Enter to run.

<Preview src="/preview/command-palette/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/command-palette.css">
<!-- behavior layer: ⌘K toggle, filter, keyboard, scroll-lock (needs util.js) -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/util.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/command-palette.js" defer></script>

<button data-cmdk-trigger>Open ⌘K</button>

<div class="jl-cmdk__overlay" hidden>
  <div class="jl-cmdk" role="dialog" aria-modal="true" aria-label="Command palette">
    <div class="jl-cmdk__search">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.75"/><path d="m20 20-3.6-3.6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>
      <input class="jl-cmdk__input" placeholder="Type a command or search…" aria-label="Search commands" />
    </div>
    <div class="jl-cmdk__list" role="listbox">
      <div class="jl-cmdk__empty">No results found.</div>
      <div role="group" aria-label="Actions">
        <div class="jl-cmdk__group-label">Actions</div>
        <a class="jl-cmdk__item" role="option" href="#new" data-keywords="create add">
          <span class="jl-cmdk__item-text"><span class="jl-cmdk__item-label">New project</span></span>
        </a>
        <!-- more .jl-cmdk__item rows -->
      </div>
    </div>
    <div class="jl-cmdk__footer">
      <span class="jl-cmdk__footer-hint"><kbd class="jl-cmdk__key">↑↓</kbd> navigate</span>
      <span class="jl-cmdk__footer-hint"><kbd class="jl-cmdk__key">↵</kbd> select</span>
      <span class="jl-cmdk__footer-hint"><kbd class="jl-cmdk__key">esc</kbd> close</span>
    </div>
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { CommandPalette } from "@/components/ui/command-palette"

const items = [
  { id: "new", label: "New project", group: "Actions", keywords: ["create"], onSelect: () => {} },
  { id: "search", label: "Search docs", group: "Actions", shortcut: "⌘/", onSelect: () => {} },
  { id: "theme", label: "Toggle theme", group: "Preferences", onSelect: () => {} },
]
</script>

<template>
  <!-- mounts the ⌘K listener; opens itself, no trigger needed -->
  <CommandPalette :items="items" />
</template>
```

```tsx [React]
import { CommandPalette } from "@/components/ui/command-palette"

const items = [
  { id: "new", label: "New project", group: "Actions", keywords: ["create"], onSelect: () => {} },
  { id: "search", label: "Search docs", group: "Actions", shortcut: "⌘/", onSelect: () => {} },
  { id: "theme", label: "Toggle theme", group: "Preferences", onSelect: () => {} },
]

<CommandPalette items={items} />
```

:::

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `CommandItem[]` | — | The commands (see below) |
| `open` / `defaultOpen` | `boolean` | — | Controlled / uncontrolled (Vue: `v-model:open`) |
| `onOpenChange` | `(open) => void` | — | React; Vue uses `v-model:open` |
| `shortcut` | `string[]` | `['mod','k']` | Global toggle combo (`mod` = ⌘/Ctrl) |
| `placeholder` / `emptyMessage` | `string` | — | Copy |
| `footer` | `ReactNode \| null` | default hints | Custom footer; `null` hides it (Vue: `footer` slot) |

**`CommandItem`:** `id`, `label`, `hint`, `icon`, `shortcut`, `group`, `keywords` (extra match
terms), `disabled`, `onSelect(item)`.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-cmdk__overlay` | The fixed backdrop (start it `hidden`); set `data-key` to change the shortcut |
| `.jl-cmdk` | The panel |
| `.jl-cmdk__search` / `__input` | Search row |
| `.jl-cmdk__list` / `__group-label` / `__empty` | Results, group headings, empty state |
| `.jl-cmdk__item` + `[data-active]` | A command (`data-keywords` adds match terms) |
| `.jl-cmdk__item-icon` / `-text` / `-label` / `-hint` / `-trail` | Item parts |
| `.jl-cmdk__footer` / `__key` | Footer hint row + key caps |

In HTML, items are plain `.jl-cmdk__item` rows (use `<a href>` or wire your own click). The
behavior filters, navigates, and runs the active row's click on Enter. A `[data-cmdk-trigger]`
button opens it (or `data-cmdk-target="#id"` to target a specific overlay).
