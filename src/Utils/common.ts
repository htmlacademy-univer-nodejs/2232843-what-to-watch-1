import {Genre} from '../types/film-genre.enum.js';
import {Film} from '../types/film.type.js';

export const createMovie = (row: string): Film => {
  const tokens = row.replace('\n', '').split('\t');
  const [name,
    description,
    publicationDate,
    genre,
    releaseYear,
    rating,
    preview,
    video,
    actors,
    producer,
    duration,
    commentsCount,
    username,
    email,
    avatar,
    password,
    poster,
    backgroundImage,
    backgroundColor
  ] = tokens;

  return {
    name: name,
    description: description,
    publicationDate: new Date(publicationDate),
    genre: genre.split(';').map((g) => {
      if (g in Object.keys(Genre)) {
        return g as Genre;
      } else {
        throw new Error('Такого жанра не существует.');
      }
    }),
    releaseYear: parseInt(releaseYear, 10),
    rating: parseFloat(rating),
    preview: preview,
    video: video,
    actors: actors.split(';'),
    producers: producer.split(';'),
    duration: parseInt(duration, 10),
    commentsCount: parseInt(commentsCount, 10),
    user: {username, email, avatar, password},
    poster: poster,
    backgroundImage: backgroundImage,
    backgroundColor: backgroundColor,
  };
};

export const getErrorMessage = (error: Error | string): string =>
  error instanceof Error ? error.message : '';
