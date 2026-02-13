import Critters from 'critters';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');

async function generateCriticalCSS() {
  console.log('🚀 Generating Critical CSS...');

  const critters = new Critters({
    path: DIST_DIR,
    publicPath: '/',
    preload: 'swap',
    pruneSource: false, // Keep original CSS for non-critical styles
    logLevel: 'info',
  });

  try {
    const htmlPath = path.join(DIST_DIR, 'index.html');
    const html = await fs.readFile(htmlPath, 'utf8');

    console.log('📝 Processing index.html...');
    const optimizedHtml = await critters.process(html);

    await fs.writeFile(htmlPath, optimizedHtml);
    console.log('✅ Critical CSS injected into index.html');
  } catch (error) {
    console.error('❌ Error generating critical CSS:', error);
    process.exit(1);
  }
}

generateCriticalCSS();
