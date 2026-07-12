# Kanban board

A sprint board with three columns. Each task lives in a [swipe row](/components/swipe-row) — swipe
left on touch, or hover on desktop, to reveal archive/delete actions. Columns scroll independently
via [scroll area](/components/scroll-area), and the Filters button opens a
[drawer](/components/drawer). Tasks carry [tags](/components/tag), [avatars](/components/avatar),
and a count [badge](/components/badge) per column.

<Preview src="/examples/preview/kanban.html" />

[Open full screen ↗](/examples/preview/kanban.html){target="_blank" rel="noopener"}

## Use it

This example is one self-contained file. Link the JLDS stylesheets and the behavior bundle from the
CDN, then paste the markup. See [Vanilla HTML](/guide/vanilla-html) for the full workflow.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/all.css">
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/all.js" defer></script>
```

```bash
curl -O https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/examples/kanban.html
```

## Components used

[Swipe Row](/components/swipe-row) ·
[Scroll Area](/components/scroll-area) ·
[Drawer](/components/drawer) ·
[Tag](/components/tag) ·
[Avatar](/components/avatar) ·
[Badge](/components/badge) ·
[Select](/components/select) ·
[Button](/components/button)
