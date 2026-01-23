// src/infrastructure/repository/UserRepository.ts

import { User, IUser } from '../../models/User';
import { BaseRepository } from './BaseRepository';
import { injectable } from 'inversify';

export interface IUserRepository extends BaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  create(idOrItem: string | Partial<IUser>, maybeItem?: Partial<IUser>): Promise<IUser>;
  findAll(limit?: number, skip?: number): Promise<IUser[]>;
  countAll(): Promise<number>;
  findOne(query: any): Promise<IUser | null>;
  removeRefreshToken(token: string): Promise<void>;
}

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).exec();
  }

  override async create(idOrItem: string | Partial<IUser>, maybeItem?: Partial<IUser>): Promise<IUser> {
    const data = typeof idOrItem === 'string' ? (maybeItem ?? {}) : idOrItem;
    const user = new User(data as any);
    return await user.save();
  }

  override async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).exec();
  }

  override async findAll(limit: number = 10, skip: number = 0): Promise<IUser[]> {
    return await User.find().skip(skip).limit(limit).exec();
  }

  async countAll(): Promise<number> {
    return await User.countDocuments().exec();
  }

  override async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  override async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findOne(query: any): Promise<IUser | null> {
    return await User.findOne(query).exec();
  }

  async removeRefreshToken(token: string): Promise<void> {
    await User.updateOne(
      { 'refreshTokens.token': token },
      { $pull: { refreshTokens: { token: token } } }
    ).exec();
  }
}
