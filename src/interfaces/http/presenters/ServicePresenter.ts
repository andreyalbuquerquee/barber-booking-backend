import type { Service } from '../../../domain/entities/Service';

export type ServiceDTO = {
  id: string;
  name: string;
  durationMinutes: number;
  priceBrl: number | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export class ServicePresenter {
  static toHTTP(s: Service): ServiceDTO {
    return {
      id: s.id,
      name: s.name,
      durationMinutes: s.durationMinutes,
      priceBrl: s.priceBrl ?? null,
      active: s.active,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    };
  }
  static listToHTTP(items: Service[]) { return items.map(ServicePresenter.toHTTP); }
}
