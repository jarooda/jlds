import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, "..", "..", "registry", "css");
const dest = join(__dirname, "..", "public", "css");

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
