import 'reflect-metadata';
import { VoiceBiometricsService } from '../services/VoiceBiometricsService';
import { logger } from '../utils/logger';

async function verifyBiometrics() {
  console.log('🎙️ Starting Voice Biometrics Logic Verification...');
  const voiceService = new VoiceBiometricsService();

  try {
    // Simulate two recordings of the same voice mantra
    const audioBuffer1 = Buffer.from('Soberanía AIGestion activa - Attempt 1');
    const audioBuffer2 = Buffer.from('Soberanía AIGestion activa - Attempt 2');
    const audioBuffer1Duplicate = Buffer.from('Soberanía AIGestion activa - Attempt 1');

    console.log('🔍 Generating hashes...');
    const hash1 = await voiceService.generateVoiceHash(audioBuffer1);
    const hash2 = await voiceService.generateVoiceHash(audioBuffer2);
    const hash1Dup = await voiceService.generateVoiceHash(audioBuffer1Duplicate);

    console.log(`✅ Hash 1: ${hash1.substring(0, 16)}...`);
    console.log(`✅ Hash 2: ${hash2.substring(0, 16)}...`);

    // ASSERT: Consistency
    if (hash1 === hash1Dup) {
      console.log('🚀 SUCCESS: Hash consistency verified!');
    } else {
      console.error('❌ FAILURE: Hash inconsistency!');
      process.exit(1);
    }

    // ASSERT: Uniqueness
    if (hash1 !== hash2) {
      console.log('🚀 SUCCESS: Hash uniqueness verified!');
    } else {
      console.error('❌ FAILURE: Hash collision detected!');
      process.exit(1);
    }

    // Verify verification logic
    const isValid = await voiceService.verifyVoiceprint(hash1, audioBuffer1Duplicate);
    if (isValid) {
      console.log('🚀 SUCCESS: Biometric verification logic verified!');
    } else {
      console.error('❌ FAILURE: Biometric verification failed!');
      process.exit(1);
    }

    console.log('💎 ALL BIOMETRIC CHECKS PASSED!');
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR during verification:', error);
    process.exit(1);
  }
}

verifyBiometrics();
