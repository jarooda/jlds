use anyhow::{bail, Context, Result};
use colored::Colorize;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs;
use std::path::Path;
use std::sync::atomic::{AtomicBool, Ordering};

pub const PACKAGE_FILE: &str = "package.json";

/// The key the config lives under in `package.json`, the way `eslintConfig` and `prettier`
/// do — a JLDS project already requires a package.json, so this keeps the project root free
/// of one more tool file.
pub const PACKAGE_KEY: &str = "jlds";

/// Where the config lived before it moved into package.json. Still read, never written.
pub const LEGACY_CONFIG_FILE: &str = "jlds.json";

/// How to name the config's location in help text, now that it is a key rather than a file.
pub const CONFIG_LABEL: &str = "the \"jlds\" key in package.json";

/// Registry content is served from jsDelivr's GitHub mirror pinned to this build's own
/// release tag (not `@main`), so `npx jlds add` always matches the CLI version that fetched
/// it — and jsDelivr treats tags as immutable, so the cache never goes stale.
///
/// The pin is written into the project's config at init and read back by every later command, so a
/// project stays on the registry it was set up with until someone repoints it. Commands that
/// write files say so when that pin is behind the running CLI — see `registry_behind_cli`.
pub fn default_registry() -> String {
    registry_url_for(cli_version())
}

/// The official registry URL for a given release tag.
pub fn registry_url_for(version: &str) -> String {
    format!("{REGISTRY_PREFIX}{version}{REGISTRY_SUFFIX}")
}

const REGISTRY_PREFIX: &str = "https://cdn.jsdelivr.net/gh/jarooda/jlds@v";
const REGISTRY_SUFFIX: &str = "/registry";

/// npm's `latest` dist-tag for the CLI package. Releases publish the npm package and the git
/// tag the registry is served from together, so npm's newest version names the newest registry.
const NPM_LATEST_API: &str = "https://registry.npmjs.org/@jarooda/jlds/latest";

/// The version this binary was built as — the newest registry it knows about. Release CI
/// stamps it from the git tag, so it is also the newest release that existed at build time.
pub fn cli_version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

/// The version pinned by an official jsDelivr registry URL, if that is what this is. A local
/// path, a fork, or a `@main` URL is a deliberate choice, so it yields `None` and stays quiet.
pub fn pinned_version(registry: &str) -> Option<&str> {
    let version = registry
        .strip_prefix(REGISTRY_PREFIX)?
        .strip_suffix(REGISTRY_SUFFIX)?;
    semver_parts(version).map(|_| version)
}

fn semver_parts(version: &str) -> Option<(u32, u32, u32)> {
    let mut parts = version.split('.');
    let tuple = (
        parts.next()?.parse().ok()?,
        parts.next()?.parse().ok()?,
        parts.next()?.parse().ok()?,
    );
    parts.next().is_none().then_some(tuple)
}

/// Whether `version` names an older release than `than`. Anything unparseable compares as
/// older than nothing, so a version this build can't read never provokes a warning.
pub fn is_older(version: &str, than: &str) -> bool {
    match (semver_parts(version), semver_parts(than)) {
        (Some(version), Some(than)) => version < than,
        _ => false,
    }
}

#[derive(Deserialize)]
struct NpmPackument {
    version: String,
}

/// The newest published release, asked of npm.
///
/// npm is the only source that actually knows this. `cli_version()` is not a stand-in: the
/// binary doing the asking is itself usually old — a global install, a lockfile entry, or a
/// warm `npx` cache all pin one — and that is exactly when a project's registry pin is stale
/// too, so measuring a stale pin against an equally stale build reports nothing wrong.
///
/// `None` on any failure — offline, timed out, unparseable — and callers stay quiet rather
/// than guess, so a version check never blocks or fails the command it is advising on.
pub async fn latest_release() -> Option<String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(3))
        .build()
        .ok()?;
    let packument: NpmPackument = client
        .get(NPM_LATEST_API)
        .send()
        .await
        .ok()?
        .error_for_status()
        .ok()?
        .json()
        .await
        .ok()?;

    semver_parts(&packument.version).map(|_| packument.version)
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub framework: Framework,
    pub typescript: bool,
    pub tailwind: TailwindConfig,
    pub paths: PathsConfig,
    #[serde(default = "default_registry")]
    pub registry: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq, clap::ValueEnum)]
#[serde(rename_all = "lowercase")]
pub enum Framework {
    React,
    Vue,
}

impl std::fmt::Display for Framework {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Framework::React => write!(f, "react"),
            Framework::Vue => write!(f, "vue"),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TailwindConfig {
    pub config: String,
    pub css: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PathsConfig {
    pub components: String,
    pub utils: String,
}

impl Config {
    /// Reads the `"jlds"` key from package.json, falling back to a standalone `jlds.json`
    /// for projects initialized before the move.
    ///
    /// The fallback is what keeps this a non-breaking change, and it matters more here than
    /// the usual deprecation: the registry pin is per-project, but the CLI is not — the
    /// documented invocation is `npx @jarooda/jlds@latest`, so every existing project runs
    /// the new binary against its old config the day it ships, with no opt-in step.
    pub fn load() -> Result<Self> {
        if let Some(value) = package_config()? {
            return serde_json::from_value(value)
                .with_context(|| format!("Invalid \"{PACKAGE_KEY}\" config in {PACKAGE_FILE}"));
        }

        if Path::new(LEGACY_CONFIG_FILE).exists() {
            let content = fs::read_to_string(LEGACY_CONFIG_FILE)
                .with_context(|| format!("Failed to read {LEGACY_CONFIG_FILE}"))?;
            let config = serde_json::from_str(&content)
                .with_context(|| format!("Invalid {LEGACY_CONFIG_FILE}"))?;
            warn_legacy_config();
            return Ok(config);
        }

        bail!("No JLDS config found. Run `jlds init` to set up your project.")
    }

    /// Writes the config into package.json's `"jlds"` key, leaving every other key — and
    /// their order — as it was found.
    pub fn save(&self) -> Result<()> {
        let mut manifest = read_package_json()?;
        let Some(map) = manifest.as_object_mut() else {
            bail!("{PACKAGE_FILE} is not a JSON object");
        };
        map.insert(PACKAGE_KEY.to_string(), serde_json::to_value(self)?);

        let mut content = serde_json::to_string_pretty(&manifest)?;
        content.push('\n');
        fs::write(PACKAGE_FILE, content)
            .with_context(|| format!("Failed to write {PACKAGE_FILE}"))?;
        Ok(())
    }
}

/// The parsed package.json, or a "run this from your project root" error.
pub fn read_package_json() -> Result<Value> {
    if !Path::new(PACKAGE_FILE).exists() {
        bail!("No {PACKAGE_FILE} found. Run `jlds` from your project root.");
    }
    let content = fs::read_to_string(PACKAGE_FILE)
        .with_context(|| format!("Failed to read {PACKAGE_FILE}"))?;
    serde_json::from_str(&content).with_context(|| format!("Invalid {PACKAGE_FILE}"))
}

/// The `"jlds"` value from package.json, or `None` when there is no package.json or no key.
/// A missing manifest is not an error here — the caller falls back to `jlds.json` first and
/// reports the absence of any config at all.
fn package_config() -> Result<Option<Value>> {
    if !Path::new(PACKAGE_FILE).exists() {
        return Ok(None);
    }
    Ok(read_package_json()?
        .as_object_mut()
        .and_then(|map| map.remove(PACKAGE_KEY)))
}

static WARNED_LEGACY: AtomicBool = AtomicBool::new(false);

/// Printed once per run — `update` delegates to `add`, so the config is loaded twice there.
fn warn_legacy_config() {
    if WARNED_LEGACY.swap(true, Ordering::Relaxed) {
        return;
    }
    println!(
        "{} Reading config from {}.",
        "!".yellow().bold(),
        LEGACY_CONFIG_FILE.cyan()
    );
    println!(
        "  {}",
        format!(
            "It now belongs under {CONFIG_LABEL} — run `jlds init` to move it, \
             then delete {LEGACY_CONFIG_FILE}."
        )
        .dimmed()
    );
    println!();
}
