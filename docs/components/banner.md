# Banner

A full-width page or section announcement bar. Six tones, tinted (`subtle`) or filled
(`solid`), with an optional leading icon, title lead-in, trailing action, dismiss button,
center alignment, and sticky positioning.

> Banner is **full-width**. For an inline, card-width status callout, use
> [Alert](/components/alert).
>
> For plain-HTML dismiss, include the JLDS
> [behavior layer](/guide/vanilla-html#interactivity-optional) — clicking `.jl-banner__close`
> removes the banner automatically.

```bash
jlds add banner
```

## Usage

<Preview src="/preview/banner/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/banner.css">
<!-- behavior layer (optional): wires up the dismiss button -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/banner.js" defer></script>

<div class="jl-banner jl-banner--subtle jl-banner--info" role="status">
  <span class="jl-banner__content">
    <span class="jl-banner__title">Heads up</span>
    <span class="jl-banner__text">Scheduled maintenance this Sunday at 02:00 UTC.</span>
  </span>
  <button type="button" class="jl-banner__close" aria-label="Dismiss">
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  </button>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { Banner } from "@/components/ui/banner"
</script>

<template>
  <Banner tone="info" title="Heads up" dismissible @dismiss="shown = false">
    Scheduled maintenance this Sunday at 02:00 UTC.
  </Banner>
</template>
```

```tsx [React]
import { Banner } from "@/components/ui/banner"

<Banner tone="info" title="Heads up" onDismiss={() => setShown(false)}>
  Scheduled maintenance this Sunday at 02:00 UTC.
</Banner>
```

:::

## Tones & variants

Tones: `info` · `success` · `warning` · `danger` · `accent` · `neutral`. Variants: `subtle`
(tinted, default) or `solid` (filled).

<Preview src="/preview/banner/variants.html" />

::: code-group

```html [HTML]
<div class="jl-banner jl-banner--subtle jl-banner--accent" role="status">…</div>
<div class="jl-banner jl-banner--solid jl-banner--accent" role="status">…</div>
<div class="jl-banner jl-banner--solid jl-banner--danger" role="status">…</div>
```

```vue [Vue]
<template>
  <Banner tone="accent" variant="subtle">New: team workspaces are live.</Banner>
  <Banner tone="accent" variant="solid">New: team workspaces are live.</Banner>
  <Banner tone="danger" variant="solid">Your subscription has expired.</Banner>
</template>
```

```tsx [React]
<Banner tone="accent" variant="subtle">New: team workspaces are live.</Banner>
<Banner tone="accent" variant="solid">New: team workspaces are live.</Banner>
<Banner tone="danger" variant="solid">Your subscription has expired.</Banner>
```

:::

## With an action

Pass an `action` node (e.g. a small button) — and `align="center"` to center the content.

<Preview src="/preview/banner/action.html" />

::: code-group

```html [HTML]
<div class="jl-banner jl-banner--solid jl-banner--accent jl-banner--center" role="status">
  <span class="jl-banner__content">
    <span class="jl-banner__title">Pro trial</span>
    <span class="jl-banner__text">14 days left.</span>
  </span>
  <span class="jl-banner__action">
    <button class="jl-btn jl-btn--secondary jl-btn--sm">Upgrade</button>
  </span>
</div>
```

```vue [Vue]
<template>
  <Banner tone="accent" variant="solid" align="center" title="Pro trial">
    14 days left.
    <template #action>
      <Button variant="secondary" size="sm">Upgrade</Button>
    </template>
  </Banner>
</template>
```

```tsx [React]
<Banner
  tone="accent"
  variant="solid"
  align="center"
  title="Pro trial"
  action={<Button variant="secondary" size="sm">Upgrade</Button>}
>
  14 days left.
</Banner>
```

:::

## Props

### React

`Banner` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"info" \| "success" \| "warning" \| "danger" \| "accent" \| "neutral"` | `"info"` | Semantic color |
| `variant` | `"subtle" \| "solid"` | `"subtle"` | Tinted or filled |
| `title` | `React.ReactNode` | — | Bold lead-in before the message |
| `icon` | `React.ReactNode` | — | Leading icon node |
| `action` | `React.ReactNode` | — | Trailing action node |
| `onDismiss` | `() => void` | — | Show a dismiss × and call this on click |
| `sticky` | `boolean` | `false` | Stick to the top of the scroll container |
| `align` | `"left" \| "center"` | `"left"` | Content alignment |

### Vue

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `BannerTone` | `"info"` | Semantic color |
| `variant` | `"subtle" \| "solid"` | `"subtle"` | Tinted or filled |
| `title` | `string` | — | Bold lead-in |
| `sticky` | `boolean` | `false` | Sticky to top |
| `align` | `"left" \| "center"` | `"left"` | Content alignment |
| `dismissible` | `boolean` | `false` | Show a dismiss × that emits `dismiss` |

**Events:** `dismiss`. **Slots:** `default` (message), `icon` (leading), `action` (trailing).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-banner` | Base — always required |
| `.jl-banner--subtle` / `--solid` | Variant |
| `.jl-banner--info` / `--success` / `--warning` / `--danger` / `--accent` / `--neutral` | Tone |
| `.jl-banner--center` | Center the content |
| `.jl-banner--sticky` | Stick to the top of the scroll container |
| `.jl-banner__icon` / `__content` / `__title` / `__text` | Icon, content wrapper, title, message |
| `.jl-banner__action` / `.jl-banner__close` | Trailing action / dismiss button |
