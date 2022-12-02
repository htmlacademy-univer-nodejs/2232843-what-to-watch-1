import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { FilmServiceInterface } from './film-service.interface.js';
import { CreateFilmDto } from './dto/create-film.dto.js';
import { FilmEntity } from './film.entity.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Genre } from '../../types/film-genre.enum.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';
import { SortType } from '../../types/sort-type.enum.js';

const DEFAULT_FILM_COUNT = 60;

@injectable()
export class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.FilmModel)
    private readonly filmModel: types.ModelType<FilmEntity>
  ) {}

  async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const film = await this.filmModel.create(dto);
    this.logger.info(`Создан новый фильм: ${dto.name}`);

    return film;
  }

  async findById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findById(filmId).exec();
  }

  public async deleteById(filmId: string): Promise<void | null> {
    return this.filmModel.findByIdAndDelete(filmId);
  }

  public async find(limit?: number): Promise<DocumentType<FilmEntity>[]> {
    const filmLimit = limit ?? DEFAULT_FILM_COUNT;
    return this.filmModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: 'filmId',
          foreignField: 'filmId',
          pipeline: [
            {$project: {_id: 1, rating: 1}}
          ],
          as: 'comments'
        },
      },
      {
        $addFields: {
          id: {$toString: '$_id'},
          commentsCount: {$size: '$comments'},
          rating: {$avg: '$comments.rating'},
        }
      },
      {$unset: 'comments'},
      {$limit: filmLimit},
      {$sort: {publicationDate: SortType.Down}}
    ]);
  }

  public async findByGenre(genre: Genre, limit?: number): Promise<DocumentType<FilmEntity>[]> {
    const filmLimit = limit ?? DEFAULT_FILM_COUNT;
    return this.filmModel.find({genre: genre}).sort({publicationDate: SortType.Down}).limit(filmLimit).populate('userId').exec();
  }

  public async findPromo(): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOne({isPromo: true}).populate('userId');
  }

  public async updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findByIdAndUpdate(filmId, dto, {new: true}).populate('userId');
  }

  public async updateCommentsCount(filmId: string): Promise<void | null> {
    return this.filmModel.findByIdAndUpdate(filmId, {$inc: {commentsCount: 1}, new: true});
  }

  public async updateRating(filmId: string, rate: number): Promise<void | null> {
    const prevValues = await this.filmModel.findById(filmId).select('rating commentsCount');
    const prevRating = prevValues?.['rating'] ?? 0;
    const prevCommentsCount = prevValues?.['commentsCount'] ?? 0;
    return this.filmModel.findByIdAndUpdate(filmId, {rating: (prevRating * prevCommentsCount + rate) / (prevCommentsCount + 1), new: true});
  }
}
