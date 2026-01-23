import { injectable, inject } from 'inversify';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { IUserRepository } from '../../infrastructure/repository/UserRepository';
import type { IUser } from '../../models/User';
import { TYPES } from '../../types';
import { AppError } from '../../utils/errors';
import { config } from '../../config';

@injectable()
export class LoginUserUseCase {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async execute(data: { email: string; password: string; ip?: string; userAgent?: string }) {
    const { email, password, ip, userAgent } = data;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Credenciales inválidas', 401, 'AUTH_ERROR');
    }
    // lock check
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new AppError('Credenciales inválidas', 401, 'AUTH_ERROR');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const loginAttempts = (user.loginAttempts ?? 0) + 1;
      const updates: Partial<IUser> = { loginAttempts };

      if (loginAttempts >= 5) {
        updates.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
        updates.loginAttempts = 0;
      }

      await this.userRepository.update(user.id, updates);
      throw new AppError('Credenciales inválidas', 401, 'AUTH_ERROR');
    }

    // success reset attempts
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

    // Check for 2FA
    if (user.isMfaEnabled || user.isTwoFactorEnabled) {
      return {
        user: { _id: user.id, email: user.email } as any,
        mfaRequired: true
      };
    }

    const token = this.generateToken(user, { ip, userAgent });
    return { user: updatedUser ?? user, token, refreshToken };
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
