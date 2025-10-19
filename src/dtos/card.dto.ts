import { IsOptional, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CardVisibilityEnum } from '../models/Card';
import { Transform } from 'class-transformer';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(CardVisibilityEnum)
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value
  )
  visibility?: CardVisibilityEnum;
}

export class UpdateCardDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(CardVisibilityEnum)
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value
  )
  visibility?: CardVisibilityEnum;
}

export class CardDto {
  id!: string;
  title!: string;
  description?: string | null;
  imageUrl?: string | null;
  visibility!: CardVisibilityEnum;
  owner!: string;
  ownerUsername?: string;
  isLiked?: boolean;
  isFavorited?: boolean;
  likes!: string[];
  favorites!: string[];
  createdAt!: Date;
  updatedAt!: Date;
}
