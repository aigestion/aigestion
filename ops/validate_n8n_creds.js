const fs = require('fs');
const path = require('path');

const workflowsDir = path.join(__dirname, '../n8n/workflows');
const envFile = path.join(__dirname, '../config/.env');
const rootEnvFile = path.join(__dirname, '../.env');

// Read Env Files
function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim();
    }
  });
  return env;
}

const configEnv = parseEnv(envFile);
const rootEnv = parseEnv(rootEnvFile);
const combinedEnv = { ...configEnv, ...rootEnv };

// Scan Workflows
const requiredKeys = new Set();
const files = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.json'));

console.log(`Scanning ${files.length} workflows...`);

files.forEach(file => {
  const content = fs.readFileSync(path.join(workflowsDir, file), 'utf8');

  // Regex for {{$env["VAR"]}}
  const envMatches = content.matchAll(/\{\{\$env\["([^"]+)"\]\}\}/g);
  for (const match of envMatches) {
    requiredKeys.add(match[1]);
  }

  // Regex for specific placeholders like "Bearer STRIPE_KEY"
  const placeholderMatches = content.matchAll(/Bearer ([A-Z_]+(?:_KEY|_TOKEN|_SECRET))/gi);
  for (const match of placeholderMatches) {
    requiredKeys.add(match[1]);
  }

  // Broader regex for common uppercase keys (API_KEY, _TOKEN, _URL, etc.)
  // We filter strict uppercase to avoid false positives (capitalized text descriptions)
  // Looking for: "SOME_KEY", "SOME_TOKEN", "SOME_URL" appearing in values
  const broadMatches = content.matchAll(
    /"([A-Z][A-Z0-9_]*_(?:KEY|TOKEN|SECRET|ID|URL|DSN|PWD|PASS))"/g
  );
  for (const match of broadMatches) {
    requiredKeys.add(match[1]);
  }

  // Also catch bare words like STRIPE_KEY if they appear in JSON values not surrounded by spaces
  const bareMatches = content.matchAll(/: "([A-Z][A-Z0-9_]*_(?:KEY|TOKEN|SECRET|ID|URL))"/g);
  for (const match of bareMatches) {
    requiredKeys.add(match[1]);
  }
});

// Check existence
const missing = [];
const present = [];

requiredKeys.forEach(key => {
  if (combinedEnv[key] && combinedEnv[key] !== '' && !combinedEnv[key].includes('placeholder')) {
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
