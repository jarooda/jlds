# Responsive Table

A data table that renders as a real `<table>` on wide containers and **transforms into a stacked
key/value card list** when its container narrows past `breakpoint`. Tier-2 adaptive — same columns
and data, presentation flips by available width (measured per-container, so it adapts inside a pane,
not just at the viewport).

```bash
jlds add responsive-table
```

## Usage

<Preview src="/preview/responsive-table/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/responsive-table.css">
<!-- behavior layer: table ⇄ cards swap -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/responsive-table.js" defer></script>

<div class="jl-rtable" data-breakpoint="560">
  <table class="jl-rtable__table">
    <thead>
      <tr>
        <th data-primary>Project</th>
        <th>Environment</th>
        <th class="jl-rtable--num">Build</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>acme-web</td><td>Production</td><td class="jl-rtable--num">#1843</td></tr>
    </tbody>
  </table>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { Badge } from "@/components/ui/badge"

const columns = [
  { key: "name", header: "Project", primary: true },
  { key: "env", header: "Environment" },
  { key: "status", header: "Status" },
  { key: "build", header: "Build", numeric: true },
]
</script>

<template>
  <ResponsiveTable :columns="columns" :data="rows" :breakpoint="560" @row-click="open">
    <template #cell-status="{ value }"><Badge :color="tone(value)" dot>{{ value }}</Badge></template>
  </ResponsiveTable>
</template>
```

```tsx [React]
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { Badge } from "@/components/ui/badge"

const columns = [
  { key: "name", header: "Project", primary: true },
  { key: "env", header: "Environment" },
  { key: "status", header: "Status", render: (v) => <Badge color={tone(v)} dot>{v}</Badge> },
  { key: "build", header: "Build", numeric: true },
]

<ResponsiveTable columns={columns} data={rows} breakpoint={560} onRowClick={open} />
```

:::

Mark one column `primary` — it becomes the card title in stacked mode (defaults to the first). Use
`numeric` for right-aligned mono figures, and `hideOnStack` to keep a column table-only.

## Props

### React

`ResponsiveTable` extends `React.HTMLAttributes<HTMLDivElement>` (minus `onClick`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `ResponsiveColumn[]` | — | Column definitions, left to right |
| `data` | `Row[]` | — | Row objects |
| `rowKey` | `(row, i) => Key` | `row.id ?? i` | Stable key per row |
| `onRowClick` | `(row) => void` | — | Makes rows/cards interactive |
| `breakpoint` | `number` | `560` | Container width (px) below which it stacks |

Each `ResponsiveColumn` is `{ key, header, render?, numeric?, align?, primary?, hideOnStack? }`.

### Vue

Same options, minus `render` — supply a custom cell with a scoped slot named `#cell-<key>`
(`{ value, row }`). `onRowClick` becomes the `row-click` emit.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-rtable` | Root (self-measuring container); `data-breakpoint` sets the stack width |
| `.jl-rtable__table` | The real table (shown on wide containers) |
| `.jl-rtable--num` | Right-aligned mono column (on `th`/`td`) |
| `.jl-rtable__cards` / `__card` | Generated stacked-card view |
| `.jl-rtable__card-primary` / `__pair` / `__k` / `__v` | Card title, key/value rows |

Table headers drive the cards: add `data-primary` to the title column, `class="jl-rtable--num"` for
numeric fields, and `data-hide-on-stack` to omit a column from the cards. Optional `data-clickable`
makes rows/cards emit `jl-rtable:rowclick`.
