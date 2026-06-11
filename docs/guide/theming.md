# Theming

JLDS uses CSS variables for design tokens. `jlds init` injects a full token set — plus a small
set of base resets — into your global CSS file. Every `.jl-*` component class is built
entirely on these tokens, so re-theming means overriding variables, never editing component
files.

The full token set lives in [`registry/css/index.css`](https://github.com/jarooda/jlds/blob/main/registry/css/index.css)
and is also what's served to HTML users — see [HTML](/guide/vanilla-html).

## Token categories

| Category | Examples | Purpose |
|---|---|---|
| Neutral ramp | `--neutral-0` … `--neutral-950` | Cool, slightly green-tinted grayscale used for surfaces, text, and borders |
| Brand | `--brand-400`, `--brand-500`, `--brand-600` | Deep emerald accent ramp |
| Semantic hues | `--green-400/700`, `--amber-400/700`, `--red-400/700`, `--sky-400/700` | Raw hues backing success/warning/danger/info |
| Surfaces | `--bg-app`, `--surface-card`, `--surface-raised`, `--surface-sunken`, `--surface-muted` | Background layers, darkest to lightest |
| Borders | `--border-subtle`, `--border-default`, `--border-strong`, `--border-focus` | Border colors and focus ring source |
| Text | `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-disabled`, `--text-brand`, `--text-on-brand` | Foreground text colors |
| Accent | `--accent`, `--accent-hover`, `--accent-active`, `--accent-subtle`, `--accent-muted`, `--accent-ring` | Interactive accent states, aliased to the brand ramp |
| Semantic states | `--success`, `--warning`, `--danger`, `--info` (+ `-subtle` / `-text` variants) | Status colors for alerts, badges, validation |
| Typography | `--font-sans`, `--font-mono`, `--text-xs` … `--text-xl`, `--weight-*`, `--leading-*`, `--tracking-*` | Geist-based type scale (14px base) |
| Spacing | `--space-1` … `--space-8`, `--gap-inline`, `--pad-control`, `--pad-card` | 4px-grid spacing scale |
| Radius | `--radius-sm` … `--radius-2xl`, `--radius-pill`, `--radius-control`, `--radius-card`, `--radius-input`, `--radius-badge` | Corner radii, with semantic aliases per component type |
| Shadows | `--shadow-xs/sm/md/lg`, `--shadow-inset`, `--ring-focus`, `--ring-danger` | Elevation and focus/error rings |
| Motion | `--duration-fast/base`, `--ease-standard/emphasized`, `--transition-control/surface` | Timing and easing for micro-interactions |

## Re-theming

Override any token in your own CSS, **after** the block injected by `jlds init`, to re-theme
without touching component files:

```css
:root {
  /* Swap the deep-emerald accent for purple */
  --brand-400: #a78bfa;
  --brand-500: #6d28d9;
  --brand-600: #5b21b6;

  /* Or go further and remap a semantic alias directly */
  --accent: #6d28d9;
  --radius-control: var(--radius-md); /* squarer buttons/inputs */
}
```

Because components only ever reference semantic aliases (`--accent`, `--surface-card`,
`--radius-control`, …) rather than raw values, most re-themes only need to touch the
**Neutral ramp**, **Brand**, and **Radius** sections.

## Tailwind

Tailwind is **optional**. `jlds init` detects an existing Tailwind v3 or v4 setup (and labels
the version), but doesn't require it — `.jl-*` classes work standalone. If your project does
use Tailwind, the injected `:root` variables sit alongside it without conflict; there's
currently no automatic mapping into a Tailwind theme/config, so use the CSS variables
directly — e.g. `color: var(--text-primary)` inline, or Tailwind's arbitrary-value syntax
`bg-[var(--surface-card)]`.
