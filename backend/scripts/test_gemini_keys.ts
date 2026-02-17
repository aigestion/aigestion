import { GoogleGenerativeAI } from '@google/generative-ai';

async function testKeys() {
  console.log('--- Testing Gemini Keys from both .env files ---');

  // Test Key 1 (from backend/.env)
  const keyBackend = 'AIzaSyBpVnT9h05o96lhDTOAEQtWKZfGJHRrTZ4';
  // Test Key 2 (from root/.env)
  const keyRoot = 'AIzaSyBBlqdK-WjbDLVOn9LnSygzWIiZscUb7yk';

  const testKey = async (key: string, label: string) => {
    console.log(`\nTesting ${label}: ${key.substring(0, 10)}...`);
    const genAI = new GoogleGenerativeAI(key);
    try {
      // Try 2.0 Flash which is mentioned in root .env
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent("Say 'Key OK'");
      console.log(`✅ ${label} Result: ${result.response.text()}`);
      return true;
    } catch (error: any) {
      console.log(`❌ ${label} Failed: ${error.message}`);
      // If 404, maybe the model name is different. Let's try 1.5 Pro.
      if (error.message.includes('404')) {
        try {
          const modelFallback = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
          const resultFallback = await modelFallback.generateContent("Say 'Key OK'");
          console.log(`✅ ${label} (Fallback 1.5-Pro) Result: ${resultFallback.response.text()}`);
          return true;
        } catch (error_: any) {
          console.log(`❌ ${label} Fallback Failed: ${error_.message}`);
        }
      }
      return false;
    }
  };

  const backendOk = await testKey(keyBackend, 'Backend Key');
  const rootOk = await testKey(keyRoot, 'Root Key');

  if (backendOk && !rootOk) console.log('\nVerdict: Use Backend Key.');
  else if (!backendOk && rootOk) console.log('\nVerdict: Use Root Key.');
  else if (backendOk && rootOk) console.log('\nVerdict: Both work.');
  else console.log('\nVerdict: Both are invalid or quota exceeded.');
}

testKeys().catch(console.error);
