import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import cardsRoutes from './routes/cards';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/cards', cardsRoutes);

app.use(errorHandler);

const mongoUri = process.env.MONGO_URI ?? '';
mongoose.connect(mongoUri);

mongoose.connection.on('connected', () =>
  console.log('Database connection established!')
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});

export default app;
