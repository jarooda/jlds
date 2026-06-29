# Timeline

A vertical activity feed. Each entry is a dot on a connecting rail with a title, optional
timestamp, description, and arbitrary trailing content. Give a dot a `tone` for status colour, or
an `icon` for a filled marker — without one it renders as a small plain dot. Display-only, so plain
HTML needs no JavaScript.

```bash
jlds add timeline
```

## Usage

<Preview src="/preview/timeline/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/timeline.css">

<ol class="jl-timeline">
  <li class="jl-timeline__item">
    <div class="jl-timeline__rail">
      <span class="jl-timeline__dot" data-tone="accent" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
      <span class="jl-timeline__line" aria-hidden="true"></span>
    </div>
    <div class="jl-timeline__body">
      <div class="jl-timeline__head">
        <span class="jl-timeline__title">Order placed</span>
        <span class="jl-timeline__time">2h ago</span>
      </div>
      <div class="jl-timeline__desc">We received your order and sent a confirmation email.</div>
    </div>
  </li>
  <!-- more .jl-timeline__item blocks; the last item's line is hidden automatically -->
</ol>
```

```vue [Vue]
<script setup lang="ts">
import { Timeline, TimelineItem } from "@/components/ui/timeline"
</script>

<template>
  <Timeline>
    <TimelineItem title="Order placed" time="2h ago" tone="accent"
      description="We received your order and sent a confirmation email." />
    <TimelineItem title="Payment confirmed" time="1h ago" tone="success"
      description="Your card was charged $48.00." />
    <TimelineItem title="Preparing shipment" time="Now"
      description="Your items are being packed at the warehouse." />
  </Timeline>
</template>
```

```tsx [React]
import { Timeline } from "@/components/ui/timeline"

<Timeline>
  <Timeline.Item title="Order placed" time="2h ago" tone="accent"
    description="We received your order and sent a confirmation email." />
  <Timeline.Item title="Payment confirmed" time="1h ago" tone="success"
    description="Your card was charged $48.00." />
  <Timeline.Item title="Preparing shipment" time="Now"
    description="Your items are being packed at the warehouse." />
</Timeline>
```

:::

Both React and Vue also accept a data-driven `items` array instead of children — pass
`[{ title, time, description, tone }]`.

## Small & plain

`size="sm"` tightens the rail; omit `icon` for a compact dot-only feed.

<Preview src="/preview/timeline/plain.html" />

::: code-group

```html [HTML]
<ol class="jl-timeline jl-timeline--sm">
  <li class="jl-timeline__item">
    <div class="jl-timeline__rail">
      <span class="jl-timeline__dot" data-tone="accent" data-plain="true" aria-hidden="true"></span>
      <span class="jl-timeline__line" aria-hidden="true"></span>
    </div>
    <div class="jl-timeline__body">
      <div class="jl-timeline__head">
        <span class="jl-timeline__title">Pushed 3 commits</span>
        <span class="jl-timeline__time">09:24</span>
      </div>
    </div>
  </li>
  <!-- … -->
</ol>
```

```vue [Vue]
<template>
  <Timeline size="sm">
    <TimelineItem title="Pushed 3 commits" time="09:24" tone="accent" />
    <TimelineItem title="Opened pull request #128" time="09:31" />
    <TimelineItem title="Merged to main" time="10:02" tone="success" />
  </Timeline>
</template>
```

```tsx [React]
<Timeline size="sm">
  <Timeline.Item title="Pushed 3 commits" time="09:24" tone="accent" />
  <Timeline.Item title="Opened pull request #128" time="09:31" />
  <Timeline.Item title="Merged to main" time="10:02" tone="success" />
</Timeline>
```

:::

## Props

### React

`Timeline` extends `React.HTMLAttributes<HTMLOListElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `TimelineItemData[]` | — | Data-driven entries (omit when using `Timeline.Item` children) |
| `size` | `"sm" \| "md"` | `"md"` | Rail density |

`Timeline.Item` props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `ReactNode` | — | Entry headline |
| `time` | `ReactNode` | — | Right-aligned timestamp |
| `description` | `ReactNode` | — | Secondary text under the title |
| `tone` | `"accent" \| "success" \| "warning" \| "danger" \| "info" \| "muted"` | `"muted"` | Dot colour |
| `icon` | `ReactNode` | — | Marker glyph; without one the dot is a small plain circle |

### Vue

`Timeline` (`size`, `items`) + `TimelineItem` (`title`, `time`, `description`, `tone`). Pass a
marker via the `icon` slot and trailing content via the default slot.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-timeline` + `--sm` | The feed list and compact size |
| `.jl-timeline__item` | One entry (last item's line is hidden) |
| `.jl-timeline__rail` / `__dot` / `__line` | The marker column |
| `.jl-timeline__dot[data-tone]` | Dot colour (`accent`, `success`, `warning`, `danger`, `info`, `muted`) |
| `.jl-timeline__dot[data-plain="true"]` | Small dot with no icon |
| `.jl-timeline__body` / `__head` / `__title` / `__time` / `__desc` / `__extra` | The content column |
