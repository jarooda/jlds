# HTML

No CLI, no build step, no framework — link the stylesheets straight from jsDelivr and use the
`.jl-*` classes directly on plain HTML elements.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/button.css">
  </head>
  <body>
    <button class="jl-btn jl-btn--primary jl-btn--md">Click me</button>
  </body>
</html>
```

## How the stylesheets are organized

- **`css/index.css`** ships the design tokens (see [Theming](/guide/theming)), base resets,
  and the Geist font `@import`. Always include it first — every component's classes are
  built on these tokens.
- Each component has its own **`css/<name>.css`** with just that component's `.jl-*`
  classes (e.g. `css/button.css` → `.jl-btn`, `.jl-btn--primary`, `.jl-btn--md`, …).

Only link the component stylesheets you actually use.

## Single source of truth

`registry/css/<name>.css` is the *only* place a component's styles are written. It's served
directly to HTML users via jsDelivr, **and** it's what `jlds add` fetches and writes
into your project as `<name>.css` for React and Vue. The CDN file, the React `.css` import,
and the Vue `<style src="...">` file are always identical.

## Pinning a version

`@main` always reflects the latest commit. For production, pin to a release tag so the CSS
never changes underneath you:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@v0.1.0/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@v0.1.0/registry/css/button.css">
```

See [Registry: How it works](/registry/) for more on how files are organized and versioned.
