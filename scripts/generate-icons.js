#!/usr/bin/env node
/**
 * Generate PWA icons at different sizes from the 512x512 source
 * Requires: npm install --save-dev sharp
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sourceIcon = path.join(__dirname, '../frontend/apps/website-epic/public/icons/icon-512x512.png');
const outputDir = path.join(__dirname, '../frontend/apps/website-epic/public/icons');
const deployDist = path.join(__dirname, '../deploy_dist/icons');
const deployDistManual = path.join(__dirname, '../deploy_dist_manual/icons');

// Ensure directories exist
[outputDir, deployDist, deployDistManual].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const directories = [outputDir, deployDist, deployDistManual];

async function generateIcons() {
  try {
    console.log('📱 Generating PWA icons...\n');

    for (const size of sizes) {
      for (const dir of directories) {
        const outputPath = path.join(dir, `icon-${size}x${size}.png`);

        // Skip if file already exists (192 and 512 already exist)
        if (fs.existsSync(outputPath)) {
          console.log(`✅ ${path.basename(dir)}/icon-${size}x${size}.png (already exists)`);
          continue;
        }

        await sharp(sourceIcon)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 1, g: 1, b: 3, alpha: 1 } // Match dark background
          })
          .png()
          .toFile(outputPath);

        console.log(`✅ Generated ${path.basename(dir)}/icon-${size}x${size}.png`);
      }
    }

    console.log('\n🎉 Icon generation complete!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
