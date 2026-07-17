# Table

A data table — header, sortable columns, hover/selected rows, and numeric (mono, tabular)
alignment. Compose it from `Table.Head`, `Table.Body`, `Table.Row`, `Table.HeaderCell`, and
`Table.Cell`.

In React/Vue, sorting and selection are **controlled** — you keep the state and pass
`sortDirection`/`selected`, handling `onSort`/clicks. In plain HTML, the behavior layer adds
**client-side sorting and checkbox selection** for free.

::: tip On small screens
`Table` scrolls horizontally inside its `.jl-table-wrap`. If you'd rather the rows **reflow into
stacked key/value cards** below a container width, reach for
[Responsive Table](/components/responsive-table) instead — a column/row-driven table built for that
adaptive swap. Use `Table` for rich, sortable, selectable data grids; `Responsive Table` when the
priority is reading cleanly on a phone.
:::

```bash
jlds add table
```

## Usage

<Preview src="/preview/table/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/table.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/checkbox.css">
<!-- behavior layer: click-to-sort + checkbox selection -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/table.js" defer></script>

<div class="jl-table-wrap">
  <table class="jl-table">
    <thead class="jl-table__head">
      <tr>
        <th class="jl-th--select" scope="col">
          <!-- the JLDS Checkbox — same component as /components/checkbox -->
          <label class="jl-check">
            <input type="checkbox" class="jl-check__input" aria-label="Select all">
            <span class="jl-check__box">
              <svg class="jl-check__mark" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.2l2.2 2.3 4.8-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="jl-check__dash"></span>
            </span>
          </label>
        </th>
        <th><button type="button" class="jl-th__btn"><span>Name</span>
          <span class="jl-th__sort"><svg viewBox="0 0 24 24" fill="none"><path d="M8 9l4-4 4 4M8 15l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button></th>
        <th class="jl-th--num jl-th--right"><button type="button" class="jl-th__btn"><span>Amount</span>
          <span class="jl-th__sort"><svg viewBox="0 0 24 24" fill="none"><path d="M8 9l4-4 4 4M8 15l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button></th>
      </tr>
    </thead>
    <tbody class="jl-table__body">
      <tr>
        <td class="jl-td--select">
          <label class="jl-check">
            <input type="checkbox" class="jl-check__input" aria-label="Select row">
            <span class="jl-check__box">
              <svg class="jl-check__mark" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.2l2.2 2.3 4.8-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="jl-check__dash"></span>
            </span>
          </label>
        </td>
        <td>Ada Lovelace</td>
        <td class="jl-td--num jl-td--right">$1,200</td>
      </tr>
      <!-- more rows -->
    </tbody>
  </table>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { ref, computed } from "vue"
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/ui/table"

const rows = [
  { id: 1, name: "Ada Lovelace", amount: 1200 },
  { id: 2, name: "Alan Turing", amount: 980 },
  { id: 3, name: "Grace Hopper", amount: 1530 },
]
const sort = ref<{ col: "name" | "amount"; dir: "asc" | "desc" }>({ col: "name", dir: "asc" })
const selected = ref<number[]>([])

const sorted = computed(() =>
  [...rows].sort((a, b) => {
    const r = a[sort.value.col] > b[sort.value.col] ? 1 : -1
    return sort.value.dir === "asc" ? r : -r
  })
)
function toggleSort(col: "name" | "amount") {
  sort.value = { col, dir: sort.value.col === col && sort.value.dir === "asc" ? "desc" : "asc" }
}
const dirFor = (col: string) => (sort.value.col === col ? sort.value.dir : null)
</script>

<template>
  <Table>
    <TableHead>
      <TableRow>
        <TableHeaderCell sortable :sort-direction="dirFor('name')" @sort="toggleSort('name')">Name</TableHeaderCell>
        <TableHeaderCell numeric align="right" sortable :sort-direction="dirFor('amount')" @sort="toggleSort('amount')">Amount</TableHeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow
        v-for="r in sorted"
        :key="r.id"
        interactive
        :selected="selected.includes(r.id)"
        @click="selected.includes(r.id) ? (selected = selected.filter(i => i !== r.id)) : selected.push(r.id)"
      >
        <TableCell>{{ r.name }}</TableCell>
        <TableCell numeric align="right">${{ r.amount.toLocaleString() }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
```

```tsx [React]
import { useMemo, useState } from "react"
import { Table } from "@/components/ui/table"

const rows = [
  { id: 1, name: "Ada Lovelace", amount: 1200 },
  { id: 2, name: "Alan Turing", amount: 980 },
  { id: 3, name: "Grace Hopper", amount: 1530 },
]

function Example() {
  const [sort, setSort] = useState<{ col: "name" | "amount"; dir: "asc" | "desc" }>({ col: "name", dir: "asc" })
  const [selected, setSelected] = useState<number[]>([])

  const sorted = useMemo(
    () => [...rows].sort((a, b) => {
      const r = a[sort.col] > b[sort.col] ? 1 : -1
      return sort.dir === "asc" ? r : -r
    }),
    [sort]
  )
  const toggleSort = (col: "name" | "amount") =>
    setSort((s) => ({ col, dir: s.col === col && s.dir === "asc" ? "desc" : "asc" }))
  const dirFor = (col: string) => (sort.col === col ? sort.dir : null)
  const toggleRow = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((i) => i !== id) : [...s, id]))

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell sortable sortDirection={dirFor("name")} onSort={() => toggleSort("name")}>Name</Table.HeaderCell>
          <Table.HeaderCell numeric align="right" sortable sortDirection={dirFor("amount")} onSort={() => toggleSort("amount")}>Amount</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sorted.map((r) => (
          <Table.Row key={r.id} interactive selected={selected.includes(r.id)} onClick={() => toggleRow(r.id)}>
            <Table.Cell>{r.name}</Table.Cell>
            <Table.Cell numeric align="right">${r.amount.toLocaleString()}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
```

:::

## Compact & sticky header

`density="compact"` tightens row padding; `stickyHeader` pins the header while the body scrolls.

<Preview src="/preview/table/compact.html" />

::: code-group

```html [HTML]
<div class="jl-table-wrap">
  <table class="jl-table jl-table--compact">
    <thead class="jl-table__head"><tr><th>User</th><th>Role</th><th class="jl-th--right">Seats</th></tr></thead>
    <tbody class="jl-table__body">
      <tr><td>Ada</td><td>Owner</td><td class="jl-td--num jl-td--right">5</td></tr>
    </tbody>
  </table>
</div>
```

```vue [Vue]
<template>
  <Table density="compact" sticky-header>…</Table>
</template>
```

```tsx [React]
<Table density="compact" stickyHeader>…</Table>
```

:::

## Selectable rows

`Table.SelectCell` renders a narrow checkbox column using the JLDS
[Checkbox](/components/checkbox) component, so row selection looks identical to checkboxes elsewhere
in your app. Drive it with `checked` / `indeterminate` / `onChange`; use `header` for the select-all
cell (its `indeterminate` state shows the partial dash). Installing `table` **automatically installs
`checkbox`** (its registry dependency) — `jlds add table` pulls both.

<Preview src="/preview/table/select.html" />

::: code-group

```html [HTML]
<!-- vanilla HTML: use the Checkbox component markup (link css/checkbox.css). The behavior
     layer finds the checkbox by its select cell, so native works too. -->
<th class="jl-th--select" scope="col">
  <label class="jl-check">
    <input type="checkbox" class="jl-check__input" aria-label="Select all rows" />
    <span class="jl-check__box">
      <svg class="jl-check__mark" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.2l2.2 2.3 4.8-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span class="jl-check__dash"></span>
    </span>
  </label>
</th>
<!-- per row: same .jl-check markup inside <td class="jl-td--select"> -->
```

```vue [Vue]
<template>
  <TableRow>
    <TableSelectCell header :checked="all" :indeterminate="some && !all" @change="toggleAll" />
    <TableHeaderCell>Project</TableHeaderCell>
  </TableRow>
  <TableRow v-for="r in rows" :key="r.id" :selected="!!sel[r.id]">
    <TableSelectCell :checked="!!sel[r.id]" @change="toggle(r.id)" />
    <TableCell>{{ r.name }}</TableCell>
  </TableRow>
</template>
```

```tsx [React]
<Table.Row>
  <Table.SelectCell header checked={all} indeterminate={some && !all} onChange={toggleAll} />
  <Table.HeaderCell>Project</Table.HeaderCell>
</Table.Row>
<Table.Row selected={!!sel[r.id]}>
  <Table.SelectCell checked={!!sel[r.id]} onChange={() => toggle(r.id)} />
  <Table.Cell>{r.name}</Table.Cell>
</Table.Row>
```

:::

## Props

### React

| Component | Prop | Type | Default | Description |
|---|---|---|---|---|
| `Table` | `density` | `"comfortable" \| "compact"` | `"comfortable"` | Row padding |
| `Table` | `stickyHeader` | `boolean` | `false` | Pin header on scroll |
| `Table.Row` | `selected` | `boolean` | `false` | Selected highlight |
| `Table.Row` | `interactive` | `boolean` | `false` | Pointer + hover highlight |
| `Table.HeaderCell` | `align` | `"left" \| "center" \| "right"` | `"left"` | Text alignment |
| `Table.HeaderCell` | `numeric` | `boolean` | `false` | Mono tabular header |
| `Table.HeaderCell` | `sortable` | `boolean` | `false` | Render a sort affordance |
| `Table.HeaderCell` | `sortDirection` | `"asc" \| "desc" \| null` | `null` | Current sort state |
| `Table.HeaderCell` | `onSort` | `(e) => void` | — | Fires on header click |
| `Table.Cell` | `align` / `numeric` | — | — | As above, for body cells |
| `Table.SelectCell` | `header` | `boolean` | `false` | Render as a `<th>` select-all cell |
| `Table.SelectCell` | `checked` | `boolean` | `false` | Checked state |
| `Table.SelectCell` | `indeterminate` | `boolean` | `false` | Partial select-all state |
| `Table.SelectCell` | `onChange` | `(e) => void` | — | Toggle handler; React gets the event, Vue's `@change` gets the new boolean |

### Vue

Same options. The compound parts are separate components (`Table`, `TableHead`, `TableBody`,
`TableRow`, `TableHeaderCell`, `TableCell`, `TableSelectCell`); `TableHeaderCell` emits `sort`
instead of `onSort`, and `TableSelectCell` emits `change`.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-table-wrap` | Horizontal-scroll wrapper |
| `.jl-table` + `--compact` / `--sticky` | The table, density, sticky header |
| `.jl-table__head` / `__body` | `<thead>` / `<tbody>` |
| `.jl-th__btn` + `.jl-th__sort` | Sortable header button + sort icon |
| `.jl-th--right` / `--center` / `--num` | Header alignment / numeric |
| `.jl-td--right` / `--center` / `--num` | Cell alignment / numeric |
| `.jl-tr--interactive` / `--selected` | Row hover / selected |
| `.jl-th--select` / `.jl-td--select` | Narrow checkbox column cell (holds the `.jl-check` component, or any checkbox) |
| `.jl-table__check` | Optional compact native checkbox for vanilla HTML (the React/Vue cell uses the Checkbox component) |

**HTML behavior layer:** a sortable header (a `.jl-th__btn`) becomes click-to-sort (numeric
columns via `.jl-th--num`); a checkbox inside each row's `.jl-td--select` cell toggles
`.jl-tr--selected`, and the checkbox in the header's `.jl-th--select` cell toggles all (with
indeterminate). The checkbox can be the native `.jl-table__check` or a full `.jl-check` component —
the behavior finds it by the cell. The table emits `jl-table:sort` and `jl-table:select` events.
