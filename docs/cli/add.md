# jlds add

Downloads one or more components from the registry into your project.

```bash
jlds add button
jlds add button input badge   # multiple at once
```

## What it does, per component

1. Fetches `components/<name>/meta.json` from the [registry](/registry/) and selects the file
   list for your configured `framework` (`meta.files.react` or `meta.files.vue`).
2. Fetches any files listed in `meta.files.shared` (e.g. `<name>.variants.ts`) and **inlines**
   them into the framework files that import them — see [shared files](/registry/#shared-files).
3. Writes each framework file (e.g. `button.tsx`, `index.ts` / `Button.vue`, `index.ts`) into
   `<paths.components>/<name>/`.
4. Fetches `css/<name>.css` from the registry and writes it as `<name>.css` alongside the
   component — this is the [single source of truth](/guide/vanilla-html#single-source-of-truth)
   for that component's `.jl-*` classes, for every framework.
5. Installs any `dependencies`/`devDependencies` declared in `meta.json` using your detected
   package manager.

## Output layout

For `jlds add button` with the default `paths.components` (`src/components/ui`):

```
src/components/ui/button/
├── button.css   # from registry/css/button.css
├── button.tsx   # (or Button.vue for the Vue framework)
└── index.ts
```

## Dependency installation

The package manager is detected from lockfiles in the project root, in this order:

| Lockfile | Package manager |
|---|---|
| `pnpm-lock.yaml` | pnpm |
| `yarn.lock` | yarn |
| `bun.lock` / `bun.lockb` | bun |
| *(none of the above)* | npm |

Dependencies are installed with `<pm> add <deps...>` (`<pm> install <deps...>` for npm), and
dev dependencies with the `-D` flag. If the install command fails, `jlds add` reports the
exact command to run manually.

The `button` component currently declares no dependencies.
