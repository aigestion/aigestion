import { injectable, inject } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
const { notionRequest } = require('../../../utils/notion'); // Using the optimized utility

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
}
