# File explorer

A two-pane editor layout. A [resizable](/components/resizable) split divides a
[tree view](/components/tree-view) file browser from a code pane — drag the handle (or focus it and
use arrow keys) to rebalance. Up top, a [breadcrumb](/components/breadcrumb) shows the path,
[toggle](/components/toggle) buttons flip editor options, and a [toolbar](/components/toolbar)
holds the actions.

<Preview src="/examples/preview/file-explorer.html" />

[Open full screen ↗](/examples/preview/file-explorer.html){target="_blank" rel="noopener"}

## Use it

This example is one self-contained file. Link the JLDS stylesheets and the behavior bundle from the
CDN, then paste the markup. See [Vanilla HTML](/guide/vanilla-html) for the full workflow.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/all.css">
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/all.js" defer></script>
```

```bash
curl -O https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/examples/file-explorer.html
```

## Components used

[Resizable](/components/resizable) ·
[Tree View](/components/tree-view) ·
[Breadcrumb](/components/breadcrumb) ·
[Toggle](/components/toggle) ·
[Toolbar](/components/toolbar) ·
[Snippet](/components/snippet)
