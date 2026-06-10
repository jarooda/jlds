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
        schema: "https://jlds.dev/schema.json".to_string(),
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
        // Fresh file — write import + tokens together
        format!("{JLDS_FONT_IMPORT}\n\n{JLDS_TOKENS}")
    } else {
        // Existing file — hoist @import to top (CSS spec: must precede all rules),
        // append :root block at the bottom
        let import_prefix = if existing.contains("fonts.googleapis.com/css2?family=Geist") {
            String::new()
        } else {
            format!("{JLDS_FONT_IMPORT}\n\n")
        };
        format!("{import_prefix}{}\n\n{JLDS_TOKENS}", existing.trim_end())
    };

    fs::write(css_path, &updated)
        .with_context(|| format!("Failed to write to {css_path}"))?;

    println!("{} Injected JLDS design tokens into {css_path}", "✓".green().bold());
    Ok(())
}

const JLDS_FONT_IMPORT: &str = "@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap');";

const JLDS_TOKENS: &str = r#"/* ============================================================
   JLDS Design System — generated by `jlds init`
   Dark-first. Re-theme by remapping the semantic aliases below.
   ============================================================ */

:root {
  /* --- Neutral ramp (cool, slightly green-tinted) --- */
  --neutral-0:   #ffffff;
  --neutral-50:  #eef2f0;
  --neutral-100: #d9e0dd;
  --neutral-200: #97a5a0;
  --neutral-300: #6f7d78;
  --neutral-400: #525e59;
  --neutral-500: #3d4642;
  --neutral-600: #2d3531;
  --neutral-700: #222824;
  --neutral-800: #181d1a;
  --neutral-900: #101412;
  --neutral-950: #0a0d0c;

  /* --- Brand: deep emerald --- */
  --brand-400: #2ea67c;
  --brand-500: #1b8a64;
  --brand-600: #157053;

  /* --- Semantic hues --- */
  --green-400: #4ade80;  --green-700: #86efac;
  --amber-400: #fbbf24;  --amber-700: #fcd34d;
  --red-400:   #f87171;  --red-700:   #fca5a5;
  --sky-400:   #38bdf8;  --sky-700:   #7dd3fc;

  /* --- Surfaces --- */
  --bg-app:          var(--neutral-950);
  --surface-card:    var(--neutral-900);
  --surface-raised:  var(--neutral-800);
  --surface-sunken:  #0d100f;
  --surface-muted:   #141917;

  /* --- Borders --- */
  --border-subtle:  #1f2622;
  --border-default: #2b332e;
  --border-strong:  #3c453f;
  --border-focus:   var(--brand-400);

  /* --- Text --- */
  --text-primary:   #eaf1ed;
  --text-secondary: #a3b0aa;
  --text-tertiary:  #72807a;
  --text-disabled:  #515b56;
  --text-brand:     var(--brand-400);
  --text-on-brand:  #ffffff;

  /* --- Accent (emerald) --- */
  --accent:        var(--brand-500);
  --accent-hover:  var(--brand-400);
  --accent-active: var(--brand-600);
  --accent-subtle: #15271f;
  --accent-muted:  #1d3a2d;
  --accent-ring:   color-mix(in srgb, var(--brand-400) 40%, transparent);

  /* --- Semantic: success / warning / danger / info --- */
  --success:        #22c55e;  --success-subtle: #112a1c;  --success-text: var(--green-700);
  --warning:        #f59e0b;  --warning-subtle: #2c2310;  --warning-text: var(--amber-700);
  --danger:         #ef4444;  --danger-subtle:  #2d1517;  --danger-text:  var(--red-700);
  --info:           #0ea5e9;  --info-subtle:    #0f2433;  --info-text:    var(--sky-700);

  /* --- Typography (Geist, 14px base) --- */
  --font-sans:  'Geist', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono:  'Geist Mono', ui-monospace, 'JetBrains Mono', 'SF Mono', monospace;
  --text-xs:    0.75rem;
  --text-sm:    0.8125rem;
  --text-base:  0.875rem;
  --text-md:    0.9375rem;
  --text-lg:    1.0625rem;
  --text-xl:    1.25rem;
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;
  --leading-tight:   1.15;
  --leading-normal:  1.5;
  --tracking-tighter: -0.03em;
  --tracking-tight:   -0.015em;
  --tracking-wide:    0.06em;
  --heading-tracking: var(--tracking-tight);
  --body-leading:     var(--leading-normal);

  /* --- Spacing (4px grid) --- */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --gap-inline:  var(--space-2);
  --pad-control: var(--space-3);
  --pad-card:    var(--space-6);

  /* --- Radius --- */
  --radius-sm:      6px;
  --radius-md:      8px;
  --radius-lg:      10px;
  --radius-xl:      12px;
  --radius-2xl:     16px;
  --radius-pill:    999px;
  --radius-control: var(--radius-xl);
  --radius-card:    var(--radius-2xl);
  --radius-input:   var(--radius-lg);
  --radius-badge:   var(--radius-sm);

  /* --- Shadows --- */
  --shadow-xs: 0 1px 2px hsl(220 60% 2% / 0.40);
  --shadow-sm: 0 1px 2px hsl(220 60% 2% / 0.35), 0 1px 3px hsl(220 60% 2% / 0.40);
  --shadow-md: 0 2px 6px hsl(220 60% 2% / 0.40), 0 6px 14px hsl(220 60% 2% / 0.45);
  --shadow-lg: 0 6px 12px hsl(220 60% 2% / 0.40), 0 16px 32px hsl(220 60% 2% / 0.50);
  --shadow-inset: inset 0 1px 0 hsl(0 0% 100% / 0.05);
  --ring-focus:   0 0 0 3px var(--accent-ring);
  --ring-danger:  0 0 0 3px color-mix(in srgb, var(--danger) 30%, transparent);

  /* --- Motion --- */
  --duration-fast:   140ms;
  --duration-base:   200ms;
  --ease-standard:   cubic-bezier(0.2, 0, 0, 1);
  --ease-emphasized: cubic-bezier(0.3, 0, 0, 1);
  --transition-control: all var(--duration-fast) var(--ease-standard);
  --transition-surface: all var(--duration-base) var(--ease-standard);
}

/* --- Base resets --- */
*, *::before, *::after { box-sizing: border-box; }
body {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--body-leading);
  color: var(--text-primary);
  background: var(--bg-app);
  -webkit-font-smoothing: antialiased;
}
:focus-visible {
  outline: none;
  box-shadow: var(--ring-focus);
}
"#;
