import { copyFileSync, mkdirSync, existsSync, readdirSync, lstatSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const frontendDir = join(rootDir, 'frontend');
const distDir = join(rootDir, 'dist');

function copyRecursiveSync(src, dest) {
  const exists = existsSync(src);
  const stats = exists && lstatSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }
    readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(join(src, childItemName), join(dest, childItemName));
    });
  } else {
    copyFileSync(src, dest);
  }
}

// 1. Clean and prepare dist
if (existsSync(distDir)) {
  console.log('Cleaning existing dist directory...');
  // Note: Vercel usually handles this, but we'll do it for local testing
} else {
  mkdirSync(distDir, { recursive: true });
}

// 2. Apps mapping
const apps = [
  { name: 'website-epic', path: 'website-epic', isRoot: true },
  { name: 'admindashboard', path: 'admindashboard', route: 'admin' },
  { name: 'clientdashboard', path: 'clientdashboard', route: 'client' },
  { name: 'demodashboard', path: 'demodashboard', route: 'demo' }
];

console.log('Assembling Vercel deployment structure...');

apps.forEach(app => {
  const appDist = join(frontendDir, 'apps', app.path, 'dist');

  if (!existsSync(appDist)) {
    console.warn(`Warning: Build output for ${app.name} not found at ${appDist}`);
    return;
  }

  if (app.isRoot) {
    console.log(`Copying root app: ${app.name}`);
    copyRecursiveSync(appDist, distDir);
  } else {
    const targetDir = join(distDir, app.route);
    console.log(`Copying app ${app.name} to /${app.route}`);
    copyRecursiveSync(appDist, targetDir);
  }
});

console.log('Build preparation complete.');
