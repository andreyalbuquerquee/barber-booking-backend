import type { Service } from '../../domain/entities/Service';
import type { ServiceRepository } from '../../domain/repositories/ServiceRepository';

interface Input {
  page?: number;
  perPage?: number;
  active?: boolean;
}

interface Output {
  services: Service[];
  totalServices: number;
}

export class ListServicesUseCase {
  constructor(private readonly repository: ServiceRepository) { }
  
  async execute({ page, perPage, active }: Input): Promise<Output> {
    const { items: services, total: totalServices } = await this.repository.list({ 
      page, 
      perPage,
      active,
    });

    return {
      services,
      totalServices,
    };
  }
}