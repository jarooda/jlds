# Slider

A drag- and keyboard-driven numeric input. Single value by default, or a two-thumb min–max band
with `range`. Supports steps, tick marks, a value readout, and full keyboard control (arrows,
Page Up/Down, Home/End).

> The slider's drag/keyboard behavior is JavaScript-driven. With React/Vue it just works. For
> plain HTML, include the [behavior layer](/guide/vanilla-html#interactivity-optional): it reads
> `data-min`/`data-max`/`data-step` on the root and `data-value` on each thumb (two thumbs = a
> range), wires up drag + keyboard, and emits a `jl-slider:change` event on the root.

```bash
jlds add slider
```

## Usage

<Preview src="/preview/slider/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/slider.css">
<!-- behavior layer: wires up drag + keyboard -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/all.js" defer></script>

<!-- the script reads data-* and positions the fill/thumb -->
<div class="jl-slider jl-slider--md" data-min="0" data-max="100" data-step="1">
  <div class="jl-slider__track">
    <span class="jl-slider__fill"></span>
    <button type="button" class="jl-slider__thumb" data-value="40"
      role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" tabindex="0"></button>
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
<div class="jl-slider jl-slider--md" data-min="0" data-max="100" data-step="1" data-suffix="%">
  <div class="jl-slider__head">
    <span class="jl-slider__label">Volume</span>
    <span class="jl-slider__value">65%</span>
  </div>
  <div class="jl-slider__track">
    <span class="jl-slider__fill"></span>
    <button type="button" class="jl-slider__thumb" data-value="65" role="slider"
      aria-valuemin="0" aria-valuemax="100" aria-valuenow="65" tabindex="0"></button>
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
<div class="jl-slider jl-slider--md" data-min="0" data-max="100" data-step="1">
  <div class="jl-slider__track">
    <span class="jl-slider__fill"></span>
    <button type="button" class="jl-slider__thumb" data-value="25" role="slider"
      aria-valuemin="0" aria-valuemax="100" aria-valuenow="25" tabindex="0"></button>
    <button type="button" class="jl-slider__thumb" data-value="75" role="slider"
      aria-valuemin="0" aria-valuemax="100" aria-valuenow="75" tabindex="0"></button>
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

### HTML data attributes (behavior layer)

With the [behavior layer](/guide/vanilla-html#interactivity-optional) loaded, the script reads
these and positions/updates everything — you don't set the `fill`/`thumb` `left`/`width` yourself.

| Attribute | On | Default | Purpose |
|---|---|---|---|
| `data-min` / `data-max` / `data-step` | `.jl-slider` | `0` / `100` / `1` | Range and increment |
| `data-suffix` | `.jl-slider` | — | Appended to the `__value` readout (e.g. `%`) |
| `data-value` | `.jl-slider__thumb` | `min` | A thumb's initial value (two thumbs ⇒ range) |

It emits a `jl-slider:change` event on the root: `el.detail.value` is a number, or `[min, max]`
for a range.
