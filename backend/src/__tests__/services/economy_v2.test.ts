import 'reflect-metadata';
import { EconomyService } from '@/services/economy.service';
import { DeFiStrategistService } from '@/services/defi-strategist.service';
import { getCache, setCache } from '@/cache/redis';

// Mock Redis functions
jest.mock('@/cache/redis', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
}));

// Mock DeFi service
const mockDeFiService = {
  getYieldAdvice: jest.fn().mockResolvedValue({
    wallets: [{ asset: 'USDC', apy: 12.5, recommendation: 'Supply to Aave' }],
  }),
};

describe('EconomyService God Mode v2', () => {
  let service: EconomyService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EconomyService(mockDeFiService as any);
  });

  describe('Price Alerts', () => {
    it('should add a price alert with correct condition', async () => {
      // Mock getEconomyUpdate behavior (needed for addPriceAlert internally)
      const mockPrices = [{ symbol: 'NVDA', price: 800 }];
      jest.spyOn(service, 'getEconomyUpdate').mockResolvedValue(mockPrices as any);
      (getCache as jest.Mock).mockResolvedValue([]);

      const alert = await service.addPriceAlert({
        symbol: 'NVDA',
        targetPrice: 900,
        chatId: 123,
        userId: 'god_mode',
      });

      expect(alert.condition).toBe('above');
      expect(setCache).toHaveBeenCalledWith('economy:alerts:god_mode', expect.any(Array), 0);
    });

    it('should detect triggered alerts', async () => {
      const mockPrices = [{ symbol: 'NVDA', price: 950 }];
      jest.spyOn(service, 'getEconomyUpdate').mockResolvedValue(mockPrices as any);

      const activeAlerts = [
        {
          symbol: 'NVDA',
          targetPrice: 900,
          condition: 'above',
          chatId: 123,
          userId: 'god_mode',
        },
      ];
      (getCache as jest.Mock).mockResolvedValue(activeAlerts);

      const triggered = await service.checkPriceAlerts();
      expect(triggered.length).toBe(1);
      expect(triggered[0].symbol).toBe('NVDA');
    });
  });

  describe('Portfolio Tracking', () => {
    it('should add a position to the portfolio', async () => {
      (getCache as jest.Mock).mockResolvedValue([]);

      await service.addPortfolioPosition('god_mode', 'PLTR', 100, 20);

      expect(setCache).toHaveBeenCalledWith(
        'economy:portfolio:god_mode',
        [
          {
            symbol: 'PLTR',
            amount: 100,
            entryPrice: 20,
          },
        ],
        0
      );
    });

    it('should calculate P&L correctly', async () => {
      const positions = [{ symbol: 'PLTR', amount: 100, entryPrice: 20 }];
      (getCache as jest.Mock).mockResolvedValue(positions);

      const mockPrices = [{ symbol: 'PLTR', price: 30 }];
      jest.spyOn(service, 'getEconomyUpdate').mockResolvedValue(mockPrices as any);

      const stats = await service.getPortfolioStats('god_mode');
      expect(stats[0].pnl).toBe(1000); // (30-20)*100
      expect(stats[0].pnlPercent).toBe('50.00%');
    });
  });

  describe('DeFi Yield Integration', () => {
    it('should include DeFi yields in investment advice', async () => {
      jest.spyOn(service, 'getEconomyUpdate').mockResolvedValue([]);
      jest
        .spyOn(service, 'getMarketSentiment')
        .mockResolvedValue({ sentiment: 'neutral', score: 0 });

      const advice = await service.getInvestmentAdvice();
      expect(advice.advice).toContain('DeFi');
      expect(advice.advice).toContain('USDC');
      expect(advice.advice).toContain('12.5%');
    });
  });
});
