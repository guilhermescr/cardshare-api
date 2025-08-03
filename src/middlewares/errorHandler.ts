import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = error.status || 500;
  res.status(status).json({ error: error.message || 'Internal Server Error' });
}
