# Tree View

A nested, expandable tree — file explorers, nested navigation, taxonomies. The React and Vue
versions are data-driven via an `items` array with controlled or uncontrolled expand and select, and
full keyboard navigation (arrow keys move/open/close, Enter/Space toggle and select). `guides` draws
the indent rails.

```bash
jlds add tree-view
```

## Usage

<Preview src="/preview/tree-view/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/tree-view.css">
<!-- behavior layer: expand/collapse, select, keyboard nav -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/tree-view.js" defer></script>

<ul class="jl-tree jl-tree--guides" role="tree">
  <li class="jl-tree__li" role="none">
    <div class="jl-tree__row" role="treeitem" data-id="src" data-expanded="true" aria-expanded="true" tabindex="0">
      <span class="jl-tree__twist"><!-- caret svg --></span>
      <span class="jl-tree__label">src</span>
    </div>
    <ul class="jl-tree__group" role="group">
      <li class="jl-tree__li" role="none">
        <div class="jl-tree__row" role="treeitem" data-id="index" tabindex="-1">
          <span class="jl-tree__twist jl-tree__twist--leaf"><!-- caret svg --></span>
          <span class="jl-tree__label">index.ts</span>
        </div>
      </li>
    </ul>
  </li>
</ul>
```

```vue [Vue]
<script setup lang="ts">
import { TreeView, type TreeNode } from "@/components/ui/tree-view"

const items: TreeNode[] = [
  { id: "src", label: "src", children: [
    { id: "components", label: "components", children: [
      { id: "button", label: "Button.tsx" },
    ]},
    { id: "index", label: "index.ts", trailing: "2 kB" },
  ]},
  { id: "readme", label: "README.md" },
]
</script>

<template>
  <TreeView :items="items" :default-expanded="['src']" default-selected="index" />
</template>
```

```tsx [React]
import { TreeView, type TreeNode } from "@/components/ui/tree-view"

const items: TreeNode[] = [
  { id: "src", label: "src", children: [
    { id: "components", label: "components", children: [
      { id: "button", label: "Button.tsx" },
    ]},
    { id: "index", label: "index.ts", trailing: "2 kB" },
  ]},
  { id: "readme", label: "README.md" },
]

<TreeView items={items} defaultExpanded={["src"]} defaultSelected="index" />
```

:::

In HTML, set `data-expanded="true"` on initially-open parent rows (the behavior hides collapsed
groups automatically) and add `jl-tree__twist--leaf` to the caret of leaf rows.

## Props

### React

`TreeView` extends `React.HTMLAttributes<HTMLUListElement>` (minus `onSelect`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `TreeNode[]` | `[]` | The tree data |
| `expanded` | `string[]` | — | Controlled expanded ids |
| `defaultExpanded` | `string[]` | `[]` | Uncontrolled initial expanded ids |
| `onExpandedChange` | `(ids: string[]) => void` | — | Fires on expand/collapse |
| `selected` | `string \| null` | — | Controlled selected id |
| `defaultSelected` | `string \| null` | `null` | Uncontrolled initial selection |
| `onSelect` | `(id, node) => void` | — | Fires on select |
| `guides` | `boolean` | `true` | Draw indent guide rails |

`TreeNode`: `{ id, label, icon?, trailing?, disabled?, children? }`.

### Vue

Same options. `expanded` and `selected` are `v-model` (`v-model:expanded`, `v-model:selected`);
listen with `@select`. `TreeNode.icon` is an inline SVG/HTML string (rendered with `v-html`).

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-tree` + `--guides` | The tree (`role="tree"`) and indent rails |
| `.jl-tree__group` | A nested level (`role="group"`); `[hidden]` when collapsed |
| `.jl-tree__li` / `.jl-tree__row` | A node wrapper and its row (`role="treeitem"`) |
| `[data-expanded]` / `[data-selected]` | Row expand and selection state |
| `.jl-tree__twist` + `--leaf` | Caret (hidden for leaf rows) |
| `.jl-tree__icon` / `__label` / `__trail` | Row parts |
