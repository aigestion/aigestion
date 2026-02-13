/**
 * Bundle Size Checker
 * Script para verificar que el bundle no exceda los límites establecidos
 */

import fs from 'fs';
import path from 'path';
import { gzipSync } from 'zlib';

const BUNDLE_LIMITS = {
  main: 200 * 1024, // 200KB
  total: 500 * 1024, // 500KB
  chunk: 100 * 1024, // 100KB
};

const DIST_DIR = path.join(process.cwd(), 'dist');

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    console.error(`❌ Error reading file ${filePath}:`, error.message);
    return 0;
  }
}

function getGzippedSize(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return gzipSync(content).length;
  } catch (error) {
    console.error(`❌ Error gzipping file ${filePath}:`, error.message);
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log('🔍 Analyzing bundle sizes...\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Dist directory not found. Run build first.');
    process.exit(1);
  }

  const assetsDir = path.join(DIST_DIR, 'assets');
  if (!fs.existsSync(assetsDir)) {
    console.error('❌ Assets directory not found.');
    process.exit(1);
  }

  const files = fs.readdirSync(assetsDir);
  const jsFiles = files.filter(file => file.endsWith('.js'));
  const cssFiles = files.filter(file => file.endsWith('.css'));

  let totalSize = 0;
  let totalGzippedSize = 0;

  console.log('📊 JavaScript Files:');
  jsFiles.forEach(file => {
    const filePath = path.join(assetsDir, file);
    const size = getFileSize(filePath);
    const gzippedSize = getGzippedSize(filePath);

    totalSize += size;
    totalGzippedSize += gzippedSize;

    const status = size > BUNDLE_LIMITS.chunk ? '❌' : '✅';
    console.log(`${status} ${file}: ${formatBytes(size)} (${formatBytes(gzippedSize)} gzipped)`);

    if (size > BUNDLE_LIMITS.chunk) {
      console.log(`   ⚠️  Exceeds chunk limit of ${formatBytes(BUNDLE_LIMITS.chunk)}`);
    }
  });

  console.log('\n📊 CSS Files:');
  cssFiles.forEach(file => {
    const filePath = path.join(assetsDir, file);
    const size = getFileSize(filePath);
    const gzippedSize = getGzippedSize(filePath);

    totalSize += size;
    totalGzippedSize += gzippedSize;

    console.log(`✅ ${file}: ${formatBytes(size)} (${formatBytes(gzippedSize)} gzipped)`);
  });

  // Check main bundle
  const mainBundle = jsFiles.find(file => file.includes('index-')) || jsFiles[0];
  if (mainBundle) {
    const mainBundlePath = path.join(assetsDir, mainBundle);
    const mainBundleSize = getFileSize(mainBundlePath);
    const mainBundleGzipped = getGzippedSize(mainBundlePath);

    console.log('\n📦 Main Bundle:');
    console.log(
      `📄 ${mainBundle}: ${formatBytes(mainBundleSize)} (${formatBytes(mainBundleGzipped)} gzipped)`
    );

    if (mainBundleSize > BUNDLE_LIMITS.main) {
      console.log(`❌ Main bundle exceeds limit of ${formatBytes(BUNDLE_LIMITS.main)}`);
      console.log(`   Over by: ${formatBytes(mainBundleSize - BUNDLE_LIMITS.main)}`);
    } else {
      console.log(
        `✅ Main bundle within limit (${formatBytes(BUNDLE_LIMITS.main - mainBundleSize)} remaining)`
      );
    }
  }

  console.log('\n📊 Total Bundle Size:');
  console.log(`📦 Total: ${formatBytes(totalSize)} (${formatBytes(totalGzippedSize)} gzipped)`);

  if (totalSize > BUNDLE_LIMITS.total) {
    console.log(`❌ Total bundle exceeds limit of ${formatBytes(BUNDLE_LIMITS.total)}`);
    console.log(`   Over by: ${formatBytes(totalSize - BUNDLE_LIMITS.total)}`);
    process.exit(1);
  } else {
    console.log(
      `✅ Total bundle within limit (${formatBytes(BUNDLE_LIMITS.total - totalSize)} remaining)`
    );
  }

  // Performance metrics
  console.log('\n⚡ Performance Metrics:');
  console.log(`📊 Compression Ratio: ${((1 - totalGzippedSize / totalSize) * 100).toFixed(1)}%`);
  console.log(`📁 Total Files: ${files.length}`);
  console.log(`📄 JS Files: ${jsFiles.length}`);
  console.log(`🎨 CSS Files: ${cssFiles.length}`);

  // Recommendations
  console.log('\n💡 Recommendations:');

  if (totalSize > BUNDLE_LIMITS.total * 0.8) {
    console.log('⚠️  Bundle is getting close to size limit. Consider:');
    console.log('   - Code splitting for large components');
    console.log('   - Tree shaking unused dependencies');
    console.log('   - Dynamic imports for heavy libraries');
  }

  const largeFiles = jsFiles.filter(file => {
    const filePath = path.join(assetsDir, file);
    return getFileSize(filePath) > BUNDLE_LIMITS.chunk;
  });

  if (largeFiles.length > 0) {
    console.log('⚠️  Large chunks detected:');
    largeFiles.forEach(file => {
      const filePath = path.join(assetsDir, file);
      const size = getFileSize(filePath);
      console.log(`   - ${file}: ${formatBytes(size)}`);
    });
  }

  console.log('\n✅ Bundle analysis completed successfully!');
}

analyzeBundle();
