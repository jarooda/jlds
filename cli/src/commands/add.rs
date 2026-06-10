use anyhow::{Context, Result};
use colored::Colorize;
use indicatif::{ProgressBar, ProgressStyle};
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::process::Command;

use crate::config::Config;
use crate::registry::RegistryClient;

pub async fn run(components: Vec<String>) -> Result<()> {
    let config = Config::load()?;
    let client = RegistryClient::new(&config.registry);
    let framework = config.framework.to_string();
    let pm = detect_package_manager();

    for name in &components {
        println!("{} {}", "Adding".bold(), name.cyan().bold());

        let meta = client.fetch_component(name, &framework).await?;

        let files = match framework.as_str() {
            "react" => meta.files.react.as_ref(),
            "vue" => meta.files.vue.as_ref(),
            _ => unreachable!(),
        };

        let files = match files {
            Some(f) => f,
            None => {
                eprintln!("{} No files found for framework '{framework}'", "✗".red());
                continue;
            }
        };

        let output_dir = Path::new(&config.paths.components).join(name);
        fs::create_dir_all(&output_dir)?;

        let pb = ProgressBar::new(files.len() as u64);
        pb.set_style(
            ProgressStyle::default_bar()
                .template("  {bar:30.cyan/blue} {pos}/{len} {msg}")?
                .progress_chars("=>-"),
        );

        let mut shared: HashMap<String, String> = HashMap::new();
        for file in &meta.files.shared {
            let content = client.fetch_shared_file(name, file).await?;
            shared.insert(file.clone(), content);
        }

        for file in files {
            pb.set_message(file.clone());
            let content = client.fetch_file(name, &framework, file).await?;
            let final_content = inline_shared(content, &shared);
            fs::write(output_dir.join(file), final_content)?;
            pb.inc(1);
        }

        pb.finish_and_clear();
        println!("{} {}", "✓".green().bold(), name);

        install_deps(&meta.dependencies, false, &pm)?;
        install_deps(&meta.dev_dependencies, true, &pm)?;
    }

    Ok(())
}

#[derive(Debug)]
enum PackageManager {
    Pnpm,
    Yarn,
    Bun,
    Npm,
}

impl PackageManager {
    fn name(&self) -> &str {
        match self {
            Self::Pnpm => "pnpm",
            Self::Yarn => "yarn",
            Self::Bun => "bun",
            Self::Npm => "npm",
        }
    }

    fn add_args(&self, dev: bool) -> Vec<&str> {
        match self {
            Self::Pnpm => if dev { vec!["add", "-D"] } else { vec!["add"] },
            Self::Yarn => if dev { vec!["add", "-D"] } else { vec!["add"] },
            Self::Bun  => if dev { vec!["add", "-D"] } else { vec!["add"] },
            Self::Npm  => if dev { vec!["install", "-D"] } else { vec!["install"] },
        }
    }
}

fn detect_package_manager() -> PackageManager {
    if Path::new("pnpm-lock.yaml").exists() {
        PackageManager::Pnpm
    } else if Path::new("yarn.lock").exists() {
        PackageManager::Yarn
    } else if Path::new("bun.lock").exists() || Path::new("bun.lockb").exists() {
        PackageManager::Bun
    } else {
        PackageManager::Npm
    }
}

fn install_deps(deps: &[String], dev: bool, pm: &PackageManager) -> Result<()> {
    if deps.is_empty() {
        return Ok(());
    }

    let label = if dev { "dev dependencies" } else { "dependencies" };
    println!(
        "  {} Installing {} via {}: {}",
        "→".dimmed(),
        label,
        pm.name().cyan(),
        deps.join(", ").dimmed()
    );

    let mut args = pm.add_args(dev);
    args.extend(deps.iter().map(String::as_str));

    let status = Command::new(pm.name())
        .args(&args)
        .status()
        .with_context(|| format!("Failed to run {} — is it installed?", pm.name()))?;

    if !status.success() {
        anyhow::bail!(
            "{} failed to install {}. Run manually: {} {} {}",
            pm.name(),
            label,
            pm.name(),
            pm.add_args(dev).join(" "),
            deps.join(" ")
        );
    }

    Ok(())
}

// Prepends shared file content and removes the corresponding import block from the framework file.
// Only processes files that actually import from the shared file.
fn inline_shared(content: String, shared: &HashMap<String, String>) -> String {
    let is_vue = content.contains("<script setup");
    let mut result = content;

    for (filename, shared_content) in shared {
        let stem = filename.trim_end_matches(".ts").trim_end_matches(".tsx");

        if !result.contains(&format!("../{stem}")) {
            continue;
        }

        result = remove_import_block(result, stem);

        if is_vue {
            // Inside <script setup>, `export` is invalid — strip it from declarations
            let stripped = shared_content
                .lines()
                .map(|line| line.strip_prefix("export ").unwrap_or(line))
                .collect::<Vec<_>>()
                .join("\n");
            result = inject_into_script_setup(result, stripped.trim_start_matches('\n'));
        } else {
            let shared_trimmed = shared_content.trim_start_matches('\n');
            result = format!("{shared_trimmed}\n\n{result}");
        }
    }

    result
}

// Injects shared content right after the opening <script setup ...> tag.
fn inject_into_script_setup(content: String, shared: &str) -> String {
    // Find the closing `>` of the `<script setup ...>` opening tag
    let Some(tag_start) = content.find("<script setup") else {
        return content;
    };
    let Some(relative_end) = content[tag_start..].find('>') else {
        return content;
    };
    let tag_end = tag_start + relative_end + 1; // position after `>`

    format!(
        "{}\n{}\n{}",
        &content[..tag_end],
        shared,
        content[tag_end..].trim_start_matches('\n')
    )
}

// Finds `import { ... } from "../<stem>"` (single- or multi-line) and removes it entirely.
fn remove_import_block(content: String, stem: &str) -> String {
    let marker = format!("from \"../{stem}\"");

    let Some(from_pos) = content.find(&marker) else {
        return content;
    };

    let after_marker = from_pos + marker.len();
    let end = content[after_marker..]
        .find('\n')
        .map(|i| after_marker + i + 1)
        .unwrap_or(content.len());

    let before = &content[..from_pos];
    let import_pos = before.rfind("import ").unwrap_or(from_pos);

    format!("{}{}", content[..import_pos].trim_end_matches('\n'), &content[end..])
}
