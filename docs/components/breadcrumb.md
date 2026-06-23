# Breadcrumb

A hierarchical location trail. Pass `items` (root → current; the last renders as the current
page), choose a chevron or slash separator, and optionally collapse a long trail into an
expandable "…".

```bash
jlds add breadcrumb
```

## Usage

<Preview src="/preview/breadcrumb/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/breadcrumb.css">
<!-- behavior layer: only needed for the collapse ("…") example below -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/breadcrumb.js" defer></script>

<nav class="jl-breadcrumb" aria-label="Breadcrumb">
  <ol class="jl-breadcrumb__list">
    <li class="jl-breadcrumb__item">
      <a class="jl-breadcrumb__link" href="/">Home</a>
      <span class="jl-breadcrumb__sep" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
    </li>
    <li class="jl-breadcrumb__item">
      <a class="jl-breadcrumb__link" href="/projects">Projects</a>
      <span class="jl-breadcrumb__sep" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
    </li>
    <li class="jl-breadcrumb__item">
      <span class="jl-breadcrumb__current" aria-current="page">jlds</span>
    </li>
  </ol>
</nav>
```

```vue [Vue]
<script setup lang="ts">
import { Breadcrumb } from "@/components/ui/breadcrumb"
</script>

<template>
  <Breadcrumb
    :items="[
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'jlds' },
    ]"
  />
</template>
```

```tsx [React]
import { Breadcrumb } from "@/components/ui/breadcrumb"

<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "jlds" },
  ]}
/>
```

:::

## Slash separator

Set `separator="slash"`.

<Preview src="/preview/breadcrumb/slash.html" />

::: code-group

```html [HTML]
<nav class="jl-breadcrumb" aria-label="Breadcrumb">
  <ol class="jl-breadcrumb__list">
    <li class="jl-breadcrumb__item">
      <a class="jl-breadcrumb__link" href="/">Docs</a>
      <span class="jl-breadcrumb__sep jl-breadcrumb__sep--slash" aria-hidden="true">/</span>
    </li>
    <li class="jl-breadcrumb__item">
      <span class="jl-breadcrumb__current" aria-current="page">Components</span>
    </li>
  </ol>
</nav>
```

```vue [Vue]
<template>
  <Breadcrumb
    separator="slash"
    :items="[{ label: 'Docs', href: '/' }, { label: 'Components' }]"
  />
</template>
```

```tsx [React]
<Breadcrumb
  separator="slash"
  items={[{ label: "Docs", href: "/" }, { label: "Components" }]}
/>
```

:::

## Collapse long trails

Set `maxItems` to collapse the middle into an expandable "…" when the trail is longer.

<Preview src="/preview/breadcrumb/collapse.html" />

::: code-group

```html [HTML]
<!-- Collapsed middle items are in the DOM as .jl-breadcrumb__collapsed + [hidden].
     The behavior layer reveals them (and hides the "…") when the ellipsis is clicked. -->
<nav class="jl-breadcrumb" aria-label="Breadcrumb">
  <ol class="jl-breadcrumb__list">
    <li class="jl-breadcrumb__item">
      <a class="jl-breadcrumb__link" href="/">Home</a>
      <span class="jl-breadcrumb__sep" aria-hidden="true"><!-- chevron svg --></span>
    </li>
    <li class="jl-breadcrumb__item">
      <button class="jl-breadcrumb__ellipsis" aria-label="Show all"><!-- ⋯ svg --></button>
      <span class="jl-breadcrumb__sep" aria-hidden="true"><!-- chevron svg --></span>
    </li>
    <li class="jl-breadcrumb__item jl-breadcrumb__collapsed" hidden>
      <a class="jl-breadcrumb__link" href="/team">Team</a>
      <span class="jl-breadcrumb__sep" aria-hidden="true"><!-- chevron svg --></span>
    </li>
    <li class="jl-breadcrumb__item jl-breadcrumb__collapsed" hidden>
      <a class="jl-breadcrumb__link" href="/projects">Projects</a>
      <span class="jl-breadcrumb__sep" aria-hidden="true"><!-- chevron svg --></span>
    </li>
    <li class="jl-breadcrumb__item">
      <span class="jl-breadcrumb__current" aria-current="page">Deep page</span>
    </li>
  </ol>
</nav>
```

```vue [Vue]
<template>
  <Breadcrumb
    :max-items="3"
    :items="[
      { label: 'Home', href: '/' },
      { label: 'Team', href: '/team' },
      { label: 'Projects', href: '/projects' },
      { label: 'jlds', href: '/projects/jlds' },
      { label: 'Deep page' },
    ]"
  />
</template>
```

```tsx [React]
<Breadcrumb
  maxItems={3}
  items={[
    { label: "Home", href: "/" },
    { label: "Team", href: "/team" },
    { label: "Projects", href: "/projects" },
    { label: "jlds", href: "/projects/jlds" },
    { label: "Deep page" },
  ]}
/>
```

:::

## Props

### React

`Breadcrumb` extends `React.HTMLAttributes<HTMLElement>`. Items are
`{ label, href?, icon?, current?, onClick? }`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `BreadcrumbItemData[]` | — | Data-driven trail, root → current |
| `separator` | `"chevron" \| "slash"` | `"chevron"` | Separator style |
| `maxItems` | `number` | `0` | Collapse middle into "…" above this count (0 disables) |

You can also compose `Breadcrumb.Item` children instead of passing `items`.

### Vue

`Breadcrumb` takes `items` (`{ label, href?, current? }`), `separator`, and `maxItems`.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-breadcrumb` / `.jl-breadcrumb__list` / `.jl-breadcrumb__item` | Nav, list, item |
| `.jl-breadcrumb__link` | A linked ancestor |
| `.jl-breadcrumb__current` | The current page (last item) |
| `.jl-breadcrumb__sep` / `--slash` | Separator (chevron icon / slash) |
| `.jl-breadcrumb__ellipsis` | The collapse "…" button |
| `.jl-breadcrumb__collapsed` | Middle items hidden until expanded (set `hidden`; the behavior layer reveals them) |
