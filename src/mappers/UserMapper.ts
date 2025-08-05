import { UserDto } from '../dtos/user.dto';
import { ICard } from '../models/Card';
import { IUser } from '../models/User';
import { CardMapper } from './CardMapper';

export class UserMapper {
  static toDto(
    user: IUser,
    cards: ICard[],
    favorites: ICard[],
    likes: ICard[],
    includeEmail: boolean
  ): UserDto {
    return {
      id: user._id.toString(),
      username: user.username,
      email: includeEmail ? user.email : undefined,
      cards: CardMapper.toDtoArray(cards),
      favorites: CardMapper.toDtoArray(favorites),
      likes: CardMapper.toDtoArray(likes),
    };
  }
}
