import {NextFunction, Request, Response} from 'express';
import * as jose from 'jose';
import {MiddlewareInterface} from '../types/middleware.interface.js';
import {createSecretKey} from 'crypto';
import {HttpError} from '../errors/http-error.js';
import {StatusCodes} from 'http-status-codes';

export class AuthenticateMiddleware implements MiddlewareInterface {
  constructor(private readonly jwtSecret: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const {payload} = await jose.jwtVerify(token, createSecretKey(this.jwtSecret, 'utf-8'));
      // if (!payload.email || !payload.id) {
      //   return next(new HttpError(
      //     StatusCodes.BAD_REQUEST,
      //     'Email and id is required',
      //     'AuthenticateMiddleware')
      //   );
      // }
      req.user = { email: String(payload.email), id: String(payload.id) };
      // req.user = { email: payload.email as string, id: payload.id as string };
      // req.user = {email: `${payload.email}`, id: `${payload.id}`};

      return next();
    } catch {

      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthenticateMiddleware')
      );
    }
  }
}
