import 'reflect-metadata';
import { Container } from 'inversify';
import { RagService } from '../services/rag.service';
import { TYPES } from '../types';
import { SovereignVaultService } from '../services/SovereignVaultService';
import { logger } from '../utils/logger';

async function main() {
  logger.info('[RAG-Index] Starting Sovereign Indexing Pulse...');

  const container = new Container();

  // Bind dependencies (minimal set for RagService)
  container.bind<SovereignVaultService>(TYPES.SovereignVaultService).to(SovereignVaultService);
  container.bind<RagService>(TYPES.RagService).to(RagService);

  const ragService = container.get<RagService>(TYPES.RagService);

  try {
    const files = await ragService.getAllFiles();
    logger.info({ count: files.length }, '[RAG-Index] Codebase scanned. Preparing ingestion.');

    for (const file of files) {
      logger.debug({ path: file.path }, '[RAG-Index] Ingesting segment');
      await ragService.ingestDocument(file.path, file.content, ['auto-index', 'codebase']);
    }

    logger.info('[RAG-Index] Sovereignty established. All segments indexed.');
  } catch (error) {
    logger.error(error, '[RAG-Index] Indexing fault');
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
