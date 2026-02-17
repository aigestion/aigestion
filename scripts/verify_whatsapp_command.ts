import 'reflect-metadata';
import { container, TYPES } from '../backend/src/config/inversify.config';
import { WhatsAppCommandService } from '../backend/src/services/whatsapp-command.service';
import { logger } from '../backend/src/utils/logger';

async function verifyWhatsApp() {
  logger.info('🚀 Starting WhatsApp Command Hub Verification...');

  try {
    const commandHub = container.get<WhatsAppCommandService>(TYPES.WhatsAppCommandService);

    // 1. Test Status Command
    logger.info('--- Testing: "Status" Command ---');
    await commandHub.handleIncoming('34600000000', 'status');

    // 2. Test AI Query
    logger.info('--- Testing: General Swarm Mission ---');
    await commandHub.handleIncoming('34600000000', '¿Cuál es el estado de la infraestructura en España?');

    logger.info('✅ WhatsApp Command Hub Verification Complete.');
  } catch (error: any) {
    logger.error(`❌ Verification Failed: ${error.message}`);
    process.exit(1);
  }
}

verifyWhatsApp();
