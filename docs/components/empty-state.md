# Empty State

A placeholder for a zero / blank view — no results, an empty list, a first-run screen. A framed
icon, a short headline, supporting copy, and optional action buttons. Pairs naturally inside a
[Card](/components/card) or table body.

```bash
jlds add empty-state
```

## Usage

<Preview src="/preview/empty-state/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/empty-state.css">

<div class="jl-empty">
  <span class="jl-empty__media">
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 13h5l1.5 3h5L21 13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M5 5h14l2 8v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </span>
  <p class="jl-empty__title">No messages yet</p>
  <p class="jl-empty__desc">When someone sends you a message, it'll show up here.</p>
  <div class="jl-empty__actions">
    <button class="jl-btn jl-btn--primary jl-btn--md">Compose</button>
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
</script>

<template>
  <EmptyState
    title="No messages yet"
    description="When someone sends you a message, it'll show up here."
  >
    <template #actions>
      <Button>Compose</Button>
    </template>
  </EmptyState>
</template>
```

```tsx [React]
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"

<EmptyState
  title="No messages yet"
  description="When someone sends you a message, it'll show up here."
  actions={<Button>Compose</Button>}
/>
```

:::

## Bordered

Add `bordered` for a dashed sunken panel — good for drop zones and table bodies. Pass a custom
`icon` to override the default inbox glyph.

<Preview src="/preview/empty-state/bordered.html" />

::: code-group

```html [HTML]
<div class="jl-empty jl-empty--bordered">
  <span class="jl-empty__media"><!-- custom icon svg --></span>
  <p class="jl-empty__title">No results</p>
  <p class="jl-empty__desc">Try a different search or clear the filters.</p>
</div>
```

```vue [Vue]
<template>
  <EmptyState bordered title="No results" description="Try a different search or clear the filters.">
    <template #icon><SearchIcon /></template>
  </EmptyState>
</template>
```

```tsx [React]
<EmptyState
  bordered
  icon={<Search />}
  title="No results"
  description="Try a different search or clear the filters."
/>
```

:::

## Props

`EmptyState` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `React.ReactNode` | inbox glyph | Glyph in the framed media slot |
| `title` | `React.ReactNode` | — | Short headline |
| `description` | `React.ReactNode` | — | One or two supporting sentences |
| `actions` | `React.ReactNode` | — | Action buttons |
| `size` | `"sm" \| "md"` | `"md"` | Compact variant for in-card use |
| `bordered` | `boolean` | `false` | Dashed sunken panel |

In Vue, `title`/`description` are props; pass the `icon` and `actions` via slots of the same name.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-empty` | Wrapper — centered column |
| `.jl-empty--sm` | Compact padding/sizing |
| `.jl-empty--bordered` | Dashed sunken panel |
| `.jl-empty__media` | Framed icon slot |
| `.jl-empty__title` / `__desc` | Headline and supporting copy |
| `.jl-empty__actions` | Action button row |
