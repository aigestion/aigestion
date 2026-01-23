import { inject, injectable } from 'inversify';
import { CreateUserDto, UpdateUserDto } from '../middleware/validation.middleware';
import type { IUserRepository } from '../infrastructure/repository/UserRepository';
import { IUser, User } from '../models/User';
import { TYPES } from '../types';

@injectable()
export class UserService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async create(data: CreateUserDto): Promise<IUser> {
    const user = new User(data);
    return this.userRepository.create(user);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: IUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.userRepository.findAll(limit, skip),
      this.userRepository.countAll(),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IUser | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async update(id: string, data: UpdateUserDto): Promise<IUser | null> {
    return this.userRepository.update(id, data as Partial<IUser>);
  }

  async delete(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
