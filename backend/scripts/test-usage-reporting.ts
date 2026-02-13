// @ts-nocheck
import 'reflect-metadata';
import mongoose from 'mongoose';
import { UsageService } from '../src/services/usage.service';
import { StripeService } from '../src/services/stripe.service';
import { User } from '../src/models/User';
import { UsageRecord } from '../src/models/UsageRecord';
import { logger } from '../src/utils/logger';

// Mock Stripe Service
class MockStripeService extends StripeService {
  async reportUsage(subscriptionItemId: string, quantity: number): Promise<any> {
    logger.info(`[MOCK] Stripe reportUsage called: Item=${subscriptionItemId}, Qty=${quantity}`);
    return { id: 'ure_mock_123', quantity, timestamp: Date.now() };
  }
}

async function runTest() {
  logger.info('🧪 Starting Metered Billing Verification...');

  // 1. Connect to In-Memory DB or Real DB (using Env)
  // For this script, we assume we can connect to the dev DB or just mock the DB calls if we didn't want side effects.
  // But usage pipeline touches DB, so let's try to connect if mongo url is available, else mock user finding.

  // Actually, to be safe and avoid DB noise, let's Mock the User model and UsageRecord model if possible?
  // Mongoose models are hard to mock without a library.
  // We will assume a "Dry Run" mode where we just instantiate the service and test the logic
  // EXCEPT the DB parts. But `trackUsage` calls `record.save()` and `User.findById`.

  // Strategy: We will Stub the `User.findById` and `UsageRecord.prototype.save` if we can,
  // OR we just assume this script runs in a dev env where DB connection is safe.
  // Given the context (Stabilization), let's assume we can connect.
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexus_v1_dashboard';

  try {
    await mongoose.connect(MONGO_URI);
    logger.info('✅ Connected to MongoDB');

    // 2. Setup Mock Dependencies
    const mockStripe = new MockStripeService();
    // Bypass DI container for checking only logic flow
    const usageService = new UsageService(mockStripe);

    // 3. Create a Test User (Ephemeral)
    const testUser = new User({
      name: 'Test Metered User',
      email: `test.metered.${Date.now()}@example.com`,
      password: 'password123',
      stripeSubscriptionItemId: 'si_test_12345', // Critical for metering
      loginAttempts: 0, // Required field
    });
    await testUser.save();
    logger.info(`✅ Created Ephemeral Test User: ${testUser.id}`);

    // 4. Simulate Usage
    logger.info('🚀 Simulating Usage...');
    const prompt = 'Explain the theory of relativity'; // ~6 tokens
    const completion = 'E = mc^2'; // ~4 tokens

    await usageService.trackUsage({
      userId: testUser.id,
      provider: 'openai', // mock
      modelId: 'gpt-4',
      prompt,
      completion,
    });

    // 5. Verify Database Record
    const record = await UsageRecord.findOne({ userId: testUser.id }).sort({ createdAt: -1 });
    if (record) {
      logger.info(
        `✅ UsageRecord Found: ${record.totalTokens} tokens. Cost: $${record.costEstimate}`
      );
      if (record.totalTokens > 0) console.log('PASS: Tokens tracked.');
      else console.error('FAIL: Tokens were 0.');
    } else {
      console.error('FAIL: UsageRecord not saved.');
    }

    // 6. Verify Stripe Call (Log observation required for this simple script, or use spy)
    // The MockStripeService logs [MOCK] Stripe ...

    // Cleanup
    await User.findByIdAndDelete(testUser.id);
    if (record) await UsageRecord.findByIdAndDelete(record.id);
    logger.info('🧹 Cleanup Complete');
  } catch (error) {
    logger.error('❌ Test Failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

runTest();
