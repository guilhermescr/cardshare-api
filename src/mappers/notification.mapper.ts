import { Types } from 'mongoose';
import { NotificationDto } from '../dtos/notification.dto';
import { INotification } from '../models/Notification';

type SenderParams = {
  _id: Types.ObjectId;
  username?: string;
  profilePicture?: string;
};

type SenderResult = {
  senderId: string;
  senderUsername?: string;
  profilePicture?: string;
};

function isPopulatedSender(
  sender: Types.ObjectId | SenderParams
): sender is SenderParams {
  return typeof sender === 'object' && '_id' in sender;
}

export class NotificationMapper {
  static extractSenderData(
    sender: Types.ObjectId | SenderParams
  ): SenderResult {
    let senderId = '';
    let senderUsername: string | undefined;
    let profilePicture: string | undefined;

    if (sender) {
      if (isPopulatedSender(sender)) {
        senderId = sender._id.toString();
        senderUsername = sender.username;
        profilePicture = sender.profilePicture;
      } else {
        senderId = sender.toString();
      }
    }

    return { senderId, senderUsername, profilePicture };
  }

  static toDto(notification: INotification): NotificationDto {
    const { senderId, senderUsername, profilePicture } = this.extractSenderData(
      notification.sender
    );

    return {
      id: notification._id.toString(),
      type: notification.type,
      message: notification.message,
      sender: {
        id: senderId,
        profilePicture: profilePicture || null,
        username: senderUsername || null,
      },
      recipient: notification.recipient.toString(),
      cardId: notification.cardId?.toString(),
      read: notification.read,
      createdAt: notification.createdAt.toISOString(),
    };
  }

  static toDtoArray(notifications: INotification[]): NotificationDto[] {
    return notifications.map((notification) => this.toDto(notification));
  }
}
