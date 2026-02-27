/**
 * 🛠️ DX INTEGRITY CHECK
 * Verifica que el entorno de desarrollo cumple con los estándares Soberanos.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('\x1b[35m%s\x1b[0m', '🌌 Iniciando Auditoría de Integridad DX - AIGestion Nexus');

const checkFile = (filePath: string, label: string) => {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${label} detectado.`);
    return true;
  }
  console.log(`❌ ERROR: ${label} no encontrado en ${filePath}`);
  return false;
};

const checks = [
  () => checkFile(path.join(process.cwd(), '.env'), 'Variables de Entorno'),
  () => checkFile(path.join(process.cwd(), 'node_modules'), 'Dependencias Instaladas'),
  () => {
    try {
      const pnpmVersion = execSync('pnpm -v').toString().trim();
      console.log(`✅ pnpm detectado (v${pnpmVersion}).`);
      return true;
    } catch {
      console.log('❌ ERROR: pnpm no detectado en el sistema.');
      return false;
    }
  }
];

const results = checks.map(c => c());
const allOk = results.every(r => r === true);

if (allOk) {
  console.log('\n\x1b[32m%s\x1b[0m', '🚀 ESTADO: NIVEL DIOS — El entorno es impecable.');
} else {
  console.log('\n\x1b[31m%s\x1b[0m', '⚠️ ESTADO: FRACTURA — Revisa los errores superiores.');
  process.exit(1);
}
