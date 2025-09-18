import type { services } from '../../../../../drizzle/schema';
import { Service } from '../../../../domain/entities/Service';

export type ServiceRowSelect = typeof services.$inferSelect;

export const ServiceMapper = {
  toDomain(row: ServiceRowSelect) {
    return new Service({
      name: row.name,
      priceBrl: row.priceBrl ? Number(row.priceBrl) : null,
      durationMinutes: row.durationMinutes,
      active: row.active,
    }, { 
      id: row.id, 
      createdAt: new Date(row.createdAt), 
      updatedAt: new Date(row.updatedAt),
    });
  }
}