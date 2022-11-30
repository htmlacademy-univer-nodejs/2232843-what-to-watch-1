import { CliCommandInterface } from './cli-command.interface.js';
import TsvFileReader from '../common/file-reader/tsv-file-reader.js';
import {createFilm, getErrorMessage} from '../utils/common.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { FilmServiceInterface } from '../modules/film/film-service.interface.js';
import { UserModel } from '../modules/user/user.entity.js';
import UserService from '../modules/user/user.service.js';
import { FilmService } from '../modules/film/film.service.js';
import { FilmModel } from '../modules/film/film.entity.js';
import DatabaseService from '../common/database-client/database.service.js';
import { Film } from '../types/film.type.js';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import { getURI } from '../utils/db.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import ConfigService from '../common/config/config.service.js';
// import {logger} from '@typegoose/typegoose/lib/logSettings';

const DEFAULT_DB_PORT = 27017;
const DEFAULT_USER_PASSWORD = 'test1234';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private filmService!: FilmServiceInterface;
  private databaseService!: DatabaseInterface;
  private salt!: string;
  private readonly logger: LoggerInterface;
  private readonly config: ConfigInterface;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.config = new ConfigService(this.logger);

    this.filmService = new FilmService(this.logger, FilmModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  private async onLine(line: string, resolve: () => void) {
    const movie = createFilm(line);
    await this.saveFilm(movie);
    resolve();
  }

  private onComplete(count: number) {
    this.logger.info(`${count} строк успешно имортированы.`);
    this.databaseService.disconnect();
  }

  public async execute(filename: string): Promise<void> {
    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      DEFAULT_DB_PORT,
      this.config.get('DB_NAME'),
    );

    this.salt = this.config.get('SALT');
    await this.databaseService.connect(uri);
    const fileReader = new TsvFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      const error = typeof err === 'string' ? err : '';
      this.logger.error(`Не удалось импортировать данные из файла по причине: "${getErrorMessage(error)}"`);
    }
  }

  private async saveFilm(film: Film) {
    const user = await this.userService.findOrCreate({
      ...film.user,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.filmService.create({
      ...film,
      userId: user.id,
    });
  }
}
