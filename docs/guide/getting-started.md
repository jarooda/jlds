# Getting Started

This guide covers the CLI workflow for React and Vue projects. Not using a framework? See
[HTML](/guide/vanilla-html) — no install required.

## Install the CLI

JLDS isn't published to crates.io yet — install it from source with
[Rust](https://rustup.rs/) (1.80+):

```bash
git clone https://github.com/jarooda/jlds.git
cd jlds/cli
cargo install --path .
```

Verify it's on your `PATH`:

```bash
jlds --help
```

> Whenever the CLI source changes, re-run `cargo install --path .` to update the globally
> installed `jlds` binary — otherwise your shell keeps using the old build.

## Initialize your project

From the root of a React or Vue project (one that has a `package.json`):

```bash
jlds init
```

`jlds init` auto-detects everything it can from `package.json`:

- **Framework** — React (or Next.js) / Vue (or Nuxt). It errors if neither or both are found.
- **TypeScript** — from `package.json` or the presence of `tsconfig.json`.
- **Tailwind** — detected and version-labeled if present, but not required.

You'll only be prompted for three things:

| Prompt | Default |
|---|---|
| Global CSS file path | `src/index.css` (React) / `src/assets/main.css` (Vue) |
| Components install path | `src/components/ui` |
| Utils install path | `src/lib/utils` |

`jlds init` then writes [`jlds.json`](/cli/#jldsjson-reference) and injects the JLDS design
tokens (colors, typography, spacing, radius, shadows, motion + the Geist font) into your
global CSS file. If that file already has content, the `@import` is hoisted to the top and
the `:root` token block is appended — your existing styles are preserved.

## Add a component

```bash
jlds add button
```

Files land under the path configured in `paths.components` — for example
`src/components/ui/button/`:

```
button/
├── button.css   # .jl-btn class system — variants, sizes, states
├── button.tsx   # self-contained component
└── index.ts     # re-exports Button, ButtonProps, ButtonVariant, ButtonSize
```

(For Vue, the same `button.css` lands alongside `Button.vue` and `index.ts`, referenced via
`<style src="./button.css">`.)

## Use it

::: code-group

```tsx [React]
import { Button } from "@/components/ui/button"

export default function Example() {
  return <Button variant="primary" size="md">Click me</Button>
}
```

```vue [Vue]
<script setup lang="ts">
import { Button } from "@/components/ui/button"
</script>

<template>
  <Button variant="primary" size="md">Click me</Button>
</template>
```

:::

## Next steps

- [Theming](/guide/theming) — re-theme the design tokens
- [Components](/components/) — see what's available and their props
- [CLI Reference](/cli/) — `init`, `add`, `update`, `list`, and the full `jlds.json` schema
