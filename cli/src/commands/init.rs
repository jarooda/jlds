use anyhow::{bail, Context, Result};
use clap::Args;
use colored::Colorize;
use dialoguer::Input;
use serde::Deserialize;
use std::fs;
use std::io::IsTerminal;
use std::path::Path;

use crate::config::{default_registry, Config, Framework, PathsConfig, TailwindConfig};

#[derive(Args, Debug, Default)]
pub struct InitArgs {
    /// Accept the detected defaults without prompting
    #[arg(short = 'y', long)]
    pub yes: bool,

    /// Framework to configure, skipping detection
    #[arg(long, value_name = "NAME")]
    pub framework: Option<Framework>,

    /// Treat the project as TypeScript, skipping detection
    #[arg(long, overrides_with = "javascript")]
    pub typescript: bool,

    /// Treat the project as JavaScript, skipping detection
    #[arg(long, overrides_with = "typescript")]
    pub javascript: bool,

    /// Global CSS file to inject the design tokens into
    #[arg(long, value_name = "PATH")]
    pub css: Option<String>,

    /// Directory components are installed into
    #[arg(long, visible_alias = "components-dir", value_name = "PATH")]
    pub components: Option<String>,

    /// Directory utilities are installed into
    #[arg(long, visible_alias = "utils-dir", value_name = "PATH")]
    pub utils: Option<String>,

    /// Registry base URL or local path
    #[arg(long, value_name = "URL")]
    pub registry: Option<String>,
}

impl InitArgs {
    /// `--typescript` / `--javascript` override detection; `None` means "detect".
    fn typescript_override(&self) -> Option<bool> {
        match (self.typescript, self.javascript) {
            (true, _) => Some(true),
            (_, true) => Some(false),
            _ => None,
        }
    }
}

pub async fn run(args: InitArgs) -> Result<()> {
    println!("{}", "Initializing JLDS in your project...".bold());
    println!();

    // Prompting needs a terminal to read from. Without one (CI, `docker run`, an agent
    // shell) fall back to the detected defaults instead of failing on "not a terminal".
    let has_tty = std::io::stdin().is_terminal();
    let interactive = !args.yes && has_tty;
    if !has_tty && !args.yes {
        println!(
            "  {}",
            "No interactive terminal — using detected defaults.".dimmed()
        );
        println!();
    }

    let detected = detect_project(&args)?;

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

    let tailwind_css = resolve(
        args.css.clone(),
        "Global CSS file path",
        detected.defaults.css.clone(),
        interactive,
    )?;

    let tailwind_config = detected.tailwind
        .as_ref()
        .map(|t| t.config_path.clone())
        .unwrap_or_default();

    let components_path = resolve(
        args.components.clone(),
        "Where should components be installed?",
        detected.defaults.components.clone(),
        interactive,
    )?;

    let utils_path = resolve(
        args.utils.clone(),
        "Where should utilities be installed?",
        detected.defaults.utils.clone(),
        interactive,
    )?;

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
        registry: args.registry.clone().unwrap_or_else(default_registry),
    };

    config.save()?;
    println!();
    println!("{} {}", "✓".green().bold(), "Created jlds.json");

    inject_css_tokens(&config)?;

    if detected.nuxt {
        warn_unregistered_nuxt_css(&config.tailwind.css);
    }

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
    defaults: Defaults,
    /// Nuxt needs the global stylesheet registered in nuxt.config to be loaded at all.
    nuxt: bool,
}

/// Suggested paths for the three prompts, keyed off the project layout.
struct Defaults {
    css: String,
    components: String,
    utils: String,
}

fn detect_project(args: &InitArgs) -> Result<ProjectDetected> {
    if !Path::new("package.json").exists() {
        bail!("No package.json found. Run `jlds init` from your project root.");
    }

    let content = fs::read_to_string("package.json").context("Failed to read package.json")?;
    let pkg: PackageJson = serde_json::from_str(&content).context("Invalid package.json")?;

    // Framework detection
    let has_react = pkg.has("react") || pkg.has("next");
    let has_vue = pkg.has("vue") || pkg.has("nuxt") || pkg.has("@nuxtjs/core");

    let framework = match args.framework {
        Some(framework) => framework,
        None => match (has_react, has_vue) {
            (true, false) => Framework::React,
            (false, true) => Framework::Vue,
            (true, true) => bail!(
                "Both React and Vue detected in package.json. \
                 Pass `--framework react|vue` to choose one."
            ),
            (false, false) => bail!(
                "Could not detect framework. \
                 Install react or vue before running `jlds init`, \
                 or pass `--framework react|vue`."
            ),
        },
    };

    // The meta-framework suffix is cosmetic, so it's derived from package.json even when
    // the framework itself came from --framework.
    let framework_label = match framework {
        Framework::React if pkg.has("next") => "React (Next.js)",
        Framework::React => "React",
        Framework::Vue if pkg.has("nuxt") || pkg.has("@nuxtjs/core") => "Vue (Nuxt)",
        Framework::Vue => "Vue",
    }
    .to_string();

    // TypeScript detection
    let typescript = args.typescript_override().unwrap_or_else(|| {
        pkg.has("typescript")
            || Path::new("tsconfig.json").exists()
            || Path::new("tsconfig.app.json").exists()
    });

    // Tailwind detection
    let tailwind = if pkg.has("tailwindcss") {
        let is_v4 = major_version(pkg.version("tailwindcss")).is_some_and(|major| major >= 4);
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

    let nuxt = framework == Framework::Vue && (pkg.has("nuxt") || pkg.has("@nuxtjs/core"));
    let defaults = defaults_for(framework, nuxt, &pkg);

    Ok(ProjectDetected { framework, framework_label, typescript, tailwind, defaults, nuxt })
}

/// Nuxt 4 moved application code under `app/` — components there are auto-imported, the ones
/// in a Vite-style `src/` are not. Nuxt 3 projects opted into the same layout via
/// `compatibilityVersion: 4`, so an existing `app/` directory counts too.
fn defaults_for(framework: Framework, nuxt: bool, pkg: &PackageJson) -> Defaults {
    if nuxt {
        let app_dir = major_version(pkg.version("nuxt")).is_some_and(|major| major >= 4)
            || Path::new("app").is_dir();
        let prefix = if app_dir { "app/" } else { "" };
        return Defaults {
            css: first_existing(
                &[
                    &format!("{prefix}assets/css/main.css"),
                    &format!("{prefix}assets/main.css"),
                ],
                &format!("{prefix}assets/css/main.css"),
            ),
            components: format!("{prefix}components/ui"),
            utils: format!("{prefix}lib/utils"),
        };
    }

    let css = match framework {
        Framework::Vue => first_existing(&["src/assets/main.css", "src/style.css"], "src/assets/main.css"),
        Framework::React => first_existing(&["src/index.css", "src/app/globals.css"], "src/index.css"),
    };
    Defaults {
        css,
        components: "src/components/ui".to_string(),
        utils: "src/lib/utils".to_string(),
    }
}

/// Major version from a semver range (`^4.1.2`, `~4`, `>=4.0.0`, `4.x`), ignoring any prefix.
fn major_version(range: Option<&str>) -> Option<u32> {
    let digits: String = range?
        .trim_start_matches(|c: char| !c.is_ascii_digit())
        .chars()
        .take_while(char::is_ascii_digit)
        .collect();
    digits.parse().ok()
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/// Nuxt only loads a global stylesheet that is listed in `nuxt.config`, so injecting the
/// tokens isn't enough on its own. Point that out unless the config already references it.
fn warn_unregistered_nuxt_css(css_path: &str) {
    let stem = css_path.strip_prefix("app/").unwrap_or(css_path);
    let registered = ["nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs"]
        .iter()
        .filter_map(|c| fs::read_to_string(c).ok())
        .any(|config| config.contains(stem));
    if registered {
        return;
    }
    println!(
        "{} Add {} to the `css` array in nuxt.config for the tokens to load.",
        "!".yellow().bold(),
        format!("'~/{stem}'").cyan()
    );
}

/// A value comes from its flag if given, from an interactive prompt when there is a terminal
/// to prompt on, and from the default otherwise (echoed so the log shows what was chosen).
fn resolve(flag: Option<String>, prompt: &str, default: String, interactive: bool) -> Result<String> {
    if let Some(value) = flag {
        return Ok(value);
    }
    if !interactive {
        println!("  {} {}", prompt.dimmed(), default.cyan());
        return Ok(default);
    }
    Input::new()
        .with_prompt(prompt)
        .default(default)
        .interact_text()
        .map_err(Into::into)
}

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

    // index.css @imports breakpoints.css (for the all.css bundle and the docs previews),
    // but init inlines those tokens via JLDS_BREAKPOINTS — drop the import line so the
    // injected stylesheet has no dangling `@import "./breakpoints.css"`.
    let jlds_css: String = JLDS_CSS
        .lines()
        .filter(|l| !l.contains("breakpoints.css"))
        .collect::<Vec<_>>()
        .join("\n");

    let updated = if existing.trim().is_empty() {
        // Fresh file — write the whole stylesheet as-is, then the responsive tokens.
        format!("{jlds_css}\n{JLDS_BREAKPOINTS}")
    } else {
        // Existing file — hoist @import to top (CSS spec: must precede all rules),
        // append the tokens + resets + responsive tokens at the bottom
        let (font_import, tokens) = jlds_css
            .split_once("\n\n")
            .expect("registry/css/index.css must start with the font @import followed by a blank line");

        let import_prefix = if existing.contains("fonts.googleapis.com/css2?family=Geist") {
            String::new()
        } else {
            format!("{font_import}\n\n")
        };
        format!("{import_prefix}{}\n\n{tokens}\n\n{JLDS_BREAKPOINTS}", existing.trim_end())
    };

    fs::write(css_path, &updated)
        .with_context(|| format!("Failed to write to {css_path}"))?;

    println!("{} Injected JLDS design tokens into {css_path}", "✓".green().bold());
    Ok(())
}

const JLDS_CSS: &str = include_str!("../../../registry/css/index.css");
const JLDS_BREAKPOINTS: &str = include_str!("../../../registry/css/breakpoints.css");
