import mongoose, { Document, Types } from 'mongoose';

export interface IComment extends Document {
  _id: Types.ObjectId;
  content: string;
  author: Types.ObjectId;
  card: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    card: {
      type: Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
    },
    likes: [
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

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
