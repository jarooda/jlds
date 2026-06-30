# Dialog

A centered modal dialog with an overlay. Title, description, body, and a footer (usually
right-aligned buttons). Closes on overlay click, Esc, or the × button. For short blocking
decisions; reach for a [Drawer](/components/drawer) when you need a larger side panel.

```bash
jlds add dialog
```

## Usage

React/Vue are **controlled** — you hold `open` and handle `close`. In plain HTML the behavior
layer wires a trigger + overlay (locking scroll and trapping focus while open).

<Preview src="/preview/dialog/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/dialog.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/button.css">
<!-- behavior layer: open/close, scroll-lock + focus-trap (needs util.js) -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/util.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/dialog.js" defer></script>

<button class="jl-btn jl-btn--primary" data-dialog-trigger data-dialog-target="#confirm">Delete…</button>

<div class="jl-dialog__overlay" id="confirm" hidden>
  <div class="jl-dialog jl-dialog--sm" role="dialog" aria-modal="true">
    <div class="jl-dialog__header">
      <div class="jl-dialog__header-text">
        <div class="jl-dialog__title">Delete project?</div>
        <div class="jl-dialog__desc">This permanently removes the project and its data.</div>
      </div>
      <button type="button" class="jl-dialog__close" aria-label="Close">
        <svg viewBox="0 0 18 18" width="18" height="18" fill="none"><path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="jl-dialog__footer">
      <button class="jl-btn jl-btn--secondary" data-dialog-close>Cancel</button>
      <button class="jl-btn jl-btn--danger" data-dialog-close>Delete</button>
    </div>
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const open = ref(false)
</script>

<template>
  <Button @click="open = true">Delete…</Button>
  <Dialog
    v-model:open="open"
    size="sm"
    title="Delete project?"
    description="This permanently removes the project and its data."
  >
    <template #footer>
      <Button variant="secondary" @click="open = false">Cancel</Button>
      <Button variant="danger" @click="open = false">Delete</Button>
    </template>
  </Dialog>
</template>
```

```tsx [React]
import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const [open, setOpen] = useState(false)

<>
  <Button onClick={() => setOpen(true)}>Delete…</Button>
  <Dialog
    open={open}
    onClose={() => setOpen(false)}
    size="sm"
    title="Delete project?"
    description="This permanently removes the project and its data."
    footer={
      <>
        <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
      </>
    }
  />
</>
```

:::

## Sizes

`sm` (380px) · `md` (460px, default) · `lg` (620px).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Whether it's shown (Vue: `v-model:open`) |
| `onClose` | `() => void` | — | Overlay click / Esc / × (Vue: `@close`) |
| `title` / `description` | `React.ReactNode` | — | Header content |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Max width |
| `mobile` | `"sheet" \| "center"` | `"sheet"` | Below `--bp-mobile`: dock as a bottom sheet, or stay centered ([Responsive](/guide/responsive)) |
| `footer` | `React.ReactNode` | — | Footer (Vue: `footer` slot) |
| `showClose` | `boolean` | `true` | Show the × button |

Body content is `children` (React) / default slot (Vue).

Below `--bp-mobile` the dialog renders as a bottom sheet by default — same `open` / `onClose`.
In HTML, set `data-mobile="center"` on `.jl-dialog__overlay` to keep it centered.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-dialog__overlay` | The fixed backdrop (start it `hidden`) |
| `.jl-dialog` + `--sm` / `--lg` | The panel and size |
| `.jl-dialog__header` / `__title` / `__desc` / `__close` | Header parts |
| `.jl-dialog__body` / `__footer` | Body and footer |

The behavior layer: `[data-dialog-trigger]` (+ optional `data-dialog-target="#id"`) opens it;
`.jl-dialog__close` and any `[data-dialog-close]` (e.g. footer buttons) close it; overlay-click
and Esc also close. Scroll-lock + focus-trap come from `JLDS.util`.
