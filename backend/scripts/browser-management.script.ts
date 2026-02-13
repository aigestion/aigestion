import { BrowserAgentTool } from '../src/tools/browser-agent.tool';
import { logger } from '../src/utils/logger';
import 'reflect-metadata';

async function verifyGodMode() {
  console.log('🚀 --- Starting Browserless God-Mode Verification --- 🚀');

  const tool = new BrowserAgentTool();

  // Test 1: Advanced Extraction (Metadata & OG)
  console.log('\n[Test 1] Advanced Extraction (Example Site)');
  const result1 = await tool.executeTask([
    { action: 'navigate', url: 'https://github.com/browserless/browserless' },
    { action: 'extract' }, // This will trigger the new metadata extraction logic
  ]);

  if (result1.success) {
    console.log('✅ Metadata Success!');
    console.log('Title:', result1.data.metadata?.title);
    console.log('OG Image:', result1.data.metadata?.ogImage);
  } else {
    console.error('❌ Metadata Failed:', result1.error);
  }

  // Test 2: Concurrency Simulation
  console.log('\n[Test 2] Concurrency Simulation (3 parallel tasks)');
  const tasks = [
    tool.executeTask([{ action: 'navigate', url: 'https://google.com' }, { action: 'extract' }]),
    tool.executeTask([{ action: 'navigate', url: 'https://bing.com' }, { action: 'extract' }]),
    tool.executeTask([
      { action: 'navigate', url: 'https://duckduckgo.com' },
      { action: 'extract' },
    ]),
  ];

  const concurrencyResults = await Promise.all(tasks);
  const successCount = concurrencyResults.filter(r => r.success).length;
  console.log(`✅ Concurrency Result: ${successCount}/3 tasks succeeded`);

  // Test 3: Stealth Verification
  console.log('\n[Test 3] Stealth/Navigation Verification');
  const result3 = await tool.executeTask([
    { action: 'navigate', url: 'https://bot.sannysoft.com/' },
    { action: 'screenshot' },
  ]);

  if (result3.success) {
    console.log('✅ Stealth Test Completed. Screenshot size:', result3.data.screenshot?.length);
  } else {
    console.error('❌ Stealth Test Failed:', result3.error);
  }

  console.log('\n🏁 --- Verification Complete --- 🏁');
}

verifyGodMode().catch(error => {
  console.error('Verification failed unexpectedly:', error);
  process.exit(1);
});
