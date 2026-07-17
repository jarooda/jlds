# @jarooda/jlds

The CLI for the [JLDS design system](https://github.com/jarooda/jlds). It downloads React/Vue
component source straight into your project — the code is yours to read, own, and customize.

## Run it

No install needed — run on the fly with `npx`:

```bash
npx @jarooda/jlds init          # detect framework, write jlds.json, inject design tokens
npx @jarooda/jlds add button    # download a component into your project
npx @jarooda/jlds list          # list available components
```

Or install it globally — the command is `jlds`:

```bash
npm i -g @jarooda/jlds
jlds init
```

This package is a thin launcher: on first run it downloads the prebuilt native binary for your
platform from the matching [GitHub Release](https://github.com/jarooda/jlds/releases), caches it
by version, and runs it directly. Later runs reuse the cache (no network).

## Docs

See the full documentation at <https://github.com/jarooda/jlds>.
