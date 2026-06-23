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
