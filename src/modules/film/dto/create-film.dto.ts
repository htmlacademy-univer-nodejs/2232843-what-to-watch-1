import { Genre } from '../../../types/film-genre.enum.js';

export class CreateFilmDto {
  name!: string;
  description!: string;
  publicationDate!: Date;
  genre!: Genre[];
  releaseYear!: number;
  rating!: number;
  preview!: string;
  video!: string;
  actors!: string[];
  producers!: string[];
  duration!: number;
  commentsCount!: number;
  userId!: string;
  poster!: string;
  backgroundImage!: string;
  backgroundColor!: string;
}
