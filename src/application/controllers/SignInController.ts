import type { Controller } from '../shared/http/interfaces/Controller';
import type { HttpRequest, HttpResponse } from '../shared/http/interfaces/http';
import type { SignInUseCase } from '../useCases/SignInUseCase';
import { signInDtoSchema } from '../shared/http/dtos/SignInDto';

export class SignInController implements Controller {
  constructor(private readonly useCase: SignInUseCase) {}
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { body } = request;
    const parsedBody = signInDtoSchema.parse(body);

    const response = await this.useCase.execute(parsedBody);

    return {
      statusCode: 200,
      body: response,
    };
  }

}