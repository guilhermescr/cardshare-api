import { CardDto } from './card.dto';

export class UserDto {
  id!: string;
  username!: string;
  email?: string;
  cards!: CardDto[];
  favorites!: CardDto[];
  likes!: CardDto[];
}
