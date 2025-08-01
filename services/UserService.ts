import { compare, hash } from 'bcrypt';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

enum JwtExpiresIn {
  OneHour = '1h',
  OneDay = '1d',
  SevenDays = '7d',
  ThirtyMinutes = '30m',
}

export class UserService {
  static async register(username: string, email: string, password: string) {
    if (!username) throw new Error('Username is required!');
    if (!email) throw new Error('E-mail is required!');
    if (!password) throw new Error('Password is required!');

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) throw new Error('Username or e-mail already in use.');

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

  static async login(identifier: string, password: string) {
    if (!identifier) throw new Error('E-mail or username is required!');
    if (!password) throw new Error('Password is required!');

    const existingUser = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!existingUser) throw new Error('There is no user with this e-mail.');

    const isMatch = await compare(password, existingUser.password);
    if (!isMatch) throw new Error('Invalid password.');

    const payload = {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
    };
    const secret = process.env.JWT_SECRET ?? '';
    const envExpiresIn = process.env.JWT_EXPIRES_IN as JwtExpiresIn;
    const expiresIn: JwtExpiresIn = Object.values(JwtExpiresIn).includes(
      envExpiresIn
    )
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
