export class HttpError extends Error {
  httpStatusCode!: number;
  detail?: string;

  constructor(httpStatusCode: number, message: string, detail?: string) {
    super(message);

    this.httpStatusCode = httpStatusCode;
    this.message = message;
    this.detail = detail;
  }
}
