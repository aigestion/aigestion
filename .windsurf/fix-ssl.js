#!/usr/bin/env node

/**
 * Fix SSL Certificate for Custom Domain
 */

const axios = require('axios');
require('dotenv').config();

async function fixSSL() {
  try {
    console.log('🔧 Iniciando reparación SSL...');
    
    // Paso 1: Eliminar completamente la configuración de Pages
    console.log('1. 🗑️ Eliminando configuración de Pages...');
    await axios.delete(
      'https://api.github.com/repos/aigestion/aigestion/pages',
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'AIGestion-SSL-Fixer'
        }
      }
    );
    console.log('   ✅ Configuración eliminada');
    
    // Esperar 30 segundos
    console.log('⏳ Esperando 30 segundos...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // Paso 2: Recrear Pages con dominio personalizado
    console.log('2. 🔄 Recreando Pages con dominio personalizado...');
    const response = await axios.post(
      'https://api.github.com/repos/aigestion/aigestion/pages',
      {
        source: {
          branch: 'main',
          path: '/'
        }
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'AIGestion-SSL-Fixer'
        }
      }
    );
    console.log('   ✅ Pages recreado');
    
    // Esperar 60 segundos
    console.log('⏳ Esperando 60 segundos para propagación...');
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    // Paso 3: Configurar dominio personalizado
    console.log('3. 🌐 Configurando dominio personalizado...');
    await axios.post(
      'https://api.github.com/repos/aigestion/aigestion/pages',
      {
        cname: 'aigestion.net'
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'AIGestion-SSL-Fixer'
        }
      }
    );
    console.log('   ✅ Dominio personalizado configurado');
    
    // Esperar 2 minutos para generación de certificado
    console.log('⏳ Esperando 2 minutos para generación de certificado...');
    await new Promise(resolve => setTimeout(resolve, 120000));
    
    // Paso 4: Forzar HTTPS enforcement
    console.log('4. 🔒 Forzando HTTPS enforcement...');
    await axios.patch(
      'https://api.github.com/repos/aigestion/aigestion/pages',
      {
        https_enforced: true
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'AIGestion-SSL-Fixer'
        }
      }
    );
    console.log('   ✅ HTTPS enforcement activado');
    
    console.log('\n🎉 SSL Fix completado!');
    console.log('⏳ Espera 5-10 minutos para activación completa del certificado');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

fixSSL();
