import { SummarizedUserDto, UserDto, UserRefDto } from '../dtos/user.dto';
import { ICard } from '../models/Card';
import { IUser } from '../models/User';
import { CardMapper } from './card.mapper';

export class UserMapper {
  static toDto(
    user: IUser,
    cards: ICard[],
    favorites: ICard[],
    likes: ICard[],
    includeEmail: boolean,
    following: UserRefDto[],
    followers: UserRefDto[],
    isFollowing: boolean
  ): UserDto {
    return {
      id: user._id.toString(),
      fullName: user.fullName,
      username: user.username,
      email: includeEmail ? user.email : undefined,
      profilePicture: user.profilePicture,
      bio: user.bio,
      isFollowing,
      following,
      followers,
      cards: CardMapper.toDtoArray(cards),
      favorites: CardMapper.toDtoArray(favorites),
      likes: CardMapper.toDtoArray(likes),
    };
  }

  static toSummarizedDto(user: IUser): SummarizedUserDto {
    return {
      id: user._id.toString(),
      fullName: user.fullName,
      username: user.username,
      profilePicture: user.profilePicture,
    };
  }

  static toSummarizedDtoArray(users: IUser[]): SummarizedUserDto[] {
    return users.map((user) => this.toSummarizedDto(user));
  }
}
