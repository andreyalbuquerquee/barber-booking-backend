export type AppErrorCode =
  | 'UNAUTHORIZED'
  | 'INTERNAL';

export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: AppErrorCode = 'INTERNAL',
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}