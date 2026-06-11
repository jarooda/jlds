# JLDS

JLDS is a design system and component CLI. Instead of installing components as a package dependency, `jlds` downloads component source code directly into your project — you own it, read it, and customize it freely.

The aesthetic: a premium SaaS product, rendered as a dark theme with a deep-emerald accent. Clean layouts, strong hierarchy, soft 12–16px corners, comfortable spacing, and small, confident micro-interactions.

**Supported frameworks:** React, Vue
**Styling:** Self-contained CSS (`.jl-btn`-style classes) + CSS variable design tokens — Tailwind is **not required**
**Docs:** Full documentation lives in [`/docs`](docs/) (VitePress) — run `pnpm --dir docs run docs:dev` for a local preview.

---

## How it works

```
jlds add button
```

This fetches `button.tsx` + `button.css` (or `Button.vue`) from the registry and writes them into your project under the path configured in `jlds.json`. The files are self-contained — no runtime dependency on JLDS, no Tailwind required.

---

## Project structure

```
jlds/
├── cli/          # Rust CLI — the jlds binary
├── registry/     # Component source of truth (served via jsDelivr)
│   ├── registry.json
│   ├── css/              # single source of truth for component CSS
│   │   ├── index.css     # design tokens + base resets (also used by `jlds init`)
│   │   └── button.css    # .jl-btn class system
│   └── components/
│       └── button/
│           ├── meta.json
│           ├── react/
│           │   ├── button.tsx
│           │   └── index.ts
│           └── vue/
│               ├── Button.vue
│               └── index.ts
├── demo/
│   ├── react/    # Vite + React 19 demo project
│   └── vue/      # Vite + Vue demo project
├── todo/
│   ├── TODO.md
│   └── deploy-to-registry.md
└── README.md
```

---

## Getting started (CLI development)

### Prerequisites
- [Rust](https://rustup.rs/) (1.80+)
- Node.js + a package manager (npm, pnpm, yarn, or bun) — for demo projects

### Build and install the CLI

```bash
cd cli
cargo build              # debug build
cargo install --path .   # install jlds globally
```

### Verify

```bash
jlds --help
```

> Whenever you change the CLI source, re-run `cargo install --path .` to update the globally installed `jlds` binary — otherwise your shell keeps using the old build.

---

## Pointing at a local registry

The registry is just a folder of static files (`registry/`). For local development, point `jlds.json` directly at that folder on disk — no server required:

```json
{
  "registry": "../../registry"
}
```

The path is resolved relative to the directory `jlds` is run from (e.g. `demo/vue/` or `demo/react/`). Any path starting with `/`, `./`, `../`, or `file://` is treated as local.

For production, the registry is deployed to GitHub + jsDelivr. See [`todo/deploy-to-registry.md`](todo/deploy-to-registry.md) for the full process. Once deployed, `jlds.json` points at:

```json
{
  "registry": "https://cdn.jsdelivr.net/gh/<org>/jlds@main/registry"
}
```

---

## Setting up a project

```bash
cd demo/react          # or demo/vue
jlds init
```

`jlds init` auto-detects everything from `package.json`:
- **Framework** — React (or Next.js) / Vue (or Nuxt). Errors if neither or both are found.
- **TypeScript** — from `package.json` or presence of `tsconfig.json`
- **Tailwind** — detected and version-labeled if present, but not required

You'll only be prompted for:
- Global CSS file path (where design tokens get injected)
- Components install path (default `src/components/ui`)
- Utils install path (default `src/lib/utils`)

`jlds init` then injects the JLDS design tokens (colors, typography, spacing, radius, shadows, motion + Geist font) into your global CSS file. If the file already has content, the `@import` is hoisted to the top and the `:root` token block is appended — existing styles are preserved.

For local development, point the registry at the local folder after init (see above).

---

## Adding a component

```bash
jlds add button
```

Files land in the path configured under `paths.components` in `jlds.json`.
For the React demo: `src/components/ui/button/`

```
button/
├── button.css   # .jl-btn class system — variants, sizes, states (from registry/css/button.css)
├── button.tsx   # self-contained component
└── index.ts     # re-exports Button, ButtonProps, ButtonVariant, ButtonSize
```

For Vue, the same `button.css` lands alongside `Button.vue` and `index.ts`, referenced via `<style src="./button.css">`.

```tsx
import { Button } from "@/components/ui/button"

<Button variant="primary" size="md">Click me</Button>
```

Available `variant`s: `primary`, `secondary`, `ghost`, `subtle`, `danger`
Available `size`s: `sm`, `md`, `lg`

If the registry component declares `dependencies` in `meta.json`, `jlds add` installs them automatically using your detected package manager (pnpm/yarn/bun/npm, based on lockfile).

---

## Using JLDS without a framework (vanilla HTML)

No CLI, no build step — link the stylesheets straight from jsDelivr and use the `.jl-*` classes directly:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<org>/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<org>/jlds@main/registry/css/button.css">

<button class="jl-btn jl-btn--primary jl-btn--md">Click me</button>
```

`css/index.css` ships the design tokens, base resets, and Geist font import — always include it first. Each component then has its own `css/<name>.css` with just that component's classes.

`registry/css/<name>.css` is also the single source of truth for `jlds add` — the CLI fetches it directly and writes it as `<name>.css` alongside the component, so the React `.css` file, the Vue `<style src="...">` file, and the vanilla CDN file are always identical.

---

## Syncing a component after registry changes

When you update a component in `registry/components/<name>/`, sync it to demo projects with:

```bash
jlds update button
```

This re-fetches from the registry and overwrites the local files.

**Typical workflow when editing a component:**

```bash
# 1. Edit the component source in the registry
vim registry/components/button/react/button.tsx

# 2. Make sure jlds.json points at the local registry (see above)

# 3. Sync to demo
cd demo/react && jlds update button

# 4. Check the result
cat src/components/ui/button/button.tsx
```

---

## Available commands

| Command | Description |
|---|---|
| `jlds init` | Auto-detect framework/TS/Tailwind, create `jlds.json`, inject CSS design tokens |
| `jlds add <name>` | Download a component into your project |
| `jlds update <name>` | Re-fetch a component from the registry (overwrites local) |
| `jlds list` | List all components available for your framework |

---

## Theming

JLDS uses CSS variables for design tokens. `jlds init` injects a full dark-theme token set into your global CSS file:

```css
:root {
  --accent: var(--brand-500);       /* deep emerald, #1b8a64 */
  --accent-hover: var(--brand-400);
  --surface-card: var(--neutral-900);
  --text-primary: #eaf1ed;
  --radius-control: var(--radius-xl);
  --shadow-xs: 0 1px 2px hsl(220 60% 2% / 0.40);
  /* ... full ramp: neutrals, semantic colors, typography, spacing, motion */
}
```

Override any token in your own CSS (after the injected block) to re-theme without touching component files:

```css
:root {
  --brand-500: #6d28d9; /* swap emerald for purple */
}
```

Components ship their own scoped CSS classes (`.jl-btn`, `.jl-btn--primary`, etc.) built entirely on these tokens — no Tailwind config or utility classes required.
