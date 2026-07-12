# Carousel

A scroll-snap track with **adaptive slides-per-view**, native touch swipe, page dots, and desktop
arrows (the arrows hide on mobile where swipe takes over). Tier-2 adaptive — `perView` shrinks on
narrow screens. Each child is one slide.

```bash
jlds add carousel
```

## Usage

<Preview src="/preview/carousel/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/carousel.css">
<!-- behavior layer: scroll-snap, arrows, dots -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/carousel.js" defer></script>

<div class="jl-carousel" data-per-view="1" data-per-view-sm="2" data-per-view-md="3" data-gap="14">
  <div class="jl-carousel__track">
    <div><!-- slide 1 --></div>
    <div><!-- slide 2 --></div>
    <div><!-- slide 3 --></div>
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { Carousel } from "@/components/ui/carousel"
</script>

<template>
  <Carousel :per-view="{ base: 1, sm: 2, md: 3 }" :gap="14">
    <div v-for="c in cards" :key="c.id"><!-- slide --></div>
  </Carousel>
</template>
```

```tsx [React]
import { Carousel } from "@/components/ui/carousel"

<Carousel perView={{ base: 1, sm: 2, md: 3 }} gap={14}>
  {cards.map((c) => (
    <div key={c.id}>{/* slide */}</div>
  ))}
</Carousel>
```

:::

`perView` is a fixed number or a responsive map keyed by breakpoint: `base` (< 600px), `sm`
(≥ 600px), `md` (≥ 900px), `lg` (≥ 1200px). In HTML the same map is set with
`data-per-view` / `data-per-view-sm` / `-md` / `-lg`.

## Props

### React

`Carousel` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | — | Slides — one per child |
| `perView` | `number \| { base?, sm?, md?, lg? }` | `1` | Slides visible at once |
| `gap` | `number` | `16` | Gap between slides (px) |
| `showArrows` | `boolean` | `true` | Prev/next arrows on pointer devices |
| `showDots` | `boolean` | `true` | Page dots |

### Vue

Same options. Slides are the default slot; `perView` maps to `:per-view`.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-carousel` | Root (positioning context for arrows/dots) |
| `.jl-carousel__track` | The scroll-snap flex track holding the slides |
| `.jl-carousel__slide` | A slide (added to each track child by the behavior layer) |
| `.jl-carousel__arrow` (+ `--prev` / `--next`) | Generated desktop arrows |
| `.jl-carousel__dots` / `__dot` | Generated page-dot strip |

Data attributes on the root: `data-per-view[-sm/-md/-lg]`, `data-gap`, `data-arrows="false"`,
`data-dots="false"`.
