# Registry: How it works

The registry is a folder of static files — [`registry/`](https://github.com/jarooda/jlds/tree/main/registry)
in the jlds monorepo — served via GitHub + jsDelivr. No server, database, or build step.

## Layout

```
registry/
├── registry.json          # index of all components
├── css/
│   ├── index.css          # design tokens + base resets (jlds init)
│   └── <name>.css          # component classes (jlds add + HTML)
└── components/
    └── <name>/
        ├── meta.json
        ├── <name>.variants.ts   # optional, shared between frameworks
        ├── react/
        │   ├── <name>.tsx
        │   └── index.ts
        └── vue/
            ├── <Name>.vue
            └── index.ts
```

## registry.json

The index of all components, fetched by [`jlds list`](/cli/list):

```json
{
  "version": "1",
  "components": [
    {
      "name": "button",
      "description": "A versatile button with size and variant support",
      "frameworks": ["react", "vue"],
      "dependencies": [],
      "devDependencies": []
    }
  ]
}
```

## meta.json

Per-component metadata, fetched by [`jlds add`/`jlds update`](/cli/add):

```json
{
  "name": "button",
  "description": "Primary action control. Five variants, three sizes, optional leading/trailing icons.",
  "version": "0.3.0",
  "frameworks": ["react", "vue"],
  "dependencies": [],
  "devDependencies": [],
  "files": {
    "shared": [],
    "react": ["button.tsx", "index.ts"],
    "vue": ["Button.vue", "index.ts"]
  },
  "registryDependencies": []
}
```

| Field | Description |
|---|---|
| `version` | Component version — bump it on every change (see [Self-hosting](/registry/self-hosting)) |
| `frameworks` | Frameworks this component supports |
| `dependencies` / `devDependencies` | npm packages `jlds add` installs automatically |
| `files.shared` | Files inlined into framework files at install time (see below) |
| `files.react` / `files.vue` | Files copied as-is into the user's project |
| `registryDependencies` | Other components this one depends on (reserved, not yet used by the CLI) |

## css/&lt;name&gt;.css

`css/<name>.css` is the single source of truth for a component's `.jl-*` classes.
`jlds add`/`update` fetch it and write it as `<name>.css` alongside the framework files;
HTML users link it directly from jsDelivr — see [HTML](/guide/vanilla-html).

`css/index.css` holds the shared design tokens and base resets injected by
[`jlds init`](/cli/init) — see [Theming](/guide/theming).

## Shared files

Components can declare a `files.shared` list in `meta.json`: files containing types and
class maps shared between the React and Vue implementations. `jlds add`/`update` **inline**
these into each framework file before writing, so users get one self-contained file with no
extra imports to maintain.

Registry source (`react/button.tsx`):

```ts
import { variantClasses, type ButtonVariant } from "../button.variants";
```

What lands in the user's project (`button.tsx`):

```ts
// -- inlined from button.variants.ts --
export type ButtonVariant = "primary" | "secondary" | /* ... */;
export const variantClasses = { /* ... */ };

import * as React from "react";
// ... rest of component
```

For Vue's `<script setup>`, top-level `export` keywords are stripped from the inlined
declarations (since `export` is invalid there), and the content is injected right after the
opening `<script setup ...>` tag.

> The `button` component currently declares no shared files (`files.shared: []`) — its
> variant class maps are written directly in both `react/button.tsx` and `vue/Button.vue`.
