import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { JwtExpiresIn } from '../constants/jwt';
import { AuthUserDto, LoginDto, RegisterDto } from '../dtos/auth.dto';
import { randomBytes } from 'crypto';
import { sendEmail } from './email.service';
import { AuthMapper } from '../mappers/auth.mapper';
import { UserRepository } from '../repositories/user.repository';

export class AuthService {
  private userRepository = new UserRepository();

  async register(registerDto: RegisterDto): Promise<AuthUserDto> {
    const { username, email, password } = registerDto;

    const existingUser = await this.userRepository.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser)
      throw { status: 409, message: 'Username or email already in use.' };

    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    const emailConfirmationToken = randomBytes(32).toString('hex');

    const createdUserDoc = await this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      emailConfirmationToken,
      emailConfirmed: false,
      followers: [],
      following: [],
    });

    const createdUser = await this.userRepository.findById(
      String(createdUserDoc._id)
    );

    if (!createdUser) throw { status: 400, message: 'User creation failed.' };

    const apiBaseUrl = process.env.API_BASE_URL ?? 'http://localhost:3000';
    const confirmationUrl = `${apiBaseUrl}/auth/confirm-email?token=${emailConfirmationToken}`;

    await sendEmail(
      createdUser.email,
      'Confirm your CardShare email',
      createdUser.username,
      confirmationUrl
    );

    return AuthMapper.toAuthUserDto(createdUser);
  }

  async confirmEmail(emailConfirmationToken: string): Promise<AuthUserDto> {
    if (!emailConfirmationToken) {
      throw {
        status: 400,
        message: 'Email confirmation token is required!',
      };
    }

    const existingUser = await this.userRepository.findOne({
      emailConfirmationToken,
    });
    if (!existingUser) {
      throw {
        status: 404,
        message: 'Invalid or expired email confirmation token.',
      };
    }

    if (existingUser.emailConfirmed) {
      throw {
        status: 409,
        message: 'Email already confirmed.',
      };
    }

    existingUser.emailConfirmed = true;
    existingUser.emailConfirmationToken = undefined;
    await existingUser.save();

    return AuthMapper.toAuthUserDto(existingUser);
  }

  async login(
    loginDto: LoginDto
  ): Promise<{ token: string; user: AuthUserDto }> {
    const { identifier, password } = loginDto;

    const existingUser = await this.userRepository.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!existingUser)
      throw {
        status: 401,
        message: 'There is no user with this e-mail or username.',
      };

    if (!existingUser.emailConfirmed) {
      throw {
        status: 403,
        message: 'Please, confirm your email before logging in.',
      };
    }

    const isMatch = await compare(password, existingUser.password);
    if (!isMatch) throw { status: 401, message: 'Invalid password.' };

    const payload = AuthMapper.toAuthPayloadDto(existingUser);
    const secret = process.env.JWT_SECRET ?? '';
    const envExpiresIn = process.env.JWT_EXPIRES_IN as JwtExpiresIn;
    const expiresIn = Object.values(JwtExpiresIn).includes(envExpiresIn)
      ? envExpiresIn
      : JwtExpiresIn.OneHour;
    const token = jwt.sign(payload, secret, {
      expiresIn,
    });

    return {
      token,
      user: AuthMapper.toAuthUserDto(existingUser),
    };
  }
}
