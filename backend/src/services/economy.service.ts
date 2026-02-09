import axios from 'axios';
import { inject, injectable } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import { getCache, setCache } from '../cache/redis';
import { TYPES } from '../types';
import { DeFiStrategistService } from './defi-strategist.service';

export interface PriceAlert {
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  chatId: number;
  userId: string;
}

export interface PortfolioItem {
  symbol: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: string;
}

export interface AssetPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: string;
}

@injectable()
export class EconomyService {
  private readonly alphaVantageKey: string;
  private readonly tavilyKey: string;
  private readonly assets = [
    { symbol: 'GOLD', type: 'COMMODITY', name: 'Oro' },
    { symbol: 'XRP', type: 'CRYPTO', name: 'XRP' },
    { symbol: 'PLTR', type: 'STOCK', name: 'Palantir' },
    { symbol: 'GOOGL', type: 'STOCK', name: 'Google' },
    { symbol: 'NVDA', type: 'STOCK', name: 'Nvidia' },
  ];

  constructor(@inject(TYPES.DeFiStrategistService) private defiService: DeFiStrategistService) {
    this.alphaVantageKey = env.ALPHAVANTAGE_KEY || '';
    this.tavilyKey = env.TAVILY_API_KEY || '';
  }

  /**
   * Fetch current prices for all tracked assets
   */
  async getEconomyUpdate(): Promise<AssetPrice[]> {
    logger.info('[EconomyService] Fetching market updates for tracked assets...');
    const results: AssetPrice[] = [];

    for (const asset of this.assets) {
      try {
        const priceData = await this.fetchPrice(asset);
        if (priceData) {
          results.push(priceData);
        }
      } catch (error) {
        logger.error(`[EconomyService] Failed to fetch price for ${asset.symbol}:`, error);
      }
    }

    return results;
  }

  private async fetchPrice(asset: { symbol: string; type: string }): Promise<AssetPrice | null> {
    const cacheKey = `economy:price:${asset.symbol}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    if (!this.alphaVantageKey) {
      // Mock data if no key is provided (for dev/demo)
      return {
        symbol: asset.symbol,
        price: Math.random() * 2000,
        change: (Math.random() - 0.5) * 10,
        changePercent: ((Math.random() - 0.5) * 2).toFixed(2) + '%',
      };
    }

    let url = '';
    if (asset.type === 'CRYPTO') {
      url = `https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=${asset.symbol}&market=USD&interval=5min&apikey=${this.alphaVantageKey}`;
    } else if (asset.type === 'COMMODITY') {
      // AlphaVantage has specific functions for commodities like Gold
      url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GOLD&apikey=${this.alphaVantageKey}`;
    } else {
      url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${asset.symbol}&apikey=${this.alphaVantageKey}`;
    }

    const res = await axios.get(url);
    const data = res.data['Global Quote'] || res.data['Realtime Currency Exchange Rate'];

    if (!data && asset.type === 'STOCK') {
      // Fallback or handle missing data
      return null;
    }

    // Transform AlphaVantage response to simplified AssetPrice
    // Note: In a real implementation, we'd need more robust parsing per type
    const result = {
      symbol: asset.symbol,
      price: Number.parseFloat(data?.['05. price'] || data?.['5. Exchange Rate'] || '0'),
      change: Number.parseFloat(data?.['09. change'] || '0'),
      changePercent: data?.['10. change percent'] || '0%',
    };

    if (result.price > 0) {
      await setCache(cacheKey, result, 900); // 15 mins cache for prices
    }

    return result;
  }

  /**
   * Generate a formatted report for Telegram/Daniela
   */
  async generateFormattedReport(): Promise<string> {
    const prices = await this.getEconomyUpdate();
    if (prices.length === 0) return '❌ No se pudo obtener información económica en este momento.';

    let report = `📊 *Resumen Económico AIGestion*\n\n`;
    prices.forEach(p => {
      const icon = p.change >= 0 ? '📈' : '📉';
      report += `${icon} *${p.symbol}*: $${p.price.toLocaleString()} (${p.changePercent})\n`;
    });

    report += `\n🕒 _Actualizado: ${new Date().toLocaleString('es-ES')}_`;
    return report;
  }

  /**
   * Prefer Number.parseFloat over parseFloat (Lint Fix)
   */
  private parseNum(val: string): number {
    return Number.parseFloat(val);
  }

  /**
   * Get overall market sentiment using News Sentiment API
   */
  async getMarketSentiment(): Promise<string> {
    const cacheKey = 'economy:sentiment';
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    if (!this.alphaVantageKey) return 'NEUTRAL';

    try {
      const res = await axios.get(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${this.alphaVantageKey}`,
      );
      const sentiment = res.data.feed?.[0]?.overall_sentiment_label || 'NEUTRAL';
      const result = sentiment.toUpperCase();
      await setCache(cacheKey, result, 3600); // 1 hour for sentiment
      return result;
    } catch (error) {
      logger.error('[EconomyService] Sentiment fetch failed:', error);
      return 'NEUTRAL';
    }
  }

  /**
   * Get Geopolitical Context from Tavily
   */
  async getGeopoliticalContext(): Promise<string> {
    const cacheKey = 'economy:geopolitical';
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    if (!this.tavilyKey) return 'Contexto geopolítico no disponible (Falta API Key).';

    try {
      logger.info('[EconomyService] Fetching geopolitical context from Tavily...');
      const response = await axios.post('https://api.tavily.com/search', {
        api_key: this.tavilyKey,
        query:
          'latest major geopolitical events impacting global markets economy war trade sanctions today',
        search_depth: 'basic',
        include_answer: true,
        max_results: 3,
      });

      const answer = response.data.answer;
      const results = response.data.results?.map((r: any) => `• ${r.title}`).join('\n') || '';

      const result = answer
        ? `🌍 *Contexto Global (IA)*:\n${answer}\n\n📰 *Titulares:*\n${results}`
        : `🌍 *Noticias Relevantes:*\n${results}`;

      await setCache(cacheKey, result, 7200); // 2 hours for geo context
      return result;
    } catch (error) {
      logger.error('[EconomyService] Tavily search failed:', error);
      return '⚠️ No se pudo obtener el contexto geopolítico en este momento.';
    }
  }

  /**
   * Generate investment recommendations based on data
   */
  async getInvestmentAdvice(): Promise<{
    advice: string;
    sentiment: string;
    opportunities: string[];
    geoContext: string;
  }> {
    const prices = await this.getEconomyUpdate();
    const sentiment = await this.getMarketSentiment();
    const geoContext = await this.getGeopoliticalContext();
    const opportunities: string[] = [];

    // Integration with DeFiStrategist
    try {
      const yieldData = await this.defiService.getYieldAdvice();
      if (yieldData && yieldData.wallets) {
        yieldData.wallets.forEach((w: any) => {
          if (w.apy > 5) {
            opportunities.push(
              `💎 *Oportunidad DeFi*: ${w.asset} está rindiendo un *${w.apy}% APY*. Estrategia sugerida: *${w.recommendation}*.`,
            );
          }
        });
      }
    } catch (err) {
      logger.warn('[EconomyService] DeFi yield fetch failed, skipping yield info');
    }

    // Basic logic for recommendations
    prices.forEach(p => {
      const changeNum = parseFloat(p.changePercent.replace('%', ''));
      if (changeNum < -3) {
        opportunities.push(
          `🔥 *${p.symbol}* ha bajado un ${p.changePercent}. Podría ser una oportunidad de compra si mantienes a largo plazo.`,
        );
      } else if (changeNum > 5) {
        opportunities.push(
          `🚀 *${p.symbol}* está en rally (+${p.changePercent}). Considera proteger ganancias con stops dinámicos.`,
        );
      }
    });

    if (sentiment === 'BULLISH' || sentiment === 'SOMEWHAT_BULLISH') {
      opportunities.push(
        '🌟 El sentimiento general es alcista. Buen momento para mantener posiciones fuertes en NVDA y GOOGL.',
      );
    } else if (sentiment === 'BEARISH' || sentiment === 'SOMEWHAT_BEARISH') {
      opportunities.push(
        '⚠️ Alerta: El sentimiento de noticias es bajista. Considera aumentar liquidez o buscar activos refugio como el Oro.',
      );
    }

    let advice = `💡 *Recomendación Estratégica (God Mode)*\n\n`;

    advice += `${geoContext}\n\n`;

    if (opportunities.length > 0) {
      advice += `🎯 *Oportunidades Detectadas:*\n${opportunities.join('\n\n')}`;
    } else {
      advice += `🛡️ *Estrategia:* El mercado se encuentra estable. Mantén tu diversificación actual entre Oro, Crypto y Stocks de Big Tech.`;
    }

    return {
      advice,
      sentiment,
      opportunities,
      geoContext,
    };
  }

  /**
   * Generate a script optimized for Text-to-Speech
   */
  async generateVoiceScript(): Promise<string> {
    const data = await this.getInvestmentAdvice();

    // Clean up text for speech
    // Remove markdown symbols (*, `, etc)
    const clean = (text: string) =>
      text.replace(/[*_`]/g, '').replace(/[\n]+/g, '. ').replace(/[-•]/g, '');

    const intro = `Hola Alejandro. Aquí tienes tu informe de inteligencia de mercado God Mode.`;

    // Create a natural narrative
    let sentimentText = '';
    if (data.sentiment === 'BULLISH')
      sentimentText = 'El sentimiento general del mercado es alcista.';
    else if (data.sentiment === 'BEARISH')
      sentimentText = 'Detecto un sentimiento bajista en las noticias globales.';
    else sentimentText = 'El mercado muestra un comportamiento neutral en este momento.';

    // Geo context summary (first sentence usually captures the essence)
    let geoText = '';
    if (data.geoContext && !data.geoContext.includes('no disponible')) {
      const geoClean = clean(data.geoContext).split('.')[0]; // Take first sentence of AI summary
      geoText = `En el ámbito geopolítico: ${geoClean}.`;
    }

    let opportunitiesText = 'No hay alertas críticas en tus activos por ahora.';
    if (data.opportunities.length > 0) {
      opportunitiesText =
        'Atención a lo siguiente: ' + data.opportunities.map(o => clean(o)).join('. Además, ');
    }

    const script = `${intro} ${sentimentText} ${geoText} ${opportunitiesText} ${clean(
      data.advice.split('\n').pop() || '',
    )}`;

    return script;
  }

  /**
   * Price Alert Management
   */
  async addPriceAlert(alert: Omit<PriceAlert, 'condition'>): Promise<PriceAlert> {
    const prices = await this.getEconomyUpdate();
    const currentPrice = prices.find(p => p.symbol === alert.symbol)?.price || 0;
    const condition = alert.targetPrice > currentPrice ? 'above' : 'below';

    const fullAlert: PriceAlert = { ...alert, condition };
    const cacheKey = `economy:alerts:${alert.userId}`;
    const existing = (await getCache(cacheKey)) || [];

    existing.push(fullAlert);
    await setCache(cacheKey, existing, 0); // No expiry for user alerts

    logger.info(
      `[EconomyService] Alert added for ${alert.userId}: ${alert.symbol} ${condition} ${alert.targetPrice}`,
    );
    return fullAlert;
  }

  async getActiveAlerts(userId: string): Promise<PriceAlert[]> {
    return (await getCache(`economy:alerts:${userId}`)) || [];
  }

  async checkPriceAlerts(): Promise<PriceAlert[]> {
    const prices = await this.getEconomyUpdate();
    // This would typically iterate over ALL users, but for this prototype
    // we'll focus on the primary user context.
    // In a full implementation, we'd use a set of alerted users.
    const alertKeys = ['economy:alerts:god_mode']; // Hypothetical "master" key or similar
    const triggeredAlerts: PriceAlert[] = [];

    for (const key of alertKeys) {
      const alerts: PriceAlert[] = (await getCache(key)) || [];
      const stillActive: PriceAlert[] = [];

      alerts.forEach(alert => {
        const current = prices.find(p => p.symbol === alert.symbol);
        if (!current) {
          stillActive.push(alert);
          return;
        }

        const triggered =
          alert.condition === 'above'
            ? current.price >= alert.targetPrice
            : current.price <= alert.targetPrice;

        if (triggered) {
          triggeredAlerts.push(alert);
        } else {
          stillActive.push(alert);
        }
      });

      if (triggeredAlerts.length > 0) {
        await setCache(key, stillActive, 0);
      }
    }

    return triggeredAlerts;
  }

  /**
   * Portfolio Tracking
   */
  async addPortfolioPosition(
    userId: string,
    symbol: string,
    amount: number,
    entryPrice: number,
  ): Promise<void> {
    const cacheKey = `economy:portfolio:${userId}`;
    const portfolio: any[] = (await getCache(cacheKey)) || [];

    // Simple append or update
    const existingIndex = portfolio.findIndex(p => p.symbol === symbol);
    if (existingIndex >= 0) {
      portfolio[existingIndex] = { symbol, amount, entryPrice };
    } else {
      portfolio.push({ symbol, amount, entryPrice });
    }

    await setCache(cacheKey, portfolio, 0);
  }

  async getPortfolioStats(userId: string): Promise<PortfolioItem[]> {
    const cacheKey = `economy:portfolio:${userId}`;
    const positions: any[] = (await getCache(cacheKey)) || [];
    const prices = await this.getEconomyUpdate();
    const stats: PortfolioItem[] = [];

    for (const pos of positions) {
      const current = prices.find(p => p.symbol === pos.symbol);
      const currentPrice = current?.price || 0;
      const pnl = (currentPrice - pos.entryPrice) * pos.amount;
      const pnlPercent =
        pos.entryPrice > 0
          ? (((currentPrice - pos.entryPrice) / pos.entryPrice) * 100).toFixed(2) + '%'
          : '0%';

      stats.push({
        ...pos,
        currentPrice,
        pnl,
        pnlPercent,
      });
    }

    return stats;
  }

  /**
   * Fetch historical data for charting (Daily points)
   */
  async getHistoricalPrices(symbol: string): Promise<number[]> {
    const cacheKey = `economy:history:${symbol}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    if (!this.alphaVantageKey) {
      // Mock historical data
      return Array.from({ length: 15 }, () => Math.random() * 2000);
    }

    const asset = this.assets.find(a => a.symbol === symbol) || { symbol, type: 'STOCK' };
    let url = '';

    if (asset.type === 'CRYPTO') {
      url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=${this.alphaVantageKey}`;
    } else {
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.alphaVantageKey}`;
    }

    try {
      const res = await axios.get(url);
      const timeSeries =
        res.data['Time Series (Daily)'] || res.data['Time Series Digital Currency (Daily)'];

      if (!timeSeries) return [];

      const prices = Object.values(timeSeries)
        .slice(0, 10) // Last 10 days
        .map((day: any) => parseFloat(day['4. close'] || day['4a. close (USD)']))
        .reverse();

      await setCache(cacheKey, prices, 3600 * 6); // 6 hours cache for history
      return prices;
    } catch (error) {
      logger.error(`[EconomyService] History fetch failed for ${symbol}:`, error);
      return [];
    }
  }
}
