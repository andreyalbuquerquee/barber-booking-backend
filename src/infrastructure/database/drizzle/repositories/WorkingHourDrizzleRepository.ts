import type { WorkingHourRepository } from '@application/ports/repositories/WorkingHourRepository';
import type { WorkingHours } from '@domain/entities/WorkingHours';
import type { DB } from '../connection';
import { workingHours } from '../migrations/schema';
import { eq, and } from 'drizzle-orm';
import { WorkingHourMapper } from '../mappers/WorkingHourMapper';

export class WorkingHourDrizzleRepository implements WorkingHourRepository {
  constructor(private readonly db: DB) { }
  
  async findByProfessionalAndWeekday(
    professionalId: string, 
    weekday: number
  ): Promise<WorkingHours | null> {
    const [ workingHour ] = await this.db
      .select()
      .from(workingHours)
      .where(
      and(
        eq(workingHours.professionalId, professionalId),
        eq(workingHours.weekday, weekday)
      ));
     
    return workingHour ? WorkingHourMapper.toDomain(workingHour) : null;
  }

}