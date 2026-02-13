import 'reflect-metadata';
import { container, TYPES } from '../config/inversify.config';
import { CredentialManagerService } from '../services/credential-manager.service';
import { logger } from '../utils/logger';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from workspace root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function runCheck() {
  console.log('Starting Credential Check...');
  try {
    const credManager = container.get<CredentialManagerService>(TYPES.CredentialManagerService);
    const results = await credManager.verifyAll();

    console.log('\n--- Credential Verification Results ---');
    results.forEach(result => {
      const icon = result.status === 'valid' ? '✅' : '❌';
      console.log(`${icon} ${result.provider}: ${result.status}`);
      if (result.message) {
        console.log(`   Message: ${result.message}`);
      }
    });
    console.log('---------------------------------------\n');
  } catch (error) {
    console.error('Error running credential check:', error);
  }
}

runCheck();
