# Rating

A row of stars for capturing or displaying a 0–`max` score. Interactive by default with hover
preview and keyboard control; set `readOnly` to show a fixed score (optionally with a value/count
label), or `allowHalf` for half-star precision.

```bash
jlds add rating
```

## Interactive

Hover to preview, click to set, arrow keys to nudge. The HTML version is driven by `rating.js`;
React/Vue carry their own behavior.

<Preview src="/preview/rating/interactive.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/rating.css">
<!-- behavior layer: hover/click/keyboard -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/rating.js" defer></script>

<span class="jl-rating" data-value="3" role="slider" aria-label="Rating">
  <span class="jl-rating__stars">
    <button type="button" class="jl-rating__btn" data-fill="full" aria-label="1 star">
      <span class="jl-rating__star" style="position:relative;width:20px;height:20px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="position:absolute;inset:0"><path d="m12 3.2 2.7 5.5 6 .9-4.35 4.24 1.03 6L12 17.1 6.62 19.84l1.03-6L3.3 9.6l6-.9Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
        <svg class="jl-rating__fg jl-rating__fill" width="20" height="20" viewBox="0 0 24 24" style="position:absolute;inset:0"><path d="m12 3.2 2.7 5.5 6 .9-4.35 4.24 1.03 6L12 17.1 6.62 19.84l1.03-6L3.3 9.6l6-.9Z" fill="currentColor"/></svg>
      </span>
    </button>
    <!-- one .jl-rating__btn per star; data-fill is full | half | empty -->
  </span>
</span>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Rating } from "@/components/ui/rating"
const score = ref(3)
</script>

<template>
  <Rating v-model="score" />
</template>
```

```tsx [React]
import { useState } from "react"
import { Rating } from "@/components/ui/rating"

const [score, setScore] = useState(3)
<Rating value={score} onChange={setScore} />
```

:::

Add `data-allow-half="true"` (HTML) / `allowHalf` (React/Vue) for half-star clicks.

## Read-only with value

`readOnly` locks the score; `showValue` appends the number and an optional `count` of ratings.
Set `tone` to recolour the stars.

<Preview src="/preview/rating/readonly.html" />

::: code-group

```html [HTML]
<span class="jl-rating" data-tone="warning" data-readonly="true" role="img" aria-label="Rating: 4.5 of 5">
  <span class="jl-rating__stars">
    <!-- four data-fill="full" stars + one data-fill="half" -->
  </span>
  <span class="jl-rating__value">4.5<span class="jl-rating__count"> (1,284)</span></span>
</span>
```

```vue [Vue]
<template>
  <Rating :model-value="4.5" read-only allow-half show-value tone="warning" :count="1284" />
</template>
```

```tsx [React]
<Rating value={4.5} readOnly allowHalf showValue tone="warning" count={1284} />
```

:::

## Props

### React

`Rating` extends `React.HTMLAttributes<HTMLSpanElement>` (minus `onChange` / `defaultValue`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Controlled score |
| `defaultValue` | `number` | `0` | Uncontrolled initial score |
| `onChange` | `(value: number) => void` | — | Fires on select |
| `max` | `number` | `5` | Number of stars |
| `allowHalf` | `boolean` | `false` | Allow half-star values |
| `readOnly` | `boolean` | `false` | Display-only (no interaction) |
| `disabled` | `boolean` | `false` | Dim and disable |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Star size |
| `tone` | `"accent" \| "warning" \| "danger" \| "neutral"` | `"accent"` | Fill colour |
| `showValue` | `boolean` | `false` | Append the numeric value |
| `count` | `number` | — | Rating count shown after the value |

### Vue

Same options. `value`/`onChange` become **`v-model`** (plus a `@change` emit); pass `aria-label`
via the `ariaLabel` prop.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-rating` + `[data-value]` | Host and current score |
| `[data-tone]` / `[data-readonly]` / `[data-disabled]` / `[data-allow-half]` | Tone and mode flags |
| `.jl-rating__stars` | Star row |
| `.jl-rating__btn[data-fill]` | One star; `data-fill` is `full` / `half` / `empty` |
| `.jl-rating__star` / `__fg` / `__fill` | The stacked outline + clipped fill glyphs |
| `.jl-rating__value` / `__count` | Optional numeric label and count |
