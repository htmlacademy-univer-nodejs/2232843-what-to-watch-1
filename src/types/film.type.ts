import {User} from './user.type';
import {Genre} from './film-genre.enum';

export type Film = {
  name: string;
  description: string;
  publicationDate: Date;
  genre: Genre[];
  releaseYear: number;
  rating: number;
  preview: string;
  video: string;
  actors: string[];
  producer: string;
  duration: number;
  isPromo: boolean;
  commentsCount: number;
  user: User;
  poster: string;
  backgroundImage: string;
  backgroundColor: string;
}
