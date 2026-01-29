#!/usr/bin/env node

/**
 * DNS Monitor - Monitorea cambios en Google DNS
 */

const { execSync } = require('child_process');
const axios = require('axios');

function getCurrentTime() {
  return new Date().toLocaleTimeString();
}

function checkDNS(server, name) {
  try {
    const result = execSync(`nslookup ${name} ${server}`, { encoding: 'utf8' });
    const lines = result.split('\n');
    const addresses = lines.filter(line => line.includes('Address:') && !line.includes(server));
    return addresses.map(line => line.trim());
  } catch (error) {
    return [`Error: ${error.message}`];
  }
}

async function monitorDNS() {
  console.log('🔍 Iniciando monitor DNS continuo...');
  console.log('📋 Mientras tú configuras Google Domains, yo monitoreo los cambios');
  console.log('⏹️  Presiona Ctrl+C para detener\n');
  
  let previousGoogleDNS = [];
  let previousCloudflareDNS = [];
  
  while (true) {
    try {
      console.log(`\n⏰ ${getCurrentTime()} - Verificando DNS...`);
      
      // Verificar Google DNS
      const googleDNS = checkDNS('8.8.8.8', 'aigestion.net');
      console.log('🔍 Google DNS (8.8.8.8):');
      googleDNS.forEach(line => console.log(`   ${line}`));
      
      // Verificar Cloudflare DNS
      const cloudflareDNS = checkDNS('1.1.1.1', 'aigestion.net');
      console.log('🔍 Cloudflare DNS (1.1.1.1):');
      cloudflareDNS.forEach(line => console.log(`   ${line}`));
      
      // Verificar si hay cambios
      const googleChanged = JSON.stringify(googleDNS) !== JSON.stringify(previousGoogleDNS);
      const cloudflareChanged = JSON.stringify(cloudflareDNS) !== JSON.stringify(previousCloudflareDNS);
      
      if (googleChanged) {
        console.log('🎉 ¡CAMBIO DETECTADO en Google DNS!');
        previousGoogleDNS = googleDNS;
      }
      
      if (cloudflareChanged) {
        console.log('🔄 Cambio en Cloudflare DNS');
        previousCloudflareDNS = cloudflareDNS;
      }
      
      // Verificar si Google DNS ya apunta a GitHub Pages
      const hasGitHubIPs = googleDNS.some(line => 
        line.includes('185.199.108.153') || 
        line.includes('185.199.109.153') || 
        line.includes('185.199.110.153') || 
        line.includes('185.199.111.153')
      );
      
      if (hasGitHubIPs && !googleDNS.some(line => line.includes('136.110.241.46'))) {
        console.log('✅ ¡ÉXITO! Google DNS ahora apunta a GitHub Pages');
        console.log('🔗 Verifica GitHub Pages Settings para activar HTTPS');
        
        // Verificar estado de GitHub Pages
        try {
          const response = await axios.get('https://api.github.com/repos/aigestion/aigestion/pages', {
            headers: {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          
          console.log('📄 Estado GitHub Pages:');
          console.log(`   Status: ${response.data.status}`);
          console.log(`   Custom Domain: ${response.data.cname || 'None'}`);
          console.log(`   HTTPS: ${response.data.https_enforced ? 'Enforced' : 'Not enforced'}`);
        } catch (error) {
          console.log('⚠️ No se pudo verificar GitHub Pages');
        }
        
        break;
      }
      
      console.log('⏳ Esperando 30 segundos...');
      await new Promise(resolve => setTimeout(resolve, 30000));
      
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      console.log('⏳ Esperando 30 segundos...');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  
  console.log('\n🎉 Monitor DNS completado');
}

if (require.main === module) {
  require('dotenv').config();
  monitorDNS().catch(console.error);
}
