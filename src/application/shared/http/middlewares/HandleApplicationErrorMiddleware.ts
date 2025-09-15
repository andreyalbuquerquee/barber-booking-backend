import { ZodError } from 'zod';
import { HttpError } from '../errors/HttpError';
import { ErrorMiddleware } from '../interfaces/ErrorMiddleware';
import { HttpResponse, HttpStatusCode } from '../interfaces/http';

export class HandleApplicationErrorMiddleware implements ErrorMiddleware {
  handle(error: unknown): HttpResponse {
    if (error instanceof ZodError) {
      const zodErrors = JSON.parse(error.message);
      const zodErrorMessages = zodErrors.map((e: any) => {
        const message = e.message;

        if (e.path.length) {
          return message + '. Erro em: ' + e.path;
        } else {
          return message;
        }
      });

      return {
        statusCode: HttpStatusCode.BAD_REQUEST,
        body: {
          messages: zodErrorMessages,
        }
      };
    }

    if (error instanceof HttpError) {
      return {
        statusCode: error.statusCode,
        body: {
          messages: [error.message],
        }
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
