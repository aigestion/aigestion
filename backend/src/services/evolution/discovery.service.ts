import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { Gemini2Service } from '../gemini-2.service';
import { logger } from '../../utils/logger';
import axios from 'axios';

/**
 * DISCOVERY SERVICE
 * Periodically researches trending technologies and libraries on GitHub and NPM.
 */
@injectable()
export class DiscoveryService {
  constructor(
    @inject(TYPES.Gemini2Service) private gemini: Gemini2Service
  ) {}

  /**
   * Researches trending repositories on GitHub based on specific topics.
   */
  async discoverTrendingTech(topic: string = 'ai-agents') {
    logger.info(`[DiscoveryService] Searching for trending tech: ${topic}`);
    try {
      // Logic to fetch from GitHub API (simplified for demonstration)
      const response = await axios.get(`https://api.github.com/search/repositories?q=${topic}&sort=stars&order=desc`, {
          headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      
      const topRepos = response.data.items.slice(0, 5).map((repo: any) => ({
          name: repo.full_name,
          url: repo.html_url,
          description: repo.description
      }));

      const analysis = await this.gemini.generateText(
          `Analyze these trending repositories and determine which one is most compatible with the AIGestion Nexus architecture (InversifyJS, Node.js, TypeScript, Swarm Engine):\n${JSON.stringify(topRepos)}`
      );

      return { topRepos, recommendation: analysis };
    } catch (error) {
      logger.error('[DiscoveryService] Tech discovery failed', error);
      throw error;
    }
  }
}
