import { BrowserAgentTool } from '../src/tools/browser-agent.tool';
import { logger } from '../src/utils/logger';
import { Container } from 'inversify';
import 'reflect-metadata';

// Simple mock logger if the actual one is complex dependencies
// const logger = { info: console.log, error: console.error, debug: console.log };

async function main() {
  console.log('--- Starting Browserless Verification ---');

  // Verify Environment
  const host = process.env.BROWSERLESS_HOST || 'NOT SET';
  console.log(`Target Host: ${host}`);

  const tool = new BrowserAgentTool();

  // 1. Navigate and Extract
  console.log('\n[Test 1] Navigate and Extract (example.com)');
  const result1 = await tool.executeTask([
    { action: 'navigate', url: 'https://example.com' },
    { action: 'extract' } // Should get title/text
  ]);

  if (result1.success) {
    console.log('✅ Success!');
    console.log('Title/Text Preview:', result1.data.text?.substring(0, 50));
  } else {
    console.error('❌ Failed:', result1.error);
  }

  // 2. Screenshot
  console.log('\n[Test 2] Screenshot (google.com)');
  const result2 = await tool.executeTask([
    { action: 'navigate', url: 'https://www.google.com' },
    { action: 'type', selector: 'textarea[name="q"]', text: 'Browserless Rocks' },
    { action: 'screenshot' }
  ]);

  if (result2.success) {
    console.log('✅ Success!');
    console.log('Screenshot Data:', result2.data.screenshot.substring(0, 30));
  } else {
    console.error('❌ Failed:', result2.error);
  }
}

main().catch(console.error);
