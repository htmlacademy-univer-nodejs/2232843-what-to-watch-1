import typegoose, {
  defaultClasses,
  Ref,
  getModelForClass,
} from '@typegoose/typegoose';

import { Genre } from '../../types/film-genre.enum.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface FilmEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'films',
  },
})
export class FilmEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: 1, maxlength: 100 })
  public name!: string;

  @prop({ required: true, minlength: 1, maxlength: 1024 })
  public description!: string;

  @prop({ required: true })
  public publicationDate!: Date;

  @prop({ type: () => String, required: true })
  public genre!: Genre[];

  @prop({ required: true })
  public releaseYear!: number;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true })
  public preview!: string;

  @prop({ required: true })
  public video!: string;

  @prop({ required: true })
  public actors!: string[];

  @prop({ required: true })
  public producers!: string[];

  @prop({ required: true })
  public duration!: number;

  @prop({ default: 0 })
  public commentsCount!: number;

  @prop({ required: true, ref: UserEntity })
  public userId!: Ref<UserEntity>;

  @prop({ required: true, match: /(\S+(\.png)$)/ })
  public poster!: string;

  @prop({ required: true, match: /(\S+(\.png)$)/ })
  public backgroundImage!: string;

  @prop({ required: true })
  public backgroundColor!: string;
}

export const FilmModel = getModelForClass(FilmEntity);
