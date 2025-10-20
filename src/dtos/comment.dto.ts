import { IsNotEmpty, IsString } from 'class-validator';

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
  cardId!: string;
  authorId!: string;
  author?: string;
  content!: string;
  likes!: string[];
  createdAt!: Date;
  updatedAt!: Date;
}
