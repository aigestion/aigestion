const dns = require('dns').promises;
const https = require('https');
const fs = require('fs');

// GitHub Pages IPs para verificar
const GITHUB_PAGES_IPS = [
  '185.199.108.153',
  '185.199.109.153', 
  '185.199.110.153',
  '185.199.111.153'
];

const DOMAIN = 'aigestion.net';
const WWW_DOMAIN = 'www.aigestion.net';

console.log('🔍 DNS Propagation Monitor');
console.log('==========================');

async function checkDNSPropagation() {
  const results = {
    timestamp: new Date().toISOString(),
    domain: DOMAIN,
    wwwDomain: WWW_DOMAIN,
    rootDNS: null,
    wwwDNS: null,
    sslStatus: null,
    propagationComplete: false
  };

  try {
    // Verificar DNS del dominio root
    console.log(`\n1. 📡 Verificando DNS para ${DOMAIN}...`);
    const rootRecords = await dns.resolve4(DOMAIN);
    results.rootDNS = rootRecords;
    
    console.log(`   📍 Registros A encontrados: ${rootRecords.join(', ')}`);
    
    // Verificar si apuntan a GitHub Pages
    const rootMatches = rootRecords.every(ip => GITHUB_PAGES_IPS.includes(ip));
    console.log(`   ${rootMatches ? '✅' : '❌'} Apunta a GitHub Pages: ${rootMatches}`);

    // Verificar DNS del dominio www
    console.log(`\n2. 📡 Verificando DNS para ${WWW_DOMAIN}...`);
    const wwwRecords = await dns.resolve4(WWW_DOMAIN);
    results.wwwDNS = wwwRecords;
    
    console.log(`   📍 Registros A encontrados: ${wwwRecords.join(', ')}`);
    
    // Verificar si apuntan a GitHub Pages
    const wwwMatches = wwwRecords.every(ip => GITHUB_PAGES_IPS.includes(ip));
    console.log(`   ${wwwMatches ? '✅' : '❌'} Apunta a GitHub Pages: ${wwwMatches}`);

    // Verificar estado SSL
    console.log(`\n3. 🔒 Verificando certificado SSL...`);
    try {
      const sslCheck = await checkSSLCertificate(DOMAIN);
      results.sslStatus = sslCheck;
      console.log(`   ${sslCheck.valid ? '✅' : '❌'} SSL válido: ${sslCheck.valid}`);
      console.log(`   📅 Expira: ${sslCheck.expiresAt}`);
      console.log(`   🏢 Emisor: ${sslCheck.issuer}`);
    } catch (sslError) {
      results.sslStatus = { valid: false, error: sslError.message };
      console.log(`   ❌ Error SSL: ${sslError.message}`);
    }

    // Determinar si la propagación está completa
    results.propagationComplete = rootMatches && wwwMatches;
    
    console.log(`\n4. 📊 Estado General:`);
    console.log(`   ${results.propagationComplete ? '✅' : '⏳'} Propagación DNS: ${results.propagationComplete ? 'Completa' : 'En progreso'}`);
    console.log(`   ${results.sslStatus?.valid ? '✅' : '⏳'} Certificado SSL: ${results.sslStatus?.valid ? 'Válido' : 'Pendiente'}`);

    // Guardar resultados
    const logFile = `c:\\Users\\Alejandro\\AIGestion\\.windsurf\\dns-propagation-log.json`;
    fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
    console.log(`\n💾 Resultados guardados en: ${logFile}`);

    return results;

  } catch (error) {
    console.error(`❌ Error verificando DNS: ${error.message}`);
    results.error = error.message;
    return results;
  }
}

function checkSSLCertificate(hostname) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: hostname,
      port: 443,
      method: 'GET',
      rejectUnauthorized: false // Para poder leer el certificado incluso si es inválido
    };

    const req = https.request(options, (res) => {
      const cert = res.socket.getPeerCertificate();
      if (Object.keys(cert).length === 0) {
        reject(new Error('No certificate found'));
        return;
      }

      resolve({
        valid: res.socket.authorized,
        subject: cert.subject,
        issuer: cert.issuer,
        expiresAt: new Date(cert.valid_to).toISOString(),
        daysUntilExpiry: Math.floor((new Date(cert.valid_to) - new Date()) / (1000 * 60 * 60 * 24))
      });
    });

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('SSL check timeout'));
    });
    req.end();
  });
}

async function startMonitoring(intervalMinutes = 5) {
  console.log(`🚀 Iniciando monitoreo cada ${intervalMinutes} minutos...`);
  
  while (true) {
    const results = await checkDNSPropagation();
    
    if (results.propagationComplete && results.sslStatus?.valid) {
      console.log('\n🎉 ¡Propagación DNS y SSL completados con éxito!');
      console.log('📋 Resumen final:');
      console.log(`   ✅ DNS Root: ${results.rootDNS?.join(', ')}`);
      console.log(`   ✅ DNS WWW: ${results.wwwDNS?.join(', ')}`);
      console.log(`   ✅ SSL Válido hasta: ${results.sslStatus.expiresAt}`);
      console.log('\n🔗 El dominio está listo para producción.');
      break;
    }
    
    console.log(`\n⏳ Esperando ${intervalMinutes} minutos para próxima verificación...`);
    await new Promise(resolve => setTimeout(resolve, intervalMinutes * 60 * 1000));
  }
}

// Ejecutar monitoreo
if (require.main === module) {
  const args = process.argv.slice(2);
  const interval = args[0] ? parseInt(args[0]) : 5;
  
  if (args.includes('--once')) {
    checkDNSPropagation();
  } else {
    startMonitoring(interval);
  }
}

module.exports = { checkDNSPropagation, checkSSLCertificate, startMonitoring };
