import {User} from './user.type.js';

export type Comment = {
  text: string;
  rating: number;
  publicationDate: Date;
  author: User;
}
