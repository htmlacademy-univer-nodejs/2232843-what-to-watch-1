import { Expose, Type } from 'class-transformer';
import { Genre } from '../../../types/film-genre.enum.js';
import UserResponse from '../../user/response/user.response.js';

export class FilmResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public description!: string;

  @Expose()
  public publicationDate!: number;

  @Expose()
  public genre!: Genre;

  @Expose()
  public releaseYear!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public preview!: string;

  @Expose()
  public film!: string;

  @Expose()
  public actors!: string[];

  @Expose()
  public producer!: string;

  @Expose()
  public duration!: number;

  @Expose()
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public poster!: string;

  @Expose()
  public backgroundImage!: string;

  @Expose()
  public backgroundColor!: string;
}
