// Assembles the npm packages for a release from the built binaries, then wires
// the launcher's optionalDependencies to the per-platform packages.
//
// Expects binaries staged (by CI) as:  <binDir>/jlds-<rust-target>[.exe]
// Writes per-platform packages to:      npm/_packages/<pkg>/
// Updates in place:                      npm/jlds/package.json (version + optionalDeps)
// Emits the publish order to:            npm/_packages/publish-list.txt
//
//   node npm/scripts/prepare-packages.mjs <version>
import {
  mkdirSync,
  copyFileSync,
  chmodSync,
  writeFileSync,
  readFileSync,
  existsSync,
  rmSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const npmDir = join(__dirname, "..");
const repoRoot = join(npmDir, "..");
const binDir = process.env.JLDS_BIN_DIR || join(repoRoot, "dist");
const outDir = join(npmDir, "_packages");

const version = process.argv[2] || process.env.JLDS_VERSION;
if (!version) {
  console.error("usage: prepare-packages.mjs <version>");
  process.exit(1);
}

const TARGETS = [
  { target: "aarch64-apple-darwin", os: "darwin", cpu: "arm64", pkg: "jlds-cli-darwin-arm64", exe: false },
  { target: "x86_64-apple-darwin", os: "darwin", cpu: "x64", pkg: "jlds-cli-darwin-x64", exe: false },
  { target: "x86_64-unknown-linux-gnu", os: "linux", cpu: "x64", pkg: "jlds-cli-linux-x64", exe: false },
  { target: "aarch64-unknown-linux-gnu", os: "linux", cpu: "arm64", pkg: "jlds-cli-linux-arm64", exe: false },
  { target: "x86_64-pc-windows-msvc", os: "win32", cpu: "x64", pkg: "jlds-cli-win32-x64", exe: true },
];

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const optionalDependencies = {};
const publishDirs = [];

for (const t of TARGETS) {
  const srcName = `jlds-${t.target}${t.exe ? ".exe" : ""}`;
  const src = join(binDir, srcName);
  if (!existsSync(src)) {
    console.warn(`skip ${t.pkg}: missing binary ${src}`);
    continue;
  }

  const pkgDir = join(outDir, t.pkg);
  mkdirSync(join(pkgDir, "bin"), { recursive: true });

  const binName = t.exe ? "jlds.exe" : "jlds";
  const dest = join(pkgDir, "bin", binName);
  copyFileSync(src, dest);
  if (!t.exe) chmodSync(dest, 0o755); // upload-artifact drops the exec bit; restore it

  writeFileSync(
    join(pkgDir, "package.json"),
    JSON.stringify(
      {
        name: t.pkg,
        version,
        description: `JLDS CLI native binary for ${t.os} ${t.cpu}.`,
        license: "MIT",
        homepage: "https://github.com/jarooda/jlds",
        repository: { type: "git", url: "git+https://github.com/jarooda/jlds.git" },
        os: [t.os],
        cpu: [t.cpu],
        files: ["bin"],
      },
      null,
      2
    ) + "\n"
  );

  optionalDependencies[t.pkg] = version;
  publishDirs.push(pkgDir);
}

if (publishDirs.length === 0) {
  console.error("no binaries found — nothing to package");
  process.exit(1);
}

// Update the launcher: version + exact-pinned optionalDependencies.
const launcherDir = join(npmDir, "jlds");
const launcherPath = join(launcherDir, "package.json");
const launcher = JSON.parse(readFileSync(launcherPath, "utf8"));
launcher.version = version;
launcher.optionalDependencies = optionalDependencies;
writeFileSync(launcherPath, JSON.stringify(launcher, null, 2) + "\n");

// Launcher publishes last, after the platform packages it depends on.
publishDirs.push(launcherDir);
writeFileSync(join(outDir, "publish-list.txt"), publishDirs.join("\n") + "\n");

console.log(`prepared ${publishDirs.length} package(s) at version ${version}:`);
for (const d of publishDirs) console.log("  " + d.replace(repoRoot + "/", ""));
