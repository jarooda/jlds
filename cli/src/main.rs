mod commands;
mod config;
mod registry;

use anyhow::Result;
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "jlds", version, about = "JLDS design system CLI")]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Initialize JLDS in your project
    Init,
    /// Add a component to your project
    Add {
        /// Component name(s) to add
        #[arg(required = true)]
        components: Vec<String>,
    },
    /// List all available components
    List,
    /// Update a component to the latest registry version
    Update {
        /// Component name(s) to update
        #[arg(required = true)]
        components: Vec<String>,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Command::Init => commands::init::run().await,
        Command::Add { components } => commands::add::run(components).await,
        Command::List => commands::list::run().await,
        Command::Update { components } => commands::update::run(components).await,
    }
}
