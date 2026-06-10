use anyhow::Result;
use colored::Colorize;

use crate::config::Config;
use crate::registry::RegistryClient;

pub async fn run() -> Result<()> {
    let config = Config::load()?;
    let client = RegistryClient::new(&config.registry);
    let framework = config.framework.to_string();

    println!("{}", "Available components:".bold());
    println!();

    let registry = client.fetch_index().await?;

    let mut found = 0;
    for component in &registry.components {
        if component.frameworks.contains(&framework) {
            println!(
                "  {} {}",
                component.name.cyan(),
                format!("— {}", component.description).dimmed()
            );
            found += 1;
        }
    }

    if found == 0 {
        println!("  {}", "No components available for your framework.".dimmed());
    } else {
        println!();
        println!(
            "{}",
            format!("{found} component(s) available for {framework}.").dimmed()
        );
    }

    Ok(())
}
