# Dashboard

An analytics overview screen: a responsive [app shell](/components/app-shell) with a collapsible
[sidebar](/components/sidebar), a header with search and a user menu, a row of
[stat](/components/stat) KPIs, two [charts](/components/chart), and a
[table](/components/table) of recent activity. Resize the frame (or use the viewport switcher) to
watch the layout reflow and the sidebar collapse into a drawer.

<Preview src="/examples/preview/dashboard.html" />

[Open full screen ↗](/examples/preview/dashboard.html){target="_blank" rel="noopener"}

## Use it

This example is one self-contained file. In your own project, link the JLDS stylesheets and the
behavior bundle from the CDN, then paste the markup. See [Vanilla HTML](/guide/vanilla-html) for the
full no-framework workflow.

```html
<!-- Design tokens + base (always first) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<!-- Everything, or link the per-component files you use -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/all.css">
<!-- Behavior: responsive drawer, charts, menus -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/all.js" defer></script>
```

Then grab the full page source:

```bash
curl -O https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/examples/dashboard.html
```

## Components used

[App Shell](/components/app-shell) ·
[Sidebar](/components/sidebar) ·
[Input](/components/input) ·
[Icon Button](/components/icon-button) ·
[Avatar](/components/avatar) ·
[Dropdown Menu](/components/dropdown-menu) ·
[Stat](/components/stat) ·
[Card](/components/card) ·
[Chart](/components/chart) ·
[Table](/components/table) ·
[Badge](/components/badge) ·
[Button](/components/button)
