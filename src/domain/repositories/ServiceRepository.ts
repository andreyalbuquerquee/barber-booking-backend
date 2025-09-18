import type { Service } from '../entities/Service';

export interface ServicesQuery {
  page?: number;
  perPage?: number;
  active?: boolean;
}

export interface Paginated<T> {
  items: T[];
  total: number;
}

export abstract class ServiceRepository {
  abstract list(params: ServicesQuery): Promise<Paginated<Service>>;
}