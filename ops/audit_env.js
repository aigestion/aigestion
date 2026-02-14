// scripts/audit_env.js
// Audit .env configuration for security and consistency
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '..', '.env');
const examplePath = path.resolve(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found at', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const lines = envContent.split(/\r?\n/);

const keyPattern = /^(\w+)=([\s\S]*)$/;
const sensitivePatterns = /(?:SECRET|KEY|TOKEN|PASSWORD|PASS|PRIVATE_KEY)/i;
const duplicates = new Set();
const seen = new Set();
let hasIssues = false;
let exampleLines = [];

lines.forEach((line, idx) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    exampleLines.push(line);
    return;
  }
  const match = line.match(keyPattern);
  if (!match) {
    console.warn(`⚠️ Line ${idx + 1} is not a valid KEY=VALUE pair:`);
    console.warn(line);
    hasIssues = true;
    exampleLines.push(line);
    return;
  }
  const [_, key, value] = match;
  if (seen.has(key)) {
    duplicates.add(key);
  }
  seen.add(key);

  // Detect sensitive values that are not placeholders
  if (sensitivePatterns.test(key) && !/^(\*|placeholder|your_|<.*>|\{.*\})$/i.test(value)) {
    console.warn(
      `🔐 Sensitive key "${key}" has a concrete value. Consider using a placeholder in .env.example.`
    );
    hasIssues = true;
    // Replace with placeholder in example
    exampleLines.push(`${key}=<${key}_PLACEHOLDER>`);
  } else {
    // Keep original or placeholder
    exampleLines.push(line);
  }
});

if (duplicates.size) {
  console.warn('🔁 Duplicate keys found:', Array.from(duplicates).join(', '));
  hasIssues = true;
}

// Write .env.example
fs.writeFileSync(examplePath, exampleLines.join('\n'));
console.log('✅ Generated .env.example at', examplePath);
if (hasIssues) {
  console.warn('⚠️ Audit completed with warnings. Review the messages above.');
  process.exit(1);
} else {
  console.log('✅ Audit completed without issues.');
  process.exit(0);
}
