import type { ServiceRepository } from '../../../domain/repositories/ServiceRepository';
import { makeDb } from '../../../infrastructure/database/drizzle/connection';
import { ServiceDrizzleRepository } from '../../../infrastructure/database/drizzle/repositories/ServiceDrizzleRepository';

export function makeServiceRepository(): ServiceRepository {
  return new ServiceDrizzleRepository(makeDb());
}