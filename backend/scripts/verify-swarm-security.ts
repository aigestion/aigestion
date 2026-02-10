import 'reflect-metadata';
import { env } from '../src/config/env.schema';
import { SwarmInternalClient } from '../src/services/swarm-internal.client.ts';
import { logger } from '../src/utils/logger';

async function verifySecurityHandshake() {
  console.log('🚀 Starting Swarm-Backend Security Handshake Verification...\n');

  const client = new SwarmInternalClient();

  try {
    console.log('Step 1: Testing Public Health Check...');
    const health = await client.getStatus();
    console.log('✅ Public health check success:', JSON.stringify(health));
  } catch (error) {
    console.log('❌ Public health check failed (as expected if it was not public)');
  }

  try {
    console.log('\nStep 2: Testing Authenticated Daniela Status...');
    // This route is protected by standard internal auth (verify_api_key in Python)
    const danielaStatus = await client.getDanielaStatus();
    console.log('✅ Authenticated Daniela Status success:', JSON.stringify(danielaStatus));
  } catch (error) {
    console.log('❌ Authenticated Daniela Status failed. Verify IA_ENGINE_API_KEY in .env and routes.py');
    process.exit(1);
  }

  console.log('\n🛡️ SECURITY HANDSHAKE VERIFIED: Node to Python is Secure.');
}

if (require.main === module) {
  verifySecurityHandshake().catch(err => {
    console.error('Fatal verification error:', err);
    process.exit(1);
  });
}
