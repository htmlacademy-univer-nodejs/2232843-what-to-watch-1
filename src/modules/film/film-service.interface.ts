import {DocumentType} from '@typegoose/typegoose';
import {CreateFilmDto} from './dto/create-film.dto.js';
import {FilmEntity} from './film.entity.js';
import {Genre} from '../../types/film-genre.enum.js';
import UpdateFilmDto from './dto/update-film.dto.js';

export interface FilmServiceInterface {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  findById(movieId: string): Promise<DocumentType<FilmEntity> | null>;
  find(limit?: number): Promise<DocumentType<FilmEntity>[]>;
  updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null>;
  deleteById(filmId: string): Promise<void | null>;
  findByGenre(genre: Genre, limit?: number): Promise<DocumentType<FilmEntity>[]>;
  findPromo(): Promise<DocumentType<FilmEntity> | null>;
  updateCommentsCount(filmId: string): Promise<void | null>;
  updateRating(filmId: string, rate: number): Promise<void | null>;
}
