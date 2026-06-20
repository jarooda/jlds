# jlds

The CLI for the [JLDS design system](https://github.com/jarooda/jlds). It downloads React/Vue
component source straight into your project — you own and customize the code, shadcn-style.

## Run it

No install needed — run on the fly with `npx`:

```bash
npx jlds init          # detect framework, write jlds.json, inject design tokens
npx jlds add button    # download a component into your project
npx jlds list          # list available components
```

Or install it globally:

```bash
npm i -g jlds
```

This package is a thin launcher: on install, npm pulls the prebuilt native binary for your
platform (one of the `jlds-cli-*` packages) and `npx jlds`/`jlds` runs it directly.

## Docs

See the full documentation at <https://github.com/jarooda/jlds>.
