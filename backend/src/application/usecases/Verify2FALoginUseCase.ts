import { injectable, inject } from 'inversify';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { TYPES } from '../../types';
import { User, IUser } from '../../models/User';
import { TwoFactorService } from '../../services/two-factor.service';
import { RateLimitService } from '../../services/rate-limit.service';
import { AppError } from '../../utils/errors';
import { config } from '../../config';

import { IUserRepository } from '../../infrastructure/repository/UserRepository';

@injectable()
export class Verify2FALoginUseCase {
  constructor(
    @inject(TYPES.TwoFactorService) private twoFactorService: TwoFactorService,
    @inject(TYPES.RateLimitService) private rateLimitService: RateLimitService,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) { }

  async execute(data: { userId: string; token: string; ip?: string; userAgent?: string }) {
    const { userId, token, ip, userAgent } = data;

    // Rate Limit: 5 attempts per 15 minutes for 2FA login
    await this.rateLimitService.incrementAndCheck(`login_2fa:${userId}`, 5, 15 * 60);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    if (!user.isMfaEnabled && !user.isTwoFactorEnabled) {
      // If MFA is not enabled, why are we here?
      // Maybe user disabled it in another session?
      // Proceed with login anyway for UX or throw?
      // Better to throw as this endpoint expects 2FA.
      throw new AppError('2FA not enabled for user', 400, '2FA_NOT_ENABLED');
    }

    // Verify token
    if (!user.twoFactorSecret) {
      throw new AppError('2FA setup incomplete', 400, '2FA_SETUP_INCOMPLETE');
    }

    const isValid = await this.twoFactorService.verifyTOTPToken(userId, token);

    // Also check backup codes if TOTP failed?
    // The service has verifyBackupCode method.
    // Let's check if code length is 6 (TOTP) or longer (Likely Backup Code).
    // Usually TOTP is 6 digits. Backup codes are longer.
    let isBackupValid = false;
    if (!isValid && token && token.length > 6) {
      isBackupValid = await this.twoFactorService.verifyBackupCode(userId, token);
    }

    if (!isValid && !isBackupValid) {
      throw new AppError('Invalid 2FA code', 401, 'INVALID_2FA_CODE');
    }

    // Generate tokens (Duplicated from LoginUserUseCase)
    const refreshToken = this.generateRefreshTokenString(user);
    const newRefreshTokens = [...(user.refreshTokens ?? []), {
      token: refreshToken,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      familyId: crypto.randomUUID(),
      ip: ip ?? 'unknown',
      userAgent: userAgent ?? 'unknown',
      createdAt: new Date(),
    }];

    const updates: Partial<IUser> = {
      loginAttempts: 0,
      lockUntil: undefined,
      lastLogin: new Date(),
      refreshTokens: newRefreshTokens.length > 10 ? newRefreshTokens.slice(-10) : newRefreshTokens
    };

    const updatedUser = await this.userRepository.update(user.id, updates);

    const accessToken = this.generateToken(user, { ip, userAgent });



    // Clear rate limit on success
    await this.rateLimitService.reset(`login_2fa:${userId}`);

    return { user: updatedUser ?? user, token: accessToken, refreshToken };
  }

  private generateToken(user: any, fingerprint?: { ip?: string; userAgent?: string }): string {
    const payload: any = { id: user._id, email: user.email, role: user.role };
    if (fingerprint) {
      payload.fingerprint = {
        ip: fingerprint.ip ?? 'unknown',
        userAgent: fingerprint.userAgent ?? 'unknown',
      };
    }
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn as any });
  }

  private generateRefreshTokenString(user: any, familyId?: string): string {
    const payload = { id: user._id, familyId: familyId ?? crypto.randomUUID(), type: 'refresh' };
    return jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' });
  }
}
