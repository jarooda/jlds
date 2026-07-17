# Accordion

Collapsible sections. Single-open by default (an FAQ), or `type="multiple"` to allow several at
once. `bordered` (one panel) or `separated` (gapped cards). The panel animates open with a
`grid-template-rows` transition — no fixed heights.

```bash
jlds add accordion
```

## Usage

<Preview src="/preview/accordion/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/accordion.css">
<!-- behavior layer: open/close on click -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/accordion.js" defer></script>

<div class="jl-accordion jl-accordion--bordered">
  <div class="jl-acc-item" data-open="true">
    <h3 style="margin:0">
      <button type="button" class="jl-acc-trigger" aria-expanded="true" aria-controls="a1">
        <span class="jl-acc-trigger__label">What is JLDS?</span>
        <span class="jl-acc-trigger__chevron"><svg viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </button>
    </h3>
    <div class="jl-acc-region" id="a1" role="region">
      <div class="jl-acc-content"><div class="jl-acc-content__inner">A component CLI — you own the code.</div></div>
    </div>
  </div>
  <!-- more .jl-acc-item blocks -->
</div>
```

```vue [Vue]
<script setup lang="ts">
import { Accordion, AccordionItem } from "@/components/ui/accordion"
</script>

<template>
  <Accordion type="single" default-value="what">
    <AccordionItem value="what" title="What is JLDS?">
      A component CLI — you own the code.
    </AccordionItem>
    <AccordionItem value="how" title="How does it work?">
      Run <code>jlds add &lt;name&gt;</code> and the files land in your project.
    </AccordionItem>
  </Accordion>
</template>
```

```tsx [React]
import { Accordion } from "@/components/ui/accordion"

<Accordion type="single" defaultValue="what">
  <Accordion.Item value="what" title="What is JLDS?">
    A component CLI — you own the code.
  </Accordion.Item>
  <Accordion.Item value="how" title="How does it work?">
    Run <code>jlds add &lt;name&gt;</code> and the files land in your project.
  </Accordion.Item>
</Accordion>
```

:::

## Multiple open

Set `type="multiple"` (React/Vue) or `data-type="multiple"` on the container (HTML) to let
several panels stay open.

<Preview src="/preview/accordion/multiple.html" />

::: code-group

```html [HTML]
<div class="jl-accordion jl-accordion--bordered" data-type="multiple">
  <!-- items … -->
</div>
```

```vue [Vue]
<template>
  <Accordion type="multiple" :default-value="['a', 'b']">
    <AccordionItem value="a" title="First">…</AccordionItem>
    <AccordionItem value="b" title="Second">…</AccordionItem>
  </Accordion>
</template>
```

```tsx [React]
<Accordion type="multiple" defaultValue={["a", "b"]}>
  <Accordion.Item value="a" title="First">…</Accordion.Item>
  <Accordion.Item value="b" title="Second">…</Accordion.Item>
</Accordion>
```

:::

## Separated

`variant="separated"` renders each item as its own gapped card.

<Preview src="/preview/accordion/separated.html" />

::: code-group

```html [HTML]
<div class="jl-accordion jl-accordion--separated">
  <!-- items … -->
</div>
```

```vue [Vue]
<template>
  <Accordion variant="separated">…</Accordion>
</template>
```

```tsx [React]
<Accordion variant="separated">…</Accordion>
```

:::

## Header meta

`Accordion.Item` accepts a `meta` node (React) or `meta` slot (Vue) for right-aligned trailing
content — a badge, count, or hint — shown before the chevron.

<Preview src="/preview/accordion/meta.html" />

::: code-group

```html [HTML]
<button type="button" class="jl-acc-trigger" aria-expanded="true" aria-controls="m1">
  <span class="jl-acc-trigger__label">Environments</span>
  <span class="jl-acc-trigger__meta"><span class="jl-badge jl-badge--brand jl-badge--pill">3</span></span>
  <span class="jl-acc-trigger__chevron">…</span>
</button>
```

```vue [Vue]
<template>
  <Accordion default-value="a">
    <AccordionItem value="a" title="Environments">
      <template #meta><Badge color="brand" pill>3</Badge></template>
      Production, Preview, and Development.
    </AccordionItem>
  </Accordion>
</template>
```

```tsx [React]
<Accordion defaultValue="a">
  <Accordion.Item value="a" title="Environments" meta={<Badge color="brand" pill>3</Badge>}>
    Production, Preview, and Development.
  </Accordion.Item>
</Accordion>
```

:::

## Props

### React

`Accordion` extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `"single" \| "multiple"` | `"single"` | One or several panels open |
| `variant` | `"bordered" \| "separated"` | `"bordered"` | Visual treatment |
| `defaultValue` | `string \| string[]` | — | Initially-open item value(s) |

`Accordion.Item` props: `value` (stable id), `title` (header), `icon`, `meta` (trailing header
content), `disabled`.

### Vue

Same options. `Accordion` + `AccordionItem` (each item needs a `value`); pass the header via the
`title` prop, and optional `icon` / `meta` slots.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-accordion` + `--bordered` / `--separated` | Container and variant |
| `[data-type="multiple"]` | On the container: allow several open |
| `.jl-acc-item` + `[data-open="true"]` | A section and its open state |
| `.jl-acc-trigger` + `__label` / `__icon` / `__meta` / `__chevron` | The header button parts |
| `.jl-acc-region` / `.jl-acc-content` / `__inner` | The animated collapsible panel |
