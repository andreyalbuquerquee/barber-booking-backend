import { ApplicationError } from '../../application/errors/ApplicationError';
import { HttpStatusCode } from './protocols/http';


export function errorToHttpStatus(err: unknown): HttpStatusCode {
  if (err instanceof ApplicationError) {
    switch (err.code) {
      case 'UNAUTHORIZED': return HttpStatusCode.UNAUTHORIZED;
      default: return HttpStatusCode.INTERNAL_SERVER_ERROR;
    }
  }
  return HttpStatusCode.INTERNAL_SERVER_ERROR;
}

export function serializeError(err: unknown) {
  if (err instanceof ApplicationError) {
    return { message: err.message, code: err.code, details: err.details ?? undefined };
  }
  return { message: 'Internal server error', code: 'INTERNAL' as const };
}
