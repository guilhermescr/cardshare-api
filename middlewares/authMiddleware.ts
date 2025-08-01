import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'Authorization header missing or malformed.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET ?? '';
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    const message = error.message || 'Invalid or expired token.';
    return res.status(401).json({ error: message });
  }
}
