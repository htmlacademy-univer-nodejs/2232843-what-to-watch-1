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
    isPromo,
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
    producer: producer,
    duration: parseInt(duration, 10),
    commentsCount: parseInt(commentsCount, 10),
    isPromo: JSON.parse(isPromo),
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

export const checkPassword = (password: string): void =>
{
  if (password.length < 6 || password.length > 12) {
    throw new Error('Пароль должен быть от 6 до 12 символов.');
  }
};

export const getErrorMessage = (error: Error | string): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};
