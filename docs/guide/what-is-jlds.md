# What is JLDS?

JLDS is a design system and component CLI. Instead of installing components as a package
dependency, `jlds` downloads component source code directly into your project — you own it,
read it, and customize it freely.

This is the same philosophy popularized by [shadcn/ui](https://ui.shadcn.com/): there's no
`node_modules/jlds` to fight with, no breaking changes from an upstream major version, and no
black-box components. A component is just files in your repo.

## The aesthetic

The default look is a premium SaaS product, **light-first**: a low-glare off-white canvas with
a deep-emerald accent, clean layouts, strong hierarchy, soft 12–16px corners, comfortable
spacing, and small, confident micro-interactions. A full **dark theme ships alongside**, opt-in
via `<html data-theme="dark">`. All of it is driven by
[CSS variable design tokens](/guide/theming), so you can switch themes — or re-theme entirely —
without touching component files.

## Supported frameworks

- **React** (including Next.js)
- **Vue** (including Nuxt)
- **Plain CSS / HTML** — no framework or CLI needed, see [HTML](/guide/vanilla-html)

`jlds init` detects your framework automatically from `package.json`.

## Styling

Every component ships self-contained CSS using `.jl-*` class names (e.g. `.jl-btn`,
`.jl-btn--primary`). These classes are built entirely on the CSS variable tokens injected by
`jlds init` — **Tailwind is not required**. If your project does use Tailwind v3 or v4, the
tokens layer in cleanly alongside it.

## How it works

```bash
jlds add button
```

This fetches `button.tsx` + `button.css` (or `Button.vue` + `button.css` for Vue) from the
[registry](/registry/) and writes them into your project under the path configured in
`jlds.json`. The files are self-contained — no runtime dependency on JLDS, no Tailwind
required.

Not using React or Vue? The same `.jl-*` classes work directly in plain HTML — see
[HTML](/guide/vanilla-html).

Ready to try it? Continue to [Getting Started](/guide/getting-started).
