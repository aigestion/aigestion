const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function exec(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Source directory ${src} does not exist. Skipping.`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log(`Copied ${src} to ${dest}`);
}

const rootDir = path.resolve(__dirname, '..');
const websiteDist = path.join(rootDir, 'frontend/apps/website-epic/dist');

// 1. Build all projects
console.log('Building all projects...');
// Use turbo to build everything. Assumes 'pnpm build' at root does this.
try {
  exec('pnpm build');
} catch (e) {
  console.error('Build failed with error:', e.message);
  if (e.stderr) console.error('Stderr:', e.stderr.toString());
  if (e.stdout) console.error('Stdout:', e.stdout.toString());
  process.exit(1);
}

// 2. Prepare destination structure
// Ensure website-epic/dist exists (it should after build)
if (!fs.existsSync(websiteDist)) {
  console.error('Website build output not found at', websiteDist);
  process.exit(1);
}

// 3. Merge Dashboards
const dashboards = [
  { name: 'apps/admin-dashboard', path: 'admin' },
  { name: 'apps/client-dashboard', path: 'client' },
  { name: 'apps/demo-dashboard', path: 'demo' },
];

dashboards.forEach(dashboard => {
  const src = path.join(rootDir, `frontend/${dashboard.name}/dist`);
  const dest = path.join(websiteDist, dashboard.path);
  copyDir(src, dest);
});

console.log('Unified build complete.');
