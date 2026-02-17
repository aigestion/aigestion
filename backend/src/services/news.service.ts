import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { AIService } from './ai.service';
import { RagService } from './rag.service';
import { SearchService } from './search.service';
import { logger } from '../utils/logger';
import { NewsItem } from '../models/News';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class NewsService {
  private newsItems: NewsItem[] = []; // In-memory for now, can be persisted easily

  constructor(
    @inject(TYPES.AIService) private aiService: AIService,
    @inject(TYPES.RagService) private ragService: RagService,
    @inject(TYPES.SearchService) private searchService: SearchService,
  ) {}

  async ingestNews(urls: string[]): Promise<NewsItem[]> {
    logger.info(`[NewsService] Ingesting news from ${urls.length} URLs`);

    const newItems: NewsItem[] = [];

    for (const url of urls) {
      const id = uuidv4();
      const newsItem: NewsItem = {
        id,
        url,
        title: 'Processing...',
        summary: 'Extracting content and generating summary...',
        source: new URL(url).hostname,
        publishedAt: new Date().toISOString(),
        status: 'processing',
      };

      this.newsItems.push(newsItem);
      newItems.push(newsItem);

      // Async processing to not block
      this.processUrl(id, url).catch(err => {
        logger.error(`[NewsService] Error processing URL ${url}:`, err);
        this.updateNewsItem(id, { status: 'failed', summary: 'Failed to process content' });
      });
    }

    return newItems;
  }

  private async processUrl(id: string, url: string) {
    try {
      // 1. Search/Scrape content (using AI Service capabilities or direct fetch)
      // For now, we'll simulate content extraction using the search capability of AI Service
      const prompt = `Extrae el contenido principal y genera un resumen ejecutivo de esta noticia: ${url}.
      Responde en formato JSON: { "title": "título", "summary": "resumen", "category": "categoría", "tags": ["tag1", "tag2"] }`;

      const responseText = await this.aiService.generateContent(prompt);

      try {
        const data = JSON.parse(responseText.replace(/```json|```/g, '').trim());
        this.updateNewsItem(id, {
          title: data.title || 'Untitled',
          summary: data.summary || 'No summary available',
          category: data.category || 'General',
          tags: data.tags || [],
          status: 'completed',
        });
      } catch (parseError) {
        logger.warn(
          `[NewsService] AI response was not valid JSON, raw text: ${responseText.substring(
            0,
            100,
          )}...`,
        );
        this.updateNewsItem(id, {
          title: 'Processed News',
          summary: responseText.substring(0, 500) + '...',
          status: 'completed',
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async getAllNews(): Promise<NewsItem[]> {
    return this.newsItems;
  }

  async deleteNews(id: string): Promise<boolean> {
    const initialLength = this.newsItems.length;
    this.newsItems = this.newsItems.filter(item => item.id !== id);
    return this.newsItems.length < initialLength;
  }

  async updateNewsItem(id: string, updates: Partial<NewsItem>): Promise<NewsItem | null> {
    const index = this.newsItems.findIndex(item => item.id === id);
    if (index === -1) return null;

    this.newsItems[index] = { ...this.newsItems[index], ...updates };
    return this.newsItems[index];
  }

  /**
   * Search for news across the web (Tavily)
   */
  async searchNews(query: string): Promise<NewsItem[]> {
    logger.info(`[NewsService] Searching for news: ${query}`);
    const results = await this.searchService.search(query);

    const mapped = results.map(r => ({
      id: uuidv4(),
      url: r.url,
      title: r.title,
      summary: r.content,
      source: new URL(r.url).hostname || 'Web',
      publishedAt: new Date().toISOString(),
      status: 'completed' as const,
    }));

    // Add to global list for dashboard visibility
    this.newsItems = [...mapped, ...this.newsItems].slice(0, 50); // Keep last 50

    return mapped;
  }
}
