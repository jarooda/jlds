# IconButton

A square, label-less button for toolbar and inline icon actions. Three variants and three
sizes, with an optional fully-round shape.

> **Accessibility:** icon buttons have no visible text, so always pass an `aria-label`.

```bash
jlds add icon-button
```

## Usage

<Preview src="/preview/icon-button/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/icon-button.css">

<button class="jl-iconbtn jl-iconbtn--ghost jl-iconbtn--md" aria-label="Settings">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
</button>
```

```vue [Vue]
<script setup lang="ts">
import { IconButton } from "@/components/ui/icon-button"
</script>

<template>
  <IconButton aria-label="Settings"><SettingsIcon /></IconButton>
</template>
```

```tsx [React]
import { IconButton } from "@/components/ui/icon-button"
import { Settings } from "lucide-react"

<IconButton aria-label="Settings"><Settings /></IconButton>
```

:::

## Variants

`ghost` (default) · `secondary` · `primary`

<Preview src="/preview/icon-button/variants.html" />

::: code-group

```html [HTML]
<button class="jl-iconbtn jl-iconbtn--ghost jl-iconbtn--md" aria-label="More">…</button>
<button class="jl-iconbtn jl-iconbtn--secondary jl-iconbtn--md" aria-label="More">…</button>
<button class="jl-iconbtn jl-iconbtn--primary jl-iconbtn--md" aria-label="More">…</button>
```

```vue [Vue]
<template>
  <IconButton variant="ghost" aria-label="More"><MoreIcon /></IconButton>
  <IconButton variant="secondary" aria-label="More"><MoreIcon /></IconButton>
  <IconButton variant="primary" aria-label="More"><MoreIcon /></IconButton>
</template>
```

```tsx [React]
<IconButton variant="ghost" aria-label="More"><MoreHorizontal /></IconButton>
<IconButton variant="secondary" aria-label="More"><MoreHorizontal /></IconButton>
<IconButton variant="primary" aria-label="More"><MoreHorizontal /></IconButton>
```

:::

## Sizes & round

`sm` (32px) · `md` (38px, default) · `lg` (44px). Add `round` for a fully circular shape.

<Preview src="/preview/icon-button/sizes.html" />

::: code-group

```html [HTML]
<button class="jl-iconbtn jl-iconbtn--secondary jl-iconbtn--sm" aria-label="Add">+</button>
<button class="jl-iconbtn jl-iconbtn--secondary jl-iconbtn--md" aria-label="Add">+</button>
<button class="jl-iconbtn jl-iconbtn--secondary jl-iconbtn--lg" aria-label="Add">+</button>
<button class="jl-iconbtn jl-iconbtn--primary jl-iconbtn--md jl-iconbtn--round" aria-label="Add">+</button>
```

```vue [Vue]
<template>
  <IconButton variant="secondary" size="sm" aria-label="Add"><PlusIcon /></IconButton>
  <IconButton variant="secondary" size="md" aria-label="Add"><PlusIcon /></IconButton>
  <IconButton variant="secondary" size="lg" aria-label="Add"><PlusIcon /></IconButton>
  <IconButton variant="primary" round aria-label="Add"><PlusIcon /></IconButton>
</template>
```

```tsx [React]
<IconButton variant="secondary" size="sm" aria-label="Add"><Plus /></IconButton>
<IconButton variant="secondary" size="md" aria-label="Add"><Plus /></IconButton>
<IconButton variant="secondary" size="lg" aria-label="Add"><Plus /></IconButton>
<IconButton variant="primary" round aria-label="Add"><Plus /></IconButton>
```

:::

## Props

### React

`IconButton` extends `React.ButtonHTMLAttributes<HTMLButtonElement>` (so `onClick`, `disabled`,
etc. pass through). `aria-label` is **required**.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"ghost" \| "secondary" \| "primary"` | `"ghost"` | Visual style |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Square dimension |
| `round` | `boolean` | `false` | Fully circular instead of rounded-square |
| `aria-label` | `string` | — | **Required** accessible label |

### Vue

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"ghost" \| "secondary" \| "primary"` | `"ghost"` | Visual style |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Square dimension |
| `round` | `boolean` | `false` | Fully circular |
| `disabled` | `boolean` | `false` | Disable the button |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Native `<button>` type |

Pass the icon in the default slot, and set `aria-label` as an attribute (falls through).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-iconbtn` | Base class — always required |
| `.jl-iconbtn--ghost` / `--secondary` / `--primary` | Variant |
| `.jl-iconbtn--sm` / `--md` / `--lg` | Size |
| `.jl-iconbtn--round` | Fully circular shape |
