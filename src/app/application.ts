import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import express, {Express} from 'express';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import {ConfigInterface} from '../common/config/config.interface.js';
import {Component} from '../types/component.types.js';
import {getURI} from '../utils/db.js';
import {DatabaseInterface} from '../common/database-client/database.interface.js';
import {ControllerInterface} from '../common/controller/controller.interface.js';
import {ExceptionFilterInterface} from '../errors/exception-filter.interface.js';
import {AuthenticateMiddleware} from '../middlewares/authenticate.middleware.js';
import {getFullServerPath} from '../utils/common.js';
import cors from 'cors';

@injectable()
export default class Application {
  private expressApp: Express;

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private databaseClient: DatabaseInterface,
    @inject(Component.FilmController) private filmController: ControllerInterface,
    @inject(Component.ExceptionFilter) private exceptionFilter: ExceptionFilterInterface,
    @inject(Component.UserController) private userController: ControllerInterface,
    @inject(Component.CommentController) private commentController: ControllerInterface,
  ) {
    this.expressApp = express();
  }

  initRoutes() {
    this.expressApp.use('/films', this.filmController.router);
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/comments', this.commentController.router);
  }

  initMiddleware() {
    this.expressApp.use(express.json());
    this.expressApp.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.expressApp.use(
      '/static',
      express.static(this.config.get('STATIC_DIRECTORY_PATH'))
    );
    const authenticateMiddleware = new AuthenticateMiddleware(this.config.get('JWT_SECRET'));
    this.expressApp.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.expressApp.use(cors());
  }

  initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization…');

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();
    this.logger.info(`Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);

    const port = this.config.get('PORT');

    this.logger.info(`Get value from env $DB_USER: ${uri}`);

    await this.databaseClient.connect(uri);

    this.expressApp.listen(port);
    this.logger.info(`Server start on http://localhost:${port}`);
  }
}
