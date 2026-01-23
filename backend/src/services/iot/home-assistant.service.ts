import axios from 'axios';
import { injectable } from 'inversify';
import { logger } from '../../utils/logger';

export interface HAConfig {
  baseUrl: string;
  accessToken: string;
}

export interface HAEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

@injectable()
export class HomeAssistantService {
  /**
   * Validates connection to a Home Assistant instance
   */
  async validateConnection(config: HAConfig): Promise<boolean> {
    try {
      const response = await axios.get(`${config.baseUrl}/api/`, {
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.message === 'API running.';
    } catch (error: any) {
      logger.error('HA Connection Validation Failed:', error.message);
      return false;
    }
  }

  /**
   * Fetches all states (entities) from Home Assistant
   */
  async getStates(config: HAConfig): Promise<HAEntity[]> {
    try {
      const response = await axios.get(`${config.baseUrl}/api/states`, {
         headers: {
          Authorization: `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to fetch HA states:', error.message);
      throw new Error('Could not fetch devices from Home Assistant');
    }
  }

  /**
   * Calls a service in Home Assistant (e.g., turn light on)
   */
  async callService(config: HAConfig, domain: string, service: string, serviceData: any = {}): Promise<any> {
    try {
      const response = await axios.post(
        `${config.baseUrl}/api/services/${domain}/${service}`,
        serviceData,
        {
          headers: {
            Authorization: `Bearer ${config.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      logger.error(`Failed to call service ${domain}.${service}:`, error.message);
      throw new Error(`Failed to execute command on Home Assistant`);
    }
  }
}
