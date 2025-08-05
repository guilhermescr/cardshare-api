import mongoose, { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  emailConfirmed: boolean;
  emailConfirmationToken?: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please, fill a valid email address.',
      ],
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    emailConfirmationToken: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', UserSchema);
