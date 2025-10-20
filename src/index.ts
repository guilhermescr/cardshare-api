import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './swagger';
import { RegisterRoutes } from './routes';
import { authMiddleware } from './middlewares/authMiddleware';

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use('/users', authMiddleware);
app.use('/cards', authMiddleware);
app.use('/comments', authMiddleware);
RegisterRoutes(app);

setupSwagger(app);

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
