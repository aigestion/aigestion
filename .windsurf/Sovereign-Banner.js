/**
 * Sovereign Branding Module
 * Proporciona banners y telemetría estilizada para terminales "Nivel Dios"
 */

const chalk = {
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[22m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`
};

const SOVEREIGN_BANNER = `
   ▄▄▄▄▀ ▄███▄   █     ▄▄▄▄▀ ▄███▄   █▄▄▄▄ ▄█ ▄     ▄▄▄▄▀ ▀▄    ▄
▀▀▀ █    █▀   ▀  █  ▀▀▀ █    █▀   ▀  █  ▄▀ ██  █ ▀▀▀ █      █  █
    █    ██▄▄    █      █    ██▄▄    █▀▀▀  ██ █      █       ▀█
   █     █▄   ▄▀ ███▄  █     █▄   ▄▀ █     ██ █     █        █
  ▀      ▀███▀       ▀▀      ▀███▀    █    █▀ ██▀  ▀       ▄▀
                                       ▀
       🚀 GOD LEVEL WORKSPACE — SOVEREIGN INTELLIGENCE 🚀
`;

function printBanner(serverName, version) {
  console.error(chalk.magenta(SOVEREIGN_BANNER));
  console.error(chalk.cyan(`   System:`), chalk.bold(serverName.toUpperCase()));
  console.error(chalk.cyan(`   Version:`), chalk.yellow(version));
  console.error(chalk.cyan(`   Status:`), chalk.green('🟢 SOVEREIGN OPERATIONAL'));
  console.error(chalk.gray('  ' + '─'.repeat(50) + '\n'));
}

function logTelemetry(toolName, elapsed) {
  const meta = chalk.gray(`[SOVEREIGN-TELEMETRY]`);
  const tool = chalk.magenta(toolName);
  const time = elapsed > 1000 ? chalk.yellow(`${elapsed}ms`) : chalk.green(`${elapsed}ms`);
  console.error(`${meta} ${tool} executed in ${time}`);
}

module.exports = { printBanner, logTelemetry };
