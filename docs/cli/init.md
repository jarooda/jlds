# jlds init

Initializes JLDS in your project: detects your framework/setup, writes the `jlds` config into
`package.json`, and injects the design token stylesheet into your global CSS.

```bash
jlds init
```

Run it from the root of a project with a `package.json`.

## Detection

| What | How |
|---|---|
| **Framework** | `react`/`next` → React; `vue`/`nuxt`/`@nuxtjs/core` → Vue. Errors if both or neither are found in `dependencies`/`devDependencies` |
| **TypeScript** | `typescript` dependency, or a `tsconfig.json`/`tsconfig.app.json` in the project root |
| **Tailwind** | `tailwindcss` dependency. Version is read from its semver range to label `v3` vs `v4` (v4 has no config file) |
| **Layout** | Nuxt 4's `app/` source directory vs. a Vite-style `src/`, which sets the [default paths](#defaults-by-layout) |

The detected framework, language, and Tailwind version are printed before any prompts.

Detection can be overridden with `--framework` and `--typescript`/`--javascript`. `--framework`
also resolves the two cases detection gives up on: a project with both React and Vue in
`package.json`, and one with neither.

## Prompts

| Prompt | Flag |
|---|---|
| Global CSS file path | `--css` |
| Where should components be installed? | `--components` |
| Where should utilities be installed? | `--utils` |

Passing a flag skips its prompt.

### Defaults by layout

| Layout | CSS | Components | Utils |
|---|---|---|---|
| React / Next.js | `src/index.css` / `src/app/globals.css` / `app/globals.css` / `src/styles/globals.css` / `styles/globals.css` | `src/components/ui` | `src/lib/utils` |
| Vue (Vite) | `src/assets/main.css` / `src/style.css` | `src/components/ui` | `src/lib/utils` |
| Nuxt 4 | `app/assets/css/main.css` / `app/assets/main.css` | `app/components/ui` | `app/lib/utils` |
| Nuxt 3 | `assets/css/main.css` / `assets/main.css` | `components/ui` | `lib/utils` |

Where several CSS paths are listed, the first one that already exists wins; otherwise the first
is used and created. The React list covers Vite, the Next App Router (`app/globals.css`) and the
Next Pages Router (`styles/globals.css`), each with and without a `src/` root.

::: warning Check the CSS path
`jlds add` registers every component's stylesheet as an `@import` in this file
([why](/cli/add#component-stylesheets)), so it has to be a stylesheet your app actually loads.
If `init` guesses a path that nothing imports, components install but render unstyled.
:::

Nuxt only auto-imports components under its source directory, which Nuxt 4 moved to `app/`.
That layout is used when the `nuxt` dependency is v4 or newer, or when an `app/` directory
already exists — the latter covers Nuxt 3 projects on `compatibilityVersion: 4`.

::: tip Nuxt: register the stylesheet
Nuxt loads global CSS only if it is listed in `nuxt.config`, so `init` prints a reminder unless
your config already references the file:

```ts
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
})
```
:::

## Non-interactive use

`jlds init` prompts only when it has a terminal to prompt on. In CI, a `docker build`, or any
scripted/agent shell without a TTY it prints the values it would have asked for and uses the
defaults — no `not a terminal` error. `--yes` (`-y`) forces the same behavior in a real
terminal.

```bash
# Accept everything that was detected
jlds init --yes

# Fully specified — nothing detected, nothing prompted
jlds init \
  --framework vue \
  --typescript \
  --css app/assets/css/main.css \
  --components app/components/ui \
  --utils app/lib/utils
```

| Flag | Description |
|---|---|
| `-y`, `--yes` | Accept the detected defaults without prompting |
| `--framework <react\|vue>` | Set the framework, skipping detection |
| `--typescript` / `--javascript` | Set the language, skipping detection |
| `--css <PATH>` | Global CSS file to inject design tokens into |
| `--components <PATH>` | Directory components are installed into (alias `--components-dir`) |
| `--utils <PATH>` | Directory utilities are installed into (alias `--utils-dir`) |
| `--registry <URL>` | Registry base URL or [local path](/cli/#local-vs-remote-registry), instead of the default |

Since the config is written into your `package.json` and re-running `init` is safe, the usual
scripted setup is `jlds init -y && jlds add button`.

## What gets written

A `jlds` key is added to your `package.json` with the detected/entered values and `registry`
set to the [default registry](/registry/). Every other key in the file — and their order — is
left untouched. See the [full field reference](/cli/#config-reference).

## CSS token injection

`jlds init` writes the contents of [`registry/css/index.css`](https://github.com/jarooda/jlds/blob/main/registry/css/index.css)
(design tokens, base resets, and the Geist font `@import`) into the global CSS file from the
prompt above:

- **Empty or missing file** — the stylesheet is written as-is.
- **Existing file** — the `@import` for the Geist font is hoisted to the top (CSS requires
  `@import` to precede all other rules), unless a Geist import already exists. The `:root`
  token block and base resets are appended after your existing styles.
- **Already initialized** — if the file already contains the marker comment
  `JLDS Design System`, injection is skipped entirely (running `jlds init` again is safe).

Existing styles are never modified or removed.
