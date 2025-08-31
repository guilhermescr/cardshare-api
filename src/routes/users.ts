import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { UserRepository } from '../repositories/user.repository';

const router = express.Router();

const usersService = new UsersService(new UserRepository());
const usersController = new UsersController(usersService);

router.use(authMiddleware);
router.get('/:id', usersController.getUserById.bind(usersController));
router.post(
  '/:id/follow',
  usersController.toggleFollowUser.bind(usersController)
);

export default router;
