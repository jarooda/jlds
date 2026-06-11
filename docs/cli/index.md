# CLI Reference

## Commands

| Command | Description |
|---|---|
| [`jlds init`](/cli/init) | Auto-detect framework/TS/Tailwind, create `jlds.json`, inject CSS design tokens |
| [`jlds add <name...>`](/cli/add) | Download one or more components into your project |
| [`jlds update <name...>`](/cli/update) | Re-fetch component(s) from the registry (overwrites local files) |
| [`jlds list`](/cli/list) | List components available for your detected framework |

Run `jlds --help` or `jlds <command> --help` for the same info from your terminal.

## jlds.json reference

`jlds init` writes a `jlds.json` file to your project root. Every other command reads it to
know your framework, install paths, and registry location.

```json
{
  "framework": "react",
  "typescript": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css"
  },
  "paths": {
    "components": "src/components/ui",
    "utils": "src/lib/utils"
  },
  "registry": "https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry"
}
```

| Field | Type | Description |
|---|---|---|
| `framework` | `"react" \| "vue"` | Determines which framework's files `add`/`update`/`list` use |
| `typescript` | `boolean` | Detected from `package.json`/`tsconfig.json`. Informational only |
| `tailwind.config` | `string` | Path to your Tailwind config file. Empty string if not using Tailwind, or using v4 (no config file) |
| `tailwind.css` | `string` | Path to your global CSS file — where `jlds init` injects design tokens |
| `paths.components` | `string` | Directory components are installed into, one subfolder per component |
| `paths.utils` | `string` | Reserved for shared utility files (not yet used by `add`/`update`) |
| `registry` | `string` | Base URL or local path to the [registry](/registry/). See [local vs. remote](#local-vs-remote-registry) below |

### Local vs. remote registry

Any `registry` value starting with `/`, `./`, `../`, or `file://` is treated as a **local
path**, resolved relative to the directory `jlds` is run from. Anything else is treated as an
HTTP(S) URL.

```json
// Local registry (e.g. developing inside the jlds monorepo)
{ "registry": "../../registry" }
```

```json
// Remote registry (default — served via jsDelivr)
{ "registry": "https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry" }
```

See [Registry: How it works](/registry/) for the on-disk/CDN layout.
