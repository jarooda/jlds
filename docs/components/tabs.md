# Tabs

A horizontal section switcher — underline (`line`) or `pill` style, with optional icons and
count badges. The React/Vue component is the **tab strip only** (controlled); you render the
active panel yourself. In plain HTML, the behavior layer also toggles panels via `aria-controls`.

```bash
jlds add tabs
```

## Usage

<Preview src="/preview/tabs/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/tabs.css">
<!-- behavior layer: tab selection + panel toggling + arrow keys -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/tabs.js" defer></script>

<div class="jl-tabs jl-tabs--line" role="tablist">
  <button type="button" role="tab" class="jl-tab" aria-selected="true" aria-controls="p-overview">Overview</button>
  <button type="button" role="tab" class="jl-tab" aria-selected="false" aria-controls="p-activity">Activity</button>
  <button type="button" role="tab" class="jl-tab" aria-selected="false" aria-controls="p-settings">Settings</button>
</div>
<div id="p-overview" role="tabpanel">Overview panel</div>
<div id="p-activity" role="tabpanel" hidden>Activity panel</div>
<div id="p-settings" role="tabpanel" hidden>Settings panel</div>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Tabs } from "@/components/ui/tabs"

const tab = ref("overview")
</script>

<template>
  <Tabs
    v-model="tab"
    :items="[
      { value: 'overview', label: 'Overview' },
      { value: 'activity', label: 'Activity' },
      { value: 'settings', label: 'Settings' },
    ]"
  />
  <div v-if="tab === 'overview'">Overview panel</div>
  <div v-else-if="tab === 'activity'">Activity panel</div>
  <div v-else>Settings panel</div>
</template>
```

```tsx [React]
import { useState } from "react"
import { Tabs } from "@/components/ui/tabs"

const [tab, setTab] = useState("overview")

<Tabs
  value={tab}
  onChange={setTab}
  items={[
    { value: "overview", label: "Overview" },
    { value: "activity", label: "Activity" },
    { value: "settings", label: "Settings" },
  ]}
/>
{tab === "overview" && <div>Overview panel</div>}
```

:::

## Pill variant

`variant="pill"` for a segmented, background-filled style.

<Preview src="/preview/tabs/pill.html" />

::: code-group

```html [HTML]
<div class="jl-tabs jl-tabs--pill" role="tablist">
  <button type="button" role="tab" class="jl-tab" aria-selected="true">All</button>
  <button type="button" role="tab" class="jl-tab" aria-selected="false">Active</button>
  <button type="button" role="tab" class="jl-tab" aria-selected="false">Archived</button>
</div>
```

```vue [Vue]
<template>
  <Tabs v-model="tab" variant="pill" :items="['All', 'Active', 'Archived']" />
</template>
```

```tsx [React]
<Tabs value={tab} onChange={setTab} variant="pill" items={["All", "Active", "Archived"]} />
```

:::

## Count badges

Pass `count` on an item for a trailing badge.

<Preview src="/preview/tabs/counts.html" />

::: code-group

```html [HTML]
<button type="button" role="tab" class="jl-tab" aria-selected="true">
  Inbox <span class="jl-tab__count">12</span>
</button>
```

```vue [Vue]
<template>
  <Tabs
    v-model="tab"
    :items="[
      { value: 'inbox', label: 'Inbox', count: 12 },
      { value: 'sent', label: 'Sent' },
      { value: 'spam', label: 'Spam', count: 3 },
    ]"
  />
</template>
```

```tsx [React]
<Tabs
  value={tab}
  onChange={setTab}
  items={[
    { value: "inbox", label: "Inbox", count: 12 },
    { value: "sent", label: "Sent" },
    { value: "spam", label: "Spam", count: 3 },
  ]}
/>
```

:::

## Props

### React

`Tabs` extends `React.HTMLAttributes<HTMLDivElement>` (minus `onChange`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `(string \| { value, label, icon?, count? })[]` | — | The tabs |
| `value` | `string` | — | Active tab value (controlled) |
| `onChange` | `(value: string) => void` | — | Fires with the selected value |
| `variant` | `"line" \| "pill"` | `"line"` | Underline or pill style |

### Vue

Same options. Use `v-model` for the value; also emits `change`.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-tabs` | The strip (`role="tablist"`) |
| `.jl-tabs--line` / `--pill` | Variant |
| `.jl-tab` | A tab (`role="tab"` + `aria-selected`; `aria-controls` pairs it with a panel) |
| `.jl-tab__count` | Trailing count badge |

In HTML, give each tab `aria-controls="panelId"` and each panel a matching `id` (+ `role="tabpanel"`,
`hidden` on inactive ones) — the behavior layer shows/hides them and handles arrow-key navigation.
