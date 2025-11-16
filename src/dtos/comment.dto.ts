import { IsNotEmpty, IsString } from 'class-validator';
import { AuthorDto } from './card.dto';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  cardId!: string;

  @IsNotEmpty()
  @IsString()
  content!: string;
}

export class CommentDto {
  id!: string;
  card!: {
    id: string;
    owner?: string;
  };
  author!: AuthorDto;
  content!: string;
  likes!: string[];
  createdAt!: Date;
  updatedAt!: Date;
}
