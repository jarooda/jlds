# Spinner

An indeterminate circular loading indicator. It inherits the current text color by default,
so it sits naturally inside buttons and other controls.

```bash
jlds add spinner
```

## Usage

<Preview src="/preview/spinner/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/spinner.css">

<span class="jl-spinner" role="status" aria-label="Loading">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle class="jl-spinner__track" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
  </svg>
</span>
```

```vue [Vue]
<script setup lang="ts">
import { Spinner } from "@/components/ui/spinner"
</script>

<template>
  <Spinner />
</template>
```

```tsx [React]
import { Spinner } from "@/components/ui/spinner"

<Spinner />
```

:::

## Sizes

`sm` (16px) · `md` (20px, default) · `lg` (28px). You can also pass a pixel number.

<Preview src="/preview/spinner/sizes.html" />

::: code-group

```html [HTML]
<span class="jl-spinner">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle class="jl-spinner__track" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
  </svg>
</span>
<!-- repeat with width/height 20 and 28 -->
```

```vue [Vue]
<template>
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
  <Spinner :size="40" />
</template>
```

```tsx [React]
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size={40} />
```

:::

## Tones

By default the spinner inherits the current text color. Set `tone` to override — `neutral`
for a muted gray, or `white` for use on colored backgrounds.

<Preview src="/preview/spinner/tones.html" />

::: code-group

```html [HTML]
<!-- tone is just a color: set it via inline style or a parent's color -->
<span class="jl-spinner" style="color: var(--neutral-400)"> ... </span>
```

```vue [Vue]
<template>
  <Spinner tone="inherit" />
  <Spinner tone="neutral" />
  <Spinner tone="white" />
</template>
```

```tsx [React]
<Spinner tone="inherit" />
<Spinner tone="neutral" />
<Spinner tone="white" />
```

:::

## Props

### React

`Spinner` extends `React.HTMLAttributes<HTMLSpanElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg" \| number` | `"md"` | Named size or pixel number |
| `tone` | `"inherit" \| "neutral" \| "white"` | — | Color override (defaults to current text color) |

### Vue

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg" \| number` | `"md"` | Named size or pixel number |
| `tone` | `"inherit" \| "neutral" \| "white"` | — | Color override (defaults to current text color) |

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-spinner` | Base wrapper — sets the accent color and the spin animation |
| `.jl-spinner__track` | The faint background ring |

For plain HTML, control the size with the `<svg>` `width`/`height` and the color via the
element's `color` (or a parent's).
