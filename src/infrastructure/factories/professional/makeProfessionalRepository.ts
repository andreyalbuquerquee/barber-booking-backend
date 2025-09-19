import type { ProfessionalRepository } from '../../../domain/repositories/ProfessionalRepository';
import { makeDb } from '../../database/drizzle/connection';
import { ProfessionalDrizzleRepository } from '../../database/drizzle/repositories/ProfessionalDrizzleRepository';

export function makeProfessionalRepository(): ProfessionalRepository {
  return new ProfessionalDrizzleRepository(makeDb());
}