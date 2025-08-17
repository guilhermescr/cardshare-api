import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/auth';
import { AuthPayloadDto } from '../dtos/auth.dto';
import mongoose from 'mongoose';

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (process.env.DEBUG_LOGIN === 'true') {
    req.user = {
      email: process.env.DEBUG_EMAIL || 'debug@debug.com',
      id: new mongoose.Types.ObjectId().toString(),
      username: process.env.DEBUG_USERNAME || 'DEBUG_USERNAME',
    };
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
