import type { AppointmentRepository } from '@application/ports/repositories/AppointmentRepository';
import type { Appointment } from '@domain/entities/Appointment';
import type { DB } from '../connection';
import { appointments } from '../migrations/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { AppointmentMapper } from '../mappers/AppointmentMapper';

export class AppointmentDrizzleRepository implements AppointmentRepository {
  constructor(private readonly db: DB) {}

  async findOverlappingLocalMinutes(
    professionalId: string,
    dateISO: string,
    statuses: Array<'pending' | 'confirmed'>
  ): Promise<Appointment[]> {
    const dayStartLocal = sql`(${dateISO}::date)::timestamp`;
    const dayEndLocal   = sql`((${dateISO}::date + INTERVAL '1 day')::timestamp)`; 


    const startsLocal = sql`(${appointments.startsAt} AT TIME ZONE 'America/Recife')`;
    const endsLocal   = sql`(${appointments.endsAt}   AT TIME ZONE 'America/Recife')`;

    const overlapPredicate = and(
      sql`${startsLocal} < ${dayEndLocal}`,
      sql`${endsLocal}   > ${dayStartLocal}`
    );

    const rows = await this.db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.professionalId, professionalId),
          inArray(appointments.status, statuses as any),
          overlapPredicate
        )
      );

    return rows.map(AppointmentMapper.toDomain);
  }
}
