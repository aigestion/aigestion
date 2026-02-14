#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔒 Running Security Audit...\n');

// Colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, cwd = process.cwd()) {
  try {
    const result = execSync(command, {
      cwd,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, output: error.stdout, error: error.stderr };
  }
}

// Audit Node.js dependencies
function auditNodeDependencies(packagePath, name) {
  log(`\n📦 Auditing ${name} dependencies...`, 'blue');

  const packageJsonPath = path.join(packagePath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log(`❌ No package.json found in ${packagePath}`, 'red');
    return;
  }

  // Run pnpm audit
  const auditResult = runCommand('pnpm audit --audit-level moderate --json', packagePath);
  if (auditResult.success) {
    try {
      const auditData = JSON.parse(auditResult.output);
      const vulnerabilities = auditData.vulnerabilities || {};
      const vulnCount = Object.keys(vulnerabilities).length;

      if (vulnCount === 0) {
        log(`✅ No vulnerabilities found in ${name}`, 'green');
      } else {
        log(`⚠️  Found ${vulnCount} vulnerabilities in ${name}`, 'yellow');
        Object.entries(vulnerabilities).forEach(([pkg, vuln]) => {
          log(`   - ${pkg}: ${vuln.severity} (${vuln.title})`, 'yellow');
        });
      }
    } catch (e) {
      log(`❌ Error parsing audit results for ${name}`, 'red');
    }
  } else {
    log(`❌ Failed to audit ${name}`, 'red');
  }

  // Check outdated packages
  const outdatedResult = runCommand('pnpm outdated --json', packagePath);
  if (outdatedResult.success) {
    try {
      const outdatedData = JSON.parse(outdatedResult.output);
      const outdatedCount = Object.keys(outdatedData).length;

      if (outdatedCount > 0) {
        log(`📅 ${outdatedCount} packages outdated in ${name}`, 'yellow');
        Object.entries(outdatedData).forEach(([pkg, info]) => {
          log(`   - ${pkg}: ${info.current} → ${info.latest}`, 'yellow');
        });
      }
    } catch (e) {
      log(`   Could not parse outdated info for ${name}`, 'yellow');
    }
  }
}

// Audit Python dependencies
function auditPythonDependencies(requirementsPath, name) {
  log(`\n🐍 Auditing ${name} Python dependencies...`, 'blue');

  if (!fs.existsSync(requirementsPath)) {
    log(`❌ No requirements.txt found at ${requirementsPath}`, 'red');
    return;
  }

  const dir = path.dirname(requirementsPath);

  // Run pip-audit
  const auditResult = runCommand('pip-audit --format=json --requirement=requirements.txt', dir);
  if (auditResult.success) {
    try {
      const auditData = JSON.parse(auditResult.output);
      const vulnerabilities = auditData.dependencies || [];
      const vulnCount = vulnerabilities.filter(
        d => d.vulnerabilities && d.vulnerabilities.length > 0
      ).length;

      if (vulnCount === 0) {
        log(`✅ No vulnerabilities found in ${name}`, 'green');
      } else {
        log(`⚠️  Found vulnerabilities in ${vulnCount} packages in ${name}`, 'yellow');
        vulnerabilities.forEach(dep => {
          if (dep.vulnerabilities && dep.vulnerabilities.length > 0) {
            log(`   - ${dep.name}: ${dep.vulnerabilities.length} vulnerabilities`, 'yellow');
          }
        });
      }
    } catch (e) {
      log(`❌ Error parsing Python audit results for ${name}`, 'red');
    }
  } else {
    log(`❌ Failed to audit Python dependencies for ${name}`, 'red');
  }
}

// Generate security report
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    results: results,
    summary: {
      totalAudited: results.length,
      passed: results.filter(r => r.status === 'passed').length,
      failed: results.filter(r => r.status === 'failed').length,
      warnings: results.filter(r => r.status === 'warning').length,
    },
  };

  const reportPath = path.join(process.cwd(), 'security-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\n📄 Security report saved to: ${reportPath}`, 'blue');
}

// Main execution
async function main() {
  const results = [];

  // Audit root dependencies
  auditNodeDependencies(process.cwd(), 'Root');
  results.push({ name: 'Root', status: 'completed' });

  // Audit backend
  auditNodeDependencies(path.join(process.cwd(), 'backend'), 'Backend');
  results.push({ name: 'Backend', status: 'completed' });

  // Audit frontend
  auditNodeDependencies(path.join(process.cwd(), 'frontend'), 'Frontend');
  results.push({ name: 'Frontend', status: 'completed' });

  // Audit ML Service
  auditPythonDependencies(path.join(process.cwd(), 'ml-service', 'requirements.txt'), 'ML Service');
  results.push({ name: 'ML Service', status: 'completed' });

  // Audit AI Engine
  auditPythonDependencies(
    path.join(process.cwd(), 'aig-ia-engine', 'requirements.txt'),
    'AI Engine'
  );
  results.push({ name: 'AI Engine', status: 'completed' });

  // Generate report
  generateReport(results);

  log('\n🔒 Security audit completed!', 'green');
  log('Check the logs above for any vulnerabilities found.', 'blue');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { auditNodeDependencies, auditPythonDependencies, generateReport };
