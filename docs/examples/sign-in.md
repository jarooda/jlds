# Sign in

A centered authentication screen — deliberately standalone, with no app shell. A single
[card](/components/card) holds the [fields](/components/field), a "remember me"
[checkbox](/components/checkbox), a full-width [button](/components/button), a
[divider](/components/divider), and an SSO option. It's the smallest example, and the easiest
starting point for your own auth flow.

<Preview src="/examples/preview/sign-in.html" />

[Open full screen ↗](/examples/preview/sign-in.html){target="_blank" rel="noopener"}

## Use it

This example is one self-contained file. Link the JLDS stylesheets from the CDN, then paste the
markup. See [Vanilla HTML](/guide/vanilla-html) for the full no-framework workflow.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/all.css">
```

```bash
curl -O https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/examples/sign-in.html
```

## Components used

[Card](/components/card) ·
[Field](/components/field) ·
[Input](/components/input) ·
[Checkbox](/components/checkbox) ·
[Button](/components/button) ·
[Divider](/components/divider)
