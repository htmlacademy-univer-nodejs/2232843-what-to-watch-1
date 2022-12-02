import { NextFunction, Request, Response } from 'express';

export type ExceptionFilterInterface = {
  catch(error: Error, req: Request, res: Response, next: NextFunction): void;
};
