import { ListServicesQuerySchema } from '../dtos/ListServicesDto';
import type { ListServicesUseCase } from '../../../application/useCases/ListServicesUseCase';
import type { Controller } from '../protocols/Controller';
import type { HttpRequest, HttpResponse } from '../protocols/http';
import { ServicePresenter } from '../presenters/ServicePresenter';


export class ListServicesController implements Controller {
  constructor(private readonly useCase: ListServicesUseCase) {}
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { page, perPage, active } = ListServicesQuerySchema.parse(request.query);

    const { services, totalServices } = await this.useCase.execute({
      page,
      perPage,
      active,
    });

    return {
      statusCode: 200,
      body: {
        services: ServicePresenter.listToHTTP(services),
        total: totalServices,
      },
    };
  }

}