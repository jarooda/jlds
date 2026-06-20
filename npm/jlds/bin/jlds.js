#!/usr/bin/env node
"use strict";

// Launcher for the JLDS CLI. The actual binary is a native Rust executable
// shipped in a per-platform package (an optionalDependency); npm installs only
// the one matching this machine. We resolve it and hand off, forwarding args,
// stdio, and exit code unchanged.

const { spawnSync } = require("node:child_process");

// platform + arch  ->  { package, binary }
const TARGETS = {
  "darwin arm64": { pkg: "jlds-cli-darwin-arm64", bin: "jlds" },
  "darwin x64": { pkg: "jlds-cli-darwin-x64", bin: "jlds" },
  "linux arm64": { pkg: "jlds-cli-linux-arm64", bin: "jlds" },
  "linux x64": { pkg: "jlds-cli-linux-x64", bin: "jlds" },
  "win32 x64": { pkg: "jlds-cli-win32-x64", bin: "jlds.exe" },
};

const key = `${process.platform} ${process.arch}`;
const target = TARGETS[key];

if (!target) {
  console.error(`jlds: no prebuilt binary for your platform (${key}).`);
  console.error(
    "Install from source instead:\n" +
      "  cargo install --git https://github.com/jarooda/jlds.git jlds"
  );
  process.exit(1);
}

let binPath;
try {
  binPath = require.resolve(`${target.pkg}/bin/${target.bin}`);
} catch (_err) {
  console.error(
    `jlds: the platform package "${target.pkg}" is not installed.\n` +
      "This usually means optional dependencies were skipped (e.g. installing\n" +
      "with --no-optional or --omit=optional). Reinstall with optional deps enabled."
  );
  process.exit(1);
}

const result = spawnSync(binPath, process.argv.slice(2), { stdio: "inherit" });

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status === null ? 1 : result.status);
