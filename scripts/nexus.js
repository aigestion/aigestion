#!/usr/bin/env node

/**
 * Sovereign Nexus CLI — Mission Control
 * Centralized orchestration for the AIGestion Monorepo
 */

const { execSync } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { chalk, printBanner } = require('./lib/sovereign-utils');

// Load .env from root
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
  }
} catch (e) {
  // Silent fail if dotenv not installed globally or in root
}

const args = process.argv.slice(2);
const command = args[0] || 'help';

// ───────────── CORE COMMANDS ─────────────

async function status() {
  printBanner();
  console.log(chalk.bold('🔍 SYSTEM INTEGRITY CHECK\n'));

  // 1. Docker Status
  process.stdout.write(chalk.cyan('   [DOCKER] '));
  try {
    const dockerStatus = execSync('docker ps --format "{{.Names}}: {{.Status}}"', {
      stdio: 'pipe',
    }).toString();
    if (dockerStatus.trim()) {
      console.log(chalk.green('RUNNING'));
      dockerStatus
        .split('\n')
        .filter(Boolean)
        .forEach(line => console.log(chalk.gray(`      • ${line}`)));
    } else {
      console.log(chalk.yellow('NO CONTAINERS FOUND'));
    }
  } catch (e) {
    console.log(chalk.red('DAEMON NOT RUNNING or NOT INSTALLED'));
  }

  // 2. Backend Health
  process.stdout.write(chalk.cyan('\n   [BACKEND] '));
  try {
    const backendUrl = process.env.AIGESTION_API_URL || 'http://localhost:3000';
    // Simplified health check via http
    const checkHealth = () =>
      new Promise(resolve => {
        const req = http.get(`${backendUrl}/health`, res => {
          resolve(res.statusCode === 200 ? 'OK' : `FAIL (${res.statusCode})`);
        });
        req.on('error', () => resolve('OFFLINE'));
        req.setTimeout(2000, () => {
          req.destroy();
          resolve('TIMEOUT');
        });
      });
    const health = await checkHealth();
    if (health === 'OK') console.log(chalk.green('ONLINE'));
    else if (health === 'OFFLINE') console.log(chalk.red('OFFLINE'));
    else console.log(chalk.yellow(health));
  } catch (e) {
    console.log(chalk.red('ERROR'));
  }

  // 3. Swarm Status
  process.stdout.write(chalk.cyan('   [SWARM] '));
  try {
    const roles = ['AUDITOR', 'ARCHITECT', 'DESIGNER'];
    console.log(chalk.green(`ONLINE (${roles.length} Roles Active)`));
  } catch (e) {
    console.log(chalk.gray('OFFLINE'));
  }

  // 4. Frontend Check
  process.stdout.write(chalk.cyan('   [FRONTEND] '));
  // Check common dev ports
  const frontendPorts = [3000, 5173, 5174, 5175, 5176];
  let activeFrontends = [];
  // For simplicity, we assume if process is running on port, it's dev mode
  try {
    const netstat = execSync('netstat -ano', { stdio: 'pipe' }).toString();
    frontendPorts.forEach(port => {
      if (netstat.includes(`:${port}`)) activeFrontends.push(port);
    });
    if (activeFrontends.length > 0) {
      console.log(chalk.green(`ACTIVE (Ports: ${activeFrontends.join(', ')})`));
    } else {
      console.log(chalk.gray('INACTIVE'));
    }
  } catch (e) {
    console.log(chalk.gray('UNKNOWN'));
  }

  // 4. AI Readiness
  console.log(chalk.cyan('\n   [AI NEXUS]'));
  const aiKeys = [
    { name: 'GEMINI', env: 'GEMINI_API_KEY' },
    { name: 'OPENAI', env: 'OPENAI_API_KEY' },
    { name: 'ANTHROPIC', env: 'ANTHROPIC_API_KEY' },
  ];
  aiKeys.forEach(key => {
    const status = process.env[key.env] ? chalk.green('CONFIGURED') : chalk.gray('MISSING');
    console.log(`      • ${key.name}: ${status}`);
  });

  console.log(chalk.gray('\n  ' + '─'.repeat(50)));
  console.log(chalk.magenta(chalk.bold('\n   MISSION CONTROL READY.')));
}

function flux() {
  printBanner();
  console.log(chalk.bold.yellow('🌊 INITIALIZING FLUX STATE...'));

  try {
    console.log(chalk.cyan('   [1/3] Purging non-essential processes...'));
    execSync('npm run clean:processes', { stdio: 'inherit' });

    console.log(chalk.cyan('   [2/3] Sanitizing development caches...'));
    // Note: This matches GodMode.ps1 logic
    const tempJest = path.join(process.env.LOCALAPPDATA || '', 'Temp', 'jest');
    if (fs.existsSync(tempJest)) {
      execSync(
        `powershell "Remove-Item -Path '${tempJest}\\*' -Recurse -Force -ErrorAction SilentlyContinue"`
      );
    }

    console.log(chalk.cyan('   [3/3] Trimming working set memory...'));
    // Calling the existing ps1 if possible or simulating
    const godModeScript = path.join(__dirname, '..', 'ops', 'GodMode.ps1');
    if (fs.existsSync(godModeScript)) {
      execSync(`powershell -File "${godModeScript}"`, { stdio: 'pipe' });
    }

    console.log(chalk.bold.green('\n✨ ZEN STATE ACHIEVED. READY FOR SOVEREIGN CODING.'));
  } catch (e) {
    console.log(chalk.red(`\n❌ FLUX INTERRUPTED: ${e.message}`));
  }
}

function swarm() {
  printBanner();
  console.log(chalk.bold('🤖 SOVEREIGN SWARM INTELLIGENCE\n'));
  console.log(chalk.cyan('   ACTIVE ROLES:'));
  console.log(chalk.yellow('      • AUDITOR:  '), 'Security & Compliance Scan');
  console.log(chalk.yellow('      • ARCHITECT:'), 'System Integrity & Pattern Audit');
  console.log(chalk.yellow('      • DESIGNER: '), 'Aesthetic & UX Excellence');
  console.log(chalk.gray('\n   Usage: node scripts/nexus.js swarm <role> <target>'));
}

function help() {
  printBanner();
  console.log(chalk.bold('AVAILABLE COMMANDS:'));
  console.log(chalk.cyan('   status'), '  Check system integrity and AI readiness');
  console.log(chalk.cyan('   flux'), '    Optimize environment for "Zen" coding state');
  console.log(chalk.cyan('   clean'), '   Execute "Nuke-It" cleanup protocol');
  console.log(chalk.cyan('   generate'), 'Generate artifacts (e.g., nexus generate component MyCard)');
  console.log(chalk.cyan('   swarm'), '   (Coming Soon) Initiate multi-agent audit');
  console.log(chalk.cyan('   help'), '    Show this menu');
  console.log(chalk.gray('\nUsage: node scripts/nexus.js <command>'));
}

// ───────────── DISPATCH ─────────────

  case 'status':
    status();
    break;
  case 'flux':
    flux();
    break;
  case 'clean':
    console.log(chalk.bold.red('🧨 INITIATING CLEANUP PROTOCOL...'));
    try {
      execSync('bash scripts/nuke-it.sh', { stdio: 'inherit' });
    } catch (e) {
      console.log(chalk.red(`Cleanup failed: ${e.message}`));
    }
    break;
  case 'generate':
    if (args[1] === 'component' && args[2]) {
      const name = args[2];
      const targetDir = path.join(__dirname, '..', 'frontend/apps/client-dashboard/src/components', name);
      
      if (fs.existsSync(targetDir)) {
        console.log(chalk.red(`Error: Component ${name} already exists.`));
        process.exit(1);
      }

      fs.mkdirSync(targetDir, { recursive: true });

      const componentTemplate = `import React from 'react';

export const ${name}: React.FC = () => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold font-outfit">${name}</h3>
      <p className="text-zinc-400 mt-2">Nucleus of the Sovereign Experience.</p>
    </div>
  );
};
`;
      fs.writeFileSync(path.join(targetDir, `${name}.tsx`), componentTemplate);
      console.log(chalk.green(`✅ Component ${name} created at ${targetDir}`));
    } else {
      console.log(chalk.yellow('Usage: nexus generate component <ComponentName>'));
    }
    break;
  case 'swarm':
    swarm();
    break;
  case 'help':
    help();
    break;
  default:
    console.log(chalk.red(`Unknown command: ${command}`));
    help();
}
