# jlds list

Lists components available for your project's configured framework.

```bash
jlds list
```

## What it does

Fetches `registry.json` from the [registry](/registry/), then prints every component whose
`frameworks` array includes your `jlds.json` `framework` (`react` or `vue`), along with its
description:

```
Available components:

  button — A versatile button with size and variant support

1 component(s) available for react.
```

If no components are available for your framework, it prints a message saying so instead.
