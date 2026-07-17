# Pagination

Page navigation for tables and lists. Previous/next arrows, numbered pages that collapse to
"…" around the current page, and an optional "1–20 of 482" summary. It's **controlled** — you
track the page and update it on change.

```bash
jlds add pagination
```

## Usage

<Preview src="/preview/pagination/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/pagination.css">

<nav class="jl-pagination" aria-label="Pagination">
  <div class="jl-pagination__list">
    <button class="jl-page jl-page--arrow" aria-label="Previous page">‹</button>
    <button class="jl-page" aria-label="Page 1">1</button>
    <button class="jl-page" aria-current="page" aria-label="Page 2">2</button>
    <button class="jl-page" aria-label="Page 3">3</button>
    <button class="jl-page jl-page--arrow" aria-label="Next page">›</button>
  </div>
</nav>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Pagination } from "@/components/ui/pagination"

const page = ref(2)
</script>

<template>
  <Pagination v-model:page="page" :page-count="10" />
</template>
```

```tsx [React]
import { useState } from "react"
import { Pagination } from "@/components/ui/pagination"

const [page, setPage] = useState(2)

<Pagination page={page} pageCount={10} onChange={setPage} />
```

:::

## Collapsed (many pages)

With many pages, the middle collapses to "…" — `siblingCount` controls how many neighbors stay
visible around the current page.

<Preview src="/preview/pagination/collapse.html" />

::: code-group

```html [HTML]
<nav class="jl-pagination" aria-label="Pagination">
  <div class="jl-pagination__list">
    <button class="jl-page jl-page--arrow" aria-label="Previous page">‹</button>
    <button class="jl-page" aria-label="Page 1">1</button>
    <span class="jl-page jl-page--ellipsis" aria-hidden="true">…</span>
    <button class="jl-page" aria-label="Page 5">5</button>
    <button class="jl-page" aria-current="page" aria-label="Page 6">6</button>
    <button class="jl-page" aria-label="Page 7">7</button>
    <span class="jl-page jl-page--ellipsis" aria-hidden="true">…</span>
    <button class="jl-page" aria-label="Page 20">20</button>
    <button class="jl-page jl-page--arrow" aria-label="Next page">›</button>
  </div>
</nav>
```

```vue [Vue]
<template>
  <Pagination v-model:page="page" :page-count="20" :sibling-count="1" />
</template>
```

```tsx [React]
<Pagination page={page} pageCount={20} siblingCount={1} onChange={setPage} />
```

:::

## With summary

Pass `total`, `pageSize`, and `showSummary` for the "1–20 of 482" readout on the left.

<Preview src="/preview/pagination/summary.html" />

::: code-group

```html [HTML]
<nav class="jl-pagination" aria-label="Pagination">
  <div class="jl-pagination__summary"><b>1–20</b> of <b>482</b></div>
  <div class="jl-pagination__spacer"></div>
  <div class="jl-pagination__list"><!-- page buttons --></div>
</nav>
```

```vue [Vue]
<template>
  <Pagination
    v-model:page="page"
    :page-count="25"
    :total="482"
    :page-size="20"
    show-summary
  />
</template>
```

```tsx [React]
<Pagination
  page={page}
  pageCount={25}
  total={482}
  pageSize={20}
  showSummary
  onChange={setPage}
/>
```

:::

## Rows per page

Pass `pageSizeOptions` (with `pageSize`) to render a rows-per-page selector alongside the pager.

<Preview src="/preview/pagination/page-size.html" />

::: code-group

```html [HTML]
<label class="jl-pagination__size">
  <span>Rows</span>
  <select aria-label="Rows per page">
    <option>10</option><option selected>25</option><option>50</option>
  </select>
</label>
```

```vue [Vue]
<template>
  <Pagination
    v-model:page="page"
    v-model:page-size="size"
    :page-count="24"
    :total="578"
    show-summary
    :page-size-options="[10, 25, 50]"
    @page-size-change="page = 1"
  />
</template>
```

```tsx [React]
<Pagination
  page={page}
  pageCount={24}
  total={578}
  pageSize={size}
  showSummary
  pageSizeOptions={[10, 25, 50]}
  onPageSizeChange={(s) => { setSize(s); setPage(1); }}
  onChange={setPage}
/>
```

:::

## Props

### React

`Pagination` extends `React.HTMLAttributes<HTMLElement>` (minus `onChange`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `page` | `number` | `1` | Current page (1-based) |
| `pageCount` | `number` | — | Total number of pages (required) |
| `total` | `number` | — | Record count — for the summary |
| `pageSize` | `number` | — | Records per page — for the summary |
| `pageSizeOptions` | `number[]` | — | Rows-per-page options; renders a selector |
| `onPageSizeChange` | `(size: number) => void` | — | Fires when a page size is chosen |
| `siblingCount` | `number` | `1` | Pages shown each side of current before "…" |
| `showSummary` | `boolean` | `false` | Show the "1–20 of 482" summary |
| `onChange` | `(page: number) => void` | — | Fires with the next page |

### Vue

Same props. Supports `v-model:page` and `v-model:page-size` (also emits `change` and
`pageSizeChange`).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-pagination` | Wrapper (`nav`) |
| `.jl-pagination__summary` | The "1–20 of 482" readout |
| `.jl-pagination__spacer` | Pushes the page list to the right |
| `.jl-pagination__size` | Rows-per-page selector wrapper |
| `.jl-pagination__list` | The control group |
| `.jl-page` | A page button (use `aria-current="page"` for the active one) |
| `.jl-page--arrow` | Previous/next arrow buttons |
| `.jl-page--ellipsis` | The "…" gap |
