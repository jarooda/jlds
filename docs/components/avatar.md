# Avatar

A user avatar: an image with an automatic initials fallback (color derived from the name) and
an optional presence dot. `AvatarGroup` stacks several with an optional "+N" overflow chip.

```bash
jlds add avatar
```

## Usage

In React/Vue, pass `name` and an optional `src` — initials and a stable fallback color are
derived automatically. In plain HTML there's no JS, so set the initials, background color, and
size yourself.

<Preview src="/preview/avatar/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/avatar.css">

<!-- image -->
<span class="jl-avatar" style="width: 36px; height: 36px">
  <img class="jl-avatar__img" src="/avatar.jpg" alt="Ada Lovelace" />
</span>

<!-- initials fallback -->
<span class="jl-avatar" style="width: 36px; height: 36px; font-size: 14px; background: #1b8a64">
  AL
</span>
```

```vue [Vue]
<script setup lang="ts">
import { Avatar } from "@/components/ui/avatar"
</script>

<template>
  <Avatar name="Ada Lovelace" src="/avatar.jpg" />
  <Avatar name="Ada Lovelace" />
</template>
```

```tsx [React]
import { Avatar } from "@/components/ui/avatar"

<Avatar name="Ada Lovelace" src="/avatar.jpg" />
<Avatar name="Ada Lovelace" />
```

:::

## Sizes

`xs` (22px) · `sm` (28px) · `md` (36px, default) · `lg` (48px) · `xl` (64px). You can also pass
a pixel number.

<Preview src="/preview/avatar/sizes.html" />

::: code-group

```html [HTML]
<span class="jl-avatar" style="width: 22px; height: 22px; font-size: 10px; background: #2ea67c">A</span>
<span class="jl-avatar" style="width: 36px; height: 36px; font-size: 14px; background: #2ea67c">A</span>
<span class="jl-avatar" style="width: 64px; height: 64px; font-size: 26px; background: #2ea67c">A</span>
```

```vue [Vue]
<template>
  <Avatar name="Ada" size="xs" />
  <Avatar name="Ada" size="md" />
  <Avatar name="Ada" size="xl" />
</template>
```

```tsx [React]
<Avatar name="Ada" size="xs" />
<Avatar name="Ada" size="md" />
<Avatar name="Ada" size="xl" />
```

:::

## Status & square

Add a `status` presence dot, or `square` for rounded-square corners.

<Preview src="/preview/avatar/status.html" />

::: code-group

```html [HTML]
<span class="jl-avatar" style="width: 44px; height: 44px; font-size: 17px; background: #0ea5e9">
  AL
  <span class="jl-avatar__status jl-avatar__status--online"></span>
</span>
<span class="jl-avatar jl-avatar--square" style="width: 44px; height: 44px; font-size: 17px; background: #7c5cff">
  JW
</span>
```

```vue [Vue]
<template>
  <Avatar name="Ada Lovelace" :size="44" status="online" />
  <Avatar name="Jalu Wibowo" :size="44" square />
</template>
```

```tsx [React]
<Avatar name="Ada Lovelace" size={44} status="online" />
<Avatar name="Jalu Wibowo" size={44} square />
```

:::

## Group

`AvatarGroup` overlaps avatars and collapses overflow past `max` into a "+N" chip.

<Preview src="/preview/avatar/group.html" />

::: code-group

```html [HTML]
<span class="jl-avatar-group">
  <span class="jl-avatar" style="width: 36px; height: 36px; font-size: 14px; background: #1b8a64">AL</span>
  <span class="jl-avatar" style="width: 36px; height: 36px; font-size: 14px; background: #0ea5e9">JW</span>
  <span class="jl-avatar" style="width: 36px; height: 36px; font-size: 14px; background: #f59e0b">RT</span>
  <span class="jl-avatar-group__more" style="width: 36px; height: 36px">+3</span>
</span>
```

```vue [Vue]
<template>
  <AvatarGroup :max="3">
    <Avatar name="Ada Lovelace" />
    <Avatar name="Jalu Wibowo" />
    <Avatar name="Rosa Turing" />
    <Avatar name="Grace Hopper" />
    <Avatar name="Alan Kay" />
    <Avatar name="Don Norman" />
  </AvatarGroup>
</template>
```

```tsx [React]
<AvatarGroup max={3}>
  <Avatar name="Ada Lovelace" />
  <Avatar name="Jalu Wibowo" />
  <Avatar name="Rosa Turing" />
  <Avatar name="Grace Hopper" />
  <Avatar name="Alan Kay" />
  <Avatar name="Don Norman" />
</AvatarGroup>
```

:::

## Props

### React — `Avatar`

`Avatar` extends `React.HTMLAttributes<HTMLSpanElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — | Image URL; falls back to initials when absent |
| `name` | `string` | `""` | Drives initials and the fallback color |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| number` | `"md"` | Named size or pixel number |
| `square` | `boolean` | `false` | Rounded square instead of circle |
| `status` | `"online" \| "busy" \| "away" \| "offline"` | — | Presence dot |
| `ring` | `boolean` | `false` | Surface-colored ring (for colored backgrounds) |

### React — `AvatarGroup`

| Prop | Type | Default | Description |
|---|---|---|---|
| `max` | `number` | — | Max avatars before collapsing into "+N" |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| number` | `"md"` | Size applied to the overflow chip |

### Vue

`Avatar` takes the same props as React. `AvatarGroup` takes `max` and `size`; pass `Avatar`
children in the default slot.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-avatar` | Base avatar — set `width`/`height`/`font-size`/`background` inline |
| `.jl-avatar--square` | Rounded-square corners |
| `.jl-avatar__img` | Image element inside the avatar |
| `.jl-avatar__status` + `--online` / `--busy` / `--away` / `--offline` | Presence dot |
| `.jl-avatar__ring` | Surface-colored ring |
| `.jl-avatar-group` | Overlapping stack wrapper |
| `.jl-avatar-group__more` | The "+N" overflow chip |
