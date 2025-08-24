import { UserDto, UserRefDto } from '../dtos/user.dto';
import { UserMapper } from '../mappers/UserMapper';
import { Card, CardVisibilityEnum, ICard } from '../models/Card';
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
      : { owner: foundUser._id, visibility: CardVisibilityEnum.public };

    const foundCards: ICard[] = await Card.find(cardQuery);

    const favoritedQuery = isSelf
      ? { favorites: foundUser._id }
      : { favorites: foundUser._id, visibility: CardVisibilityEnum.public };

    const likedQuery = isSelf
      ? { likes: foundUser._id }
      : { likes: foundUser._id, visibility: CardVisibilityEnum.public };

    const favoritedCards: ICard[] = await Card.find(favoritedQuery);
    const likedCards: ICard[] = await Card.find(likedQuery);

    const followingUsers: IUser[] = await User.find(
      { _id: { $in: foundUser.following } },
      '_id username'
    );
    const followersUsers: IUser[] = await User.find(
      { _id: { $in: foundUser.followers } },
      '_id username'
    );

    const following: UserRefDto[] = followingUsers.map((u) => ({
      id: u._id.toString(),
      username: u.username,
    }));

    const followers: UserRefDto[] = followersUsers.map((u) => ({
      id: u._id.toString(),
      username: u.username,
    }));

    return UserMapper.toDto(
      foundUser,
      foundCards,
      favoritedCards,
      likedCards,
      isSelf,
      following,
      followers
    );
  }

  static async toggleFollowUser(
    authenticatedUserId: string,
    targetUserId: string
  ): Promise<boolean> {
    if (authenticatedUserId === targetUserId)
      throw { status: 400, message: "You can't follow yourself." };

    const targetUser = await User.findById(targetUserId);
    const authUser = await User.findById(authenticatedUserId);

    if (!targetUser || !authUser)
      throw { status: 404, message: 'User not found.' };

    const isFollowing = authUser.following.some(
      (id) => id.toString() === targetUserId
    );

    if (isFollowing) {
      await User.updateOne(
        { _id: targetUserId },
        { $pull: { followers: authenticatedUserId } }
      );
      await User.updateOne(
        { _id: authenticatedUserId },
        { $pull: { following: targetUserId } }
      );
    } else {
      await User.updateOne(
        { _id: targetUserId },
        { $addToSet: { followers: authenticatedUserId } }
      );
      await User.updateOne(
        { _id: authenticatedUserId },
        { $addToSet: { following: targetUserId } }
      );
    }

    return !isFollowing;
  }
}
