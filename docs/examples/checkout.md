# Checkout

A multi-step purchase flow. A [stepper](/components/stepper) tracks progress through cart →
shipping → payment, a two-column layout pairs the form with a sticky order summary, and the form
itself uses [fields](/components/field), a [select](/components/select), a
[radio group](/components/radio-group), a [date picker](/components/date-picker), and an
[alert](/components/alert) reassuring the buyer. The summary totals it up with a
[divider](/components/divider) and a [badge](/components/badge) for the discount.

<Preview src="/examples/preview/checkout.html" />

[Preview full screen](/examples/preview/checkout.html){target="_blank" rel="noopener"}

## Use it

This example is one self-contained file. Link the JLDS stylesheets and the behavior bundle from the
CDN, then paste the markup. See [Vanilla HTML](/guide/vanilla-html) for the full workflow.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/all.css">
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/all.js" defer></script>
```

```bash
curl -O https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/examples/checkout.html
```

## Components used

[Stepper](/components/stepper) ·
[Card](/components/card) ·
[Field](/components/field) ·
[Input](/components/input) ·
[Select](/components/select) ·
[Radio Group](/components/radio-group) ·
[Date Picker](/components/date-picker) ·
[Alert](/components/alert) ·
[Divider](/components/divider) ·
[Badge](/components/badge) ·
[Button](/components/button)
