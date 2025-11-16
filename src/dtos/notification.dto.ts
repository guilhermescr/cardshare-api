import { NotificationType } from '../models/Notification';

export class NotificationDto {
  id!: string;
  type!: NotificationType;
  message!: string;
  sender!: {
    id: string;
    profilePicture: string | null;
    username: string | null;
  };
  recipient!: string;
  cardId?: string;
  read!: boolean;
  createdAt!: string;
}
