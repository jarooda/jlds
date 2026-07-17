# Number Input

A numeric field with −/+ steppers, min/max clamping, step increments, and arrow-key control
(↑/↓). Optional trailing unit affix. Controlled (`value` + `onChange`) or uncontrolled
(`defaultValue`); an empty field is `null`.

```bash
jlds add number-input
```

## Usage

<Preview src="/preview/number-input/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/number-input.css">
<!-- behavior layer: steppers, clamping, arrow keys -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/number-input.js" defer></script>

<div class="jl-number jl-number--md" data-min="0" data-max="10" data-step="1" style="max-width: 160px">
  <button type="button" class="jl-number__btn jl-number__btn--dec" aria-label="Decrease" tabindex="-1">
    <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
  </button>
  <input class="jl-number__input" type="text" inputmode="decimal" role="spinbutton" value="3" />
  <button type="button" class="jl-number__btn jl-number__btn--inc" aria-label="Increase" tabindex="-1">
    <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
  </button>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { NumberInput } from "@/components/ui/number-input"

const qty = ref(3)
</script>

<template>
  <NumberInput v-model="qty" :min="0" :max="10" />
</template>
```

```tsx [React]
import { useState } from "react"
import { NumberInput } from "@/components/ui/number-input"

const [qty, setQty] = useState<number | null>(3)

<NumberInput value={qty ?? ""} onChange={setQty} min={0} max={10} />
```

:::

## Step, precision & affixes

`step` sets the increment (and default decimal `precision`); add a `prefix` (leading) and/or
`suffix` (trailing) affix for a currency symbol or unit.

<Preview src="/preview/number-input/units.html" />

::: code-group

```html [HTML]
<div class="jl-number jl-number--md" data-min="0" data-step="5" style="max-width: 220px">
  <button class="jl-number__btn jl-number__btn--dec" aria-label="Decrease" tabindex="-1">…</button>
  <span class="jl-number__affix jl-number__affix--prefix">$</span>
  <input class="jl-number__input" type="text" inputmode="decimal" value="20" />
  <span class="jl-number__affix">/mo</span>
  <button class="jl-number__btn jl-number__btn--inc" aria-label="Increase" tabindex="-1">…</button>
</div>
```

```vue [Vue]
<template>
  <NumberInput v-model="price" prefix="$" suffix="/mo" :min="0" :step="5" />
</template>
```

```tsx [React]
<NumberInput prefix="$" suffix="/mo" defaultValue={20} min={0} step={5} />
```

:::

## Sizes & states

`sm` · `md` (default) · `lg`; plus `invalid` and `disabled`.

<Preview src="/preview/number-input/states.html" />

::: code-group

```html [HTML]
<div class="jl-number jl-number--sm" data-step="1">…</div>
<div class="jl-number jl-number--md jl-number--invalid" data-step="1">…</div>
<div class="jl-number jl-number--md jl-number--disabled" data-step="1">…</div>
```

```vue [Vue]
<template>
  <NumberInput v-model="a" size="sm" />
  <NumberInput v-model="b" invalid />
  <NumberInput v-model="c" disabled />
</template>
```

```tsx [React]
<NumberInput size="sm" defaultValue={1} />
<NumberInput invalid defaultValue={1} />
<NumberInput disabled defaultValue={1} />
```

:::

## Props

### React

`NumberInput` extends `React.InputHTMLAttributes<HTMLInputElement>` (minus `value`/`defaultValue`/`onChange`/`size`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number \| ""` | — | Controlled value |
| `defaultValue` | `number \| ""` | — | Uncontrolled initial value |
| `onChange` | `(value: number \| null) => void` | — | Clamped/rounded number, or `null` when cleared |
| `min` / `max` | `number` | `-Infinity` / `Infinity` | Clamped on commit |
| `step` | `number` | `1` | Stepper / arrow-key increment |
| `precision` | `number` | from `step` | Decimal places to round to |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Control height |
| `align` | `"left" \| "center"` | `"center"` | Value text alignment |
| `prefix` | `React.ReactNode` | — | Leading affix (e.g. `$`) |
| `suffix` | `React.ReactNode` | — | Trailing unit affix |
| `invalid` / `disabled` | `boolean` | `false` | States |

### Vue

Same options. Use `v-model` (`number \| null`).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-number` | Wrapper — set `data-min/max/step/precision` here |
| `.jl-number--sm` / `--md` / `--lg` | Size |
| `.jl-number--left` | Left-align the value |
| `.jl-number__affix` + `--prefix` | Trailing / leading unit affix |
| `.jl-number--invalid` / `--disabled` | States |
| `.jl-number__input` | The text input (`value` sets the initial number) |
| `.jl-number__btn--dec` / `--inc` | Stepper buttons |
| `.jl-number__affix` | Trailing unit affix |
