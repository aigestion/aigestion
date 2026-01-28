import 'reflect-metadata';
import { MonitoringService } from '../../services/monitoring.service';

// Mock Redis
jest.mock('../../cache/redis', () => ({
  getRedisClient: () => ({
    setEx: jest.fn(),
    lPush: jest.fn(),
    lTrim: jest.fn(),
    lRange: jest.fn().mockResolvedValue([]),
    get: jest.fn(),
    isOpen: true,
  }),
}));

// Mock Logger
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('MonitoringService', () => {
  let service: MonitoringService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MonitoringService();
  });

  describe('recordResourceUsage', () => {
    it('should calculate heap percentage correctly', () => {
      // Mock process.memoryUsage
      const memSpy = jest.spyOn(process, 'memoryUsage').mockReturnValue({
        heapUsed: 50,
        heapTotal: 100,
        external: 0,
        rss: 0,
        arrayBuffers: 0,
      } as any);

      const recordSpy = jest.spyOn(service, 'recordMetric');

      service.recordResourceUsage();

      // Should record 50% for memory_usage
      expect(recordSpy).toHaveBeenCalledWith('memory_usage', 50, expect.any(Object), '%', 'gauge');

      memSpy.mockRestore();
    });
  });

  describe('checkMetricAlerts', () => {
    it('should NOT trigger critical alert if below threshold', () => {
      const alertSpy = jest.spyOn(service as any, 'createAlert');

      // We set 90% in config.ts for memoryThreshold
      (service as any).checkMetricAlerts({
        name: 'memory_usage',
        value: 85,
        unit: '%',
      });

      expect(alertSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'critical',
        }),
      );
    });

    it('should trigger critical alert if above threshold', () => {
      const alertSpy = jest.spyOn(service as any, 'createAlert');

      (service as any).checkMetricAlerts({
        name: 'memory_usage',
        value: 96,
        unit: '%',
      });

      expect(alertSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'memory_usage critical',
          severity: 'critical',
        }),
      );
    });
  });
});
