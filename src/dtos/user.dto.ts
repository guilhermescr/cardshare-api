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
  bio!: string;
  cards!: CardDto[];
  favorites!: CardDto[];
  likes!: CardDto[];
  following!: UserRefDto[];
  followers!: UserRefDto[];
}
