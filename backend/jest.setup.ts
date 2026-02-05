jest.setTimeout(60000);

import { startInMemoryMongo, stopInMemoryMongo } from './src/testDatabase';
import 'ts-node/register';
import 'tsconfig-paths/register';
import { TextEncoder, TextDecoder } from 'util';

// Fix for whatwg-url global issue
global.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;

// Mock whatwg-url to avoid the TypeError
jest.mock('whatwg-url', () => ({
  URL: class MockURL {
    constructor(url: string, base?: string) {
      this.href = url;
      this.origin = base;
      this.protocol = 'https:';
      this.host = 'localhost';
      this.hostname = 'localhost';
      this.port = '';
      this.pathname = '/';
      this.search = '';
      this.hash = '';
    }
    href: string;
    origin: string;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    toString() {
      return this.href;
    }
  },
  URLSearchParams: class MockURLSearchParams {
    constructor(init?: string | Record<string, string> | string[][] | Iterable<[string, string]>) {
      // Simple mock implementation
    }
    append(name: string, value: string) {}
    delete(name: string) {}
    get(name: string) {
      return null;
    }
    has(name: string) {
      return false;
    }
    set(name: string, value: string) {}
    toString() {
      return '';
    }
  },
}));

// Setup and teardown
beforeAll(async () => {
  console.log('🔍 [DEBUG] Pre-loading mongoose...');
  try {
    await startInMemoryMongo();
    console.log('✅ [DEBUG] Mongoose loaded successfully in jest.setup.ts');
  } catch (error) {
    console.log('❌ [DEBUG] Mongoose loading failed:', error);
  }
});

afterAll(async () => {
  await stopInMemoryMongo();
});

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
process.env.SKIP_ENV_VALIDATION = 'true';
process.env.MONGOMS_DOWNLOAD_DIR = './.mongodb-binaries';
