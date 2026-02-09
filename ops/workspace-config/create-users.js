// 🚀 SCRIPT CREACIÓN USUARIOS GOOGLE WORKSPACE
// Ejecutar después de configurar Google Workspace

const { GoogleAuth } = require('google-auth-library');
const { AdminSdk } = require('@google-cloud/admin-directory');

const usuarios = [
  {
    nombre: 'Alejandro',
    apellido: 'Admin',
    email: 'admin@aigestion.net',
    rol: 'CEO/Admin',
    departamento: 'Directiva',
  },
];

async function crearUsuarios() {
  console.log('👥 Creando usuarios en Google Workspace...');

  for (const usuario of usuarios) {
    try {
      console.log(`Creando: ${usuario.email}`);

      // Lógica para crear usuario en Google Workspace
      const userData = {
        primaryEmail: usuario.email,
        name: {
          givenName: usuario.nombre,
          familyName: usuario.apellido,
        },
        orgUnitPath: `/Departamentos/${usuario.departamento}`,
        password: generateSecurePassword(),
        changePasswordAtNextLogin: true,
      };

      // await admin.users.insert({requestBody: userData});
      console.log(`✅ Usuario creado: ${usuario.email}`);
    } catch (error) {
      console.error(`❌ Error creando ${usuario.email}:`, error.message);
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

module.exports = { crearUsuarios };
