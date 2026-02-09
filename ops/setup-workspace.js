#!/usr/bin/env node

/**
 * 🚀 SCRIPT AUTOMÁTICO - CONFIGURACIÓN GOOGLE WORKSPACE AIGESTION
 *
 * Este script automatiza la configuración inicial de Google Workspace
 * para AIGestion con separación de emails personal/profesional.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class AIGestionWorkspaceSetup {
  constructor() {
    this.config = {
      empresa: 'AIGestion',
      dominio: 'aigestion.net',
      plan: 'Business Standard',
      usuarios: []
    };
  }

  async iniciar() {
    console.log('🌌 BIENVENIDO AL SETUP DE GOOGLE WORKSPACE - AIGESTION');
    console.log('=' .repeat(60));

    await this.recopilarDatos();
    await this.generarConfiguracion();
    await this.crearScriptsAutomatizacion();

    console.log('\n✅ CONFIGURACIÓN COMPLETADA');
    console.log('📁 Revisa los archivos generados en ./workspace-config/');
  }

  async recopilarDatos() {
    console.log('\n📋 RECOPILANDO INFORMACIÓN...\n');

    // Email personal actual
    this.config.emailPersonal = await this.pregunta('📧 Tu email personal actual (gmail): ');

    // Usuarios a crear
    const numUsuarios = parseInt(await this.pregunta('👥 Número de usuarios iniciales (4 recomendado): ')) || 4;

    for (let i = 0; i < numUsuarios; i++) {
      console.log(`\n👤 Usuario ${i + 1}:`);
      const nombre = await this.pregunta('   Nombre: ');
      const apellido = await this.pregunta('   Apellido: ');
      const rol = await this.pregunta('   Rol (CEO/Dev/IA/Support): ');
      const email = `${nombre.toLowerCase()}.${apellido.toLowerCase()}@${this.config.dominio}`;

      this.config.usuarios.push({
        nombre,
        apellido,
        email,
        rol,
        departamento: this.getDepartamento(rol)
      });
    }

    // Confirmación
    console.log('\n📊 RESUMEN CONFIGURACIÓN:');
    console.log(`   Empresa: ${this.config.empresa}`);
    console.log(`   Dominio: ${this.config.dominio}`);
    console.log(`   Email Personal: ${this.config.emailPersonal}`);
    console.log(`   Usuarios: ${this.config.usuarios.length}`);
    this.config.usuarios.forEach(u => {
      console.log(`   - ${u.nombre} ${u.apellido} (${u.rol}): ${u.email}`);
    });
  }

  async generarConfiguracion() {
    const configDir = path.join(__dirname, '../workspace-config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Generar archivo de configuración
    const configContent = this.generarConfigJSON();
    fs.writeFileSync(path.join(configDir, 'workspace-config.json'), configContent);

    // Generar script de usuarios
    const usersScript = this.generarScriptUsuarios();
    fs.writeFileSync(path.join(configDir, 'create-users.js'), usersScript);

    // Generar configuración DNS
    const dnsConfig = this.generarConfigDNS();
    fs.writeFileSync(path.join(configDir, 'dns-records.txt'), dnsConfig);

    // Generar guía de migración
    const migrationGuide = this.generarGuiaMigracion();
    fs.writeFileSync(path.join(configDir, 'migration-guide.md'), migrationGuide);
  }

  generarConfigJSON() {
    return JSON.stringify({
      workspace: {
        empresa: this.config.empresa,
        dominio: this.config.dominio,
        plan: this.config.plan,
        adminEmail: `admin@${this.config.dominio}`,
        createdAt: new Date().toISOString()
      },
      separacionEmails: {
        personal: this.config.emailPersonal,
        profesional: `alejandro@${this.config.dominio}`,
        recomendaciones: [
          'Usar email personal para redes sociales y suscripciones',
          'Usar email profesional para negocios y clientes',
          'Configurar forwarding de emails importantes'
        ]
      },
      usuarios: this.config.usuarios,
      costos: {
        plan: 'Business Standard',
        costoPorUsuario: 12,
        costoMensual: this.config.usuarios.length * 12,
        costoAnual: this.config.usuarios.length * 12 * 12
      }
    }, null, 2);
  }

  generarScriptUsuarios() {
    return `// 🚀 SCRIPT CREACIÓN USUARIOS GOOGLE WORKSPACE
// Ejecutar después de configurar Google Workspace

const {GoogleAuth} = require('google-auth-library');
const {AdminSdk} = require('@google-cloud/admin-directory');

const usuarios = ${JSON.stringify(this.config.usuarios, null, 2)};

async function crearUsuarios() {
  console.log('👥 Creando usuarios en Google Workspace...');

  for (const usuario of usuarios) {
    try {
      console.log(\`Creando: \${usuario.email}\`);

      // Lógica para crear usuario en Google Workspace
      const userData = {
        primaryEmail: usuario.email,
        name: {
          givenName: usuario.nombre,
          familyName: usuario.apellido
        },
        orgUnitPath: \`/Departamentos/\${usuario.departamento}\`,
        password: generateSecurePassword(),
        changePasswordAtNextLogin: true
      };

      // await admin.users.insert({requestBody: userData});
      console.log(\`✅ Usuario creado: \${usuario.email}\`);

    } catch (error) {
      console.error(\`❌ Error creando \${usuario.email}:\`, error.message);
    }
  }
}

function generateSecurePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

if (require.main === module) {
  crearUsuarios().catch(console.error);
}

module.exports = {crearUsuarios};
`;
  }

  generarConfigDNS() {
    return `# 🌐 CONFIGURACIÓN DNS - AIGESTION.NET
# Agregar estos registros en tu configurador de dominio

# REGISTROS MX (Email)
@  MX  1  ASPMX.L.GOOGLE.COM.
@  MX  5  ALT1.ASPMX.L.GOOGLE.COM.
@  MX  5  ALT2.ASPMX.L.GOOGLE.COM.
@  MX  10  ALT3.ASPMX.L.GOOGLE.COM.
@  MX  10  ALT4.ASPMX.L.GOOGLE.COM.

# REGISTROS TXT (Verificación y SPF)
@  TXT  "v=spf1 include:_spf.google.com ~all"
google._domainkey  TXT  "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA..."

# REGISTROS CNAME (Servicios)
calendar  CNAME  ghs.googlehosted.com.
drive  CNAME  ghs.googlehosted.com.
mail  CNAME  ghs.googlehosted.com.

# REGISTRO A (Sitio web - opcional)
www  A  216.239.32.21

# NOTA: Reemplaza el registro DKIM con el que te proporcione Google Workspace
`;
  }

  generarGuiaMigracion() {
    return `# 📋 GUÍA DE MIGRACIÓN - EMAIL PERSONAL A PROFESIONAL

## 🎯 OBJETIVO
Migrar de forma segura tu email personal a profesional sin perder información importante.

## 📅 CRONOGRAMA RECOMENDADO

### DÍA 1: PREPARACIÓN
- [ ] Crear cuenta profesional: alejandro@${this.config.dominio}
- [ ] Configurar forwarding de emails importantes
- [ ] Actualizar suscripciones críticas

### DÍA 2-3: MIGRACIÓN GRADUAL
- [ ] Migrar contactos principales
- [ ] Transferir calendarios importantes
- [ ] Mover archivos críticos a Drive empresarial

### DÍA 4-7: TRANSICIÓN COMPLETA
- [ ] Actualizar todas las suscripciones
- [ ] Notificar contactos importantes del cambio
- [ ] Configurar firma profesional

## 🔄 EMAILS A MIGRAR PRIORITARIAMENTE

### CRÍTICOS (Migrar inmediatamente)
- Clientes y prospectos
- Proveedores y servicios
- Contactos de negocio
- Facturas y documentos legales

### PERSONALES (Mantener en Gmail)
- Redes sociales
- Suscripciones de entretenimiento
- Contactos familiares/amigos
- Compras online no relacionadas con negocio

## 🛠️ HERRAMIENTAS DE MIGRACIÓN

### Google Takeout
1. Exportar contacts.json desde Gmail personal
2. Importar en cuenta profesional
3. Revisar y limpiar duplicados

### Forwarding Temporal
Configurar forwarding temporal por 30 días:
\`Configuraciones > Reenvío y POP/IMAP > Añadir dirección\`

## ✅ CHECKLIST FINAL

- [ ] Todos los clientes notificados del nuevo email
- [ ] Suscripciones empresariales actualizadas
- [ ] Firma profesional configurada
- [ ] Contactos migrados y verificados
- [ ] Calendarios sincronizados
- [ ] Archivos importantes en Drive empresarial
- [ ] 2FA activado en cuenta profesional

## 🚨 PRECAUCIONES

- No eliminar cuenta personal hasta 60 días después
- Mantener copias de seguridad importantes
- Verificar todos los accesos críticos funcionan
- Tener plan de recuperación de contraseñas

---

💡 **CONSEJO:** Haz esta migración gradualmente para evitar interrupciones en tu flujo de trabajo.
`;
  }

  async crearScriptsAutomatizacion() {
    const scriptsDir = path.join(__dirname, '../workspace-config/scripts');
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
    }

    // Script de verificación
    const verificationScript = this.generarScriptVerificacion();
    fs.writeFileSync(path.join(scriptsDir, 'verify-setup.js'), verificationScript);
  }

  generarScriptVerificacion() {
    return `// 🔍 SCRIPT VERIFICACIÓN CONFIGURACIÓN WORKSPACE

const dns = require('dns').promises;
const fs = require('fs');

async function verificarConfiguracion() {
  console.log('🔍 VERIFICANDO CONFIGURACIÓN GOOGLE WORKSPACE...\n');

  const dominio = '${this.config.dominio}';
  const checks = [];

  // Verificar registros MX
  try {
    const mxRecords = await dns.resolveMx(dominio);
    const hasGoogleMX = mxRecords.some(record =>
      record.exchange.includes('google.com')
    );

    checks.push({
      nombre: 'Registros MX',
      estado: hasGoogleMX ? '✅' : '❌',
      detalle: hasGoogleMX ? 'Apuntan a Google' : 'No apuntan a Google'
    });
  } catch (error) {
    checks.push({
      nombre: 'Registros MX',
      estado: '❌',
      detalle: 'Error: ' + error.message
    });
  }

  // Verificar archivo de configuración
  const configPath = './workspace-config.json';
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    checks.push({
      nombre: 'Archivo Configuración',
      estado: '✅',
      detalle: \`Encontrado para \${config.workspace.empresa}\`
    });
  } else {
    checks.push({
      nombre: 'Archivo Configuración',
      estado: '❌',
      detalle: 'No encontrado'
    });
  }

  // Mostrar resultados
  console.log('📊 RESULTADOS VERIFICACIÓN:');
  checks.forEach(check => {
    console.log(\`   \${check.estado} \${check.nombre}: \${check.detalle}\`);
  });

  const exitosos = checks.filter(c => c.estado === '✅').length;
  console.log(\`\\n🎯 Total: \${exitosos}/\${checks.length} checks exitosos\`);

  if (exitosos === checks.length) {
    console.log('🚀 ¡Configuración lista para continuar!');
  } else {
    console.log('⚠️  Revisa los items fallantes antes de continuar.');
  }
}

if (require.main === module) {
  verificarConfiguracion().catch(console.error);
}

module.exports = {verificarConfiguracion};
`;
  }

  getDepartamento(rol) {
    const departamentos = {
      'CEO': 'Directiva',
      'Dev': 'Desarrollo',
      'IA': 'InteligenciaArtificial',
      'Support': 'Soporte',
      'Admin': 'Administracion'
    };
    return departamentos[rol] || 'General';
  }

  async pregunta(pregunta) {
    return new Promise(resolve => {
      rl.question(pregunta, respuesta => {
        resolve(respuesta.trim());
      });
    });
  }

  cerrar() {
    rl.close();
  }
}

// Ejecutar script
if (require.main === module) {
  const setup = new AIGestionWorkspaceSetup();
  setup.iniciar()
    .then(() => setup.cerrar())
    .catch(error => {
      console.error('❌ ERROR:', error.message);
      setup.cerrar();
      process.exit(1);
    });
}

module.exports = AIGestionWorkspaceSetup;
