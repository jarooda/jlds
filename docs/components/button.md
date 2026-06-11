# Button

A versatile, self-contained button. Five variants, three sizes, optional leading/trailing
icons (React) or icon slots (Vue).

```bash
jlds add button
```

## Usage

<Preview src="/preview/button/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/button.css">

<button class="jl-btn jl-btn--primary jl-btn--md">Click me</button>
```

```vue [Vue]
<script setup lang="ts">
import { Button } from "@/components/ui/button"
</script>

<template>
  <Button variant="primary" size="md">Click me</Button>
</template>
```

```tsx [React]
import { Button } from "@/components/ui/button"

<Button variant="primary" size="md">Click me</Button>
```

:::

## Variants

`primary` · `secondary` · `ghost` · `subtle` · `danger`

<Preview src="/preview/button/variants.html" />

::: code-group

```html [HTML]
<button class="jl-btn jl-btn--primary jl-btn--md">Primary</button>
<button class="jl-btn jl-btn--secondary jl-btn--md">Secondary</button>
<button class="jl-btn jl-btn--ghost jl-btn--md">Ghost</button>
<button class="jl-btn jl-btn--subtle jl-btn--md">Subtle</button>
<button class="jl-btn jl-btn--danger jl-btn--md">Danger</button>
```

```vue [Vue]
<template>
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="subtle">Subtle</Button>
  <Button variant="danger">Danger</Button>
</template>
```

```tsx [React]
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="subtle">Subtle</Button>
<Button variant="danger">Danger</Button>
```

:::

## Sizes

`sm` (32px) · `md` (38px, default) · `lg` (44px)

<Preview src="/preview/button/sizes.html" />

::: code-group

```html [HTML]
<button class="jl-btn jl-btn--primary jl-btn--sm">Small</button>
<button class="jl-btn jl-btn--primary jl-btn--md">Medium</button>
<button class="jl-btn jl-btn--primary jl-btn--lg">Large</button>
```

```vue [Vue]
<template>
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</template>
```

```tsx [React]
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

:::

## Full width

Add `fullWidth` (React/Vue prop) or the `jl-btn--block` class (HTML) to make the button fill
its container.

<Preview src="/preview/button/full-width.html" />

::: code-group

```html [HTML]
<button class="jl-btn jl-btn--primary jl-btn--md jl-btn--block">Full width</button>
```

```vue [Vue]
<template>
  <Button full-width>Full width</Button>
</template>
```

```tsx [React]
<Button fullWidth>Full width</Button>
```

:::

## Icons

<Preview src="/preview/button/icons.html" />

::: code-group

```html [HTML]
<button class="jl-btn jl-btn--primary jl-btn--md">
  <svg ...>...</svg>
  <span>Add item</span>
</button>
```

```vue [Vue]
<template>
  <Button>
    <template #icon><Plus /></template>
    Add item
  </Button>
  <Button>
    Continue
    <template #trailing-icon><ArrowRight /></template>
  </Button>
</template>
```

```tsx [React]
import { Plus, ArrowRight } from "lucide-react"

<Button icon={<Plus />}>Add item</Button>
<Button trailingIcon={<ArrowRight />}>Continue</Button>
```

:::

## Props

### React

`Button` extends `React.ButtonHTMLAttributes<HTMLButtonElement>` (so `onClick`, `disabled`,
`className`, etc. all pass through).

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "subtle" \| "danger"` | `"primary"` | Visual style |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Control height, padding, and font size |
| `icon` | `React.ReactNode` | — | Leading icon, rendered before the label |
| `trailingIcon` | `React.ReactNode` | — | Trailing icon, rendered after the label |
| `fullWidth` | `boolean` | `false` | Stretch to fill the parent's width |
| `as` | `"button" \| "a"` | `"button"` | Render as a `<button>` or `<a>` |

### Vue

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "subtle" \| "danger"` | `"primary"` | Visual style |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Control height, padding, and font size |
| `fullWidth` | `boolean` | `false` | Stretch to fill the parent's width |
| `disabled` | `boolean` | `false` | Disable the button |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Native `<button>` type |

**Slots:** `default` (label), `icon` (leading), `trailing-icon` (trailing).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-btn` | Base class — always required |
| `.jl-btn--primary` / `--secondary` / `--ghost` / `--subtle` / `--danger` | Variant |
| `.jl-btn--sm` / `--md` / `--lg` | Size |
| `.jl-btn--block` | Full width |
