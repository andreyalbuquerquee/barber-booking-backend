import type { Appointment } from '@domain/entities/Appointment';

export interface AppointmentRepository {
  findOverlappingLocalMinutes(
    professionalId: string,
    dateISO: string,
    statuses: Array<'pending' | 'confirmed'>
  ): Promise<Appointment[]>;
}