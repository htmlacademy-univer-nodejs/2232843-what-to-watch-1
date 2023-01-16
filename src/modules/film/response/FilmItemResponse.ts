import {Expose, Type} from 'class-transformer';
import {Genre} from '../../../types/film-genre.enum.js';
import UserResponse from '../../user/response/user.response.js';

export class FilmItemResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public publicationDate!: number;

  @Expose()
  public genre!: Genre;

  @Expose()
  public preview!: string;

  @Expose()
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public poster!: string;

  @Expose()
  public commentsCount!: number;
}
