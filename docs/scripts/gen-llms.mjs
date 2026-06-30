import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Generates llms.txt (curated index) and llms-full.txt (all docs concatenated)
// into public/, mirroring the sync-css build-step pattern. Both are gitignored
// and regenerated on every dev/build. Spec: https://llmstxt.org
const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = join(__dirname, "..");
const publicDir = join(docsDir, "public");
const registryJson = join(__dirname, "..", "..", "registry", "registry.json");

const HOST = "https://jlds.jaluwibowo.id";
const SUMMARY =
  "Design system for rapid prototyping. Components are copied into your project " +
  "as plain source files (React, Vue, or framework-free HTML) built on .jl-* CSS " +
  "classes and CSS-variable design tokens — no npm package, no Tailwind required.";

// Component name -> description, from the registry (source of truth).
const registryDescriptions = (() => {
  if (!existsSync(registryJson)) return {};
  const { components = [] } = JSON.parse(readFileSync(registryJson, "utf8"));
  return Object.fromEntries(components.map((c) => [c.name, c.description]));
})();

// Map a docs-relative .md path to its published URL path (VitePress rules).
function toUrlPath(relPath) {
  const noExt = relPath.replace(/\.md$/, "");
  return "/" + noExt.replace(/(^|\/)index$/, "$1");
}

function frontmatterStripped(raw) {
  return raw.replace(/^---\n[\s\S]*?\n---\n/, "");
}

function firstHeading(body) {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

// First prose paragraph (skip headings, code, components), collapsed to one line.
function firstParagraph(body) {
  const afterTitle = body.replace(/^#\s+.+$/m, "");
  for (const block of afterTitle.split(/\n\s*\n/)) {
    const t = block.trim();
    if (!t || t.startsWith("#") || t.startsWith("```") || t.startsWith("<") || t.startsWith(":::")) continue;
    return t.replace(/\s+/g, " ");
  }
  return "";
}

// Strip VitePress-only markup so the full dump is clean plain text.
function cleanForFull(body) {
  return body
    .replace(/^<Preview\b[^>]*\/>\s*$/gm, "") // preview iframes have no text value
    .replace(/^:::\s*code-group\s*$/gm, "")
    .replace(/^:::\s*(tip|info|warning|danger|details)\b.*$/gm, "") // container openers
    .replace(/^:::\s*$/gm, "") // container closers
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function read(relPath) {
  const body = frontmatterStripped(readFileSync(join(docsDir, relPath), "utf8"));
  return { relPath, url: HOST + toUrlPath(relPath), body };
}

function componentName(relPath) {
  return relPath.replace(/^components\//, "").replace(/\.md$/, "");
}

// Ordered sections. Components are read straight from the folder, alphabetised,
// with index.md (Overview) pinned first.
const guide = ["guide/what-is-jlds.md", "guide/getting-started.md", "guide/theming.md", "guide/responsive.md", "guide/vanilla-html.md"];
const cli = ["cli/index.md", "cli/init.md", "cli/add.md", "cli/update.md", "cli/list.md"];
const registry = ["registry/index.md", "registry/self-hosting.md"];
const components = readdirSync(join(docsDir, "components"))
  .filter((f) => f.endsWith(".md"))
  .sort((a, b) => (a === "index.md" ? -1 : b === "index.md" ? 1 : a.localeCompare(b)))
  .map((f) => `components/${f}`);

const sections = [
  { title: "Guide", files: guide },
  { title: "Components", files: components },
  { title: "CLI", files: cli },
  { title: "Registry", files: registry },
];

// ---- llms.txt (curated index) ----
let index = `# JLDS\n\n> ${SUMMARY}\n\n`;
index += `Install: \`npx @jarooda/jlds init\` then \`npx @jarooda/jlds add <component>\`. ` +
  `Or skip the CLI and link the CSS from jsDelivr — see the HTML examples on any component page.\n`;

for (const { title, files } of sections) {
  index += `\n## ${title}\n\n`;
  for (const relPath of files) {
    const { url, body } = read(relPath);
    const name = firstHeading(body) ?? relPath;
    const desc =
      (relPath.startsWith("components/") && registryDescriptions[componentName(relPath)]) ||
      firstParagraph(body);
    index += `- [${name}](${url})${desc ? `: ${desc}` : ""}\n`;
  }
}

writeFileSync(join(publicDir, "llms.txt"), index);

// ---- llms-full.txt (everything, one fetch) ----
let full = `# JLDS — full documentation\n\n> ${SUMMARY}\n\nSource: ${HOST}\n`;
for (const { title, files } of sections) {
  for (const relPath of files) {
    const { url, body } = read(relPath);
    full += `\n\n---\n\n<!-- ${url} -->\n\n${cleanForFull(body)}\n`;
  }
}

writeFileSync(join(publicDir, "llms-full.txt"), full);

const total = sections.reduce((n, s) => n + s.files.length, 0);
console.log(`Generated llms.txt + llms-full.txt (${total} pages)`);
