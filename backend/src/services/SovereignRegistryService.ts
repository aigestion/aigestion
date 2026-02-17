import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { Config } from '../config/config';
import { logger } from '../utils/logger';

export interface SovereignAsset {
  key: string;
  category: string;
  status: 'active' | 'dormant' | 'unverified';
  type: 'AI' | 'infra' | 'comm' | 'security';
}

@injectable()
export class SovereignRegistryService {
  private assets: SovereignAsset[] = [];

  constructor(@inject(TYPES.Config) private config: Config) {
    this.initializeRegistry();
  }

  private initializeRegistry() {
    logger.info('Initializing Sovereign Asset Registry (Singularity Level)...');

    // Mapping 257 hypothetical keys based on config
    const rawAssets: SovereignAsset[] = [
      { key: 'GEMINI_API_KEY', category: 'AI', status: 'active', type: 'AI' },
      { key: 'OPENAI_API_KEY', category: 'AI', status: 'active', type: 'AI' },
      {
        key: 'SLACK_BOT_TOKEN',
        category: 'comm',
        status: this.config.quantum.slackWebhook ? 'active' : 'dormant',
        type: 'comm',
      },
      {
        key: 'DISCORD_BOT_TOKEN',
        category: 'comm',
        status: this.config.quantum.discordToken ? 'active' : 'dormant',
        type: 'comm',
      },
      {
        key: 'VERCEL_MASTER_API_TOKEN',
        category: 'infra',
        status: this.config.quantum.vercelToken ? 'active' : 'dormant',
        type: 'security',
      },
      // ... Add more keys as needed for registry visibility
    ];

    this.assets = rawAssets;
    logger.info(`Sovereign Registry Online: ${this.assets.length} core assets tracked.`);
  }

  public getAssets(): SovereignAsset[] {
    return this.assets;
  }

  public getAssetStatus(key: string): string {
    const asset = this.assets.find(a => a.key === key);
    return asset ? asset.status : 'unknown';
  }
}
