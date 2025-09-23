import type { Controller } from '../protocols/Controller';
import { HttpStatusCode, type HttpRequest, type HttpResponse } from '../protocols/http';
import { GetDailyAvailabilityQuerySchema } from '../dtos/GetDailyAvailabilityDto';
import type { GetDailyAvailabilityUseCase } from '@application/useCases/availability/GetDailyAvailiabilityUseCase';

export class GetDailyAvailabilityController implements Controller {
  constructor(private readonly useCase: GetDailyAvailabilityUseCase) { }
  
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const query = GetDailyAvailabilityQuerySchema.parse(request.query);

    const { slots } = await this.useCase.execute(query);

    return {
      statusCode: HttpStatusCode.OK,
      body: {
        slots,
      },
    };
  }

}