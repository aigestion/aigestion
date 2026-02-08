import { injectable } from 'inversify';
import { BaseRepository } from './BaseRepository';
import { Mission, IMission } from '../../models/Mission';

export interface IMissionRepository extends BaseRepository<IMission> {
  create(idOrItem: any, maybeItem?: any): Promise<IMission>;
  findAll(limit?: number, skip?: number): Promise<IMission[]>;
}

@injectable()
export class MissionRepository extends BaseRepository<IMission> implements IMissionRepository {
  override async create(idOrItem: any, maybeItem?: any): Promise<IMission> {
    const data = typeof idOrItem === 'string' ? maybeItem ?? {} : idOrItem;
    const mission = new Mission(data as any);
    return await mission.save();
  }

  override async findById(id: string): Promise<IMission | null> {
    return await Mission.findById(id).exec();
  }

  override async findAll(limit: number = 20, skip: number = 0): Promise<IMission[]> {
    return await Mission.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
  }

  override async update(id: string, data: Partial<IMission>): Promise<IMission | null> {
    return await Mission.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  override async delete(id: string): Promise<boolean> {
    const result = await Mission.findByIdAndDelete(id).exec();
    return !!result;
  }
}
