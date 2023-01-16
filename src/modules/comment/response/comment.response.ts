import {Expose, Type} from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class CommentResponse {
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose({ name: 'createdAt'})
  public postDate!: string;

  @Expose()
  public rating!: number;

  @Expose({name: 'user'})
  @Type(() => UserResponse)
  public user!: UserResponse;
}
