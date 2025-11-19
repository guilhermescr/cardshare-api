import { CardDto } from './card.dto';

export interface UserRefDto {
  id: string;
  username: string;
}

export class UserDto {
  id!: string;
  fullName!: string;
  username!: string;
  email?: string;
  profilePicture!: string | null;
  bio!: string;
  cards!: CardDto[];
  favorites!: CardDto[];
  likes!: CardDto[];
  isFollowing!: boolean;
  following!: UserRefDto[];
  followers!: UserRefDto[];
}

export class SummarizedUserDto {
  id!: string;
  fullName!: string;
  username!: string;
  profilePicture!: string | null;
  followers!: number;
  following!: number;
  cards!: number;
  likes!: number;
  favorites!: number;
  comments!: number;
}
