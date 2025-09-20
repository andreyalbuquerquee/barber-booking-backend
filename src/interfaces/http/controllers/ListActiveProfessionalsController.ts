import type {
  ListActiveProfessionalsUseCase
} from '@application/useCases/professionals/ListActiveProfessionalsUseCase';
import { ProfessionalPresenter } from '../presenters/ProfessionalPresenter';
import type { Controller } from '../protocols/Controller';
import { HttpStatusCode, type HttpRequest, type HttpResponse } from '../protocols/http';

export class ListActiveProfessionalsController implements Controller {
  constructor(private readonly useCase: ListActiveProfessionalsUseCase) { }
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { professionals } = await this.useCase.execute();
  
    return {
      statusCode: HttpStatusCode.OK,
      body: {
        professionals: professionals.map(ProfessionalPresenter.toHTTP),
      },
    };
  }

}