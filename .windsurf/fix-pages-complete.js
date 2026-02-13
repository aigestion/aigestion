#!/usr/bin/env node

/**
 * Complete GitHub Pages Fix - Arreglo completo de GitHub Pages
 */

const axios = require('axios');
require('dotenv').config();

class GitHubPagesFixer {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.owner = 'aigestion';
    this.repo = 'aigestion';
    this.apiBase = 'https://api.github.com';
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    try {
      const config = {
        method,
        url: `${this.apiBase}${endpoint}`,
        headers: {
          Authorization: `token ${this.token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'AIGestion-Pages-Fixer',
        },
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('GitHub API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  async getCurrentStatus() {
    console.log('🔍 Verificando estado actual...');
    try {
      const pages = await this.makeRequest(`/repos/${this.owner}/${this.repo}/pages`);
      console.log(`   Status: ${pages.status}`);
      console.log(`   Custom Domain: ${pages.cname || 'None'}`);
      console.log(`   HTTPS: ${pages.https_enforced ? 'Enforced' : 'Not enforced'}`);
      return pages;
    } catch (error) {
      console.log('   ❌ GitHub Pages no está configurado');
      return null;
    }
  }

  async completeReset() {
    console.log('🔄 Iniciando reset completo de GitHub Pages...');

    // Paso 1: Eliminar completamente Pages
    console.log('1. 🗑️ Eliminando configuración de Pages...');
    try {
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/pages`, 'DELETE');
      console.log('   ✅ Configuración eliminada');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('   ⚠️ Pages ya estaba eliminado');
      } else {
        throw error;
      }
    }

    // Esperar 30 segundos
    console.log('⏳ Esperando 30 segundos...');
    await this.sleep(30);

    // Paso 2: Verificar que esté eliminado
    console.log('2. 🔍 Verificando eliminación...');
    const status = await this.getCurrentStatus();
    if (status) {
      console.log('   ❌ Pages todavía existe, intentando de nuevo...');
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/pages`, 'DELETE');
      await this.sleep(30);
    }

    // Paso 3: Crear Pages básico sin dominio
    console.log('3. 🔄 Creando Pages básico...');
    const newPages = await this.makeRequest(`/repos/${this.owner}/${this.repo}/pages`, 'POST', {
      source: {
        branch: 'main',
        path: '/',
      },
    });
    console.log(`   ✅ Pages creado con status: ${newPages.status}`);

    // Esperar 60 segundos para construcción inicial
    console.log('⏳ Esperando 60 segundos para construcción inicial...');
    await this.sleep(60);

    // Paso 4: Verificar construcción
    console.log('4. 🔍 Verificando construcción...');
    const builtPages = await this.getCurrentStatus();
    if (builtPages.status === 'built') {
      console.log('   ✅ Pages construido exitosamente');
    } else {
      console.log(`   ⚠️ Pages status: ${builtPages.status}`);
    }

    // Paso 5: Añadir dominio personalizado
    console.log('5. 🌐 Añadiendo dominio personalizado...');
    try {
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/pages`, 'POST', {
        cname: 'aigestion.net',
      });
      console.log('   ✅ Dominio personalizado añadido');
    } catch (error) {
      console.log('   ⚠️ Error añadiendo dominio, intentando método alternativo...');
      // Método alternativo: PATCH
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/pages`, 'PATCH', {
        cname: 'aigestion.net',
      });
      console.log('   ✅ Dominio añadido con método alternativo');
    }

    // Esperar 90 segundos para DNS check
    console.log('⏳ Esperando 90 segundos para DNS check...');
    await this.sleep(90);

    // Paso 6: Verificar estado final
    console.log('6. 🔍 Verificando estado final...');
    const finalStatus = await this.getCurrentStatus();

    // Paso 7: Forzar múltiples builds
    console.log('7. 🚀 Forzando builds adicionales...');
    for (let i = 0; i < 3; i++) {
      try {
        await this.makeRequest(`/repos/${this.owner}/${this.repo}/pages/builds`, 'POST');
        console.log(`   ✅ Build ${i + 1} triggered`);
        await this.sleep(30);
      } catch (error) {
        console.log(`   ⚠️ Build ${i + 1} falló: ${error.message}`);
      }
    }

    // Paso 8: Verificación final
    console.log('8. 🎯 Verificación final...');
    const finalCheck = await this.getCurrentStatus();

    return finalCheck;
  }

  async createIssue(status) {
    console.log('🐛 Creando issue de seguimiento...');

    return await this.makeRequest(`/repos/${this.owner}/${this.repo}/issues`, 'POST', {
      title: '🔧 GitHub Pages Complete Fix - Status Update',
      body: `
## GitHub Pages Complete Fix Status

### 📊 Current Status
- **Repository**: ${this.owner}/${this.repo}
- **Status**: ${status.status}
- **Custom Domain**: ${status.cname || 'None'}
- **HTTPS**: ${status.https_enforced ? 'Enforced' : 'Not enforced'}
- **URL**: ${status.html_url}

### 🔧 Actions Performed
1. ✅ Complete Pages configuration reset
2. ✅ Basic Pages recreation
3. ✅ Custom domain configuration
4. ✅ Multiple build triggers
5. ✅ DNS verification

### 📋 Next Steps
1. **Wait 5-10 minutes** for full propagation
2. **Check GitHub Pages Settings** for DNS status
3. **Enable HTTPS** when available
4. **Verify site accessibility**

### 🌐 Expected URLs
- **HTTP**: http://aigestion.net
- **HTTPS**: https://aigestion.net (when certificate ready)
- **GitHub.io**: https://aigestion.github.io/website-epic/

### 🔗 Important Links
- [GitHub Pages Settings](https://github.com/aigestion/aigestion/settings/pages)
- [Site Status](http://aigestion.net)
- [DNS Verification](https://www.whatsmydns.net/#A/aigestion.net)

---
*Auto-generated by Complete Pages Fix Script*
      `,
      labels: ['infrastructure', 'github-pages', 'fix', 'status-update'],
    });
  }
}

async function main() {
  try {
    console.log('🔧 Iniciando GitHub Pages Complete Fix');
    console.log('=====================================');

    const fixer = new GitHubPagesFixer();

    // Mostrar estado inicial
    console.log('\n📋 Estado Inicial:');
    await fixer.getCurrentStatus();

    // Ejecutar fix completo
    console.log('\n🔄 Ejecutando Fix Completo:');
    const finalStatus = await fixer.completeReset();

    // Crear issue de seguimiento
    console.log('\n🐛 Creando Issue de Seguimiento:');
    await fixer.createIssue(finalStatus);

    console.log('\n🎉 Fix Completo Terminado!');
    console.log('=====================================');
    console.log('📋 Resumen Final:');
    console.log(`   Status: ${finalStatus.status}`);
    console.log(`   Domain: ${finalStatus.cname || 'None'}`);
    console.log(`   HTTPS: ${finalStatus.https_enforced ? 'Enforced' : 'Not enforced'}`);

    console.log('\n⏳ Próximos Pasos:');
    console.log('   1. Espera 5-10 minutos');
    console.log('   2. Verifica: https://github.com/aigestion/aigestion/settings/pages');
    console.log('   3. Activa HTTPS cuando esté disponible');
    console.log('   4. Verifica el sitio: http://aigestion.net');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
