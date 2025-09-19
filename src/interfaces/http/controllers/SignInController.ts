import { signInDtoSchema } from '../dtos/SignInDto';
import type { SignInUseCase } from '../../../application/useCases/SignInUseCase';
import type { Controller } from '../protocols/Controller';
import { HttpStatusCode, type HttpRequest, type HttpResponse } from '../protocols/http';

export class SignInController implements Controller {
  constructor(private readonly useCase: SignInUseCase) {}
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { body } = request;
    const parsedBody = signInDtoSchema.parse(body);

    const response = await this.useCase.execute(parsedBody);

    return {
      statusCode: HttpStatusCode.OK,
      body: response,
    };
  }

}