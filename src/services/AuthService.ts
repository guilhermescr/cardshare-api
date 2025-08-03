import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { User } from '../models/User';
import { JwtExpiresIn } from '../constants/jwt';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { randomBytes } from 'crypto';
import { sendEmail } from './EmailService';

export class AuthService {
  static async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser)
      throw { status: 409, message: 'Username or email already in use.' };

    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    const emailConfirmationToken = randomBytes(32).toString('hex');

    const createdUser = await User.create({
      username,
      email,
      password: hashedPassword,
      emailConfirmationToken,
      emailConfirmed: false,
    });

    const apiBaseUrl = process.env.API_BASE_URL ?? 'http://localhost:3000';
    const confirmationUrl = `${apiBaseUrl}/auth/confirm-email?token=${emailConfirmationToken}`;

    await sendEmail(
      createdUser.email,
      'Confirm your Cards API email',
      createdUser.username,
      confirmationUrl
    );

    return {
      id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
      emailConfirmed: createdUser.emailConfirmed,
    };
  }

  static async confirmEmail(emailConfirmationToken: string) {
    if (!emailConfirmationToken) {
      throw {
        status: 400,
        message: 'Email confirmation token is required!',
      };
    }

    const existingUser = await User.findOne({
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

    return {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      emailConfirmed: existingUser.emailConfirmed,
    };
  }

  static async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

    const existingUser = await User.findOne({
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

    const payload = {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
    };
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
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        emailConfirmed: existingUser.emailConfirmed,
      },
    };
  }
}
