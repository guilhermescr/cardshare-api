import { AuthUserDto, AuthPayloadDto } from '../dtos/auth.dto';
import { IUser } from '../models/User';

export class AuthMapper {
  static toAuthUserDto(user: IUser): AuthUserDto {
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      emailConfirmed: user.emailConfirmed,
    };
  }

  static toAuthPayloadDto(user: IUser): AuthPayloadDto {
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    };
  }
}
