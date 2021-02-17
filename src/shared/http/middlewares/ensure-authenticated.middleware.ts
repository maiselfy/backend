import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import {} from '../../../config/jwt';
@Injectable()
export class EnsureAuthenticatedMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('JWT token is missing');
    }
    const [, token] = authHeader.split(' ');
    const decoded = await verify();
    next();
  }
}
