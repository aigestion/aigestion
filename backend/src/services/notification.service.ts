import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { INotificationRepository } from '../infrastructure/repository/NotificationRepository';
import { SocketService } from './socket.service';
import { INotification, NotificationType } from '../models/Notification';
import { logger } from '../utils/logger';

@injectable()
export class NotificationService {
  constructor(
    @inject(TYPES.NotificationRepository) private notificationRepo: INotificationRepository,
    @inject(TYPES.SocketService) private socketService: SocketService,
  ) {}

  /**
   * Creates a new notification and emits it via WebSocket.
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
  ): Promise<INotification> {
    logger.info(`[NotificationService] Creating notification for user ${userId}: ${title}`);

    const notification = await this.notificationRepo.create({
      userId,
      type,
      title,
      message,
      data,
      read: false,
    } as any);

    // Emit via WebSocket to the specific user
    this.socketService.emitToUser(userId, 'notification:new', notification);

    return notification;
  }

  /**
   * Gets the latest notifications for a user.
   */
  async getNotifications(userId: string, limit: number = 20): Promise<INotification[]> {
    return await this.notificationRepo.findByUser(userId, limit);
  }

  /**
   * Marks a specific notification as read.
   */
  async markAsRead(id: string, userId: string): Promise<INotification | null> {
    const notification = await this.notificationRepo.findById(id);
    if (!notification || notification.userId !== userId) {
      return null;
    }
    return await this.notificationRepo.markAsRead(id);
  }

  /**
   * Marks all notifications for a user as read.
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo.markAllAsRead(userId);
  }
}
