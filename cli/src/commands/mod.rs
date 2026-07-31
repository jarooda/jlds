pub mod add;
pub mod init;
pub mod list;
pub mod update;

use colored::Colorize;
use std::sync::atomic::{AtomicBool, Ordering};

use crate::config::{cli_version, default_registry, registry_behind_cli};

static WARNED: AtomicBool = AtomicBool::new(false);

/// Point out a `jlds.json` registry pin that is older than this CLI, with the value to
/// replace it with. Only for commands that write component files — a stale pin is why a
/// project keeps receiving old component source no matter how new the CLI is.
///
/// Silent for local paths, forks, and `@main`: those are deliberate. `update` delegates to
/// `add`, so this prints at most once per run.
pub fn warn_if_registry_behind(registry: &str) {
    let Some(pinned) = registry_behind_cli(registry) else {
        return;
    };
    if WARNED.swap(true, Ordering::Relaxed) {
        return;
    }

    println!(
        "{} Registry pinned to v{pinned} — this CLI is v{}.",
        "!".yellow().bold(),
        cli_version()
    );
    println!(
        "  {}",
        format!("Fixes released since v{pinned} won't be fetched. To move the pin, set in jlds.json:")
            .dimmed()
    );
    println!("  {}", format!("\"registry\": \"{}\"", default_registry()).cyan());
    println!();
}
