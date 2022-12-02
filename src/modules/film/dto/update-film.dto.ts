import {Genre} from '../../../types/film-genre.enum.js';

export default class UpdateFilmDto {
  public name?: string;
  public description?: string;
  public genre?: Genre[];
  public releaseYear?: number;
  public preview?: string;
  public video?: string;
  public actors?: string[];
  public producer?: string;
  public duration?: number;
  public poster?: string;
  public backgroundImage?: string;
  public backgroundColor?: string;
}
