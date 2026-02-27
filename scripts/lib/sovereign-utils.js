/**
 * Sovereign Utilities for Nexus CLI
 */

const chalk = {
  cyan: text => `\x1b[36m${text}\x1b[0m`,
  magenta: text => `\x1b[35m${text}\x1b[0m`,
  blue: text => `\x1b[34m${text}\x1b[0m`,
  yellow: text => `\x1b[33m${text}\x1b[0m`,
  green: text => `\x1b[32m${text}\x1b[0m`,
  red: text => `\x1b[31m${text}\x1b[0m`,
  bold: text => {
    const b = `\x1b[1m${text}\x1b[22m`;
    return Object.assign(b, {
      magenta: t => chalk.magenta(`\x1b[1m${t}\x1b[22m`),
      cyan: t => chalk.cyan(`\x1b[1m${t}\x1b[22m`),
      green: t => chalk.green(`\x1b[1m${t}\x1b[22m`),
    });
  },
  gray: text => `\x1b[90m${text}\x1b[0m`,
};

const BANNER = `
   ▄▄▄▄▀ ▄███▄   █     ▄▄▄▄▀ ▄███▄   █▄▄▄▄ ▄█ ▄     ▄▄▄▄▀ ▀▄    ▄
▀▀▀ █    █▀   ▀  █  ▀▀▀ █    █▀   ▀  █  ▄▀ ██  █ ▀▀▀ █      █  █
    █    ██▄▄    █      █    ██▄▄    █▀▀▀  ██ █      █       ▀█
   █     █▄   ▄▀ ███▄  █     █▄   ▄▀ █     ██ █     █        █
  ▀      ▀███▀       ▀▀      ▀███▀    █    █▀ ██▀  ▀       ▄▀
                                       ▀
`;

function printBanner() {
  console.log(chalk.magenta(BANNER));
  console.log(chalk.bold('       🚀 MISSION CONTROL — SOVEREIGN NEXUS 🚀'));
  console.log(chalk.gray('  ' + '─'.repeat(50) + '\n'));
}

module.exports = { chalk, printBanner };
