import { injectable, inject } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import * as https from 'https'; // Use * as https for better compatibility
import * as fs from 'fs';
import * as path from 'path';

// --- Inlined Notion Utility (Optimized) ---
const apiKey = process.env.NOTION_API_KEY;
const NOTION_VERSION = '2022-06-28';

function notionRequest(endpoint: string, method: string, body: any = null): Promise<any> {
    if (!apiKey) {
      // Return a mock/empty promise if no key, to prevent crash but log warning
       logger.warn('NOTION_API_KEY is missing. Notion operations will vary.');
       return Promise.resolve({ results: [] });
    }

  return new Promise((resolve, reject) => {
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
          const errorMsg = (parsedData && parsedData.message) || data || 'Unknown Notion API Error';
          // Don't reject, just return empty to keep service alive
           logger.error(`Notion API Error [${res.statusCode}]: ${errorMsg}`);
           resolve({ results: [] });
        }
      });
    });

    req.on('error', (err: any) => {
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
  properties: any;
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
    } catch (error: any) {
      logger.error(`[NotionManager] Failed to fetch metrics: ${error.message}`);
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
    } catch (error: any) {
      logger.error(`[NotionManager] Failed to sync swarm plan: ${error.message}`);
      throw error;
    }
  }
}
