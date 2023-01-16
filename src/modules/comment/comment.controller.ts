import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {HttpError} from '../../errors/http-error.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {ValidateDtoMiddleware} from '../../middlewares/validate-dto.middleware.js';
import {Component} from '../../types/component.types.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {fillDTO} from '../../utils/dto.js';
import {FilmServiceInterface} from '../film/film-service.interface.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import CommentResponse from './response/comment.response.js';
import {PrivateRouteMiddleware} from '../../middlewares/private-route.middleware.js';
import {UserServiceInterface} from '../user/user-service.interface.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import {CommentRoute} from './comment.model.js';

export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface) {
    super(logger, configService);

    this.logger.info('Register routes for CommentController');
    this.addRoute({
      path: CommentRoute.ROOT,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateCommentDto),
        new PrivateRouteMiddleware(this.userService)
      ]
    });
  }

  public async create(req: Request<object, object, CreateCommentDto>, res: Response): Promise<void> {
    const {body, user} = req;
    if (!await this.filmService.exists(body.filmId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with ID ${body.filmId} is not found`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create(body, user.id);
    this.created(res, fillDTO(CommentResponse, comment));
  }
}

