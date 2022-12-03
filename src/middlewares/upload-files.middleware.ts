import {NextFunction, Request, Response} from 'express';
import mime from 'mime';
import multer, {diskStorage} from 'multer';
import {nanoid} from 'nanoid';
import {MiddlewareInterface} from '../types/middleware.interface.js';

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(private uploadDirectory: string,
    private fieldName: string) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const extension = mime.getExtension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${extension}`);
      }
    });

    const uploadSingleFileMiddleware = multer({storage})
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
