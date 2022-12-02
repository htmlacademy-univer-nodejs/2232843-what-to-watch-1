import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';
import {types} from '@typegoose/typegoose';
import {CommentServiceInterface} from './comment-service.interface.js';
import {CommentEntity} from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {FilmServiceInterface} from '../film/film-service.interface.js';
import {SortType} from '../../types/sort-type.enum.js';

const DEFAULT_COMMENT_COUNT = 50;

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    this.logger.info(`New comment created by: ${dto.userId}`);
    await this.filmService.updateCommentsCount(dto.filmId);
    await this.filmService.updateRating(dto.filmId, dto.rating);

    return comment.populate('userId');
  }

  public async findByFilmId(filmId: string, limit?: number): Promise<DocumentType<CommentEntity>[] | null> {
    const commentLimit = limit ?? DEFAULT_COMMENT_COUNT;
    return this.commentModel.find({filmId: filmId}).sort({publicationDate: SortType.Down}).limit(commentLimit).populate('userId');
  }

  public async deleteAllByFilmId(filmId: string): Promise<number | null> {
    const result = await this.commentModel.deleteMany({filmId: filmId}).exec();
    return result.deletedCount;
  }
}
