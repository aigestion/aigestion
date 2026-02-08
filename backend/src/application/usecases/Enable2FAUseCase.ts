import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { User } from '../../models/User';
import { TwoFactorService } from '../../services/two-factor.service';
import { AppError } from '../../utils/errors';

@injectable()
export class Enable2FAUseCase {
  constructor(@inject(TYPES.TwoFactorService) private twoFactorService: TwoFactorService) {}

  async execute(userId: string): Promise<{ secret: string; qrCode: string }> {
    const user = await (User as any).findById(userId).exec();
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    if (!user.email) {
      throw new AppError('User email not found', 400, 'USER_EMAIL_MISSING');
    }

    const { secret, qrCode } = await this.twoFactorService.generateTOTPSecret(
      user.id as string,
      user.email,
    );
    user.twoFactorSecret = secret;
    user.isMfaEnabled = false; // will be true after verification
    await user.save();
    return { secret, qrCode };
  }
}
