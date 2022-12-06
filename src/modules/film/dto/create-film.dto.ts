import { Genre } from '../../../types/film-genre.enum.js';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsString,
  IsMongoId,
  MaxLength,
  MinLength,
  Contains,
  IsEnum,
  Min,
  Max
} from 'class-validator';

export class CreateFilmDto {
  @MinLength(2, {message: 'Minimum name length must be 2'})
  @MaxLength(100, {message: 'Maximum name length must be 100'})
  public name!: string;

  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description!: string;

  @IsDateString({}, {message: 'Publication date must be in ISO form'})
  public publicationDate!: Date;

  @IsEnum(Genre, {message: 'Genre must be one of: \'comedy\', \'crime\', \'documentary\', ' +
      '\'drama\', \'horror\', \'family\', \'romance\', \'scifi\', \'thriller\''})
  public genre!: string;

  @IsInt({message: 'Release year must be an integer'})
  @Min(1895, {message: 'Minimum release year 1905'})
  @Max(2022, {message: 'Maximum release year 2022'})
  public releaseYear!: number;

  @IsNumber({},{message: 'Rating must be a number'})
  @Min(1, {message: 'Minimum rating 1'})
  @Max(10, {message: 'Maximum rating 10'})
  public rating!: number;

  @IsString({message: 'Preview must be a string'})
  public preview!: string;

  @IsString({message: 'Video must be a string'})
  public video!: string;

  @IsArray({message: 'Field actors must be an array'})
  @IsString({each: true, message: 'Actors field must be an array of string'})
  public actors!: string[];

  @IsString({message: 'Producer name must be a string'})
  @MinLength(2, {message: 'Minimum producer name length must be 2'})
  @MaxLength(50, {message: 'Maximum producer name length must be 50'})
  public producer!: string;

  @IsInt({message: 'Duration must be an integer'})
  public duration!: number;

  public userId!: string;

  @Contains('.jpg',{message: 'Poster should have .jpg extension'})
  public poster!: string;

  @Contains('.jpg',{message: 'BackgroundImage should have .jpg extension'})
  public backgroundImage!: string;

  @IsString({message: 'Background color must be a string'})
  public backgroundColor!: string;
}
