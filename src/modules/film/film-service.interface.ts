import {DocumentType} from '@typegoose/typegoose';
import {CreateFilmDto} from './dto/create-film.dto.js';
import {FilmEntity} from './film.entity.js';

export interface FilmServiceInterface {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  findById(movieId: string): Promise<DocumentType<FilmEntity> | null>;
}
