# jlds add

Downloads one or more components from the registry into your project.

```bash
jlds add button
jlds add button input badge   # multiple at once
```

Before installing, `jlds add` resolves each component's **registry dependencies** — other
components it builds on, declared as `registryDependencies` in `meta.json` — and adds them too
(transitively, de-duplicated). For example `jlds add table` also installs `checkbox`, because the
table's row-selection cell uses the Checkbox component. Dependency-only components are labelled
`(registry dependency)` in the output.

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
5. Registers that stylesheet in your global CSS (see [below](#component-stylesheets)).
6. Installs any `dependencies`/`devDependencies` declared in `meta.json` using your detected
   package manager.

## Component stylesheets

Component files in the registry reference their own stylesheet inline — `import "./button.css"`
in React, `<style src="./button.css">` in Vue. `jlds add` **removes that reference** on the way
in and adds an `@import` to the global stylesheet from `tailwind.css` in your config instead —
the same file `jlds init` injects the design tokens into:

```css
@import url('https://fonts.googleapis.com/css2?family=Geist...');
@import "../components/ui/button/button.css";   /* added by jlds add */

/* JLDS design tokens ... */
```

The import goes after any existing `@import` lines and before the first rule, because CSS
requires `@import` to precede every rule. Re-running `add` or `update` for a component that is
already listed leaves the file untouched.

This exists because the **Next.js Pages Router** rejects any non-module `.css` imported outside
`pages/_app` ([css-global](https://nextjs.org/docs/messages/css-global)) — a component that
imported its own stylesheet simply would not compile there. Routing every framework through the
global stylesheet keeps one code path instead of a per-bundler special case, and leaves your
global CSS listing exactly which components are installed.

::: warning
If `tailwind.css` in your config is unset or points at a file that doesn't exist, `add` skips
this step and prints the `@import` line for you to place yourself. Run `jlds init` first.
:::

Deleting a component directory leaves a dangling `@import` behind — remove the matching line
from your global stylesheet too.

## Registry

Files come from the `registry` URL in your config — pinned by `jlds init` to the CLI version
that set the project up. If that pin is older than the CLI you are running, `add` prints the
newer value to paste in; see
[“Latest” means latest in your pinned registry](/cli/update#latest-means-latest-in-your-pinned-registry).

`--registry <url>` overrides it for a single run, leaving the stored pin unchanged:

```bash
jlds add button --registry ../../registry
```

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
