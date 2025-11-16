import { NotificationDto } from '../dtos/notification.dto';
import { io } from '../index';

export class NotificationEmitterService {
  /**
   * Emit a notification to a specific user.
   */
  emitNotification(notification: NotificationDto): void {
    io.to(notification.recipient).emit('add-notification', notification);
  }

  /**
   * Emit a notification removal to a specific user.
   */
  emitNotificationRemoval(
    notificationIds: string[],
    recipientId: string
  ): void {
    io.to(recipientId).emit('remove-notification', { notificationIds });
  }

  /**
   * Emit notification removals to multiple recipients.
   */
  emitNotificationRemovalToMultipleRecipients(
    notifications: { notificationId: string; recipientId: string }[]
  ): void {
    const recipientMap: Record<string, string[]> = {};

    notifications.forEach(({ notificationId, recipientId }) => {
      if (!recipientMap[recipientId]) {
        recipientMap[recipientId] = [];
      }
      recipientMap[recipientId].push(notificationId);
    });

    Object.entries(recipientMap).forEach(([recipientId, notificationIds]) => {
      io.to(recipientId).emit('remove-notification', { notificationIds });
    });
  }
}
