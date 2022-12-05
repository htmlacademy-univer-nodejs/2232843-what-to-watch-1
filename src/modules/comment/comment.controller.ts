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
import {DocumentExistsMiddleware} from '../../middlewares/document-exists.middleware';

export default class CommentController extends Controller {
  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface) {
    super(logger);

    this.logger.info('Register routes for CommentController');
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.filmService, 'Movie', 'movieId'),
      ]
    });
  }

  public async create({body}: Request<object, object, CreateCommentDto>, res: Response): Promise<void> {
    if (!await this.filmService.exists(body.filmId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with ID ${body.filmId} is not found`,
        'CommentController'
      );
    }
    const {filmId, rating} = body;

    const comment = await this.commentService.create(body);
    await this.filmService.updateRating(filmId, rating);
    this.created(res, fillDTO(CommentResponse, comment));
  }
}

