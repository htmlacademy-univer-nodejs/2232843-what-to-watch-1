import {IsInt, IsMongoId, Length, Min, Max} from 'class-validator';

export default class CreateCommentDto {
  @Length(5, 1024, {message: 'Text length must be between 5 and 1024 symbols'})
  public text!: string;

  @IsInt({message: 'Rating must be an integer'})
  @Min(1, {message: 'Min rating value is 1'})
  @Max(10, {message: 'Max rating value is 10'})
  public rating!: number;


  @IsMongoId({message: 'filmId field must be valid'})
  public filmId!: string;

}
