import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class LoginDto {
  @IsString()
  identifier!: string;

  @IsString()
  password!: string;
}

export class AuthPayloadDto {
  id!: string;
  username!: string;
  email!: string;
}

export class AuthUserDto {
  id!: string;
  username!: string;
  email!: string;
  emailConfirmed!: boolean;
}
