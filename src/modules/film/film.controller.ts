import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
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

@injectable()
export class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.FilmServiceInterface)
    private readonly filmService: FilmServiceInterface
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
    });

    this.addRoute<FilmRoute>({
      path: FilmRoute.FILM,
      method: HttpMethod.Get,
      handler: this.getFilm,
    });

    this.addRoute<FilmRoute>({
      path: FilmRoute.FILM,
      method: HttpMethod.Patch,
      handler: this.updateFilm,
    });

    this.addRoute<FilmRoute>({
      path: FilmRoute.FILM,
      method: HttpMethod.Delete,
      handler: this.deleteFilm,
    });

    this.addRoute<FilmRoute>({
      path: FilmRoute.PROMO,
      method: HttpMethod.Get,
      handler: this.getPromo,
    });
  }

  async index(_req: Request, res: Response): Promise<void> {
    const films = await this.filmService.find();
    const filmsResponse = fillDTO(FilmResponse, films);
    this.ok(res, filmsResponse);
  }

  async create(
    {
      body,
    }: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response
  ): Promise<void> {
    const result = await this.filmService.create(body);
    this.created(res, fillDTO(FilmResponse, result));
  }

  async getFilm(
    { params }: Request<Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const result = await this.filmService.findById(`${params.filmId}`);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  async updateFilm(
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
        `Фильм с «${params.id}» не найден`,
        'FilmController'
      );
    }

    const result = await this.filmService.updateById(params.filmId, body);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  async deleteFilm(
    { params }: Request<Record<string, string>>,
    res: Response
  ): Promise<void> {
    const film = await this.filmService.findById(`${params.id}`);

    if (!film) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Фильм с id «${params.id}» не существует`,
        'FilmController'
      );
    }

    await this.filmService.deleteById(`${params.filmId}`);
    this.noContent(res, {
      message: 'Фильм удален'
    });
  }

  async getPromo(_: Request, res: Response): Promise<void> {
    const result = await this.filmService.findPromo();
    this.ok(res, fillDTO(FilmResponse, result));
  }
}
