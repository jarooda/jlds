# Combobox

A searchable select. Single value by default; `multiple` renders selected items as removable
chips, `creatable` lets users add new values from the typed text, and `loading` + `onInputChange`
support async option sets. Full keyboard nav (↑/↓, Enter, Esc).

> The HTML behavior layer covers the common **single-select** case (filter + keyboard + select on
> declarative options). Multi-select chips, creatable, and async are React/Vue features.

```bash
jlds add combobox
```

## Usage

<Preview src="/preview/combobox/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/combobox.css">
<!-- behavior layer: single-select filter + keyboard (needs util.js) -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/util.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/combobox.js" defer></script>

<div class="jl-combobox jl-combobox--md">
  <div class="jl-combobox__control">
    <span class="jl-combobox__field">
      <span class="jl-combobox__single jl-combobox__single--placeholder">Select a framework…</span>
      <input class="jl-combobox__input" role="combobox" aria-expanded="false" aria-autocomplete="list" />
    </span>
    <span class="jl-combobox__adorn">
      <span class="jl-combobox__btn jl-combobox__chevron" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
    </span>
  </div>
  <div class="jl-combobox__pop" role="listbox" hidden>
    <div class="jl-combobox__opt" role="option" data-value="react"><span class="jl-combobox__opt-label">React</span></div>
    <div class="jl-combobox__opt" role="option" data-value="vue"><span class="jl-combobox__opt-label">Vue</span></div>
    <div class="jl-combobox__opt" role="option" data-value="svelte"><span class="jl-combobox__opt-label">Svelte</span></div>
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Combobox } from "@/components/ui/combobox"

const framework = ref<string | null>(null)
</script>

<template>
  <Combobox
    v-model="framework"
    :options="['React', 'Vue', 'Svelte', 'Angular', 'Solid']"
    placeholder="Select a framework…"
  />
</template>
```

```tsx [React]
import { useState } from "react"
import { Combobox } from "@/components/ui/combobox"

const [framework, setFramework] = useState<string | null>(null)

<Combobox
  value={framework}
  onChange={(v) => setFramework(v as string | null)}
  options={["React", "Vue", "Svelte", "Angular", "Solid"]}
  placeholder="Select a framework…"
/>
```

:::

## Multiple, creatable, clearable

`multiple` shows chips; `creatable` adds a “Create …” row; `clearable` adds an × to wipe the
selection. (React/Vue.)

::: code-group

```vue [Vue]
<template>
  <Combobox v-model="tags" :options="opts" multiple creatable clearable placeholder="Add tags…" />
</template>
```

```tsx [React]
<Combobox value={tags} onChange={setTags} options={opts} multiple creatable clearable placeholder="Add tags…" />
```

:::

## Async options

Set `loading` and handle `onInputChange` (Vue: `@input-change`) to fetch options as the user
types — local filtering is disabled while you drive the list.

::: code-group

```tsx [React]
<Combobox options={results} loading={pending} onInputChange={search} placeholder="Search users…" />
```

:::

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `(string \| { value, label, icon?, group?, disabled? })[]` | — | The options |
| `value` / `defaultValue` | `string \| string[] \| null` | — | Controlled / uncontrolled (`v-model` in Vue) |
| `onChange` | `(value) => void` | — | Next value (Vue: `update:modelValue`) |
| `multiple` | `boolean` | `false` | Multi-select chips |
| `creatable` | `boolean` | `false` | Add new values from typed text |
| `loading` | `boolean` | `false` | Spinner + `loadingMessage` |
| `onInputChange` | `(query) => void` | — | Per-keystroke; disables local filtering (Vue: `@input-change`) |
| `clearable` | `boolean` | `false` | Show an × to clear |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Control height |
| `disabled` / `invalid` | `boolean` | `false` | States |
| `placeholder` / `emptyMessage` / `loadingMessage` | `string` | — | Copy |

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-combobox` + `--sm/md/lg` / `--open` / `--invalid` / `--disabled` | Root + size + states |
| `.jl-combobox__control` / `__field` / `__input` / `__single` | The input control |
| `.jl-combobox__chip` / `__chip-x` | Multi-select chips |
| `.jl-combobox__pop` | The options popup (start it `hidden`) |
| `.jl-combobox__opt` + `[data-active]` / `[aria-selected]` | An option (set `data-value`) |
| `.jl-combobox__opt-label` / `__opt-icon` / `__opt-check` | Option parts |
| `.jl-combobox__chevron` / `__spinner` | Chevron / loading spinner |
