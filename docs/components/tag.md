# Tag

A pill for filters, tokens, and multi-select chips. Can be static, selectable (filter active),
or removable with an × button.

```bash
jlds add tag
```

## Usage

<Preview src="/preview/tag/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/tag.css">
<!-- behavior layer (optional): wires up the × remove button -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/all.js" defer></script>

<span class="jl-tag">Design</span>
```

```vue [Vue]
<script setup lang="ts">
import { Tag } from "@/components/ui/tag"
</script>

<template>
  <Tag>Design</Tag>
</template>
```

```tsx [React]
import { Tag } from "@/components/ui/tag"

<Tag>Design</Tag>
```

:::

## Selectable

Add `selected` for the active-filter style. Pair with an `onClick` (React) / `@click` (Vue) to
make it a toggle button — that also adds hover affordance.

<Preview src="/preview/tag/selectable.html" />

::: code-group

```html [HTML]
<span class="jl-tag jl-tag--button">All</span>
<span class="jl-tag jl-tag--button jl-tag--selected">Active</span>
<span class="jl-tag jl-tag--button">Archived</span>
```

```vue [Vue]
<template>
  <Tag :selected="filter === 'all'" @click="filter = 'all'">All</Tag>
  <Tag :selected="filter === 'active'" @click="filter = 'active'">Active</Tag>
  <Tag :selected="filter === 'archived'" @click="filter = 'archived'">Archived</Tag>
</template>
```

```tsx [React]
<Tag selected={filter === "all"} onClick={() => setFilter("all")}>All</Tag>
<Tag selected={filter === "active"} onClick={() => setFilter("active")}>Active</Tag>
<Tag selected={filter === "archived"} onClick={() => setFilter("archived")}>Archived</Tag>
```

:::

## Removable

In React, pass `onRemove` to render the × button. In Vue, set `removable` and listen for the
`remove` event. In HTML, include the `jl-tag__remove` button and load the
[behavior layer](/guide/vanilla-html#interactivity-optional) — clicking × removes the tag.

<Preview src="/preview/tag/removable.html" />

::: code-group

```html [HTML]
<span class="jl-tag">
  react
  <button type="button" class="jl-tag__remove" aria-label="Remove">
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  </button>
</span>
```

```vue [Vue]
<template>
  <Tag removable @remove="remove('react')">react</Tag>
  <Tag removable @remove="remove('vue')">vue</Tag>
</template>
```

```tsx [React]
<Tag onRemove={() => remove("react")}>react</Tag>
<Tag onRemove={() => remove("vue")}>vue</Tag>
```

:::

## Props

### React

`Tag` extends `React.HTMLAttributes<HTMLSpanElement>` (so `onClick`, `className`, etc. pass
through).

| Prop | Type | Default | Description |
|---|---|---|---|
| `selected` | `boolean` | `false` | Active-filter styling |
| `onRemove` | `(e: React.MouseEvent) => void` | — | If set, renders an × button |
| `icon` | `React.ReactNode` | — | Leading icon node |

### Vue

| Prop | Type | Default | Description |
|---|---|---|---|
| `selected` | `boolean` | `false` | Active-filter styling |
| `removable` | `boolean` | `false` | Render an × button that emits `remove` |

**Events:** `remove` (when the × is clicked). **Slots:** `default` (label), `icon` (leading).
A `@click` handler makes the tag interactive (adds the button hover style).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-tag` | Base pill — always required |
| `.jl-tag--button` | Interactive (cursor + hover affordance) |
| `.jl-tag--selected` | Active-filter styling |
| `.jl-tag__remove` | The × remove button |
