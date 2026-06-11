# jlds init

Initializes JLDS in your project: detects your framework/setup, writes `jlds.json`, and
injects the design token stylesheet into your global CSS.

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

The detected framework, language, and Tailwind version are printed before any prompts.

## Prompts

| Prompt | Default |
|---|---|
| Global CSS file path | First existing of `src/index.css` / `src/app/globals.css` (React) or `src/assets/main.css` / `src/style.css` (Vue), falling back to the first option |
| Where should components be installed? | `src/components/ui` |
| Where should utilities be installed? | `src/lib/utils` |

## What gets written

A `jlds.json` is created with the detected/entered values and `registry` set to the
[default registry](/registry/). See the [full field reference](/cli/#jldsjson-reference).

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
