import mongoose, { Document, Types } from 'mongoose';
import { IComment } from './Comment';

export enum CardVisibilityEnum {
  private = 'private',
  public = 'public',
  unlisted = 'unlisted',
}

export interface ICard extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string | null;
  mediaUrls: string[];
  visibility: CardVisibilityEnum;
  owner: Types.ObjectId | { _id: Types.ObjectId; username?: string };
  likes: Types.ObjectId[];
  favorites: Types.ObjectId[];
  comments: Types.ObjectId[];
  tags: string[];
  category: string;
  gradient: string;
  allowComments: boolean;
  allowDownloads: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IPopulatedCard = Omit<ICard, 'comments'> & {
  comments: IComment[];
};

const { Schema } = mongoose;

const CardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    mediaUrls: [
      {
        type: String,
        required: false,
      },
    ],
    visibility: {
      type: String,
      enum: Object.values(CardVisibilityEnum),
      default: CardVisibilityEnum.public,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    tags: [
      {
        type: String,
        required: false,
      },
    ],
    category: {
      type: String,
      required: false,
    },
    gradient: {
      type: String,
      required: false,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    allowDownloads: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Card = mongoose.model<ICard>('Card', CardSchema);
