import typegoose, {getModelForClass, Ref, defaultClasses} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';
import {FilmEntity} from '../film/film.entity.js';
import {Types} from 'mongoose';

const {prop, modelOptions} = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: 5, maxlength: 1024 })
  public text!: string;

  @prop({ required: true, min: 1, max: 10})
  public rating!: number;

  @prop({
    type: Types.ObjectId,
    ref: UserEntity,
    required: true
  })
  public user!: Ref<UserEntity>;

  @prop({ required: true, ref: FilmEntity })
  public filmId!: Ref<FilmEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
