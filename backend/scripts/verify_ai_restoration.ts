import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../src/types';
import { Gemini2Service } from '../src/services/gemini-2.service';
import { logger } from '../src/utils/logger';
import * as dotenv from 'dotenv';
import * as path from 'path';

async function verifyAI() {
  // Load the backend .env and FORCE override
  const envPath = path.join(__dirname, '../.env');
  const envConfig = dotenv.parse(require('fs').readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }

  const key = process.env.GEMINI_API_KEY;
  console.log(
    `\nDEBUG: Loaded GEMINI_API_KEY (first 10): ${key ? key.substring(0, 10) + '...' : 'MISSING'}`,
  );
  console.log(`DEBUG: Loaded GEMINI_2_MODEL: ${process.env.GEMINI_2_MODEL}`);

  logger.info('--- Verifying Gemini-2 Service with Sync Keys ---');

  const container = new Container();
  container.bind(Gemini2Service).toSelf();

  const gemini = container.get(Gemini2Service);
  await gemini.initialize();

  try {
    const response = await gemini.generateText(
      'Analyze the current status of AIGestion. Be concise.',
    );
    logger.info('✅ AI Response Status: SUCCESS');
    console.log('\nResponse:', response);
  } catch (error: any) {
    console.error('\n❌ AI Verification Failed Details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      errorDetails: error.errorDetails,
    });
  }
}

verifyAI().catch(console.error);
