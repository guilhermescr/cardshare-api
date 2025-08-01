import express from 'express';
import { UserController } from '../controllers/UserController';
// import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
// router.post('/cards', authMiddleware, CardsController.create)

export default router;
