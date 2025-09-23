import { eq } from 'drizzle-orm';
import { professionals } from '../migrations/schema';
import { Professional } from '@domain/entities/Professional';
import type {
  ProfessionalRepository
} from '@application/ports/repositories/ProfessionalRepository';
import type { DB } from '../connection';
import { ProfessionalMapper } from '../mappers/ProfessionalMapper';

export class ProfessionalDrizzleRepository implements ProfessionalRepository {
  constructor(private readonly db: DB) { }
  
  async findById(id: string): Promise<Professional | null> {
    const [ professional ] = await this.db
    .select()
    .from(professionals)
    .where(eq(professionals.id, id));

    return professional ? ProfessionalMapper.toDomain(professional) : null;
  }
  
  async listActive(): Promise<Professional[]> {
    const rows = await this.db
      .select()
      .from(professionals)
      .where(eq(professionals.active, true));
  
      return rows.map(ProfessionalMapper.toDomain);
  }

}