import 'reflect-metadata';
import { SwarmInternalClient } from './services/swarm-internal.client';
import { logger } from './utils/logger';

async function verifyVisionBridge() {
  console.log('--- Phase 57: Vision Bridge Verification (Retry) ---');

  const swarmClient = new SwarmInternalClient();

  console.log('1. Testing /swarm/vision (Visual Analysis) with NO_CACHE...');
  try {
    const result = await swarmClient.post('/swarm/vision', {
      image_uri: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
      instruction: 'What is in this image? NO_CACHE'
    });

    console.log('Vision Result:', JSON.stringify(result, null, 2));
    
    if (result.success && result.analysis && !result.analysis.includes('Error')) {
      console.log('✅ VISION BRIDGE ACTIVE AND FUNCTIONAL');
    } else {
      console.log('❌ VISION BRIDGE ISSUES:', result.analysis || result.error);
    }
  } catch (error: any) {
    console.error('❌ FATAL ERROR:', error.message);
    if (error.response) {
        console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
  }

  process.exit(0);
}

verifyVisionBridge();
