import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function testKey() {
  const key = process.env.GEMINI_API_KEY;
  console.log(`Testing Key: ${key ? key.substring(0, 5) + '...' : 'UNDEFINED'}`);

  if (!key) {
    console.error('❌ API Key missing in .env');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent('Say Hello');
    console.log('✅ Success! Response:', result.response.text());
  } catch (error: any) {
    console.error('Handshake failure:', error.message);
    console.error(error);
  }
}

testKey();
