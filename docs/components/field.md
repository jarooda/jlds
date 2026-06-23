# Field

A labelled wrapper for a form control — label, an optional required/optional marker, and a hint
or error line below. Pairs with [Input](/components/input), [Select](/components/select),
[Textarea](/components/textarea), and the other form controls.

```bash
jlds add field
```

## Usage

Put any control in the default slot. Associate the label with it via `htmlFor` + the control's
`id`.

<Preview src="/preview/field/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/field.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/input.css">

<div class="jl-field">
  <label class="jl-field__label" for="email">Email</label>
  <div class="jl-input-wrap jl-input-wrap--md">
    <input id="email" class="jl-input" type="email" placeholder="you@example.com" />
  </div>
  <div class="jl-field__hint">We'll only use this for account notices.</div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
</script>

<template>
  <Field label="Email" hint="We'll only use this for account notices." html-for="email">
    <Input id="email" type="email" placeholder="you@example.com" />
  </Field>
</template>
```

```tsx [React]
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

<Field label="Email" hint="We'll only use this for account notices." htmlFor="email">
  <Input id="email" type="email" placeholder="you@example.com" />
</Field>
```

:::

## Required & optional

Add `required` for a red asterisk, or `optional` for an "(optional)" marker.

<Preview src="/preview/field/markers.html" />

::: code-group

```html [HTML]
<div class="jl-field">
  <label class="jl-field__label" for="name">
    Full name <span class="jl-field__req" aria-hidden="true">*</span>
  </label>
  <div class="jl-input-wrap jl-input-wrap--md"><input id="name" class="jl-input" /></div>
</div>
```

```vue [Vue]
<template>
  <Field label="Full name" required html-for="name">
    <Input id="name" />
  </Field>
  <Field label="Company" optional html-for="company">
    <Input id="company" />
  </Field>
</template>
```

```tsx [React]
<Field label="Full name" required htmlFor="name">
  <Input id="name" />
</Field>
<Field label="Company" optional htmlFor="company">
  <Input id="company" />
</Field>
```

:::

## Error state

Pass `error` to replace the hint with a red message (and pair with the control's `invalid`).

<Preview src="/preview/field/error.html" />

::: code-group

```html [HTML]
<div class="jl-field">
  <label class="jl-field__label" for="pw">Password</label>
  <div class="jl-input-wrap jl-input-wrap--md" data-invalid="true">
    <input id="pw" class="jl-input" type="password" value="123" aria-invalid="true" />
  </div>
  <div class="jl-field__error" role="alert">Must be at least 8 characters.</div>
</div>
```

```vue [Vue]
<template>
  <Field label="Password" error="Must be at least 8 characters." html-for="pw">
    <Input id="pw" type="password" invalid />
  </Field>
</template>
```

```tsx [React]
<Field label="Password" error="Must be at least 8 characters." htmlFor="pw">
  <Input id="pw" type="password" invalid />
</Field>
```

:::

## Props

`Field` takes the same props in React and Vue (in Vue, text props are strings and `htmlFor`
is `html-for`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `React.ReactNode` | — | Field label text |
| `hint` | `React.ReactNode` | — | Helper text below (hidden when `error` is set) |
| `error` | `React.ReactNode` | — | Error message; replaces hint, styled red, `role="alert"` |
| `required` | `boolean` | `false` | Show a red required asterisk |
| `optional` | `boolean` | `false` | Show an "(optional)" marker |
| `htmlFor` | `string` | — | `id` of the control, to associate the label |

**Slots (Vue) / children (React):** the form control itself.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-field` | Wrapper — always required |
| `.jl-field__label` | The `<label>` |
| `.jl-field__req` | Red required asterisk |
| `.jl-field__optional` | "(optional)" marker |
| `.jl-field__hint` | Helper text |
| `.jl-field__error` | Error message (use with `role="alert"`) |
