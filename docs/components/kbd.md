# Kbd

A keyboard key cap for shortcut hints. Pass a single key, or a `keys` array for a combination.
Common tokens are prettified: `mod`/`cmd` → ⌘, `shift` → ⇧, `alt`/`option` → ⌥, `ctrl` → ⌃,
`enter` → ↵, `esc` → Esc, arrows → ↑↓←→.

```bash
jlds add kbd
```

## Usage

<Preview src="/preview/kbd/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/kbd.css">

<kbd class="jl-kbd">K</kbd>
```

```vue [Vue]
<script setup lang="ts">
import { Kbd } from "@/components/ui/kbd"
</script>

<template>
  <Kbd>K</Kbd>
</template>
```

```tsx [React]
import { Kbd } from "@/components/ui/kbd"

<Kbd>K</Kbd>
```

:::

## Combinations

Pass `keys` to render a combination with `+` separators. Tokens are prettified automatically.

<Preview src="/preview/kbd/combo.html" />

::: code-group

```html [HTML]
<span class="jl-kbd-group">
  <kbd class="jl-kbd">⌘</kbd>
  <span class="jl-kbd-group__plus" aria-hidden="true">+</span>
  <kbd class="jl-kbd">K</kbd>
</span>
```

```vue [Vue]
<template>
  <Kbd :keys="['mod', 'k']" />
  <Kbd :keys="['shift', 'enter']" />
</template>
```

```tsx [React]
<Kbd keys={["mod", "k"]} />
<Kbd keys={["shift", "enter"]} />
```

:::

## Sizes

`md` (default) and `sm`.

<Preview src="/preview/kbd/sizes.html" />

::: code-group

```html [HTML]
<kbd class="jl-kbd jl-kbd--sm">Esc</kbd>
<kbd class="jl-kbd">Esc</kbd>
```

```vue [Vue]
<template>
  <Kbd size="sm">Esc</Kbd>
  <Kbd size="md">Esc</Kbd>
</template>
```

```tsx [React]
<Kbd size="sm">Esc</Kbd>
<Kbd size="md">Esc</Kbd>
```

:::

## Props

### React

`Kbd` extends `React.HTMLAttributes<HTMLElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `keys` | `string[]` | — | Key combination, rendered with `+` between caps |
| `size` | `"sm" \| "md"` | `"md"` | Cap size |
| `children` | `React.ReactNode` | — | A single key when `keys` is not used |

### Vue

| Prop | Type | Default | Description |
|---|---|---|---|
| `keys` | `string[]` | — | Key combination |
| `size` | `"sm" \| "md"` | `"md"` | Cap size |

**Slots:** `default` — a single key when `keys` is not used.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-kbd` | Base key cap — always required |
| `.jl-kbd--sm` | Smaller cap |
| `.jl-kbd-group` | Inline wrapper for a combination |
| `.jl-kbd-group__plus` | The `+` separator between caps |
