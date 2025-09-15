import { HttpStatusCode } from '../interfaces/http';
import { type ErrorMessage, HttpError } from './HttpError';

export class UnauthorizedHttpError extends HttpError {
  constructor(message?: ErrorMessage) {
    super(HttpStatusCode.UNAUTHORIZED, message);
  }
}
