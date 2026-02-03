jest.setTimeout(60000);


import { startInMemoryMongo, stopInMemoryMongo } from './src/testDatabase';
import 'ts-node/register';
import 'tsconfig-paths/register';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;

console.log('🔍 [DEBUG] global.URL:', typeof global.URL);
console.log('🔍 [DEBUG] global.URL.prototype:', global.URL ? typeof global.URL.prototype : 'N/A');
if (global.URL && global.URL.prototype) {
  try {
    console.log(
      '🔍 [DEBUG] getPrototypeOf(URL.prototype):',
      typeof Object.getPrototypeOf(global.URL.prototype),
    );
  } catch (e) {
    console.log('🔍 [DEBUG] getPrototypeOf(URL.prototype) FAILED:', (e as Error).message);
  }
}

try {
  const asyncGen = async function* () {};
  const proto1 = Object.getPrototypeOf(asyncGen);
  console.log('🔍 [DEBUG] getPrototypeOf(async function*):', typeof proto1);
  if (proto1) {
    console.log('🔍 [DEBUG] proto1.prototype:', typeof proto1.prototype);
    if (proto1.prototype) {
      console.log(
        '🔍 [DEBUG] getPrototypeOf(proto1.prototype):',
        typeof Object.getPrototypeOf(proto1.prototype),
      );
    }
  }
} catch (e) {
  console.log('🔍 [DEBUG] AsyncGen prototype check FAILED:', (e as Error).message);
}

process.env.JWT_SECRET = 'test-jwt-secret';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db'; // Dummy value for schema validation
process.env.SKIP_ENV_VALIDATION = 'true';
process.env.MONGOMS_DOWNLOAD_DIR = './.mongodb-binaries';

console.log('🔍 [DEBUG] Pre-loading mongoose...');
try {
  require('mongoose');
  console.log('✅ [DEBUG] Mongoose loaded successfully in jest.setup.ts');
} catch (e) {
  console.log('❌ [DEBUG] Mongoose load FAILED in jest.setup.ts:', (e as Error).message);
  console.log('❌ [DEBUG] Stack:', (e as Error).stack);
}

import './src/__tests__/setup';

beforeAll(async () => {
  // await startInMemoryMongo();
});

afterAll(async () => {
  // await stopInMemoryMongo();
});
