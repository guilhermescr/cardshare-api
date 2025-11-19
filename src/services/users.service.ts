import { AuthPayloadDto } from '../dtos/auth.dto';
import { PaginatedPageResponseDto } from '../dtos/paginatedResponse.dto';
import { SummarizedUserDto, UserDto, UserRefDto } from '../dtos/user.dto';
import { UserMapper } from '../mappers/user.mapper';
import { Card, CardVisibilityEnum } from '../models/Card';
import { NotificationType } from '../models/Notification';
import { IUser } from '../models/User';
import { UserRepository } from '../repositories/user.repository';
import { NotificationEmitterService } from './notification-emitter.service';
import { NotificationService } from './notification.service';

export class UsersService {
  private userRepository = new UserRepository();
  private notificationService = new NotificationService();
  private notificationEmitterService = new NotificationEmitterService();

  async getUsers(
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedPageResponseDto<SummarizedUserDto>> {
    const query: any = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
      ];
    }

    const totalUsers = await this.userRepository.count(query);

    const totalPages = Math.ceil(totalUsers / limit);

    const users = await this.userRepository.findPaginated(
      query,
      '_id username fullName profilePicture',
      'username',
      1,
      page,
      limit
    );

    return { items: UserMapper.toSummarizedDtoArray(users), page, totalPages };
  }

  async getUserById(
    authenticatedUserId: string,
    targetUserId: string
  ): Promise<UserDto> {
    const foundUser = await this.userRepository.findById(targetUserId);

    if (!foundUser) throw { status: 404, message: 'User not found.' };

    const isSelf = authenticatedUserId === targetUserId;
    return this.buildUserDto(foundUser, isSelf, authenticatedUserId);
  }

  async getUserByUsername(
    authenticatedUserId: string,
    username: string
  ): Promise<UserDto> {
    const foundUser = await this.userRepository.findOne({ username });

    if (!foundUser) throw { status: 404, message: 'User not found.' };

    const isSelf = authenticatedUserId === foundUser._id.toString();
    return this.buildUserDto(foundUser, isSelf, authenticatedUserId);
  }

  async toggleFollowUser(
    authenticatedUser: AuthPayloadDto,
    targetUserId: string
  ): Promise<boolean> {
    const authenticatedUserId = authenticatedUser.id;

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

      const notification =
        await this.notificationService.deleteNotificationByTypeAndSender({
          type: [NotificationType.Follow],
          sender: authenticatedUserId,
          recipient: targetUserId,
        });

      if (notification) {
        this.notificationEmitterService.emitNotificationRemoval(
          [notification.id],
          targetUserId
        );
      }
    } else {
      await this.userRepository.updateOne(
        { _id: targetUserId },
        { $addToSet: { followers: authenticatedUserId } }
      );
      await this.userRepository.updateOne(
        { _id: authenticatedUserId },
        { $addToSet: { following: targetUserId } }
      );

      await this.notificationService.createAndEmitNotification({
        type: NotificationType.Follow,
        message: `started following you.`,
        sender: authenticatedUserId,
        recipient: targetUserId,
        read: false,
      });
    }

    return !isFollowing;
  }

  private async buildUserDto(
    foundUser: IUser,
    isSelf: boolean,
    authenticatedUserId?: string
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

    const isFollowing = authenticatedUserId
      ? foundUser.followers.some((id) => id.toString() === authenticatedUserId)
      : false;

    return UserMapper.toDto(
      foundUser,
      foundCards,
      favoritedCards,
      likedCards,
      isSelf,
      following,
      followers,
      isFollowing
    );
  }
}
