import { UserDto, UserRefDto } from '../dtos/user.dto';
import { UserMapper } from '../mappers/user.mapper';
import { Card, CardVisibilityEnum } from '../models/Card';
import { IUser } from '../models/User';
import { UserRepository } from '../repositories/user.repository';

export class UsersService {
  private userRepository = new UserRepository();

  async getUserById(
    authenticatedUserId: string,
    targetUserId: string
  ): Promise<UserDto> {
    const foundUser = await this.userRepository.findById(targetUserId);

    if (!foundUser) throw { status: 404, message: 'User not found.' };

    const isSelf = authenticatedUserId === targetUserId;
    return this.buildUserDto(foundUser, isSelf);
  }

  async getUserByUsername(
    authenticatedUserId: string,
    username: string
  ): Promise<UserDto> {
    const foundUser = await this.userRepository.findOne({ username });

    if (!foundUser) throw { status: 404, message: 'User not found.' };

    const isSelf = authenticatedUserId === foundUser._id.toString();
    return this.buildUserDto(foundUser, isSelf);
  }

  async toggleFollowUser(
    authenticatedUserId: string,
    targetUserId: string
  ): Promise<boolean> {
    if (authenticatedUserId === targetUserId)
      throw { status: 400, message: "You can't follow yourself." };

    const targetUser = await this.userRepository.findById(targetUserId);
    const authUser = await this.userRepository.findById(authenticatedUserId);

    if (!targetUser || !authUser)
      throw { status: 404, message: 'User not found.' };

    const isFollowing = authUser.following.some(
      (id) => id.toString() === targetUserId
    );

    if (isFollowing) {
      await this.userRepository.updateOne(
        { _id: targetUserId },
        { $pull: { followers: authenticatedUserId } }
      );
      await this.userRepository.updateOne(
        { _id: authenticatedUserId },
        { $pull: { following: targetUserId } }
      );
    } else {
      await this.userRepository.updateOne(
        { _id: targetUserId },
        { $addToSet: { followers: authenticatedUserId } }
      );
      await this.userRepository.updateOne(
        { _id: authenticatedUserId },
        { $addToSet: { following: targetUserId } }
      );
    }

    return !isFollowing;
  }

  private async buildUserDto(
    foundUser: IUser,
    isSelf: boolean
  ): Promise<UserDto> {
    const cardQuery = isSelf
      ? { owner: foundUser._id }
      : { owner: foundUser._id, visibility: CardVisibilityEnum.public };

    const favoritedQuery = isSelf
      ? { favorites: foundUser._id }
      : { favorites: foundUser._id, visibility: CardVisibilityEnum.public };

    const likedQuery = isSelf
      ? { likes: foundUser._id }
      : { likes: foundUser._id, visibility: CardVisibilityEnum.public };

    const [foundCards, favoritedCards, likedCards] = await Promise.all([
      Card.find(cardQuery),
      Card.find(favoritedQuery),
      Card.find(likedQuery),
    ]);

    const [followingUsers, followersUsers] = await Promise.all([
      this.userRepository.find(
        { _id: { $in: foundUser.following } },
        '_id username'
      ),
      this.userRepository.find(
        { _id: { $in: foundUser.followers } },
        '_id username'
      ),
    ]);

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
}
