import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../src/types';
import { NewsService } from '../src/services/news.service';
import { SearchService } from '../src/services/search.service';
import { AIService } from '../src/services/ai.service';
import { RagService } from '../src/services/rag.service';
import { logger } from '../src/utils/logger';

// Mock dependencies if needed, or use real ones if configured
async function verifyNews() {
  logger.info('--- Verifying News Search System ---');

  const container = new Container();
  // Use real SearchService to test Tavily connectivity
  container.bind(TYPES.SearchService).to(SearchService);
  container.bind(TYPES.NewsService).to(NewsService);

  // Mocks for AI/RAG to avoid non-finance failures
  container.bind(TYPES.AIService).toConstantValue({} as any);
  container.bind(TYPES.RagService).toConstantValue({} as any);

  const news = container.get<NewsService>(TYPES.NewsService);

  try {
    const query = 'bitcoin price news';
    logger.info(`🔍 Querying: ${query}`);
    const results = await news.searchNews(query);
    logger.info(`✅ Successfully fetched ${results.length} news items.`);

    results.forEach((item, i) => {
      logger.info(`[${i + 1}] ${item.title} (${item.source})`);
      logger.info(`   Summary: ${item.summary.substring(0, 100)}...`);
    });

    if (results.length === 0) {
      logger.warn('⚠️ No results returned. This might be a quota or query issue.');
      // Try checking the key manually via SearchService
      const searchSvc = container.get<SearchService>(TYPES.SearchService);
      logger.info(`API Key present in SearchService: ${!!(searchSvc as any).apiKey}`);
    }
  } catch (error: any) {
    logger.error(`❌ News Search Failed: ${error.message}`);
  }
}

verifyNews().catch(console.error);
