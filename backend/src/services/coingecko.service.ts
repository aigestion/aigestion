import { injectable } from 'inversify';
import axios from 'axios';
import { logger } from '../utils/logger';

interface PriceData {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    last_updated_at: number;
  };
}

@injectable()
export class CoinGeckoService {
  private readonly BASE_URL = 'https://api.coingecko.com/api/v3';
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private priceCache: {
    data: PriceData | null;
    timestamp: number;
  } = { data: null, timestamp: 0 };

  private readonly TRACKED_COINS = ['bitcoin', 'ethereum', 'solana', 'binancecoin'];

  /**
   * Get current prices for tracked assets
   */
  public async getPrices(): Promise<PriceData> {
    if (this.isCacheValid()) {
      logger.debug('[CoinGecko] Serving prices from cache');
      return this.priceCache.data!;
    }

    try {
      logger.info('[CoinGecko] Fetching live prices...');
      const ids = this.TRACKED_COINS.join(',');
      const response = await axios.get(`${this.BASE_URL}/simple/price`, {
        params: {
          ids,
          vs_currencies: 'usd',
          include_24hr_change: 'true',
          include_last_updated_at: 'true',
        },
        headers: {
          'User-Agent': 'AIGestion/1.0',
        },
      });

      this.priceCache = {
        data: response.data,
        timestamp: Date.now(),
      };

      return response.data;
    } catch (error: any) {
      logger.error('[CoinGecko] Failed to fetch prices', error.message);

      if (this.priceCache.data) {
        logger.warn('[CoinGecko] Serving stale data due to error');
        return this.priceCache.data;
      }

      logger.warn('[CoinGecko] Serving fallback data due to API failure');
      return {
        bitcoin: { usd: 65000, usd_24h_change: 0, last_updated_at: Date.now() / 1000 },
        ethereum: { usd: 3500, usd_24h_change: 0, last_updated_at: Date.now() / 1000 },
        solana: { usd: 150, usd_24h_change: 0, last_updated_at: Date.now() / 1000 },
        binancecoin: { usd: 600, usd_24h_change: 0, last_updated_at: Date.now() / 1000 },
      };
    }
  }

  /**
   * Get global market metrics
   */
  public async getGlobalMetrics() {
    try {
      const response = await axios.get(`${this.BASE_URL}/global`, {
        headers: {
          'User-Agent': 'AIGestion/1.0',
        },
      });
      const data = response.data.data;
      return {
        active_cryptocurrencies: data.active_cryptocurrencies,
        market_cap_change_percentage_24h_usd: data.market_cap_change_percentage_24h_usd,
        market_cap_usd: data.total_market_cap.usd,
        bitcoin_dominance: data.market_cap_percentage.btc,
      };
    } catch (error: any) {
      logger.error('[CoinGecko] Failed to fetch global metrics', error.message);
      return {
        active_cryptocurrencies: 10000,
        market_cap_change_percentage_24h_usd: 0,
        market_cap_usd: 2000000000000,
        bitcoin_dominance: 50,
      };
    }
  }

  private isCacheValid(): boolean {
    return this.priceCache.data !== null && Date.now() - this.priceCache.timestamp < this.CACHE_TTL;
  }
}
