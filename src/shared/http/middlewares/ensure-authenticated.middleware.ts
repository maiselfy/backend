import { verify } from 'jsonwebtoken';
import { secret } from '../../../config/jwt/config.jwt';
import { Request, Response, NextFunction } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
interface TokenPayload {
  iat: number;
  exp: number;
  id: string;
  name: string;
  lastname: string;
  email: string;
}
export function EnsureAuthenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new HttpException('JWT token is missing', HttpStatus.UNAUTHORIZED);
  }
  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, secret);
    const { id, name, lastname, email } = decoded as TokenPayload;
    req.user = { id, name, lastname, email };
    return next();
  } catch {
    throw new HttpException('Invalid JWT Token', HttpStatus.UNAUTHORIZED);
  }
}
