import { ErrorMiddleware } from '../../../application/shared/http/interfaces/ErrorMiddleware';
import type { NextFunction, Request, Response } from 'express';

export function errorMiddlewareAdapter(middleware: ErrorMiddleware) {
  return (error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    const result = middleware.handle(error);

    if ('statusCode' in result) {
      return response.status(result.statusCode).json(result.body);
    }
  };
}
