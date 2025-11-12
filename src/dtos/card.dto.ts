import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { CardVisibilityEnum } from '../models/Card';
import { Transform } from 'class-transformer';
import { CommentDto } from './comment.dto';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mediaUrls?: string[];

  @IsEnum(CardVisibilityEnum)
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value
  )
  visibility?: CardVisibilityEnum;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  gradient?: string;

  @IsBoolean()
  @IsOptional()
  allowComments?: boolean;

  @IsBoolean()
  @IsOptional()
  allowDownloads?: boolean;
}

export class UpdateCardDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mediaUrls?: string[];

  @IsEnum(CardVisibilityEnum)
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value
  )
  visibility?: CardVisibilityEnum;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  gradient?: string;

  @IsBoolean()
  @IsOptional()
  allowComments?: boolean;

  @IsBoolean()
  @IsOptional()
  allowDownloads?: boolean;
}

export class AuthorDto {
  id!: string;
  username?: string;
  profilePicture?: string;
}

export class CardDto {
  id!: string;
  title!: string;
  description?: string | null;
  mediaUrls!: string[];
  visibility!: CardVisibilityEnum;
  author!: AuthorDto;
  isLiked?: boolean;
  isFavorited?: boolean;
  likes!: string[];
  favorites!: string[];
  comments!: string[];
  tags!: string[];
  category!: string;
  gradient!: string;
  allowComments!: boolean;
  allowDownloads!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export class PopulatedCardDto {
  id!: string;
  title!: string;
  description?: string | null;
  mediaUrls!: string[];
  visibility!: CardVisibilityEnum;
  author!: AuthorDto;
  isLiked?: boolean;
  isFavorited?: boolean;
  likes!: string[];
  favorites!: string[];
  comments!: CommentDto[];
  tags!: string[];
  category!: string;
  gradient!: string;
  allowComments!: boolean;
  allowDownloads!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export interface RelatedCardDto {
  id: string;
  title: string;
  author: {
    id: string;
    username?: string;
    profilePicture?: string;
  };
  gradient: string;
}
