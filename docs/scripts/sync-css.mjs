import { cpSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const registry = join(__dirname, "..", "..", "registry");
const publicDir = join(__dirname, "..", "public");

// Mirror registry/css -> public/css and registry/js -> public/js so previews
// use the real source of truth (both are gitignored, regenerated each build).
for (const kind of ["css", "js"]) {
  const src = join(registry, kind);
  if (!existsSync(src)) continue;
  const dest = join(publicDir, kind);
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
}

// Mirror registry/examples -> public/examples/preview. The example HTML is the
// jsDelivr-served source of truth (registry/); this copy lets the docs embed it
// (Preview iframe) and serve it full-screen at /examples/preview/<name>.html.
// The nested /preview/ path keeps it clear of the /examples/<name> doc pages so
// the two never collide.
{
  const src = join(registry, "examples");
  if (existsSync(src)) {
    const dest = join(publicDir, "examples", "preview");
    mkdirSync(dest, { recursive: true });
    cpSync(src, dest, { recursive: true });
  }
}
