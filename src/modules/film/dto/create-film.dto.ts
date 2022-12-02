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
  producer!: string;
  duration!: number;
  userId!: string;
  poster!: string;
  public isPromo!: boolean;
  backgroundImage!: string;
  backgroundColor!: string;
}
