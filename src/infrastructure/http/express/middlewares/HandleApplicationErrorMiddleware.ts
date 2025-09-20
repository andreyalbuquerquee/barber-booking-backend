import { ZodError } from 'zod';
import { ErrorMiddleware } from '../../../../interfaces/http/protocols/ErrorMiddleware';
import { HttpResponse, HttpStatusCode } from '../../../../interfaces/http/protocols/http';
import { ApplicationError } from '@application/errors/ApplicationError';
import { errorToHttpStatus, serializeError } from '../../../../interfaces/http/errorMapper';

export class HandleApplicationErrorMiddleware implements ErrorMiddleware {
  handle(error: unknown): HttpResponse {
    if (error instanceof ZodError) {
      

      return {
        statusCode: HttpStatusCode.BAD_REQUEST,
        body: {
          message: 'VALIDATION FAILED',
          code: 'VALIDATION',
          issues: error.issues.map(e => ({ path: e.path.join('.'), message: e.message })),
        }
      };
    }

    if (error instanceof ApplicationError) {
      return {
        statusCode: errorToHttpStatus(error),
        body: serializeError(error),
      };
    }

    if (error instanceof Error) {
      return {
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        body: {
          messages: ['Internal Server Error.'],
        }
      };
    }

    return {
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      body: {
        messages: ['Internal Server Error.']
      }
    };
  }
}
