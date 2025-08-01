import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import usersRoutes from './routes/users';

dotenv.config();

const app = express();
app.use(express.json());
app.use(usersRoutes);

const mongoUri = process.env.MONGO_URI ?? '';
mongoose.connect(mongoUri);

mongoose.connection.on('connected', () =>
  console.log('Database connection established!')
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('API is running on http://localhost:3000');
});

module.exports = app;
