// ============================================
// CRITICAL: Set NODE_ENV before ANY imports
// ============================================
process.env.NODE_ENV = 'test';
jest.setTimeout(120000);

// ============================================
// SECURITY: Override DB URIs to NEVER use production
// ============================================
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/aigestion-test-jest';
process.env.DATABASE_URL = 'mongodb://127.0.0.1:27017/aigestion-test-jest';

// ============================================
// Auth env vars (required by jsonwebtoken.sign)
// ============================================
process.env.JWT_SECRET = 'test-jwt-secret-at-least-32-chars-long-for-security-check';
process.env.JWT_EXPIRES_IN = '7d';
process.env.JWT_COOKIE_EXPIRES_IN = '7';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret-test-refresh-secret';

// ============================================
// Service mocks
// ============================================
process.env.SUPABASE_URL = 'https://mock-project.supabase.co';
process.env.SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vY2siLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.mock-signature';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.ENABLE_REDIS = 'false'; // Use mock Redis in tests
process.env.SKIP_ENV_VALIDATION = 'true';
process.env.MONGOMS_DOWNLOAD_DIR = './.mongodb-binaries';

// ============================================
// Global module mocks (prevent external service init)
// ============================================
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
    rpc: jest.fn().mockResolvedValue({ data: [], error: null }),
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ data: { path: 'mock' }, error: null }),
        download: jest.fn().mockResolvedValue({ data: null, error: null }),
      })),
    },
  })),
}));


import { startInMemoryMongo, stopInMemoryMongo } from './src/testDatabase';
import mongoose from 'mongoose';

import { TextEncoder, TextDecoder } from 'util';

// Fix for whatwg-url global issue
global.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;



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
  try {
    await stopInMemoryMongo();
  } catch (e) {
    // Ignore — some test suites mock mongoose
  }
  try {
    if (mongoose.connection && typeof mongoose.connection.close === 'function') {
      await mongoose.connection.close();
    }
  } catch (e) {
    // Ignore — connection may already be closed or mocked
  }
});

// Environment variables set at the top
