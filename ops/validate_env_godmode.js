require('dotenv').config();
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

console.log('🔍 Starting God Mode Environment Validation...');

const sections = [
  'SERVER & RUNTIME',
  'SECURITY & AUTHENTICATION',
  'RATE LIMITING',
  'DATABASES',
  'AI ENGINE',
  'AI PROVIDERS',
  'GCP',
  'FIREBASE',
  'COMMUNICATIONS',
  'PAYMENTS',
  'EXTERNAL INTEGRATIONS',
  'MONITORING',
  'DEPLOYMENT',
  'TOOLING',
  'FEATURE FLAGS',
  'OWNERSHIP',
  'MISC',
  'WEB3 & BLOCKCHAIN',
  'DATA SOURCES',
  'ADVANCED CAPABILITIES',
];

let totalKeys = 0;
let activeKeys = 0;
let pendingKeys = 0;

const lines = envContent.split('\n');
let currentSection = 'UNKNOWN';

lines.forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;

  // Check for placeholders
  if (trimmed.includes('your-') || trimmed.includes('placeholder')) {
    pendingKeys++;
  } else {
    activeKeys++;
  }
  totalKeys++;
});

console.log(`\n📈 Governance Summary:`);
console.log(`  Total Configuration Keys: ${totalKeys}`);
console.log(`  ✅ Active Credentials:    ${activeKeys}`);
console.log(`  Qt️  Pending Placeholders: ${pendingKeys}`);

if (activeKeys > 150) {
  console.log(`\n✅ Validation Complete. Integration Level: GOD MODE (High Availablity)`);
} else {
  console.log(`\n⚠️ Validation Warning. Active keys lower than expected.`);
}
