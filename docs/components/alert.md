# Alert

An inline callout for status messaging — info, success, warning, or danger. Ships a default
tone icon (override with your own), an optional bold title, and an optional dismiss button.

> Alert is **inline / card-width**. For a full-width page or section announcement bar, use
> [Banner](/components/banner).

```bash
jlds add alert
```

## Usage

<Preview src="/preview/alert/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/alert.css">
<!-- behavior layer (optional): wires up the dismiss button -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/alert.js" defer></script>

<div class="jl-alert jl-alert--info" role="status">
  <span class="jl-alert__icon">
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" opacity="0.35" />
      <path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </span>
  <div class="jl-alert__body">
    <div class="jl-alert__text">A new deploy is available for this project.</div>
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { Alert } from "@/components/ui/alert"
</script>

<template>
  <Alert tone="info">A new deploy is available for this project.</Alert>
</template>
```

```tsx [React]
import { Alert } from "@/components/ui/alert"

<Alert tone="info">A new deploy is available for this project.</Alert>
```

:::

## Tones

`info` (default) · `success` · `warning` · `danger`. Each has a matching default icon.

<Preview src="/preview/alert/tones.html" />

::: code-group

```html [HTML]
<div class="jl-alert jl-alert--success" role="status">…</div>
<div class="jl-alert jl-alert--warning" role="status">…</div>
<div class="jl-alert jl-alert--danger" role="status">…</div>
```

```vue [Vue]
<template>
  <Alert tone="success">Build #1843 deployed to production.</Alert>
  <Alert tone="warning">Your plan's build minutes are almost used up.</Alert>
  <Alert tone="danger">The last deploy failed. Check the build logs.</Alert>
</template>
```

```tsx [React]
<Alert tone="success">Build #1843 deployed to production.</Alert>
<Alert tone="warning">Your plan's build minutes are almost used up.</Alert>
<Alert tone="danger">The last deploy failed. Check the build logs.</Alert>
```

:::

## Title & dismiss

Add a `title` for a bold lead line. In React pass `onClose` to show the dismiss ×; in Vue set
`dismissible` and listen for `close`. In plain HTML, include the JLDS
[behavior layer](/guide/vanilla-html#interactivity-optional) and clicking `.jl-alert__close`
removes the alert automatically.

<Preview src="/preview/alert/title.html" />

::: code-group

```html [HTML]
<div class="jl-alert jl-alert--warning" role="status">
  <span class="jl-alert__icon">
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" opacity="0.35" />
      <path d="M12 8.5v4M12 16h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </svg>
  </span>
  <div class="jl-alert__body">
    <div class="jl-alert__title">Approaching your limit</div>
    <div class="jl-alert__text">You've used 90% of this month's build minutes.</div>
  </div>
  <button type="button" class="jl-alert__close" aria-label="Dismiss">
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  </button>
</div>
```

```vue [Vue]
<template>
  <Alert tone="warning" title="Approaching your limit" dismissible @close="dismissed = true">
    You've used 90% of this month's build minutes.
  </Alert>
</template>
```

```tsx [React]
<Alert tone="warning" title="Approaching your limit" onClose={() => setShown(false)}>
  You've used 90% of this month's build minutes.
</Alert>
```

:::

## With action

Pass an `action` node (React) or an `action` slot (Vue) for buttons under the body — parity with
`Banner`.

<Preview src="/preview/alert/action.html" />

::: code-group

```html [HTML]
<div class="jl-alert jl-alert--warning" role="status">
  <span class="jl-alert__icon">…</span>
  <div class="jl-alert__body">
    <div class="jl-alert__title">Your trial ends in 3 days</div>
    <div class="jl-alert__text">Upgrade to keep your environments running.</div>
    <div class="jl-alert__action">
      <button class="jl-btn jl-btn--primary jl-btn--sm">Upgrade</button>
    </div>
  </div>
</div>
```

```vue [Vue]
<template>
  <Alert tone="warning" title="Your trial ends in 3 days">
    Upgrade to keep your environments running.
    <template #action>
      <Button size="sm" variant="primary">Upgrade</Button>
    </template>
  </Alert>
</template>
```

```tsx [React]
<Alert tone="warning" title="Your trial ends in 3 days" action={<Button size="sm" variant="primary">Upgrade</Button>}>
  Upgrade to keep your environments running.
</Alert>
```

:::

## Props

### React

`Alert` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"info" \| "success" \| "warning" \| "danger"` | `"info"` | Semantic tone (sets color + default icon) |
| `title` | `React.ReactNode` | — | Bold title line |
| `icon` | `React.ReactNode` | — | Override the default tone icon |
| `action` | `React.ReactNode` | — | Action node(s) under the body |
| `onClose` | `() => void` | — | If set, shows a dismiss button |

### Vue

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"info" \| "success" \| "warning" \| "danger"` | `"info"` | Semantic tone |
| `title` | `string` | — | Bold title line |
| `dismissible` | `boolean` | `false` | Show a dismiss × that emits `close` |

**Events:** `close`. **Slots:** `default` (body text), `icon` (override the tone icon), `action`
(buttons under the body).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-alert` | Base — always required |
| `.jl-alert--info` / `--success` / `--warning` / `--danger` | Tone |
| `.jl-alert__icon` | Leading icon slot |
| `.jl-alert__body` / `__title` / `__text` | Text column, title, body |
| `.jl-alert__action` | Action row under the body |
| `.jl-alert__close` | Dismiss button |
