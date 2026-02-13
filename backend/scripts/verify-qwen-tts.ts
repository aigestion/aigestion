import 'reflect-metadata';
import { QwenTTSService } from '../src/services/qwen-tts.service';
import path from 'path';
import { logger } from '../src/utils/logger';

async function verifyQwenTTS() {
  console.log('🚀 Starting Qwen3 TTS Verification...');

  const service = new QwenTTSService();
  const testText =
    'Hola, esta es una prueba de la integración de Qwen3 TTS en el proyecto AIGestion.';
  const outputPath = path.join(process.cwd(), 'uploads', 'test', 'qwen-test.mp3');

  try {
    console.log('📡 Sending request to DashScope...');
    const resultPath = await service.textToSpeech(testText, outputPath);
    console.log(`✅ Success! Audio saved to: ${resultPath}`);
  } catch (error: any) {
    console.error('❌ Verification failed:');
    console.error(error.message);
    console.log('\n💡 Tip: Ensure DASHSCOPE_API_KEY is correctly set in your .env file.');
  }
}

verifyQwenTTS();
