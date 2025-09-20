import type { 
  ProfessionalRepository 
} from '@application/ports/repositories/ProfessionalRepository';
import { makeDb } from '@infrastructure/database/drizzle/connection';
import { 
  ProfessionalDrizzleRepository 
} from '@infrastructure/database/drizzle/repositories/ProfessionalDrizzleRepository';

export function makeProfessionalRepository(): ProfessionalRepository {
  return new ProfessionalDrizzleRepository(makeDb());
}