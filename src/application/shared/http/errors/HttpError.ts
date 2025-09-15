import { HttpStatusCode } from '../interfaces/http';

export type ErrorMessage = string;

export class HttpError extends Error {
  constructor(
    public readonly statusCode: HttpStatusCode,
    message?: ErrorMessage
  ) {
    super(message);

    this.name = 'HttpError';
  }
}
