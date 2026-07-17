# Empty & loading states

The states most interfaces forget. This screen lays the async lifecycle side by side: a
[skeleton](/components/skeleton) placeholder while content loads, an
[empty state](/components/empty-state) when there's nothing yet, a [spinner](/components/spinner)
and [progress](/components/progress) bars for work in flight, a [banner](/components/banner) for
standing notices, and a [toast](/components/toast) for transient feedback (press the button to fire
one).

<Preview src="/examples/preview/empty-states.html" />

[Preview full screen](/examples/preview/empty-states.html){target="_blank" rel="noopener"}

## Use it

This example is one self-contained file. Link the JLDS stylesheets and the behavior bundle from the
CDN, then paste the markup. See [Vanilla HTML](/guide/vanilla-html) for the full workflow.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/all.css">
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/all.js" defer></script>
```

```bash
curl -O https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/examples/empty-states.html
```

## Components used

[Skeleton](/components/skeleton) ·
[Empty State](/components/empty-state) ·
[Spinner](/components/spinner) ·
[Progress](/components/progress) ·
[Banner](/components/banner) ·
[Toast](/components/toast) ·
[Card](/components/card) ·
[Button](/components/button)
