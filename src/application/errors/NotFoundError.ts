import { ApplicationError } from './ApplicationError';

export class NotFoundError extends ApplicationError {
  constructor(message = 'Not Found', details?: unknown) {
    super(message, 'NOTFOUND', details);
    this.name = 'NotFoundError';
  }
}
