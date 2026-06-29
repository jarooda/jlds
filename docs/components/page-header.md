# Page Header

The standard top-of-page block: an optional breadcrumb, a title with optional eyebrow, icon, back
button, and description, trailing actions, and a tab row pinned to the bottom edge. `surface`
(card background with a divider) or `plain`, and optionally `sticky`.

```bash
jlds add page-header
```

## Usage

Compose it from other JLDS pieces — [Breadcrumb](/components/breadcrumb) above, [Button](/components/button)s
in `actions`.

<Preview src="/preview/page-header/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/page-header.css">

<header class="jl-pageheader jl-pageheader--surface">
  <div class="jl-pageheader__crumb"><!-- breadcrumb --></div>
  <div class="jl-pageheader__bar">
    <span class="jl-pageheader__icon"><!-- icon svg --></span>
    <div class="jl-pageheader__heading">
      <div class="jl-pageheader__eyebrow">Workspace</div>
      <div class="jl-pageheader__titlerow"><h1 class="jl-pageheader__title">Acme App</h1></div>
      <p class="jl-pageheader__desc">Manage your project settings.</p>
    </div>
    <div class="jl-pageheader__actions"><!-- buttons --></div>
  </div>
</header>
```

```vue [Vue]
<script setup lang="ts">
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
</script>

<template>
  <PageHeader title="Acme App" eyebrow="Workspace"
    description="Manage your project settings.">
    <template #breadcrumb><!-- breadcrumb --></template>
    <template #icon><LayersIcon /></template>
    <template #actions>
      <Button variant="ghost">Share</Button>
      <Button variant="primary">New deploy</Button>
    </template>
  </PageHeader>
</template>
```

```tsx [React]
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"

<PageHeader
  title="Acme App"
  eyebrow="Workspace"
  description="Manage your project settings."
  icon={<LayersIcon />}
  breadcrumb={/* … */}
  actions={<><Button variant="ghost">Share</Button><Button variant="primary">New deploy</Button></>}
/>
```

:::

## With back button and tabs

Pass a `back` button (`onBack` in React, the `back` prop in Vue / a `.jl-pageheader__back` in HTML)
and a `tabs` row that pins flush to the bottom edge.

<Preview src="/preview/page-header/tabs.html" />

::: code-group

```html [HTML]
<header class="jl-pageheader jl-pageheader--surface">
  <div class="jl-pageheader__bar">
    <div class="jl-pageheader__lead">
      <button type="button" class="jl-pageheader__back" aria-label="Go back"><!-- arrow svg --></button>
    </div>
    <div class="jl-pageheader__heading">
      <div class="jl-pageheader__titlerow"><h1 class="jl-pageheader__title">Billing</h1></div>
    </div>
  </div>
  <div class="jl-pageheader__tabs"><!-- .jl-tabs … --></div>
</header>
```

```vue [Vue]
<template>
  <PageHeader title="Billing" back sticky @back="goBack">
    <template #tabs><Tabs … /></template>
  </PageHeader>
</template>
```

```tsx [React]
<PageHeader title="Billing" sticky onBack={goBack} tabs={<Tabs … />} />
```

:::

## Props

### React

`PageHeader` extends `React.HTMLAttributes<HTMLElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `React.ReactNode` | — | Main heading |
| `description` | `React.ReactNode` | — | Subtitle paragraph |
| `eyebrow` | `React.ReactNode` | — | Small uppercase label above the title |
| `icon` | `React.ReactNode` | — | Leading icon tile |
| `breadcrumb` | `React.ReactNode` | — | Breadcrumb row above the bar |
| `actions` | `React.ReactNode` | — | Trailing action buttons |
| `tabs` | `React.ReactNode` | — | Tab row pinned to the bottom edge |
| `leading` | `React.ReactNode` | — | Extra content before the heading |
| `onBack` | `() => void` | — | Renders a back button when provided |
| `sticky` | `boolean` | `false` | Stick to the top with a blur backdrop |
| `variant` | `"surface" \| "plain"` | `"surface"` | Card background or transparent |
| `as` | `React.ElementType` | `"header"` | Root element tag |

### Vue

Same layout. `title`, `description`, `eyebrow` are string props (or same-named slots); `breadcrumb`,
`icon`, `actions`, `tabs`, `leading` are slots. Set the `back` prop to show the back button and
listen with `@back`. The default slot adds content into the title row.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-pageheader` + `--surface` / `--plain` / `--sticky` | Root and variants |
| `.jl-pageheader__crumb` | Breadcrumb row |
| `.jl-pageheader__bar` | The main title/actions row |
| `.jl-pageheader__lead` / `__back` | Leading slot and back button |
| `.jl-pageheader__icon` | Leading icon tile |
| `.jl-pageheader__heading` / `__eyebrow` / `__titlerow` / `__title` / `__desc` | Heading block parts |
| `.jl-pageheader__actions` | Trailing actions |
| `.jl-pageheader__tabs` | Bottom-pinned tab row |
