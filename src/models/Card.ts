import mongoose, { Document, Types } from 'mongoose';

export interface ICard extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  isPublic: boolean;
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
    isPublic: {
      type: Boolean,
      default: false,
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
