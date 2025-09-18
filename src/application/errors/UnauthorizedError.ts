import { ApplicationError } from './ApplicationError';

export class UnauthorizedError extends ApplicationError {
  constructor(message = 'Unauthorized', details?: unknown) {
    super(message, 'UNAUTHORIZED', details);
    this.name = 'UnauthorizedError';
  }
}
