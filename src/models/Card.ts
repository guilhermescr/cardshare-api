import mongoose, { Document, Types } from 'mongoose';

export enum CardVisibilityEnum {
  private = 'private',
  public = 'public',
  unlisted = 'unlisted',
}

export interface ICard extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  visibility: CardVisibilityEnum;
  owner: Types.ObjectId | { _id: Types.ObjectId; username?: string };
  likes: Types.ObjectId[];
  favorites: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

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
    imageUrl: {
      type: String,
    },
    visibility: {
      type: String,
      enum: Object.values(CardVisibilityEnum),
      default: 'public',
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
  },
  {
    timestamps: true,
  }
);

export const Card = mongoose.model('Card', CardSchema);
