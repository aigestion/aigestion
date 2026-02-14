import { injectable, inject } from 'inversify';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { IUserRepository } from '../../infrastructure/repository/UserRepository';
import { TYPES } from '../../types';
import { AppError } from '../../utils/errors';
import { config } from '../../config';

@injectable()
export class RegisterUserUseCase {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async execute(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('El correo electrónico ya está registrado', 400, 'AUTH_ERROR');
    }
    // Double hashing avoided: the User model handles hashing via pre('save') hook
    const hashedPassword = password;

    // Generate Verification Code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    console.log(`[GOD MODE AUTH] Verification Code for ${email}: ${verificationCode}`);

    // Create the user via repository
    const user = await this.userRepository.create('', {
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default role, user selects Family/Pro later
      emailVerificationCode: verificationCode,
      emailVerificationExpires: verificationExpires,
      isEmailVerified: false,
    });

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshTokenString(user);

    user.refreshTokens = [
      {
        token: refreshToken,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        familyId: crypto.randomUUID(),
        ip: '127.0.0.1',
        userAgent: 'unknown',
        createdAt: new Date(),
      },
    ];

    // Use repository to update the user with tokens
    await this.userRepository.update(user.id, { refreshTokens: user.refreshTokens });

    return { user, token, refreshToken };
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
