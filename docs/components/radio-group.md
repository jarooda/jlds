# RadioGroup

A single-choice control rendered from an options array. Options can be plain strings or objects
with a label, description, and per-option disabled flag. Stacks vertically by default or inline
with `direction="row"`.

```bash
jlds add radio-group
```

## Usage

<Preview src="/preview/radio-group/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/radio-group.css">

<div class="jl-radiogroup" role="radiogroup">
  <label class="jl-radio">
    <input type="radio" class="jl-radio__input" name="plan" value="free" checked />
    <span class="jl-radio__dot"></span>
    <span class="jl-radio__body"><span class="jl-radio__label">Free</span></span>
  </label>
  <label class="jl-radio">
    <input type="radio" class="jl-radio__input" name="plan" value="pro" />
    <span class="jl-radio__dot"></span>
    <span class="jl-radio__body"><span class="jl-radio__label">Pro</span></span>
  </label>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { RadioGroup } from "@/components/ui/radio-group"

const plan = ref("free")
</script>

<template>
  <RadioGroup
    name="plan"
    v-model="plan"
    :options="['Free', 'Pro', 'Enterprise']"
  />
</template>
```

```tsx [React]
import { useState } from "react"
import { RadioGroup } from "@/components/ui/radio-group"

const [plan, setPlan] = useState("Free")

<RadioGroup
  name="plan"
  value={plan}
  onChange={setPlan}
  options={["Free", "Pro", "Enterprise"]}
/>
```

:::

## With descriptions

Pass option objects to add a `description` and per-option `disabled`.

<Preview src="/preview/radio-group/descriptions.html" />

::: code-group

```html [HTML]
<div class="jl-radiogroup" role="radiogroup">
  <label class="jl-radio">
    <input type="radio" class="jl-radio__input" name="tier" value="hobby" checked />
    <span class="jl-radio__dot"></span>
    <span class="jl-radio__body">
      <span class="jl-radio__label">Hobby</span>
      <span class="jl-radio__desc">For personal projects. 1 environment.</span>
    </span>
  </label>
  <label class="jl-radio" data-disabled="true">
    <input type="radio" class="jl-radio__input" name="tier" value="team" disabled />
    <span class="jl-radio__dot"></span>
    <span class="jl-radio__body">
      <span class="jl-radio__label">Team</span>
      <span class="jl-radio__desc">Coming soon.</span>
    </span>
  </label>
</div>
```

```vue [Vue]
<template>
  <RadioGroup
    name="tier"
    v-model="tier"
    :options="[
      { value: 'hobby', label: 'Hobby', description: 'For personal projects. 1 environment.' },
      { value: 'team', label: 'Team', description: 'Coming soon.', disabled: true },
    ]"
  />
</template>
```

```tsx [React]
<RadioGroup
  name="tier"
  value={tier}
  onChange={setTier}
  options={[
    { value: "hobby", label: "Hobby", description: "For personal projects. 1 environment." },
    { value: "team", label: "Team", description: "Coming soon.", disabled: true },
  ]}
/>
```

:::

## Inline

Set `direction="row"` (React/Vue) or add `jl-radiogroup--row` (HTML).

<Preview src="/preview/radio-group/row.html" />

::: code-group

```html [HTML]
<div class="jl-radiogroup jl-radiogroup--row" role="radiogroup">
  <label class="jl-radio">
    <input type="radio" class="jl-radio__input" name="size" value="sm" checked />
    <span class="jl-radio__dot"></span>
    <span class="jl-radio__body"><span class="jl-radio__label">Small</span></span>
  </label>
  <!-- … -->
</div>
```

```vue [Vue]
<template>
  <RadioGroup name="size" v-model="size" direction="row" :options="['Small', 'Medium', 'Large']" />
</template>
```

```tsx [React]
<RadioGroup name="size" value={size} onChange={setSize} direction="row" options={["Small", "Medium", "Large"]} />
```

:::

## Props

`RadioGroup` is a controlled component — pass `value`/`v-model` and handle changes.

### React

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — | Shared input `name` (required) |
| `value` | `string` | — | Selected value (controlled) |
| `onChange` | `(value, event) => void` | — | Called with the new value |
| `options` | `RadioOption[]` | — | Strings, or `{ value, label, description?, disabled? }` |
| `direction` | `"column" \| "row"` | `"column"` | Stack or inline |
| `disabled` | `boolean` | `false` | Disable the whole group |

### Vue

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — | Shared input `name` (required) |
| `modelValue` | `string` | — | Selected value (`v-model`) |
| `options` | `RadioOption[]` | — | Strings, or `{ value, label, description?, disabled? }` |
| `direction` | `"column" \| "row"` | `"column"` | Stack or inline |
| `disabled` | `boolean` | `false` | Disable the whole group |

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-radiogroup` | Group wrapper (`role="radiogroup"`) |
| `.jl-radiogroup--row` | Lay options out inline |
| `.jl-radio` | Per-option `<label>` |
| `.jl-radio__input` | Visually-hidden `<input type="radio">` |
| `.jl-radio__dot` | The drawn radio dot |
| `.jl-radio__body` / `__label` / `__desc` | Text column, label, and description |
| `[data-disabled="true"]` | Disabled styling (on a `.jl-radio`) |
