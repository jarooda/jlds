# Snippet

Copyable code. An inline single-line command pill by default, or a multi-line `block` with an
optional title bar, language tag, and line numbers. Both include a one-click copy button.

> The copy button needs JavaScript. With React/Vue it just works. For plain HTML, include the
> JLDS [behavior layer](/guide/vanilla-html#interactivity-optional) and copy is wired up
> automatically:
>
> ```html
> <script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/all.js" defer></script>
> ```

```bash
jlds add snippet
```

## Inline

A single command, with a `$` prompt by default.

<Preview src="/preview/snippet/inline.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/snippet.css">
<!-- behavior layer: wires up the copy button -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/all.js" defer></script>

<span class="jl-snippet">
  <span class="jl-snippet__prompt">$</span>
  <span class="jl-snippet__code">npx @jarooda/jlds add button</span>
  <button type="button" class="jl-snippet__copy" aria-label="Copy">
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.4" />
      <path d="M3.5 10.5A1.5 1.5 0 0 1 2.5 9V3.5A1.5 1.5 0 0 1 4 2h5a1.5 1.5 0 0 1 1.5 1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
    </svg>
  </button>
</span>
```

```vue [Vue]
<script setup lang="ts">
import { Snippet } from "@/components/ui/snippet"
</script>

<template>
  <Snippet>npx @jarooda/jlds add button</Snippet>
</template>
```

```tsx [React]
import { Snippet } from "@/components/ui/snippet"

<Snippet>npx @jarooda/jlds add button</Snippet>
```

:::

## Block

Set `variant="block"` and pass the code as `code`. Add a `title` and/or `language` to show the
top bar.

<Preview src="/preview/snippet/block.html" />

::: code-group

```html [HTML]
<div class="jl-codeblock">
  <div class="jl-codeblock__bar">
    <span class="jl-codeblock__title">jlds.json</span>
    <span class="jl-codeblock__lang">json</span>
    <button type="button" class="jl-codeblock__copy">…Copy</button>
  </div>
  <div class="jl-codeblock__scroll">
    <pre><code><span class="jl-codeblock__row">{
</span><span class="jl-codeblock__row">  "framework": "react"
</span><span class="jl-codeblock__row">}</span></code></pre>
  </div>
</div>
```

```vue [Vue]
<template>
  <Snippet
    variant="block"
    title="jlds.json"
    language="json"
    :code="'{\n  \"framework\": \"react\"\n}'"
  />
</template>
```

```tsx [React]
<Snippet
  variant="block"
  title="jlds.json"
  language="json"
  code={`{\n  "framework": "react"\n}`}
/>
```

:::

## Line numbers

Add `lineNumbers` (block only) for a gutter.

<Preview src="/preview/snippet/numbered.html" />

::: code-group

```html [HTML]
<div class="jl-codeblock jl-codeblock--numbered jl-codeblock--barless">
  <div class="jl-codeblock__scroll">
    <pre><code><span class="jl-codeblock__row">import { Button } from "@/components/ui/button"
</span><span class="jl-codeblock__row">
</span><span class="jl-codeblock__row">export const App = () => <Button>Go</Button></span></code></pre>
  </div>
</div>
```

```vue [Vue]
<template>
  <Snippet variant="block" line-numbers :code="source" />
</template>
```

```tsx [React]
<Snippet variant="block" lineNumbers code={source} />
```

:::

## Props

### React

`Snippet` extends `React.HTMLAttributes<HTMLElement>` (minus `children`'s type override).

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | — | Inline command (or styled content) |
| `code` | `string` | — | Explicit copy text — required for `block` |
| `variant` | `"inline" \| "block"` | `"inline"` | Inline pill or multi-line block |
| `prompt` | `React.ReactNode` | `"$"` inline, none block | Leading prompt glyph |
| `language` | `string` | — | Language tag (also shows the block bar) |
| `title` | `React.ReactNode` | — | Title (also shows the block bar) |
| `lineNumbers` | `boolean` | `false` | Gutter line numbers (block only) |
| `copyable` | `boolean` | `true` | Show the copy affordance |

### Vue

Same options. Pass inline content in the default slot; pass block content via `:code`. Boolean
props are kebab-case (`line-numbers`).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-snippet` | Inline pill — `__prompt`, `__code`, `__copy` parts |
| `.jl-codeblock` | Block container |
| `.jl-codeblock--numbered` | Show the line-number gutter |
| `.jl-codeblock--barless` | No top bar — copy button floats top-right |
| `.jl-codeblock__bar` / `__title` / `__lang` / `__copy` | Top bar parts |
| `.jl-codeblock__scroll` / `__row` | Scroll area and per-line rows |
