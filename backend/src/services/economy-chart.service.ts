import { injectable } from 'inversify';
import { logger } from '../utils/logger';

@injectable()
export class EconomyChartService {
  private readonly sparklineChars = [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

  /**
   * Generates an ASCII sparkline for a set of numeric values
   */
  generateSparkline(values: number[]): string {
    if (values.length === 0) return '';

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    if (range === 0) return this.sparklineChars[4].repeat(values.length);

    return values
      .map(v => {
        const scaled = (v - min) / range;
        const index = Math.floor(scaled * (this.sparklineChars.length - 1));
        return this.sparklineChars[index];
      })
      .join('');
  }

  /**
   * Generates a more detailed trend message
   */
  async generateTrendReport(symbol: string, prices: number[]): Promise<string> {
    if (prices.length < 2) return `❌ No hay suficientes datos para ${symbol}`;

    const sparkline = this.generateSparkline(prices);
    const first = prices[0];
    const last = prices[prices.length - 1];
    const change = ((last - first) / first) * 100;
    const emoji = change >= 0 ? '📈' : '📉';

    return (
      `📊 *Tendencia ${symbol} (Últimos 10 días)*\n` +
      `${sparkline}\n` +
      `${emoji} Cambio: *${change >= 0 ? '+' : ''}${change.toFixed(2)}%*\n` +
      `💰 Actual: *$${last.toLocaleString()}*`
    );
  }
}
