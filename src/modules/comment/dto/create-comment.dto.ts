import {IsInt, IsMongoId, Length, Min, Max} from 'class-validator';

export default class CreateCommentDto {
  @Length(5, 1024, {message: 'Длина текста должна быть от 5 до 1024 символов'})
  public text!: string;

  @IsInt({message: 'Рейтинг должен быть целым числом'})
  @Min(1, {message: 'Минимальное значение 1'})
  @Max(10, {message: 'Максимальное значение 10'})
  public rating!: number;

  public publicationDate!: Date;

  public userId!: string;

  @IsMongoId({message: 'filmId field must be valid'})
  public filmId!: string;

  deleted?: boolean;
}
