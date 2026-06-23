# Segmented Control

A compact single-select toggle for 2–5 mutually exclusive options (views, ranges, modes). The
selected thumb slides between options. For long or many options, use [Select](/components/select)
or [Radio Group](/components/radio-group) instead.

```bash
jlds add segmented-control
```

## Usage

<Preview src="/preview/segmented-control/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/segmented-control.css">
<!-- behavior layer: selection + sliding thumb -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/segmented-control.js" defer></script>

<div class="jl-segmented" role="radiogroup" aria-label="View">
  <span class="jl-segmented__thumb" aria-hidden="true"></span>
  <button type="button" role="radio" class="jl-segmented__option" data-value="list" aria-checked="true">List</button>
  <button type="button" role="radio" class="jl-segmented__option" data-value="board" aria-checked="false">Board</button>
  <button type="button" role="radio" class="jl-segmented__option" data-value="calendar" aria-checked="false">Calendar</button>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { SegmentedControl } from "@/components/ui/segmented-control"

const view = ref("list")
</script>

<template>
  <SegmentedControl
    v-model="view"
    :options="['List', 'Board', 'Calendar']"
    aria-label="View"
  />
</template>
```

```tsx [React]
import { useState } from "react"
import { SegmentedControl } from "@/components/ui/segmented-control"

const [view, setView] = useState("List")

<SegmentedControl
  value={view}
  onChange={setView}
  options={["List", "Board", "Calendar"]}
  aria-label="View"
/>
```

:::

## Sizes

`sm` · `md` (default)

<Preview src="/preview/segmented-control/sizes.html" />

::: code-group

```html [HTML]
<div class="jl-segmented jl-segmented--sm" role="radiogroup">…</div>
<div class="jl-segmented" role="radiogroup">…</div>
```

```vue [Vue]
<template>
  <SegmentedControl size="sm" :options="['Day', 'Week', 'Month']" />
  <SegmentedControl size="md" :options="['Day', 'Week', 'Month']" />
</template>
```

```tsx [React]
<SegmentedControl size="sm" options={["Day", "Week", "Month"]} />
<SegmentedControl size="md" options={["Day", "Week", "Month"]} />
```

:::

## Full width

Add `fullWidth` (React/Vue) or `jl-segmented--full` (HTML) to stretch and share width equally.

<Preview src="/preview/segmented-control/fullwidth.html" />

::: code-group

```html [HTML]
<div class="jl-segmented jl-segmented--full" role="radiogroup">…</div>
```

```vue [Vue]
<template>
  <SegmentedControl full-width :options="['Monthly', 'Yearly']" />
</template>
```

```tsx [React]
<SegmentedControl fullWidth options={["Monthly", "Yearly"]} />
```

:::

## Props

### React

`SegmentedControl` extends `React.HTMLAttributes<HTMLDivElement>` (minus `onChange`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `(string \| { value, label?, icon?, disabled? })[]` | — | The options |
| `value` | `string` | — | Controlled selected value |
| `defaultValue` | `string` | first option | Uncontrolled initial value |
| `size` | `"sm" \| "md"` | `"md"` | Control height |
| `fullWidth` | `boolean` | `false` | Stretch, options share width |
| `onChange` | `(value: string) => void` | — | Fires with the new value |

### Vue

Same options. Use `v-model` for the value; also emits `change`.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-segmented` | Track — always required (`role="radiogroup"`) |
| `.jl-segmented--sm` | Smaller size |
| `.jl-segmented--full` | Full width, equal-width options |
| `.jl-segmented__thumb` | The sliding indicator (positioned by the behavior layer) |
| `.jl-segmented__option` | An option (`role="radio"` + `aria-checked`; `data-value` feeds the change event) |
