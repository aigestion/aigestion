
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function testGemini() {
    console.log('Testing Gemini API...');
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    console.log('Key length:', key?.length);

    if (!key) {
        console.error('No API Key found');
        return;
    }

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    try {
        const result = await model.generateContent('Hello, are you online?');
        console.log('Response:', result.response.text());
    } catch (error) {
        console.error('Gemini Failed:', error);
    }
}

testGemini();
