use anyhow::{bail, Context, Result};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

pub const CONFIG_FILE: &str = "jlds.json";
pub const DEFAULT_REGISTRY: &str =
    "https://cdn.jsdelivr.net/gh/jlds-dev/registry@main";

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(rename = "$schema", default = "default_schema")]
    pub schema: String,
    pub framework: Framework,
    pub typescript: bool,
    pub tailwind: TailwindConfig,
    pub paths: PathsConfig,
    #[serde(default = "default_registry")]
    pub registry: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
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

fn default_schema() -> String {
    "https://jlds.dev/schema.json".to_string()
}

fn default_registry() -> String {
    DEFAULT_REGISTRY.to_string()
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
