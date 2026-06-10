use anyhow::{Context, Result};
use serde::Deserialize;
use std::fs;

#[derive(Debug, Deserialize)]
pub struct Registry {
    pub version: String,
    pub components: Vec<ComponentMeta>,
}

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ComponentMeta {
    pub name: String,
    pub description: String,
    pub frameworks: Vec<String>,
    pub dependencies: Vec<String>,
    pub dev_dependencies: Vec<String>,
    pub files: ComponentFiles,
    #[serde(default)]
    pub registry_dependencies: Vec<String>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct ComponentFiles {
    #[serde(default)]
    pub shared: Vec<String>,
    pub react: Option<Vec<String>>,
    pub vue: Option<Vec<String>>,
}

pub struct RegistryClient {
    base_url: String,
    client: reqwest::Client,
}

impl RegistryClient {
    pub fn new(base_url: &str) -> Self {
        Self {
            base_url: base_url.trim_end_matches('/').to_string(),
            client: reqwest::Client::new(),
        }
    }

    fn is_local(&self) -> bool {
        self.base_url.starts_with('/')
            || self.base_url.starts_with("./")
            || self.base_url.starts_with("../")
            || self.base_url.starts_with("file://")
    }

    async fn fetch_text(&self, rel_path: &str) -> Result<String> {
        if self.is_local() {
            let base = self.base_url.trim_start_matches("file://");
            let path = format!("{base}/{rel_path}");
            fs::read_to_string(&path)
                .with_context(|| format!("Failed to read local registry file: {path}"))
        } else {
            let url = format!("{}/{}", self.base_url, rel_path);
            self.client
                .get(&url)
                .send()
                .await
                .with_context(|| format!("Failed to reach registry at {url}"))?
                .error_for_status()
                .with_context(|| format!("Registry returned an error for {url}"))?
                .text()
                .await
                .context("Failed to read response body")
        }
    }

    pub async fn fetch_index(&self) -> Result<Registry> {
        let body = self.fetch_text("registry.json").await?;
        serde_json::from_str(&body).context("Failed to parse registry index")
    }

    pub async fn fetch_component(&self, name: &str, framework: &str) -> Result<ComponentMeta> {
        let body = self
            .fetch_text(&format!("components/{name}/meta.json"))
            .await
            .with_context(|| format!("Component '{name}' not found in registry"))?;
        let meta: ComponentMeta = serde_json::from_str(&body)
            .with_context(|| format!("Failed to parse metadata for '{name}'"))?;

        if !meta.frameworks.contains(&framework.to_string()) {
            anyhow::bail!("Component '{name}' does not support framework '{framework}'");
        }

        Ok(meta)
    }

    pub async fn fetch_file(&self, name: &str, framework: &str, file: &str) -> Result<String> {
        self.fetch_text(&format!("components/{name}/{framework}/{file}"))
            .await
            .with_context(|| format!("Failed to fetch file {file}"))
    }

    pub async fn fetch_shared_file(&self, name: &str, file: &str) -> Result<String> {
        self.fetch_text(&format!("components/{name}/{file}"))
            .await
            .with_context(|| format!("Failed to fetch shared file {file}"))
    }
}
