# JLDS

A shadcn-style design system CLI. Instead of installing components as a package dependency, `jlds` downloads component source code directly into your project — you own it, read it, and customize it freely.

**Supported frameworks:** React, Vue  
**Styling:** Tailwind CSS + CSS variables for theming

---

## How it works

```
jlds add button
```

This fetches `button.tsx` (or `Button.vue`) from the registry and writes it into your project under the path configured in `jlds.json`. The file is self-contained — no runtime dependency on JLDS.

---

## Project structure

```
jlds/
├── cli/          # Rust CLI — the jlds binary
├── registry/     # Component source of truth
│   ├── registry.json
│   └── components/
│       └── button/
│           ├── meta.json
│           ├── button.variants.ts   # shared types + class maps (inlined at install time)
│           ├── react/
│           └── vue/
├── demo/
│   ├── react/    # Vite + React 19 demo project
│   └── vue/      # Vite + Vue demo project
└── TODO.md
```

---

## Getting started (CLI development)

### Prerequisites
- [Rust](https://rustup.rs/) (1.80+)
- Node.js + pnpm (for demo projects)

### Build and install the CLI

```bash
cd cli
cargo build          # debug build
cargo install --path .  # install jlds globally
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

Alternatively, you can serve the registry over HTTP (closer to how the production CDN behaves):

```bash
cd registry
python3 -m http.server 9090
```

```json
{
  "registry": "http://localhost:9090"
}
```

---

## Setting up a demo project

```bash
cd demo/react          # or demo/vue
jlds init              # interactive setup — creates jlds.json, injects CSS tokens
```

When prompted for the registry, the default points to the production CDN. For local development, edit `jlds.json` after init and set:

```json
"registry": "../../registry"
```

---

## Adding a component

```bash
jlds add button
```

Files land in the path configured under `paths.components` in `jlds.json`.  
For the React demo: `src/components/ui/button/`

```
button/
├── button.tsx   # self-contained — variants inlined, no extra imports
└── index.ts     # re-exports Button and ButtonProps
```

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
vim registry/components/button/button.variants.ts

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
| `jlds init` | Interactive setup — creates `jlds.json`, injects CSS design tokens |
| `jlds add <name>` | Download a component into your project |
| `jlds update <name>` | Re-fetch a component from the registry (overwrites local) |
| `jlds list` | List all components available for your framework |

---

## Theming

JLDS uses CSS variables for design tokens. `jlds init` injects them into your global CSS file:

```css
:root {
  --jlds-primary: 221.2 83.2% 53.3%;
  --jlds-destructive: 0 84.2% 60.2%;
  /* ... */
}
```

Override any token in your own CSS to change the look without touching component files:

```css
:root {
  --jlds-primary: 262 83% 58%; /* purple */
}
```

For Tailwind v4 projects, `jlds init` also injects an `@theme` block so you can use `bg-jlds-primary` as a Tailwind utility class.
