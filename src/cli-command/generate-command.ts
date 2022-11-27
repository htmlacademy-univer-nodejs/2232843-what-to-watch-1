import got from 'got';
import {MockData} from '../types/mock-data.type.js';
import {CliCommandInterface} from './cli-command.interface.js';
import FilmGenerator from '../common/film-generator/film-generator.js';
import TSVFileWriter from '../common/file-writer/tsv-file-writer.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const movieCount = parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return console.log(`Не удалось получить данные с ${url}`);
    }

    const movieGeneratorString = new FilmGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < movieCount; i++) {
      await tsvFileWriter.write(movieGeneratorString.generate());
    }

    console.log(`Файл ${filepath} был успешно создан!`);
  }
}
