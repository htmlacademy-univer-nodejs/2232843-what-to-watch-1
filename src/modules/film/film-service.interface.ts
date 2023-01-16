import {DocumentType} from '@typegoose/typegoose';
import {CreateFilmDto} from './dto/create-film.dto.js';
import {FilmEntity} from './film.entity.js';
import {Genre} from '../../types/film-genre.enum.js';
import {UpdateFilmDto} from './dto/update-film.dto.js';
import {DocumentExistsInterface} from '../../types/document-exists.interface.js';


export interface FilmServiceInterface extends DocumentExistsInterface{
  create(dto: CreateFilmDto, userId: string): Promise<DocumentType<FilmEntity>>;
  findById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  find(limit?: number): Promise<DocumentType<FilmEntity>[]>;
  updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null>;
  deleteById(filmId: string): Promise<void | null>;
  findByGenre(genre: Genre, limit?: number): Promise<DocumentType<FilmEntity>[]>;
  findPromo(): Promise<DocumentType<FilmEntity> | null>;
  updateRating(filmId: string, rating: number): Promise<DocumentType<FilmEntity> | null>;
  exists(filmId: string): Promise<boolean>;
  updateCommentsCount(filmId: string) : Promise<void | null>;
}
