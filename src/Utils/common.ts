import crypto from 'crypto';
import {Genre} from '../types/film-genre.enum.js';
import {Film} from '../types/film.type.js';

export const createFilm = (row: string): Film => {
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
    poster,
    backgroundImage,
    backgroundColor
  ] = tokens;

  return {
    name: name,
    description: description,
    publicationDate: new Date(publicationDate),
    genre: genre.split(';').map((g) => {
      if (isValidGenre(g)) {
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
    user: {username, email, avatar},
    poster: poster,
    backgroundImage: backgroundImage,
    backgroundColor: backgroundColor,
  };
};

function isValidGenre(genre: string): boolean {
  const options: string[] = Object.values(Genre);
  return options.includes(genre);
}

export const getErrorMessage = (error: Error | string): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};
