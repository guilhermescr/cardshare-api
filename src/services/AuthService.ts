import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { User } from '../models/User';
import { JwtExpiresIn } from '../constants/jwt';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';

export class AuthService {
  static async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser)
      throw { status: 401, message: 'Username or e-mail already in use.' };

    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    const createdUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return {
      id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
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
      },
    };
  }
}
