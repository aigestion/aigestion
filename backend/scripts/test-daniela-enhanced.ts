import 'reflect-metadata';
import { container } from '../src/config/inversify.config';
import { DanielaAIService } from '../src/services/daniela-ai.service';
import { TYPES } from '../src/types';
import { logger } from '../src/utils/logger';

async function testDanielaEnhanced() {
  console.log('🚀 Starting Daniela Enhanced E2E Integration Test...\n');

  try {
    const danielaService = container.get<DanielaAIService>(TYPES.DanielaAIService);

    console.log('Step 1: Testing "Browse" Intent Delegation...');
    const message = 'Daniela, puedes navegar a https://aigestion.net y decirme qué ves?';
    
    // This should trigger handleBrowseRequest and call Python /daniela/browse
    const response = await danielaService.processMessage(1337, message, 'TestUser', 'user_123');
    
    console.log('\n🤖 Daniela Response:');
    console.log('-------------------');
    console.log(response);
    console.log('-------------------');

    if (response.includes('🌐') && !response.includes('problema')) {
      console.log('\n✅ E2E INTEGRATION SUCCESS: Swarm delegated browsing correctly.');
    } else {
      console.log('\n⚠️ Integration returned a fallback or error. Check IA Engine logs.');
    }

  } catch (error) {
    console.error('❌ E2E Integration Test failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  testDanielaEnhanced().catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
}
