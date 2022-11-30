import {FilmGeneratorInterface} from './film-generator.interface.js';
import {MockData} from '../../types/mock-data.type.js';
import dayjs from 'dayjs';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../utils/random.js';
import {Genre} from '../../types/film-genre.enum.js';

const MAX_RELEASE_YEAR = 2022;
const MIN_RELEASE_YEAR = 1905;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;
const MIN_RATING = 0;
const MAX_RATING = 10;
const NUM_AFTER_DIGIT = 1;
const MIN_DURATION = 10;
const MAX_DURATION = 400;
const MIN_COMMENTS = 0;
const MAX_COMMENTS = 999;

export default class MovieGenerator implements FilmGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const genre = getRandomItems<string>(Object.values(Genre)).join(';');
    const releaseYear = generateRandomValue(MIN_RELEASE_YEAR, MAX_RELEASE_YEAR);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, NUM_AFTER_DIGIT);
    const preview = `${name}-preview.mp4`;
    const video = `${name}.mp4`;
    const actors = getRandomItems<string>(this.mockData.actors).join(';');
    const producer = getRandomItems<string>(this.mockData.producers).join(';');
    const duration = generateRandomValue(MIN_DURATION, MAX_DURATION);
    const commentsCount = generateRandomValue(MIN_COMMENTS, MAX_COMMENTS);
    const username = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = `${username}.png`;
    const poster = `${name}-poster.png`;
    const backgroundImage = `${name}-background.png`;
    const backgroundColor = getRandomItem<string>(this.mockData.backgroundColors);

    return [
      name,
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
    ].join('\t');
  }
}
