import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { User } from '../../models/User';
import { TwoFactorService } from '../../services/two-factor.service';
import { RateLimitService } from '../../services/rate-limit.service';
import { AppError } from '../../utils/errors';

@injectable()
export class Verify2FAUseCase {
  constructor(
    @inject(TYPES.TwoFactorService) private twoFactorService: TwoFactorService,
    @inject(TYPES.RateLimitService) private rateLimitService: RateLimitService
  ) {}

  async execute(userId: string, token: string): Promise<void> {
    // Rate Limit: 5 attempts per 15 minutes
    await this.rateLimitService.incrementAndCheck(`2fa_verify:${userId}`, 5, 15 * 60);

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    if (!user.twoFactorSecret) {
      throw new AppError('2FA not enabled for this user', 400, '2FA_NOT_ENABLED');
    }
    const isValid = this.twoFactorService.verifyToken(user.twoFactorSecret, token);
    if (!isValid) {
      throw new AppError('Invalid 2FA token', 401, 'INVALID_2FA_TOKEN');
    }
    // Mark MFA as enabled after successful verification
    user.isMfaEnabled = true;
    // Optionally, you could clear the secret after verification for added security
    // user.twoFactorSecret = undefined;
    // Clear rate limit on success
    await this.rateLimitService.reset(`2fa_verify:${userId}`);
    await user.save();
  }
}
