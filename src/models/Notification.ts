import mongoose, { Document, Schema, Types } from 'mongoose';

export enum NotificationType {
  CardLike = 'card_like',
  CommentLike = 'comment_like',
  Comment = 'comment',
  Follow = 'follow',
  Other = 'other',
}

export interface INotification extends Document {
  _id: Types.ObjectId;
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  type: NotificationType;
  cardId?: Types.ObjectId;
  commentId?: Types.ObjectId;
  message: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    cardId: { type: Schema.Types.ObjectId, ref: 'Card' },
    commentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>(
  'Notification',
  NotificationSchema
);
