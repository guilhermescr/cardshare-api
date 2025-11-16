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
  emitNotificationRemoval(notificationId: string, recipientId: string): void {
    io.to(recipientId).emit('remove-notification', { notificationId });
  }

  /**
   * Remove all listeners for a specific user (optional cleanup method).
   */
  removeListenersForUser(userId: string): void {
    const socket = io.sockets.sockets.get(userId);
    if (socket) {
      socket.removeAllListeners();
    }
  }
}
