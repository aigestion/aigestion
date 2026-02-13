import { injectable, inject } from 'inversify';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { RegisterUserUseCase } from '../application/usecases/RegisterUserUseCase';
import { Verify2FALoginUseCase } from '../application/usecases/Verify2FALoginUseCase';
import { LoginUserUseCase } from '../application/usecases/LoginUserUseCase';
import type { IUserRepository } from '../infrastructure/repository/UserRepository';
import type { IUser } from '../models/User';
import { TYPES } from '../types';
import { config } from '../config';

import { VerifyEmailUseCase } from '../application/usecases/VerifyEmailUseCase';
import { UpdateUserRoleUseCase } from '../application/usecases/UpdateUserRoleUseCase';
import { UpdateSubscriptionUseCase } from '../application/usecases/UpdateSubscriptionUseCase';

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.RegisterUserUseCase) private registerUseCase: RegisterUserUseCase,
    @inject(TYPES.LoginUserUseCase) private loginUseCase: LoginUserUseCase,
    @inject(TYPES.Verify2FALoginUseCase) private verify2FALoginUseCase: Verify2FALoginUseCase,
    @inject(TYPES.VerifyEmailUseCase) private verifyEmailUseCase: VerifyEmailUseCase,
    @inject(TYPES.UpdateUserRoleUseCase) private updateUserRoleUseCase: UpdateUserRoleUseCase,
    @inject(TYPES.UpdateSubscriptionUseCase)
    private updateSubscriptionUseCase: UpdateSubscriptionUseCase
  ) {}

  /**
   * Register a new user
   */
  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: IUser; token: string; refreshToken: string }> {
    // Delegate to RegisterUserUseCase
    return this.registerUseCase.execute(data);
  }

  /**
   * Login user
   */
  async login(data: {
    email: string;
    password: string;
    ip?: string;
    userAgent?: string;
  }): Promise<{ user: IUser; token?: string; refreshToken?: string; mfaRequired?: boolean }> {
    // Delegate to LoginUserUseCase
    return this.loginUseCase.execute(data);
  }

  /**
   * Verify email with code
   */
  async verifyEmail(userId: string, code: string) {
    return this.verifyEmailUseCase.execute(userId, code);
  }

  /**
   * Update user role (Family/Professional)
   */
  async updateUserRole(userId: string, role: 'family' | 'professional') {
    return this.updateUserRoleUseCase.execute(userId, role);
  }

  /**
   * Update user subscription plan
   */
  async updateSubscription(userId: string, plan: string) {
    return this.updateSubscriptionUseCase.execute(userId, plan);
  }

  /**
   * Verify 2FA and complete login
   */
  async verifyLogin2FA(data: { userId: string; token: string; ip?: string; userAgent?: string }) {
    return this.verify2FALoginUseCase.execute(data);
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<IUser | null> {
    return this.userRepository.findById(userId);
  }

  /**
   * Refresh Token
   */
  async refreshToken(
    token: string,
    ip: string,
    userAgent: string
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({ 'refreshTokens.token': token });

    if (!user) {
      // REUSE DETECTION: If we can't find the token, it might have been rotated already.
      // If we decode it and find a valid familyId, we must invalidate the whole family.
      try {
        const decoded: any = jwt.verify(token, config.jwt.secret);
        if (decoded.familyId) {
          // This is a "Reused Token"! Danger!
          // Find the user who owns this familyId
          const compromisedUser = await this.userRepository.findOne({
            'refreshTokens.familyId': decoded.familyId,
          });
          if (compromisedUser) {
            // Invalidate ALL tokens for this family
            const newRefreshTokens = compromisedUser.refreshTokens.filter(
              t => t.familyId !== decoded.familyId
            );
            await this.userRepository.update(compromisedUser.id, {
              refreshTokens: newRefreshTokens,
            });
            throw new Error('REFRESH_TOKEN_REUSE_DETECTED');
          }
        }
      } catch (err: any) {
        if (err.message === 'REFRESH_TOKEN_REUSE_DETECTED') {
          throw err;
        }
        // Ignore verify errors, just throw invalid
      }
      throw new Error('INVALID_REFRESH_TOKEN');
    }

    // Token found. Verify it's valid and not expired.
    const currentToken = user.refreshTokens.find(t => t.token === token);

    if (!currentToken) {
      throw new Error('INVALID_REFRESH_TOKEN'); // Should not happen given query
    }

    // Check expiry
    if (new Date() > currentToken.expires) {
      // Remove expired token
      await this.userRepository.removeRefreshToken(token);
      throw new Error('REFRESH_TOKEN_EXPIRED');
    }

    // Rotate: Replace old token with new one in the same family
    const newFamilyId = currentToken.familyId; // Keep family ID
    const newRefreshToken = this.generateRefreshTokenString(user, newFamilyId);

    // Remove used token and add new one
    // Note: We can't easily rely on atomic operations here if we want to replace ONE token and push ANOTHER.
    // We already have the user object. Let's manipulate the array and save.
    // However, concurrency might be an issue?
    // User object in memory `user.refreshTokens` is outdated compared to DB?
    // `this.userRepository.findOne` fetches fresh.

    const validTokens = user.refreshTokens.filter(t => t.token !== token);

    validTokens.push({
      token: newRefreshToken,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      familyId: newFamilyId,
      ip,
      userAgent,
      createdAt: new Date(),
    } as any); // Cast to any to avoid strict checking on subdoc methods? Or interface matches?

    // Clean up old tokens (limit 50)
    let finalTokens = validTokens;
    if (validTokens.length > 50) {
      finalTokens = validTokens.slice(-50);
    }

    // Update user
    await this.userRepository.update(user.id, { refreshTokens: finalTokens });

    // Fetch updated user to ensure consistency? Not needed, just return access token.

    const accessToken = this.generateToken(user, { ip, userAgent });
    return { user, accessToken, refreshToken: newRefreshToken };
  }

  private generateToken(user: IUser, fingerprint?: { ip?: string; userAgent?: string }): string {
    const payload: any = {
      id: user._id ?? user.id, // Handle both id and _id
      email: user.email,
      role: user.role,
    };

    if (fingerprint) {
      payload.fingerprint = {
        ip: fingerprint.ip || 'unknown',
        userAgent: fingerprint.userAgent || 'unknown',
      };
    }

    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn as any });
  }

  generateRefreshTokenString(user: IUser, familyId?: string): string {
    const payload = {
      id: user._id ?? user.id,
      familyId: familyId || crypto.randomUUID(), // New family if not provided
      type: 'refresh',
      nonce: crypto.randomUUID(), // Ensure uniqueness even if signed in the same second
    };
    return jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.userRepository.removeRefreshToken(refreshToken);
  }
}
