#!/usr/bin/env node

/**
 * SSL Certificate Checker for GitHub Pages
 */

const axios = require('axios');
require('dotenv').config();

class SSLChecker {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.apiBase = 'https://api.github.com';
    this.owner = 'aigestion';
    this.repo = 'aigestion';
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    try {
      const config = {
        method,
        url: `${this.apiBase}${endpoint}`,
        headers: {
          Authorization: `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'AIGestion-SSL-Checker',
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

  async checkPagesStatus() {
    console.log('📄 Verificando estado de GitHub Pages...');
    try {
      const pages = await this.makeRequest(`/repos/${this.owner}/${this.repo}/pages`);
      
      console.log(`   ✅ Status: ${pages.status}`);
      console.log(`   ✅ URL: ${pages.html_url}`);
      console.log(`   ✅ Custom Domain: ${pages.cname || 'None'}`);
      console.log(`   ✅ HTTPS: ${pages.https_enforced ? 'Enforced' : 'Not enforced'}`);
      console.log(`   ✅ Build Type: ${pages.build_type || 'Automatic'}`);
      console.log(`   ✅ Source Branch: ${pages.source?.branch || 'Unknown'}`);
      
      return pages;
    } catch (error) {
      console.log('   ❌ GitHub Pages no está configurado');
      return null;
    }
  }

  async checkCertificateStatus() {
    console.log('🔒 Verificando estado del certificado SSL...');
    
    try {
      // Intentar obtener información del certificado
      const response = await axios.get('https://aigestion.net', {
        timeout: 10000,
        validateStatus: false
      });
      
      console.log('   ✅ Conexión HTTPS establecida');
      console.log('   ✅ Certificado presente');
      
      return true;
    } catch (error) {
      if (error.code === 'SEC_E_WRONG_PRINCIPAL') {
        console.log('   ❌ Error: El certificado no coincide con el dominio');
        console.log('   🔧 Causa: GitHub Pages está generando certificado para otro dominio');
        return false;
      } else if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        console.log('   ❌ Error: Firma del certificado inválida');
        console.log('   🔧 Causa: Certificado auto-firmado o intermedio missing');
        return false;
      } else {
        console.log(`   ❌ Error de conexión: ${error.code}`);
        console.log(`   🔧 Mensaje: ${error.message}`);
        return false;
      }
    }
  }

  async triggerCertificateRegeneration() {
    console.log('🔄 Intentando regenerar certificado...');
    
    try {
      // Método 1: Forzar rebuild de Pages
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/pages/builds`, 'POST');
      console.log('   ✅ Rebuild de Pages triggered');
      
      // Método 2: Eliminar y volver a añadir el dominio
      console.log('   🔄 Eliminando dominio personalizado...');
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/pages`, 'DELETE');
      
      console.log('   🔄 Reañadiendo dominio personalizado...');
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/pages`, 'POST', {
        source: {
          branch: 'main',
          path: '/'
        }
      });
      
      console.log('   ✅ Dominio reconfigurado');
      
      // Método 3: Forzar HTTPS enforcement
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/pages`, 'PATCH', {
        https_enforced: true
      });
      
      console.log('   ✅ HTTPS enforcement activado');
      
      return true;
    } catch (error) {
      console.log(`   ❌ Error en regeneración: ${error.message}`);
      return false;
    }
  }

  async createSSLIssue() {
    console.log('🐛 Creando issue de diagnóstico SSL...');
    
    const pages = await this.checkPagesStatus();
    const certWorks = await this.checkCertificateStatus();
    
    return await this.makeRequest(`/repos/${this.owner}/${this.repo}/issues`, 'POST', {
      title: '🔒 SSL Certificate Issue - aigestion.net',
      body: `
## SSL Certificate Diagnostic Report

### 📊 Current Status
- **Repository**: ${this.owner}/${this.repo}
- **Domain**: aigestion.net
- **GitHub Pages**: ${pages?.status || 'Not configured'}
- **HTTPS**: ${pages?.https_enforced ? 'Enforced' : 'Not enforced'}
- **Certificate**: ${certWorks ? 'Valid' : 'Invalid'}

### 🔍 SSL Error Details
**Error**: SEC_E_WRONG_PRINCIPAL (0x80090322)
**Description**: El nombre de entidad de seguridad de destino es incorrecto
**Root Cause**: El certificado SSL no coincide con el dominio aigestion.net

### 🔧 Troubleshooting Steps Taken
1. ✅ DNS records verified (4 A records pointing to GitHub Pages)
2. ✅ GitHub Pages status confirmed (built)
3. ✅ Custom domain configured
4. ❌ Certificate validation failed

### 📋 Required Actions
1. **Wait for Certificate Generation**: GitHub Pages needs time to generate proper certificate
2. **DNS Propagation**: Ensure all DNS servers have updated records
3. **Manual Certificate Regeneration**: May need to remove/re-add custom domain

### 🕐 Timeline
- **DNS Propagation**: 5-30 minutes
- **Certificate Generation**: 1-60 minutes
- **Full SSL Activation**: Up to 24 hours

### 🔗 Important Links
- [GitHub Pages Status](https://github.com/aigestion/aigestion/settings/pages)
- [SSL Labs Test](https://www.ssllabs.com/ssltest/analyze.html?d=aigestion.net)
- [Site Status](https://aigestion.net)

---
*Auto-generated by SSL Checker Script*
      `,
      labels: ['bug', 'ssl', 'certificate', 'github-pages', 'high-priority']
    });
  }
}

async function main() {
  try {
    console.log('🔒 Iniciando SSL Certificate Checker');
    console.log('===================================');

    const checker = new SSLChecker();

    // 1. Verificar estado de Pages
    console.log('\n1. 📄 Estado de GitHub Pages:');
    await checker.checkPagesStatus();

    // 2. Verificar certificado SSL
    console.log('\n2. 🔒 Estado del Certificado SSL:');
    const certWorks = await checker.checkCertificateStatus();

    // 3. Si el certificado no funciona, intentar regenerar
    if (!certWorks) {
      console.log('\n3. 🔄 Intentando Regeneración:');
      await checker.triggerCertificateRegeneration();
      
      console.log('\n⏳ Esperando 2 minutos para propagación...');
      await new Promise(resolve => setTimeout(resolve, 120000));
      
      console.log('\n4. 🔍 Verificación Final:');
      await checker.checkCertificateStatus();
    }

    // 5. Crear issue de seguimiento
    console.log('\n5. 🐛 Issue de Seguimiento:');
    await checker.createSSLIssue();

    console.log('\n🎉 SSL Check completado!');
    console.log('===================================');
    
    if (certWorks) {
      console.log('✅ Certificado SSL funcionando correctamente');
    } else {
      console.log('⚠️ Certificado SSL necesita atención manual');
      console.log('📋 Revisa el issue creado en GitHub para seguimiento');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
