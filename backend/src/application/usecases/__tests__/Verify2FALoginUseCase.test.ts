import 'reflect-metadata';
import { Verify2FALoginUseCase } from '../Verify2FALoginUseCase';
import { TwoFactorService } from '../../../services/two-factor.service';
import { RateLimitService } from '../../../services/rate-limit.service';
import { IUserRepository } from '../../../infrastructure/repository/UserRepository';
import { AppError } from '../../../utils/errors';
import { TYPES } from '../../../types';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Mock dependencies
const mockTwoFactorService = {
  verifyTOTPToken: jest.fn(),
  verifyBackupCode: jest.fn(),
  verifyToken: jest.fn(),
};

const mockUserRepository = {
  findById: jest.fn(),
  update: jest.fn(),
};

const mockRateLimitService = {
  incrementAndCheck: jest.fn(),
  reset: jest.fn(),
};

// Mock config
jest.mock('../../../config', () => ({
  config: {
    jwt: {
      secret: 'test-secret',
      expiresIn: '1h',
      cookieExpiresIn: '7d',
    },
    rateLimit: {
      auth: {
        windowMs: 15 * 60 * 1000,
        max: 5,
      },
    },
  },
}));

describe('Verify2FALoginUseCase', () => {
  let verify2FALoginUseCase: Verify2FALoginUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    verify2FALoginUseCase = new Verify2FALoginUseCase(
      mockTwoFactorService as any,
      mockRateLimitService as any,
      mockUserRepository as any
    );
  });

  const userId = 'user-123';
  const token = '123456';
  const ip = '127.0.0.1';
  const userAgent = 'test-agent';

  // Helper object
  const validPayload = { userId, token, ip, userAgent };

  it('should throw error if user not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(verify2FALoginUseCase.execute(validPayload)).rejects.toThrow(
      new AppError('User not found', 404, 'USER_NOT_FOUND')
    );
  });

  it('should throw error if 2FA is not enabled for user', async () => {
    mockUserRepository.findById.mockResolvedValue({
      _id: userId,
      isTwoFactorEnabled: false,
    });

    await expect(verify2FALoginUseCase.execute(validPayload)).rejects.toThrow(
      '2FA not enabled for user'
    );
  });

  it('should verify TOTP successfully and return tokens', async () => {
    const mockUser = {
      id: userId,
      _id: userId,
      isTwoFactorEnabled: true,
      twoFactorSecret: 'secret',
      refreshTokens: [],
    };
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockTwoFactorService.verifyTOTPToken.mockReturnValue(true);
    mockUserRepository.update.mockResolvedValue(mockUser);
    mockRateLimitService.incrementAndCheck.mockResolvedValue(undefined);
    mockRateLimitService.reset.mockResolvedValue(undefined);

    const result = await verify2FALoginUseCase.execute(validPayload);

    expect(mockTwoFactorService.verifyTOTPToken).toHaveBeenCalledWith(userId, token);
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('refreshToken');
    expect(mockUserRepository.update).toHaveBeenCalled();
    expect(mockRateLimitService.incrementAndCheck).toHaveBeenCalledWith(
      `login_2fa:${userId}`,
      5,
      900
    );
    expect(mockRateLimitService.reset).toHaveBeenCalledWith(`login_2fa:${userId}`);
  });

  it('should try backup code if TOTP fails', async () => {
    const mockUser = {
      id: userId,
      _id: userId,
      isTwoFactorEnabled: true,
      twoFactorSecret: 'secret',
      refreshTokens: [],
    };
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockTwoFactorService.verifyTOTPToken.mockReturnValue(false);
    mockTwoFactorService.verifyBackupCode.mockReturnValue(true);
    mockUserRepository.update.mockResolvedValue(mockUser);

    const backupToken = 'backup-code-longer-than-6'; // > 6 chars
    const payload = { ...validPayload, token: backupToken };
    const result = await verify2FALoginUseCase.execute(payload);

    expect(mockTwoFactorService.verifyTOTPToken).toHaveBeenCalledWith(userId, backupToken);
    // expect backup verification to be called
    expect(mockTwoFactorService.verifyBackupCode).toHaveBeenCalledWith(userId, backupToken);
    expect(result).toHaveProperty('token');
  });

  it('should throw error if both TOTP and backup code fail', async () => {
    const mockUser = {
      id: userId,
      _id: userId,
      isTwoFactorEnabled: true,
      twoFactorSecret: 'secret',
      refreshTokens: [],
    };
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockTwoFactorService.verifyTOTPToken.mockReturnValue(false);
    mockTwoFactorService.verifyBackupCode.mockReturnValue(false);

    // Use a token long enough to trigger backup code check attempt, otherwise it throws 'Invalid 2FA code' without checking backup
    const longToken = '1234567';
    await expect(
      verify2FALoginUseCase.execute({ ...validPayload, token: longToken })
    ).rejects.toThrow(new AppError('Invalid 2FA code', 401, 'INVALID_2FA_CODE'));
  });

  it('should verify rate limit is checked', async () => {
    mockRateLimitService.incrementAndCheck.mockRejectedValue(
      new AppError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED')
    );
    await expect(verify2FALoginUseCase.execute(validPayload)).rejects.toThrow(
      'Rate limit exceeded'
    );
    expect(mockUserRepository.findById).not.toHaveBeenCalled();
  });
});
