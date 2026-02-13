#!/usr/bin/env node

/**
 * Trigger Multiple GitHub Pages Builds
 */

const axios = require('axios');
require('dotenv').config();

async function triggerMultipleBuilds() {
  try {
    console.log('🚀 Triggering múltiples builds forzar completión...');

    for (let i = 0; i < 5; i++) {
      try {
        await axios.post(
          'https://api.github.com/repos/aigestion/aigestion/pages/builds',
          {},
          {
            headers: {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );
        console.log(`   ✅ Build ${i + 1} triggered`);

        // Esperar 20 segundos entre builds
        if (i < 4) {
          await new Promise(resolve => setTimeout(resolve, 20000));
        }
      } catch (error) {
        console.log(`   ⚠️ Build ${i + 1} falló: ${error.message}`);
      }
    }

    console.log('🎉 Builds triggered completado');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

triggerMultipleBuilds();
