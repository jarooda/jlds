use anyhow::Result;
use colored::Colorize;

use crate::config::Config;
use crate::registry::RegistryClient;

pub async fn run(components: Vec<String>) -> Result<()> {
    let config = Config::load()?;
    let client = RegistryClient::new(&config.registry);
    let framework = config.framework.to_string();

    for name in &components {
        println!("{} {}", "Updating".bold(), name.cyan().bold());

        // Verify it exists in registry before overwriting
        let _meta = client.fetch_component(name, &framework).await?;

        // Re-use add logic by calling add::run for now
        // TODO: diff local vs registry and warn on local modifications
        crate::commands::add::run(vec![name.clone()]).await?;
    }

    Ok(())
}
