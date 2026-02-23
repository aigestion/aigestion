import { injectable } from 'inversify';
import { logger } from '../utils/logger';
import * as https from 'node:https'; // Use * as https for better compatibility

// --- Inlined Notion Utility (Optimized) ---
const apiKey = process.env.NOTION_API_KEY;
const NOTION_VERSION = '2022-06-28';

function notionRequest(
  endpoint: string,
  method: string,
  body: Record<string, unknown> | null = null,
): Promise<NotionResponse> {
  if (!apiKey) {
    // Return a mock/empty promise if no key, to prevent crash but log warning
    logger.warn('NOTION_API_KEY is missing. Notion operations will vary.');
    return Promise.resolve({ results: [] });
  }

  return new Promise<NotionResponse>(resolve => {
    const options = {
      hostname: 'api.notion.com',
      path: '/v1' + endpoint,
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res: any) => {
      let data = '';
      res.on('data', (chunk: any) => (data += chunk));
      res.on('end', () => {
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch {
          parsedData = data;
        }

        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(parsedData);
        } else {
          // Safe error handling
          const errorMsg = parsedData?.message || data || 'Unknown Notion API Error';
          // Don't reject, just return empty to keep service alive
          logger.error(`Notion API Error [${res.statusCode || '??'}]: ${errorMsg}`);
          resolve({ results: [] });
        }
      });
    });

    req.on('error', (err: Error) => {
      logger.error(`Notion Request Failed: ${err.message}`);
      resolve({ results: [] });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}
// ------------------------------------------

export interface NotionPage {
  id: string;
  properties: Record<string, any>;
}

export interface NotionBlock {
  object: 'block';
  type: string;
  [key: string]: any;
}

export interface NotionResponse {
  results: any[];
  [key: string]: any;
}

@injectable()
export class NotionManagerService {
  private readonly tasksDbId: string;
  private readonly contentDbId: string;
  private readonly clientsDbId: string;

  constructor() {
    this.tasksDbId = process.env.NOTION_TASKS_DB_ID || '';
    this.contentDbId = process.env.NOTION_CONTENT_DB_ID || '';
    this.clientsDbId = process.env.NOTION_CLIENTS_DB_ID || '';
  }

  /**
   * High-level method to create a task in the AIGestion Task DB
   */
  async createTask(name: string, status: string = 'To Do', priority: string = 'Medium') {
    if (!this.tasksDbId) throw new Error('NOTION_TASKS_DB_ID not configured');

    logger.info(`[NotionManager] Creating task: ${name}`);
    return notionRequest('/pages', 'POST', {
      parent: { database_id: this.tasksDbId },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Status: { select: { name: status } },
        Priority: { select: { name: priority } },
      },
    });
  }

  /**
   * High-level method to query any of the AIGestion databases
   */
  async queryDatabase(databaseId: string, filter?: any) {
    logger.debug(`[NotionManager] Querying database: ${databaseId}`);
    return notionRequest(`/databases/${databaseId}/query`, 'POST', filter ? { filter } : {});
  }

  /**
   * Specialized method to get project metrics from Notion
   */
  async getAIGestionMetrics() {
    // Example: Count tasks by status, count content pieces, etc.
    try {
      const tasks = await this.queryDatabase(this.tasksDbId);
      const content = await this.queryDatabase(this.contentDbId);

      return {
        totalTasks: tasks.results.length,
        totalContent: content.results.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`[NotionManager] Failed to fetch metrics: ${msg}`);
      throw error;
    }
  }

  /**
   * Syncs a swarm session plan/summary to the Notion Content DB
   */
  async syncSwarmPlan(title: string, content: string, category: string = 'AI Swarm Plan') {
    if (!this.contentDbId) {
      logger.warn('[NotionManager] NOTION_CONTENT_DB_ID not configured, skipping sync');
      return;
    }

    logger.info(`[NotionManager] Syncing swarm plan to Notion: ${title}`);
    try {
      return await notionRequest('/pages', 'POST', {
        parent: { database_id: this.contentDbId },
        properties: {
          Name: { title: [{ text: { content: title } }] },
          Category: { select: { name: category } },
          Date: { date: { start: new Date().toISOString() } },
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ type: 'text', text: { content: content.substring(0, 2000) } }], // Notion limit per block
            },
          },
        ],
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`[NotionManager] Failed to sync swarm plan: ${msg}`);
      throw error;
    }
  }

  /**
   * Specialized method to create knowledge entries in the brain database
   */
  async createNeuralBrainEntry(
    title: string,
    content: string,
    tags: string[] = [],
  ): Promise<NotionResponse> {
    if (!this.contentDbId) throw new Error('NOTION_CONTENT_DB_ID not configured');

    const multiselectTags = tags.map(t => ({ name: t }));

    // Await the local call or return it as a promise properly cast
    return await notionRequest('/pages', 'POST', {
      parent: { database_id: this.contentDbId },
      properties: {
        Name: { title: [{ text: { content: title } }] },
        Tags: { multi_select: multiselectTags },
        Type: { select: { name: 'Neural Brain Entry' } },
        Status: { status: { name: 'Published' } },
      },
      children: [
        {
          object: 'block',
          type: 'callout',
          callout: {
            rich_text: [{ type: 'text', text: { content: 'Brain Item: ' + title } }],
            icon: { emoji: '🧠' },
            color: 'purple_background',
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: content.substring(0, 2000) } }],
          },
        },
      ],
    });
  }

  /**
   * Appends blocks to a parent page
   */
  async appendBlocks(pageId: string, blocks: NotionBlock[]): Promise<NotionResponse> {
    return notionRequest(`/blocks/${pageId}/children`, 'PATCH', {
      children: blocks,
    } as unknown as Record<string, unknown>) as unknown as Promise<NotionResponse>;
  }

  // --- Static Notion Block Builders ---

  static createDivider() {
    return { object: 'block' as const, type: 'divider' as const, divider: {} };
  }

  static createSovereignCallout(
    text: string,
    emoji: string = '🧠',
    color: string = 'gray_background',
  ) {
    return {
      object: 'block' as const,
      type: 'callout' as const,
      callout: {
        rich_text: [{ type: 'text' as const, text: { content: text } }],
        icon: { type: 'emoji' as const, emoji: emoji },
        color,
      },
    };
  }
}
