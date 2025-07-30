import mongoose from 'mongoose';

const { Schema } = mongoose;

const CardSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Card = mongoose.model('Card', CardSchema);
