mod commands;
mod config;
mod registry;

use anyhow::Result;
use clap::{Parser, Subcommand};

use commands::init::InitArgs;

#[derive(Parser)]
#[command(name = "jlds", version, about = "JLDS design system CLI")]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Initialize JLDS in your project
    Init(InitArgs),
    /// Add a component to your project
    Add {
        /// Component name(s) to add
        #[arg(required = true)]
        components: Vec<String>,
        /// Registry base URL or local path for this run, instead of the one in jlds.json
        #[arg(long, value_name = "URL")]
        registry: Option<String>,
    },
    /// List all available components
    List,
    /// Update a component to the latest registry version
    Update {
        /// Component name(s) to update
        #[arg(required = true)]
        components: Vec<String>,
        /// Registry base URL or local path for this run, instead of the one in jlds.json
        #[arg(long, value_name = "URL")]
        registry: Option<String>,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Command::Init(args) => commands::init::run(args).await,
        Command::Add { components, registry } => commands::add::run(components, registry).await,
        Command::List => commands::list::run().await,
        Command::Update { components, registry } => commands::update::run(components, registry).await,
    }
}
