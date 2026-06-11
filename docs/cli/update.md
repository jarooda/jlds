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

## Typical workflow (developing against a local registry)

```bash
# 1. Edit the component source in the registry
vim registry/components/button/react/button.tsx

# 2. Make sure jlds.json points at the local registry
#    { "registry": "../../registry" }

# 3. Sync to your project
jlds update button
```
