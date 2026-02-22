import { injectable } from 'inversify';
import { BaseRepository } from './BaseRepository';
import { Notification, INotification } from '../../models/Notification';

export interface INotificationRepository extends BaseRepository<INotification> {
  findByUser(userId: string, limit?: number, skip?: number): Promise<INotification[]>;
  markAsRead(id: string): Promise<INotification | null>;
  markAllAsRead(userId: string): Promise<void>;
}

@injectable()
export class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  override async findAll(): Promise<INotification[]> {
    return await Notification.find().sort({ createdAt: -1 }).exec();
  }

  override async create(idOrItem: unknown, maybeItem?: unknown): Promise<INotification> {
    const data = typeof idOrItem === 'string' ? (maybeItem ?? {}) : idOrItem;
    const notification = new Notification(data as Record<string, unknown>);
    return await notification.save();
  }

  override async findById(id: string): Promise<INotification | null> {
    return await Notification.findById(id).exec();
  }

  async findByUser(userId: string, limit: number = 50, skip: number = 0): Promise<INotification[]> {
    return await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async markAsRead(id: string): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(id, { read: true }, { new: true }).exec();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany({ userId, read: false }, { read: true }).exec();
  }

  override async update(id: string, data: Partial<INotification>): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  override async delete(id: string): Promise<boolean> {
    const result = await Notification.findByIdAndDelete(id).exec();
    return !!result;
  }
}
