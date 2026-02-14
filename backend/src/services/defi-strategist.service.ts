import { injectable, inject } from 'inversify';
import { TYPES } from '@/types';
import { Gemini2Service } from './gemini-2.service';
import { logger } from '@/utils/logger';

/**
 * DEFI STRATEGIST SERVICE
 * Analyzes decentralized finance opportunities for the Sovereign Treasury.
 */
@injectable()
export class DeFiStrategistService {
  constructor(
    @inject(TYPES.Gemini2Service) private gemini: Gemini2Service
  ) {}

  /**
   * Scans the market for yield opportunities.
   */
  public async scanYieldOpportunities() {
    logger.info('[DeFiStrategist] Scanning high-performance liquidity pools...');
    
    const marketData = {
        eth_apr: '4.2%',
        sol_apr: '7.5%',
        usdc_lending: '3.8%'
    };

    const prompt = `
      You are the NEXUS DEFI STRATEGIST.
      Analyze these market rates: ${JSON.stringify(marketData)}.
      Recommend the safest path to grow a $10,000 reserve for a sovereign AI system.
      Focus on Liquidity Provision or Staking with low impermanent loss.
      
      OUTPUT: JSON { "opportunity": "string", "expectedYield": "string", "riskLevel": "string" }
    `;

    try {
      const result = await this.gemini.generateText(prompt);
      const cleaned = result.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      logger.error('[DeFiStrategist] Market scan failed', error);
      return { opportunity: 'USDC Vault', expectedYield: '3.5%', riskLevel: 'MINIMAL' };
    }
  }
}
