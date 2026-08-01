use anyhow::{Context, Result};
use colored::Colorize;
use indicatif::{ProgressBar, ProgressStyle};
use std::collections::{HashMap, HashSet, VecDeque};
use std::fs;
use std::path::{Component as PathComponent, Path};
use std::process::Command;

use crate::config::Config;
use crate::registry::{ComponentMeta, RegistryClient};

pub async fn run(components: Vec<String>, registry: Option<String>) -> Result<()> {
    let config = Config::load()?;
    // A --registry override applies to this run only; the pin in jlds.json is left alone.
    let registry = registry.unwrap_or_else(|| config.registry.clone());
    super::warn_if_registry_behind(&registry).await;
    let client = RegistryClient::new(&registry);
    let framework = config.framework.to_string();
    let pm = detect_package_manager();

    // Resolve the full install set: the requested components plus any transitive
    // `registryDependencies` they declare. Metadata is fetched once here and reused
    // during install. `requested` marks which names the user asked for directly, so
    // dependency-only components can be labelled in the output.
    let requested: HashSet<String> = components.iter().cloned().collect();
    let mut order: Vec<String> = Vec::new();
    let mut metas: HashMap<String, ComponentMeta> = HashMap::new();
    let mut seen: HashSet<String> = HashSet::new();
    let mut queue: VecDeque<String> = components.iter().cloned().collect();

    while let Some(name) = queue.pop_front() {
        if !seen.insert(name.clone()) {
            continue;
        }
        let meta = client.fetch_component(&name, &framework).await?;
        for dep in &meta.registry_dependencies {
            if !seen.contains(dep) {
                queue.push_back(dep.clone());
            }
        }
        order.push(name.clone());
        metas.insert(name, meta);
    }

    for name in &order {
        let meta = &metas[name];

        if requested.contains(name) {
            println!("{} {}", "Adding".bold(), name.cyan().bold());
        } else {
            println!(
                "{} {} {}",
                "Adding".bold(),
                name.cyan().bold(),
                "(registry dependency)".dimmed()
            );
        }

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
            let final_content = strip_stylesheet_reference(final_content, name);
            fs::write(output_dir.join(file), final_content)?;
            pb.inc(1);
        }

        let css = client.fetch_css(name).await?;
        let css_file = output_dir.join(format!("{name}.css"));
        fs::write(&css_file, css)?;

        pb.finish_and_clear();
        println!("{} {}", "✓".green().bold(), name);

        register_stylesheet(&config, name, &css_file)?;

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

// ── Component stylesheet wiring ──────────────────────────────────────────────
//
// Registry sources reference their own stylesheet inline — `import "./button.css"` in React,
// `<style src="./button.css">` in Vue. That works under Vite, Nuxt and the Next App Router,
// but the Next Pages Router rejects any non-module CSS imported outside `pages/_app`, so a
// component installed as-authored refuses to compile there.
//
// Rather than special-case one bundler, the reference is stripped on the way in and replaced
// with an `@import` in the project's global stylesheet — the same file `init` injects the
// design tokens into. Every framework loads it the same way, and the global stylesheet ends
// up listing exactly which components are installed.

/// Drops the component's own reference to `./<name>.css` — React's `import` statement or
/// Vue's `<style src>` tag. A component may spread across several files (date-picker's
/// `DatePicker.vue` and `Calendar.vue` both pull in `date-picker.css`); each is stripped,
/// and `register_stylesheet` adds the single `@import` that replaces them all.
fn strip_stylesheet_reference(content: String, name: &str) -> String {
    let mut lines: Vec<&str> = content
        .lines()
        .filter(|line| !is_stylesheet_reference(line, name))
        .collect();

    // Vue's `<style src>` sits at the end of the file; removing it leaves trailing blanks.
    while lines.last().is_some_and(|line| line.trim().is_empty()) {
        lines.pop();
    }

    format!("{}\n", lines.join("\n"))
}

fn is_stylesheet_reference(line: &str, name: &str) -> bool {
    let trimmed = line.trim();
    let references_css = trimmed.contains(&format!("\"./{name}.css\""))
        || trimmed.contains(&format!("'./{name}.css'"));

    references_css && (trimmed.starts_with("import ") || trimmed.starts_with("<style"))
}

/// Adds `@import "<relative path>";` for the component's stylesheet to the project's global
/// CSS. Idempotent — re-running `add`/`update` for a component already listed changes nothing.
fn register_stylesheet(config: &Config, name: &str, component_css: &Path) -> Result<()> {
    let global_css = config.tailwind.css.trim();
    let import_line = |target: &str| format!("@import \"{target}\";");

    if global_css.is_empty() || !Path::new(global_css).exists() {
        eprintln!(
            "  {} No global stylesheet at {} — run {} first, then add:",
            "!".yellow().bold(),
            if global_css.is_empty() { "(unset in jlds.json)" } else { global_css },
            "jlds init".cyan()
        );
        eprintln!("  {}", import_line(&format!("./{name}.css")).cyan());
        return Ok(());
    }

    let target = relative_import_path(Path::new(global_css), component_css);
    let line = import_line(&target);

    let existing = fs::read_to_string(global_css)
        .with_context(|| format!("Failed to read {global_css}"))?;

    if existing.lines().any(|l| l.trim() == line) {
        return Ok(());
    }

    let updated = insert_after_leading_imports(&existing, &line);
    fs::write(global_css, updated)
        .with_context(|| format!("Failed to write to {global_css}"))?;

    println!("  {} Registered {name}.css in {global_css}", "→".dimmed());
    Ok(())
}

/// `@import` targets resolve against the importing stylesheet, so the path is expressed
/// relative to the global CSS file's own directory.
fn relative_import_path(global_css: &Path, component_css: &Path) -> String {
    let from = path_segments(global_css.parent().unwrap_or_else(|| Path::new("")));
    let to = path_segments(component_css);

    let shared = from
        .iter()
        .zip(&to)
        .take_while(|(a, b)| a == b)
        .count();

    let mut segments: Vec<String> = vec!["..".to_string(); from.len() - shared];
    segments.extend(to[shared..].iter().cloned());

    let joined = segments.join("/");
    if joined.starts_with("..") {
        joined
    } else {
        format!("./{joined}")
    }
}

/// Splits a path into comparable segments, dropping `.`. Both paths come from `jlds.json`
/// and are project-relative, so `..` segments aren't expected; keeping them verbatim leaves
/// the prefix comparison conservative rather than wrong.
fn path_segments(path: &Path) -> Vec<String> {
    path.components()
        .filter_map(|component| match component {
            PathComponent::Normal(segment) => Some(segment.to_string_lossy().into_owned()),
            PathComponent::ParentDir => Some("..".to_string()),
            _ => None,
        })
        .collect()
}

/// CSS requires `@import` to precede every rule, so the new line goes after the stylesheet's
/// existing leading imports (the Geist font import `init` writes, plus any components already
/// registered) and before the first real rule.
fn insert_after_leading_imports(existing: &str, line: &str) -> String {
    let mut lines: Vec<String> = existing.lines().map(String::from).collect();
    let mut insert_at = 0;

    for (index, current) in lines.iter().enumerate() {
        let trimmed = current.trim();
        if trimmed.starts_with("@import") || trimmed.starts_with("@charset") {
            insert_at = index + 1;
        } else if trimmed.is_empty() || trimmed.starts_with("/*") || trimmed.starts_with('*') {
            continue;
        } else {
            break;
        }
    }

    lines.insert(insert_at, line.to_string());
    format!("{}\n", lines.join("\n"))
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
