import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { CoinGeckoService } from '../coingecko.service';
import { WhatsAppCommandService } from '../whatsapp-command.service';
import { SwarmService } from '../swarm.service';
import { logger } from '../../utils/logger';

interface PriceSnapshot {
  price: number;
  timestamp: number;
}

export interface AlertLog {
  asset: string;
  price: number;
  change: number;
  direction: 'pump' | 'dump';
  timestamp: number;
}

@injectable()
export class PriceAlertService {
  private readonly ALERT_THRESHOLD_PERCENT = 0.05; // 5% swing
  private readonly CHECK_INTERVAL_MS = 5 * 60 * 1000; // Check every 5 mins

  // Track last known prices in memory
  private readonly priceHistory: Map<string, PriceSnapshot> = new Map();
  private readonly alertHistory: AlertLog[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  private readonly monitorAssets = ['bitcoin', 'ethereum', 'solana', 'binancecoin'];

  constructor(
    @inject(TYPES.CoinGeckoService) private readonly coingecko: CoinGeckoService,
    @inject(TYPES.WhatsAppCommandService) private readonly whatsapp: WhatsAppCommandService,
    @inject(TYPES.SwarmService) private readonly swarm: SwarmService,
  ) {}

  /**
   * Start the sniper monitoring loop
   */
  public startMonitoring() {
    if (this.intervalId) return;

    logger.info('[TheSniper] Price monitoring activated.');
    // Initial check
    this.checkPrices();

    // Periodic check
    this.intervalId = setInterval(() => this.checkPrices(), this.CHECK_INTERVAL_MS);
  }

  public stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public getRecentAlerts(): AlertLog[] {
    return this.alertHistory;
  }

  /**
   * Main logic: Fetch prices -> Compare -> Alert
   */
  public async checkPrices() {
    try {
      const prices = await this.coingecko.getPrices();

      for (const asset of this.monitorAssets) {
        if (!prices[asset]) continue;

        const currentPrice = prices[asset].usd;
        const lastSnapshot = this.priceHistory.get(asset);

        // Update history if first run
        if (!lastSnapshot) {
          this.priceHistory.set(asset, { price: currentPrice, timestamp: Date.now() });
          continue;
        }

        // Calculate volatility
        const priceDiff = currentPrice - lastSnapshot.price;
        const percentChange = Math.abs(priceDiff / lastSnapshot.price);

        if (percentChange >= this.ALERT_THRESHOLD_PERCENT) {
          await this.triggerAlert(asset, currentPrice, lastSnapshot.price, percentChange);
          // Reset baseline after alert to avoid spam
          this.priceHistory.set(asset, { price: currentPrice, timestamp: Date.now() });
        } else {
          // Optional: Update baseline slowly over time?
        }
      }
    } catch (error) {
      logger.error('[TheSniper] Failed to check prices', error);
    }
  }

  private async triggerAlert(
    asset: string,
    currentPrice: number,
    oldPrice: number,
    percent: number,
  ) {
    const isDump = currentPrice < oldPrice;
    const direction = isDump ? '📉 DUMP' : '🚀 PUMP';
    const percentStr = (percent * 100).toFixed(2);
    const assetName = asset.toUpperCase();

    // Construct message
    const message = `
🚨 *MARKET ALERT: ${assetName}*
${direction}: ${percentStr}% move
Old: $${oldPrice}
New: $${currentPrice}

_Wolf of Wall Street Protocol_
    `.trim();

    logger.warn(`[TheSniper] Triggering Alert: ${message}`);

    // Save to History
    this.alertHistory.unshift({
      asset,
      price: currentPrice,
      change: percent * 100,
      direction: isDump ? 'dump' : 'pump',
      timestamp: Date.now(),
    });
    // Keep last 20
    if (this.alertHistory.length > 20) this.alertHistory.pop();

    // 1. Send Notification (Real - Wolf of Wall Street Active)
    await this.whatsapp.sendAlert(message);

    // 2. TRIGGER RED SWARM (Adaptive Defense)
    if (isDump && percent >= 0.05) {
      logger.warn(`[TheSniper] 🛑 CRITICAL DROP DETECTED. ACTIVATING RED SWARM PROTOCOL.`);
      this.swarm.activateRedSwarm(asset, percent * 100, currentPrice).catch(err => {
        logger.error('[TheSniper] Red Swarm activation failed', err);
      });
    }
  }
}
