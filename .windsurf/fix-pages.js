#!/usr/bin/env node

/**
 * Fix GitHub Pages Configuration
 */

const axios = require('axios');
require('dotenv').config();

async function fixGitHubPages() {
  try {
    console.log('🔧 Iniciando reparación de GitHub Pages...');
    
    // Paso 1: Eliminar configuración actual
    console.log('1. 🗑️ Eliminando configuración actual...');
    try {
      await axios.delete('https://api.github.com/repos/aigestion/aigestion/pages', {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      console.log('   ✅ Configuración eliminada');
    } catch (error) {
      console.log('   ⚠️ La configuración ya estaba eliminada o no existía');
    }
    
    // Esperar 30 segundos
    console.log('⏳ Esperando 30 segundos...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // Paso 2: Crear nueva configuración
    console.log('2. 🔄 Creando nueva configuración...');
    const response = await axios.post('https://api.github.com/repos/aigestion/aigestion/pages', {
      source: {
        branch: 'main',
        path: '/'
      }
    }, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    console.log('   ✅ Nueva configuración creada');
    console.log(`   Status: ${response.data.status}`);
    
    // Esperar 60 segundos
    console.log('⏳ Esperando 60 segundos para propagación...');
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    // Paso 3: Configurar dominio personalizado
    console.log('3. 🌐 Configurando dominio personalizado...');
    await axios.post('https://api.github.com/repos/aigestion/aigestion/pages', {
      cname: 'aigestion.net'
    }, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    console.log('   ✅ Dominio personalizado configurado');
    
    // Paso 4: Trigger build
    console.log('4. 🚀 Triggering build...');
    await axios.post('https://api.github.com/repos/aigestion/aigestion/pages/builds', {}, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    console.log('   ✅ Build triggered');
    
    // Esperar 2 minutos
    console.log('⏳ Esperando 2 minutos para completar el build...');
    await new Promise(resolve => setTimeout(resolve, 120000));
    
    // Paso 5: Verificar estado final
    console.log('5. 🔍 Verificando estado final...');
    const finalStatus = await axios.get('https://api.github.com/repos/aigestion/aigestion/pages', {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    console.log('📄 Estado Final:');
    console.log(`   Status: ${finalStatus.data.status}`);
    console.log(`   URL: ${finalStatus.data.html_url}`);
    console.log(`   Custom Domain: ${finalStatus.data.cname || 'None'}`);
    console.log(`   HTTPS: ${finalStatus.data.https_enforced ? 'Enforced' : 'Not enforced'}`);
    
    if (finalStatus.data.status === 'built') {
      console.log('🎉 ¡GitHub Pages está funcionando!');
    } else {
      console.log('⚠️ GitHub Pages aún está procesando...');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

fixGitHubPages();
