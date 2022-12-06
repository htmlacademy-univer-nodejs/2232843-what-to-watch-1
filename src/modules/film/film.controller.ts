import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as core from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { HttpError } from '../../errors/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { CreateFilmDto } from './dto/create-film.dto.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { FilmRoute } from './film.model.js';
import { FilmResponse } from './response/film.response.js';
import { fillDTO } from '../../utils/dto.js';
import { ValidateObjectIdMiddleware } from '../../middlewares/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../middlewares/document-exists.middleware.js';
import { ValidateDtoMiddleware } from '../../middlewares/validate-dto.middleware.js';
import CommentResponse from '../comment/response/comment.response.js';
import {CommentServiceInterface} from '../comment/comment-service.interface';
import {PrivateRouteMiddleware} from '../../middlewares/private-route.middleware.js';

@injectable()
export class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
  @inject(Component.CommentServiceInterface) private commentService: CommentServiceInterface
  ) {
    super(logger);
    this.logger.info('Зарегистрированы маршруты для FilmController');

    this.addRoute<FilmRoute>({
      path: FilmRoute.ROOT,
      method: HttpMethod.Get,
      handler: this.index,
    });

    this.addRoute<FilmRoute>({
      path: FilmRoute.CREATE,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateFilmDto)
      ],
    });

    this.addRoute<FilmRoute>({
      path: FilmRoute.FILM,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ],
    });

    this.addRoute<FilmRoute>({
      path: FilmRoute.FILM,
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ],
    });

    this.addRoute({
      path: FilmRoute.FILM,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ],
    });

    this.addRoute({
      path: FilmRoute.PROMO,
      method: HttpMethod.Get,
      handler: this.getPromo,
      middlewares: [
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ],
    });
  }

  async index(_req: Request, res: Response): Promise<void> {
    const films = await this.filmService.find();
    const filmsResponse = fillDTO(FilmResponse, films);
    this.ok(res, filmsResponse);
  }

  async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response
  ): Promise<void> {
    const {body, user} = req;
    const result = await this.filmService.create({...body, userId: user.id});
    this.created(res, fillDTO(FilmResponse, result));
  }

  async show(
    { params }: Request<Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const result = await this.filmService.findById(`${params.filmId}`);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  async update(
    {
      params,
      body,
    }: Request<Record<string, string>, Record<string, unknown>, UpdateFilmDto>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.findById(params.filmId);

    if (!film) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with «${params.id}» is not found`,
        'FilmController'
      );
    }

    const result = await this.filmService.updateById(params.filmId, body);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  async delete(
    { params }: Request<Record<string, string>>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.findById(`${params.id}`);

    if (!film) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id «${params.id}» does not exist`,
        'FilmController'
      );
    }

    await this.filmService.deleteById(`${params.filmId}`);
    this.noContent(res, {
      message: 'Film is deleted'
    });
  }

  async getPromo(_: Request, res: Response): Promise<void> {
    const result = await this.filmService.findPromo();
    this.ok(res, fillDTO(FilmResponse, result));
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary, object, object>,
    res: Response
  ): Promise<void> {
    const {filmId} = params;

    const comments = await this.commentService.findByFilmId(filmId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
