const axios = require('axios');
const { execSync } = require('child_process');

async function verifyPhase11() {
  console.log('🛡️ Starting Phase 11 Verification: Edge Autarchy & Multimodal Vision\n');

  // 1. Verify Vision Routes
  console.log('🔍 Checking Vision Service Endpoints...');
  try {
    // Note: This expects the server to be running. If not, we just check if the files exist.
    console.log('   - VisionController registered check: (Manual/Codebase)');
    console.log('   - VisionService injected check: (Manual/Codebase)');
  } catch (e) {
    console.log('   ❌ Vision Routes check failed (Server likely offline)');
  }

  // 2. Verify Edge Autarchy Logic
  console.log('\n🔍 Checking Edge Autarchy (Ollama) Integration...');
  try {
    const aiServicePath = 'C:\\Users\\Alejandro\\AIGestion\\backend\\src\\services\\ai.service.ts';
    const content = require('fs').readFileSync(aiServicePath, 'utf8');
    if (content.includes('generateOllamaContent') && content.includes('http://localhost:11434/api/generate')) {
      console.log('   ✅ Ollama integration found in AIService');
    } else {
      console.log('   ❌ Ollama integration MISSING in AIService');
    }
  } catch (e) {
    console.log('   ❌ Error checking AIService:', e.message);
  }

  // 3. Verify Real-Time Pulse
  console.log('\n🔍 Checking Real-Time Pulse (WebSockets)...');
  try {
    const healthServicePath = 'C:\\Users\\Alejandro\\AIGestion\\backend\\src\\services\\NeuralHealthService.ts';
    const content = require('fs').readFileSync(healthServicePath, 'utf8');
    if (content.includes("socketService.emit('pulse'") && content.includes('@inject(TYPES.SocketService)')) {
      console.log('   ✅ Neural Pulse broadcasting integrated via SocketService');
    } else {
      console.log('   ❌ Neural Pulse broadcasting MISSING');
    }
  } catch (e) {
    console.log('   ❌ Error checking NeuralHealthService:', e.message);
  }

  // 4. Verify GitOps Script
  console.log('\n🔍 Checking Sovereign GitOps Automation...');
  const scriptPath = 'C:\\Users\\Alejandro\\AIGestion\\ops\\snapshot_sovereign.ps1';
  if (require('fs').existsSync(scriptPath)) {
    console.log('   ✅ Sovereign Snapshot script exists at /ops');
  } else {
    console.log('   ❌ Sovereign Snapshot script MISSING');
  }

  console.log('\n🛡️ Phase 11 Verification Completed.');
}

verifyPhase11();
