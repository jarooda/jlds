# Slider

A drag- and keyboard-driven numeric input. Single value by default, or a two-thumb min–max band
with `range`. Supports steps, tick marks, a value readout, and full keyboard control (arrows,
Page Up/Down, Home/End).

> The slider's drag/keyboard behavior is JavaScript-driven, so use the React or Vue component.
> The HTML tab shows the markup structure for reference — wire up your own pointer/key handlers
> (or copy the logic from the component) if you need a no-framework build.

```bash
jlds add slider
```

## Usage

<Preview src="/preview/slider/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/slider.css">

<div class="jl-slider jl-slider--md">
  <div class="jl-slider__track">
    <span class="jl-slider__fill" style="left: 0; width: 40%"></span>
    <button type="button" class="jl-slider__thumb" style="left: 40%"
      role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40"></button>
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Slider } from "@/components/ui/slider"

const volume = ref(40)
</script>

<template>
  <Slider v-model="volume" />
</template>
```

```tsx [React]
import { useState } from "react"
import { Slider } from "@/components/ui/slider"

const [volume, setVolume] = useState(40)

<Slider value={volume} onChange={(v) => setVolume(v as number)} />
```

:::

## Label & value

Add a `label` and/or `showValue` for a header row. Use `formatValue` to format the readout.

<Preview src="/preview/slider/value.html" />

::: code-group

```html [HTML]
<div class="jl-slider jl-slider--md">
  <div class="jl-slider__head">
    <span class="jl-slider__label">Volume</span>
    <span class="jl-slider__value">65%</span>
  </div>
  <div class="jl-slider__track">
    <span class="jl-slider__fill" style="left: 0; width: 65%"></span>
    <button type="button" class="jl-slider__thumb" style="left: 65%" role="slider"
      aria-valuemin="0" aria-valuemax="100" aria-valuenow="65"></button>
  </div>
</div>
```

```vue [Vue]
<template>
  <Slider
    v-model="volume"
    label="Volume"
    show-value
    :format-value="(v) => `${v}%`"
  />
</template>
```

```tsx [React]
<Slider
  value={volume}
  onChange={(v) => setVolume(v as number)}
  label="Volume"
  showValue
  formatValue={(v) => `${v}%`}
/>
```

:::

## Range & marks

Set `range` for a two-thumb band (value is `[min, max]`), and `marks` for tick labels.

<Preview src="/preview/slider/range.html" />

::: code-group

```html [HTML]
<div class="jl-slider jl-slider--md">
  <div class="jl-slider__track">
    <span class="jl-slider__fill" style="left: 25%; right: 25%"></span>
    <button type="button" class="jl-slider__thumb" style="left: 25%" role="slider"
      aria-valuemin="0" aria-valuemax="100" aria-valuenow="25"></button>
    <button type="button" class="jl-slider__thumb" style="left: 75%" role="slider"
      aria-valuemin="0" aria-valuemax="100" aria-valuenow="75"></button>
  </div>
  <div class="jl-slider__marks">
    <span class="jl-slider__mark" style="left: 0%">0</span>
    <span class="jl-slider__mark" style="left: 50%">50</span>
    <span class="jl-slider__mark" style="left: 100%">100</span>
  </div>
</div>
```

```vue [Vue]
<template>
  <Slider
    v-model="priceRange"
    range
    :marks="[0, 50, 100]"
  />
</template>
```

```tsx [React]
const [priceRange, setPriceRange] = useState<[number, number]>([25, 75])

<Slider
  range
  value={priceRange}
  onChange={(v) => setPriceRange(v as [number, number])}
  marks={[0, 50, 100]}
/>
```

:::

## Props

`Slider` is controlled (`value` + `onChange`) or uncontrolled (`defaultValue`). The value is a
`number`, or `[number, number]` when `range`.

### React

| Prop | Type | Default | Description |
|---|---|---|---|
| `min` / `max` | `number` | `0` / `100` | Bounds |
| `step` | `number` | `1` | Step increment |
| `value` | `number \| [number, number]` | — | Controlled value |
| `defaultValue` | `number \| [number, number]` | — | Uncontrolled initial value |
| `range` | `boolean` | `false` | Two-thumb min–max band |
| `onChange` | `(value) => void` | — | Fires on every drag/key change |
| `onChangeEnd` | `(value) => void` | — | Fires once at the end of a drag / on key commit |
| `disabled` | `boolean` | `false` | Disable interaction |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Track/thumb scale |
| `marks` | `(number \| { value, label })[]` | — | Tick labels under the track |
| `showValue` | `boolean` | `false` | Show the value in the header |
| `formatValue` | `(v: number) => ReactNode` | `v => v` | Format the readout |
| `label` | `React.ReactNode` | — | Header label |

### Vue

Same options. Use `v-model` for the value and `@change-end` for the commit event; `format-value`
takes a `(v: number) => string \| number` function.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-slider` | Wrapper — always required |
| `.jl-slider--sm` / `--md` / `--lg` | Scale |
| `.jl-slider--disabled` | Dimmed, non-interactive |
| `.jl-slider__head` / `__label` / `__value` | Optional header row |
| `.jl-slider__track` | The rail (attach pointer handlers here) |
| `.jl-slider__fill` | The filled portion (set `left`/`width` or `left`/`right` for range) |
| `.jl-slider__thumb` | A draggable thumb (`role="slider"` + `aria-value*`) |
| `.jl-slider__marks` / `.jl-slider__mark` | Tick label row |
