const https = require('https');
const { execSync } = require('child_process');

console.log('🔧 Forzando SSL Certificate Regeneration');
console.log('=======================================');

async function forceSSLRegeneration() {
  try {
    // 1. Forzar rebuild completo de Pages
    console.log('1. 🔄 Forzando rebuild completo...');
    
    // Usar GitHub CLI para forzar rebuild
    try {
      execSync('gh api repos/:owner/:repo/pages/builds -X POST', { 
        stdio: 'inherit',
        cwd: 'c:\\Users\\Alejandro\\AIGestion'
      });
      console.log('   ✅ Build trigger enviado via GitHub CLI');
    } catch (cliError) {
      console.log('   ⚠️ GitHub CLI no disponible, usando método alternativo...');
    }

    // 2. Eliminar y recrear dominio personalizado
    console.log('2. 🗑️ Eliminando dominio personalizado temporalmente...');
    
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: '/repos/aigestion/aigestion-net/pages/domains/aigestion.net',
      method: 'DELETE',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN || 'ghp_YOUR_TOKEN_HERE'}`,
        'User-Agent': 'AIGestion-SSL-Fixer',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    // Intentar eliminar dominio
    await makeGitHubRequest(options);
    console.log('   ✅ Dominio eliminado');

    // Esperar 30 segundos
    console.log('   ⏳ Esperando 30 segundos...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    // 3. Recrear dominio personalizado
    console.log('3. ➕ Recreando dominio personalizado...');
    
    const createOptions = {
      hostname: 'api.github.com',
      port: 443,
      path: '/repos/aigestion/aigestion-net/pages/domains',
      method: 'POST',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN || 'ghp_YOUR_TOKEN_HERE'}`,
        'User-Agent': 'AIGestion-SSL-Fixer',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };

    const domainData = JSON.stringify({
      domain: 'aigestion.net'
    });

    await makeGitHubRequest(createOptions, domainData);
    console.log('   ✅ Dominio recreado');

    // 4. Forzar HTTPS enforcement
    console.log('4. 🔒 Forzando HTTPS enforcement...');
    
    const httpsOptions = {
      hostname: 'api.github.com',
      port: 443,
      path: '/repos/aigestion/aigestion-net/pages',
      method: 'PUT',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN || 'ghp_YOUR_TOKEN_HERE'}`,
        'User-Agent': 'AIGestion-SSL-Fixer',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };

    const httpsData = JSON.stringify({
      https_enforced: true,
      build_type: 'legacy'
    });

    await makeGitHubRequest(httpsOptions, httpsData);
    console.log('   ✅ HTTPS enforcement activado');

    // 5. Esperar y verificar
    console.log('5. ⏳ Esperando 2 minutos para propagación SSL...');
    await new Promise(resolve => setTimeout(resolve, 120000));

    console.log('6. 🔍 Verificación final SSL...');
    const sslStatus = await checkSSLStatus();
    
    if (sslStatus.valid) {
      console.log('   🎉 SSL Certificate regenerado exitosamente!');
      console.log(`   📅 Válido hasta: ${sslStatus.expiresAt}`);
      console.log(`   🏢 Emisor: ${sslStatus.issuer}`);
    } else {
      console.log('   ⚠️ SSL aún no válido. Puede requerir más tiempo.');
      console.log(`   🔍 Error: ${sslStatus.error}`);
    }

    return sslStatus;

  } catch (error) {
    console.error(`❌ Error en regeneración SSL: ${error.message}`);
    return { valid: false, error: error.message };
  }
}

function makeGitHubRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, body });
        } else {
          reject(new Error(`GitHub API Error: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

function checkSSLStatus() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'aigestion.net',
      port: 443,
      method: 'GET',
      rejectUnauthorized: false
    };

    const req = https.request(options, (res) => {
      const cert = res.socket.getPeerCertificate();
      if (Object.keys(cert).length === 0) {
        resolve({ valid: false, error: 'No certificate found' });
        return;
      }

      resolve({
        valid: res.socket.authorized,
        subject: cert.subject,
        issuer: cert.issuer?.O || 'Unknown',
        expiresAt: new Date(cert.valid_to).toISOString(),
        daysUntilExpiry: Math.floor((new Date(cert.valid_to) - new Date()) / (1000 * 60 * 60 * 24))
      });
    });

    req.on('error', (error) => {
      resolve({ valid: false, error: error.message });
    });
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ valid: false, error: 'SSL check timeout' });
    });
    req.end();
  });
}

// Ejecutar si se llama directamente
if (require.main === module) {
  forceSSLRegeneration().then(result => {
    console.log('\n🏁 Proceso completado');
    console.log('==================');
    if (result.valid) {
      console.log('✅ Éxito: SSL Certificate regenerado y válido');
    } else {
      console.log('⚠️ Advertencia: SSL requiere atención manual');
      console.log('📋 Siguiente paso: Verificar en GitHub Settings → Pages');
    }
  });
}

module.exports = { forceSSLRegeneration, checkSSLStatus };
