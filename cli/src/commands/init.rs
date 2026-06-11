use anyhow::{bail, Context, Result};
use colored::Colorize;
use dialoguer::Input;
use serde::Deserialize;
use std::fs;
use std::path::Path;

use crate::config::{Config, Framework, PathsConfig, TailwindConfig, DEFAULT_REGISTRY};

pub async fn run() -> Result<()> {
    println!("{}", "Initializing JLDS in your project...".bold());
    println!();

    let detected = detect_project()?;

    // Print what was auto-detected
    println!(
        "  {} {} · {}{}",
        "Detected".dimmed(),
        detected.framework_label.cyan().bold(),
        if detected.typescript { "TypeScript" } else { "JavaScript" },
        detected.tailwind.as_ref()
            .map(|t| format!(" · Tailwind {}", t.version_label))
            .unwrap_or_default()
    );
    println!();

    let default_css = match detected.framework {
        Framework::Vue => first_existing(&["src/assets/main.css", "src/style.css"], "src/assets/main.css"),
        Framework::React => first_existing(&["src/index.css", "src/app/globals.css"], "src/index.css"),
    };

    let tailwind_css: String = Input::new()
        .with_prompt("Global CSS file path")
        .default(default_css)
        .interact_text()?;

    let tailwind_config = detected.tailwind
        .as_ref()
        .map(|t| t.config_path.clone())
        .unwrap_or_default();

    let components_path: String = Input::new()
        .with_prompt("Where should components be installed?")
        .default("src/components/ui".to_string())
        .interact_text()?;

    let utils_path: String = Input::new()
        .with_prompt("Where should utilities be installed?")
        .default("src/lib/utils".to_string())
        .interact_text()?;

    let config = Config {
        framework: detected.framework,
        typescript: detected.typescript,
        tailwind: TailwindConfig {
            config: tailwind_config,
            css: tailwind_css,
        },
        paths: PathsConfig {
            components: components_path,
            utils: utils_path,
        },
        registry: DEFAULT_REGISTRY.to_string(),
    };

    config.save()?;
    println!();
    println!("{} {}", "✓".green().bold(), "Created jlds.json");

    inject_css_tokens(&config)?;

    println!();
    println!("{}", "Run `jlds add button` to add your first component.".dimmed());

    Ok(())
}

// ── Project detection ────────────────────────────────────────────────────────

#[derive(Deserialize)]
struct PackageJson {
    #[serde(default)]
    dependencies: std::collections::HashMap<String, String>,
    #[serde(rename = "devDependencies", default)]
    dev_dependencies: std::collections::HashMap<String, String>,
}

impl PackageJson {
    fn has(&self, pkg: &str) -> bool {
        self.dependencies.contains_key(pkg) || self.dev_dependencies.contains_key(pkg)
    }

    fn version(&self, pkg: &str) -> Option<&str> {
        self.dependencies.get(pkg)
            .or_else(|| self.dev_dependencies.get(pkg))
            .map(String::as_str)
    }
}

struct TailwindDetected {
    config_path: String,
    version_label: String,
}

struct ProjectDetected {
    framework: Framework,
    framework_label: String,
    typescript: bool,
    tailwind: Option<TailwindDetected>,
}

fn detect_project() -> Result<ProjectDetected> {
    if !Path::new("package.json").exists() {
        bail!("No package.json found. Run `jlds init` from your project root.");
    }

    let content = fs::read_to_string("package.json").context("Failed to read package.json")?;
    let pkg: PackageJson = serde_json::from_str(&content).context("Invalid package.json")?;

    // Framework detection
    let has_react = pkg.has("react") || pkg.has("next");
    let has_vue = pkg.has("vue") || pkg.has("nuxt") || pkg.has("@nuxtjs/core");

    let (framework, framework_label) = match (has_react, has_vue) {
        (true, false) => {
            let label = if pkg.has("next") { "React (Next.js)" } else { "React" };
            (Framework::React, label.to_string())
        }
        (false, true) => {
            let label = if pkg.has("nuxt") || pkg.has("@nuxtjs/core") { "Vue (Nuxt)" } else { "Vue" };
            (Framework::Vue, label.to_string())
        }
        (true, true) => bail!(
            "Both React and Vue detected in package.json. \
             Set \"framework\" manually in jlds.json after init."
        ),
        (false, false) => bail!(
            "Could not detect framework. \
             Install react or vue before running `jlds init`."
        ),
    };

    // TypeScript detection
    let typescript = pkg.has("typescript")
        || Path::new("tsconfig.json").exists()
        || Path::new("tsconfig.app.json").exists();

    // Tailwind detection
    let tailwind = if pkg.has("tailwindcss") {
        let ver = pkg.version("tailwindcss").unwrap_or("unknown");
        let is_v4 = ver.starts_with('^') && ver[1..].starts_with('4')
            || ver.starts_with('4');
        let config_path = if is_v4 {
            String::new() // v4 has no config file
        } else {
            first_existing(
                &["tailwind.config.ts", "tailwind.config.js"],
                "tailwind.config.ts",
            )
        };
        Some(TailwindDetected {
            config_path,
            version_label: if is_v4 { "v4".to_string() } else { "v3".to_string() },
        })
    } else {
        None
    };

    Ok(ProjectDetected { framework, framework_label, typescript, tailwind })
}

// ── Helpers ──────────────────────────────────────────────────────────────────

fn first_existing(candidates: &[&str], fallback: &str) -> String {
    candidates
        .iter()
        .find(|p| Path::new(p).exists())
        .map(|s| s.to_string())
        .unwrap_or_else(|| fallback.to_string())
}

// ── CSS token injection ──────────────────────────────────────────────────────

fn inject_css_tokens(config: &Config) -> Result<()> {
    let css_path = &config.tailwind.css;

    let existing = if Path::new(css_path).exists() {
        fs::read_to_string(css_path)
            .with_context(|| format!("Failed to read {css_path}"))?
    } else {
        if let Some(parent) = Path::new(css_path).parent() {
            fs::create_dir_all(parent)?;
        }
        String::new()
    };

    if existing.contains("JLDS Design System") {
        println!("{} CSS tokens already present in {css_path}", "✓".green().bold());
        return Ok(());
    }

    let updated = if existing.trim().is_empty() {
        // Fresh file — write the whole stylesheet as-is
        JLDS_CSS.to_string()
    } else {
        // Existing file — hoist @import to top (CSS spec: must precede all rules),
        // append the tokens + resets at the bottom
        let (font_import, tokens) = JLDS_CSS
            .split_once("\n\n")
            .expect("registry/css/index.css must start with the font @import followed by a blank line");

        let import_prefix = if existing.contains("fonts.googleapis.com/css2?family=Geist") {
            String::new()
        } else {
            format!("{font_import}\n\n")
        };
        format!("{import_prefix}{}\n\n{tokens}", existing.trim_end())
    };

    fs::write(css_path, &updated)
        .with_context(|| format!("Failed to write to {css_path}"))?;

    println!("{} Injected JLDS design tokens into {css_path}", "✓".green().bold());
    Ok(())
}

const JLDS_CSS: &str = include_str!("../../../registry/css/index.css");
