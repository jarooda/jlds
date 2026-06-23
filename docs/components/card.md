# Card

The primary surface container. Three elevation treatments, an optional hover-lift for clickable
cards, and composable header / body / footer sections.

```bash
jlds add card
```

## Usage

Compose with `Card.Header`, `Card.Body`, `Card.Footer` (React) / `CardHeader`, `CardBody`,
`CardFooter` (Vue), or the `.jl-card__*` elements (HTML).

<Preview src="/preview/card/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/card.css">

<div class="jl-card jl-card--flat">
  <div class="jl-card__header">
    <div class="jl-card__header-text">
      <div class="jl-card__title">Project settings</div>
      <div class="jl-card__subtitle">Manage how this project builds and deploys.</div>
    </div>
  </div>
  <div class="jl-card__body">Body content goes here.</div>
  <div class="jl-card__footer">
    <button class="jl-btn jl-btn--secondary jl-btn--sm">Cancel</button>
    <button class="jl-btn jl-btn--primary jl-btn--sm">Save</button>
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
</script>

<template>
  <Card>
    <CardHeader title="Project settings" subtitle="Manage how this project builds and deploys." />
    <CardBody>Body content goes here.</CardBody>
    <CardFooter>
      <Button variant="secondary" size="sm">Cancel</Button>
      <Button size="sm">Save</Button>
    </CardFooter>
  </Card>
</template>
```

```tsx [React]
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

<Card>
  <Card.Header title="Project settings" subtitle="Manage how this project builds and deploys." />
  <Card.Body>Body content goes here.</Card.Body>
  <Card.Footer>
    <Button variant="secondary" size="sm">Cancel</Button>
    <Button size="sm">Save</Button>
  </Card.Footer>
</Card>
```

:::

## Elevation

`flat` (default, bordered) · `raised` (subtle shadow) · `floating` (lifted shadow)

<Preview src="/preview/card/elevation.html" />

::: code-group

```html [HTML]
<div class="jl-card jl-card--flat"><div class="jl-card__body">Flat</div></div>
<div class="jl-card jl-card--raised"><div class="jl-card__body">Raised</div></div>
<div class="jl-card jl-card--floating"><div class="jl-card__body">Floating</div></div>
```

```vue [Vue]
<template>
  <Card elevation="flat"><CardBody>Flat</CardBody></Card>
  <Card elevation="raised"><CardBody>Raised</CardBody></Card>
  <Card elevation="floating"><CardBody>Floating</CardBody></Card>
</template>
```

```tsx [React]
<Card elevation="flat"><Card.Body>Flat</Card.Body></Card>
<Card elevation="raised"><Card.Body>Raised</Card.Body></Card>
<Card elevation="floating"><Card.Body>Floating</Card.Body></Card>
```

:::

## Interactive

Add `interactive` for a hover-lift and pointer cursor — for cards that act as a single link or
button.

<Preview src="/preview/card/interactive.html" />

::: code-group

```html [HTML]
<div class="jl-card jl-card--raised jl-card--interactive">
  <div class="jl-card__body">Hover me — I lift.</div>
</div>
```

```vue [Vue]
<template>
  <Card elevation="raised" interactive>
    <CardBody>Hover me — I lift.</CardBody>
  </Card>
</template>
```

```tsx [React]
<Card elevation="raised" interactive>
  <Card.Body>Hover me — I lift.</Card.Body>
</Card>
```

:::

## Props

### React

`Card` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `elevation` | `"flat" \| "raised" \| "floating"` | `"flat"` | Depth treatment |
| `interactive` | `boolean` | `false` | Hover-lift + pointer cursor |

`Card.Header` takes `title`, `subtitle`, `icon`, `action` (all `ReactNode`). `Card.Body` and
`Card.Footer` are plain section wrappers.

### Vue

`Card` takes `elevation` and `interactive`. `CardHeader` takes `title`/`subtitle` props plus
`icon` and `action` slots. `CardBody` / `CardFooter` wrap their default slot.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-card` | Base surface — always required |
| `.jl-card--flat` / `--raised` / `--floating` | Elevation |
| `.jl-card--interactive` | Hover-lift + pointer |
| `.jl-card__header` / `__header-text` / `__title` / `__subtitle` / `__header-action` | Header parts |
| `.jl-card__body` | Body section |
| `.jl-card__footer` | Footer section (sunken background) |
