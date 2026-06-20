# Select

A styled wrapper around the native `<select>` — you get a consistent border, focus ring, and
chevron while keeping native keyboard and mobile behavior. Pass an `options` array or your own
`<option>` children.

```bash
jlds add select
```

## Usage

<Preview src="/preview/select/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/select.css">

<span class="jl-select-wrap">
  <select class="jl-select jl-select--md">
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="id">Indonesia</option>
  </select>
  <span class="jl-select-chevron">
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </span>
</span>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Select } from "@/components/ui/select"

const country = ref("us")
</script>

<template>
  <Select
    v-model="country"
    :options="[
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'id', label: 'Indonesia' },
    ]"
  />
</template>
```

```tsx [React]
import { Select } from "@/components/ui/select"

<Select
  defaultValue="us"
  options={[
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "id", label: "Indonesia" },
  ]}
/>
```

:::

## Placeholder

Pass a `placeholder` to render a disabled first option, shown in muted text until a real value
is chosen.

<Preview src="/preview/select/placeholder.html" />

::: code-group

```html [HTML]
<span class="jl-select-wrap">
  <select class="jl-select jl-select--md" data-placeholder="true">
    <option value="" disabled selected>Choose a framework…</option>
    <option value="react">React</option>
    <option value="vue">Vue</option>
  </select>
  <span class="jl-select-chevron">…</span>
</span>
```

```vue [Vue]
<template>
  <Select v-model="framework" placeholder="Choose a framework…" :options="['React', 'Vue']" />
</template>
```

```tsx [React]
<Select placeholder="Choose a framework…" defaultValue="" options={["React", "Vue"]} />
```

:::

## Sizes

`sm` (32px) · `md` (38px, default) · `lg` (44px)

<Preview src="/preview/select/sizes.html" />

::: code-group

```html [HTML]
<span class="jl-select-wrap"><select class="jl-select jl-select--sm">…</select><span class="jl-select-chevron">…</span></span>
<span class="jl-select-wrap"><select class="jl-select jl-select--md">…</select><span class="jl-select-chevron">…</span></span>
<span class="jl-select-wrap"><select class="jl-select jl-select--lg">…</select><span class="jl-select-chevron">…</span></span>
```

```vue [Vue]
<template>
  <Select size="sm" :options="['Small']" />
  <Select size="md" :options="['Medium']" />
  <Select size="lg" :options="['Large']" />
</template>
```

```tsx [React]
<Select size="sm" options={["Small"]} />
<Select size="md" options={["Medium"]} />
<Select size="lg" options={["Large"]} />
```

:::

## Props

### React

`Select` extends `React.SelectHTMLAttributes<HTMLSelectElement>` (minus `size`), so `value`,
`defaultValue`, `onChange`, `disabled`, `name`, etc. pass through.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Control height and font size |
| `options` | `(string \| { value, label })[]` | `[]` | Option list (or use `<option>` children) |
| `placeholder` | `string` | — | Disabled first option, shown until a value is chosen |

### Vue

`Select` supports `v-model`; other attributes (`name`, …) fall through to the `<select>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Control height and font size |
| `options` | `(string \| { value, label })[]` | `[]` | Option list (or use slot `<option>`s) |
| `placeholder` | `string` | — | Disabled first option |
| `disabled` | `boolean` | `false` | Disable the field |
| `modelValue` | `string` | — | Selected value (`v-model`) |

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-select-wrap` | Relative wrapper that positions the chevron — always required |
| `.jl-select` | The native `<select>` element |
| `.jl-select--sm` / `--md` / `--lg` | Size |
| `.jl-select-chevron` | The decorative chevron (pointer-events: none) |
| `[data-placeholder="true"]` | Muted text while showing the placeholder |
