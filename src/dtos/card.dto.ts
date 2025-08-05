import { IsBoolean, IsOptional, IsString, IsNotEmpty } from 'class-validator';

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

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
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

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class CardDto {
  id!: string;
  title!: string;
  description?: string | null;
  imageUrl?: string | null;
  isPublic!: boolean;
  owner!: string;
  ownerUsername?: string;
  likes!: string[];
  favorites!: string[];
  createdAt!: Date;
  updatedAt!: Date;
}
