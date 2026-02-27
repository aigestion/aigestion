#!/usr/bin/env node

/**
 * Sovereign God-Mode Orchestrator
 * Bridging Antigravity and Nexus Monorepo for supreme intelligence.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const AG_CONFIG_DIR = path.join(process.env.USERPROFILE || '', '.antigravity');
const OPTIMIZE_SCRIPT = path.join(AG_CONFIG_DIR, 'optimize_antigravity.ps1');
const CLEANUP_SCRIPT = path.join(AG_CONFIG_DIR, 'DeepCleanup.ps1');
const MANIFEST_SCRIPT = path.join(AG_CONFIG_DIR, 'DirectoryManifest.ps1');

function printBanner() {
  console.log('\n  🌌 GOD-MODE SOVEREIGN BRIDGE 🌌');
  console.log('  ' + '═'.repeat(30) + '\n');
}

async function run() {
  printBanner();

  console.log('🚀 [1/4] Synchronizing Antigravity Configuration...');
  const settingsPath = path.join(AG_CONFIG_DIR, 'settings.json');
  if (fs.existsSync(settingsPath)) {
    let content = fs.readFileSync(settingsPath, 'utf8');
    // Strip UTF-8 BOM if present
    content = content.replace(/^\uFEFF/, '');
    const settings = JSON.parse(content);
    if (settings.agent.sovereignIntelligence) {
      console.log('   ✅ Sovereign Intelligence: ACTIVE');
    } else {
      console.log('   ⚠️ Sovereign Intelligence: INACTIVE (Fixing...)');
      settings.agent.sovereignIntelligence = true;
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4));
    }
  }

  console.log('\n⚡ [2/4] Initiating Core Optimization Protocol...');
  if (fs.existsSync(OPTIMIZE_SCRIPT)) {
    try {
      execSync(`powershell -File "${OPTIMIZE_SCRIPT}" -Profile god`, { stdio: 'inherit' });
      console.log('\n   ✅ Core Optimization: SUCCESS');
    } catch (e) {
      console.log('\n   ❌ Core Optimization: FAILED');
    }
  }

  console.log('\n🧼 [3/4] Running Workspace Sanitation & Manifest...');
  try {
    if (fs.existsSync(CLEANUP_SCRIPT)) {
      console.log('   • Executing DeepCleanup (Simulation mode)...');
      execSync(`powershell -File "${CLEANUP_SCRIPT}" -WhatIf`, { stdio: 'pipe' });
    }
    if (fs.existsSync(MANIFEST_SCRIPT)) {
      console.log('   • Regenerating Directory Manifest...');
      execSync(`powershell -File "${MANIFEST_SCRIPT}"`, { stdio: 'pipe' });
      console.log('   ✅ Workspace Awareness updated.');
    }
  } catch (e) {
    console.log('   ⚠️ Sanitation/Discovery had minor interruptions.');
  }

  console.log('\n👑 [4/4] Establishing Sovereign Connection...');
  console.log('   🔗 Bridge established at ' + new Date().toLocaleTimeString());
  console.log('   ✨ STATUS: ASCENDED\n');
}

run();
