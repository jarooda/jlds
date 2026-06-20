# Checkbox

A boolean control with an optional label, secondary description, and an indeterminate (mixed)
state. The whole thing is a `<label>`, so clicking the text toggles the box.

```bash
jlds add checkbox
```

## Usage

<Preview src="/preview/checkbox/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/checkbox.css">

<label class="jl-check">
  <input type="checkbox" class="jl-check__input" checked />
  <span class="jl-check__box">
    <svg class="jl-check__mark" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.2l2.2 2.3 4.8-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span class="jl-check__dash" aria-hidden="true"></span>
  </span>
  <span class="jl-check__body">
    <span class="jl-check__label">Email me about updates</span>
  </span>
</label>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Checkbox } from "@/components/ui/checkbox"

const checked = ref(true)
</script>

<template>
  <Checkbox v-model="checked" label="Email me about updates" />
</template>
```

```tsx [React]
import { Checkbox } from "@/components/ui/checkbox"

<Checkbox defaultChecked label="Email me about updates" />
```

:::

## With description

Pass a `description` for a secondary line under the label.

<Preview src="/preview/checkbox/description.html" />

::: code-group

```html [HTML]
<label class="jl-check">
  <input type="checkbox" class="jl-check__input" checked />
  <span class="jl-check__box">
    <svg class="jl-check__mark" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.2l2.2 2.3 4.8-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span class="jl-check__dash" aria-hidden="true"></span>
  </span>
  <span class="jl-check__body">
    <span class="jl-check__label">Enable notifications</span>
    <span class="jl-check__desc">Get notified when a deploy finishes.</span>
  </span>
</label>
```

```vue [Vue]
<template>
  <Checkbox
    v-model="checked"
    label="Enable notifications"
    description="Get notified when a deploy finishes."
  />
</template>
```

```tsx [React]
<Checkbox
  defaultChecked
  label="Enable notifications"
  description="Get notified when a deploy finishes."
/>
```

:::

## Indeterminate & disabled

`indeterminate` renders the mixed dash — useful for a "select all" parent. It's a DOM property,
so it's set by the component (React/Vue) rather than markup. Add `disabled` to dim and lock.

<Preview src="/preview/checkbox/states.html" />

::: code-group

```html [HTML]
<!-- indeterminate is a JS property: el.indeterminate = true -->
<label class="jl-check" data-disabled="true">
  <input type="checkbox" class="jl-check__input" disabled />
  <span class="jl-check__box">…</span>
  <span class="jl-check__body"><span class="jl-check__label">Disabled</span></span>
</label>
```

```vue [Vue]
<template>
  <Checkbox indeterminate label="Select all" />
  <Checkbox disabled label="Disabled" />
</template>
```

```tsx [React]
<Checkbox indeterminate label="Select all" />
<Checkbox disabled label="Disabled" />
```

:::

## Props

### React

`Checkbox` extends `React.InputHTMLAttributes<HTMLInputElement>` (minus `type`), so `checked`,
`defaultChecked`, `onChange`, `name`, etc. pass through to the input.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `React.ReactNode` | — | Label beside the box |
| `description` | `React.ReactNode` | — | Secondary line under the label |
| `indeterminate` | `boolean` | `false` | Render the mixed dash |

### Vue

`Checkbox` supports `v-model` (boolean); other attributes (`name`, …) fall through to the input.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Label beside the box |
| `description` | `string` | — | Secondary line under the label |
| `indeterminate` | `boolean` | `false` | Render the mixed dash |
| `disabled` | `boolean` | `false` | Dim and lock |
| `modelValue` | `boolean` | `false` | Checked state (`v-model`) |

**Slots:** `default` — label content (alternative to the `label` prop).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-check` | The `<label>` wrapper — always required |
| `.jl-check__input` | The visually-hidden `<input type="checkbox">` |
| `.jl-check__box` | The drawn box (holds the check mark + dash) |
| `.jl-check__mark` / `.jl-check__dash` | Checked tick / indeterminate dash |
| `.jl-check__body` / `__label` / `__desc` | Text column, label, and description |
| `[data-disabled="true"]` | Disabled styling (on the label) |
