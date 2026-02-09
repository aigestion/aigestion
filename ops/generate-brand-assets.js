// generate-brand-assets.js
// This script uses Sharp and png-to-ico to create all required branding assets from the master logo.
// Run with: node scripts/generate-brand-assets.js

/* eslint-env node */

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

// Paths
const logoPath = path.resolve(
  __dirname,
  '..',
  'frontend',
  'apps',
  'website',
  'public',
  'logo_aigestion.png'
);
// Output directory for branding assets (creates a subfolder for organization)
const outDir = path.resolve(__dirname, '..', 'frontend', 'apps', 'website', 'public', 'branding');
// Ensure the output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

if (!fs.existsSync(logoPath)) {
  console.error('Logo not found at', logoPath);
  process.exit(1);
}

// Helper to write a PNG icon
async function writeIcon(input, size, name) {
  const outPath = path.join(outDir, name);
  await sharp(input).resize(size, size, { fit: 'contain' }).png({ quality: 90 }).toFile(outPath);
  console.log(`Created ${name}`);
}

(async () => {
  try {
    // 1. Generate favicon.png (fallback) and favicon.ico (proper format)
    const pngFaviconPath = path.join(outDir, 'favicon.png');
    await sharp(logoPath).resize(32, 32, { fit: 'contain' }).png().toFile(pngFaviconPath);
    const icoBuffer = await pngToIco([pngFaviconPath]);
    fs.writeFileSync(path.join(outDir, 'favicon.ico'), icoBuffer);
    console.log('Created favicon.ico and fallback favicon.png');

    // 2. Apple Touch Icon (180x180)
    await writeIcon(logoPath, 180, 'apple-touch-icon.png');

    // 3. Android Chrome 192x192
    await writeIcon(logoPath, 192, 'android-chrome-192x192.png');

    // 4. Android Chrome 512x512
    await writeIcon(logoPath, 512, 'android-chrome-512x512.png');

    console.log('All branding assets generated successfully.');
  } catch (err) {
    console.error('Error generating assets:', err);
    process.exit(1);
  }
})();
