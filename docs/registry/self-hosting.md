# Self-hosting a registry

The default registry is `https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry` — jsDelivr
serving the `registry/` subfolder of the [jlds monorepo](https://github.com/jarooda/jlds)
directly from GitHub. No server is involved, so hosting your own fork (with custom or
modified components) only requires GitHub + jsDelivr.

## Prerequisites

- A public GitHub repository containing your `registry/` folder (jsDelivr's free tier only
  serves public repos)
- At least one component under `registry/components/`

## 1. Push your registry to GitHub

```bash
git init
git add .
git commit -m "chore: initial commit"
git remote add origin https://github.com/<your-org>/<your-repo>.git
git branch -M main
git push -u origin main
```

## 2. Verify the CDN URL

jsDelivr serves files at:

```
https://cdn.jsdelivr.net/gh/<org>/<repo>@<ref>/<path>
```

Since the registry lives in a subfolder, your base URL is:

```
https://cdn.jsdelivr.net/gh/<org>/<repo>@main/registry
```

Open these in a browser — you should see raw JSON:

```
https://cdn.jsdelivr.net/gh/<org>/<repo>@main/registry/registry.json
https://cdn.jsdelivr.net/gh/<org>/<repo>@main/registry/components/button/meta.json
```

If you get a 404, wait ~1 minute for jsDelivr to pick up the push.

## 3. Point jlds.json at it

```json
{
  "registry": "https://cdn.jsdelivr.net/gh/<org>/<repo>@main/registry"
}
```

For local development, you can instead point at the folder on disk — see
[CLI: local vs. remote registry](/cli/#local-vs-remote-registry).

## Releasing a new component version

1. Edit files under `registry/components/<name>/`.
2. Bump `"version"` in that component's `meta.json`.
3. Commit and push:

   ```bash
   git add registry/
   git commit -m "feat(button): add loading state"
   git push origin main
   ```

4. Users run `jlds update <name>` to pull the new version.

### Pinning to a tag

`@main` always reflects the latest push. For production, jsDelivr recommends pinning to a
release tag, which is **immutable** (once cached, it never changes):

```bash
git tag v0.2.0
git push origin v0.2.0
```

```json
{
  "registry": "https://cdn.jsdelivr.net/gh/<org>/<repo>@v0.2.0/registry"
}
```

## jsDelivr cache

- `@main` refreshes within a few minutes of a push.
- Tagged versions (`@v0.2.0`) are immutable — to ship a fix, cut a new tag.
- To force-refresh `@main` immediately, hit jsDelivr's purge endpoint:

  ```
  https://purge.jsdelivr.net/gh/<org>/<repo>@main/registry/registry.json
  ```
