import { HttpResponse } from './http';

export interface Data {
  data: Record<string, any>;
}

export interface ErrorMiddleware {
  handle(error: unknown): HttpResponse | Data;
}
