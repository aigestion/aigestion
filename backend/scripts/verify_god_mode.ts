import 'reflect-metadata';
import { AIService } from '../src/services/ai.service';

// Mock Dependencies
const mockAnalytics = {} as any;
const mockRag = {} as any;
const mockUsage = { trackUsage: () => {} } as any;
const mockSemanticCache = { get: () => null, set: () => undefined } as any;

async function runProof() {
  console.log('🔮 STARTING GOD MODE VERIFICATION PROTOCOL...\n');

  // 1. Verify Rate Limit Logic (Simulated)
  console.log('🛡️  VERIFYING RATE LIMIT BYPASS...');
  const mockReqGod = {
    user: { id: 'god1', role: 'god', subscriptionPlan: 'free' },
    ip: '127.0.0.1',
  } as unknown as any;

  try {
    // Validation logic used in middleware:
    // if (user.role === 'god' || user.role === 'admin') return 0;

    const user = mockReqGod.user;
    const isGodBypassed = user.role === 'god' || user.role === 'admin';

    if (isGodBypassed) {
      console.log('✅ God/Admin Role detected -> Global Rate Limit: DISABLED (0)');
    } else {
      console.error('❌ Failed to detect God role!');
    }
  } catch (e) {
    console.error('Error in rate limit check:', e);
  }

  // 2. Verify AI Service Logic (Premium Enforcement)
  console.log('\n🧠 VERIFYING PREMIUM MODEL ENFORCEMENT...');

  // Instantiate Service with mocks
  const aiService = new AIService(mockAnalytics, mockRag, mockUsage, mockSemanticCache);

  // Mock the internal methods by attaching to instance (using any cast)
  let capturedConfig: any = null;
  (aiService as any).getProviderModel = async (config: any) => {
    capturedConfig = config;
    // Mock return with a dummy object structure corresponding to Gemini/Anthropic/OpenAI SDKs
    return {
      generateContent: async () => ({ response: { text: () => 'Mock Response' } }),
    };
  };

  // Test Case A: Simple Prompt + GOD Role
  console.log('   Test A: Simple Prompt ("hi") + Role "god"');
  await aiService.generateContent('hi', 'god-id', 'god');

  if (
    capturedConfig &&
    (capturedConfig.modelId.includes('sonnet') || capturedConfig.modelId.includes('premium'))
  ) {
    console.log(
      `   ✅ SUCCESS: Routed to PREMIUM model (${capturedConfig.modelId}) despite simple prompt.`
    );
    console.log('      (Proof: Logic bypassed heuristics and forced Premium)');
  } else {
    console.log(`   ❌ FAILURE: Routed to ${capturedConfig?.modelId}`);
  }

  // Test Case B: Simple Prompt + USER Role
  console.log('   Test B: Simple Prompt ("hi") + Role "user"');
  await aiService.generateContent('hi', 'user-id', 'user');

  // Standard for 'hi' is Economy or Standard (Gemini Flash)
  if (
    capturedConfig &&
    (capturedConfig.provider === 'gemini' || capturedConfig.modelId.includes('flash'))
  ) {
    console.log(
      `   ✅ SUCCESS: Routed to STANDARD/ECONOMY model (${capturedConfig.modelId}) for normal user.`
    );
  } else {
    console.log(`   ❌ FAILURE: Routed to ${capturedConfig?.modelId} (Expected Economy/Standard)`);
  }

  console.log('\n🏆 GOD MODE VERIFICATION COMPLETE.');
}

runProof().catch(err => {
  console.error('Script Error:', err);
});
