import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { HttpError } from './http-error.js';
import { Component } from '../types/component.types.js';
import { createError } from './error.js';

@injectable()
export class ExceptionFilter implements ExceptionFilterInterface {
  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface) {
    this.logger.info('Зарегистрирован фильтр исключений');
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response) {
    this.logger.error(
      `[${error.detail}]: ${error.httpStatusCode} — ${error.message}`
    );
    res.status(error.httpStatusCode).json(createError(error.message));
  }

  private handleOtherError(error: Error, _req: Request, res: Response) {
    this.logger.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createError(error.message));
  }

  public catch(error: Error | HttpError, req: Request, res: Response): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res);
    }

    this.handleOtherError(error, req, res);
  }
}
