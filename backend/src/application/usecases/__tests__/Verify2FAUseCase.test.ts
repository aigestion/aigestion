import 'reflect-metadata';
import { Verify2FAUseCase } from '../Verify2FAUseCase';
import { TwoFactorService } from '../../../services/two-factor.service';
import { RateLimitService } from '../../../services/rate-limit.service';
import { User } from '../../../models/User';
import { AppError } from '../../../utils/errors';

jest.mock('../../../services/two-factor.service');
jest.mock('../../../services/rate-limit.service');
jest.mock('../../../models/User');

const MockTwoFactorService = TwoFactorService as jest.MockedClass<typeof TwoFactorService>;
const MockRateLimitService = RateLimitService as jest.MockedClass<typeof RateLimitService>;
const MockUser = User as jest.MockedClass<typeof User>;

describe('Verify2FAUseCase', () => {
  const userId = '12345';
  const token = '123456';
  const secret = 'SECRET';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw if user not found', async () => {
    MockUser.findById = jest.fn().mockResolvedValue(null);
    const useCase = new Verify2FAUseCase(new MockTwoFactorService(), new MockRateLimitService());
    await expect(useCase.execute(userId, token)).rejects.toThrow(AppError);
  });

  it('should throw if 2FA not enabled', async () => {
    const userMock = { twoFactorSecret: undefined } as any;
    MockUser.findById = jest.fn().mockResolvedValue(userMock);
    const useCase = new Verify2FAUseCase(new MockTwoFactorService(), new MockRateLimitService());
    await expect(useCase.execute(userId, token)).rejects.toThrow(AppError);
  });

  it('should verify token and enable MFA', async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);
    const userMock = {
      twoFactorSecret: secret,
      isMfaEnabled: false,
      save: saveMock,
    } as any;
    MockUser.findById = jest.fn().mockResolvedValue(userMock);
    const mockServiceInstance = new MockTwoFactorService();
    mockServiceInstance.verifyToken = jest.fn().mockReturnValue(true);
    const mockRateLimitServiceInstance = new MockRateLimitService();

    const useCase = new Verify2FAUseCase(mockServiceInstance, mockRateLimitServiceInstance);
    await useCase.execute(userId, token);

    expect(mockRateLimitServiceInstance.incrementAndCheck).toHaveBeenCalledWith(
      `2fa_verify:${userId}`,
      5,
      900,
    );
    expect(mockServiceInstance.verifyToken).toHaveBeenCalledWith(secret, token);
    expect(userMock.isMfaEnabled).toBe(true);
    expect(saveMock).toHaveBeenCalled();
    expect(mockRateLimitServiceInstance.reset).toHaveBeenCalledWith(`2fa_verify:${userId}`);
  });

  it('should throw if rate limit exceeded by service', async () => {
    const mockRateLimitServiceInstance = new MockRateLimitService();
    mockRateLimitServiceInstance.incrementAndCheck = jest
      .fn()
      .mockRejectedValue(new AppError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED'));

    const useCase = new Verify2FAUseCase(new MockTwoFactorService(), mockRateLimitServiceInstance);

    await expect(useCase.execute(userId, token)).rejects.toThrow(AppError);
    expect(mockRateLimitServiceInstance.incrementAndCheck).toHaveBeenCalled();
    // Should fail before fetching user
    expect(MockUser.findById).not.toHaveBeenCalled();
  });
});
