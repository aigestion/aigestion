import { idempotencyMiddleware } from '../idempotency.middleware';
import { cache } from '../../utils/cacheManager';

jest.mock('../../utils/cacheManager');
jest.mock('../../utils/logger');

describe('Idempotency Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let nextFunctionAtLeastOnce: jest.Mock;

  beforeEach(() => {
    mockReq = {
      headers: { 'idempotency-key': 'test-key' },
      method: 'POST',
      path: '/api/v1/test',
    };
    mockRes = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunctionAtLeastOnce = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next if no idempotency key is provided', async () => {
    mockReq.headers = {};
    await idempotencyMiddleware(mockReq, mockRes, nextFunctionAtLeastOnce);
    expect(nextFunctionAtLeastOnce).toBeCalled();
  });

  it('should return cached response on cache hit', async () => {
    (cache.get as jest.Mock).mockResolvedValue({
      status: 200,
      body: { success: true },
    });

    await idempotencyMiddleware(mockReq, mockRes, nextFunctionAtLeastOnce);

    expect(mockRes.setHeader).toBeCalledWith('X-Idempotency-Hit', 'true');
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalledWith({ success: true });
    expect(nextFunctionAtLeastOnce).not.toBeCalled();
  });
});
