import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { secret } from '../../../config/jwt/config.jwt';

export function EnsureAuthenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('JWT token is missing');
  }
  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, secret);
    console.log(decoded);
    return next();
  } catch {
    throw new Error('Invalid JWT Token');
  }
}
