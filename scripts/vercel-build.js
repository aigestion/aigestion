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
const websiteDist = path.join(rootDir, 'frontend/website-epic/dist');

// 1. Build all projects
console.log('Building all projects...');
// Use turbo to build everything. Assumes 'mvn run build' at root does this.
try {
    exec('npm run build'); 
} catch (e) {
    console.error('Build failed', e);
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
  { name: 'admin-dashboard', path: 'admin' },
  { name: 'client-dashboard', path: 'client' },
  { name: 'demo-dashboard', path: 'demo' }
];

dashboards.forEach(dashboard => {
  const src = path.join(rootDir, `frontend/${dashboard.name}/dist`);
  const dest = path.join(websiteDist, dashboard.path);
  copyDir(src, dest);
});

console.log('Unified build complete.');
