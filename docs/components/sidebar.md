# Sidebar

An app navigation rail. Compose it from `Sidebar.Header`, `Sidebar.Body` (the scrollable region of
`Sidebar.Group`s and `Sidebar.Item`s), and `Sidebar.Footer`. Pass `collapsed` to shrink it to an
icon rail. Usually rendered into [AppShell](/components/app-shell)'s sidebar slot.

```bash
jlds add sidebar
```

## Usage

<Preview src="/preview/sidebar/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/sidebar.css">

<aside class="jl-sidebar">
  <div class="jl-sidebar__header"><!-- brand --></div>
  <nav class="jl-sidebar__body">
    <div class="jl-sidebar__group">
      <button type="button" class="jl-sidebar__item" data-active="true">
        <span class="jl-sidebar__item-icon"><!-- svg --></span>
        <span class="jl-sidebar__item-label">Home</span>
      </button>
      <button type="button" class="jl-sidebar__item">
        <span class="jl-sidebar__item-icon"><!-- svg --></span>
        <span class="jl-sidebar__item-label">Projects</span>
        <span class="jl-sidebar__item-badge">12</span>
      </button>
    </div>
  </nav>
  <div class="jl-sidebar__footer"><!-- … --></div>
</aside>
```

```vue [Vue]
<script setup lang="ts">
import {
  Sidebar, SidebarHeader, SidebarBody, SidebarGroup, SidebarItem, SidebarFooter,
} from "@/components/ui/sidebar"
</script>

<template>
  <Sidebar>
    <SidebarHeader><!-- brand --></SidebarHeader>
    <SidebarBody>
      <SidebarGroup>
        <SidebarItem label="Home" active><template #icon><HomeIcon /></template></SidebarItem>
        <SidebarItem label="Projects" :badge="12"><template #icon><ListIcon /></template></SidebarItem>
      </SidebarGroup>
      <SidebarGroup label="Account">
        <SidebarItem label="Settings"><template #icon><GearIcon /></template></SidebarItem>
      </SidebarGroup>
    </SidebarBody>
    <SidebarFooter><!-- … --></SidebarFooter>
  </Sidebar>
</template>
```

```tsx [React]
import { Sidebar } from "@/components/ui/sidebar"

<Sidebar>
  <Sidebar.Header>{/* brand */}</Sidebar.Header>
  <Sidebar.Body>
    <Sidebar.Group>
      <Sidebar.Item icon={<HomeIcon />} label="Home" active />
      <Sidebar.Item icon={<ListIcon />} label="Projects" badge={12} />
    </Sidebar.Group>
    <Sidebar.Group label="Account">
      <Sidebar.Item icon={<GearIcon />} label="Settings" />
    </Sidebar.Group>
  </Sidebar.Body>
  <Sidebar.Footer>{/* … */}</Sidebar.Footer>
</Sidebar>
```

:::

## Collapsed

Set `collapsed` (HTML: `data-collapsed="true"`) to shrink to an icon rail — labels hide, badges
become a dot, and each item shows a `title` tooltip. Drive it from your app (e.g. a toggle in
[AppShell](/components/app-shell)).

<Preview src="/preview/sidebar/collapsed.html" />

::: code-group

```html [HTML]
<aside class="jl-sidebar" data-collapsed="true">
  <!-- same markup; add title="…" to items for tooltips -->
</aside>
```

```vue [Vue]
<template>
  <Sidebar :collapsed="true">…</Sidebar>
</template>
```

```tsx [React]
<Sidebar collapsed>…</Sidebar>
```

:::

## Props

### React

`Sidebar` extends `React.HTMLAttributes<HTMLElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `collapsed` | `boolean` | `false` | Shrink to an icon rail |
| `width` | `number \| string` | `260` | Expanded width |
| `collapsedWidth` | `number \| string` | `68` | Collapsed width |

`Sidebar.Group` takes `label`. `Sidebar.Item` props: `icon`, `label`, `active`, `badge`,
`trailing`, `href` (renders an `<a>`), `disabled`, `title`.

### Vue

Same options, as separate components: `Sidebar`, `SidebarHeader`, `SidebarBody`, `SidebarGroup`,
`SidebarItem`, `SidebarFooter`. `SidebarItem` takes `label`, `active`, `badge`, `href`, `disabled`,
`title` props plus `icon` / `trailing` slots. The collapsed state is shared via provide/inject so
items render their tooltips automatically.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-sidebar` + `[data-collapsed="true"]` | The rail and its collapsed state |
| `.jl-sidebar__header` / `__body` / `__footer` | The three regions (body scrolls) |
| `.jl-sidebar__group` + `__group-label` | A labelled group of items |
| `.jl-sidebar__item` + `[data-active="true"]` | A nav item and its active state |
| `.jl-sidebar__item-icon` / `-label` / `-badge` / `-trail` | Item parts |
