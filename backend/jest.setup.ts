jest.setTimeout(60000);


import { startInMemoryMongo, stopInMemoryMongo } from './src/testDatabase';
import 'ts-node/register';
import 'tsconfig-paths/register';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

process.env.JWT_SECRET = 'test-jwt-secret';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db'; // Dummy value for schema validation
process.env.SKIP_ENV_VALIDATION = 'true';
process.env.MONGOMS_DOWNLOAD_DIR = './.mongodb-binaries';

import './src/__tests__/setup';

beforeAll(async () => {
  // await startInMemoryMongo();
});

afterAll(async () => {
  // await stopInMemoryMongo();
});
