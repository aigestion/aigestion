import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  verifyLogin2FA,
  enable2FA,
  verify2FA,
} from '../controllers/auth.controller';
import { container } from '../config/inversify.config';
import { AuthService } from '../services/auth.service';
import { TYPES } from '../types';
import { AppError } from '../utils/errors';

// Mock container
jest.mock('../config/inversify.config', () => ({
  container: {
    get: jest.fn(),
  },
}));

// Mock config
jest.mock('../config', () => ({
  config: {
    nodeEnv: 'test',
    jwt: { secret: 'test-secret' },
  },
}));

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let mockAuthService: any;
  let mockEnable2FAUseCase: any;
  let mockVerify2FAUseCase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      cookies: {},
      headers: {},
      user: { id: 'user-id', role: 'user' } as any,
      ip: '127.0.0.1',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    next = jest.fn();

    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      verifyLogin2FA: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
      getUserProfile: jest.fn(),
    };

    mockEnable2FAUseCase = { execute: jest.fn() };
    mockVerify2FAUseCase = { execute: jest.fn() };

    (container.get as jest.Mock).mockImplementation(type => {
      if (type === TYPES.AuthService) return mockAuthService;
      if (type === TYPES.Enable2FAUseCase) return mockEnable2FAUseCase;
      if (type === TYPES.Verify2FAUseCase) return mockVerify2FAUseCase;
      return {};
    });
  });

  const mockUser = {
    _id: 'user-id',
    email: 'test@test.com',
    refreshTokens: [],
    password: 'hash',
    toObject: () => ({ _id: 'user-id', email: 'test@test.com' }),
  };

  describe('register', () => {
    it('should register user and return token', async () => {
      req.body = { email: 'test@test.com', password: 'pass', name: 'Test' };
      mockAuthService.register.mockResolvedValue({
        user: mockUser,
        token: 'access-token',
        refreshToken: 'refresh-token',
      });

      await register(req as Request, res as Response, next);

      expect(mockAuthService.register).toHaveBeenCalledWith(req.body);
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'refresh-token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ token: 'access-token' }),
          status: 201,
        }),
      );
    });

    it('should call next with error if register fails', async () => {
      mockAuthService.register.mockRejectedValue(new Error('Fail'));
      await register(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('login', () => {
    it('should return mfaRequired if service returns it', async () => {
      req.body = { email: 'test@test.com', password: 'pass' };
      mockAuthService.login.mockResolvedValue({ mfaRequired: true, user: mockUser });

      await login(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { mfaRequired: true, userId: 'user-id' },
          status: 200,
        }),
      );
      expect(res.cookie).not.toHaveBeenCalled();
    });

    it('should return tokens if login successful', async () => {
      req.body = { email: 'test@test.com', password: 'pass' };
      mockAuthService.login.mockResolvedValue({
        user: mockUser,
        token: 'access-token',
        refreshToken: 'refresh-token',
      });

      await login(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'refresh-token', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ token: 'access-token' }),
          status: 200,
        }),
      );
    });

    it('should call next with error if login fails', async () => {
      req.body = { email: 'test@test.com', password: 'pass' };
      mockAuthService.login.mockRejectedValue(new Error('Login failed'));

      await login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('verifyLogin2FA', () => {
    it('should verify 2FA and return tokens', async () => {
      req.body = { userId: 'user-id', token: '123456' };
      mockAuthService.verifyLogin2FA.mockResolvedValue({
        user: mockUser,
        token: 'access-token',
        refreshToken: 'refresh-token',
      });

      await verifyLogin2FA(req as Request, res as Response, next);

      expect(mockAuthService.verifyLogin2FA).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-id',
          token: '123456',
        }),
      );
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'refresh-token', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ token: 'access-token' }),
          status: 200,
        }),
      );
    });

    it('should call next with error if verifyLogin2FA fails', async () => {
      mockAuthService.verifyLogin2FA.mockRejectedValue(new Error('Login 2FA failed'));
      req.body = { userId: 'user-id', token: '123456' };

      await verifyLogin2FA(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('enable2FA', () => {
    it('should execute enable2FA use case', async () => {
      const result = { secret: 'secret', qrCode: 'qr' };
      mockEnable2FAUseCase.execute.mockResolvedValue(result);
      req.body = { userId: 'user-id' };

      // Extract handler from array (last element)
      const handler = enable2FA[enable2FA.length - 1] as any;
      await handler(req, res, next);

      expect(mockEnable2FAUseCase.execute).toHaveBeenCalledWith('user-id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: result,
          status: 200,
        }),
      );
    });

    it('should call next with error if enable2FA fails', async () => {
      mockEnable2FAUseCase.execute.mockRejectedValue(new Error('Enable 2FA failed'));
      req.body = { userId: 'user-id' };

      const handler = enable2FA[enable2FA.length - 1] as any;
      await handler(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('verify2FA', () => {
    it('should execute verify2FA use case', async () => {
      mockVerify2FAUseCase.execute.mockResolvedValue(true);
      req.body = { userId: 'user-id', token: '123' };

      const handler = verify2FA[verify2FA.length - 1] as any;
      await handler(req, res, next);

      expect(mockVerify2FAUseCase.execute).toHaveBeenCalledWith('user-id', '123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { success: true },
          status: 200,
        }),
      );
    });

    it('should call next with error if verify2FA fails', async () => {
      mockVerify2FAUseCase.execute.mockRejectedValue(new Error('Verify 2FA failed'));
      req.body = { userId: 'user-id', token: '123' };

      const handler = verify2FA[verify2FA.length - 1] as any;
      await handler(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('refresh', () => {
    it('should refresh token if cookie present', async () => {
      req.cookies = { refresh_token: 'old-rt' };
      mockAuthService.refreshToken.mockResolvedValue({
        user: mockUser,
        accessToken: 'new-at',
        refreshToken: 'new-rt',
      });

      await refresh(req as Request, res as Response, next);

      expect(mockAuthService.refreshToken).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'new-rt', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { accessToken: 'new-at' },
          status: 200,
        }),
      );
    });

    it('should throw error if no refresh token', async () => {
      req.cookies = {};
      await refresh(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe('logout', () => {
    it('should call authService.logout and clear cookie', async () => {
      req.cookies = { refresh_token: 'rt' };
      await logout(req as Request, res as Response, next);

      expect(mockAuthService.logout).toHaveBeenCalledWith('rt');
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { message: 'Logged out successfully' },
          status: 200,
        }),
      );
    });
  });

  describe('getMe', () => {
    it('should return user profile', async () => {
      mockAuthService.getUserProfile.mockResolvedValue(mockUser);

      await getMe(req as Request, res as Response, next);

      expect(mockAuthService.getUserProfile).toHaveBeenCalledWith('user-id');
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockUser,
          status: 200,
        }),
      );
    });

    it('should return 404 if user not found', async () => {
      mockAuthService.getUserProfile.mockResolvedValue(null);

      await getMe(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should return 401 if req.user is undefined', async () => {
      req.user = undefined;
      await getMe(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });
  });
});
