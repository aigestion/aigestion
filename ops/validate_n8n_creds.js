const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const workflowsDir = path.join(__dirname, './n8n/workflows');
const rootEnvFile = path.join(__dirname, '../.env');

// Load Environment
if (fs.existsSync(rootEnvFile)) {
  dotenv.config({ path: rootEnvFile });
} else {
  console.error('❌ Root .env file not found!');
  process.exit(1);
}

const env = process.env;

// Scan Workflows
const requiredKeys = new Set();
const files = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.json'));

console.log(`Scanning ${files.length} workflows...`);

files.forEach(file => {
  const content = fs.readFileSync(path.join(workflowsDir, file), 'utf8');

  // Regex highlights
  const envMatches = content.matchAll(/\{\{\$env\["([^"]+)"\]\}\}/g);
  for (const match of envMatches) {
    requiredKeys.add(match[1]);
  }

  const placeholderMatches = content.matchAll(/Bearer ([A-Z_]+(?:_KEY|_TOKEN|_SECRET))/gi);
  for (const match of placeholderMatches) {
    requiredKeys.add(match[1]);
  }

  const broadMatches = content.matchAll(/"([A-Z][A-Z0-9_]*_(?:KEY|TOKEN|SECRET|ID|URL|DSN|PWD|PASS))"/g);
  for (const match of broadMatches) {
    requiredKeys.add(match[1]);
  }

  const bareMatches = content.matchAll(/: "([A-Z][A-Z0-9_]*_(?:KEY|TOKEN|SECRET|ID|URL))"/g);
  for (const match of bareMatches) {
    requiredKeys.add(match[1]);
  }
});

// Check existence
const missing = [];
const present = [];

requiredKeys.forEach(key => {
  if (env[key] && env[key] !== '' && !env[key].includes('placeholder')) {
    present.push(key);
  } else {
    missing.push(key);
  }
});

console.log('\n--- CREDENTIALS REPORT ---\n');
console.log(`Total Required Keys Found: ${requiredKeys.size}`);
console.log(`Present in Environment: ${present.length}`);
console.log(`Missing or Empty: ${missing.length}`);

if (missing.length > 0) {
  console.log('\n[MISSING CREDENTIALS]');
  missing.forEach(k => console.log(`- [ ] ${k}`));
}

if (present.length > 0) {
  console.log('\n[PRESENT CREDENTIALS]');
  present.forEach(k => console.log(`- [x] ${k}`));
}
