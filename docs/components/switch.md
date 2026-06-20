# Switch

An instant on/off toggle for settings that apply immediately — no separate save step. Two
sizes, with an optional inline label.

> Use a Switch for settings that take effect right away. For a value that's submitted with a
> form, prefer a [Checkbox](/components/checkbox).

```bash
jlds add switch
```

## Usage

<Preview src="/preview/switch/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/switch.css">

<label class="jl-switch jl-switch--md">
  <input type="checkbox" role="switch" class="jl-switch__input" checked />
  <span class="jl-switch__track"><span class="jl-switch__thumb"></span></span>
  <span class="jl-switch__label">Wi-Fi</span>
</label>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Switch } from "@/components/ui/switch"

const on = ref(true)
</script>

<template>
  <Switch v-model="on" label="Wi-Fi" />
</template>
```

```tsx [React]
import { Switch } from "@/components/ui/switch"

<Switch defaultChecked label="Wi-Fi" />
```

:::

## Sizes

`sm` · `md` (default)

<Preview src="/preview/switch/sizes.html" />

::: code-group

```html [HTML]
<label class="jl-switch jl-switch--sm">
  <input type="checkbox" role="switch" class="jl-switch__input" checked />
  <span class="jl-switch__track"><span class="jl-switch__thumb"></span></span>
</label>
<label class="jl-switch jl-switch--md">
  <input type="checkbox" role="switch" class="jl-switch__input" checked />
  <span class="jl-switch__track"><span class="jl-switch__thumb"></span></span>
</label>
```

```vue [Vue]
<template>
  <Switch size="sm" model-value />
  <Switch size="md" model-value />
</template>
```

```tsx [React]
<Switch size="sm" defaultChecked />
<Switch size="md" defaultChecked />
```

:::

## States

Add `disabled` to dim and lock.

<Preview src="/preview/switch/states.html" />

::: code-group

```html [HTML]
<label class="jl-switch jl-switch--md" data-disabled="true">
  <input type="checkbox" role="switch" class="jl-switch__input" checked disabled />
  <span class="jl-switch__track"><span class="jl-switch__thumb"></span></span>
  <span class="jl-switch__label">Locked on</span>
</label>
```

```vue [Vue]
<template>
  <Switch disabled model-value label="Locked on" />
  <Switch disabled label="Locked off" />
</template>
```

```tsx [React]
<Switch disabled defaultChecked label="Locked on" />
<Switch disabled label="Locked off" />
```

:::

## Props

### React

`Switch` extends `React.InputHTMLAttributes<HTMLInputElement>` (minus `type`/`size`), so
`checked`, `defaultChecked`, `onChange`, `name`, etc. pass through.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `React.ReactNode` | — | Inline label beside the switch |
| `size` | `"sm" \| "md"` | `"md"` | Switch size |

### Vue

`Switch` supports `v-model` (boolean); other attributes fall through to the input.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Inline label |
| `size` | `"sm" \| "md"` | `"md"` | Switch size |
| `disabled` | `boolean` | `false` | Dim and lock |
| `modelValue` | `boolean` | `false` | On/off state (`v-model`) |

**Slots:** `default` — label content (alternative to the `label` prop).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-switch` | The `<label>` wrapper — always required |
| `.jl-switch--sm` / `--md` | Size |
| `.jl-switch__input` | Visually-hidden `<input type="checkbox" role="switch">` |
| `.jl-switch__track` / `.jl-switch__thumb` | The track and sliding thumb |
| `.jl-switch__label` | Inline label |
| `[data-disabled="true"]` | Disabled styling (on the label) |
