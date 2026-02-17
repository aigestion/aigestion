import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { Gemini2Service } from './gemini-2.service';
import { CoinGeckoService } from './coingecko.service';
import { logger } from '../utils/logger';

/**
 * DEFI STRATEGIST SERVICE
 * Analyzes decentralized finance opportunities for the Sovereign Treasury.
 */
@injectable()
export class DeFiStrategistService {
  constructor(
    @inject(TYPES.Gemini2Service) private gemini: Gemini2Service,
    @inject(TYPES.CoinGeckoService) private coingecko: CoinGeckoService,
  ) {}

  /**
   * Scans the market for yield opportunities.
   */
  public async scanYieldOpportunities() {
    logger.info('[DeFiStrategist] Scanning real-time market data...');

    try {
      // Fetch Live Data
      const prices = await this.coingecko.getPrices();
      const globalMetrics = await this.coingecko.getGlobalMetrics();

      const marketData = {
        prices: prices,
        global: globalMetrics,
      };

      const prompt = `
        You are the NEXUS DEFI STRATEGIST.

        REAL-TIME MARKET DATA:
        ${JSON.stringify(marketData, null, 2)}

        Analyze this data to recommend the safest path to grow a sovereign AI treasury.
        1. Identify the strongest asset trend (BTC, ETH, SOL, BNB).
        2. Assess global market sentiment based on dominance and 24h change.
        3. Recommend a strategy: 'ACCUMULATE', 'HOLD', or 'STABLECOIN_FARM'.

        OUTPUT: JSON {
            "opportunity": "string (Asset Name)",
            "action": "string (ACCUMULATE/HOLD/FARM)",
            "reasoning": "string (Max 1 sentence)",
            "riskLevel": "string (LOW/MEDIUM/HIGH)"
        }
        `;

      const result = await this.gemini.generateText(prompt);
      const cleaned = result.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      logger.error('[DeFiStrategist] Market analysis failed', error);
      return {
        opportunity: 'USDC',
        action: 'STABLECOIN_FARM',
        reasoning: 'Market data unavailable, defaulting to safety.',
        riskLevel: 'LOW',
      };
    }
  }

  /**
   * Returns yield advice formatted for EconomyService
   */
  public async getYieldAdvice() {
    const opportunity = await this.scanYieldOpportunities();
    return {
      wallets: [
        {
          asset: opportunity.opportunity || 'USDC',
          apy: 0, // Dynamic APY implementation pending Stage 2
          recommendation: `${opportunity.action}: ${opportunity.reasoning} (${opportunity.riskLevel} RISK)`,
        },
      ],
    };
  }
}
