import { UserDto } from '../dtos/user.dto';
import { UserMapper } from '../mappers/UserMapper';
import { Card, ICard } from '../models/Card';
import { IUser, User } from '../models/User';

export class UsersService {
  static async getUserById(
    authenticatedUserId: string,
    targetUserId: string
  ): Promise<UserDto> {
    const foundUser: IUser | null = await User.findById(targetUserId);

    if (!foundUser) throw { status: 404, message: 'User not found.' };

    const isSelf = authenticatedUserId === targetUserId;

    const cardQuery = isSelf
      ? { owner: foundUser._id }
      : { owner: foundUser._id, isPublic: true };

    const foundCards: ICard[] = await Card.find(cardQuery);

    const favoritedQuery = isSelf
      ? { favorites: foundUser._id }
      : { favorites: foundUser._id, isPublic: true };

    const likedQuery = isSelf
      ? { likes: foundUser._id }
      : { likes: foundUser._id, isPublic: true };

    const favoritedCards: ICard[] = await Card.find(favoritedQuery);
    const likedCards: ICard[] = await Card.find(likedQuery);

    return UserMapper.toDto(
      foundUser,
      foundCards,
      favoritedCards,
      likedCards,
      isSelf
    );
  }
}
