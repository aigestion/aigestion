// 🔍 SCRIPT VERIFICACIÓN CONFIGURACIÓN WORKSPACE

const dns = require('dns').promises;
const fs = require('fs');

async function verificarConfiguracion() {
  console.log('🔍 VERIFICANDO CONFIGURACIÓN GOOGLE WORKSPACE...\n');

  const dominio = 'aigestion.net';
  const checks = [];

  // Verificar registros MX
  try {
    const mxRecords = await dns.resolveMx(dominio);
    const hasGoogleMX = mxRecords.some(record => record.exchange.includes('google.com'));

    checks.push({
      nombre: 'Registros MX',
      estado: hasGoogleMX ? '✅' : '❌',
      detalle: hasGoogleMX ? 'Apuntan a Google' : 'No apuntan a Google',
    });
  } catch (error) {
    checks.push({
      nombre: 'Registros MX',
      estado: '❌',
      detalle: 'Error: ' + error.message,
    });
  }

  // Verificar archivo de configuración
  const configPath = './workspace-config.json';
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    checks.push({
      nombre: 'Archivo Configuración',
      estado: '✅',
      detalle: `Encontrado para ${config.workspace.empresa}`,
    });
  } else {
    checks.push({
      nombre: 'Archivo Configuración',
      estado: '❌',
      detalle: 'No encontrado',
    });
  }

  // Mostrar resultados
  console.log('📊 RESULTADOS VERIFICACIÓN:');
  checks.forEach(check => {
    console.log(`   ${check.estado} ${check.nombre}: ${check.detalle}`);
  });

  const exitosos = checks.filter(c => c.estado === '✅').length;
  console.log(`\n🎯 Total: ${exitosos}/${checks.length} checks exitosos`);

  if (exitosos === checks.length) {
    console.log('🚀 ¡Configuración lista para continuar!');
  } else {
    console.log('⚠️  Revisa los items fallantes antes de continuar.');
  }
}

if (require.main === module) {
  verificarConfiguracion().catch(console.error);
}

module.exports = { verificarConfiguracion };
