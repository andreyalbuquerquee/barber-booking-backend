import { Appointment } from '@domain/entities/Appointment';
import type { InferSelectModel } from 'drizzle-orm';
import { appointments } from '../migrations/schema';

type AppointmentRow = InferSelectModel<typeof appointments>;

export const AppointmentMapper = {
  toDomain(row: AppointmentRow): Appointment {
    return new Appointment(
      {
        professionalId: row.professionalId,
        serviceId: row.serviceId,
        customerName: row.customerName,
        customerPhone: row.customerPhone,
        customerEmail: row.customerEmail ?? null,
        notes: row.notes ?? null,
        status: row.status,
        startsAt: new Date(row.startsAt),
        endsAt: new Date(row.endsAt),
        source: row.source,
        createdBy: row.createdBy ?? null,
        updatedBy: row.updatedBy ?? null,
      },
      {
        id: row.id,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }
    );
  },
};
