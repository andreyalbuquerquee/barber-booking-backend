import type { WorkingHours } from '@domain/entities/WorkingHours';


export abstract class WorkingHourRepository {
  abstract findByProfessionalAndWeekday(
    professionalId: string, 
    weekday: number): Promise<WorkingHours | null>;
}