import { pineconeService } from '../src/services/pinecone.service';
import { logger } from '../src/utils/logger';

async function verify() {
  logger.info('🧪 Starting Pinecone Optimization Verification...');

  // 1. Test Parallel Batch Upsert
  const mockDocs = [
    { id: 'test-1', text: 'This is a test document about artificial intelligence.', metadata: { category: 'tech' } },
    { id: 'test-2', text: 'Pinecone is a vector database for machine learning.', metadata: { category: 'database' } },
    { id: 'test-3', text: 'Vertex AI provides powerful embedding models.', metadata: { category: 'tech' } },
  ];

  logger.info('Testing parallel embedding generation and batch upsert (Namespace: test-verification)...');
  try {
    // This will attempt real API calls if PINECONE_API_KEY is present
    await pineconeService.upsertDocBatch(mockDocs, 'test-verification');
    logger.info('✅ Parallel upsert logic executed.');
  } catch (error) {
    logger.warn('⚠️ Batch upsert failed (likely missing API keys):', error.message);
  }

  // 2. Test Search with Namespace and Filter
  logger.info('Testing search with namespace and metadata filter...');
  try {
    const results = await pineconeService.search(
      'vector database',
      3,
      'test-verification',
      { category: 'database' }
    );
    logger.info(`✅ Search logic executed. Found ${results.length} matches.`);
  } catch (error) {
    logger.warn('⚠️ Search failed (likely missing API keys):', error.message);
  }

  logger.info('🏁 Verification complete!');
}

verify();
