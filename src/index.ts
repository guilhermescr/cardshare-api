import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './swagger';
import { RegisterRoutes } from './routes';
import { authMiddleware } from './middlewares/auth.middleware';
import upload from './middlewares/upload.middleware';

dotenv.config();

const app = express();

app.use(
  express.json({
    limit: '10mb',
  })
);
app.use(
  express.urlencoded({
    limit: '10mb',
    extended: true,
  })
);

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use('/users', authMiddleware);
app.use('/cards', authMiddleware, upload.array('files', 10));
app.use('/comments', authMiddleware);
app.use('/upload', authMiddleware);

app.post('/upload/profile-picture', upload.single('file'), (req, res, next) => {
  next();
});

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
