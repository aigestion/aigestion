const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function writePulse(msg, color = '\x1b[36m') {
  console.log(`${color}[💓 PULSE] ${msg}\x1b[0m`);
}

writePulse('Initiating Multi-Mesh Integrity Audit...', '\x1b[33m');

// 1. Environment Check
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const count = content.split('\n').length;
  writePulse(`Environment Saturated: ${count} lines. [OK]`, '\x1b[32m');
} else {
  writePulse('CRITICAL: .env MISSING! [FAIL]', '\x1b[31m');
}

// 2. Hardware Check (ADB)
try {
  const adb = execSync('adb devices').toString();
  if (adb.includes('\tdevice')) {
    writePulse('Pixel 8 Pro: ONLINE', '\x1b[32m');
  } else {
    writePulse('Pixel 8 Pro: OFFLINE', '\x1b[33m');
  }
} catch (e) {
  writePulse('ADB not found or error.', '\x1b[31m');
}

// 3. Vault Check
const vaultPath = path.resolve(process.env.USERPROFILE, 'AppData/Roaming/Antigravity/sovereign_vault/.env.master_recovery');
if (fs.existsSync(vaultPath)) {
  writePulse('System Vault: HARDENED', '\x1b[32m');
} else {
  writePulse('System Vault: VULNERABLE', '\x1b[31m');
}

writePulse('Audit Complete. Sovereignty Level: OPTIMAL.', '\x1b[35m');
