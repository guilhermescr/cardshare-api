import { Types } from 'mongoose';
import { NotificationEmitterService } from './notification-emitter.service';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationMapper } from '../mappers/notification.mapper';
import { NotificationDto } from '../dtos/notification.dto';
import { INotification, NotificationType } from '../models/Notification';

type CreateAndEmitNotificationParams = {
  type: NotificationType;
  message: string;
  sender: string;
  recipient: string;
  cardId?: string;
  commentId?: string;
  read?: boolean;
};

type DeleteNotificationByTypeAndSenderParams = {
  type: NotificationType[];
  sender: string;
  recipient: string;
  cardId?: string;
  commentId?: string;
};

export class NotificationService {
  private notificationRepository = new NotificationRepository();
  private notificationEmitterService = new NotificationEmitterService();

  async getNotificationsForUser(userId: string): Promise<NotificationDto[]> {
    const notifications = await this.notificationRepository.findByRecipient(
      userId,
      {
        sort: { createdAt: -1 },
      }
    );

    return NotificationMapper.toDtoArray(notifications);
  }

  async createNotification(
    data: Partial<INotification>
  ): Promise<NotificationDto> {
    const notification = await this.notificationRepository.create(data);
    return NotificationMapper.toDto(notification);
  }

  async createAndEmitNotification({
    type,
    message,
    sender,
    recipient,
    cardId,
    commentId,
    read = false,
  }: CreateAndEmitNotificationParams): Promise<void> {
    if (sender === recipient) {
      return;
    }

    const createdNotification = await this.createNotification({
      type,
      message,
      sender: new Types.ObjectId(sender),
      recipient: new Types.ObjectId(recipient),
      cardId: cardId ? new Types.ObjectId(cardId) : undefined,
      commentId: commentId ? new Types.ObjectId(commentId) : undefined,
      read,
    });

    this.notificationEmitterService.emitNotification(createdNotification);
  }

  async markNotificationAsRead(
    notificationId: string
  ): Promise<NotificationDto | null> {
    const notification = await this.notificationRepository.markAsRead(
      notificationId
    );
    return notification ? NotificationMapper.toDto(notification) : null;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await this.notificationRepository.updateMany(
      { recipient: new Types.ObjectId(userId), read: false },
      { read: true }
    );
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this.notificationRepository.deleteById(notificationId);
  }

  async deleteNotificationByTypeAndSender({
    type,
    sender,
    recipient,
    cardId,
    commentId,
  }: DeleteNotificationByTypeAndSenderParams): Promise<NotificationDto | null> {
    const query: any = {
      type: { $in: type },
      sender: new Types.ObjectId(sender),
      recipient: new Types.ObjectId(recipient),
    };

    if (cardId) {
      query.cardId = new Types.ObjectId(cardId);
    }

    if (commentId) {
      query.commentId = new Types.ObjectId(commentId);
    }

    const notification = await this.notificationRepository.findOneByRecipient(
      query
    );

    if (!notification) {
      return null;
    }

    await this.notificationRepository.deleteOne(query);

    return NotificationMapper.toDto(notification);
  }

  async deleteAllNotificationsForUser(userId: string): Promise<void> {
    await this.notificationRepository.deleteAllByRecipient(userId);
  }
}
