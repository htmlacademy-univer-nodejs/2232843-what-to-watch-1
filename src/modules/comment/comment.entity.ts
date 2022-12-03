import typegoose, {getModelForClass, Ref, defaultClasses} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';
import {FilmEntity} from '../film/film.entity.js';

const {prop, modelOptions} = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: [5, 'Минимальная длина 5 символов'], maxlength: [1024, 'Максимальная длина 1024 символа'] })
  public text!: string;

  @prop({ required: true, min: [1, 'Минимальная оценка 1'], max: [10, 'Максимальная оценка 10']})
  public rating!: number;

  @prop({ required: true, default: new Date() })
  public publicationDate!: Date;

  @prop({ required: true, ref: UserEntity })
  public userId!: Ref<UserEntity>;

  @prop({ required: true, ref: FilmEntity })
  public filmId!: Ref<FilmEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
