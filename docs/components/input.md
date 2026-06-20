# Input

A single-line text field wrapped in a bordered container that supports an optional leading
icon, a trailing node, and an invalid state. The wrapper handles focus, hover, and disabled
styling so the inner `<input>` stays clean.

```bash
jlds add input
```

## Usage

<Preview src="/preview/input/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/input.css">

<div class="jl-input-wrap jl-input-wrap--md">
  <input class="jl-input" type="text" placeholder="you@example.com" />
</div>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Input } from "@/components/ui/input"

const email = ref("")
</script>

<template>
  <Input v-model="email" placeholder="you@example.com" />
</template>
```

```tsx [React]
import { Input } from "@/components/ui/input"

<Input placeholder="you@example.com" />
```

:::

## Sizes

`sm` (32px) · `md` (38px, default) · `lg` (44px)

<Preview src="/preview/input/sizes.html" />

::: code-group

```html [HTML]
<div class="jl-input-wrap jl-input-wrap--sm"><input class="jl-input" placeholder="Small" /></div>
<div class="jl-input-wrap jl-input-wrap--md"><input class="jl-input" placeholder="Medium" /></div>
<div class="jl-input-wrap jl-input-wrap--lg"><input class="jl-input" placeholder="Large" /></div>
```

```vue [Vue]
<template>
  <Input size="sm" placeholder="Small" />
  <Input size="md" placeholder="Medium" />
  <Input size="lg" placeholder="Large" />
</template>
```

```tsx [React]
<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />
```

:::

## Icon & trailing

Add a leading `icon` or a `trailing` node (icon, button, or hint). In HTML, wrap each in a
`jl-input-adorn` span on the correct side of the `<input>`.

<Preview src="/preview/input/adornments.html" />

::: code-group

```html [HTML]
<div class="jl-input-wrap jl-input-wrap--md">
  <span class="jl-input-adorn">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  </span>
  <input class="jl-input" placeholder="Search" />
</div>

<div class="jl-input-wrap jl-input-wrap--md">
  <input class="jl-input" placeholder="Amount" />
  <span class="jl-input-adorn">USD</span>
</div>
```

```vue [Vue]
<template>
  <Input placeholder="Search">
    <template #icon><SearchIcon /></template>
  </Input>
  <Input placeholder="Amount">
    <template #trailing>USD</template>
  </Input>
</template>
```

```tsx [React]
import { Search } from "lucide-react"

<Input icon={<Search />} placeholder="Search" />
<Input trailing="USD" placeholder="Amount" />
```

:::

## Invalid & disabled

Add `invalid` for error styling (red border + danger focus ring) or `disabled`.

<Preview src="/preview/input/states.html" />

::: code-group

```html [HTML]
<div class="jl-input-wrap jl-input-wrap--md" data-invalid="true">
  <input class="jl-input" value="not-an-email" aria-invalid="true" />
</div>
<div class="jl-input-wrap jl-input-wrap--md" data-disabled="true">
  <input class="jl-input" value="Disabled" disabled />
</div>
```

```vue [Vue]
<template>
  <Input invalid model-value="not-an-email" />
  <Input disabled model-value="Disabled" />
</template>
```

```tsx [React]
<Input invalid defaultValue="not-an-email" />
<Input disabled defaultValue="Disabled" />
```

:::

## Props

### React

`Input` extends `React.InputHTMLAttributes<HTMLInputElement>` (minus the native `size`), so
`type`, `placeholder`, `value`, `onChange`, etc. all pass through.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Control height and font size |
| `icon` | `React.ReactNode` | — | Leading icon node |
| `trailing` | `React.ReactNode` | — | Trailing node (icon, button, hint) |
| `invalid` | `boolean` | `false` | Show error styling |

### Vue

`Input` supports `v-model`; other attributes (`type`, `placeholder`, …) fall through to the
inner `<input>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Control height and font size |
| `invalid` | `boolean` | `false` | Show error styling |
| `disabled` | `boolean` | `false` | Disable the field |
| `modelValue` | `string \| number` | — | Bound value (`v-model`) |

**Slots:** `icon` (leading), `trailing` (trailing).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-input-wrap` | Bordered wrapper — handles focus/hover/disabled — always required |
| `.jl-input-wrap--sm` / `--md` / `--lg` | Size |
| `.jl-input` | The inner `<input>` element |
| `.jl-input-adorn` | Leading/trailing icon or text slot |
| `[data-invalid="true"]` | Error styling (on the wrapper) |
| `[data-disabled="true"]` | Disabled styling (on the wrapper) |
