# App Shell

An opinionated product layout: a fixed-width sidebar slot, a sticky header slot, and a scrolling
content area. Below `mobileBreakpoint` the sidebar becomes an overlay drawer toggled by
`AppShell.MenuButton`. Drop a [Sidebar](/components/sidebar) into the sidebar slot and a
[Page Header](/components/page-header) into the header.

```bash
jlds add app-shell
```

## Usage

Resize the frame narrow to see the sidebar collapse into a drawer.

<Preview src="/preview/app-shell/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/app-shell.css">
<!-- behavior layer: responsive drawer -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/app-shell.js" defer></script>

<div class="jl-appshell" data-mobile-breakpoint="880">
  <div class="jl-appshell__aside"><!-- sidebar --></div>
  <div class="jl-appshell__backdrop" aria-hidden="true"></div>
  <div class="jl-appshell__main">
    <div class="jl-appshell__header">
      <button type="button" class="jl-appshell__menubtn" aria-label="Open navigation"><!-- menu svg --></button>
      <!-- header content -->
    </div>
    <div class="jl-appshell__content jl-appshell__content--padded"><!-- page --></div>
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { AppShell, AppShellMenuButton } from "@/components/ui/app-shell"
import { Sidebar } from "@/components/ui/sidebar"
</script>

<template>
  <AppShell padded>
    <template #sidebar><Sidebar><!-- … --></Sidebar></template>
    <template #header>
      <div class="hdr"><AppShellMenuButton /><h1>Dashboard</h1></div>
    </template>
    <!-- page content -->
  </AppShell>
</template>
```

```tsx [React]
import { AppShell } from "@/components/ui/app-shell"
import { Sidebar } from "@/components/ui/sidebar"

<AppShell
  padded
  sidebar={<Sidebar>{/* … */}</Sidebar>}
  header={<div className="hdr"><AppShell.MenuButton /><h1>Dashboard</h1></div>}
>
  {/* page content */}
</AppShell>
```

:::

The mobile drawer is uncontrolled by default. In HTML, include the `.jl-appshell__backdrop` element
and a `.jl-appshell__menubtn` inside the header; the behavior toggles `data-open` and adds
`data-mobile` below the `data-mobile-breakpoint`.

## Props

### React

`AppShell` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `sidebar` | `React.ReactNode` | — | Sidebar slot content |
| `header` | `React.ReactNode` | — | Header slot content |
| `padded` | `boolean` | `false` | Pad the content area |
| `fullHeight` | `boolean` | `true` | Fill the viewport (`100dvh`) |
| `mobileBreakpoint` | `number` | `880` | Max width (px) for drawer mode |
| `mobileOpen` | `boolean` | — | Controlled drawer open state |
| `defaultMobileOpen` | `boolean` | `false` | Uncontrolled initial drawer state |
| `onMobileOpenChange` | `(open: boolean) => void` | — | Fires on drawer toggle |

`AppShell.MenuButton` renders the drawer toggle (hidden on desktop) — place it in your header.

### Vue

Same options. `sidebar`, `header`, and the page are slots (`#sidebar`, `#header`, default).
`mobileOpen` is a `v-model` (`v-model:mobileOpen`). Use `AppShellMenuButton` inside the header slot.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-appshell` + `[data-mobile]` / `[data-open]` | Root and its responsive/drawer state |
| `.jl-appshell__aside` | Sidebar slot (becomes an overlay drawer on mobile) |
| `.jl-appshell__backdrop` | Drawer scrim (mobile only) |
| `.jl-appshell__main` / `__header` / `__content` (+ `--padded`) | The main column |
| `.jl-appshell__menubtn` | Drawer toggle, shown only in mobile mode |
