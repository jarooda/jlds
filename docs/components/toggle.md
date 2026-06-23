# Toggle

A single pressable on/off button — text and/or icon. `ToggleGroup` arranges several into a
segmented (`attached`) or `spaced` row with single- or multiple-select.

> A Toggle is a **button that stays pressed** (a formatting button, a filter). For an inline
> settings switch, use [Switch](/components/switch); for a labeled boolean in a form, a
> [Checkbox](/components/checkbox).

```bash
jlds add toggle
```

## Usage

<Preview src="/preview/toggle/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/toggle.css">
<!-- behavior layer: flips aria-pressed on click -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/toggle.js" defer></script>

<button type="button" class="jl-toggle jl-toggle--md" aria-pressed="false">Bold</button>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Toggle } from "@/components/ui/toggle"

const bold = ref(false)
</script>

<template>
  <Toggle v-model:pressed="bold">Bold</Toggle>
</template>
```

```tsx [React]
import { useState } from "react"
import { Toggle } from "@/components/ui/toggle"

const [bold, setBold] = useState(false)

<Toggle pressed={bold} onPressedChange={setBold}>Bold</Toggle>
```

:::

## Icon only

Pass an `icon` with no children for a square icon button. Always give it an `aria-label`.

<Preview src="/preview/toggle/icon.html" />

::: code-group

```html [HTML]
<button type="button" class="jl-toggle jl-toggle--md jl-toggle--icon" aria-pressed="true" aria-label="Bold">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" stroke-linecap="round" stroke-linejoin="round"/></svg>
</button>
```

```vue [Vue]
<template>
  <Toggle v-model:pressed="bold" aria-label="Bold">
    <template #icon><BoldIcon /></template>
  </Toggle>
</template>
```

```tsx [React]
<Toggle pressed={bold} onPressedChange={setBold} icon={<Bold />} aria-label="Bold" />
```

:::

## Toggle group

`ToggleGroup` — `attached` (segmented) or `spaced`, with `type="single"` or `"multiple"`.

<Preview src="/preview/toggle/group.html" />

::: code-group

```html [HTML]
<!-- single-select segmented group; data-type="multiple" for multi-select -->
<div class="jl-toggle-group jl-toggle-group--attached jl-toggle-group--md" role="group" aria-label="Align">
  <button type="button" class="jl-toggle jl-toggle--md" data-value="left" aria-pressed="true">Left</button>
  <button type="button" class="jl-toggle jl-toggle--md" data-value="center" aria-pressed="false">Center</button>
  <button type="button" class="jl-toggle jl-toggle--md" data-value="right" aria-pressed="false">Right</button>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { ToggleGroup } from "@/components/ui/toggle"

const align = ref("left")
</script>

<template>
  <ToggleGroup
    v-model="align"
    type="single"
    :options="['Left', 'Center', 'Right']"
    aria-label="Align"
  />
</template>
```

```tsx [React]
import { useState } from "react"
import { ToggleGroup } from "@/components/ui/toggle"

const [align, setAlign] = useState<string | null>("Left")

<ToggleGroup
  type="single"
  value={align}
  onChange={(v) => setAlign(v as string | null)}
  options={["Left", "Center", "Right"]}
  aria-label="Align"
/>
```

:::

## Props

### React — `Toggle`

`Toggle` extends `React.ButtonHTMLAttributes<HTMLButtonElement>` (minus `onChange`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `pressed` | `boolean` | — | Controlled pressed state |
| `defaultPressed` | `boolean` | `false` | Uncontrolled initial state |
| `onPressedChange` | `(pressed: boolean) => void` | — | Fires with the next state |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size |
| `icon` | `React.ReactNode` | — | Leading icon (no children ⇒ square icon button) |

### React — `ToggleGroup`

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `"single" \| "multiple"` | `"single"` | Selection mode |
| `value` / `defaultValue` | `string \| string[] \| null` | — | Controlled / uncontrolled value |
| `onChange` | `(value) => void` | — | Fires with the next value |
| `options` | `(string \| { value, label?, icon?, ariaLabel?, disabled? })[]` | — | The options |
| `variant` | `"attached" \| "spaced"` | `"attached"` | Segmented or separate buttons |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size |

### Vue

`Toggle` supports `v-model:pressed`; `ToggleGroup` uses `v-model` (`string | string[] | null`).
Both emit `change`. Pass a Toggle icon via the `icon` slot.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-toggle` | The button (`aria-pressed` is the on/off state) |
| `.jl-toggle--sm` / `--md` / `--lg` | Size |
| `.jl-toggle--icon` | Square icon-only button |
| `.jl-toggle-group` | A row of toggles (`role="group"`) |
| `.jl-toggle-group--attached` / `--spaced` | Segmented or separated |
| `[data-type="multiple"]` | On the group: allow multiple pressed (default single) |
