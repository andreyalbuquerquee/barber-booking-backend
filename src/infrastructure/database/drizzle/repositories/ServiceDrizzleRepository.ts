import { services } from '../migrations/schema';
import { and, eq, count, type SQL } from 'drizzle-orm';
import type { Service } from '@domain/entities/Service';
import type { 
  Paginated, 
  ServiceRepository, 
  ServicesQuery } from '@application/ports/repositories/ServiceRepository';
import type { DB } from '../connection';
import { ServiceMapper } from '../mappers/ServiceMapper';

export class ServiceDrizzleRepository implements ServiceRepository {
  constructor(private readonly db: DB) { }
  async findById(id: string): Promise<Service | null> {
    const [ service ] = await this.db
      .select()
      .from(services)
      .where(eq(services.id, id));

      return service ? ServiceMapper.toDomain(service) : null;
  }

  async list({ page = 1, perPage = 5, active = undefined }: ServicesQuery): Promise<Paginated<Service>> {
    const offset = (page - 1) * perPage;

    const [{ total }] = await this.db
      .select({ total: count() })
      .from(services)
      .where(
        typeof active === 'boolean' ? and(eq(services.active, active)) : undefined
      );

      const rows = await this.db
        .select()
        .from(services)
        .where(
          typeof active === 'boolean' ? and(eq(services.active, active)) : undefined
        )
        .orderBy(services.name)
        .limit(perPage)
        .offset(offset);
        
      return {
        total,
        items: rows.map(ServiceMapper.toDomain),
      };
  }

}