use anyhow::{bail, Context, Result};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

pub const CONFIG_FILE: &str = "jlds.json";

/// Registry content is served from jsDelivr's GitHub mirror pinned to this build's own
/// release tag (not `@main`), so `npx jlds add` always matches the CLI version that fetched
/// it — and jsDelivr treats tags as immutable, so the cache never goes stale.
///
/// The pin is written into `jlds.json` at init and read back by every later command, so a
/// project stays on the registry it was set up with until someone repoints it. Commands that
/// write files say so when that pin is behind the running CLI — see `registry_behind_cli`.
pub fn default_registry() -> String {
    format!("{REGISTRY_PREFIX}{}{REGISTRY_SUFFIX}", cli_version())
}

const REGISTRY_PREFIX: &str = "https://cdn.jsdelivr.net/gh/jarooda/jlds@v";
const REGISTRY_SUFFIX: &str = "/registry";

/// The version this binary was built as — the newest registry it knows about. Release CI
/// stamps it from the git tag, so it is also the newest release that existed at build time.
pub fn cli_version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

/// The version pinned by an official jsDelivr registry URL, if that is what this is. A local
/// path, a fork, or a `@main` URL is a deliberate choice, so it yields `None` and stays quiet.
fn pinned_version(registry: &str) -> Option<&str> {
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

/// The pinned version when `jlds.json` points at an official registry older than this CLI —
/// meaning releases have shipped that this project won't fetch until it is repointed.
pub fn registry_behind_cli(registry: &str) -> Option<&str> {
    let pinned = pinned_version(registry)?;
    (semver_parts(pinned)? < semver_parts(cli_version())?).then_some(pinned)
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
    pub fn load() -> Result<Self> {
        let path = Self::find()?;
        let content = fs::read_to_string(&path)
            .with_context(|| format!("Failed to read {CONFIG_FILE}"))?;
        serde_json::from_str(&content)
            .with_context(|| format!("Invalid {CONFIG_FILE}"))
    }

    pub fn save(&self) -> Result<()> {
        let content = serde_json::to_string_pretty(self)?;
        fs::write(CONFIG_FILE, content)?;
        Ok(())
    }

    fn find() -> Result<PathBuf> {
        let path = Path::new(CONFIG_FILE);
        if path.exists() {
            Ok(path.to_path_buf())
        } else {
            bail!(
                "No {CONFIG_FILE} found. Run `jlds init` to set up your project."
            )
        }
    }
}
