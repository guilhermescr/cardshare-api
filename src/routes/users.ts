import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { UsersController } from '../controllers/UsersController';

const router = express.Router();

router.use(authMiddleware);
router.get('/:id', UsersController.getUserById);

export default router;
