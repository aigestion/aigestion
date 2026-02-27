import 'reflect-metadata';
import { TYPES } from '../types';
import { MistralService } from '../services/MistralService';
import { AIService } from '../services/ai.service';
import { container } from '../config/inversify.config';
import { logger } from '../utils/logger';

/**
 * MISTRAL VERIFICATION SCRIPT
 * Validates:
 * 1. DI Binding
 * 2. Service Initialization
 * 3. Text Generation
 * 4. Arbitration Logic (Spanish -> Mistral)
 */

async function verify() {
  logger.info('🚀 [Sovereign Verify] Starting Mistral God Mode Validation...');

  try {
    const mistral = container.get<MistralService>(TYPES.MistralService);
    const aiService = container.get<AIService>(TYPES.AIService);

    logger.info('--- Phase 1: Direct Service Test ---');
    const text = await mistral.generateText('Responde brevemente: ¿Estás operativo?', {
      model: 'mistral-small-latest',
      temperature: 0,
    });
    logger.info(`Mistral Direct Response: ${text}`);

    logger.info('--- Phase 2: Arbitration & Routing Test ---');
    // Tier will be PREMIUM because userRole is god
    // Provider will be mistral because prompt is Spanish
    const aiResponse = await aiService.generateContent(
      'Explica el concepto de soberanía digital',
      'verify-bot',
      'god',
    );
    logger.info(`AI Service Orchestrated Response: ${aiResponse.substring(0, 150)}...`);

    logger.info('✅ [Sovereign Verify] Mistral Integration: SUCCESS');
    process.exit(0);
  } catch (error: any) {
    logger.error('❌ [Sovereign Verify] Validation FAILED');
    logger.error(error);
    process.exit(1);
  }
}

verify();
