import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { UsersService } from '../services/users.service';

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async getUserById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authenticatedUserId = req.user?.id;
      if (!authenticatedUserId)
        throw { status: 401, message: 'User not authenticated.' };
      const targetUserId = req.params.id;
      const user = await this.usersService.getUserById(
        authenticatedUserId,
        targetUserId
      );
      return res.status(200).json({ user });
    } catch (error: any) {
      next(error);
    }
  }

  async toggleFollowUser(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authenticatedUserId = req.user?.id;
      if (!authenticatedUserId)
        throw { status: 401, message: 'User not authenticated.' };
      const targetUserId = req.params.id;
      const isFollowing = await this.usersService.toggleFollowUser(
        authenticatedUserId,
        targetUserId
      );
      return res.status(200).json({ following: isFollowing });
    } catch (error: any) {
      next(error);
    }
  }
}
