import {HttpMethod} from './http-method.enum.js';
import {NextFunction, Request, Response} from 'express';
import { MiddlewareInterface } from './middleware.interface.js';

export interface RouteInterface<Path extends string> {
  path: Path;
  method: HttpMethod;
  middlewares?: MiddlewareInterface[];
  handler: (req: Request, res: Response, next: NextFunction) => void;
}
