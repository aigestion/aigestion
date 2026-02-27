import { container } from './config/inversify.config';
import { TYPES } from './types';
import { AIService } from './services/ai.service';
import { logger } from './utils/logger';

async function verifyRefactor() {
  logger.info('🚀 Starting AIService Refactor Verification...');

  const aiService = container.get<AIService>(TYPES.AIService);

  try {
    logger.info('--- Testing generateContent (Premium Tier) ---');
    const response = await aiService.generateContent(
      'Say hello in a very sovereign and technological way.',
      'test-user',
      'god',
    );
    logger.info(`Response: ${response}`);

    logger.info('--- Testing getEmbeddings ---');
    const embeddings = await aiService.getEmbeddings('Nexus Sovereign Intelligence');
    logger.info(`Embeddings length: ${embeddings.length}`);

    logger.info('--- Testing streamChat (Simulated) ---');
    const stream = await aiService.streamChat({
      prompt: 'Summarize the state of the Nexus ecosystem.',
      userId: 'test-user',
      userRole: 'god',
    });

    stream.on('data', chunk => {
      process.stdout.write(chunk.toString());
    });

    stream.on('end', () => {
      logger.info('\n✅ Verification Complete.');
      process.exit(0);
    });
  } catch (error) {
    logger.error('❌ Verification Failed:', error);
    process.exit(1);
  }
}

verifyRefactor();
