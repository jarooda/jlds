# Stepper

Progress through an ordered sequence. Steps before `active` are completed (check), `active` is
current (ringed), the rest are upcoming. Horizontal or vertical, with optional descriptions and
clickable markers.

```bash
jlds add stepper
```

## Usage

<Preview src="/preview/stepper/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/stepper.css">

<ol class="jl-stepper jl-stepper--horizontal">
  <li class="jl-step" data-state="completed">
    <div class="jl-step__indicator">
      <span class="jl-step__marker"><svg viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <span class="jl-step__line" aria-hidden="true"></span>
    </div>
    <div class="jl-step__body"><div class="jl-step__label">Account</div></div>
  </li>
  <li class="jl-step" data-state="current">
    <div class="jl-step__indicator">
      <span class="jl-step__marker" aria-current="step">2</span>
      <span class="jl-step__line" aria-hidden="true"></span>
    </div>
    <div class="jl-step__body"><div class="jl-step__label">Profile</div></div>
  </li>
  <li class="jl-step" data-state="upcoming">
    <div class="jl-step__indicator">
      <span class="jl-step__marker">3</span>
    </div>
    <div class="jl-step__body"><div class="jl-step__label">Done</div></div>
  </li>
</ol>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Stepper } from "@/components/ui/stepper"

const active = ref(1)
</script>

<template>
  <Stepper :steps="['Account', 'Profile', 'Done']" :active="active" />
</template>
```

```tsx [React]
import { Stepper } from "@/components/ui/stepper"

<Stepper steps={["Account", "Profile", "Done"]} active={1} />
```

:::

## Vertical with descriptions

`orientation="vertical"`, and pass step objects with a `description`.

<Preview src="/preview/stepper/vertical.html" />

::: code-group

```html [HTML]
<ol class="jl-stepper jl-stepper--vertical">
  <li class="jl-step" data-state="completed">
    <div class="jl-step__indicator">
      <span class="jl-step__marker"><svg viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <span class="jl-step__line" aria-hidden="true"></span>
    </div>
    <div class="jl-step__body">
      <div class="jl-step__label">Plan</div>
      <div class="jl-step__desc">Choose a billing plan.</div>
    </div>
  </li>
  <!-- … current and upcoming steps … -->
</ol>
```

```vue [Vue]
<template>
  <Stepper
    orientation="vertical"
    :active="1"
    :steps="[
      { label: 'Plan', description: 'Choose a billing plan.' },
      { label: 'Payment', description: 'Add a payment method.' },
      { label: 'Confirm', description: 'Review and finish.' },
    ]"
  />
</template>
```

```tsx [React]
<Stepper
  orientation="vertical"
  active={1}
  steps={[
    { label: "Plan", description: "Choose a billing plan." },
    { label: "Payment", description: "Add a payment method." },
    { label: "Confirm", description: "Review and finish." },
  ]}
/>
```

:::

## Clickable

Pass `onStepClick` (React) / set `clickable` and listen for `step-click` (Vue) to make markers
buttons — for letting users jump back to a completed step.

<Preview src="/preview/stepper/clickable.html" />

::: code-group

```html [HTML]
<!-- render the markers as <button class="jl-step__marker"> and wire your own click handler -->
<button type="button" class="jl-step__marker">1</button>
```

```vue [Vue]
<template>
  <Stepper :steps="steps" :active="active" clickable @step-click="(i) => (active = i)" />
</template>
```

```tsx [React]
<Stepper steps={steps} active={active} onStepClick={(i) => setActive(i)} />
```

:::

## Props

### React

`Stepper` extends `React.OlHTMLAttributes<HTMLOListElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `steps` | `(string \| { label, description?, icon? })[]` | — | The steps, in order |
| `active` | `number` | `0` | Zero-based index of the current step |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction |
| `size` | `"sm" \| "md"` | `"md"` | Marker scale |
| `onStepClick` | `(index, step) => void` | — | Makes markers clickable buttons |

### Vue

Same options. Use `clickable` + the `step-click` event instead of `onStepClick`.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-stepper` + `--horizontal` / `--vertical` | The list and direction |
| `.jl-stepper--sm` | Smaller markers |
| `.jl-step` + `data-state="completed\|current\|upcoming"` | A step and its state |
| `.jl-step__marker` | The numbered/checked circle (`<button>` to make it clickable) |
| `.jl-step__line` | The connector between markers |
| `.jl-step__body` / `__label` / `__desc` | Text column, label, description |
