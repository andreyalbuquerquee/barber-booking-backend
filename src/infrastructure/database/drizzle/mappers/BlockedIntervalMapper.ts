import { BlockedInterval } from '@domain/entities/BlockedInterval';
import type { InferSelectModel } from 'drizzle-orm';
import { blockedIntervals } from '../migrations/schema';

type BlockedIntervalRow = InferSelectModel<typeof blockedIntervals>;

export const BlockedIntervalMapper = {
  toDomain(row: BlockedIntervalRow): BlockedInterval {
    return new BlockedInterval(
      {
        professionalId: row.professionalId,
        startsAt: new Date(row.startsAt),
        endsAt: new Date(row.endsAt),
        createdBy: row.createdBy ?? '',
        reason: row.reason ?? null,
      },
      {
        id: row.id,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }
    );
  },
};
