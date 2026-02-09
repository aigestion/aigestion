import { injectable, inject } from 'inversify';
import type { IUserRepository } from '../../infrastructure/repository/UserRepository';
import { TYPES } from '../../types';
import { AppError } from '../../utils/errors';

@injectable()
export class UpdateUserRoleUseCase {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async execute(userId: string, role: 'family' | 'professional'): Promise<any> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuario no encontrado', 404, 'NOT_FOUND');
    }

    // Update role
    await this.userRepository.update(userId, { role });

    // Return updated user (excluding password)
    const updatedUser = await this.userRepository.findById(userId);
    return updatedUser;
  }
}
