import { IsEmail, IsString, MinLength } from 'class-validator';
import { Example } from 'tsoa';

export class RegisterDto {
  @IsString()
  @Example('john_doe')
  username!: string;

  @IsEmail()
  @Example('john@example.com')
  email!: string;

  @IsString()
  @MinLength(8)
  @Example('password123')
  password!: string;
}

export class LoginDto {
  @IsString()
  @Example('john_doe')
  identifier!: string;

  @IsString()
  @Example('password123')
  password!: string;
}

export class AuthPayloadDto {
  @Example('user-id-123')
  id!: string;

  @Example('john_doe')
  username!: string;

  @Example('john@example.com')
  email!: string;
}

export class AuthUserDto {
  @Example('user-id-123')
  id!: string;

  @Example('john_doe')
  username!: string;

  @Example('john@example.com')
  email!: string;

  @Example(true)
  emailConfirmed!: boolean;
}
