import type { Request, Response } from 'express';
import type { Controller } from '../../../../interfaces/http/protocols/Controller';

export function routeAdapter(controller: Controller) {
  return async (request: Request, response: Response) => {
    const { statusCode, body } = await controller.handle({
      body: request.body,
      params: request.params,
      account: request.metadata?.account,
      query: request.query,
      headers: request.headers as Record<string, string>,
    });

    response.status(statusCode).send(body);
  }
}