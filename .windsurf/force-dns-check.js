#!/usr/bin/env node

/**
 * Force DNS Check for GitHub Pages
 */

const axios = require('axios');
require('dotenv').config();

async function forceDNSCheck() {
  try {
    console.log('🔄 Forzando verificación DNS de GitHub Pages...');

    // Paso 1: Eliminar y volver a añadir el dominio
    console.log('1. 🗑️ Eliminando dominio personalizado...');
    try {
      await axios.delete('https://api.github.com/repos/aigestion/aigestion/pages', {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      console.log('   ✅ Dominio eliminado');
    } catch (error) {
      console.log('   ⚠️ El dominio ya estaba eliminado');
    }

    // Esperar 30 segundos
    console.log('⏳ Esperando 30 segundos...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Paso 2: Recrear Pages sin dominio
    console.log('2. 🔄 Recreando Pages sin dominio...');
    await axios.post(
      'https://api.github.com/repos/aigestion/aigestion/pages',
      {
        source: {
          branch: 'main',
          path: '/',
        },
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    console.log('   ✅ Pages recreado sin dominio');

    // Esperar 60 segundos
    console.log('⏳ Esperando 60 segundos...');
    await new Promise(resolve => setTimeout(resolve, 60000));

    // Paso 3: Añadir dominio personalizado
    console.log('3. 🌐 Añadiendo dominio personalizado...');
    await axios.post(
      'https://api.github.com/repos/aigestion/aigestion/pages',
      {
        cname: 'aigestion.net',
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    console.log('   ✅ Dominio personalizado añadido');

    // Esperar 90 segundos para DNS check
    console.log('⏳ Esperando 90 segundos para DNS check...');
    await new Promise(resolve => setTimeout(resolve, 90000));

    // Paso 4: Verificar estado
    console.log('4. 🔍 Verificando estado final...');
    const status = await axios.get('https://api.github.com/repos/aigestion/aigestion/pages', {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    console.log('📄 Estado Final:');
    console.log(`   Status: ${status.data.status}`);
    console.log(`   URL: ${status.data.html_url}`);
    console.log(`   Custom Domain: ${status.data.cname || 'None'}`);
    console.log(`   HTTPS: ${status.data.https_enforced ? 'Enforced' : 'Not enforced'}`);

    // Paso 5: Trigger múltiples builds para forzar DNS check
    console.log('5. 🚀 Triggering múltiples builds...');
    for (let i = 0; i < 3; i++) {
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

        // Esperar 30 segundos entre builds
        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
      } catch (error) {
        console.log(`   ⚠️ Build ${i + 1} falló: ${error.message}`);
      }
    }

    console.log('\n🎉 Proceso completado!');
    console.log('📋 Próximos pasos:');
    console.log('   1. Espera 5-10 minutos');
    console.log('   2. Refresca GitHub Pages Settings');
    console.log('   3. El DNS check debería ser exitoso');
    console.log('   4. Activa "Enforce HTTPS" cuando esté disponible');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

forceDNSCheck();
