import {HttpMethod} from './http-method.enum.js';
import {NextFunction, Request, Response} from 'express';

export interface RouteInterface<Path extends string> {
  path: Path;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
}
