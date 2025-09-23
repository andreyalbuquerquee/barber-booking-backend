import { WorkingHours } from '@domain/entities/WorkingHours';
import type { workingHours } from '../migrations/schema';

export type WorkingHourRowSelect = typeof workingHours.$inferSelect;

export const WorkingHourMapper = {
  toDomain(row: WorkingHourRowSelect): WorkingHours {
    return new WorkingHours({
      professionalId: row.professionalId,
      startTime: row.startTime,
      endTime: row.endTime,
      weekday: row.weekday,
      slotStepMin: row.slotStepMin
    }, {
      id: row.id,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }
}