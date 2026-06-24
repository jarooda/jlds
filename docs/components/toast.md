# Toast

Transient notifications. Fire one from anywhere with `toast()` — no JSX needed at the call site
— and mount the `Toaster` once near your app root. Tones, an optional action, and auto-dismiss.

```bash
jlds add toast
```

## Usage

Mount `Toaster` once; call `toast(...)` from anywhere. In plain HTML the imperative API lives on
`JLDS.toast` and the container is created for you.

<Preview src="/preview/toast/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/toast.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/button.css">
<!-- behavior layer: the imperative JLDS.toast API -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/toast.js" defer></script>

<button class="jl-btn jl-btn--primary jl-btn--md"
        onclick="JLDS.toast.success('Profile updated')">Show toast</button>
```

```vue [Vue]
<script setup lang="ts">
import { Toaster, toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
</script>

<template>
  <!-- mount once near the app root -->
  <Toaster position="bottom-right" />

  <Button @click="toast.success('Profile updated')">Show toast</Button>
</template>
```

```tsx [React]
import { Toaster, toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

// mount once near the app root:
function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Button onClick={() => toast.success("Profile updated")}>Show toast</Button>
    </>
  )
}
```

:::

## Tones, title & action

`toast.success` / `.warning` / `.danger` / `.info`, or pass an options object with a `title`,
`description`, an `action` button, and `duration` (`Infinity` keeps it until dismissed).

<Preview src="/preview/toast/tones.html" />

::: code-group

```html [HTML]
<button class="jl-btn jl-btn--secondary" onclick="JLDS.toast.danger('Could not save')">Danger</button>
<button class="jl-btn jl-btn--secondary"
        onclick="JLDS.toast({ title: 'Deploy failed', description: 'Build #1843 errored.',
                 tone: 'danger', action: { label: 'Retry', onClick: function(){} }, duration: Infinity })">
  With action
</button>
```

```vue [Vue]
<template>
  <Button @click="toast.danger('Could not save')">Danger</Button>
  <Button @click="toast({
    title: 'Deploy failed',
    description: 'Build #1843 errored.',
    tone: 'danger',
    action: { label: 'Retry', onClick: retry },
    duration: Infinity,
  })">With action</Button>
</template>
```

```tsx [React]
<Button onClick={() => toast.danger("Could not save")}>Danger</Button>
<Button onClick={() =>
  toast({
    title: "Deploy failed",
    description: "Build #1843 errored.",
    tone: "danger",
    action: { label: "Retry", onClick: retry },
    duration: Infinity,
  })
}>With action</Button>
```

:::

## API

| Call | Description |
|---|---|
| `toast(opts \| string)` | Fire a toast; returns an id (React/Vue) or the element (HTML) |
| `toast.success/warning/danger/info(description, opts?)` | Toned shorthands |
| `toast.dismiss(id)` | Dismiss by id (HTML: pass the returned element) |

**`ToastOptions`:** `title`, `description`, `tone`, `duration` (ms; `Infinity`/`0` = sticky, default
`4500`), `action: { label, onClick }`, `id` (reuse to update an existing toast).

**`Toaster` (React/Vue)** — `position`: `bottom-right` (default) · `bottom-left` · `top-right` ·
`top-left` · `top-center`. In HTML, pass `position` in the options and the matching container is
created automatically.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-toaster` + `data-pos="…"` | The fixed stack container (auto-created) |
| `.jl-toast` + `--success` / `--warning` / `--danger` / `--info` | A toast and its tone |
| `.jl-toast__icon` / `__body` / `__title` / `__desc` / `__action` / `__close` | Toast parts |
| `[data-leaving="true"]` | Plays the exit animation before removal |
