import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { UsersController } from '../controllers/UsersController';

const router = express.Router();

router.use(authMiddleware);
router.get('/:id', UsersController.getUserById);
router.post('/:id/follow', UsersController.toggleFollowUser);

export default router;
