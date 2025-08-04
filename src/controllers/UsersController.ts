import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { UsersService } from '../services/UsersService';

export class UsersController {
  static async getUserById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authenticatedUserId = req.user?.id;
      if (!authenticatedUserId)
        throw { status: 401, message: 'User not authenticated.' };
      const targetUserId = req.params.id;
      const user = await UsersService.getUserById(
        authenticatedUserId,
        targetUserId
      );
      return res.status(200).json({ user });
    } catch (error: any) {
      next(error);
    }
  }
}
