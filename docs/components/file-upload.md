# File Upload

A drag-and-drop dropzone with a click-to-browse fallback and a list of selected files. The HTML
version (`file-upload.js`) opens the picker, highlights on drag, and renders picked files as rows;
React/Vue add a controlled `files` list so you can drive real upload progress and status.

```bash
jlds add file-upload
```

## Usage

Drop files on the zone or click to browse. Picked files appear below with a remove button.

<Preview src="/preview/file-upload/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/file-upload.css">
<!-- behavior layer: open picker, drag highlight, render rows -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/util.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/file-upload.js" defer></script>

<div class="jl-upload">
  <div class="jl-upload__zone" role="button" tabindex="0">
    <span class="jl-upload__mark">
      <svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0L7 9m5-5 5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <div class="jl-upload__title"><b>Click to upload</b> or drag and drop</div>
    <div class="jl-upload__hint">PNG, JPG, PDF · up to 5 MB</div>
    <input type="file" accept=".png,.jpg,.pdf" multiple style="display:none" />
  </div>
</div>
```

```vue [Vue]
<script setup lang="ts">
import { FileUpload } from "@/components/ui/file-upload"
</script>

<template>
  <FileUpload accept=".png,.jpg,.pdf" multiple :max-size="5 * 1024 * 1024"
    @files="(files) => console.log(files)" />
</template>
```

```tsx [React]
import { FileUpload } from "@/components/ui/file-upload"

<FileUpload
  accept=".png,.jpg,.pdf"
  multiple
  maxSize={5 * 1024 * 1024}
  onFiles={(files) => console.log(files)}
/>
```

:::

## With a controlled list

Pass `files` to render upload progress and per-file status (`done`, `uploading`, `error`). In HTML
the rows are static markup you maintain yourself.

<Preview src="/preview/file-upload/list.html" />

::: code-group

```html [HTML]
<div class="jl-upload jl-upload--sm">
  <div class="jl-upload__zone" role="button" tabindex="0"><!-- … --></div>
  <ul class="jl-upload__list">
    <li class="jl-upload__item" data-status="done">
      <span class="jl-upload__fileicon"><!-- file icon --></span>
      <div class="jl-upload__meta">
        <div class="jl-upload__name">brand-guidelines.pdf</div>
        <div class="jl-upload__size">2.4 MB</div>
      </div>
      <span class="jl-upload__status" data-status="done"><!-- check --></span>
      <button type="button" class="jl-upload__remove" aria-label="Remove"><!-- × --></button>
    </li>
    <!-- data-status="uploading" adds a .jl-upload__bar; "error" tints it red -->
  </ul>
</div>
```

```vue [Vue]
<template>
  <FileUpload
    size="sm"
    :files="[
      { name: 'brand-guidelines.pdf', size: 2_400_000, status: 'done' },
      { name: 'hero-render.png', size: 8_100_000, status: 'uploading', progress: 62 },
      { name: 'archive.zip', size: 120_000_000, status: 'error', error: 'Exceeds 50 MB limit' },
    ]"
    @remove="(i) => console.log('remove', i)"
  />
</template>
```

```tsx [React]
<FileUpload
  size="sm"
  files={[
    { name: "brand-guidelines.pdf", size: 2_400_000, status: "done" },
    { name: "hero-render.png", size: 8_100_000, status: "uploading", progress: 62 },
    { name: "archive.zip", size: 120_000_000, status: "error", error: "Exceeds 50 MB limit" },
  ]}
  onRemove={(i) => console.log("remove", i)}
/>
```

:::

## Props

### React

`FileUpload` extends `React.HTMLAttributes<HTMLDivElement>` (minus `onChange`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `accept` | `string` | — | Comma-separated `accept` list for the input |
| `multiple` | `boolean` | `false` | Allow selecting more than one file |
| `maxSize` | `number` | — | Max bytes per file (larger files are dropped) |
| `disabled` | `boolean` | `false` | Disable the dropzone |
| `size` | `"sm" \| "md"` | `"md"` | Dropzone padding |
| `hint` | `ReactNode` | — | Override the auto hint line |
| `files` | `UploadFile[]` | — | Controlled list to render (progress/status) |
| `onFiles` | `(files: File[]) => void` | — | Fires with accepted files |
| `onRemove` | `(index, item) => void` | — | Fires when a row's × is clicked |

`UploadFile`: `{ name, size?, status?: "done" \| "uploading" \| "error", progress?, error?, file? }`.

### Vue

Same options. `onFiles`/`onRemove` become the **`@files`** / **`@remove`** emits.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-upload` + `--sm` | Wrapper and compact size |
| `.jl-upload__zone` + `[data-dragging]` / `[data-disabled]` | The dropzone and its states |
| `.jl-upload__mark` / `__title` / `__hint` | Zone icon and copy |
| `.jl-upload__list` / `__item[data-status]` | File rows (`done` / `uploading` / `error`) |
| `.jl-upload__fileicon` / `__meta` / `__name` / `__size` | Row icon and metadata |
| `.jl-upload__bar` | Progress track (shown while `uploading`) |
| `.jl-upload__status` / `__remove` | Status glyph and remove button |
