# jlds update

Re-fetches a component from the registry and overwrites the local copy.

```bash
jlds update button
jlds update button input   # multiple at once
```

## What it does

For each component, `jlds update` first verifies the component still exists in the registry
for your framework, then re-runs the same logic as [`jlds add`](/cli/add) — fetching the
latest files, shared-file inlining, `<name>.css`, and dependency installation, and
**overwriting** whatever is currently at `<paths.components>/<name>/`.

::: warning
Any local edits to a component's files are overwritten. There is currently no diffing or
conflict detection — if you've customized a component, back up or diff your changes before
running `jlds update`.
:::

## "Latest" means latest *in your pinned registry*

`jlds init` writes a `registry` URL pinned to the CLI version that created the project, and
every later command reads it back from `jlds.json`. Upgrading the CLI does not move that pin —
so `jlds update` re-fetches from the same release until you repoint it, and a component fix
published later never arrives.

`add` and `update` say so when the pin is older than the CLI you are running:

```
! Registry pinned to v1.3.1 — this CLI is v1.4.0.
  Fixes released since v1.3.1 won't be fetched. To move the pin, set in jlds.json:
  "registry": "https://cdn.jsdelivr.net/gh/jarooda/jlds@v1.4.0/registry"
```

Paste that value into `jlds.json` and re-run `jlds update <name>` for each component you want
on the newer release. The warning is silent for a local path, a fork, or a `@main` URL — those
are deliberate choices, not a stale pin. `--registry <url>` overrides the registry for a single
run without touching `jlds.json`:

```bash
jlds update button --registry https://cdn.jsdelivr.net/gh/jarooda/jlds@v1.4.0/registry
```

## Typical workflow (developing against a local registry)

```bash
# 1. Edit the component source in the registry
vim registry/components/button/react/button.tsx

# 2. Make sure jlds.json points at the local registry
#    { "registry": "../../registry" }

# 3. Sync to your project
jlds update button
```
