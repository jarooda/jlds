# Textarea

A multi-line text field. Vertically resizable, with the same border/focus/disabled treatment
as [Input](/components/input) and an optional invalid state.

```bash
jlds add textarea
```

## Usage

<Preview src="/preview/textarea/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/textarea.css">

<textarea class="jl-textarea" placeholder="Write a message…"></textarea>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Textarea } from "@/components/ui/textarea"

const message = ref("")
</script>

<template>
  <Textarea v-model="message" placeholder="Write a message…" />
</template>
```

```tsx [React]
import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Write a message…" />
```

:::

## Invalid & disabled

Add `invalid` for error styling, or the native `disabled` attribute.

<Preview src="/preview/textarea/states.html" />

::: code-group

```html [HTML]
<textarea class="jl-textarea" aria-invalid="true">Too short</textarea>
<textarea class="jl-textarea" disabled>Disabled</textarea>
```

```vue [Vue]
<template>
  <Textarea invalid model-value="Too short" />
  <Textarea disabled model-value="Disabled" />
</template>
```

```tsx [React]
<Textarea invalid defaultValue="Too short" />
<Textarea disabled defaultValue="Disabled" />
```

:::

## Props

### React

`Textarea` extends `React.TextareaHTMLAttributes<HTMLTextAreaElement>`, so `rows`,
`placeholder`, `value`, `onChange`, `disabled`, etc. all pass through.

| Prop | Type | Default | Description |
|---|---|---|---|
| `invalid` | `boolean` | `false` | Show error styling |

### Vue

`Textarea` supports `v-model`; other attributes (`rows`, `placeholder`, `disabled`, …) fall
through to the inner `<textarea>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `invalid` | `boolean` | `false` | Show error styling |
| `modelValue` | `string` | — | Bound value (`v-model`) |

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-textarea` | The textarea — always required (vertically resizable by default) |
| `[aria-invalid="true"]` | Error styling |
