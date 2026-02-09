import { injectable, inject } from 'inversify';
import type { IUserRepository } from '../../infrastructure/repository/UserRepository';
import { TYPES } from '../../types';
import { AppError } from '../../utils/errors';

@injectable()
export class UpdateSubscriptionUseCase {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async execute(userId: string, plan: string): Promise<any> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuario no encontrado', 404, 'NOT_FOUND');
    }

    // Update subscription plan
    // In a real scenario, this might trigger Stripe logic.
    // For now, we update the DB field.
    await this.userRepository.update(userId, { subscriptionPlan: plan });

    // Return updated user
    const updatedUser = await this.userRepository.findById(userId);
    return updatedUser;
  }
}
