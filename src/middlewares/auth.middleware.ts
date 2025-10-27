import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/auth';
import { AuthPayloadDto } from '../dtos/auth.dto';
import { IUser, User } from '../models/User';
import { compare } from 'bcrypt';

export async function expressAuthenticationRecasted(
  request: any,
  _securityName: string,
  _scopes?: string[]
) {
  if (process.env.DEBUG_LOGIN === 'true') {
    const debugUser = await loginDebugUser();
    if (!debugUser) {
      throw {
        status: 401,
        message: 'Debug user does not exist or password is invalid.',
      };
    }
    return debugUser;
  }
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw {
      status: 401,
      message: 'Authorization header missing or malformed.',
    };
  }
  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET ?? '';
  try {
    const decodedJwt = jwt.verify(token, jwtSecret);
    if (typeof decodedJwt === 'object' && decodedJwt !== null) {
      return decodedJwt;
    } else {
      throw { status: 401, message: 'Invalid token payload.' };
    }
  } catch (error: any) {
    throw {
      status: 401,
      message: error.message || 'Invalid or expired token.',
    };
  }
}

async function loginDebugUser(): Promise<AuthPayloadDto | null> {
  const email = process.env.DEBUG_EMAIL || 'debug@debug.com';
  const username = process.env.DEBUG_USERNAME || 'DEBUG_USERNAME';
  const password = process.env.DEBUG_PASSWORD || 'debugpassword';

  const user: IUser | null = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) return null;

  const isMatch = await compare(password, user.password);
  if (!isMatch) return null;

  return {
    email: user.email,
    id: user._id.toString(),
    fullName: user.fullName,
    username: user.username,
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (process.env.DEBUG_LOGIN === 'true') {
    const debugUser = await loginDebugUser();
    if (!debugUser) {
      return next({
        status: 401,
        message: 'Debug user does not exist or password is invalid.',
      });
    }
    req.user = debugUser;
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next({
      status: 401,
      message: 'Authorization header missing or malformed.',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const jwtSecret = process.env.JWT_SECRET ?? '';
    const decodedJwt = jwt.verify(token, jwtSecret);

    if (typeof decodedJwt === 'object' && decodedJwt !== null) {
      req.user = decodedJwt as AuthPayloadDto;
      next();
    } else {
      return next({ status: 401, message: 'Invalid token payload.' });
    }
  } catch (error: any) {
    const message = error.message || 'Invalid or expired token.';
    return next({ status: 401, message });
  }
}
