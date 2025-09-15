import type { HttpResponse, HttpRequest } from './http';

export interface Data {
  data: Record<string, any>;
}

export interface IMiddleware {
  handle(request: HttpRequest): Promise<HttpResponse | Data>;
}