#!/usr/bin/env node
"use strict";

// Launcher for the JLDS CLI. The real program is a native Rust binary attached
// to the matching GitHub Release. On first run we download the binary for this
// platform, cache it by version, then hand off — forwarding args, stdio, and
// exit code. Subsequent runs reuse the cached binary (no network).

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const https = require("node:https");
const { spawnSync } = require("node:child_process");

const pkg = require("../package.json");
const VERSION = pkg.version;
const REPO = "jarooda/jlds";

// platform + arch  ->  rust target triple used in the release asset name
const TARGETS = {
  "darwin arm64": "aarch64-apple-darwin",
  "darwin x64": "x86_64-apple-darwin",
  "linux arm64": "aarch64-unknown-linux-gnu",
  "linux x64": "x86_64-unknown-linux-gnu",
  "win32 x64": "x86_64-pc-windows-msvc",
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

const isWin = process.platform === "win32";
const ext = isWin ? ".exe" : "";
const assetName = `jlds-${target}${ext}`;

function cacheRoot() {
  if (isWin) return process.env.LOCALAPPDATA || os.tmpdir();
  return process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache");
}

const cacheDir = path.join(cacheRoot(), "jlds", VERSION);
const binPath = path.join(cacheDir, `jlds${ext}`);

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "User-Agent": "jlds-cli" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        resolve(download(res.headers.location, dest));
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => file.close((err) => (err ? reject(err) : resolve())));
      file.on("error", reject);
    });
    req.on("error", reject);
  });
}

(async () => {
  if (!fs.existsSync(binPath)) {
    const url = `https://github.com/${REPO}/releases/download/v${VERSION}/${assetName}`;
    process.stderr.write(`jlds: downloading ${assetName} (v${VERSION})…\n`);
    try {
      fs.mkdirSync(cacheDir, { recursive: true });
      const tmp = `${binPath}.tmp-${process.pid}`;
      await download(url, tmp);
      if (!isWin) fs.chmodSync(tmp, 0o755);
      fs.renameSync(tmp, binPath);
    } catch (err) {
      console.error(`jlds: failed to download the CLI binary (${err.message}).`);
      console.error(`  asset: ${url}`);
      console.error(
        "  If this keeps happening, install from source:\n" +
          "    cargo install --git https://github.com/jarooda/jlds.git jlds"
      );
      process.exit(1);
    }
  }

  const result = spawnSync(binPath, process.argv.slice(2), { stdio: "inherit" });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  process.exit(result.status === null ? 1 : result.status);
})();
