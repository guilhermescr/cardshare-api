import { Card } from '../models/Card';
import { User } from '../models/User';

export class UsersService {
  static async getUserById(authenticatedUserId: string, targetUserId: string) {
    const foundUser = await User.findById(targetUserId);

    if (!foundUser) throw { status: 404, message: 'User not found.' };

    const cardQuery =
      authenticatedUserId === targetUserId
        ? { owner: foundUser._id }
        : {
            owner: foundUser._id,
            isPublic: true,
          };

    const foundCards = await Card.find(cardQuery);

    return {
      id: foundUser._id,
      username: foundUser.username,
      email: authenticatedUserId === targetUserId ? foundUser.email : undefined,
      cards: foundCards,
    };
  }
}
