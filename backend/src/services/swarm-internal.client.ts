import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { injectable } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

/**
 * [GOD MODE] Swarm Internal Client
 * Handles authenticated communication with the Python Swarm IA Engine.
 */
@injectable()
export class SwarmInternalClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.IA_ENGINE_URL || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': env.IA_ENGINE_API_KEY,
      },
      timeout: 30000, // Autonomous agents might take time
    });

    // Logging interceptor
    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      if (config) {
        logger.debug(`[SwarmInternalClient] Request to ${config.baseURL}${config.url}`);
      }
      return config;
    });

    this.client.interceptors.response.use(
      response => response,
      error => {
        logger.error(`[SwarmInternalClient] Error: ${error.message}`, {
          url: error.config?.url,
          status: error.response?.status,
        });
        return Promise.reject(error);
      },
    );
  }

  /**
   * Status check
   */
  async getStatus(): Promise<any> {
    const response = await this.client.get('/health');
    return response.data;
  }

  /**
   * Calling Daniela's specialized routes
   */
  async getDanielaStatus(): Promise<any> {
    const response = await this.client.get('/daniela/status');
    return response.data;
  }

  /**
   * Generic Post
   */
  async post(path: string, data: any): Promise<any> {
    const response = await this.client.post(path, data);
    return response.data;
  }
}
