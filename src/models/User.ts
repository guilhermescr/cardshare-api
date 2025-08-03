import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
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
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  registeredAt: {
    type: Date,
    index: true,
    default: Date.now,
  },
});

export const User = mongoose.model('User', UserSchema);
