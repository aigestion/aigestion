import 'reflect-metadata';
import { AuthService } from '../services/auth.service';
import { RegisterUserUseCase } from '../application/usecases/RegisterUserUseCase';
import { LoginUserUseCase } from '../application/usecases/LoginUserUseCase';
import { Verify2FALoginUseCase } from '../application/usecases/Verify2FALoginUseCase';
import { IUserRepository } from '../infrastructure/repository/UserRepository';
import { AppError } from '../utils/errors';
import jwt from 'jsonwebtoken';

// Mock dependencies
const mockUserRepository = {
  findById: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  removeRefreshToken: jest.fn(),
};

const mockRegisterUseCase = {
  execute: jest.fn(),
};

const mockLoginUseCase = {
  execute: jest.fn(),
};

const mockVerify2FAUseCase = {
  execute: jest.fn(),
};

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  sign: jest.fn(),
  decode: jest.fn(),
}));

// Mock config
jest.mock('../config/config', () => ({
  config: {
    jwt: {
      secret: 'test-secret',
      expiresIn: '1h',
      cookieExpiresIn: '7d'
    },
    rateLimit: {
      auth: {
        windowMs: 15 * 60 * 1000,
        max: 5
      }
    }
  },
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.resetAllMocks();
    authService = new AuthService(
      mockUserRepository as any,
      mockRegisterUseCase as any,
      mockLoginUseCase as any,
      mockVerify2FAUseCase as any
    );
  });

  describe('Delegation methods', () => {
    it('register should delegate to RegisterUserUseCase', async () => {
      const data = { name: 'Test', email: 'test@test.com', password: 'pass' };
      const expected = { user: {}, token: 't', refreshToken: 'rt' };
      mockRegisterUseCase.execute.mockResolvedValue(expected);

      const result = await authService.register(data);
      expect(mockRegisterUseCase.execute).toHaveBeenCalledWith(data);
      expect(result).toBe(expected);
    });

    it('login should delegate to LoginUserUseCase', async () => {
      const data = { email: 'test@test.com', password: 'pass' };
      const expected = { user: {}, token: 't' };
      mockLoginUseCase.execute.mockResolvedValue(expected);

      const result = await authService.login(data);
      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(data);
      expect(result).toBe(expected);
    });

    it('verifyLogin2FA should delegate to Verify2FALoginUseCase', async () => {
      const data = { userId: 'u', token: '123' };
      const expected = { user: {}, token: 't' };
      mockVerify2FAUseCase.execute.mockResolvedValue(expected);

      const result = await authService.verifyLogin2FA(data);
      expect(mockVerify2FAUseCase.execute).toHaveBeenCalledWith(data);
      expect(result).toBe(expected);
    });

    it('getUserProfile should delegate to UserRepository', async () => {
      const userId = 'u';
      const user = { id: userId };
      mockUserRepository.findById.mockResolvedValue(user);

      const result = await authService.getUserProfile(userId);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toBe(user);
    });

    it('logout should delegate to UserRepository', async () => {
      const rt = 'rt';
      mockUserRepository.removeRefreshToken.mockResolvedValue(undefined);

      await authService.logout(rt);
      expect(mockUserRepository.removeRefreshToken).toHaveBeenCalledWith(rt);
    });
  });

  describe('refreshToken', () => {
    const userId = 'user-123';
    const validToken = 'valid-refresh-token';
    const familyId = 'family-id';

    // Mock User
    const mockUser = {
      id: userId,
      _id: userId,
      email: 'test@test.com',
      role: 'user',
      refreshTokens: [
        {
          token: validToken,
          familyId: familyId,
          expires: new Date(Date.now() + 10000), // Valid future date
        }
      ]
    };

    it('should throw INVALID_REFRESH_TOKEN if user not found and token is not valid JWT', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('invalid'); });

      await expect(authService.refreshToken('invalid-string', 'ip', 'agent'))
        .rejects.toThrow('INVALID_REFRESH_TOKEN');
    });

    it('should detect token reuse and invalidate family', async () => {
      // SCENARIO: Hacker uses a token that was already used (and thus rotated).
      // 1. findOne returns null because the old token is not in DB anymore
      mockUserRepository.findOne.mockResolvedValueOnce(null);

      // 2. We verify the token and find it has a familyId (Reuse scenario)
      (jwt.verify as jest.Mock).mockReturnValue({ familyId });

      // 3. We look up the user by familyId
      mockUserRepository.findOne.mockResolvedValueOnce({
        ...mockUser,
        id: userId,
        refreshTokens: [
          { familyId, token: 'some-new-token' },
          { familyId: 'other-family', token: 'other' }
        ]
      });

      mockUserRepository.update.mockResolvedValue({});

      await expect(authService.refreshToken(validToken, 'ip', 'agent'))
        .rejects.toThrow('REFRESH_TOKEN_REUSE_DETECTED');

      // Expect invalidation
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        refreshTokens: expect.arrayContaining([{ familyId: 'other-family', token: 'other' }])
      });

      const updateCall = mockUserRepository.update.mock.calls[0];
      const updatedTokens = updateCall[1].refreshTokens;
      expect(updatedTokens).toHaveLength(1);
      expect(updatedTokens[0].familyId).toBe('other-family');
    });

    it('should throw REFRESH_TOKEN_EXPIRED if token is expired', async () => {
      const expiredToken = 'expired-token';
      const expiredUser = {
        ...mockUser,
        refreshTokens: [{
          token: expiredToken,
          familyId: 'fam',
          expires: new Date(Date.now() - 1000), // Past date
        }]
      };

      mockUserRepository.findOne.mockResolvedValue(expiredUser);
      mockUserRepository.removeRefreshToken.mockResolvedValue({});

      await expect(authService.refreshToken(expiredToken, 'ip', 'agent'))
        .rejects.toThrow('REFRESH_TOKEN_EXPIRED');

      expect(mockUserRepository.removeRefreshToken).toHaveBeenCalledWith(expiredToken);
    });

    it('should refresh token correctly', async () => {
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser, refreshTokens: [...mockUser.refreshTokens] });
      mockUserRepository.update.mockResolvedValue({});
      (jwt.sign as jest.Mock).mockReturnValue('new-token-string');

      const result = await authService.refreshToken(validToken, 'ip', 'agent');

      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(jwt.sign).toHaveBeenCalled();
    });
  });
});
