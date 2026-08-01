pub mod add;
pub mod init;
pub mod list;
pub mod update;

use colored::Colorize;
use std::sync::atomic::{AtomicBool, Ordering};

use crate::config::{cli_version, is_older, latest_release, pinned_version, registry_url_for};

static WARNED: AtomicBool = AtomicBool::new(false);

/// Point out a `jlds.json` registry pin that is older than the newest release, with the value
/// to replace it with. Only for commands that write component files — a stale pin is why a
/// project keeps receiving old component source, and `update` in particular reads as "fetch
/// the newest" while it is really bounded by the pin.
///
/// Silent for local paths, forks, and `@main`: those are deliberate, and silent when npm is
/// unreachable rather than falling back to this build's own version — see `latest_release`.
/// `update` delegates to `add`, so this prints, and asks npm, at most once per run.
pub async fn warn_if_registry_behind(registry: &str) {
    let Some(pinned) = pinned_version(registry) else {
        return;
    };
    if WARNED.swap(true, Ordering::Relaxed) {
        return;
    }

    let Some(latest) = latest_release().await else {
        return;
    };
    if !is_older(pinned, &latest) {
        return;
    }

    println!(
        "{} Registry pinned to v{pinned} — latest is v{latest}.",
        "!".yellow().bold()
    );
    println!(
        "  {}",
        format!("Fixes released since v{pinned} won't be fetched. To move the pin, set in jlds.json:")
            .dimmed()
    );
    println!("  {}", format!("\"registry\": \"{}\"", registry_url_for(&latest)).cyan());
    if is_older(cli_version(), &latest) {
        println!(
            "  {}",
            format!("This CLI is v{} — run it as `npx @jarooda/jlds@latest` for the newest.", cli_version())
                .dimmed()
        );
    }
    println!();
}
