import CreateCommentDto from './dto/create-comment.dto.js';
import {CommentEntity} from './comment.entity.js';
import {DocumentType} from '@typegoose/typegoose';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto, user: string): Promise<DocumentType<CommentEntity>>;
  findByFilmId(movieId: string, limit?: number): Promise<DocumentType<CommentEntity>[] | null>;
  deleteAllByFilmId(movieId: string): Promise<number | null>;
}
