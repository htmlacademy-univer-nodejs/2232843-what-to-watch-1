import { CliCommandInterface } from './cli-command.interface.js';
import TsvFileReader from '../common/file-reader/tsv-file-reader.js';
import {createMovie, getErrorMessage} from '../utils/common.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private onLine(line: string) {
    const offer = createMovie(line);
    console.log(offer);
  }

  private onComplete(count: number) {
    console.log(`${count} строк успешно имортированы.`);
  }

  public async execute(filename: string): Promise<void> {
    const fileReader = new TsvFileReader(filename.trim());
    fileReader.on('rowCompleted', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      const error = typeof err === 'string' ? err : '';
      console.log(`Не удалось импортировать данные из файла по причине: "${getErrorMessage(error)}"`);
    }
  }
}
