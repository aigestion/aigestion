import 'reflect-metadata';
import { container } from './config/inversify.config';
import { TYPES } from './types';
import { AIService } from './services/ai.service';
import { logger } from './utils/logger';

async function checkWiring() {
  logger.info('🔍 Checking AIService dependency injection wiring...');
  try {
    const aiService = container.get<AIService>(TYPES.AIService);
    logger.info('✅ AIService instantiated successfully.');
    
    // Check internal dependencies if they are accessible (they are private, but we can check if the factory works)
    const factory = container.get(TYPES.AIProviderFactory);
    logger.info('✅ AIProviderFactory instantiated successfully.');
    
    const executor = container.get(TYPES.AIToolExecutor);
    logger.info('✅ AIToolExecutor instantiated successfully.');

    logger.info('🚀 Wiring check complete. DI is stable.');
    process.exit(0);
  } catch (error) {
    logger.error('❌ DI Wiring Failed:', error);
    process.exit(1);
  }
}

checkWiring();
